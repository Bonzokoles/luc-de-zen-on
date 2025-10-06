<script lang="ts">
  import { onMount } from 'svelte';
  let agents = [
    { id: 'POLACZEK_T', name: 'Tłumacz', type: 'T', role: 'translator', status: 'active' },
    { id: 'POLACZEK_M1', name: 'Music Assistant 1', type: 'M', role: 'music-player', status: 'idle' },
    { id: 'POLACZEK_D1', name: 'Dashboard Keeper 1', type: 'D', role: 'dashboard-keeper', status: 'active' },
    { id: 'POLACZEK_B', name: 'Bibliotekarz', type: 'B', role: 'bibliotekarz', status: 'active' }
  ];

  let search = "";
  let newAgent = { type: "T", name: "", role: "", status: "active", description: "" };

  $: visibleAgents = agents.filter(a =>
    search === "" ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase())
  );

  function addAgent() {
    if (!newAgent.type || !newAgent.name || !newAgent.role) return;
    const nextId = `POLACZEK_${newAgent.type}${agents.filter(a => a.type === newAgent.type).length + 1}`;
    agents = [
      ...agents,
      { ...newAgent, id: nextId }
    ];
    newAgent = { type: "T", name: "", role: "", status: "active", description: "" };
  }

  function updateStatus(id: string, status: string) {
    agents = agents.map(a => a.id === id ? { ...a, status } : a);
  }

  // Przykład połączenia z backendem REST
  async function fetchAgentsFromBackend() {
    const resp = await fetch("/api/polaczek-agents");
    agents = await resp.json();
  }
  onMount(fetchAgentsFromBackend);
</script>

<div class="container">
  <h2>POLACZEK Dyrektor – Zarządzanie Agentami</h2>
  <input type="text" bind:value={search} placeholder="Szukaj agentów..." />
  <table>
    <thead>
      <tr>
        <th>ID</th><th>Nazwa</th><th>Typ</th><th>Rola</th><th>Status</th><th>Opis</th><th>Akcje</th>
      </tr>
    </thead>
    <tbody>
      {#each visibleAgents as agent}
        <tr class={agent.status === "active" ? "active-row" : ""}>
          <td>{agent.id}</td>
          <td>{agent.name}</td>
          <td>{agent.type}</td>
          <td>{agent.role}</td>
          <td>
            <select bind:value={agent.status} on:change={() => updateStatus(agent.id, agent.status)}>
              <option value="active">active</option>
              <option value="idle">idle</option>
              <option value="busy">busy</option>
              <option value="error">error</option>
              <option value="disabled">disabled</option>
            </select>
          </td>
          <td>{agent.description}</td>
          <td><!-- przyciski do edycji/usuwania --></td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h3>Dodaj nowego agenta POLACZEK_X</h3>
  <div class="new-agent-row">
    <select bind:value={newAgent.type}>
      <option value="T">Tłumacz</option>
      <option value="M">Music Assistant</option>
      <option value="D">Dashboard Keeper</option>
      <option value="B">Bibliotekarz</option>
      <option value="Dyrektor">Dyrektor</option>
      <option value="Magazynier">Magazynier</option>
    </select>
    <input type="text" bind:value={newAgent.name} placeholder="Nazwa agenta" />
    <input type="text" bind:value={newAgent.role} placeholder="Rola agenta" />
    <input type="text" bind:value={newAgent.description} placeholder="Opis (opcjonalnie)" />
    <button on:click={addAgent}>Dodaj</button>
  </div>
</div>

<style>
  .container { max-width: 700px; margin: 0 auto; padding: 20px; }
  table { width: 100%; margin-bottom: 18px; }
  .active-row { background: #dfffdc; }
  .new-agent-row { display: flex; gap: 9px; margin-bottom: 12px; }
</style>