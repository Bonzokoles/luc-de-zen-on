<script>
  import { onMount } from 'svelte';
  import WorkersStatusChart from './WorkersStatusChart.svelte';

  let workers = [];
  let loading = false;
  let showChart = false;
  let error = null;

  // Status color mapping
  function getStatusColor(status) {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'partial': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }

  function getStatusDot(status) {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'partial': return 'bg-yellow-400';
      case 'offline': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  }

  async function fetchWorkersStatus() {
    loading = true;
    error = null;
    
    try {
      console.log('🔄 Fetching workers status...');
      const response = await fetch('/api/workers-status');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      workers = data;
      console.log('✅ Workers status loaded:', data);
    } catch (err) {
      console.error('❌ Error fetching workers status:', err);
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function formatTime(isoString) {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }

  function getOnlineStats() {
    if (workers.length === 0) return '0/0';
    const online = workers.filter(w => w.status === 'online').length;
    return `${online}/${workers.length}`;
  }

  function toggleChart() {
    showChart = !showChart;
  }

  // Auto-load on mount
  onMount(() => {
    fetchWorkersStatus();
  });
</script>

<div class="workers-status-dashboard">
  <div class="dashboard-header">
    <h2 class="dashboard-title">🔧 STATUS WORKERÓW</h2>
    <p class="dashboard-description">Zaawansowany monitoring API workerów z metrykami wydajności</p>
    
    <!-- Status Summary -->
    <div class="status-summary">
      <div class="status-indicator">
        <span class="status-dot {workers.filter(w => w.status === 'online').length === workers.length ? 'bg-green-400' : workers.some(w => w.status === 'online') ? 'bg-yellow-400' : 'bg-red-400'}"></span>
        <span class="status-text">
          {#if loading}
            Sprawdzanie...
          {:else if workers.length > 0}
            {getOnlineStats()} online
          {:else}
            Brak danych (0/0)
          {/if}
        </span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button 
        class="action-btn primary" 
        on:click={fetchWorkersStatus}
        disabled={loading}
      >
        {loading ? '🔄 SPRAWDZANIE...' : '🔍 HEALTH CHECK'}
      </button>
      <button 
        class="action-btn secondary" 
        on:click={toggleChart}
        disabled={workers.length === 0}
      >
        📊 MONITORING
      </button>
      <button 
        class="action-btn tertiary" 
        on:click={fetchWorkersStatus}
        disabled={loading}
      >
        🔧 API STATUS
      </button>
    </div>
  </div>

  <!-- Error Display -->
  {#if error}
    <div class="error-message">
      ❌ Błąd: {error}
    </div>
  {/if}

  <!-- Workers Table -->
  {#if workers.length > 0}
    <div class="workers-table-container">
      <table class="workers-table">
        <thead>
          <tr>
            <th>Nazwa Workera</th>
            <th>Status</th>
            <th>CPU</th>
            <th>RAM</th>
            <th>Req/min</th>
            <th>Response [ms]</th>
            <th>Last Check</th>
          </tr>
        </thead>
        <tbody>
          {#each workers as worker, i}
            <tr class="worker-row">
              <td class="worker-name">
                <span class="worker-icon">⚙️</span>
                {worker.name}
              </td>
              <td class="worker-status">
                <span class="status-badge {getStatusColor(worker.status)}">
                  <span class="status-dot-small {getStatusDot(worker.status)}"></span>
                  {worker.status}
                </span>
              </td>
              <td class="metric">
                {worker.cpu !== null ? `${worker.cpu}%` : '-'}
              </td>
              <td class="metric">
                {worker.ram !== null ? `${worker.ram}%` : '-'}
              </td>
              <td class="metric">
                {worker.requests || 0}
              </td>
              <td class="metric">
                {worker.responseMs !== null ? worker.responseMs : '-'}
              </td>
              <td class="timestamp">
                {formatTime(worker.lastCheck)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else if !loading}
    <div class="no-data">
      📊 Brak danych o workerach. Kliknij "HEALTH CHECK" aby pobrać status.
    </div>
  {/if}

  <!-- Main Action Buttons -->
  <div class="main-actions">
    <button 
      class="main-action-btn check-all" 
      on:click={fetchWorkersStatus}
      disabled={loading}
    >
      {loading ? '🔄 SPRAWDZANIE...' : '🔍 SPRAWDŹ WSZYSTKIE'}
    </button>
    <button 
      class="main-action-btn monitor" 
      on:click={toggleChart}
      disabled={workers.length === 0}
    >
      📈 MONITOR ZAAWANSOWANY
    </button>
  </div>

  <!-- Chart Modal -->
  {#if showChart && workers.length > 0}
    <WorkersStatusChart 
      {workers} 
      onClose={() => showChart = false} 
    />
  {/if}
</div>

<style>
  .workers-status-dashboard {
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
    padding: 24px;
    color: #00d7ef;
    font-family: 'Courier New', monospace;
  }

  .dashboard-header {
    margin-bottom: 20px;
  }

  .dashboard-title {
    color: #00d7ef;
    font-size: 1.5rem;
    font-weight: 900;
    margin-bottom: 8px;
    text-shadow: 0 0 10px rgba(0, 215, 239, 0.5);
  }

  .dashboard-description {
    color: #94aec4;
    font-size: 0.9rem;
    margin-bottom: 16px;
  }

  .status-summary {
    margin-bottom: 16px;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 0px !important;
    display: inline-block;
  }

  .status-text {
    color: #00d7ef;
    font-weight: 600;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .action-btn {
    background: #164e63;
    color: #00d7ef;
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
    padding: 8px 12px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn:hover:not(:disabled) {
    background: #1be1ff;
    color: #000;
    transform: translateY(-1px);
  }

  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message {
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid #ef4444;
    border-radius: 0px !important;
    padding: 12px;
    margin-bottom: 16px;
    color: #ef4444;
    font-weight: 600;
  }

  .workers-table-container {
    overflow-x: auto;
    margin-bottom: 20px;
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
  }

  .workers-table {
    width: 100%;
    border-collapse: collapse;
    background: rgba(0, 0, 0, 0.5);
  }

  .workers-table th {
    background: #164e63;
    color: #00d7ef;
    padding: 12px 8px;
    text-align: left;
    font-weight: 700;
    font-size: 0.85rem;
    border-bottom: 1px solid rgba(0, 217, 255, 0.3);
  }

  .worker-row {
    border-bottom: 1px solid rgba(0, 217, 255, 0.2);
    transition: background-color 0.2s ease;
  }

  .worker-row:hover {
    background: rgba(0, 217, 255, 0.1);
  }

  .workers-table td {
    padding: 10px 8px;
    font-size: 0.85rem;
  }

  .worker-name {
    color: #00d7ef;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .worker-icon {
    font-size: 0.9rem;
  }

  .worker-status {
    padding: 4px 0;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  .status-dot-small {
    width: 6px;
    height: 6px;
    border-radius: 0px !important;
    display: inline-block;
  }

  .metric {
    color: #94aec4;
    font-weight: 500;
    text-align: center;
  }

  .timestamp {
    color: #6b7280;
    font-size: 0.75rem;
    font-family: monospace;
  }

  .no-data {
    text-align: center;
    padding: 40px;
    color: #6b7280;
    font-style: italic;
  }

  .main-actions {
    display: flex;
    gap: 12px;
    flex-direction: column;
  }

  .main-action-btn {
    background: #164e63;
    color: #00d7ef;
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
    padding: 14px 20px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    width: 100%;
  }

  .main-action-btn:hover:not(:disabled) {
    background: #1be1ff;
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 217, 255, 0.3);
  }

  .main-action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .check-all {
    background: #0f5132;
  }

  .check-all:hover:not(:disabled) {
    background: #00ff88;
  }

  .monitor {
    background: #7c2d12;
  }

  .monitor:hover:not(:disabled) {
    background: #ff6b35;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .workers-table {
      font-size: 0.75rem;
    }
    
    .workers-table th,
    .workers-table td {
      padding: 6px 4px;
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .action-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
