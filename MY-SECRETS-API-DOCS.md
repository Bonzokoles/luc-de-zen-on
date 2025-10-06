# MY-SECRETS-API - Dokumentacja Systemu

> 🔐 **Centralne zarządzanie sekretami API dla systemu POLACZEK**
> 
> Rozwiązanie problemu "błądodczytu api" przez implementację hierarchicznego systemu dostępu do kluczy API z obsługą GitHub Secrets, Cloudflare Secrets i Secrets Store.

## 📋 Spis Treści

1. [Wprowadzenie](#wprowadzenie)
2. [Architektura Systemu](#architektura-systemu)
3. [Źródła Sekretów](#źródła-sekretów)
4. [Instalacja i Konfiguracja](#instalacja-i-konfiguracja)
5. [Użycie API](#użycie-api)
6. [Przykłady Implementacji](#przykłady-implementacji)
7. [Troubleshooting](#troubleshooting)
8. [Bezpieczeństwo](#bezpieczeństwo)

## 🎯 Wprowadzenie

### Problem
- Aplikacja nie mogła odczytać kluczy API z GitHub Secrets i Cloudflare Secrets
- Błędy "błądodczytu api" uniemożliwiały korzystanie z zewnętrznych serwisów AI
- Brak centralnego zarządzania sekretami dla różnych providerów

### Rozwiązanie
**my-secrets-API** to kompleksowy system zarządzania sekretami który:
- ✅ Automatycznie próbuje różne źródła sekretów (Cloudflare Secrets Store → Worker Environment → Process Environment)
- ✅ Zapewnia fallback między źródłami
- ✅ Cachuje sekrety dla wydajności
- ✅ Oferuje jednolite API dla wszystkich providerów AI
- ✅ Umożliwia walidację i testowanie kluczy

## 🏗️ Architektura Systemu

```
┌─────────────────────────────────────────────────────────────┐
│                    MY-SECRETS-API                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Cloudflare      │  │ Worker          │  │ Process      │ │
│  │ Secrets Store   │  │ Environment     │  │ Environment  │ │
│  │ (Priority 1)    │  │ (Priority 2)    │  │ (Priority 3) │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 Cache Layer                             │ │
│  │              (5 min TTL)                                │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Provider Adapters                          │ │
│  │  OpenAI │ Anthropic │ HuggingFace │ Google │ Cohere...  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Źródła Sekretów

### 1. Cloudflare Secrets Store (Priorytet 1)
```typescript
// Najwyższy priorytet - dedykowane KV dla sekretów
env.SECRETS_STORE.get('OPENAI_API_KEY')
```

**Konfiguracja:**
```toml
# wrangler.toml
[[kv_namespaces]]
binding = "SECRETS_STORE"
id = "your-secrets-kv-namespace-id"
```

### 2. Worker Environment (Priorytet 2)
```typescript
// Zmienne środowiskowe Workera
env.OPENAI_API_KEY
```

**Konfiguracja:**
```bash
wrangler secret put OPENAI_API_KEY
```

### 3. Process Environment (Priorytet 3)
```typescript
// GitHub Secrets lub lokalne zmienne środowiskowe
process.env.OPENAI_API_KEY
```

**Uwaga:** W środowisku Cloudflare Workers `process.env` może nie być dostępne.

## ⚙️ Instalacja i Konfiguracja

### 1. Dodaj my-secrets-API do projektu

```bash
# Skopiuj pliki
cp src/utils/my-secrets-API.ts your-project/src/utils/
cp src/pages/api/my-secrets.ts your-project/src/pages/api/
```

### 2. Skonfiguruj Cloudflare Secrets Store

```bash
# Utwórz KV namespace dla sekretów
wrangler kv:namespace create "SECRETS_STORE"

# Dodaj do wrangler.toml
[[kv_namespaces]]
binding = "SECRETS_STORE"
id = "your-namespace-id"
```

### 3. Dodaj sekrety do różnych źródeł

```bash
# Cloudflare Worker Secrets
wrangler secret put OPENAI_API_KEY
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put HUGGINGFACE_API_KEY

# Cloudflare KV Secrets Store
wrangler kv:key put --binding SECRETS_STORE "OPENAI_API_KEY" "sk-your-key"
wrangler kv:key put --binding SECRETS_STORE "ANTHROPIC_API_KEY" "sk-ant-your-key"

# GitHub Secrets (w repository settings)
OPENAI_API_KEY = sk-your-key
ANTHROPIC_API_KEY = sk-ant-your-key
```

### 4. Zaktualizuj worker-configuration.d.ts

```typescript
interface Env {
  SECRETS_STORE: KVNamespace;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  HUGGINGFACE_API_KEY?: string;
  GOOGLE_AI_STUDIO_API_KEY?: string;
  COHERE_API_KEY?: string;
  MISTRAL_API_KEY?: string;
  PERPLEXITY_API_KEY?: string;
  GROQ_API_KEY?: string;
}
```

## 🚀 Użycie API

### Basic Usage

```typescript
import { createMySecretsAPI } from '../utils/my-secrets-API';

// W Astro API route
export const POST: APIRoute = async ({ locals }) => {
  const secretsAPI = createMySecretsAPI(locals.runtime.env);
  
  // Pobierz klucz OpenAI
  const openaiKey = await secretsAPI.getOpenAIKey();
  
  if (!openaiKey) {
    return new Response('No OpenAI key available', { status: 401 });
  }
  
  // Użyj klucza...
};
```

### Advanced Usage

```typescript
// Pobierz wszystkie dostępne klucze
const allKeys = await secretsAPI.getAllProviderKeys();
console.log(allKeys);
// {
//   OPENAI_API_KEY: "sk-...",
//   ANTHROPIC_API_KEY: "sk-ant-...",
//   HUGGINGFACE_API_KEY: null,
//   // ...
// }

// Waliduj wszystkie klucze
const validation = await secretsAPI.validateProviderKeys();
console.log(validation);
// [
//   { provider: "OpenAI", hasKey: true, source: "CloudflareSecretsStore" },
//   { provider: "Anthropic", hasKey: true, source: "WorkerEnvironment" },
//   { provider: "HuggingFace", hasKey: false }
// ]

// Generuj header autoryzacji
const authHeader = await secretsAPI.getAuthHeader('openai');
console.log(authHeader); // "Bearer sk-..."
```

### Convenience Functions

```typescript
import { getProviderKey, getProviderAuthHeader } from '../utils/my-secrets-API';

// Szybki dostęp do klucza
const openaiKey = await getProviderKey(env, 'openai');

// Szybki dostęp do header autoryzacji
const authHeader = await getProviderAuthHeader(env, 'anthropic');
```

## 📡 Endpoint API: `/api/my-secrets`

### GET Endpoints

#### Status Systemu
```bash
GET /api/my-secrets?action=status

Response:
{
  "success": true,
  "data": {
    "summary": {
      "totalProviders": 8,
      "providersWithKeys": 3,
      "availableSources": 2,
      "totalSources": 3
    },
    "providers": [...],
    "sources": [...]
  }
}
```

#### Walidacja Kluczy
```bash
GET /api/my-secrets?action=validate

Response:
{
  "success": true,
  "data": {
    "validation": [
      {
        "provider": "OpenAI",
        "hasKey": true,
        "source": "CloudflareSecretsStore"
      }
    ],
    "hasAnyKeys": true,
    "missingProviders": ["HuggingFace", "Cohere"]
  }
}
```

#### Debug Źródeł
```bash
GET /api/my-secrets?action=debug

Response:
{
  "success": true,
  "data": {
    "sources": [
      {
        "source": "CloudflareSecretsStore",
        "available": true,
        "keys": ["OPENAI_API_KEY", "ANTHROPIC_API_KEY"]
      },
      {
        "source": "WorkerEnvironment",
        "available": true
      },
      {
        "source": "ProcessEnvironment",
        "available": false,
        "error": "process is not defined"
      }
    ]
  }
}
```

### POST Endpoints

#### Sprawdź Sekret
```bash
POST /api/my-secrets
{
  "action": "getSecret",
  "key": "OPENAI_API_KEY"
}

Response:
{
  "success": true,
  "data": {
    "key": "OPENAI_API_KEY",
    "exists": true,
    "value": "[HIDDEN]"
  }
}
```

#### Testuj Providera
```bash
POST /api/my-secrets
{
  "action": "testProvider",
  "provider": "openai"
}

Response:
{
  "success": true,
  "data": {
    "provider": "openai",
    "test": "passed",
    "hasKey": true,
    "authHeaderType": "Bearer",
    "note": "Key exists and auth header generated successfully"
  }
}
```

#### Zapisz Sekret
```bash
POST /api/my-secrets
{
  "action": "saveSecret",
  "key": "OPENAI_API_KEY",
  "value": "sk-your-new-key"
}

Response:
{
  "success": true,
  "data": {
    "key": "OPENAI_API_KEY",
    "saved": true,
    "message": "Secret saved successfully"
  }
}
```

## 💻 Przykłady Implementacji

### 1. Worker z my-secrets-API

```typescript
// src/workers/enhanced-openai.ts
import { createMySecretsAPI } from '../utils/my-secrets-API';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const secretsAPI = createMySecretsAPI(env);
    
    // Pobierz klucz z automatycznym fallback
    const openaiKey = await secretsAPI.getOpenAIKey();
    
    if (!openaiKey) {
      return new Response('No OpenAI API key available', { status: 401 });
    }
    
    // Użyj klucza do wywołania OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello!' }]
      })
    });
    
    return response;
  }
};
```

### 2. Astro API Route

```typescript
// src/pages/api/ai-chat.ts
import type { APIRoute } from 'astro';
import { createMySecretsAPI } from '../../utils/my-secrets-API';

export const POST: APIRoute = async ({ locals, request }) => {
  const secretsAPI = createMySecretsAPI(locals.runtime.env);
  const { message, provider = 'openai' } = await request.json();
  
  // Pobierz odpowiedni klucz dla wybranego providera
  const authHeader = await secretsAPI.getAuthHeader(provider);
  
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: `No API key for ${provider}` }),
      { status: 401 }
    );
  }
  
  // Wywołaj odpowiedni API...
  const result = await callProviderAPI(provider, authHeader, message);
  
  return new Response(JSON.stringify(result));
};
```

### 3. React Component

```tsx
// src/components/APIKeyManager.tsx
import { useState, useEffect } from 'react';

export function APIKeyManager() {
  const [status, setStatus] = useState(null);
  const [providers, setProviders] = useState([]);
  
  useEffect(() => {
    // Pobierz status systemu
    fetch('/api/my-secrets?action=status')
      .then(r => r.json())
      .then(data => {
        setStatus(data.data.summary);
        setProviders(data.data.providers);
      });
  }, []);
  
  const testProvider = async (provider) => {
    const response = await fetch('/api/my-secrets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'testProvider',
        provider: provider.toLowerCase()
      })
    });
    
    const result = await response.json();
    console.log(`Test ${provider}:`, result.data);
  };
  
  return (
    <div>
      <h2>API Keys Status</h2>
      {status && (
        <p>Configured: {status.providersWithKeys}/{status.totalProviders}</p>
      )}
      
      {providers.map(provider => (
        <div key={provider.provider}>
          <span>{provider.provider}</span>
          <span>{provider.hasKey ? '✅' : '❌'}</span>
          <button onClick={() => testProvider(provider.provider)}>
            Test
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🔧 Troubleshooting

### Problem: "Secret not found in any source"

**Rozwiązanie:**
1. Sprawdź czy klucz jest ustawiony w którymokolwiek źródle:
```bash
# Cloudflare KV
wrangler kv:key list --binding SECRETS_STORE

# Worker secrets
wrangler secret list

# GitHub secrets (w UI GitHub)
```

2. Sprawdź naming convention:
```typescript
// Poprawne nazwy kluczy
OPENAI_API_KEY
ANTHROPIC_API_KEY
HUGGINGFACE_API_KEY
GOOGLE_AI_STUDIO_API_KEY
```

### Problem: "SECRETS_STORE is not defined"

**Rozwiązanie:**
1. Dodaj KV namespace do wrangler.toml:
```toml
[[kv_namespaces]]
binding = "SECRETS_STORE"
id = "your-namespace-id"
```

2. Sprawdź czy namespace istnieje:
```bash
wrangler kv:namespace list
```

### Problem: Cache issues

**Rozwiązanie:**
```typescript
// Wyczyść cache
secretsAPI.clearCache();

// Lub utwórz nową instancję
const secretsAPI = createMySecretsAPI(env, { cacheTTL: 0 });
```

### Debug Endpoint

Użyj endpoint `/api/my-secrets?action=debug` aby sprawdzić:
- Dostępność źródeł sekretów
- Listę kluczy w Secrets Store
- Błędy połączenia

## 🔒 Bezpieczeństwo

### Najlepsze Praktyki

1. **Nigdy nie loguj wartości sekretów:**
```typescript
// ❌ Źle
console.log('API Key:', apiKey);

// ✅ Dobrze
console.log('API Key exists:', !!apiKey);
console.log('API Key preview:', apiKey?.substring(0, 8) + '...');
```

2. **Używaj HTTPS w produkcji:**
```typescript
// Sprawdź czy request jest bezpieczny
if (request.url.startsWith('http:') && env.NODE_ENV === 'production') {
  return new Response('HTTPS required', { status: 403 });
}
```

3. **Rotacja kluczy:**
```typescript
// Regularna rotacja kluczy
const keyAge = await secretsAPI.getSecretAge('OPENAI_API_KEY');
if (keyAge > 90) { // 90 dni
  console.warn('API key should be rotated');
}
```

4. **Walidacja źródła:**
```typescript
// Sprawdź źródło klucza
const validation = await secretsAPI.validateProviderKeys();
const openaiProvider = validation.find(p => p.provider === 'OpenAI');
if (openaiProvider?.source !== 'CloudflareSecretsStore') {
  console.warn('API key not from secure source');
}
```

### Hierarchy Security

```
🔒 Cloudflare Secrets Store (Najbezpieczniejsze)
├── Szyfrowane KV storage
├── Kontrola dostępu na poziomie konta
└── Audit logs

🔐 Worker Environment (Bezpieczne)
├── Wrangler secrets
├── Szyfrowane w transit i at rest
└── Bound do konkretnego workera

🔓 Process Environment (Najmniej bezpieczne)
├── Zależy od środowiska
├── Może być accessible przez inne procesy
└── Używane jako fallback
```

### Monitoring

```typescript
// Dodaj monitoring użycia sekretów
const secretsAPI = createMySecretsAPI(env, {
  onSecretAccess: (key, source) => {
    console.log(`Secret ${key} accessed from ${source}`);
    // Możesz wysłać metryki do systemu monitoringu
  }
});
```

## 📊 Monitorowanie i Metryki

### Podstawowe Metryki

```typescript
// Status systemu
const status = await fetch('/api/my-secrets?action=status');
// - Liczba skonfigurowanych providerów
// - Dostępność źródeł sekretów
// - Health check

// Walidacja kluczy
const validation = await fetch('/api/my-secrets?action=validate');
// - Które klucze działają
// - Brakujące klucze
// - Źródła kluczy
```

### Dashboard POLACZEK

Strona `/POLACZEK_AGENT_SYS_23/api-keys` oferuje:
- ✅ Status wszystkich providerów w czasie rzeczywistym
- 🔍 Testowanie kluczy API
- 📊 Statystyki użycia
- 🛠️ Debug narzędzia
- 💾 Zarządzanie sekretami

---

## 🎉 Podsumowanie

**my-secrets-API** rozwiązuje problem "błądodczytu api" poprzez:

1. **Hierarchiczny dostęp** - automatycznie próbuje różne źródła
2. **Centralne API** - jednolity interfejs dla wszystkich providerów
3. **Fallback mechanism** - zapewnia dostępność nawet przy awariach
4. **Cache layer** - optymalizuje wydajność
5. **Security first** - bezpieczne przechowywanie i dostęp
6. **Developer friendly** - łatwe w użyciu API i debugging

### Wsparcie dla Providerów

| Provider | Klucz | Auth Header | Status |
|----------|-------|-------------|---------|
| OpenAI | `OPENAI_API_KEY` | `Bearer sk-...` | ✅ |
| Anthropic | `ANTHROPIC_API_KEY` | `x-api-key sk-ant-...` | ✅ |
| HuggingFace | `HUGGINGFACE_API_KEY` | `Bearer hf_...` | ✅ |
| Google AI | `GOOGLE_AI_STUDIO_API_KEY` | `x-goog-api-key ...` | ✅ |
| Cohere | `COHERE_API_KEY` | `Bearer ...` | ✅ |
| Mistral | `MISTRAL_API_KEY` | `Bearer ...` | ✅ |
| Perplexity | `PERPLEXITY_API_KEY` | `Bearer ...` | ✅ |
| Groq | `GROQ_API_KEY` | `Bearer ...` | ✅ |

### Następne Kroki

1. Przetestuj system na stronie `/POLACZEK_AGENT_SYS_23/api-keys`
2. Skonfiguruj klucze API w preferowanym źródle
3. Zintegruj my-secrets-API z istniejącymi workerami
4. Ustaw monitoring i alerty
5. Zaplanuj rotację kluczy

---

*Dokumentacja my-secrets-API v1.0 - POLACZEK System 23*
