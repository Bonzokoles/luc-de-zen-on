# 📋 INSTRUKCJE RULEZ - STANDARDY IMPLEMENTACJI I NAPRAW

## 🎯 PODSTAWOWE ZASADY

### 1. ZAWSZE SPRAWDZAJ POPRAWNOŚĆ KODU UŻYWAJĄC MCP ASTRO

- Przed każdą zmianą uruchom `mcp astro` dla walidacji
- MCP zawiera najnowsze wytyczne implementacji framework Astro
- Wszystkie zmiany muszą być zgodne ze standardami Astro 5+
- Używaj TypeScript dla typowania i bezpieczeństwa kodu

### 2. UNIFIKACJA INTERFEJSÓW - WZORZEC BACKROOM

Wszystkie interfejsy funkcji muszą być zgodne z szablonem **AI CHATBOT** i **KAGGLE DATASET**

#### 2.1 Lokalizacja szablonów layoutów:

```
Template Base:
├── src/layouts/BackroomInterface.astro  # Main backroom layout
├── src/pages/chatbot.astro              # AI Chatbot template
└── src/pages/kaggle-datasets.astro      # Kaggle Datasets template

Style Requirements:
├── Cyberpunk-inspired design
├── Glass morphism effects
├── Consistent color scheme: #0a0f14, #1be1ff, #ff6b35
├── Uniform button styling
└── Responsive grid layout
```

#### 2.2 Standardowe komponenty interfejsu:

- **Header Section**: Tytuł + opis funkcji
- **Main Panel**: Główny obszar funkcji (grid 2x1 lub 3x1)
- **Control Buttons**: Jednolite przyciski akcji
- **Status Indicators**: Live status każdej funkcji
- **Results Container**: Obszar wyników z scrollem

### 3. KAŻDY PRZYCISK MUSI MIEĆ DZIAŁAJĄCĄ FUNKCJĘ

- Żadnych fake data ani placeholder funkcji
- Każdy button onClick musi mieć rzeczywistą implementację
- Dodaj "przykładowe dane" tylko do instrukcji demonstracyjnych
- Wszystkie API calls muszą zwracać rzeczywiste dane
- **JEŻELI UWAŻASZ że jest możliwość ulepszenia lub małej rozbudowy - ZRÓB TO!**

### 4. DOKUMENTACJA FUNKCJI DLA AI TRAINING

#### 4.1 Format opisu funkcji w plikach FUNKCJE:

Każdy opis funkcji w `*_FUNKCJE.md` musi być strukturyzowany tak, aby model AI mógł się na nim wytrenować jako asystent strony:

```markdown
## 🤖 [NAZWA_FUNKCJI] - Asystent AI

### Opis dla użytkownika:

"Cześć! Jestem [nazwa] i pomogę Ci [co robi funkcja]. Wystarczy że [jak użyć] i otrzymasz [co dostanie]."

### Instrukcje krok po kroku:

1. **Krok 1**: [dokładny opis co zrobić]
2. **Krok 2**: [kolejny krok z przykładem]
3. **Rezultat**: [co się stanie i jak wygląda wynik]

### Przykłady użycia:

- **Scenariusz A**: [typowe zastosowanie]
- **Scenariusz B**: [zaawansowane użycie]
- **Wskazówki**: [pro tips dla użytkownika]

### Rozwiązywanie problemów:

- **Problem**: [częsty błąd] → **Rozwiązanie**: [jak naprawić]
- **Problem**: [inny błąd] → **Rozwiązanie**: [jak naprawić]
```

#### 4.2 Training-ready content requirements:

- **Język konwersacyjny**: "Pomogę Ci", "Wystarczy że", "Zobacz jak"
- **Konkretne przykłady**: Rzeczywiste dane, nie placeholder
- **Przewidywanie błędów**: FAQ z rozwiązaniami
- **Step-by-step guidance**: Numerowane kroki z szczegółami
- **Friendly tone**: Entuzjastyczny asystent, nie suchy manual

### 5. FLOATING ASSISTANT POLACZEK_T NA KAŻDEJ STRONIE

#### 5.1 Implementacja globalnego floating button:

```javascript
// Wzorzec z głównej strony (index.astro)
<div class="floating-widget-container">
  <button
    onclick="togglePolaczekAssistant()"
    class="right-btn"
    id="polaczekBtn"
    title="AI Assistant POLACZEK_T - Pomoc i instrukcje"
  >
    <CpuChipIcon className="w-6 h-6 inline mr-2" /> POLACZEK_T
  </button>
  <div id="polaczekWidget" class="floating-widget">
    <AiHelpAssistant client:load />
  </div>
</div>
```

#### 4.2 Pozycjonowanie i styl:

```css
.floating-widget-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.right-btn {
  background: linear-gradient(45deg, #1be1ff, #0f3846);
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(27, 225, 255, 0.3);
}
```

#### 4.3 Voice Integration na każdej stronie:

- AI Assistant z obsługą głosową
- Możliwość rozmowy o funkcji strony
- Instrukcje dotyczące możliwości funkcji
- Kontekstowe wsparcie per strona
- **OBNIZENIE UX**: Wszystkie podokna z obniżonym kontrastem i większymi rozmiarami dla lepszej czytelności

### 5. PROCEDURA NAPRAWY SYSTEMOWEJ

#### 5.1 KROK 1: Przeczytaj wszystkie pliki INDEX

```bash
# Przeczytaj główne pliki funkcji:
- src/pages/index.astro
- src/pages/image-generator.astro
- src/pages/chatbot.astro
- src/pages/voice-ai-assistant.astro
- src/pages/kaggle-datasets.astro
- src/pages/ai-business-box/index.astro
- src/pages/ai-browser.astro
```

#### 5.2 KROK 2: Analiza według wzorca

Dla każdego pliku sprawdź:

- ✅ Layout zgodny z BackroomInterface
- ✅ Wszystkie przyciski mają działające funkcje
- ✅ Floating POLACZEK_T button obecny
- ✅ Voice integration zaimplementowana
- ✅ Error handling i CORS obsługa
- ✅ TypeScript types poprawne

#### 5.3 KROK 3: Napraw funkcję krok po kroku

1. **Implementuj BackroomInterface layout**(dla tych co nie mają - AI Browser & Agents-Voice AI Assistant-)
2. **Dodaj floating POLACZEK_T assistant**(globalnie dla kazdej podstrony, z mozliwością rozmowy)
3. **Napraw wszystkie niedziałające przyciski**
4. **Dodaj voice integration**
5. **Waliduj z MCP Astro**
6. **Testuj wszystkie funkcje**

#### 5.4 KROK 4: Po naprawie każdej funkcji

```bash
# Wróć i przeczytaj ten plik ponownie dla weryfikacji
Q:\mybonzo\luc-de-zen-on\docs\aplikacja_funkcje\0E_INSTRUKCJE_RULEZ.md

# Sprawdź czy wszystkie punkty zostały zrealizowane:
- [x] MCP Astro walidacja
- [x] BackroomInterface layout
- [x] Działające przyciski
- [X] Funkcjonalność całości
- [x] POLACZEK_T floating button
- [x] Voice integration
- [x] Testowanie funkcji
```

---

## 🔧 SZCZEGÓŁOWE STANDARDY IMPLEMENTACJI

### 6. ASTRO FRAMEWORK BEST PRACTICES

#### 6.1 TypeScript Integration:

```typescript
// Proper interface definition
interface Props {
  title?: string;
  description?: string;
}

// Proper destructuring with defaults
const { title = "Default Title", description = "Default Description" } =
  Astro.props;
```

#### 6.2 Component Imports:

```astro
---
// Type imports first
import type { HTMLAttributes } from "astro/types";

// Layout imports
import MyBonzoLayout from "../layouts/MyBonzoLayout.astro";
import BackroomInterface from "../layouts/BackroomInterface.astro";

// Component imports
import AiHelpAssistant from "../components/AiHelpAssistant.svelte";
---
```

#### 6.3 API Route Structure:

```typescript
// src/pages/api/endpoint.ts
import type { APIRoute } from "astro";
import { createSuccessResponse, createErrorResponse } from "@/utils/corsUtils";

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Implementation
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse(error.message, 500);
  }
};
```

### 7. POLACZEK_T ASSISTANT SPECYFIKACJA

#### 7.1 Kontekstowe instrukcje per strona:

```javascript
// Funkcje POLACZEK_T dla każdej strony
const PAGE_CONTEXTS = {
  "image-generator": {
    description: "Generator obrazów AI z Flux-1 Schnell",
    features: ["Prompt input", "Style selection", "Download options"],
    voice_commands: ["generuj obraz", "zapisz obraz", "zmień styl"],
  },
  chatbot: {
    description: "AI Chatbot z wieloma modelami",
    features: ["Multi-model chat", "Voice input", "History"],
    voice_commands: ["uruchom chat", "zmień model", "wyczyść historię"],
  },
  // ... kontekst dla każdej strony
};
```

#### 7.2 Voice Commands Integration:

```javascript
// Voice commands dla POLACZEK_T
const POLACZEK_VOICE_COMMANDS = {
  activation: ["polaczek", "asystent", "pomoc"],
  functions: {
    "wyjaśnij funkcję": () => explainPageFunction(),
    "pokaż możliwości": () => showCapabilities(),
    "rozpocznij demo": () => startDemo(),
    "otwórz ustawienia": () => openSettings(),
  },
  navigation: {
    "przejdź do menu": () => navigateToMenu(),
    "powrót do głównej": () => navigateHome(),
  },
};
```

### 8. BACKROOM LAYOUT STANDARDY

#### 8.1 Main Layout Structure:

```astro
<!-- Template dla wszystkich stron funkcji -->
<BackroomInterface siteTitle="Function Name | MyBonzo AI">
  <main class="min-h-svh relative z-10">
    <!-- Background - OBNIŻONY KONTRAST dla lepszej czytelności -->
    <div class="fixed inset-0 bg-[#0f1419]">
      <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/15 via-[#0f1419] to-[#0f1419]"></div>
    </div>

    <!-- Header Section -->
    <section class="relative z-20 border-b border-[#2a3441] pt-20">
      <div class="max-w-7xl mx-auto px-6 py-10">  <!-- POWIĘKSZONE okno i padding -->
        <h1 class="text-5xl md:text-6xl font-bold text-[#1be1ff] mb-3 uppercase tracking-wider font-['Rajdhani']">
          FUNCTION NAME
        </h1>
        <p class="text-[#c5d1d8] text-xl">Function description</p>  <!-- Jaśniejszy tekst -->
      </div>
    </section>

    <!-- Main Function Area - ROZBUDOWANE -->
    <section class="relative z-20 py-12">
      <div class="max-w-7xl mx-auto px-6">  <!-- Większe okno główne -->
        <!-- Function implementation -->
      </div>
    </section>
  </main>

  <!-- POLACZEK_T Floating Assistant -->
  <!-- Voice Integration -->
</BackroomInterface>
```

#### 8.2 Button Styling Standards (OBNIŻONY KONTRAST):

```css
/* Standardowe przyciski - lepsze UX */
.action-btn {
  background: linear-gradient(
    45deg,
    #1be1ff,
    #1a5866
  ); /* Łagodniejszy gradient */
  border: none;
  padding: 14px 28px; /* Większe przyciski */
  border-radius: 10px;
  color: white;
  font-weight: 600;
  font-size: 16px; /* Większy tekst */
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(27, 225, 255, 0.25); /* Delikatniejszy cień */
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(27, 225, 255, 0.35);
  background: linear-gradient(45deg, #2af0ff, #2a6877); /* Jaśniejszy hover */
}

.action-btn:active {
  transform: translateY(0);
}

/* Kontener funkcji - WIĘKSZE OKNA */
.function-container {
  background: rgba(15, 20, 25, 0.7); /* Mniej kontrastowe tło */
  border: 1px solid rgba(27, 225, 255, 0.2);
  border-radius: 12px;
  padding: 24px; /* Większy padding */
  margin: 16px 0; /* Więcej przestrzeni */
  min-height: 400px; /* Większa wysokość */
}
```

### 9. ERROR HANDLING I CORS

#### 9.1 Unified Error Responses:

```typescript
// src/utils/corsUtils.ts usage
export function createSuccessResponse(data: any) {
  return new Response(
    JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
```

#### 9.2 UTF-8 Encoding Fix:

```typescript
// POPRAWKA dla wszystkich API endpoints
headers: {
  'Content-Type': 'application/json; charset=utf-8'  // ✅ DODAJ charset=utf-8
}
```

### 10. TESTING I WALIDACJA

#### 10.1 Checklist przed deploy:

- [ ] MCP Astro validation passed
- [ ] All buttons functional
- [ ] POLACZEK_T assistant working
- [ ] Voice integration active
- [ ] Error handling implemented
- [ ] CORS headers correct
- [ ] UTF-8 encoding fixed
- [ ] Responsive design verified
- [ ] Performance optimized

#### 10.2 Manual Testing:

```bash
# Test each function:
1. Load page - check layout
2. Click all buttons - verify functionality
3. Test POLACZEK_T assistant - voice & text
4. Test voice commands
5. Check error scenarios
6. Verify mobile responsiveness
7. Performance audit
```

---

## 🚀 IMPLEMENTACJA WORKFLOW

### FAZA 1: ANALIZA (1-2 dni)

1. Przeczytaj wszystkie pliki INDEX functions
2. Zidentyfikuj odchylenia od standardów
3. Stwórz plan naprawczy dla każdej funkcji
4. Określ priorytet napraw

### FAZA 2: NAPRAWY CORE (3-5 dni)

1. Implementuj BackroomInterface we wszystkich funkcjach
2. Dodaj POLACZEK_T floating assistant globalnie
3. Napraw wszystkie niedziałające przyciski
4. Implementuj voice integration
5. **OBNIŻ KONTRAST wszystkich podokien dla lepszej czytelności**
6. **POWIĘKSZ/ROZBUDUJ wszystkie okna funkcji** (max-w-7xl, większy padding)
7. **ДОРАБОТАЙ funkcje** jeśli widzisz możliwość ulepszenia

### FAZA 3: WALIDACJA (1-2 dni)

1. MCP Astro validation dla każdej funkcji
2. Manual testing workflow
3. Performance optimization
4. Final QA i documentation

### FAZA 4: DEPLOYMENT (1 dzień)

1. Deploy do staging environment
2. End-to-end testing
3. Production deployment
4. Monitoring i feedback

---

**PAMIĘTAJ**: Po naprawie każdej funkcji wróć i przeczytaj ten plik ponownie aby upewnić się że wszystkie standardy zostały zachowane!

---

**Autor**: MyBonzo AI System  
**Wersja**: 1.0  
**Data**: 9 października 2025  
**Status**: Aktywne instrukcje implementacji
