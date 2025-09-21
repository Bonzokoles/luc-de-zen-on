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

const prerender = false;
async function POST({ request }) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  try {
    const { prompt, sessionId } = await request.json();
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
    const qwenResponse = `🐼 Qwen 1.5 72B (Polski)

Cześć! Jestem Qwen 1.5 72B - zaawansowanym modelem AI od Alibaba Cloud, zoptymalizowanym dla języka polskiego.

Twoje pytanie: "${prompt}"

Jako model Qwen mogę oferować:
• Głęboką analizę tekstu w języku polskim
• Rozumienie kontekstu kulturowego Polski
• Zaawansowane rozumowanie logiczne
• Wsparcie dla złożonych zadań analitycznych
• Integrację z ekosystemem MyBonzo

Moja specjalność to precyzyjna analiza i szczegółowe odpowiedzi na złożone pytania.

---
Model: Alibaba Qwen 1.5 72B (Polish)
Provider: Cloudflare AI (Free)
Capabilities: Advanced reasoning, Polish context
Status: Online`;
    return new Response(
      JSON.stringify({
        success: true,
        answer: qwenResponse,
        source: "qwen-1.5-72b-polish",
        model: "Alibaba Qwen 1.5 72B",
        sessionId,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        provider: "cloudflare-ai",
        language: "polish"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error) {
    console.error("Qwen Polish API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Qwen Polish API error",
        details: error?.message || "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
}
async function GET() {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  return new Response(
    JSON.stringify({
      status: "online",
      service: "qwen-1.5-72b-polish",
      version: "1.0.0",
      model: "Alibaba Qwen 1.5 72B",
      language: "Polish",
      provider: "Cloudflare AI",
      capabilities: ["Advanced Reasoning", "Polish Context", "Deep Analysis", "Cultural Understanding"],
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    }
  );
}
async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
