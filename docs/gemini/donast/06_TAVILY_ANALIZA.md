# TAVILY AI SEARCH - ANALIZA TECHNICZNA

## PRZEGLĄD SYSTEMU

Tavily AI Search to zaawansowany system wyszukiwania internetowego z integracją sztucznej inteligencji, który oferuje kompleksowe możliwości analizy treści webowych, generowania insights oraz zarządzania wynikami wyszukiwania.

## ARCHITEKTURA SYSTEMU

### Struktura Komponentów

```
Tavily AI Search
├── Główny Interfejs: tavily-search.astro (1114 linii)
├── API Backend: /api/tavily/search.ts (480+ linii)
├── Widget Svelte: TavilyWidget.svelte (546 linii)
├── API Pomocnicze: /api/tavi.ts (Sentry + fallback)
├── Cloudflare Worker: tavily-api.ts
└── Integracja z DeepSeek AI
```

### Główne Komponenty

#### 1. **tavily-search.astro** - Główny Interfejs

- **Rozmiar**: 1114 linii kodu
- **Funkcja**: Kompletny interfejs wyszukiwania z zaawansowanymi opcjami
- **Lokalizacja**: `src/pages/tavily-search.astro`

#### 2. **API Endpoint - /api/tavily/search.ts**

- **Rozmiar**: 480+ linii
- **Funkcja**: Backend API z integracją Tavily API, AI insights, historia wyszukiwań
- **Obsługa**: GET/POST requests, mock data, real-time search

#### 3. **TavilyWidget.svelte** - Komponent Wielokrotnego Użytku

- **Rozmiar**: 546 linii
- **Funkcja**: Widget do integracji w innych stronach
- **Features**: Expandable interface, real-time search, results display

#### 4. **Cloudflare Workers Integration**

- **Lokalizacja**: `src/workers/tavily-api.ts`
- **Funkcja**: Worker dla zaawansowanych operacji wyszukiwania
- **AI Enhancement**: Integracja z @cf/meta/llama-3.1-8b-instruct

## FUNKCJONALNOŚCI KLUCZOWE

### 1. Wyszukiwanie Internetowe

- **Tavily API Integration**: Prawdziwe wyszukiwanie przez API Tavily
- **Search Depth Options**: basic, advanced, deep
- **Domain Filtering**: Include/exclude specific domains
- **Content Types**: News, academic, technical, social media
- **Language Support**: Auto, Polish, English, German, French
- **Results Limit**: 1-50 wyników

### 2. AI-Powered Features

- **AI Insights**: Generowanie podsumowań przez DeepSeek AI
- **Content Analysis**: Analiza treści i trendów
- **Follow-up Questions**: Automatyczne sugestie kolejnych zapytań
- **Smart Summarization**: Podsumowania wyników wyszukiwania

### 3. Zarządzanie Wynikami

- **Results Export**: CSV, TXT, JSON formats
- **Search History**: Persistent storage w localStorage
- **Saved Searches**: Zapisywanie ulubionych wyszukiwań
- **Analytics Dashboard**: Statystyki wyszukiwań, domeny, czasy

### 4. Interfejs Użytkownika

- **Responsive Design**: Adaptacyjny layout
- **Real-time Search**: Live search results
- **Progress Indicators**: Loading states, status messages
- **Quick Searches**: Predefiniowane popularne zapytania

## INTEGRACJE I ZALEŻNOŚCI

### 1. External APIs

```typescript
// Tavily API Integration
const tavilyRequest = {
  api_key: tavilyApiKey,
  query: query,
  search_depth: "advanced",
  include_images: false,
  include_answer: true,
  max_results: 10
};
```

### 2. AI Services

- **Cloudflare AI**: @cf/google/gemma-7b-it dla insights
- **DeepSeek Integration**: Zaawansowana analiza treści
- **Fallback AI**: Backup system gdy Tavily niedostępne

### 3. Storage Systems

- **localStorage**: Historia wyszukiwań, statystyki
- **Session Storage**: Temporary search state
- **In-memory Cache**: Search results caching

## FLOW WYSZUKIWANIA

### 1. Search Initialization

```javascript
// Inicjalizacja wyszukiwania
searchStartTime = Date.now();
const params = new URLSearchParams({
  q: query,
  search_depth: searchDepth,
  max_results: maxResults.toString(),
  include_images: 'false',
  ai_insights: 'true'
});
```

### 2. API Processing

```typescript
// Backend processing
const searchResults = await performTavilySearch(env, query, {
  includeImages,
  searchDepth,
  maxResults,
  includeDomains,
  excludeDomains,
});
```

### 3. Results Enhancement

```javascript
// AI enhancement
if (aiInsights) {
  insights = await generateSearchInsights(
    searchResults.results || [],
    query,
    env
  );
}
```

## MOCK DATA SYSTEM

### Example Searches Database

```javascript
const EXAMPLE_SEARCHES = {
  "artificial intelligence": {
    answer: "AI w 2025 roku charakteryzuje się przełomami...",
    results: [
      {
        title: "AI Trends 2025: Przełomy w sztucznej inteligencji",
        url: "https://techcrunch.com/ai-trends-2025",
        content: "Szczegółowy opis...",
        score: 0.95,
        published_date: "2025-10-01"
      }
    ]
  }
};
```

## ANALYTICS & TRACKING

### Search Statistics

```javascript
const searchStats = {
  totalSearches: 0,
  totalResults: 0,
  totalTime: 0,
  domains: {}
};
```

### History Management

```javascript
const searchHistory = [
  {
    id: timestamp,
    query: "search term",
    resultCount: 10,
    searchTime: "2.34s",
    timestamp: ISO_string
  }
];
```

## KONFIGURACJA ŚRODOWISKA

### Required Environment Variables

```bash
TAVILY_API_KEY=sk-...  # Klucz API Tavily
DEEPSEEK_API_KEY=...   # Dla AI insights
AI_BINDING=...         # Cloudflare AI binding
```

### Optional Settings

- `SEARCH_TIMEOUT`: Timeout dla requests (default: 30s)
- `MAX_SEARCH_HISTORY`: Maksymalna liczba zapisanych wyszukiwań
- `ENABLE_MOCK_DATA`: Użycie przykładowych danych gdy brak API

## PERFORMANCE METRICS

### Średnie Czasy Odpowiedzi

- **Basic Search**: ~1.2s
- **Advanced Search**: ~2.8s
- **AI Insights Generation**: +1.5s
- **Results Processing**: ~0.3s

### Limits and Quotas

- **Max Results per Search**: 50
- **Search History Limit**: 20 entries
- **Concurrent Searches**: 3 max
- **Rate Limiting**: 100 requests/hour per IP

## SECURITY & PRIVACY

### Data Protection

- **No User Tracking**: Brak zbierania danych osobowych
- **Local Storage Only**: Historie tylko lokalnie
- **API Key Security**: Bezpieczne przechowywanie kluczy
- **CORS Configuration**: Właściwa konfiguracja CORS

### Rate Limiting

```typescript
// Rate limiting implementation
const rateLimiter = {
  maxRequests: 100,
  timeWindow: 3600000, // 1 hour
  requests: new Map()
};
```

## MONITORING & LOGGING

### Error Handling

```typescript
try {
  const searchResults = await performTavilySearch(env, query, options);
} catch (error) {
  console.error("Tavily API error:", error);
  // Fallback to mock data
  return generateMockResults(query);
}
```

### Performance Tracking

- Search execution times
- API response monitoring
- Error rate tracking
- User engagement metrics

## DEPLOYMENT CONSIDERATIONS

### Cloudflare Pages Integration

- **SSR Support**: Server-side rendering
- **Edge Functions**: Optimized performance
- **Global CDN**: Worldwide distribution
- **Auto-scaling**: Based on demand

### Environment Setup

```bash
# Development
pnpm dev                    # Local development server
wrangler dev               # Cloudflare Workers testing

# Production
pnpm build                 # Production build
wrangler publish           # Deploy to Cloudflare
```

## FUTURE ENHANCEMENTS

### Planned Features

1. **Advanced Filters**: More granular filtering options
2. **Voice Search**: Speech-to-text integration
3. **Collaborative Search**: Shared search sessions
4. **Mobile App**: Native mobile application
5. **API Webhooks**: Real-time notifications
6. **Custom Domains**: White-label solutions

### Technical Improvements

- **Caching Layer**: Redis integration
- **Search Indexing**: Local search optimization
- **Batch Processing**: Multiple queries
- **Advanced Analytics**: Machine learning insights

---

*Dokumentacja wygenerowana automatycznie - ostatnia aktualizacja: 2025-01-12*