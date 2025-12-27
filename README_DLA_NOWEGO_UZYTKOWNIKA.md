# 🚀 ZENON_Biznes_HUB - Przewodnik dla Nowego Użytkownika

> **Twoje pierwsze kroki w świecie AI dla biznesu**  
> 7 narzędzi biznesowych | 4 modele AI | 100% po polsku

---

## 📋 Spis Treści
1. [Co to jest ZENON_Biznes_HUB?](#co-to-jest)
2. [Zainstalowane Narzędzia](#narzedzia)
3. [Konfiguracja AI - Klucze API](#konfiguracja)
4. [Deployment na Cloudflare Pages](#deployment)
5. [Jak Użyć Każdego Narzędzia](#jak-uzyc)
6. [Rozwiązywanie Problemów](#problemy)

---

## <a name="co-to-jest"></a>🎯 Co to jest ZENON_Biznes_HUB?

**ZENON_Biznes_HUB** to platforma biznesowa z 7 narzędziami wspomaganymi przez AI, stworzona dla polskich przedsiębiorców. Wszystko działa w 100% po polsku, bez konieczności instalacji dodatkowego oprogramowania.

### Stack Technologiczny:
- **Framework**: Astro 5.16.6 (Server Mode)
- **Deployment**: Cloudflare Pages
- **AI Models**: Gemini 2.5 Flash, GPT-4 Turbo, Claude 3.7 Sonnet, DeepSeek
- **UI**: React + TypeScript + Tailwind CSS
- **Pakiety**: 810 dependencies

### Deployed URL:
🌐 **https://luc-de-zen-on.pages.dev**

---

## <a name="narzedzia"></a>🛠️ Zainstalowane Narzędzia

### ✨ Narzędzia z AI (wymagają API keys):

| # | Narzędzie | Model AI | Endpoint | Opis |
|---|-----------|----------|----------|------|
| 1 | **Asystent AI** | Claude 3.7 Sonnet | `/api/chat-openrouter` | Doradca biznesowy 24/7, strategia, pomoc w prowadzeniu firmy |
| 2 | **Generator Treści** | Gemini 2.5 Flash | `/api/generate-content` | Posty FB/IG/LinkedIn, opisy produktów, newslettery |
| 3 | **Asystent Email** | GPT-4 Turbo | `/api/generate-email` | Profesjonalne emaile biznesowe, oferty, pisma formalne |
| 4 | **Kreator Dokumentów** | Gemini 2.5 Flash | `/api/generate-document-gemini` | Umowy, regulaminy, polityki RODO, NDA |

### 💼 Narzędzia lokalne (działają offline, bez AI):

| # | Narzędzie | Opis |
|---|-----------|------|
| 5 | **Generator Faktur VAT** | Tworzenie faktur zgodnych z polskim prawem, export PDF |
| 6 | **Kalkulator Biznesowy** | Marże, VAT, ROI, zyski netto - wszystkie obliczenia |
| 7 | **Organizer Zadań** | Zarządzanie zadaniami, priorytety, terminy |

---

## <a name="konfiguracja"></a>🔑 Konfiguracja AI - Klucze API

### Wymagane Klucze API:

Aby wszystkie narzędzia AI działały, potrzebujesz następujących kluczy:

#### 1. **GOOGLE_API_KEY** (Gemini 2.5 Flash)
- **Gdzie**: https://aistudio.google.com/apikey
- **Model**: `gemini-2.5-flash`
- **Używane przez**: Generator Treści, Kreator Dokumentów
- **Uwaga**: Używa header `x-goog-api-key` zamiast query param

#### 2. **OPENAI_API_KEY** (GPT-4 Turbo)
- **Gdzie**: https://platform.openai.com/api-keys
- **Model**: `gpt-4-turbo-preview`
- **Używane przez**: Asystent Email
- **Cost**: Płatne API (~$0.01/1K tokens)

#### 3. **OPENROUTER_API_KEY** (Claude 3.7 Sonnet)
- **Gdzie**: https://openrouter.ai/keys
- **Model**: `anthropic/claude-3.7-sonnet`
- **Używane przez**: Asystent AI (główny chatbot)
- **Cost**: Pay-as-you-go przez OpenRouter

#### 4. **DEEPSEEK_API_KEY** (opcjonalny)
- **Gdzie**: https://platform.deepseek.com
- **Model**: `deepseek-chat`
- **Używane przez**: Dodatkowy endpoint chat
- **Uwaga**: Obecnie nieużywany w UI, ale dostępny w `/api/chat-deepseek`

---

## <a name="deployment"></a>🚀 Deployment na Cloudflare Pages

### Krok 1: Fork repozytorium na GitHub

```bash
git clone https://github.com/YOUR_USERNAME/luc-de-zen-on.git
cd luc-de-zen-on
```

### Krok 2: Zainstaluj dependencies

```bash
npm install
```

### Krok 3: Testuj lokalnie

```bash
npm run dev
```

Aplikacja będzie dostępna na `http://localhost:4321`

### Krok 4: Deploy na Cloudflare Pages

1. Wejdź na https://dash.cloudflare.com
2. **Workers & Pages** → **Create Application** → **Pages** → **Connect to Git**
3. Wybierz swoje repo GitHub
4. **Build settings**:
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
5. **Environment Variables** → **Production**:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   DEEPSEEK_API_KEY=your_deepseek_api_key_here (opcjonalny)
   ```
   
   ⚠️ **UWAGA**: Nie dodawaj spacji przed nazwami kluczy! Cloudflare czasami dodaje spacje - kod radzi sobie z tym (trim()).

6. Kliknij **Save and Deploy**

### Krok 5: Weryfikacja

Po deploymencie sprawdź:
- ✅ Strona główna ładuje się: `https://twoja-nazwa.pages.dev`
- ✅ Test endpointów:
  - `/api/debug-env` - sprawdza czy klucze są załadowane
  - Generator Treści → generuje post
  - Asystent AI → odpowiada na wiadomość
  - Asystent Email → generuje email

---

## <a name="jak-uzyc"></a>📖 Jak Użyć Każdego Narzędzia

### 1. Asystent AI (Claude 3.7 Sonnet)
**URL**: `/asystent-ai`

**Przykładowe prompty**:
- "Pomóż mi opracować strategię marketingową dla małego sklepu online"
- "Jakie dokumenty prawne powinienem mieć prowadząc jednoosobową działalność?"
- "Zaproponuj mi plan rozwoju biznesu na najbliższy kwartał"

**Funkcje**:
- Chat z pamięcią rozmowy
- Streaming odpowiedzi (real-time)
- 6 quick prompts (strategia, finanse, marketing, komunikacja, aspekty prawne, cele)
- Zapisywanie historii w localStorage

---

### 2. Generator Treści (Gemini 2.5 Flash)
**URL**: `/narzedzia/generator-tresci`

**Jak użyć**:
1. Wybierz **typ treści**: post na Facebooka, LinkedIn, Instagram, opis produktu, newsletter, etc.
2. **Opisz czego potrzebujesz**: np. "Promuj nową usługę księgowości online"
3. Wybierz **ton**: profesjonalny, przyjazny, entuzjastyczny, formalny, zabawny, motywujący
4. Wybierz **długość**: krótka (1-2 zdania), średnia (akapit), długa (kilka akapitów)
5. Kliknij **Generuj Treść**

**Output**: Gotowy tekst z formatowaniem Markdown, możliwość kopiowania jednym kliknięciem.

---

### 3. Asystent Email (GPT-4 Turbo)
**URL**: `/narzedzia/asystent-email`

**Jak użyć**:
1. Wybierz **typ emaila**: email biznesowy, oferta handlowa, odpowiedź na zapytanie, zaproszenie na spotkanie, etc.
2. **Do kogo**: np. "potencjalny klient", "dostawca usług IT"
3. **Cel emaila**: np. "zapytanie o cenę usług księgowych"
4. Wybierz **ton**: profesjonalny, formalny, uprzejmy, bezpośredni, przyjazny
5. **Dodatkowe info** (opcjonalnie): konkretne szczegóły, daty, kwoty
6. Kliknij **Generuj Email**

**Output**: Profesjonalny email z tematem, treścią i podpisem.

**Szybkie szablony**:
- Pierwsze zapytanie ofertowe
- Przypomnienie o płatności
- Zaproszenie na spotkanie

---

### 4. Kreator Dokumentów (Gemini 2.5 Flash)
**URL**: `/narzedzia/kreator-dokumentow`

**Dostępne szablony**:
- 📝 Umowa Świadczenia Usług
- 🔒 Polityka Prywatności (RODO)
- 🛒 Regulamin Sklepu Internetowego
- 🤝 Umowa Zlecenie
- 🔐 NDA (Umowa Poufności)
- 💼 Oferta Handlowa
- 🤝 Umowa Współpracy B2B
- 📋 Oświadczenie RODO

**Jak użyć**:
1. Wybierz szablon z listy
2. Wypełnij **Nazwa firmy** (opcjonalnie)
3. Dodaj **Szczegóły**: kwoty, terminy, konkretne warunki
4. Kliknij **Generuj Dokument**

**Output**: Profesjonalny dokument prawny w formacie Markdown, gotowy do skopiowania i edycji.

⚠️ **UWAGA PRAWNA**: Wygenerowane dokumenty są szablonami. Zawsze skonsultuj je z prawnikiem przed użyciem!

---

### 5. Generator Faktur VAT
**URL**: `/narzedzia/generator-faktur`

**Funkcje**:
- Dodawanie pozycji z nazwą, ilością, ceną netto
- Automatyczne obliczanie VAT (23%, 8%, 5%, 0%, zw.)
- Obliczanie sum: netto, VAT, brutto
- Dane sprzedawcy i nabywcy
- Export do PDF (w przyszłości)

**Offline**: Działa bez AI, wszystko w przeglądarce.

---

### 6. Kalkulator Biznesowy
**URL**: `/narzedzia/kalkulator-biznesowy`

**Dostępne kalkulatory**:
- 💰 **Marża**: Oblicz marżę z ceny zakupu i sprzedaży
- 📊 **VAT**: Dodaj/odejmij VAT z kwoty
- 📈 **ROI**: Return on Investment
- 💵 **Zysk netto**: Przychody - koszty
- 🔢 **Przelicznik walut** (w przyszłości)

**Offline**: Działa bez AI.

---

### 7. Organizer Zadań
**URL**: `/narzedzia/organizer-zadan`

**Funkcje**:
- Dodawanie zadań z priorytetem (wysoki/średni/niski)
- Ustawianie terminów wykonania
- Filtrowanie: wszystkie / do zrobienia / ukończone / pilne
- Przełączanie statusu (checkbox)
- Usuwanie zadań
- Zapisywanie w localStorage

**Offline**: Działa bez AI.

---

## <a name="problemy"></a>🔧 Rozwiązywanie Problemów

### Problem 1: "Błąd generowania - Missing API key"

**Przyczyna**: Klucz API nie jest załadowany w środowisku Cloudflare.

**Rozwiązanie**:
1. Wejdź na Cloudflare Dashboard → Workers & Pages → Twoja aplikacja
2. **Settings** → **Environment Variables** → **Production**
3. Sprawdź czy klucze są zapisane (bez spacji na początku!)
4. Jeśli dodałeś nowy klucz - zrób **redeploy**:
   ```bash
   git commit --allow-empty -m "Redeploy to load new env variables"
   git push
   ```

---

### Problem 2: Gemini API - "429 Resource Exhausted"

**Przyczyna**: Przekroczony limit bezpłatnego planu Gemini.

**Rozwiązanie**:
1. Użyj modelu `gemini-2.5-flash` zamiast `gemini-2.0-flash-exp`
2. Sprawdź limit na https://aistudio.google.com/apikey
3. Rozważ upgrade do płatnego planu lub użyj innego klucza

---

### Problem 3: Environment variables mają spacje

**Przyczyna**: Cloudflare czasami dodaje spacje: `" GOOGLE_API_KEY"` zamiast `"GOOGLE_API_KEY"`.

**Rozwiązanie**: Kod już to obsługuje! Każdy endpoint używa:
```typescript
const apiKey = Object.entries(env).find(([k]) => k.trim() === 'GOOGLE_API_KEY')?.[1];
```

Jeśli nadal problem - ręcznie usuń i dodaj ponownie klucz w Cloudflare Dashboard.

---

### Problem 4: Streaming nie działa w chat

**Przyczyna**: Prawdopodobnie błąd w konfiguracji ReadableStream.

**Rozwiązanie**:
1. Sprawdź logi w Cloudflare Dashboard → Workers & Pages → Twoja aplikacja → **Logs**
2. Sprawdź czy endpoint zwraca `Content-Type: text/event-stream`
3. Test lokalnie: `npm run dev` i sprawdź w DevTools → Network

---

### Problem 5: Build failuje na Cloudflare

**Możliwe przyczyny**:
- Błędy TypeScript
- Brakujące dependencies w package.json
- Nieprawidłowa konfiguracja `astro.config.mjs`

**Rozwiązanie**:
1. Test lokalnie: `npm run build`
2. Sprawdź logi build na Cloudflare: **Deployments** → **View build log**
3. Upewnij się że używasz:
   ```javascript
   // astro.config.mjs
   output: 'server',
   adapter: cloudflare({ 
     imageService: 'passthrough',
     platformProxy: { enabled: true }
   })
   ```

---

## 📊 Monitoring i Debugging

### Debug Endpoint
**URL**: `/api/debug-env`

Zwraca informacje o załadowanych kluczach API (maskowane):
```json
{
  "GOOGLE_API_KEY": "AIz***xyz (23 chars)",
  "OPENAI_API_KEY": "sk-***xyz (51 chars)",
  "OPENROUTER_API_KEY": "sk-***xyz (64 chars)"
}
```

### Logi Cloudflare
Cloudflare Dashboard → Workers & Pages → Twoja aplikacja → **Logs**

Możesz sprawdzić:
- Błędy runtime
- Statusy odpowiedzi API
- Czasy wykonania
- Rate limiting

---

## 🎓 Następne Kroki

### Rozszerz funkcjonalność:
1. **Dodaj własne narzędzie**:
   - Skopiuj `/src/pages/narzedzia/generator-tresci.astro`
   - Stwórz komponent w `/src/components/narzedzia/`
   - Dodaj endpoint API w `/src/pages/api/`
   
2. **Integruj dodatkowe modele AI**:
   - Mistral AI
   - Cohere
   - HuggingFace Inference

3. **Dodaj autentykację**:
   - Clerk
   - Auth0
   - Supabase Auth

4. **Połącz z bazą danych**:
   - Cloudflare D1 (SQLite)
   - Supabase PostgreSQL
   - MongoDB Atlas

---

## 📞 Wsparcie

**Znalazłeś bug?** Zgłoś issue na GitHub.

**Pytania?** Sprawdź dokumentację w `/docs/aplikacja_funkcje/`

**Deployment URL**: https://luc-de-zen-on.pages.dev

---

## 📄 Licencja

Projekt prywatny - MyBonzo / ZENON_Biznes_HUB

---

**Ostatnia aktualizacja**: 2025-01-28  
**Wersja**: 1.0.0  
**Status**: ✅ Wszystkie 7 narzędzi działają | 4 modele AI skonfigurowane
