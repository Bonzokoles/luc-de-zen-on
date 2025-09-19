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
import { O as OpenAI } from '../../chunks/vendor_BHZTJLV0.mjs';
export { d as renderers } from '../../chunks/vendor_BHZTJLV0.mjs';

const POST = async ({ request }) => {
  try {
    const { name, email, message, phone, company, budget } = await request.json();
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Name, email, and message are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const openai = new OpenAI({
      apiKey: "sk-proj-..."
    });
    const leadData = {
      name,
      email,
      message,
      phone: phone || "nie podano",
      company: company || "nie podano",
      budget: budget || "nie określono"
    };
    const systemMessage = {
      role: "system",
      content: "Jesteś asystentem AI do kwalifikacji leadów. Oceń wartość leadu (WYSOKI, ŚREDNI, NISKI), określ priorytet (1-5) i napisz profesjonalną, ale serdeczną odpowiedź powitalną (maksymalnie 150 słów). Zwróć odpowiedź w formacie JSON."
    };
    const userMessage = {
      role: "user",
      content: `Oceń lead na podstawie danych: ${JSON.stringify(leadData)}. 
      
      Zwróć odpowiedź w formacie JSON:
      {
        "leadScore": "WYSOKI/ŚREDNI/NISKI",
        "priority": 1-5,
        "category": "kategoria leadu",
        "reply": "Odpowiedź powitalna dla klienta",
        "internalNotes": "Notatki wewnętrzne dla zespołu sprzedaży",
        "suggestedAction": "Sugerowane następne kroki"
      }
      
      Napisz odpowiedź w profesjonalnym, ale serdecznym tonie, zachęcającym do dalszej rozmowy.`
    };
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, userMessage],
      max_tokens: 600,
      temperature: 0.6
    });
    const generatedText = response.choices[0].message.content;
    let leadAnalysis;
    try {
      leadAnalysis = JSON.parse(generatedText || "{}");
    } catch (parseError) {
      leadAnalysis = {
        leadScore: "ŚREDNI",
        priority: 3,
        category: "ogólne zapytanie",
        reply: generatedText || "Dziękujemy za kontakt! Skontaktujemy się z Państwem wkrótce.",
        internalNotes: "Lead wymaga ręcznej weryfikacji",
        suggestedAction: "Kontakt telefoniczny w ciągu 24h"
      };
    }
    const leadRecord = {
      ...leadData,
      ...leadAnalysis,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "NEW"
    };
    console.log("New lead processed:", leadRecord);
    return new Response(JSON.stringify({
      success: true,
      reply: leadAnalysis.reply,
      leadScore: leadAnalysis.leadScore,
      priority: leadAnalysis.priority,
      category: leadAnalysis.category,
      suggestedAction: leadAnalysis.suggestedAction,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error qualifying lead:", error);
    return new Response(JSON.stringify({
      error: "Failed to process lead qualification",
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
