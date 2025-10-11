
import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

interface LeadData {
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
  budget?: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.AI) {
      return createErrorResponse("Środowisko AI nie jest dostępne.", 503);
    }

    const lead = (await request.json()) as LeadData;

    if (!lead.name || !lead.email || !lead.message) {
      return createErrorResponse("Imię, e-mail i wiadomość są wymagane.", 400);
    }

    const systemPrompt = `
      Jesteś ekspertem od analizy i kwalifikacji leadów sprzedażowych (B2B). Twoim zadaniem jest ocena potencjalnego klienta na podstawie dostarczonych danych.
      Przeanalizuj poniższe dane leada i zwróć odpowiedź w formacie JSON. Nie dodawaj żadnych wyjaśnień poza obiektem JSON.

      Twoja analiza musi zawierać 6 pól:
      1.  "leadScore": Oceń leada jako "WYSOKI", "ŚREDNI" lub "NISKI" na podstawie potencjału biznesowego, budżetu i treści wiadomości.
      2.  "priority": Przypisz priorytet od 1 (najniższy) do 5 (najwyższy).
      3.  "category": Skategoryzuj leada, np. "Enterprise", "SMB", "Startup", "Individual", "Partnerstwo".
      4.  "suggestedAction": Zaproponuj konkretne następne działanie dla zespołu sprzedaży, np. "Natychmiastowy telefon", "Dodać do kampanii nurturingowej", "Wysłać ofertę standardową".
      5.  "summary": Podsumuj w jednym zdaniu kluczową potrzebę klienta.
      6.  "reply": Napisz uprzejmą, profesjonalną odpowiedź do klienta po polsku, potwierdzającą otrzymanie zapytania i informującą, że wkrótce się z nim skontaktujemy. Podpisz się jako 'Zespół MyBonzo AI'.

      Oto dane do analizy:
    `;

    const userPrompt = `
      - Imię: ${lead.name}
      - Firma: ${lead.company || 'Nie podano'}
      - E-mail: ${lead.email}
      - Telefon: ${lead.phone || 'Nie podano'}
      - Deklarowany budżet: ${lead.budget || 'Nie określono'}
      - Treść wiadomości: "${lead.message}"
    `;

    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    // Llama może zwrócić JSON w bloku markdown, więc czyścimy go
    const cleanedResponse = aiResponse.response.replace(/```json\n|\n```/g, '');
    const result = JSON.parse(cleanedResponse);

    return createSuccessResponse(result);

  } catch (error) {
    console.error("Błąd w /api/qualify-lead:", error);
    const errorMessage = error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
