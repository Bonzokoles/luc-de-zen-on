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
    const { topic, difficulty } = await request.json();
    if (!topic || !difficulty) {
      return new Response(JSON.stringify({ error: "Topic and difficulty are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const openai = new OpenAI({
      apiKey: "sk-proj-..."
    });
    const difficultyLevels = {
      beginner: "podstawowy - proste pytania wprowadzające",
      intermediate: "średniozaawansowany - pytania wymagające analizy",
      advanced: "zaawansowany - kompleksowe scenariusze",
      expert: "ekspert - najwyższy poziom trudności"
    };
    const systemMessage = {
      role: "system",
      content: `Jesteś ekspertem tworzenia quizów edukacyjnych. Tworzysz pytania quizowe na poziomie ${difficultyLevels[difficulty]} na temat ${topic}. Zawsze zwracaj odpowiedź w poprawnym formacie JSON.`
    };
    const userMessage = {
      role: "user",
      content: `Stwórz quiz na temat "${topic}" na poziomie "${difficulty}". Quiz powinien zawierać 5 pytań.

Zwróć odpowiedź w formacie JSON:
{
  "questions": [
    {
      "question": "Treść pytania",
      "answers": ["Odpowiedź A", "Odpowiedź B", "Odpowiedź C", "Odpowiedź D"],
      "correctAnswer": "Odpowiedź A",
      "explanation": "Wyjaśnienie dlaczego ta odpowiedź jest prawidłowa"
    }
  ]
}

Pytania powinny być:
- Praktyczne i związane z rzeczywistymi zastosowaniami
- Odpowiednie do poziomu ${difficulty}
- Z czterema opcjami odpowiedzi
- Z jasnym wyjaśnieniem prawidłowej odpowiedzi`
    };
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, userMessage],
      max_tokens: 2e3,
      temperature: 0.7
    });
    const responseText = response.choices[0].message.content;
    try {
      const quizData = JSON.parse(responseText || "{}");
      return new Response(JSON.stringify({
        success: true,
        quiz: quizData,
        topic,
        difficulty
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      return new Response(JSON.stringify({
        error: "Failed to generate valid quiz format",
        details: responseText
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
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
