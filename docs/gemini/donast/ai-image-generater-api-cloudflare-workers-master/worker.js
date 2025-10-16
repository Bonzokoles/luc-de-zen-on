// worker.js - Cloudflare Worker Script By - WOODcraft
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const models = {
      "realistic_vision": "SG161222/Realistic_Vision_V5.1_noVAE",
      "dreamshaper": "Lykon/DreamShaper-v7",
      "sdxl": "stabilityai/stable-diffusion-xl-base-1.0",
      "deliberate": "XpucT/Deliberate",
      "anything_v5": "stabilityai/stable-diffusion-2-1",
      "protogen": "darkstorm2150/Protogen_x5.8",
      "flux": "black-forest-labs/FLUX.1-dev"
    };

    if (url.searchParams.get("model") === "list") {
      return new Response(JSON.stringify(models, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    let modelKey = url.searchParams.get('model') || "realistic_vision";
    let model = models[modelKey] || models["realistic_vision"];
    const prompt = url.searchParams.get('input') || 'A futuristic city at sunset';

    if (!env.HUGGINGFACE_TOKEN) {
      return new Response(JSON.stringify({ error: "Missing Hugging Face API token" }), {
        status: 401,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const requestBody = { inputs: prompt };
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${env.HUGGINGFACE_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        return new Response(JSON.stringify({ error: "Failed to fetch from Hugging Face API", details: errorResponse }), {
          status: response.status,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      const imageBuffer = await response.arrayBuffer();
      return new Response(imageBuffer, {
        headers: { "Content-Type": "image/png", "Access-Control-Allow-Origin": "*" }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }
};
