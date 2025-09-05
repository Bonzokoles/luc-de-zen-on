import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';
import type { ImageGenerationRequest, ImageGenerationResponse } from '../../types/cloudflare';

// Modern image models based on Cloudflare documentation
const SUPPORTED_MODELS = {
  'flux-schnell': '@cf/black-forest-labs/flux-1-schnell',
  'flux-dev': '@cf/black-forest-labs/flux-1-dev', 
  'stable-diffusion': '@cf/stabilityai/stable-diffusion-xl-base-1.0',
  'dreamshaper': '@cf/lykon/dreamshaper-8-lcm'
} as const;

export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: 'Modern AI Image Generator API',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    supportedModels: Object.keys(SUPPORTED_MODELS),
    description: 'Send POST with { prompt, model?, style?, width?, height?, steps? }'
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  // Sprawdzenie, czy środowisko Cloudflare jest dostępne
  const runtime = (locals as any)?.runtime;
  if (!runtime?.env?.AI) {
    console.error('Cloudflare environment or AI binding not available');
    return createErrorResponse('🚫 Generator obrazów wymaga konfiguracji Cloudflare AI. Dodaj CLOUDFLARE_ACCOUNT_ID i CLOUDFLARE_API_TOKEN do pliku .env', 500);
  }

  try {
    const body = await request.json();
    const { prompt: rawPrompt, model, style, width, height, steps } = body ?? {};

    if (!rawPrompt || typeof rawPrompt !== 'string' || rawPrompt.trim().length < 3) {
      return createErrorResponse('A valid prompt is required.', 400);
    }

    // Łączenie promptu ze stylem, jeśli styl jest podany
    const prompt = style ? `${rawPrompt}, in a ${style} style` : rawPrompt;

    // Lista dozwolonych modeli
    const allowedModels = [
      '@cf/stabilityai/stable-diffusion-xl-base-1.0',
      '@cf/lykon/dreamshaper-8-lcm',
      '@cf/black-forest-labs/flux-1-schnell',
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
