<script lang="ts">
  import { onMount } from 'svelte';
  let agents = [];
  let search = "";
  let newAgent = { id: "", name: "", type: "T", role: "", status: "active", description: "", endpoint: "" };
  let config = {};

  // Pobieranie agentów z backendu
  async function fetchAgents() {
    const res = await fetch("/api/polaczek-agents");
    agents = await res.json();
  }

  // Pobierz konfigurację systemu
  async function fetchConfig() {
    const res = await fetch("/api/polaczek-config");
    config = await res.json();
  }

  onMount(() => {
    fetchAgents();
    fetchConfig();
  });

  $: visibleAgents = agents.filter(a =>
    search === "" ||
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.role?.toLowerCase().includes(search.toLowerCase()) ||
    a.type?.toLowerCase().includes(search.toLowerCase())
  );

  async function addAgent() {
    if (!newAgent.name || !newAgent.role) return;
    // ID z automatu wg typu + count
    newAgent.id = `POLACZEK_${newAgent.type}${agents.filter(a => a.type === newAgent.type).length + 1}`;
    await fetch("/api/polaczek-agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAgent)
    });
    newAgent = { id: "", name: "", type: "T", role: "", status: "active", description: "", endpoint: "" };
    fetchAgents();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/polaczek-agents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchAgents();
  }

  async function removeAgent(id: string) {
    await fetch(`/api/polaczek-agents/${id}`, { method: "DELETE" });
    fetchAgents();
  }
</script>

<div class="container">
  <h2>POLACZEK Dyrektor – Panel Agentów</h2>
  <div>GPU: {config.gpu} | RAM: {config.ram} | DB: {config.db} | Routing: {config.routing} | Liczba agentów: {config.agentsCount}</div>
  <input type="text" bind:value={search} placeholder="Szukaj agentów..." />
  <table>
    <thead>
      <tr>
        <th>ID</th><th>Nazwa</th><th>Typ</th><th>Rola</th><th>Status</th><th>Opis</th><th>Endpoint</th><th>Akcje</th>
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
          <td>{agent.endpoint}</td>
          <td>
            <button on:click={() => removeAgent(agent.id)}>Usuń</button>
          </td>
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
    <input type="text" bind:value={newAgent.endpoint} placeholder="Endpoint (opcjonalnie)" />
    <button on:click={addAgent}>Dodaj</button>
  </div>
</div>

<style>
  .container { max-width: 900px; margin: 0 auto; padding: 20px; }
  table { width: 100%; margin-bottom: 18px; }
  .active-row { background: #dfffdc; }
  .new-agent-row { display: flex; gap: 9px; margin-bottom: 12px; }
</style>