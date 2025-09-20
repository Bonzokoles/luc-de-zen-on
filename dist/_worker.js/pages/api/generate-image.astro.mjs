if (typeof MessageChannel === 'undefined') {
  class __PolyfillPort {
    constructor(){ this.onmessage = null; }
    postMessage(data){ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> this.onmessage && this.onmessage(e)); }
    start(){} close(){}
  }
  class MessageChannel {
    constructor(){
      this.port1 = new __PolyfillPort();
      this.port2 = new __PolyfillPort();
      const dispatch = (target, data)=>{ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> target.onmessage && target.onmessage(e)); };
      this.port1.postMessage = (d)=> dispatch(this.port2, d);
      this.port2.postMessage = (d)=> dispatch(this.port1, d);
    }
  }
  globalThis.MessageChannel = MessageChannel;
}
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_DD_RavK2.mjs';
export { d as renderers } from '../../chunks/vendor_DlPT8CWO.mjs';

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

const GET = async () => {
  return createSuccessResponse({
    message: "Image Generator API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: "Send POST with { prompt, model?, style?, width?, height?, steps?, enhancePrompt?, enhanceOptions? }",
    supportedModels: ALLOWED_IMAGE_MODELS,
    enhancementFeatures: {
      enhancePrompt: "Boolean - Enable intelligent prompt enhancement with wildcards",
      enhanceOptions: {
        colorPalette: ["cyberpunk", "vintage", "monochrome", "vibrant", "pastel"],
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
    return createErrorResponse("AI service is not configured on the server.", 500);
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
    return createErrorResponse("Failed to generate image.", 500, { details: errorMessage });
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
