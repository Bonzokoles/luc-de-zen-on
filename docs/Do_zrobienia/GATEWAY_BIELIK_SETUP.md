# Integracja Bielik 11B z Cloudflare AI Gateway - Instrukcja

**Data:** 2025-10-14
**Projekt:** mybonzo.com (Cloudflare Pages)
**Model:** Bielik-11B-v2.2-Instruct (speakleash)
**Cel:** Voice Assistant + Agent Orchestrator

---

## 1. OBECNA KONFIGURACJA

### Cloudflare
- **Account ID:** `7f490d58a478c6baccb0ae01ea1d87c3`
- **AI Gateway:** `bielik_gateway` (już utworzony)
- **Gateway URL:** `https://gateway.ai.cloudflare.com/v1/7f490d58a478c6baccb0ae01ea1d87c3/bielik_gateway`
- **Aplikacja:** mybonzo.com (Pages)

### Hugging Face
- **Model:** `speakleash/Bielik-11B-v2.2-Instruct`
- **Parametry:** 11.2B
- **Licencja:** Apache 2.0 (komercyjne OK)
- **Status:** Gated (dostęp już przyznany)
- **Token:** `env.HF_API_TOKEN` (już skonfigurowany)

### ZeroGPU (PRO)
- **Quota:** 25 min/dzień
- **Hardware:** Nvidia H200, 70GB VRAM
- **Koszt:** $0 (w ramach HF PRO)

---

## 2. ARCHITEKTURA SYSTEMU

```
User (Voice/Text)
    ↓
mybonzo.com (Pages)
    ↓
Cloudflare Function (/api/bielik)
    ↓
AI Gateway (bielik_gateway)
    ├─ Caching
    ├─ Analytics
    └─ Rate Limiting
    ↓
HF Inference API
    ↓
Bielik-11B na ZeroGPU
    │
    ├─ Voice Assistant (konwersacje)
    └─ Agent Orchestrator (routing)
```

---

## 3. STRUKTURA PROJEKTU

```
mybonzo.com/
├─ functions/
│  └─ api/
│     ├─ bielik-voice.ts      ← Voice Assistant endpoint
│     ├─ bielik-orchestrator.ts ← Agent Orchestrator endpoint
│     └─ bielik-common.ts      ← Shared utilities
├─ wrangler.toml               ← Config
└─ .env                        ← Secrets
```

---

## 4. KONFIGURACJA ENDPOINTS

### 4.1 Voice Assistant Endpoint
**Plik:** `functions/api/bielik-voice.ts`

```typescript
import { HfInference } from '@huggingface/inference';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { message, conversationHistory = [] } = await request.json();
    
    // Inicjalizacja HF przez AI Gateway
    const hf = new HfInference(env.HF_API_TOKEN);
    
    // System prompt dla voice assistant
    const systemPrompt = `Jesteś ZENON - polski asystent głosowy w aplikacji mybonzo.com.
Odpowiadasz zwięźle, naturalnie i pomocnie.
Używasz poznańskiej gwary sporadycznie dla charakteru.
Zawsze jesteś konkretny i merytoryczny.`;

    // Build conversation context
    const conversationContext = conversationHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    
    const fullPrompt = `${systemPrompt}\n\n${conversationContext}\nUser: ${message}\nAssistant:`;
    
    // Call przez Gateway
    const response = await fetch(
      `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/bielik_gateway/huggingface/speakleash/Bielik-11B-v2.2-Instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.HF_API_TOKEN}`,
          'Content-Type': 'application/json',
          // Cache control
          'cf-aig-cache-ttl': '3600',
          // Metadata for analytics
          'cf-aig-metadata': JSON.stringify({
            endpoint: 'voice-assistant',
            user_id: request.headers.get('x-user-id') || 'anonymous'
          })
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.7,
            top_p: 0.95,
            top_k: 50,
            repetition_penalty: 1.1,
            do_sample: true,
            return_full_text: false
          }
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    return new Response(JSON.stringify({
      response: result[0].generated_text.trim(),
      metadata: {
        model: 'Bielik-11B-v2.2-Instruct',
        tokens_used: result[0].details?.tokens?.length || 0
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

### 4.2 Agent Orchestrator Endpoint
**Plik:** `functions/api/bielik-orchestrator.ts`

```typescript
export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { task, context: taskContext } = await request.json();
    
    // System prompt dla orkiestratora
    const systemPrompt = `Jesteś orkiestratorem systemu ZENON.
Analizujesz zadania i decydujesz który agent/worker wywołać.

DOSTĘPNE AGENTY:
1. file_agent - operacje na plikach
2. search_agent - wyszukiwanie informacji
3. code_agent - generowanie/analiza kodu
4. data_agent - analiza danych
5. memory_agent - zarządzanie pamięcią

ODPOWIADAJ W JSON:
{
  "agent": "nazwa_agenta",
  "action": "akcja_do_wykonania",
  "parameters": { "param1": "value1" },
  "reasoning": "krótkie uzasadnienie"
}`;

    const fullPrompt = `${systemPrompt}\n\nZadanie: ${task}\nKontekst: ${JSON.stringify(taskContext)}\n\nDecyzja:`;
    
    const response = await fetch(
      `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/bielik_gateway/huggingface/speakleash/Bielik-11B-v2.2-Instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.HF_API_TOKEN}`,
          'Content-Type': 'application/json',
          'cf-aig-cache-ttl': '0', // Orchestrator decisions nie cache'ujemy
          'cf-aig-metadata': JSON.stringify({
            endpoint: 'orchestrator',
            task_type: task
          })
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 256,
            temperature: 0.3, // Niższa dla bardziej deterministycznych decyzji
            top_p: 0.9,
            repetition_penalty: 1.0,
            return_full_text: false
          }
        })
      }
    );
    
    const result = await response.json();
    const decision = JSON.parse(result[0].generated_text.trim());
    
    return new Response(JSON.stringify({
      decision,
      timestamp: Date.now()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      fallback_agent: 'default'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

### 4.3 Shared Utilities
**Plik:** `functions/api/bielik-common.ts`

```typescript
export const BIELIK_CONFIG = {
  model: 'speakleash/Bielik-11B-v2.2-Instruct',
  gatewayUrl: 'https://gateway.ai.cloudflare.com/v1/7f490d58a478c6baccb0ae01ea1d87c3/bielik_gateway',
  
  // Parametry dla różnych use cases
  voiceParams: {
    max_new_tokens: 512,
    temperature: 0.7,
    top_p: 0.95,
    repetition_penalty: 1.1
  },
  
  orchestratorParams: {
    max_new_tokens: 256,
    temperature: 0.3,
    top_p: 0.9,
    repetition_penalty: 1.0
  },
  
  analysisParams: {
    max_new_tokens: 1024,
    temperature: 0.5,
    top_p: 0.92,
    repetition_penalty: 1.05
  }
};

export async function callBielik(
  env: any,
  prompt: string,
  params: any = BIELIK_CONFIG.voiceParams,
  metadata: any = {}
) {
  const response = await fetch(
    `${BIELIK_CONFIG.gatewayUrl}/huggingface/${BIELIK_CONFIG.model}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.HF_API_TOKEN}`,
        'Content-Type': 'application/json',
        'cf-aig-metadata': JSON.stringify(metadata)
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: params
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Bielik API error: ${response.status}`);
  }
  
  return response.json();
}
```

---

## 5. KONFIGURACJA ŚRODOWISKA

### wrangler.toml
```toml
name = "mybonzo"
compatibility_date = "2025-01-01"

[env.production]
vars = { CF_ACCOUNT_ID = "7f490d58a478c6baccb0ae01ea1d87c3" }

# Secrets (set via: wrangler secret put HF_API_TOKEN)
# HF_API_TOKEN = "hf_..."
```

### .env.local (development)
```bash
CF_ACCOUNT_ID=7f490d58a478c6baccb0ae01ea1d87c3
HF_API_TOKEN=hf_your_token_here
```

---

## 6. DEPLOYMENT

### Setup Secrets
```bash
# Set HF token
wrangler secret put HF_API_TOKEN

# Deploy
wrangler pages deploy
```

### Testowanie
```bash
# Voice Assistant
curl -X POST https://mybonzo.com/api/bielik-voice \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Cześć, jak się masz?",
    "conversationHistory": []
  }'

# Orchestrator
curl -X POST https://mybonzo.com/api/bielik-orchestrator \
  -H "Content-Type: application/json" \
  -d '{
    "task": "przeanalizuj ten plik CSV",
    "context": {"file": "data.csv"}
  }'
```

---

## 7. AI GATEWAY - KONFIGURACJA ZAAWANSOWANA

### 7.1 Dashboard Settings
URL: https://dash.cloudflare.com/7f490d58a478c6baccb0ae01ea1d87c3/ai/ai-gateway/bielik_gateway

**Włącz:**
- ✅ Caching (TTL: 1h dla voice, 0 dla orchestrator)
- ✅ Analytics
- ✅ Rate Limiting (100 req/min per IP)
- ✅ Logging (przechowuj przez 30 dni)

### 7.2 Cache Strategy
```typescript
// W headers requestu:
'cf-aig-cache-ttl': '3600'        // Voice - cache przez 1h
'cf-aig-cache-ttl': '0'           // Orchestrator - no cache
'cf-aig-skip-cache': 'true'       // Force bypass cache
```

### 7.3 Custom Metadata (Analytics)
```typescript
'cf-aig-metadata': JSON.stringify({
  endpoint: 'voice-assistant',
  user_id: userId,
  conversation_id: conversationId,
  task_type: 'greeting'
})
```

---

## 8. MONITORING & ANALYTICS

### Dashboard Metrics
- **Request count** - liczba wywołań
- **Cache hit rate** - % requestów z cache
- **Average latency** - średnia latencja
- **Token usage** - zużycie tokenów
- **Error rate** - % błędów
- **Cost tracking** - koszty (jeśli płatne)

### Quota Monitoring (ZeroGPU)
- **25 min/dzień** na koncie PRO
- ~300-500 requestów/dzień (przy 3-5s/request)
- Monitor w HF Settings → Billing

---

## 9. BEST PRACTICES

### 9.1 Token Optimization
```typescript
// Skracaj prompty - Bielik rozumie kontekst
const shortPrompt = `User: ${message}\nAssistant:`;

// Zamiast:
const longPrompt = `Jesteś asystentem... [200 słów]...\nUser: ${message}`;
```

### 9.2 Context Management
```typescript
// Ogranicz historię konwersacji do ostatnich N wiadomości
const recentHistory = conversationHistory.slice(-5);
```

### 9.3 Error Handling
```typescript
// Fallback na prostszą odpowiedź
catch (error) {
  if (error.message.includes('quota')) {
    return { response: "Wykorzystano dzienny limit. Spróbuj później." };
  }
  // ... inne errory
}
```

### 9.4 Rate Limiting Client-Side
```typescript
// Throttle requestów w JS
const throttle = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const debouncedBielik = throttle(callBielik, 1000);
```

---

## 10. TROUBLESHOOTING

### Problem: 401 Unauthorized
**Przyczyna:** Nieprawidłowy HF token
**Rozwiązanie:** 
```bash
wrangler secret put HF_API_TOKEN
# Wklej nowy token z HF Settings
```

### Problem: 429 Too Many Requests (ZeroGPU Quota)
**Przyczyna:** Wykorzystano 25 min/dzień
**Rozwiązanie:**
- Poczekaj do następnego dnia
- Optymalizuj prompty (krótsze = mniej quota)
- Włącz caching (zmniejsza liczbę requestów do HF)

### Problem: Slow Response (>10s)
**Przyczyna:** Cold start ZeroGPU
**Rozwiązanie:**
- Pierwsze wywołanie w ciągu dnia może trwać 10-15s
- Kolejne będą szybsze (model w pamięci)
- Dodaj loading indicator w UI

### Problem: Model nie rozumie polskiego
**Przyczyna:** Nieprawidłowy model endpoint
**Rozwiązanie:**
```typescript
// Upewnij się że używasz:
'speakleash/Bielik-11B-v2.2-Instruct'
// NIE:
'gpt2' // to był tylko test
```

---

## 11. PRZYSZŁE ROZSZERZENIA

### 11.1 Multi-Model Setup
```typescript
// Dodaj fallback na mniejszy model przy quota exhaustion
const models = {
  primary: 'speakleash/Bielik-11B-v2.2-Instruct',
  fallback: 'speakleash/Bielik-7B-Instruct-v0.1'
};
```

### 11.2 Function Calling
```typescript
// Bielik 11B wspiera function calling (eksperymentalne)
const tools = [
  { name: 'search', description: 'Wyszukaj informacje' },
  { name: 'file_read', description: 'Odczytaj plik' }
];
```

### 11.3 Streaming Responses
```typescript
// Dla lepszego UX w voice
const stream = await hf.textGenerationStream({
  inputs: prompt,
  parameters: params
});

for await (const chunk of stream) {
  // Send chunk to client
}
```

---

## 12. KOSZTY & LIMITY

### ZeroGPU (PRO)
- ✅ **Koszt:** $0 (w ramach $9/m HF PRO)
- ✅ **Quota:** 25 min/dzień
- ✅ **Requests:** ~300-500/dzień

### Cloudflare Pages
- ✅ **Functions:** 100K requests/dzień FREE
- ✅ **AI Gateway:** FREE tier (unlimited)
- ✅ **Bandwidth:** 100 GB/miesiąc FREE

### Scalowanie
Jeśli przekroczysz limity:
1. **ZeroGPU quota** → Dedicated Space ($0.40-4.00/h)
2. **Pages Functions** → Workers Paid ($5/10M requests)

---

## 13. KONTAKT & WSPARCIE

### Cloudflare
- Dashboard: https://dash.cloudflare.com/7f490d58a478c6baccb0ae01ea1d87c3
- Docs: https://developers.cloudflare.com/ai-gateway

### Hugging Face
- Dashboard: https://huggingface.co/settings/tokens
- Bielik: https://huggingface.co/speakleash/Bielik-11B-v2.2-Instruct

### Projekt
- Lokalizacja: Q:\mybonzo\luc-de-zen-on
- Docs: Q:\mybonzo\luc-de-zen-on\docs

---

**Last updated:** 2025-10-14 by JIMBO
**Status:** Ready for implementation ✅
