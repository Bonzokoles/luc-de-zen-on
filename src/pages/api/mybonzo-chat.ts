/**
 * MyBonzo Chat API - Integration endpoint for MyBonzo Assistant
 * Provides Polish AI support for Cloudflare Workers development
 */

import { createOPTIONSHandler, createSuccessResponse, createErrorResponse } from '@/utils/corsUtils';

// CORS support
export const OPTIONS = createOPTIONSHandler(['POST', 'GET']);

export async function GET({ request }) {
  return createSuccessResponse({
    message: 'MyBonzo Chat is active and ready for POST requests.',
    status: 'ok'
  });
}

export async function POST({ request, locals }) {
  try {
    const { prompt, context, language = 'pl' } = await request.json();
    
    if (!prompt) {
      return createErrorResponse('Prompt is required');
    }
    
    // MyBonzo Assistant processing
    const response = await processMyBonzoRequest(prompt, context, language, locals);
    
    return createSuccessResponse({
      response,
      model: 'MyBonzo Assistant v1.0',
      language,
      specialization: ['cloudflare-workers', 'polish-language', 'ai-agents'],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('MyBonzo Chat error:', error);
    return createErrorResponse(`MyBonzo Assistant error: ${error.message}`);
  }
}

async function processMyBonzoRequest(prompt, context, language, locals) {
  const promptLower = prompt.toLowerCase();
  
  // Check if we have Cloudflare AI available
  const env = locals?.runtime?.env;
  
  // Enhanced responses using AI if available
  if (env?.AI) {
    return await generateEnhancedResponse(prompt, context, language, env);
  }
  
  // Fallback to pattern-based responses
  return await generatePatternResponse(prompt, context, language);
}

async function generateEnhancedResponse(prompt, context, language, env) {
  const systemPrompt = `Jesteś MyBonzo Assistant - polski specjalista od Cloudflare Workers i AI Agents.

SPECJALIZACJE:
- Cloudflare Workers development (JavaScript/TypeScript)
- AI Agents implementation i konfiguracja
- Polish language technical support
- WebSocket i REST API development  
- Deployment automation (Wrangler CLI)
- KV Storage integration

STYL ODPOWIEDZI:
- Używaj polskiego języka
- Podawaj konkretne przykłady kodu
- Dodawaj emoji dla lepszej czytelności
- Zawsze uwzględniaj best practices
- Wspieraj polskich deweloperów

KONTEKST: ${context || 'Brak dodatkowego kontekstu'}

Odpowiedz w języku polskim na pytanie użytkownika, uwzględniając Twoje specjalizacje.`;

  try {
    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1024,
      temperature: 0.7
    });
    
    return aiResponse.response || await generatePatternResponse(prompt, context, language);
    
  } catch (error) {
    console.error('AI generation failed, using patterns:', error);
    return await generatePatternResponse(prompt, context, language);
  }
}

async function generatePatternResponse(prompt, context, language) {
  const promptLower = prompt.toLowerCase();
  
  // Cloudflare Workers
  if (promptLower.includes('worker') || promptLower.includes('cloudflare')) {
    return `🔧 **Cloudflare Worker - MyBonzo Assistant**

Aby utworzyć Cloudflare Worker:

1. **Podstawowy Worker:**
\`\`\`javascript
export default {
  async fetch(request, env, ctx) {
    return new Response('Hello from MyBonzo!', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
};
\`\`\`

2. **Konfiguracja wrangler.toml:**
\`\`\`toml
name = "my-worker"
main = "./src/worker.js"
compatibility_date = "2024-01-01"
\`\`\`

3. **Deploy:**
\`\`\`bash
npx wrangler deploy
\`\`\`

💡 **MyBonzo Tip:** Używaj TypeScript dla lepszej kontroli typów!`;
  }
  
  // AI Agents
  if (promptLower.includes('agent') || promptLower.includes('ai')) {
    return `🤖 **AI Agent - MyBonzo Assistant**

Konfiguracja AI Agent:

1. **Agent Definition:**
\`\`\`typescript
const myAgent = {
  id: 'mybonzo-agent',
  name: 'MyBonzo Helper',
  instructions: 'Polish AI assistant for developers',
  capabilities: ['cloudflare', 'polish-support']
};
\`\`\`

2. **KV Storage:**
\`\`\`javascript
await env.AGENTS.put('mybonzo', JSON.stringify(myAgent));
\`\`\`

3. **API Integration:**
\`\`\`typescript
export async function POST({ request, locals }) {
  const agent = await locals.runtime.env.AGENTS.get('mybonzo');
  return new Response(JSON.stringify({ agent }));
}
\`\`\`

🎯 **MyBonzo Features:** Native Polish support + Cloudflare integration!`;
  }
  
  // API Development
  if (promptLower.includes('api') || promptLower.includes('endpoint')) {
    return `🌐 **API Development - MyBonzo Assistant**

Tworzenie API endpoints:

1. **Astro API Route:**
\`\`\`typescript
// src/pages/api/my-endpoint.ts
export async function POST({ request, locals }) {
  const data = await request.json();
  
  return new Response(JSON.stringify({
    success: true,
    data,
    source: 'MyBonzo API'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
\`\`\`

2. **CORS Support:**
\`\`\`typescript
export const OPTIONS = createOPTIONSHandler(['POST', 'GET']);
\`\`\`

🔗 **MyBonzo Integration:** Ready for Cloudflare ecosystem!`;
  }
  
  // General response
  return `👋 **MyBonzo Assistant**

Cześć! Jestem MyBonzo Assistant - Twój polski AI specjalista.

**Mogę pomóc z:**
🔧 Cloudflare Workers development
🤖 AI Agents implementation
🌐 API & WebSocket development
🚀 Deployment automation
🇵🇱 Polish language tech support

**Przykładowe pytania:**
- "Jak utworzyć Cloudflare Worker?"
- "Konfiguracja AI Agent"
- "Integracja z KV Storage"
- "WebSocket API setup"

**Twoje pytanie:** ${prompt}

Podaj więcej szczegółów, a pomogę Ci rozwiązać problem! 💪

**Kontekst:** ${context || 'Brak kontekstu - podaj więcej informacji dla lepszej pomocy'}`;
}