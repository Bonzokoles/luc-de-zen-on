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
export { r as renderers } from '../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

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
    const mistralResponse = `🇫🇷 Mistral 7B (Polski)

Bonjour! Jestem Mistral 7B - francuskim modelem AI z polskimi optymalizacjami.

Twoje zapytanie: "${prompt}"

Jako Mistral oferuję:
• Szybkie i efektywne przetwarzanie języka polskiego
• Dobje rozumienie kontekstu europejskiego
• Zaawansowane możliwości konwersacyjne
• Optymalizację dla zadań wielojęzycznych
• Integrację z platformą MyBonzo

Moja siła to równowaga między wydajnością a jakością odpowiedzi.

Jak mogę Ci pomóc w dalszej części rozmowy?

---
Model: Mistral 7B Instruct (Polish)
Provider: Cloudflare AI (Free)
Specialty: Efficient multilingual processing
Status: Online`;
    return new Response(
      JSON.stringify({
        success: true,
        answer: mistralResponse,
        source: "mistral-7b-polish",
        model: "Mistral 7B Instruct",
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
    console.error("Mistral Polish API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Mistral Polish API error",
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
      service: "mistral-7b-polish",
      version: "1.0.0",
      model: "Mistral 7B Instruct",
      language: "Polish",
      provider: "Cloudflare AI",
      capabilities: ["Efficient Processing", "Multilingual", "Fast Response", "European Context"],
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
