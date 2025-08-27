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

<style>
  .panel { max-width: 700px; margin:auto; font-family: 'Inter', sans-serif; color: white; }
  .agents-list { border: 1px solid #2e3a59; padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem; background: #19223b; }
  .agent-item { display: flex; justify-content: space-between; padding: 0.6rem; border-bottom: 1px solid #2e3a59; cursor: pointer; }
  .agent-item.selected { background: var(--primary-color); }
  .status { font-weight: 600; padding: 0 0.5rem; border-radius: 7px; user-select: none; }
  .status.Aktywny { background-color: #3fbf7f; }
  .status.Nieaktywny { background-color: #cd5a4a; }
  .status.Wtrakciekonfiguracji { background-color: #f8bb3b; }
  .editor { background: #1d2a47; border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem; }
  .generator { background: #19223b; border-radius: 10px; padding: 1rem; }
  input[type="text"], select, button { font-family: 'Inter', sans-serif; }
  input[type="text"], select { width: 100%; padding: 0.45rem; border-radius: 7px; border: none; margin-bottom: 1rem; }
  button { background-color: var(--primary-color); color: white; border: none; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; font-weight: 700; }
  button:hover { background-color: #0077ff; }
</style>

<div class="panel" style="--primary-color: #0af">
  <h2>Panel Agentów</h2>
  <div class="agents-list">
    {#each $agents as agent (agent.id)}
      <div class="agent-item { $selectedAgent?.id === agent.id ? 'selected' : '' }">
        <span>{agent.name}</span>
        <span class={`status ${agent.status.replace(/\s+/g, '')}`}>{agent.status}</span>
        <button style="margin-left:8px; background:#3fbf7f;" on:click={() => { agent.status = 'Aktywny'; saveAgent(agent); }}>Aktywuj</button>
        <button style="margin-left:4px; background:#cd5a4a;" on:click={() => { agent.status = 'Nieaktywny'; saveAgent(agent); }}>Dezaktywuj</button>
      </div>
    {/each}
  </div>

  {#if $selectedAgent}
    <div class="editor">
      <h3>Edycja agenta: {$selectedAgent.name}</h3>
      <label>Nazwa</label>
      <input type="text" bind:value={$selectedAgent.name} />
      <label>Status</label>
      <select bind:value={$selectedAgent.status}>
        <option>Aktywny</option>
        <option>Nieaktywny</option>
        <option>W trakcie konfiguracji</option>
      </select>
      <button on:click={() => saveAgent($selectedAgent)}>Zapisz zmiany</button>
    </div>
  {/if}

  <div class="generator">
    <h2>Generator grafiki AI</h2>
    <input type="text" bind:value={$prompt} placeholder="Opisz grafikę do wygenerowania" />
    <button on:click={generateImage}>Generuj grafikę</button>
    {#if $imageUrl}
      <img src={$imageUrl} alt="Generowana grafika" style="margin-top:10px; max-width: 100%; border-radius: 10px;" />
    {/if}
  </div>
</div>
