globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const POST = async ({ request }) => {
  try {
    const results = {
      deepseek: false,
      kaggle: false,
      tavily: false,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      deepseekResponse: "",
      deepseekError: "",
      kaggleResponse: "",
      kaggleError: "",
      tavilyResponse: "",
      tavilyError: ""
    };
    const deepseekApiKey = undefined                                 || process.env.DEEPSEEK_API_KEY;
    const kaggleUsername = undefined                                || process.env.KAGGLE_USERNAME;
    const kaggleKey = undefined                           || process.env.KAGGLE_KEY;
    const tavilyApiKey = undefined                               || process.env.TAVILY_API_KEY;
    if (deepseekApiKey) {
      try {
        const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${deepseekApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "user",
                content: 'Hello, this is a connection test. Please respond with "DeepSeek connection successful".'
              }
            ],
            temperature: 0.1,
            max_tokens: 50
          })
        });
        if (deepseekResponse.ok) {
          const data = await deepseekResponse.json();
          const response = data.choices[0]?.message?.content || "No response";
          results.deepseek = response.toLowerCase().includes("successful") || response.toLowerCase().includes("deepseek");
          results.deepseekResponse = response;
        } else {
          results.deepseekError = `HTTP ${deepseekResponse.status}`;
        }
      } catch (error) {
        results.deepseekError = error instanceof Error ? error.message : "Connection failed";
      }
    } else {
      results.deepseekError = "API key not configured";
    }
    if (kaggleUsername && kaggleKey) {
      try {
        const auth = btoa(`${kaggleUsername}:${kaggleKey}`);
        const kaggleResponse = await fetch("https://www.kaggle.com/api/v1/datasets/list?page=1&pageSize=1", {
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
          }
        });
        if (kaggleResponse.ok) {
          const data = await kaggleResponse.json();
          results.kaggle = true;
          results.kaggleResponse = `Found ${data.datasets?.length || 0} datasets`;
        } else {
          results.kaggleError = `HTTP ${kaggleResponse.status}`;
        }
      } catch (error) {
        results.kaggleError = error instanceof Error ? error.message : "Connection failed";
      }
    } else {
      results.kaggleError = "Credentials not configured";
    }
    if (tavilyApiKey) {
      try {
        const tavilyResponse = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tavilyApiKey}`
          },
          body: JSON.stringify({
            query: "test connection",
            search_depth: "basic",
            include_answer: false,
            include_images: false,
            include_raw_content: false,
            max_results: 1
          })
        });
        if (tavilyResponse.ok) {
          const data = await tavilyResponse.json();
          results.tavily = true;
          results.tavilyResponse = `Found ${data.results?.length || 0} results`;
        } else {
          results.tavilyError = `HTTP ${tavilyResponse.status}`;
        }
      } catch (error) {
        results.tavilyError = error instanceof Error ? error.message : "Connection failed";
      }
    } else {
      results.tavilyError = "API key not configured";
    }
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Connection test error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
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
