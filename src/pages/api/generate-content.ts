/**
 * GENERATOR TREŚCI MARKETINGOWYCH
 * 
 * 🤖 MODEL AI: GEMINI 2.5 FLASH
 * • API: Google Generative Language API
 * • Model: gemini-2.5-flash
 * • Authentication: x-goog-api-key header (NIE query param!)
 * • Env: GOOGLE_API_KEY
 * 
 * 🎯 Zastosowanie:
 * - Posty na Facebook, Instagram, LinkedIn
 * - Opisy produktów e-commerce
 * - Ogłoszenia usług
 * - Newslettery
 * - Artykuły blogowe
 * - Opisy firm
 * 
 * 💡 Cechy:
 * - Szybkie generowanie (2-3s)
 * - 100% po polsku
 * - Dostosowany ton (profesjonalny, przyjazny, entuzjastyczny, etc.)
 * - Regulowana długość (krótka/średnia/długa)
 */
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

    // 🔑 Pobieranie klucza API z Cloudflare env (obsługa spacjów)
    const env = locals.runtime?.env || {};
    const apiKey = env['GOOGLE_API_KEY'] || env[' GOOGLE_API_KEY'] ||
      Object.entries(env).find(([k]) => k.trim() === 'GOOGLE_API_KEY')?.[1];

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

    // Wywołanie Google Gemini 2.5 Flash
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
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
        JSON.stringify({
          error: 'Błąd API Gemini',
          details: error,
          status: response.status
        }),
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
