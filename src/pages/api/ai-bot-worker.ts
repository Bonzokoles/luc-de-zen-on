import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { prompt, model, temperature = 0.7, language = 'pl' } = body;

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

    // Check for OpenAI API key from environment
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (OPENAI_API_KEY) {
      try {
        // Real OpenAI API call
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: selectedModel.includes('gpt') ? selectedModel : 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: language === 'pl' 
                  ? 'Jesteś pomocnym asystentem AI. Odpowiadaj po polsku w przystępny i przyjazny sposób.'
                  : 'You are a helpful AI assistant. Respond in a clear and friendly manner.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: temperature,
            max_tokens: 1000
          })
        });

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json();
          const aiResponse = openaiData.choices[0]?.message?.content || 'Brak odpowiedzi od API';
          
          return new Response(
            JSON.stringify({ 
              answer: aiResponse,
              model: selectedModel,
              status: 'api_success',
              tokens_used: openaiData.usage?.total_tokens || 0
            }),
            { 
              status: 200,
              headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              }
            }
          );
        }
      } catch (apiError) {
        console.error('OpenAI API error:', apiError);
        // Fall through to demo mode
      }
    }

    // Fallback response gdy brak klucza API lub błąd - używamy demo mode
    const fallbackResponses = [
      `Rozumiem Twoje pytanie: "${prompt}". To jest demo odpowiedź z modelu ${selectedModel}. Aby uzyskać pełną funkcjonalność, skonfiguruj klucz OpenAI API w zmiennych środowiskowych (OPENAI_API_KEY).`,
      `Dziękuję za pytanie dotyczące: "${prompt}". System AI używa modelu ${selectedModel} w trybie demonstracyjnym. Pełne odpowiedzi wymagają konfiguracji API.`,
      `Twoje zapytanie "${prompt}" zostało przetworzone przez model ${selectedModel}. Chatbot pracuje w trybie demo - aby uzyskać prawdziwe odpowiedzi AI, wymagana jest konfiguracja API.`
    ];
    
    return new Response(
      JSON.stringify({ 
        answer: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        model: selectedModel,
        status: 'demo_mode',
        note: 'Chatbot działa w trybie demo. Skonfiguruj OPENAI_API_KEY dla pełnej funkcjonalności.'
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
  return createSuccessResponse({ 
    message: 'AI Chatbot Worker is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST request with { prompt: "your message", model?: "model-name", temperature?: 0.7 }'
  });
}
