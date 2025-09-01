# Wdrożenie Bielika na Cloudflare Workers - Kompletny przewodnik

## Wymagania wstępne
- Konto Cloudflare z dostępem do Workers
- Model Bielik w formacie ONNX lub kompatybilnym z Workers
- Podstawowa znajomość JavaScript/TypeScript

## Krok 1: Przygotowanie modelu
1. Pobierz model Bielik z repozytorium
2. Przekonwertuj model do formatu ONNX przy użyciu narzędzi konwersji
3. Optymalizuj model za pomocą kwantyzacji dla zmniejszenia rozmiaru
4. Przetestuj model lokalnie przed wdrożeniem

## Krok 2: Konfiguracja środowiska Cloudflare
1. Zaloguj się do dashboardu Cloudflare Workers
2. Utwórz nowego Workera o nazwie "bielik-ai-worker"
3. Skonfiguruj zmienne środowiskowe dla kluczy API i ustawień

## Krok 3: Instalacja zależności
W konsoli Workers lub via Wrangler CLI:
```bash
npm install @cloudflare/workers-types
npm install ONNX Runtime for Web (jeśli dostępne)
```

## Krok 4: Implementacja głównego workera
Plik: `src/workers/bielik-worker.ts`

```typescript
export interface Env {
  AI_MODEL: any; // Referencja do załadowanego modelu
  API_KEYS: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Sprawdź autoryzację
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Przetwórz żądanie
    try {
      const inputText = await request.text();
      const result = await processWithBielik(inputText, env);
      
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};

async function processWithBielik(text: string, env: Env): Promise<any> {
  // Implementacja przetwarzania tekstu przez model Bielik
  // Użyj env.AI_MODEL jeśli model jest pre-ładowany
  // Lub załaduj model dynamicznie
  
  return {
    processed_text: text,
    confidence: 0.95,
    tokens: text.split(' ').length
  };
}
```

## Krok 5: Optymalizacja wydajności
- Użyj kwantyzacji modelu do zmniejszenia rozmiaru
- Ogranicz długość tekstu wejściowego do 512 tokenów
- Włącz caching odpowiedzi dla powtarzających się zapytań
- Monitoruj użycie pamięci i czas wykonania

## Krok 6: Bezpieczeństwo
1. Implementuj uwierzytelnianie JWT
2. Ogranicz liczbę zapytań na użytkownika (rate limiting)
3. Waliduj dane wejściowe przed przetworzeniem
4. Używaj HTTPS i CORS

## Krok 7: Testowanie
Przetestuj lokalnie z Wrangler:
```bash
wrangler dev src/workers/bielik-worker.ts
```

Test endpointów:
```bash
curl -X POST https://your-worker.workers.dev/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "Tekst do analizy"
```

## Krok 8: Wdrożenie produkcyjne
```bash
wrangler publish src/workers/bielik-worker.ts --env production
```

## Krok 9: Monitorowanie
- Śledź metryki wydajności w Cloudflare Dashboard
- Monitoruj zużycie pamięci i czas wykonania
- Ustaw alerty dla błędów i przekroczeń limitów

## Przykładowa konfiguracja Wrangler
`wrangler.toml`:
```toml
name = "bielik-ai-worker"
compatibility_date = "2024-01-01"
usage_model = "bundled"

[vars]
AI_MODEL_PATH = "./models/bielik.onnx"

[kv_namespaces]
binding = "API_KEYS"
id = "your-kv-namespace-id"
```

## Rozwiązanie problemów
- **Błąd pamięci**: Zmniejsz rozmiar modelu lub zwiększ limit pamięci Workers
- **Opóźnienia**: Optymalizuj model i włącz caching
- **Autoryzacja**: Sprawdź poprawność tokenów JWT

## Integracja z frontendem
Przykład użycia z JavaScript:
```javascript
async function queryBielik(text) {
  const response = await fetch('https://bielik-worker.your-domain.workers.dev', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'text/plain'
    },
    body: text
  });
  
  return await response.json();
}
```

Pamiętaj o ograniczeniach Cloudflare Workers:
- 100 MB RAM na worker
- 100 ms maksymalny czas wykonania (dla planu darmowego)
- 100,000 żądań dziennie (darmowy limit)
