# 🔧 CHATBOT_AI_FUNKCJE_02 - SZCZEGÓŁOWA ANALIZA TECHNICZNA

## 🎯 MAPA FUNKCJI JAVASCRIPT (21 FUNKCJI)

### **📡 GRUPA: KOMUNIKACJA API**

#### **`async function sendMessage()`** - Linia 854

```javascript
// GŁÓWNA FUNKCJA - Wysyłanie wiadomości do AI
- Pobiera wartości z UI (messageInput, aiModel, temperature, language)
- Waliduje input (sprawdza czy nie jest pusty)
- Dodaje wiadomość użytkownika do interfejsu
- Wysyła request do /api/chat
- Obsługuje odpowiedź i dodaje do UI
- Zapisuje do historii localStorage
- Obsługuje błędy i fallbacks
```

#### **`async function testAPI()`** - Linia 951

```javascript
// TEST POŁĄCZENIA - Weryfikacja dostępności API
- Wysyła GET request do /api/chat
- Sprawdza status odpowiedzi
- Wyświetla informacje o dostępnych modelach
- Loguje wyniki w konsoli
- Pokazuje status w UI
```

#### **`function askQuestion(question)`** - Linia 849

```javascript
// SZYBKIE PYTANIA - Quick action buttons
- Ustawia wartość w messageInput
- Automatycznie wywołuje sendMessage()
- Używane przez przyciski Quick Actions
```

---

### **💬 GRUPA: ZARZĄDZANIE WIADOMOŚCIAMI**

#### **`function addMessage(content, type, isError = false)`** - Linia 983

```javascript
// DODAWANIE WIADOMOŚCI - Renderowanie wiadomości w UI
- Tworzy HTML element dla wiadomości
- Obsługuje różne typy: user, assistant, system
- Styluje zgodnie z typem (kolory, layout)
- Dodaje timestamp i metadata
- Automatyczne przewijanie chatu
- Obsługa błędów z czerwonym kolorem
```

#### **`function clearChat()`** - Linia 1025

```javascript
// CZYSZCZENIE CHATU - Reset konwersacji
- Usuwa wszystkie wiadomości z UI
- Resetuje chatMessages innerHTML
- Dodaje powitalna wiadomość AI
- Czyści localStorage history (opcjonalnie)
- Resetuje stan Voice AI
```

---

### **🎤 GRUPA: VOICE AI SYSTEM**

#### **`function initializeVoiceAI()`** - Linia 703

```javascript
// INICJALIZACJA VOICE AI - Setup systemu głosowego
- Sprawdza dostępność SpeechRecognition API
- Konfiguruje język (pl-PL, en-US)
- Ustawia continuous: true, interimResults: true
- Binduje event handlers (onresult, onerror, onend)
- Inicjalizuje speechSynthesis
```

#### **`function toggleVoiceMode()`** - Linia 743

```javascript
// TOGGLE VOICE MODE - Przełączanie trybu głosowego
- Przełącza stan voice mode (on/off)
- Aktualizuje UI button text i style
- Włącza/wyłącza auto-speak dla odpowiedzi
- Pokazuje/ukrywa voice controls
- Zapisuje preferencje użytkownika
```

#### **`function startVoiceRecording()`** - Linia 776

```javascript
// NAGRYWANIE GŁOSOWE - Start speech recognition
- Sprawdza czy Voice AI jest dostępne
- Wywołuje recognition.start()
- Aktualizuje UI (pokazuje indicator nagrywania)
- Obsługuje błędy i fallbacks
- Integruje z F2 keyboard shortcut
```

#### **`function speakResponse(text)`** - Linia 821

```javascript
// SYNTEZA MOWY - Odczytywanie odpowiedzi AI
- Korzysta z speechSynthesis API
- Wybiera głos w odpowiednim języku
- Konfiguruje rate, pitch, volume
- Obsługuje długie teksty (chunking)
- Pokazuje progress indicator podczas mówienia
```

#### **`function updateVoiceStatus(message, type = 'info')`** - Linia 762

```javascript
// STATUS VOICE AI - Aktualizacja statusu systemu głosowego
- Wyświetla informacje o stanie Voice AI
- Obsługuje różne typy: info, error, success
- Aktualizuje voice status indicator
- Auto-hide po określonym czasie
```

---

### **⚙️ GRUPA: KONFIGURACJA I USTAWIENIA**

#### **`function updateModelInfo()`** - Linia 787

```javascript
// INFO O MODELU - Aktualizacja opisu wybranego modelu
- Pobiera wybrany model z select dropdown
- Wyszukuje opis z modelDescriptions object
- Aktualizuje UI z informacjami o modelu
- Pokazuje capabilities i limitations
- Aktualizuje temperature recommendations
```

#### **`function updateSystemPrompt()`** - Linia 802

```javascript
// SYSTEM PROMPT - Aktualizacja prompt systemowego
- Pobiera wybraną rolę (assistant, programmer, writer, etc.)
- Wyszukuje odpowiedni prompt z rolePrompts object
- Aktualizuje currentSystemPrompt variable
- Refreshuje UI textarea z nowym promptem
- Zapisuje wybór w localStorage
```

#### **`function toggleSystemPrompt()`** - Linia 812

```javascript
// TOGGLE SYSTEM PROMPT - Pokaż/ukryj system prompt panel
- Przełącza widoczność system prompt textarea
- Aktualizuje button text (Pokaż/Ukryj)
- Animuje transition (slide up/down)
- Zapisuje stan w localStorage
```

---

### **📚 GRUPA: HISTORIA I PERSISTENCE**

#### **`function saveChatToHistory(userMessage, aiResponse)`** - Linia 1069

```javascript
// ZAPIS HISTORII - Zapisywanie konwersacji do localStorage
- Tworzy obiekt chat z timestamp i messages
- Generuje title z pierwszych 50 znaków
- Dodaje metadata (model, language, role)
- Updatuje chatHistory array
- Zapisuje do localStorage
- Limituje historię do ostatnich 50 konwersacji
```

#### **`function updateHistoryDisplay()`** - Linia 1100

```javascript
// WYŚWIETLANIE HISTORII - Refresh listy zapisanych chatów
- Pobiera chatHistory z localStorage
- Sortuje po timestamp (najnowsze pierwsze)
- Renderuje HTML dla każdego chatu
- Dodaje przyciski Load i Delete
- Aktualizuje counter z liczbą zapisanych chatów
```

#### **`function loadChat(chatId)`** - Linia 1134

```javascript
// WCZYTYWANIE CHATU - Przywracanie zapisanej konwersacji
- Znajdzie chat po ID w chatHistory
- Czyści aktualny chat
- Rekonstruuje messages w UI
- Przywraca ustawienia (model, temperature)
- Scrolluje do ostatniej wiadomości
```

#### **`function deleteChat(chatId)`** - Linia 1148

```javascript
// USUWANIE CHATU - Kasowanie konwersacji z historii
- Znajduje chat po ID
- Pokazuje confirmation dialog
- Usuwa z chatHistory array
- Updatuje localStorage
- Refreshuje history display
- Pokazuje success message
```

#### **`function exportChat()`** - Linia 1046

```javascript
// EKSPORT CHATU - Pobieranie konwersacji jako JSON
- Zbiera wszystkie wiadomości z aktualnego chatu
- Tworzy JSON z metadata (timestamp, model, settings)
- Generuje nazwę pliku z datą
- Tworzy download link
- Automatycznie pobiera plik
```

---

### **🎛️ GRUPA: UI I INTERAKCJA**

#### **`function handleKeyPress(event)`** - Linia 836

```javascript
// OBSŁUGA KLAWISZY - Keyboard shortcuts w textarea
- Enter: wysyła wiadomość (domyślnie)
- Shift+Enter: nowa linia
- Ctrl+Enter: wysyła z force
- F2: rozpoczyna voice recording
- Escape: anuluje voice recording
```

#### **`function generateRandomPrompt()`** - Linia 1162

```javascript
// LOSOWE PROMPTY - Generowanie przykładowych pytań
- Zawiera array ~20 przykładowych pytań
- Wybiera losowe pytanie
- Wstawia do messageInput
- Różne kategorie: programming, creative, educational
- Opcjonalne auto-send
```

#### **`function openVoiceAssistant()`** - Linia 783

```javascript
// VOICE ASSISTANT - Otwieranie voice interface
- Sprawdza dostępność Voice AI
- Otwiera modal z voice controls
- Inicjalizuje continuous recognition
- Pokazuje waveform visualization
```

---

## 🔌 API ENDPOINTS - SZCZEGÓŁOWA ANALIZA

### **`/api/chat` - GŁÓWNY ENDPOINT**

#### **GET Request**

```typescript
// STATUS CHECK - Sprawdzanie stanu API
return createSuccessResponse({
  message: "Chat API is running",
  status: "active",
  methods: ["GET", "POST", "OPTIONS"],
  description: 'Send POST request with { prompt: "your message" }',
});
```

#### **POST Request Body**

```typescript
{
  prompt: string,              // Wiadomość użytkownika
  model?: string,              // '@cf/google/gemma-3-12b-it' | 'polaczek' | etc.
  temperature?: number,        // 0.0 - 1.0 (default: 0.6)
  system?: string,             // Custom system prompt
  language?: 'pl' | 'en' | 'auto',  // Język odpowiedzi
  usePolaczek?: boolean        // Force użycie Polaczek API
}
```

#### **Response Format**

```typescript
{
  answer: string,              // Odpowiedź AI
  modelUsed: string,           // Użyty model
  via?: string,                // 'cloudflare-ai' | 'polaczek-integration'
  timestamp?: string,          // ISO timestamp
  error?: string               // Jeśli błąd
}
```

### **`/api/polaczek-chat` - POLSKI AI ENDPOINT**

#### **Specjalizacja**

```typescript
// Dedykowany endpoint dla polskiego AI
- MyBonzo Knowledge Base integration
- Polish language optimization
- Cultural context understanding
- Fallback dla głównego API
```

#### **Features**

```typescript
- Polish AI models (Bielik, Qwen-PL)
- MyBonzo platform knowledge
- Documentation search integration
- Advanced Polish language processing
```

---

## 💾 STORAGE SYSTEM - LOCALSTORAGE STRUCTURE

### **Chat History Format**

```javascript
chatHistory = [
  {
    id: 1696789123456, // timestamp ID
    title: "Jak napisać funkcję w JavaScript...", // pierwsze 50 znaków
    messages: [
      {
        role: "user",
        content: "Jak napisać funkcję w JavaScript?",
        timestamp: "2025-10-09 14:30:15",
      },
      {
        role: "assistant",
        content: "Oto jak napisać funkcję...",
        timestamp: "2025-10-09 14:30:18",
      },
    ],
    timestamp: "2025-10-09 14:30:15", // ludzka data
    model: "@cf/google/gemma-3-12b-it", // użyty model
    language: "pl", // język
    role: "programmer", // wybrana rola
    temperature: 0.6, // parametr
  },
];
```

### **Quick Prompt System**

```javascript
// Transfer promptów między stronami
localStorage.setItem("quickChatPrompt", prompt); // Zapis z głównej strony
localStorage.getItem("quickChatPrompt"); // Odczyt w chatbot
localStorage.removeItem("quickChatPrompt"); // Czyszczenie po użyciu
```

### **User Preferences**

```javascript
// Zapisywane ustawienia użytkownika
{
  preferredModel: '@cf/google/gemma-3-12b-it',
  preferredLanguage: 'pl',
  voiceModeEnabled: true,
  autoSpeakResponses: false,
  systemPromptVisible: false,
  preferredRole: 'assistant'
}
```

---

## 🎨 CSS CLASSES I STYLING

### **Chat Interface Classes**

```css
.chat-messages          /* Kontener wiadomości */
/* Kontener wiadomości */
.message               /* Pojedyncza wiadomość */  
.user-message          /* Wiadomość użytkownika */
.assistant-message     /* Odpowiedź AI */
.message-content       /* Treść wiadomości */
.message-header        /* Header z avatar i timestamp */
.message-text          /* Tekst wiadomości */
.typing-indicator; /* Animacja "AI pisze..." */
```

### **Control Classes**

```css
.quick-action-btn      /* Przyciski szybkich akcji */
/* Przyciski szybkich akcji */
.chat-input           /* Input area styling */
.voice-controls       /* Voice AI controls */
.settings-panel       /* Panel ustawień */
.history-panel        /* Panel historii */
.model-info; /* Informacje o modelu */
```

### **Animation Classes**

```css
.animate-bounce       /* Typing indicator dots */
/* Typing indicator dots */
.slide-in            /* Message animations */
.fade-in-out         /* Status messages */
.pulse; /* Voice recording indicator */
```

---

## 🔄 EVENT HANDLING I WORKFLOWS

### **Message Send Workflow**

```
1. User types → messageInput
2. Presses Enter → handleKeyPress()
3. Triggers → sendMessage()
4. Validates input → nie pusty
5. Shows typing indicator → typingIndicator
6. Sends to API → fetch('/api/chat')
7. Receives response → JSON
8. Hides typing indicator
9. Adds message to UI → addMessage()
10. Saves to history → saveChatToHistory()
11. Auto-scroll → scrollToBottom
12. Auto-speak (if enabled) → speakResponse()
```

### **Voice Recognition Workflow**

```
1. User presses F2 → handleKeyPress()
2. Starts recording → startVoiceRecording()
3. Shows voice indicator → updateVoiceStatus()
4. Recognition API → SpeechRecognition
5. Interim results → pokazuje na bieżąco
6. Final result → wstawia do messageInput
7. Auto-send → sendMessage()
8. Hides indicator → updateVoiceStatus()
```

### **Model Change Workflow**

```
1. User selects model → aiModel select change
2. Triggers → updateModelInfo()
3. Updates description → model info panel
4. Adjusts temperature → recommendations
5. Updates system prompt → role-based
6. Saves preference → localStorage
```

---

## 🎯 QUICK ACTIONS - PRZYCISK MAPPING

### **Kategorie Quick Actions (8 przycisków)**

```javascript
// 💻 PROGRAMOWANIE
askQuestion("Jak napisać funkcję w JavaScript?");

// 🌐 TŁUMACZENIE
askQuestion("Przetłumacz ten tekst na angielski");

// ✍️ PISANIE
askQuestion("Napisz kreatywną historię o kosmosie");

// 🧠 NAUKA
askQuestion("Wyjaśnij mi podstawy uczenia maszynowego");

// 🔢 MATEMATYKA
askQuestion("Pomóż mi z matematyką");

// 🍽️ DIETA
askQuestion("Stwórz plan diety");

// 💼 BIZNES
askQuestion("Pomóż z planem biznesowym");

// 🎨 KREATYWNOŚĆ
askQuestion("Zainspiruj mnie kreatywnie");
```

---

## 🏗️ SYSTEM INITIALIZATION

### **DOMContentLoaded Event**

```javascript
document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicjalizacja systemów
  updateHistoryDisplay()     // Wczytaj historię
  updateModelInfo()          // Info o modelu
  updateSystemPrompt()       // System prompt

  // 2. Voice AI setup
  if (SpeechRecognition support) {
    console.log("🎤 Voice AI dostępny")
  }

  // 3. Test API
  testAPI()                  // Sprawdź połączenie

  // 4. Quick prompt loading
  const quickPrompt = localStorage.getItem("quickChatPrompt")
  if (quickPrompt) {
    messageInput.value = quickPrompt
    localStorage.removeItem("quickChatPrompt")
  }

  // 5. Global functions (debugging)
  window.testAPI = testAPI
  window.sendMessage = sendMessage
  // ... inne funkcje

  console.log("✅ Chatbot w pełni zainicjalizowany")
})
```

---

## ⚠️ ERROR HANDLING I FALLBACKS

### **API Error Handling**

```javascript
// Network errors
catch (error) {
  console.error('Network error:', error)
  addMessage('Błąd połączenia. Sprawdź internet.', 'error', true)
}

// HTTP errors
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`)
}

// AI response errors
if (!data.answer && !data.response) {
  addMessage('AI nie wygenerował odpowiedzi.', 'error', true)
}
```

### **Voice AI Fallbacks**

```javascript
// Browser support check
if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
  updateVoiceStatus("Voice AI nie jest dostępny w tej przeglądarce", "error");
  return;
}

// Recognition errors
recognition.onerror = (event) => {
  updateVoiceStatus(`Błąd rozpoznawania: ${event.error}`, "error");
  // Fallback to manual input
};
```

### **Storage Fallbacks**

```javascript
// localStorage errors
try {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
} catch (error) {
  console.warn("Nie można zapisać historii:", error);
  // Continue without saving
}
```

---

_Szczegółowa analiza funkcji AI Chatbot - kompletna mapa techniczna utworzona 09.10.2025_ 🔧
