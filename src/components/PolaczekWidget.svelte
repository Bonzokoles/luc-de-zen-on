<script>
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  let messages = [];
  let inputText = "";
  let isLoading = false;
  let isExpanded = false;
  let isConnected = false;
  let connectionStatus = "checking";
  let sessionId = Math.random().toString(36).substring(2, 15);

  // Check connection status on mount
  onMount(async () => {
    await checkConnection();
  });

  async function checkConnection() {
    connectionStatus = "checking";
    try {
      const response = await fetch(
        "https://multi-ai-assistant.stolarnia-ams.workers.dev/health",
        {
          method: "GET",
          signal: AbortSignal.timeout(5000), // 5 second timeout
        }
      );

      if (response.ok) {
        isConnected = true;
        connectionStatus = "connected";
      } else {
        throw new Error("Health check failed");
      }
    } catch (error) {
      console.warn("Multi-AI Worker offline, using local fallback:", error);
      isConnected = false;
      connectionStatus = "disconnected";
    }
  }

  async function sendMessage() {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    inputText = "";

    // Add user message
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
      let apiUrl;
      let requestBody;

      if (isConnected) {
        // Use Multi-AI Worker with DeepSeek model for programming tasks
        apiUrl =
          "https://multi-ai-assistant.stolarnia-ams.workers.dev/deepseek";
        requestBody = JSON.stringify({
          message: userMessage,
          sessionId: sessionId,
          context: {
            source: "polaczek_widget",
            timestamp: new Date().toISOString(),
          },
        });
      } else {
        // Use local API as fallback
        apiUrl = "/api/chat";
        requestBody = JSON.stringify({
          prompt: userMessage,
          sessionId: sessionId,
        });
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      let responseText;
      if (isConnected && result.success && result.response) {
        responseText = result.response;
      } else if (!isConnected && result.answer) {
        responseText = result.answer;
      } else {
        throw new Error(result.error || "Nie udało się uzyskać odpowiedzi");
      }

      messages = [
        ...messages,
        {
          type: "assistant",
          content: responseText,
          timestamp: new Date().toISOString(),
        },
      ];
      dispatch("messageReceived", { response: responseText });
    } catch (error) {
      messages = [
        ...messages,
        {
          type: "error",
          content:
            "Przepraszam, wystąpił błąd podczas komunikacji z asystentem.",
          timestamp: new Date().toISOString(),
        },
      ];
      console.error("POLACZEK chat error:", error);
    } finally {
      isLoading = false;
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function openFullChat() {
    window.open("/polaczek-agents-system", "_blank");
  }

  function clearChat() {
    messages = [];
    sessionId = Math.random().toString(36).substring(2, 15);
  }
</script>

<div class="polaczek-widget" class:expanded={isExpanded}>
  <div class="widget-header">
    <div class="title-section">
      <h3>🤖 POLACZEK Assistant</h3>
      <button
        class="status-badge {connectionStatus}"
        on:click={checkConnection}
        title="Kliknij aby sprawdzić połączenie"
      >
        {#if connectionStatus === "checking"}
          ⏳ Checking...
        {:else if connectionStatus === "connected"}
          🟢 Online
        {:else}
          🔴 Local Mode
        {/if}
      </button>
    </div>
    <div class="header-actions">
      <button on:click={toggleExpanded} class="expand-btn" title="Rozwiń/Zwiń">
        {isExpanded ? "▼" : "▲"}
      </button>
      <button
        on:click={openFullChat}
        class="full-btn"
        title="Otwórz pełny system"
      >
        🔗
      </button>
    </div>
  </div>

  <div class="widget-content">
    {#if isExpanded}
      <div class="chat-container">
        <div class="messages-area">
          {#if messages.length === 0}
            <div class="welcome-message">
              <div class="welcome-icon">🤖</div>
              <p>Cześć! Jestem POLACZEK, Twój AI Assistant.</p>
              <p>Możesz zadać mi pytanie lub poprosić o pomoc!</p>
            </div>
          {/if}

          {#each messages as message}
            <div class="message {message.type}">
              <div class="message-content">
                {#if message.type === "user"}
                  <div class="user-avatar">👤</div>
                {:else if message.type === "assistant"}
                  <div class="bot-avatar">🤖</div>
                {:else}
                  <div class="error-avatar">⚠️</div>
                {/if}
                <div class="text-content">
                  {message.content}
                </div>
              </div>
            </div>
          {/each}

          {#if isLoading}
            <div class="message assistant loading">
              <div class="message-content">
                <div class="bot-avatar">🤖</div>
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          {/if}
        </div>

        <div class="chat-actions">
          <button on:click={clearChat} class="clear-btn" title="Wyczyść czat">
            🗑️
          </button>
        </div>
      </div>
    {/if}

    <div class="input-section">
      <div class="input-container">
        <textarea
          bind:value={inputText}
          on:keypress={handleKeyPress}
          placeholder="Zadaj pytanie POLACZEK Assistant..."
          rows={isExpanded ? "2" : "1"}
          disabled={isLoading}
          class="chat-input"
        ></textarea>

        <button
          on:click={sendMessage}
          disabled={!inputText.trim() || isLoading}
          class="send-btn"
          title="Wyślij wiadomość"
        >
          {#if isLoading}
            <span class="spinner"></span>
          {:else}
            🚀
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .polaczek-widget {
    border: 1px solid var(--color-edge, #ccc);
    padding: 20px;
    margin: 16px 0;
    background: var(--color-background, transparent);
    transition: all 0.3s ease;
  }

  .polaczek-widget:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .polaczek-widget.expanded {
    border-color: var(--color-primary, #666);
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--color-edge, #ccc);
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .title-section h3 {
    margin: 0;
    color: #00d9ff;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .status-badge {
    padding: 3px 8px;
    border: 1px solid var(--color-edge, #ccc);
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .status-badge:hover {
    filter: brightness(1.05);
  }

  .status-badge.connected,
  .status-badge.online {
    background: var(--color-success, #22c55e);
    color: var(--color-success-foreground, #fff);
  }

  .status-badge.disconnected {
    background: var(--color-destructive, #dc2626);
    color: var(--color-destructive-foreground, #fff);
  }

  .status-badge.checking {
    background: var(--color-warning, #f59e0b);
    color: var(--color-warning-foreground, #fff);
    animation: pulse 2s infinite;
  }

  .header-actions {
    display: flex;
    gap: 6px;
  }

  .expand-btn,
  .full-btn {
    background: var(--color-secondary, #f5f5f5);
    border: 1px solid var(--color-edge, #ccc);
    color: var(--color-secondary-foreground, #000);
    width: 32px;
    height: 32px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .expand-btn:hover,
  .full-btn:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .widget-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .chat-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .messages-area {
    max-height: 300px;
    overflow-y: auto;
    padding: 12px;
    background: var(--color-muted, #f5f5f5);
    border: 1px solid var(--color-edge, #ccc);
  }

  .welcome-message {
    text-align: center;
    color: var(--color-muted-foreground, #666);
    padding: 20px;
  }

  .welcome-icon {
    font-size: 2rem;
    margin-bottom: 8px;
  }

  .welcome-message p {
    margin: 4px 0;
    font-size: 0.9rem;
  }

  .message {
    margin-bottom: 12px;
  }

  .message-content {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  .user-avatar,
  .bot-avatar,
  .error-avatar {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    flex-shrink: 0;
  }

  .text-content {
    background: var(--color-background, transparent);
    border: 1px solid var(--color-edge, #ccc);
    padding: 8px 12px;
    color: var(--color-foreground, #000);
    font-size: 0.9rem;
    line-height: 1.4;
    max-width: calc(100% - 40px);
  }

  .message.user .text-content {
    background: var(--color-primary, #666);
    color: var(--color-primary-foreground, #fff);
    margin-left: auto;
  }

  .message.assistant .text-content {
    background: var(--color-secondary, #f5f5f5);
    color: var(--color-secondary-foreground, #000);
  }

  .message.error .text-content {
    background: var(--color-destructive-background, #fee);
    border: 1px solid var(--color-destructive, #dc2626);
    color: var(--color-destructive-foreground, #dc2626);
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 8px 12px;
  }

  .typing-indicator span {
    width: 6px;
    height: 6px;
    background: #4c6ef5;
    border-radius: 50%;
    animation: typing 1.4s infinite;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  .chat-actions {
    display: flex;
    justify-content: flex-end;
  }

  .clear-btn {
    background: var(--color-destructive-background, #fee);
    border: 1px solid var(--color-destructive, #dc2626);
    color: var(--color-destructive-foreground, #dc2626);
    padding: 6px 10px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
  }

  .clear-btn:hover {
    filter: brightness(1.05);
  }

  .input-section {
    width: 100%;
  }

  .input-container {
    display: flex;
    gap: 8px;
    align-items: flex-end;
  }

  .chat-input {
    flex: 1;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 217, 255, 0.3);
    padding: 10px 12px;
    color: #e0e0e0;
    font-size: 0.9rem;
    resize: none;
    transition: all 0.3s ease;
  }

  .chat-input:focus {
    outline: none;
    border-color: #00d9ff;
    box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
  }

  .chat-input::placeholder {
    color: #888;
  }

  .send-btn {
    background: var(--color-primary, #666);
    border: 1px solid var(--color-edge, #ccc);
    color: var(--color-primary-foreground, #fff);
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .send-btn:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  .send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
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

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }

  @media (max-width: 768px) {
    .polaczek-widget {
      padding: 16px;
    }

    .messages-area {
      max-height: 200px;
    }

    .input-container {
      flex-direction: column;
      gap: 8px;
    }

    .send-btn {
      width: 100%;
      height: 36px;
    }
  }
</style>
