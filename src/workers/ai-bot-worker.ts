export default {
  async fetch(request: Request, env: any): Promise<Response> {
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Only POST is allowed', { 
        status: 405,
        headers: corsHeaders 
      });
    }

    try {
      const requestData = await request.json() as { prompt: string };
      const { prompt } = requestData;

      if (!prompt) {
        return new Response(JSON.stringify({ error: 'Prompt is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Use Cloudflare Workers AI instead of OpenAI
      const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          {
            role: 'system',
            content: 'Jesteś pomocnym asystentem AI dla MyBonzo - firmy specjalizującej się w projektowaniu graficznym i rozwiązaniach AI. Odpowiadaj po polsku.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return new Response(JSON.stringify({ 
        answer: response.response || 'Przepraszam, nie mogę teraz odpowiedzieć.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('AI Worker Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Wystąpił błąd podczas przetwarzania zapytania',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
