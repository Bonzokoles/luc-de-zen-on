interface PromptRequest {
  prompt: string;
  width?: number;
  height?: number;
  steps?: number;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST method allowed" }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      const { prompt, width = 1024, height = 1024, steps = 4 } = await request.json<PromptRequest>();

      if (!prompt || prompt.trim().length === 0) {
        return new Response(JSON.stringify({ error: "Prompt is required" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Wywołanie Workers AI modelu FLUX-1-schnell
      const result = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', { 
        prompt: prompt.trim(),
        width,
        height,
        num_inference_steps: steps
      });

      // Konwert obrazu do Base64 dla łatwego przekazania
      const imageArray = Array.from(new Uint8Array(result as ArrayBuffer));
      const base64Image = btoa(String.fromCharCode(...imageArray));

      // Zwróć wygenerowany obraz
      return new Response(JSON.stringify({ 
        success: true,
        imageUrl: `data:image/png;base64,${base64Image}`,
        prompt,
        width,
        height,
        steps,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Image generation error:', error);
      
      return new Response(JSON.stringify({ 
        error: "Image generation failed",
        details: error instanceof Error ? error.message : "Unknown error"
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
}