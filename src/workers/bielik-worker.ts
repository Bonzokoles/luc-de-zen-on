/**
 * Bielik Worker - Polish AI assistant using Cloudflare AI
 * Specialized for Polish language interactions
 */

export interface Env {
  AI: any;
}

interface BielikRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (request.method === 'POST') {
      try {
        const requestData: BielikRequest = await request.json();

        // Bielik-specific system prompt in Polish
        const bielikMessages = [
          {
            role: 'system' as const,
            content: 'Jesteś Bielik - zaawansowany polski asystent AI. Udzielasz odpowiedzi wyłącznie w języku polskim. Jesteś ekspertem w polskiej kulturze, języku i kontekście społecznym. Odpowiadaj w sposób naturalny, pomocny i kulturalny.'
          },
          ...requestData.messages
        ];

        // Use Cloudflare AI with the correct Bielik model from Hugging Face
        const response = await env.AI.run('@hf/speakleash/bielik-7b-instruct-v0.1', {
          messages: bielikMessages,
          max_tokens: requestData.max_tokens || 512,
          temperature: requestData.temperature || 0.7,
        });

        return new Response(JSON.stringify({
          success: true,
          response: response.response || 'Nie udało się wygenerować odpowiedzi.',
          model: 'speakleash/bielik-7b-instruct-v0.1',
          provider: 'huggingface-via-cloudflare',
          language: 'pl',
          assistant: 'bielik'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });

      } catch (error: any) {
        console.error('Bielik error:', error);
        return new Response(JSON.stringify({ 
          error: 'Bielik error', 
          details: error?.message || 'Unknown error'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    return new Response(JSON.stringify({ 
      error: 'Method not allowed' 
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
