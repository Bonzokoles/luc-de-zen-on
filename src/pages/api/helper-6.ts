import {
  createSuccessResponse,
  createErrorResponse,
  createOPTIONSHandler,
} from "../../utils/corsUtils";

type ChatBody = {
  message?: string;
  prompt?: string;
  temperature?: number;
  context?: Record<string, any>;
};

export const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);

export const GET = async () => {
  return createSuccessResponse({
    message: "AI Helper 6 - Creative Writing Assistant API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: "POST { message || prompt, temperature? }",
    features: ["Creative Writing", "Story Generation", "Content Creation"],
    model: "Gemini 1.5 Flash via AI Gateway",
    specialization: "Creative content and storytelling",
  });
};

export const POST = async ({ request }: { request: Request }) => {
  try {
    const body = (await request.json()) as ChatBody;
    const { message, prompt, temperature = 0.8 } = body;

    const userInput = message || prompt;
    if (!userInput || typeof userInput !== "string") {
      return createErrorResponse(
        'Pole "message" lub "prompt" jest wymagane',
        400
      );
    }

    // AI Gateway URL zgodnie z INSTR_4
    const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_ID}/${process.env.CLOUDFLARE_AI_GATEWAY_ID}/google-ai-studio/v1/models/gemini-1.5-flash:generateContent`;

    const systemPrompt = `Jesteś AI Helper 6 - kreatywnym asystentem pisarskim specjalizującym się w:
• Tworzeniu opowiadań i historii
• Generowaniu treści kreatywnych
• Pomocy w pisaniu artykułów
• Burzy mózgów na tematy kreatywne
• Optymalizacji stylu pisania

Odpowiadaj kreatywnie, inspirująco i pomocnie. Używaj polskiego języka domyślnie.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nUżytkownik: ${userInput}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 1000,
      },
    };

    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GOOGLE_API_KEY || "",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google AI Gateway error:", errorText);
      return createErrorResponse(`AI Gateway error: ${response.status}`, 500);
    }

    const data = (await response.json()) as any;
    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Brak odpowiedzi";

    return createSuccessResponse({
      response: aiResponse,
      model: "gemini-1.5-flash",
      service: "Google AI Studio via AI Gateway",
      assistant: "AI Helper 6 - Creative Writing",
      temperature: temperature,
    });
  } catch (error) {
    console.error("AI Helper 6 error:", error);
    return createErrorResponse("Błąd serwera", 500);
  }
};
