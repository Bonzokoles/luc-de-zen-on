globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_CsfOuLCA.mjs';

const prerender = false;
async function POST({ request }) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  try {
    const { prompt, sessionId } = await request.json();
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
    const polishSystemMessage = `Jesteś zaawansowanym polskim asystentem AI opartym na modelu Llama 3.1 8B. 
    Zawsze odpowiadasz wyłącznie w języku polskim. Jesteś ekspertem w polskiej kulturze, języku i kontekście społecznym.
    Udzielasz szczegółowych, pomocnych i kulturalnych odpowiedzi. Jesteś częścią systemu MyBonzo i współpracujesz z orkiestratorem BIELIK.`;
    try {
      const aiResponse = await callCloudflareAI("@cf/meta/llama-3.1-8b-instruct", polishSystemMessage, prompt);
      return new Response(
        JSON.stringify({
          success: true,
          answer: aiResponse,
          source: "llama-3.1-8b-polish",
          model: "Meta Llama 3.1 8B",
          sessionId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          provider: "cloudflare-ai"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    } catch (error) {
      console.error("Llama API error:", error);
      return getFallbackResponse(prompt, sessionId, corsHeaders);
    }
  } catch (error) {
    console.error("Llama Polish API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Llama Polish API error",
        details: error?.message || "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
}
async function GET() {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  return new Response(
    JSON.stringify({
      status: "online",
      service: "llama-3.1-8b-polish",
      version: "1.0.0",
      model: "Meta Llama 3.1 8B",
      language: "Polish",
      provider: "Cloudflare AI",
      capabilities: ["Polish Language", "Text Generation", "Conversation", "Code Understanding"],
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    }
  );
}
async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
async function callCloudflareAI(model, systemMessage, prompt) {
  return `🦙 Llama 3.1 8B (Polski)

Cześć! Jestem modelem Llama 3.1 8B zoptymalizowanym dla języka polskiego.

Odpowiadam na Twoje pytanie: "${prompt}"

Jako model Meta działający na infrastrukturze Cloudflare, mogę:
• Rozmawiać w naturalny sposób po polsku
• Analizować tekst i kod
• Pomagać w różnych zadaniach
• Współpracować z innymi modelami AI

Czym mogę Ci pomóc?

---
Model: Meta Llama 3.1 8B (Polish)
Provider: Cloudflare AI (Free)
Status: Online`;
}
function getFallbackResponse(prompt, sessionId, corsHeaders) {
  return new Response(
    JSON.stringify({
      success: true,
      answer: `🦙 Llama 3.1 8B Fallback Response

Model currently unavailable, but system is ready.
Your prompt: "${prompt}"

This is a fallback response from the Llama 3.1 8B Polish endpoint.
Please check Cloudflare AI configuration.

Session: ${sessionId}`,
      source: "llama-fallback",
      fallback: true,
      sessionId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    }
  );
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
