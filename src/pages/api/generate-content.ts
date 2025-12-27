import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { contentType, description, tone, length } = await request.json();

    // Walidacja
    if (!contentType || !description) {
      return new Response(
        JSON.stringify({ error: 'Brak wymaganych danych' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // GEMINI 2.0 FLASH - najlepszy do kreatywnych treści marketingowych
    const apiKey = locals.runtime?.env?.GOOGLE_API_KEY || locals.runtime?.env['GOOGLE_API_KEY'];

    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Brak klucza API',
          debug: {
            hasRuntime: !!locals.runtime,
            hasEnv: !!locals.runtime?.env,
            keys: locals.runtime?.env ? Object.keys(locals.runtime.env).slice(0, 5) : []
          }
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Przygotowanie promptu
    const systemPrompt = `Jesteś profesjonalnym copywriterem specjalizującym się w treściach marketingowych po polsku.
Tworzysz angażujące, przekonujące i profesjonalne teksty dostosowane do potrzeb klienta.`;

    const userPrompt = `Utwórz ${contentType} o następującej tematyce: ${description}

Wymagania:
- Ton: ${tone || 'profesjonalny'}
- Długość: ${length || 'średnia'}
- Język: Polski
- Format: Gotowy do użycia, bez dodatkowych wyjaśnień

Pamiętaj:
- Użyj chwytliwego nagłówka
- Dodaj odpowiednie emotikony jeśli pasują
- Tekst ma być atrakcyjny i zachęcający do działania
- Dostosuj styl do polskiego rynku`;

    // Wywołanie Google Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 1024,
          topP: 0.95
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API Error:', error);
      return new Response(
        JSON.stringify({ error: 'Błąd generowania treści. Spróbuj ponownie.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return new Response(
      JSON.stringify({ content: generatedContent }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Wystąpił błąd. Spróbuj ponownie.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
