// Hugging Face API endpoint for image generation
// Based on Shivani-G12/Text-to-Image-Generation pattern
import type { APIRoute } from "astro";
import {
  createOPTIONSHandler,
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

export const OPTIONS = createOPTIONSHandler(["POST"]);

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const {
      prompt,
      model = "stabilityai/stable-diffusion-2-1",
      ...options
    } = (await request.json()) as any;

    if (!prompt) {
      return createErrorResponse("Prompt is required", 400);
    }

    // Hugging Face API configuration
    const HF_API_TOKEN = import.meta.env.HF_TOKEN || process.env.HF_TOKEN;
    const HF_API_URL = `https://api-inference.huggingface.co/models/${model}`;

    if (!HF_API_TOKEN) {
      return createErrorResponse("Hugging Face API token not configured", 500);
    }

    // Prepare request to Hugging Face
    const hfResponse = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt:
            options.negative_prompt || "blurry, bad quality, distorted",
          num_inference_steps: options.steps || 25,
          guidance_scale: options.guidance_scale || 7.5,
          width: options.width || 512,
          height: options.height || 512,
          ...options,
        },
      }),
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("HF API Error:", errorText);

      if (hfResponse.status === 503) {
        return createErrorResponse(
          "Model is loading, please try again in a few seconds",
          503
        );
      }

      return createErrorResponse(
        `Hugging Face API error: ${errorText}`,
        hfResponse.status
      );
    }

    // Get image blob from Hugging Face
    const imageBlob = await hfResponse.blob();

    // Convert to base64 for easy frontend handling
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    return createSuccessResponse({
      success: true,
      imageUrl: dataUrl,
      model: model,
      prompt: prompt,
      timestamp: new Date().toISOString(),
      metadata: {
        source: "huggingface",
        model: model,
        parameters: {
          steps: options.steps || 25,
          guidance_scale: options.guidance_scale || 7.5,
          width: options.width || 512,
          height: options.height || 512,
        },
      },
    });
  } catch (error) {
    console.error("Generate HF error:", error);
    return createErrorResponse(
      "Internal server error during image generation",
      500
    );
  }
};
