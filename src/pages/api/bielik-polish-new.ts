/**
 * Bielik 11B Polish API Endpoint
 * Cloudflare AI model optimized for Polish language and voice
 */

export const prerender = false;

export async function POST({
  request,
  locals,
}: {
  request: Request;
  locals: any;
}): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    const { prompt, sessionId } = (await request.json()) as any;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Polish optimized system message for Bielik
    const polishSystemMessage = `Jesteś BIELIK - polskim asystentem AI opartym na modelu Bielik 11B.
    Odpowiadasz wyłącznie w języku polskim z pełnym zrozumieniem polskiej kultury i kontekstu.
    Jesteś głównym orkiestratorem w systemie MyBonzo i zarządzasz polskimi agentami AI.
    Specjalizujesz się w voice commands i naturalnej konwersacji po polsku.`;

    // Try to call Cloudflare AI Gateway first
    try {
      // Call to Cloudflare AI with Bielik model
      const aiResponse = await callCloudflareAI(
        polishSystemMessage,
        prompt,
        locals
      );

      return new Response(
        JSON.stringify({
          success: true,
          answer: aiResponse,
          source: "bielik-11b-polish",
          model: "Bielik 11B v2.2 Instruct",
          sessionId: sessionId,
          timestamp: new Date().toISOString(),
          provider: "cloudflare-ai-gateway",
          orchestrator: "bielik-voice-ready",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (error) {
      console.error("Bielik API error:", error);
      // Fallback response
      return getFallbackResponse(prompt, sessionId, corsHeaders);
    }
  } catch (error: any) {
    console.error("Llama Polish API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Llama Polish API error",
        details: error?.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}

export async function GET(): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  return new Response(
    JSON.stringify({
      status: "online",
      service: "bielik-11b-polish",
      version: "2.2.0",
      model: "Bielik 11B v2.2 Instruct",
      language: "Polish",
      provider: "Cloudflare AI",
      capabilities: [
        "Native Polish Language",
        "Voice Commands",
        "Agent Orchestration",
        "Natural Conversation",
        "Polish Culture Understanding",
      ],
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Helper function to call Cloudflare AI with Bielik
async function callCloudflareAI(
  systemMessage: string,
  prompt: string,
  locals?: any
): Promise<string> {
  const BIELIK_CONFIG = {
    accountId: process.env.CF_ACCOUNT_ID || "",
    gatewayName: "bielik_gateway",
    model: "speakleash/Bielik-11B-v2.2-Instruct",
    apiToken: process.env.HF_API_TOKEN || "",
    get gatewayUrl() {
      return `https://gateway.ai.cloudflare.com/v1/${this.accountId}/${this.gatewayName}`;
    },
  };

  const fullPrompt = `${systemMessage}\n\nUser: ${prompt}\nAssistant:`;

  const response = await fetch(
    `${BIELIK_CONFIG.gatewayUrl}/huggingface/${BIELIK_CONFIG.model}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BIELIK_CONFIG.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          top_p: 0.95,
          top_k: 50,
          repetition_penalty: 1.1,
          do_sample: true,
          return_full_text: false,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Bielik API error ${response.status}: ${error}`);
  }

  const result: any = await response.json();
  return result[0]?.generated_text?.trim() || "";
}

// Fallback response if API is not available
function getFallbackResponse(
  prompt: string,
  sessionId: string,
  corsHeaders: Record<string, string>
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      answer: `🤖 Bielik 11B v2.2 Fallback Response

Model obecnie niedostępny, ale system jest gotowy.
Twoje zapytanie: "${prompt}"

To jest odpowiedź zastępcza z polskiego modelu Bielik 11B.
Sprawdź konfigurację Cloudflare AI.

Sesja: ${sessionId}`,
      source: "bielik-fallback",
      fallback: true,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}
