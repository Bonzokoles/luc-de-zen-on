// Cloudflare Pages Function for OpenRouter Chat
export async function onRequestPost(context) {
  try {
    const { messages, model = 'anthropic/claude-3.7-sonnet' } = await context.request.json();

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Brak wiadomości' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = context.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Brak klucza API OpenRouter' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemMessage = {
      role: 'system',
      content: `Jesteś profesjonalnym asystentem biznesowym dla polskich przedsiębiorców - ZENON_Biznes_HUB AI.

Twoja rola:
- Pomagasz w prowadzeniu biznesu - od strategii po codzienne zadania
- Odpowiadasz ZAWSZE po polsku
- Używasz prostego, zrozumiałego języka
- Jesteś przyjazny, ale profesjonalny
- Dajesz konkretne, praktyczne rady

Obszary ekspertyzy: Strategia biznesowa, Marketing, Finanse, Prawo gospodarcze, Zarządzanie, CRM, E-commerce, Produktywność`
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://luc-de-zen-on.pages.dev',
        'X-Title': 'ZENON Biznes HUB'
      },
      body: JSON.stringify({
        model,
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 4000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: 'Błąd OpenRouter API', details: errorData.error?.message }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Wystąpił błąd', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
