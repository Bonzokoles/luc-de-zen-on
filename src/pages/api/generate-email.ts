import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { emailType, recipient, purpose, tone, additionalInfo } = await request.json();

    if (!emailType || !recipient || !purpose) {
      return new Response(
        JSON.stringify({ error: 'Brak wymaganych danych' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = locals.runtime?.env?.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Brak klucza API' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Jesteś profesjonalnym asystentem do pisania emaili biznesowych po polsku.
Tworzysz uprzejme, konkretne i profesjonalne wiadomości email zgodne z polskimi standardami biznesowymi.`;

    const userPrompt = `Napisz ${emailType} do: ${recipient}

Cel emaila: ${purpose}
Ton: ${tone || 'profesjonalny'}
${additionalInfo ? `Dodatkowe informacje: ${additionalInfo}` : ''}

Wymagania:
- Email ma być profesjonalny i zgodny z polską etykietą biznesową
- Użyj odpowiedniego zwrotu grzecznościowego
- Zakończ odpowiednią formułą końcową
- Email powinien mieć wyraźną strukturę (temat, powitanie, treść, zakończenie)
- Język: Polski

Format:
TEMAT: [temat emaila]

[treść emaila z odpowiednimi akapitami]`;

    // GPT-4 TURBO - najlepszy do profesjonalnych emaili biznesowych
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 700
      })
    });

    if (!response.ok) {
      throw new Error('Błąd API');
    }

    const data = await response.json();
    const generatedEmail = data.choices[0]?.message?.content || '';

    return new Response(
      JSON.stringify({ email: generatedEmail }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Wystąpił błąd' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
