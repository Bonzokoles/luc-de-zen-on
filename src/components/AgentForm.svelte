<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  interface Tool {
    id: string;
    name: string;
    description: string;
  }

  interface Agent {
    id: string;
    name: string;
    description: string;
    model: string;
    tools: string[];
    status: string;
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
  }

  let formData: Partial<Agent> = {
    name: '',
    description: '',
    model: 'gpt-4o',
    tools: [],
    status: 'inactive',
    systemPrompt: '',
    maxTokens: 1000,
    temperature: 0.7
  };

  let isSubmitting = false;
  let submitMessage = '';

  const availableModels = [
    { id: 'gpt-4o', name: 'GPT-4 Optimized' },
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
    { id: 'llama-3.1-8b', name: 'Llama 3.1 8B' }
  ];

  const availableTools: Tool[] = [
    { id: 'web-search', name: 'Wyszukiwanie w sieci', description: 'Dostęp do wyszukiwania internetowego' },
    { id: 'image-generation', name: 'Generowanie obrazów', description: 'Tworzenie grafik z AI' },
    { id: 'code-execution', name: 'Wykonywanie kodu', description: 'Uruchamianie skryptów Python/JS' },
    { id: 'file-management', name: 'Zarządzanie plikami', description: 'Operacje na plikach' },
    { id: 'email-sender', name: 'Wysyłanie email', description: 'Automatyczne wysyłanie wiadomości' },
    { id: 'calendar-api', name: 'API kalendarza', description: 'Zarządzanie terminami' },
    { id: 'cloudflare-api', name: 'Cloudflare API', description: 'Zarządzanie infrastrukturą CF' },
    { id: 'database-query', name: 'Zapytania do bazy', description: 'Dostęp do bazy danych' }
  ];

  function toggleTool(toolId: string) {
    if (formData.tools?.includes(toolId)) {
      formData.tools = formData.tools.filter(t => t !== toolId);
    } else {
      formData.tools = [...(formData.tools || []), toolId];
    }
  }

  async function handleSubmit() {
    if (!formData.name?.trim()) {
      submitMessage = 'Nazwa agenta jest wymagana';
      return;
    }

    isSubmitting = true;
    submitMessage = '';

    try {
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: formData.name,
        description: formData.description || '',
        model: formData.model || 'gpt-4o',
        tools: formData.tools || [],
        status: formData.status || 'inactive',
        systemPrompt: formData.systemPrompt || '',
        maxTokens: formData.maxTokens || 1000,
        temperature: formData.temperature || 0.7
      };

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAgent),
      });

      const result = await response.json();

      if (response.ok) {
        submitMessage = 'Agent został utworzony pomyślnie!';
        // Reset form
        formData = {
          name: '',
          description: '',
          model: 'gpt-4o',
          tools: [],
          status: 'inactive',
          systemPrompt: '',
          maxTokens: 1000,
          temperature: 0.7
        };
        
        // Redirect after success
        setTimeout(() => {
          window.location.href = '/agents';
        }, 2000);
      } else {
        submitMessage = 'Błąd podczas tworzenia agenta';
      }

    } catch (error) {
      console.error('Error creating agent:', error);
      submitMessage = 'Wystąpił błąd podczas tworzenia agenta';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="agent-form">
  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <!-- Basic Info -->
    <div class="form-section">
      <h3 class="section-title">Podstawowe informacje</h3>
      
      <div class="form-group">
        <label for="name" class="form-label">Nazwa agenta *</label>
        <input
          id="name"
          type="text"
          bind:value={formData.name}
          placeholder="np. Agent Marketing, Bot Support..."
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Opis</label>
        <textarea
          id="description"
          bind:value={formData.description}
          placeholder="Opisz zadania i funkcje agenta..."
          class="form-textarea"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="model" class="form-label">Model AI</label>
        <select id="model" bind:value={formData.model} class="form-select">
          {#each availableModels as model}
            <option value={model.id}>{model.name}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="status" class="form-label">Status początkowy</label>
        <select id="status" bind:value={formData.status} class="form-select">
          <option value="inactive">Nieaktywny</option>
          <option value="active">Aktywny</option>
          <option value="testing">Testowanie</option>
        </select>
      </div>
    </div>

    <!-- Tools Selection -->
    <div class="form-section">
      <h3 class="section-title">Narzędzia i możliwości</h3>
      <p class="text-gray-400 text-sm mb-4">Wybierz narzędzia, które będą dostępne dla agenta</p>
      
      <div class="tools-grid">
        {#each availableTools as tool}
          <label class="tool-item {formData.tools?.includes(tool.id) ? 'selected' : ''}">
            <input
              type="checkbox"
              checked={formData.tools?.includes(tool.id)}
              on:change={() => toggleTool(tool.id)}
              class="hidden"
            />
            <div class="tool-content">
              <h4 class="tool-name">{tool.name}</h4>
              <p class="tool-description">{tool.description}</p>
            </div>
          </label>
        {/each}
      </div>
    </div>

    <!-- Advanced Settings -->
    <div class="form-section">
      <h3 class="section-title">Zaawansowane ustawienia</h3>
      
      <div class="form-group">
        <label for="systemPrompt" class="form-label">System Prompt</label>
        <textarea
          id="systemPrompt"
          bind:value={formData.systemPrompt}
          placeholder="Instrukcje systemowe dla agenta..."
          class="form-textarea"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group-row">
        <div class="form-group">
          <label for="maxTokens" class="form-label">Max tokeny</label>
          <input
            id="maxTokens"
            type="number"
            bind:value={formData.maxTokens}
            min="100"
            max="4000"
            step="100"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="temperature" class="form-label">Temperatura (kreatywność)</label>
          <input
            id="temperature"
            type="number"
            bind:value={formData.temperature}
            min="0"
            max="2"
            step="0.1"
            class="form-input"
          />
        </div>
      </div>
    </div>

    <!-- Submit -->
    <div class="form-submit">
      {#if submitMessage}
        <p class="submit-message {submitMessage.includes('pomyślnie') ? 'success' : 'error'}">
          {submitMessage}
        </p>
      {/if}
      
      <button
        type="submit"
        disabled={isSubmitting || !formData.name?.trim()}
        class="submit-button"
      >
        {isSubmitting ? 'Tworzenie agenta...' : 'Utwórz agenta'}
      </button>
    </div>
  </form>
</div>

<style>
  .agent-form {
    max-width: 800px;
    margin: 0 auto;
  }

  .form-section {
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

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-label {
    display: block;
    color: #fff;
    font-weight: 500;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .form-input, .form-textarea, .form-select {
    width: 100%;
    background: rgba(13, 17, 23, 0.8);
    border: 1px solid #444;
    color: #fff;
    padding: 0.75rem;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s ease;
  }

  .form-input:focus, .form-textarea:focus, .form-select:focus {
    border-color: #00d9ff;
    box-shadow: 0 0 5px rgba(0, 217, 255, 0.3);
  }

  .form-textarea {
    resize: vertical;
    min-height: 80px;
  }

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .tool-item {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #444;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .tool-item:hover {
    border-color: #00d9ff;
    background: rgba(0, 217, 255, 0.05);
  }

  .tool-item.selected {
    border-color: #00d9ff;
    background: rgba(0, 217, 255, 0.1);
  }

  .tool-content {
    pointer-events: none;
  }

  .tool-name {
    color: #fff;
    font-weight: 600;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }

  .tool-description {
    color: #aaa;
    font-size: 0.8rem;
    line-height: 1.3;
  }

  .form-submit {
    text-align: center;
    padding: 1.5rem 0;
  }

  .submit-message {
    margin-bottom: 1rem;
    padding: 0.75rem;
    font-weight: 500;
  }

  .submit-message.success {
    color: #00ff88;
    background: rgba(0, 255, 136, 0.1);
    border: 1px solid rgba(0, 255, 136, 0.3);
  }

  .submit-message.error {
    color: #ff4444;
    background: rgba(255, 68, 68, 0.1);
    border: 1px solid rgba(255, 68, 68, 0.3);
  }

  .submit-button {
    background: linear-gradient(45deg, #00d9ff, #0099cc);
    color: #000;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 200px;
  }

  .submit-button:hover:not(:disabled) {
    background: linear-gradient(45deg, #0099cc, #00d9ff);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);
  }

  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
</style>
