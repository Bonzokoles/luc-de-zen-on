import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

export const GET = async () => {
  return createSuccessResponse({
    message: 'Chat API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST request with { prompt: "your message" }'
  });
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const POST = async ({ request, locals }: { request: Request; locals: any }) => {
  try {
    const body = await request.json() as {
      prompt: string;
      model?: string;
      temperature?: number;
      system?: string;
      language?: 'pl' | 'en' | 'auto';
      usePolaczek?: boolean;
    };
    const env = locals.runtime.env;

    if (!env.AI) {
      return createErrorResponse('Cloudflare AI nie jest dostępny', 500, {
        answer: 'Przepraszam, system AI jest obecnie niedostępny.'
      });
    }

    // Integracja z Polaczek AI Assistant
    if (body.usePolaczek || body.model === 'polaczek') {
      try {
        const polaczekResponse = await fetch(new URL('/api/polaczek-chat', request.url), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: body.prompt,
            model: body.model || 'polaczek',
            temperature: body.temperature,
            language: body.language || 'pl'
          })
        });

        if (polaczekResponse.ok) {
          const polaczekData = await polaczekResponse.json();
          return createSuccessResponse({
            answer: polaczekData.data?.answer || polaczekData.answer,
            modelUsed: 'polaczek-assistant',
            via: 'polaczek-integration'
          });
        }
      } catch (polaczekError) {
        console.warn('Polaczek fallback failed, using regular AI:', polaczekError);
      }
    }

    const language = body.language === 'en' ? 'en' : 'pl';
    const modelId = body.model?.startsWith('@cf/') ? body.model : (
      body.model === 'qwen-pl' ? '@cf/qwen/qwen2.5-7b-instruct' :
        body.model === 'llama-8b' ? '@cf/meta/llama-3.1-8b-instruct' :
          body.model === 'gemma' ? '@cf/google/gemma-3-12b-it' :
            '@cf/google/gemma-3-12b-it' // Default to Gemma instead of Llama
    );

    const systemPrompt = body.system ?? (language === 'en'
      ? `You are MyBonzo AI Assistant - a helpful AI for Polish AI platform. 

🎯 WHAT IS MYBONZO:
MyBonzo is an advanced AI platform offering:
• AI Image Generators (Stable Diffusion, Flux)
• Polish AI models (Bielik, POLACZEK) 
• Analytics and business tools
• AI agent system for developers
• Cloudflare Workers AI integration
• 6 AI models: Gemma, Llama, Qwen, Mistral, Bielik, POLACZEK

🚨 ABSOLUTE PROHIBITIONS:
NEVER describe MyBonzo as:
❌ "My Bonzo" dog meme or internet humor
❌ Random text generator or fictional character
❌ Financial management system
❌ Expense tracking or budgeting tool

✅ ONLY TRUTH: MyBonzo = AI PLATFORM with image generators, 6 AI models, BigQuery analytics, Cloudflare Workers AI!`
      : `Jesteś MyBonzo AI Assistant - pomocnym asystentem polskiej platformy AI. 

🎯 CZYM JEST MYBONZO:
MyBonzo to zaawansowana platforma AI oferująca:
• Generator obrazów AI (Stable Diffusion, Flux)  
• Polskie modele AI (Bielik, POLACZEK)
• Narzędzia analityczne i biznesowe
• System agentów AI dla deweloperów
• Cloudflare Workers AI integration
• 6 modeli AI: Gemma, Llama, Qwen, Mistral, Bielik, POLACZEK

🚀 GŁÓWNE FUNKCJE:
• 🎨 AI Art Generator - tworzenie obrazów
• 🧠 Chat z AI - rozmowy z modelami
• 📊 Analiza danych - BigQuery integration  
• 🎯 Wildcards System - rozszerzanie promptów
• 🔊 Voice AI - synteza mowy
• 🤖 AI Workers - różne modele AI
• 🛡️ Admin Panel - zarządzanie systemem

🚨 ABSOLUTNE ZAKAZY:
NIGDY nie opisuj MyBonzo jako:
❌ Memu internetowego z psem "My Bonzo"
❌ Humorystycznego rysunku psa w hełmie  
❌ Absurdalnego memu z problemami codziennymi
❌ Systemu zarządzania finansami osobistymi
❌ Aplikacji do śledzenia wydatków lub budżetu
❌ Platformy dropshippingu z Chin
❌ Generatora losowych tekstów AI
❌ Fikcyjnej postaci "Bonzo"

🎯 JEDYNA PRAWDA:
MyBonzo = PLATFORMA AI z narzędziami:
- Generator obrazów (Stable Diffusion/Flux)
- 6 modeli AI (Gemma, Llama, Qwen, Mistral, Bielik, POLACZEK) 
- BigQuery Analytics
- Cloudflare Workers AI
- Admin Panel i Voice AI

⚡ ZAWSZE odpowiadaj TYLKO o rzeczywistych funkcjach MyBonzo jako platformy AI!`);

    // Użyj Cloudflare Workers AI z wybranym modelem
    const response = await env.AI.run(modelId, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: body.prompt }
      ],
      temperature: typeof body.temperature === 'number' ? body.temperature : 0.6,
    });

    return createSuccessResponse({
      answer: response.response || "Przepraszam, nie udało się wygenerować odpowiedzi.",
      modelUsed: modelId
    });

  } catch (error) {
    console.error('AI_CHAT Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return createErrorResponse(errorMessage, 500, {
      context: 'AI_CHAT',
      timestamp: new Date().toISOString()
    });
  }
};
