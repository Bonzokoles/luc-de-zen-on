import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

export const GET = async () => {
  return createSuccessResponse({
    message: 'Bielik Chat API - Polski model językowy',
    status: 'active',
    model: '@hf/speakleash/bielik-7b-instruct-v0.1',
    description: 'Bielik to polski model językowy stworzony przez SpeakLeash',
    capabilities: [
      'Polski język naturalny',
      'Rozumienie kontekstu kulturowego',
      'Specjalistyczna wiedza techniczna',
      'Kreatywne myślenie',
      'Analiza i synteza informacji'
    ],
    methods: ['GET', 'POST', 'OPTIONS']
  });
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const POST = async ({ request, locals }: { request: Request; locals: any }) => {
  try {
    const body = await request.json() as { 
      prompt: string; 
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
    };
    
    const env = locals.runtime.env;
    
    if (!env.AI) {
      return new Response(JSON.stringify({ 
        error: 'Cloudflare AI nie jest dostępny',
        answer: 'Przepraszam, system Bielik jest obecnie niedostępny.'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const systemPrompt = body.systemPrompt || 
      `Jesteś Bielik - zaawansowanym polskim modelem językowym stworzonym przez zespół SpeakLeash. 
      
      Twoje kluczowe cechy:
      🇵🇱 Jesteś dumny ze swojego polskiego pochodzenia i kultury
      🧠 Posiadasz głęboką wiedzę o Polsce, jej historii, kulturze i tradycjach
      💡 Myślisz kreatywnie i analitycznie
      🎯 Jesteś precyzyjny i konkretny w odpowiedziach
      🤝 Jesteś pomocny i życzliwy
      
      Zawsze odpowiadaj w języku polskim, chyba że użytkownik wyraźnie prosi o inny język.
      Staraj się być osobisty, ciepły, ale jednocześnie profesjonalny.`;

    // Użyj modelu Bielik z Cloudflare Workers AI
    const response = await env.AI.run("@hf/speakleash/bielik-7b-instruct-v0.1", {
      messages: [
        {
          role: "system", 
          content: systemPrompt
        },
        {
          role: "user", 
          content: body.prompt
        }
      ],
      temperature: body.temperature || 0.7,
      max_tokens: body.maxTokens || 2048
    });

    return new Response(JSON.stringify({ 
      answer: response.response || "Przepraszam, nie udało się wygenerować odpowiedzi.",
      model: "@hf/speakleash/bielik-7b-instruct-v0.1",
      timestamp: new Date().toISOString(),
      success: true
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Bielik Chat API Error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Wystąpił błąd podczas połączenia z modelem Bielik',
      answer: 'Przepraszam, obecnie Bielik jest niedostępny. Spróbuj ponownie za chwilę.',
      success: false
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
