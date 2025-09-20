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
export { d as renderers } from '../../chunks/vendor_DlPT8CWO.mjs';

const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);
async function POST({ request }) {
  try {
    const body = await request.json();
    const { prompt, model, temperature = 0.7, language = "pl" } = body;
    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Prompt jest wymagany" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const selectedModel = model || "llama-3.1-70b-instruct";
    try {
      const workerResponse = await fetch("https://multi-ai-assistant.stolarnia-ams.workers.dev/qwen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: prompt,
          sessionId: "chatbot-session",
          context: {
            source: "ai_bot_worker",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }
        })
      });
      if (workerResponse.ok) {
        const workerData = await workerResponse.json();
        if (workerData.success && workerData.response) {
          return new Response(
            JSON.stringify({
              answer: workerData.response,
              model: workerData.model_name || "@cf/qwen/qwen1.5-0.5b-chat",
              status: "multi_ai_worker_success",
              source: "cloudflare_worker"
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
          );
        }
      }
    } catch (workerError) {
      console.warn("Multi-AI Worker failed, trying OpenAI fallback:", workerError);
    }
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (OPENAI_API_KEY) {
      try {
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: selectedModel.includes("gpt") ? selectedModel : "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: language === "pl" ? "Jesteś pomocnym asystentem AI. Odpowiadaj po polsku w przystępny i przyjazny sposób." : "You are a helpful AI assistant. Respond in a clear and friendly manner."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature,
            max_tokens: 1e3
          })
        });
        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json();
          const aiResponse = openaiData.choices[0]?.message?.content || "Brak odpowiedzi od API";
          return new Response(
            JSON.stringify({
              answer: aiResponse,
              model: selectedModel,
              status: "openai_api_success",
              tokens_used: openaiData.usage?.total_tokens || 0,
              source: "openai"
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
          );
        }
      } catch (apiError) {
        console.error("OpenAI API error:", apiError);
      }
    }
    return new Response(
      JSON.stringify({
        error: "Systemy AI są obecnie niedostępne",
        answer: "Przepraszam, nie mogę obecnie przetworzyć Twojego zapytania. Spróbuj ponownie za chwilę.",
        model: selectedModel,
        status: "ai_unavailable",
        note: "Wszystkie systemy AI (Multi-AI Worker i OpenAI) są niedostępne."
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas przetwarzania zapytania",
        details: error instanceof Error ? error.message : "Nieznany błąd"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
async function GET() {
  return createSuccessResponse({
    message: "AI Chatbot Worker is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: 'Send POST request with { prompt: "your message", model?: "model-name", temperature?: 0.7 }'
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
