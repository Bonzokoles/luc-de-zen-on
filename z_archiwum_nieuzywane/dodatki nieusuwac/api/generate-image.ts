import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';
import { ALLOWED_IMAGE_MODELS, enhancePromptIfRequested, selectModel, buildAIInputs } from '../../utils/imageGeneration';

export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: 'Image Generator API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST with { prompt, model?, style?, width?, height?, steps?, enhancePrompt?, enhanceOptions? }',
    supportedModels: ALLOWED_IMAGE_MODELS,
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

    const { finalPrompt, enhancementData } = enhancePromptIfRequested({
      prompt: rawPrompt,
      style,
      enhancePrompt,
      enhanceOptions
    });
    const prompt = finalPrompt;

    const selectedModel = selectModel(model);

    const ai = runtime.env.AI;

    const inputs = buildAIInputs({ prompt, width, height, steps }, prompt);

    // Wywołanie modelu do generowania obrazów w Cloudflare AI
    const response = await ai.run(selectedModel, inputs);

    // Odpowiedź z obrazem jest bezpośrednio strumieniem danych binarnych
    return new Response(response, {
      headers: {
        'Content-Type': 'image/png',
        'Access-Control-Allow-Origin': '*',
        ...(enhancementData ? { 'X-Prompt-Enhanced': '1' } : {})
      }
    });
  } catch (error) {
    console.error('Image generation API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return createErrorResponse('Failed to generate image.', 500, { details: errorMessage });
  }
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);
