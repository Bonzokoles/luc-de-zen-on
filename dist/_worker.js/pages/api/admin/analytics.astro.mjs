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
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../../chunks/corsUtils_DfX9K_yD.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CHiEcNgA.mjs';

const OPTIONS = createOPTIONSHandler(["GET"]);
const GET = async ({ request }) => {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const hasAuth = authHeader.includes("HAOS77");
    const analytics = {
      realTimeUsers: 7,
      totalSessions: 18425,
      bounceRate: 36.4,
      avgSessionDuration: 327,
      time: (/* @__PURE__ */ new Date()).toISOString(),
      demoAuth: hasAuth
    };
    return createSuccessResponse(analytics);
  } catch (e) {
    console.error("analytics error", e);
    return createErrorResponse("Failed to load analytics", 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
