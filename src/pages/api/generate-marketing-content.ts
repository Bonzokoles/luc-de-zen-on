
import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

// Definicja typów dla przychodzącego żądania
interface GenerateRequest {
  prompt: string;
  contentType: string;
}

// Mapa typów treści na szczegółowe instrukcje dla AI
const contentInstructions = {
  "post na social media": "Napisz krótki, angażujący post na social media (Facebook/Instagram). Użyj emoji i hashtagów.",
  "e-mail marketingowy": "Stwórz profesjonalny e-mail marketingowy z wyraźnym wezwaniem do działania (Call to Action).",
  "opis produktu": "Wygeneruj perswazyjny i szczegółowy opis produktu, który zachęci do zakupu.",
  "artykuł na blog": "Napisz dobrze ustrukturyzowany artykuł na blog (minimum 3 akapity) z interesującym tytułem.",
  "treść reklamowa": "Stwórz krótką, chwytliwą treść reklamową dla kampanii Google Ads lub Facebook Ads.",
  "newsletter": "Napisz treść do newslettera informującego o nowościach lub promocjach.",
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Bezpieczny dostęp do środowiska Cloudflare
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.AI) {
      return createErrorResponse("Środowisko AI nie jest dostępne.", 503);
    }

    const body = (await request.json()) as GenerateRequest;
    const { prompt, contentType } = body;

    if (!prompt || !contentType) {
      return createErrorResponse("Parametry 'prompt' i 'contentType' są wymagane.", 400);
    }

    // Wybór instrukcji dla AI
    const instruction = contentInstructions[contentType] || "Napisz profesjonalną treść marketingową.";

    // Stworzenie systemowego promptu dla modelu AI
    const systemPrompt = `Jesteś światowej klasy ekspertem od marketingu i copywritingu posługującym się biegle językiem polskim. Twoim zadaniem jest tworzenie angażujących i skutecznych treści. ${instruction}`;

    // Wywołanie modelu AI (Llama 3.1 jest dobrym wyborem do tego zadania)
    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Temat: "${prompt}"` },
      ],
      max_tokens: 1024, // Zwiększony limit dla dłuższych form jak artykuły
      temperature: 0.7, // Optymalna kreatywność
    });

    const generatedText = aiResponse.response || "AI nie wygenerowało odpowiedzi.";

    return createSuccessResponse({
      text: generatedText,
      modelUsed: "@cf/meta/llama-3.1-8b-instruct",
    });

  } catch (error) {
    console.error("Błąd w /api/generate-marketing-content:", error);
    const errorMessage = error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
