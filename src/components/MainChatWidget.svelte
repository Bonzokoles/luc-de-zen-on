<script>
  import { onMount } from 'svelte';

  let messages = [];
  let newMessage = '';
  let selectedModel = 'bielik';
  let isLoading = false;

  const models = [
    { id: 'bielik', name: 'Bielik (PL)' },
    { id: 'polaczek', name: 'POLACZEK (PL)' },
    { id: 'qwen', name: 'Qwen (PL)' },
    { id: 'gemma', name: 'Gemma' },
    { id: 'fast', name: 'Fast' },
    { id: 'advanced', name: 'Advanced' },
  ];

  onMount(() => {
    addMessage('assistant', 'Witaj! Jestem głównym asystentem MyBonzo. W czym mogę pomóc?');
  });

  function addMessage(role, content) {
    messages = [...messages, { role, content, timestamp: new Date() }];
  }

  async function sendMessage() {
    if (!newMessage.trim() || isLoading) return;

    const userMessage = newMessage;
    addMessage('user', userMessage);
    newMessage = '';
    isLoading = true;

    try {
      const response = await fetch('/api/polaczek-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          model: selectedModel,
          language: 'pl',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || data.answer || 'Przepraszam, wystąpił błąd.';
      addMessage('assistant', aiResponse);

    } catch (error) {
      console.error('Chat API error:', error);
      addMessage('error', `Błąd połączenia z AI: ${error.message}`);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="main-chat-widget-container bg-gray-900/50 border border-edge rounded-lg p-4 backdrop-blur-sm w-full max-w-4xl mx-auto">
  <div class="chat-header mb-4 flex justify-between items-center">
    <h3 class="text-lg font-semibold text-cyan-400">Główny Asystent AI</h3>
    <select bind:value={selectedModel} class="p-2 border border-edge rounded text-primary-foreground bg-gray-800/50 text-xs">
      {#each models as model}
        <option value={model.id}>{model.name}</option>
      {/each}
    </select>
  </div>

  <div class="chat-messages-container h-64 overflow-y-auto p-2 bg-black/30 rounded-md mb-4">
    {#each messages as message}
      <div class="message mb-3 p-2 rounded-md text-sm {message.role === 'user' ? 'bg-blue-900/30 text-right' : 'bg-cyan-900/30'}">
        <div class="message-content {message.role === 'error' ? 'text-red-400' : 'text-gray-200'}">
          {message.content}
        </div>
        <div class="timestamp text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString('pl-PL')}
        </div>
      </div>
    {/each}
    {#if isLoading}
      <div class="message assistant-message mb-3 p-2 rounded-md text-sm bg-cyan-900/30">
        <div class="message-content text-gray-200 animate-pulse">
          AI pisze...
        </div>
      </div>
    {/if}
  </div>

  <div class="chat-input-area flex gap-2">
    <textarea
      bind:value={newMessage}
      on:keydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
      placeholder="Napisz wiadomość..."
      class="flex-1 p-2 border border-edge rounded-lg text-primary-foreground bg-gray-800/50 resize-none"
      disabled={isLoading}
    ></textarea>
    <button on:click={sendMessage} disabled={isLoading} class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50">
      Wyślij
    </button>
  </div>
</div>

<style>
  .main-chat-widget-container {
    font-family: 'Rajdhani', sans-serif;
  }
  .message.user {
    margin-left: auto;
    max-width: 80%;
  }
  .message.assistant, .message.error {
    margin-right: auto;
    max-width: 80%;
  }
</style>
