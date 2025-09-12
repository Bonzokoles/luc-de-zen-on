// Shared utilities for image generation (Cloudflare Workers AI)
// Centralizes allowed models list, prompt enhancement, and input shaping.

export const ALLOWED_IMAGE_MODELS = [
    '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    '@cf/lykon/dreamshaper-8-lcm',
    '@cf/black-forest-labs/flux-1-schnell',
    '@cf/runwayml/stable-diffusion-v1-5',
    '@cf/bytedance/stable-diffusion-xl-lightning',
    '@cf/stabilityai/stable-diffusion-v1-5-img2img',
    '@cf/stabilityai/stable-diffusion-v1-5-inpainting',
    '@cf/leonardo/phoenix-1.0',
    '@cf/leonardo/lucid-origin'
] as const;

export type AllowedImageModel = typeof ALLOWED_IMAGE_MODELS[number];

export interface EnhanceOptions {
    colorPalette?: 'cyberpunk' | 'vintage' | 'monochrome' | 'vibrant' | 'pastel';
    artistStyle?: string;
    mood?: string;
    quality?: 'standard' | 'high' | 'ultra';
    enhanceCreativity?: boolean; // front-end hint
}

export interface ImageGenRequest {
    prompt: string;
    model?: string;
    style?: string;
    width?: number;
    height?: number;
    steps?: number;
    enhancePrompt?: boolean;
    enhanceOptions?: EnhanceOptions;
}

export interface EnhancedPromptResult {
    finalPrompt: string;
    enhancementData: null | {
        original: string;
        enhanced: string;
        options: EnhanceOptions;
        applied: string[];
    };
}

const COLOR_MAPPINGS: Record<string, string> = {
    cyberpunk: 'neon colors, electric blue, hot pink',
    vintage: 'sepia tone, muted colors, warm browns',
    monochrome: 'black and white, high contrast',
    vibrant: 'saturated colors, bold colors, vivid',
    pastel: 'soft pastels, light colors, powder blue'
};

export function enhancePromptIfRequested(req: ImageGenRequest): EnhancedPromptResult {
    const { prompt: rawPrompt, enhancePrompt, style, enhanceOptions = {} } = req;
    let finalPrompt = rawPrompt.trim();
    let enhancementData = null;

    if (!enhancePrompt) {
        // Legacy basic style merge
        if (style) finalPrompt = `${finalPrompt}, in a ${style} style`;
        return { finalPrompt, enhancementData };
    }

    try {
        if (style) {
            finalPrompt = `style of ${style}, ${finalPrompt}, highly detailed, masterpiece, best quality, professional`;
        } else {
            finalPrompt = `${finalPrompt}, highly detailed, professional quality, sharp focus`;
        }
        if (enhanceOptions.colorPalette) {
            const mapped = COLOR_MAPPINGS[enhanceOptions.colorPalette];
            if (mapped) finalPrompt = `${finalPrompt}, ${mapped}`;
        }
        if (enhanceOptions.artistStyle) {
            finalPrompt = `${finalPrompt}, in the style of ${enhanceOptions.artistStyle}`;
        }
        if (enhanceOptions.mood) {
            finalPrompt = `${finalPrompt}, ${enhanceOptions.mood} mood`;
        }
        if (enhanceOptions.quality === 'ultra') {
            finalPrompt = `${finalPrompt}, ultra high definition, 8k quality`;
        } else if (enhanceOptions.quality === 'high') {
            finalPrompt = `${finalPrompt}, high resolution`;
        }
        enhancementData = {
            original: rawPrompt,
            enhanced: finalPrompt,
            options: enhanceOptions,
            applied: [
                'quality enhancement',
                style ? 'artistic style' : 'general enhancement',
                enhanceOptions.colorPalette ? 'color palette' : '',
                enhanceOptions.artistStyle ? 'artist style' : '',
                enhanceOptions.mood ? 'mood' : '',
                enhanceOptions.quality ? 'quality tier' : ''
            ].filter(Boolean)
        };
    } catch (err) {
        // Fallback simple style append
        finalPrompt = style ? `${rawPrompt}, in a ${style} style, highly detailed` : `${rawPrompt}, highly detailed`;
    }
    return { finalPrompt, enhancementData };
}

export function selectModel(preferred?: string): AllowedImageModel {
    if (preferred && ALLOWED_IMAGE_MODELS.includes(preferred as AllowedImageModel)) {
        return preferred as AllowedImageModel;
    }
    return '@cf/stabilityai/stable-diffusion-xl-base-1.0';
}

export function buildAIInputs(req: ImageGenRequest, finalPrompt: string): Record<string, any> {
    const inputs: Record<string, any> = { prompt: finalPrompt };
    if (req.width) inputs.width = req.width;
    if (req.height) inputs.height = req.height;
    if (req.steps) inputs.num_steps = parseInt(String(req.steps), 10);
    return inputs;
}
