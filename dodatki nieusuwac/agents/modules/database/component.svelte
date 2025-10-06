<script lang="ts">
  // 🗄️ Database Query Agent - Zaawansowany interfejs SQL/NoSQL
  import { onMount } from "svelte";
  import { AGENT_CONFIG } from "./config";

  // Component state
  let isConnected = false;
  let isLoading = false;
  let queryText = "";
  let selectedConnection = "";
  let results: any = null;
  let connections: any[] = [];
  let queryHistory: any[] = [];
  let activeTab: "query" | "connections" | "history" = "query";

  // Connection form
  let connectionForm = {
    name: "",
    type: "mysql",
    host: "localhost",
    port: "",
    database: "",
    username: "",
    password: "",
  };

  // Results pagination
  let currentPage = 0;
  const itemsPerPage = 20;

  onMount(() => {
    loadConnections();
    loadQueryHistory();
  });

  // Test agent connection
  async function testAgent() {
    isLoading = true;
    try {
      const response = await fetch("/api/agents/agent-06", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });
      const data = await response.json();

      if (data.success) {
        alert("✅ Agent Database Query działa poprawnie!");
      } else {
        alert(`❌ Błąd: ${data.message}`);
      }
    } catch (error) {
      alert(`❌ Błąd komunikacji: ${error.message}`);
    } finally {
      isLoading = false;
    }
  }

  // Execute SQL query
  async function executeQuery() {
    if (!queryText.trim() || !selectedConnection) {
      alert("Wprowadź zapytanie i wybierz połączenie");
      return;
    }

    isLoading = true;
    results = null;

    try {
      const response = await fetch("/api/agents/agent-06", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "execute",
          data: {
            query: queryText,
            connectionId: selectedConnection,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        results = data.results;
        currentPage = 0;
        loadQueryHistory(); // Odśwież historię
      } else {
        alert(`❌ Błąd zapytania: ${data.message}`);
      }
    } catch (error) {
      alert(`❌ Błąd: ${error.message}`);
    } finally {
      isLoading = false;
    }
  }

  // Connect to database
  async function connectToDatabase() {
    if (!connectionForm.name || !connectionForm.type) {
      alert("Wprowadź nazwę połączenia i typ bazy");
      return;
    }

    isLoading = true;

    try {
      const response = await fetch("/api/agents/agent-06", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "connect",
          data: connectionForm,
        }),
      });

      const data = await response.json();

      if (data.success) {
        loadConnections();
        selectedConnection = data.connection.id;
        isConnected = true;

        // Reset form
        connectionForm = {
          name: "",
          type: "mysql",
          host: "localhost",
          port: "",
          database: "",
          username: "",
          password: "",
        };

        activeTab = "query";
        alert("✅ Połączono z bazą danych!");
      } else {
        alert(`❌ Błąd połączenia: ${data.message}`);
      }
    } catch (error) {
      alert(`❌ Błąd: ${error.message}`);
    } finally {
      isLoading = false;
    }
  }

  // Load connections
  async function loadConnections() {
    try {
      const response = await fetch("/api/agents/agent-06", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list-connections" }),
      });

      const data = await response.json();
      if (data.success) {
        connections = data.connections;
        isConnected = connections.length > 0;
      }
    } catch (error) {
      console.error("Błąd ładowania połączeń:", error);
    }
  }

  // Load query history
  async function loadQueryHistory() {
    try {
      const response = await fetch("/api/agents/agent-06", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "query-history" }),
      });

      const data = await response.json();
      if (data.success) {
        queryHistory = data.history;
      }
    } catch (error) {
      console.error("Błąd ładowania historii:", error);
    }
  }

  // Load query from history
  function loadHistoryQuery(historyItem: any) {
    queryText = historyItem.query;
    activeTab = "query";
  }

  // Export results
  async function exportResults(format: "json" | "csv") {
    if (!results) {
      alert("Brak wyników do eksportu");
      return;
    }

    try {
      const response = await fetch("/api/agents/agent-06", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "export",
          data: { format },
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ Eksport ${format.toUpperCase()} przygotowany!`);
        if (data.data) {
          console.log("Dane eksportu:", data.data);
        }
      }
    } catch (error) {
      alert(`❌ Błąd eksportu: ${error.message}`);
    }
  }

  // Optimize query
  async function optimizeQuery() {
    if (!queryText.trim()) {
      alert("Wprowadź zapytanie do optymalizacji");
      return;
    }

    try {
      const response = await fetch("/api/agents/agent-06", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "optimize",
          data: { query: queryText },
        }),
      });

      const data = await response.json();
      if (data.success && data.suggestions.length > 0) {
        const suggestions = data.suggestions
          .map((s) => s.suggestion)
          .join("\n");
        if (
          confirm(
            `💡 Sugestie optymalizacji:\n\n${suggestions}\n\nZastosować optymalizację?`
          )
        ) {
          queryText = data.optimizedQuery;
        }
      } else {
        alert("✅ Zapytanie jest już zoptymalizowane!");
      }
    } catch (error) {
      alert(`❌ Błąd analizy: ${error.message}`);
    }
  }

  // Paginated results
  $: paginatedResults = results?.rows
    ? results.rows.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    : [];

  $: totalPages = results?.rows
    ? Math.ceil(results.rows.length / itemsPerPage)
    : 0;
</script>

<div class="database-agent bg-gray-900 text-cyan-100 p-6 rounded-lg">
  <!-- Header -->
  <div class="header flex justify-between items-center mb-6">
    <div>
      <h2 class="text-2xl font-bold text-cyan-400 mb-2">
        🗄️ {AGENT_CONFIG.displayName}
      </h2>
      <p class="text-gray-400">{AGENT_CONFIG.description}</p>
    </div>
    <button
      on:click={testAgent}
      disabled={isLoading}
      class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors disabled:opacity-50"
    >
      {isLoading ? "⏳" : "🧪"} Test
    </button>
  </div>

  <!-- Connection Status -->
  {#if isConnected}
    <div
      class="status bg-green-900/30 border border-green-600 p-3 rounded-lg mb-6"
    >
      <div class="flex items-center gap-2">
        <span class="text-green-400">✅ Połączono</span>
        <span class="text-sm text-gray-400">
          ({connections.length} aktywnych połączeń)
        </span>
      </div>
    </div>
  {:else}
    <div
      class="status bg-yellow-900/30 border border-yellow-600 p-3 rounded-lg mb-6"
    >
      <span class="text-yellow-400">⚠️ Brak połączenia z bazą danych</span>
    </div>
  {/if}

  <!-- Navigation Tabs -->
  <div class="tabs flex gap-4 mb-6">
    <button
      class:active={activeTab === "query"}
      class="tab px-4 py-2 rounded-lg transition-colors"
      on:click={() => (activeTab = "query")}
    >
      📝 Zapytania
    </button>
    <button
      class:active={activeTab === "connections"}
      class="tab px-4 py-2 rounded-lg transition-colors"
      on:click={() => (activeTab = "connections")}
    >
      🔗 Połączenia
    </button>
    <button
      class:active={activeTab === "history"}
      class="tab px-4 py-2 rounded-lg transition-colors"
      on:click={() => (activeTab = "history")}
    >
      📋 Historia
    </button>
  </div>

  <!-- Query Tab -->
  {#if activeTab === "query"}
    <div class="query-section">
      <!-- Connection Selector -->
      {#if connections.length > 0}
        <div class="connection-selector mb-4">
          <label class="block text-sm text-cyan-300 mb-2"
            >Wybierz połączenie:</label
          >
          <select
            bind:value={selectedConnection}
            class="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          >
            <option value="">-- Wybierz bazę danych --</option>
            {#each connections as conn}
              <option value={conn.id}>
                {conn.name} ({conn.type} - {conn.host})
              </option>
            {/each}
          </select>
        </div>
      {/if}

      <!-- Query Editor -->
      <div class="query-editor mb-4">
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm text-cyan-300">Edytor zapytań SQL:</label>
          <div class="flex gap-2">
            <button
              on:click={optimizeQuery}
              disabled={!queryText.trim() || isLoading}
              class="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
            >
              💡 Optymalizuj
            </button>
            <button
              on:click={() => (queryText = "")}
              class="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 rounded"
            >
              🗑️ Wyczyść
            </button>
          </div>
        </div>
        <textarea
          bind:value={queryText}
          placeholder="SELECT * FROM users WHERE active = 1 LIMIT 10;"
          class="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono resize-y"
        ></textarea>
      </div>

      <!-- Execute Button -->
      <div class="execute-section mb-6">
        <button
          on:click={executeQuery}
          disabled={!queryText.trim() || !selectedConnection || isLoading}
          class="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "⏳ Wykonywanie..." : "▶️ Wykonaj zapytanie"}
        </button>
      </div>

      <!-- Results -->
      {#if results}
        <div class="results bg-gray-800 border border-gray-600 rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-cyan-400">
              📊 Wyniki zapytania
            </h3>
            <div class="flex gap-2">
              <button
                on:click={() => exportResults("json")}
                class="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
              >
                📁 JSON
              </button>
              <button
                on:click={() => exportResults("csv")}
                class="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
              >
                📊 CSV
              </button>
            </div>
          </div>

          {#if results.rows.length > 0}
            <!-- Results Table -->
            <div class="table-container overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-700">
                    {#each results.columns as column}
                      <th class="text-left p-2 border-b border-gray-600"
                        >{column}</th
                      >
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  {#each paginatedResults as row, index}
                    <tr class="hover:bg-gray-700/50">
                      {#each row as cell}
                        <td
                          class="p-2 border-b border-gray-700 font-mono text-xs"
                        >
                          {cell}
                        </td>
                      {/each}
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            {#if totalPages > 1}
              <div
                class="pagination flex justify-center items-center gap-2 mt-4"
              >
                <button
                  on:click={() => (currentPage = Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  class="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded disabled:opacity-50"
                >
                  ◀️
                </button>
                <span class="text-sm">
                  Strona {currentPage + 1} z {totalPages}
                  ({results.rows.length} rekordów)
                </span>
                <button
                  on:click={() =>
                    (currentPage = Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  class="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded disabled:opacity-50"
                >
                  ▶️
                </button>
              </div>
            {/if}
          {:else}
            <p class="text-gray-400 text-center py-4">Brak wyników</p>
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Connections Tab -->
  {#if activeTab === "connections"}
    <div class="connections-section">
      <!-- New Connection Form -->
      <div
        class="new-connection bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6"
      >
        <h3 class="text-lg font-semibold text-cyan-400 mb-4">
          ➕ Nowe połączenie
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-cyan-300 mb-1"
              >Nazwa połączenia:</label
            >
            <input
              bind:value={connectionForm.name}
              type="text"
              placeholder="Moja baza danych"
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label class="block text-sm text-cyan-300 mb-1">Typ bazy:</label>
            <select
              bind:value={connectionForm.type}
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              {#each AGENT_CONFIG.supportedDatabases as db}
                <option value={db.type}>{db.icon} {db.name}</option>
              {/each}
            </select>
          </div>

          <div>
            <label class="block text-sm text-cyan-300 mb-1">Host:</label>
            <input
              bind:value={connectionForm.host}
              type="text"
              placeholder="localhost"
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label class="block text-sm text-cyan-300 mb-1">Port:</label>
            <input
              bind:value={connectionForm.port}
              type="number"
              placeholder="3306"
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label class="block text-sm text-cyan-300 mb-1">Nazwa bazy:</label>
            <input
              bind:value={connectionForm.database}
              type="text"
              placeholder="database_name"
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label class="block text-sm text-cyan-300 mb-1">Użytkownik:</label>
            <input
              bind:value={connectionForm.username}
              type="text"
              placeholder="username"
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-sm text-cyan-300 mb-1">Hasło:</label>
          <input
            bind:value={connectionForm.password}
            type="password"
            placeholder="password"
            class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        <button
          on:click={connectToDatabase}
          disabled={isLoading}
          class="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold disabled:opacity-50"
        >
          {isLoading ? "⏳ Łączenie..." : "🔗 Połącz"}
        </button>
      </div>

      <!-- Active Connections -->
      {#if connections.length > 0}
        <div class="active-connections">
          <h3 class="text-lg font-semibold text-cyan-400 mb-4">
            🔗 Aktywne połączenia
          </h3>
          <div class="space-y-2">
            {#each connections as conn}
              <div
                class="connection-item bg-gray-800 border border-gray-600 rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <div class="font-semibold">{conn.name}</div>
                  <div class="text-sm text-gray-400">
                    {conn.type} • {conn.host}:{conn.port || "default"} • {conn.database}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-green-400 text-sm">●</span>
                  <span class="text-sm text-gray-400">Połączono</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <!-- History Tab -->
  {#if activeTab === "history"}
    <div class="history-section">
      <h3 class="text-lg font-semibold text-cyan-400 mb-4">
        📋 Historia zapytań
      </h3>

      {#if queryHistory.length > 0}
        <div class="space-y-3">
          {#each queryHistory.slice(0, 20) as item}
            <div
              class="history-item bg-gray-800 border border-gray-600 rounded-lg p-3"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="text-sm text-gray-400">
                  {new Date(item.timestamp).toLocaleString("pl-PL")}
                </div>
                <div class="flex items-center gap-2">
                  {#if item.status === "success"}
                    <span class="text-green-400 text-xs">✅ OK</span>
                  {:else}
                    <span class="text-red-400 text-xs">❌ Błąd</span>
                  {/if}
                  <span class="text-xs text-gray-400"
                    >{item.executionTime}ms</span
                  >
                  <span class="text-xs text-gray-400">{item.rows} rekordów</span
                  >
                </div>
              </div>
              <div
                class="query-text bg-gray-900 p-2 rounded font-mono text-sm mb-2"
              >
                {item.query}
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-400">Baza: {item.database}</span>
                <button
                  on:click={() => loadHistoryQuery(item)}
                  class="px-2 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 rounded"
                >
                  📋 Użyj ponownie
                </button>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-gray-400 text-center py-8">
          Historia zapytań jest pusta
        </p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .tab {
    background: #374151;
    color: #9ca3af;
  }

  .tab.active {
    background: #059669;
    color: white;
  }

  .tab:hover {
    background: #4b5563;
  }

  .tab.active:hover {
    background: #047857;
  }

  .table-container {
    max-height: 400px;
    overflow-y: auto;
  }

  .query-text {
    max-height: 100px;
    overflow-y: auto;
  }
</style>
