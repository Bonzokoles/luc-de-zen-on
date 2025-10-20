import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");
    const dataset = url.searchParams.get("dataset");

    const env = (locals as any)?.runtime?.env;

    // Check if BigQuery is configured
    if (!env?.GOOGLE_CLOUD_PROJECT_ID || !env?.GOOGLE_CLOUD_PRIVATE_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          service: "BigQuery Reports",
          error: "BigQuery nie jest skonfigurowane",
          message: "Brak danych uwierzytelniających Google Cloud",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Pre-built report queries
    const reportType = url.searchParams.get("type") || "daily_stats";
    const reportData = await generateBigQueryReport(env, reportType).catch(
      (error) => {
        console.error("Report generation error:", error);
        throw error;
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        service: "BigQuery Reports",
        reportType: reportType,
        data: reportData,
        timestamp: new Date().toISOString(),
        availableReports: [
          "daily_stats",
          "user_activity",
          "api_usage",
          "error_analytics",
        ],
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("BigQuery Reports Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        service: "BigQuery Reports",
        error: error instanceof Error ? error.message : "Nieznany błąd reports",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

async function generateBigQueryReport(
  env: any,
  reportType: string
): Promise<any> {
  // Mock report data based on type
  switch (reportType) {
    case "daily_stats":
      return {
        title: "Statystyki Dzienne",
        data: [
          { metric: "Unique Users", value: 1250, change: "+8.5%" },
          { metric: "Page Views", value: 4230, change: "+12.3%" },
          { metric: "Sessions", value: 1680, change: "+5.2%" },
          { metric: "Bounce Rate", value: "42.3%", change: "-2.1%" },
        ],
      };
    case "user_activity":
      return {
        title: "Aktywność Użytkowników",
        data: [
          { hour: "00:00", users: 120 },
          { hour: "06:00", users: 340 },
          { hour: "12:00", users: 890 },
          { hour: "18:00", users: 1250 },
        ],
      };
    case "api_usage":
      return {
        title: "Użycie API",
        data: [
          { endpoint: "/api/chat", requests: 3420, errors: 12 },
          { endpoint: "/api/kaggle", requests: 890, errors: 5 },
          { endpoint: "/api/bigquery", requests: 456, errors: 2 },
        ],
      };
    case "error_analytics":
      return {
        title: "Analiza Błędów",
        data: [
          {
            endpoint: "/api/chat",
            last24hErrors: 12,
            topError: "TimeoutError",
          },
          { endpoint: "/api/kaggle", last24hErrors: 5, topError: "AuthError" },
          {
            endpoint: "/api/bigquery",
            last24hErrors: 2,
            topError: "QuotaExceeded",
          },
        ],
      };
    default:
      return { title: "Unknown Report", data: [] };
  }
}
