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
    const body = await request.json() as { prompt: string; sessionId?: string };
    
    // Try Multi-AI Worker first as primary source
    try {
      const workerResponse = await fetch('https://multi-ai-assistant.stolarnia-ams.workers.dev/qwen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: body.prompt,
          sessionId: body.sessionId || 'default',
          context: {
            source: 'chat_api',
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (workerResponse.ok) {
        const workerData = await workerResponse.json();
        if (workerData.success && workerData.response) {
          return new Response(JSON.stringify({ 
            answer: workerData.response,
            source: 'multi-ai-worker',
            model: workerData.model_name
          }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      }
    } catch (workerError) {
      console.warn('Multi-AI Worker failed, falling back to local AI:', workerError);
    }

    // Fallback to local Cloudflare AI if Worker fails - Better error handling
    try {
      const env = locals?.runtime?.env;
      
      if (!env?.AI) {
        // If no AI binding available, return graceful fallback
        return new Response(JSON.stringify({ 
          answer: 'Cześć! System AI jest chwilowo niedostępny, ale już pracujemy nad rozwiązaniem.',
          source: 'chat-static-fallback'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Use available Cloudflare model as fallback
      const response = await env.AI.run("@cf/qwen/qwen1.5-0.5b-chat", {
        messages: [
          {
            role: "system", 
            content: "Jesteś pomocnym asystentem AI. Odpowiadaj w języku polskim, zwięźle i konkretnie."
          },
          {
            role: "user", 
            content: body.prompt
          }
        ]
      });

      return new Response(JSON.stringify({ 
        answer: response.response || "Przepraszam, nie udało się wygenerować odpowiedzi.",
        source: 'cloudflare-ai-fallback'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (aiError) {
      console.warn('Cloudflare AI binding also failed:', aiError);
      // Final graceful fallback
      return new Response(JSON.stringify({ 
        answer: 'Cześć! Jestem Twoim asystentem AI. System jest chwilowo niedostępny, ale już nad tym pracujemy.',
        source: 'chat-error-fallback'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

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
