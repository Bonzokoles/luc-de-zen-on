import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    const auth = (locals as any)?.auth;

    // Middleware powinno zapewnić, że te dane istnieją
    if (!env || !env.DB) {
      return createErrorResponse("Baza danych D1 nie jest dostępna.", 503);
    }
    if (!auth || !auth.clientId) {
      return createErrorResponse("Brak autoryzacji klienta.", 401);
    }

    const { clientId } = auth;

    // Pobierz wszystkie funkcje dostępne dla danego klienta
    const { results } = await env.DB.prepare(
      "SELECT feature_id FROM ClientFeatures WHERE client_id = ? AND is_enabled = 1"
    )
      .bind(clientId)
      .all();

    const enabledFeatures = results
      ? results.map((row: any) => row.feature_id)
      : [];

    // Pobierz informacje o kliencie
    const client = await env.DB.prepare("SELECT name FROM Clients WHERE id = ?")
      .bind(clientId)
      .first();

    return createSuccessResponse({
      clientName: client?.name || "Nieznany Klient",
      enabledFeatures: enabledFeatures,
    });
  } catch (error) {
    console.error("Błąd w /api/my-features:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
