import type { APIRoute } from "astro";
import * as Sentry from "@sentry/cloudflare";

// Helper to get secrets from Cloudflare environment
function getEnv(locals: any): Record<string, any> {
  // In dev mode, Astro uses process.env. In production, it uses locals.runtime.env.
  return import.meta.env.DEV
    ? process.env
    : (locals as any)?.runtime?.env || {};
}

// Real Tavily API search function
async function performTavilySearch(env: any, query: string) {
  const tavilyApiKey = env.TAVILY_API_KEY;

  if (!tavilyApiKey) {
    throw new Error("TAVILY_API_KEY not configured");
  }

  try {
    const tavilyRequest = {
      api_key: tavilyApiKey,
      query: query,
      search_depth: "basic",
      include_images: false,
      include_answer: true,
      max_results: 5,
    };

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tavilyRequest),
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

    // Wysyłaj błędy do Sentry z kontekstem
    Sentry.captureException(error, {
      tags: {
        endpoint: "tavily-search",
        api: "tavily",
      },
      extra: {
        query: query,
        apiKeyConfigured: !!tavilyApiKey,
      },
    });

    throw error;
  }
}

// Fallback AI-based search when Tavily is not available
async function aiBasedSearch(env: any, query: string) {
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
      { role: "user", content: query },
    ],
  });
  return parseAiResponse(aiResponse.response || "");
}

// Helper to parse the AI's response
function parseAiResponse(responseText: string): {
  answer: string;
  results: any[];
} {
  const answerMatch = responseText.match(/ANSWER:(.*?)SOURCES:/s);
  const answer = answerMatch
    ? answerMatch[1].trim()
    : "Model nie wygenerował odpowiedzi.";

  const sourcesMatch = responseText.match(/SOURCES:(.*)/s);
  const sourcesText = sourcesMatch ? sourcesMatch[1].trim() : "";

  const results = [];
  const sourceLines = sourcesText.split("\n");

  // Regex to capture: 1. [Title](URL) - Snippet
  const lineRegex = /\d+\.\s*\[([^\]]+)\]\(([^\]]+)\)\s*-\s*(.*)/;

  for (const line of sourceLines) {
    const match = line.match(lineRegex);
    if (match) {
      results.push({
        title: match[1].trim(),
        url: match[2].trim(),
        content: match[3].trim(),
        score: 0.9, // Default score
      });
    }
  }

  return { answer, results };
}

export const GET: APIRoute = async ({ url, locals }) => {
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
          "POST /api/tavi": 'Search with JSON body {query: "your search"}',
        },
        examples: {
          get: "/api/tavi?q=artificial intelligence",
          post: 'POST /api/tavi with {"query": "machine learning"}',
        },
        configuration: {
          tavily_api: env.TAVILY_API_KEY
            ? "✅ Configured"
            : "❌ Missing TAVILY_API_KEY",
          ai_fallback: env.AI ? "✅ Available" : "❌ Missing AI binding",
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    let searchData;
    let searchMethod = "tavily";

    try {
      // Try Tavily API first
      searchData = await performTavilySearch(env, query);

      return new Response(
        JSON.stringify({
          status: "success",
          method: "tavily",
          query: query,
          answer: searchData.answer || `Wyniki wyszukiwania dla: ${query}`,
          results:
            searchData.results?.map((result: any) => ({
              title: result.title,
              url: result.url,
              content: result.content,
              score: result.score || 0.5,
            })) || [],
          usage: {
            source: "Tavily API",
            timestamp: new Date().toISOString(),
          },
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (tavilyError) {
      // Fallback to AI-based search
      try {
        searchData = await aiBasedSearch(env, query);

        return new Response(
          JSON.stringify({
            status: "success",
            method: "ai_fallback",
            query: query,
            answer: searchData.answer,
            results: searchData.results,
            usage: {
              source: "Cloudflare Workers AI (Fallback)",
              timestamp: new Date().toISOString(),
            },
            note: "Użyto AI fallback - skonfiguruj TAVILY_API_KEY dla lepszych wyników",
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (aiError) {
        throw new Error(`Both Tavily and AI failed: ${aiError}`);
      }
    }
  } catch (error) {
    // Główne błędy API do Sentry
    Sentry.captureException(error, {
      tags: {
        endpoint: "tavi-api",
        method: "GET",
      },
      extra: {
        query: query,
        userAgent: request.headers.get("user-agent"),
        ip: request.headers.get("cf-connecting-ip"),
      },
    });

    return new Response(
      JSON.stringify({
        status: "error",
        error: error instanceof Error ? error.message : "Search failed",
        query: query,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const env = getEnv(locals);
  let query = ""; // Deklaruję wcześniej dla Sentry scope

  try {
    const body = (await request.json()) as { query: string };
    query = body.query;

    if (!query) {
      return new Response(
        JSON.stringify({
          status: "error",
          error: "Query is required",
        }),
        { status: 400 }
      );
    }

    let searchData: any;
    let searchMethod = "tavily";

    try {
      // Try Tavily API first
      searchData = await performTavilySearch(env, query);

      const responsePayload = {
        status: "success",
        method: "tavily",
        query: query,
        answer: searchData.answer || `Wyniki wyszukiwania dla: ${query}`,
        results:
          searchData.results?.map((result: any) => ({
            title: result.title,
            url: result.url,
            content: result.content,
            score: result.score || 0.5,
          })) || [],
        usage: {
          tokensUsed: 0,
          requestsRemaining: 99,
          source: "Tavily API",
        },
      };

      return new Response(JSON.stringify(responsePayload), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (tavilyError) {
      console.log("Tavily API not available, falling back to AI:", tavilyError);

      // Fallback to AI-based search
      try {
        searchData = await aiBasedSearch(env, query);
        searchMethod = "ai_fallback";

        const responsePayload = {
          status: "success",
          method: "ai_fallback",
          query: query,
          answer: searchData.answer,
          results: searchData.results,
          usage: {
            tokensUsed: searchData.answer?.length || 0,
            requestsRemaining: 99,
            source: "Cloudflare Workers AI (Fallback)",
          },
          note: "Użyto AI fallback - skonfiguruj TAVILY_API_KEY dla lepszych wyników",
        };

        return new Response(JSON.stringify(responsePayload), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (aiError) {
        throw new Error(`Both Tavily and AI failed: ${aiError}`);
      }
    }
  } catch (error) {
    console.error("Tavi API Error:", error);

    // POST błędy też do Sentry
    Sentry.captureException(error, {
      tags: {
        endpoint: "tavi-api",
        method: "POST",
      },
      extra: {
        query: query,
        userAgent: request.headers.get("user-agent"),
        ip: request.headers.get("cf-connecting-ip"),
      },
    });
    return new Response(
      JSON.stringify({
        status: "error",
        error:
          error instanceof Error ? error.message : "Failed to perform search.",
        available_methods: ["tavily", "ai_fallback"],
        configuration_needed: "TAVILY_API_KEY or AI binding",
      }),
      { status: 500 }
    );
  }
};
