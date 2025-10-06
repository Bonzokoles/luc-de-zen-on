globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_D_xeYX_3.mjs';

function getEnv(locals) {
  return locals?.runtime?.env || {};
}
async function performTavilySearch(env, query) {
  const tavilyApiKey = env.TAVILY_API_KEY;
  if (!tavilyApiKey) {
    throw new Error("TAVILY_API_KEY not configured");
  }
  try {
    const tavilyRequest = {
      api_key: tavilyApiKey,
      query,
      search_depth: "basic",
      include_images: false,
      include_answer: true,
      max_results: 5
    };
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tavilyRequest)
    });
    if (!response.ok) {
      throw new Error(
        `Tavily API error: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Tavily API error:", error);
    throw error;
  }
}
async function aiBasedSearch(env, query) {
  const aiBinding = env.AI;
  if (!aiBinding) {
    throw new Error("AI binding not configured");
  }
  const systemPrompt = `You are an AI research assistant. Your task is to search the web for the user's query and provide a concise answer, followed by a list of the most relevant sources. Format your response EXACTLY as follows, in Polish:

ANSWER: [Your summary and answer here]

SOURCES:
1. [Title of the first source](URL of the first source) - [Snippet or brief description of the first source]
2. [Title of the second source](URL of the second source) - [Snippet or brief description of the second source]
3. [Title of the third source](URL of the third source) - [Snippet or brief description of the third source]`;
  const aiResponse = await aiBinding.run("@cf/google/gemma-7b-it", {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query }
    ]
  });
  return parseAiResponse(aiResponse.response || "");
}
function parseAiResponse(responseText) {
  const answerMatch = responseText.match(/ANSWER:(.*?)SOURCES:/s);
  const answer = answerMatch ? answerMatch[1].trim() : "Model nie wygenerował odpowiedzi.";
  const sourcesMatch = responseText.match(/SOURCES:(.*)/s);
  const sourcesText = sourcesMatch ? sourcesMatch[1].trim() : "";
  const results = [];
  const sourceLines = sourcesText.split("\n");
  const lineRegex = /\d+\.\s*\[([^\]]+)\]\(([^\]]+)\)\s*-\s*(.*)/;
  for (const line of sourceLines) {
    const match = line.match(lineRegex);
    if (match) {
      results.push({
        title: match[1].trim(),
        url: match[2].trim(),
        content: match[3].trim(),
        score: 0.9
        // Default score
      });
    }
  }
  return { answer, results };
}
const GET = async ({ url, locals }) => {
  const env = getEnv(locals);
  const query = url.searchParams.get("q");
  if (!query) {
    return new Response(
      JSON.stringify({
        status: "info",
        service: "Tavily Search API",
        description: "AI-powered web search with real-time results",
        endpoints: {
          "GET /api/tavi?q=query": "Search with query parameter",
          "POST /api/tavi": 'Search with JSON body {query: "your search"}'
        },
        examples: {
          get: "/api/tavi?q=artificial intelligence",
          post: 'POST /api/tavi with {"query": "machine learning"}'
        },
        configuration: {
          tavily_api: env.TAVILY_API_KEY ? "✅ Configured" : "❌ Missing TAVILY_API_KEY",
          ai_fallback: env.AI ? "✅ Available" : "❌ Missing AI binding"
        }
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  try {
    let searchData;
    let searchMethod = "tavily";
    try {
      searchData = await performTavilySearch(env, query);
      return new Response(
        JSON.stringify({
          status: "success",
          method: "tavily",
          query,
          answer: searchData.answer || `Wyniki wyszukiwania dla: ${query}`,
          results: searchData.results?.map((result) => ({
            title: result.title,
            url: result.url,
            content: result.content,
            score: result.score || 0.5
          })) || [],
          usage: {
            source: "Tavily API",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }
        }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (tavilyError) {
      try {
        searchData = await aiBasedSearch(env, query);
        return new Response(
          JSON.stringify({
            status: "success",
            method: "ai_fallback",
            query,
            answer: searchData.answer,
            results: searchData.results,
            usage: {
              source: "Cloudflare Workers AI (Fallback)",
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            },
            note: "Użyto AI fallback - skonfiguruj TAVILY_API_KEY dla lepszych wyników"
          }),
          {
            headers: { "Content-Type": "application/json" }
          }
        );
      } catch (aiError) {
        throw new Error(`Both Tavily and AI failed: ${aiError}`);
      }
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        error: error instanceof Error ? error.message : "Search failed",
        query
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
const POST = async ({ request, locals }) => {
  const env = getEnv(locals);
  try {
    const body = await request.json();
    const query = body.query;
    if (!query) {
      return new Response(
        JSON.stringify({
          status: "error",
          error: "Query is required"
        }),
        { status: 400 }
      );
    }
    let searchData;
    let searchMethod = "tavily";
    try {
      searchData = await performTavilySearch(env, query);
      const responsePayload = {
        status: "success",
        method: "tavily",
        query,
        answer: searchData.answer || `Wyniki wyszukiwania dla: ${query}`,
        results: searchData.results?.map((result) => ({
          title: result.title,
          url: result.url,
          content: result.content,
          score: result.score || 0.5
        })) || [],
        usage: {
          tokensUsed: 0,
          requestsRemaining: 99,
          source: "Tavily API"
        }
      };
      return new Response(JSON.stringify(responsePayload), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (tavilyError) {
      console.log("Tavily API not available, falling back to AI:", tavilyError);
      try {
        searchData = await aiBasedSearch(env, query);
        searchMethod = "ai_fallback";
        const responsePayload = {
          status: "success",
          method: "ai_fallback",
          query,
          answer: searchData.answer,
          results: searchData.results,
          usage: {
            tokensUsed: searchData.answer?.length || 0,
            requestsRemaining: 99,
            source: "Cloudflare Workers AI (Fallback)"
          },
          note: "Użyto AI fallback - skonfiguruj TAVILY_API_KEY dla lepszych wyników"
        };
        return new Response(JSON.stringify(responsePayload), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (aiError) {
        throw new Error(`Both Tavily and AI failed: ${aiError}`);
      }
    }
  } catch (error) {
    console.error("Tavi API Error:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        error: error instanceof Error ? error.message : "Failed to perform search.",
        available_methods: ["tavily", "ai_fallback"],
        configuration_needed: "TAVILY_API_KEY or AI binding"
      }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
