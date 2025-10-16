# 📊 KAGGLE DATASETS - PRZEWODNIK IMPLEMENTACJI I ROZWOJU

## 🎯 PRZEGLĄD SYSTEMU KAGGLE DATASETS

**Kaggle Datasets** to zaawansowana platforma do eksploracji zbiorów danych z integracją AI, która umożliwia wyszukiwanie, analizę i otrzymywanie rekomendacji datasetów z platformy Kaggle. System łączy tradycyjne wyszukiwanie z możliwościami sztucznej inteligencji.

### Kluczowe Komponenty:

- **Frontend Interface**: Astro + Svelte components
- **Backend API**: TypeScript endpoints z AI integration
- **AI Layer**: DeepSeek + Cloudflare AI
- **Data Source**: Kaggle API + predefiniowane datasety

## 🚀 QUICK START - URUCHOMIENIE SYSTEMU

### 1. Wymagane Zmienne Środowiskowe

```bash
# .env lub wrangler.toml
KAGGLE_USERNAME=your_kaggle_username
KAGGLE_KEY=your_kaggle_api_key
DEEPSEEK_API_KEY=your_deepseek_key
```

### 2. Podstawowe Użycie API

```javascript
// Wyszukiwanie datasetów
fetch("/api/kaggle/datasets?action=search&q=computer vision")
  .then((response) => response.json())
  .then((data) => console.log(data.datasets));

// AI Help
fetch("/api/kaggle/datasets?ai_help=Znajdź datasety do analizy sentymentu")
  .then((response) => response.json())
  .then((data) => console.log(data.ai_response));

// Popularne datasety
fetch("/api/kaggle/datasets?action=list&category=nlp")
  .then((response) => response.json())
  .then((data) => console.log(data.datasets));
```

### 3. Integracja w Komponencie

```astro
---
// src/pages/my-kaggle-page.astro
import KaggleWidget from '../components/KaggleWidget.svelte';
---

<Layout>
  <section>
    <h1>Eksploracja Datasetów</h1>
    <KaggleWidget client:load />
  </section>
</Layout>
```

## 🔧 ARCHITEKTURA I KOMPONENTY

### Frontend Components

#### KaggleWidget.svelte

```svelte
<script>
  let searchQuery = '';
  let datasets = null;
  let loading = false;

  async function searchDatasets() {
    loading = true;
    try {
      const response = await fetch(`/api/kaggle/datasets?action=search&q=${searchQuery}`);
      datasets = await response.json();
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      loading = false;
    }
  }
</script>

<div class="kaggle-explorer">
  <input bind:value={searchQuery} placeholder="Szukaj datasetów..." />
  <button on:click={searchDatasets}>Szukaj</button>

  {#if loading}
    <div class="loading">Wyszukiwanie...</div>
  {:else if datasets}
    {#each datasets.data as dataset}
      <div class="dataset-card">
        <h3>{dataset.title}</h3>
        <p>{dataset.description}</p>
      </div>
    {/each}
  {/if}
</div>
```

### Backend API Structure

#### Main API Endpoint (/api/kaggle/datasets.ts)

```typescript
export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "list";
  const env = (locals as any)?.runtime?.env;

  switch (action) {
    case "search":
      return handleSearch(url.searchParams, env);
    case "ai_help":
      return handleAIHelp(url.searchParams, env);
    case "analyze":
      return handleAnalysis(url.searchParams, env);
    default:
      return handleList(url.searchParams, env);
  }
};
```

## 🤖 AI INTEGRATION SETUP

### DeepSeek Integration

```javascript
class DeepSeekKaggleIntegration {
  constructor(config = {}) {
    this.apiKey = config.apiKey;
    this.baseUrl = "https://api.deepseek.com/v1";
  }

  async analyzeDataset(datasetRef, prompt = "") {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: `Analyze Kaggle dataset: ${datasetRef}\n${prompt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    return response.json();
  }
}
```

### Cloudflare AI Integration

```typescript
async function getKaggleAIHelp(env: any, question: string) {
  if (env.AI) {
    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "user",
          content: `Jesteś ekspertem od datasetów Kaggle. Pytanie: ${question}`,
        },
      ],
    });
    return response.response;
  }
  return "AI niedostępne";
}
```

## 📊 ROZSZERZANIE FUNKCJONALNOŚCI

### 1. Dodawanie Nowych Kategorii

```typescript
// src/pages/api/kaggle/datasets.ts
async function getKaggleCategories() {
  return [
    // Existing categories...
    { name: "gaming", description: "Gry i gaming data", count: 234 },
    { name: "crypto", description: "Kryptowaluty i blockchain", count: 156 },
  ];
}
```

### 2. Custom Analysis Types

```typescript
// DeepSeek analysis types
const ANALYSIS_TYPES = {
  quick: "Quick structure and applications analysis",
  detailed: "Comprehensive analysis with recommendations",
  ml: "Machine learning focused analysis",
  business: "Business value and ROI analysis",
  academic: "Academic research potential",
};
```

### 3. Custom Filters

```javascript
// Frontend filter implementation
const filters = {
  size: ["small", "medium", "large", "huge"],
  format: ["csv", "json", "sqlite", "parquet"],
  license: ["open", "commercial", "academic"],
  language: ["english", "polish", "multilingual"],
};
```

## 🎨 UI CUSTOMIZATION

### Theme Variables

```css
:root {
  --kaggle-primary: #ff6b35;
  --kaggle-secondary: #007acc;
  --kaggle-success: #4caf50;
  --kaggle-warning: #ffc107;
  --kaggle-error: #f44336;
  --kaggle-dark: #1a1a1a;
  --kaggle-light: #f5f5f5;
}
```

### Responsive Design

```css
.kaggle-explorer {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .kaggle-explorer {
    grid-template-columns: 1fr 2fr;
  }
}

@media (min-width: 1024px) {
  .dataset-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}
```

## 🔒 SECURITY BEST PRACTICES

### 1. API Key Security

```typescript
// NIGDY nie eksponuj kluczy w frontend
// ✅ Correct - backend only
const kaggleKey = env.KAGGLE_KEY;

// ❌ Wrong - frontend exposure
// const kaggleKey = 'your-api-key';
```

### 2. Input Validation

```typescript
function validateSearchInput(query: string): string {
  if (!query || typeof query !== "string") {
    throw new Error("Invalid query");
  }

  if (query.length > 200) {
    throw new Error("Query too long");
  }

  // Sanitize input
  return query.replace(/[<>]/g, "").trim();
}
```

### 3. Rate Limiting

```typescript
const rateLimiter = new Map();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = rateLimiter.get(ip) || [];

  // Remove old requests (older than 1 minute)
  const recentRequests = userRequests.filter((time) => now - time < 60000);

  if (recentRequests.length >= 60) {
    // 60 requests per minute
    return false;
  }

  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return true;
}
```

## 🚀 DEPLOYMENT I MONITORING

### Cloudflare Pages Deployment

```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist

# Set environment variables
wrangler pages secret put KAGGLE_KEY
wrangler pages secret put DEEPSEEK_API_KEY
```

### Health Check Implementation

```typescript
// /api/kaggle/health
export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any)?.runtime?.env;

  const healthCheck = {
    service: "Kaggle Datasets",
    status: "healthy",
    timestamp: new Date().toISOString(),
    dependencies: {
      kaggle_api: env.KAGGLE_KEY ? "configured" : "missing",
      deepseek_api: env.DEEPSEEK_API_KEY ? "configured" : "missing",
    },
  };

  return new Response(JSON.stringify(healthCheck), {
    headers: { "Content-Type": "application/json" },
  });
};
```

### Monitoring Metrics

```typescript
// Usage tracking
const metrics = {
  searches: 0,
  ai_requests: 0,
  errors: 0,
  response_times: [],
};

function trackMetric(type: string, value?: number) {
  metrics[type]++;
  if (value) metrics.response_times.push(value);
}
```

## 📈 PERFORMANCE OPTIMIZATION

### Caching Strategy

```javascript
class KaggleCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minut
  }

  get(key) {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < this.ttl) {
      return item.data;
    }
    this.cache.delete(key);
    return null;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}
```

### Lazy Loading

```svelte
<script>
  import { onMount } from 'svelte';

  let datasets = [];
  let page = 1;
  let loading = false;
  let hasMore = true;

  async function loadMore() {
    if (loading || !hasMore) return;

    loading = true;
    try {
      const response = await fetch(`/api/kaggle/datasets?page=${page}`);
      const data = await response.json();

      datasets = [...datasets, ...data.datasets];
      page++;
      hasMore = data.hasMore;
    } catch (error) {
      console.error('Load failed:', error);
    } finally {
      loading = false;
    }
  }

  onMount(loadMore);
</script>
```

## 🔄 TESTING STRATEGY

### Unit Tests

```javascript
// tests/kaggle-api.test.js
import { describe, it, expect } from "vitest";
import { KaggleAPI } from "../src/utils/kaggleAPI.js";

describe("KaggleAPI", () => {
  it("should search datasets", async () => {
    const api = new KaggleAPI();
    const results = await api.searchDatasets("computer vision");

    expect(results).toBeDefined();
    expect(results.datasets).toBeInstanceOf(Array);
  });

  it("should handle errors gracefully", async () => {
    const api = new KaggleAPI();

    await expect(api.searchDatasets("")).rejects.toThrow();
  });
});
```

### Integration Tests

```javascript
// tests/api-integration.test.js
describe("Kaggle API Integration", () => {
  it("should return search results", async () => {
    const response = await fetch("/api/kaggle/datasets?action=search&q=test");
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.datasets).toBeDefined();
  });
});
```

## 📚 ROZWÓJ I ROADMAP

### Planned Features:

1. **Dataset Bookmarking**: Zapisywanie ulubionych datasetów
2. **Advanced Analytics**: Więcej typów analiz AI
3. **Team Collaboration**: Współdzielenie i komentowanie
4. **Mobile App**: Native mobile application
5. **API Marketplace**: Monetyzacja premium features

### Contributing:

1. Fork repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request
5. Code review process

---

**Przewodnik**: ✅ Kompletny  
**Poziom**: Intermediate to Advanced  
**Maintenance**: Aktywnie rozwijany  
**Support**: MyBonzo Tech Team
