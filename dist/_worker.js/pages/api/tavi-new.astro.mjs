if (typeof MessageChannel === 'undefined') {
  class __PolyfillPort {
    constructor(){ this.onmessage = null; }
    postMessage(data){ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> this.onmessage && this.onmessage(e)); }
    start(){} close(){}
  }
  class MessageChannel {
    constructor(){
      this.port1 = new __PolyfillPort();
      this.port2 = new __PolyfillPort();
      const dispatch = (target, data)=>{ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> target.onmessage && target.onmessage(e)); };
      this.port1.postMessage = (d)=> dispatch(this.port2, d);
      this.port2.postMessage = (d)=> dispatch(this.port1, d);
    }
  }
  globalThis.MessageChannel = MessageChannel;
}
export { r as renderers } from '../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const GET = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || url.searchParams.get("q") || "AI technology";
  const mockResponse = {
    status: "success",
    query,
    answer: `Based on the search for "${query}", here are the latest findings from web sources.`,
    results: [
      {
        title: `Latest news about ${query}`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
        content: `Recent developments in ${query} show significant progress in various applications...`,
        score: 0.95,
        publishedDate: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        title: `${query} - Research and Development`,
        url: `https://research.example.com/${query.toLowerCase().replace(" ", "-")}`,
        content: `Comprehensive analysis of ${query} reveals emerging trends and future opportunities...`,
        score: 0.88,
        publishedDate: new Date(Date.now() - 864e5).toISOString()
      }
    ],
    usage: {
      tokensUsed: 150,
      requestsRemaining: 850
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  return new Response(JSON.stringify(mockResponse), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
};
const POST = async ({ request }) => {
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
    const mockResponse = {
      status: "success",
      query,
      answer: includeAnswer ? `Based on my analysis of "${query}", here's what I found: This search reveals current trends and developments in this area. The information below provides detailed insights from various sources.` : void 0,
      results: Array.from({ length: Math.min(maxResults, 5) }, (_, i) => ({
        title: `${query} - Result ${i + 1}`,
        url: `https://example${i + 1}.com/article-about-${query.toLowerCase().replace(/\s+/g, "-")}`,
        content: `This comprehensive article discusses ${query} and its implications. The research shows significant developments in this field with practical applications across various industries. Key findings include innovative approaches and emerging trends.`,
        score: 0.9 - i * 0.1,
        publishedDate: new Date(Date.now() - i * 864e5).toISOString()
      })),
      images: includeImages ? [
        {
          url: `https://images.example.com/${query.toLowerCase().replace(/\s+/g, "-")}-1.jpg`,
          description: `Image related to ${query}`
        },
        {
          url: `https://images.example.com/${query.toLowerCase().replace(/\s+/g, "-")}-2.jpg`,
          description: `Infographic about ${query}`
        }
      ] : void 0,
      usage: {
        tokensUsed: Math.floor(Math.random() * 500) + 100,
        requestsRemaining: Math.floor(Math.random() * 900) + 100
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Response(JSON.stringify(mockResponse), {
      status: 200,
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
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
