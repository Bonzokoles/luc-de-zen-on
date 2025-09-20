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
export { r as renderers } from '../../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

async function GET({ request }) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.includes("HAOS77")) {
    return json({ services: [], system: { mode: "demo" } });
  }
  const services = [
    { name: "API Gateway", status: "online", responseTime: 42 },
    { name: "Workers Manager", status: "online", responseTime: 57 },
    { name: "Image Service", status: "degraded", responseTime: 180 }
  ];
  const system = {
    env: "local",
    version: "1.0.0",
    time: (/* @__PURE__ */ new Date()).toISOString()
  };
  return json({ services, system });
}
function json(body, init) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    },
    ...init
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
