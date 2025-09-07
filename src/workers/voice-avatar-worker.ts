/**
 * Voice Avatar Worker - Dedykowany worker dla voice avatar z polskim modelem AI
 */

export interface Env {
  AI: any; // Cloudflare Workers AI binding
  OPENAI_API_KEY?: string;
  ELEVENLABS_API_KEY?: string;
  VOICE_CACHE?: KVNamespace;
}

interface VoiceRequest {
  type: 'transcribe' | 'chat' | 'generate_speech';
  data: any;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body: VoiceRequest = await request.json();
      
      switch (body.type) {
        case 'transcribe':
          return await handleTranscription(body.data, env, corsHeaders);
        
        case 'chat':
          return await handleChat(body.data, env, corsHeaders);
        
        case 'generate_speech':
          return await handleSpeechGeneration(body.data, env, corsHeaders);
        
        default:
          return new Response('Invalid request type', { status: 400, headers: corsHeaders });
      }
    } catch (error) {
      console.error('Voice Avatar Worker Error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

// Transkrypcja audio na tekst
async function handleTranscription(audioData: string, env: Env, corsHeaders: any): Promise<Response> {
  try {
    // Konwersja base64 na Uint8Array
    const audioBytes = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
    
    // Wykorzystanie Cloudflare Workers AI dla transkrypcji
    const response = await env.AI.run('@cf/openai/whisper', {
      audio: audioBytes,
    });

    console.log('🎤 Transcription result:', response);

    return new Response(JSON.stringify({
      success: true,
      transcription: response.text || ''
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ Transcription error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Transcription failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Chat z polskim modelem AI
async function handleChat(message: string, env: Env, corsHeaders: any): Promise<Response> {
  try {
    const systemPrompt = `Jesteś polskim asystentem AI dla strony LUC de ZEN ON (MyBonzo). Odpowiadaj TYLKO po polsku.
Używaj poprawnej polskiej gramatyki i naturalnego słownictwa.
Bądź pomocny, przyjazny i zwięzły - maksymalnie 2-3 zdania.
Zachowuj się naturalnie jak native speaker polskiego.

O STRONIE:
LUC de ZEN ON to nowoczesna strona portfolio z automatycznym tagowaniem projektów, 
galerią postów, Voice AI systemem i pełnym wsparciem SEO. 
Zbudowana w Astro i wdrażana na Cloudflare Workers.

FUNKCJE STRONY:
- Voice AI Avatar z automatyczną rotacją obrazów
- Galeria projektów z tagowaniem
- System chatów AI z różnymi modelami
- Workers API dla sztucznej inteligencji
- Generator obrazów AI

DOKUMENTACJA:
- Główna: /README.md i /LUCK_the_ZE_non_HUB/README.md
- Voice AI: /LUCK_the_ZE_non_HUB/VOICE_AI_COMPLETE_DOCS.md  
- Voice Avatar: /LUCK_the_ZE_non_HUB/VOICE_AVATAR_DEPLOY_GUIDE.md
- Ekosystem AI: /LUCK_the_ZE_non_HUB/AI_WORKERS_ECOSYSTEM_DOCUMENTATION.md
- Konfiguracja: /.github/copilot-instructions.md

Możesz odesłać użytkownika do odpowiedniej dokumentacji gdy pyta o szczegóły.`;

    // Używam Qwen2.5 Coder - lepszy dla różnych języków w tym polskiego
    const response = await env.AI.run('@cf/qwen/qwen2.5-coder-32b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    console.log('🤖 AI Response:', response);

    return new Response(JSON.stringify({
      success: true,
      response: response.response || 'Przepraszam, nie mogę teraz odpowiedzieć.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ Chat error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Chat failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Generowanie mowy z tekstu
async function handleSpeechGeneration(text: string, env: Env, corsHeaders: any): Promise<Response> {
  try {
    // Próba z ElevenLabs (lepsze dla polskiego)
    if (env.ELEVENLABS_API_KEY) {
      return await generateSpeechElevenLabs(text, env.ELEVENLABS_API_KEY, corsHeaders);
    }
    
    // Fallback na OpenAI TTS
    if (env.OPENAI_API_KEY) {
      return await generateSpeechOpenAI(text, env.OPENAI_API_KEY, corsHeaders);
    }

    // Ostatni fallback - Cloudflare Workers AI (może nie obsługiwać polskiego)
    const response = await env.AI.run('@cf/speex/speex', {
      text: text,
      voice: 'polish-female' // jeśli dostępne
    });

    if (response && response.audio) {
      return new Response(response.audio, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'audio/wav'
        }
      });
    }

    throw new Error('No TTS service available');
  } catch (error) {
    console.error('❌ Speech generation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Speech generation failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// ElevenLabs TTS (najlepsze dla polskiego)
async function generateSpeechElevenLabs(text: string, apiKey: string, corsHeaders: any): Promise<Response> {
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2', // Obsługuje polski
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true
      }
    })
  });

  if (response.ok) {
    const audioData = await response.arrayBuffer();
    return new Response(audioData, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'audio/mpeg'
      }
    });
  }

  throw new Error('ElevenLabs TTS failed');
}

// OpenAI TTS (dobra alternatywa)
async function generateSpeechOpenAI(text: string, apiKey: string, corsHeaders: any): Promise<Response> {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: 'alloy', // Najbardziej naturalny głos
      response_format: 'mp3'
    })
  });

  if (response.ok) {
    const audioData = await response.arrayBuffer();
    return new Response(audioData, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'audio/mpeg'
      }
    });
  }

  throw new Error('OpenAI TTS failed');
}
