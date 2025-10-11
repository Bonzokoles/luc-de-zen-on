
import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

// --- Symulacja Bazy Danych i Sesji Quizu ---
// W prawdziwej aplikacji użylibyśmy KV lub D1 do przechowywania sesji
const quizSessions = new Map<string, any>();

interface QuizRequest {
  action: 'start_quiz' | 'submit_answer';
  topic?: string;
  sessionId?: string;
  answer?: string;
}

const generateQuizPrompt = (topic: string) => `
Jesteś ekspertem w tworzeniu quizów edukacyjnych. Twoim zadaniem jest wygenerowanie quizu składającego się z 5 pytań na podany temat.

Temat: "${topic}"

Zasady:
1.  Każde pytanie musi mieć 4 możliwe odpowiedzi (A, B, C, D).
2.  Tylko jedna odpowiedź może być poprawna.
3.  Pytania powinny stopniowo zwiększać swoją trudność.

Zwróć odpowiedź w formacie JSON, jako obiekt z kluczem "quiz", który zawiera tablicę 5 obiektów. Każdy obiekt w tablicy musi mieć klucze:
- "question": "treść pytania" (string)
- "options": { "A": "...", "B": "...", "C": "...", "D": "..." } (object)
- "correctAnswer": "A" (string, klucz poprawnej odpowiedzi)
- "explanation": "Krótkie wyjaśnienie, dlaczego ta odpowiedź jest poprawna." (string)

Nie dodawaj żadnych dodatkowych opisów ani wstępów, tylko czysty obiekt JSON.
`;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.AI) {
      return createErrorResponse("Środowisko AI nie jest dostępne.", 503);
    }

    const body = (await request.json()) as QuizRequest;

    switch (body.action) {
      case 'start_quiz': {
        if (!body.topic) return createErrorResponse("Temat jest wymagany, aby rozpocząć quiz.", 400);

        const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages: [{ role: "system", content: generateQuizPrompt(body.topic) }],
          response_format: { type: "json_object" },
        });

        const cleanedResponse = aiResponse.response.replace(/```json\n|\n```/g, '');
        const result = JSON.parse(cleanedResponse);

        if (!result.quiz || !Array.isArray(result.quiz) || result.quiz.length === 0) {
          return createErrorResponse("AI nie wygenerowało poprawnego quizu.", 500);
        }

        const sessionId = `quiz_${Date.now()}`;
        const sessionData = {
          questions: result.quiz,
          currentQuestionIndex: 0,
          score: 0,
          topic: body.topic,
        };
        quizSessions.set(sessionId, sessionData);

        const firstQuestion = { ...sessionData.questions[0] };
        delete firstQuestion.correctAnswer; // Nie wysyłaj poprawnej odpowiedzi do klienta
        delete firstQuestion.explanation;

        return createSuccessResponse({
          sessionId,
          totalQuestions: sessionData.questions.length,
          question: firstQuestion,
        });
      }

      case 'submit_answer': {
        if (!body.sessionId || !body.answer) {
          return createErrorResponse("sessionId i answer są wymagane.", 400);
        }

        const session = quizSessions.get(body.sessionId);
        if (!session) {
          return createErrorResponse("Nie znaleziono sesji quizu.", 404);
        }

        const currentQuestion = session.questions[session.currentQuestionIndex];
        const isCorrect = body.answer === currentQuestion.correctAnswer;

        if (isCorrect) {
          session.score++;
        }

        const response = {
          isCorrect,
          correctAnswer: currentQuestion.correctAnswer,
          explanation: currentQuestion.explanation,
        };

        session.currentQuestionIndex++;

        if (session.currentQuestionIndex < session.questions.length) {
          const nextQuestion = { ...session.questions[session.currentQuestionIndex] };
          delete nextQuestion.correctAnswer;
          delete nextQuestion.explanation;
          response.nextQuestion = nextQuestion;
        } else {
          response.finalScore = session.score;
          response.totalQuestions = session.questions.length;
          quizSessions.delete(body.sessionId); // Zakończ sesję
        }

        return createSuccessResponse(response);
      }

      default:
        return createErrorResponse("Nieznana akcja.", 400);
    }

  } catch (error) {
    console.error("Błąd w /api/quiz-engine:", error);
    const errorMessage = error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
