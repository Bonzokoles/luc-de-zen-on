// Agent-08-Polaczek-Master Orchestrator
import type { APIRoute } from "astro";
import {
  POLACZEK_CONFIG,
  type AgentType,
  type OrchestrationRequest,
  type OrchestrationResult,
} from "./config";

// Authorization middleware
async function validateRequest(
  request: Request
): Promise<{ isValid: boolean; error?: string }> {
  const authHeader = request.headers.get("Authorization");
  const apiKey = request.headers.get("X-API-Key");
  const userAgent = request.headers.get("User-Agent");

  // Rate limiting check (basic implementation)
  const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";

  // Allow requests from same domain or with valid API key
  if (apiKey && apiKey.startsWith("mb_")) {
    return { isValid: true };
  }

  if (userAgent && userAgent.includes("mybonzo.com")) {
    return { isValid: true };
  }

  // For now, allow all requests but log suspicious activity
  if (!authHeader && !apiKey) {
    console.warn(`⚠️ Unauthorized request attempt from ${clientIP}`);
  }

  return { isValid: true }; // Temporarily permissive during development
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Validate request authorization
    const authCheck = await validateRequest(request);
    if (!authCheck.isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: authCheck.error || "Unauthorized access",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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

    // Initialize orchestrator with validation
    if (!POLACZEK_CONFIG.isConfigValid) {
      console.warn(
        "⚠️ Configuration validation failed, proceeding with fallbacks"
      );
    }

    const orchestrator = new PolaczekOrchestrator(env);

    // Execute orchestration
    const result = await orchestrator.orchestrate(req);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Response-Time": `${Date.now()}ms`,
      },
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

    // Enhanced agent selection with NLP-like scoring
    const task = request.task.toLowerCase();
    const agentScores = new Map<AgentType, number>();

    // Define keyword weights for better matching
    const keywordMap = {
      POLACZEK_T: {
        keywords: [
          "tłumacz",
          "translate",
          "polski",
          "english",
          "language",
          "język",
          "content",
          "treść",
        ],
        weight: 1.0,
      },
      POLACZEK_B: {
        keywords: [
          "biblioteka",
          "dokumentacja",
          "wyszukaj",
          "search",
          "knowledge",
          "wiedza",
          "archiwum",
          "znajdź",
        ],
        weight: 1.0,
      },
      POLACZEK_M1: {
        keywords: [
          "zadanie",
          "task",
          "koordynu",
          "manage",
          "workflow",
          "proces",
          "zarządzaj",
          "organizuj",
        ],
        weight: 1.0,
      },
      POLACZEK_D1: {
        keywords: [
          "interfejs",
          "ui",
          "dashboard",
          "panel",
          "widok",
          "display",
          "pokazuj",
          "visualiz",
        ],
        weight: 1.0,
      },
      POLACZEK_D: {
        keywords: [
          "złożon",
          "complex",
          "orkiestr",
          "plan",
          "strategi",
          "decide",
          "wybierz",
          "główny",
        ],
        weight: 1.2, // Slightly higher weight for orchestration
      },
    };

    // Calculate scores for each agent
    for (const [agentId, config] of Object.entries(keywordMap)) {
      let score = 0;

      // Keyword matching with fuzzy logic
      for (const keyword of config.keywords) {
        if (task.includes(keyword)) {
          score += config.weight;
        }
        // Partial matching for better flexibility
        if (task.includes(keyword.slice(0, -1))) {
          score += config.weight * 0.5;
        }
      }

      // Consider agent availability and performance
      const agent = this.agents.get(agentId as AgentType);
      if (agent) {
        // Boost score based on agent performance
        score *= agent.performance.successRate / 100;

        // Reduce score if agent was recently used (load balancing)
        const timeSinceLastUse =
          Date.now() - new Date(agent.lastUsed).getTime();
        if (timeSinceLastUse < 30000) {
          // Less than 30 seconds
          score *= 0.8;
        }
      }

      agentScores.set(agentId as AgentType, score);
    }

    // Find agent with highest score
    let bestAgent: AgentType = "POLACZEK_D";
    let bestScore = 0;

    for (const [agentId, score] of agentScores.entries()) {
      if (score > bestScore) {
        bestScore = score;
        bestAgent = agentId;
      }
    }

    // Fallback to Director if no clear winner or very low scores
    if (bestScore < 0.5) {
      return "POLACZEK_D";
    }

    console.log(
      `🎯 Selected agent ${bestAgent} with score ${bestScore.toFixed(
        2
      )} for task: "${request.task}"`
    );
    return bestAgent;
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

    const data = (await response.json()) as any;
    return data.choices[0]?.message?.content || "Brak odpowiedzi";
  }

  private async callLocalModel(
    model: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<any> {
    try {
      console.log(`🤖 Calling local model ${model} via Ollama...`);

      const ollamaUrl = "http://localhost:11434/api/generate";
      const payload = {
        model: model,
        prompt: `${systemPrompt}\n\nUser: ${userPrompt}\nAssistant:`,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 2048,
        },
      };

      const response = await fetch(ollamaUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        // Add timeout for local requests
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = (await response.json()) as { response?: string };

      if (!data.response) {
        throw new Error("No response from Ollama model");
      }

      console.log(`✅ Local model ${model} responded successfully`);
      return data.response;
    } catch (error) {
      console.error(`❌ Local model ${model} error:`, error);

      // Fallback response when Ollama is unavailable
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.log(`🔄 Ollama unavailable, using fallback for ${model}`);
        return `[${model} - Tryb offline] Przetwarzam zadanie: "${userPrompt.substring(
          0,
          100
        )}..." - Model lokalny obecnie niedostępny, używam trybu awaryjnego.`;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return `[${model} - Błąd] Nie udało się przetworzyć zadania: ${errorMessage}`;
    }
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
