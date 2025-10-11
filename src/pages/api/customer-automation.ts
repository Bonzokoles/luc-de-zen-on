import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

interface CustomerRequest {
  customerMessage: string;
  requestType: string;
  customerContext?: string;
}

const automationTypes: Record<string, string> = {
  support: "Odpowiedz na zapytanie klienta w sposób pomocny i profesjonalny.",
  complaint: "Zajmij się reklamacją klienta z empatią i przedstaw rozwiązania.",
  inquiry: "Odpowiedz na pytanie informacyjne klienta szczegółowo.",
  lead_qualification:
    "Przeprowadź kwalifikację leada i oceń potencjał sprzedażowy.",
  follow_up: "Stwórz follow-up dla klienta po wcześniejszej interakcji.",
  feedback: "Poproś o feedback i odpowiedz na otrzymane opinie.",
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.AI) {
      return createErrorResponse("Środowisko AI nie jest dostępne.", 503);
    }

    const body = (await request.json()) as CustomerRequest;
    const { customerMessage, requestType, customerContext } = body;

    if (!customerMessage || !requestType) {
      return createErrorResponse(
        "Parametry 'customerMessage' i 'requestType' są wymagane.",
        400
      );
    }

    const basePrompt =
      automationTypes[requestType] ||
      "Odpowiedz na zapytanie klienta profesjonalnie.";
    const contextInfo = customerContext
      ? `\n\nKontekst klienta: ${customerContext}`
      : "";

    const systemPrompt = `Jesteś doświadczonym specjalistą obsługi klienta firmy MyBonzo AI. ${basePrompt}

Zasady:
- Zawsze bądź uprzejmy i profesjonalny
- Oferuj konkretne rozwiązania
- Jeśli nie możesz pomóc, przekieruj do odpowiedniego działu
- Używaj pozytywnego i pomocnego tonu
- W przypadku problemów technicznych, zaproponuj pierwsze kroki rozwiązania${contextInfo}`;

    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Wiadomość klienta: "${customerMessage}"\nTyp zapytania: ${requestType}`,
        },
      ],
      max_tokens: 1024,
      temperature: 0.6,
    });

    const response = aiResponse.response || "AI nie wygenerowało odpowiedzi.";

    return createSuccessResponse({
      response,
      requestType,
      customerMessage,
      modelUsed: "@cf/meta/llama-3.1-8b-instruct",
    });
  } catch (error) {
    console.error("Błąd w /api/customer-automation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
