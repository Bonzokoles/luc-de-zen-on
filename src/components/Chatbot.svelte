<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const input = writable('');
  const messages = writable([]);

  async function sendMessage() {
    if (!$input) return;
    messages.update(msgs => [...msgs, { from: 'user', text: $input }]);
    const res = await fetch('/api/ai-bot-worker', {
      method: 'POST',
      body: JSON.stringify({ prompt: $input }),
      headers: { 'Content-Type': 'application/json' },
    });
    const { answer } = await res.json();
    messages.update(msgs => [
      ...msgs,
      { from: 'bot', text: answer }
    ]);
    input.set('');
  }
</script>

<style>
  .chatbot-panel { max-width: 500px; margin:auto; background: #19223b; color: white; border-radius: 10px; padding: 1rem; font-family: 'Inter', sans-serif; }
  .user { color: #3fbf7f; }
  .bot { color: #f8bb3b; }
  input[type="text"] { width: 100%; padding: 0.45rem; border-radius: 7px; border: none; margin-bottom: 1rem; }
  button { background-color: #0af; color: white; border: none; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; font-weight: 700; }
  button:hover { background-color: #0077ff; }
</style>

<div class="chatbot-panel">
  <h2>Chatbot AI</h2>
  <div>
    {#each $messages as m}
      <p class={m.from}>{m.text}</p>
    {/each}
  </div>
  <input
    type="text"
    bind:value={$input}
    on:keydown={(e) => e.key === 'Enter' && sendMessage()}
    placeholder="Napisz wiadomość..."
  />
  <button on:click={sendMessage}>Wyślij</button>
</div>
