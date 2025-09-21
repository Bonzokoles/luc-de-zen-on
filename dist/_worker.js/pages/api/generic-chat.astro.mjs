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
export { r as renderers } from '../../chunks/_@astro-renderers_CHiEcNgA.mjs';

const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { user_message, system_prompt, model } = body;
    if (!user_message || !system_prompt || !model) {
      return new Response(JSON.stringify({ error: "Brak wymaganych pól: user_message, system_prompt, model" }), {
        status: 400
      });
    }
    const ai = locals.runtime.env.AI;
    const messages = [
      { role: "system", content: system_prompt },
      { role: "user", content: user_message }
    ];
    const inputs = {
      messages
    };
    const response = await ai.run(model, inputs);
    return new Response(JSON.stringify({ answer: response.response }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Błąd w generic-chat API:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd serwera podczas generowania odpowiedzi AI." }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
