globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_BJuaHVI9.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const GET = async () => {
  return createSuccessResponse({
    message: "Chat API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: 'Send POST request with { prompt: "your message" }'
  });
};
const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const env = locals.runtime.env;
    if (!env.AI) {
      return createErrorResponse("Cloudflare AI nie jest dostępny", 500, {
        answer: "Przepraszam, system AI jest obecnie niedostępny."
      });
    }
    if (body.usePolaczek || body.model === "polaczek") {
      try {
        const polaczekResponse = await fetch(new URL("/api/polaczek-chat", request.url), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: body.prompt,
            model: body.model || "polaczek",
            temperature: body.temperature,
            language: body.language || "pl"
          })
        });
        if (polaczekResponse.ok) {
          const polaczekData = await polaczekResponse.json();
          return createSuccessResponse({
            answer: polaczekData.data?.answer || polaczekData.answer,
            modelUsed: "polaczek-assistant",
            via: "polaczek-integration"
          });
        }
      } catch (polaczekError) {
        console.warn("Polaczek fallback failed, using regular AI:", polaczekError);
      }
    }
    const language = body.language === "en" ? "en" : "pl";
    const modelId = body.model?.startsWith("@cf/") ? body.model : body.model === "qwen-pl" ? "@cf/qwen/qwen2.5-7b-instruct" : body.model === "llama-8b" ? "@cf/meta/llama-3.1-8b-instruct" : body.model === "gemma" ? "@cf/google/gemma-3-12b-it" : "@cf/google/gemma-3-12b-it";
    const systemPrompt = body.system ?? (language === "en" ? "You are a helpful AI assistant. Answer concisely and clearly." : "Jesteś pomocnym asystentem AI. Odpowiadaj po polsku, w sposób zwięzły, konkretny i zrozumiały. Używaj naturalnego, współczesnego języka polskiego.");
    const response = await env.AI.run(modelId, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: body.prompt }
      ],
      temperature: typeof body.temperature === "number" ? body.temperature : 0.6
    });
    return createSuccessResponse({
      answer: response.response || "Przepraszam, nie udało się wygenerować odpowiedzi.",
      modelUsed: modelId
    });
  } catch (error) {
    console.error("AI_CHAT Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return createErrorResponse(errorMessage, 500, {
      context: "AI_CHAT",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
