/**
 * Audio Equalizer and Manipulation API
 * Obsługa equalizacji, efektów dźwiękowych i manipulacji audio
 */

import type { APIRoute } from "astro";

interface AudioProcessingRequest {
  audio_url?: string;
  audio_data?: string; // Base64 encoded
  equalizer_bands?: Record<string, number>; // Simplified format
  effects?: {
    compression?: number; // 0-10
    reverb?: number; // 0-10  
    noise_reduction?: number; // 0-10
  };
}

interface AudioProcessingResponse {
  success: boolean;
  audio_url?: string;
  audio_data?: string;
  processing_time?: number;
  applied_effects?: string[];
  waveform_data?: number[];
  audio_stats?: {
    peak_level: number;
    rms_level: number;
    duration: number;
    sample_rate: number;
  };
  error?: string;
}

// Equalizer presets
const EQ_PRESETS: Record<string, Record<string, number>> = {
  flat: {
    "32Hz": 0, "64Hz": 0, "125Hz": 0, "250Hz": 0, "500Hz": 0,
    "1kHz": 0, "2kHz": 0, "4kHz": 0, "8kHz": 0, "16kHz": 0
  },
  speech: {
    "32Hz": -6, "64Hz": -4, "125Hz": -2, "250Hz": 2, "500Hz": 4,
    "1kHz": 6, "2kHz": 4, "4kHz": 2, "8kHz": -1, "16kHz": -3
  },
  podcast: {
    "32Hz": -8, "64Hz": -5, "125Hz": -2, "250Hz": 3, "500Hz": 5,
    "1kHz": 7, "2kHz": 5, "4kHz": 3, "8kHz": 1, "16kHz": -2
  },
  radio: {
    "32Hz": -10, "64Hz": -6, "125Hz": -3, "250Hz": 4, "500Hz": 6,
    "1kHz": 8, "2kHz": 6, "4kHz": 4, "8kHz": 2, "16kHz": 0
  },
  warm: {
    "32Hz": 3, "64Hz": 2, "125Hz": 1, "250Hz": 0, "500Hz": -1,
    "1kHz": -2, "2kHz": -1, "4kHz": 1, "8kHz": 2, "16kHz": 1
  },
  bright: {
    "32Hz": -2, "64Hz": -1, "125Hz": 0, "250Hz": 1, "500Hz": 2,
    "1kHz": 3, "2kHz": 4, "4kHz": 5, "8kHz": 4, "16kHz": 3
  }
};

async function processAudio(request: AudioProcessingRequest): Promise<AudioProcessingResponse> {
  const startTime = Date.now();
  
  try {
    const { audio_url, audio_data, equalizer_bands, effects } = request;
    
    // Validate input
    if (!audio_url && !audio_data) {
      throw new Error("Either audio_url or audio_data is required");
    }

    console.log('[AudioEQ] Processing audio with:', {
      hasUrl: !!audio_url,
      hasData: !!audio_data,
      eqBands: equalizer_bands ? Object.keys(equalizer_bands).length : 0,
      effects: effects ? Object.keys(effects) : []
    });

    // Simulate audio processing
    const appliedEffects: string[] = [];
    
    // Process equalizer
    if (equalizer_bands) {
      const activeBands = Object.entries(equalizer_bands).filter(([_, value]) => value !== 0);
      if (activeBands.length > 0) {
        appliedEffects.push(`Equalizer (${activeBands.length} bands)`);
        console.log('[AudioEQ] Applied EQ:', activeBands.map(([band, val]) => `${band}:${val}dB`).join(', '));
      }
    }

    // Process effects
    if (effects) {
      if (effects.compression && effects.compression > 0) {
        appliedEffects.push(`Compression (${effects.compression}/10)`);
      }
      if (effects.reverb && effects.reverb > 0) {
        appliedEffects.push(`Reverb (${effects.reverb}/10)`);
      }
      if (effects.noise_reduction && effects.noise_reduction > 0) {
        appliedEffects.push(`Noise Reduction (${effects.noise_reduction}/10)`);
      }
    }

    // Generate processed audio (mock implementation)
    const processedAudio = generateProcessedAudio(audio_url || audio_data || '', appliedEffects);
    const processingTime = Date.now() - startTime;

    // Generate new waveform with applied effects
    const waveformData = generateProcessedWaveform(appliedEffects.length);

    // Generate audio statistics
    const audioStats = {
      peak_level: -3.2,
      rms_level: -18.5,
      duration: 5.2,
      sample_rate: 22050
    };

    const response: AudioProcessingResponse = {
      success: true,
      audio_url: `data:audio/wav;base64,${processedAudio}`,
      audio_data: processedAudio,
      processing_time: processingTime,
      applied_effects: appliedEffects,
      waveform_data: waveformData,
      audio_stats: audioStats
    };

    console.log(`[AudioEQ] Processing completed in ${processingTime}ms, applied: ${appliedEffects.join(', ')}`);
    return response;

  } catch (error) {
    console.error('[AudioEQ] Processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Audio processing failed'
    };
  }
}

function generateProcessedAudio(originalAudio: string, effects: string[]): string {
  // Mock processed audio generation
  // In reality, this would apply actual audio processing using FFmpeg or similar
  
  const sampleRate = 22050;
  const duration = 3; // 3 seconds
  const samples = sampleRate * duration;
  
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples * 2, true);
  
  // Generate processed audio waveform
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    
    // Base waveform
    let amplitude = Math.sin(t * 440 * 2 * Math.PI) * 0.3; // A4 note
    
    // Apply mock effects based on what was requested
    effects.forEach(effect => {
      if (effect.includes('Equalizer')) {
        // Mock EQ - slight frequency modification
        amplitude *= 1.1;
      }
      if (effect.includes('Compression')) {
        // Mock compression - reduce dynamic range
        amplitude *= 0.8;
      }
      if (effect.includes('Reverb')) {
        // Mock reverb - add slight echo
        amplitude += Math.sin(t * 440 * 2 * Math.PI * 0.9) * 0.1;
      }
      if (effect.includes('Noise Reduction')) {
        // Mock noise reduction - slightly cleaner signal
        amplitude *= 0.95;
      }
    });
    
    const sample = Math.round(amplitude * 32767);
    view.setInt16(44 + i * 2, sample, true);
  }
  
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function generateProcessedWaveform(effectsCount: number): number[] {
  const samples = 400; // Reasonable waveform resolution
  const waveform: number[] = [];
  
  for (let i = 0; i < samples; i++) {
    const t = i / samples;
    
    // Base waveform
    let value = Math.sin(t * Math.PI * 6) * 0.8;
    
    // Modify based on number of effects applied
    if (effectsCount > 0) {
      value *= (1 + effectsCount * 0.1); // Slightly modify amplitude
      value += Math.sin(t * Math.PI * 12) * 0.1; // Add harmonics
    }
    
    // Add envelope
    const envelope = Math.sin(t * Math.PI);
    value *= envelope;
    
    waveform.push(Math.max(-1, Math.min(1, value)));
  }
  
  return waveform;
}

// Main API endpoint
export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('[AudioEQ] API called');
    
    const body = await request.json() as any;
    console.log('[AudioEQ] Request body:', body);

    // Validate request
    if (!body.audio_url && !body.audio_data) {
      return new Response(JSON.stringify({
        success: false,
        error: "Either audio_url or audio_data is required"
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process audio
    const result = await processAudio(body as AudioProcessingRequest);
    
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('[AudioEQ] API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Handle preflight requests
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};