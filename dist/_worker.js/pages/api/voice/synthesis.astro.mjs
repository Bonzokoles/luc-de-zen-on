if (typeof MessageChannel === 'undefined') {
  class __PolyfillPort {
    constructor(){ this.onmessage = null; }
    postMessage(data){ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> this.onmessage && this.onmessage(e)); }
    start(){} close(){}
  }
  class MessageChannel {
    constructor(){
      this.port1 = new __PolyfillPort();
      this.port2 = new __PolyfillPort();
      const dispatch = (target, data)=>{ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> target.onmessage && target.onmessage(e)); };
      this.port1.postMessage = (d)=> dispatch(this.port2, d);
      this.port2.postMessage = (d)=> dispatch(this.port1, d);
    }
  }
  globalThis.MessageChannel = MessageChannel;
}
export { r as renderers } from '../../../chunks/_@astro-renderers_CHiEcNgA.mjs';

const availableVoices = {
  "pl-PL": [
    { id: "pl-zofia", name: "Zofia", gender: "female", naturalness: 95, premium: true },
    { id: "pl-marek", name: "Marek", gender: "male", naturalness: 92, premium: true },
    { id: "pl-ewa", name: "Ewa", gender: "female", naturalness: 88 },
    { id: "pl-adam", name: "Adam", gender: "male", naturalness: 85 }
  ],
  "en-US": [
    { id: "en-sarah", name: "Sarah", gender: "female", naturalness: 98, premium: true },
    { id: "en-michael", name: "Michael", gender: "male", naturalness: 97, premium: true },
    { id: "en-emma", name: "Emma", gender: "female", naturalness: 94 },
    { id: "en-david", name: "David", gender: "male", naturalness: 92 }
  ],
  "en-GB": [
    { id: "gb-olivia", name: "Olivia", gender: "female", naturalness: 96, premium: true },
    { id: "gb-james", name: "James", gender: "male", naturalness: 94, premium: true }
  ],
  "de-DE": [
    { id: "de-anna", name: "Anna", gender: "female", naturalness: 93, premium: true },
    { id: "de-klaus", name: "Klaus", gender: "male", naturalness: 91 }
  ],
  "es-ES": [
    { id: "es-sofia", name: "Sofía", gender: "female", naturalness: 92 },
    { id: "es-carlos", name: "Carlos", gender: "male", naturalness: 89 }
  ],
  "fr-FR": [
    { id: "fr-marie", name: "Marie", gender: "female", naturalness: 91 },
    { id: "fr-pierre", name: "Pierre", gender: "male", naturalness: 88 }
  ]
};
const emotionalPatterns = {
  neutral: { speed: 1, pitch: 1, emphasis: "normal" },
  friendly: { speed: 1.1, pitch: 1.05, emphasis: "warm" },
  professional: { speed: 0.95, pitch: 0.98, emphasis: "clear" },
  excited: { speed: 1.2, pitch: 1.15, emphasis: "energetic" },
  calm: { speed: 0.9, pitch: 0.95, emphasis: "soothing" }
};
function generateSynthesisResult(text, language, voiceId, settings) {
  const languageVoices = availableVoices[language] || availableVoices["en-US"];
  const selectedVoice = languageVoices.find((v) => v.id === voiceId) || languageVoices[0];
  const emotionalTone = settings.emotionalTone || "neutral";
  const emotionalAdjustments = emotionalPatterns[emotionalTone];
  const finalSpeed = (settings.speed || 1) * emotionalAdjustments.speed;
  const finalPitch = (settings.pitch || 1) * emotionalAdjustments.pitch;
  const finalVolume = settings.volume || 1;
  const wordCount = text.trim().split(/\s+/).length;
  const baseWPM = 150;
  const adjustedWPM = baseWPM * finalSpeed;
  const estimatedDuration = Math.round(wordCount / adjustedWPM * 60 * 1e3);
  const quality = settings.quality || "medium";
  const qualityMultiplier = { low: 0.5, medium: 1, high: 1.5, premium: 2 }[quality];
  const processingTime = Math.round(text.length * qualityMultiplier + Math.random() * 200);
  const audioUrl = `https://voice-api.mybonzo.com/audio/${Date.now()}_${selectedVoice.id}.${settings.format || "mp3"}`;
  return {
    success: true,
    audioUrl,
    audioData: generateMockAudioData(text.length),
    duration: estimatedDuration,
    voice: {
      name: selectedVoice.name,
      language,
      gender: selectedVoice.gender,
      naturalness: selectedVoice.naturalness
    },
    settings: {
      speed: Math.round(finalSpeed * 100) / 100,
      pitch: Math.round(finalPitch * 100) / 100,
      volume: Math.round(finalVolume * 100) / 100
    },
    processingTime
  };
}
function generateMockAudioData(textLength) {
  const dataLength = Math.min(textLength * 100, 1e4);
  const mockData = Array.from(
    { length: dataLength },
    () => Math.random().toString(36).charAt(0)
  ).join("");
  return Buffer.from(mockData).toString("base64").substring(0, 200) + "...";
}
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      text,
      language = "pl-PL",
      voice,
      speed = 1,
      pitch = 1,
      volume = 1,
      format = "mp3",
      ssml = false,
      emotionalTone = "neutral",
      quality = "medium"
    } = body;
    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Text field is required and cannot be empty"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (text.length > 5e3) {
      return new Response(JSON.stringify({
        success: false,
        error: "Text too long. Maximum 5000 characters allowed"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (!availableVoices[language]) {
      return new Response(JSON.stringify({
        success: false,
        error: `Unsupported language: ${language}. Supported: ${Object.keys(availableVoices).join(", ")}`
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const languageVoices = availableVoices[language];
    const selectedVoiceId = voice || languageVoices[0].id;
    if (voice && !languageVoices.find((v) => v.id === voice)) {
      return new Response(JSON.stringify({
        success: false,
        error: `Voice '${voice}' not available for language '${language}'. Available: ${languageVoices.map((v) => v.id).join(", ")}`
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (speed < 0.1 || speed > 3) {
      return new Response(JSON.stringify({
        success: false,
        error: "Speed must be between 0.1 and 3.0"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (pitch < 0.1 || pitch > 2) {
      return new Response(JSON.stringify({
        success: false,
        error: "Pitch must be between 0.1 and 2.0"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700));
    const result = generateSynthesisResult(text, language, selectedVoiceId, {
      speed,
      pitch,
      volume,
      format,
      emotionalTone,
      quality
    });
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
    console.error("Voice Synthesis API Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error during voice synthesis",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};
const GET = async () => {
  const capabilities = {
    service: "Voice Synthesis API",
    version: "1.0.0",
    supportedLanguages: Object.keys(availableVoices),
    supportedFormats: ["mp3", "wav", "ogg"],
    voices: availableVoices,
    emotionalTones: Object.keys(emotionalPatterns),
    qualityLevels: ["low", "medium", "high", "premium"],
    features: [
      "Multiple voice selection",
      "Emotional tone adjustment",
      "Speed and pitch control",
      "SSML support",
      "Premium voice options",
      "Multiple audio formats"
    ],
    limits: {
      maxTextLength: 5e3,
      speedRange: [0.1, 3],
      pitchRange: [0.1, 2],
      volumeRange: [0, 1]
    }
  };
  return new Response(JSON.stringify(capabilities), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
