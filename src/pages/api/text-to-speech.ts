import type { APIRoute } from "astro";

/**
 * Text-to-Speech API Endpoint
 * Converts text to speech using available voice services
 */

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { text, voice, speed } = (await request.json()) as any;

    if (!text?.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Tekst jest wymagany",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    }

    // Access environment - Cloudflare runtime
    const env = import.meta.env.DEV
      ? process.env
      : (locals as any)?.runtime?.env || {};

    // Check for available TTS services
    const openaiApiKey = env.OPENAI_API_KEY;
    const googleCloudKey = env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!openaiApiKey && !googleCloudKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Brak konfiguracji API dla usług głosowych",
          fallbackToWebSpeech: true,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    }

    // Try OpenAI TTS first if available
    if (openaiApiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "tts-1",
            input: text,
            voice: voice || "alloy",
            speed: speed || 1.0,
          }),
        });

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();

          return new Response(audioBuffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Disposition": `attachment; filename="speech.mp3"`,
            },
          });
        }
      } catch (error) {
        console.error("OpenAI TTS error:", error);
      }
    }

    // Fallback to Web Speech API suggestion
    return new Response(
      JSON.stringify({
        success: true,
        message: "Użyj przeglądarki - Web Speech API dostępne",
        fallbackToWebSpeech: true,
        config: {
          text,
          voice: voice || "pl-PL",
          speed: speed || 1.0,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  } catch (error) {
    console.error("TTS API error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Błąd podczas generowania mowy",
        fallbackToWebSpeech: true,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
