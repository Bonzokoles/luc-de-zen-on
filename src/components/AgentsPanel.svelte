<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const agents = writable([]);
  const selectedAgent = writable(null);
  const prompt = writable('');
  const imageUrl = writable('');

  async function loadAgents() {
    const res = await fetch('/api/agents');
    const data = await res.json();
    agents.set(data);
  }

  async function saveAgent(agent) {
    await fetch('/api/agent', {
      method: 'POST',
      body: JSON.stringify(agent),
      headers: { 'Content-Type': 'application/json' }
    });
    await loadAgents();
  }

  async function generateImage() {
    if ($prompt.trim()) {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        body: JSON.stringify({ prompt: $prompt }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      imageUrl.set(data.imageUrl);
    }
  }

  function selectAgent(agent) {
    selectedAgent.set(agent);
  }

  onMount(() => {
    loadAgents();
  });
</script>

<div class="max-w-3xl mx-auto space-y-6">
  <h2 class="text-2xl font-bold text-primary-foreground mb-6">Panel Agentów</h2>
  
  <div class="bg-secondary border border-edge rounded-lg p-4">
    {#each $agents as agent (agent.id)}
      <div class="flex items-center justify-between p-3 border-b border-edge last:border-b-0 hover:bg-primary/20 transition-colors cursor-pointer {$selectedAgent?.id === agent.id ? 'bg-accent/10' : ''}" on:click={() => selectAgent(agent)}>
        <span class="text-primary-foreground font-medium">{agent.name}</span>
        <div class="flex items-center gap-3">
          <span class="px-2 py-1 rounded text-sm font-semibold {
            agent.status === 'Aktywny' ? 'bg-green-600 text-white' :
            agent.status === 'Nieaktywny' ? 'bg-red-600 text-white' :
            'bg-yellow-600 text-black'
          }">{agent.status}</span>
          <button 
            class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            on:click|stopPropagation={() => { agent.status = 'Aktywny'; saveAgent(agent); }}
          >
            Aktywuj
          </button>
          <button 
            class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            on:click|stopPropagation={() => { agent.status = 'Nieaktywny'; saveAgent(agent); }}
          >
            Dezaktywuj
          </button>
        </div>
      </div>
    {/each}
  </div>

  {#if $selectedAgent}
    <div class="bg-primary border border-edge rounded-lg p-4">
      <h3 class="text-lg font-semibold text-primary-foreground mb-4">Edycja agenta: {$selectedAgent.name}</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-primary-foreground mb-2">Nazwa</label>
          <input 
            type="text" 
            bind:value={$selectedAgent.name}
            class="w-full px-3 py-2 bg-secondary border border-edge rounded-md text-primary-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-primary-foreground mb-2">Status</label>
          <select 
            bind:value={$selectedAgent.status}
            class="w-full px-3 py-2 bg-secondary border border-edge rounded-md text-primary-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option>Aktywny</option>
            <option>Nieaktywny</option>
            <option>W trakcie konfiguracji</option>
          </select>
        </div>
        <button 
          on:click={() => saveAgent($selectedAgent)}
          class="px-4 py-2 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200"
        >
          Zapisz zmiany
        </button>
      </div>
    </div>
  {/if}

  <div class="bg-secondary border border-edge rounded-lg p-4">
    <h2 class="text-lg font-semibold text-primary-foreground mb-4">Generator grafiki AI</h2>
    <div class="space-y-4">
      <input 
        type="text" 
        bind:value={$prompt} 
        placeholder="Opisz grafikę do wygenerowania"
        class="w-full px-3 py-2 bg-primary border border-edge rounded-md text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      />
      <button 
        on:click={generateImage}
        class="px-4 py-2 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-secondary transition-all duration-200"
      >
        Generuj grafikę
      </button>
      {#if $imageUrl}
        <img 
          src={$imageUrl} 
          alt="Generowana grafika" 
          class="mt-4 max-w-full rounded-lg border border-edge" 
        />
      {/if}
    </div>
  </div>
</div>
