
<script>
  let query = "";
  let results = [];
  let status = 'idle';

  async function search() {
    if (!query.trim()) return;
    status = 'loading';
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    results = await res.json();
    status = 'idle';
  }
</script>

<div class="bg-cyber-surface border border-cyber-border rounded-none p-6 font-mono h-full flex flex-col">
    <h3 class="font-bold text-lg text-cyber-blue mb-4">WYSZUKIWARKA INFORMACJI</h3>
    <div class="flex gap-2 mb-4">
        <input 
            class="w-full bg-cyber-dark border border-cyber-border/50 text-cyber-text p-2 rounded-none focus:outline-none focus:border-cyber-blue"
            placeholder="Szukaj w sieci z pomocą Bielika..." 
            bind:value={query} 
            on:keydown={(e) => e.key === 'Enter' && search()}
        />
        <button 
            class="bg-cyber-border text-cyber-text font-bold py-2 px-4 rounded-none hover:bg-cyber-blue hover:text-cyber-dark transition-colors disabled:opacity-50"
            on:click={search} disabled={status === 'loading'}>SZUKAJ</button>
    </div>
    <div class="flex-grow space-y-2 max-h-48 overflow-y-auto pr-2 text-sm">
        {#if status === 'loading'}
            <p class="text-cyber-blue animate-pulse">WYSZUKIWANIE...</p>
        {/if}
        {#each results as r}
            <a href={r.url} target="_blank" rel="noopener" class="block border-b border-cyber-border/30 pb-1 text-cyber-text hover:text-cyber-blue transition-colors">{r.title}</a>
        {/each}
    </div>
</div>
