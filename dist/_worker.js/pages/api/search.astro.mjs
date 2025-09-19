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
import { c as createOPTIONSHandler, a as createSuccessResponse } from '../../chunks/corsUtils_DD_RavK2.mjs';
export { d as renderers } from '../../chunks/vendor_DCrrhcp4.mjs';

const GET = async () => {
  return createSuccessResponse({
    message: "Search API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: 'Send POST request with { query: "search terms" }'
  });
};
const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);
const POST = async ({ request }) => {
  const { query } = await request.json();
  const mockResults = [
    { url: "#", title: `Wynik 1 dla zapytania: "${query}"` },
    { url: "#", title: `Wynik 2: Jak Bielik może pomóc z "${query}"` },
    { url: "#", title: `Wynik 3: Zaawansowane techniki dotyczące "${query}"` }
  ];
  await new Promise((res) => setTimeout(res, 500));
  return new Response(JSON.stringify(mockResults), {
    headers: { "Content-Type": "application/json" }
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
