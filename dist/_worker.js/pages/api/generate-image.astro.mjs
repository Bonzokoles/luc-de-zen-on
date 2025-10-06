globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const ALLOWED_IMAGE_MODELS = [
  "@cf/stabilityai/stable-diffusion-xl-base-1.0",
  "@cf/lykon/dreamshaper-8-lcm",
  "@cf/black-forest-labs/flux-1-schnell",
  "@cf/runwayml/stable-diffusion-v1-5",
  "@cf/bytedance/stable-diffusion-xl-lightning",
  "@cf/stabilityai/stable-diffusion-v1-5-img2img",
  "@cf/stabilityai/stable-diffusion-v1-5-inpainting",
  "@cf/leonardo/phoenix-1.0",
  "@cf/leonardo/lucid-origin"
];
const COLOR_MAPPINGS = {
  cyberpunk: "neon colors, electric blue, hot pink",
  vintage: "sepia tone, muted colors, warm browns",
  monochrome: "black and white, high contrast",
  vibrant: "saturated colors, bold colors, vivid",
  pastel: "soft pastels, light colors, powder blue"
};
function enhancePromptIfRequested(req) {
  const { prompt: rawPrompt, enhancePrompt, style, enhanceOptions = {} } = req;
  let finalPrompt = rawPrompt.trim();
  let enhancementData = null;
  if (!enhancePrompt) {
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
    if (enhanceOptions.quality === "ultra") {
      finalPrompt = `${finalPrompt}, ultra high definition, 8k quality`;
    } else if (enhanceOptions.quality === "high") {
      finalPrompt = `${finalPrompt}, high resolution`;
    }
    enhancementData = {
      original: rawPrompt,
      enhanced: finalPrompt,
      options: enhanceOptions,
      applied: [
        "quality enhancement",
        style ? "artistic style" : "general enhancement",
        enhanceOptions.colorPalette ? "color palette" : "",
        enhanceOptions.artistStyle ? "artist style" : "",
        enhanceOptions.mood ? "mood" : "",
        enhanceOptions.quality ? "quality tier" : ""
      ].filter(Boolean)
    };
  } catch (err) {
    finalPrompt = style ? `${rawPrompt}, in a ${style} style, highly detailed` : `${rawPrompt}, highly detailed`;
  }
  return { finalPrompt, enhancementData };
}
function selectModel(preferred) {
  if (preferred && ALLOWED_IMAGE_MODELS.includes(preferred)) {
    return preferred;
  }
  return "@cf/stabilityai/stable-diffusion-xl-base-1.0";
}
function buildAIInputs(req, finalPrompt) {
  const inputs = { prompt: finalPrompt };
  if (req.width) inputs.width = req.width;
  if (req.height) inputs.height = req.height;
  if (req.steps) inputs.num_steps = parseInt(String(req.steps), 10);
  return inputs;
}

const EXTERNAL_MODELS = {
  together_flux: "Together AI - FLUX.1-schnell",
  hf_playground: "HuggingFace - Playground v2.5",
  stability_sdxl: "Stability AI - SDXL",
  openai_sora: "OpenAI - Sora (Video)"
};
const ALL_MODELS = [...ALLOWED_IMAGE_MODELS, ...Object.keys(EXTERNAL_MODELS)];
async function handleExternalModel(model, prompt, env, enhancementData) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ...enhancementData ? { "X-Prompt-Enhanced": "1" } : {}
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
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "black-forest-labs/FLUX.1-schnell-Free",
              prompt,
              width: 1024,
              height: 1024,
              steps: 4,
              n: 1,
              response_format: "base64"
            })
          }
        );
        if (!togetherResponse.ok) {
          throw new Error(`Together API error: ${togetherResponse.status}`);
        }
        const togetherData = await togetherResponse.json();
        const imageBase64 = togetherData.data?.[0]?.b64_json;
        if (!imageBase64) {
          throw new Error("No image data received from Together API");
        }
        return new Response(
          JSON.stringify({
            success: true,
            image: `data:image/png;base64,${imageBase64}`,
            provider: "Together AI"
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
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              inputs: prompt,
              options: { wait_for_model: true }
            })
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
            provider: "HuggingFace"
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
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              text_prompts: [{ text: prompt, weight: 1 }],
              cfg_scale: 7,
              width: 1024,
              height: 1024,
              steps: 30,
              samples: 1
            })
          }
        );
        if (!stabilityResponse.ok) {
          throw new Error(`Stability AI error: ${stabilityResponse.status}`);
        }
        const stabilityData = await stabilityResponse.json();
        const stabilityImage = stabilityData.artifacts?.[0]?.base64;
        if (!stabilityImage) {
          throw new Error("No image data received from Stability AI");
        }
        return new Response(
          JSON.stringify({
            success: true,
            image: `data:image/png;base64,${stabilityImage}`,
            provider: "Stability AI"
          }),
          { headers }
        );
      case "openai_sora":
        return new Response(
          JSON.stringify({
            success: false,
            error: "OpenAI Sora integration coming soon - video generation",
            provider: "OpenAI"
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
        provider: model
      }),
      {
        headers: { ...headers, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
}
const GET = async () => {
  return createSuccessResponse({
    message: "Image Generator API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: "Send POST with { prompt, model?, style?, width?, height?, steps?, enhancePrompt?, enhanceOptions? }",
    supportedModels: ALL_MODELS,
    externalModels: EXTERNAL_MODELS,
    enhancementFeatures: {
      enhancePrompt: "Boolean - Enable intelligent prompt enhancement with wildcards",
      enhanceOptions: {
        colorPalette: [
          "cyberpunk",
          "vintage",
          "monochrome",
          "vibrant",
          "pastel"
        ],
        artistStyle: "String - Apply specific artist style",
        mood: "String - Apply mood enhancement",
        quality: ["standard", "high", "ultra"]
      }
    }
  });
};
const POST = async ({ request, locals }) => {
  const runtime = locals?.runtime;
  if (!runtime?.env?.AI) {
    console.error("Cloudflare environment or AI binding not available");
    return createErrorResponse(
      "AI service is not configured on the server.",
      500
    );
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
    if (!rawPrompt || typeof rawPrompt !== "string" || rawPrompt.trim().length < 3) {
      return createErrorResponse("A valid prompt is required.", 400);
    }
    const { finalPrompt, enhancementData } = enhancePromptIfRequested({
      prompt: rawPrompt,
      style,
      enhancePrompt,
      enhanceOptions
    });
    const prompt = finalPrompt;
    if (model && Object.keys(EXTERNAL_MODELS).includes(model)) {
      return await handleExternalModel(
        model,
        prompt,
        runtime.env,
        enhancementData
      );
    }
    const selectedModel = selectModel(model);
    const ai = runtime.env.AI;
    const inputs = buildAIInputs({ prompt, width, height, steps }, prompt);
    const response = await ai.run(selectedModel, inputs);
    return new Response(response, {
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*",
        ...enhancementData ? { "X-Prompt-Enhanced": "1" } : {}
      }
    });
  } catch (error) {
    console.error("Image generation API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return createErrorResponse("Failed to generate image.", 500, {
      details: errorMessage
    });
  }
};
const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    OPTIONS,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
