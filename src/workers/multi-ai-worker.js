// Multi-Model AI Worker for Cloudflare
export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Available models
    const models = {
      'qwen': '@cf/qwen/qwen1.5-0.5b-chat',
      'deepseek': '@hf/thebloke/deepseek-coder-6.7b-instruct-awq',
      'llama2': '@cf/meta-llama/llama-2-7b-chat-hf-lora',
      'default': '@cf/meta/llama-3.1-8b-instruct'
    };

    // Handle GET request - health check and models list
    if (request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'active',
        service: 'Multi-Model AI Assistant',
        available_models: models,
        default_model: models.qwen,
        description: 'Polski asystent AI z wieloma modelami',
        endpoints: {
          'GET /': 'Lista dostępnych modeli',
          'POST /': 'Chat z domyślnym modelem (Qwen)',
          'POST /qwen': 'Chat z modelem Qwen',
          'POST /deepseek': 'Chat z modelem DeepSeek Coder',
          'POST /llama2': 'Chat z modelem LLaMA 2'
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Handle POST request - chat
    if (request.method === 'POST') {
      try {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // Determine which model to use based on path
        let selectedModel;
        let modelName;
        
        if (path.includes('/qwen')) {
          selectedModel = models.qwen;
          modelName = 'Qwen 1.5';
        } else if (path.includes('/deepseek')) {
          selectedModel = models.deepseek;
          modelName = 'DeepSeek Coder';
        } else if (path.includes('/llama2')) {
          selectedModel = models.llama2;
          modelName = 'LLaMA 2';
        } else {
          selectedModel = models.qwen; // Default to Qwen
          modelName = 'Qwen 1.5 (default)';
        }

        const body = await request.json();
        const { message, prompt, sessionId, context } = body;
        
        // Use message or prompt
        const userInput = message || prompt;
        
        if (!userInput) {
          return new Response(JSON.stringify({
            error: 'Brak wiadomości do przetworzenia',
            success: false
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
        }

        // Check if AI binding is available
        if (!env.AI) {
          return new Response(JSON.stringify({
            error: 'Cloudflare AI nie jest dostępny',
            success: false
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
        }

        // Create system prompt based on model
        let systemPrompt;
        if (selectedModel.includes('deepseek')) {
          systemPrompt = "Jesteś pomocnym asystentem programistycznym. Odpowiadaj w języku polskim, dostarczaj praktyczne rozwiązania kodowe i wyjaśnienia techniczne.";
        } else if (selectedModel.includes('llama')) {
          systemPrompt = "Jesteś przyjaznym i pomocnym asystentem AI. Odpowiadaj w języku polskim, bądź konkretny i pomocny.";
        } else {
          systemPrompt = "Jesteś inteligentnym asystentem AI. Odpowiadaj w języku polskim, zwięźle i precyzyjnie.";
        }

        // Call Cloudflare AI
        const aiResponse = await env.AI.run(selectedModel, {
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userInput
            }
          ],
          max_tokens: 512,
          temperature: 0.7
        });

        return new Response(JSON.stringify({
          success: true,
          response: aiResponse.response || "Nie udało się wygenerować odpowiedzi.",
          model: selectedModel,
          model_name: modelName,
          sessionId: sessionId || 'default',
          timestamp: new Date().toISOString(),
          context: context || {}
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });

      } catch (error) {
        console.error('Multi-Model AI Worker Error:', error);
        
        return new Response(JSON.stringify({
          error: 'Wystąpił błąd podczas komunikacji z modelem AI',
          success: false,
          details: error.message
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }
    }

    // Method not allowed
    return new Response(JSON.stringify({
      error: 'Metoda nie jest obsługiwana',
      success: false
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};
