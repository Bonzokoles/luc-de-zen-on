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
import { g as getApiKey } from '../../chunks/loadEnv_w1epHRGf.mjs';
export { d as renderers } from '../../chunks/vendor_DlPT8CWO.mjs';

const POST = async ({ request }) => {
  try {
    const { knowledgeBase } = await request.json();
    if (!knowledgeBase) {
      return new Response(JSON.stringify({ error: "Knowledge base is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const openaiKey = getApiKey("OPENAI_API_KEY");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Generuj pytania i odpowiedzi FAQ na podstawie bazy wiedzy. Format: Q: pytanie\nA: odpowiedź\n\n"
          },
          {
            role: "user",
            content: `Baza wiedzy: ${knowledgeBase}`
          }
        ],
        max_tokens: 1e3,
        temperature: 0.7
      })
    });
    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error: `OpenAI API error: ${error}` }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = await response.json();
    const faq = data.choices[0].message.content;
    return new Response(JSON.stringify({
      faq,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "success"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("FAQ generation error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
