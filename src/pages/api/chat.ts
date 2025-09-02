import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

export const GET = async () => {
  return createSuccessResponse({
    message: 'Chat API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST request with { prompt: "your message" }'
  });
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const POST = async ({ request, locals }: { request: Request; locals: any }) => {
  try {
    const body = await request.json() as { prompt: string };
    const env = locals.runtime.env;
    
    if (!env.AI) {
      return new Response(JSON.stringify({ 
        error: 'Cloudflare AI nie jest dostępny',
        answer: 'Przepraszam, system AI jest obecnie niedostępny.'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Użyj modelu Bielik z Cloudflare Workers AI
    const response = await env.AI.run("@hf/speakleash/bielik-7b-instruct-v0.1", {
      messages: [
        {
          role: "system", 
          content: "Jesteś Bielik - pomocnym asystentem AI stworzonym przez polskich badaczy. Odpowiadaj w języku polskim, zwięźle i konkretnie. Jesteś dumny ze swojego polskiego pochodzenia i kultury."
        },
        {
          role: "user", 
          content: body.prompt
        }
      ]
    });

    return new Response(JSON.stringify({ 
      answer: response.response || "Przepraszam, nie udało się wygenerować odpowiedzi."
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Wystąpił błąd podczas połączenia z AI',
      answer: 'Przepraszam, obecnie system AI jest niedostępny. Spróbuj ponownie za chwilę.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
