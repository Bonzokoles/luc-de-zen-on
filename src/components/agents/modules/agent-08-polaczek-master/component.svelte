<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Agent {
    id: string;
    name: string;
    role: string;
    description: string;
    status: string;
    capabilities: string[];
    model: string;
    performance?: {
      successRate: number;
      avgResponseTime: number;
      totalTasks: number;
    };
  }

  interface SystemStatus {
    status: string;
    agents: Agent[];
    models: Record<string, string>;
    performance: {
      totalAgents: number;
      activeAgents: number;
    };
  }

  // Component state
  let systemStatus: SystemStatus | null = null;
  let isLoading = false;
  let error = '';
  let taskInput = '';
  let selectedAgent = '';
  let priority = 'normal';
  let result = '';
  let isExecuting = false;

  // Load system status on mount
  onMount(async () => {
    await loadSystemStatus();
  });

  async function loadSystemStatus() {
    isLoading = true;
    error = '';
    
    try {
      const response = await fetch('/api/polaczek/orchestrate?action=status');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      systemStatus = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Błąd ładowania statusu';
      console.error('Status loading error:', err);
    } finally {
      isLoading = false;
    }
  }

  async function executeTask() {
    if (!taskInput.trim()) {
      error = 'Wprowadź zadanie do wykonania';
      return;
    }

    isExecuting = true;
    error = '';
    result = '';

    try {
      const requestBody = {
        task: taskInput,
        preferredAgent: selectedAgent || undefined,
        priority: priority as 'low' | 'normal' | 'high' | 'urgent',
        language: 'pl' as const,
        context: {
          timestamp: new Date().toISOString(),
          source: 'polaczek-master-ui'
        }
      };

      const response = await fetch('/api/polaczek/orchestrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const orchestrationResult = await response.json();

      if (orchestrationResult.success) {
        result = `✅ Wykonano przez ${orchestrationResult.agent}\n\n${orchestrationResult.result}`;
        taskInput = ''; // Clear input on success
        await loadSystemStatus(); // Refresh status
      } else {
        error = `❌ Błąd: ${orchestrationResult.error}`;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Błąd wykonania zadania';
      console.error('Task execution error:', err);
    } finally {
      isExecuting = false;
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#4ade80';
      case 'busy': return '#fbbf24';
      case 'inactive': return '#6b7280';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  }

  function formatResponseTime(ms: number): string {
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  }
</script>

<div class="polaczek-master">
  <!-- System Status Overview -->
  <div class="status-overview">
    <h2>🎯 Status Systemu</h2>
    {#if isLoading}
      <div class="loading">Ładowanie statusu...</div>
    {:else if error && !systemStatus}
      <div class="error">
        ❌ {error}
        <button on:click={loadSystemStatus} class="retry-btn">Spróbuj ponownie</button>
      </div>
    {:else if systemStatus}
      <div class="system-stats">
        <div class="stat-card">
          <h3>Agenci</h3>
          <div class="stat-value">{systemStatus.performance.activeAgents}/{systemStatus.performance.totalAgents}</div>
          <div class="stat-label">Aktywni</div>
        </div>
        <div class="stat-card">
          <h3>Status</h3>
          <div class="stat-value status-{systemStatus.status}">{systemStatus.status}</div>
          <div class="stat-label">System</div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Task Execution Panel -->
  <div class="task-panel">
    <h2>🚀 Wykonaj Zadanie</h2>
    
    <div class="task-form">
      <div class="form-group">
        <label for="task-input">Zadanie:</label>
        <textarea
          id="task-input"
          bind:value={taskInput}
          placeholder="Opisz zadanie które chcesz wykonać np. 'Przetłumacz ten tekst na polski', 'Znajdź informacje o...'"
          rows="3"
          disabled={isExecuting}
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="agent-select">Preferowany Agent:</label>
          <select id="agent-select" bind:value={selectedAgent} disabled={isExecuting}>
            <option value="">Automatyczny wybór</option>
            {#if systemStatus?.agents}
              {#each systemStatus.agents as agent}
                <option value={agent.id}>{agent.name} ({agent.role})</option>
              {/each}
            {/if}
          </select>
        </div>

        <div class="form-group">
          <label for="priority-select">Priorytet:</label>
          <select id="priority-select" bind:value={priority} disabled={isExecuting}>
            <option value="low">Niski</option>
            <option value="normal">Normalny</option>
            <option value="high">Wysoki</option>
            <option value="urgent">Pilny</option>
          </select>
        </div>
      </div>

      <button 
        on:click={executeTask}
        disabled={isExecuting || !taskInput.trim()}
        class="execute-btn"
      >
        {isExecuting ? '⏳ Wykonywanie...' : '🚀 Wykonaj Zadanie'}
      </button>
    </div>

    <!-- Results Display -->
    {#if error}
      <div class="error-result">
        {error}
      </div>
    {/if}

    {#if result}
      <div class="task-result">
        <h3>📋 Wynik:</h3>
        <pre>{result}</pre>
      </div>
    {/if}
  </div>

  <!-- Agents Status -->
  {#if systemStatus?.agents}
    <div class="agents-status">
      <h2>🤖 Status Agentów</h2>
      <div class="agents-grid">
        {#each systemStatus.agents as agent}
          <div class="agent-status-card">
            <div class="agent-header">
              <h3>{agent.name}</h3>
              <div 
                class="status-dot"
                style="background-color: {getStatusColor(agent.status)}"
                title={agent.status}
              ></div>
            </div>
            
            <div class="agent-info">
              <p><strong>Rola:</strong> {agent.role}</p>
              <p><strong>Model:</strong> {agent.model}</p>
              <p><strong>Umiejętności:</strong> {agent.capabilities.join(', ')}</p>
            </div>

            {#if agent.performance}
              <div class="agent-metrics">
                <div class="metric">
                  <span class="metric-label">Sukces:</span>
                  <span class="metric-value">{agent.performance.successRate.toFixed(1)}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Czas:</span>
                  <span class="metric-value">{formatResponseTime(agent.performance.avgResponseTime)}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Zadania:</span>
                  <span class="metric-value">{agent.performance.totalTasks}</span>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .polaczek-master {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    font-family: 'Inter', sans-serif;
  }

  .status-overview {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .status-overview h2 {
    margin: 0 0 1rem 0;
    color: #dc143c;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }

  .error {
    background: #fee2e2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .retry-btn {
    background: #dc2626;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .system-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #e2e8f0;
  }

  .stat-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    text-transform: uppercase;
    color: #6b7280;
    font-weight: 600;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin: 0.5rem 0;
    color: #1e293b;
  }

  .stat-value.status-operational {
    color: #4ade80;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
  }

  .task-panel {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .task-panel h2 {
    margin: 0 0 1.5rem 0;
    color: #dc143c;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
  }

  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .form-group textarea:focus,
  .form-group select:focus {
    outline: none;
    border-color: #dc143c;
    box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.1);
  }

  .form-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
  }

  .execute-btn {
    background: linear-gradient(135deg, #dc143c, #ff6b6b);
    color: white;
    border: none;
    padding: 0.875rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    margin-top: 1rem;
  }

  .execute-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3);
  }

  .execute-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .error-result {
    background: #fee2e2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
    border-left: 4px solid #dc2626;
  }

  .task-result {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
  }

  .task-result h3 {
    margin: 0 0 0.5rem 0;
    color: #15803d;
  }

  .task-result pre {
    background: white;
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Courier New', monospace;
    margin: 0;
    line-height: 1.5;
  }

  .agents-status {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .agents-status h2 {
    margin: 0 0 1.5rem 0;
    color: #dc143c;
  }

  .agents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .agent-status-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s ease;
  }

  .agent-status-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .agent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .agent-header h3 {
    margin: 0;
    color: #1e293b;
    font-size: 1.1rem;
  }

  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .agent-info p {
    margin: 0.25rem 0;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .agent-info strong {
    color: #374151;
  }

  .agent-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  }

  .metric {
    text-align: center;
  }

  .metric-label {
    display: block;
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 600;
  }

  .metric-value {
    display: block;
    font-size: 1rem;
    color: #1e293b;
    font-weight: 700;
    margin-top: 0.25rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .system-stats {
      grid-template-columns: 1fr 1fr;
    }

    .agents-grid {
      grid-template-columns: 1fr;
    }

    .agent-metrics {
      grid-template-columns: 1fr;
    }
  }
</style>