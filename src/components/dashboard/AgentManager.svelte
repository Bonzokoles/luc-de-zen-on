
<script>
    import { agents, activeFilter } from '../../stores/agentStore';

    let filteredAgents = [];

    $: {
        if ($activeFilter === 'all') {
            filteredAgents = $agents;
        } else {
            filteredAgents = $agents.filter(agent => agent.id === $activeFilter);
        }
    }

    function getStatusClass(status) {
        switch (status) {
            case 'active': return 'text-green-400';
            case 'inactive': return 'text-red-500';
            case 'standby': return 'text-yellow-500';
            default: return 'text-cyber-text-dim';
        }
    }
</script>

<div class="bg-cyber-surface border border-cyber-border rounded-none">
    <div class="p-4 border-b border-cyber-border">
        <h3 class="font-bold text-lg text-cyber-blue">AGENTS STATUS</h3>
    </div>
    <div class="p-4 space-y-2">
        {#each filteredAgents as agent (agent.id)}
            <div class="grid grid-cols-3 items-center font-mono text-sm p-2 border border-transparent hover:border-cyber-blue/50 transition-colors duration-300">
                <span class="text-cyber-text">{agent.name}</span>
                <span class={getStatusClass(agent.status)}>{agent.status.toUpperCase()}</span>
                <div class="text-right">
                    <button class="text-xs border border-cyber-border px-2 py-1 rounded-none hover:bg-cyber-blue hover:text-cyber-dark transition-colors">MANAGE</button>
                </div>
            </div>
        {/each}
    </div>
</div>
