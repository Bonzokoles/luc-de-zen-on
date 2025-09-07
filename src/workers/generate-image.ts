interface Env {
  AI: any;
}

interface PromptRequest {
  prompt: string;
  model?: string;
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
      const requestData = await request.json();
      const { prompt, model, width = 1024, height = 1024, steps = 4 } = requestData as PromptRequest;

      if (!prompt || prompt.trim().length === 0) {
        return new Response(JSON.stringify({ error: "Prompt is required" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Lista dozwolonych modeli
      const allowedModels = [
        '@cf/stabilityai/stable-diffusion-xl-base-1.0',
        '@cf/lykon/dreamshaper-8-lcm',
        '@cf/black-forest-labs/flux-1-schnell',
        '@cf/runwayml/stable-diffusion-v1-5',
        '@cf/bytedance/stable-diffusion-xl-lightning'
      ];

      const selectedModel = model && allowedModels.includes(model)
        ? model
        : '@cf/black-forest-labs/flux-1-schnell';

      // Wywołanie Workers AI z wybranym modelem
      const result = await env.AI.run(selectedModel, { 
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
        model: selectedModel,
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
