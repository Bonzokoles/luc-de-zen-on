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
export { d as renderers } from '../../../chunks/vendor_BHZTJLV0.mjs';

const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { name, prompt, model } = body;
    if (!name || !prompt || !model) {
      return new Response(JSON.stringify({ error: "Brak wszystkich wymaganych pól: name, prompt, model" }), {
        status: 400
      });
    }
    const kv = locals.runtime.env.KNOWLEDGE_BASE;
    const agentKey = `agent:${name.replace(/\s+/g, "-").toLowerCase()}`;
    const existingAgent = await kv.get(agentKey);
    if (existingAgent) {
      return new Response(JSON.stringify({ error: `Agent o nazwie "${name}" już istnieje.` }), {
        status: 409
        // Conflict
      });
    }
    const agentConfig = {
      name,
      prompt,
      model,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await kv.put(agentKey, JSON.stringify(agentConfig));
    return new Response(JSON.stringify({ success: true, agentKey }), { status: 201 });
  } catch (error) {
    console.error("Błąd podczas tworzenia agenta:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd serwera." }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
