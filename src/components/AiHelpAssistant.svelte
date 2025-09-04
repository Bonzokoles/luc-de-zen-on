<script>
  import { onMount, onDestroy } from "svelte";

  let isConnected = false;
  let messages = [];
  let inputValue = "";
  let isTyping = false;
  let agentStatus = "disconnected";
  let capabilities = [];
  let isMinimized = true;

  let ws = null;
  let messagesContainer;

  // Dynamic WS target: prefer env, then local dev, then production fallback
  const DEFAULT_PROD = "wss://luc-de-zen-on.pages.dev/ws/polaczek";
  let WS_URL = DEFAULT_PROD;

  if (typeof window !== "undefined") {
    const envUrl =
      (import.meta.env &&
        (import.meta.env.PUBLIC_WS_URL ||
          import.meta.env.PUBLIC_POLACZEK_WS)) ||
      "";
    if (envUrl) {
      WS_URL = envUrl;
    } else if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      WS_URL = "ws://127.0.0.1:8787/ws/polaczek"; // wrangler dev default
    } else {
      const scheme = window.location.protocol === "https:" ? "wss://" : "ws://";
      WS_URL = `${scheme}${window.location.host}/ws/polaczek`;
    }
  }

  onMount(() => {
    // Expose a small control API for global UI buttons
    if (typeof window !== "undefined") {
      window.POLACZEK = window.POLACZEK || {};
      window.POLACZEK.openAssistant = () => {
        isMinimized = false;
        setTimeout(() => scrollToBottom(), 30);
      };
      window.POLACZEK.getStatus = () => agentStatus;

      // Listen to quick actions from RightDock
      try {
        window.addEventListener("polaczek-clear-chat", clearChat);
        window.addEventListener("polaczek-reconnect", reconnect);
      } catch (e) {}
    }

    connectToWebSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  });

  onDestroy(() => {
    if (ws) {
      ws.close();
    }
    if (typeof window !== "undefined") {
      try {
        window.removeEventListener("polaczek-clear-chat", clearChat);
        window.removeEventListener("polaczek-reconnect", reconnect);
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

  function connectToWebSocket() {
    try {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        isConnected = true;
        agentStatus = "connected";
        console.log("Connected to POLACZEK_T Agent");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "welcome":
              agentStatus = "ready";
              capabilities = data.capabilities || [];
              addMessage(
                "system",
                `Połączono z ${data.agent_name}. Dostępne funkcje: ${data.capabilities?.join(", ")}`
              );
              break;

            case "response":
              setIsTyping(false);
              addMessage("agent", data.message);
              break;

            case "error":
              setIsTyping(false);
              addMessage("error", `Błąd: ${data.message}`);
              break;

            case "status":
              agentStatus = data.status;
              break;

            default:
              addMessage("agent", data.message || "Nieznana odpowiedź");
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          addMessage("error", "Błąd parsowania odpowiedzi");
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        agentStatus = "error";
        addMessage("error", "Błąd połączenia WebSocket");
      };

      ws.onclose = () => {
        setIsConnected(false);
        agentStatus = "disconnected";
        addMessage("system", "Połączenie zostało zamknięte");
      };
    } catch (error) {
      console.error("Failed to connect:", error);
      addMessage("error", "Nie można nawiązać połączenia");
    }
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
    setInputValue("");
    setIsTyping(true);

    try {
      ws.send(
        JSON.stringify({
          type: "message",
          content: message,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage("error", "Błąd wysyłania wiadomości");
      setIsTyping(false);
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
    if (ws) {
      ws.close();
    }
    connectToWebSocket();
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
