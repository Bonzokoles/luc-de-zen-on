/**
 * CLOUDFLARE AI GATEWAY & WEBSOCKETS INTEGRATION
 * Kompletna implementacja WebSockets API, Secrets Store i Custom Costs
 */

import { Agent } from "../agents/agent";

interface WebSocketsEnv {
  AI_GATEWAY_ACCOUNT_ID: string;
  AI_GATEWAY_ID: string;
  SECRETS_STORE: SecretsStore;
  OPENAI_API_KEY: string;
  HF_API_TOKEN: string;
  VERTEX_API_KEY: string;
  ANTHROPIC_API_KEY: string;
}

interface SecretsStore {
  get(name: string): Promise<string | null>;
  put(name: string, value: string): Promise<void>;
  delete(name: string): Promise<void>;
  list(): Promise<string[]>;
}

interface CustomCostConfig {
  per_token_in: number;
  per_token_out: number;
}

interface AIGatewayRequest {
  provider: "openai" | "anthropic" | "huggingface" | "vertex" | "perplexity";
  model: string;
  messages?: any[];
  inputs?: any;
  customCost?: CustomCostConfig;
  stream?: boolean;
  useWebSocket?: boolean;
  realtime?: boolean;
}

export class AIGatewayAgent extends Agent<WebSocketsEnv, any> {
  private wsConnections = new Map<string, WebSocket>();
  private realtimeConnections = new Map<string, WebSocket>();
  private env: any;

  private broadcastToClients(message: any) {
    this.wsConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  async onStart() {
    console.log("🌐 AI Gateway Agent started with multi-provider support");

    // Initialize secrets from Secrets Store
    await this.loadSecretsFromStore();

    // Setup WebSocket connection pools
    await this.initializeWebSocketPools();
  }

  /**
   * SECRETS STORE INTEGRATION
   * Centralne zarządzanie sekretami na poziomie konta
   */
  private async loadSecretsFromStore() {
    try {
      const secrets = await this.env.SECRETS_STORE.list();
      console.log("🔐 Available secrets:", secrets);

      // Cache frequently used secrets
      for (const secretName of secrets) {
        const value = await this.env.SECRETS_STORE.get(secretName);
        if (value) {
          console.log(`🔑 Loaded secret: ${secretName}`);
        }
      }
    } catch (error) {
      console.error("❌ Failed to load secrets:", error);
    }
  }

  async updateSecret(name: string, value: string) {
    try {
      await this.env.SECRETS_STORE.put(name, value);
      console.log(`✅ Secret updated: ${name}`);
    } catch (error) {
      console.error(`❌ Failed to update secret ${name}:`, error);
    }
  }

  /**
   * AI GATEWAY INTEGRATION Z CUSTOM COSTS
   * Obsługa wszystkich dostawców AI z niestandardowymi kosztami
   */
  async callAI(request: AIGatewayRequest): Promise<any> {
    const { provider, model, customCost, useWebSocket, realtime } = request;

    // Wybór odpowiedniego endpointa
    if (useWebSocket) {
      return realtime
        ? await this.callRealtimeWebSocket(request)
        : await this.callNonRealtimeWebSocket(request);
    }

    return await this.callHTTPGateway(request);
  }

  private async callHTTPGateway(request: AIGatewayRequest): Promise<any> {
    const { provider, model, messages, inputs, customCost } = request;

    // Konstrukcja URL dla AI Gateway
    const baseURL = `https://gateway.ai.cloudflare.com/v1/${this.env.AI_GATEWAY_ACCOUNT_ID}/${this.env.AI_GATEWAY_ID}`;
    const providerURL = this.getProviderURL(baseURL, provider, model);

    // Headers z Custom Cost
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: await this.getProviderAuth(provider),
    };

    if (customCost) {
      headers["cf-aig-custom-cost"] = JSON.stringify(customCost);
    }

    // Przygotowanie payload
    const payload = this.preparePayload(provider, { messages, inputs, model });

    try {
      const response = await fetch(providerURL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`AI Gateway request failed: ${response.status}`);
      }

      const result = await response.json();

      // Log cost metrics if custom cost applied
      if (customCost) {
        console.log("💰 Custom cost applied:", customCost);
      }

      return result;
    } catch (error) {
      console.error("❌ AI Gateway HTTP request failed:", error);
      throw error;
    }
  }

  /**
   * REALTIME WEBSOCKETS API
   * Dla low-latency multimodal interactions
   */
  private async callRealtimeWebSocket(request: AIGatewayRequest): Promise<any> {
    const { provider, model } = request;
    const connectionKey = `${provider}_${model}_realtime`;

    return new Promise((resolve, reject) => {
      try {
        // Realtime WebSocket URL
        const wsURL = `wss://gateway.ai.cloudflare.com/v1/${this.env.AI_GATEWAY_ACCOUNT_ID}/${this.env.AI_GATEWAY_ID}/${provider}/realtime`;

        const ws = new WebSocket(wsURL);

        ws.onopen = () => {
          console.log("🔄 Realtime WebSocket connected");
          this.realtimeConnections.set(connectionKey, ws);

          // Send session configuration
          ws.send(
            JSON.stringify({
              type: "session.update",
              session: {
                model: model,
                modalities: ["text", "audio"],
                instructions: "You are a helpful AI assistant.",
                voice: "alloy",
                input_audio_format: "pcm16",
                output_audio_format: "pcm16",
                input_audio_transcription: {
                  model: "whisper-1",
                },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 200,
                },
                tools: [],
                tool_choice: "auto",
                temperature: 0.8,
                max_response_output_tokens: "inf",
              },
            })
          );
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("📨 Realtime message:", data.type);

            switch (data.type) {
              case "session.created":
                console.log("✅ Realtime session created");
                resolve({ status: "connected", sessionId: data.session.id });
                break;

              case "response.audio.delta":
                // Handle streaming audio response
                this.handleAudioDelta(data);
                break;

              case "response.text.delta":
                // Handle streaming text response
                this.handleTextDelta(data);
                break;

              case "error":
                console.error("❌ Realtime error:", data.error);
                reject(new Error(data.error.message));
                break;
            }
          } catch (parseError) {
            console.error("❌ Failed to parse realtime message:", parseError);
          }
        };

        ws.onerror = (error) => {
          console.error("❌ Realtime WebSocket error:", error);
          reject(error);
        };

        ws.onclose = () => {
          console.log("🔌 Realtime WebSocket closed");
          this.realtimeConnections.delete(connectionKey);
        };
      } catch (error) {
        console.error("❌ Failed to create realtime WebSocket:", error);
        reject(error);
      }
    });
  }

  /**
   * NON-REALTIME WEBSOCKETS API
   * Dla standardowej komunikacji WebSocket ze wszystkimi dostawcami
   */
  private async callNonRealtimeWebSocket(
    request: AIGatewayRequest
  ): Promise<any> {
    const { provider, model, messages, customCost } = request;
    const connectionKey = `${provider}_${model}_standard`;

    return new Promise((resolve, reject) => {
      try {
        // Standard WebSocket URL
        const wsURL = `wss://gateway.ai.cloudflare.com/v1/${this.env.AI_GATEWAY_ACCOUNT_ID}/${this.env.AI_GATEWAY_ID}/${provider}/websocket`;

        const ws = new WebSocket(wsURL);

        ws.onopen = () => {
          console.log("🔄 Non-realtime WebSocket connected");
          this.wsConnections.set(connectionKey, ws);

          // Send AI request over WebSocket
          const payload = {
            model,
            messages,
            stream: true,
            ...(customCost && { "cf-aig-custom-cost": customCost }),
          };

          ws.send(JSON.stringify(payload));
        };

        let response = "";

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.choices && data.choices[0].delta.content) {
              response += data.choices[0].delta.content;
            }

            if (data.choices && data.choices[0].finish_reason === "stop") {
              resolve({ content: response, provider, model });
            }
          } catch (parseError) {
            console.error("❌ Failed to parse WebSocket message:", parseError);
          }
        };

        ws.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
          reject(error);
        };

        ws.onclose = () => {
          console.log("🔌 WebSocket closed");
          this.wsConnections.delete(connectionKey);
        };
      } catch (error) {
        console.error("❌ Failed to create WebSocket:", error);
        reject(error);
      }
    });
  }

  /**
   * MULTI-PROVIDER SUPPORT
   * Obsługa wszystkich dostawców AI przez AI Gateway
   */
  private getProviderURL(
    baseURL: string,
    provider: string,
    model: string
  ): string {
    switch (provider) {
      case "openai":
        return `${baseURL}/openai/chat/completions`;

      case "anthropic":
        return `${baseURL}/anthropic/messages`;

      case "huggingface":
        return `${baseURL}/huggingface/${model}`;

      case "vertex":
        const project = "your-project";
        const region = "us-east4";
        return `${baseURL}/google-vertex-ai/v1/projects/${project}/locations/${region}/publishers/google/models/${model}:generateContent`;

      case "perplexity":
        return `${baseURL}/perplexity/chat/completions`;

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private async getProviderAuth(provider: string): Promise<string> {
    switch (provider) {
      case "openai":
        const openaiKey =
          (await this.env.SECRETS_STORE.get("OPENAI_API_KEY")) ||
          this.env.OPENAI_API_KEY;
        return `Bearer ${openaiKey}`;

      case "anthropic":
        const anthropicKey =
          (await this.env.SECRETS_STORE.get("ANTHROPIC_API_KEY")) ||
          this.env.ANTHROPIC_API_KEY;
        return `x-api-key ${anthropicKey}`;

      case "huggingface":
        const hfKey =
          (await this.env.SECRETS_STORE.get("HF_API_TOKEN")) ||
          this.env.HF_API_TOKEN;
        return `Bearer ${hfKey}`;

      case "vertex":
        const vertexKey =
          (await this.env.SECRETS_STORE.get("VERTEX_API_KEY")) ||
          this.env.VERTEX_API_KEY;
        return `Bearer ${vertexKey}`;

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private getProviderAuthSync(provider: string): string {
    // Synchronous version for WebSocket headers
    switch (provider) {
      case "openai":
        return `Bearer ${this.env.OPENAI_API_KEY}`;
      case "anthropic":
        return `x-api-key ${this.env.ANTHROPIC_API_KEY}`;
      case "huggingface":
        return `Bearer ${this.env.HF_API_TOKEN}`;
      case "vertex":
        return `Bearer ${this.env.VERTEX_API_KEY}`;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private preparePayload(provider: string, data: any): any {
    switch (provider) {
      case "openai":
      case "anthropic":
      case "perplexity":
        return {
          model: data.model,
          messages: data.messages,
          stream: false,
        };

      case "huggingface":
        return {
          inputs: data.inputs,
        };

      case "vertex":
        return {
          contents: {
            role: "user",
            parts:
              data.messages?.map((msg: any) => ({ text: msg.content })) || [],
          },
        };

      default:
        return data;
    }
  }

  /**
   * REALTIME AUDIO/TEXT HANDLING
   */
  private handleAudioDelta(data: any) {
    // Handle streaming audio data
    if (data.delta) {
      console.log("🎵 Audio delta received:", data.delta.length, "bytes");
      // Process audio delta - could be sent to client via SSE
      this.broadcastToClients({
        type: "audio-delta",
        data: data.delta,
        timestamp: Date.now(),
      });
    }
  }

  private handleTextDelta(data: any) {
    // Handle streaming text data
    if (data.delta) {
      console.log("💬 Text delta:", data.delta);
      this.broadcastToClients({
        type: "text-delta",
        data: data.delta,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * WEBSOCKET POOL MANAGEMENT
   */
  private async initializeWebSocketPools() {
    console.log("🔄 Initializing WebSocket connection pools");

    // Pre-warm connections for frequently used providers
    const providers = ["openai", "anthropic"] as const;

    for (const provider of providers) {
      try {
        // Keep warm connections ready
        setTimeout(() => {
          this.preWarmConnection(provider);
        }, 1000);
      } catch (error) {
        console.error(`❌ Failed to pre-warm ${provider}:`, error);
      }
    }
  }

  private async preWarmConnection(provider: string) {
    const wsURL = `wss://gateway.ai.cloudflare.com/v1/${this.env.AI_GATEWAY_ACCOUNT_ID}/${this.env.AI_GATEWAY_ID}/${provider}/websocket`;

    try {
      const ws = new WebSocket(wsURL);
      ws.onopen = () => {
        console.log(`🔥 Pre-warmed connection for ${provider}`);
        ws.close(); // Close pre-warm connection
      };
    } catch (error) {
      console.error(`❌ Failed to pre-warm ${provider}:`, error);
    }
  }

  /**
   * PUBLIC API METHODS
   */
  async chatWithOpenAI(
    message: string,
    customCost?: CustomCostConfig
  ): Promise<string> {
    const result = await this.callAI({
      provider: "openai",
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      customCost,
      useWebSocket: false,
    });

    return result.choices[0].message.content;
  }

  async chatWithAnthropic(
    message: string,
    useWebSocket: boolean = false
  ): Promise<string> {
    const result = await this.callAI({
      provider: "anthropic",
      model: "claude-3-haiku-20240307",
      messages: [{ role: "user", content: message }],
      useWebSocket,
    });

    return result.content[0].text;
  }

  async queryHuggingFace(inputs: string, model: string = "gpt2"): Promise<any> {
    return await this.callAI({
      provider: "huggingface",
      model,
      inputs,
    });
  }

  async startRealtimeSession(
    provider: "openai" = "openai",
    model: string = "gpt-4o-realtime-preview"
  ): Promise<any> {
    return await this.callAI({
      provider,
      model,
      useWebSocket: true,
      realtime: true,
    });
  }

  /**
   * COST OPTIMIZATION
   */
  async getCostOptimizedResponse(message: string): Promise<any> {
    // Custom cost dla modelu z negocjowaną ceną
    const customCost: CustomCostConfig = {
      per_token_in: 0.000001, // $1 per million input tokens
      per_token_out: 0.000002, // $2 per million output tokens
    };

    return await this.chatWithOpenAI(message, customCost);
  }

  /**
   * CLEANUP
   */
  async onClose() {
    console.log("🔌 Closing AI Gateway Agent");

    // Close all WebSocket connections
    for (const [key, ws] of this.wsConnections) {
      ws.close();
      console.log(`🔌 Closed WebSocket: ${key}`);
    }

    for (const [key, ws] of this.realtimeConnections) {
      ws.close();
      console.log(`🔌 Closed Realtime WebSocket: ${key}`);
    }

    this.wsConnections.clear();
    this.realtimeConnections.clear();
  }
}
