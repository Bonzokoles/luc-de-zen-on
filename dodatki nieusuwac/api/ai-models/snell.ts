import type { APIRoute } from 'astro';

// Chat history tracking
const snellChatHistory: Array<{
  id: string;
  messages: Array<{ role: string; content: string; timestamp: number }>;
  model: string;
  timestamp: number;
}> = [];

// Snell AI model information (hypothetical free AI model)
const SNELL_MODELS = {
  'snell-chat': {
    name: 'Snell Chat',
    description: 'Szybki model do konwersacji - darmowy',
    context_length: 4096,
    specializes: ['rozmowy', 'pytania', 'asystent'],
    free: true
  },
  'snell-code': {
    name: 'Snell Code',
    description: 'Model zoptymalizowany pod programowanie',
    context_length: 8192,
    specializes: ['programowanie', 'debugging', 'kod'],
    free: true
  },
  'snell-creative': {
    name: 'Snell Creative',
    description: 'Model do twórczego pisania i historii',
    context_length: 6144,
    specializes: ['pisanie', 'historie', 'kreatywność'],
    free: true
  }
};

// AI Functions for Snell
async function getSnellInstructions() {
  return {
    title: 'Snell AI API - Darmowy szybki asystent AI',
    description: 'Bezpłatne modele Snell AI do różnych zastosowań',
    sections: {
      'Dostępne modele': SNELL_MODELS,
      'Funkcje': {
        chat: 'Naturalne rozmowy i odpowiedzi na pytania',
        coding: 'Pomoc w programowaniu i debugging',
        creative: 'Twórcze pisanie i generowanie treści',
        analysis: 'Analiza tekstu i danych',
        translation: 'Podstawowe tłumaczenia',
        summarization: 'Streszczanie długich tekstów'
      },
      'Parametry POST': {
        message: 'string (wymagane) - wiadomość użytkownika',
        model: 'string - model snell (domyślnie snell-chat)',
        temperature: 'number - kreatywność 0.0-1.0 (domyślnie 0.7)',
        max_tokens: 'number - maksymalna długość odpowiedzi',
        system_prompt: 'string - instrukcje systemowe',
        conversation_id: 'string - ID konwersacji do kontynuacji',
        stream: 'boolean - czy streamować odpowiedź'
      }
    },
    examples: {
      'Prosta rozmowa': '{"message": "Co to jest AI?", "model": "snell-chat"}',
      'Pomoc w kodzie': '{"message": "Jak napisać pętlę for w JavaScript?", "model": "snell-code"}',
      'Kreatywne pisanie': '{"message": "Napisz krótką historię o robocie", "model": "snell-creative", "temperature": 0.9}',
      'Z systemem': '{"message": "Przeanalizuj ten kod", "system_prompt": "Jesteś ekspertem programowania", "model": "snell-code"}'
    },
    best_practices: {
      models: 'snell-chat do rozmów, snell-code do programowania, snell-creative do pisania',
      temperature: 'Niższa temperatura = bardziej precyzyjne odpowiedzi',
      context: 'Używaj system_prompt dla lepszego kontekstu',
      conversations: 'Używaj conversation_id dla ciągłości rozmowy'
    }
  };
}

async function getSnellAIHelp(env: any, question: string) {
  try {
    const prompt = `Jesteś ekspertem od modeli Snell AI i szybkich asystentów AI. 
    Użytkownik pyta: "${question}"
    
    Pomóż użytkownikowi z:
    - Wyborem właściwego modelu Snell (chat/code/creative)
    - Optymalizacją promptów i parametrów
    - Rozwiązywaniem problemów z API
    - Najlepszymi praktykami używania Snell AI
    
    Odpowiedz po polsku z konkretnymi wskazówkami.`;

    if (env.AI) {
      const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: prompt }]
      });
      return response.response || 'Nie udało się uzyskać odpowiedzi AI';
    }
    
    return 'AI obecnie niedostępne. Model Snell jest szybki i prosty w użyciu - wybierz model do zadania.';
  } catch (error) {
    return `Błąd AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}`;
  }
}

function generateChatId(): string {
  return 'snell_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const instructions = url.searchParams.get('instructions');
    const aiHelp = url.searchParams.get('ai_help');
    const models = url.searchParams.get('models');
    const conversationId = url.searchParams.get('conversation_id');
    
    const env =
      (locals as any)?.runtime?.env ??
      (globalThis as any).cloudflareEnv ??
      {};

    // Handle models list request
    if (models) {
      return new Response(JSON.stringify({
        success: true,
        service: 'Snell AI - Dostępne modele',
        models: SNELL_MODELS,
        count: Object.keys(SNELL_MODELS).length,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle instructions request
    if (instructions) {
      const snellInstructions = await getSnellInstructions();
      return new Response(JSON.stringify({
        success: true,
        service: 'Snell AI - Instrukcje',
        instructions: snellInstructions,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle AI help request
    if (aiHelp) {
      const aiResponse = await getSnellAIHelp(env, aiHelp);
      return new Response(JSON.stringify({
        success: true,
        service: 'Snell AI Assistant',
        question: aiHelp,
        ai_response: aiResponse,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get conversation history
    if (conversationId) {
      const conversation = snellChatHistory.find(c => c.id === conversationId);
      return new Response(JSON.stringify({
        success: true,
        service: 'Snell AI Conversation History',
        conversation_id: conversationId,
        conversation: conversation || null,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default help response
    return new Response(JSON.stringify({
      success: true,
      service: 'Snell AI API - Darmowy szybki asystent',
      help: {
        description: 'Bezpłatne modele Snell AI do różnych zastosowań',
        models: Object.keys(SNELL_MODELS),
        features: ['Szybkie odpowiedzi', 'Różne specjalizacje', 'Darmowe użytkowanie'],
        methods: {
          GET: 'Instrukcje, pomoc AI, modele i historia',
          POST: 'Rozmowy z modelami Snell'
        },
        parameters: {
          instructions: 'Szczegółowe instrukcje API',
          ai_help: 'Zadaj pytanie o modele Snell',
          models: 'Lista dostępnych modeli',
          conversation_id: 'Pobierz historię konwersacji'
        },
        examples: {
          help: '?ai_help=Który model Snell wybrać do analizy kodu?',
          instructions: '?instructions=true',
          models: '?models=true',
          history: '?conversation_id=snell_123abc'
        }
      },
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      service: 'Snell AI',
      error: error instanceof Error ? error.message : 'Nieznany błąd'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const { 
      message, 
      model = 'snell-chat', 
      temperature = 0.7,
      max_tokens = 1024,
      system_prompt = '',
      conversation_id,
      stream = false
    } = data;
    
    const env = (locals as any)?.runtime?.env;
    
    if (!message) {
      return new Response(JSON.stringify({
        success: false,
        service: 'Snell AI Chat',
        error: 'Brak wiadomości',
        message: 'Wymagana jest wiadomość do rozmowy'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate model
    if (!SNELL_MODELS[model as keyof typeof SNELL_MODELS]) {
      return new Response(JSON.stringify({
        success: false,
        service: 'Snell AI Chat',
        error: 'Nieznany model',
        message: `Dostępne modele: ${Object.keys(SNELL_MODELS).join(', ')}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const startTime = Date.now();
    
    // Find or create conversation
    let conversation = conversation_id ? 
      snellChatHistory.find(c => c.id === conversation_id) : null;
    
    if (!conversation) {
      conversation = {
        id: conversation_id || generateChatId(),
        messages: [],
        model,
        timestamp: Date.now()
      };
      snellChatHistory.unshift(conversation);
    }

    // Add system prompt if provided
    if (system_prompt && conversation.messages.length === 0) {
      conversation.messages.push({
        role: 'system',
        content: system_prompt,
        timestamp: Date.now()
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: Date.now()
    });

    // Generate response with Snell AI (simulated)
    let aiResponse = await generateSnellResponse(model, message, conversation.messages, {
      temperature,
      max_tokens,
      system_prompt
    });

    // Add AI response to conversation
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now()
    });

    const executionTime = Date.now() - startTime;
    const modelInfo = SNELL_MODELS[model as keyof typeof SNELL_MODELS];

    // Keep conversations manageable
    if (snellChatHistory.length > 50) {
      snellChatHistory.pop();
    }

    // Limit messages per conversation
    if (conversation.messages.length > 50) {
      conversation.messages = conversation.messages.slice(-30);
    }
    
    return new Response(JSON.stringify({
      success: true,
      service: 'Snell AI Chat',
      model: model,
      model_info: modelInfo,
      conversation_id: conversation.id,
      user_message: message,
      ai_response: aiResponse,
      conversation_length: conversation.messages.length,
      execution_time_ms: executionTime,
      parameters: {
        model,
        temperature,
        max_tokens,
        system_prompt: system_prompt ? 'Ustawiony' : 'Brak',
        stream
      },
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      service: 'Snell AI Chat',
      error: error instanceof Error ? error.message : 'Nieznany błąd rozmowy'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function generateSnellResponse(model: string, message: string, history: any[], options: any): Promise<string> {
  // Simulate Snell AI processing time (very fast)
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 800));
  
  const modelInfo = SNELL_MODELS[model as keyof typeof SNELL_MODELS];
  
  // Simulate different response styles based on model
  if (model === 'snell-code') {
    return `Jako Snell Code, specjalizuję się w programowaniu. 

Odpowiadając na: "${message}"

Oto moja analiza i sugestie dotyczące kodu/programowania:
- Sprawdzę składnię i strukturę
- Zaproponuję optymalizacje
- Wskażę potencjalne problemy
- Podam przykłady użycia

[To jest symulowana odpowiedź Snell Code - w rzeczywistości używałby prawdziwego modelu AI zoptymalizowanego pod kod]`;
  }
  
  if (model === 'snell-creative') {
    return `Jako Snell Creative, uwielbiam tworzyć! ✨

Na temat: "${message}"

Pozwól mi stworzyć coś inspirującego:
- Oryginalne pomysły i koncepcje  
- Kreatywne podejście do tematu
- Angażujące historie i opisy
- Artystyczne rozwiązania

[To jest symulowana odpowiedź Snell Creative - w prawdziwym modelu byłaby to twórcza, oryginalna treść]`;
  }
  
  // Default snell-chat response
  return `Cześć! Jestem Snell Chat - szybki i pomocny asystent AI. 🤖

Pytasz o: "${message}"

Oto moja odpowiedź:
- Postaram się pomóc w jasny sposób
- Odpowiem szybko i konkretnie  
- Jeśli potrzebujesz więcej szczegółów, pytaj śmiało
- Mogę pomóc z różnymi tematami

Czy jest coś konkretnego, z czym mogę dalej pomóc?

[To jest symulowana odpowiedź Snell Chat - prawdziwy model dałby bardziej naturalną konwersację]`;
}