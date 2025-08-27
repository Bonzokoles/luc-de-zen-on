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

<div class="max-w-lg mx-auto bg-secondary border border-edge rounded-lg p-4 space-y-4">
  <h2 class="text-xl font-semibold text-primary-foreground mb-4">Chatbot AI</h2>
  
  <div class="min-h-32 max-h-64 overflow-y-auto space-y-2 mb-4 p-3 bg-primary rounded-md border border-edge">
    {#each $messages as m}
      <div class="flex flex-col space-y-1">
        <span class="text-xs opacity-60">{m.from === 'user' ? 'Ty' : 'AI'}</span>
        <p class="text-sm {m.from === 'user' ? 'text-accent' : 'text-primary-foreground'} leading-relaxed">
          {m.text}
        </p>
      </div>
    {/each}
  </div>
  
  <div class="flex gap-2">
    <input
      type="text"
      bind:value={$input}
      on:keydown={(e) => e.key === 'Enter' && sendMessage()}
      placeholder="Napisz wiadomość..."
      class="flex-1 px-3 py-2 bg-primary border border-edge rounded-md text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
    />
    <button 
      on:click={sendMessage}
      class="px-4 py-2 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-secondary transition-all duration-200"
    >
      Wyślij
    </button>
  </div>
</div>
