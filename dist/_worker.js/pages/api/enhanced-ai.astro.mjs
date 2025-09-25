globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { c as createComponent, a as renderTemplate } from '../../chunks/astro/server_CDFI50iS.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_iO87Dm24.mjs';

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
    const workerUrl = "https://mybonzo-enhanced-ai.lissonkarol-msa.workers.dev";
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
    console.error("Enhanced AI proxy error:", error);
    return new Response(
      JSON.stringify({
        error: "Enhanced AI service unavailable",
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
const $$EnhancedAi = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/api/enhanced-ai.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/api/enhanced-ai.astro";
const $$url = "/api/enhanced-ai";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  default: $$EnhancedAi,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
