/**
 * DeepSeek Kaggle Dataset Assistant Worker
 * Integruje duży model językowy z Kaggle datasets dla zaawansowanej analizy danych
 */

interface DeepSeekKaggleRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  dataset_ref?: string;
  competition_id?: string;
  search_query?: string;
  use_kaggle?: boolean;
  max_tokens?: number;
  temperature?: number;
}

interface KaggleDataContext {
  type: 'dataset' | 'competition' | 'search';
  data: any;
  summary: string;
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
        const requestData: DeepSeekKaggleRequest = await request.json();
        const { 
          messages, 
          dataset_ref, 
          competition_id, 
          search_query, 
          use_kaggle = false 
        } = requestData;

        let kaggleContext: KaggleDataContext | null = null;
        
        // Pobierz dane z Kaggle jeśli wymagane
        if (use_kaggle) {
          try {
            if (dataset_ref) {
              // Pobierz szczegóły datasetu
              const datasetResponse = await fetch(`${env.KAGGLE_API_BASE_URL}/datasets/${dataset_ref}`, {
                headers: {
                  "Authorization": `Bearer ${env.KAGGLE_API_TOKEN}`,
                  "Content-Type": "application/json"
                }
              });
              
              if (datasetResponse.ok) {
                const datasetData = await datasetResponse.json();
                kaggleContext = {
                  type: 'dataset',
                  data: datasetData,
                  summary: `Dataset: ${datasetData.title || dataset_ref}\n` +
                          `Rozmiar: ${datasetData.size || 'N/A'}\n` +
                          `Tagi: ${datasetData.tags?.join(', ') || 'Brak'}\n` +
                          `URL: ${datasetData.url || 'N/A'}`
                };
              }
            } else if (competition_id) {
              // Pobierz szczegóły konkursu
              const compResponse = await fetch(`${env.KAGGLE_API_BASE_URL}/competitions/${competition_id}`, {
                headers: {
                  "Authorization": `Bearer ${env.KAGGLE_API_TOKEN}`,
                  "Content-Type": "application/json"
                }
              });
              
              if (compResponse.ok) {
                const compData = await compResponse.json();
                kaggleContext = {
                  type: 'competition',
                  data: compData,
                  summary: `Konkurencja: ${compData.title || competition_id}\n` +
                          `Nagroda: ${compData.reward || 'N/A'}\n` +
                          `Deadline: ${compData.deadline || 'N/A'}\n` +
                          `Kategoria: ${compData.category || 'N/A'}\n` +
                          `Opis: ${compData.description || 'Brak opisu'}`
                };
              }
            } else if (search_query) {
              // Wyszukaj datasety
              const searchResponse = await fetch(`${env.KAGGLE_API_BASE_URL}/datasets/search?q=${encodeURIComponent(search_query)}`, {
                headers: {
                  "Authorization": `Bearer ${env.KAGGLE_API_TOKEN}`,
                  "Content-Type": "application/json"
                }
              });
              
              if (searchResponse.ok) {
                const searchData = await searchResponse.json();
                const topResults = searchData.datasets?.slice(0, 5) || [];
                kaggleContext = {
                  type: 'search',
                  data: searchData,
                  summary: `Wyszukiwanie: "${search_query}"\n` +
                          `Znaleziono: ${searchData.total_count || 0} datasetów\n` +
                          `Top 5 wyników:\n` +
                          topResults.map((d: any, i: number) => 
                            `${i+1}. ${d.title} (${d.ref})`
                          ).join('\n')
                };
              }
            }
          } catch (kaggleError) {
            console.error("Kaggle API error:", kaggleError);
            kaggleContext = {
              type: 'search',
              data: null,
              summary: "Błąd połączenia z Kaggle API"
            };
          }
        }

        // Przygotuj wiadomości dla DeepSeek (używamy większy model CF AI)
        const deepseekMessages = [
          {
            role: "system" as const,
            content: `Jesteś zaawansowany asystent AI w systemie ZENON, specjalizujący się w analizie danych z platformy Kaggle.
            
            TWOJA ROLA:
            - Analizujesz datasety, konkurencje i trendy z Kaggle
            - Odpowiadasz wyłącznie w języku polskim
            - Jesteś ekspertem w machine learning, data science i analizie statystycznej
            - Pomagasz w wyborze odpowiednich datasetów do projektów
            - Sugerujesz strategie dla konkurencji Kaggle
            
            KONTEKST KAGGLE:
            ${kaggleContext ? `Masz dostęp do danych z Kaggle:
            ${kaggleContext.summary}
            
            Analizuj te dane i dostarczaj praktyczne wnioski.` : 'Brak danych z Kaggle w tym zapytaniu.'}
            
            SYSTEM ZENON:
            - Jesteś częścią większego systemu AI
            - Współpracujesz z modelami Phi-2 (BigQuery) i Bielik
            - Twoja specjalność: zaawansowana analiza danych ML/AI
            
            STYL ODPOWIEDZI:
            - Szczegółowy ale zrozumiały
            - Praktyczne rekomendacje
            - Przykłady i przypadki użycia
            - Wskazówki techniczne`
          },
          ...messages
        ];

        // Dodaj kontekst Kaggle do ostatniej wiadomości jeśli istnieje
        if (kaggleContext && deepseekMessages.length > 1) {
          const lastMessage = deepseekMessages[deepseekMessages.length - 1];
          lastMessage.content += `\n\nKontekst Kaggle:\n${kaggleContext.summary}`;
        }

        // Użyj większego modelu - Llama 2 13B lub najlepszy dostępny
        const aiResponse = await env.AI.run("@hf/thebloke/llama-2-13b-chat-awq", {
          messages: deepseekMessages,
          max_tokens: requestData.max_tokens || 1024,
          temperature: requestData.temperature || 0.7
        });

        return new Response(JSON.stringify({
          success: true,
          response: aiResponse.response || "Nie udało się wygenerować odpowiedzi.",
          model: "llama-2-13b-chat-awq",
          provider: "cloudflare-ai",
          language: "pl",
          assistant: "deepseek-kaggle-zenon",
          kaggle_used: use_kaggle,
          kaggle_context: kaggleContext?.type || null,
          context_summary: kaggleContext?.summary || null,
          system: "ZENON",
          specialization: "Kaggle ML/AI Data Analysis",
          rate_limit: "300 requests/min"
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });

      } catch (error) {
        console.error("DeepSeek Kaggle ZENON error:", error);
        return new Response(JSON.stringify({
          error: "DeepSeek Kaggle ZENON error",
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

    // GET endpoint - informacje o asystencie
    if (request.method === "GET") {
      return new Response(JSON.stringify({
        name: "DeepSeek Kaggle Dataset Assistant ZENON",
        model: "@hf/thebloke/llama-2-13b-chat-awq",
        features: [
          "Kaggle datasets integration", 
          "Competition analysis", 
          "Polish language", 
          "ML/AI data science expertise",
          "Advanced statistical analysis",
          "Dataset recommendations"
        ],
        status: "ready",
        rate_limit: "300 requests/min",
        system: "ZENON",
        version: "1.0.0",
        description: "Zaawansowany asystent analizy danych Kaggle z dużym modelem językowym",
        kaggle_capabilities: [
          "Dataset search and analysis",
          "Competition insights", 
          "ML strategy recommendations",
          "Data quality assessment",
          "Feature engineering suggestions"
        ]
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
