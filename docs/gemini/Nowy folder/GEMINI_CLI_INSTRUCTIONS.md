# Instrukcje dla Gemini CLI - MyBonzo Platform

## 🔒 ZASADY FUNDAMENTALNE

### CO MOŻNA ZMIENIAĆ ✅

- **Funkcjonalność API** - dodawanie nowych endpointów, poprawianie logiki
- **Integracje zewnętrzne** - nowe połączenia z AI modelami, bazami danych
- **Logika biznesowa** - algorytmy, przetwarzanie danych, workflows
- **Konfiguracja** - zmienne środowiskowe, ustawienia projektowe
- **Bezpieczeństwo** - defensive coding, error handling, validacje
- **Performance** - optymalizacja zapytań, cache, kompresja

### CO JEST ZABRONIONE ❌

- **Wizualna strona** - kolory, layout, CSS, komponenty UI (całościowo)
- **Stylowanie** - klasy Tailwind, style inline, animacje CSS
- **Struktura HTML** - komponenty .astro, .svelte (tylko jeśli nie dotyczą logiki)
- **Tematy kolorystyczne** - BigQuery dark theme jest finalny
- **Layout głównej strony** - widgets, pozycjonowanie, responsive design

### WYJĄTEK: Nowe Przyciski Funkcjonalne ⚠️

- **MOŻNA dodać nowe przyciski** - TYLKO jeśli wymaga tego funkcjonalność podstrony
- **Używaj istniejących klas CSS** - kopiuj style z podobnych przycisków
- **NIE zmieniaj całości layoutu** - tylko dodaj element, nie przebudowuj
- **Zachowaj BigQuery theme** - ciemne tło, standardowe kolory
- **Przykład dozwolony**: nowy przycisk "Eksportuj dane" w module analytics

## 🛠️ OBSZARY DZIAŁANIA

### 1. API Development

```typescript
// ✅ DOZWOLONE - nowe endpointy
export const POST: APIRoute = async ({ request, locals }) => {
  // Defensive coding pattern
  const env = (locals as any)?.runtime?.env;
  if (!env) {
    return new Response(
      JSON.stringify({ error: "Environment not available" }),
      { status: 503 }
    );
  }
  // Twoja logika...
};

// ✅ DOZWOLONE - poprawki istniejących API
// ❌ ZABRONIONE - zmiany w UI komponentach
```

### 2. Integracje AI Models

- **DeepSeek API** - rozwijanie funkcji chat, code generation
- **Cloudflare AI** - nowe modele, optymalizacja promptów
- **OpenRouter** - dodawanie nowych providerów
- **Tavily Search** - rozszerzanie możliwości wyszukiwania
- **Kaggle API** - nowe datasety, analityka

### 3. Cloudflare Workers Integration

```javascript
// ✅ ZAWSZE używaj defensive coding
const env = (locals as any)?.runtime?.env;
if (!env) {
  return new Response(JSON.stringify({error: 'Environment not available'}), {status: 503});
}

// ✅ Proper error handling
try {
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
} catch (error) {
  return new Response(JSON.stringify({
    error: 'Service unavailable',
    details: error instanceof Error ? error.message : 'Unknown error'
  }), {status: 503});
}
```

## 📁 STRUKTURA PROJEKTU

### Modular Agents System

```
src/components/agents/modules/
├── agent-XX-name/
│   ├── index.astro     # ❌ Nie zmieniaj UI
│   ├── api.ts          # ✅ Rozwijaj logikę
│   ├── component.svelte # ❌ Tylko logika, nie style
│   ├── config.ts       # ✅ Konfiguracja
│   └── README.md       # ✅ Dokumentacja
```

### API Endpoints Pattern

```
src/pages/api/
├── generate-image.ts   # ✅ Nowe modele, optymalizacja
├── openrouter-chat.ts  # ✅ Nowi providerzy
├── tickets.ts          # ✅ Workflow improvements
└── recommendations.ts  # ✅ Better algorithms
```

## 🔧 DEVELOPMENT GUIDELINES

### Environment Variables

```typescript
// ✅ ZAWSZE defensive access
const apiKey = (locals as any)?.runtime?.env?.DEEPSEEK_API_KEY;
const kaggleKey = (locals as any)?.runtime?.env?.KAGGLE_KEY;

// ❌ NIGDY build-time access w production
const apiKey = import.meta.env.DEEPSEEK_API_KEY; // Nie działa w CF Workers
```

### Error Handling Standard

```typescript
// ✅ Standardowy pattern dla wszystkich API
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env) {
      return new Response(
        JSON.stringify({ error: "Environment not available" }),
        { status: 503 }
      );
    }

    const body = (await request.json()) as any;
    // Twoja logika...
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
};
```

### Build & Deploy Commands

```bash
# ✅ Zawsze testuj przed zmianami
pnpm build              # Sprawdź czy się kompiluje
pnpm dev                # Local development
wrangler dev           # Cloudflare Pages testing

# ✅ Deploy tylko po testach
.\deploy-to-production.ps1  # Production deployment
.\quick-sync.ps1           # Build validation only
```

## 🎯 PRIORYTETY ROZWOJU

### Wysokie Priority

1. **API Stability** - defensive coding we wszystkich endpointach
2. **Performance** - optymalizacja response times
3. **Security** - input validation, rate limiting
4. **Monitoring** - health checks, error tracking
5. **New Integrations** - dodatkowe AI services

### Średnie Priority

1. **Documentation** - API docs, code comments
2. **Testing** - unit tests, integration tests
3. **Caching** - Redis, Cloudflare cache
4. **Analytics** - usage tracking, metrics

### Niskie Priority

1. **Code Refactoring** - tylko jeśli nie wpływa na UI
2. **Dependencies Update** - ostrożnie, testuj wszystko
3. **Configuration** - environment-specific settings

## 🚫 BEZWZGLĘDNE ZAKAZY

### Nie dotykaj:

- `src/pages/index.astro` - główna strona (wizualnie)
- Pliki CSS/style - BigQuery theme jest finalny
- Layout components - pozycjonowanie widgetów
- Tailwind classes w komponentach UI
- Animacje i transitions
- Responsive breakpoints
- Color schemes i themes

### Wyjątki:

- Dodawanie nowych data-attributes dla funkcjonalności
- Nowe event handlers (addEventListener pattern)
- Nowe komponenty funkcjonalne (bez stylowania)

## 📋 CHECKLIST PRZED KAŻDĄ ZMIANĄ

- [ ] Czy zmiana dotyczy tylko logiki/funkcjonalności?
- [ ] Czy używam defensive coding pattern?
- [ ] Czy dodałem proper error handling?
- [ ] Czy przetestowałem w dev environment?
- [ ] Czy build przechodzi bez błędów?
- [ ] Czy nie zmieniłem nic wizualnego (poza wyjątkami)?
- [ ] Jeśli dodaję przycisk - czy używam istniejących klas CSS?
- [ ] Czy zaktualizowałem dokumentację?

## 🔗 KLUCZOWE PLIKI DO STUDIOWANIA

```
AGENT_BRIEFING.md                    # Pełny kontekst projektu
DEVELOPMENT_WORKFLOW_GUIDE.md        # Dual-repo workflow
src/components/agents/AGENTS_DOCUMENTATION.md
.github/copilot-instructions.md      # AI Assistant guidelines
astro.config.mjs                     # Cloudflare configuration
```

## 🎯 PRZYKŁADY DOZWOLONYCH ZMIAN

### ✅ Nowy API endpoint

```typescript
// src/pages/api/new-feature.ts
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any)?.runtime?.env;
  if (!env)
    return new Response(
      JSON.stringify({ error: "Environment not available" }),
      { status: 503 }
    );

  // Nowa funkcjonalność...
};
```

### ✅ Rozszerzenie istniejącego API

```typescript
// Dodanie nowego parametru do generate-image.ts
const {
  prompt,
  model = "flux-dev",
  style = "realistic",
  aspectRatio = "1:1",
} = body;
```

### ✅ Nowa integracja

```typescript
// Nowy AI provider w openrouter-chat.ts
const providers = {
  deepseek: "deepseek/deepseek-chat",
  claude: "anthropic/claude-3-sonnet",
  gemini: "google/gemini-pro", // NOWY
};
```

### ✅ Nowy przycisk funkcjonalny (WYJĄTEK)

```html
<!-- Kopiuj style z istniejących przycisków -->
<button
  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-500"
  data-action="export-data"
>
  Eksportuj Dane
</button>

<!-- Dodaj event listener dla funkcjonalności -->
<script>
  document.addEventListener("click", (e) => {
    if (e.target.dataset.action === "export-data") {
      // Twoja logika exportu...
    }
  });
</script>
```

## ⚠️ OSTRZEŻENIA

1. **Dual Repository** - zawsze pracuj w `luc-de-zen-on`, deploy przez skrypty
2. **Cloudflare Runtime** - środowisko produkcyjne różni się od dev
3. **TypeScript Errors** - zawsze używaj proper type assertions
4. **Memory Limits** - optymalizuj dla Cloudflare Workers constraints
5. **Rate Limiting** - implementuj dla external API calls

---

**PAMIĘTAJ**: Jesteś backend/functionality developer. UI/UX jest poza Twoim zakresem. Skupiaj się na tym co aplikacja robi, nie jak wygląda.
