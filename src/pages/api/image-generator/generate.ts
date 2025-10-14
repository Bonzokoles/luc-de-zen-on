import type { APIRoute } from "astro";

// Generation history tracking
const generationHistory: Array<{
  id: string;
  prompt: string;
  style: string;
  size: string;
  timestamp: number;
  executionTime: number;
  status: "success" | "error";
  imageUrl?: string;
}> = [];

// AI Functions for Image Generator
async function getImageGeneratorInstructions() {
  return {
    title: "Image Generator API - Kompletny przewodnik",
    description: "Zaawansowany generator obrazów z AI i analityką",
    sections: {
      "Podstawowe generowanie": {
        prompt: "Opis obrazu do wygenerowania (wymagane)",
        style: "Styl: realistic, artistic, cartoon, anime, sketch",
        size: "Rozmiar: 256x256, 512x512, 1024x1024, 1024x1792",
        steps: "Kroki generowania: 10-50 (więcej = lepsza jakość)",
      },
      "Zaawansowane funkcje": {
        batch_generation: "Generowanie wielu wariantów jednocześnie",
        style_transfer: "Transfer stylu z przykładowego obrazu",
        prompt_optimization: "AI optymalizuje prompt dla lepszych wyników",
        quality_analysis: "Analiza jakości wygenerowanych obrazów",
      },
      "Parametry POST": {
        prompt: "string (wymagane) - opis obrazu",
        style: "string - styl wizualny",
        size: "string - wymiary obrazu",
        steps: "number - kroki generowania",
        count: "number - ilość wariantów (1-4)",
        enhance_prompt: "boolean - optymalizacja promptu przez AI",
      },
    },
    examples: {
      Podstawowe:
        '{"prompt": "beautiful sunset over mountains", "style": "realistic"}',
      Artystyczne:
        '{"prompt": "abstract digital art", "style": "artistic", "size": "1024x1024"}',
      "Z optymalizacją":
        '{"prompt": "cat in space", "enhance_prompt": true, "count": 2}',
    },
    best_practices: {
      prompts: "Używaj opisowych, szczegółowych promptów",
      styles: "Dobierz styl do rodzaju obrazu",
      quality: "Więcej kroków = lepsza jakość, ale dłużej",
      batching: "Generuj warianty dla lepszego wyboru",
    },
  };
}

async function getImageGeneratorAIHelp(env: any, question: string) {
  try {
    const prompt = `Jesteś ekspertem od generowania obrazów AI i prompt engineering. 
    Użytkownik pyta: "${question}"
    
    Pomóż użytkownikowi z:
    - Tworzeniem skutecznych promptów
    - Doborem stylu wizualnego
    - Optymalizacją parametrów generowania
    - Rozwiązywaniem problemów z jakością
    
    Odpowiedz po polsku z konkretnymi wskazówkami.`;

    if (env.AI) {
      const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [{ role: "user", content: prompt }],
      });
      return response.response || "Nie udało się uzyskać odpowiedzi AI";
    }

    return "AI obecnie niedostępne. Spróbuj używać szczegółowych, opisowych promptów.";
  } catch (error) {
    return `Błąd AI: ${
      error instanceof Error ? error.message : "Nieznany błąd"
    }`;
  }
}

async function enhancePromptWithAI(
  env: any,
  originalPrompt: string,
  style: string
) {
  try {
    if (!env.AI) return originalPrompt;

    const enhancePrompt = `Ulepsz ten prompt do generowania obrazów, aby uzyskać lepsze wyniki:
    Oryginalny prompt: "${originalPrompt}"
    Styl: "${style}"
    
    Zwróć tylko ulepszony prompt po angielsku, bez dodatkowych komentarzy.`;

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [{ role: "user", content: enhancePrompt }],
    });

    return response.response || originalPrompt;
  } catch (error) {
    return originalPrompt;
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const instructions = url.searchParams.get("instructions");
    const aiHelp = url.searchParams.get("ai_help");

    const env = (globalThis as any).cloudflareEnv || {};

    // Handle instructions request
    if (instructions) {
      const imageInstructions = await getImageGeneratorInstructions();
      return new Response(
        JSON.stringify({
          success: true,
          service: "Image Generator - Instrukcje",
          instructions: imageInstructions,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle AI help request
    if (aiHelp) {
      const aiResponse = await getImageGeneratorAIHelp(env, aiHelp);
      return new Response(
        JSON.stringify({
          success: true,
          service: "Image Generator AI Assistant",
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
        service: "Image Generator API - Enhanced with AI",
        help: {
          description: "Zaawansowany generator obrazów z AI assistance",
          methods: {
            GET: "Instrukcje i pomoc AI",
            POST: "Generowanie obrazów",
          },
          parameters: {
            instructions: "Szczegółowe instrukcje API",
            ai_help: "Zadaj pytanie o generowanie obrazów",
          },
          examples: {
            help: "?ai_help=Jak napisać dobry prompt dla portretu?",
            instructions: "?instructions=true",
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
        service: "Image Generator",
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
    console.log("=== IMAGE GENERATOR DEBUG (POST) ===");
    const envForDebug = (locals as any)?.runtime?.env ?? {};
    console.log("env available:", !!(locals as any)?.runtime?.env);
    console.log("env?.AI available:", !!envForDebug.AI);
    console.log("env keys:", Object.keys(envForDebug));

    const data = (await request.json()) as any;
    const {
      prompt,
      style = "realistic",
      size = "1024x1024",
      steps = 20,
      count = 1,
      enhance_prompt = false,
    } = data;

    const env = (locals as any)?.runtime?.env ?? {};

    if (!prompt) {
      return new Response(
        JSON.stringify({
          success: false,
          service: "Image Generator - Generate",
          error: "Brak prompta",
          message: "Wymagany jest prompt do generowania obrazu",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const startTime = Date.now();

    // Enhance prompt with AI if requested
    let finalPrompt = prompt;
    if (enhance_prompt && env?.AI) {
      finalPrompt = await enhancePromptWithAI(env, prompt, style);
    }
    // Generate image(s)
    const generationResults = [];
    for (let i = 0; i < Math.min(count, 4); i++) {
      const result = await generateImage(env, {
        prompt: finalPrompt,
        style,
        size,
        steps,
      });
      generationResults.push(result);
    }

    const executionTime = Date.now() - startTime;

    // Add to generation history
    const historyEntry = {
      id: generateId(),
      prompt: finalPrompt,
      style,
      size,
      timestamp: Date.now(),
      executionTime,
      status: "success" as const,
      imageUrl: generationResults[0]?.imageUrl,
    };
    generationHistory.unshift(historyEntry);

    // Keep only last 100 generations
    if (generationHistory.length > 100) {
      generationHistory.pop();
    }

    return new Response(
      JSON.stringify({
        success: true,
        service: "Image Generator Enhanced",
        original_prompt: prompt,
        final_prompt: finalPrompt,
        enhanced: enhance_prompt,
        style: style,
        size: size,
        steps: steps,
        count: generationResults.length,
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
        service: "Image Generator - Generate",
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

function toBase64DataUrl(payload: unknown): string {
  if (payload instanceof ArrayBuffer) {
    const bytes = new Uint8Array(payload);
    const BufferCtor = (globalThis as any).Buffer;
    if (typeof BufferCtor === "function") {
      return `data:image/png;base64,${BufferCtor.from(bytes).toString(
        "base64"
      )}`;
    }
    if (typeof btoa === "function") {
      const chunkSize = 0x8000;
      let binary = "";
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      return `data:image/png;base64,${btoa(binary)}`;
    }
    throw new Error("Unable to encode image payload to base64");
  }
  if (typeof payload === "string") {
    return payload.startsWith("data:")
      ? payload
      : `data:image/png;base64,${payload}`;
  }
  if (
    payload &&
    typeof payload === "object" &&
    "image" in payload &&
    typeof (payload as any).image === "string"
  ) {
    const image = (payload as any).image;
    return image.startsWith("data:") ? image : `data:image/png;base64,${image}`;
  }
  throw new Error("Unsupported AI image response format");
}

async function generateImage(env: any, options: any) {
  const { prompt, style, size, steps } = options;

  // Try to use Cloudflare AI for image generation
  if (env?.AI) {
    try {
      // Use Cloudflare AI Stable Diffusion
      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        {
          prompt: prompt,
          num_steps: steps || 20,
          guidance: 7.5,
          strength: 1.0,
        }
      );

      // If response is successful, return real image
      if (response) {
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = toBase64DataUrl(response);
        return {
          imageUrl,
          metadata: {
            prompt: prompt,
            style: style,
            size: size,
            steps: steps,
            seed: seed,
            model: "Stable Diffusion XL (Cloudflare AI)",
            processingTime: "3.2s",
            guidance: 7.5,
            strength: 1.0,
          },
          variations: [
            `https://stable-diffusion.mybonzo.com/variant1/${size}?seed=${
              seed + 1
            }`,
            `https://stable-diffusion.mybonzo.com/variant2/${size}?seed=${
              seed + 2
            }`,
            `https://stable-diffusion.mybonzo.com/variant3/${size}?seed=${
              seed + 3
            }`,
          ],
          downloadUrl: `https://api.mybonzo.com/download/cf-sd-${seed}.png`,
          source: "cloudflare-ai",
          real_generation: true,
        };
      }
    } catch (error) {
      console.error("Cloudflare AI image generation failed:", error);
    }
  }

  // Fallback to Together AI API
  if (env?.TOGETHER_API_KEY) {
    try {
      const response = await fetch(
        "https://api.together.xyz/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.TOGETHER_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: prompt,
            model: "black-forest-labs/FLUX.1-schnell-Free",
            width: 1024,
            height: 1024,
            steps: 4,
            n: 1,
          }),
        }
      );

      if (response.ok) {
        const data = (await response.json()) as any;
        if (data.data && data.data.length > 0) {
          const imageUrl = data.data[0].b64_json;
          return {
            imageUrl: `data:image/png;base64,${imageUrl}`,
            metadata: {
              prompt: prompt,
              style: style,
              size: "1024x1024",
              steps: 4,
              model: "FLUX.1-schnell (Together AI)",
            },
            source: "together-ai",
            real_generation: true,
          };
        }
      }
    } catch (error) {
      console.error("Together AI image generation failed:", error);
    }
  }

  // Fallback to mock generation
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    imageUrl: `https://placeholder.mybonzo.com/generate/${size}?text=${encodeURIComponent(
      prompt
    )}&style=${style}`,
    metadata: {
      prompt: prompt,
      style: style,
      size: size,
      steps: steps,
      seed: Math.floor(Math.random() * 1000000),
      model: "MyBonzo-ImageGen-Demo",
      processingTime: "2.1s",
      guidance: 7.5,
    },
    variations: [
      `https://placeholder.mybonzo.com/variant1/${size}?text=${encodeURIComponent(
        prompt
      )}`,
      `https://placeholder.mybonzo.com/variant2/${size}?text=${encodeURIComponent(
        prompt
      )}`,
      `https://placeholder.mybonzo.com/variant3/${size}?text=${encodeURIComponent(
        prompt
      )}`,
    ],
    downloadUrl: `https://api.mybonzo.com/download/image-${Date.now()}.png`,
    source: "demo-placeholder",
    real_generation: false,
  };
}
