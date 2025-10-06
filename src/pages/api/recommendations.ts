import type { APIRoute } from 'astro';

// Helper to get secrets
function getEnv(locals: App.Locals): Record<string, any> {
  return import.meta.env.DEV ? process.env : locals?.runtime?.env || {};
}

async function generateRecommendationsWithModel(
  aiBinding: any,
  modelName: string, 
  userProfile: string, 
  type: string, 
  context: string = '', 
): Promise<any> {
  const prompt = `
Jesteś światowej klasy ekspertem od rekomendacji w dziedzinie ${type}. Przeanalizuj profil użytkownika i wygeneruj 3 spersonalizowane rekomendacje.

PROFIL UŻYTKOWNIKA:
${userProfile}

DODATKOWY KONTEKST:
${context || 'Brak'}

WYMAGANIA:
- Rekomendacje muszą być konkretne, praktyczne i gotowe do wdrożenia.
- Podaj tytuł, opis i powód rekomendacji (dlaczego pasuje do profilu).
- Oceń priorytet (1-5, gdzie 5 to najwyższy).
- Odpowiadaj w języku polskim.
- Musisz zwrócić odpowiedź jako pojedynczy, poprawny obiekt JSON.

FORMAT ODPOWIEDZI:
{
  "recommendations": [
    {
      "title": "Tytuł rekomendacji 1",
      "description": "Szczegółowy opis, co należy zrobić.",
      "reason": "Dlaczego to jest idealne dla tego użytkownika.",
      "priority": 5,
      "category": "${type}"
    }
  ]
}
`;

  try {
    const aiResponse = await aiBinding.run(modelName, {
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2048,
    });

    let parsedResponse;
    try {
        const jsonMatch = aiResponse.response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON object found in AI response.');
        parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (e) {
        console.error(`Failed to parse JSON from model ${modelName}:`, aiResponse.response);
        throw new Error(`Model ${modelName} returned invalid data.`);
    }

    return {
      model: modelName,
      success: true,
      ...parsedResponse
    };

  } catch (error: any) {
    console.error(`Error with model ${modelName}:`, error);
    return { model: modelName, success: false, error: error?.message };
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const aiBinding = env.AI;
    if (!aiBinding) throw new Error('AI binding is not configured.');

    const body = await request.json();
    const { preferences, history, userProfile, recommendationType = 'mixed' } = body;
    
    if (!preferences) {
      return new Response(JSON.stringify({ error: 'User preferences are required' }), { status: 400 });
    }

    // For this implementation, we'll use one powerful model.
    // The structure allows for more models to be added easily.
    const selectedModels = ['@cf/google/gemma-2-9b-it'];

    const fullUserProfile = `Preferencje: ${preferences}. Historia interakcji: ${history?.join(', ') || 'brak'}. Profil: ${JSON.stringify(userProfile)}`;

    const modelResults = await Promise.allSettled(
      selectedModels.map(modelName => 
        generateRecommendationsWithModel(aiBinding, modelName, fullUserProfile, recommendationType)
      )
    );

    const successfulResults = modelResults
      .filter(result => result.status === 'fulfilled' && result.value.success)
      .map(result => (result as PromiseFulfilledResult<any>).value);

    const allRecommendations = successfulResults.flatMap(res => res.recommendations || []);
    
    // Simple ranking by priority
    allRecommendations.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    const response = {
      success: true,
      recommendations: allRecommendations.slice(0, 8), // Return top 8
    };

    return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error('Recommendations API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', message: error?.message }), { status: 500 });
  }
};