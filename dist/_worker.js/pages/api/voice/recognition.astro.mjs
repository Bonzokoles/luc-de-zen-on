globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
};
const GET = async () => {
  return new Response(JSON.stringify({
    message: "Voice Recognition API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: "Send POST request with FormData containing audio file",
    googleCloud: {
      enabled: false,
      note: "Using browser Web Speech API as fallback"
    }
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
};
const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");
    const language = formData.get("language") || "pl-PL";
    if (!audioFile) {
      return new Response(JSON.stringify({
        success: false,
        error: "No audio file provided"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    try {
      const { SpeechClient } = await import('../../../chunks/index_WpCgqMdc.mjs').then(n => n.i);
      const fs = await import('fs');
      const path = await import('path');
      const projectId = process.env.GOOGLE_PROJECT_ID;
      let credentials = void 0;
      let keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (!keyPath || !fs.existsSync(keyPath)) {
        const sekretsPath = path.resolve(process.cwd(), "sekrets", "google-key.json");
        if (fs.existsSync(sekretsPath)) {
          keyPath = sekretsPath;
        }
      }
      if (!keyPath || !fs.existsSync(keyPath)) {
        const docPath = "Q:/mybonzo/DOC_uments";
        if (fs.existsSync(docPath)) {
          const files = fs.readdirSync(docPath).filter((f) => f.endsWith(".json"));
          if (files.length > 0) {
            keyPath = path.join(docPath, files[0]);
          }
        }
      }
      if (keyPath && fs.existsSync(keyPath)) {
        credentials = JSON.parse(fs.readFileSync(keyPath, "utf8"));
      } else if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        credentials = {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
        };
      }
      const client = new SpeechClient(
        credentials ? { projectId, credentials } : { projectId }
      );
      const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
      const config = {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 44100,
        languageCode: language,
        enableAutomaticPunctuation: true,
        model: "default"
      };
      const audio = {
        content: audioBuffer.toString("base64")
      };
      const [response] = await client.recognize({ config, audio });
      const transcription = response.results?.map((result) => result.alternatives?.[0]?.transcript).filter(Boolean).join(" ")?.trim() || "";
      const confidence = response.results?.[0]?.alternatives?.[0]?.confidence || 0.8;
      if (!transcription) {
        return new Response(JSON.stringify({
          success: false,
          error: "Brak rozpoznanego tekstu"
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      return new Response(JSON.stringify({
        success: true,
        transcript: transcription,
        confidence: Math.round(confidence * 100),
        language,
        duration: Math.random() * 3 + 1,
        audioSize: audioFile.size,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        provider: "google-speech-to-text",
        note: "Google Cloud Speech-to-Text API response"
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      console.error("Google Speech-to-Text error:", err);
      return new Response(JSON.stringify({
        success: false,
        error: "Błąd integracji z Google Speech-to-Text",
        details: err instanceof Error ? err.message : "Unknown error",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("Voice recognition error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
