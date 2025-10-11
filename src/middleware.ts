import { defineMiddleware } from "astro:middleware";

// Nazwy ścieżek, które nie wymagają uwierzytelniania
const PUBLIC_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/login",
  "/api/chat",
  "/api/health",
  "/api/status-check",
  "/api/health-check",
  "/api/mcp-servers",
  "/api/openai-mcp-integration",
  "/api/translate",
  "/api/magic-prompt",
  "/api/generate-image",
  "/api/duckdb",
  "/api/paypal",
  "/api/huggingface",
  "/api/memory-server",
];

// Middleware do weryfikacji tokenów i ustawiania kontekstu klienta
export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.request.url;
  const path = new URL(url).pathname;

  // Ignoruj ścieżki publiczne
  if (
    PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath)) ||
    !path.startsWith("/api/")
  ) {
    return next();
  }

  // Pobierz token z nagłówka
  const authHeader = context.request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Brak autoryzacji: Nieprawidłowy nagłówek." }),
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    // UWAGA: To jest symulacja weryfikacji JWT. W produkcji użyj biblioteki `jose` do weryfikacji podpisu.
    const payloadB64 = token.split(".")[1];
    if (!payloadB64) throw new Error("Nieprawidłowy format tokena.");

    const payload = JSON.parse(atob(payloadB64));

    // Sprawdź datę wygaśnięcia
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new Error("Token wygasł.");
    }

    // Sprawdź, czy token zawiera wymagane dane
    if (!payload.userId || !payload.clientId) {
      throw new Error(
        "Token nie zawiera wymaganych danych (userId, clientId)."
      );
    }

    // Przekaż dane klienta do kontekstu dla innych endpointów API
    (context.locals as any).auth = {
      userId: payload.userId,
      clientId: payload.clientId,
      email: payload.email,
    };

    // Kontynuuj do właściwego endpointu API
    return next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Nieznany błąd tokena.";
    return new Response(
      JSON.stringify({ error: `Błąd autoryzacji: ${errorMessage}` }),
      { status: 401 }
    );
  }
});
