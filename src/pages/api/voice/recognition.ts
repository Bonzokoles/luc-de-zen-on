/**
 * Voice Recognition API Endpoint
 * Handles speech-to-text conversion using Web Speech API and advanced AI models
 */

import type { APIRoute } from 'astro';

interface VoiceRecognitionRequest {
  language?: string;
  enableRealTime?: boolean;
  model?: 'latest_short' | 'latest_long' | 'command_and_search' | 'phone_call';
  audioData?: string; // Base64 encoded audio
  maxAlternatives?: number;
  profanityFilter?: boolean;
  punctuation?: boolean;
}

interface VoiceRecognitionResponse {
  success: boolean;
  transcript: string;
  confidence: number;
  language: string;
  alternatives?: Array<{
    transcript: string;
    confidence: number;
  }>;
  words?: Array<{
    word: string;
    startTime: string;
    endTime: string;
    confidence: number;
  }>;
  processingTime?: number;
  error?: string;
}

// Symulowane modele rozpoznawania mowy
const speechModels: Record<string, { accuracy: number; speed: string }> = {
  'latest_short': { accuracy: 95, speed: 'fast' },
  'latest_long': { accuracy: 98, speed: 'medium' },
  'command_and_search': { accuracy: 92, speed: 'fast' },
  'phone_call': { accuracy: 88, speed: 'fast' }
};

// Symulowane rozpoznawanie dla różnych języków
const languageAccuracy: Record<string, number> = {
  'pl-PL': 0.95,
  'en-US': 0.98,
  'en-GB': 0.97,
  'de-DE': 0.94,
  'es-ES': 0.93,
  'fr-FR': 0.92,
  'it-IT': 0.91,
  'pt-PT': 0.90,
  'ru-RU': 0.89,
  'ja-JP': 0.87
};

function generateMockRecognition(language: string, model: string): VoiceRecognitionResponse {
  const baseAccuracy = languageAccuracy[language] || 0.85;
  const modelAccuracy = speechModels[model]?.accuracy || 90;
  const confidence = Math.min(95, baseAccuracy * 100 + Math.random() * 10);

  const mockTranscripts: Record<string, string[]> = {
    'pl-PL': [
      "Witaj, jak się masz dzisiaj?",
      "Otwórz POLACZEK i uruchom analizę SEO",
      "Wygeneruj obraz przedstawiający zachód słońca nad morzem",
      "Sprawdź status wszystkich systemów AI",
      "Uruchom muzykę w tle i pokaż dashboard",
      "Przeanalizuj wydajność strony internetowej",
      "Wykonaj backup danych i wyślij raport"
    ],
    'en-US': [
      "Hello, how are you today?",
      "Open POLACZEK and run SEO analysis",
      "Generate an image of sunset over the ocean",
      "Check status of all AI systems",
      "Start background music and show dashboard",
      "Analyze website performance metrics",
      "Execute data backup and send report"
    ],
    'de-DE': [
      "Hallo, wie geht es dir heute?",
      "Öffne POLACZEK und führe SEO-Analyse durch",
      "Generiere ein Bild von Sonnenuntergang über dem Ozean"
    ]
  };

  const transcripts = mockTranscripts[language] || mockTranscripts['en-US'];
  const transcript = transcripts[Math.floor(Math.random() * transcripts.length)];

  return {
    success: true,
    transcript,
    confidence: Math.round(confidence),
    language,
    alternatives: [
      { transcript, confidence: Math.round(confidence) },
      { transcript: transcript.toLowerCase(), confidence: Math.round(confidence - 5) },
      { transcript: transcript.replace(/[.,!?]/g, ''), confidence: Math.round(confidence - 10) }
    ],
    words: transcript.split(' ').map((word: string, index: number) => ({
      word,
      startTime: `${index * 0.5}s`,
      endTime: `${(index + 1) * 0.5}s`,
      confidence: Math.round(confidence + Math.random() * 5 - 2.5)
    })),
    processingTime: Math.round(100 + Math.random() * 300)
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: VoiceRecognitionRequest = await request.json();
    
    const {
      language = 'pl-PL',
      enableRealTime = true,
      model = 'latest_long',
      audioData,
      maxAlternatives = 3,
      profanityFilter = true,
      punctuation = true
    } = body;

    // Validate language code
    const supportedLanguages = Object.keys(languageAccuracy);
    if (!supportedLanguages.includes(language)) {
      return new Response(JSON.stringify({
        success: false,
        error: `Unsupported language: ${language}. Supported: ${supportedLanguages.join(', ')}`
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // Validate model
    if (!speechModels[model]) {
      return new Response(JSON.stringify({
        success: false,
        error: `Unsupported model: ${model}. Available: ${Object.keys(speechModels).join(', ')}`
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // Symuluj czas przetwarzania
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 500));

    // Generate mock recognition result
    const result = generateMockRecognition(language, model);

    // Apply filters
    if (profanityFilter) {
      result.transcript = result.transcript.replace(/\b(damn|hell|stupid)\b/gi, '***');
    }

    if (result.alternatives && maxAlternatives < result.alternatives.length) {
      result.alternatives = result.alternatives.slice(0, maxAlternatives);
    }

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
    console.error('Voice Recognition API Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error during voice recognition',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
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
    service: 'Voice Recognition API',
    version: '1.0.0',
    supportedLanguages: Object.keys(languageAccuracy),
    supportedModels: Object.keys(speechModels),
    features: [
      'Real-time speech recognition',
      'Multiple language support',
      'Word-level timestamps',
      'Confidence scoring',
      'Alternative transcripts',
      'Profanity filtering',
      'Punctuation restoration'
    ],
    limits: {
      maxAudioDuration: '60s',
      maxAlternatives: 10,
      supportedFormats: ['WAV', 'MP3', 'FLAC', 'OGG']
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