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
    const body = await request.json() as { prompt: string; model?: string; temperature?: number; system?: string; language?: 'pl' | 'en' | 'auto' };
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

    const language = body.language === 'en' ? 'en' : 'pl';
    const modelId = body.model?.startsWith('@cf/') ? body.model : (
      body.model === 'qwen-pl' ? '@cf/qwen/qwen2.5-7b-instruct' :
        body.model === 'llama-8b' ? '@cf/meta/llama-3.1-8b-instruct' :
          env.ADVANCED_TEXT_MODEL || env.DEFAULT_TEXT_MODEL || '@cf/meta/llama-3.1-8b-instruct'
    );

    const systemPrompt = body.system ?? (language === 'en'
      ? 'You are a helpful AI assistant. Answer concisely.'
      : 'Jesteś pomocnym asystentem AI. Odpowiadaj po polsku, zwięźle i konkretnie.');

    // Użyj Cloudflare Workers AI z wybranym modelem
    const response = await env.AI.run(modelId, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: body.prompt }
      ],
      temperature: typeof body.temperature === 'number' ? body.temperature : 0.6,
    });

    return new Response(JSON.stringify({
      answer: response.response || "Przepraszam, nie udało się wygenerować odpowiedzi.",
      modelUsed: modelId
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
