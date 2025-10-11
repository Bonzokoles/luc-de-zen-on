import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../../utils/corsUtils";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.DB) {
      return createErrorResponse("Baza danych D1 nie jest dostępna.", 503);
    }

    const requestData = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const { email, password } = requestData;

    if (!email || !password) {
      return createErrorResponse("E-mail i hasło są wymagane.", 400);
    }

    // 1. Znajdź użytkownika w bazie danych
    const user = await env.DB.prepare("SELECT * FROM Users WHERE email = ?")
      .bind(email)
      .first();

    if (!user) {
      return createErrorResponse("Nieprawidłowy e-mail lub hasło.", 401);
    }

    // 2. Sprawdź hasło
    // UWAGA: To jest symulacja weryfikacji hasła. W produkcji należy użyć `bcrypt.compare()`.
    const simulatedHash = `hashed_${password}`;
    if (user.password_hash !== simulatedHash) {
      return createErrorResponse("Nieprawidłowy e-mail lub hasło.", 401);
    }

    // 3. Wygeneruj symulowany token JWT
    // UWAGA: To nie jest bezpieczny, podpisany token JWT. W produkcji użyj biblioteki `jose` lub podobnej.
    const payload = {
      userId: user.id,
      clientId: user.client_id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // Token ważny 8 godzin
    };

    const header = { alg: "NONE", typ: "JWT" };
    const simulatedToken = `${btoa(JSON.stringify(header))}.${btoa(
      JSON.stringify(payload)
    )}.`;

    return createSuccessResponse({
      message: "Logowanie pomyślne!",
      token: simulatedToken,
    });
  } catch (error) {
    console.error("Błąd w /api/auth/login:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
