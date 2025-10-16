# Integracja Bielik 11B z Cloudflare AI Gateway - Kompletna Instrukcja

**Data:** 2025-10-14
**Projekt:** mybonzo.com (Cloudflare Pages)
**Model:** Bielik-11B-v2.2-Instruct (speakleash)
**Cel:** Voice Assistant + Agent Orchestrator

---

## 🔑 AKTUALNE DANE DOSTĘPOWE

### Cloudflare

- **Account ID:** `7f490d58a478c6baccb0ae01ea1d87c3`
- **AI Gateway:** `bielik_gateway`
- **Gateway URL:** `https://gateway.ai.cloudflare.com/v1/{ACCOUNT_ID}/{GATEWAY_NAME}`
- **Gateway Token:** `{GATEWAY_TOKEN}`
- **Aplikacja:** mybonzo.com (Pages → luc-de-zen-on)

### Hugging Face

- **Model:** `speakleash/Bielik-11B-v2.2-Instruct`
- **API Token:** `{HF_TOKEN}`
- **Parametry:** 11.2B
- **Licencja:** Apache 2.0 (komercyjne OK)
- **Status:** Gated (dostęp już przyznany)

### ZeroGPU (PRO)

- **Quota:** 25 min/dzień
- **Hardware:** Nvidia H200, 70GB VRAM
- **Koszt:** $0 (w ramach HF PRO $9/m)

---

## 📋 ARCHITEKTURA SYSTEMU

```
User (Voice/Text)
    ↓
mybonzo.com (Pages)
    ↓
Cloudflare Function (/api/bielik-*)
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

## 📂 STRUKTURA PROJEKTU

```
Q:\mybonzo\luc-de-zen-on\
├─ functions/
│  └─ api/
│     ├─ bielik-voice.ts      ← Voice Assistant endpoint
│     ├─ bielik-orchestrator.ts ← Agent Orchestrator endpoint
│     └─ bielik-common.ts      ← Shared utilities
├─ wrangler.toml               ← Config (dodaj HF_API_TOKEN do vars)
├─ .env                        ← Local secrets
└─ .dev.vars                   ← Dev secrets
```

---

## 🚀 IMPLEMENTACJA KROK PO KROKU

### KROK 1: Utwórz strukturę katalogów

```bash
# W głównym katalogu projektu
mkdir -p functions/api
```

### KROK 2: Utwórz plik `functions/api/bielik-common.ts`

```typescript
// functions/api/bielik-common.ts
export const BIELIK_CONFIG = {
  accountId: "7f490d58a478c6baccb0ae01ea1d87c3",
  gatewayName: "bielik_gateway",
  model: "speakleash/Bielik-11B-v2.2-Instruct",

  // Gateway URL
  get gatewayUrl() {
    return `https://gateway.ai.cloudflare.com/v1/${this.accountId}/${this.gatewayName}`;
  },

  // Parametry dla różnych use cases
  voiceParams: {
    max_new_tokens: 512,
    temperature: 0.7,
    top_p: 0.95,
    top_k: 50,
    repetition_penalty: 1.1,
    do_sample: true,
    return_full_text: false,
  },

  orchestratorParams: {
    max_new_tokens: 256,
    temperature: 0.3,
    top_p: 0.9,
    top_k: 40,
    repetition_penalty: 1.0,
    do_sample: true,
    return_full_text: false,
  },

  analysisParams: {
    max_new_tokens: 1024,
    temperature: 0.5,
    top_p: 0.92,
    top_k: 45,
    repetition_penalty: 1.05,
    do_sample: true,
    return_full_text: false,
  },
};

// Helper function do wywołań Bielik
export async function callBielik(
  env: any,
  prompt: string,
  params: any = BIELIK_CONFIG.voiceParams,
  metadata: any = {}
) {
  const response = await fetch(
    `${BIELIK_CONFIG.gatewayUrl}/huggingface/${BIELIK_CONFIG.model}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.HF_API_TOKEN}`,
        "Content-Type": "application/json",
        "cf-aig-metadata": JSON.stringify(metadata),
        "cf-aig-cache-ttl": metadata.cacheTTL || "3600",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: params,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Bielik API error ${response.status}: ${error}`);
  }

  return response.json();
}

// Error handling helper
export function handleBielikError(error: any): Response {
  console.error("Bielik error:", error);

  let message = "Wystąpił błąd w komunikacji z modelem AI";
  let status = 500;

  if (error.message.includes("401")) {
    message = "Błąd autoryzacji - sprawdź token API";
    status = 401;
  } else if (error.message.includes("429")) {
    message = "Wykorzystano dzienny limit. Spróbuj później.";
    status = 429;
  } else if (error.message.includes("quota")) {
    message = "Wykorzystano limit ZeroGPU (25 min/dzień). Reset o północy UTC.";
    status = 429;
  }

  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
```

### KROK 3: Utwórz plik `functions/api/bielik-voice.ts`

```typescript
// functions/api/bielik-voice.ts
import { BIELIK_CONFIG, callBielik, handleBielikError } from "./bielik-common";

interface VoiceRequest {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  userId?: string;
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = (await request.json()) as VoiceRequest;
    const { message, conversationHistory = [], userId = "anonymous" } = body;

    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: "Wiadomość nie może być pusta",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // System prompt dla ZENON
    const systemPrompt = `Jesteś ZENON - polski asystent głosowy w aplikacji mybonzo.com.
Odpowiadasz zwięźle, naturalnie i pomocnie.
Używasz poznańskiej gwary sporadycznie dla charakteru.
Zawsze jesteś konkretny i merytoryczny.
Nie powtarzasz się i nie używasz pustych frazesów.`;

    // Build conversation context (tylko ostatnie 5 wiadomości dla oszczędności tokenów)
    const recentHistory = conversationHistory.slice(-5);
    const conversationContext = recentHistory
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const fullPrompt = conversationContext
      ? `${systemPrompt}\n\n${conversationContext}\nUser: ${message}\nAssistant:`
      : `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

    // Wywołaj Bielik przez Gateway
    const result = await callBielik(
      env,
      fullPrompt,
      BIELIK_CONFIG.voiceParams,
      {
        endpoint: "voice-assistant",
        user_id: userId,
        message_length: message.length,
        history_length: recentHistory.length,
        cacheTTL: "3600", // Cache przez 1h
      }
    );

    // Wyciągnij odpowiedź
    const generatedText = result[0]?.generated_text?.trim() || "";

    if (!generatedText) {
      throw new Error("Model zwrócił pustą odpowiedź");
    }

    return new Response(
      JSON.stringify({
        response: generatedText,
        metadata: {
          model: "Bielik-11B-v2.2-Instruct",
          tokens_generated: result[0]?.details?.generated_tokens || 0,
          finish_reason: result[0]?.details?.finish_reason || "length",
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600", // Browser cache
        },
      }
    );
  } catch (error: any) {
    return handleBielikError(error);
  }
}

// CORS support dla development
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
```

### KROK 4: Utwórz plik `functions/api/bielik-orchestrator.ts`

````typescript
// functions/api/bielik-orchestrator.ts
import { BIELIK_CONFIG, callBielik, handleBielikError } from "./bielik-common";

interface OrchestrationRequest {
  task: string;
  context?: Record<string, any>;
  availableAgents?: string[];
}

interface OrchestrationDecision {
  agent: string;
  action: string;
  parameters: Record<string, any>;
  reasoning: string;
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = (await request.json()) as OrchestrationRequest;
    const {
      task,
      context: taskContext = {},
      availableAgents = [
        "file_agent",
        "search_agent",
        "code_agent",
        "data_agent",
        "memory_agent",
      ],
    } = body;

    if (!task || task.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: "Zadanie nie może być puste",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // System prompt dla orkiestratora
    const systemPrompt = `Jesteś orkiestratorem systemu ZENON.
Analizujesz zadania i decydujesz który agent/worker wywołać.

DOSTĘPNE AGENTY:
${availableAgents.map((a) => `- ${a}`).join("\n")}

ODPOWIADAJ WYŁĄCZNIE W FORMACIE JSON:
{
  "agent": "nazwa_agenta",
  "action": "akcja_do_wykonania",
  "parameters": { "param1": "value1" },
  "reasoning": "krótkie uzasadnienie"
}

ZASADY:
- Wybierz najbardziej odpowiedniego agenta
- Bądź konkretny w określeniu akcji
- Nie dodawaj komentarzy poza JSON
- Reasoning max 1-2 zdania`;

    const fullPrompt = `${systemPrompt}\n\nZadanie: ${task}\nKontekst: ${JSON.stringify(
      taskContext
    )}\n\nDecyzja (JSON):`;

    // Wywołaj Bielik (bez cache dla orkiestratora - każda decyzja powinna być świeża)
    const result = await callBielik(
      env,
      fullPrompt,
      BIELIK_CONFIG.orchestratorParams,
      {
        endpoint: "orchestrator",
        task_length: task.length,
        available_agents: availableAgents.length,
        cacheTTL: "0", // No cache
      }
    );

    const generatedText = result[0]?.generated_text?.trim() || "";

    if (!generatedText) {
      throw new Error("Model zwrócił pustą odpowiedź");
    }

    // Parse JSON response
    let decision: OrchestrationDecision;
    try {
      // Usuń ewentualne markdown formatowanie
      const cleanJson = generatedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      decision = JSON.parse(cleanJson);

      // Validate decision structure
      if (!decision.agent || !decision.action) {
        throw new Error("Nieprawidłowa struktura decyzji");
      }

      // Validate agent exists
      if (!availableAgents.includes(decision.agent)) {
        decision.agent = "default";
        decision.reasoning = "Agent nieznany - fallback na default";
      }
    } catch (parseError) {
      // Fallback na default agent
      decision = {
        agent: "default",
        action: "handle_generic",
        parameters: { task, context: taskContext },
        reasoning: "Parse error - używam domyślnego agenta",
      };
    }

    return new Response(
      JSON.stringify({
        decision,
        timestamp: Date.now(),
        model: "Bielik-11B-v2.2-Instruct",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache", // Decyzje nie cache'ujemy
        },
      }
    );
  } catch (error: any) {
    // Fallback response w przypadku błędu
    return new Response(
      JSON.stringify({
        decision: {
          agent: "default",
          action: "handle_error",
          parameters: { error: error.message },
          reasoning: "Błąd orkiestratora - fallback",
        },
        error: error.message,
        timestamp: Date.now(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// CORS support
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
````

### KROK 5: Zaktualizuj `wrangler.toml`

```toml
# wrangler.toml
name = "luc-de-zen-on"
pages_build_output_dir = "dist"
compatibility_date = "2024-09-21"
compatibility_flags = [ "nodejs_compat" ]

[vars]
NODE_ENV = "production"
PUBLIC_DEFAULT_MODEL = "@cf/google/gemma-3-12b-it"
PUBLIC_SITE_URL = "https://www.mybonzo.com"
CF_ACCOUNT_ID = "7f490d58a478c6baccb0ae01ea1d87c3"

[[kv_namespaces]]
id = "77d84c01758a4064be011acc35b2c344"
binding = "SESSION"

[[r2_buckets]]
bucket_name = "mybonzo-temp-storage"
binding = "mybonzo_temp_storage"

[ai]
binding = "AI"

# Secrets (ustaw przez: wrangler secret put HF_API_TOKEN)
# HF_API_TOKEN = "{HF_TOKEN}"

[env.production.vars]
NODE_ENV = "production"
PUBLIC_DEFAULT_MODEL = "@cf/google/gemma-3-12b-it"
PUBLIC_SITE_URL = "https://www.mybonzo.com"
CF_ACCOUNT_ID = "7f490d58a478c6baccb0ae01ea1d87c3"

[[env.production.kv_namespaces]]
id = "77d84c01758a4064be011acc35b2c344"
binding = "SESSION"

[[env.production.r2_buckets]]
bucket_name = "mybonzo-temp-storage"
binding = "mybonzo_temp_storage"

[env.production.ai]
binding = "AI"
```

### KROK 6: Utwórz `.dev.vars` (local development)

```bash
# .dev.vars
CF_ACCOUNT_ID={ACCOUNT_ID}
HF_API_TOKEN={HF_TOKEN}
```

⚠️ **WAŻNE:** Dodaj `.dev.vars` do `.gitignore` aby nie commitować tokenów!

### KROK 7: Setup secrets w Cloudflare

```bash
# W katalogu projektu Q:\mybonzo\luc-de-zen-on\
cd Q:\mybonzo\luc-de-zen-on

# Ustaw HF API token jako secret
wrangler secret put HF_API_TOKEN
# Gdy zapyta, wklej: {HF_TOKEN}

# Weryfikacja (opcjonalnie)
wrangler secret list
```

### KROK 8: Deploy do Cloudflare Pages

```bash
# Build projektu
npm run build

# Deploy
wrangler pages deploy dist
```

---

## 🧪 TESTOWANIE

### Test 1: Voice Assistant (curl)

```bash
curl -X POST https://www.mybonzo.com/api/bielik-voice \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Cześć ZENON, jak się masz?",
    "conversationHistory": [],
    "userId": "test-user-123"
  }'
```

**Oczekiwana odpowiedź:**

```json
{
  "response": "Tej, w porzo jestem! Wszystko śmiga. Czym mogę pomóc?",
  "metadata": {
    "model": "Bielik-11B-v2.2-Instruct",
    "tokens_generated": 15,
    "finish_reason": "length"
  }
}
```

### Test 2: Orchestrator (curl)

```bash
curl -X POST https://www.mybonzo.com/api/bielik-orchestrator \
  -H "Content-Type: application/json" \
  -d '{
    "task": "przeanalizuj ten plik CSV i wygeneruj wykres",
    "context": {
      "file": "sales_data.csv",
      "fileSize": 1024000
    }
  }'
```

**Oczekiwana odpowiedź:**

```json
{
  "decision": {
    "agent": "data_agent",
    "action": "analyze_and_visualize",
    "parameters": {
      "file": "sales_data.csv",
      "visualization_type": "chart"
    },
    "reasoning": "Analiza CSV wymaga data_agent do przetwarzania i wizualizacji"
  },
  "timestamp": 1697292000000,
  "model": "Bielik-11B-v2.2-Instruct"
}
```

### Test 3: JavaScript (Frontend)

```javascript
// Test Voice Assistant
async function testVoiceAssistant() {
  const response = await fetch("/api/bielik-voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Opowiedz mi o Poznaniu",
      conversationHistory: [],
    }),
  });

  const data = await response.json();
  console.log("ZENON:", data.response);
}

// Test Orchestrator
async function testOrchestrator() {
  const response = await fetch("/api/bielik-orchestrator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      task: "znajdź informacje o pogodzie",
      context: { location: "Poznań" },
    }),
  });

  const data = await response.json();
  console.log("Decision:", data.decision);
}
```

---

## 🎯 KONFIGURACJA AI GATEWAY (Dashboard)

### URL Dashboard:

`https://dash.cloudflare.com/7f490d58a478c6baccb0ae01ea1d87c3/ai/ai-gateway/bielik_gateway`

### Zalecane ustawienia:

#### 1. Caching

- **Voice Assistant:** TTL = 1 hour (3600s)
- **Orchestrator:** TTL = 0 (disabled)
- **Analysis:** TTL = 30 min (1800s)

#### 2. Rate Limiting

- **Per IP:** 100 requests/min
- **Per User:** 50 requests/min (jeśli tracking userId)
- **Global:** 1000 requests/min

#### 3. Analytics

- ✅ Enable Request Logging
- ✅ Track Token Usage
- ✅ Monitor Latency
- ✅ Error Rate Tracking

#### 4. Alerts

- Ustaw alert przy > 20 min ZeroGPU usage/dzień
- Ustaw alert przy error rate > 5%

---

## 📊 MONITORING & ANALYTICS

### Metryki do śledzenia:

1. **Request Volume**

   - Total requests/dzień
   - Requests per endpoint
   - Peak hours

2. **Cache Performance**

   - Cache hit rate (cel: >70% dla voice)
   - Cache miss rate
   - Bandwidth saved

3. **Model Performance**

   - Średnia latencja (cel: <5s)
   - P95 latencja
   - Token usage/request

4. **ZeroGPU Quota**

   - Wykorzystanie (cel: <20 min/dzień)
   - Requests per minute of quota
   - Daily reset tracking

5. **Error Rates**
   - 4xx errors (client-side)
   - 5xx errors (server-side)
   - Quota exceeded errors

### Dashboard Query (Analytics)

```sql
-- W Cloudflare Analytics
SELECT
  hour,
  COUNT(*) as requests,
  AVG(latency_ms) as avg_latency,
  SUM(cache_hit) / COUNT(*) * 100 as cache_hit_pct
FROM ai_gateway_logs
WHERE gateway_name = 'bielik_gateway'
  AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC
```

---

## ⚡ OPTYMALIZACJA

### 1. Prompt Engineering

**❌ ZŁE (za długie):**

```typescript
const prompt = `Jesteś asystentem AI o nazwie ZENON.
Zostałeś stworzony przez Bonzo...
[200 słów systemowego promptu]

User: Cześć
Assistant:`;
```

**✅ DOBRE (zwięzłe):**

```typescript
const prompt = `ZENON - polski asystent mybonzo.com.
Zwięźle, konkretnie, z odrobiną poznańskiej gwary.

User: Cześć
Assistant:`;
```

### 2. Context Management

```typescript
// Ogranicz historię do ostatnich N wiadomości
const MAX_HISTORY = 5;
const recentHistory = conversationHistory.slice(-MAX_HISTORY);
```

### 3. Batching (dla wielu requestów)

```typescript
// Zamiast:
await Promise.all([
  callBielik(env, prompt1),
  callBielik(env, prompt2),
  callBielik(env, prompt3),
]);

// Lepiej:
const results = [];
for (const prompt of prompts) {
  results.push(await callBielik(env, prompt));
  await sleep(100); // Throttle żeby nie przekroczyć rate limitu
}
```

### 4. Error Recovery

```typescript
async function callBielikWithRetry(env, prompt, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callBielik(env, prompt);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * (i + 1)); // Exponential backoff
    }
  }
}
```

---

## 🔧 TROUBLESHOOTING

### Problem 1: 401 Unauthorized

**Objawy:** `Bielik API error 401`

**Rozwiązanie:**

```bash
# Sprawdź czy token jest ustawiony
wrangler secret list

# Jeśli nie ma HF_API_TOKEN, ustaw:
wrangler secret put HF_API_TOKEN
# Wklej: {HF_TOKEN}
```

### Problem 2: 429 Too Many Requests (Quota)

**Objawy:** `Wykorzystano dzienny limit`

**Przyczyna:** Zużyto 25 min/dzień ZeroGPU quota

**Rozwiązanie:**

1. Poczekaj do północy UTC (reset quota)
2. Optymalizuj prompty (krótsze = mniej quota)
3. Włącz agresywne caching (TTL = 3600s+)
4. Monitoruj usage w HF Dashboard

**Prewencja:**

```typescript
// Dodaj quota check middleware
const DAILY_QUOTA_LIMIT = 24 * 60; // 24 min (buffer 1 min)
let usedQuota = 0;

async function checkQuota() {
  if (usedQuota >= DAILY_QUOTA_LIMIT) {
    throw new Error("Quota exceeded");
  }
}
```

### Problem 3: Slow Response (>10s)

**Objawy:** Pierwsze zapytanie dnia trwa 10-15s

**Przyczyna:** Cold start ZeroGPU (model ładuje się do pamięci)

**Rozwiązanie:**

- To normalne dla pierwszego requesta
- Kolejne będą szybsze (<5s)
- Dodaj w UI: "Pierwsze wywołanie może potrwać dłużej..."

**Optymalizacja:**

```typescript
// Warm-up request rano (opcjonalne)
async function warmupBielik(env) {
  await callBielik(env, "Cześć", BIELIK_CONFIG.voiceParams);
}
```

### Problem 4: Empty Response

**Objawy:** `Model zwrócił pustą odpowiedź`

**Przyczyna:** Model nie rozpoznał formatu promptu

**Rozwiązanie:**

```typescript
// Zawsze dodawaj "Assistant:" na końcu promptu
const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
//                                                          ^^^^^^^^^^
```

### Problem 5: Invalid JSON (Orchestrator)

**Objawy:** Parse error w orchestratorze

**Rozwiązanie:**

```typescript
// Już zaimplementowane - fallback na default agent
try {
  decision = JSON.parse(cleanJson);
} catch (parseError) {
  decision = {
    agent: "default",
    action: "handle_generic",
    // ...
  };
}
```

---

## 🚀 PRZYSZŁE ROZSZERZENIA

### 1. Multi-Model Fallback

```typescript
const MODELS = {
  primary: "speakleash/Bielik-11B-v2.2-Instruct",
  fallback: "speakleash/Bielik-7B-Instruct-v0.1",
  emergency: "@cf/meta/llama-3-8b-instruct", // Cloudflare Workers AI
};

async function callBielikWithFallback(env, prompt) {
  try {
    return await callBielik(env, prompt, MODELS.primary);
  } catch (error) {
    if (error.message.includes("quota")) {
      return await callBielik(env, prompt, MODELS.fallback);
    }
    throw error;
  }
}
```

### 2. Streaming Responses

```typescript
// Dla lepszego UX - token-by-token streaming
export async function onRequestPost(context) {
  // ...

  const response = await fetch(gatewayUrl, {
    // ...
    body: JSON.stringify({
      inputs: prompt,
      parameters: { ...params, stream: true },
    }),
  });

  // Stream response do klienta
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
```

### 3. Function Calling

```typescript
// Bielik 11B wspiera function calling (eksperymentalne)
const tools = [
  {
    name: "search_web",
    description: "Wyszukaj informacje w internecie",
    parameters: { query: "string" },
  },
  {
    name: "read_file",
    description: "Odczytaj zawartość pliku",
    parameters: { path: "string" },
  },
];

// Dodaj tools do promptu
const toolPrompt = `${systemPrompt}\n\nDostępne narzędzia:\n${JSON.stringify(
  tools,
  null,
  2
)}`;
```

### 4. Advanced Caching Strategy

```typescript
// Cache based on semantic similarity
import { embed } from "@cloudflare/ai";

async function semanticCache(env, message) {
  // Generate embedding
  const embedding = await embed(env.AI, message);

  // Search cache for similar queries (cosine similarity)
  const cached = await env.KV.get(`cache:${similarity_hash}`);
  if (cached) return JSON.parse(cached);

  // If not cached, call Bielik and cache result
  const response = await callBielik(env, message);
  await env.KV.put(`cache:${similarity_hash}`, JSON.stringify(response), {
    expirationTtl: 3600,
  });

  return response;
}
```

---

## 💰 KOSZTY & LIMITY

### Aktualne Koszty (miesięcznie)

| Usługa           | Plan | Koszt    | Limity                     |
| ---------------- | ---- | -------- | -------------------------- |
| Hugging Face PRO | PRO  | $9/m     | 25 min ZeroGPU/dzień       |
| Cloudflare Pages | FREE | $0       | 100K functions/dzień       |
| AI Gateway       | FREE | $0       | Unlimited                  |
| KV Storage       | FREE | $0       | 100K ops/dzień             |
| R2 Storage       | FREE | $0       | 10 GB                      |
| **TOTAL**        |      | **$9/m** | ~300-500 AI requests/dzień |

### Skalowanie (jeśli potrzeba więcej)

**Opcja 1: HF Dedicated Space**

- Koszt: $0.40-4.00/h
- Quota: Unlimited
- Idealny dla: Production z wysokim traffic

**Opcja 2: Cloudflare Workers AI**

- Koszt: $0.01/1000 neurons
- Quota: Pay-as-you-go
- Idealny dla: Fallback gdy HF quota exceeded

**Opcja 3: Własny hosting (RunPod)**

- Koszt: $0.39/h (A6000)
- Quota: Unlimited
- Idealny dla: Full control, privacy

### Estymacja kosztów przy różnym traffic

```
Traffic          | HF PRO  | HF Space | CF Workers AI
-----------------|---------|----------|---------------
<500 req/dzień   | $9/m    | -        | -
500-2000/dzień   | $9/m    | $28/m    | $15/m
2000-5000/dzień  | -       | $96/m    | $35/m
5000+/dzień      | -       | $288/m   | $75/m
```

---

## 📝 CHECKLIST DEPLOYMENT

Przed wdrożeniem na production, upewnij się że:

- [ ] Utworzono strukturę `functions/api/`
- [ ] Skopiowano wszystkie 3 pliki TS
- [ ] Zaktualizowano `wrangler.toml` (CF_ACCOUNT_ID)
- [ ] Utworzono `.dev.vars` z tokenem
- [ ] Dodano `.dev.vars` do `.gitignore`
- [ ] Ustawiono `HF_API_TOKEN` przez `wrangler secret put`
- [ ] Zbudowano projekt (`npm run build`)
- [ ] Zdeployowano (`wrangler pages deploy dist`)
- [ ] Przetestowano endpoint `/api/bielik-voice`
- [ ] Przetestowano endpoint `/api/bielik-orchestrator`
- [ ] Skonfigurowano AI Gateway w dashboard
- [ ] Włączono caching (TTL = 3600s dla voice)
- [ ] Włączono rate limiting (100 req/min)
- [ ] Ustawiono alerty dla quota (>20 min/dzień)
- [ ] Zweryfikowano analytics w dashboard
- [ ] Dodano monitoring do codziennej rutyny

---

## 🎓 BEST PRACTICES - PODSUMOWANIE

### DO:

✅ Używaj krótkich, konkretnych promptów
✅ Ogranicz historię konwersacji (max 5 wiadomości)
✅ Cache voice responses (TTL = 1h)
✅ Monitoruj ZeroGPU quota daily
✅ Implementuj graceful degradation (fallbacks)
✅ Loguj wszystkie błędy dla debugowania
✅ Testuj lokalnie przed deployem

### DON'T:

❌ Nie cache'uj orchestrator decisions
❌ Nie wysyłaj pełnej historii konwersacji (>10 msg)
❌ Nie commituj tokenów do git
❌ Nie ignoruj quota warnings
❌ Nie używaj synchronicznych wywołań (Promise.all)
❌ Nie twórz długich system promptów (>100 słów)

---

## 📞 SUPPORT & DOKUMENTACJA

### Cloudflare

- **Dashboard:** https://dash.cloudflare.com/7f490d58a478c6baccb0ae01ea1d87c3
- **AI Gateway Docs:** https://developers.cloudflare.com/ai-gateway
- **Workers Docs:** https://developers.cloudflare.com/workers

### Hugging Face

- **Dashboard:** https://huggingface.co/settings/tokens
- **Model:** https://huggingface.co/speakleash/Bielik-11B-v2.2-Instruct
- **ZeroGPU Docs:** https://huggingface.co/docs/hub/spaces-zerogpu

### Projekt

- **Lokalizacja:** `Q:\mybonzo\luc-de-zen-on\`
- **Dokumentacja:** `Q:\mybonzo\luc-de-zen-on\docs\`
- **Ten plik:** `Q:\mybonzo\luc-de-zen-on\docs\Do_zrobienia\GATEWAY.md`

---

**Last Updated:** 2025-10-14 by JIMBO  
**Status:** ✅ Ready for Implementation  
**Next Review:** Po pierwszym tygodniu w production

---

## 🎯 QUICK START (TL;DR)

```bash
# 1. Przejdź do projektu
cd Q:\mybonzo\luc-de-zen-on

# 2. Utwórz strukturę
mkdir -p functions/api

# 3. Skopiuj pliki z sekcji IMPLEMENTACJA (kroki 2-4)

# 4. Dodaj token do .dev.vars
echo "HF_API_TOKEN={HF_TOKEN}" > .dev.vars

# 5. Ustaw secret w Cloudflare
wrangler secret put HF_API_TOKEN

# 6. Deploy
npm run build
wrangler pages deploy dist

# 7. Test
curl -X POST https://www.mybonzo.com/api/bielik-voice \
  -H "Content-Type: application/json" \
  -d '{"message": "Cześć ZENON!"}'
```

**Done! 🚀**
