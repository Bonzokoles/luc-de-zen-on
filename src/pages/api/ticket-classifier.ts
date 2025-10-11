
import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

interface TicketRequest {
  description: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.AI) {
      return createErrorResponse("Środowisko AI nie jest dostępne.", 503);
    }

    const body = (await request.json()) as TicketRequest;
    const { description } = body;

    if (!description || description.trim().length < 10) {
      return createErrorResponse("Opis zgłoszenia jest zbyt krótki.", 400);
    }

    const systemPrompt = `
      Jesteś inteligentnym systemem do klasyfikacji zgłoszeń (ticketów) w firmie IT. Twoim zadaniem jest analiza opisu problemu i przypisanie mu odpowiednich atrybutów.

      Przeanalizuj poniższy opis zgłoszenia i zwróć odpowiedź w formacie JSON. Nie dodawaj żadnych wyjaśnień poza obiektem JSON.

      Twoja analiza musi zawierać 3 pola:
      1.  "priority": Oceń priorytet jako jeden z: "Niski", "Średni", "Wysoki", "Krytyczny".
      2.  "category": Przypisz jedną z kategorii: "Problem Techniczny", "Zapytanie o Płatność", "Pytanie Ogólne", "Zgłoszenie Błędu", "Prośba o Funkcję".
      3.  "suggested_assignee": Zasugeruj zespół lub osobę do obsługi zgłoszenia: "Wsparcie Techniczne L1", "Dział Płatności", "Obsługa Klienta", "Zespół Deweloperski".

      Oto opis zgłoszenia do analizy:
    `;

    const userPrompt = `"${description}"`;

    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const cleanedResponse = aiResponse.response.replace(/```json\n|\n```/g, '');
    const result = JSON.parse(cleanedResponse);

    if (!result.priority || !result.category || !result.suggested_assignee) {
        return createErrorResponse("AI zwróciło niekompletne dane klasyfikacji.", 500);
    }

    return createSuccessResponse({
        classification: result,
        modelUsed: "@cf/meta/llama-3.1-8b-instruct",
    });

  } catch (error) {
    console.error("Błąd w /api/ticket-classifier:", error);
    const errorMessage = error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
