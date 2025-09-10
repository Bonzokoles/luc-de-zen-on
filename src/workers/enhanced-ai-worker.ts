/**
 * Enhanced AI Worker - Cloudflare Worker with advanced AI features
 * Uses Cloudflare AI for enhanced responses
 */

export interface Env {
  AI: Ai;
}

interface EnhancedRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  enhance_mode?: boolean;
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
        const requestData: EnhancedRequest = await request.json();

        // Enhanced system prompt
        const enhancedMessages = [
          {
            role: 'system' as const,
            content: 'Jesteś zaawansowanym asystentem AI MyBonzo. Udzielaj szczegółowych, pomocnych odpowiedzi w języku polskim. Używaj profesjonalnego ale przyjaznego tonu.'
          },
          ...requestData.messages
        ];

        // Use Cloudflare AI with enhanced configuration
        const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: enhancedMessages,
          max_tokens: requestData.max_tokens || 1024,
          temperature: requestData.temperature || 0.8,
        });

        return new Response(JSON.stringify({
          success: true,
          response: response.response || 'Nie udało się wygenerować odpowiedzi.',
          model: 'llama-3.1-8b-instruct-enhanced',
          provider: 'cloudflare-ai',
          enhanced: true
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });

      } catch (error) {
        console.error('Enhanced AI error:', error);
        return new Response(JSON.stringify({ 
          error: 'Enhanced AI error', 
          details: error.message 
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
