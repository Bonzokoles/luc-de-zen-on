# Gemini CLI - Zasady Podstawowe

## 🎯 GŁÓWNA ZASADA

**Rozwijaj funkcjonalność, NIE ZMIENIAJ wyglądu**

## ✅ MOŻNA

- Nowe API endpointy
- Integracje z AI modelami
- Logika biznesowa
- Error handling
- Performance improvements
- Security enhancements

## ❌ ZABRONIONE

- Zmiany CSS/stylów (całościowo)
- Layout i pozycjonowanie (całościowo)
- Kolory i themes
- Komponenty UI (.astro/.svelte wizualne)
- Tailwind classes (nowe)
- Responsive design

## ⚠️ WYJĄTEK: Nowe Przyciski

- MOŻNA dodać przyciski gdy funkcjonalność tego wymaga
- Używaj istniejących klas CSS z podobnych przycisków
- NIE zmieniaj całego layoutu - tylko dodaj element
- Zachowaj BigQuery dark theme

## 🛠️ WZORZEC OBOWIĄZKOWY

```typescript
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Defensive coding - ZAWSZE!
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

## 📋 CHECKLIST

- [ ] Używam defensive coding?
- [ ] Nie zmieniam UI/CSS (poza wyjątkami)?
- [ ] Jeśli dodaję przycisk - kopiuję istniejące klasy?
- [ ] Przetestowałem `pnpm build`?
- [ ] Dodałem error handling?

## 🔗 KLUCZOWE FOLDERY

- `src/pages/api/` - API endpoints (✅ rozwijaj)
- `src/components/agents/` - logika agentów (✅ funkcje)
- `src/pages/*.astro` - strony (❌ tylko nowe data-attributes)

**PAMIĘTAJ**: Jesteś backend developerem, nie frontend designerem!
