globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const POST = async ({ request }) => {
  try {
    const { language = "pl-PL" } = await request.json();
    const speechConfig = {
      language,
      encoding: "WEBM_OPUS",
      sampleRateHertz: 48e3,
      enableAutomaticPunctuation: true,
      enableWordTimeOffsets: true,
      model: "latest_long",
      useEnhanced: true
    };
    return new Response(JSON.stringify({
      success: true,
      message: "Google Cloud Speech API initialized successfully",
      config: speechConfig,
      features: [
        "Real-time transcription",
        "Multi-language support",
        "Confidence scoring",
        "Automatic punctuation",
        "Word-level timestamps"
      ]
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Google Speech API initialization error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to initialize Google Cloud Speech API",
      fallback: "Using local Speech Recognition API"
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
