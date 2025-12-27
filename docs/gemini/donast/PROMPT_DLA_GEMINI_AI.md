# 🤖 PROMPT DLA GEMINI AI - SYSTEM INSTRUKCJI

**Skopiuj i wklej poniższy prompt do Gemini AI:**

---

## 📍 LOKALIZACJA PROJEKTU

Pracujesz w projekcie **MyBonzo** zlokalizowanym w:  
`Q:\mybonzo\luc-de-zen-on`

---

## 🎯 PODSTAWOWA ZASADA #1: NIE SZUKAJ - SPRAWDŹ INDEKS!

**ZANIM zaczniesz cokolwiek robić, ZAWSZE sprawdź:**

```
Q:\mybonzo\luc-de-zen-on\docs\aplikacja_funkcje\00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md
```

Ten plik zawiera **KOMPLETNĄ MAPĘ** wszystkich 9 zainstalowanych funkcji:

1. Generator Obrazów AI
2. Chatbot AI (multi-model)
3. Voice AI Assistant
4. Kaggle Datasets
5. BigQuery Analytics
6. Tavily Search
7. ZENON Business AI Box
8. POLACZEK Agent System
9. MCP Servers Management (12 serwerów)

**Co znajdziesz w tym pliku:**

- ✅ Status każdej funkcji (działa / w rozwoju)
- 📄 Pliki dokumentacji dla każdej funkcji
- 💻 Główne pliki kodu (ścieżki)
- 🔑 Konfiguracja API i tokenów
- 📍 Endpointy API
- 🎨 Komponenty UI (reusable)
- ⚠️ Znane problemy i rozwiązania

---

## 📂 STRUKTURA DOKUMENTACJI - GDY SZUKAĆ WIĘCEJ

### 1. **Główny Indeks** (start tutaj)

```
Q:\mybonzo\luc-de-zen-on\docs\00_INDEKS_GLOWNY.md
```

- Mapa wszystkich 5 folderów dokumentacji
- Quick reference do każdego folderu

### 2. **Zainstalowane Funkcje** (tu masz wszystko!)

```
Q:\mybonzo\luc-de-zen-on\docs\aplikacja_funkcje\00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md
```

- **SPRAWDŹ TO NAJPIERW** przed jakąkolwiek implementacją
- Kompletna mapa systemu

### 3. **Zadania do Zrobienia** (co wymaga pracy)

```
Q:\mybonzo\luc-de-zen-on\docs\Do_zrobienia\00_INDEKS_DO_ZROBIENIA.md
Q:\mybonzo\luc-de-zen-on\docs\Do_zrobienia\01_STATUS_ZADAN.md
```

- Plany wdrożeń
- Status: co zrobione ✅, co w trakcie ⏳

### 4. **Dokumentacja Gemini AI** (twoje instrukcje)

```
Q:\mybonzo\luc-de-zen-on\docs\gemini\00_INDEKS_DOKUMENTACJI.md
```

- Pliki 01-08: implementacje
- Sesje rozwojowe
- Pomocnicze dokumenty

### 5. **Audio/Muzyka**

```
Q:\mybonzo\luc-de-zen-on\docs\ELEVEN_LABS\
Q:\mybonzo\luc-de-zen-on\docs\playlista mp3\
```

---

## ⚙️ KONFIGURACJA PROJEKTU

### Główne pliki konfiguracyjne:

- `wrangler.toml` - Cloudflare Workers (AI binding, KV, R2)
- `astro.config.mjs` - Astro framework
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript

### Cloudflare Setup:

- **Account ID**: `7f490d58a478c6baccb0ae01ea1d87c3`
- **AI Gateway**: `bielik_gateway`
- **KV Namespace**: `SESSION`
- **R2 Bucket**: `mybonzo-temp-storage`

---

## 🚨 KRYTYCZNE ZASADY

### ZASADA 1: Sprawdź indeks PRZED implementacją

```
❌ ŹLE: "Zacznę implementować generator obrazów..."
✅ DOBRZE: "Sprawdzam 00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md...
           Generator Obrazów jest już zainstalowany ✅"
```

### ZASADA 2: Używaj istniejących komponentów

W indeksie znajdziesz sekcję "UI COMPONENTS - REUSABLE":

- `BackroomInterface.astro` - główny layout
- `AiHelpAssistant.svelte` - floating assistant
- `VoiceControl.svelte` - voice interface
- itd.

### ZASADA 3: Nie duplikuj endpointów API

Sprawdź sekcję "GŁÓWNE ENDPOINTY API" w indeksie:

- `/api/chat` - universal chat
- `/api/generate-image` - image generation
- `/api/bielik-polish` - polski model Bielik
- itd.

### ZASADA 4: Czytaj dokumentację funkcji

Dla każdej funkcji istnieją pliki:

- `0Xa_FUNKCJE.md` - opis funkcji
- `0Xb_PROBLEMY.md` - znane problemy
- `0Xc_INDEKS.md` - quick start
- `0X_ANALIZA.md` - analiza techniczna

---

## 🔧 CO ROBIĆ KROK PO KROKU

### Scenariusz 1: User prosi o nową funkcję

```
1. SPRAWDŹ: 00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md
2. PYTANIE: Czy ta funkcja już istnieje?
   - TAK → Podaj user'owi lokalizację i dokumentację
   - NIE → Sprawdź Do_zrobienia/01_STATUS_ZADAN.md
3. Jeśli planowane → Podaj plan implementacji
4. Jeśli nowe → Zaproponuj implementację (ale najpierw sprawdź #1!)
```

### Scenariusz 2: User zgłasza problem z funkcją

```
1. SPRAWDŹ: 00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md → sekcja tej funkcji
2. CZYTAJ: 0Xb_PROBLEMY.md (znane problemy)
3. SPRAWDŹ: sekcja "ZNANE PROBLEMY I ROZWIĄZANIA"
4. Jeśli problem znany → Podaj rozwiązanie
5. Jeśli nowy → Diagnozuj używając ścieżek z indeksu
```

### Scenariusz 3: User prosi o AI Assistant positioning fix

```
1. SPRAWDŹ: docs/Do_zrobienia/GEMINI_AI_ASSISTANT_POSITIONING_FIX.md
2. Tam masz kompletne instrukcje dla 18 plików
3. Użyj exact line numbers i exact patterns z tego pliku
```

### Scenariusz 4: User pyta o Voice AI

```
1. SPRAWDŹ: 00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md → sekcja 03. VOICE AI
2. Status: ✅ DZIAŁA (podstawowa implementacja)
3. Pliki: VoiceControl.svelte, GoogleVoiceAgent.svelte
4. W rozwoju: docs/Do_zrobienia/1_VOICE_AI_ASISTANT.md (central config)
```

---

## 📍 ŚCIEŻKI DO ZAPAMIĘTANIA

### Dokumentacja:

- Główny indeks: `docs/00_INDEKS_GLOWNY.md`
- **Kompletna mapa funkcji**: `docs/aplikacja_funkcje/00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md` 🔑
- Zadania: `docs/Do_zrobienia/01_STATUS_ZADAN.md`
- Gemini AI: `docs/gemini/00_INDEKS_DOKUMENTACJI.md`

### Kod aplikacji:

- Pages: `src/pages/`
- API: `src/pages/api/`
- Components: `src/components/`
- Layouts: `src/layouts/`
- Lib: `src/lib/`
- Workers: `src/workers/`

---

## ⚠️ NAJCZĘSTSZE BŁĘDY - UNIKAJ ICH!

### ❌ BŁĄD 1: Szukanie po całym projekcie

```
❌ "Przeszukam src/ aby znaleźć gdzie jest Voice AI..."
✅ "Sprawdzam 00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md → Voice AI → pliki kodu"
```

### ❌ BŁĄD 2: Proponowanie duplikacji

```
❌ "Stwórzmy nowy endpoint /api/polish-chat..."
✅ "Sprawdzam indeks... /api/bielik-polish już istnieje ✅"
```

### ❌ BŁĄD 3: Ignorowanie znanych problemów

```
❌ "Będę debugować AI Assistant positioning od zera..."
✅ "Sprawdzam indeks... Jest fix: GEMINI_AI_ASSISTANT_POSITIONING_FIX.md"
```

### ❌ BŁĄD 4: Nie czytanie statusu

```
❌ "Bielik Gateway do wdrożenia..."
✅ "Sprawdzam 01_STATUS_ZADAN.md... Bielik Gateway ✅ JUŻ DZIAŁA"
```

---

## 🎯 TWÓJ WORKFLOW

```
1. USER REQUEST
   ↓
2. SPRAWDŹ: 00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md
   ↓
3. CZY FUNKCJA ISTNIEJE?
   ├─ TAK → Podaj dokumentację i ścieżki
   └─ NIE → Sprawdź Do_zrobienia/01_STATUS_ZADAN.md
   ↓
4. CZY JEST W PLANACH?
   ├─ TAK → Podaj plan i status
   └─ NIE → Zaproponuj implementację (ale potwierdź z userem!)
   ↓
5. IMPLEMENTACJA
   ├─ Użyj istniejących komponentów (sekcja UI COMPONENTS)
   ├─ Użyj istniejących API (sekcja GŁÓWNE ENDPOINTY)
   └─ Sprawdź standardy (docs/aplikacja_funkcje/0E_INSTRUKCJE_RULEZ.md)
```

---

## 📞 KIEDY PYTAĆ USERA

1. **Brak w indeksie** - funkcja nie istnieje i nie ma w planach
2. **Niejednoznaczność** - user mówi "chatbot" ale mamy 2 (AI Chatbot vs POLACZEK)
3. **Breaking changes** - implementacja wymaga zmian w istniejącym kodzie
4. **Secrets/API keys** - potrzeba nowych kluczy API

---

## 🚀 PRZYKŁAD DOBREGO WORKFLOW

**User**: "Dodaj generator obrazów"

**Ty**:

```
1. Sprawdzam: docs/aplikacja_funkcje/00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md
2. Sekcja 01: Generator Obrazów AI
3. Status: ✅ DZIAŁA
4. Lokalizacja: src/pages/image-generator/index.astro
5. Modele: Stable Diffusion XL, Flux-1 Schnell, DreamShaper, DALL-E 3
6. Dokumentacja: 01a_GENERATOR_OBRAZOW_FUNKCJE.md

ODPOWIEDŹ: Generator obrazów jest już zainstalowany i działa!
Znajdziesz go na stronie /image-generator. Obsługuje 4 modele AI.
Dokumentacja: docs/aplikacja_funkcje/01a_GENERATOR_OBRAZOW_FUNKCJE.md
```

---

## 🎓 PODSUMOWANIE

### TL;DR dla Gemini:

1. **ZAWSZE** zaczynaj od: `docs/aplikacja_funkcje/00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md`
2. **NIE SZUKAJ** w kodzie - sprawdź indeks
3. **Używaj** istniejących komponentów i API
4. **Czytaj** dokumentację funkcji (0Xa, 0Xb, 0Xc)
5. **Sprawdzaj** status zadań: `Do_zrobienia/01_STATUS_ZADAN.md`
6. **Pytaj** gdy czegoś brakuje w dokumentacji

### Klucz do sukcesu:

```
📚 Indeks funkcji → 📋 Status zadań → 💻 Implementacja
```

---

**Powodzenia, Gemini! 🚀**

**Ostatnia aktualizacja**: 16 października 2025  
**Wersja**: 1.0
