/**
 * Multi-AI Durable Object Agent
 * Provides stateful conversational AI with multi-provider support
 */

export interface Env {
  // Durable Object bindings
  MULTI_AI_AGENT: DurableObjectNamespace;

  // KV namespaces
  AI_AGENTS: KVNamespace;
  SESSION: KVNamespace;

  // API Keys
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  DEEPSEEK_API_KEY: string;
  PERPLEXITY_API_KEY: string;
  GOOGLE_AI_STUDIO_API_KEY: string;
  HUGGINGFACE_API_KEY: string;
  ELEVENLABS_API_KEY: string;

  // AI Gateway Config
  AI_GATEWAY_ACCOUNT_ID: string;
  AI_GATEWAY_ID: string;
}

interface AgentState {
  conversations: Array<{
    id: string;
    messages: Array<{
      role: "user" | "assistant" | "system";
      content: string;
      timestamp: number;
      provider?: string;
    }>;
    provider: string;
    model: string;
    createdAt: number;
    lastActivity: number;
  }>;
  preferences: {
    defaultProvider: string;
    defaultModel: string;
    language: string;
    maxTokens: number;
    temperature: number;
  };
  usage: {
    totalRequests: number;
    providerUsage: Record<string, number>;
    tokensUsed: number;
  };
  userProfile: {
    userId?: string;
    name?: string;
    email?: string;
    createdAt: number;
  };
}

export class MultiAIAgent {
  private state: DurableObjectState;
  private env: Env;
  private agentState: AgentState;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    this.agentState = {
      conversations: [],
      preferences: {
        defaultProvider: "openai",
        defaultModel: "gpt-4o-mini",
        language: "pl",
        maxTokens: 1000,
        temperature: 0.7,
      },
      usage: {
        totalRequests: 0,
        providerUsage: {},
        tokensUsed: 0,
      },
      userProfile: {
        createdAt: Date.now(),
      },
    };
  }

  async fetch(request: Request): Promise<Response> {
    // Load state
    await this.loadState();

    const url = new URL(request.url);
    const path = url.pathname;

    // CORS handling
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    try {
      switch (path) {
        case "/status":
          return this.handleStatus();

        case "/chat":
          if (request.method === "POST") {
            return await this.handleChat(request);
          }
          break;

        case "/conversations":
          if (request.method === "GET") {
            return this.handleGetConversations();
          }
          break;

        case "/preferences":
          if (request.method === "GET") {
            return this.handleGetPreferences();
          } else if (request.method === "PUT") {
            return await this.handleUpdatePreferences(request);
          }
          break;

        case "/usage":
          return this.handleGetUsage();

        default:
          return new Response(
            JSON.stringify({
              error: "Not found",
              availableEndpoints: [
                "/status",
                "/chat",
                "/conversations",
                "/preferences",
                "/usage",
              ],
            }),
            {
              status: 404,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
      }
    } catch (error) {
      console.error("Request handling error:", error);
      return new Response(
        JSON.stringify({
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    return new Response("Method not allowed", { status: 405 });
  }

  private async loadState() {
    const stored = await this.state.storage.get<AgentState>("agentState");
    if (stored) {
      this.agentState = stored;
    }
  }

  private async saveState() {
    await this.state.storage.put("agentState", this.agentState);
  }

  // HTTP Handlers
  private handleStatus(): Response {
    return new Response(
      JSON.stringify({
        status: "active",
        conversations: this.agentState.conversations.length,
        totalRequests: this.agentState.usage.totalRequests,
        preferences: this.agentState.preferences,
        timestamp: Date.now(),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  private async handleChat(request: Request): Promise<Response> {
    const requestBody = (await request.json()) as {
      message?: string;
      provider?: string;
      model?: string;
      conversationId?: string;
    };
    const { message, provider, model, conversationId } = requestBody;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const response = await this.processAIRequest(
      message,
      provider || this.agentState.preferences.defaultProvider,
      model || this.agentState.preferences.defaultModel,
      conversationId
    );

    await this.saveState();

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  private handleGetConversations(): Response {
    return new Response(
      JSON.stringify({
        conversations: this.agentState.conversations,
        total: this.agentState.conversations.length,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  private handleGetPreferences(): Response {
    return new Response(JSON.stringify(this.agentState.preferences), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  private async handleUpdatePreferences(request: Request): Promise<Response> {
    const updates = (await request.json()) as Record<string, any>;

    this.agentState.preferences = {
      ...this.agentState.preferences,
      ...updates,
    };

    await this.saveState();

    return new Response(JSON.stringify(this.agentState.preferences), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  private handleGetUsage(): Response {
    return new Response(JSON.stringify(this.agentState.usage), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // AI Processing
  private async processAIRequest(
    message: string,
    provider: string,
    model: string,
    conversationId?: string
  ) {
    try {
      // Find or create conversation
      let conversation = conversationId
        ? this.agentState.conversations.find((c) => c.id === conversationId)
        : undefined;

      if (!conversation) {
        conversation = {
          id: conversationId || this.generateId(),
          messages: [],
          provider,
          model,
          createdAt: Date.now(),
          lastActivity: Date.now(),
        };
        this.agentState.conversations.push(conversation);
      }

      // Add user message
      conversation.messages.push({
        role: "user",
        content: message,
        timestamp: Date.now(),
      });

      // Call AI provider
      const aiResponse = await this.callAIProvider(
        provider,
        model,
        conversation.messages
      );

      // Add AI response
      conversation.messages.push({
        role: "assistant",
        content: aiResponse.content,
        timestamp: Date.now(),
        provider,
      });

      conversation.lastActivity = Date.now();

      // Update usage statistics
      this.agentState.usage = {
        ...this.agentState.usage,
        totalRequests: this.agentState.usage.totalRequests + 1,
        providerUsage: {
          ...this.agentState.usage.providerUsage,
          [provider]: (this.agentState.usage.providerUsage[provider] || 0) + 1,
        },
        tokensUsed:
          this.agentState.usage.tokensUsed +
          (aiResponse.usage?.total_tokens || 0),
      };

      return {
        conversationId: conversation.id,
        message: aiResponse.content,
        provider,
        model,
        usage: aiResponse.usage,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("AI processing error:", error);
      return {
        error: "AI processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
        provider,
        model,
        timestamp: Date.now(),
      };
    }
  }

  private async callAIProvider(
    provider: string,
    model: string,
    messages: any[]
  ) {
    // Use multi-AI worker endpoint
    const workerUrl = `https://multi-ai-worker-production.yourname.workers.dev`;

    const response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        model,
        messages,
        max_tokens: this.agentState.preferences.maxTokens,
        temperature: this.agentState.preferences.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI provider error: ${response.status}`);
    }

    const data = (await response.json()) as {
      error?: string;
      response?: string;
      usage?: any;
    };

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      content: data.response || "",
      usage: data.usage,
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Worker export for routing to Durable Object
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Extract agent ID from URL
    const url = new URL(request.url);
    const agentId = url.searchParams.get("agentId") || "default";

    // Get Durable Object instance
    const id = env.MULTI_AI_AGENT.idFromName(agentId);
    const agent = env.MULTI_AI_AGENT.get(id);

    // Forward request to Durable Object
    return agent.fetch(request);
  },
};
