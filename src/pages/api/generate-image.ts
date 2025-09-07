import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: 'Image Generator API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST with { prompt, model?, style?, width?, height?, steps?, enhancePrompt?, enhanceOptions? }',
    supportedModels: [
      '@cf/stabilityai/stable-diffusion-xl-base-1.0',
      '@cf/lykon/dreamshaper-8-lcm',
      '@cf/black-forest-labs/flux-1-schnell',
      '@cf/runwayml/stable-diffusion-v1-5',
      '@cf/bytedance/stable-diffusion-xl-lightning'
    ],
    enhancementFeatures: {
      enhancePrompt: 'Boolean - Enable intelligent prompt enhancement with wildcards',
      enhanceOptions: {
        colorPalette: ['cyberpunk', 'vintage', 'monochrome', 'vibrant', 'pastel'],
        artistStyle: 'String - Apply specific artist style',
        mood: 'String - Apply mood enhancement',
        quality: ['standard', 'high', 'ultra']
      }
    }
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  // Sprawdzenie, czy środowisko Cloudflare jest dostępne
  const runtime = (locals as any)?.runtime;
  if (!runtime?.env?.AI) {
    console.error('Cloudflare environment or AI binding not available');
    return createErrorResponse('AI service is not configured on the server.', 500);
  }

  try {
    const body = await request.json();
    const {
      prompt: rawPrompt,
      model,
      style,
      width,
      height,
      steps,
      enhancePrompt = false,
      enhanceOptions = {}
    } = body ?? {};

    if (!rawPrompt || typeof rawPrompt !== 'string' || rawPrompt.trim().length < 3) {
      return createErrorResponse('A valid prompt is required.', 400);
    }

    let finalPrompt = rawPrompt.trim();
    let enhancementData = null;

    // Enhanced prompt processing with wildcards
    if (enhancePrompt) {
      try {
        // Basic intelligent enhancement for image generation
        if (style) {
          // Apply artistic style enhancement
          finalPrompt = `style of ${style}, ${finalPrompt}, highly detailed, masterpiece, best quality, professional`;
        } else {
          // Apply general quality enhancement
          finalPrompt = `${finalPrompt}, highly detailed, professional quality, sharp focus`;
        }

        // Add color palette if specified in enhanceOptions
        if (enhanceOptions.colorPalette) {
          const colorMappings = {
            cyberpunk: 'neon colors, electric blue, hot pink',
            vintage: 'sepia tone, muted colors, warm browns',
            monochrome: 'black and white, high contrast',
            vibrant: 'saturated colors, bold colors, vivid',
            pastel: 'soft pastels, light colors, powder blue'
          };
          const colors = colorMappings[enhanceOptions.colorPalette as keyof typeof colorMappings];
          if (colors) {
            finalPrompt = `${finalPrompt}, ${colors}`;
          }
        }

        enhancementData = {
          original: rawPrompt,
          enhanced: finalPrompt,
          options: enhanceOptions,
          applied: ['quality enhancement', style ? 'artistic style' : 'general enhancement'].filter(Boolean)
        };

      } catch (enhanceError) {
        console.warn('Prompt enhancement failed, using basic enhancement:', enhanceError);
        // Fallback to basic style enhancement
        finalPrompt = style ? `${rawPrompt}, in a ${style} style, highly detailed` : `${rawPrompt}, highly detailed`;
      }
    } else {
      // Łączenie promptu ze stylem, jeśli styl jest podany (legacy method)
      finalPrompt = style ? `${rawPrompt}, in a ${style} style` : rawPrompt;
    }

    const prompt = finalPrompt;

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
      : '@cf/stabilityai/stable-diffusion-xl-base-1.0';

    const ai = runtime.env.AI;

    const inputs: Record<string, any> = {
      prompt,
    };

    if (width) inputs.width = parseInt(String(width), 10);
    if (height) inputs.height = parseInt(String(height), 10);
    if (steps) inputs.num_steps = parseInt(String(steps), 10);

    // Wywołanie modelu do generowania obrazów w Cloudflare AI
    const response = await ai.run(selectedModel, inputs);

    // Odpowiedź z obrazem jest bezpośrednio strumieniem danych binarnych
    return new Response(response, {
      headers: {
        'Content-Type': 'image/png',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image generation API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return createErrorResponse('Failed to generate image.', 500, { details: errorMessage });
  }
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);
