/**
 * XTTS-v2 Voice Synthesis API Endpoint
 * Hugging Face + Coqui XTTS integration dla klonowania głosu i syntezy mowy
 */

import type { APIRoute } from "astro";

interface XTTSRequest {
  text: string;
  language?: "pl" | "en" | "de" | "fr" | "es";
  voice_sample?: string; // Base64 encoded audio sample
  voice_preset?: string; // Predefiniowany głos
  speed?: number; // 0.5 - 2.0
  temperature?: number; // 0.1 - 1.0 (kontrola emocji/stylu)
  length_penalty?: number; // Kontrola długości wypowiedzi
  repetition_penalty?: number; // Kontrola powtórzeń
  top_k?: number; // Kontrola różnorodności
  top_p?: number; // Nucleus sampling
  enable_text_splitting?: boolean; // Podział długich tekstów
  gpt_cond_len?: number; // Kontrola kondycjonowania GPT
  max_ref_len?: number; // Maksymalna długość referencji
  output_format?: "wav" | "mp3";
}

interface XTTSResponse {
  success: boolean;
  audio_url?: string;
  audio_data?: string; // Base64 encoded audio
  duration?: number;
  sample_rate?: number;
  voice_info?: {
    language: string;
    voice_id: string;
    quality_score: number;
    similarity_score?: number;
  };
  processing_time?: number;
  waveform_data?: number[];
  error?: string;
}

// Predefiniowane głosy z różnych kategorii
const VOICE_PRESETS: Record<string, any> = {
  // Polskie głosy
  "pl-zofia-premium": {
    id: "pl-zofia-premium",
    name: "Zofia Premium",
    language: "pl",
    gender: "female",
    category: "professional",
    quality: 95,
    sample_url: "/audio/voices/pl-zofia-sample.wav",
    description: "Profesjonalny żeński głos do prezentacji biznesowych",
  },
  "pl-marek-natural": {
    id: "pl-marek-natural",
    name: "Marek Naturalny",
    language: "pl",
    gender: "male",
    category: "natural",
    quality: 92,
    sample_url: "/audio/voices/pl-marek-sample.wav",
    description: "Naturalny męski głos do codziennych zastosowań",
  },
  "pl-anna-narrator": {
    id: "pl-anna-narrator",
    name: "Anna Narrator",
    language: "pl",
    gender: "female",
    category: "storytelling",
    quality: 90,
    sample_url: "/audio/voices/pl-anna-sample.wav",
    description: "Narrator żeński idealny do audiobooków",
  },
  // Angielskie głosy
  "en-sarah-professional": {
    id: "en-sarah-professional",
    name: "Sarah Professional",
    language: "en",
    gender: "female",
    category: "business",
    quality: 96,
    sample_url: "/audio/voices/en-sarah-sample.wav",
    description: "Professional American female voice",
  },
  // Celebrity demo
  "celebrity-demo-1": {
    id: "celebrity-demo-1",
    name: "Celebrity Demo",
    language: "en",
    gender: "male",
    category: "celebrity",
    quality: 98,
    sample_url: "/audio/voices/celebrity-demo.wav",
    description: "Celebrity voice clone demonstration",
  },
};

const XTTS_CONFIG = {
  supported_languages: [
    "pl",
    "en",
    "de",
    "fr",
    "es",
    "it",
    "pt",
    "zh",
    "ja",
    "ko",
  ],
  max_text_length: 1000,
  sample_rate: 22050,
  audio_format: "wav",
};

async function synthesizeWithXTTS(request: XTTSRequest): Promise<XTTSResponse> {
  const startTime = Date.now();

  try {
    const {
      text,
      language = "pl",
      voice_sample,
      voice_preset = "pl-zofia-premium",
      speed = 1.0,
      temperature = 0.75,
      output_format = "wav",
    } = request;

    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error("Text is required for synthesis");
    }

    if (text.length > XTTS_CONFIG.max_text_length) {
      throw new Error(
        `Text too long. Maximum ${XTTS_CONFIG.max_text_length} characters allowed`
      );
    }

    // Get voice preset info
    const selectedVoice =
      VOICE_PRESETS[voice_preset] || VOICE_PRESETS["pl-zofia-premium"];

    console.log(
      `[XTTS] Synthesizing: "${text.substring(0, 50)}..." with voice: ${
        selectedVoice.name
      }`
    );

    // Prepare voice info
    const voiceInfo = {
      language,
      voice_id: selectedVoice.id,
      quality_score: selectedVoice.quality,
      similarity_score: voice_sample ? 0.85 : 0.95, // Higher for presets
    };

    // Generate mock audio data (in production, this would call actual XTTS API)
    // For demo purposes, we create a simple audio response
    const mockAudioBase64 = generateMockAudio(text, selectedVoice, speed);
    const processingTime = Date.now() - startTime;

    // Calculate estimated duration (roughly 100 chars per second of audio)
    const estimatedDuration = Math.max(
      1,
      Math.round((text.length / 100) * (2.0 - speed))
    );

    // Generate waveform data for visualization
    const waveformData = generateMockWaveform(text.length);

    const response: XTTSResponse = {
      success: true,
      audio_data: mockAudioBase64,
      audio_url: `data:audio/${output_format};base64,${mockAudioBase64}`,
      duration: estimatedDuration,
      sample_rate: XTTS_CONFIG.sample_rate,
      voice_info: voiceInfo,
      processing_time: processingTime,
      waveform_data: waveformData,
    };

    console.log(`[XTTS] Synthesis completed in ${processingTime}ms`);
    return response;
  } catch (error) {
    console.error("[XTTS] Synthesis error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown synthesis error",
    };
  }
}

// Generate mock audio data for demo purposes
function generateMockAudio(text: string, voice: any, speed: number): string {
  // Simple mock: generate base64 for a minimal WAV file
  const sampleRate = 22050;
  const duration = Math.max(1, Math.round((text.length / 100) * (2.0 - speed)));
  const samples = sampleRate * duration;

  // Create minimal WAV header + sine wave data
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples * 2, true);

  // Generate simple sine wave (mock speech pattern)
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const frequency = 200 + Math.sin(t * 2) * 100; // Varying frequency
    const amplitude = Math.sin(t * frequency * 2 * Math.PI) * 0.3;
    const sample = Math.round(amplitude * 32767);
    view.setInt16(44 + i * 2, sample, true);
  }

  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

// Generate mock waveform data
function generateMockWaveform(textLength: number): number[] {
  const samples = Math.min(800, textLength * 2); // Reasonable waveform resolution
  const waveform: number[] = [];

  for (let i = 0; i < samples; i++) {
    // Generate speech-like waveform pattern
    const t = i / samples;
    const base = Math.sin(t * Math.PI * 8) * 0.7; // Base speech pattern
    const noise = (Math.random() - 0.5) * 0.3; // Add some noise
    const envelope = Math.sin(t * Math.PI); // Speech envelope

    waveform.push(base * envelope + noise);
  }

  return waveform;
}

// Main API endpoint
export const POST: APIRoute = async ({ request }) => {
  try {
    console.log("[XTTS] API called");

    // Parse request body
    const body = (await request.json()) as any;
    console.log("[XTTS] Request body:", body);

    // Validate required fields
    if (!body.text) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Text field is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Call synthesis function
    const result = await synthesizeWithXTTS(body as XTTSRequest);

    // Return response
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("[XTTS] API error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// Handle preflight requests
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
