import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

interface MonitoringRequest {
  activityData: string;
  analysisType: string;
  timeframe?: string;
}

const analysisTypes: Record<string, string> = {
  performance: "Przeanalizuj wydajność i metryki aktywności.",
  usage_patterns: "Zbadaj wzorce użytkowania i zachowania użytkowników.",
  anomaly_detection: "Wykryj anomalie i nietypowe aktywności.",
  trend_analysis: "Przeprowadź analizę trendów i przewidywania.",
  efficiency: "Oceń efektywność procesów i operacji.",
  user_engagement: "Przeanalizuj poziom zaangażowania użytkowników.",
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.AI) {
      return createErrorResponse("Środowisko AI nie jest dostępne.", 503);
    }

    const body = (await request.json()) as MonitoringRequest;
    const { activityData, analysisType, timeframe } = body;

    if (!activityData || !analysisType) {
      return createErrorResponse(
        "Parametry 'activityData' i 'analysisType' są wymagane.",
        400
      );
    }

    const basePrompt =
      analysisTypes[analysisType] || "Przeprowadź analizę danych aktywności.";
    const timeInfo = timeframe ? `\n\nRamki czasowe: ${timeframe}` : "";

    const systemPrompt = `Jesteś ekspertem w analizie danych i monitorowaniu aktywności. ${basePrompt}

Zadania:
- Przeanalizuj przedstawione dane
- Wyciągnij kluczowe wnioski i insights
- Zidentyfikuj wzorce i trendy
- Zaproponuj rekomendacje działań
- Przedstaw wyniki w przejrzystej formie
- Wskaż potencjalne obszary optymalizacji${timeInfo}`;

    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Dane do analizy: "${activityData}"\nTyp analizy: ${analysisType}`,
        },
      ],
      max_tokens: 1024,
      temperature: 0.5,
    });

    const analysis = aiResponse.response || "AI nie przeprowadziło analizy.";

    return createSuccessResponse({
      analysis,
      analysisType,
      timeframe: timeframe || "nie określono",
      dataProcessed: activityData.length,
      modelUsed: "@cf/meta/llama-3.1-8b-instruct",
    });
  } catch (error) {
    console.error("Błąd w /api/activity-monitoring:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
