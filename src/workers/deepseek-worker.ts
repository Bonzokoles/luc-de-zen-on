/**
 * DeepSeek Worker - Cloudflare Worker using Cloudflare AI
 * Converted from external API to native Cloudflare AI
 */

export interface Env {
  AI: Ai;
}

interface CloudflareRequest {
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
}

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
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
      const requestData: CloudflareRequest = await request.json();

      // Use Cloudflare AI instead of external API
      const response = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct" as any,
        {
          messages: requestData.messages,
          max_tokens: requestData.max_tokens || 512,
          temperature: requestData.temperature || 0.7,
        }
      );

      return new Response(
        JSON.stringify({
          success: true,
          response:
            (response as any).response ||
            "Nie udało się wygenerować odpowiedzi.",
          model: "llama-3.1-8b-instruct",
          provider: "cloudflare-ai",
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
      console.error("Cloudflare AI error:", error);
      return new Response(
        JSON.stringify({
          error: "Cloudflare AI error",
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
