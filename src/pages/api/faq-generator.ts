
import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

interface FAQRequest {
  knowledgeBase: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.AI) {
      return createErrorResponse("Środowisko AI nie jest dostępne.", 503);
    }

    const body = (await request.json()) as FAQRequest;
    const { knowledgeBase } = body;

    if (!knowledgeBase || knowledgeBase.trim().length < 50) {
      return createErrorResponse("Baza wiedzy jest zbyt krótka. Podaj więcej tekstu.", 400);
    }

    const systemPrompt = `
      Jesteś inteligentnym asystentem specjalizującym się w tworzeniu sekcji FAQ (Frequently Asked Questions).
      Twoim zadaniem jest przeanalizowanie dostarczonego tekstu (bazy wiedzy) i wygenerowanie na jego podstawie listy 5 do 10 najistotniejszych pytań i zwięzłych odpowiedzi.
      Odpowiedzi powinny być bezpośrednio oparte na treści z bazy wiedzy.

      Zwróć odpowiedź w formacie JSON, jako obiekt z jednym kluczem "faq", który zawiera tablicę obiektów. Każdy obiekt w tablicy musi mieć dwa klucze: "question" (string) i "answer" (string).
      Przykład: { "faq": [{"question": "Jakie są główne cechy produktu?", "answer": "Główne cechy to..."}] }
      Nie dodawaj żadnych dodatkowych opisów ani wstępów, tylko czysty obiekt JSON.
    `;

    const userPrompt = `Oto baza wiedzy do analizy:\n\n---\n${knowledgeBase}\n---\n\nWygeneruj teraz listę pytań i odpowiedzi FAQ w formacie JSON.`;

    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const cleanedResponse = aiResponse.response.replace(/```json\n|\n```/g, '');
    const result = JSON.parse(cleanedResponse);

    if (!result.faq || !Array.isArray(result.faq)) {
        return createErrorResponse("AI zwróciło nieprawidłowy format danych.", 500);
    }

    return createSuccessResponse({
        faq: result.faq,
        modelUsed: "@cf/meta/llama-3.1-8b-instruct",
    });

  } catch (error) {
    console.error("Błąd w /api/faq-generator:", error);
    const errorMessage = error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
