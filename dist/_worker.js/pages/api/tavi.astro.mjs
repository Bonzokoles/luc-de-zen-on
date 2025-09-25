globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_iO87Dm24.mjs';

const GET = async ({ request, locals }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || url.searchParams.get("q") || "AI technology";
  const env = locals.runtime?.env;
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
  return new Response(JSON.stringify({
    status: "error",
    error: "Implementacja Tavily API wymaga bibliotek klienta",
    message: "Prawdziwe wyszukiwanie wymaga implementacji Tavily API client library",
    query,
    note: "Zaimplementuj prawdziwe połączenie z Tavily API dla pełnej funkcjonalności",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status: 501,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
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
    const env = locals.runtime?.env;
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
    return new Response(JSON.stringify({
      status: "error",
      error: "Implementacja Tavily API wymaga bibliotek klienta",
      message: "Prawdziwe wyszukiwanie wymaga implementacji Tavily API client library",
      query,
      searchType,
      maxResults,
      note: "Zaimplementuj prawdziwe połączenie z Tavily API dla pełnej funkcjonalności",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 501,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
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
