/**
 * Bielik 11B Polish API Endpoint
 * Cloudflare AI Gateway integration for Polish voice assistant
 * Based on GATEWAY documentation
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

    // Polish system message for BIELIK voice assistant
    const polishSystemMessage = `Jesteś BIELIK - polski asystent głosowy w aplikacji mybonzo.com.
Odpowiadasz wyłącznie w języku polskim z pełnym zrozumieniem polskiej kultury i kontekstu.
Jesteś głównym orkiestratorem w systemie MyBonzo i zarządzasz polskimi agentami AI.
Specjalizujesz się w voice commands i naturalnej konwersacji po polsku.
Odpowiadasz zwięźle, naturalnie i pomocnie.
Zawsze jesteś konkretny i merytoryczny.`;

    // Try to call Bielik through Cloudflare AI Gateway
    try {
      const aiResponse = await callBielikThroughGateway(
        polishSystemMessage,
        prompt,
        locals
      );

      return new Response(
        JSON.stringify({
          success: true,
          answer: aiResponse,
          source: "bielik-11b-polish",
          sessionId,
          provider: "Cloudflare AI Gateway",
          model: "Bielik-11B-v2.2-Instruct",
          capabilities: [
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
    } catch (error) {
      // Fallback response if Gateway fails
      console.error("Bielik Gateway error:", error);
      return getFallbackResponse(prompt, sessionId, corsHeaders);
    }
  } catch (error: any) {
    console.error("Request processing error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Request processing failed",
        details: error?.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
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


// Call Bielik through Cloudflare AI Gateway
async function callBielikThroughGateway(
  systemMessage: string,
  prompt: string,
  locals?: any
): Promise<string> {
  const BIELIK_CONFIG = {
    accountId: locals?.runtime?.env?.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || "7c5dae5552338874e5053f2be85b1bc7",
    gatewayName: locals?.runtime?.env?.AI_GATEWAY_NAME || process.env.AI_GATEWAY_NAME || "bielik_gateway",
    model: locals?.runtime?.env?.BIELIK_MODEL || process.env.BIELIK_MODEL || "speakleash/Bielik-11B-v2.2-Instruct",
    get gatewayUrl() {
      return `https://gateway.ai.cloudflare.com/v1/${this.accountId}/${this.gatewayName}`;
    },
  
    // Voice assistant parameters
    voiceParams: {
      max_new_tokens: 512,
      temperature: 0.7,
      top_p: 0.95,
      top_k: 50,
      repetition_penalty: 1.1,
      do_sample: true,
      return_full_text: false,
    },
  };

  const fullPrompt = `${systemMessage}\n\nUser: ${prompt}\nAssistant:`;

  const response = await fetch(
    `${BIELIK_CONFIG.gatewayUrl}/huggingface/${BIELIK_CONFIG.model}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${
          locals?.runtime?.env?.HF_API_TOKEN || process.env.HF_API_TOKEN
        }`,
        "Content-Type": "application/json",
        "cf-aig-metadata": JSON.stringify({
          endpoint: "voice-assistant",
          user_session: locals?.sessionId || "anonymous",
          message_length: prompt.length,
        }),
        "cf-aig-cache-ttl": "3600", // Cache for 1 hour
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: BIELIK_CONFIG.voiceParams,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Bielik Gateway API error ${response.status}: ${error}`);
  }

  const result: any = await response.json();
  const generatedText = result[0]?.generated_text?.trim();

  if (!generatedText) {
    throw new Error("Model returned empty response");
  }

  return generatedText;
}

// Fallback response if Gateway is not available
function getFallbackResponse(
  prompt: string,
  sessionId: string,
  corsHeaders: Record<string, string>
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      answer: `🐺 BIELIK 11B (Polish AI Assistant)

Cześć! Jestem BIELIK - polskim asystentem AI specjalnie wytrenowanym dla języka polskiego.

Twoje zapytanie: "${prompt}"

System obecnie działa w trybie fallback. Model Bielik 11B jest dostępny przez Cloudflare AI Gateway, ale połączenie może być chwilowo niedostępne.

Jako główny orkiestrator w MyBonzo oferuję:
• 🎤 Voice commands w języku polskim
• 🧠 Naturalne zrozumienie polskiej kultury
• 🎯 Zarządzanie polskimi agentami AI
• 💬 Płynną konwersację

Sprawdź konfigurację Cloudflare AI Gateway i spróbuj ponownie.

Sesja: ${sessionId}`,
      source: "bielik-fallback",
      fallback: true,
      sessionId: sessionId,
      provider: "Local Fallback",
      model: "Bielik-11B-v2.2-Instruct (Fallback)",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}
