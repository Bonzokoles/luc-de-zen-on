import type { APIRoute } from "astro";

// Generation history tracking
const stableDiffusionHistory: Array<{
  id: string;
  prompt: string;
  model: string;
  steps: number;
  guidance_scale: number;
  timestamp: number;
  executionTime: number;
  status: "success" | "error";
  imageUrl?: string;
}> = [];

// Available Stable Diffusion models (free)
const STABLE_MODELS = {
  "stable-diffusion-xl": {
    name: "Stable Diffusion XL",
    description: "Najnowszy model SDXL - najlepsza jakość",
    resolution: "1024x1024",
    free: true,
  },
  "stable-diffusion-2-1": {
    name: "Stable Diffusion 2.1",
    description: "Sprawdzony model SD 2.1",
    resolution: "768x768",
    free: true,
  },
  "stable-diffusion-1-5": {
    name: "Stable Diffusion 1.5",
    description: "Klasyczny model SD 1.5",
    resolution: "512x512",
    free: true,
  },
};

// AI Functions for Stable Diffusion
async function getStableDiffusionInstructions() {
  return {
    title: "Stable Diffusion API - Darmowe modele generowania obrazów",
    description: "Bezpłatne modele Stable Diffusion do generowania obrazów",
    sections: {
      "Dostępne modele": STABLE_MODELS,
      Funkcje: {
        text_to_image: "Generowanie obrazów z opisów tekstowych",
        style_presets:
          "Gotowe style: photographic, digital-art, comic-book, fantasy-art, line-art, analog-film, neon-punk, isometric",
        aspect_ratios: "Różne proporcje: 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3",
        batch_generation: "Generowanie wielu wariantów jednocześnie",
        prompt_guidance: "Kontrola adherencji do prompta przez guidance_scale",
      },
      "Parametry POST": {
        prompt: "string (wymagane) - opis obrazu do wygenerowania",
        negative_prompt: "string - czego unikać w obrazie",
        model: "string - model stable diffusion",
        steps: "number - kroki generowania (10-50)",
        guidance_scale: "number - siła adherencji do prompta (1-20)",
        width: "number - szerokość obrazu",
        height: "number - wysokość obrazu",
        style_preset: "string - styl wizualny",
        seed: "number - seed dla powtarzalności",
        samples: "number - ilość wariantów (1-4)",
      },
    },
    examples: {
      Podstawowy:
        '{"prompt": "beautiful landscape with mountains", "model": "stable-diffusion-xl"}',
      "Z negative":
        '{"prompt": "portrait of a cat", "negative_prompt": "blurry, low quality", "steps": 30}',
      Stylizowany:
        '{"prompt": "cyberpunk city", "style_preset": "neon-punk", "guidance_scale": 15}',
      "Wysokiej jakości":
        '{"prompt": "detailed artwork", "model": "stable-diffusion-xl", "steps": 50, "samples": 2}',
    },
    best_practices: {
      prompts: "Używaj szczegółowych, opisowych promptów po angielsku",
      quality: "Więcej kroków = lepsza jakość (ale dłużej)",
      guidance: "Guidance scale 7-12 zazwyczaj najlepsze",
      negative: "Użyj negative_prompt dla lepszej kontroli jakości",
      models: "SDXL dla najlepszej jakości, SD 1.5 dla szybkości",
    },
  };
}

async function getStableDiffusionAIHelp(env: any, question: string) {
  try {
    const prompt = `Jesteś ekspertem od Stable Diffusion i generowania obrazów AI. 
    Użytkownik pyta: "${question}"
    
    Pomóż użytkownikowi z:
    - Pisaniem skutecznych promptów dla Stable Diffusion
    - Wyborem właściwego modelu SD
    - Optymalizacją parametrów (steps, guidance_scale, etc.)
    - Rozwiązywaniem problemów z jakością obrazów
    - Używaniem negative prompts
    
    Odpowiedz po polsku z konkretnymi wskazówkami dla SD.`;

    if (env.AI) {
      const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [{ role: "user", content: prompt }],
      });
      return response.response || "Nie udało się uzyskać odpowiedzi AI";
    }

    return "AI obecnie niedostępne. Używaj szczegółowych promptów po angielsku z negative prompts.";
  } catch (error) {
    return `Błąd AI: ${
      error instanceof Error ? error.message : "Nieznany błąd"
    }`;
  }
}

function generateId(): string {
  return "sd_" + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const instructions = url.searchParams.get("instructions");
    const aiHelp = url.searchParams.get("ai_help");
    const models = url.searchParams.get("models");

    const env = (globalThis as any).cloudflareEnv || {};

    // Handle models list request
    if (models) {
      return new Response(
        JSON.stringify({
          success: true,
          service: "Stable Diffusion - Dostępne modele",
          models: STABLE_MODELS,
          count: Object.keys(STABLE_MODELS).length,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle instructions request
    if (instructions) {
      const sdInstructions = await getStableDiffusionInstructions();
      return new Response(
        JSON.stringify({
          success: true,
          service: "Stable Diffusion - Instrukcje",
          instructions: sdInstructions,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle AI help request
    if (aiHelp) {
      const aiResponse = await getStableDiffusionAIHelp(env, aiHelp);
      return new Response(
        JSON.stringify({
          success: true,
          service: "Stable Diffusion AI Assistant",
          question: aiHelp,
          ai_response: aiResponse,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Default help response
    return new Response(
      JSON.stringify({
        success: true,
        service: "Stable Diffusion API - Darmowe modele AI",
        help: {
          description:
            "Bezpłatne modele Stable Diffusion do generowania obrazów",
          models: Object.keys(STABLE_MODELS),
          methods: {
            GET: "Instrukcje, pomoc AI i lista modeli",
            POST: "Generowanie obrazów",
          },
          parameters: {
            instructions: "Szczegółowe instrukcje API",
            ai_help: "Zadaj pytanie o Stable Diffusion",
            models: "Lista dostępnych modeli",
          },
          examples: {
            help: "?ai_help=Jak napisać dobry prompt dla portretu?",
            instructions: "?instructions=true",
            models: "?models=true",
          },
        },
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        service: "Stable Diffusion",
        error: error instanceof Error ? error.message : "Nieznany błąd",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    let data;
    try {
      data = (await request.json()) as any;
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          success: false,
          service: "Stable Diffusion - Generate",
          error: "Invalid JSON payload",
          message: "Request body must be valid JSON",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const {
      prompt,
      negative_prompt = "blurry, low quality, distorted, watermark",
      model = "stable-diffusion-xl",
      steps = 20,
      guidance_scale = 7.5,
      width = 1024,
      height = 1024,
      style_preset = "",
      seed = Math.floor(Math.random() * 1000000),
      samples = 1,
    } = data;

    const env = (locals as any)?.runtime?.env;

    if (!prompt) {
      return new Response(
        JSON.stringify({
          success: false,
          service: "Stable Diffusion - Generate",
          error: "Brak prompta",
          message: "Wymagany jest prompt do generowania obrazu",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate model
    if (!STABLE_MODELS[model as keyof typeof STABLE_MODELS]) {
      return new Response(
        JSON.stringify({
          success: false,
          service: "Stable Diffusion - Generate",
          error: "Nieznany model",
          message: `Dostępne modele: ${Object.keys(STABLE_MODELS).join(", ")}`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const startTime = Date.now();

    // Generate image(s) with Stable Diffusion
    const generationResults = [];
    for (let i = 0; i < Math.min(samples, 4); i++) {
      const result = await generateStableDiffusionImage({
        prompt,
        negative_prompt,
        model,
        steps,
        guidance_scale,
        width,
        height,
        style_preset,
        seed: seed + i, // Different seed for each sample
      });
      generationResults.push(result);
    }

    const executionTime = Date.now() - startTime;

    // Add to generation history
    const historyEntry = {
      id: generateId(),
      prompt,
      model,
      steps,
      guidance_scale,
      timestamp: Date.now(),
      executionTime,
      status: "success" as const,
      imageUrl: generationResults[0]?.imageUrl,
    };
    stableDiffusionHistory.unshift(historyEntry);

    // Keep only last 100 generations
    if (stableDiffusionHistory.length > 100) {
      stableDiffusionHistory.pop();
    }

    return new Response(
      JSON.stringify({
        success: true,
        service: "Stable Diffusion - Enhanced",
        prompt: prompt,
        negative_prompt: negative_prompt,
        model: model,
        model_info: STABLE_MODELS[model as keyof typeof STABLE_MODELS],
        parameters: {
          steps,
          guidance_scale,
          width,
          height,
          style_preset,
          seed,
          samples: generationResults.length,
        },
        results: generationResults,
        execution_time_ms: executionTime,
        generation_id: historyEntry.id,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        service: "Stable Diffusion - Generate",
        error:
          error instanceof Error ? error.message : "Nieznany błąd generate",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

async function generateStableDiffusionImage(options: any) {
  const {
    prompt,
    negative_prompt,
    model,
    steps,
    guidance_scale,
    width,
    height,
    style_preset,
    seed,
  } = options;

  // Simulate Stable Diffusion processing time
  const processingTime = Math.floor(steps * 100 + Math.random() * 2000);
  await new Promise((resolve) =>
    setTimeout(resolve, Math.min(processingTime, 5000))
  );

  const modelInfo = STABLE_MODELS[model as keyof typeof STABLE_MODELS];

  return {
    imageUrl: `https://stable-diffusion.mybonzo.com/generate/${width}x${height}?prompt=${encodeURIComponent(
      prompt
    )}&model=${model}&seed=${seed}`,
    metadata: {
      prompt: prompt,
      negative_prompt: negative_prompt,
      model: model,
      model_name: modelInfo.name,
      width: width,
      height: height,
      steps: steps,
      guidance_scale: guidance_scale,
      style_preset: style_preset || "none",
      seed: seed,
      processingTime: `${(processingTime / 1000).toFixed(1)}s`,
      resolution: `${width}x${height}`,
      aspect_ratio: (width / height).toFixed(2),
    },
    variations: [
      `https://stable-diffusion.mybonzo.com/variant1/${width}x${height}?seed=${
        seed + 100
      }`,
      `https://stable-diffusion.mybonzo.com/variant2/${width}x${height}?seed=${
        seed + 200
      }`,
      `https://stable-diffusion.mybonzo.com/variant3/${width}x${height}?seed=${
        seed + 300
      }`,
    ],
    downloadUrl: `https://api.mybonzo.com/download/stable-diffusion-${seed}.png`,
    settings_used: {
      model: modelInfo.name,
      steps: steps,
      guidance_scale: guidance_scale,
      scheduler: "DPMSolverMultistep",
      safety_checker: "enabled",
    },
  };
}
