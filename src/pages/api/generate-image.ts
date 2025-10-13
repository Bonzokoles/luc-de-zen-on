import type { APIRoute } from "astro";
import {
  createOPTIONSHandler,
  createErrorResponse,
  createSuccessResponse,
} from "../../utils/corsUtils";
import {
  ALLOWED_IMAGE_MODELS,
  enhancePromptIfRequested,
  selectModel,
  buildAIInputs,
} from "../../utils/imageGeneration";

// Extended models including external providers
const EXTERNAL_MODELS = {
  together_flux: "Together AI - FLUX.1-schnell",
  hf_playground: "HuggingFace - Playground v2.5",
  stability_sdxl: "Stability AI - SDXL",
  openai_sora: "OpenAI - Sora (Video)",
};

const ALL_MODELS = [...ALLOWED_IMAGE_MODELS, ...Object.keys(EXTERNAL_MODELS)];

async function handleExternalModel(
  model: string,
  prompt: string,
  env: any,
  enhancementData: any
) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ...(enhancementData ? { "X-Prompt-Enhanced": "1" } : {}),
  };

  try {
    switch (model) {
      case "together_flux":
        const togetherResponse = await fetch(
          "https://api.together.xyz/v1/images/generations",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.TOGETHER_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "black-forest-labs/FLUX.1-schnell-Free",
              prompt,
              width: 1024,
              height: 1024,
              steps: 4,
              n: 1,
              response_format: "base64",
            }),
          }
        );

        if (!togetherResponse.ok) {
          throw new Error(`Together API error: ${togetherResponse.status}`);
        }

        const togetherData = (await togetherResponse.json()) as {
          data?: { b64_json?: string }[];
        };
        const imageBase64 = togetherData.data?.[0]?.b64_json;

        if (!imageBase64) {
          throw new Error("No image data received from Together API");
        }

        return new Response(
          JSON.stringify({
            success: true,
            image: `data:image/png;base64,${imageBase64}`,
            provider: "Together AI",
          }),
          { headers }
        );

      case "hf_playground":
        const hfResponse = await fetch(
          "https://api-inference.huggingface.co/models/playgroundai/playground-v2.5-1024px-aesthetic",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.HUGGINGFACE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: prompt,
              options: { wait_for_model: true },
            }),
          }
        );

        if (!hfResponse.ok) {
          throw new Error(`HuggingFace API error: ${hfResponse.status}`);
        }

        const hfImageBuffer = await hfResponse.arrayBuffer();
        const hfBase64 = Buffer.from(hfImageBuffer).toString("base64");

        return new Response(
          JSON.stringify({
            success: true,
            image: `data:image/png;base64,${hfBase64}`,
            provider: "HuggingFace",
          }),
          { headers }
        );

      case "stability_sdxl":
        const stabilityResponse = await fetch(
          "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.STABILITY_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text_prompts: [{ text: prompt, weight: 1 }],
              cfg_scale: 7,
              width: 1024,
              height: 1024,
              steps: 30,
              samples: 1,
            }),
          }
        );

        if (!stabilityResponse.ok) {
          throw new Error(`Stability AI error: ${stabilityResponse.status}`);
        }

        const stabilityData = (await stabilityResponse.json()) as {
          artifacts?: { base64?: string }[];
        };
        const stabilityImage = stabilityData.artifacts?.[0]?.base64;

        if (!stabilityImage) {
          throw new Error("No image data received from Stability AI");
        }

        return new Response(
          JSON.stringify({
            success: true,
            image: `data:image/png;base64,${stabilityImage}`,
            provider: "Stability AI",
          }),
          { headers }
        );

      case "openai_sora":
        return new Response(
          JSON.stringify({
            success: false,
            error: "OpenAI Sora integration coming soon - video generation",
            provider: "OpenAI",
          }),
          { headers, status: 501 }
        );

      default:
        throw new Error(`Unknown external model: ${model}`);
    }
  } catch (error) {
    console.error(`External model ${model} error:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider: model,
      }),
      {
        headers: { ...headers, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: "Image Generator API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description:
      "Send POST with { prompt, model?, style?, width?, height?, steps?, enhancePrompt?, enhanceOptions? }",
    supportedModels: ALL_MODELS,
    externalModels: EXTERNAL_MODELS,
    enhancementFeatures: {
      enhancePrompt:
        "Boolean - Enable intelligent prompt enhancement with wildcards",
      enhanceOptions: {
        colorPalette: [
          "cyberpunk",
          "vintage",
          "monochrome",
          "vibrant",
          "pastel",
        ],
        artistStyle: "String - Apply specific artist style",
        mood: "String - Apply mood enhancement",
        quality: ["standard", "high", "ultra"],
      },
    },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  // Defensive coding - sprawdzenie dostępności środowiska
  const env = locals.runtime?.env;
  if (!env) {
    console.error("Runtime environment not available");
    return new Response(
      JSON.stringify({
        success: false,
        error: "Environment not available",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (!env.AI) {
    console.error("Cloudflare AI binding not available");
    return createErrorResponse(
      "AI service is not configured on the server.",
      500
    );
  }

  try {
    const body = (await request.json()) as {
      prompt?: string;
      model?: string;
      style?: string;
      width?: number;
      height?: number;
      steps?: number;
      enhancePrompt?: boolean;
      enhanceOptions?: Record<string, any>;
    };
    const {
      prompt: rawPrompt,
      model,
      style,
      width,
      height,
      steps,
      enhancePrompt = false,
      enhanceOptions = {},
    } = body ?? {};

    if (
      !rawPrompt ||
      typeof rawPrompt !== "string" ||
      rawPrompt.trim().length < 3
    ) {
      return createErrorResponse("A valid prompt is required.", 400);
    }

    const { finalPrompt, enhancementData } = enhancePromptIfRequested({
      prompt: rawPrompt,
      style,
      enhancePrompt,
      enhanceOptions,
    });
    const prompt = finalPrompt;

    // Check if it's an external model
    if (model && Object.keys(EXTERNAL_MODELS).includes(model)) {
      return await handleExternalModel(model, prompt, env, enhancementData);
    }

    const selectedModel = selectModel(model);
    const ai = env.AI;
    const inputs = buildAIInputs({ prompt, width, height, steps }, prompt);

    // Wywołanie modelu do generowania obrazów w Cloudflare AI
    const response = await (ai as any).run(selectedModel, inputs);

    // Odpowiedź z obrazem jest bezpośrednio strumieniem danych binarnych
    return new Response(response, {
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*",
        ...(enhancementData ? { "X-Prompt-Enhanced": "1" } : {}),
      },
    });
  } catch (error) {
    console.error("Image generation API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return createErrorResponse("Failed to generate image.", 500, {
      details: errorMessage,
    });
  }
};

export const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);
