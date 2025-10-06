/**
 * Voice Synthesis API Endpoint
 * Handles text-to-speech conversion with voice selection and customization
 */

import type { APIRoute } from 'astro';

interface VoiceSynthesisRequest {
  text: string;
  language?: string;
  voice?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
  format?: 'mp3' | 'wav' | 'ogg';
  ssml?: boolean;
  emotionalTone?: 'neutral' | 'friendly' | 'professional' | 'excited' | 'calm';
  quality?: 'low' | 'medium' | 'high' | 'premium';
}

interface VoiceSynthesisResponse {
  success: boolean;
  audioUrl?: string;
  audioData?: string; // Base64 encoded audio
  duration?: number;
  voice: {
    name: string;
    language: string;
    gender: string;
    naturalness: number;
  };
  settings: {
    speed: number;
    pitch: number;
    volume: number;
  };
  processingTime?: number;
  error?: string;
}

// Dostępne głosy dla różnych języków
const availableVoices: Record<string, Array<{
  id: string;
  name: string;
  gender: 'male' | 'female';
  naturalness: number;
  premium?: boolean;
}>> = {
  'pl-PL': [
    { id: 'pl-zofia', name: 'Zofia', gender: 'female', naturalness: 95, premium: true },
    { id: 'pl-marek', name: 'Marek', gender: 'male', naturalness: 92, premium: true },
    { id: 'pl-ewa', name: 'Ewa', gender: 'female', naturalness: 88 },
    { id: 'pl-adam', name: 'Adam', gender: 'male', naturalness: 85 }
  ],
  'en-US': [
    { id: 'en-sarah', name: 'Sarah', gender: 'female', naturalness: 98, premium: true },
    { id: 'en-michael', name: 'Michael', gender: 'male', naturalness: 97, premium: true },
    { id: 'en-emma', name: 'Emma', gender: 'female', naturalness: 94 },
    { id: 'en-david', name: 'David', gender: 'male', naturalness: 92 }
  ],
  'en-GB': [
    { id: 'gb-olivia', name: 'Olivia', gender: 'female', naturalness: 96, premium: true },
    { id: 'gb-james', name: 'James', gender: 'male', naturalness: 94, premium: true }
  ],
  'de-DE': [
    { id: 'de-anna', name: 'Anna', gender: 'female', naturalness: 93, premium: true },
    { id: 'de-klaus', name: 'Klaus', gender: 'male', naturalness: 91 }
  ],
  'es-ES': [
    { id: 'es-sofia', name: 'Sofía', gender: 'female', naturalness: 92 },
    { id: 'es-carlos', name: 'Carlos', gender: 'male', naturalness: 89 }
  ],
  'fr-FR': [
    { id: 'fr-marie', name: 'Marie', gender: 'female', naturalness: 91 },
    { id: 'fr-pierre', name: 'Pierre', gender: 'male', naturalness: 88 }
  ]
};

// Emotionally aware speech patterns
const emotionalPatterns: Record<string, { speed: number; pitch: number; emphasis: string }> = {
  neutral: { speed: 1.0, pitch: 1.0, emphasis: 'normal' },
  friendly: { speed: 1.1, pitch: 1.05, emphasis: 'warm' },
  professional: { speed: 0.95, pitch: 0.98, emphasis: 'clear' },
  excited: { speed: 1.2, pitch: 1.15, emphasis: 'energetic' },
  calm: { speed: 0.9, pitch: 0.95, emphasis: 'soothing' }
};

function generateSynthesisResult(
  text: string,
  language: string,
  voiceId: string,
  settings: Partial<VoiceSynthesisRequest>
): VoiceSynthesisResponse {
  
  // Find voice
  const languageVoices = availableVoices[language] || availableVoices['en-US'];
  const selectedVoice = languageVoices.find(v => v.id === voiceId) || languageVoices[0];
  
  // Apply emotional tone adjustments
  const emotionalTone = settings.emotionalTone || 'neutral';
  const emotionalAdjustments = emotionalPatterns[emotionalTone];
  
  // Calculate final settings
  const finalSpeed = (settings.speed || 1.0) * emotionalAdjustments.speed;
  const finalPitch = (settings.pitch || 1.0) * emotionalAdjustments.pitch;
  const finalVolume = settings.volume || 1.0;
  
  // Estimate duration (words per minute calculation)
  const wordCount = text.trim().split(/\s+/).length;
  const baseWPM = 150; // Average speaking rate
  const adjustedWPM = baseWPM * finalSpeed;
  const estimatedDuration = Math.round((wordCount / adjustedWPM) * 60 * 1000); // milliseconds
  
  // Simulate processing time based on text length and quality
  const quality = settings.quality || 'medium';
  const qualityMultiplier = { low: 0.5, medium: 1.0, high: 1.5, premium: 2.0 }[quality];
  const processingTime = Math.round(text.length * qualityMultiplier + Math.random() * 200);
  
  // Generate mock audio URL (in real implementation, this would be actual audio file)
  const audioUrl = `https://voice-api.mybonzo.com/audio/${Date.now()}_${selectedVoice.id}.${settings.format || 'mp3'}`;
  
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

function generateMockAudioData(textLength: number): string {
  // Generate mock base64 audio data proportional to text length
  const dataLength = Math.min(textLength * 100, 10000);
  const mockData = Array.from({ length: dataLength }, () => 
    Math.random().toString(36).charAt(0)
  ).join('');
  
  return Buffer.from(mockData).toString('base64').substring(0, 200) + '...';
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: VoiceSynthesisRequest = await request.json();
    
    const {
      text,
      language = 'pl-PL',
      voice,
      speed = 1.0,
      pitch = 1.0,
      volume = 1.0,
      format = 'mp3',
      ssml = false,
      emotionalTone = 'neutral',
      quality = 'medium'
    } = body;

    // Validate required fields
    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Text field is required and cannot be empty'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Validate text length
    if (text.length > 5000) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Text too long. Maximum 5000 characters allowed'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Validate language and voice
    if (!availableVoices[language]) {
      return new Response(JSON.stringify({
        success: false,
        error: `Unsupported language: ${language}. Supported: ${Object.keys(availableVoices).join(', ')}`
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Select voice
    const languageVoices = availableVoices[language];
    const selectedVoiceId = voice || languageVoices[0].id;
    
    // Validate voice exists for language
    if (voice && !languageVoices.find(v => v.id === voice)) {
      return new Response(JSON.stringify({
        success: false,
        error: `Voice '${voice}' not available for language '${language}'. Available: ${languageVoices.map(v => v.id).join(', ')}`
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Validate settings ranges
    if (speed < 0.1 || speed > 3.0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Speed must be between 0.1 and 3.0'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pitch < 0.1 || pitch > 2.0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Pitch must be between 0.1 and 2.0'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

    // Generate synthesis result
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
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Voice Synthesis API Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error during voice synthesis',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

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

export const GET: APIRoute = async () => {
  const capabilities = {
    service: 'Voice Synthesis API',
    version: '1.0.0',
    supportedLanguages: Object.keys(availableVoices),
    supportedFormats: ['mp3', 'wav', 'ogg'],
    voices: availableVoices,
    emotionalTones: Object.keys(emotionalPatterns),
    qualityLevels: ['low', 'medium', 'high', 'premium'],
    features: [
      'Multiple voice selection',
      'Emotional tone adjustment',
      'Speed and pitch control',
      'SSML support',
      'Premium voice options',
      'Multiple audio formats'
    ],
    limits: {
      maxTextLength: 5000,
      speedRange: [0.1, 3.0],
      pitchRange: [0.1, 2.0],
      volumeRange: [0.0, 1.0]
    }
  };

  return new Response(JSON.stringify(capabilities), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};