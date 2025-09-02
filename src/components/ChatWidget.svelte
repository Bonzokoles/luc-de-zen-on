<script>
  import { onMount } from "svelte";

  let isOpen = false;
  let messages = [];
  let inputText = "";
  let isLoading = false;
  let sessionId = Math.random().toString(36).substring(2, 15);

  // Load messages from localStorage on component mount
  onMount(() => {
    const savedMessages = localStorage.getItem("chat_messages");
    const savedSession = localStorage.getItem("chat_session");

    if (savedMessages) {
      messages = JSON.parse(savedMessages);
    }

    if (savedSession) {
      sessionId = savedSession;
    } else {
      localStorage.setItem("chat_session", sessionId);
    }
  });

  // Save messages to localStorage whenever they change
  $: {
    if (messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
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
      const response = await fetch(
        "https://multi-ai-assistant.stolarnia-ams.workers.dev/qwen",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            sessionId: sessionId,
            context: {
              source: "chat_widget",
              timestamp: new Date().toISOString(),
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response to chat
      messages = [
        ...messages,
        {
          type: "ai",
          content: data.response,
          timestamp: new Date().toISOString(),
          source: data.model_name,
        },
      ];
    } catch (error) {
      console.error("Error sending message:", error);
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
    localStorage.removeItem("chat_messages");
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
</script>

<div class="chat-widget">
  {#if isOpen}
    <div class="chat-container">
      <div class="chat-header">
        <div class="chat-title">
          <span class="ai-icon">🤖</span>
          POLACZEK AI Asystent
        </div>
        <button
          class="close-btn"
          on:click={() => (isOpen = false)}
          title="Zamknij chat"
        >
          ×
        </button>
      </div>

      <div class="chat-messages">
        {#if messages.length === 0}
          <div class="welcome-message">
            <p>👋 Cześć! Jestem Twoim asystentem AI. Jak mogę pomóc?</p>
            <p class="hint">
              Możesz zapytać o status systemu, workersy AI, tłumaczenia lub
              dostępne agenty.
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
                {#if message.source === "knowledge_base"}
                  <span class="source-badge">📚 Baza wiedzy</span>
                {/if}
                {#if message.source === "ai_model"}
                  <span class="source-badge">🧠 AI Model</span>
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
            </div>
          </div>
        {/if}
      </div>

      <div class="chat-input-container">
        <div class="input-wrapper">
          <textarea
            bind:value={inputText}
            on:keypress={handleKeyPress}
            placeholder="Napisz wiadomość..."
            rows="1"
            disabled={isLoading}
          ></textarea>
          <button
            on:click={sendMessage}
            disabled={!inputText.trim() || isLoading}
            class="send-btn"
            title="Wyślij wiadomość"
          >
            {isLoading ? "⏳" : "📤"}
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
        </div>
      </div>
    </div>
  {:else}
    <button
      class="chat-toggle-btn"
      on:click={() => (isOpen = true)}
      title="Otwórz chat"
    >
      <span class="ai-icon">🤖</span>
      <span class="chat-label">Chat AI</span>
    </button>
  {/if}
</div>

<style>
  .chat-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    font-family: "Rajdhani", system-ui, sans-serif;
  }

  .chat-toggle-btn {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #00d9ff;
    color: #00d9ff;
    padding: 12px 20px;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
  }

  .chat-toggle-btn:hover {
    background: rgba(0, 217, 255, 0.1);
    box-shadow: 0 0 15px rgba(0, 217, 255, 0.5);
    transform: translateY(-2px);
  }

  .chat-container {
    width: 350px;
    height: 500px;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid #00d9ff;
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.4);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .chat-header {
    background: rgba(0, 0, 0, 0.8);
    border-bottom: 1px solid #00d9ff;
    color: #00d9ff;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chat-title {
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .close-btn {
    background: none;
    border: none;
    color: #00d9ff;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .close-btn:hover {
    color: #ffffff;
    text-shadow: 0 0 10px #00d9ff;
  }

  .chat-messages {
    flex: 1;
    padding: 15px;
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
    padding: 10px 15px;
    max-width: 80%;
    word-wrap: break-word;
    border: 1px solid;
  }

  .message.user .message-content {
    background: rgba(0, 217, 255, 0.1);
    color: #00d9ff;
    border-color: #00d9ff;
    box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
  }

  .message.ai .message-content {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.3);
  }

  .message.error .message-content {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border-color: #ef4444;
  }

  .message-meta {
    font-size: 10px;
    color: #888;
    margin-top: 4px;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .source-badge {
    font-size: 9px;
    padding: 2px 6px;
    background: rgba(0, 217, 255, 0.1);
    color: #00d9ff;
    border: 1px solid rgba(0, 217, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
  }

  .typing-indicator span {
    width: 6px;
    height: 6px;
    background: #00d9ff;
    animation: typing 1.4s infinite ease-in-out;
  }

  .typing-indicator span:nth-child(1) {
    animation-delay: 0s;
  }
  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%,
    60%,
    100% {
      opacity: 1;
      transform: translateY(0);
    }
    30% {
      opacity: 0.5;
      transform: translateY(-5px);
    }
  }

  .chat-input-container {
    padding: 15px;
    background: rgba(0, 0, 0, 0.8);
    border-top: 1px solid #00d9ff;
  }

  .input-wrapper {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }

  textarea {
    flex: 1;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #00d9ff;
    color: #ffffff;
    padding: 10px 15px;
    resize: none;
    font-family: inherit;
    font-size: 14px;
    min-height: 40px;
    max-height: 120px;
    transition: all 0.3s ease;
  }

  textarea:focus {
    outline: none;
    border-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
  }

  textarea::placeholder {
    color: #888;
  }

  .send-btn {
    background: rgba(0, 217, 255, 0.1);
    color: #00d9ff;
    border: 1px solid #00d9ff;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  .send-btn:hover:not(:disabled) {
    background: rgba(0, 217, 255, 0.2);
    box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
  }

  .send-btn:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: #888;
    border-color: #888;
    cursor: not-allowed;
  }

  .chat-actions {
    display: flex;
    justify-content: center;
  }

  .clear-btn {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #888;
    padding: 5px 10px;
    font-size: 11px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
  }

  .clear-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border-color: #ffffff;
  }
</style>
