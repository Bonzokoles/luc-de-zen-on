globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const POST = async ({ request }) => {
  try {
    const { query } = await request.json();
    if (!query) {
      return new Response(JSON.stringify({
        success: false,
        error: "Query is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const tavilyApiKey = "TAVILY_API_KEY_SECRET";
    if (!tavilyApiKey) ;
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tavilyApiKey}`
      },
      body: JSON.stringify({
        query,
        search_depth: "basic",
        include_answer: false,
        include_images: false,
        include_raw_content: false,
        max_results: 5
      })
    });
    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }
    const data = await response.json();
    return new Response(JSON.stringify({
      success: true,
      results: data.results || [],
      query,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Tavily test error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
