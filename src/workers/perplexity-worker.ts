/**
 * Perplexity Worker - Cloudflare Worker for Perplexity API integration
 * Uses Cloudflare AI Gateway for enhanced monitoring and caching
 */

export interface Env {
  PERPLEXITY_API_KEY: string;
  AI_GATEWAY_ACCOUNT_ID: string;
  AI_GATEWAY_ID: string;
}

interface PerplexityRequest {
  model?: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

interface PerplexityResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
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

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const requestData: PerplexityRequest = await request.json();
      
      // Default configuration
      const config = {
        model: requestData.model || 'llama-3.1-sonar-small-128k-online',
        messages: requestData.messages,
        max_tokens: requestData.max_tokens || 1000,
        temperature: requestData.temperature || 0.7,
        stream: false,
      };

      // Build AI Gateway URL
      const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/perplexity-ai/chat/completions`;

      // Make request to Perplexity via Cloudflare AI Gateway
      const response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        console.error('Perplexity API error:', response.status, await response.text());
        return new Response(
          JSON.stringify({ 
            error: 'Perplexity API error', 
            status: response.status 
          }), 
          { 
            status: response.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      const data: PerplexityResponse = await response.json();
      
      return new Response(
        JSON.stringify({
          success: true,
          response: data.choices[0]?.message?.content || '',
          model: data.model,
          usage: data.usage,
          provider: 'perplexity'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
