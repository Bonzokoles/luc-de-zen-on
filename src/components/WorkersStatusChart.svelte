<script>
  export let workers = [];
  export let onClose;

  let chartContainer;
  let activeTab = "overview";

  // Prepare chart data
  $: chartData = workers.map((worker) => ({
    name: worker.name.replace(/\s+/g, "").substring(0, 8), // Shorten names for chart
    requests: worker.requests || 0,
    cpu: worker.cpu || 0,
    ram: worker.ram || 0,
    responseMs: worker.responseMs || 0,
    status: worker.status,
  }));

  $: onlineWorkers = workers.filter((w) => w.status === "online");
  $: offlineWorkers = workers.filter((w) => w.status === "offline");
  $: partialWorkers = workers.filter((w) => w.status === "partial");

  // Simple SVG chart calculations
  $: maxRequests = Math.max(...chartData.map((d) => d.requests), 100);
  $: maxCpu = Math.max(...chartData.map((d) => d.cpu), 100);
  $: maxRam = Math.max(...chartData.map((d) => d.ram), 100);
  $: maxResponse = Math.max(...chartData.map((d) => d.responseMs), 200);

  function getBarHeight(value, max, chartHeight = 120) {
    return (value / max) * chartHeight;
  }

  function getStatusColor(status) {
    switch (status) {
      case "online":
        return "#10b981"; // green
      case "partial":
        return "#f59e0b"; // yellow
      case "offline":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      onClose();
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Modal Backdrop -->
<div class="chart-modal-backdrop" on:click={handleBackdropClick}>
  <div class="chart-modal" bind:this={chartContainer}>
    <!-- Header -->
    <div class="chart-header">
      <h3 class="chart-title">📊 MONITORING WORKERÓW - ZAAWANSOWANY</h3>
      <button class="close-btn" on:click={onClose}>✖</button>
    </div>

    <!-- Tab Navigation -->
    <div class="tab-nav">
      <button
        class="tab-btn {activeTab === 'overview' ? 'active' : ''}"
        on:click={() => (activeTab = "overview")}
      >
        🏠 PRZEGLĄD
      </button>
      <button
        class="tab-btn {activeTab === 'requests' ? 'active' : ''}"
        on:click={() => (activeTab = "requests")}
      >
        📈 ŻĄDANIA
      </button>
      <button
        class="tab-btn {activeTab === 'performance' ? 'active' : ''}"
        on:click={() => (activeTab = "performance")}
      >
        🔧 WYDAJNOŚĆ
      </button>
      <button
        class="tab-btn {activeTab === 'response' ? 'active' : ''}"
        on:click={() => (activeTab = "response")}
      >
        ⏱️ CZAS ODPOWIEDZI
      </button>
    </div>

    <!-- Chart Content -->
    <div class="chart-content">
      {#if activeTab === "overview"}
        <div class="overview-stats">
          <div class="stat-card online">
            <h4>🟢 ONLINE</h4>
            <div class="stat-number">{onlineWorkers.length}</div>
            <div class="stat-list">
              {#each onlineWorkers as worker}
                <div class="stat-item">• {worker.name}</div>
              {/each}
            </div>
          </div>

          <div class="stat-card partial">
            <h4>🟡 CZĘŚCIOWO</h4>
            <div class="stat-number">{partialWorkers.length}</div>
            <div class="stat-list">
              {#each partialWorkers as worker}
                <div class="stat-item">• {worker.name}</div>
              {/each}
            </div>
          </div>

          <div class="stat-card offline">
            <h4>🔴 OFFLINE</h4>
            <div class="stat-number">{offlineWorkers.length}</div>
            <div class="stat-list">
              {#each offlineWorkers as worker}
                <div class="stat-item">• {worker.name}</div>
              {/each}
            </div>
          </div>
        </div>
      {:else if activeTab === "requests"}
        <div class="chart-section">
          <h4 class="chart-subtitle">📈 Żądania na minutę</h4>
          <div class="bar-chart">
            <svg width="100%" height="160" viewBox="0 0 600 160">
              {#each chartData as worker, i}
                <g transform="translate({i * 65 + 40}, 140)">
                  <!-- Bar -->
                  <rect
                    x="0"
                    y={-getBarHeight(worker.requests, maxRequests, 120)}
                    width="50"
                    height={getBarHeight(worker.requests, maxRequests, 120)}
                    fill={getStatusColor(worker.status)}
                    opacity="0.8"
                  />
                  <!-- Value label -->
                  <text
                    x="25"
                    y="-5"
                    text-anchor="middle"
                    class="chart-label-value"
                  >
                    {worker.requests}
                  </text>
                  <!-- Name label -->
                  <text
                    x="25"
                    y="15"
                    text-anchor="middle"
                    class="chart-label-name"
                  >
                    {worker.name}
                  </text>
                </g>
              {/each}
            </svg>
          </div>
        </div>
      {:else if activeTab === "performance"}
        <div class="performance-charts">
          <!-- CPU Chart -->
          <div class="mini-chart">
            <h5 class="mini-chart-title">🔥 CPU Usage (%)</h5>
            <svg width="100%" height="120" viewBox="0 0 500 120">
              {#each chartData as worker, i}
                <g transform="translate({i * 55 + 30}, 100)">
                  <rect
                    x="0"
                    y={-getBarHeight(worker.cpu, maxCpu, 80)}
                    width="40"
                    height={getBarHeight(worker.cpu, maxCpu, 80)}
                    fill="#f59e0b"
                    opacity="0.7"
                  />
                  <text
                    x="20"
                    y="-5"
                    text-anchor="middle"
                    class="mini-chart-label"
                  >
                    {worker.cpu}%
                  </text>
                  <text
                    x="20"
                    y="15"
                    text-anchor="middle"
                    class="mini-chart-name"
                  >
                    {worker.name}
                  </text>
                </g>
              {/each}
            </svg>
          </div>

          <!-- RAM Chart -->
          <div class="mini-chart">
            <h5 class="mini-chart-title">💾 RAM Usage (%)</h5>
            <svg width="100%" height="120" viewBox="0 0 500 120">
              {#each chartData as worker, i}
                <g transform="translate({i * 55 + 30}, 100)">
                  <rect
                    x="0"
                    y={-getBarHeight(worker.ram, maxRam, 80)}
                    width="40"
                    height={getBarHeight(worker.ram, maxRam, 80)}
                    fill="#e91e63"
                    opacity="0.7"
                  />
                  <text
                    x="20"
                    y="-5"
                    text-anchor="middle"
                    class="mini-chart-label"
                  >
                    {worker.ram}%
                  </text>
                  <text
                    x="20"
                    y="15"
                    text-anchor="middle"
                    class="mini-chart-name"
                  >
                    {worker.name}
                  </text>
                </g>
              {/each}
            </svg>
          </div>
        </div>
      {:else if activeTab === "response"}
        <div class="chart-section">
          <h4 class="chart-subtitle">⏱️ Czas odpowiedzi (ms)</h4>
          <div class="bar-chart">
            <svg width="100%" height="160" viewBox="0 0 600 160">
              {#each chartData as worker, i}
                <g transform="translate({i * 65 + 40}, 140)">
                  <rect
                    x="0"
                    y={-getBarHeight(worker.responseMs, maxResponse, 120)}
                    width="50"
                    height={getBarHeight(worker.responseMs, maxResponse, 120)}
                    fill="#00d7ef"
                    opacity="0.8"
                  />
                  <text
                    x="25"
                    y="-5"
                    text-anchor="middle"
                    class="chart-label-value"
                  >
                    {worker.responseMs}ms
                  </text>
                  <text
                    x="25"
                    y="15"
                    text-anchor="middle"
                    class="chart-label-name"
                  >
                    {worker.name}
                  </text>
                </g>
              {/each}
            </svg>
          </div>
        </div>
      {/if}
    </div>

    <!-- Footer Actions -->
    <div class="chart-footer">
      <button
        class="action-btn refresh"
        on:click={() => window.location.reload()}
      >
        🔄 ODŚWIEŻ DANE
      </button>
      <button class="action-btn close" on:click={onClose}> ❌ ZAMKNIJ </button>
    </div>
  </div>
</div>

<style>
  .chart-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .chart-modal {
    background: #0e1720;
    border: 2px solid #00d7ef;
    border-radius: 0px !important;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 50px rgba(0, 217, 255, 0.3);
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid rgba(0, 217, 255, 0.3);
    background: rgba(0, 217, 255, 0.1);
  }

  .chart-title {
    color: #00d7ef;
    font-size: 1.3rem;
    font-weight: 900;
    margin: 0;
    text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
  }

  .close-btn {
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 0px !important;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: #dc2626;
    transform: scale(1.1);
  }

  .tab-nav {
    display: flex;
    background: rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid rgba(0, 217, 255, 0.3);
    overflow-x: auto;
  }

  .tab-btn {
    background: transparent;
    color: #94aec4;
    border: none;
    border-radius: 0px !important;
    padding: 12px 16px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
  }

  .tab-btn:hover {
    background: rgba(0, 217, 255, 0.1);
    color: #00d7ef;
  }

  .tab-btn.active {
    color: #00d7ef;
    background: rgba(0, 217, 255, 0.2);
    border-bottom-color: #00d7ef;
  }

  .chart-content {
    padding: 20px;
    min-height: 300px;
  }

  /* Overview Stats */
  .overview-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .stat-card {
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
    padding: 16px;
    text-align: center;
  }

  .stat-card.online {
    border-color: #10b981;
  }

  .stat-card.partial {
    border-color: #f59e0b;
  }

  .stat-card.offline {
    border-color: #ef4444;
  }

  .stat-card h4 {
    color: #00d7ef;
    margin: 0 0 12px 0;
    font-size: 1rem;
    font-weight: 700;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 900;
    color: #00d7ef;
    margin-bottom: 12px;
  }

  .stat-list {
    font-size: 0.8rem;
    color: #94aec4;
    text-align: left;
  }

  .stat-item {
    margin-bottom: 4px;
  }

  /* Charts */
  .chart-section {
    text-align: center;
  }

  .chart-subtitle {
    color: #00d7ef;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .bar-chart {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
    padding: 10px;
    overflow-x: auto;
  }

  .chart-label-value {
    fill: #00d7ef;
    font-size: 11px;
    font-weight: 600;
  }

  .chart-label-name {
    fill: #94aec4;
    font-size: 9px;
    font-weight: 500;
  }

  /* Performance Charts */
  .performance-charts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .mini-chart {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
    padding: 15px;
  }

  .mini-chart-title {
    color: #00d7ef;
    font-size: 0.9rem;
    font-weight: 700;
    margin: 0 0 10px 0;
    text-align: center;
  }

  .mini-chart-label {
    fill: #00d7ef;
    font-size: 9px;
    font-weight: 600;
  }

  .mini-chart-name {
    fill: #94aec4;
    font-size: 8px;
    font-weight: 500;
  }

  /* Footer */
  .chart-footer {
    display: flex;
    gap: 12px;
    padding: 20px;
    border-top: 1px solid rgba(0, 217, 255, 0.3);
    background: rgba(0, 0, 0, 0.5);
  }

  .action-btn {
    flex: 1;
    background: #164e63;
    color: #00d7ef;
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
    padding: 10px 16px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn.refresh:hover {
    background: #10b981;
    color: white;
  }

  .action-btn.close:hover {
    background: #ef4444;
    color: white;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .chart-modal {
      margin: 10px;
      max-width: calc(100vw - 20px);
    }

    .tab-nav {
      flex-direction: column;
    }

    .performance-charts {
      grid-template-columns: 1fr;
    }

    .chart-footer {
      flex-direction: column;
    }
  }
</style>
