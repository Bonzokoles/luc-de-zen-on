// Free AI Models API - Image and Video Generation
// Supports: Together AI (Flux Schnell), Stability AI (SDXL Turbo), HuggingFace (Playground v2), OpenAI (Sora)

export async function POST({
  request,
  locals,
}: {
  request: Request;
  locals: any;
}) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const {
      prompt,
      provider,
      type = "image",
      style = "realistic",
    } = (await request.json()) as any;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt jest wymagany" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const runtime = (locals as any)?.runtime?.env;

    // Get API keys from Cloudflare environment
    const OPENAI_API_KEY = runtime?.OPENAI_API_KEY;
    const TOGETHER_API_KEY = runtime?.TOGETHER_API_KEY;
    const STABILITY_API_KEY = runtime?.STABILITY_API_KEY;
    const HUGGINGFACE_API_KEY = runtime?.HUGGINGFACE_API_KEY;

    let result;

    switch (provider) {
      case "together":
        if (!TOGETHER_API_KEY) {
          throw new Error("Together AI API key nie jest skonfigurowany");
        }
        result = await generateWithTogether(prompt, TOGETHER_API_KEY, style);
        break;

      case "stability":
        if (!STABILITY_API_KEY) {
          throw new Error("Stability AI API key nie jest skonfigurowany");
        }
        result = await generateWithStability(prompt, STABILITY_API_KEY, style);
        break;

      case "huggingface":
        if (!HUGGINGFACE_API_KEY) {
          throw new Error("HuggingFace API key nie jest skonfigurowany");
        }
        result = await generateWithHuggingFace(
          prompt,
          HUGGINGFACE_API_KEY,
          style
        );
        break;

      case "openai":
        if (type === "video") {
          if (!OPENAI_API_KEY) {
            throw new Error("OpenAI API key nie jest skonfigurowany");
          }
          result = await generateVideoWithSora(prompt, OPENAI_API_KEY);
        } else {
          throw new Error(
            "OpenAI obsługuje tylko generowanie video przez Sora"
          );
        }
        break;

      default:
        throw new Error(
          "Nieznany provider. Dostępne: together, stability, huggingface, openai"
        );
    }

    return new Response(
      JSON.stringify({
        success: true,
        provider,
        type,
        prompt,
        result,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Free AI Models API Error:", error);
    return new Response(
      JSON.stringify({
        error: (error as any).message || "Błąd generowania AI",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}

// Together AI - Flux Schnell (Free)
async function generateWithTogether(
  prompt: string,
  apiKey: string,
  style: string
) {
  const response = await fetch(
    "https://api.together.xyz/v1/images/generations",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt: `${prompt}, ${style} style, high quality, detailed`,
        width: 1024,
        height: 1024,
        steps: 4, // Schnell is optimized for 4 steps
        n: 1,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Together AI error: ${error}`);
  }

  const data = (await response.json()) as any;
  return {
    image_url: data.data[0].url,
    model: "FLUX.1-schnell-Free",
    parameters: { steps: 4, size: "1024x1024" },
  };
}

// Stability AI - SDXL Turbo (Free tier)
async function generateWithStability(
  prompt: string,
  apiKey: string,
  style: string
) {
  const response = await fetch(
    "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: `${prompt}, ${style} style, masterpiece, best quality`,
            weight: 1,
          },
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Stability AI error: ${error}`);
  }

  const data = (await response.json()) as any;
  return {
    image_url: `data:image/png;base64,${data.artifacts[0].base64}`,
    model: "SDXL-1.0",
    parameters: { steps: 30, cfg_scale: 7, size: "1024x1024" },
  };
}

// HuggingFace - Playground v2 (Free)
async function generateWithHuggingFace(
  prompt: string,
  apiKey: string,
  style: string
) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/playgroundai/playground-v2-1024px-aesthetic",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `${prompt}, ${style} style, high quality, detailed, aesthetic`,
        parameters: {
          num_inference_steps: 25,
          guidance_scale: 7.5,
          width: 1024,
          height: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HuggingFace error: ${error}`);
  }

  // HuggingFace returns binary image data
  const imageBuffer = await response.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

  return {
    image_url: `data:image/png;base64,${base64}`,
    model: "playground-v2-1024px-aesthetic",
    parameters: { steps: 25, guidance_scale: 7.5, size: "1024x1024" },
  };
}

// OpenAI Sora - Video Generation (Free tier available)
async function generateVideoWithSora(prompt: string, apiKey: string) {
  const response = await fetch("https://api.openai.com/v1/videos/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sora-turbo",
      prompt: prompt,
      size: "1280x720",
      duration: 5, // 5 seconds for free tier
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI Sora error: ${error}`);
  }

  const data = (await response.json()) as any;
  return {
    video_url: data.data[0].url,
    model: "sora-turbo",
    parameters: { duration: "5s", size: "1280x720" },
  };
}

export async function GET() {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  return new Response(
    JSON.stringify({
      name: "Free AI Models API",
      version: "1.0.0",
      providers: [
        {
          id: "together",
          name: "Together AI",
          model: "FLUX.1-schnell-Free",
          type: "image",
          free: true,
          description: "Najszybszy model do generowania obrazów",
        },
        {
          id: "stability",
          name: "Stability AI",
          model: "SDXL-1.0",
          type: "image",
          free: true,
          description: "Wysokiej jakości generowanie obrazów",
        },
        {
          id: "huggingface",
          name: "HuggingFace",
          model: "playground-v2-1024px-aesthetic",
          type: "image",
          free: true,
          description: "Estetyczne obrazy wysokiej rozdzielczości",
        },
        {
          id: "openai",
          name: "OpenAI Sora",
          model: "sora-turbo",
          type: "video",
          free: true,
          description: "Generowanie krótkich filmów AI",
        },
      ],
      usage: {
        endpoint: "/api/free-ai-models/image-video",
        method: "POST",
        body: {
          prompt: "string (required)",
          provider: "together|stability|huggingface|openai",
          type: "image|video",
          style: "realistic|artistic|cartoon|cinematic",
        },
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}
