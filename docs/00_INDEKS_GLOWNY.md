# 📚 INDEKS GŁÓWNY DOKUMENTACJI - MYBONZO PROJECT

**Ostatnia aktualizacja:** 9 lutego 2026  
**Lokalizacja:** `Q:\mybonzo\luc-de-zen-on\docs\`

---

## 📂 STRUKTURA FOLDERÓW

### 1️⃣ `/gemini/` - Dokumentacja dla Gemini AI

**Indeks:** `00_INDEKS_DOKUMENTACJI.md`  
**Zawartość:**

- Pliki 01-08: Kompletne implementacje (Floating Buttons, Agents, Image Generator, Voice System, etc.)
- Sesje rozwojowe (sesja_13-10-2025.md, sesja_14-10-2025.md)
- Pliki pomocnicze i archiwa

**Użycie:** Dokumentacja techniczna dla Gemini AI - implementacje, bugfixy, deployment

---

### 2️⃣ `/Do_zrobienia/` - Plany i Zadania

**Indeks:** `00_INDEKS_DO_ZROBIENIA.md`  
**Zawartość:**

- Voice AI Assistant (pliki 1-3)
- AI Business Box plan
- Gateway & Bielik setup
- Główny model instruktor
- **HUGGINGFACE_MINICHELPERS.md** ✨ NOWY - lekkie modele AI
- **HUGGINGFACE_REPOS_REFERENCE.md** ✨ NOWY - quick links do repozytoriów
- GEMINI_AI_ASSISTANT_POSITIONING_FIX.md (18 plików do naprawy)

**Użycie:** Zadania do zrobienia, plany wdrożeń, specyfikacje nowych funkcji

**🆕 Najnowsze dodatki (2026-02-09):**
- **HuggingFace MiniHelpers** - dokumentacja lekkich modeli AI (SmolLM, embeddings, polski NLP)
- Rekomendowane repo: all-MiniLM-L6-v2, polish-roberta-base-v2, bge-small, Xenova/gte-small
- Przypadki użycia: semantic search, sentiment analysis, text classification

---

### 3️⃣ `/aplikacja_funkcje/` - Analiza Funkcji Aplikacji

**⚠️ GŁÓWNY INDEKS:** `00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md` 🔑  
**Zawartość:**

- **9 głównych funkcji**: Generator Obrazów, Chatbot AI, Voice AI, Kaggle, BigQuery, Tavily, Business Box, POLACZEK, MCP Servers
- Dla każdej funkcji: `0Xa_FUNKCJE.md`, `0Xb_PROBLEMY.md`, `0Xc_INDEKS.md`, `0X_ANALIZA.md`
- Raporty napraw (RAPORT_GENERATOR_OBRAZOW_NAPRAWY.md, DIAGNOSTYKA_PROBLEMOW_15-10-2025.md)
- 0AA_START.md (plan działania krok po kroku)
- 0E_INSTRUKCJE_RULEZ.md (standardy implementacji)
- M1_ADMIN_DASHBOARD_SYSTEM.md

**⚠️ UWAGA DLA AI:**  
**ZAWSZE sprawdzaj `00_INDEKS_ZAINSTALOWANYCH_FUNKCJI.md` NAJPIERW!**  
Ten plik zawiera kompletną mapę wszystkich zainstalowanych funkcji, API, komponentów i konfiguracji.  
**NIE SZUKAJ** w innych miejscach - wszystko jest tam udokumentowane.

**Użycie:** Szczegółowa analiza każdej funkcji aplikacji, problemy, rozwiązania, kompletna mapa systemu

---

### 4️⃣ `/ELEVEN_LABS/` - Pliki Audio

**Zawartość:**

- Wygenerowane pliki MP3 (głosy, sound effecty)
- Subfolder: `/MOJE UTWORY/`

**Użycie:** Biblioteka audio dla Voice AI Assistant, muzyka tła, sound effects

---

### 5️⃣ `/playlista mp3/` - Playlista Muzyki

**Zawartość:** Pliki MP3 do Background Music Player

**Użycie:** Źródło muzyki dla systemu odtwarzania

---

## 📄 PLIKI GŁÓWNE (w katalogu `docs/`)

### Dokumentacja Techniczna

#### `developer-technical-documentation.md`

**Zawartość:** Kompletna dokumentacja techniczna dla developerów

#### `implementation-log.md`

**Zawartość:** Log wszystkich implementacji i zmian

#### `COMPLETE_APPLICATION_ANALYSIS.md`

**Zawartość:** Kompletna analiza całej aplikacji MyBonzo

---

### Deployment & Summary

#### `DEPLOYMENT_SUCCESS_SUMMARY.md`

**Zawartość:** Podsumowanie udanych deploymentów

#### `DEPLOYMENT_SUMMARY_OCT8.md`

**Zawartość:** Deployment z 8 października 2025

#### `MULTI_DOMAIN_DEPLOYMENT_COMPLETE.md`

**Zawartość:** Konfiguracja multi-domain deployment

#### `VOICE_AI_ASSISTANT_DEPLOYMENT.md`

**Zawartość:** Deployment Voice AI Assistant

---

### Plany i Integracje

#### `BIGQUERY_KAGGLE_ENHANCED_PLAN.md`

**Zawartość:** Plan rozbudowy BigQuery i Kaggle integration

#### `AI_BUSINESS_BOX_TYPOGRAPHY_UPDATE.md`

**Zawartość:** Update typografii dla AI Business Box

#### `IMPLEMENTACJA_OKIEN_MAPPING.md`

**Zawartość:** Mapping okien i komponentów (+ backup z 2025-10-07)

#### `MCP-Quick-Setup.md`

**Zawartość:** Szybka konfiguracja Model Context Protocol

#### `OpenAI-MCP-Integration.md`

**Zawartość:** Integracja OpenAI z MCP

---

### Pliki Konfiguracyjne

#### `kaggle.json`

**Zawartość:** Konfiguracja Kaggle API

#### `zenon-project-467918-5a0e85e4b6d1.json`

**Zawartość:** Google Cloud credentials

---

## 🎯 QUICK REFERENCE - Co gdzie szukać?

### Potrzebujesz dokumentacji implementacyjnej?

→ **`/gemini/00_INDEKS_DOKUMENTACJI.md`**

### Chcesz zobaczyć plan zadań?

→ **`/Do_zrobienia/00_INDEKS_DO_ZROBIENIA.md`**

### Szukasz analizy konkretnej funkcji?

→ **`/aplikacja_funkcje/` (np. `01_GENERATOR_OBRAZOW_ANALIZA.md`)**

### Potrzebujesz historii zmian?

→ **`/gemini/sesja_XX-XX-2025.md`** lub **`implementation-log.md`**

### Deployment info?

→ **`DEPLOYMENT_SUCCESS_SUMMARY.md`** lub **`MULTI_DOMAIN_DEPLOYMENT_COMPLETE.md`**

### Techniczne detale?

→ **`developer-technical-documentation.md`** lub **`COMPLETE_APPLICATION_ANALYSIS.md`**

---

## 🔄 WORKFLOW - Organizacja Dokumentów

### Nowy dokument implementacyjny:

1. Dodaj do `/gemini/` z numerem sekwencyjnym (09, 10, ...)
2. Zaktualizuj `/gemini/00_INDEKS_DOKUMENTACJI.md`

### Nowy plan/zadanie:

1. Dodaj do `/Do_zrobienia/`
2. Nadaj prefiks (jeśli seria: `4_FEATURE.md`)
3. Zaktualizuj `/Do_zrobienia/00_INDEKS_DO_ZROBIENIA.md`

### Analiza nowej funkcji:

1. Utwórz w `/aplikacja_funkcje/` (np. `10_NOWA_FUNKCJA_ANALIZA.md`)
2. Dodatkowe pliki: `10a_FUNKCJE.md`, `10b_PROBLEMY.md`
3. Zaktualizuj indeks (gdy zostanie utworzony)

### Po zakończeniu sesji:

1. Utwórz `sesja_DD-MM-YYYY.md` w `/gemini/`
2. Podsumuj zmiany, bugfixy, nowe funkcje
3. Zaktualizuj `implementation-log.md`

---

## ⚠️ PLIKI DO REORGANIZACJI

### `/gemini/donast/` - Sprawdzić i scalić z główną dokumentacją

### `/gemini/Nowy folder/` - Uporządkować lub usunąć

### `/gemini/wizapp/` - Zweryfikować zawartość i cel

---

## 📊 STATYSTYKI

**Łącznie folderów:** 5 głównych  
**Plików markdown:** ~50+  
**Plików audio:** ~15+ MP3  
**Plików JSON:** 2 (config)

**Indeksy utworzone:** 2/3

- ✅ `/gemini/00_INDEKS_DOKUMENTACJI.md`
- ✅ `/Do_zrobienia/00_INDEKS_DO_ZROBIENIA.md`
- ⏳ `/aplikacja_funkcje/00_INDEKS_FUNKCJI.md` (do utworzenia)

---

**Utworzono:** 16 października 2025  
**Przez:** GitHub Copilot  
**Cel:** Główny punkt wejścia do całej dokumentacji projektu
