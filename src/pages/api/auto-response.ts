
import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

interface AutoResponseRequest {
  responseType: string;
  leadScore: number;
  industry: string;
  tone: 'professional' | 'friendly' | 'urgent';
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.AI) {
      return createErrorResponse("Środowisko AI nie jest dostępne.", 503);
    }

    const body = (await request.json()) as AutoResponseRequest;
    const { responseType, leadScore, industry, tone } = body;

    if (!responseType || leadScore === undefined || !industry || !tone) {
      return createErrorResponse("Brak wszystkich wymaganych parametrów.", 400);
    }

    // --- Dynamiczny System Prompt ---
    const systemPrompt = `
      Jesteś światowej klasy agentem obsługi klienta w firmie technologicznej MyBonzo. Twoim zadaniem jest napisanie spersonalizowanej odpowiedzi e-mail do potencjalnego klienta.

      Oto kontekst zapytania:
      - Rodzaj zapytania: ${responseType}
      - Ocena leada (0-100): ${leadScore} (im wyższa, tym ważniejszy lead)
      - Branża klienta: ${industry}
      - Wymagany ton odpowiedzi: ${tone}

      Instrukcje:
      1.  Zwróć tylko i wyłącznie treść e-maila, bez tematu i dodatkowych nagłówków.
      2.  Dostosuj treść do oceny leada. Dla leadów 'HOT' (score > 80) zaproponuj natychmiastowy kontakt. Dla leadów 'WARM' (40-79) skup się na dostarczeniu wartości i edukacji. Dla leadów 'COLD' (< 40) podziękuj i dodaj do newslettera.
      3.  Nawiąż do branży klienta, aby pokazać, że rozumiesz jego specyfikę.
      4.  Zachowaj wskazany ton: ${tone}.
      5.  Odpowiedź napisz w języku polskim.
      6.  Podpisz się jako 'Zespół MyBonzo AI'.
    `;

    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { 
          role: "system", 
          content: systemPrompt 
        },
        {
          role: "user",
          content: `Wygeneruj teraz treść e-maila zgodnie z podanymi wytycznymi.`
        }
      ],
      max_tokens: 768,
      temperature: 0.6,
    });

    const generatedText = aiResponse.response || "AI nie wygenerowało odpowiedzi.";

    return createSuccessResponse({
      text: generatedText,
      modelUsed: "@cf/meta/llama-3.1-8b-instruct",
    });

  } catch (error) {
    console.error("Błąd w /api/auto-response:", error);
    const errorMessage = error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
