import { createOPTIONSHandler } from '../../utils/corsUtils';

type ChatBody = {
  prompt: string;
  sessionId?: string;
  model?: 'gemma' | 'qwen' | 'deepseek';
  context?: Record<string, any>;
};

export const GET = async () => {
  return new Response(
    JSON.stringify({
      message: 'POLACZEK Chat API is running',
      status: 'active',
      methods: ['GET', 'POST', 'OPTIONS'],
      defaultModel: 'gemma',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const POST = async ({ request, locals }: { request: Request; locals: any }) => {
  try {
    const body = (await request.json()) as ChatBody;
    const prompt = body.prompt?.toString() ?? '';
    const sessionId = body.sessionId || 'polaczek';
    const model = (body.model || 'gemma') as ChatBody['model'];

    if (!prompt.trim()) {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 1) Try Multi-AI Worker specific endpoint first
    try {
      const modelPath = model === 'deepseek' ? 'deepseek' : model === 'qwen' ? 'qwen' : 'gemma';
      const workerResp = await fetch(`https://multi-ai-assistant.stolarnia-ams.workers.dev/${modelPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, sessionId, context: { source: 'polaczek_api', ...body.context } }),
      });

      if (workerResp.ok) {
        const data = await workerResp.json();
        if (data?.success && data?.response) {
          return new Response(
            JSON.stringify({ answer: data.response, model: data.model_name || modelPath, source: 'multi-ai-worker' }),
            { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
          );
        }
      }
    } catch (err) {
      console.warn('Multi-AI Worker request failed, falling back to Cloudflare AI:', err);
    }

    // 2) Fallback to Cloudflare AI binding - Better error handling
    try {
      const env = locals?.runtime?.env;
      if (!env?.AI) {
        // If no AI binding, return worker response only
        return new Response(
          JSON.stringify({ 
            error: 'AI backend unavailable', 
            answer: 'Przepraszam, system jest chwilowo niedostępny.',
            source: 'polaczek-fallback'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }

      const modelId = model === 'deepseek'
        ? '@hf/thebloke/deepseek-coder-6.7b-instruct-awq'
        : model === 'qwen'
        ? '@cf/qwen/qwen1.5-0.5b-chat'
        : '@cf/google/gemma-2b-it';

      const cfResp = await env.AI.run(modelId, {
        messages: [
          { role: 'system', content: 'Jesteś POLACZEK – pomocnym polskim asystentem do obsługi klienta. Odpowiadaj krótko i po polsku.' },
          { role: 'user', content: prompt },
        ],
      });

      return new Response(
        JSON.stringify({ answer: cfResp?.response || 'Przepraszam, nie udało się wygenerować odpowiedzi.', model: modelId, source: 'cloudflare-ai' }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    } catch (aiError) {
      console.warn('Cloudflare AI also failed:', aiError);
      // Final fallback - return a friendly message
      return new Response(
        JSON.stringify({ 
          answer: 'Dzień dobry! Jestem POLACZEK, Twój asystent. System AI jest chwilowo niedostępny, ale już nad tym pracujemy.',
          source: 'polaczek-static-fallback'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }
  } catch (error) {
    console.error('POLACZEK Chat API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal error', 
        answer: 'Dzień dobry! Jestem POLACZEK. Wystąpił problem techniczny, ale już go naprawiam.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
};
