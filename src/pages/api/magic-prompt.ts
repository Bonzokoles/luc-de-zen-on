import type { APIRoute } from "astro";
import {
  createOPTIONSHandler,
  createErrorResponse,
  createSuccessResponse,
} from "../../utils/corsUtils";

export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: "Magic Prompt Generator API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: "Send POST with { prompt, style? }",
    supportedStyles: {
      default: "Standard magic prompt enhancement",
      artistic: "Enhanced with artistic keywords",
      photographic: "Enhanced for photorealistic images",
      fantasy: "Enhanced for fantasy/sci-fi themes",
      anime: "Enhanced for anime style",
    },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any)?.runtime;
  if (!runtime?.env?.HUGGINGFACE_API_KEY) {
    return createErrorResponse("Magic prompt service is not configured.", 500);
  }

  try {
    const body = (await request.json()) as any;
    const { prompt, style = "default" } = body ?? {};

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return createErrorResponse("Valid prompt is required.", 400);
    }

    // Use HuggingFace Inference API for MagicPrompt-Stable-Diffusion
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Gustavosta/MagicPrompt-Stable-Diffusion",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${runtime.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt.trim(),
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
            repetition_penalty: 1.2,
            return_full_text: false,
          },
          options: {
            wait_for_model: true,
            use_cache: false,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`);
    }

    const data = (await response.json()) as any;
    let enhancedPrompt = data[0]?.generated_text || prompt;

    // Clean up the generated text
    enhancedPrompt = enhancedPrompt.trim();

    // Remove common artifacts and repetitions
    enhancedPrompt = enhancedPrompt.replace(/\s+/g, " ");
    enhancedPrompt = enhancedPrompt.replace(/([.!?])\1+/g, "$1");

    // Style-specific enhancements
    const styleEnhancements: Record<string, string> = {
      artistic:
        ", digital art, masterpiece, highly detailed, beautiful composition",
      photographic:
        ", professional photography, high quality, 4K, sharp focus, realistic",
      fantasy: ", fantasy art, magical, ethereal, mystical, epic scene",
      anime: ", anime style, manga style, vibrant colors, cel shading",
    };

    if (style !== "default" && styleEnhancements[style]) {
      enhancedPrompt += styleEnhancements[style];
    }

    // Add quality tags
    enhancedPrompt += ", best quality, ultra detailed";

    return createSuccessResponse({
      originalPrompt: prompt,
      enhancedPrompt: enhancedPrompt,
      style: style,
      provider: "MagicPrompt-SD (HuggingFace)",
    });
  } catch (error) {
    console.error("Magic Prompt API error:", error);
    const errorMessage = (error as any).message || "Prompt enhancement failed";
    return createErrorResponse(errorMessage, 500);
  }
};

export const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);
