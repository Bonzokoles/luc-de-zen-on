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

    const { userProfile } = await request.json();
    
    if (!userProfile) {
      return new Response(JSON.stringify({ error: 'User profile is required' }), { status: 400 });
    }

    // The detailed prompt generation logic is preserved from the original file
    const prompt = `Na podstawie profilu użytkownika, wygeneruj spersonalizowane rekomendacje kursów i materiałów edukacyjnych.

    Profil użytkownika: ${JSON.stringify(userProfile, null, 2)}

    Uwzględnij:
    - Obecny poziom umiejętności
    - Zainteresowania i cele zawodowe
    - Dostępny czas na naukę
    - Preferowany styl uczenia się
    - Budżet (jeśli podany)

    Format odpowiedzi (użyj Markdown):
    🎯 **REKOMENDOWANE KURSY:**
    1. **[Nazwa kursu]** - [Dostawca] - [Czas trwania] - [Poziom]
       *💡 Dlaczego:* [szczegółowe uzasadnienie, dlaczego ten kurs pasuje do profilu]
       *🔗 Link:* [link lub "sprawdź na platformie X"]

    📚 **MATERIAŁY UZUPEŁNIAJĄCE:**
    - **[Książka/Artykuł/Podcast]:** [Tytuł] - [Krótki opis, dlaczego warto]

    ⏰ **SUGEROWANY PLAN NAUKI:**
    - **[Tydzień 1-2]:** [Konkretne zadania lub moduły do przerobienia]
    - **[Tydzień 3-4]:** [Następne kroki]

    💰 **OPCJE BUDŻETOWE:**
    - **[Darmowa Alternatywa]:** [Nazwa darmowego kursu/materiału i gdzie go znaleźć]`;

    const systemPrompt = 'Jesteś ekspertem edukacyjnym i mentorem AI. Twoim zadaniem jest tworzenie praktycznych, wysoce spersonalizowanych i motywujących planów rozwoju. Generuj konkretne, użyteczne rekomendacje w języku polskim.';

    const aiResponse = await aiBinding.run('@cf/google/gemma-2-9b-it', {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2048,
        temperature: 0.7
    });

    const recommendations = aiResponse.response || "AI model did not return a response.";

    return new Response(JSON.stringify({
      recommendations,
      userProfile,
      timestamp: new Date().toISOString(),
      status: 'success'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Education recommendations error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};