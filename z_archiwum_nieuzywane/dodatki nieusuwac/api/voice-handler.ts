
import type { APIRoute } from 'astro';

// This API simulates the full STT -> Bielik -> TTS pipeline.
// It's adapted to the Astro API route format from the provided Cloudflare Worker example.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function simulateSTT(audioBuffer: ArrayBuffer): Promise<string> {
    console.log(`Simulating STT for audio buffer of size: ${audioBuffer.byteLength}`);
    await new Promise(res => setTimeout(res, 1000)); // Simulate network and processing delay
    return "Opowiedz mi o przyszłości sztucznej inteligencji i modelu Bielik.";
}

async function simulateBielik(text: string): Promise<string> {
    console.log(`Bielik received text: ${text}`);
    await new Promise(res => setTimeout(res, 800));
    return "Bielik, jako orkiestrator, będzie personalizować twoje doświadczenia, ucząc się z każdej interakcji. Przyszłość to adaptacyjne, proaktywne systemy AI.";
}

async function simulateTTS(text: string): Promise<ArrayBuffer> {
    console.log(`Simulating TTS for text: ${text}`);
    await new Promise(res => setTimeout(res, 1200));
    // In a real scenario, this would be an MP3 or WAV buffer.
    // We return an empty buffer for this mock.
    return new ArrayBuffer(0);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const audioArrayBuffer = await request.arrayBuffer();

    // 1. Simulate STT call
    const userText = await simulateSTT(audioArrayBuffer);

    // 2. Simulate call to Bielik orchestrator
    const answerText = await simulateBielik(userText);

    // 3. Simulate TTS call
    const ttsAudioBuffer = await simulateTTS(answerText);

    // 4. Return the synthesized audio to the frontend
    return new Response(ttsAudioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        ...corsHeaders,
      },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

export const OPTIONS: APIRoute = () => {
    return new Response(null, { headers: corsHeaders });
};
