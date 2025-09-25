import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt, mode = 'standard' } = await request.json();

    // Vertex AI configuration
    const VERTEX_AI_CONFIG = {
      projectId: 'zenon-project-467918',
      location: 'us-central1',
      model: 'gemini-1.5-pro'
    };

    // System prompts for different modes
    const SYSTEM_PROMPTS = {
      standard: 'Jesteś ekspertem od katalogów produktów. Generuj czytelne i profesjonalne opisy produktów z kluczowymi informacjami.',
      creative: 'Jesteś kreatywnym copywriterem. Twórz angażujące i unikalnie opisy produktów które przyciągną uwagę klientów.',
      technical: 'Jesteś ekspertem technicznym. Koncentruj się na specyfikacjach, parametrach i szczegółach technicznych produktów.',
      marketing: 'Jesteś specjalistą od marketingu. Twórz opisy produktów które przekonują do zakupu i podkreślają korzyści.'
    };

    // Construct the full prompt
    const fullPrompt = `${SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS]}

ZADANIE: ${prompt}

FORMAT ODPOWIEDZI:
- Nazwa produktu
- Kategoria
- Krótki opis (1-2 zdania)
- Kluczowe cechy (3-5 punktów)
- Cena sugerowana
- Tagi/słowa kluczowe

Odpowiedź w języku polskim, format JSON.`;

    // For now, simulate Vertex AI response
    // In production, integrate with actual Vertex AI API using the JSON key
    const mockResponse = {
      generated_content: {
        name: 'AI-Generated Product',
        category: 'Software',
        description: 'Innowacyjny produkt wygenerowany przez AI z zaawansowanymi funkcjonalnościami.',
        features: [
          'Automatyzacja procesów',
          'Integracja z API',
          'Responsywny design',
          'Cloud-native architecture'
        ],
        suggested_price: '$299',
        tags: ['ai', 'automation', 'cloud', 'api']
      },
      metadata: {
        model: VERTEX_AI_CONFIG.model,
        mode: mode,
        timestamp: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify({
      success: true,
      data: mockResponse,
      timestamp: Date.now()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Vertex AI API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to generate content with Vertex AI',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};