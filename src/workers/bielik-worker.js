// Cloudflare Worker dla integracji Bielik z HuggingFace
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

    // Handle GET request - health check
    if (request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'active',
        model: 'speakleash/bielik-7b-instruct-v0.1',
        description: 'Bielik AI Assistant - Polski model językowy',
        endpoint: 'https://api-inference.huggingface.co/models/speakleash/bielik-7b-instruct-v0.1',
        capabilities: [
          'Polski język naturalny',
          'Rozumienie kontekstu kulturowego',
          'Specjalistyczna wiedza techniczna',
          'Kreatywne myślenie',
          'Analiza i synteza informacji'
        ]
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

        // Call HuggingFace API - używamy poprawnego modelu Bielik
        const hfResponse = await fetch('https://api-inference.huggingface.co/models/speakleash/bielik-11b-v2.2', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.HUGGINGFACE_API_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Cloudflare-Worker-Bielik/1.0'
          },
          body: JSON.stringify({
            inputs: `Użytkownik: ${userInput}\nBielik:`,
            parameters: {
              max_new_tokens: 256,
              temperature: 0.7,
              top_p: 0.9,
              do_sample: true,
              return_full_text: false,
              stop: ["Użytkownik:", "\n\n"]
            },
            options: {
              wait_for_model: true,
              use_cache: false
            }
          })
        });

        if (!hfResponse.ok) {
          throw new Error(`HuggingFace API error: ${hfResponse.status} ${hfResponse.statusText}`);
        }

        const hfData = await hfResponse.json();
        console.log('HuggingFace response:', hfData);

        // Extract generated text
        let generatedText;
        if (Array.isArray(hfData) && hfData[0]?.generated_text) {
          generatedText = hfData[0].generated_text;
        } else if (hfData.generated_text) {
          generatedText = hfData.generated_text;
        } else {
          generatedText = "Przepraszam, nie udało się wygenerować odpowiedzi.";
        }

        return new Response(JSON.stringify({
          success: true,
          response: generatedText,
          model: 'speakleash/bielik-7b-instruct-v0.1',
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
        console.error('Bielik Worker Error:', error);
        
        return new Response(JSON.stringify({
          error: 'Wystąpił błąd podczas komunikacji z modelem Bielik',
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
