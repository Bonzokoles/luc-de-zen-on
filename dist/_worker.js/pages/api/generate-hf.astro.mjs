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
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../chunks/corsUtils_DD_RavK2.mjs';
export { d as renderers } from '../../chunks/vendor_QZhDtzeH.mjs';

const OPTIONS = createOPTIONSHandler(["POST"]);
const POST = async ({ request, locals }) => {
  try {
    const { prompt, model = "stabilityai/stable-diffusion-2-1", ...options } = await request.json();
    if (!prompt) {
      return createErrorResponse("Prompt is required", 400);
    }
    const HF_API_TOKEN = undefined                         || process.env.HF_TOKEN;
    const HF_API_URL = `https://api-inference.huggingface.co/models/${model}`;
    if (!HF_API_TOKEN) {
      return createErrorResponse("Hugging Face API token not configured", 500);
    }
    const hfResponse = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: options.negative_prompt || "blurry, bad quality, distorted",
          num_inference_steps: options.steps || 25,
          guidance_scale: options.guidance_scale || 7.5,
          width: options.width || 512,
          height: options.height || 512,
          ...options
        }
      })
    });
    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("HF API Error:", errorText);
      if (hfResponse.status === 503) {
        return createErrorResponse("Model is loading, please try again in a few seconds", 503);
      }
      return createErrorResponse(`Hugging Face API error: ${errorText}`, hfResponse.status);
    }
    const imageBlob = await hfResponse.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;
    return createSuccessResponse({
      success: true,
      imageUrl: dataUrl,
      model,
      prompt,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      metadata: {
        source: "huggingface",
        model,
        parameters: {
          steps: options.steps || 25,
          guidance_scale: options.guidance_scale || 7.5,
          width: options.width || 512,
          height: options.height || 512
        }
      }
    });
  } catch (error) {
    console.error("Generate HF error:", error);
    return createErrorResponse("Internal server error during image generation", 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
