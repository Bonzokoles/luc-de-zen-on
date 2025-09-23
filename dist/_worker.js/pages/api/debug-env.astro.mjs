globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const GET = async ({ locals, url }) => {
  try {
    return new Response(JSON.stringify({
      success: true,
      message: "Environment Debug Information",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      debug: {
        hasLocals: !!locals,
        localsType: typeof locals,
        localsKeys: locals ? Object.keys(locals) : [],
        hasRuntime: !!locals?.runtime,
        runtimeType: typeof locals?.runtime,
        runtimeKeys: locals?.runtime ? Object.keys(locals.runtime) : [],
        hasEnv: !!locals?.runtime?.env,
        envType: typeof locals?.runtime?.env,
        envKeys: locals?.runtime?.env ? Object.keys(locals.runtime.env) : [],
        urlPath: url.pathname,
        userAgent: url.searchParams.get("ua") || "none"
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    const err = error;
    return new Response(JSON.stringify({
      success: false,
      error: "Debug endpoint failed",
      message: err?.message || "Unknown error",
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
const OPTIONS = () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    OPTIONS
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
