
<script>
  import { onMount } from "svelte";
  let usageStats = null;

  async function loadStats() {
    const res = await fetch("/api/usage-stats");
    if (res.ok) {
        usageStats = await res.json();
    }
  }

  onMount(() => {
    loadStats();
  });

  // CORRECTED: Use a reactive declaration ($:) to ensure weakPoints is recalculated when usageStats changes.
  $: weakPoints = usageStats
    ? Object.entries(usageStats.stats)
      .filter(([action, count]) => count < 5) // Example threshold for a weak point
      .map(([action]) => action)
    : [];
</script>

<div class="bg-cyber-surface border border-cyber-border rounded-none p-6 font-mono h-full">
  <h3 class="font-bold text-lg text-cyber-blue mb-4">SYSTEM MONITOR</h3>
  {#if usageStats}
    <p class="text-sm text-cyber-text-dim">Całkowita liczba akcji: <span class="text-cyber-blue font-bold">{usageStats.totalActions}</span></p>
    
    <div class="my-4 space-y-2 text-sm">
      {#each Object.entries(usageStats.stats) as [action, count]}
        <div>{action}: <span class="font-bold">{count}</span> wywołań</div>
      {/each}
    </div>

    {#if weakPoints.length > 0}
      <div class="mt-6">
        <h4 class="text-yellow-400">Słabe punkty (niska aktywność):</h4>
        <ul class="list-disc list-inside text-yellow-500/80 text-sm">
          {#each weakPoints as wp}
            <li><strong>{wp}</strong> - wymaga uwagi i testów</li>
          {/each}
        </ul>
      </div>
    {/if}
  {:else}
    <p class="text-cyber-blue animate-pulse">Ładowanie statystyk...</p>
  {/if}
</div>
