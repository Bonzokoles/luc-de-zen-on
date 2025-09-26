globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const GET = async ({ request, locals }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || url.searchParams.get("q") || "AI technology";
  const env = locals?.runtime?.env;
  const tavilyApiKey = env?.TAVILY_API_KEY;
  if (!tavilyApiKey) {
    return new Response(JSON.stringify({
      status: "error",
      error: "Tavily API nie jest skonfigurowane",
      message: "Brak wymaganej zmiennej środowiskowej: TAVILY_API_KEY",
      required_config: ["TAVILY_API_KEY"],
      query,
      note: "Uzyskaj klucz API z https://tavily.com/",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 503,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  try {
    const { tavily } = await import('../../chunks/index_BTF9JYvf.mjs');
    const tvly = tavily({ apiKey: tavilyApiKey });
    const searchResults = await tvly.search(query, {
      maxResults: 5,
      includeAnswer: true,
      includeImages: false
    });
    return new Response(JSON.stringify({
      status: "success",
      query,
      results: searchResults.results || [],
      answer: searchResults.answer || null,
      total_results: searchResults.results?.length || 0,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Tavily API Error:", error);
    return new Response(JSON.stringify({
      status: "error",
      error: "Błąd podczas wyszukiwania Tavily",
      message: error instanceof Error ? error.message : "Nieznany błąd",
      query,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const {
      query,
      searchType = "search",
      maxResults = 10,
      includeImages = false,
      includeAnswer = true,
      includeDomains = [],
      excludeDomains = [],
      language = "en"
    } = body;
    if (!query || query.trim().length === 0) {
      return new Response(JSON.stringify({
        status: "error",
        error: "Query parameter is required",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const env = locals?.runtime?.env;
    const tavilyApiKey = env?.TAVILY_API_KEY;
    if (!tavilyApiKey) {
      return new Response(JSON.stringify({
        status: "error",
        error: "Tavily API nie jest skonfigurowane",
        message: "Brak wymaganej zmiennej środowiskowej: TAVILY_API_KEY",
        required_config: ["TAVILY_API_KEY"],
        query,
        searchType,
        note: "Uzyskaj klucz API z https://tavily.com/",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    try {
      const { tavily } = await import('../../chunks/index_BTF9JYvf.mjs');
      const tvly = tavily({ apiKey: tavilyApiKey });
      const searchOptions = {};
      if (maxResults) searchOptions.maxResults = Math.min(maxResults, 20);
      if (includeImages) searchOptions.includeImages = includeImages;
      if (includeAnswer) searchOptions.includeAnswer = includeAnswer;
      if (includeDomains && includeDomains.length > 0) searchOptions.includeDomains = includeDomains;
      const searchResults = await tvly.search(query, searchOptions);
      return new Response(JSON.stringify({
        status: "success",
        query,
        searchType,
        results: searchResults.results || [],
        answer: searchResults.answer || null,
        total_results: searchResults.results?.length || 0,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      console.error("Tavily API Error:", error);
      return new Response(JSON.stringify({
        status: "error",
        error: "Błąd podczas wyszukiwania Tavily",
        message: error instanceof Error ? error.message : "Nieznany błąd",
        query,
        searchType,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      error: "Internal server error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
