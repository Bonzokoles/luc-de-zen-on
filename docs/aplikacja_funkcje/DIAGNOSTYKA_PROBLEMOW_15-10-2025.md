# 🛠️ DIAGNOSTYKA PROBLEMÓW APLIKACJI - 15.10.2025

## 📋 WYKRYTE PROBLEMY

### 🔐 Problem 1: Middleware autoryzacja blokuje API endpoints

**Lokalizacja:** `src/middleware.ts` linia 50-65
**Problem:**

- `/api/debug-env` nie jest w PUBLIC_PATHS
- Wiele API endpoints może być zablokowanych przez middleware
- Brak autoryzacji powoduje `401 Unauthorized`

**Objawy:**

```
{"error":"Brak autoryzacji: Nieprawidłowy nagłówek."}
```

**Wymagana naprawa:**

- Dodaj brakujące endpoints do PUBLIC_PATHS
- Sprawdź które API są publicznie dostępne

---

### 🎨 Problem 2: Generator obrazów - klucze API

**Lokalizacja:** `/image-generator` strona
**Problem:** Potencjalnie brak lub nieprawidłowe klucze API dla:

- Together AI (TOGETHER_API_KEY)
- HuggingFace (HF_API_TOKEN)
- OpenAI (OPENAI_API_KEY)

**Wymagana weryfikacja:**

- Sprawdź czy sekrety są ustawione w Cloudflare
- Test każdego modelu osobno

---

### 🔧 Problem 3: Karty "ZAAWANSOWANE FUNKCJE AI" przysłonięte

**Lokalizacja:** `/zaawansowane-funkcje-ai` strona
**Problem:**

- Voice Assistant może przysłaniać inne elementy
- Z-index lub position problemy
- Layout conflicts

**Lokalizacja pliku:** `src/pages/zaawansowane-funkcje-ai.astro`

---

### 🎤 Problem 4: Voice Assistant layout issues

**Lokalizacja:** `/voice-ai-assistant` strona
**Problem:**

- Możliwe konflikty z innymi elementami strony
- Floating elements bez proper positioning
- Overlay problems

---

### 🔑 Problem 5: Sekrety w environment variables

**Problem:**

- `bielik-polish-clean.ts` i `bielik-polish-new.ts` używają hardcoded tokenów
- Powinny używać `process.env.HF_API_TOKEN`

**Status:** ✅ Już naprawione w kodzie, ale może wymagać redeploy

---

## 🎯 ZADANIA DLA GEMINI

### ⚠️ WAŻNE INSTRUKCJE:

1. **NIE ZMIENIAJ** głównego wyglądu ani layoutu stron
2. **NIE PSÓ** istniejącej funkcjonalności
3. **TYLKO NAPRAWY** - nie dodawaj nowych funkcji
4. **TESTUJ** każdą zmianę przed commitem
5. **KOMENTUJ** co robisz w commitach

---

### 📋 ZADANIE 1: Naprawa middleware autoryzacji

**Priorytet:** 🔴 WYSOKI

**Plik:** `src/middleware.ts`
**Akcja:** Dodaj do PUBLIC_PATHS:

```typescript
"/api/debug-env",
"/api/image-generator/generate",
"/api/image-generator/history",
"/api/image-generator/styles",
"/api/generate-image",
"/api/enhanced-generator",
"/api/voice/synthesis",
"/api/voice/recognition",
```

**Test:** `curl https://e64cb986.luc-de-zen-on.pages.dev/api/debug-env`

---

### 📋 ZADANIE 2: Weryfikacja kluczy API

**Priorytet:** 🔴 WYSOKI

**Akcja:**

1. Sprawdź `wrangler secret list`
2. Dodaj brakujące sekrety:
   ```bash
   wrangler secret put HF_API_TOKEN
   wrangler secret put TOGETHER_API_KEY
   wrangler secret put OPENAI_API_KEY
   ```

**Test:** Generator obrazów na każdym modelu

---

### 📋 ZADANIE 3: CSS Z-index fixes

**Priorytet:** 🟡 ŚREDNI

**Pliki do sprawdzenia:**

- `src/pages/zaawansowane-funkcje-ai.astro`
- `src/pages/voice-ai-assistant.astro`

**Akcja:**

1. Znajdź konflikty z position: fixed/absolute
2. Ustaw proper z-index hierarchy
3. Sprawdź czy elementy nie overlappują

**Test:** Wszystkie karty widoczne i klikalne

---

### 📋 ZADANIE 4: Environment variables audit

**Priorytet:** 🟡 ŚREDNI

**Pliki do sprawdzenia:**

```
src/pages/api/bielik-*.ts
src/pages/api/image-generator/*.ts
src/pages/api/generate-*.ts
```

**Akcja:**

1. Znajdź hardcoded API keys
2. Zamień na process.env.{KEY_NAME}
3. Sprawdź czy używają locals?.runtime?.env

---

### 📋 ZADANIE 5: API endpoints functionality test

**Priorytet:** 🟢 NISKI

**Akcja:**

1. Stwórz test script dla kluczowych API:
   ```javascript
   // Test wszystkich endpoints z /api/
   // Sprawdź response codes
   // Zweryfikuj czy działają
   ```

---

## 🔍 PLIKI DO ANALIZY

### Istniejące dokumenty w /docs/gemini/:

- `01_FLOATING_BUTTONS_REAL_IMPLEMENTATION.md` - MCP buttons
- `04_IMAGE_GENERATOR_ALL_MODELS_FIXED.md` - Generator problemów
- `05_VOICE_SYSTEM_COMPLETE.md` - Voice system
- `COMPLETE_FUNCTIONS_INVENTORY.md` - Kompletna inwentaryzacja
- `donast/sesja_14-10-2025_cloudflare_models_complete.md` - Cloudflare models

### Nowe obszary wymagające uwagi:

- Middleware autoryzacja
- CSS overlays i z-index
- API keys management
- Error handling

---

## 🚀 DEPLOYMENT INFO

**Aktualny deployment:** `e64cb986.luc-de-zen-on.pages.dev`
**Status:** Częściowo działający

- ✅ MCP buttons: OK
- ✅ Generator obrazów: Podstawowo działa
- ❌ API authorization: Problemy
- ❌ Advanced functions: Layout issues
- ❌ Voice assistant: Overlay problems

---

## 🎯 EXPECTED OUTCOMES

Po naprawach:

1. Wszystkie API endpoints dostępne
2. Generator obrazów ze wszystkimi modelami
3. Karty AI funkcji properly visible
4. Voice assistant bez layout conflicts
5. Proper error handling wszędzie

**Deadline:** Następna sesja z Gemini
**Priority:** Bug fixes > New features
