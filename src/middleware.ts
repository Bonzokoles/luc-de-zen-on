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
  "/api/generate-marketing-content",
  "/api/personalized-recommendations",
  "/api/customer-automation",
  "/api/activity-monitoring",
  "/api/duckdb",
  "/api/paypal",
  "/api/huggingface",
  "/api/memory-server",
  "/api/bigquery",
  "/api/voice/process",
  "/api/music/library",
  "/api/music/log-play",
  "/api/music/upload",
  "/api/test/simple",
  "/api/tavi",
  "/api/tavily",
  "/api/kaggle",
  "/api/deepseek-search",
  "/api/bielik-chat",
  "/api/polaczek-chat",
  "/api/mybonzo-chat",
  "/api/test-connections",
  "/api/test-secrets",
  "/api/admin/db-schema",
  "/api/admin/get-token",
  "/api/admin/debug",
  "/api/admin/setup-database",
  "/api/debug-env",
  "/api/image-generator/generate",
  "/api/image-generator/history",
  "/api/image-generator/styles",
  "/api/generate-image",
  "/api/enhanced-generator",
  "/api/voice/synthesis",
  "/api/voice/recognition",
  "/api/generate-hf",
  "/api/bielik-polish",
  "/api/bielik-polish-new",
  "/api/bielik-polish-clean",
  "/api/bielik-analytics",
  "/api/bielik-orchestrator",
  "/api/bielik-voice",
  "/api/voice-handler",
  "/api/workers-status",
  "/api/enhance-prompt",
  "/api/wildcards",
  "/api/system/status",
  "/api/agents/webmaster",
  "/api/agents/security",
  "/api/agents/analytics",
  "/api/agents/content",
  "/api/agents/customer",
  "/api/ai/models",
  "/api/ai/chat",
  "/api/ai/generate",
  "/api/bigquery/query",
  "/api/bigquery/datasets",
  "/api/kaggle/search",
  "/api/kaggle/download",
  "/api/tavily/search",
  "/api/voice/process",
  "/api/voice/synthesis",
  "/api/voice/recognition",
  "/api/voice-ai/chat",
  "/api/voice-ai/transcribe",
  "/api/voice-assistant/process",
  "/api/activity-monitor",
  "/api/activity-monitoring",
  "/api/get-recommendations",
  "/api/qualify-lead",
  "/api/reminders",
  "/api/faq",
  "/api/education-recommendations",
  "/api/tickets",
  "/api/quiz",
  "/api/polaczek-agents",
  "/api/polaczek-config",
  "/api/polaczek/quiz/speech",
  "/api/gemini-pro",
  "/api/gemma-polish",
  "/api/llama-polish",
  "/api/mistral-polish",
  "/api/qwen-polish",
  "/api/openrouter-chat",
  "/api/enhanced-chat",
  "/api/generic-chat",
  "/api/code-bison",
  "/api/text-bison",
  "/api/google-bard",
  "/api/usage-stats",
  "/api/my-features",
  "/api/my-secrets",
  "/api/errors",
  "/api/learning",
  "/api/search",
  "/api/data-analyze",
  "/api/generate-content",
  "/api/generate-blog",
  "/api/photo-to-photo",
  "/api/flowise",
  "/api/activepieces",
  "/api/ai-business-box",
  "/api/send-report",
  "/api/calendar",
  "/api/calendar-events",
  "/api/crm-status",
  "/api/crm-action",
  "/api/auto-response",
  "/api/vertex-ai-catalog",
  "/api/google-sheets-catalog",
  "/api/ticket-classifier",
  "/api/quiz-engine",
  "/api/quiz-feedback",
  "/api/faq-generator",
  "/api/agent",
  "/api/agents",
  "/api/agents-search",
  "/api/ai-workers",
  "/api/ai-bot-worker",
  "/api/mcp-servers",
  "/api/data-collector",
  "/api/activity-stream",
  "/api/recommendations",
  "/api/customer-automation",
  "/api/personalized-recommendations",
  "/api/api-list",
  "/api/webmaster/tools",
  "/api/payment/webhook",
  "/api/google-cloud/auth",
  "/api/test",
  "/api/test-tavily",
  "/api/test-deepseek-kaggle",
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

  // Sprawdź hasła bezpośrednie
  if (token === "HAOS77") {
    // Hasło admina - pełny dostęp
    (context.locals as any).auth = {
      userId: "admin",
      clientId: "admin",
      email: "admin@mybonzo.com",
      role: "admin",
      access: "full",
    };
    return next();
  }

  if (token === "ZENON2015AI") {
    // Hasło użytkownika - pełny dostęp do funkcji AI
    (context.locals as any).auth = {
      userId: "user",
      clientId: "user",
      email: "user@mybonzo.com",
      role: "user",
      access: "full",
    };
    return next();
  }

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
