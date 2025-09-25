globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

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
    if (!env?.GOOGLE_AI_STUDIO_TOKEN || !env?.CLOUDFLARE_ACCOUNT_ID || !env?.CLOUDFLARE_AI_GATEWAY_ID) {
      return createErrorResponse("Google AI Studio configuration missing", 500);
    }
    const systemPrompt = language === "en" ? "You are Gemini Pro, Google's advanced AI model. Provide helpful, accurate, and detailed responses." : "Jesteś Gemini Pro, zaawansowanym modelem AI Google. Udzielaj pomocnych, dokładnych i szczegółowych odpowiedzi po polsku.";
    const aiGatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.CLOUDFLARE_ACCOUNT_ID}/${env.CLOUDFLARE_AI_GATEWAY_ID}/google-ai-studio/v1/models/gemini-1.5-flash:generateContent`;
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemPrompt}

${message}` }
          ]
        }
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: 2048
      }
    };
    try {
      const response = await fetch(aiGatewayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GOOGLE_AI_STUDIO_TOKEN
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        throw new Error(`Google AI Studio API error: ${response.status}`);
      }
      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Brak odpowiedzi od Gemini Pro.";
      return createSuccessResponse({
        response: aiResponse,
        model: "gemini-1.5-flash",
        message: "Success",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
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
