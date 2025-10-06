import type { APIRoute } from 'astro';

// Helper to get secrets from Cloudflare environment
function getEnv(locals: App.Locals): Record<string, any> {
  return import.meta.env.DEV ? process.env : locals?.runtime?.env || {};
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const aiBinding = env.AI;

    if (!aiBinding) {
      throw new Error('AI binding is not configured in your environment.');
    }

    const { question, selectedAnswer, correctAnswer, isCorrect, topic, difficulty } = await request.json();
    
    if (question === undefined || selectedAnswer === undefined || correctAnswer === undefined || isCorrect === undefined) {
      return new Response(JSON.stringify({ error: 'Required fields are missing from the request body.' }), { status: 400 });
    }

    const systemPrompt = "You are an experienced and encouraging teacher providing personalized feedback to a student after they've answered a quiz question. Your response must be in Polish.";
    
    const userPrompt = `A student answered a quiz question. Here is the data:
    - Topic: ${topic || 'General Knowledge'}
    - Difficulty: ${difficulty || 'Not specified'}
    - Question: \"${question}\"
    - Their Answer: \"${selectedAnswer}\"
    - Correct Answer: \"${correctAnswer}\"
    - Was their answer correct? ${isCorrect ? 'Yes' : 'No'}`;

    const aiResponse = await aiBinding.run('@cf/google/gemma-2-9b-it', {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 400,
    });

    const feedback = aiResponse.response || (isCorrect ? "Dobra robota! To poprawna odpowiedź." : "Niestety, to nie jest poprawna odpowiedź. Spróbuj jeszcze raz!");

    return new Response(JSON.stringify({ 
      success: true,
      feedback: feedback
    }), { status: 200 });

  } catch (error) {
    console.error('Error generating quiz feedback:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', message: error.message }), { status: 500 });
  }
};
