import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
  const runtime = (locals as any).runtime;

  try {
    // Lista dostępnych secrets (bez wartości ze względów bezpieczeństwa)
    const availableSecrets = {
      // Google Cloud
      GOOGLE_APPLICATION_CREDENTIALS:
        !!runtime?.env?.GOOGLE_APPLICATION_CREDENTIALS,
      GOOGLE_PROJECT_ID: !!runtime?.env?.GOOGLE_PROJECT_ID,
      GOOGLE_CLOUD_PROJECT_ID: !!runtime?.env?.GOOGLE_CLOUD_PROJECT_ID,

      // Kaggle
      KAGGLE_USERNAME: !!runtime?.env?.KAGGLE_USERNAME,
      KAGGLE_KEY: !!runtime?.env?.KAGGLE_KEY,

      // OpenAI
      OPENAI_API_KEY: !!runtime?.env?.OPENAI_API_KEY,

      // Tavily
      TAVILY_API_KEY: !!runtime?.env?.TAVILY_API_KEY,

      // Azure
      AZURE_API_KEY: !!runtime?.env?.AZURE_API_KEY,
      AZURE_ENDPOINT: !!runtime?.env?.AZURE_ENDPOINT,

      // Cloudflare
      CLOUDFLARE_ACCOUNT_ID: !!runtime?.env?.CLOUDFLARE_ACCOUNT_ID,
      CLOUDFLARE_API_TOKEN: !!runtime?.env?.CLOUDFLARE_API_TOKEN,

      // AI Providers
      DEEPSEEK_API_KEY: !!runtime?.env?.DEEPSEEK_API_KEY,
      OPENROUTER_API_KEY: !!runtime?.env?.OPENROUTER_API_KEY,
      GROQ_API_KEY: !!runtime?.env?.GROQ_API_KEY,
      HUGGING_FACE_API_KEY: !!runtime?.env?.HUGGING_FACE_API_KEY,
      ANTHROPIC_API_KEY: !!runtime?.env?.ANTHROPIC_API_KEY,
    };

    // Zlicz dostępne secrets
    const availableCount =
      Object.values(availableSecrets).filter(Boolean).length;
    const totalCount = Object.keys(availableSecrets).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Secrets test completed - ${availableCount}/${totalCount} secrets available`,
        availableSecrets,
        availableCount,
        totalCount,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to check secrets",
        message: error?.message || "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};
