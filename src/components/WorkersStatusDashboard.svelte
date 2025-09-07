<script>
  import { onMount } from "svelte";
  import WorkersStatusChart from "./WorkersStatusChart.svelte";

  let workers = [];
  let metrics = {};
  let loading = false;
  let showChart = false;
  let error = null;
  let autoRefresh = true;
  let refreshInterval;

  // Status color mapping
  function getStatusColor(status) {
    switch (status) {
      case "online":
        return "text-green-400";
      case "partial":
        return "text-yellow-400";
      case "offline":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  }

  function getStatusDot(status) {
    switch (status) {
      case "online":
        return "bg-green-400";
      case "partial":
        return "bg-yellow-400";
      case "offline":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  }

  function getStatusBg(status) {
    switch (status) {
      case "online":
        return "bg-green-500/20 border-green-500/30";
      case "partial":
        return "bg-yellow-500/20 border-yellow-500/30";
      case "offline":
        return "bg-red-500/20 border-red-500/30";
      default:
        return "bg-gray-500/20 border-gray-500/30";
    }
  }

  async function fetchWorkersStatus() {
    loading = true;
    error = null;

    try {
      console.log("🔄 Fetching workers status...");
      const response = await fetch("/api/workers-status");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        workers = data.workers;
        metrics = data.metrics;
        console.log("✅ Workers status fetched successfully", {
          workers: workers.length,
          metrics,
        });
      } else {
        throw new Error(data.error || "Failed to fetch workers status");
      }
    } catch (err) {
      error = err.message;
      console.error("❌ Error fetching workers status:", err);
    } finally {
      loading = false;
    }
  }

  function toggleAutoRefresh() {
    autoRefresh = !autoRefresh;
    if (autoRefresh) {
      refreshInterval = setInterval(fetchWorkersStatus, 30000); // Refresh every 30 seconds
    } else {
      clearInterval(refreshInterval);
    }
  }

  function formatTime(isoString) {
    return new Date(isoString).toLocaleTimeString("pl-PL");
  }

  function formatUptime(uptime) {
    return uptime || "0%";
  }

  onMount(() => {
    fetchWorkersStatus();
    if (autoRefresh) {
      refreshInterval = setInterval(fetchWorkersStatus, 30000);
    }

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  });
</script>

<div class="w-full bg-[#111111] border border-[#333333] glass-effect p-6">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2
        class="text-2xl font-bold text-[#00ffff] font-['Neuropol'] uppercase tracking-wider"
      >
        🔧 Status Workerów
      </h2>
      <p class="text-[#a0a0a0] font-['Kenyan_Coffee'] mt-1">
        Zaawansowany monitoring systemu AI funkcji w czasie rzeczywistym
      </p>
    </div>

    <div class="flex items-center gap-3">
      <button
        on:click={toggleAutoRefresh}
        class="px-3 py-1 text-xs font-['Neuropol'] uppercase border transition-all duration-300"
        class:auto-refresh-active={autoRefresh}
        class:auto-refresh-inactive={!autoRefresh}
      >
        Auto: {autoRefresh ? "ON" : "OFF"}
      </button>

      {#if metrics.lastUpdate}
        <span class="text-xs text-[#666666] font-['Kenyan_Coffee']">
          Last: {formatTime(metrics.lastUpdate)}
        </span>
      {/if}
    </div>
  </div>

  <!-- System Overview -->
  {#if metrics.totalWorkers}
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div class="p-3 bg-[#0a0a0a] border border-[#333333] text-center">
        <div class="text-lg font-bold text-[#00ffff] font-['Neuropol']">
          {metrics.onlineWorkers}
        </div>
        <div class="text-xs text-[#a0a0a0] uppercase">Online</div>
      </div>
      <div class="p-3 bg-[#0a0a0a] border border-[#333333] text-center">
        <div class="text-lg font-bold text-yellow-400 font-['Neuropol']">
          {metrics.partialWorkers}
        </div>
        <div class="text-xs text-[#a0a0a0] uppercase">Partial</div>
      </div>
      <div class="p-3 bg-[#0a0a0a] border border-[#333333] text-center">
        <div class="text-lg font-bold text-red-400 font-['Neuropol']">
          {metrics.offlineWorkers}
        </div>
        <div class="text-xs text-[#a0a0a0] uppercase">Offline</div>
      </div>
      <div class="p-3 bg-[#0a0a0a] border border-[#333333] text-center">
        <div class="text-lg font-bold text-[#00ffff] font-['Neuropol']">
          {metrics.totalRequests}
        </div>
        <div class="text-xs text-[#a0a0a0] uppercase">Total Req/min</div>
      </div>
      <div class="p-3 bg-[#0a0a0a] border border-[#333333] text-center">
        <div class="text-lg font-bold text-[#00ffff] font-['Neuropol']">
          {metrics.avgResponseTime}ms
        </div>
        <div class="text-xs text-[#a0a0a0] uppercase">Avg Response</div>
      </div>
    </div>
  {/if}

  <!-- System Health Bar -->
  {#if metrics.systemHealth !== undefined}
    <div class="mb-6">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-[#a0a0a0] font-['Kenyan_Coffee']"
          >Ogólny Stan Systemu</span
        >
        <span class="text-[#00ffff] font-['Neuropol']"
          >{Math.round(metrics.systemHealth)}%</span
        >
      </div>
      <div class="w-full bg-[#333333] h-2 border border-[#555555]">
        <div
          class="h-full transition-all duration-500"
          class:bg-green-500={metrics.systemHealth >= 80}
          class:bg-yellow-500={metrics.systemHealth >= 50 &&
            metrics.systemHealth < 80}
          class:bg-red-500={metrics.systemHealth < 50}
          style="width: {metrics.systemHealth}%"
        ></div>
      </div>
    </div>
  {/if}
  <!-- Control Buttons -->
  <div class="flex flex-wrap gap-3 mb-6">
    <button
      on:click={fetchWorkersStatus}
      disabled={loading}
      class="px-4 py-2 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/20 transition-all duration-300 font-['Neuropol'] uppercase text-sm disabled:opacity-50"
    >
      {loading ? "Sprawdzanie..." : "🔍 Health Check"}
    </button>

    <button
      on:click={() => (showChart = !showChart)}
      class="px-4 py-2 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/20 transition-all duration-300 font-['Neuropol'] uppercase text-sm"
    >
      {showChart ? "Ukryj Monitoring" : "📊 Pokaż Monitoring"}
    </button>

    <button
      on:click={fetchWorkersStatus}
      class="px-4 py-2 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/20 transition-all duration-300 font-['Neuropol'] uppercase text-sm"
    >
      🔧 API Status
    </button>
  </div>

  <!-- Error Display -->
  {#if error}
    <div class="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400">
      <div class="font-['Neuropol'] uppercase text-sm">Error</div>
      <div class="font-['Kenyan_Coffee'] text-sm">{error}</div>
    </div>
  {/if}

  <!-- Workers Status Summary -->
  <div class="mb-4">
    {#if loading}
      <span class="text-[#a0a0a0] font-['Kenyan_Coffee']"
        >Trwa sprawdzanie statusu workerów...</span
      >
    {:else if workers.length > 0}
      <span class="text-[#e0e0e0] font-['Kenyan_Coffee']">
        <span class="text-green-400">{metrics.onlineWorkers}</span> /
        <span class="text-[#00ffff]">{metrics.totalWorkers}</span> workerów
        online
        {#if metrics.systemHealth}
          - System Health: <span class="text-[#00ffff]"
            >{Math.round(metrics.systemHealth)}%</span
          >
        {/if}
      </span>
    {:else}
      <span class="text-[#a0a0a0] font-['Kenyan_Coffee']"
        >Brak danych o workerach</span
      >
    {/if}
  </div>

  <!-- Workers Table -->
  <div class="overflow-x-auto border border-[#333333]">
    <table class="min-w-full bg-[#0a0a0a]">
      <thead>
        <tr class="border-b border-[#333333]">
          <th
            class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm"
            >Nazwa Workera</th
          >
          <th
            class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm"
            >Status</th
          >
          <th
            class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm"
            >CPU</th
          >
          <th
            class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm"
            >RAM</th
          >
          <th
            class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm"
            >Req/min</th
          >
          <th
            class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm"
            >Response</th
          >
          <th
            class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm"
            >Uptime</th
          >
          <th
            class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm"
            >Last Check</th
          >
        </tr>
      </thead>
      <tbody>
        {#each workers as worker, i}
          <tr
            class="border-b border-[#333333]/50 hover:bg-[#111111] transition-colors duration-200"
          >
            <td class="px-4 py-3">
              <div class="text-[#e0e0e0] font-['Kenyan_Coffee'] font-medium">
                {worker.name}
              </div>
              <div class="text-xs text-[#666666] font-['Kenyan_Coffee']">
                {worker.endpoint}
              </div>
            </td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-1 text-xs font-['Neuropol'] uppercase border {getStatusBg(
                  worker.status
                )} {getStatusColor(worker.status)}"
              >
                {worker.status}
              </span>
            </td>
            <td class="px-4 py-3 text-[#e0e0e0] font-['Kenyan_Coffee']">
              {worker.cpu !== null ? worker.cpu + "%" : "-"}
            </td>
            <td class="px-4 py-3 text-[#e0e0e0] font-['Kenyan_Coffee']">
              {worker.ram !== null ? worker.ram + "%" : "-"}
            </td>
            <td class="px-4 py-3 text-[#e0e0e0] font-['Kenyan_Coffee']">
              {worker.requests || 0}
            </td>
            <td class="px-4 py-3 text-[#e0e0e0] font-['Kenyan_Coffee']">
              {worker.responseMs !== null ? worker.responseMs + "ms" : "-"}
            </td>
            <td class="px-4 py-3 text-[#e0e0e0] font-['Kenyan_Coffee']">
              {formatUptime(worker.uptime)}
            </td>
            <td class="px-4 py-3 text-[#a0a0a0] font-['Kenyan_Coffee'] text-sm">
              {worker.lastCheck ? formatTime(worker.lastCheck) : "-"}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Action Buttons -->
  <div class="mt-6 flex flex-col gap-3">
    <button
      on:click={fetchWorkersStatus}
      disabled={loading}
      class="w-full p-3 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/20 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide disabled:opacity-50"
    >
      {loading ? "Sprawdzanie..." : "Sprawdź Wszystkie Workery"}
    </button>

    <button
      on:click={() => (showChart = !showChart)}
      class="w-full p-3 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/20 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide"
    >
      {showChart ? "Ukryj" : "Pokaż"} Szczegółowy Monitor
    </button>
  </div>

  <!-- Chart Modal/Section -->
  {#if showChart && workers.length > 0}
    <WorkersStatusChart
      {workers}
      {metrics}
      onClose={() => (showChart = false)}
    />
  {/if}
</div>

<style>
  .glass-effect {
    backdrop-filter: blur(10px);
    background: rgba(17, 17, 17, 0.8);
  }

  .auto-refresh-active {
    background-color: rgba(0, 255, 255, 0.2);
    border-color: rgba(0, 255, 255, 0.3);
    color: #00ffff;
  }

  .auto-refresh-inactive {
    background-color: rgba(51, 51, 51, 0.2);
    border-color: rgba(102, 102, 102, 0.3);
    color: #a0a0a0;
  }
</style>
