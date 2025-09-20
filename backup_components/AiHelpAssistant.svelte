<script>
  import { onMount, onDestroy } from "svelte";

  let isConnected = false;
  let messages = [];
  let inputValue = "";
  let isTyping = false;
  let agentStatus = "disconnected";
  let capabilities = [];
  let isMinimized = false;

  let messagesContainer;
  let sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // HTTP API Configuration - POLACZEK with Gemma from Cloudflare
  const API_BASE_URL =
    import.meta.env.PUBLIC_POLACZEK_API_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const CHAT_ENDPOINT = `${API_BASE_URL}/api/chat`;
  const STATUS_ENDPOINT = `${API_BASE_URL}/api/health`;
  const HEALTH_ENDPOINT = `${API_BASE_URL}/api/health`;

  onMount(() => {
    // Clear any previous instances to prevent conflicts
    if (typeof window !== "undefined") {
      // Force clean state
      delete window.POLACZEK;

      // Re-create fresh API
      window.POLACZEK = {
        openAssistant: () => {
          isMinimized = false;
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

    checkConnection();
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
          "🤖 POLACZEK_T Assistant połączony i gotowy do pracy!",
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
        new CustomEvent("polaczek-status", { detail: { status: agentStatus } }),
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
          `Błąd API (${response.status}): ${errorData.error || "Nieznany błąd"}`,
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

  function toggleMinimized() {
    isMinimized = !isMinimized;
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
  <!-- Minimized View -->
  {#if isMinimized}
    <button
      on:click={toggleMinimized}
      class="polaczek-launcher"
      aria-label="Otwórz POLACZEK AI"
    >
      <span class="icon">🤖</span>
      <span class="label">POLACZEK AI</span>
      <span class={`status ${getStatusColor(agentStatus)}`}
        >{getStatusIcon(agentStatus)}</span
      >
    </button>
  {:else}
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
          <button
            on:click={toggleMinimized}
            class="text-white hover:text-gray-200 text-xl"
          >
            −
          </button>
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
        </div>

        {#if capabilities.length > 0}
          <div class="mt-2 text-xs text-gray-400">
            Funkcje: {capabilities.join(", ")}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .polaczek-launcher {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border: 2px solid #8b0000;
    padding: 0.5rem 0.75rem;
    border-radius: 0;
    cursor: pointer;
    box-shadow: 0 0 18px rgba(139, 0, 0, 0.35);
    transition:
      box-shadow 0.2s,
      border-color 0.2s;
  }
  .polaczek-launcher:hover {
    border-color: #00e7ff;
    box-shadow: 0 0 22px rgba(0, 231, 255, 0.4);
  }
  .polaczek-launcher .icon {
    font-size: 1.1rem;
  }
  .polaczek-launcher .label {
    font-weight: 600;
    letter-spacing: 0.05em;
  }
  .polaczek-launcher .status {
    font-size: 0.8rem;
  }
  .assistant-container {
    width: 100%;
  }
  .assistant-panel {
    background: rgba(0, 0, 0, 0.6);
    border: 2px solid #8b0000;
    border-radius: 0;
    width: 100%;
    max-width: 980px;
    height: 26rem;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    box-shadow: 0 0 30px rgba(139, 0, 0, 0.4);
  }
  .assistant-header {
    background: #111;
    color: #fff;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #8b0000;
  }
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem;
    background: #0b0b0b;
  }
  .bubble {
    max-width: 70%;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    border: 2px solid #333;
  }
  .bubble-user {
    background: #000;
    color: #fff;
    border-color: #8b0000;
    margin-left: auto;
  }
  .bubble-agent {
    background: #0f0f0f;
    color: #ddd;
    border-color: #333;
  }
  .bubble-system {
    background: #332e00;
    color: #ffd700;
    border-color: #8b0000;
  }
  .input-bar {
    padding: 0.75rem;
    background: #111;
    border-top: 2px solid #8b0000;
  }
  .assistant-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    background: #1a1a1a;
    color: #fff;
    border: 2px solid #333;
    border-radius: 0;
    outline: none;
  }
  .assistant-input:focus {
    border-color: #00e7ff;
    box-shadow: 0 0 10px rgba(0, 231, 255, 0.3);
  }
  .assistant-send {
    background: #000;
    color: #fff;
    border: 2px solid #8b0000;
    padding: 0.5rem 0.75rem;
    border-radius: 0;
  }
  .assistant-send:hover {
    border-color: #00e7ff;
    box-shadow: 0 0 10px rgba(0, 231, 255, 0.3);
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
