<script>
  import { onMount, onDestroy } from "svelte";
  import VoiceControl from "./VoiceControl.svelte";

  export let pageTitle = "";

  let isConnected = false;
  let messages = [];
  let inputValue = "";
  let isTyping = false;
  let agentStatus = "connecting"; // Start with connecting status
  let capabilities = [];

  let messagesContainer;
  let sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // HTTP API Configuration - POLACZEK with Gemma from Cloudflare
  const API_BASE_URL =
    import.meta.env.PUBLIC_POLACZEK_API_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const CHAT_ENDPOINT = `${API_BASE_URL}/api/chat`;
  const STATUS_ENDPOINT = `${API_BASE_URL}/api/health`;
  const HEALTH_ENDPOINT = `${API_BASE_URL}/api/health`;

  function getContextualHelp(title) {
    switch (title) {
      case "Strona Główna":
        return "Jesteś na stronie głównej. Możesz poprosić o status systemu, listę agentów lub pomoc w nawigacji.";
      case "AI Browser - POLACZEK Agents System":
        return "Jesteś w przeglądarce AI. Możesz wydawać polecenia agentom, np. 'znajdź informacje o Astro'.";
      case "AI Business Box - Analiza biznesowa dla MŚP":
        return "Jesteś w AI Business Box. Możesz poprosić o analizę danych, np. 'pokaż mi sprzedaż w ostatnim kwartale'.";
      case "BigQuery Analytics | AI Workers":
        return "Jesteś w panelu BigQuery. Możesz podyktować zapytanie SQL, a ja je wykonam.";
      case "AI Chatbot | AI Workers":
        return "Jesteś w głównym oknie czatu. Możesz prowadzić rozmowę z wybranym modelem AI.";
      case "Generator Obrazów | AI Workers":
        return "Jesteś w generatorze obrazów. Możesz podyktować, co chcesz zobaczyć, np. 'wygeneruj obraz kota w kosmosie'.";
      case "Kaggle Datasets | AI Workers":
        return "Jesteś w przeglądarce zbiorów danych Kaggle. Możesz wyszukać datasety, np. 'znajdź zbiory danych o cenach domów'.";
      case "Tavily Search | AI Workers":
        return "Jesteś w wyszukiwarce Tavily. Możesz wyszukać informacje w internecie, np. 'jakie są najnowsze wiadomości o AI'.";
      case "Voice AI Assistant | MyBonzo Platform":
        return "Jesteś w panelu konfiguracji asystenta głosowego. Możesz zarządzać ustawieniami głosu.";
      case "Generator Treści Marketingowych":
        return "Jesteś w generatorze treści. Podaj temat i rodzaj tekstu (np. post na social media), a AI stworzy dla Ciebie profesjonalny materiał marketingowy.";
      case "Spersonalizowane Rekomendacje AI":
        return "Jesteś w silniku rekomendacji. Wybierz profil użytkownika z listy, a AI dynamicznie zaproponuje najlepiej dopasowane produkty lub usługi.";
      case "Automatyzacja Obsługi Klienta":
        return "Jesteś w module automatyzacji obsługi klienta. Możesz tu kwalifikować leady, generować automatyczne odpowiedzi lub zarządzać integracją z CRM.";
      case "Monitorowanie Aktywności AI":
        return "To jest dynamiczny dashboard monitorujący aktywność systemu w czasie rzeczywistym. Nowe zdarzenia pojawiają się automatycznie co kilka sekund.";
      case "Inteligentny Kalendarz AI":
        return "Jesteś w inteligentnym kalendarzu. System automatycznie analizuje Twój harmonogram i generuje kontekstowe przypomnienia, aby zoptymalizować Twój dzień.";
      case "Dynamiczny Generator FAQ":
        return "To jest generator FAQ. Wklej dowolny tekst źródłowy (np. dokumentację), a AI wygeneruje na jego podstawie listę pytań i odpowiedzi.";
      case "Rekomendacje Edukacyjne AI":
        return "Wybierz swój poziom zaawansowania i zainteresowania, a AI zarekomenduje Ci spersonalizowaną ścieżkę rozwoju i listę dopasowanych kursów.";
      case "System Ticketów AI":
        return "To jest strona główna systemu ticketów. Przejdź do modułu \'Klasyfikator\', aby przetestować automatyczną kategoryzację i priorytetyzację zgłoszeń.";
      case "Interaktywne Quizy AI":
        return "Wpisz dowolny temat, a AI wygeneruje dla Ciebie interaktywny quiz składający się z 5 pytań, abyś mógł sprawdzić swoją wiedzę.";
      default:
        return "Witaj w asystencie MyBonzo! Jak mogę Ci pomóc?";
    }
  }

  onMount(() => {
    const helpMessage = getContextualHelp(pageTitle);
    addMessage("system", helpMessage);

    // Clear any previous instances to prevent conflicts
    if (typeof window !== "undefined") {
      // Force clean state
      delete window.POLACZEK;

      // Re-create fresh API
      window.POLACZEK = {
        openAssistant: () => {
          setTimeout(() => scrollToBottom(), 30);
        },
        getStatus: () => agentStatus,
        forceReconnect: () => {
          console.log("🤖 Force reconnecting POLACZEK...");
          checkConnection();
        },
      };

      // Listen to quick actions from RightDock
      try {
        window.addEventListener("polaczek-clear-chat", clearChat);
        window.addEventListener("polaczek-reconnect", checkConnection);
      } catch (e) {}

      console.log("🤖 POLACZEK API registered and ready");
    }

    // Auto-connect after small delay for better UX
    setTimeout(() => checkConnection(), 100);

    return () => {
      // No WebSocket to clean up
    };
  });

  // Replace WebSocket connection with HTTP health check
  async function checkConnection() {
    try {
      agentStatus = "connecting";

      const response = await fetch(HEALTH_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        isConnected = true;
        agentStatus = "ready";
        capabilities = ["Chat AI", "Knowledge Base", "Help System"];
        addMessage(
          "system",
          "🤖 POLACZEK_T Assistant połączony i gotowy do pracy!"
        );
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Connection check failed:", error);
      isConnected = false;
      agentStatus = "disconnected";
      addMessage("error", `Błąd połączenia: ${error.message}`);
    }
  }

  onDestroy(() => {
    // No WebSocket to clean up in HTTP API mode
    if (typeof window !== "undefined") {
      try {
        window.removeEventListener("polaczek-clear-chat", clearChat);
        window.removeEventListener("polaczek-reconnect", checkConnection);
      } catch (e) {}
    }
  });

  $: if (messages.length > 0) {
    setTimeout(() => scrollToBottom(), 50);
  }

  // Broadcast status changes to external UI (RightDock)
  $: if (typeof window !== "undefined") {
    window.POLACZEK = window.POLACZEK || {};
    window.POLACZEK.status = agentStatus;
    try {
      window.dispatchEvent(
        new CustomEvent("polaczek-status", { detail: { status: agentStatus } })
      );
    } catch (e) {}
  }

  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // Fix missing functions that are called but not defined
  function setInputValue(value) {
    inputValue = value;
  }

  function setIsTyping(typing) {
    isTyping = typing;
  }

  function addMessage(type, content) {
    messages = [
      ...messages,
      {
        id: Date.now() + Math.random(),
        type,
        content,
        timestamp: new Date().toLocaleTimeString(),
      },
    ];
  }

  function sendMessage() {
    if (!inputValue.trim() || !isConnected) return;

    const message = inputValue.trim();
    addMessage("user", message);
    inputValue = ""; // Clear input
    isTyping = true; // Show typing indicator

    // Send HTTP request to chat API
    sendChatRequest(message);
  }

  async function sendChatRequest(prompt) {
    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionId,
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      isTyping = false; // Hide typing indicator

      if (response.ok) {
        const data = await response.json();
        addMessage("agent", data.answer || data.message || "Brak odpowiedzi");

        // Show source if available
        if (data.source) {
          console.log(`💾 Odpowiedź z: ${data.source}`);
        }
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        addMessage(
          "error",
          `Błąd API (${response.status}): ${errorData.error || "Nieznany błąd"}`
        );
        console.error("API Error:", response.status, errorData);
      }
    } catch (error) {
      isTyping = false;
      console.error("Request failed:", error);
      addMessage("error", `Błąd sieci: ${error.message}`);
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function handleVoiceCommand(event) {
    console.log(`Voice command received in context: ${pageTitle}`);
    inputValue = event.detail;
    sendMessage();
  }

  function getStatusColor(status) {
    switch (status) {
      case "connected":
      case "ready":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "disconnected":
        return "text-gray-500";
      default:
        return "text-yellow-500";
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case "connected":
      case "ready":
        return "🟢";
      case "error":
        return "🔴";
      case "disconnected":
        return "⚪";
      default:
        return "🟡";
    }
  }

  function clearChat() {
    messages = [];
  }

  function reconnect() {
    // For HTTP API, just check connection again
    checkConnection();
  }
</script>

<div class="assistant-container">
  <!-- Expanded View -->
  <div class="assistant-panel">
    <!-- Header -->
    <div class="assistant-header">
      <div class="flex items-center gap-2">
        <span class="text-lg">🤖</span>
        <span class="font-medium">POLACZEK_T Asystent</span>
      </div>
      <div class="flex items-center gap-2">
        <span class={`text-xs ${getStatusColor(agentStatus)}`}>
          {getStatusIcon(agentStatus)}
          {agentStatus}
        </span>
      </div>
    </div>

    <!-- Messages -->
    <div bind:this={messagesContainer} class="messages">
      {#each messages as message (message.id)}
        <div
          class={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            class={`bubble ${
              message.type === "user"
                ? "bubble-user"
                : message.type === "agent"
                  ? "bubble-agent"
                  : message.type === "system"
                    ? "bubble-system"
                    : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            <div>{message.content}</div>
            <div
              class={`text-xs mt-1 ${
                message.type === "user" ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {message.timestamp}
            </div>
          </div>
        </div>
      {/each}

      {#if isTyping}
        <div class="flex justify-start">
          <div
            class="bg-white text-gray-800 border px-3 py-2 rounded-lg text-sm"
          >
            <div class="flex items-center gap-1">
              <span>Agent pisze</span>
              <div class="flex gap-1">
                <div
                  class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                ></div>
                <div
                  class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                  style="animation-delay: 0.1s;"
                ></div>
                <div
                  class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                  style="animation-delay: 0.2s;"
                ></div>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Input -->
    <div class="input-bar">
      <div class="flex gap-2 mb-2">
        <button
          on:click={clearChat}
          class="text-xs text-gray-400 hover:text-gray-200 px-2 py-1"
          disabled={messages.length === 0}
        >
          Wyczyść
        </button>
        <button
          on:click={reconnect}
          class="text-xs text-gray-400 hover:text-gray-200 px-2 py-1"
          disabled={isConnected}
        >
          Połącz ponownie
        </button>
      </div>

      <div class="flex gap-2">
        <input
          bind:value={inputValue}
          on:keypress={handleKeyPress}
          placeholder="Zadaj pytanie agentowi..."
          disabled={!isConnected}
          class="assistant-input"
        />
        <button
          on:click={sendMessage}
          disabled={!isConnected || !inputValue.trim()}
          class="assistant-send"
        >
          Wyślij
        </button>
        <VoiceControl on:voicecommand={handleVoiceCommand} />
      </div>

      {#if capabilities.length > 0}
        <div class="mt-2 text-xs text-gray-400">
          Funkcje: {capabilities.join(", ")}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .assistant-container {
    width: 100%;
  }
  .assistant-panel {
    background: linear-gradient(
      135deg,
      rgba(15, 56, 70, 0.98),
      rgba(0, 0, 0, 0.95)
    );
    border: 2px solid #1be1ff;
    border-radius: 0;
    backdrop-filter: blur(15px);
    min-width: 480px;
    max-width: 520px;
    height: 26rem;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    box-shadow:
      0 0 12px rgba(27, 225, 255, 0.2),
      0 0 25px rgba(27, 225, 255, 0.08),
      inset 0 1px 0 rgba(27, 225, 255, 0.1);
    transition: all 0.3s ease;
    position: relative;
    z-index: 1000;
  }
  .assistant-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: linear-gradient(90deg, #0f3846, #1be1ff);
    border-bottom: 2px solid #1be1ff;
    border-radius: 0;
    color: #000;
    font-size: 12px;
    font-weight: 700;
    text-shadow: 0 0 2px rgba(27, 225, 255, 0.4);
    user-select: none;
  }
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    background: rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }
  .bubble {
    max-width: 70%;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    border: 1px solid #1be1ff;
    border-radius: 0;
    background: rgba(15, 56, 70, 0.6);
    backdrop-filter: blur(5px);
  }
  .bubble-user {
    background: rgba(27, 225, 255, 0.2);
    color: #fff;
    border-color: #1be1ff;
    margin-left: auto;
  }
  .bubble-agent {
    background: rgba(15, 56, 70, 0.8);
    color: #fff;
    border-color: #1be1ff;
  }
  .bubble-system {
    background: rgba(27, 225, 255, 0.15);
    color: #1be1ff;
    border-color: #1be1ff;
  }
  .input-bar {
    padding: 12px;
    background: rgba(15, 56, 70, 0.8);
    border-top: 2px solid #1be1ff;
  }
  .assistant-input {
    flex: 1;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    border: 1px solid #1be1ff;
    border-radius: 0;
    outline: none;
    font-size: 12px;
    backdrop-filter: blur(5px);
  }
  .assistant-input:focus {
    border-color: #1be1ff;
    box-shadow: 0 0 6px rgba(27, 225, 255, 0.3);
    background: rgba(0, 0, 0, 0.5);
  }
  .assistant-send {
    background: rgba(27, 225, 255, 0.1);
    color: #1be1ff;
    border: 1px solid #1be1ff;
    padding: 8px 16px;
    border-radius: 0;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    transition: all 0.2s ease;
    backdrop-filter: blur(5px);
  }
  .assistant-send:hover {
    background: rgba(27, 225, 255, 0.2);
    box-shadow: 0 0 8px rgba(27, 225, 255, 0.4);
  }
  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-4px);
    }
  }

  .animate-bounce {
    animation: bounce 1s infinite;
  }
</style>
