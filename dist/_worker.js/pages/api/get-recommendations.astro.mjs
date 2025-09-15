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
import { O as OpenAI } from '../../chunks/vendor_QZhDtzeH.mjs';
export { d as renderers } from '../../chunks/vendor_QZhDtzeH.mjs';

const POST = async ({ request }) => {
  try {
    const { preferences, history, userProfile } = await request.json();
    if (!preferences) {
      return new Response(JSON.stringify({ error: "User preferences are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const openai = new OpenAI({
      apiKey: undefined                              
    });
    const systemMessage = {
      role: "system",
      content: "Jesteś ekspertem rekomendacji produktów i usług, analizujący preferencje użytkowników i tworzący spersonalizowane propozycje. Zawsze zwracaj odpowiedź w formacie JSON z tablicą obiektów zawierających: title, description, reason, category, priority (1-5)."
    };
    const historyText = history && Array.isArray(history) ? history.join(", ") : "brak historii";
    const profileText = userProfile ? `Profil użytkownika: ${JSON.stringify(userProfile)}` : "";
    const userMessage = {
      role: "user",
      content: `Bazując na preferencjach użytkownika: "${preferences}", jego historii: "${historyText}" ${profileText}, zaproponuj 3-5 spersonalizowanych produktów lub usług. 
      
      Zwróć odpowiedź w formacie JSON:
      {
        "recommendations": [
          {
            "title": "Nazwa produktu/usługi",
            "description": "Opis korzyści i funkcji",
            "reason": "Dlaczego to pasuje do użytkownika",
            "category": "kategoria",
            "priority": 1-5
          }
        ]
      }
      
      Napisz w stylu przyjaznym, lekkim, zachęcającym do zakupu, podkreślając korzyści i unikalne cechy.`
    };
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, userMessage],
      max_tokens: 800,
      temperature: 0.7
    });
    const generatedText = response.choices[0].message.content;
    let recommendations;
    try {
      const parsed = JSON.parse(generatedText || "{}");
      recommendations = parsed.recommendations || [];
    } catch (parseError) {
      recommendations = [{
        title: "Rekomendacja spersonalizowana",
        description: generatedText || "Brak dostępnych rekomendacji",
        reason: "Oparte na Twoich preferencjach",
        category: "ogólne",
        priority: 3
      }];
    }
    return new Response(JSON.stringify({
      success: true,
      recommendations,
      preferences,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return new Response(JSON.stringify({
      error: "Failed to generate recommendations",
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
