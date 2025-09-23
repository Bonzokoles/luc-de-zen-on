<script>
  import { onMount, onDestroy } from "svelte";

  let isConnected = false;
  let messages = [];
  let inputValue = "";
  let isTyping = false;
<<<<<<< HEAD
  let agentStatus = "disconnected";
  let capabilities = [];
  let isMinimized = false;
=======
  let agentStatus = "connecting"; // Start with connecting status
  let capabilities = [];
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

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
<<<<<<< HEAD
          isMinimized = false;
=======
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
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

<<<<<<< HEAD
    checkConnection();
=======
    // Auto-connect after small delay for better UX
    setTimeout(() => checkConnection(), 100);

>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
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
<<<<<<< HEAD
          "🤖 POLACZEK_T Assistant połączony i gotowy do pracy!",
=======
          "🤖 POLACZEK_T Assistant połączony i gotowy do pracy!"
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
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
<<<<<<< HEAD
        new CustomEvent("polaczek-status", { detail: { status: agentStatus } }),
=======
        new CustomEvent("polaczek-status", { detail: { status: agentStatus } })
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
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
<<<<<<< HEAD
          `Błąd API (${response.status}): ${errorData.error || "Nieznany błąd"}`,
=======
          `Błąd API (${response.status}): ${errorData.error || "Nieznany błąd"}`
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
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

<<<<<<< HEAD
  function toggleMinimized() {
    isMinimized = !isMinimized;
  }

=======
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
  function clearChat() {
    messages = [];
  }

  function reconnect() {
    // For HTTP API, just check connection again
    checkConnection();
  }
</script>

<div class="assistant-container">
<<<<<<< HEAD
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
=======
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
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
  .assistant-container {
    width: 100%;
  }
  .assistant-panel {
<<<<<<< HEAD
    background: rgba(0, 0, 0, 0.6);
    border: 2px solid #8b0000;
    border-radius: 0;
    width: 100%;
    max-width: 980px;
=======
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
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
    height: 26rem;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
<<<<<<< HEAD
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
=======
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
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
  }
  .messages {
    flex: 1;
    overflow-y: auto;
<<<<<<< HEAD
    padding: 0.75rem;
    background: #0b0b0b;
=======
    padding: 12px;
    background: rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
  }
  .bubble {
    max-width: 70%;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
<<<<<<< HEAD
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
=======
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
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
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
