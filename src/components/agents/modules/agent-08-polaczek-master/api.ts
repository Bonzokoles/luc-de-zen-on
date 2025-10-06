// Agent-08-Polaczek-Master Orchestrator
import type { APIRoute } from "astro";
import {
  POLACZEK_CONFIG,
  type AgentType,
  type OrchestrationRequest,
  type OrchestrationResult,
} from "./config";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const req: OrchestrationRequest = await request.json();

    // Get runtime environment (Cloudflare Pages)
    const runtime = (locals as any)?.runtime;
    const env = runtime?.env;

    if (!env?.DEEPSEEK_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "DeepSeek API key not configured",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Initialize orchestrator
    const orchestrator = new PolaczekOrchestrator(env);

    // Execute orchestration
    const result = await orchestrator.orchestrate(req);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Polaczek orchestration error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const runtime = (locals as any)?.runtime;
    const env = runtime?.env;

    const orchestrator = new PolaczekOrchestrator(env);
    const action = url.searchParams.get("action");

    switch (action) {
      case "status":
        return new Response(
          JSON.stringify(await orchestrator.getSystemStatus()),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

      case "agents":
        return new Response(JSON.stringify(await orchestrator.listAgents()), {
          headers: { "Content-Type": "application/json" },
        });

      default:
        return new Response(
          JSON.stringify({
            service: "Polaczek Master Orchestrator",
            version: "1.0.0",
            agents: Object.keys(POLACZEK_CONFIG.agents),
            status: "operational",
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// Main orchestrator class
class PolaczekOrchestrator {
  private env: any;
  private agents: Map<AgentType, any> = new Map();

  constructor(env: any) {
    this.env = env;
    this.initializeAgents();
  }

  private initializeAgents() {
    // Import and initialize all agent modules
    for (const [agentId, config] of Object.entries(POLACZEK_CONFIG.agents)) {
      this.agents.set(agentId as AgentType, {
        ...config,
        status: "active",
        lastUsed: new Date(),
        performance: {
          successRate: 100,
          avgResponseTime: 1000,
          totalTasks: 0,
        },
      });
    }
  }

  async orchestrate(
    request: OrchestrationRequest
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();

    try {
      // Determine best agent for the task
      const selectedAgent = this.selectAgent(request);

      // Execute task with selected agent
      const result = await this.executeTask(selectedAgent, request);

      // Update agent performance metrics
      this.updateAgentMetrics(selectedAgent, true, Date.now() - startTime);

      return {
        success: true,
        result,
        agent: selectedAgent,
        executionTime: Date.now() - startTime,
        metadata: {
          model: POLACZEK_CONFIG.agents[selectedAgent].model,
          capabilities: POLACZEK_CONFIG.agents[selectedAgent].capabilities,
        },
      };
    } catch (error) {
      const selectedAgent = this.selectAgent(request);
      this.updateAgentMetrics(selectedAgent, false, Date.now() - startTime);

      return {
        success: false,
        agent: selectedAgent,
        executionTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private selectAgent(request: OrchestrationRequest): AgentType {
    // If specific agent requested, use it
    if (request.preferredAgent && this.agents.has(request.preferredAgent)) {
      return request.preferredAgent;
    }

    // Smart agent selection based on task and capabilities
    const task = request.task.toLowerCase();

    if (
      task.includes("tłumacz") ||
      task.includes("translate") ||
      task.includes("polski")
    ) {
      return "POLACZEK_T";
    }

    if (
      task.includes("biblioteka") ||
      task.includes("dokumentacja") ||
      task.includes("wyszukaj")
    ) {
      return "POLACZEK_B";
    }

    if (
      task.includes("zadanie") ||
      task.includes("task") ||
      task.includes("koordynu")
    ) {
      return "POLACZEK_M1";
    }

    if (
      task.includes("interfejs") ||
      task.includes("ui") ||
      task.includes("dashboard")
    ) {
      return "POLACZEK_D1";
    }

    // Default to Director for complex orchestration
    return "POLACZEK_D";
  }

  private async executeTask(
    agentId: AgentType,
    request: OrchestrationRequest
  ): Promise<any> {
    const agent = POLACZEK_CONFIG.agents[agentId];
    const model = agent.model;

    // Prepare prompt in Polish
    const systemPrompt = `Jesteś ${agent.name} - ${agent.description}.
Twoje główne umiejętności: ${agent.capabilities.join(", ")}.
Odpowiadaj zawsze w języku polskim, profesjonalnie i precyzyjnie.`;

    const userPrompt = `${request.task}

Kontekst: ${JSON.stringify(request.context || {})}
Priorytet: ${request.priority}`;

    // Execute based on model type
    if (model === "deepseek-r1") {
      return await this.callDeepSeek(systemPrompt, userPrompt);
    } else if (model.includes("qwen") || model.includes("gemma")) {
      return await this.callLocalModel(model, systemPrompt, userPrompt);
    } else {
      throw new Error(`Unsupported model: ${model}`);
    }
  }

  private async callDeepSeek(
    systemPrompt: string,
    userPrompt: string
  ): Promise<any> {
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-reasoner",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 2000,
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Brak odpowiedzi";
  }

  private async callLocalModel(
    model: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<any> {
    // Placeholder for local Ollama integration
    // TODO: Implement Ollama API calls
    return `[${model}] Przetwarzam: ${userPrompt.substring(0, 100)}...`;
  }

  private updateAgentMetrics(
    agentId: AgentType,
    success: boolean,
    executionTime: number
  ) {
    const agent = this.agents.get(agentId);
    if (agent?.performance) {
      agent.performance.totalTasks++;
      agent.performance.avgResponseTime =
        (agent.performance.avgResponseTime + executionTime) / 2;

      if (success) {
        agent.performance.successRate =
          (agent.performance.successRate * (agent.performance.totalTasks - 1) +
            100) /
          agent.performance.totalTasks;
      } else {
        agent.performance.successRate =
          (agent.performance.successRate * (agent.performance.totalTasks - 1)) /
          agent.performance.totalTasks;
      }

      agent.lastUsed = new Date();
    }
  }

  async getSystemStatus() {
    return {
      status: "operational",
      agents: Array.from(this.agents.entries()).map(([id, agent]) => ({
        id,
        ...agent,
      })),
      models: POLACZEK_CONFIG.models,
      performance: {
        totalAgents: this.agents.size,
        activeAgents: Array.from(this.agents.values()).filter(
          (a) => a.status === "active"
        ).length,
      },
    };
  }

  async listAgents() {
    return Array.from(this.agents.entries()).map(([id, agent]) => ({
      id,
      name: agent.name,
      role: agent.role,
      description: agent.description,
      status: agent.status,
      capabilities: agent.capabilities,
      model: agent.model,
      performance: agent.performance,
    }));
  }
}
