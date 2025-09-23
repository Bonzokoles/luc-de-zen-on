globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_BJuaHVI9.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const GET = async () => {
  return createSuccessResponse({
    message: "Gemma Marketing Content API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: 'Send POST request with { prompt: "...", contentType: "..." }',
    model: "gemma-cloudflare"
  });
};
const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { prompt, contentType = "post na social media", temperature = 0.7, language = "pl" } = body;
    if (!prompt?.trim()) {
      return createErrorResponse("Prompt is required", 400);
    }
    const runtime = locals?.runtime;
    const env = runtime?.env;
    const systemPrompt = language === "en" ? `You are an expert AI marketing content generator (type: ${contentType}). Create engaging, professional, and original content.` : `Jesteś ekspertem AI od generowania treści marketingowych (typ: ${contentType}). Twórz angażujące, profesjonalne i oryginalne treści po polsku.`;
    try {
      const aiResponse = await env?.AI?.run("@cf/meta/gemma-7b-it", {
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature,
        max_tokens: 2048
      });
      return createSuccessResponse({
        text: aiResponse?.response || "Brak odpowiedzi z modelu Gemma.",
        model: "gemma-cloudflare",
        message: "Success via Cloudflare AI",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (aiError) {
      console.error("Gemma AI Error:", aiError);
      return createErrorResponse("Failed to process AI request", 500, {
        details: aiError instanceof Error ? aiError.message : "Unknown AI error"
      });
    }
  } catch (error) {
    console.error("Gemma Marketing Content API error:", error);
    return createErrorResponse("Internal server error", 500, {
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
=======
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const POST = async ({ request, locals }) => {
  try {
    const { prompt, contentType } = await request.json();
    const env = locals.runtime.env;
    if (!prompt || !contentType) {
      return createErrorResponse("Missing required fields", 400);
    }
    if (!env.AI) {
      return createErrorResponse("Cloudflare AI nie jest dostępny", 500);
    }
    const systemPrompt = "Jesteś ekspertem marketingu tworzącym angażujące teksty w stylu nowoczesnym i profesjonalnym. Używaj dynamicznego, przystępnego stylu z wyraźnym CTA zachęcającym do działania.";
    const userPrompt = `Napisz ${contentType} na temat: ${prompt}. Użyj stylu: dynamiczny, przystępny, z CTA zachęcającym do działania. Tekst powinien być profesjonalny ale przyjazny.`;
    const response = await env.AI.run(env.ADVANCED_TEXT_MODEL || "@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    });
    const generatedText = response.response;
    return createSuccessResponse({
      success: true,
      text: generatedText,
      contentType,
      prompt
    });
  } catch (error) {
    console.error("Error generating marketing content:", error);
    return createErrorResponse("Failed to generate marketing content", 500);
  }
};
const OPTIONS = createOPTIONSHandler(["POST", "OPTIONS"]);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
