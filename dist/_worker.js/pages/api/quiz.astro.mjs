globalThis.process ??= {}; globalThis.process.env ??= {};
import { O as OpenAI } from '../../chunks/client_VWYXpznl.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_iO87Dm24.mjs';

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
      apiKey: undefined                              
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
