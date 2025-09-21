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
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_DfX9K_yD.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const GET = async () => {
  return createSuccessResponse({
    message: "Chat API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: 'Send POST request with { prompt: "your message" }'
  });
};
const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const env = locals.runtime.env;
    if (!env.AI) {
      return createErrorResponse("Cloudflare AI nie jest dostępny", 500, {
        answer: "Przepraszam, system AI jest obecnie niedostępny."
      });
    }
    if (body.usePolaczek || body.model === "polaczek") {
      try {
        const polaczekResponse = await fetch(new URL("/api/polaczek-chat", request.url), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: body.prompt,
            model: body.model || "polaczek",
            temperature: body.temperature,
            language: body.language || "pl"
          })
        });
        if (polaczekResponse.ok) {
          const polaczekData = await polaczekResponse.json();
          return createSuccessResponse({
            answer: polaczekData.data?.answer || polaczekData.answer,
            modelUsed: "polaczek-assistant",
            via: "polaczek-integration"
          });
        }
      } catch (polaczekError) {
        console.warn("Polaczek fallback failed, using regular AI:", polaczekError);
      }
    }
    const language = body.language === "en" ? "en" : "pl";
    const modelId = body.model?.startsWith("@cf/") ? body.model : body.model === "qwen-pl" ? "@cf/qwen/qwen2.5-7b-instruct" : body.model === "llama-8b" ? "@cf/meta/llama-3.1-8b-instruct" : body.model === "gemma" ? "@cf/google/gemma-3-12b-it" : "@cf/google/gemma-3-12b-it";
    const systemPrompt = body.system ?? (language === "en" ? `You are MyBonzo AI Assistant - a helpful AI for Polish AI platform. 

🎯 WHAT IS MYBONZO:
MyBonzo is an advanced AI platform offering:
• AI Image Generators (Stable Diffusion, Flux)
• Polish AI models (Bielik, POLACZEK) 
• Analytics and business tools
• AI agent system for developers
• Cloudflare Workers AI integration
• 6 AI models: Gemma, Llama, Qwen, Mistral, Bielik, POLACZEK

🚨 ABSOLUTE PROHIBITIONS:
NEVER describe MyBonzo as:
❌ "My Bonzo" dog meme or internet humor
❌ Random text generator or fictional character
❌ Financial management system
❌ Expense tracking or budgeting tool

✅ ONLY TRUTH: MyBonzo = AI PLATFORM with image generators, 6 AI models, BigQuery analytics, Cloudflare Workers AI!` : `Jesteś MyBonzo AI Assistant - pomocnym asystentem polskiej platformy AI. 

🎯 CZYM JEST MYBONZO:
MyBonzo to zaawansowana platforma AI oferująca:
• Generator obrazów AI (Stable Diffusion, Flux)  
• Polskie modele AI (Bielik, POLACZEK)
• Narzędzia analityczne i biznesowe
• System agentów AI dla deweloperów
• Cloudflare Workers AI integration
• 6 modeli AI: Gemma, Llama, Qwen, Mistral, Bielik, POLACZEK

🚀 GŁÓWNE FUNKCJE:
• 🎨 AI Art Generator - tworzenie obrazów
• 🧠 Chat z AI - rozmowy z modelami
• 📊 Analiza danych - BigQuery integration  
• 🎯 Wildcards System - rozszerzanie promptów
• 🔊 Voice AI - synteza mowy
• 🤖 AI Workers - różne modele AI
• 🛡️ Admin Panel - zarządzanie systemem

🚨 ABSOLUTNE ZAKAZY:
NIGDY nie opisuj MyBonzo jako:
❌ Memu internetowego z psem "My Bonzo"
❌ Humorystycznego rysunku psa w hełmie  
❌ Absurdalnego memu z problemami codziennymi
❌ Systemu zarządzania finansami osobistymi
❌ Aplikacji do śledzenia wydatków lub budżetu
❌ Platformy dropshippingu z Chin
❌ Generatora losowych tekstów AI
❌ Fikcyjnej postaci "Bonzo"

🎯 JEDYNA PRAWDA:
MyBonzo = PLATFORMA AI z narzędziami:
- Generator obrazów (Stable Diffusion/Flux)
- 6 modeli AI (Gemma, Llama, Qwen, Mistral, Bielik, POLACZEK) 
- BigQuery Analytics
- Cloudflare Workers AI
- Admin Panel i Voice AI

⚡ ZAWSZE odpowiadaj TYLKO o rzeczywistych funkcjach MyBonzo jako platformy AI!`);
    const response = await env.AI.run(modelId, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: body.prompt }
      ],
      temperature: typeof body.temperature === "number" ? body.temperature : 0.6
    });
    return createSuccessResponse({
      answer: response.response || "Przepraszam, nie udało się wygenerować odpowiedzi.",
      modelUsed: modelId
    });
  } catch (error) {
    console.error("AI_CHAT Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return createErrorResponse(errorMessage, 500, {
      context: "AI_CHAT",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
