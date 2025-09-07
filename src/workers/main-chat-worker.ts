/**
 * Main Chat Worker - Primary chat interface for MyBonzo
 * Uses Cloudflare AI for conversational responses
 */

export interface Env {
  AI: any;
}

interface ChatRequest {
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
        const requestData: ChatRequest = await request.json();

        // Main chat system prompt
        const chatMessages = [
          {
            role: 'system' as const,
            content: 'Jesteś głównym asystentem MyBonzo. Pomagasz użytkownikom w ich codziennych zadaniach. Odpowiadaj w języku polskim w sposób przyjazny i profesjonalny.'
          },
          ...requestData.messages
        ];

        // Use Cloudflare AI
        const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: chatMessages,
          max_tokens: requestData.max_tokens || 512,
          temperature: requestData.temperature || 0.7,
        });

        return new Response(JSON.stringify({
          success: true,
          response: response.response || 'Nie udało się wygenerować odpowiedzi.',
          model: 'llama-3.1-8b-instruct',
          provider: 'cloudflare-ai',
          chat_type: 'main'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });

      } catch (error: any) {
        console.error('Main chat error:', error);
        return new Response(JSON.stringify({ 
          error: 'Main chat error', 
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
