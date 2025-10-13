/**
 * Multi-AI Worker - Universal Cloudflare Worker for multiple AI providers
 * Routes requests to different AI providers through Cloudflare AI Gateway
 */

export interface Env {
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

interface MultiAIRequest {
  provider:
    | "openai"
    | "anthropic"
    | "deepseek"
    | "perplexity"
    | "google-ai-studio"
    | "huggingface"
    | "elevenlabs";
  model?: string;
  messages?: Array<{
    role: string;
    content: string;
  }>;
  text?: string; // For TTS
  inputs?: string; // For HuggingFace
  max_tokens?: number;
  temperature?: number;
  [key: string]: any;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const requestData: MultiAIRequest = await request.json();

      if (!requestData.provider) {
        return new Response(JSON.stringify({ error: "Provider is required" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      let gatewayUrl: string;
      let headers: Record<string, string>;
      let body: any;

      switch (requestData.provider) {
        case "openai":
          gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/openai/chat/completions`;
          headers = {
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          };
          body = {
            model: requestData.model || "gpt-4o-mini",
            messages: requestData.messages,
            max_tokens: requestData.max_tokens || 1000,
            temperature: requestData.temperature || 0.7,
          };
          break;

        case "anthropic":
          gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/anthropic/v1/messages`;
          headers = {
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          };
          body = {
            model: requestData.model || "claude-3-5-sonnet-20241022",
            max_tokens: requestData.max_tokens || 1000,
            temperature: requestData.temperature || 0.7,
            messages: requestData.messages,
          };
          break;

        case "deepseek":
          gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/deepseek/chat/completions`;
          headers = {
            Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          };
          body = {
            model: requestData.model || "deepseek-chat",
            messages: requestData.messages,
            max_tokens: requestData.max_tokens || 1000,
            temperature: requestData.temperature || 0.7,
          };
          break;

        case "perplexity":
          gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/perplexity-ai/chat/completions`;
          headers = {
            Authorization: `Bearer ${env.PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json",
            accept: "application/json",
          };
          body = {
            model: requestData.model || "llama-3.1-sonar-small-128k-online",
            messages: requestData.messages,
            max_tokens: requestData.max_tokens || 1000,
            temperature: requestData.temperature || 0.7,
          };
          break;

        case "google-ai-studio":
          const model = requestData.model || "gemini-1.5-flash";
          gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/google-ai-studio/v1/models/${model}:generateContent`;
          headers = {
            "x-goog-api-key": env.GOOGLE_AI_STUDIO_API_KEY,
            "Content-Type": "application/json",
          };
          body = {
            contents:
              requestData.messages?.map((msg) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
              })) || [],
            generationConfig: {
              temperature: requestData.temperature || 0.7,
              maxOutputTokens: requestData.max_tokens || 1000,
            },
          };
          break;

        case "huggingface":
          const hfModel = requestData.model || "microsoft/DialoGPT-medium";
          gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/huggingface/${hfModel}`;
          headers = {
            Authorization: `Bearer ${env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          };
          body = {
            inputs:
              requestData.inputs || requestData.messages?.[0]?.content || "",
            parameters: {
              max_new_tokens: requestData.max_tokens || 150,
              temperature: requestData.temperature || 0.7,
            },
          };
          break;

        case "elevenlabs":
          const voiceId = requestData.voice_id || "JBFqnCBsd6RMkjVDRZzb";
          gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/elevenlabs/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
          headers = {
            "xi-api-key": env.ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
          };
          body = {
            text: requestData.text || "",
            model_id: requestData.model || "eleven_multilingual_v2",
          };
          break;

        default:
          return new Response(
            JSON.stringify({ error: "Unsupported provider" }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
      }

      const response = await fetch(gatewayUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error(
          `${requestData.provider} API error:`,
          response.status,
          await response.text()
        );
        return new Response(
          JSON.stringify({
            error: `${requestData.provider} API error`,
            status: response.status,
          }),
          {
            status: response.status,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      // Handle different response types
      if (requestData.provider === "elevenlabs") {
        const audioData = await response.arrayBuffer();
        return new Response(audioData, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Access-Control-Allow-Origin": "*",
            "X-Provider": "elevenlabs",
          },
        });
      }

      const data = (await response.json()) as any;
      let responseText = "";
      let usage = null;

      // Parse response based on provider
      switch (requestData.provider) {
        case "openai":
        case "deepseek":
        case "perplexity":
          responseText = data.choices?.[0]?.message?.content || "";
          usage = data.usage;
          break;
        case "anthropic":
          responseText = data.content?.[0]?.text || "";
          usage = data.usage;
          break;
        case "google-ai-studio":
          responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          usage = data.usageMetadata;
          break;
        case "huggingface":
          responseText = Array.isArray(data)
            ? data[0]?.generated_text || ""
            : data.generated_text || "";
          break;
      }

      return new Response(
        JSON.stringify({
          success: true,
          response: responseText,
          model: requestData.model,
          usage,
          provider: requestData.provider,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (error) {
      console.error("Multi-AI Worker error:", error);
      return new Response(
        JSON.stringify({
          error: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
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
  },
};
