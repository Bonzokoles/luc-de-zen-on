globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_CsfOuLCA.mjs';

const premadeQuizzes = /* @__PURE__ */ new Map([
  ["iq-logic-1", {
    id: "iq-logic-1",
    title: "Test IQ - Logika",
    topic: "logic",
    difficulty: "intermediate",
    questions: [
      {
        question: "Która liczba nie pasuje do reszty: 2, 3, 5, 7, 11, 13, 15?",
        answers: ["3", "7", "11", "15"],
        correctAnswer: "15",
        explanation: "Wszystkie liczby oprócz 15 są liczbami pierwszymi."
      },
      {
        question: "Jeśli jutro jest pojutrze, to jaki dzień był wczoraj, jeśli dzisiaj jest niedziela?",
        answers: ["Piątek", "Sobota", "Czwartek", "Środa"],
        correctAnswer: "Piątek",
        explanation: "Jeśli 'jutro jest pojutrze', to 'dzisiaj' jest wczoraj. Skoro dzisiaj jest niedziela, to 'wczoraj' była sobota. A dniem przed sobotą jest piątek."
      },
      {
        question: "Kontynuuj sekwencję: 1, 4, 9, 16, 25, ...?",
        answers: ["36", "32", "49", "42"],
        correctAnswer: "36",
        explanation: "Sekwencja to kwadraty kolejnych liczb naturalnych (1^2, 2^2, 3^2, itd.)."
      }
    ]
  }],
  ["general-knowledge-1", {
    id: "general-knowledge-1",
    title: "Wiedza Ogólna",
    topic: "general",
    difficulty: "beginner",
    questions: [
      {
        question: "Jaka jest stolica Australii?",
        answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correctAnswer: "Canberra",
        explanation: "Chociaż Sydney jest największym miastem, stolicą Australii jest Canberra."
      },
      {
        question: "Ile planet znajduje się w Układzie Słonecznym?",
        answers: ["7", "8", "9", "10"],
        correctAnswer: "8",
        explanation: "Od 2006 roku, kiedy Pluton został przeklasyfikowany na planetę karłowatą, w Układzie Słonecznym jest 8 planet."
      }
    ]
  }],
  ["sci-fi-cinema-1", {
    id: "sci-fi-cinema-1",
    title: "Kino Science-Fiction",
    topic: "cinema",
    difficulty: "intermediate",
    questions: [
      {
        question: "Kto wyreżyserował film 'Blade Runner' z 1982 roku?",
        answers: ["George Lucas", "Steven Spielberg", "James Cameron", "Ridley Scott"],
        correctAnswer: "Ridley Scott",
        explanation: "Ridley Scott jest reżyserem oryginalnego 'Łowcy androidów' (Blade Runner)."
      }
    ]
  }]
]);
function getEnv(locals) {
  return locals?.runtime?.env || {};
}
const GET = async ({ url }) => {
  const list = url.searchParams.get("list");
  const id = url.searchParams.get("id");
  if (list) {
    const quizList = Array.from(premadeQuizzes.values()).map((q) => ({ id: q.id, title: q.title, topic: q.topic, difficulty: q.difficulty }));
    return new Response(JSON.stringify({ success: true, quizzes: quizList }), { status: 200 });
  }
  if (id) {
    const quiz = premadeQuizzes.get(id);
    if (quiz) {
      return new Response(JSON.stringify({ success: true, quiz }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false, error: "Quiz not found" }), { status: 404 });
    }
  }
  return new Response(JSON.stringify({ success: false, error: "Invalid request. Use ?list=true or ?id=<quiz_id>." }), { status: 400 });
};
const POST = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const aiBinding = env.AI;
    if (!aiBinding) {
      throw new Error("AI binding is not configured in your environment.");
    }
    const { topic, difficulty, questionCount = 5 } = await request.json();
    if (!topic || !difficulty) {
      return new Response(JSON.stringify({ error: "Topic and difficulty are required" }), { status: 400 });
    }
    const difficultyLevels = {
      beginner: "podstawowy - proste pytania wprowadzające",
      intermediate: "średniozaawansowany - pytania wymagające analizy",
      advanced: "zaawansowany - kompleksowe scenariusze",
      expert: "ekspert - najwyższy poziom trudności"
    };
    const systemPrompt = `You are an expert at creating educational quizzes. Create a quiz on the topic of "${topic}" at the "${difficultyLevels[difficulty]}" level. You must generate exactly ${questionCount} questions. You must respond with a valid JSON object only.`;
    const userPrompt = `The JSON object must have a "questions" key, which is an array of question objects. Each question object must have the following keys:
    - "question": The question text (in Polish).
    - "answers": An array of 4 possible answers (in Polish).
    - "correctAnswer": The exact string of the correct answer.
    - "explanation": A brief explanation of why the answer is correct (in Polish).
    
    Example format:
    {
      "questions": [
        {
          "question": "...",
          "answers": ["...", "...", "...", "..."],
          "correctAnswer": "...",
          "explanation": "..."
        }
      ]
    }`;
    const aiResponse = await aiBinding.run("@cf/google/gemma-2-9b-it", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 2500
    });
    let quizData;
    try {
      const jsonMatch = aiResponse.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch || !jsonMatch[0]) throw new Error("No JSON object found in AI response.");
      quizData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse AI response for quiz:", aiResponse.response);
      throw new Error("AI returned data in an invalid format.");
    }
    return new Response(JSON.stringify({
      success: true,
      quiz: quizData,
      topic,
      difficulty
    }), { status: 200 });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return new Response(JSON.stringify({ error: "Internal server error", message: error.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
