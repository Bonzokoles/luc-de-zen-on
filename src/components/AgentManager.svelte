<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Agent {
    id: string;
    name: string;
    model: string;
    description: string;
    category?: string;
    specializations?: string[];
    systemPrompt?: string;
    config: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
      frequencyPenalty?: number;
      presencePenalty?: number;
      enabledFeatures?: string[];
      customInstructions?: string;
      port?: number;
      language?: string;
      capabilities?: string[];
    };
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    isDefault?: boolean;
    authorInfo?: {
      creator: string;
      version: string;
      lastModified: string;
    };
  }

  let agents: Agent[] = [];
  let categorizedAgents: Record<string, Agent[]> = {};
  let selectedAgent: Agent | null = null;
  let showCreateForm = false;
  let showEditForm = false;
  let loading = false;
  let error = '';
  let success = '';
  let activeCategory = 'All';

  // Form data
  let formData = {
    name: '',
    model: 'gpt-4',
    description: '',
    category: 'Custom',
    specializations: '',
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 1000,
    language: 'javascript',
    customInstructions: '',
    enabledFeatures: ''
  };

  const categories = [
    'All', 'System Monitoring', 'Art Analysis', 'File Discovery', 
    'Interface Management', 'Search & Discovery', 'Media API', 
    'Intelligent Search', 'Translation & Localization', 'Custom'
  ];

  const availableModels = [
    'gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet', 'claude-3-haiku', 
    '@cf/meta/llama-2-7b-chat-int8', '@cf/mistral/mistral-7b-instruct-v0.1'
  ];

  onMount(async () => {
    await loadAgents();
    await initializeZenonAgents();
  });

  async function initializeZenonAgents() {
    try {
      const response = await fetch('/api/agents/initialize');
      if (response.ok) {
        const result = await response.json();
        console.log('ZENON agents initialized:', result.message);
        await loadAgents();
      }
    } catch (err) {
      console.error('Failed to initialize ZENON agents:', err);
    }
  }

  async function loadAgents() {
    loading = true;
    try {
      const response = await fetch('/api/agents');
      if (response.ok) {
        const data = await response.json();
        agents = data.agents || [];
        categorizedAgents = data.categorized || {};
        error = '';
      } else {
        throw new Error('Failed to load agents');
      }
    } catch (err) {
      error = 'Błąd podczas ładowania agentów: ' + (err as Error).message;
    } finally {
      loading = false;
    }
  }

  async function createAgent() {
    loading = true;
    try {
      const agentData = {
        ...formData,
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s),
        config: {
          temperature: formData.temperature,
          maxTokens: formData.maxTokens,
          language: formData.language,
          customInstructions: formData.customInstructions,
          enabledFeatures: formData.enabledFeatures.split(',').map(s => s.trim()).filter(s => s)
        }
      };

      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentData)
      });

      if (response.ok) {
        success = 'Agent został utworzony pomyślnie!';
        showCreateForm = false;
        resetForm();
        await loadAgents();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create agent');
      }
    } catch (err) {
      error = 'Błąd podczas tworzenia agenta: ' + (err as Error).message;
    } finally {
      loading = false;
    }
  }

  async function updateAgent() {
    if (!selectedAgent) return;
    
    loading = true;
    try {
      const agentData = {
        ...formData,
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s),
        config: {
          ...selectedAgent.config,
          temperature: formData.temperature,
          maxTokens: formData.maxTokens,
          language: formData.language,
          customInstructions: formData.customInstructions,
          enabledFeatures: formData.enabledFeatures.split(',').map(s => s.trim()).filter(s => s)
        }
      };

      const response = await fetch(`/api/agents/${selectedAgent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentData)
      });

      if (response.ok) {
        success = 'Agent został zaktualizowany pomyślnie!';
        showEditForm = false;
        selectedAgent = null;
        resetForm();
        await loadAgents();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update agent');
      }
    } catch (err) {
      error = 'Błąd podczas aktualizacji agenta: ' + (err as Error).message;
    } finally {
      loading = false;
    }
  }

  async function deleteAgent(agent: Agent) {
    if (!confirm(`Czy na pewno chcesz usunąć agenta "${agent.name}"?`)) return;
    
    loading = true;
    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        success = 'Agent został usunięty pomyślnie!';
        await loadAgents();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete agent');
      }
    } catch (err) {
      error = 'Błąd podczas usuwania agenta: ' + (err as Error).message;
    } finally {
      loading = false;
    }
  }

  function editAgent(agent: Agent) {
    selectedAgent = agent;
    formData = {
      name: agent.name,
      model: agent.model,
      description: agent.description,
      category: agent.category || 'Custom',
      specializations: agent.specializations?.join(', ') || '',
      systemPrompt: agent.systemPrompt || '',
      temperature: agent.config.temperature || 0.7,
      maxTokens: agent.config.maxTokens || 1000,
      language: agent.config.language || 'javascript',
      customInstructions: agent.config.customInstructions || '',
      enabledFeatures: agent.config.enabledFeatures?.join(', ') || ''
    };
    showEditForm = true;
  }

  function resetForm() {
    formData = {
      name: '',
      model: 'gpt-4',
      description: '',
      category: 'Custom',
      specializations: '',
      systemPrompt: '',
      temperature: 0.7,
      maxTokens: 1000,
      language: 'javascript',
      customInstructions: '',
      enabledFeatures: ''
    };
  }

  function getFilteredAgents() {
    if (activeCategory === 'All') return agents;
    return agents.filter(agent => agent.category === activeCategory);
  }

  function clearMessages() {
    error = '';
    success = '';
  }
</script>

<div class="agent-manager">
  <div class="header">
    <h2> ZARZĄDZANIE AGENTAMI AI</h2>
    <button 
      class="btn-primary" 
      on:click={() => { clearMessages(); showCreateForm = true; }}
      disabled={loading}
    >
       DODAJ NOWEGO AGENTA
    </button>
  </div>

  {#if error}
    <div class="alert alert-error">
       {error}
      <button on:click={clearMessages}>&times;</button>
    </div>
  {/if}

  {#if success}
    <div class="alert alert-success">
       {success}
      <button on:click={clearMessages}>&times;</button>
    </div>
  {/if}

  <!-- Category Filter -->
  <div class="category-filter">
    {#each categories as category}
      <button 
        class="category-btn {activeCategory === category ? 'active' : ''}"
        on:click={() => activeCategory = category}
      >
        {category}
        {#if category !== 'All'}
          <span class="count">({categorizedAgents[category]?.length || 0})</span>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Agent Grid -->
  <div class="agents-grid">
    {#each getFilteredAgents() as agent (agent.id)}
      <div class="agent-card {agent.isDefault ? 'default-agent' : ''} {!agent.isActive ? 'inactive' : ''}">
        <div class="agent-header">
          <h3> {agent.name}</h3>
          <div class="agent-badges">
            {#if agent.isDefault}
              <span class="badge badge-default"> ZENON</span>
            {/if}
            <span class="badge badge-model"> {agent.model}</span>
            <span class="badge badge-category"> {agent.category || 'Other'}</span>
          </div>
        </div>

        <p class="agent-description">{agent.description}</p>

        {#if agent.specializations && agent.specializations.length > 0}
          <div class="specializations">
            <strong> Specjalizacje:</strong>
            <ul>
              {#each agent.specializations.slice(0, 3) as spec}
                <li> {spec}</li>
              {/each}
              {#if agent.specializations.length > 3}
                <li class="more">+{agent.specializations.length - 3} więcej...</li>
              {/if}
            </ul>
          </div>
        {/if}

        {#if agent.config.capabilities && agent.config.capabilities.length > 0}
          <div class="capabilities">
            {#each agent.config.capabilities.slice(0, 4) as capability}
              <span class="capability-tag"> {capability}</span>
            {/each}
          </div>
        {/if}

        <div class="agent-meta">
          <small>
             Utworzony: {new Date(agent.createdAt).toLocaleDateString('pl-PL')}
            {#if agent.authorInfo}
              |  Autor: {agent.authorInfo.creator}
            {/if}
          </small>
        </div>

        <div class="agent-actions">
          <button 
            class="btn-secondary" 
            on:click={() => editAgent(agent)}
            disabled={loading}
          >
             EDYTUJ
          </button>
          
          {#if !agent.isDefault}
            <button 
              class="btn-danger" 
              on:click={() => deleteAgent(agent)}
              disabled={loading}
            >
               USUŃ
            </button>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p> ŁADOWANIE...</p>
    </div>
  {/if}

  <!-- Create Agent Modal -->
  {#if showCreateForm}
    <div class="modal-overlay" on:click={() => showCreateForm = false}>
      <div class="modal" on:click|stopPropagation>
        <div class="modal-header">
          <h3> UTWÓRZ NOWEGO AGENTA</h3>
          <button on:click={() => showCreateForm = false}>&times;</button>
        </div>
        
        <form on:submit|preventDefault={createAgent}>
          <div class="form-grid">
            <div class="form-group">
              <label for="name"> Nazwa Agenta *</label>
              <input 
                type="text" 
                id="name"
                bind:value={formData.name} 
                required 
                placeholder="np. Asystent Marketingu"
              />
            </div>

            <div class="form-group">
              <label for="model"> Model AI *</label>
              <select id="model" bind:value={formData.model} required>
                {#each availableModels as model}
                  <option value={model}>{model}</option>
                {/each}
              </select>
            </div>

            <div class="form-group">
              <label for="category"> Kategoria</label>
              <select id="category" bind:value={formData.category}>
                {#each categories.slice(1) as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>

            <div class="form-group">
              <label for="language"> Język Programowania</label>
              <select id="language" bind:value={formData.language}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="description"> Opis *</label>
            <textarea 
              id="description"
              bind:value={formData.description} 
              required 
              placeholder="Opisz funkcjonalność i zastosowanie tego agenta..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="specializations"> Specjalizacje (oddzielone przecinkami)</label>
            <input 
              type="text" 
              id="specializations"
              bind:value={formData.specializations}
              placeholder="np. analiza danych, machine learning, NLP"
            />
          </div>

          <div class="form-group">
            <label for="systemPrompt"> Prompt Systemowy</label>
            <textarea 
              id="systemPrompt"
              bind:value={formData.systemPrompt}
              placeholder="Instrukcje systemowe dla tego agenta..."
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="customInstructions"> Dodatkowe Instrukcje</label>
            <textarea 
              id="customInstructions"
              bind:value={formData.customInstructions}
              placeholder="Specjalne instrukcje lub ograniczenia..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="temperature"> Temperature (0-2)</label>
              <input 
                type="number" 
                id="temperature"
                bind:value={formData.temperature}
                min="0" 
                max="2" 
                step="0.1"
              />
            </div>

            <div class="form-group">
              <label for="maxTokens"> Max Tokens</label>
              <input 
                type="number" 
                id="maxTokens"
                bind:value={formData.maxTokens}
                min="100" 
                max="4000" 
                step="100"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="enabledFeatures"> Włączone Funkcje (oddzielone przecinkami)</label>
            <input 
              type="text" 
              id="enabledFeatures"
              bind:value={formData.enabledFeatures}
              placeholder="np. web_search, file_upload, image_analysis"
            />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" on:click={() => showCreateForm = false}>
               ANULUJ
            </button>
            <button type="submit" class="btn-primary" disabled={loading}>
              {loading ? ' TWORZENIE...' : ' UTWÓRZ AGENTA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Edit Agent Modal -->
  {#if showEditForm && selectedAgent}
    <div class="modal-overlay" on:click={() => showEditForm = false}>
      <div class="modal" on:click|stopPropagation>
        <div class="modal-header">
          <h3> EDYTUJ AGENTA: {selectedAgent.name}</h3>
          <button on:click={() => showEditForm = false}>&times;</button>
        </div>
        
        <form on:submit|preventDefault={updateAgent}>
          <div class="form-grid">
            <div class="form-group">
              <label for="edit-name"> Nazwa Agenta *</label>
              <input 
                type="text" 
                id="edit-name"
                bind:value={formData.name} 
                required 
                disabled={selectedAgent.isDefault}
              />
            </div>

            <div class="form-group">
              <label for="edit-model"> Model AI *</label>
              <select id="edit-model" bind:value={formData.model} required>
                {#each availableModels as model}
                  <option value={model}>{model}</option>
                {/each}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="edit-description"> Opis *</label>
            <textarea 
              id="edit-description"
              bind:value={formData.description} 
              required 
              rows="3"
              disabled={selectedAgent.isDefault}
            ></textarea>
          </div>

          <div class="form-group">
            <label for="edit-systemPrompt"> Prompt Systemowy</label>
            <textarea 
              id="edit-systemPrompt"
              bind:value={formData.systemPrompt}
              rows="4"
            ></textarea>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="edit-temperature"> Temperature (0-2)</label>
              <input 
                type="number" 
                id="edit-temperature"
                bind:value={formData.temperature}
                min="0" 
                max="2" 
                step="0.1"
              />
            </div>

            <div class="form-group">
              <label for="edit-maxTokens"> Max Tokens</label>
              <input 
                type="number" 
                id="edit-maxTokens"
                bind:value={formData.maxTokens}
                min="100" 
                max="4000" 
                step="100"
              />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" on:click={() => showEditForm = false">
               ANULUJ
            </button>
            <button type="submit" class="btn-primary" disabled={loading}>
              {loading ? ' ZAPISYWANIE...' : ' ZAPISZ ZMIANY'}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>

<style>
  .agent-manager {
    padding: 25px;
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'Rajdhani', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #e0e7ff;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
    min-height: 100vh;
    position: relative;
  }

  .agent-manager::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(0, 191, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 0, 128, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    padding: 25px 30px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 1px solid #00bfff;
    box-shadow: 0 0 30px rgba(0, 191, 255, 0.3);
    position: relative;
    z-index: 1;
  }

  .header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(0, 191, 255, 0.1), transparent);
    animation: pulse 3s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }

  .header h2 {
    margin: 0;
    color: #00bfff;
    font-family: 'Rajdhani', sans-serif;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 900;
    font-size: 2.2rem;
    text-shadow: 0 0 20px rgba(0, 191, 255, 0.8);
    position: relative;
    z-index: 2;
  }

  .alert {
    padding: 15px 20px;
    margin-bottom: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    font-family: 'Rajdhani', sans-serif;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    font-size: 14px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }

  .alert-error {
    background: linear-gradient(135deg, #2d1b2e 0%, #4a1a2e 100%);
    color: #ff6b9d;
    border-color: #ff6b9d;
    box-shadow: 0 0 25px rgba(255, 107, 157, 0.3);
  }

  .alert-success {
    background: linear-gradient(135deg, #1b2d1b 0%, #1a4a2e 100%);
    color: #4ade80;
    border-color: #4ade80;
    box-shadow: 0 0 25px rgba(74, 222, 128, 0.3);
  }

  .alert button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    margin-left: 15px;
    color: inherit;
    transition: transform 0.2s;
  }

  .alert button:hover {
    transform: scale(1.2);
  }

  .category-filter {
    display: flex;
    gap: 12px;
    margin-bottom: 35px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .category-btn {
    padding: 12px 24px;
    border: 1px solid #00bfff;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #e0e7ff;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 12px;
    font-family: 'Rajdhani', sans-serif;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
  }

  .category-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 191, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  .category-btn:hover::before {
    left: 100%;
  }

  .category-btn:hover {
    border-color: #ff6b9d;
    color: #ff6b9d;
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(255, 107, 157, 0.4);
  }

  .category-btn.active {
    background: linear-gradient(135deg, #00bfff 0%, #0080ff 100%);
    color: #0f0f0f;
    border-color: #00bfff;
    box-shadow: 0 0 25px rgba(0, 191, 255, 0.6);
  }

  .count {
    font-size: 10px;
    opacity: 0.8;
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 6px;
    border-radius: 10px;
  }

  .agents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: 25px;
    margin-bottom: 35px;
  }

  .agent-card {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 1px solid #333;
    padding: 25px;
    transition: all 0.4s;
    position: relative;
    overflow: hidden;
  }

  .agent-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 191, 255, 0.05) 0%, transparent 50%, rgba(255, 107, 157, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .agent-card:hover::before {
    opacity: 1;
  }

  .agent-card:hover {
    border-color: #00bfff;
    transform: translateY(-5px) scale(1.02);
    box-shadow: 
      0 10px 40px rgba(0, 191, 255, 0.3),
      0 0 0 1px rgba(0, 191, 255, 0.5);
  }

  .agent-card.default-agent {
    border-color: #4ade80;
    background: linear-gradient(135deg, #1b2d1b 0%, #1a4a2e 100%);
  }

  .agent-card.default-agent:hover {
    border-color: #4ade80;
    box-shadow: 
      0 10px 40px rgba(74, 222, 128, 0.3),
      0 0 0 1px rgba(74, 222, 128, 0.5);
  }

  .agent-card.inactive {
    opacity: 0.5;
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  }

  .agent-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
  }

  .agent-header h3 {
    margin: 0;
    font-size: 20px;
    color: #e0e7ff;
    flex: 1;
    margin-right: 15px;
    font-family: 'Rajdhani', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 800;
    text-shadow: 0 0 10px rgba(224, 231, 255, 0.5);
  }

  .agent-badges {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
  }

  .badge {
    padding: 6px 12px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Rajdhani', sans-serif;
    border: 1px solid;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%);
    backdrop-filter: blur(10px);
  }

  .badge-default {
    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
    color: #0f0f0f;
    border-color: #4ade80;
    box-shadow: 0 0 15px rgba(74, 222, 128, 0.4);
  }

  .badge-model {
    background: linear-gradient(135deg, #00bfff 0%, #0080ff 100%);
    color: #0f0f0f;
    border-color: #00bfff;
    box-shadow: 0 0 15px rgba(0, 191, 255, 0.4);
  }

  .badge-category {
    background: linear-gradient(135deg, #ff6b9d 0%, #c084fc 100%);
    color: #0f0f0f;
    border-color: #ff6b9d;
    box-shadow: 0 0 15px rgba(255, 107, 157, 0.4);
  }

  .agent-description {
    color: #a0a9c0;
    margin-bottom: 20px;
    line-height: 1.6;
    font-size: 14px;
    font-family: 'Rajdhani', sans-serif;
    position: relative;
    z-index: 2;
  }

  .specializations {
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
  }

  .specializations strong {
    font-size: 13px;
    color: #00bfff;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 800;
  }

  .specializations ul {
    margin: 8px 0 0 0;
    padding-left: 0;
    list-style: none;
  }

  .specializations li {
    font-size: 12px;
    color: #a0a9c0;
    margin-bottom: 4px;
    position: relative;
    font-family: 'Rajdhani', sans-serif;
    padding-left: 20px;
  }

  .specializations li.more {
    font-style: italic;
    color: #6b7280;
  }

  .capabilities {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
  }

  .capability-tag {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #00bfff;
    border: 1px solid #333;
    padding: 6px 12px;
    font-size: 10px;
    font-weight: 600;
    font-family: 'Rajdhani', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s;
  }

  .capability-tag:hover {
    border-color: #00bfff;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
  }

  .agent-meta {
    margin-bottom: 20px;
    padding-top: 15px;
    border-top: 1px solid #333;
    position: relative;
    z-index: 2;
  }

  .agent-meta small {
    color: #6b7280;
    font-size: 11px;
    font-family: 'Rajdhani', sans-serif;
  }

  .agent-actions {
    display: flex;
    gap: 12px;
    position: relative;
    z-index: 2;
  }

  .btn-primary, .btn-secondary, .btn-danger {
    padding: 12px 20px;
    border: 1px solid;
    cursor: pointer;
    font-size: 11px;
    font-weight: 700;
    transition: all 0.3s;
    flex: 1;
    font-family: 'Rajdhani', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    position: relative;
    overflow: hidden;
  }

  .btn-primary::before,
  .btn-secondary::before,
  .btn-danger::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .btn-primary:hover::before,
  .btn-secondary:hover::before,
  .btn-danger:hover::before {
    left: 100%;
  }

  .btn-primary {
    background: linear-gradient(135deg, #00bfff 0%, #0080ff 100%);
    color: #0f0f0f;
    border-color: #00bfff;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 191, 255, 0.4);
  }

  .btn-secondary {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #e0e7ff;
    border-color: #333;
  }

  .btn-secondary:hover:not(:disabled) {
    background: linear-gradient(135deg, #ff6b9d 0%, #c084fc 100%);
    border-color: #ff6b9d;
    color: #0f0f0f;
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(255, 107, 157, 0.4);
  }

  .btn-danger {
    background: linear-gradient(135deg, #2d1b2e 0%, #4a1a2e 100%);
    color: #ff6b9d;
    border-color: #ff6b9d;
  }

  .btn-danger:hover:not(:disabled) {
    background: linear-gradient(135deg, #ff6b9d 0%, #ff1744 100%);
    color: #0f0f0f;
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(255, 107, 157, 0.4);
  }

  .btn-primary:disabled, .btn-secondary:disabled, .btn-danger:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }

  .loading {
    text-align: center;
    padding: 50px;
    color: #00bfff;
    font-family: 'Rajdhani', sans-serif;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 800;
    font-size: 16px;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #333;
    border-top: 4px solid #00bfff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
    box-shadow: 0 0 20px rgba(0, 191, 255, 0.5);
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 25px;
    backdrop-filter: blur(10px);
  }

  .modal {
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    border: 1px solid #00bfff;
    width: 100%;
    max-width: 850px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 0 50px rgba(0, 191, 255, 0.3);
    position: relative;
  }

  .modal::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(0, 191, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 107, 157, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 35px;
    border-bottom: 1px solid #333;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    position: relative;
    z-index: 2;
  }

  .modal-header h3 {
    margin: 0;
    color: #00bfff;
    font-family: 'Rajdhani', sans-serif;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1.3rem;
    font-weight: 800;
    text-shadow: 0 0 15px rgba(0, 191, 255, 0.6);
  }

  .modal-header button {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #6b7280;
    padding: 0;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }

  .modal-header button:hover {
    color: #ff6b9d;
    transform: scale(1.2);
  }

  .modal form {
    padding: 35px;
    position: relative;
    z-index: 2;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    margin-bottom: 25px;
  }

  .form-group {
    margin-bottom: 25px;
  }

  .form-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: 700;
    color: #00bfff;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Rajdhani', sans-serif;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 14px 18px;
    border: 1px solid #333;
    font-size: 14px;
    transition: all 0.3s;
    box-sizing: border-box;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #e0e7ff;
    font-family: 'Rajdhani', sans-serif;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #00bfff;
    box-shadow: 0 0 15px rgba(0, 191, 255, 0.4);
    background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
  }

  .form-group input:disabled,
  .form-group textarea:disabled {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    color: #6b7280;
    opacity: 0.5;
  }

  .modal-actions {
    display: flex;
    gap: 20px;
    justify-content: flex-end;
    margin-top: 35px;
    padding-top: 25px;
    border-top: 1px solid #333;
  }

  .modal-actions button {
    min-width: 160px;
    padding: 14px 25px;
  }

  @media (max-width: 768px) {
    .agents-grid {
      grid-template-columns: 1fr;
    }
    
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .header {
      flex-direction: column;
      gap: 20px;
      align-items: stretch;
    }
    
    .category-filter {
      justify-content: center;
    }

    .header h2 {
      font-size: 1.8rem;
    }

    .agent-manager {
      padding: 15px;
    }
  }
</style>
