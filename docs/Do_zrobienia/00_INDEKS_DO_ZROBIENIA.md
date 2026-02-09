# 📋 INDEKS PLIKÓW DO ZROBIENIA - MYBONZO PROJECT

**Ostatnia aktualizacja:** 9 lutego 2026  
**Lokalizacja:** `Q:\mybonzo\luc-de-zen-on\docs\Do_zrobienia\`

---

## ✅ STATUS PLIKÓW

### 🎤 VOICE AI ASSISTANT (Priorytet: WYSOKI)

#### 1_VOICE_AI_ASISTANT.md

**Status:** 📝 PLAN DO IMPLEMENTACJI  
**Zawartość:**

- Struktura decyzyjna włączania Voice AI
- Warstwa zarządzania (konfiguracja DB/.env)
- Logika ładowania Voice AI w React/Astro
- Tryb globalny/per podstrona/per agent

**Zależności:**

- `src/components/VoiceControl.svelte`
- `src/components/GoogleVoiceAgent.svelte`
- Config system

**Następne kroki:**

1. Implementacja centralnej konfiguracji
2. Panel administracyjny do zarządzania
3. Hook `useVoiceAssistant()`

---

#### 2_ROZBUDOWA_VOICE_AI_ASSISTANT.md

**Status:** 📝 ROZSZERZONY PLAN  
**Zawartość:**

- Rozbudowa istniejącego Voice AI
- Dodatkowe funkcje i integracje
- Advanced voice commands

**Zależności:** `1_VOICE_AI_ASISTANT.md` (do zaimplementowania najpierw)

---

#### 3_VOICE_AI_MEGA_AGENT.md

**Status:** 🚀 WIZJA PRZYSZŁOŚCI  
**Zawartość:**

- Mega Agent orchestrator
- Multi-agent voice system
- Advanced AI capabilities

**Zależności:** Pliki 1 i 2

---

### 💼 AI BUSINESS BOX (Priorytet: ŚREDNI)

#### AI_BUISSNES_BOX.md

**Status:** ✅ CZĘŚCIOWO ZAIMPLEMENTOWANY  
**Zawartość:**

- DuckDB integration plan
- Analiza biznesowa dla MŚP
- Integracja BigQuery + DuckDB
- CSV Explorer, Google Sheets API

**Obecny stan:**

- ✅ Strona: `src/pages/ai-business-box/index.astro`
- ✅ BigQuery integration: `src/pages/bigquery-analytics.astro`
- ⏳ DuckDB: DO IMPLEMENTACJI
- ⏳ CSV Explorer: DO IMPLEMENTACJI

**Następne kroki:**

1. Dodać DuckDB-wasm do projektu
2. Zaimplementować CSV upload + query builder
3. Wizard zapytań po polsku
4. Panel "Smart Lokalny" vs "Pro Cloud"

---

### 🌐 GATEWAY & BIELIK (Priorytet: ŚREDNI-WYSOKI)

#### GATEWAY_BIELIK_SETUP.md

**Status:** 📋 KOMPLETNY PLAN KONFIGURACJI  
**Zawartość:**

- Cloudflare AI Gateway setup
- Bielik-11B-v2.2-Instruct integration
- HuggingFace API configuration
- ZeroGPU quota management

---

### 🤖 HUGGINGFACE MINICHELPERS (Priorytet: ŚREDNI) ✨ NOWY

#### HUGGINGFACE_MINICHELPERS.md

**Status:** 📋 KOMPLETNA DOKUMENTACJA  
**Zawartość:**

- Lekkie modele AI z HuggingFace (SmolLM, embeddings)
- Przypadki użycia: semantic search, sentiment analysis, klasyfikacja
- Polskie modele: `sdadas/polish-roberta-base-v2`
- Integracja z HuggingFace Inference API
- Przykłady implementacji endpoints

**Rekomendowane Modele:**

- ✅ **SmolLM2-1.7B-Instruct** - lekki LLM (4GB RAM)
- ✅ **all-MiniLM-L6-v2** - embeddings (80MB, bardzo szybki)
- ✅ **bge-small-en-v1.5** - retrieval (133MB)
- ✅ **polish-roberta-base-v2** - polski NLP (500MB)
- ✅ **Xenova/gte-small** - client-side embeddings (120MB)

**Przypadki użycia w projekcie:**

1. Wyszukiwanie semantyczne w dokumentacji
2. Auto-kategoryzacja treści marketingowych
3. Analiza sentymentu opinii klientów
4. Smart FAQ matching (bez LLM)
5. Ekstrakcja danych z faktur/umów

**Następne kroki:**

1. Dodaj HF_TOKEN do Cloudflare (✅ już istnieje w checklist)
2. Stwórz endpoint `/api/semantic-search.ts`
3. Stwórz endpoint `/api/sentiment-analysis.ts`
4. UI komponenty dla text classification
5. Pre-compute embeddings dla docs

**Konfiguracja:**

- ✅ Account ID: `7f490d58a478c6baccb0ae01ea1d87c3`
- ✅ Gateway: `bielik_gateway`
- ✅ HF Token: skonfigurowany
- ⏳ Full integration: DO WDROŻENIA

**Następne kroki:**

1. Wdrożyć API endpoint dla Bielik
2. Testować voice assistant z Bielik
3. Zoptymalizować ZeroGPU quota (25 min/dzień)

---

#### GATEWAY/ (folder)

**Zawartość:** Dodatkowe dokumenty Gateway (do sprawdzenia)

---

### 🤖 GŁÓWNY MODEL INSTRUKTOR (Priorytet: WYSOKI)

#### Główny model_instruktor.md

**Status:** 📋 SPECYFIKACJA MODELI  
**Zawartość:**

- Lista najnowszych modeli AI (Cloudflare Workers, OpenRouter)
- Llama 3/4, GPT-OSS, Gemma 3, Qwen, DeepSeek, Mistral
- Instrukcje wdrożenia modelu jako instruktora
- Prompt systemowy dla przewodnika

**Polecane modele:**

- Llama 3, Llama 4 Scout (Cloudflare)
- Claude Sonnet 4.5, Gemini 2.5 (OpenRouter)
- MistralAI, Hermes-2-Pro, DeepSeek, Qwen3 VL

**Następne kroki:**

1. Wybrać model dla głównego instruktora
2. Skonfigurować Worker/API endpoint
3. Zaimplementować chatbox z "role: instructor"
4. Dodać integrację z bazą wiedzy

---

### 📱 AI_FUN_dobloga.md

**Status:** ❓ DO SPRAWDZENIA  
**Zawartość:** (Wymagana weryfikacja zawartości)

---

### 📄 Wstępny_plan_dla_instruktora.md

**Status:** 📝 WSTĘPNA SPECYFIKACJA  
**Zawartość:** Plan wstępny dla systemu instruktora

---

### 🔧 PLIKI POMOCNICZE

#### voice ai assistant.txt

**Status:** 📝 NOTATKI  
**Zawartość:** Notatki dotyczące Voice AI Assistant

#### Nowy Text Document.txt

**Status:** ❓ DO USUNIĘCIA/SPRAWDZENIA

---

## 🎯 PRIORYTETYZACJA ZADAŃ

### 🔥 PILNE (Priorytet 1)

1. **GEMINI_AI_ASSISTANT_POSITIONING_FIX.md** ← PRZENIESIONY (już w tym folderze)

   - 18 plików do naprawy
   - Ograniczenie AI Assistant do 1/6 ekranu
   - Status: ✅ INSTRUKCJE GOTOWE

2. **Główny model_instruktor.md**
   - Wdrożenie modelu instruktora
   - Wybór: Llama 4 Scout lub Claude Sonnet 4.5
   - Konfiguracja chatbox

### ⚡ WYSOKIE (Priorytet 2)

3. **1_VOICE_AI_ASISTANT.md**

   - Implementacja systemu Voice AI
   - Konfiguracja per strona/per agent

4. **GATEWAY_BIELIK_SETUP.md**
   - Integracja Bielik-11B przez Gateway
   - Voice Assistant enhancement

### 📊 ŚREDNIE (Priorytet 3)

5. **AI_BUISSNES_BOX.md**

   - DuckDB integration
   - CSV Explorer
   - Wizard analiz

6. **2_ROZBUDOWA_VOICE_AI_ASSISTANT.md**
   - Rozbudowa po wdrożeniu podstawy

### 🔮 PRZYSZŁOŚĆ (Priorytet 4)

7. **3_VOICE_AI_MEGA_AGENT.md**
   - Mega Agent orchestrator
   - Multi-agent system

---

## 📂 STRUKTURA FOLDERÓW

```
docs/
├── Do_zrobienia/           ← TEN FOLDER (plany, zadania)
│   ├── 00_INDEKS_DO_ZROBIENIA.md (TEN PLIK)
│   ├── 1_VOICE_AI_ASISTANT.md
│   ├── 2_ROZBUDOWA_VOICE_AI_ASSISTANT.md
│   ├── 3_VOICE_AI_MEGA_AGENT.md
│   ├── AI_BUISSNES_BOX.md
│   ├── GATEWAY_BIELIK_SETUP.md
│   ├── Główny model_instruktor.md
│   ├── GEMINI_AI_ASSISTANT_POSITIONING_FIX.md
│   └── GATEWAY/ (subfolder)
│
├── gemini/                 ← DOKUMENTACJA DLA GEMINI
│   ├── 00_INDEKS_DOKUMENTACJI.md
│   ├── 01-08_*.md (implementacje)
│   └── sesje_*.md
│
├── aplikacja_funkcje/      ← ANALIZA FUNKCJI APLIKACJI
│   └── 01-09_*.md
│
└── ELEVEN_LABS/           ← PLIKI AUDIO
    └── *.mp3
```

---

## 🔄 WORKFLOW

### Dla nowych zadań:

1. Dodaj plik do `Do_zrobienia/`
2. Nadaj prefiks numeryczny jeśli część serii (np. `4_NEXT_FEATURE.md`)
3. Zaktualizuj ten indeks

### Po zakończeniu zadania:

1. Przenieś dokumentację implementacyjną do `gemini/`
2. Nadaj numer sekwencyjny (09, 10, ...)
3. Zaktualizuj `gemini/00_INDEKS_DOKUMENTACJI.md`
4. Archiwizuj plan z `Do_zrobienia/` (opcjonalnie)

---

## ⚠️ UWAGI

1. **GEMINI_AI_ASSISTANT_POSITIONING_FIX.md** = gotowy do implementacji (18 plików)
2. **Główny model_instruktor.md** = wybór modelu ASAP
3. **GATEWAY_BIELIK_SETUP.md** = kompletna konfiguracja, gotowe do wdrożenia
4. Pliki `*.txt` do weryfikacji/usunięcia

---

**Utworzono:** 16 października 2025  
**Przez:** GitHub Copilot  
**Cel:** Organizacja zadań "do zrobienia"
