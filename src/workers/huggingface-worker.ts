/**
 * HuggingFace Worker - Cloudflare Worker for HuggingFace Inference API integration
 * Uses Cloudflare AI Gateway for enhanced monitoring and caching
 */

export interface Env {
  HUGGINGFACE_API_KEY: string;
  AI_GATEWAY_ACCOUNT_ID: string;
  AI_GATEWAY_ID: string;
}

interface HuggingFaceRequest {
  model?: string;
  inputs: string;
  parameters?: {
    max_new_tokens?: number;
    temperature?: number;
    top_p?: number;
    do_sample?: boolean;
  };
}

interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
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
      const requestData: HuggingFaceRequest = await request.json();
      
      // Default configuration
      const model = requestData.model || 'microsoft/DialoGPT-medium';
      const config = {
        inputs: requestData.inputs,
        parameters: {
          max_new_tokens: requestData.parameters?.max_new_tokens || 150,
          temperature: requestData.parameters?.temperature || 0.7,
          top_p: requestData.parameters?.top_p || 0.9,
          do_sample: requestData.parameters?.do_sample ?? true,
        },
      };

      // Build AI Gateway URL
      const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/huggingface/${model}`;

      // Make request to HuggingFace via Cloudflare AI Gateway
      const response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        console.error('HuggingFace API error:', response.status, await response.text());
        return new Response(
          JSON.stringify({ 
            error: 'HuggingFace API error', 
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

      const data: HuggingFaceResponse[] | HuggingFaceResponse = await response.json();
      
      // Handle both array and single object responses
      let responseText = '';
      if (Array.isArray(data)) {
        responseText = data[0]?.generated_text || '';
      } else {
        responseText = data.generated_text || '';
      }

      return new Response(
        JSON.stringify({
          success: true,
          response: responseText,
          model: model,
          provider: 'huggingface'
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
