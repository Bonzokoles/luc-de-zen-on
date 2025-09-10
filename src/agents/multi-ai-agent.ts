/**
 * Multi-AI Agent using Cloudflare Agents SDK
 * Provides conversational AI with state management and multi-provider support
 */

import { Agent } from "agents";

export interface Env {
  // Bindings from wrangler.toml
  AI: any; // Cloudflare Workers AI
  AGENTS: KVNamespace; // Agent configurations
  AI_AGENTS: KVNamespace; // Agent state storage
  SESSION: KVNamespace; // Session management
  
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
      role: 'user' | 'assistant' | 'system';
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

export class MultiAIAgent extends Agent<Env, AgentState> {
  // Initial state definition
  initialState: AgentState = {
    conversations: [],
    preferences: {
      defaultProvider: 'openai',
      defaultModel: 'gpt-4o-mini',
      language: 'pl',
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

  // Called when a new Agent instance starts
  async onStart() {
    console.log('Multi-AI Agent started with state:', this.state);
    
    // Initialize user profile if needed
    if (!this.state.userProfile.createdAt) {
      this.setState({
        ...this.state,
        userProfile: {
          ...this.state.userProfile,
          createdAt: Date.now(),
        },
      });
    }
  }

  // Handle HTTP requests to this Agent instance
  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS handling
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    try {
      switch (path) {
        case '/status':
          return this.handleStatus();
        
        case '/chat':
          if (request.method === 'POST') {
            return this.handleChat(request);
          }
          break;
          
        case '/conversations':
          if (request.method === 'GET') {
            return this.handleGetConversations();
          }
          break;
          
        case '/preferences':
          if (request.method === 'GET') {
            return this.handleGetPreferences();
          } else if (request.method === 'PUT') {
            return this.handleUpdatePreferences(request);
          }
          break;
          
        case '/usage':
          return this.handleGetUsage();
          
        default:
          return new Response(JSON.stringify({
            error: 'Not found',
            availableEndpoints: ['/status', '/chat', '/conversations', '/preferences', '/usage']
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
      }
    } catch (error) {
      console.error('Request handling error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response('Method not allowed', { status: 405 });
  }

  // Handle WebSocket connections
  async onConnect(connection: Connection, ctx: ConnectionContext) {
    console.log('Client connected:', connection.id);
    
    // Send welcome message with agent status
    connection.send(JSON.stringify({
      type: 'welcome',
      agentId: this.id,
      state: {
        conversations: this.state.conversations.length,
        totalRequests: this.state.usage.totalRequests,
        defaultProvider: this.state.preferences.defaultProvider,
      },
      timestamp: Date.now(),
    }));
  }

  // Handle WebSocket messages
  async onMessage(connection: Connection, message: string | ArrayBuffer | ArrayBufferView) {
    try {
      const data = JSON.parse(message.toString());
      
      switch (data.type) {
        case 'chat':
          await this.handleWebSocketChat(connection, data);
          break;
          
        case 'get_conversations':
          connection.send(JSON.stringify({
            type: 'conversations',
            data: this.state.conversations,
            timestamp: Date.now(),
          }));
          break;
          
        case 'switch_provider':
          await this.handleSwitchProvider(connection, data);
          break;
          
        case 'ping':
          connection.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
          
        default:
          connection.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type',
            timestamp: Date.now(),
          }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      connection.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format',
        timestamp: Date.now(),
      }));
    }
  }

  // Handle WebSocket errors
  async onError(connection: Connection, error: Error) {
    console.error(`WebSocket connection error:`, error);
  }

  // Handle WebSocket close
  async onClose(connection: Connection, code: number, reason: string, wasClean: boolean) {
    console.log(`WebSocket connection closed: ${code} - ${reason}`);
  }

  // Called when state is updated
  onStateUpdate(state: AgentState, source: string) {
    console.log('Agent state updated from:', source);
  }

  // HTTP Handlers
  private async handleStatus(): Promise<Response> {
    return new Response(JSON.stringify({
      status: 'active',
      agentId: this.id,
      uptime: Date.now() - this.state.userProfile.createdAt,
      conversations: this.state.conversations.length,
      totalRequests: this.state.usage.totalRequests,
      preferences: this.state.preferences,
      timestamp: Date.now(),
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  private async handleChat(request: Request): Promise<Response> {
    const { message, provider, model, conversationId } = await request.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const response = await this.processAIRequest(
      message,
      provider || this.state.preferences.defaultProvider,
      model || this.state.preferences.defaultModel,
      conversationId
    );

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  private async handleGetConversations(): Promise<Response> {
    return new Response(JSON.stringify({
      conversations: this.state.conversations,
      total: this.state.conversations.length,
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  private async handleGetPreferences(): Promise<Response> {
    return new Response(JSON.stringify(this.state.preferences), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  private async handleUpdatePreferences(request: Request): Promise<Response> {
    const updates = await request.json();
    
    this.setState({
      ...this.state,
      preferences: {
        ...this.state.preferences,
        ...updates,
      },
    });

    return new Response(JSON.stringify(this.state.preferences), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  private async handleGetUsage(): Promise<Response> {
    return new Response(JSON.stringify(this.state.usage), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // WebSocket Handlers
  private async handleWebSocketChat(connection: Connection, data: any) {
    const response = await this.processAIRequest(
      data.message,
      data.provider || this.state.preferences.defaultProvider,
      data.model || this.state.preferences.defaultModel,
      data.conversationId
    );

    connection.send(JSON.stringify({
      type: 'chat_response',
      data: response,
      timestamp: Date.now(),
    }));
  }

  private async handleSwitchProvider(connection: Connection, data: any) {
    this.setState({
      ...this.state,
      preferences: {
        ...this.state.preferences,
        defaultProvider: data.provider,
        defaultModel: data.model || this.state.preferences.defaultModel,
      },
    });

    connection.send(JSON.stringify({
      type: 'provider_switched',
      provider: data.provider,
      model: data.model,
      timestamp: Date.now(),
    }));
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
        ? this.state.conversations.find(c => c.id === conversationId)
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
        this.state.conversations.push(conversation);
      }

      // Add user message
      conversation.messages.push({
        role: 'user',
        content: message,
        timestamp: Date.now(),
      });

      // Call AI provider
      const aiResponse = await this.callAIProvider(provider, model, conversation.messages);

      // Add AI response
      conversation.messages.push({
        role: 'assistant',
        content: aiResponse.content,
        timestamp: Date.now(),
        provider,
      });

      conversation.lastActivity = Date.now();

      // Update usage statistics
      this.setState({
        ...this.state,
        usage: {
          ...this.state.usage,
          totalRequests: this.state.usage.totalRequests + 1,
          providerUsage: {
            ...this.state.usage.providerUsage,
            [provider]: (this.state.usage.providerUsage[provider] || 0) + 1,
          },
          tokensUsed: this.state.usage.tokensUsed + (aiResponse.usage?.total_tokens || 0),
        },
      });

      return {
        conversationId: conversation.id,
        message: aiResponse.content,
        provider,
        model,
        usage: aiResponse.usage,
        timestamp: Date.now(),
      };

    } catch (error) {
      console.error('AI processing error:', error);
      return {
        error: 'AI processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        provider,
        model,
        timestamp: Date.now(),
      };
    }
  }

  private async callAIProvider(provider: string, model: string, messages: any[]) {
    // Use multi-AI worker endpoint
    const workerUrl = `https://multi-ai-worker-production.yourname.workers.dev`;
    
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        model,
        messages,
        max_tokens: this.state.preferences.maxTokens,
        temperature: this.state.preferences.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI provider error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return {
      content: data.response,
      usage: data.usage,
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export default MultiAIAgent;
