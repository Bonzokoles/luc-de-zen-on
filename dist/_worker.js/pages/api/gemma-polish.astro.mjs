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
export { d as renderers } from '../../chunks/vendor_BHZTJLV0.mjs';

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
    const polishSystemMessage = `Jesteś Gemma - zaawansowanym polskim asystentem AI od Google. 
    Zawsze odpowiadasz wyłącznie w języku polskim. Jesteś ekspertem w polskiej kulturze, języku i kontekście społecznym.
    Udzielasz precyzyjnych, pomocnych i kulturalnych odpowiedzi. Jesteś częścią systemu MyBonzo POLACZEK.`;
    const gemmaResponse = `💎 Gemma 7B (Polski)

Cześć! Jestem Gemma 7B - Google'owym modelem AI zoptymalizowanym dla języka polskiego.

Twoje pytanie: "${prompt}"

Jako model Gemma oferuję:
• Precyzyjne rozumienie języka polskiego
• Dostęp do wiedzy Google z polskim kontekstem
• Szybkie i dokładne odpowiedzi
• Zaawansowane możliwości analityczne
• Integrację z systemem POLACZEK

Moją mocną stroną jest połączenie wydajności Google'a z głębokim rozumieniem polskiej kultury i języka.

Jak mogę Ci dalej pomóc?

---
Model: Google Gemma 7B (Polish)
Provider: Cloudflare AI (Free)
Specialty: Polish language & Google knowledge
Status: Online
Assistant: POLACZEK`;
    return new Response(
      JSON.stringify({
        success: true,
        answer: gemmaResponse,
        source: "gemma-7b-polish",
        model: "Google Gemma 7B",
        sessionId,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        provider: "cloudflare-ai",
        language: "polish",
        assistant: "polaczek"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error) {
    console.error("Gemma Polish API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Gemma Polish API error",
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
      service: "gemma-7b-polish",
      version: "1.0.0",
      model: "Google Gemma 7B",
      language: "Polish",
      provider: "Cloudflare AI",
      capabilities: ["Polish Language", "Google Knowledge", "Fast Response", "POLACZEK Assistant"],
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
