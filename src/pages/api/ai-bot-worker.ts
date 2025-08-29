export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { prompt, model } = body;

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt jest wymagany' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const selectedModel = model || 'llama-3.1-70b-instruct';

    // Fallback response gdy brak klucza API - używamy demo mode
    const fallbackResponses = [
      `Rozumiem Twoje pytanie: "${prompt}". To jest demo odpowiedź z modelu ${selectedModel}. Aby uzyskać pełną funkcjonalność, skonfiguruj klucz OpenAI API.`,
      `Dziękuję za pytanie dotyczące: "${prompt}". System AI używa modelu ${selectedModel} w trybie demonstracyjnym. Pełne odpowiedzi wymagają konfiguracji API.`,
      `Twoje zapytanie "${prompt}" zostało przetworzone przez model ${selectedModel}. Chatbot pracuje w trybie demo - aby uzyskać prawdziwe odpowiedzi AI, wymagana jest konfiguracja API.`
    ];
    
    return new Response(
      JSON.stringify({ 
        answer: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        model: selectedModel,
        status: 'demo_mode',
        note: 'Chatbot działa w trybie demo. Skonfiguruj API key dla pełnej funkcjonalności.'
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    console.error('Chatbot error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Wystąpił błąd podczas przetwarzania zapytania',
        details: error instanceof Error ? error.message : 'Nieznany błąd'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ 
      message: 'AI Chatbot Worker is running',
      status: 'active',
      methods: ['POST'],
      description: 'Send POST request with { prompt: "your message" }'
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
