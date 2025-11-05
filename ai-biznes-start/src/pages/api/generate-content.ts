import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { contentType, description, tone, length } = await request.json();

    // Walidacja
    if (!contentType || !description) {
      return new Response(
        JSON.stringify({ error: 'Brak wymaganych danych' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Pobranie klucza API
    const apiKey = import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Brak klucza API. Skontaktuj się z administratorem.' }),
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

    // Wywołanie OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      return new Response(
        JSON.stringify({ error: 'Błąd generowania treści. Spróbuj ponownie.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedContent = data.choices[0]?.message?.content || '';

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
