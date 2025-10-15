/**
 * Phi-2 BigQuery Assistant Worker
 * Integruje Microsoft Phi-2 z BigQuery dla polskojęzycznej analizy danych
 */

interface PhiBigQueryRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  bigquery_query?: string;
  use_bigquery?: boolean;
  max_tokens?: number;
  temperature?: number;
}

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    if (request.method === "POST") {
      try {
        const requestData: PhiBigQueryRequest = await request.json();
        const { messages, bigquery_query, use_bigquery = false } = requestData;

        let contextData = "";
        
        // Jeśli używamy BigQuery, wykonaj zapytanie najpierw
        if (use_bigquery && bigquery_query) {
          try {
            // BigQuery API call - placeholder for now
            const bigqueryResponse = await fetch("https://bigquery.googleapis.com/bigquery/v2/projects/your-project/queries", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${env.BIGQUERY_TOKEN}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                query: bigquery_query,
                useLegacySql: false
              })
            });
            
            if (bigqueryResponse.ok) {
              const data: any = await bigqueryResponse.json();
              contextData = `\n\nDane z BigQuery:\n${JSON.stringify(data.rows, null, 2)}`;
            }
          } catch (bigqueryError) {
            console.error("BigQuery error:", bigqueryError);
            contextData = "\n\nBłąd połączenia z BigQuery.";
          }
        }

        // Przygotuj wiadomości dla Phi-2 z polskim kontekstem
        const phiMessages = [
          {
            role: "system" as const,
            content: `Jesteś Phi-2 - inteligentny asystent AI firmy Microsoft w systemie ZENON. 
            Specjalizujesz się w analizie danych i odpowiadasz wyłącznie w języku polskim.
            Jesteś zwięzły, konkretny i pomocny. Gdy analizujesz dane, przedstawiasz kluczowe wnioski.
            ${contextData ? "Masz dostęp do danych z BigQuery - używaj ich w swojej analizie." : ""}
            
            Kontekst systemu ZENON:
            - Jesteś częścią większego systemu AI
            - Współpracujesz z innymi modelami jak Bielik
            - Twoja specjalność to szybka analiza danych i konkretne odpowiedzi`
          },
          ...messages
        ];

        // Dodaj kontekst BigQuery na końcu ostatniej wiadomości jeśli istnieje
        if (contextData && phiMessages.length > 1) {
          const lastMessage = phiMessages[phiMessages.length - 1];
          lastMessage.content += contextData;
        }

        // Wywołaj Phi-2 przez CF AI
        const aiResponse = await env.AI.run("@cf/microsoft/phi-2", {
          messages: phiMessages,
          max_tokens: requestData.max_tokens || 512,
          temperature: requestData.temperature || 0.7
        });

        return new Response(JSON.stringify({
          success: true,
          response: aiResponse.response || "Nie udało się wygenerować odpowiedzi.",
          model: "phi-2",
          provider: "cloudflare-ai",
          language: "pl",
          assistant: "phi-bigquery-zenon",
          bigquery_used: use_bigquery,
          context_length: contextData.length,
          system: "ZENON",
          rate_limit: "720 requests/min"
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });

      } catch (error) {
        console.error("Phi-2 BigQuery ZENON error:", error);
        return new Response(JSON.stringify({
          error: "Phi-2 BigQuery ZENON error",
          details: (error as Error)?.message || "Unknown error",
          system: "ZENON"
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
    }

    // GET endpoint - informacje o asystencie ZENON
    if (request.method === "GET") {
      return new Response(JSON.stringify({
        name: "Phi-2 BigQuery Assistant ZENON",
        model: "@cf/microsoft/phi-2",
        features: ["BigQuery integration", "Polish language", "Data analysis", "ZENON system"],
        status: "ready",
        rate_limit: "720 requests/min",
        system: "ZENON",
        version: "1.0.0",
        description: "Microsoft Phi-2 zintegrowany z BigQuery dla systemu ZENON"
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    return new Response(JSON.stringify({
      error: "Method not allowed",
      system: "ZENON"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};
