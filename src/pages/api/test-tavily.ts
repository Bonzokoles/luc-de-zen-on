import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = (locals as any)?.runtime?.env || {};

    const testData = {
      service: "Tavily API Test",
      timestamp: new Date().toISOString(),
      configuration: {
        tavily_api_key: env.TAVILY_API_KEY ? "✅ Configured" : "❌ Missing",
        key_snippet: env.TAVILY_API_KEY ? `${env.TAVILY_API_KEY.substring(0, 4)}...${env.TAVILY_API_KEY.substring(env.TAVILY_API_KEY.length - 4)}` : "N/A",
        ai_binding: env.AI ? "✅ Available" : "❌ Missing",
      },
      endpoints: {
        "GET /api/tavi?q=test": "Test search via GET",
        "POST /api/tavi": 'Test search via POST with {"query": "test"}',
        "GET /api/tavily/search?q=test": "Full Tavily API",
        "GET /api/test-tavily": "This test endpoint",
      },
    };

    // Test simple API call if key is available
    if (env.TAVILY_API_KEY) {
      try {
        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: env.TAVILY_API_KEY,
            query: "test connection",
            search_depth: "basic",
            include_answer: true,
            include_images: false,
            include_raw_content: false,
            max_results: 1,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          testData.configuration.tavily_api_key = "✅ Working - API responds";
          (testData as any).test_result = {
            status: "success",
            results_count: data.results?.length || 0,
            response_time: "OK",
          };
        } else {
          (testData as any).test_result = {
            status: "error",
            error: `API returned ${response.status}`,
          };
        }
      } catch (error) {
        (testData as any).test_result = {
          status: "error",
          error: error instanceof Error ? error.message : "Connection failed",
        };
      }
    }

    return new Response(JSON.stringify(testData, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        service: "Tavily API Test",
        status: "error",
        error: error instanceof Error ? error.message : "Test failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { query } = await request.json();

    if (!query) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Query is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Use Tavily API directly
    const env = (locals as any)?.runtime?.env || {};
    const tavilyApiKey = env.TAVILY_API_KEY;

    if (!tavilyApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Tavily API key not configured",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tavilyApiKey}`,
      },
      body: JSON.stringify({
        query: query,
        search_depth: "basic",
        include_answer: false,
        include_images: false,
        include_raw_content: false,
        max_results: 5,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        results: data.results || [],
        query: query,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Tavily test error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
