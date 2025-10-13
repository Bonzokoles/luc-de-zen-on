import type { Agent, AgentNamespace } from "../agents/agent";

// Extend Env to include agent bindings
interface Env extends Cloudflare.Env {
  MYBONZO_AGENT?: AgentNamespace<any>;
}

// Request body interfaces
interface ChatRequestBody {
  agentId?: string;
  message: string;
  model?: string;
}

interface StatusCheckRequestBody {
  agentId?: string;
}

// Mock MyBonzo Agent for testing (until real Cloudflare Agent binding is available)
class MockMyBonzoAgent {
  public id: string;
  public env: any;

  constructor(id: string = "mybonzo") {
    this.id = id;
    this.env = {};
  }

  async chat(message: string, model?: string) {
    return {
      success: true,
      response: `MyBonzo odpowiada na: "${message}"`,
      agentId: this.id,
      model: model || "@cf/google/gemma-3-12b-it",
      timestamp: new Date().toISOString(),
    };
  }

  async generateImage(prompt: string) {
    return {
      success: true,
      imageUrl: `https://example.com/generated-image-${Date.now()}.png`,
      prompt,
      agentId: this.id,
      timestamp: new Date().toISOString(),
    };
  }
}

// Helper to get CORS headers
function getCorsHeaders(): Headers {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

// Helper function to get agent by name/id
async function getAgentByName(
  agentNamespace: AgentNamespace<any> | undefined,
  name: string
): Promise<MockMyBonzoAgent> {
  // For now, return mock agent until Cloudflare Agent binding is properly configured
  return new MockMyBonzoAgent(name);
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const corsHeaders = getCorsHeaders();

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Chat endpoint
      if (path === "/api/agents/chat" && request.method === "POST") {
        const requestBody = await request.text();
        let parsedBody: ChatRequestBody;

        try {
          parsedBody = JSON.parse(requestBody);
        } catch (error) {
          return Response.json(
            { error: "Invalid JSON in request body" },
            { status: 400, headers: corsHeaders }
          );
        }

        if (!parsedBody || typeof parsedBody !== "object") {
          return Response.json(
            { error: "Request body must be a valid object" },
            { status: 400, headers: corsHeaders }
          );
        }

        const { agentId, message, model } = parsedBody;

        if (!message || typeof message !== "string") {
          return Response.json(
            { error: "Message is required and must be a string" },
            { status: 400, headers: corsHeaders }
          );
        }

        try {
          // Get agent from namespace
          const agent = await getAgentByName(
            env.MYBONZO_AGENT,
            agentId || "default"
          );

          // Call agent with message
          const response = await agent.chat(message, model);

          return Response.json(response, { headers: corsHeaders });
        } catch (agentError) {
          console.error("Agent error:", agentError);
          return Response.json(
            {
              error: "Failed to communicate with agent",
              details: (agentError as Error).message,
            },
            { status: 500, headers: corsHeaders }
          );
        }
      }

      // Status check endpoint
      if (path === "/api/agents/status" && request.method === "GET") {
        const statusData = {
          status: "operational",
          timestamp: new Date().toISOString(),
          agents: {
            mybonzo: "active",
            default: "active",
          },
        };

        return Response.json(statusData, { headers: corsHeaders });
      }

      // Health check endpoint
      if (path === "/api/agents/health") {
        const healthData = {
          status: "healthy",
          timestamp: new Date().toISOString(),
          version: "1.0.0",
          environment: "cloudflare-workers",
        };

        return Response.json(healthData, { headers: corsHeaders });
      }

      // Create agent endpoint
      if (path === "/api/agents/create" && request.method === "POST") {
        const createRequestBody = await request.text();
        let parsedCreateBody: any;

        try {
          parsedCreateBody = JSON.parse(createRequestBody);
        } catch (error) {
          return Response.json(
            { error: "Invalid JSON in request body" },
            { status: 400, headers: corsHeaders }
          );
        }

        const { name, config } = parsedCreateBody;

        if (!name) {
          return Response.json(
            { error: "Agent name is required" },
            { status: 400, headers: corsHeaders }
          );
        }

        try {
          // Create new agent instance (placeholder implementation)
          const newAgent = {
            id: name,
            name: name,
            config: config || {},
            created: new Date().toISOString(),
            status: "active",
          };

          return Response.json(newAgent, { headers: corsHeaders });
        } catch (createError) {
          console.error("Agent creation error:", createError);
          return Response.json(
            {
              error: "Failed to create agent",
              details: (createError as Error).message,
            },
            { status: 500, headers: corsHeaders }
          );
        }
      }

      // List agents endpoint
      if (path === "/api/agents" && request.method === "GET") {
        const agentsList = {
          agents: [
            { id: "mybonzo", name: "MyBonzo", status: "active", type: "chat" },
            {
              id: "default",
              name: "Default Assistant",
              status: "active",
              type: "general",
            },
          ],
          count: 2,
          timestamp: new Date().toISOString(),
        };

        return Response.json(agentsList, { headers: corsHeaders });
      }

      // Agent info endpoint
      if (path.startsWith("/api/agents/") && request.method === "GET") {
        const agentId = path.split("/").pop();

        if (!agentId) {
          return Response.json(
            { error: "Agent ID is required" },
            { status: 400, headers: corsHeaders }
          );
        }

        const agentInfo = {
          id: agentId,
          name: agentId === "mybonzo" ? "MyBonzo" : "Assistant",
          status: "active",
          type: "chat",
          capabilities: ["chat", "generate", "analyze"],
          created: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
        };

        return Response.json(agentInfo, { headers: corsHeaders });
      }

      // Default route - 404
      return Response.json(
        { error: "Endpoint not found" },
        { status: 404, headers: corsHeaders }
      );
    } catch (error) {
      console.error("Worker error:", error);
      return Response.json(
        { error: "Internal server error", details: (error as Error).message },
        { status: 500, headers: corsHeaders }
      );
    }
  },
} satisfies ExportedHandler<Env>;
