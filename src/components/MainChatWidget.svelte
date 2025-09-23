<script>
  import { onMount } from "svelte";

  let isOpen = false;
  let messages = [];
  let inputText = "";
  let isLoading = false;
  let sessionId = Math.random().toString(36).substring(2, 15);
  let activeModel = null;
  let selectedProvider = "cloudflare"; // 'cloudflare' lub 'openrouter'

  // Load messages from localStorage on component mount
  onMount(() => {
    const savedMessages = localStorage.getItem("main_chat_messages");
    const savedSession = localStorage.getItem("main_chat_session");

    if (savedMessages) {
      messages = JSON.parse(savedMessages);
    }

    if (savedSession) {
      sessionId = savedSession;
    } else {
      localStorage.setItem("main_chat_session", sessionId);
    }

    // Listen for OpenRouter model selection
    window.addEventListener("openRouterModelSelected", handleModelSelection);

    return () => {
      window.removeEventListener(
        "openRouterModelSelected",
        handleModelSelection
      );
    };
  });

  function handleModelSelection(event) {
    activeModel = event.detail;
    selectedProvider = "openrouter";
    isOpen = true; // Automatically open chat when model is selected

    // Add welcome message for the selected model
    messages = [
      ...messages,
      {
        type: "ai",
        content: `🤖 Aktywowano model ${activeModel.name}! ${activeModel.description}. W czym mogę pomóc?`,
        timestamp: new Date().toISOString(),
        source: "openrouter_model",
        model: activeModel.id,
      },
    ];
  }

  // Save messages to localStorage whenever they change
  $: {
    if (messages.length > 0) {
      localStorage.setItem("main_chat_messages", JSON.stringify(messages));
    }
  }

  async function sendMessage() {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    inputText = "";

    // Add user message to chat
    messages = [
      ...messages,
      {
        type: "user",
        content: userMessage,
        timestamp: new Date().toISOString(),
      },
    ];

    isLoading = true;

    try {
      let response;

      if (selectedProvider === "openrouter" && activeModel) {
        // Use OpenRouter API
        response = await fetch("/api/openrouter-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            model: activeModel.id,
            systemPrompt: `Jesteś pomocnym asystentem AI działającym w systemie MyBonzo. Nazywasz się ${activeModel.name}. ${activeModel.description}`,
          }),
        });
      } else {
        // Use Cloudflare Workers AI
        response = await fetch("/api/generic-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_message: userMessage,
            system_prompt:
              "Jesteś pomocnym asystentem AI w platformie MyBonzo. Pomagaj użytkownikom z zadaniami związanymi z AI i automatyzacją.",
            model: "@cf/google/gemma-3-12b-it",
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Błąd API");
      }

      // Add AI response to chat
      messages = [
        ...messages,
        {
          type: "ai",
          content: data.response || data.answer || "Brak odpowiedzi",
          timestamp: new Date().toISOString(),
          source:
            selectedProvider === "openrouter"
              ? "openrouter_model"
              : "cloudflare_ai",
          model:
            selectedProvider === "openrouter"
              ? activeModel?.id
              : "@cf/google/gemma-3-12b-it",
        },
      ];
    } catch (error) {
      console.error("Chat error:", error);
      messages = [
        ...messages,
        {
          type: "ai",
          content:
            "Przepraszam, wystąpił błąd podczas przetwarzania Twojego zapytania. Spróbuj ponownie później.",
          timestamp: new Date().toISOString(),
          error: true,
        },
      ];
    } finally {
      isLoading = false;
    }
  }

  function clearChat() {
    messages = [];
    activeModel = null;
    selectedProvider = "cloudflare";
    localStorage.removeItem("main_chat_messages");
  }

  function switchToCloudflare() {
    selectedProvider = "cloudflare";
    activeModel = null;
    messages = [
      ...messages,
      {
        type: "ai",
        content:
          "🔄 Przełączono na Cloudflare Workers AI. Używam teraz lokalnego modelu Gemma.",
        timestamp: new Date().toISOString(),
        source: "cloudflare_ai",
      },
    ];
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
</script>

<div
  class="main-chat-widget"
  data-component="main-chat"
  data-active-model={activeModel?.id || "cloudflare"}
>
  {#if isOpen}
    <div class="chat-container">
      <div class="chat-header">
        <div class="chat-title">
          <span class="ai-icon">
            {#if selectedProvider === "openrouter" && activeModel}
              {activeModel.icon}
            {:else}
              🤖
            {/if}
          </span>
          <div class="title-info">
            <div class="main-title">MyBonzo AI Chat</div>
            <div class="subtitle">
              {#if selectedProvider === "openrouter" && activeModel}
                {activeModel.name} via OpenRouter
              {:else}
                Cloudflare Workers AI
              {/if}
            </div>
          </div>
        </div>
        <div class="header-actions">
          {#if selectedProvider === "openrouter"}
            <button
              class="switch-btn"
              on:click={switchToCloudflare}
              title="Przełącz na Cloudflare AI"
            >
              ☁️
            </button>
          {/if}
          <button
            class="close-btn"
            on:click={() => (isOpen = false)}
            title="Zamknij chat"
          >
            ×
          </button>
        </div>
      </div>

      <div class="chat-messages">
        {#if messages.length === 0}
          <div class="welcome-message">
            <p>👋 Cześć! Jestem Twoim głównym asystentem AI w MyBonzo.</p>
            <p class="hint">
              Wybierz model z floating buttons lub zadaj mi pytanie!
            </p>
          </div>
        {:else}
          {#each messages as message}
            <div class="message {message.type} {message.error ? 'error' : ''}">
              <div class="message-content">
                {message.content}
              </div>
              <div class="message-meta">
                <span class="timestamp">
                  {new Date(message.timestamp).toLocaleTimeString("pl-PL")}
                </span>
                {#if message.source === "openrouter_model"}
                  <span class="source-badge" style="--badge-color: #ff6b35;"
                    >🌐 {message.model?.split("/")[0] || "OpenRouter"}</span
                  >
                {:else if message.source === "cloudflare_ai"}
                  <span class="source-badge" style="--badge-color: #f38020;"
                    >☁️ Cloudflare</span
                  >
                {/if}
              </div>
            </div>
          {/each}
        {/if}

        {#if isLoading}
          <div class="message ai loading">
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="loading-text">
                {selectedProvider === "openrouter"
                  ? `${activeModel?.name} pisze odpowiedź...`
                  : "AI pisze odpowiedź..."}
              </div>
            </div>
          </div>
        {/if}
      </div>

      <div class="chat-input-container">
        <div class="input-wrapper">
          <textarea
            bind:value={inputText}
            on:keypress={handleKeyPress}
            placeholder={selectedProvider === "openrouter" && activeModel
              ? `Napisz do ${activeModel.name}...`
              : "Napisz wiadomość..."}
            rows="1"
            disabled={isLoading}
          />
          <button
            on:click={sendMessage}
            disabled={!inputText.trim() || isLoading}
            class="send-btn"
            title="Wyślij wiadomość"
          >
            {isLoading ? "⏳" : "🚀"}
          </button>
        </div>
        <div class="chat-actions">
          <button
            on:click={clearChat}
            class="clear-btn"
            title="Wyczyść historię"
          >
            🗑️ Wyczyść
          </button>
          <div class="provider-indicator">
            {selectedProvider === "openrouter"
              ? "🌐 OpenRouter"
              : "☁️ Cloudflare"}
          </div>
        </div>
      </div>
    </div>
  {:else}
    <button
      class="chat-toggle-btn"
      on:click={() => (isOpen = true)}
      title="Otwórz główny chat"
    >
      <span class="ai-icon">💬</span>
      <span class="chat-label">Main Chat AI</span>
      {#if activeModel}
        <span class="active-model">{activeModel.icon}</span>
      {/if}
    </button>
  {/if}
</div>

<style>
  .main-chat-widget {
    position: fixed;
    bottom: 120px;
    right: 120px;
    z-index: 999;
    font-family: "Rajdhani", system-ui, sans-serif;
  }

  .chat-toggle-btn {
    background: linear-gradient(135deg, #00d9ff 0%, #7b2cbf 50%, #ff006e 100%);
    border: none;
    color: white;
    padding: 15px 25px;
    cursor: pointer;
    border-radius: 25px;
    box-shadow: 0 8px 25px rgba(0, 217, 255, 0.4);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    font-weight: 600;
  }

  .chat-toggle-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 217, 255, 0.5);
  }

  .active-model {
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 14px;
  }

  .chat-container {
    width: 420px;
    height: 550px;
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid #00d9ff;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(20px);
    box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(0, 217, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: linear-gradient(
      135deg,
      rgba(0, 217, 255, 0.1) 0%,
      rgba(123, 44, 191, 0.1) 100%
    );
    border-bottom: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 13px 13px 0 0;
  }

  .chat-title {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ai-icon {
    font-size: 24px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  }

  .title-info {
    display: flex;
    flex-direction: column;
  }

  .main-title {
    color: #00d9ff;
    font-weight: 700;
    font-size: 16px;
    text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
  }

  .subtitle {
    color: #ffffff;
    font-size: 12px;
    opacity: 0.7;
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }

  .switch-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .switch-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .close-btn {
    background: rgba(255, 0, 110, 0.2);
    border: 1px solid rgba(255, 0, 110, 0.4);
    color: #ff006e;
    width: 35px;
    height: 35px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: rgba(255, 0, 110, 0.4);
    transform: scale(1.1);
  }

  .chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.7);
    background-image:
      linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  .welcome-message {
    text-align: center;
    color: #00d9ff;
    font-size: 14px;
    text-shadow: 0 0 5px rgba(0, 217, 255, 0.5);
  }

  .welcome-message .hint {
    font-size: 12px;
    margin-top: 8px;
    color: #888;
  }

  .message {
    margin-bottom: 15px;
  }

  .message.user {
    text-align: right;
  }

  .message.ai {
    text-align: left;
  }

  .message-content {
    display: inline-block;
    padding: 12px 16px;
    max-width: 85%;
    word-wrap: break-word;
    border-radius: 12px;
    border: 1px solid;
    line-height: 1.4;
  }

  .message.user .message-content {
    background: linear-gradient(
      135deg,
      rgba(0, 217, 255, 0.2) 0%,
      rgba(0, 217, 255, 0.1) 100%
    );
    color: #00d9ff;
    border-color: #00d9ff;
    box-shadow: 0 4px 15px rgba(0, 217, 255, 0.2);
  }

  .message.ai .message-content {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .message.error .message-content {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border-color: #ef4444;
  }

  .message.loading .message-content {
    background: rgba(123, 44, 191, 0.1);
    border-color: #7b2cbf;
  }

  .message-meta {
    font-size: 10px;
    color: #888;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .message.user .message-meta {
    justify-content: flex-end;
  }

  .source-badge {
    background: var(--badge-color, #00d9ff);
    color: white;
    padding: 2px 6px;
    border-radius: 8px;
    font-size: 9px;
    font-weight: 500;
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
    align-items: center;
    margin-bottom: 8px;
  }

  .typing-indicator span {
    width: 6px;
    height: 6px;
    background: #7b2cbf;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  .loading-text {
    color: #7b2cbf;
    font-size: 12px;
  }

  .chat-input-container {
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.8);
    border-top: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0 0 13px 13px;
  }

  .input-wrapper {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  textarea {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 8px;
    padding: 10px 12px;
    color: white;
    resize: none;
    font-family: inherit;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  textarea:focus {
    outline: none;
    border-color: #00d9ff;
    box-shadow: 0 0 15px rgba(0, 217, 255, 0.3);
  }

  textarea::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  .send-btn {
    background: linear-gradient(135deg, #00d9ff 0%, #7b2cbf 100%);
    border: none;
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    min-width: 50px;
  }

  .send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .send-btn:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 217, 255, 0.4);
  }

  .chat-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .clear-btn {
    background: rgba(255, 0, 110, 0.1);
    border: 1px solid rgba(255, 0, 110, 0.3);
    color: #ff006e;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 11px;
    transition: all 0.2s ease;
  }

  .clear-btn:hover {
    background: rgba(255, 0, 110, 0.2);
  }

  .provider-indicator {
    font-size: 11px;
    color: #888;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  @keyframes typing {
    0%,
    60%,
    100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .main-chat-widget {
      bottom: 20px;
      right: 20px;
    }

    .chat-container {
      width: 350px;
      height: 500px;
    }
  }
</style>
