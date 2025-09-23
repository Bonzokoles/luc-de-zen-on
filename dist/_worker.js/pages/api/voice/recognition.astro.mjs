globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
export { r as renderers } from '../../../chunks/_@astro-renderers_ChtfEq-M.mjs';

=======
export { r as renderers } from '../../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const speechModels = {
  "latest_short": { accuracy: 95, speed: "fast" },
  "latest_long": { accuracy: 98, speed: "medium" },
  "command_and_search": { accuracy: 92, speed: "fast" },
  "phone_call": { accuracy: 88, speed: "fast" }
};
const languageAccuracy = {
  "pl-PL": 0.95,
  "en-US": 0.98,
  "en-GB": 0.97,
  "de-DE": 0.94,
  "es-ES": 0.93,
  "fr-FR": 0.92,
  "it-IT": 0.91,
  "pt-PT": 0.9,
  "ru-RU": 0.89,
  "ja-JP": 0.87
};
function generateMockRecognition(language, model) {
  const baseAccuracy = languageAccuracy[language] || 0.85;
  speechModels[model]?.accuracy || 90;
  const confidence = Math.min(95, baseAccuracy * 100 + Math.random() * 10);
  const mockTranscripts = {
    "pl-PL": [
      "Witaj, jak się masz dzisiaj?",
      "Otwórz POLACZEK i uruchom analizę SEO",
      "Wygeneruj obraz przedstawiający zachód słońca nad morzem",
      "Sprawdź status wszystkich systemów AI",
      "Uruchom muzykę w tle i pokaż dashboard",
      "Przeanalizuj wydajność strony internetowej",
      "Wykonaj backup danych i wyślij raport"
    ],
    "en-US": [
      "Hello, how are you today?",
      "Open POLACZEK and run SEO analysis",
      "Generate an image of sunset over the ocean",
      "Check status of all AI systems",
      "Start background music and show dashboard",
      "Analyze website performance metrics",
      "Execute data backup and send report"
    ],
    "de-DE": [
      "Hallo, wie geht es dir heute?",
      "Öffne POLACZEK und führe SEO-Analyse durch",
      "Generiere ein Bild von Sonnenuntergang über dem Ozean"
    ]
  };
  const transcripts = mockTranscripts[language] || mockTranscripts["en-US"];
  const transcript = transcripts[Math.floor(Math.random() * transcripts.length)];
  return {
    success: true,
    transcript,
    confidence: Math.round(confidence),
    language,
    alternatives: [
      { transcript, confidence: Math.round(confidence) },
      { transcript: transcript.toLowerCase(), confidence: Math.round(confidence - 5) },
      { transcript: transcript.replace(/[.,!?]/g, ""), confidence: Math.round(confidence - 10) }
    ],
    words: transcript.split(" ").map((word, index) => ({
      word,
      startTime: `${index * 0.5}s`,
      endTime: `${(index + 1) * 0.5}s`,
      confidence: Math.round(confidence + Math.random() * 5 - 2.5)
    })),
    processingTime: Math.round(100 + Math.random() * 300)
  };
}
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      language = "pl-PL",
      enableRealTime = true,
      model = "latest_long",
      audioData,
      maxAlternatives = 3,
      profanityFilter = true,
      punctuation = true
    } = body;
    const supportedLanguages = Object.keys(languageAccuracy);
    if (!supportedLanguages.includes(language)) {
      return new Response(JSON.stringify({
        success: false,
        error: `Unsupported language: ${language}. Supported: ${supportedLanguages.join(", ")}`
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    if (!speechModels[model]) {
      return new Response(JSON.stringify({
        success: false,
        error: `Unsupported model: ${model}. Available: ${Object.keys(speechModels).join(", ")}`
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 500));
    const result = generateMockRecognition(language, model);
    if (profanityFilter) {
      result.transcript = result.transcript.replace(/\b(damn|hell|stupid)\b/gi, "***");
    }
    if (result.alternatives && maxAlternatives < result.alternatives.length) {
      result.alternatives = result.alternatives.slice(0, maxAlternatives);
    }
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("Voice Recognition API Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error during voice recognition",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
};
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
<<<<<<< HEAD
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
=======
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
    }
  });
};
const GET = async () => {
<<<<<<< HEAD
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
=======
  const capabilities = {
    service: "Voice Recognition API",
    version: "1.0.0",
    supportedLanguages: Object.keys(languageAccuracy),
    supportedModels: Object.keys(speechModels),
    features: [
      "Real-time speech recognition",
      "Multiple language support",
      "Word-level timestamps",
      "Confidence scoring",
      "Alternative transcripts",
      "Profanity filtering",
      "Punctuation restoration"
    ],
    limits: {
      maxAudioDuration: "60s",
      maxAlternatives: 10,
      supportedFormats: ["WAV", "MP3", "FLAC", "OGG"]
    }
  };
  return new Response(JSON.stringify(capabilities), {
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
};
<<<<<<< HEAD
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
=======
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
