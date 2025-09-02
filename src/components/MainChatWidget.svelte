<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  let messages = [];
  let inputText = '';
  let isLoading = false;
  let isExpanded = false;
  let sessionId = Math.random().toString(36).substring(2, 15);

  async function sendMessage() {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    inputText = '';
    
    // Add user message
    messages = [...messages, { 
      type: 'user', 
      content: userMessage, 
      timestamp: new Date().toISOString() 
    }];
    
    isLoading = true;
    
    try {
      // Użyj lokalnego API lub Cloudflare Worker
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId,
          context: {
            source: 'main_chat_widget',
            timestamp: new Date().toISOString()
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.response) {
        messages = [...messages, {
          type: 'assistant',
          content: result.response,
          timestamp: new Date().toISOString()
        }];
        dispatch('messageReceived', { response: result.response });
      } else {
        throw new Error(result.error || 'Nie udało się uzyskać odpowiedzi');
      }
    } catch (error) {
      messages = [...messages, {
        type: 'error',
        content: 'Przepraszam, wystąpił błąd podczas komunikacji z AI.',
        timestamp: new Date().toISOString()
      }];
      console.error('Main chat error:', error);
    } finally {
      isLoading = false;
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function openFullChat() {
    window.open('/chatbot', '_blank');
  }

  function clearChat() {
    messages = [];
    sessionId = Math.random().toString(36).substring(2, 15);
  }
</script>

<div class="main-chat-widget" class:expanded={isExpanded}>
  <div class="widget-header">
    <div class="title-section">
      <h3>💬 AI Chat Assistant</h3>
      <span class="model-badge">GPT-4</span>
    </div>
    <div class="header-actions">
      <button on:click={toggleExpanded} class="expand-btn" title="Rozwiń/Zwiń">
        {isExpanded ? '▼' : '▲'}
      </button>
      <button on:click={openFullChat} class="full-btn" title="Otwórz pełny chat">
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
              <div class="welcome-icon">💬</div>
              <p>Witaj! Jestem Twoim AI Assistantem.</p>
              <p>Mogę pomóc Ci z różnymi zadaniami i odpowiedzieć na pytania.</p>
            </div>
          {/if}
          
          {#each messages as message}
            <div class="message {message.type}">
              <div class="message-content">
                {#if message.type === 'user'}
                  <div class="user-avatar">👤</div>
                {:else if message.type === 'assistant'}
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
          placeholder="Zadaj pytanie AI Assistant..."
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
            💫
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .main-chat-widget {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: 1px solid #8b5cf6;
    border-radius: 12px;
    padding: 20px;
    margin: 16px 0;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
  }

  .main-chat-widget.expanded {
    box-shadow: 0 12px 48px rgba(102, 126, 234, 0.4);
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .title-section h3 {
    margin: 0;
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .model-badge {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .header-actions {
    display: flex;
    gap: 6px;
  }

  .expand-btn, .full-btn {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .expand-btn:hover, .full-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
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
    background: rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .welcome-message {
    text-align: center;
    color: rgba(255, 255, 255, 0.9);
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

  .user-avatar, .bot-avatar, .error-avatar {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    flex-shrink: 0;
  }

  .text-content {
    background: rgba(255, 255, 255, 0.15);
    padding: 8px 12px;
    border-radius: 8px;
    color: white;
    font-size: 0.9rem;
    line-height: 1.4;
    max-width: calc(100% - 40px);
  }

  .message.user .text-content {
    background: rgba(255, 255, 255, 0.25);
    margin-left: auto;
  }

  .message.assistant .text-content {
    background: rgba(118, 75, 162, 0.4);
  }

  .message.error .text-content {
    background: rgba(220, 38, 38, 0.3);
    border: 1px solid rgba(220, 38, 38, 0.4);
    color: #fca5a5;
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 8px 12px;
  }

  .typing-indicator span {
    width: 6px;
    height: 6px;
    background: white;
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
    background: rgba(220, 38, 38, 0.15);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #fca5a5;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
  }

  .clear-btn:hover {
    background: rgba(220, 38, 38, 0.25);
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
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 10px 12px;
    color: white;
    font-size: 0.9rem;
    resize: none;
    transition: all 0.3s ease;
  }

  .chat-input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }

  .chat-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  .send-btn {
    background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .send-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  .send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
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
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .main-chat-widget {
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
