globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const POST = async ({ request }) => {
  try {
    const { text, voice, audioConfig } = await request.json();
    if (!text) {
      return new Response(JSON.stringify({
        success: false,
        error: "Text parameter is required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const ttsConfig = {
      input: { text },
      voice: {
        languageCode: voice?.substring(0, 5) || "pl-PL",
        name: voice || "pl-PL-Wavenet-A",
        ssmlGender: "NEUTRAL"
      },
      audioConfig: {
        audioEncoding: audioConfig?.audioEncoding || "MP3",
        speakingRate: audioConfig?.speakingRate || 1,
        pitch: audioConfig?.pitch || 0,
        volumeGainDb: audioConfig?.volumeGainDb || 0,
        effectsProfileId: ["telephony-class-application"]
      }
    };
    return new Response(JSON.stringify({
      success: true,
      message: "Google Cloud TTS would generate audio here",
      config: ttsConfig,
      audioUrl: null,
      // Would contain actual audio blob URL
      fallbackToWebSpeech: true
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Google TTS API error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to generate speech with Google Cloud TTS",
      fallbackToWebSpeech: true
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
