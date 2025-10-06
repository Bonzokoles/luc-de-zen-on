import type { APIRoute } from 'astro';
import { getApiKey } from '../../utils/loadEnv.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { userProfile } = await request.json();
    
    if (!userProfile) {
      return new Response(JSON.stringify({ error: 'User profile is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Load OpenAI API key
    const openaiKey = getApiKey('OPENAI_API_KEY');

    // Create detailed prompt for education recommendations
    const prompt = `Na podstawie profilu użytkownika, wygeneruj spersonalizowane rekomendacje kursów i materiałów edukacyjnych.

Profil użytkownika: ${JSON.stringify(userProfile, null, 2)}

Uwzględnij:
- Obecny poziom umiejętności
- Zainteresowania i cele zawodowe
- Dostępny czas na naukę
- Preferowany styl uczenia się
- Budżet (jeśli podany)

Format odpowiedzi:
🎯 REKOMENDOWANE KURSY:
1. [Nazwa kursu] - [Dostawca] - [Czas trwania] - [Poziom]
   💡 Dlaczego: [uzasadnienie]
   🔗 Link: [link lub "sprawdź na platformie X"]

📚 MATERIAŁY UZUPEŁNIAJĄCE:
- [księga/artykuł/podcast]

⏰ PLAN NAUKI:
- [sugestie harmonogramu]

💰 OPCJE BUDŻETOWE:
- [darmowe alternatywy]`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Jesteś ekspertem edukacyjnym, który pomaga w doborze kursów i materiałów edukacyjnych. Generuj praktyczne, spersonalizowane rekomendacje.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        max_tokens: 1200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error: `OpenAI API error: ${error}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const recommendations = data.choices[0].message.content;

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
