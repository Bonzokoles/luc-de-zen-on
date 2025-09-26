import type { APIRoute } from 'astro';

// Chat history tracking
const openrouterHistory: Array<{
  id: string;
  messages: Array<{ role: string; content: string; timestamp: number }>;
  model: string;
  timestamp: number;
  cost?: number;
}> = [];

// OpenRouter available models (popular free and paid models)
const OPENROUTER_MODELS = {
  // Free models
  'microsoft/wizardlm-2-8x22b': {
    name: 'WizardLM-2 8x22B',
    description: 'Zaawansowany model od Microsoft - darmowy',
    context_length: 65536,
    pricing: { prompt: 0.000063, completion: 0.000063 },
    free: true
  },
  'meta-llama/llama-3.1-8b-instruct': {
    name: 'Llama 3.1 8B Instruct',
    description: 'Meta Llama 3.1 - szybki i darmowy',
    context_length: 131072,
    pricing: { prompt: 0.000018, completion: 0.000018 },
    free: true
  },
  'google/gemma-2-9b-it': {
    name: 'Gemma 2 9B IT',
    description: 'Google Gemma 2 - darmowy model instrukcyjny',
    context_length: 8192,
    pricing: { prompt: 0.000020, completion: 0.000020 },
    free: true
  },
  // Popular paid models
  'anthropic/claude-3.5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    description: 'Najnowszy Claude od Anthropic - premium',
    context_length: 200000,
    pricing: { prompt: 0.003, completion: 0.015 },
    free: false
  },
  'openai/gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    description: 'OpenAI GPT-4 Turbo - zaawansowany',
    context_length: 128000,
    pricing: { prompt: 0.01, completion: 0.03 },
    free: false
  },
  'cohere/command-r-plus': {
    name: 'Command R+',
    description: 'Cohere Command R+ - business AI',
    context_length: 128000,
    pricing: { prompt: 0.003, completion: 0.015 },
    free: false
  }
};

// AI Functions for OpenRouter
async function getOpenRouterInstructions() {
  return {
    title: 'OpenRouter API - Dostęp do wielu modeli AI',
    description: 'Unified API do różnych modeli AI przez OpenRouter',
    sections: {
      'Dostępne modele': OPENROUTER_MODELS,
      'Funkcje': {
        multi_model_access: 'Dostęp do modeli od różnych firm',
        unified_api: 'Jeden interfejs do wielu dostawców',
        cost_tracking: 'Śledzenie kosztów użycia',
        model_comparison: 'Porównanie odpowiedzi różnych modeli',
        fallback_models: 'Automatyczne przełączanie przy błędach',
        streaming: 'Streaming odpowiedzi dla lepszego UX'
      },
      'Parametry POST': {
        message: 'string (wymagane) - wiadomość użytkownika',
        model: 'string - model OpenRouter',
        temperature: 'number - kreatywność 0.0-1.0',
        max_tokens: 'number - maksymalna długość odpowiedzi',
        system_prompt: 'string - instrukcje systemowe',
        conversation_id: 'string - ID konwersacji',
        stream: 'boolean - czy streamować odpowiedź',
        top_p: 'number - nucleus sampling parameter',
        frequency_penalty: 'number - kara za powtarzanie'
      }
    },
    examples: {
      'Darmowy model': '{"message": "Hello!", "model": "meta-llama/llama-3.1-8b-instruct"}',
      'Premium model': '{"message": "Analyze this data", "model": "anthropic/claude-3.5-sonnet"}',
      'Z systemem': '{"message": "Write code", "system_prompt": "You are a coding expert", "model": "microsoft/wizardlm-2-8x22b"}',
      'Streaming': '{"message": "Tell a story", "model": "google/gemma-2-9b-it", "stream": true}'
    },
    best_practices: {
      models: 'Wybierz model odpowiedni do zadania i budżetu',
      pricing: 'Sprawdzaj koszty - modele premium mogą być drogie',
      fallback: 'Używaj darmowych modeli jako backup',
      streaming: 'Włączaj streaming dla długich odpowiedzi',
      context: 'Wykorzystuj długie konteksty dla złożonych zadań'
    }
  };
}

async function getOpenRouterAIHelp(env: any, question: string) {
  try {
    const prompt = `Jesteś ekspertem od OpenRouter i różnych modeli AI. 
    Użytkownik pyta: "${question}"
    
    Pomóż użytkownikowi z:
    - Wyborem właściwego modelu OpenRouter
    - Optymalizacją kosztów i wydajności
    - Porównaniem modeli (Claude, GPT-4, Llama, Gemma)
    - Rozwiązywaniem problemów z API
    - Strategiami używania darmowych vs. płatnych modeli
    
    Odpowiedz po polsku z konkretnymi wskazówkami.`;

    if (env.AI) {
      const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: prompt }]
      });
      return response.response || 'Nie udało się uzyskać odpowiedzi AI';
    }
    
    return 'AI obecnie niedostępne. OpenRouter oferuje dostęp do wielu modeli - wybierz według zadania i budżetu.';
  } catch (error) {
    return `Błąd AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}`;
  }
}

function generateChatId(): string {
  return 'or_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const instructions = url.searchParams.get('instructions');
    const aiHelp = url.searchParams.get('ai_help');
    const models = url.searchParams.get('models');
    const conversationId = url.searchParams.get('conversation_id');
    const freeModels = url.searchParams.get('free_models');
    
    const env = (globalThis as any).cloudflareEnv || {};

    // Handle free models list request
    if (freeModels) {
      const free = Object.entries(OPENROUTER_MODELS)
        .filter(([_, info]) => info.free)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        
      return new Response(JSON.stringify({
        success: true,
        service: 'OpenRouter - Darmowe modele',
        free_models: free,
        count: Object.keys(free).length,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle models list request
    if (models) {
      return new Response(JSON.stringify({
        success: true,
        service: 'OpenRouter - Wszystkie modele',
        models: OPENROUTER_MODELS,
        count: Object.keys(OPENROUTER_MODELS).length,
        free_count: Object.values(OPENROUTER_MODELS).filter(m => m.free).length,
        paid_count: Object.values(OPENROUTER_MODELS).filter(m => !m.free).length,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle instructions request
    if (instructions) {
      const openrouterInstructions = await getOpenRouterInstructions();
      return new Response(JSON.stringify({
        success: true,
        service: 'OpenRouter - Instrukcje',
        instructions: openrouterInstructions,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle AI help request
    if (aiHelp) {
      const aiResponse = await getOpenRouterAIHelp(env, aiHelp);
      return new Response(JSON.stringify({
        success: true,
        service: 'OpenRouter AI Assistant',
        question: aiHelp,
        ai_response: aiResponse,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get conversation history
    if (conversationId) {
      const conversation = openrouterHistory.find(c => c.id === conversationId);
      return new Response(JSON.stringify({
        success: true,
        service: 'OpenRouter Conversation History',
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
      service: 'OpenRouter API - Dostęp do wielu modeli AI',
      help: {
        description: 'Unified API do modeli od OpenAI, Anthropic, Meta, Google i innych',
        total_models: Object.keys(OPENROUTER_MODELS).length,
        free_models: Object.values(OPENROUTER_MODELS).filter(m => m.free).length,
        features: ['Multi-model access', 'Cost tracking', 'Unified interface', 'Streaming'],
        methods: {
          GET: 'Instrukcje, pomoc AI, modele i historia',
          POST: 'Rozmowy z modelami OpenRouter'
        },
        parameters: {
          instructions: 'Szczegółowe instrukcje API',
          ai_help: 'Zadaj pytanie o OpenRouter',
          models: 'Lista wszystkich modeli',
          free_models: 'Lista tylko darmowych modeli',
          conversation_id: 'Pobierz historię konwersacji'
        },
        examples: {
          help: '?ai_help=Który model wybrać do analizy kodu?',
          instructions: '?instructions=true',
          models: '?models=true',
          free: '?free_models=true'
        }
      },
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      service: 'OpenRouter',
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
      model = 'meta-llama/llama-3.1-8b-instruct', 
      temperature = 0.7,
      max_tokens = 2048,
      system_prompt = '',
      conversation_id,
      stream = false,
      top_p = 1.0,
      frequency_penalty = 0.0
    } = data;
    
    const env = (locals as any)?.runtime?.env;
    
    if (!message) {
      return new Response(JSON.stringify({
        success: false,
        service: 'OpenRouter Chat',
        error: 'Brak wiadomości',
        message: 'Wymagana jest wiadomość do rozmowy'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate model
    if (!OPENROUTER_MODELS[model as keyof typeof OPENROUTER_MODELS]) {
      return new Response(JSON.stringify({
        success: false,
        service: 'OpenRouter Chat',
        error: 'Nieznany model',
        available_models: Object.keys(OPENROUTER_MODELS),
        free_models: Object.keys(OPENROUTER_MODELS).filter(k => 
          OPENROUTER_MODELS[k as keyof typeof OPENROUTER_MODELS].free
        )
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const startTime = Date.now();
    
    // Find or create conversation
    let conversation = conversation_id ? 
      openrouterHistory.find(c => c.id === conversation_id) : null;
    
    if (!conversation) {
      conversation = {
        id: conversation_id || generateChatId(),
        messages: [],
        model,
        timestamp: Date.now(),
        cost: 0
      };
      openrouterHistory.unshift(conversation);
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

    // Get OpenRouter API key
    const openrouterApiKey = env?.OPENROUTER_API_KEY || 'OPENROUTER_API_KEY_SECRET';
    
    // Generate response through OpenRouter
    let aiResponse = '';
    let estimatedCost = 0;
    
    if (openrouterApiKey && openrouterApiKey !== 'OPENROUTER_API_KEY_SECRET') {
      try {
        aiResponse = await callOpenRouterAPI(openrouterApiKey, model, conversation.messages, {
          temperature,
          max_tokens,
          top_p,
          frequency_penalty,
          stream
        });
        
        // Estimate cost (very rough)
        const modelInfo = OPENROUTER_MODELS[model as keyof typeof OPENROUTER_MODELS];
        const inputTokens = JSON.stringify(conversation.messages).length / 4; // rough estimate
        const outputTokens = aiResponse.length / 4; // rough estimate
        estimatedCost = (inputTokens * modelInfo.pricing.prompt + outputTokens * modelInfo.pricing.completion) / 1000;
        
      } catch (error) {
        aiResponse = `Błąd OpenRouter API: ${error instanceof Error ? error.message : 'Nieznany błąd'}`;
      }
    } else {
      aiResponse = await generateMockOpenRouterResponse(model, message, conversation.messages);
    }

    // Add AI response to conversation
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now()
    });

    const executionTime = Date.now() - startTime;
    const modelInfo = OPENROUTER_MODELS[model as keyof typeof OPENROUTER_MODELS];

    // Update conversation cost
    if (conversation.cost !== undefined) {
      conversation.cost += estimatedCost;
    }

    // Keep conversations manageable
    if (openrouterHistory.length > 100) {
      openrouterHistory.pop();
    }

    // Limit messages per conversation
    if (conversation.messages.length > 50) {
      conversation.messages = conversation.messages.slice(-30);
    }
    
    return new Response(JSON.stringify({
      success: true,
      service: 'OpenRouter Chat',
      model: model,
      model_info: modelInfo,
      conversation_id: conversation.id,
      user_message: message,
      ai_response: aiResponse,
      conversation_length: conversation.messages.length,
      execution_time_ms: executionTime,
      estimated_cost_usd: estimatedCost,
      total_conversation_cost: conversation.cost || 0,
      parameters: {
        model,
        temperature,
        max_tokens,
        top_p,
        frequency_penalty,
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
      service: 'OpenRouter Chat',
      error: error instanceof Error ? error.message : 'Nieznany błąd rozmowy'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function callOpenRouterAPI(apiKey: string, model: string, messages: any[], options: any): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://mybonzo.com',
      'X-Title': 'MyBonzo AI Assistant'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      top_p: options.top_p,
      frequency_penalty: options.frequency_penalty,
      stream: options.stream
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Brak odpowiedzi z OpenRouter';
}

async function generateMockOpenRouterResponse(model: string, message: string, history: any[]): Promise<string> {
  // Simulate OpenRouter processing time
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const modelInfo = OPENROUTER_MODELS[model as keyof typeof OPENROUTER_MODELS];
  
  return `[DEMO - ${modelInfo.name}]

Odpowiadając na: "${message}"

To jest symulowana odpowiedź z modelu ${modelInfo.name} przez OpenRouter API.

W prawdziwej implementacji:
- Używałby się prawdziwy klucz API OpenRouter
- Model generowałby naturalną odpowiedź
- Koszty byłyby prawdziwe (około $${modelInfo.pricing.prompt}/1K tokenów)
- Dostępne byłyby wszystkie funkcje modelu

Model: ${model}
Typ: ${modelInfo.free ? 'Darmowy' : 'Płatny'}  
Kontekst: ${modelInfo.context_length.toLocaleString()} tokenów
Koszt: $${modelInfo.pricing.prompt}/1K prompt + $${modelInfo.pricing.completion}/1K completion

Aby użyć prawdziwego API, skonfiguruj OPENROUTER_API_KEY w zmiennych środowiskowych Cloudflare.`;
}