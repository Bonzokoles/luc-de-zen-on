# 📊 CHATBOT_AI_ANALIZA_02 - SYSTEM ANALIZY

## 🎯 PRZEGLĄD SYSTEMU AI CHATBOT

### **🏗️ ARCHITEKTURA GŁÓWNA**

#### **Frontend Interface**

- **Plik główny**: `src/pages/chatbot.astro` (1241 linii)
- **Typ**: Astro component z TypeScript i JavaScript
- **Framework**: MyBonzoLayout + Tailwind CSS
- **Funkcjonalność**: Kompletny interfejs chatbota z Voice AI

#### **Backend APIs**

- **API główny**: `src/pages/api/chat.ts` (151 linii)
- **API wsparcie**: `src/pages/api/polaczek-chat.ts` (418+ linii)
- **Dodatkowe**: `generic-chat.ts`, `enhanced-chat.ts`, `bielik-chat.ts`

---

## 🤖 MODELE AI I INTEGRACJE

### **CLOUDFLARE AI MODELS**

```
@cf/google/gemma-3-12b-it          ← Default model (główny)
@cf/meta/llama-3.1-8b-instruct     ← Llama 8B
@cf/qwen/qwen2.5-7b-instruct       ← Qwen 2.5 7B (polski)
@cf/microsoft/phi-2                ← Microsoft Phi-2 (kompaktowy)
```

### **ZEWNĘTRZNE MODELE**

```
polaczek     ← Polski AI Assistant (dedykowany)
bielik       ← Sperix Bielik (zaawansowany polski)
gpt-4        ← OpenAI GPT-4 (wymaga API key)
claude       ← Anthropic Claude (wymaga API key)
```

### **PROVIDER CONFIGURATION**

- **Cloudflare Workers AI**: Główny provider dla @cf/ modeli
- **Polaczek Integration**: Dedykowany endpoint dla polskiego AI
- **External APIs**: OpenRouter, OpenAI, Anthropic (opcjonalne)

---

## 🔧 STRUKTURA TECHNICZNA

### **GŁÓWNE PLIKI SYSTEMU**

#### **1. Frontend: chatbot.astro**

```
Metadata & Props (linie 1-30)      → SEO i konfiguracja
Header & Navigation (31-85)        → UI struktura
Chat Interface (86-250)            → Główny interfejs
Quick Actions (251-350)            → Przyciski szybkich akcji
Settings Panel (351-450)           → Konfiguracja modeli
Voice AI Integration (451-550)     → Funkcje głosowe
JavaScript Functions (551-1241)    → Logika aplikacji
```

#### **2. Backend: chat.ts**

```
CORS Handlers (linie 1-15)         → GET, POST, OPTIONS
Request Processing (16-50)         → Walidacja i routing
Polaczek Integration (51-85)       → Polski AI fallback
Model Selection (86-120)           → Wybór modeli Cloudflare
Response Generation (121-151)      → Generowanie odpowiedzi
```

---

## 📋 FUNKCJE JAVASCRIPT (20+ FUNKCJI)

### **KOMUNIKACJA Z API**

- `sendMessage()` - Główna funkcja wysyłania wiadomości do AI
- `testAPI()` - Test połączenia z backend API
- `askQuestion(question)` - Szybkie pytania z przycisków

### **ZARZĄDZANIE INTERFEJSEM**

- `addMessage(content, type, isError)` - Dodawanie wiadomości do chatu
- `clearChat()` - Czyszczenie historii konwersacji
- `handleKeyPress(event)` - Obsługa skrótów klawiszowych

### **VOICE AI SYSTEM**

- `initializeVoiceAI()` - Inicjalizacja systemu głosowego
- `toggleVoiceMode()` - Przełączanie trybu głosowego
- `startVoiceRecording()` - Rozpoczęcie nagrywania
- `speakResponse(text)` - Synteza mowy dla odpowiedzi

### **KONFIGURACJA I USTAWIENIA**

- `updateModelInfo()` - Aktualizacja informacji o modelu
- `updateSystemPrompt()` - Zmiana system prompt
- `toggleSystemPrompt()` - Przełączanie widoczności system prompt

### **HISTORIA I PERSISTENCE**

- `saveChatToHistory(userMessage, aiResponse)` - Zapis do localStorage
- `loadChat(chatId)` - Wczytywanie zapisanej konwersacji
- `deleteChat(chatId)` - Usuwanie konwersacji z historii
- `exportChat()` - Eksport konwersacji do pliku
- `updateHistoryDisplay()` - Odświeżanie wyświetlania historii

### **UTILITY FUNCTIONS**

- `generateRandomPrompt()` - Losowe pytania do AI
- `copyLastResponse()` - Kopiowanie ostatniej odpowiedzi
- `regenerateLastResponse()` - Ponowne generowanie odpowiedzi

---

## 🎛️ ELEMENTY UI I KONTROLKI

### **GŁÓWNE PRZYCISKI INTERFEJSU**

- **Send Button** (`#sendButton`) - Wysyłanie wiadomości
- **Voice Toggle** - Przełączanie Voice AI
- **Clear Chat** - Czyszczenie konwersacji
- **Export Chat** - Eksport historii
- **System Prompt Toggle** - Pokaż/ukryj system prompt
- **Random Prompt** - Generuj losowe pytanie

### **QUICK ACTION BUTTONS (8 przycisków)**

- 💻 **Programowanie** - `askQuestion('Jak napisać funkcję w JavaScript?')`
- 🌐 **Tłumaczenie** - `askQuestion('Przetłumacz ten tekst na angielski')`
- ✍️ **Pisanie** - `askQuestion('Napisz kreatywną historię o kosmosie')`
- 🧠 **Nauka** - `askQuestion('Wyjaśnij mi podstawy uczenia maszynowego')`
- 🔢 **Matematyka** - `askQuestion('Pomóż mi z matematyką')`
- 🍽️ **Dieta** - `askQuestion('Stwórz plan diety')`
- 💼 **Biznes** - `askQuestion('Pomóż z planem biznesowym')`
- 🎨 **Kreatywność** - `askQuestion('Zainspiruj mnie kreatywnie')`

### **FORM CONTROLS**

- **Message Input** (`#messageInput`) - Textarea dla wiadomości
- **Model Select** (`#aiModel`) - Wybór modelu AI
- **Temperature Slider** (`#chatTemperature`) - Kontrola kreatywności
- **Language Select** (`#language`) - Wybór języka (PL/EN)
- **Role Select** - Wybór roli AI (assistant, programmer, writer, etc.)

---

## 💾 SYSTEM STORAGE I PERSISTENCE

### **LOCALSTORAGE MANAGEMENT**

```javascript
// Historia rozmów
chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]");
localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

// Szybkie prompty
quickPrompt = localStorage.getItem("quickChatPrompt");
localStorage.removeItem("quickChatPrompt");
```

### **STRUKTURA DANYCH**

```javascript
// Format historii konwersacji
{
  id: timestamp,
  title: "pierwszych 50 znaków wiadomości...",
  messages: [
    { role: 'user', content: 'pytanie użytkownika' },
    { role: 'assistant', content: 'odpowiedź AI' }
  ],
  timestamp: new Date().toLocaleString(),
  model: 'użyty model AI'
}
```

---

## 🎤 VOICE AI INTEGRATION

### **SPEECH RECOGNITION**

- **Browser API**: `window.SpeechRecognition || window.webkitSpeechRecognition`
- **Languages**: Polski (pl-PL), English (en-US)
- **Features**: Continuous recognition, interim results

### **SPEECH SYNTHESIS**

- **Browser API**: `window.speechSynthesis`
- **Voice Selection**: Automatyczny wybór głosu polskiego/angielskiego
- **Controls**: Start/stop, rate control, volume control

### **VOICE CONTROLS**

- **F2 Key**: Szybkie nagrywanie głosowe
- **Voice Button**: Toggle voice mode on/off
- **Auto-speak**: Automatyczne odczytywanie odpowiedzi AI

---

## 🔄 API ENDPOINTS I DATA FLOW

### **GŁÓWNY FLOW KOMUNIKACJI**

```
User Input → messageInput → sendMessage() → /api/chat → AI Model → Response → UI Update
```

### **API ENDPOINTS**

- **`/api/chat`** - Główny endpoint chatbota (POST/GET)
- **`/api/polaczek-chat`** - Dedykowany endpoint dla POLACZEK AI
- **`/api/generic-chat`** - Uniwersalny endpoint z customowym system prompt
- **`/api/enhanced-chat`** - Rozszerzony endpoint z dodatkowymi funkcjami

### **REQUEST FORMAT**

```javascript
{
  prompt: "wiadomość użytkownika",
  model: "@cf/google/gemma-3-12b-it",
  temperature: 0.6,
  language: "pl",
  system: "system prompt",
  usePolaczek: false
}
```

### **RESPONSE FORMAT**

```javascript
{
  answer: "odpowiedź AI",
  modelUsed: "@cf/google/gemma-3-12b-it",
  timestamp: "2025-10-09T...",
  via: "cloudflare-ai"
}
```

---

## 🎯 ROLE-BASED SYSTEM PROMPTS

### **DOSTĘPNE ROLE**

```javascript
assistant    → MyBonzo AI Assistant (ogólny)
programmer   → Ekspert programista (JS, TS, Python, Astro)
writer       → Profesjonalny pisarz i copywriter
analyst      → Analityk danych (BigQuery, SQL, Python)
teacher      → Doświadczony nauczyciel i edukator
business     → Doradca biznesowy i strateg
creative     → Kreatywny designer i artysta
```

### **SYSTEM PROMPT STRUCTURE**

- **Rola i specjalizacja**
- **Zakres odpowiedzialności**
- **Styl komunikacji**
- **Obszary ekspertyzy**
- **Ograniczenia i wytyczne**

---

## ⚙️ KONFIGURACJA I PARAMETRY

### **MODEL CONFIGURATION**

```javascript
// Model descriptions i capabilities
modelDescriptions = {
  "@cf/google/gemma-3-12b-it": "Google Gemma 3 12B - uniwersalny model...",
  "@cf/meta/llama-3.1-8b-instruct": "Meta Llama 3.1 8B - zaawansowany model...",
  "@cf/qwen/qwen2.5-7b-instruct":
    "Qwen 2.5 7B - świetna jakość w języku polskim...",
  polaczek: "POLACZEK - pierwszy polski model AI...",
  bielik: "Bielik od Sperix - zaawansowany polski model AI...",
};
```

### **TEMPERATURE CONTROL**

- **Range**: 0.0 - 1.0
- **Default**: 0.6
- **Low**: Konserwatywne, przewidywalne odpowiedzi
- **High**: Kreatywne, różnorodne odpowiedzi

### **LANGUAGE SETTINGS**

- **Polski (pl)**: Domyślny język interfejsu i odpowiedzi
- **English (en)**: Język angielski dla międzynarodowych użytkowników
- **Auto**: Automatyczne wykrywanie języka

---

## 🔍 ZAAWANSOWANE FUNKCJE

### **QUICK PROMPT SYSTEM**

- **Integration**: Ładowanie promptów z localStorage
- **Source**: Przekazywanie z innych stron (np. główna strona)
- **Auto-send**: Automatyczne załączanie i wysyłanie

### **CHAT EXPORT/IMPORT**

- **Export Format**: JSON z pełną historią konwersacji
- **Export Content**: Wiadomości, timestamps, modele, metadata
- **File Naming**: `mybonzo-chat-${timestamp}.json`

### **ERROR HANDLING**

- **API Failures**: Graceful degradation z fallback messages
- **Network Issues**: Retry logic i informacje dla użytkownika
- **Voice API**: Fallback do manual input gdy Voice API niedostępne

### **KEYBOARD SHORTCUTS**

- **Enter**: Wyślij wiadomość (domyślnie)
- **Shift+Enter**: Nowa linia w textarea
- **F2**: Szybkie nagrywanie głosowe
- **Ctrl+L**: Wyczyść chat (planowane)

---

## 🛡️ ZABEZPIECZENIA I WALIDACJA

### **INPUT VALIDATION**

- **Message Length**: Limit długości wiadomości
- **XSS Protection**: Sanityzacja input przed wyświetleniem
- **Rate Limiting**: Ograniczenia częstotliwości requestów

### **API SECURITY**

- **CORS Headers**: Właściwe nagłówki CORS dla wszystkich endpoints
- **Error Handling**: Nie eksponowanie wrażliwych informacji w błędach
- **Environment Variables**: Bezpieczne przechowywanie API keys

### **DATA PRIVACY**

- **Local Storage**: Historia przechowywana lokalnie w przeglądarce
- **No Server Logs**: Brak zapisywania konwersacji na serwerze
- **Optional Export**: Użytkownik kontroluje eksport swoich danych

---

## 📊 METRYKI I MONITORING

### **PERFORMANCE TRACKING**

- **API Response Times**: Monitoring czasów odpowiedzi
- **Model Usage**: Tracking używanych modeli AI
- **Error Rates**: Monitoring failów i błędów

### **USER ANALYTICS**

- **Feature Usage**: Które funkcje są najczęściej używane
- **Model Preferences**: Statystyki wyboru modeli
- **Voice AI Adoption**: Użycie funkcji głosowych

---

_Analiza systemu AI Chatbot - kompletna dokumentacja techniczna utworzona 09.10.2025_ 🤖
