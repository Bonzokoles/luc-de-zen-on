// BIELIK Cloudflare Worker - Polish AI Model Integration
// Deployed at: https://bielik-worker.bonzokoles.workers.dev

export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Health check endpoint
    if (request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'healthy',
        model: 'Bielik-7B-Instruct-v0.1',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
          chat: 'POST /',
          health: 'GET /',
        },
        infrastructure: {
          provider: 'Hugging Face',
          region: 'EU-Central',
        }
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      });
    }

    if (request.method === 'POST') {
      try {
        const { prompt, model = 'speakleash/bielik-7b-instruct-v0.1', temperature = 0.7, max_tokens = 512 } = await request.json();

        if (!prompt) {
          return new Response(JSON.stringify({
            error: 'Prompt is required'
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders 
            },
          });
        }

        const hfApiKey = env.HUGGINGFACE_API_KEY;
        if (!hfApiKey) {
            return new Response(JSON.stringify({
                error: 'HUGGINGFACE_API_KEY is not set in the environment.'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                },
            });
        }

        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${hfApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: max_tokens, temperature: temperature } })
          }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(JSON.stringify({
                error: 'Failed to query Hugging Face API',
                details: errorText
            }), {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                },
            });
        }

        const result = await response.json();

        return new Response(JSON.stringify({
          success: true,
          response: result[0].generated_text,
          model: model,
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });

      } catch (error) {
        return new Response(JSON.stringify({
          error: 'Internal server error',
          message: error.message
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }
    }

    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });
  },
};
