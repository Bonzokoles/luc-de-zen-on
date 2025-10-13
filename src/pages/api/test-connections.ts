import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
  // Return simple status for GET requests
  return new Response(
    JSON.stringify({
      message: "Test connections endpoint active",
      method: "Use POST for full connection testing",
      endpoints: ["DeepSeek", "Kaggle", "Tavily"],
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const results = {
      deepseek: false,
      kaggle: false,
      tavily: false,
      timestamp: new Date().toISOString(),
      deepseekResponse: "",
      deepseekError: "",
      kaggleResponse: "",
      kaggleError: "",
      tavilyResponse: "",
      tavilyError: "",
    };

    // Get API keys from environment (dev or production)
    // In Cloudflare Pages, dev vars are available in runtime.env even in dev mode
    const runtime = (locals as any)?.runtime?.env || {};
    const deepseekApiKey =
      runtime.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY;
    const kaggleUsername =
      runtime.KAGGLE_USERNAME || process.env.KAGGLE_USERNAME;
    const kaggleKey = runtime.KAGGLE_KEY || process.env.KAGGLE_KEY;
    const tavilyApiKey = runtime.TAVILY_API_KEY || process.env.TAVILY_API_KEY;

    // Test DeepSeek
    if (deepseekApiKey) {
      try {
        const deepseekResponse = await fetch(
          "https://api.deepseek.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${deepseekApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: [
                {
                  role: "user",
                  content:
                    'Hello, this is a connection test. Please respond with "DeepSeek connection successful".',
                },
              ],
              temperature: 0.1,
              max_tokens: 50,
            }),
          }
        );

        if (deepseekResponse.ok) {
          const data = (await deepseekResponse.json()) as {
            choices?: { message?: { content?: string } }[];
          };
          const response = data.choices?.[0]?.message?.content || "No response";
          results.deepseek =
            response.toLowerCase().includes("successful") ||
            response.toLowerCase().includes("deepseek");
          results.deepseekResponse = response;
        } else {
          results.deepseekError = `HTTP ${deepseekResponse.status}`;
        }
      } catch (error) {
        results.deepseekError =
          error instanceof Error ? error.message : "Connection failed";
      }
    } else {
      results.deepseekError = "API key not configured";
    }

    // Test Kaggle
    if (kaggleUsername && kaggleKey) {
      try {
        const auth = btoa(`${kaggleUsername}:${kaggleKey}`);
        const kaggleResponse = await fetch(
          "https://www.kaggle.com/api/v1/datasets/list?page=1&pageSize=1",
          {
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (kaggleResponse.ok) {
          const data = (await kaggleResponse.json()) as { datasets?: any[] };
          results.kaggle = true;
          results.kaggleResponse = `Found ${
            data.datasets?.length || 0
          } datasets`;
        } else {
          results.kaggleError = `HTTP ${kaggleResponse.status}`;
        }
      } catch (error) {
        results.kaggleError =
          error instanceof Error ? error.message : "Connection failed";
      }
    } else {
      results.kaggleError = "Credentials not configured";
    }

    // Test Tavily
    if (tavilyApiKey) {
      try {
        const tavilyResponse = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tavilyApiKey}`,
          },
          body: JSON.stringify({
            query: "test connection",
            search_depth: "basic",
            include_answer: false,
            include_images: false,
            include_raw_content: false,
            max_results: 1,
          }),
        });

        if (tavilyResponse.ok) {
          const data = (await tavilyResponse.json()) as { results?: any[] };
          results.tavily = true;
          results.tavilyResponse = `Found ${data.results?.length || 0} results`;
        } else {
          results.tavilyError = `HTTP ${tavilyResponse.status}`;
        }
      } catch (error) {
        results.tavilyError =
          error instanceof Error ? error.message : "Connection failed";
      }
    } else {
      results.tavilyError = "API key not configured";
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Connection test error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
