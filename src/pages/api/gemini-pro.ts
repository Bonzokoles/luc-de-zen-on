import type { APIRoute } from "astro";
import {
  createOPTIONSHandler,
  createErrorResponse,
  createSuccessResponse,
} from "../../utils/corsUtils";

// Google AI / Vertex AI Gemini Pro endpoint
export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: "Gemini Pro API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: 'Send POST request with { message: "your prompt" }',
    model: "gemini-pro",
  });
};

export const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = (await request.json()) as any;
    const { message, temperature = 0.7, language = "pl" } = body;

    if (!message?.trim()) {
      return createErrorResponse("Message is required", 400);
    }

    // Google AI Studio przez Cloudflare AI Gateway zgodnie z INSTR_4
    const runtime = (locals as any)?.runtime;
    const env = runtime?.env;

    if (
      !env?.GOOGLE_AI_STUDIO_TOKEN ||
      !env?.CLOUDFLARE_ACCOUNT_ID ||
      !env?.CLOUDFLARE_AI_GATEWAY_ID
    ) {
      return createErrorResponse("Google AI Studio configuration missing", 500);
    }

    const systemPrompt =
      language === "en"
        ? "You are Gemini Pro, Google's advanced AI model. Provide helpful, accurate, and detailed responses."
        : "Jesteś Gemini Pro, zaawansowanym modelem AI Google. Udzielaj pomocnych, dokładnych i szczegółowych odpowiedzi po polsku.";

    // AI Gateway URL zgodnie z INSTR_4
    const aiGatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.CLOUDFLARE_ACCOUNT_ID}/${env.CLOUDFLARE_AI_GATEWAY_ID}/google-ai-studio/v1/models/gemini-1.5-flash:generateContent`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n${message}` }],
        },
      ],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 2048,
      },
    };

    try {
      const response = await fetch(aiGatewayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GOOGLE_AI_STUDIO_TOKEN,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Google AI Studio API error: ${response.status}`);
      }

      const data = (await response.json()) as any;
      const aiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Brak odpowiedzi od Gemini Pro.";

      return createSuccessResponse({
        response: aiResponse,
        model: "gemini-1.5-flash",
        message: "Success",
        timestamp: new Date().toISOString(),
      });
    } catch (aiError) {
      console.error("AI Error:", aiError);
      return createErrorResponse("Failed to process AI request", 500, {
        details: (aiError as any).message || "Unknown AI error",
      });
    }
  } catch (error) {
    console.error("Gemini Pro API error:", error);
    return createErrorResponse("Internal server error", 500, {
      details: (error as any).message || "Unknown error",
    });
  }
};
