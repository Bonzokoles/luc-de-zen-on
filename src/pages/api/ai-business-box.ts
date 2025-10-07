// AI Business Box API - Backend dla analizy biznesowej MŚP
// DuckDB + BigQuery + Polski AI + Multi-model support
export const prerender = false;

// Available AI Models Configuration
const AI_MODELS = {
  // Cloudflare Workers AI Models
  cloudflare: {
    "bart-cnn": "@cf/facebook/bart-large-cnn",
    "deepseek-math": "@cf/deepseek-ai/deepseek-math-7b-instruct",
    llama: "@cf/meta/llama-3.1-8b-instruct",
    gemma: "@cf/google/gemma-2b-it",
  },
  // External APIs
  external: {
    "deepseek-chat": "deepseek-chat",
    "openai-gpt": "gpt-4o-mini",
    anthropic: "claude-3-haiku",
  },
};

// Business Agents Configuration
const BUSINESS_AGENTS = {
  POLACZEK_B: {
    name: "POLĄCZEK Business",
    specialization: "Analiza biznesowa i strategia",
    model: "@cf/facebook/bart-large-cnn",
    systemPrompt:
      "Jesteś ekspertem od analizy biznesowej w Polsce. Pomagasz małym i średnim przedsiębiorstwom w podejmowaniu decyzji biznesowych, analizie danych sprzedażowych i optymalizacji procesów.",
  },
  POLACZEK_F: {
    name: "POLĄCZEK Finance",
    specialization: "Analiza finansowa i księgowość",
    model: "@cf/deepseek-ai/deepseek-math-7b-instruct",
    systemPrompt:
      "Jesteś ekspertem finansowym specjalizującym się w polskim prawie podatkowym i księgowości. Pomagasz w analizie finansowej, planowaniu budżetu i optymalizacji podatkowej dla polskich firm.",
  },
};

export async function GET({
  request,
  locals,
}: {
  request: Request;
  locals: any;
}) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  try {
    // Access Cloudflare runtime
    const runtime = (locals as any)?.runtime;
    const deepseekApiKey = runtime?.env?.DEEPSEEK_API_KEY;
    const cfAI = runtime?.env?.AI; // Cloudflare Workers AI

    switch (action) {
      case "health":
        return new Response(
          JSON.stringify({
            success: true,
            status: "AI Business Box API Ready",
            services: {
              duckdb: true,
              bigquery: false,
              ai_assistant: !!deepseekApiKey,
              cloudflare_ai: !!cfAI,
              available_models: Object.keys(AI_MODELS.cloudflare).concat(
                Object.keys(AI_MODELS.external)
              ),
              business_agents: Object.keys(BUSINESS_AGENTS),
            },
            timestamp: new Date().toISOString(),
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

      case "models":
        // List available AI models and agents
        return new Response(
          JSON.stringify({
            success: true,
            models: AI_MODELS,
            agents: BUSINESS_AGENTS,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

      case "tables":
        // Mock table list - w rzeczywistości z DuckDB
        return new Response(
          JSON.stringify({
            success: true,
            tables: [
              {
                name: "sales_data",
                rows: 1250,
                columns: ["date", "product", "amount", "quantity"],
              },
              {
                name: "customers",
                rows: 450,
                columns: ["id", "name", "segment", "value"],
              },
              {
                name: "costs",
                rows: 680,
                columns: ["date", "category", "amount", "type"],
              },
            ],
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

      case "stats":
        // Mock statistics
        return new Response(
          JSON.stringify({
            success: true,
            stats: {
              total_revenue: 2450000,
              total_costs: 1580000,
              profit_margin: 35.5,
              customers_count: 450,
              top_products: [
                { name: "Produkt A", revenue: 850000 },
                { name: "Produkt B", revenue: 720000 },
                { name: "Produkt C", revenue: 520000 },
              ],
            },
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

      default:
        return new Response(
          JSON.stringify({
            error: "Unknown action",
            available_actions: ["health", "models", "tables", "stats"],
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
    }
  } catch (error: any) {
    console.error("AI Business Box API Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST({
  request,
  locals,
}: {
  request: Request;
  locals: any;
}) {
  try {
    const body = (await request.json()) as any;
    const { action, data } = body;
    const runtime = (locals as any)?.runtime;
    const apiKey = runtime?.env?.DEEPSEEK_API_KEY;

    switch (action) {
      case "ai_chat":
        // Multi-model AI chat with business agents
        const { message: chatMessage, agent = "POLACZEK_B", model } = data;

        if (!chatMessage) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Message is required",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        const selectedAgent =
          BUSINESS_AGENTS[agent as keyof typeof BUSINESS_AGENTS] ||
          BUSINESS_AGENTS["POLACZEK_B"];
        const selectedModel = model || selectedAgent.model;

        try {
          let aiResponse = "";

          // Cloudflare Workers AI
          if (selectedModel.startsWith("@cf/") && runtime?.env?.AI) {
            const response = await runtime.env.AI.run(selectedModel, {
              messages: [
                { role: "system", content: selectedAgent.systemPrompt },
                { role: "user", content: chatMessage },
              ],
            });
            aiResponse =
              response.response ||
              response.result ||
              "Brak odpowiedzi z modelu CF";

            // DeepSeek API fallback
          } else if (deepseekApiKey) {
            const deepseekResponse = await fetch(
              "https://api.deepseek.com/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${deepseekApiKey}`,
                },
                body: JSON.stringify({
                  model: "deepseek-chat",
                  messages: [
                    { role: "system", content: selectedAgent.systemPrompt },
                    { role: "user", content: chatMessage },
                  ],
                  temperature: 0.3,
                  max_tokens: 1500,
                }),
              }
            );

            if (deepseekResponse.ok) {
              const deepseekData = (await deepseekResponse.json()) as any;
              aiResponse =
                deepseekData.choices?.[0]?.message?.content ||
                "Brak odpowiedzi";
            } else {
              aiResponse = "Błąd API DeepSeek";
            }
          } else {
            aiResponse = `[${selectedAgent.name}]: Niestety, brak dostępnych modeli AI. Sprawdź konfigurację API keys.`;
          }

          return new Response(
            JSON.stringify({
              success: true,
              agent: selectedAgent.name,
              model: selectedModel,
              response: aiResponse,
              timestamp: new Date().toISOString(),
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error: any) {
          return new Response(
            JSON.stringify({
              success: false,
              error: `AI Chat Error: ${error.message}`,
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

      case "upload_csv":
        // Mock CSV processing
        const { filename, content } = data;

        // W rzeczywistości: parse CSV, load do DuckDB
        return new Response(
          JSON.stringify({
            success: true,
            message: `Plik ${filename} został załadowany`,
            table_name: filename.replace(".csv", ""),
            rows_imported: 1250,
            columns: ["date", "product", "amount", "quantity"],
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

      case "execute_sql":
        // Mock SQL execution
        const { query } = data;

        if (query.toUpperCase().includes("SHOW TABLES")) {
          return new Response(
            JSON.stringify({
              success: true,
              results: [
                { table_name: "sales_data" },
                { table_name: "customers" },
                { table_name: "costs" },
              ],
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Mock SELECT results
        return new Response(
          JSON.stringify({
            success: true,
            results: [
              {
                date: "2024-01-01",
                product: "Produkt A",
                amount: 1500,
                quantity: 10,
              },
              {
                date: "2024-01-02",
                product: "Produkt B",
                amount: 2300,
                quantity: 15,
              },
              {
                date: "2024-01-03",
                product: "Produkt A",
                amount: 1800,
                quantity: 12,
              },
            ],
            execution_time: "0.05s",
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

      case "ai_chat":
        if (!apiKey) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "AI assistant not configured",
            }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        const { message: sqlMessage } = data;

        // Call DeepSeek AI
        const aiResponse = await fetch(
          "https://api.deepseek.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: [
                {
                  role: "system",
                  content:
                    "Jesteś polskim asystentem biznesowym specjalizującym się w analizie danych dla MŚP. Odpowiadaj krótko i konkretnie po polsku. Fokusuj się na praktyczne insights biznesowe.",
                },
                {
                  role: "user",
                  content: sqlMessage,
                },
              ],
              max_tokens: 200,
              temperature: 0.7,
            }),
          }
        );

        if (!aiResponse.ok) {
          throw new Error("AI service unavailable");
        }

        const aiData = (await aiResponse.json()) as any;
        const reply =
          aiData.choices?.[0]?.message?.content ||
          "Przepraszam, nie mogę teraz odpowiedzieć.";

        return new Response(
          JSON.stringify({
            success: true,
            reply: reply,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

      case "generate_report":
        // Mock report generation
        const { report_type } = data;

        return new Response(
          JSON.stringify({
            success: true,
            report: {
              type: report_type,
              generated_at: new Date().toISOString(),
              data: {
                revenue: 2450000,
                costs: 1580000,
                profit: 870000,
                margin: 35.5,
                top_products: [
                  { name: "Produkt A", revenue: 850000, growth: "+12%" },
                  { name: "Produkt B", revenue: 720000, growth: "+8%" },
                  { name: "Produkt C", revenue: 520000, growth: "-3%" },
                ],
              },
            },
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

      case "export_data":
        // Mock data export
        const { format, table } = data;

        return new Response(
          JSON.stringify({
            success: true,
            message: `Dane z tabeli ${table} wyeksportowane do formatu ${format}`,
            download_url: `/exports/${table}_export.${format}`,
            file_size: "245 KB",
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

      case "sync_bigquery":
        // Mock BigQuery sync
        return new Response(
          JSON.stringify({
            success: true,
            message: "Synchronizacja z BigQuery zakończona pomyślnie",
            synced_tables: 3,
            sync_time: new Date().toISOString(),
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

      default:
        return new Response(
          JSON.stringify({
            error: "Unknown POST action",
            available_actions: [
              "upload_csv",
              "execute_sql",
              "ai_chat",
              "generate_report",
              "export_data",
              "sync_bigquery",
            ],
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
    }
  } catch (error: any) {
    console.error("AI Business Box POST Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
