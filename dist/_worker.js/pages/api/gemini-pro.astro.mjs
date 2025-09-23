globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_BJuaHVI9.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const GET = async () => {
  return createSuccessResponse({
    message: "Gemini Pro API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: 'Send POST request with { message: "your prompt" }',
    model: "gemini-pro"
  });
};
const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { message, temperature = 0.7, language = "pl" } = body;
    if (!message?.trim()) {
      return createErrorResponse("Message is required", 400);
    }
    const runtime = locals?.runtime;
    const env = runtime?.env;
    const systemPrompt = language === "en" ? "You are Gemini Pro simulation running on Cloudflare AI. Provide helpful, accurate, and detailed responses." : "Jesteś Gemini Pro działający na Cloudflare AI. Udzielaj pomocnych, dokładnych i szczegółowych odpowiedzi po polsku.";
    const fullPrompt = `${systemPrompt}

User: ${message}`;
    try {
      const aiResponse = await env?.AI?.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature,
        max_tokens: 2048
      });
      return createSuccessResponse({
        response: aiResponse?.response || "Gemini Pro (Cloudflare AI) - Witaj! Jestem gotowy do pomocy.",
        model: "gemini-pro-cf-simulation",
        message: "Success via Cloudflare AI",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        fallback: true
      });
    } catch (aiError) {
      console.error("AI Error:", aiError);
      return createErrorResponse("Failed to process AI request", 500, {
        details: aiError instanceof Error ? aiError.message : "Unknown AI error"
      });
    }
  } catch (error) {
    console.error("Gemini Pro API error:", error);
    return createErrorResponse("Internal server error", 500, {
      details: error instanceof Error ? error.message : "Unknown error"
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
