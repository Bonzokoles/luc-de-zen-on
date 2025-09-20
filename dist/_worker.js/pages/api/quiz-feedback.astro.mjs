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
import { O as OpenAI } from '../../chunks/client_BMogPQMi.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const POST = async ({ request }) => {
  try {
    const { userAnswers, quizTopic, difficulty } = await request.json();
    if (!userAnswers || !Array.isArray(userAnswers)) {
      return new Response(JSON.stringify({ error: "User answers are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const totalQuestions = userAnswers.length;
    const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length;
    const score = Math.round(correctAnswers / totalQuestions * 100);
    const openai = new OpenAI({
      apiKey: "sk-proj-..."
    });
    const systemMessage = {
      role: "system",
      content: "Jesteś doświadczonym nauczycielem tworzącym spersonalizowany feedback dla uczniów. Analizujesz wyniki quizu i dajesz konstruktywne, motywujące wskazówki do dalszej nauki."
    };
    const answersAnalysis = userAnswers.map(
      (answer) => `Pytanie: ${answer.question}
Wybrana odpowiedź: ${answer.selectedAnswer}
Poprawna odpowiedź: ${answer.correctAnswer}
Czy poprawna: ${answer.isCorrect ? "TAK" : "NIE"}`
    ).join("\n\n");
    const userMessage = {
      role: "user",
      content: `Przeanalizuj wyniki quizu ucznia:

Temat quizu: ${quizTopic || "Nieokreślony"}
Poziom trudności: ${difficulty || "Nieokreślony"}
Wynik: ${correctAnswers}/${totalQuestions} (${score}%)

Analiza odpowiedzi:
${answersAnalysis}

Napisz spersonalizowany feedback zawierający:
1. Gratulacje za mocne strony
2. Obszary do poprawy
3. Konkretne wskazówki do dalszej nauki
4. Motywujące zachęcenie

Odpowiedź w formacie JSON:
{
  "feedback": "Tekst feedbacku",
  "strengths": ["Mocna strona 1", "Mocna strona 2"],
  "improvements": ["Obszar do poprawy 1", "Obszar do poprawy 2"],
  "recommendations": ["Rekomendacja 1", "Rekomendacja 2"]
}`
    };
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, userMessage],
      max_tokens: 1e3,
      temperature: 0.7
    });
    const responseText = response.choices[0].message.content;
    try {
      const feedbackData = JSON.parse(responseText || "{}");
      return new Response(JSON.stringify({
        success: true,
        score,
        correctAnswers,
        totalQuestions,
        percentage: score,
        ...feedbackData
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (parseError) {
      return new Response(JSON.stringify({
        success: true,
        score,
        correctAnswers,
        totalQuestions,
        percentage: score,
        feedback: `Gratulacje! Ukończyłeś quiz z wynikiem ${score}%. ${score >= 80 ? "Excellent work!" : score >= 60 ? "Good job, keep learning!" : "Keep practicing to improve your score!"}`
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Error generating quiz feedback:", error);
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
