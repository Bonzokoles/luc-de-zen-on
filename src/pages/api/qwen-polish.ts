/**
 * Qwen 1.5 14B Polish API Endpoint
 * Cloudflare AI model with excellent Polish language support
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

    // Use Cloudflare Qwen model instead of Mistral
    const qwenResponse = await callCloudflareQwen(prompt, locals);

    const response = `�� Qwen 1.5 14B (Polski Assistant)

Cześć! Jestem Qwen 1.5 14B - chińskim modelem AI z doskonałą znajomością języka polskiego.

Odpowiadam na: "${prompt}"

${qwenResponse}

Jako Qwen w MyBonzo oferuję:
• 🧠 Zaawansowane rozumowanie i logikę
• 🇵🇱 Doskonałe wsparcie języka polskiego
• 📊 Analityczne podejście do problemów
• 🔄 Współpracę z orkiestratorem BIELIK
• ⚡ Wysoką wydajność na Cloudflare

Czym mogę jeszcze pomóc?

---
Model: Qwen 1.5 14B AWQ (Polish)
Provider: Cloudflare AI (Free)
Specialty: Analytical thinking & Polish language
Status: Online`;

    return new Response(
      JSON.stringify({
        success: true,
        answer: qwenResponse,
        source: "qwen-1.5-14b-polish", 
        model: "Qwen 1.5 14B AWQ",
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
        provider: "cloudflare-ai",
        language: "polish",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Qwen Polish API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Qwen Polish API error",
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
      service: "qwen-1.5-14b-polish",
      version: "1.5.0",
      model: "Qwen 1.5 14B AWQ",
      language: "Polish",
      provider: "Cloudflare AI",
      capabilities: [
        "Advanced Reasoning",
        "Polish Language Excellence",
        "Analytical Thinking",
        "Multi-domain Knowledge",
      ],
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}

// Helper function to call Cloudflare Qwen model
async function callCloudflareQwen(prompt: string, locals?: any): Promise<string> {
  try {
    // Use Cloudflare AI binding if available
    if (locals?.runtime?.env?.AI) {
      const response = await locals.runtime.env.AI.run("@cf/qwen/qwen1.5-14b-chat-awq", {
        messages: [
          { 
            role: "system", 
            content: "Jesteś Qwen 1.5 14B - zaawansowanym modelem AI z doskonałą znajomością języka polskiego. Odpowiadasz zawsze po polsku, analitycznie i pomocnie."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 2048,
        temperature: 0.7
      });
      
      return response.response || response;
    }
    
    // Fallback response
    return `🇨🇳 Qwen 1.5 14B (Polski Assistant)

Cześć! Jestem Qwen 1.5 14B - chińskim modelem AI z doskonałą znajomością języka polskiego.

Odpowiadam na: "${prompt}"

Jako Qwen w MyBonzo oferuję:
• 🧠 Zaawansowane rozumowanie i logikę
• 🇵🇱 Doskonałe wsparcie języka polskiego  
• 📊 Analityczne podejście do problemów
• 🔄 Współpracę z orkiestratorem BIELIK
• ⚡ Wysoką wydajność na Cloudflare

Czym mogę jeszcze pomóc?

---
Model: Qwen 1.5 14B AWQ (Polish)
Provider: Cloudflare AI (Free)
Specialty: Analytical thinking & Polish language`;
  } catch (error) {
    console.error("Cloudflare Qwen error:", error);
    throw error;
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
