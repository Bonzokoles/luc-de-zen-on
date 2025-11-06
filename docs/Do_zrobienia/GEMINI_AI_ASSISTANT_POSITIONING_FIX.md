# 🤖 AI ASSISTANT POSITIONING FIX - INSTRUKCJE DLA GEMINI

## 🎯 PROBLEM ZAKTUALIZOWANY

AI Assistant (POLACZEK_T) na większości podstron przysłania funkcje przycisków i zawartość strony.
**NOWE WYMAGANIE**: Może być na pierwszym planie po otwarciu, ale TYLKO do 1/4-1/6 ekranu od dołu i NAWET PO OTWARCIU nie może przysłaniać zawartości.

## ✅ ROZWIĄZANIE - OGRANICZENIE DO DOLNEJ STREFY

### 1. 🎪 **STREFA BEZPIECZNA - MAKSYMALNIE 1/4 EKRANU OD DOŁU**

- AI Assistant może się wyświetlać TYLKO w dolnych 25% ekranu
- Widget po otwarciu: maksymalnie 1/6 ekranu wysokości (16.6vh)
- Nie może przysłaniać głównej zawartości strony
- Nie może nakładać się na przyciski funkcyjne

### 2. 🔧 **NOWE POZYCJONOWANIE CSS**

```css
/* Container AI Assistant */
.ai-assistant-container {
  position: fixed;
  bottom: 15px;
  right: 15px;
  z-index: 35; /* Obniżony z 50 */
  max-width: 320px;
}

/* Widget AI Assistant - OGRANICZONY DO 1/6 EKRANU */
.ai-assistant-widget {
  position: absolute;
  bottom: 50px; /* Nad przyciskiem */
  right: 0;
  width: 400px;
  max-height: 16vh; /* MAKSYMALNIE 1/6 ekranu */
  min-height: 200px; /* Minimalna funkcjonalność */
  z-index: 34;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
```

### 3. 🚫 **ZAKAZY POZYCJONOWANIA**

- **NIE UŻYWAĆ z-index > 40**
- **NIE wysokość widgetu > 16vh (1/6 ekranu)**
- **NIE pozycjonować wyżej niż bottom: 10px**
- **NIE szerokość > 400px na desktop**
- **NIE nakładać się na główną zawartość strony**

## 📝 PLIKI DO MODYFIKACJI

### A) `src/pages/ai-functions/*/index.astro` - Wszystkie podstrony AI

```astro
<!-- POPRZEDNI KOD (ZNALEZIONE W 8 PLIKACH) -->
<div class="fixed bottom-5 right-5 z-50">
  <button id="polaczekBtn" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#00ffff] hover:brightness-125 transition-all duration-300 font-mono uppercase tracking-wide text-sm">🤖 POLACZEK_T</button>
  <div id="polaczekWidget" class="hidden absolute bottom-16 right-0 w-96 bg-surface border border-edge rounded-lg shadow-lg">

<!-- NOWY KOD - OGRANICZONY DO 1/6 EKRANU -->
<div class="fixed bottom-3 right-3 z-35 max-w-xs">
  <button id="polaczekBtn" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#00ffff] hover:brightness-125 transition-all duration-300 font-mono uppercase tracking-wide text-sm">🤖 POLACZEK_T</button>
  <div id="polaczekWidget" class="hidden absolute bottom-12 right-0 w-96 max-h-[16vh] min-h-[200px] overflow-y-auto bg-surface border border-edge rounded-lg shadow-lg">
```

**PLIKI DO ZMIANY (WYKRYTE PRZEZ GREP):**

- `src/pages/ai-functions/marketing-content/index.astro`
- `src/pages/ai-functions/personalized-recommendations/index.astro`
- `src/pages/ai-functions/customer-automation/index.astro`
- `src/pages/ai-functions/activity-monitoring/index.astro`
- `src/pages/ai-functions/reminders-calendar/index.astro`
- `src/pages/ai-functions/interactive-quizzes/index.astro`
- `src/pages/ai-functions/education-recommendations/index.astro`
- `src/pages/ai-functions/dynamic-faq/index.astro`
- `src/pages/ai-functions/ai-tickets/index.astro`

### B) `src/components/AiHelpAssistant.svelte` - Z-INDEX COMPONENT

**Lokalizacja:** Linia 437

```svelte
/* POPRZEDNI KOD */
.assistant-container {
  z-index: 1000;
}

/* NOWY KOD - OGRANICZONY DO 1/6 EKRANU */
.assistant-container {
  z-index: 34; /* Było: 1000 */
  max-height: 16vh; /* MAKSYMALNIE 1/6 EKRANU */
  min-height: 200px;
  overflow-y: auto;
}
```

### C) DODATKOWE STRONY Z BŁĘDNYM POZYCJONOWANIEM

**WYKRYTE DODATKOWE PLIKI DO ZMIANY:**

- `src/pages/activepieces-ai.astro` (linia 43)
- `src/pages/ai-browser.astro` (linia 179)
- `src/pages/ai-business-box/index.astro` (linia 175)
- `src/pages/tavily-search.astro` (linia 175)
- `src/pages/voice-ai-assistant.astro` (linia 180)
- `src/pages/kaggle-datasets.astro` (linia 177)
- `src/pages/image-generator.astro` (linia 186)
- `src/pages/flowise-ai.astro` (linia 43)

**WZORZEC DO ZMIANY (identyczny we wszystkich plikach):**

```astro
<!-- POPRZEDNI KOD -->
<div class="fixed bottom-5 right-5 z-50">
  <button id="polaczekBtn" class="action-btn">🤖 POLACZEK_T</button>
  <div id="polaczekWidget" class="hidden absolute bottom-16 right-0 w-96 bg-surface border border-edge rounded-lg shadow-lg">

<!-- NOWY KOD -->
<div class="fixed bottom-3 right-3 z-35 max-w-xs">
  <button id="polaczekBtn" class="action-btn">🤖 POLACZEK_T</button>
  <div id="polaczekWidget" class="hidden absolute bottom-12 right-0 w-96 max-h-[16vh] min-h-[200px] overflow-y-auto bg-surface border border-edge rounded-lg shadow-lg">
```

### D) `src/pages/index.astro` - Główna strona

Sprawdź wszystkie wystąpienia AI Assistant i zastosuj te same reguły.

## 🎨 RESPEKTOWANE ELEMENTY Z WYŻSZYM PRIORYTETEM

### 1. **Floating Buttons System** - z-index 900-1000+

- `FloatingButtonsManager.ts` - Przyciski AI agentów
- `GoogleVoiceAgent.svelte` - z-index 9998-9999
- `OpenRouterFloatingButtons.svelte` - z-index 1000

### 2. **Navigation & Header** - z-index 1000+

- Header nawigacji
- Menu mobilne
- Dropdown listy

### 3. **Critical UI Elements**

- Modalne okna
- Tooltips
- Powiadomienia systemowe

## 📏 RESPONSIVE BREAKPOINTS

```css
/* Desktop */
@media (min-width: 1024px) {
  .ai-assistant-container {
    bottom: 20px;
    right: 20px;
    max-width: 400px;
  }
}

/* Tablet */
@media (max-width: 1023px) and (min-width: 768px) {
  .ai-assistant-container {
    bottom: 15px;
    right: 15px;
    max-width: 350px;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .ai-assistant-container {
    bottom: 10px;
    right: 10px;
    left: 10px; /* Full width minus margins */
    max-width: none;
  }
}
```

## 🔄 PLAN WDROŻENIA

### KROK 1: Modyfikacja komponentu Svelte

- `src/components/AiHelpAssistant.svelte` (linia 437)
- Zmień z-index z 1000 na 34
- Dodaj max-height: 16vh
- Dodaj min-height: 200px
- Dodaj overflow-y: auto

### KROK 2: Modyfikacja podstron AI Functions (9 plików)

Pliki do zmiany:

- `src/pages/ai-functions/marketing-content/index.astro`
- `src/pages/ai-functions/personalized-recommendations/index.astro`
- `src/pages/ai-functions/customer-automation/index.astro`
- `src/pages/ai-functions/activity-monitoring/index.astro`
- `src/pages/ai-functions/reminders-calendar/index.astro`
- `src/pages/ai-functions/interactive-quizzes/index.astro`
- `src/pages/ai-functions/education-recommendations/index.astro`
- `src/pages/ai-functions/dynamic-faq/index.astro`
- `src/pages/ai-functions/ai-tickets/index.astro`

Zmiany w każdym pliku:

- `fixed bottom-5 right-5 z-50` → `fixed bottom-3 right-3 z-35`
- Dodaj do widgetu: `max-h-[16vh] min-h-[200px] overflow-y-auto`

### KROK 3: Modyfikacja dodatkowych stron (8 plików)

Pliki do zmiany:

- `src/pages/activepieces-ai.astro` (linia 43)
- `src/pages/ai-browser.astro` (linia 179)
- `src/pages/ai-business-box/index.astro` (linia 175)
- `src/pages/tavily-search.astro` (linia 175)
- `src/pages/voice-ai-assistant.astro` (linia 180)
- `src/pages/kaggle-datasets.astro` (linia 177)
- `src/pages/image-generator.astro` (linia 186)
- `src/pages/flowise-ai.astro` (linia 43)

### KROK 4: Testowanie

- Sprawdź każdą podstronę (17 plików)
- Upewnij się, że widget nie przekracza 1/6 ekranu
- Przetestuj na desktop/tablet/mobile
- Sprawdź czy nie nakłada się na floating buttons (z-index 900-1000+)

## 📊 PODSUMOWANIE ZMIAN

**ŁĄCZNIE DO ZMIANY: 18 PLIKÓW**

- 1x komponent Svelte (AiHelpAssistant.svelte)
- 9x podstrony AI Functions
- 8x dodatkowe strony główne

**KLUCZOWE WARTOŚCI:**

- Container z-index: **35** (było: 50)
- Widget max-height: **16vh** (1/6 ekranu)
- Widget min-height: **200px** (minimalna funkcjonalność)
- Position: **bottom-3 right-3** (było: bottom-5 right-5)

## ⚠️ UWAGI KRYTYCZNE

1. **Zachowaj funkcjonalność** - AI Assistant musi dalej działać
2. **Nie ruszaj BackroomInterface.astro** - Jest używany przez inne layouty
3. **Testuj na różnych rozdzielczościach**
4. **Sprawdź czy przycisk aktywacji jest zawsze widoczny**
5. **Upewnij się, że widget nie przysłania przycisku aktywacji**

## 🎯 REZULTAT

AI Assistant będzie ograniczony do dolnego prawego rogu, nie będzie przysłaniał funkcji strony i będzie respektował hierarchię z-index innych elementów.

---

**Utworzone:** $(Get-Date)
**Cel:** Naprawienie pozycjonowania AI Assistant na wszystkich podstronach
**Priorytet:** WYSOKI - Dotyczy UX całej aplikacji
