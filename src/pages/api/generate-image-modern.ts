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
  // Check Cloudflare environment
  const runtime = (locals as any)?.runtime;
  if (!runtime?.env?.AI) {
    console.error('Cloudflare environment or AI binding not available');
    return createErrorResponse('🚫 Generator obrazów wymaga konfiguracji Cloudflare AI. Dodaj CLOUDFLARE_ACCOUNT_ID i CLOUDFLARE_API_TOKEN do pliku .env', 500);
  }

  try {
    const body: ImageGenerationRequest = await request.json();
    const { 
      prompt: rawPrompt, 
      model = 'flux-schnell', 
      style, 
      width = 1024, 
      height = 1024, 
      steps = 4 
    } = body;

    if (!rawPrompt || typeof rawPrompt !== 'string' || rawPrompt.trim().length < 3) {
      return createErrorResponse('A valid prompt is required (min 3 characters).', 400);
    }

    // Translation API call for Polish prompts
    let translatedPrompt = rawPrompt;
    try {
      const translateResponse = await fetch(`${request.url.split('/api')[0]}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawPrompt })
      });
      
      if (translateResponse.ok) {
        const translateData = await translateResponse.json();
        translatedPrompt = translateData.translatedText || rawPrompt;
      }
    } catch (translateError) {
      console.warn('Translation failed, using original prompt:', translateError);
    }

    // Apply style if provided
    const finalPrompt = style ? `${translatedPrompt}, in a ${style} style` : translatedPrompt;

    // Get the actual model name
    const modelName = SUPPORTED_MODELS[model as keyof typeof SUPPORTED_MODELS] || SUPPORTED_MODELS['flux-schnell'];

    console.log(`🎨 Generating image with ${modelName}: "${finalPrompt}"`);

    // Generate image with Cloudflare AI
    const aiResponse = await runtime.env.AI.run(modelName, {
      prompt: finalPrompt,
      width,
      height,
      num_steps: steps
    });

    if (!aiResponse || !aiResponse.image) {
      throw new Error('No image data received from AI model');
    }

    // Store image in R2 if available
    let imageUrl = `data:image/png;base64,${aiResponse.image}`;
    let imageId = null;

    if (runtime.env.IMAGES) {
      try {
        imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const imageBuffer = Uint8Array.from(atob(aiResponse.image), c => c.charCodeAt(0));
        
        await runtime.env.IMAGES.put(`${imageId}.png`, imageBuffer, {
          httpMetadata: {
            contentType: 'image/png',
          },
          customMetadata: {
            prompt: rawPrompt,
            translatedPrompt,
            model: modelName,
            width: width.toString(),
            height: height.toString(),
            steps: steps.toString(),
            timestamp: new Date().toISOString()
          }
        });

        imageUrl = `/api/images/${imageId}`;
        console.log(`✅ Image stored in R2: ${imageId}`);
      } catch (r2Error) {
        console.warn('R2 storage failed, returning base64:', r2Error);
      }
    }

    const response: ImageGenerationResponse = {
      success: true,
      imageUrl,
      imageId: imageId || undefined,
      prompt: rawPrompt,
      translatedPrompt: translatedPrompt !== rawPrompt ? translatedPrompt : undefined,
      model: modelName,
      metadata: {
        width,
        height,
        steps,
        timestamp: new Date().toISOString()
      }
    };

    return createSuccessResponse(response);

  } catch (error) {
    console.error('Image generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Image generation failed';
    return createErrorResponse(`Failed to generate image: ${errorMessage}`, 500);
  }
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);
