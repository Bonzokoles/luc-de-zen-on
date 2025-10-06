globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const GET = async () => {
  return createSuccessResponse({
    message: "Translator API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: "Send POST with { text, from?, to? }",
    supportedLanguages: {
      pl: "Polish",
      en: "English",
      de: "German",
      fr: "French",
      es: "Spanish",
      it: "Italian"
    }
  });
};
const POST = async ({ request, locals }) => {
  const runtime = locals?.runtime;
  if (!runtime?.env?.DEEPSEEK_API_KEY) {
    return createErrorResponse("Translation service is not configured.", 500);
  }
  try {
    const body = await request.json();
    const { text, from = "pl", to = "en" } = body ?? {};
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return createErrorResponse(
        "Valid text is required for translation.",
        400
      );
    }
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${runtime.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the given text from ${from} to ${to}. Return only the translated text, nothing else.`
            },
            {
              role: "user",
              content: text
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        })
      }
    );
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }
    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim();
    if (!translatedText) {
      throw new Error("No translation received from AI");
    }
    return createSuccessResponse({
      originalText: text,
      translatedText,
      from,
      to,
      provider: "DeepSeek"
    });
  } catch (error) {
    console.error("Translation API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Translation failed";
    return createErrorResponse(errorMessage, 500);
  }
};
const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
