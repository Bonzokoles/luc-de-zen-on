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
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_DD_RavK2.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const OPTIONS = createOPTIONSHandler(["GET", "POST"]);
const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const errors = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 3e4).toISOString(),
        level: "warning",
        message: "High memory usage detected",
        source: "system",
        details: "Memory usage at 85%"
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 12e4).toISOString(),
        level: "error",
        message: "Failed API request to external service",
        source: "api",
        details: "Timeout after 30s"
      }
    ].slice(0, limit);
    return createSuccessResponse({
      errors,
      total: errors.length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Errors API error:", error);
    return createErrorResponse("Failed to fetch errors", 500);
  }
};
const POST = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");
    if (action === "clear") {
      return createSuccessResponse({
        success: true,
        message: "Errors cleared",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    return createErrorResponse("Unknown action", 400);
  } catch (error) {
    console.error("Clear errors error:", error);
    return createErrorResponse("Failed to clear errors", 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
