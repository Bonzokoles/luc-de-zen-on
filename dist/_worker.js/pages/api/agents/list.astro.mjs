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
export { d as renderers } from '../../../chunks/vendor_DCrrhcp4.mjs';

const GET = async ({ locals }) => {
  try {
    const kv = locals.runtime.env.KNOWLEDGE_BASE;
    const keyList = await kv.list({ prefix: "agent:" });
    if (keyList.keys.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    const agentPromises = keyList.keys.map((key) => kv.get(key.name));
    const agentJsonStrings = await Promise.all(agentPromises);
    const agents = agentJsonStrings.map((json) => json ? JSON.parse(json) : null).filter(Boolean);
    return new Response(JSON.stringify(agents), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania listy agentów:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd serwera." }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
