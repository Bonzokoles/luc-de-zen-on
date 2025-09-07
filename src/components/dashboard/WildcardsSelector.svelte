
<script>
  import { onMount } from 'svelte';
  let categories = [];
  let selectedCategory = '';
  let examplePrompts = [];
  let isLoading = false;

  onMount(async () => {
    const res = await fetch('/api/wildcards?mode=categories');
    if (res.ok) {
        categories = await res.json();
    }
  });

  async function loadExamples() {
    if (!selectedCategory) {
        examplePrompts = [];
        return;
    }
    isLoading = true;
    const res = await fetch(`/api/wildcards?category=${selectedCategory}`);
    if (res.ok) {
        examplePrompts = await res.json();
    }
    isLoading = false;
  }
</script>

<div class="bg-cyber-surface border border-cyber-border rounded-none p-6">
  <h3 class="font-bold text-lg text-cyber-blue mb-4">WILDCARD PROMPT GENERATOR</h3>
  <div class="flex flex-col gap-4 font-mono text-sm">
    <label for="category-select" class="text-cyber-text-dim">Wybierz kategorię promptów:</label>
    <select id="category-select" bind:value={selectedCategory} on:change={loadExamples} class="w-full bg-cyber-dark border border-cyber-border text-cyber-text p-2 rounded-none focus:outline-none focus:border-cyber-blue">
      <option value="">-- Wybierz --</option>
      {#each categories as cat}
        <option value={cat}>{cat.toUpperCase()}</option>
      {/each}
    </select>

    <div class="mt-4 min-h-[120px]">
        <h4 class="text-cyber-text-dim mb-2">Przykładowe prompty:</h4>
        {#if isLoading}
            <p class="text-cyber-blue animate-pulse">ŁADOWANIE...</p>
        {:else if examplePrompts.length > 0}
            <ul class="space-y-2">
                {#each examplePrompts as prompt}
                <li class="text-cyber-text border-b border-cyber-border/50 pb-1">{prompt}</li>
                {/each}
            </ul>
        {:else if selectedCategory}
            <p class="text-cyber-text-dim">Brak przykładów dla tej kategorii.</p>
        {:else}
            <p class="text-cyber-text-dim">Wybierz kategorię, aby zobaczyć przykłady.</p>
        {/if}
    </div>
  </div>
</div>
