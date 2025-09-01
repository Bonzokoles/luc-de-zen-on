<script lang="ts">
  import { onMount } from "svelte";
  import {
    fetchFromWorker,
    postToWorker,
    getFromWorker,
  } from "../cloudflareApi";

  // State management
  let workers: any[] = [];
  let selectedWorker: any = null;
  let loading = false;
  let error = "";
  let success = "";

  // Form data
  let newWorkerName = "";
  let newWorkerType = "chat";
  let workerConfig = {
    model: "llama-3.1-8b-instant",
    maxTokens: 1000,
    temperature: 0.7,
  };

  // Worker types configuration
  const workerTypes = [
    { id: "chat", name: "Chat AI", endpoint: "/api/chat" },
    { id: "image", name: "Image Generator", endpoint: "/api/generate-image" },
    { id: "analyze", name: "Data Analyzer", endpoint: "/api/data-analyze" },
    { id: "search", name: "Search Assistant", endpoint: "/api/search" },
  ];

  // Load workers on component mount
  onMount(async () => {
    await loadWorkers();
  });

  async function loadWorkers() {
    loading = true;
    error = "";

    try {
      // Load workers from our API
      const response = await getFromWorker("/api/ai-workers", {
        action: "list",
      });
      workers = response.workers || [];
      console.log("✅ Załadowano workers:", workers.length);
    } catch (err) {
      error = `Błąd ładowania workers: ${err.message}`;
      console.error("❌ Błąd:", err);
    } finally {
      loading = false;
    }
  }

  async function createWorker() {
    if (!newWorkerName.trim()) {
      error = "Nazwa worker jest wymagana";
      return;
    }

    loading = true;
    error = "";
    success = "";

    try {
      const workerData = {
        action: "create",
        name: newWorkerName,
        type: newWorkerType,
        config: workerConfig,
        endpoint: workerTypes.find((t) => t.id === newWorkerType)?.endpoint,
      };

      const response = await postToWorker("/api/ai-workers", workerData);

      success = `Worker "${newWorkerName}" został utworzony pomyślnie!`;
      newWorkerName = "";

      // Reload workers list
      await loadWorkers();
    } catch (err) {
      error = `Błąd tworzenia worker: ${err.message}`;
    } finally {
      loading = false;
    }
  }

  async function testWorker(worker: any) {
    loading = true;
    error = "";

    try {
      const testData = {
        action: "test",
        workerId: worker.id,
        testData: {
          message: "Test connectivity",
          prompt: "Say hello in a creative way",
        },
      };

      const response = await postToWorker("/api/ai-workers", testData);

      success = `Worker "${worker.name}" odpowiada poprawnie: ${response.result || response.message}`;
    } catch (err) {
      error = `Worker "${worker.name}" błąd: ${err.message}`;
    } finally {
      loading = false;
    }
  }

  async function deleteWorker(workerId: string) {
    if (!confirm("Czy na pewno chcesz usunąć tego worker?")) return;

    loading = true;
    error = "";

    try {
      await postToWorker("/api/ai-workers", {
        action: "delete",
        workerId,
      });
      success = "Worker został usunięty pomyślnie";
      await loadWorkers();
    } catch (err) {
      error = `Błąd usuwania worker: ${err.message}`;
    } finally {
      loading = false;
    }
  }

  function selectWorker(worker: any) {
    selectedWorker = worker;
  }

  function clearMessages() {
    error = "";
    success = "";
  }
</script>

<div class="ai-workers-manager">
  <div class="header">
    <h2>🤖 AI Workers Manager</h2>
    <p class="subtitle">Zarządzaj AI Workers w środowisku Cloudflare</p>
  </div>

  <!-- Status Messages -->
  {#if error}
    <div class="alert error">
      <span class="icon">❌</span>
      {error}
      <button class="close-btn" on:click={clearMessages}>✕</button>
    </div>
  {/if}

  {#if success}
    <div class="alert success">
      <span class="icon">✅</span>
      {success}
      <button class="close-btn" on:click={clearMessages}>✕</button>
    </div>
  {/if}

  <!-- Loading State -->
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <span>Przetwarzanie...</span>
    </div>
  {/if}

  <!-- Create New Worker Form -->
  <div class="create-worker-section">
    <h3>➕ Utwórz Nowy Worker</h3>

    <form on:submit|preventDefault={createWorker} class="worker-form">
      <div class="form-group">
        <label for="worker-name">Nazwa Worker:</label>
        <input
          id="worker-name"
          type="text"
          bind:value={newWorkerName}
          placeholder="np. Chat Assistant v2"
          required
        />
      </div>

      <div class="form-group">
        <label for="worker-type">Typ Worker:</label>
        <select id="worker-type" bind:value={newWorkerType}>
          {#each workerTypes as type}
            <option value={type.id}>{type.name}</option>
          {/each}
        </select>
      </div>

      <div class="config-section">
        <h4>Konfiguracja AI:</h4>

        <div class="form-row">
          <div class="form-group">
            <label for="model">Model:</label>
            <select id="model" bind:value={workerConfig.model}>
              <option value="llama-3.1-8b-instant">Llama 3.1 8B</option>
              <option value="llama-3.1-70b-versatile">Llama 3.1 70B</option>
              <option value="gemma-7b-it">Gemma 7B</option>
            </select>
          </div>

          <div class="form-group">
            <label for="max-tokens">Max Tokens:</label>
            <input
              id="max-tokens"
              type="number"
              bind:value={workerConfig.maxTokens}
              min="100"
              max="4000"
            />
          </div>

          <div class="form-group">
            <label for="temperature">Temperature:</label>
            <input
              id="temperature"
              type="range"
              bind:value={workerConfig.temperature}
              min="0"
              max="2"
              step="0.1"
            />
            <span class="range-value">{workerConfig.temperature}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="btn-primary"
        disabled={loading || !newWorkerName.trim()}
      >
        🚀 Utwórz Worker
      </button>
    </form>
  </div>

  <!-- Workers List -->
  <div class="workers-list-section">
    <div class="section-header">
      <h3>📋 Lista Workers ({workers.length})</h3>
      <button class="btn-secondary" on:click={loadWorkers} disabled={loading}>
        🔄 Odśwież
      </button>
    </div>

    {#if workers.length === 0 && !loading}
      <div class="empty-state">
        <span class="icon">🤖</span>
        <p>Brak workers. Utwórz pierwszy!</p>
      </div>
    {:else}
      <div class="workers-grid">
        {#each workers as worker}
          <div
            class="worker-card"
            class:selected={selectedWorker?.id === worker.id}
          >
            <div class="worker-header">
              <h4>{worker.name}</h4>
              <span class="worker-type"
                >{workerTypes.find((t) => t.id === worker.type)?.name ||
                  worker.type}</span
              >
            </div>

            <div class="worker-details">
              <p><strong>Model:</strong> {worker.config?.model || "N/A"}</p>
              <p><strong>Endpoint:</strong> <code>{worker.endpoint}</code></p>
              <p>
                <strong>Status:</strong>
                <span class="status {worker.status || 'active'}"
                  >{worker.status || "active"}</span
                >
              </p>
            </div>

            <div class="worker-actions">
              <button
                class="btn-test"
                on:click={() => testWorker(worker)}
                disabled={loading}
              >
                🧪 Test
              </button>

              <button
                class="btn-select"
                on:click={() => selectWorker(worker)}
                disabled={loading}
              >
                📋 Wybierz
              </button>

              <button
                class="btn-danger"
                on:click={() => deleteWorker(worker.id)}
                disabled={loading}
              >
                🗑️ Usuń
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Selected Worker Details -->
  {#if selectedWorker}
    <div class="selected-worker-section">
      <h3>🎯 Szczegóły Worker: {selectedWorker.name}</h3>

      <div class="worker-details-expanded">
        <div class="detail-group">
          <h4>Konfiguracja:</h4>
          <pre class="config-json">{JSON.stringify(
              selectedWorker.config,
              null,
              2
            )}</pre>
        </div>

        <div class="detail-group">
          <h4>Metadane:</h4>
          <p><strong>ID:</strong> {selectedWorker.id}</p>
          <p><strong>Created:</strong> {selectedWorker.created || "N/A"}</p>
          <p><strong>Last Used:</strong> {selectedWorker.lastUsed || "N/A"}</p>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .ai-workers-manager {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .header h2 {
    font-size: 2.5rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #718096;
    font-size: 1.1rem;
  }

  /* Alerts */
  .alert {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    position: relative;
  }

  .alert.error {
    background: #fed7d7;
    color: #c53030;
    border: 1px solid #feb2b2;
  }

  .alert.success {
    background: #c6f6d5;
    color: #276749;
    border: 1px solid #9ae6b4;
  }

  .close-btn {
    position: absolute;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0.7;
  }

  .close-btn:hover {
    opacity: 1;
  }

  /* Loading */
  .loading {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #edf2f7;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e2e8f0;
    border-top: 2px solid #3182ce;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Form Styles */
  .create-worker-section,
  .workers-list-section,
  .selected-worker-section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .worker-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  label {
    font-weight: 600;
    color: #4a5568;
  }

  input,
  select {
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: #3182ce;
  }

  .range-value {
    font-weight: 600;
    color: #3182ce;
    margin-left: 0.5rem;
  }

  /* Buttons */
  .btn-primary,
  .btn-secondary,
  .btn-test,
  .btn-select,
  .btn-danger {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
  }

  .btn-primary {
    background: #3182ce;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #2c5aa0;
  }

  .btn-secondary {
    background: #e2e8f0;
    color: #4a5568;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #cbd5e0;
  }

  .btn-test {
    background: #38a169;
    color: white;
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }

  .btn-select {
    background: #3182ce;
    color: white;
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }

  .btn-danger {
    background: #e53e3e;
    color: white;
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Workers Grid */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .workers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .worker-card {
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.2s;
  }

  .worker-card:hover {
    border-color: #cbd5e0;
    transform: translateY(-2px);
  }

  .worker-card.selected {
    border-color: #3182ce;
    background: #f7fafc;
  }

  .worker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .worker-header h4 {
    margin: 0;
    color: #2d3748;
  }

  .worker-type {
    background: #edf2f7;
    color: #4a5568;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .worker-details {
    margin-bottom: 1.5rem;
  }

  .worker-details p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
    color: #4a5568;
  }

  .status {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .status.active {
    background: #c6f6d5;
    color: #276749;
  }

  .status.inactive {
    background: #fed7d7;
    color: #c53030;
  }

  .worker-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #718096;
  }

  .empty-state .icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
  }

  /* Selected Worker Details */
  .worker-details-expanded {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .detail-group h4 {
    color: #2d3748;
    margin-bottom: 1rem;
  }

  .config-json {
    background: #1a202c;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    overflow-x: auto;
  }

  code {
    background: #edf2f7;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    .ai-workers-manager {
      padding: 1rem;
    }

    .workers-grid {
      grid-template-columns: 1fr;
    }

    .worker-details-expanded {
      grid-template-columns: 1fr;
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
