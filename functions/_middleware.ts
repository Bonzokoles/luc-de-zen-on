import sentryPlugin from "@cloudflare/pages-plugin-sentry";

// Sentry middleware - opcjonalny, włącza się tylko gdy SENTRY_DSN skonfigurowany
export const onRequest: PagesFunction = sentryPlugin({
  dsn: "https://placeholder@placeholder.ingest.sentry.io/placeholder",
  environment: "production",
  debug: false,

  // Filtrowanie błędów
  beforeSend(event: any) {
    // Ignoruj błędy od botów i crawlerów
    if (
      event.request?.url?.includes("bot") ||
      event.request?.url?.includes("crawler")
    ) {
      return null;
    }
    return event;
  },

  // Dodatkowe tagi dla każdego błędu
  initialScope: {
    tags: {
      component: "mybonzo-pages",
      version: "1.0.0",
    },
  },
});
