import type { APIRoute } from "astro";

interface RequestBody {
  query?: string;
  agents?: string[];
  translate?: boolean;
  orchestrate?: boolean;
  dateRange?: string;
  fileType?: string;
  siteSearch?: string;
}

// Enhanced search API with POLACZEK Agents orchestration
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body: RequestBody = await request.json();
    const {
      query,
      agents = [],
      translate = false,
      orchestrate = false,
      dateRange,
      fileType,
      siteSearch,
    } = body;

    if (!query?.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Brak zapytania wyszukiwania",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get Cloudflare AI runtime
    const runtime = (locals as any)?.runtime;
    const AI = runtime?.env?.AI;
    const TAVILY_API_KEY = runtime?.env?.TAVILY_API_KEY;

    let results: any = {
      success: true,
      query: query,
      agents_used: agents,
      timestamp: new Date().toISOString(),
    };

    // Step 1: POLACZEK_D Orchestration (if requested)
    if (orchestrate && agents.includes("POLACZEK_D")) {
      try {
        const orchestrationPrompt = `Jako POLACZEK_D (Dyrektor), zaplanuj strategię wyszukiwania dla zapytania: "${query}"

Dostępne agenci:
- POLACZEK_T: Tłumacz i lokalizator
- POLACZEK_B: Bibliotekarz i manager wiedzy  
- POLACZEK_M1: Manager zadań i workflow

Stwórz plan działania w formacie:
1. Analiza zapytania
2. Podział zadań między agentów
3. Kolejność wykonania
4. Oczekiwane rezultaty

Odpowiedz w języku polskim, konkretnie i praktycznie.`;

        const orchestrationResponse = await AI.run(
          "@cf/qwen/qwen1.5-7b-chat-awq",
          {
            messages: [
              {
                role: "system",
                content:
                  "Jesteś POLACZEK_D - głównym dyrektorem agentów AI. Planujesz i koordynujesz działania innych agentów.",
              },
              {
                role: "user",
                content: orchestrationPrompt,
              },
            ],
            temperature: 0.3,
          }
        );

        results.orchestration = {
          agent: "POLACZEK_D",
          plan: orchestrationResponse.response || "Plan utworzony",
          status: "completed",
        };
      } catch (error) {
        results.orchestration = {
          agent: "POLACZEK_D",
          error: "Błąd orchestracji: " + (error as Error).message,
          status: "failed",
        };
      }
    }

    // Step 2: Tavily Search Integration
    try {
      if (TAVILY_API_KEY) {
        const tavilyResponse = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Key": TAVILY_API_KEY,
          },
          body: JSON.stringify({
            query: query,
            search_depth: "advanced",
            include_answer: true,
            include_raw_content: false,
            max_results: 5,
            include_domains: siteSearch ? [siteSearch] : [],
            exclude_domains: [],
            date_range: dateRange,
            file_type: fileType,
          }),
        });

        if (tavilyResponse.ok) {
          const tavilyData = (await tavilyResponse.json()) as {
            results?: any[];
            answer?: string;
          };
          results.search_results = tavilyData.results || [];
          results.tavily_answer = tavilyData.answer || null;
        }
      } else {
        // Fallback mock results
        results.search_results = [
          {
            title: `Wyniki dla: ${query}`,
            url: `https://example.com/search?q=${encodeURIComponent(query)}`,
            content: `Znalezione informacje na temat: ${query}. To są przykładowe wyniki wyszukiwania z systemu POLACZEK.`,
            score: 0.95,
          },
          {
            title: `${query} - Dokumentacja`,
            url: `https://docs.example.com/${query
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
            content: `Dokumentacja techniczna dotycząca ${query}. Zawiera szczegółowe informacje i przykłady użycia.`,
            score: 0.87,
          },
        ];
      }
    } catch (error) {
      results.search_error = "Błąd wyszukiwania: " + (error as Error).message;
    }

    // Step 3: POLACZEK_B Knowledge Management
    if (agents.includes("POLACZEK_B")) {
      try {
        const knowledgePrompt = `Jako POLACZEK_B (Bibliotekarz), przeanalizuj i skategoryzuj wyniki wyszukiwania dla zapytania: "${query}"

Wyniki do analizy:
${JSON.stringify(results.search_results, null, 2)}

Wykonaj:
1. Kategoryzację tematyczną
2. Ocenę przydatności (1-10)
3. Ekstraktę kluczowych informacji
4. Rekomendacje dalszych wyszukiwań

Format odpowiedzi: strukturalny, polski, praktyczny.`;

        const knowledgeResponse = await AI.run("@cf/qwen/qwen1.5-7b-chat-awq", {
          messages: [
            {
              role: "system",
              content:
                "Jesteś POLACZEK_B - bibliotekarzem i managerem wiedzy. Analizujesz i kategoryzujesz informacje.",
            },
            {
              role: "user",
              content: knowledgePrompt,
            },
          ],
          temperature: 0.2,
        });

        results.knowledge_analysis = {
          agent: "POLACZEK_B",
          analysis: knowledgeResponse.response || "Analiza wykonana",
          status: "completed",
        };
      } catch (error) {
        results.knowledge_analysis = {
          agent: "POLACZEK_B",
          error: "Błąd analizy: " + (error as Error).message,
          status: "failed",
        };
      }
    }

    // Step 4: POLACZEK_T Translation (if requested)
    if (translate && agents.includes("POLACZEK_T")) {
      try {
        // Check if results contain non-Polish content
        const hasEnglishContent = results.search_results?.some(
          (result: any) =>
            /[a-zA-Z]{10,}/.test(result.content) &&
            !/[ąćęłńóśźż]/i.test(result.content)
        );

        if (hasEnglishContent) {
          const translationPrompt = `Jako POLACZEK_T (Tłumacz), przetłumacz na język polski główne wyniki wyszukiwania:

${results.search_results
  ?.map(
    (r: any, i: number) => `
${i + 1}. ${r.title}
${r.content}
`
  )
  .join("\n")}

Zachowaj znaczenie i kontekst. Podaj płynne, naturalne tłumaczenie.`;

          const translationResponse = await AI.run(
            "@cf/qwen/qwen1.5-7b-chat-awq",
            {
              messages: [
                {
                  role: "system",
                  content:
                    "Jesteś POLACZEK_T - specjalistą od tłumaczeń. Tłumaczysz zachowując kontekst i znaczenie.",
                },
                {
                  role: "user",
                  content: translationPrompt,
                },
              ],
              temperature: 0.1,
            }
          );

          results.translation = {
            agent: "POLACZEK_T",
            translated_content:
              translationResponse.response || "Tłumaczenie wykonane",
            status: "completed",
          };
        }
      } catch (error) {
        results.translation = {
          agent: "POLACZEK_T",
          error: "Błąd tłumaczenia: " + (error as Error).message,
          status: "failed",
        };
      }
    }

    // Step 5: POLACZEK_M1 Workflow Management
    if (agents.includes("POLACZEK_M1")) {
      try {
        const workflowPrompt = `Jako POLACZEK_M1 (Manager), podsumuj i zoptymalizuj wyniki pracy wszystkich agentów dla zapytania: "${query}"

Wykonane zadania:
- Orchestracja: ${results.orchestration ? "TAK" : "NIE"}
- Wyszukiwanie: ${results.search_results ? "TAK" : "NIE"} 
- Analiza wiedzy: ${results.knowledge_analysis ? "TAK" : "NIE"}
- Tłumaczenie: ${results.translation ? "TAK" : "NIE"}

Stwórz:
1. Podsumowanie wykonanej pracy
2. Ocenę jakości wyników
3. Rekomendacje dalszych działań
4. Metryki wydajności

Format: zwięzły, polski, praktyczny.`;

        const workflowResponse = await AI.run("@cf/qwen/qwen1.5-7b-chat-awq", {
          messages: [
            {
              role: "system",
              content:
                "Jesteś POLACZEK_M1 - managerem workflow. Koordynujesz i optymalizujesz pracę zespołu.",
            },
            {
              role: "user",
              content: workflowPrompt,
            },
          ],
          temperature: 0.4,
        });

        results.workflow_summary = {
          agent: "POLACZEK_M1",
          summary: workflowResponse.response || "Workflow zarządzany",
          status: "completed",
        };
      } catch (error) {
        results.workflow_summary = {
          agent: "POLACZEK_M1",
          error: "Błąd workflow: " + (error as Error).message,
          status: "failed",
        };
      }
    }

    // Final AI Enhancement
    if (AI && results.search_results?.length > 0) {
      try {
        const enhancementPrompt = `Na podstawie wyników wyszukiwania dla "${query}", stwórz komprehensywną odpowiedź w języku polskim:

Wyniki:
${results.search_results
  .map((r: any, i: number) => `${i + 1}. ${r.title}: ${r.content}`)
  .join("\n")}

Stwórz:
1. Podsumowanie głównych informacji
2. Praktyczne wnioski
3. Dodatkowe konteksty
4. Rekomendacje działań

Styl: profesjonalny, polski, wartościowy dla użytkownika.`;

        const enhancementResponse = await AI.run(
          "@cf/qwen/qwen1.5-7b-chat-awq",
          {
            messages: [
              {
                role: "system",
                content:
                  "Jesteś ekspertem AI pomagającym użytkownikom w Polsce. Dostarczasz wartościowe, praktyczne odpowiedzi.",
              },
              {
                role: "user",
                content: enhancementPrompt,
              },
            ],
            temperature: 0.5,
          }
        );

        results.ai_enhancement = {
          summary: enhancementResponse.response || "Odpowiedź wygenerowana",
          model: "@cf/qwen/qwen1.5-7b-chat-awq",
        };
      } catch (error) {
        results.ai_enhancement = {
          error: "Błąd wzbogacania AI: " + (error as Error).message,
        };
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Agents Search Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Błąd systemu agentów: " + (error as Error).message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
