<script lang="ts">
  import { onMount } from 'svelte';
  
  let agent: any = {};

  onMount(() => {
    // Get agent data from data attribute
    const container = document.getElementById('agent-details-container');
    if (container) {
      const agentDataStr = container.getAttribute('data-agent');
      if (agentDataStr) {
        try {
          agent = JSON.parse(agentDataStr);
        } catch (error) {
          console.error('Error parsing agent data:', error);
        }
      }
    }
  });

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'testing':
        return 'status-testing';
      default:
        return 'status-inactive';
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'Aktywny';
      case 'inactive':
        return 'Nieaktywny';
      case 'testing':
        return 'Testowanie';
      default:
        return 'Nieznany';
    }
  }

  const toolNames: Record<string, string> = {
    'web-search': 'Wyszukiwanie w sieci',
    'image-generation': 'Generowanie obrazów',
    'code-execution': 'Wykonywanie kodu',
    'file-management': 'Zarządzanie plikami',
    'email-sender': 'Wysyłanie email',
    'calendar-api': 'API kalendarza',
    'cloudflare-api': 'Cloudflare API',
    'database-query': 'Zapytania do bazy'
  };

  const modelNames: Record<string, string> = {
    'gpt-4o': 'GPT-4 Optimized',
    'gpt-4': 'GPT-4',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo',
    'claude-3-sonnet': 'Claude 3 Sonnet',
    'llama-3.1-8b': 'Llama 3.1 8B'
  };
</script>

<div class="agent-details">
  <!-- Header Section -->
  <div class="detail-section">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-3xl font-bold text-cyan-400">{agent.name}</h2>
      <div class="flex items-center space-x-3">
        <span class="status-badge {getStatusClass(agent.status)}">
          {getStatusText(agent.status)}
        </span>
        {#if agent.isRunning}
          <span class="running-indicator">
            <span class="pulse-dot"></span>
            Uruchomiony
          </span>
        {/if}
      </div>
    </div>
    
    <p class="text-lg text-gray-300 leading-relaxed">{agent.description}</p>
  </div>

  <!-- Basic Information -->
  <div class="detail-section">
    <h3 class="section-title">Informacje podstawowe</h3>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">ID agenta:</span>
        <span class="info-value">{agent.id}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Model AI:</span>
        <span class="info-value">{modelNames[agent.model] || agent.model}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Utworzono:</span>
        <span class="info-value">{formatDate(agent.createdAt)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Ostatnia aktualizacja:</span>
        <span class="info-value">{formatDate(agent.updatedAt)}</span>
      </div>
    </div>
  </div>

  <!-- Configuration -->
  <div class="detail-section">
    <h3 class="section-title">Konfiguracja</h3>
    <div class="config-grid">
      <div class="config-item">
        <span class="config-label">Max tokeny:</span>
        <span class="config-value">{agent.maxTokens || 'Domyślne'}</span>
      </div>
      <div class="config-item">
        <span class="config-label">Temperatura:</span>
        <span class="config-value">{agent.temperature || 'Domyślna'}</span>
      </div>
    </div>
  </div>

  <!-- Tools -->
  {#if agent.tools && agent.tools.length > 0}
    <div class="detail-section">
      <h3 class="section-title">Dostępne narzędzia</h3>
      <div class="tools-grid">
        {#each agent.tools as tool}
          <div class="tool-card">
            <span class="tool-name">{toolNames[tool] || tool}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Permanent Tasks -->
  {#if agent.permanentTasks && agent.permanentTasks.length > 0}
    <div class="detail-section">
      <h3 class="section-title">Stałe zadania</h3>
      <ul class="tasks-list">
        {#each agent.permanentTasks as task}
          <li class="task-item">{task}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- System Prompt -->
  {#if agent.systemPrompt}
    <div class="detail-section">
      <h3 class="section-title">System Prompt</h3>
      <div class="prompt-display">
        <pre class="prompt-text">{agent.systemPrompt}</pre>
      </div>
    </div>
  {/if}
</div>

<style>
  .agent-details {
    max-width: 800px;
    margin: 0 auto;
  }

  .detail-section {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 217, 255, 0.3);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .section-title {
    color: #00d9ff;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Rajdhani', sans-serif;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.875rem;
    letter-spacing: 1px;
  }

  .status-active {
    background: rgba(0, 255, 136, 0.2);
    color: #00ff88;
    border: 1px solid #00ff88;
  }

  .status-inactive {
    background: rgba(255, 68, 68, 0.2);
    color: #ff4444;
    border: 1px solid #ff4444;
  }

  .status-testing {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border: 1px solid #ffc107;
  }

  .running-indicator {
    display: flex;
    align-items: center;
    color: #00ff88;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    background: #00ff88;
    border-radius: 50%;
    margin-right: 0.5rem;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-label {
    color: #888;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .info-value {
    color: #fff;
    font-weight: 600;
  }

  .config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .config-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(0, 217, 255, 0.05);
    border: 1px solid rgba(0, 217, 255, 0.2);
  }

  .config-label {
    color: #888;
    font-size: 0.875rem;
  }

  .config-value {
    color: #00d9ff;
    font-weight: 600;
  }

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .tool-card {
    background: rgba(0, 217, 255, 0.1);
    border: 1px solid rgba(0, 217, 255, 0.3);
    padding: 1rem;
    text-align: center;
  }

  .tool-name {
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .tasks-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .task-item {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #444;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    color: #fff;
    border-left: 3px solid #00d9ff;
  }

  .prompt-display {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #444;
    padding: 1rem;
    overflow-x: auto;
  }

  .prompt-text {
    color: #fff;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: pre-wrap;
    margin: 0;
  }
</style>
