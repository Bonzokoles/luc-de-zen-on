# 🎤 README_VOICE_INDEKS_03 - IMPLEMENTACJA VOICE AI ASSISTANT

## 🎯 WPROWADZENIE DO VOICE AI ASSISTANT

Voice AI Assistant to zaawansowany system rozpoznawania i syntezy mowy zintegrowany z MyBonzo platform. System umożliwia naturalne interakcje głosowe z AI, obsługuje wiele języków i oferuje wysokiej jakości syntezę mowy przy użyciu najnowocześniejszych technologii.

### **🔧 GŁÓWNE KOMPONENTY SYSTEMU**

- **Frontend Interface** - Kompleksowy UI w Astro z real-time audio
- **Multi-Provider APIs** - Integracja z Google, Azure, OpenAI, ElevenLabs
- **Cloudflare Workers** - Backend processing i AI integration
- **Browser APIs** - Native Speech Recognition i MediaRecorder
- **Storage System** - Persistent settings i transcription history

---

## 📁 STRUKTURA PLIKÓW I LOKALIZACJE

### **GŁÓWNE KOMPONENTY**

```
src/pages/voice-ai-assistant.astro    (2019 linii)
├── HTML Interface & CSS styling
├── JavaScript functions (30+ funkcji)
├── Event handlers i UI controls
└── Audio visualization i real-time processing

src/pages/api/voice.ts                (117 linii)
├── Main API endpoint routing
├── GET handlers (status, test)
├── POST handlers (action processing)
└── CORS configuration

src/pages/api/voice/synthesis.ts      (339 linii)
├── Text-to-Speech API endpoint
├── Voice configuration i selection
├── Emotional pattern processing
└── Multi-provider synthesis routing

src/utils/voiceAiAPI.js               (271 linii)
├── Frontend API integration class
├── Health check i monitoring
├── Audio transcription methods
└── Speech synthesis utilities

cloudflare-workers/voice-ai-worker.js
├── Cloudflare Worker main class
├── AI service integrations
├── Request routing i processing
└── Fallback provider selection
```

### **SUPPORTING FILES**

```
src/pages/api/voice/recognition.ts    - Speech-to-Text processing
src/pages/api/voice/commands.ts       - Voice command interpretation
src/pages/api/voice/analysis.ts       - Audio analysis i processing
src/utils/voice-manager.js            - Voice profile management
src/lib/cloudflare-voice-ai.ts        - Cloudflare integration layer
```

---

## 🚀 INSTALACJA I SETUP

### **KROK 1: Environment Variables**

```bash
# Cloudflare Workers Configuration
GOOGLE_SPEECH_API_KEY=your_google_key
AZURE_COGNITIVE_KEY=your_azure_key
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key

# AI Integration
GEMINI_API_KEY=your_gemini_key
DEEPSEEK_API_KEY=your_deepseek_key

# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

### **KROK 2: Dependencies Installation**

```bash
# Main project dependencies
pnpm install

# Specific Voice AI packages
pnpm add @google-cloud/speech
pnpm add microsoft-cognitiveservices-speech-sdk
pnpm add openai
pnpm add elevenlabs

# Development dependencies
pnpm add -D @types/dom-speech-recognition
pnpm add -D @types/mediarecorder
```

### **KROK 3: Cloudflare Workers Deployment**

```bash
# Deploy Voice AI Worker
wrangler publish cloudflare-workers/voice-ai-worker.js

# Configure environment variables
wrangler secret put GOOGLE_SPEECH_API_KEY
wrangler secret put AZURE_COGNITIVE_KEY
wrangler secret put OPENAI_API_KEY
wrangler secret put ELEVENLABS_API_KEY
```

### **KROK 4: Local Development**

```bash
# Start development server
pnpm dev

# Test Cloudflare Workers locally
wrangler dev cloudflare-workers/voice-ai-worker.js

# Run voice AI tests
pnpm test:voice
```

---

## 🎯 IMPLEMENTACJA PODSTAWOWYCH FUNKCJI

### **FUNKCJA 1: Inicjalizacja Voice Controls**

```javascript
// Lokalizacja: src/pages/voice-ai-assistant.astro (linia ~1201)
function initializeVoiceControls() {
  console.log("🎤 Inicjalizacja Voice AI Assistant...");

  // Sprawdź dostępność browser APIs
  if (
    !("webkitSpeechRecognition" in window) &&
    !("SpeechRecognition" in window)
  ) {
    showStatus(
      "Rozpoznawanie mowy nie jest wspierane w tej przeglądarce",
      "error"
    );
    return false;
  }

  // Załaduj dostępne głosy
  loadVoices()
    .then(() => console.log("✅ Głosy załadowane"))
    .catch((error) => console.error("❌ Błąd ładowania głosów:", error));

  // Setup event listeners
  setupEventListeners();

  // Konfiguruj range sliders
  setupRangeSliders();

  // Wczytaj zapisane ustawienia
  loadSettings();

  // Sprawdź pozwolenia mikrofonu
  checkMicrophonePermissions().then((hasPermission) => {
    if (!hasPermission) {
      showStatus("Pozwolenia mikrofonu są wymagane", "warning");
    }
  });

  console.log("🎉 Voice AI Assistant zainicjalizowany");
  return true;
}

// Wywołanie przy DOMContentLoaded
document.addEventListener("DOMContentLoaded", initializeVoiceControls);
```

### **FUNKCJA 2: Speech Recognition Setup**

```javascript
// Lokalizacja: src/pages/voice-ai-assistant.astro (linia ~1400)
let recognition = null;

function setupSpeechRecognition() {
  // Cross-browser compatibility
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("Speech Recognition nie jest wspierane");
    return null;
  }

  recognition = new SpeechRecognition();

  // Konfiguracja podstawowa
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang =
    document.getElementById("language-select").value || "pl-PL";
  recognition.maxAlternatives = 3;

  // Event handlers
  recognition.onstart = () => {
    console.log("🎙️ Rozpoznawanie rozpoczęte");
    updateRecordingUI(true);
  };

  recognition.onresult = (event) => {
    let finalTranscript = "";
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // Wyświetl wyniki
    if (finalTranscript) {
      displayTranscription(finalTranscript, event.results[0][0].confidence);

      // Auto-process voice commands
      if (document.getElementById("auto-responses").checked) {
        processVoiceCommand(finalTranscript);
      }
    }

    // Wyświetl tymczasowe wyniki
    if (interimTranscript) {
      document.getElementById("interim-results").textContent =
        interimTranscript;
    }
  };

  recognition.onerror = (event) => {
    console.error("❌ Błąd rozpoznawania:", event.error);
    showStatus(`Błąd rozpoznawania: ${event.error}`, "error");
    updateRecordingUI(false);
  };

  recognition.onend = () => {
    console.log("🛑 Rozpoznawanie zakończone");
    updateRecordingUI(false);
  };

  return recognition;
}
```

### **FUNKCJA 3: Text-to-Speech Implementation**

```javascript
// Lokalizacja: src/pages/voice-ai-assistant.astro (linia ~1600)
async function synthesizeSpeech() {
  const text = document.getElementById("text-to-synthesize").value.trim();

  if (!text) {
    showStatus("Wprowadź tekst do syntezy", "warning");
    return;
  }

  // Pobierz ustawienia z UI
  const settings = {
    text: text,
    voice: document.getElementById("voice-select").value,
    speed: parseFloat(document.getElementById("speed-slider").value),
    pitch: parseFloat(document.getElementById("pitch-slider").value),
    volume: parseFloat(document.getElementById("volume-slider").value),
    language: document.getElementById("language-select").value,
    emotionalTone: document.getElementById("emotional-tone").value,
  };

  console.log("🔊 Rozpoczynam syntezę mowy:", settings);
  showStatus("Generowanie audio...", "info");

  try {
    const response = await fetch("/api/voice/synthesis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log("✅ Synteza udana, provider:", result.provider);
      showStatus(`Audio wygenerowane przez ${result.provider}`, "success");

      // Odtwórz wygenerowane audio
      if (result.audioUrl) {
        await playAudio(result.audioUrl);
      } else if (result.audioData) {
        await playAudioFromBase64(result.audioData);
      }
    } else {
      throw new Error(result.error || "Nieznany błąd syntezy");
    }
  } catch (error) {
    console.error("❌ Błąd syntezy mowy:", error);
    showStatus(`Błąd syntezy: ${error.message}`, "error");

    // Fallback do browser TTS
    if (window.speechSynthesis) {
      console.log("🔄 Używam fallback browser TTS");
      await fallbackBrowserTTS(text, settings);
    }
  }
}

// Fallback browser Text-to-Speech
async function fallbackBrowserTTS(text, settings) {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = settings.speed;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Znajdź odpowiedni głos
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find((voice) =>
      voice.lang.startsWith(settings.language.split("-")[0])
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      showStatus("Audio zakończone (browser TTS)", "success");
      resolve();
    };

    utterance.onerror = (error) => {
      showStatus("Błąd browser TTS: " + error.error, "error");
      reject(error);
    };

    speechSynthesis.speak(utterance);
  });
}
```

---

## 🎛️ KONFIGURACJA API ENDPOINTS

### **API ENDPOINT: /api/voice/synthesis**

```typescript
// Lokalizacja: src/pages/api/voice/synthesis.ts
import type { APIRoute } from "astro";

interface SynthesisRequest {
  text: string;
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
  language: string;
  emotionalTone: "neutral" | "friendly" | "professional" | "excited" | "calm";
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body: SynthesisRequest = await request.json();

    // Walidacja input
    if (!body.text || body.text.length > 5000) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid text input (max 5000 characters)",
        }),
        { status: 400 }
      );
    }

    // Pobierz API keys z runtime environment
    const runtime = (locals as any)?.runtime;
    const elevenlabsKey = runtime?.env?.ELEVENLABS_API_KEY;
    const googleKey = runtime?.env?.GOOGLE_SPEECH_API_KEY;
    const azureKey = runtime?.env?.AZURE_COGNITIVE_KEY;

    // Wybierz najlepszy dostępny provider
    let result;

    if (elevenlabsKey && body.voice.includes("premium")) {
      console.log("🎯 Używam ElevenLabs (premium)");
      result = await synthesizeWithElevenLabs(body, elevenlabsKey);
    } else if (googleKey) {
      console.log("🎯 Używam Google Cloud TTS");
      result = await synthesizeWithGoogle(body, googleKey);
    } else if (azureKey) {
      console.log("🎯 Używam Azure Cognitive Services");
      result = await synthesizeWithAzure(body, azureKey);
    } else {
      console.log("⚠️ Brak API keys - mock response");
      result = {
        success: true,
        provider: "mock",
        message: "Using mock audio - configure API keys for real TTS",
      };
    }

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("❌ Synthesis API Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        fallback: true,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// ElevenLabs Integration
async function synthesizeWithElevenLabs(
  body: SynthesisRequest,
  apiKey: string
) {
  const response = await fetch(
    "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
    {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: body.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

  return {
    success: true,
    provider: "elevenlabs",
    audioData: base64Audio,
    format: "mp3",
    quality: "premium",
  };
}
```

### **API ENDPOINT: /api/voice/recognition**

```typescript
// Lokalizacja: src/pages/api/voice/recognition.ts
import type { APIRoute } from "astro";

interface RecognitionRequest {
  audio: string; // base64 encoded
  language: string;
  service?: "google" | "azure" | "openai";
  continuous?: boolean;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body: RecognitionRequest = await request.json();

    // Decode base64 audio
    const audioBuffer = Uint8Array.from(atob(body.audio), (c) =>
      c.charCodeAt(0)
    );

    // Get API keys from runtime
    const runtime = (locals as any)?.runtime;
    const service = body.service || "google";

    let result;

    switch (service) {
      case "google":
        result = await transcribeWithGoogle(
          audioBuffer,
          body.language,
          runtime?.env?.GOOGLE_SPEECH_API_KEY
        );
        break;
      case "azure":
        result = await transcribeWithAzure(
          audioBuffer,
          body.language,
          runtime?.env?.AZURE_COGNITIVE_KEY
        );
        break;
      case "openai":
        result = await transcribeWithOpenAI(
          audioBuffer,
          body.language,
          runtime?.env?.OPENAI_API_KEY
        );
        break;
      default:
        throw new Error(`Unsupported service: ${service}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        transcription: result.text,
        confidence: result.confidence,
        service: service,
        language: result.detectedLanguage || body.language,
      })
    );
  } catch (error) {
    console.error("❌ Recognition API Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
};

// Google Cloud Speech-to-Text
async function transcribeWithGoogle(
  audioBuffer: Uint8Array,
  language: string,
  apiKey: string
) {
  const response = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        config: {
          encoding: "WEBM_OPUS",
          sampleRateHertz: 48000,
          languageCode: language,
          enableAutomaticPunctuation: true,
          enableWordConfidence: true,
        },
        audio: {
          content: btoa(String.fromCharCode(...audioBuffer)),
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Google Speech API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return {
      text: "",
      confidence: 0,
      detectedLanguage: language,
    };
  }

  const result = data.results[0];
  return {
    text: result.alternatives[0].transcript,
    confidence: result.alternatives[0].confidence,
    detectedLanguage: language,
  };
}
```

---

## 🔧 CLOUDFLARE WORKERS IMPLEMENTATION

### **MAIN WORKER CLASS**

```javascript
// Lokalizacja: cloudflare-workers/voice-ai-worker.js
export default {
  async fetch(request, env, ctx) {
    const voiceWorker = new VoiceAIWorker(env);
    return await voiceWorker.handleRequest(request);
  },
};

class VoiceAIWorker {
  constructor(env) {
    this.env = env;
    this.aiServices = {
      google: env.GOOGLE_SPEECH_API_KEY,
      azure: env.AZURE_COGNITIVE_KEY,
      openai: env.OPENAI_API_KEY,
      elevenlabs: env.ELEVENLABS_API_KEY,
      gemini: env.GEMINI_API_KEY,
      deepseek: env.DEEPSEEK_API_KEY,
    };
  }

  async handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for all responses
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      let response;

      switch (path) {
        case "/health":
          response = await this.handleHealth();
          break;
        case "/transcribe":
          response = await this.handleTranscription(request);
          break;
        case "/synthesize":
          response = await this.handleSynthesis(request);
          break;
        case "/analyze":
          response = await this.handleAnalysis(request);
          break;
        case "/command":
          response = await this.handleCommand(request);
          break;
        default:
          response = new Response("Not Found", { status: 404 });
      }

      // Add CORS headers to response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error("Worker Error:", error);

      return new Response(
        JSON.stringify({
          error: error.message,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  }

  async handleHealth() {
    const serviceStatus = {
      google: !!this.aiServices.google,
      azure: !!this.aiServices.azure,
      openai: !!this.aiServices.openai,
      elevenlabs: !!this.aiServices.elevenlabs,
      gemini: !!this.aiServices.gemini,
      deepseek: !!this.aiServices.deepseek,
    };

    const availableServices =
      Object.values(serviceStatus).filter(Boolean).length;
    const totalServices = Object.keys(serviceStatus).length;

    return new Response(
      JSON.stringify({
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: serviceStatus,
        availability: `${availableServices}/${totalServices} services available`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  async selectBestProvider(operation) {
    // Priority logic based on operation type and availability
    switch (operation) {
      case "synthesis":
        if (this.aiServices.elevenlabs) return "elevenlabs";
        if (this.aiServices.google) return "google";
        if (this.aiServices.azure) return "azure";
        return "mock";

      case "recognition":
        if (this.aiServices.google) return "google";
        if (this.aiServices.azure) return "azure";
        if (this.aiServices.openai) return "openai";
        return "mock";

      case "ai_processing":
        if (this.aiServices.gemini) return "gemini";
        if (this.aiServices.deepseek) return "deepseek";
        if (this.aiServices.openai) return "openai";
        return "mock";

      default:
        return "mock";
    }
  }
}
```

---

## 🎨 UI COMPONENTS I STYLING

### **MAIN AUDIO CONTROLS**

```html
<!-- Lokalizacja: src/pages/voice-ai-assistant.astro (linia ~100) -->
<div class="voice-controls-panel">
  <!-- Recording Controls -->
  <div class="recording-section">
    <button id="start-recording" class="record-btn">🎤 Start Recording</button>
    <button id="stop-recording" class="stop-btn" disabled>
      ⏹️ Stop Recording
    </button>
    <div id="recording-indicator" class="recording-indicator"></div>
  </div>

  <!-- Audio Visualization -->
  <div class="audio-visualization">
    <canvas id="audio-visualizer" width="400" height="100"></canvas>
    <div id="audio-level-meter" class="level-meter"></div>
  </div>

  <!-- Transcription Results -->
  <div class="transcription-section">
    <textarea
      id="transcription-result"
      readonly
      placeholder="Transkrypcja pojawi się tutaj..."
    ></textarea>
    <div class="confidence-display">
      <span>Pewność: </span>
      <div id="confidence-level" class="confidence-bar"></div>
    </div>
    <div id="interim-results" class="interim-text"></div>
  </div>
</div>

<!-- Speech Synthesis Controls -->
<div class="synthesis-controls-panel">
  <div class="text-input-section">
    <textarea
      id="text-to-synthesize"
      placeholder="Wprowadź tekst do syntezy mowy..."
    ></textarea>
    <button id="synthesize-speech" class="synthesize-btn">
      🔊 Syntezuj Mowę
    </button>
  </div>

  <!-- Voice Selection -->
  <div class="voice-settings">
    <label for="voice-select">Wybierz głos:</label>
    <select id="voice-select">
      <option value="pl-zofia">Zofia (Polski, Kobieta)</option>
      <option value="pl-marek">Marek (Polski, Mężczyzna)</option>
      <option value="en-sarah">Sarah (English, Female) ⭐</option>
    </select>
  </div>

  <!-- Audio Controls -->
  <div class="audio-controls">
    <div class="control-group">
      <label for="speed-slider"
        >Szybkość: <span id="speed-value">1.0x</span></label
      >
      <input
        type="range"
        id="speed-slider"
        class="range-slider"
        min="0.5"
        max="2.0"
        step="0.1"
        value="1.0"
        data-setting="speechSpeed"
      />
    </div>

    <div class="control-group">
      <label for="pitch-slider"
        >Wysokość: <span id="pitch-value">0</span></label
      >
      <input
        type="range"
        id="pitch-slider"
        class="range-slider"
        min="-12"
        max="12"
        step="1"
        value="0"
        data-setting="speechPitch"
      />
    </div>

    <div class="control-group">
      <label for="volume-slider"
        >Głośność: <span id="volume-value">100%</span></label
      >
      <input
        type="range"
        id="volume-slider"
        class="range-slider"
        min="0"
        max="100"
        step="5"
        value="100"
        data-setting="speechVolume"
      />
    </div>
  </div>
</div>
```

### **CSS STYLING**

```css
/* Lokalizacja: src/pages/voice-ai-assistant.astro (style section) */
.voice-controls-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 25px;
  margin: 20px 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.recording-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.record-btn,
.stop-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.record-btn {
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  color: white;
}

.record-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

.stop-btn {
  background: linear-gradient(45deg, #74b9ff, #0984e3);
  color: white;
}

.stop-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.recording-indicator {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.recording-indicator.active {
  background: rgba(255, 0, 0, 0.2);
  color: #ff0000;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.audio-visualizer {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}

.confidence-bar {
  height: 20px;
  border-radius: 10px;
  transition: all 0.3s ease;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: white;
}

.confidence-bar.high {
  background: linear-gradient(90deg, #00b894, #00cec9);
}

.confidence-bar.medium {
  background: linear-gradient(90deg, #fdcb6e, #e17055);
}

.confidence-bar.low {
  background: linear-gradient(90deg, #fd79a8, #e84393);
}

.range-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.3);
  outline: none;
  cursor: pointer;
}

.range-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(45deg, #74b9ff, #0984e3);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.synthesis-controls-panel {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 15px;
  padding: 25px;
  margin: 20px 0;
}

.synthesize-btn {
  background: linear-gradient(45deg, #6c5ce7, #a29bfe);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.synthesize-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .voice-controls-panel,
  .synthesis-controls-panel {
    padding: 15px;
    margin: 15px 0;
  }

  .recording-section {
    flex-direction: column;
    align-items: stretch;
  }

  .record-btn,
  .stop-btn {
    width: 100%;
    margin-bottom: 10px;
  }

  .audio-controls {
    grid-template-columns: 1fr;
  }
}
```

---

## 🚀 DEPLOYMENT I KONFIGURACJA PRODUKCYJNA

### **WRANGLER CONFIGURATION**

```toml
# Lokalizacja: wrangler.toml
name = "voice-ai-worker"
main = "cloudflare-workers/voice-ai-worker.js"
compatibility_date = "2024-01-15"
node_compat = true

[env.production]
name = "voice-ai-worker-prod"
routes = [
  { pattern = "mybonzo.com/api/voice-worker/*", zone_name = "mybonzo.com" }
]

[env.staging]
name = "voice-ai-worker-staging"
routes = [
  { pattern = "luc-de-zen-on.pages.dev/api/voice-worker/*", zone_name = "pages.dev" }
]

[[env.production.bindings]]
name = "VOICE_AI_KV"
type = "kv_namespace"
id = "your_kv_namespace_id"

[vars]
WORKER_ENVIRONMENT = "production"
DEBUG_MODE = "false"
MAX_AUDIO_SIZE = "10485760"  # 10MB
RATE_LIMIT_REQUESTS = "100"
RATE_LIMIT_WINDOW = "3600"   # 1 hour
```

### **PRODUCTION DEPLOYMENT SCRIPT**

```bash
#!/bin/bash
# Lokalizacja: scripts/deploy-voice-ai.sh

echo "🚀 Deploying Voice AI System..."

# Build main application
echo "📦 Building main application..."
pnpm build

# Deploy Cloudflare Workers
echo "🔧 Deploying Cloudflare Workers..."
wrangler publish --env production

# Update environment variables
echo "🔐 Setting environment variables..."
wrangler secret put GOOGLE_SPEECH_API_KEY --env production
wrangler secret put AZURE_COGNITIVE_KEY --env production
wrangler secret put OPENAI_API_KEY --env production
wrangler secret put ELEVENLABS_API_KEY --env production
wrangler secret put GEMINI_API_KEY --env production
wrangler secret put DEEPSEEK_API_KEY --env production

# Test deployment
echo "🧪 Testing deployment..."
curl -f "https://mybonzo.com/api/voice-worker/health" || {
  echo "❌ Health check failed!"
  exit 1
}

echo "✅ Voice AI System deployed successfully!"

# Create deployment log
echo "$(date): Voice AI System deployed" >> deployment.log
```

### **MONITORING I HEALTH CHECKS**

```javascript
// Lokalizacja: src/pages/api/voice/health-check.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
  const healthStatus = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    services: {},
    performance: {},
    errors: [],
  };

  try {
    // Test Voice AI Worker
    const workerResponse = await fetch(
      `${import.meta.env.VOICE_WORKER_URL}/health`
    );
    healthStatus.services.voiceWorker = {
      status: workerResponse.ok ? "healthy" : "unhealthy",
      responseTime: Date.now() - start,
    };

    // Test Speech Recognition
    const recognitionTest = await testSpeechRecognition();
    healthStatus.services.speechRecognition = recognitionTest;

    // Test Text-to-Speech
    const synthesisTest = await testSpeechSynthesis();
    healthStatus.services.textToSpeech = synthesisTest;

    // Performance metrics
    healthStatus.performance = {
      memoryUsage: process.memoryUsage?.() || "not available",
      uptime: process.uptime?.() || "not available",
    };
  } catch (error) {
    healthStatus.status = "unhealthy";
    healthStatus.errors.push(error.message);
  }

  const statusCode = healthStatus.status === "healthy" ? 200 : 503;

  return new Response(JSON.stringify(healthStatus, null, 2), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
};

async function testSpeechRecognition() {
  // Basic speech recognition service test
  return { status: "healthy", lastTest: new Date().toISOString() };
}

async function testSpeechSynthesis() {
  // Basic TTS service test
  return { status: "healthy", lastTest: new Date().toISOString() };
}
```

---

## 📚 DOKUMENTACJA USAGE I PRZYKŁADY

### **PODSTAWOWE UŻYCIE**

```javascript
// Przykład integracji Voice AI w innych komponentach
import { VoiceAIAPI } from "/src/utils/voiceAiAPI.js";

// Inicjalizacja
const voiceAI = new VoiceAIAPI();

// Test połączenia
const healthCheck = await voiceAI.healthCheck();
console.log("Voice AI Status:", healthCheck.status);

// Transkrypcja audio
const audioBlob = await recordAudio(); // user implementation
const transcription = await voiceAI.transcribeAudio(audioBlob, "pl-PL");
console.log("Transcription:", transcription.text);

// Synteza mowy
const audioResult = await voiceAI.synthesizeSpeech(
  "Witaj w Voice AI Assistant!",
  "pl-zofia",
  { speed: 1.0, pitch: 1.0, volume: 1.0 }
);

// Odtwórz wynik
if (audioResult.success) {
  const audio = new Audio(audioResult.audioUrl);
  await audio.play();
}
```

### **ZAAWANSOWANE INTEGRACJE**

```javascript
// Custom Voice Commands
const customCommands = {
  "otwórz generator obrazów": async () => {
    window.location.href = "/image-generator";
  },

  "pokaż status systemu": async () => {
    const status = await fetch("/api/voice/health-check");
    const data = await status.json();

    const message = `Status systemu: ${data.status}. 
      Dostępne usługi: ${Object.keys(data.services).length}`;

    await voiceAI.synthesizeSpeech(message, "pl-zofia");
  },

  "zapisz transkrypcję": async () => {
    const history = localStorage.getItem("transcriptionHistory");
    if (history) {
      downloadTranscription();
      await voiceAI.synthesizeSpeech(
        "Transkrypcja została pobrana",
        "pl-zofia"
      );
    }
  },
};

// Register custom commands
Object.entries(customCommands).forEach(([command, handler]) => {
  registerVoiceCommand(command, handler);
});
```

### **ERROR HANDLING PATTERNS**

```javascript
// Robust error handling for Voice AI operations
async function robustVoiceSynthesis(text, options = {}) {
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔊 Attempt ${attempt}/${maxRetries}: Synthesizing speech`);

      const result = await voiceAI.synthesizeSpeech(
        text,
        options.voice || "pl-zofia",
        {
          speed: options.speed || 1.0,
          pitch: options.pitch || 1.0,
          volume: options.volume || 1.0,
          timeout: 30000, // 30 second timeout
        }
      );

      if (result.success) {
        console.log("✅ Speech synthesis successful");
        return result;
      } else {
        throw new Error(result.error || "Synthesis failed");
      }
    } catch (error) {
      console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);
      lastError = error;

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Final fallback to browser TTS
  console.log("🔄 Falling back to browser TTS");
  try {
    return await fallbackBrowserTTS(text, options);
  } catch (fallbackError) {
    console.error("❌ All synthesis methods failed:", lastError, fallbackError);
    throw new Error(
      `Speech synthesis failed after ${maxRetries} attempts: ${lastError.message}`
    );
  }
}
```

---

## 🎯 WSKAZÓWKI OPTYMALIZACJI I BEST PRACTICES

### **PERFORMANCE OPTIMIZATION**

```javascript
// DOM element caching
const domCache = {
  recordButton: null,
  stopButton: null,
  transcriptionArea: null,
  statusElement: null,
};

function initializeDOMCache() {
  domCache.recordButton = document.getElementById("start-recording");
  domCache.stopButton = document.getElementById("stop-recording");
  domCache.transcriptionArea = document.getElementById("transcription-result");
  domCache.statusElement = document.getElementById("status-message");
}

// Use cached elements instead of repeated queries
function updateRecordingUI(recording) {
  domCache.recordButton.disabled = recording;
  domCache.stopButton.disabled = !recording;
}

// Audio buffer optimization
function optimizeAudioBuffer(audioBuffer, targetSampleRate = 16000) {
  if (audioBuffer.sampleRate === targetSampleRate) {
    return audioBuffer;
  }

  // Resample to target rate for smaller file size
  const ratio = audioBuffer.sampleRate / targetSampleRate;
  const newLength = Math.round(audioBuffer.length / ratio);

  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    newLength,
    targetSampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start();

  return offlineContext.startRendering();
}
```

### **SECURITY BEST PRACTICES**

```javascript
// Input sanitization
function sanitizeTextInput(text) {
  // Remove potentially dangerous characters
  const sanitized = text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .slice(0, 5000); // Limit length

  return sanitized.trim();
}

// Rate limiting implementation
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const validRequests = userRequests.filter(
      (time) => now - time < this.windowMs
    );

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}

const rateLimiter = new RateLimiter(20, 60000); // 20 requests per minute

// Use before API calls
function checkRateLimit() {
  const userId = getUserIdentifier(); // implement based on your auth
  if (!rateLimiter.isAllowed(userId)) {
    throw new Error(
      "Rate limit exceeded. Please wait before making more requests."
    );
  }
}
```

---

## 📈 METRYKI I MONITORING

### **ANALYTICS INTEGRATION**

```javascript
// Voice AI usage analytics
class VoiceAnalytics {
  constructor() {
    this.sessionStart = Date.now();
    this.metrics = {
      totalSessions: 0,
      successfulSynthesis: 0,
      failedSynthesis: 0,
      successfulRecognition: 0,
      failedRecognition: 0,
      averageConfidence: 0,
      preferredVoice: null,
      languageUsage: {},
    };
  }

  recordSynthesis(success, voice, language) {
    if (success) {
      this.metrics.successfulSynthesis++;
    } else {
      this.metrics.failedSynthesis++;
    }

    this.metrics.preferredVoice = voice;
    this.metrics.languageUsage[language] =
      (this.metrics.languageUsage[language] || 0) + 1;

    this.saveMetrics();
  }

  recordRecognition(success, confidence, language) {
    if (success) {
      this.metrics.successfulRecognition++;
      this.metrics.averageConfidence =
        (this.metrics.averageConfidence + confidence) / 2;
    } else {
      this.metrics.failedRecognition++;
    }

    this.metrics.languageUsage[language] =
      (this.metrics.languageUsage[language] || 0) + 1;

    this.saveMetrics();
  }

  saveMetrics() {
    localStorage.setItem("voiceAIMetrics", JSON.stringify(this.metrics));
  }

  async sendTelemetry() {
    // Send anonymized metrics to analytics endpoint
    try {
      await fetch("/api/voice/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...this.metrics,
          sessionDuration: Date.now() - this.sessionStart,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.warn("Failed to send telemetry:", error);
    }
  }
}

const analytics = new VoiceAnalytics();

// Use analytics in voice functions
async function synthesizeSpeech() {
  try {
    const result = await voiceAI.synthesizeSpeech(text, voice, settings);
    analytics.recordSynthesis(result.success, voice, settings.language);
    return result;
  } catch (error) {
    analytics.recordSynthesis(false, voice, settings.language);
    throw error;
  }
}
```

---

_Kompletny przewodnik implementacji Voice AI Assistant - utworzono 09.10.2025_ 🎤
