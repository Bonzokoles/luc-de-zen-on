<script lang="ts">
  import { onMount } from "svelte";

  interface ActivityLog {
    id: string;
    action: string;
    userId?: string;
    timestamp: number;
    details: Record<string, any>;
    type: "info" | "warning" | "error";
    source: string;
  }

  interface ActivityStats {
    total: number;
    errors: number;
    warnings: number;
    info: number;
    lastHour: number;
    sources: string[];
    anomalies: boolean;
  }

  let logs: ActivityLog[] = [];
  let stats: ActivityStats = {
    total: 0,
    errors: 0,
    warnings: 0,
    info: 0,
    lastHour: 0,
    sources: [],
    anomalies: false,
  };
  let loading = true;
  let error = "";
  let selectedType = "all";
  let refreshInterval: NodeJS.Timeout;

  const typeColors = {
    info: "text-cyan-400",
    warning: "text-yellow-400",
    error: "text-red-400",
  };

  async function fetchLogs() {
    try {
      loading = true;
      const url =
        selectedType === "all"
          ? "/api/activity-monitor"
          : `/api/activity-monitor?type=${selectedType}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        logs = data.logs;
        stats = data.stats;
      } else {
        error = data.message || "Failed to fetch logs";
      }
    } catch (err) {
      error = "Network error occurred";
      console.error("Error fetching logs:", err);
    } finally {
      loading = false;
    }
  }

  // Real activity logging should be handled by the backend automatically
  // This function is removed as it was only for demo purposes

  function formatTimestamp(timestamp: number) {
    return new Date(timestamp).toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case "error":
        return "⚠️";
      case "warning":
        return "⚡";
      case "info":
        return "ℹ️";
      default:
        return "📝";
    }
  }

  onMount(() => {
    fetchLogs();

    // Auto-refresh every 30 seconds
    refreshInterval = setInterval(fetchLogs, 30000);

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  });
</script>

<div
  class="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 text-cyan-300 max-h-[800px] overflow-hidden"
>
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center space-x-3">
      <div class="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
      <h2 class="text-2xl font-bold text-cyan-400">MONITOR AKTYWNOŚCI</h2>
    </div>

    <div class="flex items-center space-x-4">
      <select
        bind:value={selectedType}
        on:change={fetchLogs}
        class="bg-gray-900 border border-cyan-500/50 rounded px-3 py-1 text-cyan-300 focus:border-cyan-400 focus:outline-none"
      >
        <option value="all">Wszystkie</option>
        <option value="info">Info</option>
        <option value="warning">Ostrzeżenia</option>
        <option value="error">Błędy</option>
      </select>

      <button
        on:click={fetchLogs}
        class="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded text-sm font-semibold transition-colors"
        disabled={loading}
      >
        {loading ? "Odświeżanie..." : "🔄 Odśwież"}
      </button>
    </div>
  </div>

  <!-- Statistics Panel -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div
      class="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-4 text-center"
    >
      <div class="text-2xl font-bold text-cyan-400">{stats.total}</div>
      <div class="text-sm text-gray-400">Łącznie</div>
    </div>

    <div
      class="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center"
    >
      <div class="text-2xl font-bold text-red-400">{stats.errors}</div>
      <div class="text-sm text-gray-400">Błędy</div>
    </div>

    <div
      class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-center"
    >
      <div class="text-2xl font-bold text-yellow-400">{stats.warnings}</div>
      <div class="text-sm text-gray-400">Ostrzeżenia</div>
    </div>

    <div
      class="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 text-center"
    >
      <div class="text-2xl font-bold text-cyan-400">{stats.lastHour}</div>
      <div class="text-sm text-gray-400">Ostatnia godzina</div>
    </div>
  </div>

  {#if stats.anomalies}
    <div class="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
      <div class="flex items-center space-x-2">
        <span class="text-red-400 text-xl">🚨</span>
        <span class="font-semibold text-red-400">ANOMALIE WYKRYTE</span>
      </div>
      <p class="text-red-300 mt-2">
        Wykryto nietypową liczbę błędów w systemie. Sprawdź logi poniżej.
      </p>
    </div>
  {/if}

  {#if error}
    <div class="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
      <p class="text-red-300">❌ {error}</p>
    </div>
  {/if}

  <!-- Logs List -->
  <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
    {#if loading}
      <div class="text-center py-8">
        <div
          class="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
        ></div>
        <p class="text-gray-400">Ładowanie logów...</p>
      </div>
    {:else if logs.length === 0}
      <div class="text-center py-8">
        <p class="text-gray-400">Brak logów do wyświetlenia</p>
      </div>
    {:else}
      {#each logs as log (log.id)}
        <div
          class="bg-gray-900/30 border border-gray-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <span class="text-lg">{getTypeIcon(log.type)}</span>
              <div>
                <div class="flex items-center space-x-2">
                  <span class="font-semibold {typeColors[log.type]}"
                    >{log.action}</span
                  >
                  <span
                    class="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300"
                    >{log.source}</span
                  >
                </div>
                <div class="text-sm text-gray-400 mt-1">
                  {formatTimestamp(log.timestamp)}
                  {#if log.userId}
                    • User: {log.userId}
                  {/if}
                </div>
              </div>
            </div>

            <div class="text-xs {typeColors[log.type]} font-semibold uppercase">
              {log.type}
            </div>
          </div>

          {#if Object.keys(log.details).length > 0}
            <div class="mt-3 p-2 bg-gray-800/50 rounded text-xs">
              <div class="text-gray-400 mb-1">Szczegóły:</div>
              <pre class="text-cyan-200 whitespace-pre-wrap">{JSON.stringify(
                  log.details,
                  null,
                  2
                )}</pre>
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #0891b2 #1f2937;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #1f2937;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #0891b2;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #0e7490;
  }
</style>
