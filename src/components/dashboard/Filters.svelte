
<script>
    import { agents, activeFilter } from '../../stores/agentStore';

    let filterOptions = [];
    agents.subscribe(value => {
        filterOptions = ['all', ...new Set(value.map(a => a.id))];
    });

    function setFilter(filter) {
        activeFilter.set(filter);
    }
</script>

<div class="flex flex-wrap gap-2 mb-8">
    <button 
        on:click={() => setFilter('all')}
        class:active={$activeFilter === 'all'}
        class="font-mono text-sm border border-cyber-border px-4 py-1 rounded-none transition-all duration-300 hover:border-cyber-blue hover:bg-cyber-blue hover:text-cyber-dark"
    >
        ALL_AGENTS
    </button>
    {#each $agents as agent}
        <button 
            on:click={() => setFilter(agent.id)}
            class:active={$activeFilter === agent.id}
            class="font-mono text-sm border border-cyber-border px-4 py-1 rounded-none transition-all duration-300 hover:border-cyber-blue hover:bg-cyber-blue hover:text-cyber-dark"
        >
            {agent.name}
        </button>
    {/each}
</div>

<style>
    .active {
        background-color: #00ffff;
        color: #0a0a0a;
        border-color: #00ffff;
    }
</style>
