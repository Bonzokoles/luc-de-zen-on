<script>
  import { onMount } from 'svelte';
  let stats = null;
  let isLoading = true;

  onMount(async () => {
    try {
      // Fetching data from the new Bielik Analytics API
      const res = await fetch('/api/bielik-analytics');
      if (res.ok) {
        stats = await res.json();
      }
    } catch (error) {
      console.error('Failed to fetch usage stats from Bielik API:', error);
    } finally {
      isLoading = false;
    }
  });

  function getBarWidth(count, maxCount) {
    if (maxCount === 0) return '0%';
    return `${(count / maxCount) * 100}%`;
  }
</script>

<div class="bg-cyber-surface border border-cyber-border rounded-none p-6">
    <h2 class="text-2xl font-bold text-cyber-blue mb-6">BIELIK ANALYTICS</h2>
    
    {#if isLoading}
        <div class="text-center text-cyber-blue animate-pulse font-mono">[LOADING_ANALYTICS_FROM_BIELIK...]</div>
    {:else if stats}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-sm">
            
            <div class="bg-cyber-dark p-4 border border-cyber-border/50 flex flex-col justify-center items-center">
                <h3 class="text-cyber-text-dim uppercase tracking-widest mb-2">Total Requests</h3>
                <p class="text-5xl font-bold text-cyber-blue">{stats.totalRequests}</p>
            </div>

            <div class="bg-cyber-dark p-4 border border-cyber-border/50">
                <h3 class="text-cyber-text-dim uppercase tracking-widest mb-4">Top 5 Agents</h3>
                <ul class="space-y-3">
                    {#each stats.topAgents as agent}
                        <li>
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-cyber-text">{agent.name}</span>
                                <span class="text-cyber-blue font-bold">{agent.count}</span>
                            </div>
                            <div class="w-full bg-cyber-border/30 h-2">
                                <div class="bg-cyber-blue h-2" style="width: {getBarWidth(agent.count, stats.topAgents[0].count)}"></div>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>

            <div class="bg-cyber-dark p-4 border border-cyber-border/50">
                <h3 class="text-cyber-text-dim uppercase tracking-widest mb-4">Top 5 Wildcards</h3>
                <ul class="space-y-3">
                    {#each stats.topPrompts as prompt}
                         <li>
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-cyber-text">{prompt.name}</span>
                                <span class="text-cyber-blue font-bold">{prompt.count}</span>
                            </div>
                            <div class="w-full bg-cyber-border/30 h-2">
                                <div class="bg-cyber-blue h-2" style="width: {getBarWidth(prompt.count, stats.topPrompts[0].count)}"></div>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    {:else}
        <div class="text-center text-red-500 font-mono">[ANALYTICS_UNAVAILABLE]</div>
    {/if}
</div>