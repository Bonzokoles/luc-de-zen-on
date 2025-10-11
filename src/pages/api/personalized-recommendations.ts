import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

interface RecommendationRequest {
  userPreferences: string;
  category: string;
  context?: string;
}

const categoryPrompts: Record<string, string> = {
  produkty:
    "Zaproponuj personalizowane rekomendacje produktów na podstawie preferencji użytkownika.",
  usługi: "Zasugeruj odpowiednie usługi dopasowane do potrzeb użytkownika.",
  treści: "Rekomenduj treści, artykuły lub zasoby edukacyjne.",
  rozrywka: "Zaproponuj filmy, książki, gry lub inne formy rozrywki.",
  zakupy: "Pomóż w wyborze produktów do zakupu na podstawie preferencji.",
  edukacja: "Zasugeruj kursy, szkolenia lub materiały edukacyjne.",
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.AI) {
      return createErrorResponse("Środowisko AI nie jest dostępne.", 503);
    }

    const body = (await request.json()) as RecommendationRequest;
    const { userPreferences, category, context } = body;

    if (!userPreferences || !category) {
      return createErrorResponse(
        "Parametry 'userPreferences' i 'category' są wymagane.",
        400
      );
    }

    const basePrompt =
      categoryPrompts[category] || "Stwórz personalizowane rekomendacje.";
    const contextInfo = context ? `\n\nDodatkowy kontekst: ${context}` : "";

    const systemPrompt = `Jesteś ekspertem w dziedzinie personalizowanych rekomendacji. ${basePrompt} 
    
Analizuj preferencje użytkownika i przedstaw konkretne, praktyczne rekomendacje z uzasadnieniem. 
Uwzględnij różnorodność opcji i poziomy zaawansowania.${contextInfo}`;

    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Preferencje użytkownika: "${userPreferences}"\nKategoria: ${category}`,
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const recommendations =
      aiResponse.response || "AI nie wygenerowało rekomendacji.";

    return createSuccessResponse({
      recommendations,
      category,
      userPreferences,
      modelUsed: "@cf/meta/llama-3.1-8b-instruct",
    });
  } catch (error) {
    console.error("Błąd w /api/personalized-recommendations:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
