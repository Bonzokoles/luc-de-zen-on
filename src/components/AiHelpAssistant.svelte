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

  const WS_URL = "ws://localhost:3008";

  onMount(() => {
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
  });

  $: if (messages.length > 0) {
    setTimeout(() => scrollToBottom(), 50);
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

<div class="fixed bottom-4 right-4 z-50">
  <!-- Minimized View -->
  {#if isMinimized}
    <button
      on:click={toggleMinimized}
      class="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
    >
      <span class="text-lg">🤖</span>
      <span class="hidden sm:inline">AI Asystent</span>
      <span class={`text-xs ${getStatusColor(agentStatus)}`}>
        {getStatusIcon(agentStatus)}
      </span>
    </button>
  {:else}
    <!-- Expanded View -->
    <div
      class="bg-white rounded-lg shadow-xl border w-80 sm:w-96 h-96 flex flex-col"
    >
      <!-- Header -->
      <div
        class="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center"
      >
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
      <div
        bind:this={messagesContainer}
        class="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50"
      >
        {#each messages as message (message.id)}
          <div
            class={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              class={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                message.type === "user"
                  ? "bg-blue-600 text-white"
                  : message.type === "agent"
                    ? "bg-white text-gray-800 border"
                    : message.type === "system"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
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
      <div class="p-3 border-t bg-white rounded-b-lg">
        <div class="flex gap-2 mb-2">
          <button
            on:click={clearChat}
            class="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
            disabled={messages.length === 0}
          >
            Wyczyść
          </button>
          <button
            on:click={reconnect}
            class="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
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
            class="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            on:click={sendMessage}
            disabled={!isConnected || !inputValue.trim()}
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            Wyślij
          </button>
        </div>

        {#if capabilities.length > 0}
          <div class="mt-2 text-xs text-gray-500">
            Funkcje: {capabilities.join(", ")}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
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
