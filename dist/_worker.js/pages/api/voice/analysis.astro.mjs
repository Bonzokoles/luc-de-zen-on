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
export { d as renderers } from '../../../chunks/vendor_DlPT8CWO.mjs';

const emotionPatterns = [
  "happiness",
  "sadness",
  "anger",
  "fear",
  "surprise",
  "neutral",
  "excitement",
  "calm",
  "frustrated",
  "confident",
  "uncertain"
];
const qualityIssues = [
  "Background noise detected",
  "Low volume levels",
  "Audio compression artifacts",
  "Inconsistent speech rate",
  "Echo or reverb present"
];
const qualityRecommendations = [
  "Use noise-canceling microphone",
  "Record in quieter environment",
  "Adjust microphone distance",
  "Improve room acoustics",
  "Use higher quality audio format"
];
function generateMockTranscription(language, duration) {
  const transcriptions = {
    "pl-PL": [
      "Witaj w systemie POLACZEK. Dzisiaj będziemy analizować wydajność strony internetowej.",
      "Uruchomienie analizy SEO pokazuje, że strona ma dobry potencjał optymalizacji.",
      "System AI wykrył kilka obszarów wymagających poprawy w strukturze treści.",
      "Generowanie raportu zostało zakończone pomyślnie. Wszystkie dane są aktualne.",
      "Proszę sprawdzić wyniki analizy i zastosować zalecane optymalizacje."
    ],
    "en-US": [
      "Welcome to the POLACZEK system. Today we will analyze website performance.",
      "Running SEO analysis shows that the page has good optimization potential.",
      "The AI system detected several areas requiring improvement in content structure.",
      "Report generation was completed successfully. All data is up to date.",
      "Please review the analysis results and apply recommended optimizations."
    ],
    "de-DE": [
      "Willkommen im POLACZEK-System. Heute werden wir die Website-Performance analysieren.",
      "Die SEO-Analyse zeigt, dass die Seite gutes Optimierungspotenzial hat.",
      "Das KI-System erkannte mehrere Bereiche, die Verbesserungen in der Inhaltsstruktur erfordern."
    ]
  };
  const texts = transcriptions[language] || transcriptions["en-US"];
  const selectedText = texts[Math.floor(Math.random() * texts.length)];
  const words = selectedText.split(" ");
  const wordsWithTiming = words.map((word, index) => {
    const startTime = duration / words.length * index;
    const endTime = duration / words.length * (index + 1);
    return {
      word: word.replace(/[.,!?]/g, ""),
      startTime: Math.round(startTime * 1e3) / 1e3,
      endTime: Math.round(endTime * 1e3) / 1e3,
      confidence: 85 + Math.random() * 10
    };
  });
  return {
    text: selectedText,
    confidence: 88 + Math.random() * 10,
    language,
    words: wordsWithTiming
  };
}
function generateMockEmotion(duration) {
  const primaryEmotion = emotionPatterns[Math.floor(Math.random() * emotionPatterns.length)];
  const confidence = 70 + Math.random() * 25;
  const segments = Math.ceil(duration / 5);
  const timeline = Array.from({ length: segments }, (_, index) => ({
    emotion: emotionPatterns[Math.floor(Math.random() * emotionPatterns.length)],
    confidence: 60 + Math.random() * 30,
    startTime: index * 5,
    endTime: (index + 1) * 5
  }));
  const emotions = ["happiness", "sadness", "anger", "fear", "surprise", "neutral"];
  const emotionScores = {};
  let remaining = 100;
  emotions.forEach((emotion, index) => {
    if (index === emotions.length - 1) {
      emotionScores[emotion] = remaining;
    } else {
      const score = Math.random() * remaining * 0.4;
      emotionScores[emotion] = Math.round(score);
      remaining -= score;
    }
  });
  return {
    overall: primaryEmotion,
    confidence: Math.round(confidence),
    timeline,
    details: emotionScores
  };
}
function generateMockQuality() {
  const score = 60 + Math.random() * 35;
  const overallQuality = score > 85 ? "excellent" : score > 70 ? "good" : score > 55 ? "fair" : "poor";
  const metrics = {
    clarity: Math.round(60 + Math.random() * 35),
    noiseLevel: Math.round(Math.random() * 30),
    // Lower is better
    volume: Math.round(70 + Math.random() * 25),
    speechRate: Math.round(80 + Math.random() * 20),
    pronunciation: Math.round(75 + Math.random() * 20)
  };
  const issues = [];
  if (metrics.noiseLevel > 20) issues.push(qualityIssues[0]);
  if (metrics.volume < 80) issues.push(qualityIssues[1]);
  if (metrics.clarity < 70) issues.push(qualityIssues[2]);
  const recommendations = issues.length > 0 ? qualityRecommendations.slice(0, issues.length) : ["Audio quality is good, no major improvements needed"];
  return {
    overall: overallQuality,
    score: Math.round(score),
    metrics,
    issues,
    recommendations
  };
}
function generateMockAudioInfo() {
  const duration = 15 + Math.random() * 45;
  const formats = ["mp3", "wav", "ogg", "flac"];
  const format = formats[Math.floor(Math.random() * formats.length)];
  return {
    duration: Math.round(duration * 100) / 100,
    format,
    sampleRate: Math.random() > 0.5 ? 44100 : 48e3,
    channels: Math.random() > 0.7 ? 2 : 1,
    bitrate: format === "mp3" ? 128 + Math.floor(Math.random() * 192) : null,
    fileSize: Math.round(duration * (format === "wav" ? 176.4 : 16) * 1024)
    // bytes
  };
}
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      audioData,
      audioUrl,
      analysisType = "all",
      language = "pl-PL",
      enableSpeakerDetection = false,
      enableEmotionDetection = true,
      enableNoiseReduction = false,
      outputFormat = "detailed"
    } = body;
    if (!audioData && !audioUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: "Either audioData or audioUrl is required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const validTypes = ["transcription", "emotion", "quality", "all"];
    if (!validTypes.includes(analysisType)) {
      return new Response(JSON.stringify({
        success: false,
        error: `Invalid analysis type. Supported: ${validTypes.join(", ")}`
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const processingTime = 500 + Math.random() * 2e3;
    await new Promise((resolve) => setTimeout(resolve, Math.min(processingTime, 1e3)));
    const audioInfo = generateMockAudioInfo();
    const analysis = {};
    if (analysisType === "transcription" || analysisType === "all") {
      analysis.transcription = generateMockTranscription(language, audioInfo.duration);
      if (enableSpeakerDetection) {
        analysis.transcription.speakers = [
          {
            id: "speaker1",
            name: "Speaker 1",
            segments: [
              {
                text: analysis.transcription.text.substring(0, Math.floor(analysis.transcription.text.length / 2)),
                startTime: 0,
                endTime: audioInfo.duration / 2,
                confidence: 85 + Math.random() * 10
              }
            ]
          },
          {
            id: "speaker2",
            name: "Speaker 2",
            segments: [
              {
                text: analysis.transcription.text.substring(Math.floor(analysis.transcription.text.length / 2)),
                startTime: audioInfo.duration / 2,
                endTime: audioInfo.duration,
                confidence: 80 + Math.random() * 15
              }
            ]
          }
        ];
      }
    }
    if ((analysisType === "emotion" || analysisType === "all") && enableEmotionDetection) {
      analysis.emotion = generateMockEmotion(audioInfo.duration);
    }
    if (analysisType === "quality" || analysisType === "all") {
      analysis.quality = generateMockQuality();
    }
    analysis.audio = audioInfo;
    if (outputFormat === "summary") {
      if (analysis.transcription) {
        analysis.transcription = {
          text: analysis.transcription.text,
          confidence: analysis.transcription.confidence,
          language: analysis.transcription.language
        };
      }
      if (analysis.emotion) {
        analysis.emotion = {
          overall: analysis.emotion.overall,
          confidence: analysis.emotion.confidence
        };
      }
      if (analysis.quality) {
        analysis.quality = {
          overall: analysis.quality.overall,
          score: analysis.quality.score
        };
      }
    }
    const response = {
      success: true,
      analysis,
      processingTime: Math.round(processingTime)
    };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("Audio Analysis API Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error during audio analysis",
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
    service: "Audio Analysis API",
    version: "1.0.0",
    supportedFormats: ["mp3", "wav", "ogg", "flac", "webm"],
    analysisTypes: ["transcription", "emotion", "quality", "all"],
    supportedLanguages: ["pl-PL", "en-US", "en-GB", "de-DE", "es-ES", "fr-FR"],
    features: [
      "Speech-to-text transcription",
      "Emotion detection",
      "Audio quality analysis",
      "Speaker identification",
      "Noise reduction",
      "Word-level timing",
      "Quality recommendations"
    ],
    emotions: emotionPatterns,
    limits: {
      maxFileSize: "50MB",
      maxDuration: "300s",
      supportedSampleRates: [16e3, 22050, 44100, 48e3],
      outputFormats: ["detailed", "summary"]
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
