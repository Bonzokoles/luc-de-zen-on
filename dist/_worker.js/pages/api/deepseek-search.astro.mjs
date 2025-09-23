globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { c as createComponent, a as renderTemplate } from '../../chunks/astro/server_BDhFni3J.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';
=======
/* empty css                                     */
import { c as createComponent, a as renderTemplate } from '../../chunks/astro/server_CDFI50iS.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

const ALL = async ({ request }) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  try {
    const workerUrl = "https://deepseek-search-worker.lissonkarol-msa.workers.dev";
    const response = await fetch(workerUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json"
      },
      body: request.body
    });
    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("DeepSeek search proxy error:", error);
    return new Response(
      JSON.stringify({
        error: "DeepSeek search service unavailable",
        details: error?.message || "Unknown error"
      }),
      {
        status: 503,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
};
const $$DeepseekSearch = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate``;
<<<<<<< HEAD
}, "Q:/mybonzo/luc-de-zen-on/src/pages/api/deepseek-search.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/api/deepseek-search.astro";
=======
}, "Q:/mybonzo/mybonzo-github/src/pages/api/deepseek-search.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/api/deepseek-search.astro";
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const $$url = "/api/deepseek-search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  default: $$DeepseekSearch,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
