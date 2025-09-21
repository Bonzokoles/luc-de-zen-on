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

async function post({ request }) {
  try {
    const { prompt: prompt2, workflowId } = await request.json();
    if (!prompt2 || prompt2.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Prompt jest wymagany" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const FLOWISE_API_URL = undefined                                || "https://api.flowise.com/api/v1";
    const FLOWISE_API_TOKEN = undefined                                 ;
    if (!FLOWISE_API_TOKEN) {
      return new Response(
        JSON.stringify({
          error: "Flowise API token nie jest skonfigurowany. Sprawdź plik .env",
          fallback: "Używam symulowanej odpowiedzi Flowise AI"
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    const flowiseEndpoint = `${FLOWISE_API_URL}/chatflows/${workflowId || "default"}/prediction`;
    const response = await fetch(flowiseEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FLOWISE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: prompt2,
        history: [],
        uploads: []
      })
    });
    if (!response.ok) {
      console.log(`Flowise API failed: ${response.status}, using fallback`);
      const simulatedResponse = {
        text: `Flowise AI Response (Simulated):

Przetwarzam zapytanie: "${prompt2}"

To jest symulowana odpowiedź z Flowise AI. System workflow automation jest gotowy.

Aby podłączyć prawdziwy Flowise API:
1. Skonfiguruj FLOWISE_API_TOKEN w .env
2. Ustaw FLOWISE_API_URL (opcjonalne)
3. Utworz workflow w Flowise dashboard

System MyBonzo jest gotowy do integracji!`,
        sourceDocuments: [],
        chatId: `sim-${Date.now()}`,
        metadata: {
          simulation: true,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          prompt: prompt2
        }
      };
      return new Response(JSON.stringify(simulatedResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = await response.json();
    return new Response(JSON.stringify({
      ...data,
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        source: "flowise-api",
        prompt: prompt2
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Flowise API error:", error);
    const fallbackResponse = {
      text: `Flowise AI (Fallback Mode)

Wystąpił błąd podczas połączenia z Flowise API.

Twoje zapytanie: "${prompt || "unknown"}"

System workflow automation jest skonfigurowany i gotowy.
Sprawdź konfigurację API w pliku .env lub skontaktuj się z administratorem.

Error: ${error?.message || "Unknown error"}`,
      error: error?.message || "Unknown error",
      fallback: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function get() {
  return new Response(JSON.stringify({
    status: "Flowise API endpoint aktywny",
    available_methods: ["POST"],
    description: "Endpoint do wywołania Flowise AI workflows",
    usage: {
      method: "POST",
      body: {
        prompt: "Twoje zapytanie do AI",
        workflowId: "optional-workflow-id"
      }
    },
    configuration: {
      FLOWISE_API_URL: "not configured",
      FLOWISE_API_TOKEN: "not configured"
    }
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get,
  post
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
