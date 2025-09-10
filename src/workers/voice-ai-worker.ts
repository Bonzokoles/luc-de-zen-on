// Voice AI Worker - Cloudflare Worker for AI processing
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/voice-ai' && request.method === 'POST') {
      return await handleVoiceAI(request, env);
    }
    
    return new Response('Voice AI Worker - Ready', { status: 200 });
  }
};

interface Env {
  AI: any; // Cloudflare Workers AI binding
  VOICE_AI_KV: KVNamespace; // For session storage
}

async function handleVoiceAI(request: Request, env: Env): Promise<Response> {
  try {
    const { type, data, sessionId } = await request.json();
    
    switch (type) {
      case 'transcribe':
        return await transcribeAudio(data, env);
        
      case 'generate_speech':
        return await generateSpeech(data, env);
        
      case 'chat_completion':
        return await getChatCompletion(data, env);
        
      default:
        return new Response(JSON.stringify({ error: 'Unknown request type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Voice AI processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function transcribeAudio(audioData: string, env: Env): Promise<Response> {
  try {
    // Convert base64 to ArrayBuffer
    const binaryString = atob(audioData);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    
    // Use Cloudflare Workers AI for speech-to-text with Polish optimization
    const response = await env.AI.run('@cf/openai/whisper', {
      audio: arrayBuffer,
      language: 'pl'
    });
    
    return new Response(JSON.stringify({
      success: true,
      transcription: response.text,
      confidence: response.confidence || 0.9
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Transcription failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function generateSpeech(text: string, env: Env): Promise<Response> {
  try {
    // Use Cloudflare Workers AI for text-to-speech
    const response = await env.AI.run('@cf/deepgram/aura-1', {
      text: text,
      voice: 'polish_female', // Or appropriate voice
      format: 'mp3'
    });
    
    return new Response(response, {
      headers: { 
        'Content-Type': 'audio/mpeg',
        'X-Generated-Text': text
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Speech generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getChatCompletion(prompt: string, env: Env): Promise<Response> {
  try {
    // Use Cloudflare Workers AI for chat completion
    const response = await env.AI.run('@cf/google/gemma-3-12b-it', {
      messages: [
        {
          role: 'system',
          content: 'Jesteś pomocnym asystentem AI w systemie MyBonzo. Odpowiadasz po polsku w sposób przystępny i pomocny.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    return new Response(JSON.stringify({
      success: true,
      response: response.response,
      usage: response.usage
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Chat completion failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
