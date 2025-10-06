import type { APIRoute } from 'astro';
import OpenAI from 'openai';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { preferences, history, userProfile } = await request.json();
    
    if (!preferences) {
      return new Response(JSON.stringify({ error: 'User preferences are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize OpenAI with API key from environment
    const openai = new OpenAI({
      apiKey: import.meta.env.OPENAI_API_KEY,
    });

    const systemMessage = {
      role: "system" as const,
      content: "Jesteś ekspertem rekomendacji produktów i usług, analizujący preferencje użytkowników i tworzący spersonalizowane propozycje. Zawsze zwracaj odpowiedź w formacie JSON z tablicą obiektów zawierających: title, description, reason, category, priority (1-5)."
    };

    const historyText = history && Array.isArray(history) ? history.join(', ') : 'brak historii';
    const profileText = userProfile ? `Profil użytkownika: ${JSON.stringify(userProfile)}` : '';

    const userMessage = {
      role: "user" as const,
      content: `Bazując na preferencjach użytkownika: "${preferences}", jego historii: "${historyText}" ${profileText}, zaproponuj 3-5 spersonalizowanych produktów lub usług. 
      
      Zwróć odpowiedź w formacie JSON:
      {
        "recommendations": [
          {
            "title": "Nazwa produktu/usługi",
            "description": "Opis korzyści i funkcji",
            "reason": "Dlaczego to pasuje do użytkownika",
            "category": "kategoria",
            "priority": 1-5
          }
        ]
      }
      
      Napisz w stylu przyjaznym, lekkim, zachęcającym do zakupu, podkreślając korzyści i unikalne cechy.`
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, userMessage],
      max_tokens: 800,
      temperature: 0.7,
    });

    const generatedText = response.choices[0].message.content;
    
    // Try to parse the JSON response
    let recommendations;
    try {
      const parsed = JSON.parse(generatedText || '{}');
      recommendations = parsed.recommendations || [];
    } catch (parseError) {
      // If JSON parsing fails, create a fallback response
      recommendations = [{
        title: "Rekomendacja spersonalizowana",
        description: generatedText || "Brak dostępnych rekomendacji",
        reason: "Oparte na Twoich preferencjach",
        category: "ogólne",
        priority: 3
      }];
    }

    return new Response(JSON.stringify({ 
      success: true,
      recommendations: recommendations,
      preferences: preferences,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
