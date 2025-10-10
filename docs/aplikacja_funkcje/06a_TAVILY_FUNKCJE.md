# TAVILY AI SEARCH - MAPOWANIE FUNKCJI JAVASCRIPT

## FUNKCJE GŁÓWNEGO INTERFEJSU (tavily-search.astro)

### Funkcje Wyszukiwania

#### 1. **performSearch()**
```javascript
async function performSearch() {
  const query = document.getElementById("searchQuery").value.trim();
  // Główna funkcja wyszukiwania z obsługą błędów
  // Integracja z API /api/tavily/search
  // Status tracking i UI updates
}
```
**Lokalizacja**: Linie 591-665  
**Funkcja**: Główna funkcja wykonująca wyszukiwanie internetowe  
**Parametry**: Pobiera dane z formularza (query, searchDepth, maxResults)  
**Zwraca**: Promise<void> - aktualizuje UI z wynikami

#### 2. **quickSearch(query)**
```javascript
function quickSearch(query) {
  document.getElementById("searchQuery").value = query;
  performSearch();
}
```
**Lokalizacja**: Linie 587-590  
**Funkcja**: Szybkie wyszukiwanie dla predefiniowanych zapytań  
**Parametry**: `query` (string) - zapytanie wyszukiwania  
**Zwraca**: void

### Funkcje Wyświetlania Wyników

#### 3. **displayResults(results, searchTime)**
```javascript
function displayResults(results, searchTime) {
  const resultsSection = document.getElementById("resultsSection");
  const resultsList = document.getElementById("resultsList");
  // Renderowanie wyników wyszukiwania
  // Tworzenie kart wyników z metadanymi
}
```
**Lokalizacja**: Linie 731-785  
**Funkcja**: Wyświetlanie wyników wyszukiwania w UI  
**Parametry**: `results` (Array), `searchTime` (number)  
**Zwraca**: void - modyfikuje DOM

#### 4. **displayAISummary(summary)**
```javascript
function displayAISummary(summary) {
  const summarySection = document.getElementById("summarySection");
  const aiSummary = document.getElementById("aiSummary");
  // Wyświetlanie podsumowania AI
}
```
**Lokalizacja**: Linie 715-730  
**Funkcja**: Wyświetlanie podsumowania wygenerowanego przez AI  
**Parametry**: `summary` (string) - tekst podsumowania  
**Zwraca**: void

#### 5. **displayError(error)**
```javascript
function displayError(error) {
  const resultsSection = document.getElementById("resultsSection");
  // Wyświetlanie komunikatów błędów
}
```
**Lokalizacja**: Linie 787-799  
**Funkcja**: Wyświetlanie błędów wyszukiwania  
**Parametry**: `error` (string) - komunikat błędu  
**Zwraca**: void

### Funkcje Zarządzania Historią

#### 6. **addToSearchHistory(query, resultCount, searchTime)**
```javascript
function addToSearchHistory(query, resultCount, searchTime) {
  const historyItem = {
    id: Date.now(),
    query,
    resultCount,
    searchTime: searchTime.toFixed(2),
    timestamp: new Date().toISOString(),
  };
  searchHistory.unshift(historyItem);
  // Zarządzanie historią wyszukiwań (max 20 elementów)
}
```
**Lokalizacja**: Linie 1013-1026  
**Funkcja**: Dodawanie wyszukiwania do historii  
**Parametry**: `query` (string), `resultCount` (number), `searchTime` (number)  
**Zwraca**: void

#### 7. **updateSearchHistoryDisplay()**
```javascript
function updateSearchHistoryDisplay() {
  const historyList = document.getElementById("searchHistoryList");
  // Renderowanie listy historii wyszukiwań
  // Obsługa kliknięć i usuwania elementów
}
```
**Lokalizacja**: Linie 1031-1056  
**Funkcja**: Aktualizacja wyświetlania historii  
**Parametry**: brak  
**Zwraca**: void

#### 8. **deleteFromSearchHistory(id)**
```javascript
function deleteFromSearchHistory(id) {
  event.stopPropagation();
  if (confirm("Czy na pewno chcesz usunąć to wyszukiwanie z historii?")) {
    searchHistory = searchHistory.filter((item) => item.id !== id);
    // Usuwanie elementu z historii i localStorage
  }
}
```
**Lokalizacja**: Linie 1058-1068  
**Funkcja**: Usuwanie elementu z historii wyszukiwań  
**Parametry**: `id` (number) - identyfikator elementu  
**Zwraca**: void

### Funkcje Statystyk i Analiz

#### 9. **updateSearchStats(query, resultCount, searchTime, results)**
```javascript
function updateSearchStats(query, resultCount, searchTime, results) {
  searchStats.totalSearches++;
  searchStats.totalResults += resultCount;
  searchStats.totalTime += searchTime;
  
  // Liczenie domen
  results.forEach((result) => {
    try {
      const domain = new URL(result.url).hostname;
      searchStats.domains[domain] = (searchStats.domains[domain] || 0) + 1;
    } catch (e) {
      // Invalid URL, skip
    }
  });
}
```
**Lokalizacja**: Linie 801-822  
**Funkcja**: Aktualizacja statystyk wyszukiwań  
**Parametry**: `query`, `resultCount`, `searchTime`, `results`  
**Zwraca**: void

#### 10. **updateStatsDisplay()**
```javascript
function updateStatsDisplay() {
  document.getElementById("totalSearches").textContent = searchStats.totalSearches;
  
  const avgResults = searchStats.totalSearches > 0
    ? (searchStats.totalResults / searchStats.totalSearches).toFixed(1)
    : "0";
  // Aktualizacja wyświetlania statystyk
}
```
**Lokalizacja**: Linie 824-843  
**Funkcja**: Aktualizacja wyświetlanych statystyk  
**Parametry**: brak  
**Zwraca**: void

### Funkcje Eksportu i Raportów

#### 11. **generateReport()**
```javascript
function generateReport() {
  if (currentResults.length === 0) {
    alert("Brak wyników do wygenerowania raportu");
    return;
  }
  
  const query = document.getElementById("searchQuery").value;
  let report = `RAPORT WYSZUKIWANIA TAVILY\n`;
  // Generowanie raportu tekstowego
  // Automatyczne pobieranie pliku
}
```
**Lokalizacja**: Linie 845-869  
**Funkcja**: Generowanie raportu wyszukiwania  
**Parametry**: brak  
**Zwraca**: void

#### 12. **exportResults()**
```javascript
function exportResults() {
  if (currentResults.length === 0) {
    alert("Brak wyników do eksportu");
    return;
  }
  
  const csv = convertResultsToCSV(currentResults);
  // Eksport wyników do CSV
}
```
**Lokalizacja**: Linie 942-952  
**Funkcja**: Eksport wyników do formatu CSV  
**Parameters**: brak  
**Zwraca**: void

#### 13. **convertResultsToCSV(results)**
```javascript
function convertResultsToCSV(results) {
  const headers = ["Title", "URL", "Content", "Published Date", "Score"];
  let csv = headers.join(",") + "\n";
  
  results.forEach((result) => {
    const row = [
      `"${(result.title || "").replace(/"/g, '""')}"`,
      `"${result.url || ""}"`,
      // Konwersja wyników do formatu CSV
    ];
  });
  
  return csv;
}
```
**Lokalizacja**: Linie 954-969  
**Funkcja**: Konwersja wyników do formatu CSV  
**Parametry**: `results` (Array) - wyniki wyszukiwania  
**Zwraca**: string - dane CSV

### Funkcje Analizy Wyników

#### 14. **analyzeResults()**
```javascript
function analyzeResults() {
  if (currentResults.length === 0) {
    alert("Brak wyników do analizy");
    return;
  }

  // Simple analysis
  const domains = {};
  const contentTypes = {};
  let totalContentLength = 0;
  
  // Analiza domen, typów treści, długości
}
```
**Lokalizacja**: Linie 871-911  
**Funkcja**: Analiza wyników wyszukiwania  
**Parametry**: brak  
**Zwraca**: void - wyświetla alert z analizą

### Funkcje UI i Interakcji

#### 15. **clearResults()**
```javascript
function clearResults() {
  document.getElementById("resultsSection").classList.add("hidden");
  document.getElementById("summarySection").classList.add("hidden");
  currentResults = [];
}
```
**Lokalizacja**: Linie 971-975  
**Funkcja**: Czyszczenie wyników wyszukiwania  
**Parametry**: brak  
**Zwraca**: void

#### 16. **saveSearch()**
```javascript
function saveSearch() {
  const query = document.getElementById("searchQuery").value.trim();
  if (!query) {
    alert("Brak zapytania do zapisania");
    return;
  }
  
  const name = prompt("Nazwa wyszukiwania:");
  // Zapisywanie wyszukiwania w localStorage
}
```
**Lokalizacja**: Linie 913-940  
**Funkcja**: Zapisywanie wyszukiwania do ulubionych  
**Parametry**: brak  
**Zwraca**: void

### Event Handlers i Inicjalizacja

#### 17. **DOMContentLoaded Event Handler**
```javascript
document.addEventListener("DOMContentLoaded", () => {
  updateSearchHistoryDisplay();
  updateStatsDisplay();
  
  // Load quick search if available
  const quickSearch = localStorage.getItem("quickTavilySearch");
  
  // Event delegation system
  document.addEventListener("click", (e) => {
    const action = e.target.getAttribute("data-action");
    // Router dla wszystkich akcji UI
  });
});
```
**Lokalizacja**: Linie 1070-1114  
**Funkcja**: Inicjalizacja aplikacji i event handling  
**Parametry**: brak  
**Zwraca**: void

## FUNKCJE API BACKEND (/api/tavily/search.ts)

### Główne Funkcje API

#### 18. **getTavilyInstructions(env)**
```typescript
async function getTavilyInstructions(env: any) {
  return {
    title: "Tavily Search API - Kompletny przewodnik",
    description: "Zaawansowana wyszukiwarka internetowa z AI insights i analytics",
    sections: {
      "Podstawowe wyszukiwanie": {
        search: "Wyszukiwanie z głębokością podstawową lub zaawansowaną",
        // Szczegółowe instrukcje użycia
      }
    }
  };
}
```
**Lokalizacja**: Linie 15-58  
**Funkcja**: Zwraca instrukcje użycia API  
**Parametry**: `env` (any) - środowisko wykonania  
**Zwraca**: Object - instrukcje API

#### 19. **getTavilyAIHelp(env, question)**
```typescript
async function getTavilyAIHelp(env: any, question: string) {
  const prompt = `Jesteś ekspertem od wyszukiwania internetowego i analizy informacji.`;
  
  const response = await env.AI.run("@cf/google/gemma-7b-it", {
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: question }
    ]
  });
  
  return response.response || "Przepraszam, nie mogę odpowiedzieć na to pytanie.";
}
```
**Lokalizacja**: Linie 59-81  
**Funkcja**: AI assistant dla wyszukiwania  
**Parametry**: `env` (any), `question` (string)  
**Zwraca**: Promise<string> - odpowiedź AI

#### 20. **generateSearchInsights(results, query, env)**
```typescript
async function generateSearchInsights(results: any[], query: string, env: any) {
  const domains = results.map(r => {
    try { return new URL(r.url).hostname; } catch { return 'unknown'; }
  }).filter((v, i, a) => a.indexOf(v) === i);
  
  const avgScore = results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length;
  
  // AI analysis of results
  if (env.AI) {
    const contentSample = results
      .slice(0, 3)
      .map(r => r.content || r.title)
      .join('. ');
      
    const prompt = `Przeanalizuj wyniki wyszukiwania dla "${query}". Próbka treści: "${contentSample}". Podaj kluczowe insights po polsku.`;
    
    const aiResponse = await env.AI.run("@cf/google/gemma-7b-it", {
      messages: [{ role: "user", content: prompt }]
    });
    
    return aiResponse.response || `Analiza wyników dla "${query}": Znaleziono ${results.length} wyników z ${domains.length} różnych domen.`;
  }
}
```
**Lokalizacja**: Linie 82-117  
**Funkcja**: Generowanie AI insights dla wyników  
**Parametry**: `results` (Array), `query` (string), `env` (any)  
**Zwraca**: Promise<string> - AI insights

#### 21. **performTavilySearch(env, query, options)**
```typescript
async function performTavilySearch(env: any, query: string, options: any) {
  const tavilyApiKey = env.TAVILY_API_KEY;
  
  if (!tavilyApiKey) {
    // Return example data when API key is not configured
    return generateMockResults(query);
  }
  
  try {
    // Prepare Tavily API request
    const tavilyRequest = {
      api_key: tavilyApiKey,
      query: query,
      search_depth: options.searchDepth === "advanced" ? "advanced" : "basic",
      include_images: options.includeImages || false,
      include_answer: true,
      max_results: Math.min(parseInt(options.maxResults) || 5, 20),
    };
    
    // Call Tavily Search API
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tavilyRequest),
    });
    
    const data: any = await response.json();
    return transformTavilyResponse(data, query);
  } catch (error) {
    console.error("Tavily API error:", error);
    return generateErrorResponse(query, error);
  }
}
```
**Lokalizacja**: Linie 319-420  
**Funkcja**: Główna funkcja wyszukiwania przez Tavily API  
**Parametry**: `env` (any), `query` (string), `options` (any)  
**Zwraca**: Promise<Object> - wyniki wyszukiwania

#### 22. **GET Request Handler**
```typescript
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");
    const includeImages = url.searchParams.get("include_images") === "true";
    const searchDepth = url.searchParams.get("search_depth") || "basic";
    const aiInsights = url.searchParams.get("ai_insights") === "true";
    
    const env = (locals as any)?.runtime?.env;
    
    // Handle different request types
    if (!query) {
      return new Response(JSON.stringify({
        success: true,
        service: "Tavily Search API - Enhanced with AI",
        help: {
          description: "Zaawansowana wyszukiwarka internetowa z AI insights",
          required_params: ["q - zapytanie wyszukiwania"],
          optional_params: [
            "search_depth - basic|advanced",
            "include_images - true|false",
            "ai_insights - true|false",
            "max_results - 1-20",
          ]
        }
      }));
    }
    
    // Perform search
    const searchResults = await performTavilySearch(env, query, {
      includeImages,
      searchDepth
    });
    
    // Generate AI insights if requested
    let insights = null;
    if (aiInsights) {
      insights = await generateSearchInsights(
        searchResults.results || [],
        query,
        env
      );
    }
    
    return new Response(JSON.stringify({
      success: true,
      results: searchResults,
      ai_insights: insights,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), { status: 500 });
  }
};
```
**Lokalizacja**: Linie 122-270  
**Funkcja**: Handler dla GET requests  
**Parametry**: `{ request, locals }` (Astro context)  
**Zwraca**: Promise<Response> - HTTP response

#### 23. **generateId()**
```typescript
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
```
**Lokalizacja**: Linie 118-120  
**Funkcja**: Generowanie unikalnych ID dla wyszukiwań  
**Parametry**: brak  
**Zwraca**: string - unikalny identyfikator

## FUNKCJE SVELTE WIDGET (TavilyWidget.svelte)

### Główne Funkcje Widget

#### 24. **searchWeb()**
```javascript
async function searchWeb() {
  if (!searchQuery.trim() || isLoading) return;
  
  const query = searchQuery.trim();
  searchQuery = "";
  
  isLoading = true;
  error = null;
  
  try {
    const response = await fetch("/api/tavi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        maxResults: 5,
        includeAnswer: true,
        includeImages: false,
      }),
    });
    
    const result = await response.json();
    
    if (result.status === "success") {
      results = result;
      dispatch("searchCompleted", { results: result });
    } else {
      throw new Error(result.error || "Nie udało się wykonać wyszukiwania");
    }
  } catch (err) {
    error = err.message;
    results = null;
    console.error("Tavily error:", err);
  } finally {
    isLoading = false;
  }
}
```
**Lokalizacja**: Linie 12-48  
**Funkcja**: Główna funkcja wyszukiwania w widget  
**Parametry**: brak (używa reactive variables)  
**Zwraca**: Promise<void>

#### 25. **handleKeyPress(event)**
```javascript
function handleKeyPress(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    searchWeb();
  }
}
```
**Lokalizacja**: Linie 50-55  
**Funkcja**: Obsługa klawisza Enter w polu wyszukiwania  
**Parametry**: `event` (KeyboardEvent)  
**Zwraca**: void

#### 26. **toggleExpanded()**
```javascript
function toggleExpanded() {
  isExpanded = !isExpanded;
}
```
**Lokalizacja**: Linie 57-59  
**Funkcja**: Przełączanie widoku rozszerzonego  
**Parametry**: brak  
**Zwraca**: void

#### 27. **openFullTavily()**
```javascript
function openFullTavily() {
  window.open("/tavily-search", "_blank");
}
```
**Lokalizacja**: Linie 61-63  
**Funkcja**: Otwieranie pełnej strony Tavily  
**Parametry**: brak  
**Zwraca**: void

#### 28. **clearResults()**
```javascript
function clearResults() {
  results = null;
  error = null;
}
```
**Lokalizacja**: Linie 65-68  
**Funkcja**: Czyszczenie wyników wyszukiwania  
**Parametry**: brak  
**Zwraca**: void

#### 29. **openResult(url)**
```javascript
function openResult(url) {
  window.open(url, "_blank");
}
```
**Lokalizacja**: Linie 70-72  
**Funkcja**: Otwieranie wyniku wyszukiwania  
**Parametry**: `url` (string) - URL do otwarcia  
**Zwraca**: void

## ZMIENNE GLOBALNE I STAŁE

### Frontend Variables (tavily-search.astro)
```javascript
let searchHistory = JSON.parse(localStorage.getItem("tavilySearchHistory") || "[]");
let searchStats = JSON.parse(localStorage.getItem("tavilySearchStats") || "{ totalSearches: 0, totalResults: 0, totalTime: 0, domains: {} }");
let currentResults = [];
let searchStartTime = null;
```

### Backend Constants (/api/tavily/search.ts)
```typescript
const searchHistory: Array<{
  id: string;
  query: string;
  timestamp: number;
  results: number;
  searchDepth: string;
  executionTime: number;
  status: "success" | "error";
}> = [];

const EXAMPLE_SEARCHES = {
  "artificial intelligence": { /* mock data */ },
  "machine learning": { /* mock data */ },
  // ... więcej przykładów
};
```

### Widget State (TavilyWidget.svelte)
```javascript
let searchQuery = "";
let results = null;
let isLoading = false;
let error = null;
let isExpanded = false;
```

## FLOW WYKONANIA FUNKCJI

### 1. Inicjalizacja Aplikacji
```
DOMContentLoaded → updateSearchHistoryDisplay() → updateStatsDisplay()
```

### 2. Wykonanie Wyszukiwania
```
performSearch() → fetch(/api/tavily/search) → performTavilySearch() → displayResults()
```

### 3. Przetwarzanie Wyników
```
displayResults() → updateSearchStats() → addToSearchHistory() → updateSearchHistoryDisplay()
```

### 4. AI Enhancement
```
generateSearchInsights() → env.AI.run() → displayAISummary()
```

---

*Mapowanie funkcji wygenerowane automatycznie - ostatnia aktualizacja: 2025-01-12*