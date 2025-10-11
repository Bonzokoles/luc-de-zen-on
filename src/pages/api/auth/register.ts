import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../../utils/corsUtils";

// UWAGA: Ten endpoint jest narzędziem deweloperskim do łatwego tworzenia klientów i użytkowników.
// W systemie produkcyjnym powinien zostać usunięty lub zabezpieczony.

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.DB) {
      return createErrorResponse("Baza danych D1 nie jest dostępna.", 503);
    }

    const requestData = (await request.json()) as {
      clientName?: string;
      userEmail?: string;
      userPassword?: string;
    };
    const { clientName, userEmail, userPassword } = requestData;

    if (!clientName || !userEmail || !userPassword) {
      return createErrorResponse(
        "clientName, userEmail i userPassword są wymagane.",
        400
      );
    }

    // 1. Stwórz nowego klienta (firmę)
    const clientId = `client_${Date.now()}`;
    const clientInsertResult = await env.DB.prepare(
      "INSERT INTO Clients (id, name, created_at) VALUES (?, ?, ?)"
    )
      .bind(clientId, clientName, new Date().toISOString())
      .run();

    if (!clientInsertResult.success) {
      return createErrorResponse("Nie udało się utworzyć klienta.", 500);
    }

    // 2. Stwórz nowego użytkownika i przypisz go do klienta
    const userId = `user_${Date.now()}`;

    // UWAGA: Symulacja hashowania hasła. W produkcji użyj biblioteki jak bcrypt.
    const passwordHash = `hashed_${userPassword}`;

    const userInsertResult = await env.DB.prepare(
      "INSERT INTO Users (id, email, password_hash, client_id) VALUES (?, ?, ?, ?)"
    )
      .bind(userId, userEmail, passwordHash, clientId)
      .run();

    if (!userInsertResult.success) {
      // W razie błędu można by usunąć stworzonego wcześniej klienta (rollback)
      return createErrorResponse("Nie udało się utworzyć użytkownika.", 500);
    }

    // 3. Domyślnie włącz wszystkie funkcje dla nowego klienta
    const features = [
      "image_generator",
      "chatbot",
      "bigquery_analytics",
      "customer_automation",
    ]; // Przykładowe funkcje
    const stmt = env.DB.prepare(
      "INSERT INTO ClientFeatures (client_id, feature_id, is_enabled) VALUES (?, ?, 1)"
    );
    const batch = features.map((feature) => stmt.bind(clientId, feature));
    await env.DB.batch(batch);

    return createSuccessResponse({
      message: "Klient i użytkownik zostali pomyślnie utworzeni.",
      clientId,
      userId,
      userEmail,
    });
  } catch (error) {
    console.error("Błąd w /api/auth/register:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
