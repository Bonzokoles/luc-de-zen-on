import type { APIRoute } from 'astro';
import OpenAI from 'openai';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { userAnswers, quizTopic, difficulty } = await request.json();
    
    if (!userAnswers || !Array.isArray(userAnswers)) {
      return new Response(JSON.stringify({ error: 'User answers are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate basic score
    const totalQuestions = userAnswers.length;
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Initialize OpenAI for personalized feedback
    const openai = new OpenAI({
      apiKey: import.meta.env.OPENAI_API_KEY,
    });

    const systemMessage = {
      role: "system" as const,
      content: "Jesteś doświadczonym nauczycielem tworzącym spersonalizowany feedback dla uczniów. Analizujesz wyniki quizu i dajesz konstruktywne, motywujące wskazówki do dalszej nauki."
    };

    const answersAnalysis = userAnswers.map(answer => 
      `Pytanie: ${answer.question}\nWybrana odpowiedź: ${answer.selectedAnswer}\nPoprawna odpowiedź: ${answer.correctAnswer}\nCzy poprawna: ${answer.isCorrect ? 'TAK' : 'NIE'}`
    ).join('\n\n');

    const userMessage = {
      role: "user" as const,
      content: `Przeanalizuj wyniki quizu ucznia:

Temat quizu: ${quizTopic || 'Nieokreślony'}
Poziom trudności: ${difficulty || 'Nieokreślony'}
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
      max_tokens: 1000,
      temperature: 0.7,
    });

    const responseText = response.choices[0].message.content;
    
    try {
      const feedbackData = JSON.parse(responseText || '{}');
      
      return new Response(JSON.stringify({ 
        success: true,
        score: score,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        percentage: score,
        ...feedbackData
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (parseError) {
      // Fallback if AI response parsing fails
      return new Response(JSON.stringify({ 
        success: true,
        score: score,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        percentage: score,
        feedback: `Gratulacje! Ukończyłeś quiz z wynikiem ${score}%. ${score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job, keep learning!' : 'Keep practicing to improve your score!'}`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Error generating quiz feedback:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};