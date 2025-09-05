export async function post({ request }: { request: Request }) {
  try {
    const { prompt, workflowId } = await request.json();

    if (!prompt || prompt.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Prompt jest wymagany' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get Flowise API configuration from environment
    const FLOWISE_API_URL = import.meta.env.FLOWISE_API_URL || 'https://api.flowise.com/api/v1';
    const FLOWISE_API_TOKEN = import.meta.env.FLOWISE_API_TOKEN;

    if (!FLOWISE_API_TOKEN) {
      return new Response(
        JSON.stringify({ 
          error: 'Flowise API token nie jest skonfigurowany. Sprawdź plik .env',
          fallback: 'Używam symulowanej odpowiedzi Flowise AI'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Try to call actual Flowise API
    const flowiseEndpoint = `${FLOWISE_API_URL}/chatflows/${workflowId || 'default'}/prediction`;
    
    const response = await fetch(flowiseEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FLOWISE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: prompt,
        history: [],
        uploads: []
      }),
    });

    if (!response.ok) {
      // Fallback to simulated response if API fails
      console.log(`Flowise API failed: ${response.status}, using fallback`);
      
      const simulatedResponse = {
        text: `Flowise AI Response (Simulated):\n\nPrzetwarzam zapytanie: "${prompt}"\n\nTo jest symulowana odpowiedź z Flowise AI. System workflow automation jest gotowy.\n\nAby podłączyć prawdziwy Flowise API:\n1. Skonfiguruj FLOWISE_API_TOKEN w .env\n2. Ustaw FLOWISE_API_URL (opcjonalne)\n3. Utworz workflow w Flowise dashboard\n\nSystem MyBonzo jest gotowy do integracji!`,
        sourceDocuments: [],
        chatId: `sim-${Date.now()}`,
        metadata: {
          simulation: true,
          timestamp: new Date().toISOString(),
          prompt: prompt
        }
      };

      return new Response(JSON.stringify(simulatedResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      ...data,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'flowise-api',
        prompt: prompt
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Flowise API error:', error);
    
    // Return fallback response on error
    const fallbackResponse = {
      text: `Flowise AI (Fallback Mode)\n\nWystąpił błąd podczas połączenia z Flowise API.\n\nTwoje zapytanie: "${prompt || 'unknown'}"\n\nSystem workflow automation jest skonfigurowany i gotowy.\nSprawdź konfigurację API w pliku .env lub skontaktuj się z administratorem.\n\nError: ${error?.message || 'Unknown error'}`,
      error: error?.message || 'Unknown error',
      fallback: true,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function get() {
  return new Response(JSON.stringify({
    status: 'Flowise API endpoint aktywny',
    available_methods: ['POST'],
    description: 'Endpoint do wywołania Flowise AI workflows',
    usage: {
      method: 'POST',
      body: {
        prompt: 'Twoje zapytanie do AI',
        workflowId: 'optional-workflow-id'
      }
    },
    configuration: {
      FLOWISE_API_URL: import.meta.env.FLOWISE_API_URL || 'not configured',
      FLOWISE_API_TOKEN: import.meta.env.FLOWISE_API_TOKEN ? 'configured' : 'not configured'
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
