<script>
  import { onMount } from "svelte";

  let isConnected = false;
  let messages = [];
  let inputValue = "";
  let isTyping = false;
  let agentStatus = "disconnected";
  let capabilities = [];
  let isMinimized = true;

  let messagesContainer;
  let sessionId = Math.random().toString(36).substring(2, 15);

  $: if (messages.length > 0) {
    setTimeout(() => scrollToBottom(), 50);
  }

  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  onMount(async () => {
    await checkConnection();
  });

  async function checkConnection() {
    agentStatus = "checking";
    try {
      // Prefer Multi-AI Worker health
      const resp = await fetch(
        "https://multi-ai-assistant.stolarnia-ams.workers.dev/health",
        {
          method: "GET",
          signal: AbortSignal.timeout(4000),
        }
      );
      if (resp.ok) {
        isConnected = true;
        agentStatus = "ready";
        capabilities = ["chat", "gemma", "qwen", "deepseek"];
        addMessage("system", "Połączono z POLACZEK (Gemma). Zadaj pytanie.");
        return;
      }
      throw new Error("health failed");
    } catch (e) {
      // Local fallback still works
      isConnected = true; // HTTP nie wymaga stałego połączenia
      agentStatus = "ready";
      capabilities = ["chat", "fallback"];
      addMessage(
        "system",
        "Tryb lokalny. POLACZEK dostępny przez /api/polaczek-chat."
      );
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

  async function sendMessage() {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    addMessage("user", message);
    inputValue = "";
    isTyping = true;

    try {
      // Use unified HTTP API with Gemma by default
      const resp = await fetch("/api/polaczek-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: message,
          sessionId,
          model: "gemma",
          context: { source: "ai_help_assistant" },
        }),
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const data = await resp.json();
      addMessage("agent", data?.answer || "(brak odpowiedzi)");
    } catch (err) {
      console.error("POLACZEK HTTP error:", err);
      addMessage("error", "Przepraszam, wystąpił błąd komunikacji.");
    } finally {
      isTyping = false;
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
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

  function toggleMinimized() {
    isMinimized = !isMinimized;
  }

  function clearChat() {
    messages = [];
  }

  async function reconnect() {
    await checkConnection();
  }
</script>

<div class="fixed bottom-4 right-4 z-50">
  <!-- Minimized View -->
  {#if isMinimized}
    <button
      on:click={toggleMinimized}
      class="bg-gray-900 hover:bg-gray-800 text-white p-3 shadow-lg transition-all duration-200 flex items-center gap-2 border border-gray-700"
      style="border-radius: 0;"
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
      class="bg-white shadow-xl border w-80 sm:w-96 h-96 flex flex-col border-gray-700"
      style="border-radius: 0;"
    >
      <!-- Header -->
      <div
        class="bg-gray-900 text-white p-3 flex justify-between items-center border-b border-gray-700"
        style="border-radius: 0;"
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
              class={`max-w-xs px-3 py-2 text-sm ${
                message.type === "user"
                  ? "bg-gray-900 text-white border border-gray-700"
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
      <div class="p-3 border-t bg-gray-800 border-gray-700">
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
            disabled={false}
            class="flex-1 px-3 py-2 border border-gray-600 bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-600"
            style="border-radius: 0;"
          />
          <button
            on:click={sendMessage}
            disabled={!inputValue.trim()}
            class="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-600 text-white px-3 py-2 text-sm transition-colors border border-gray-700"
            style="border-radius: 0;"
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
