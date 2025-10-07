<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let searchQuery = "";
  let datasets = null;
  let isLoading = false;
  let error = null;
  let isExpanded = false;

  async function searchDatasets() {
    if (!searchQuery.trim() || isLoading) return;

    const query = searchQuery.trim();
    searchQuery = "";

    isLoading = true;
    error = null;

    try {
      const response = await fetch(`/api/polaczek/kaggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        datasets = result;
        dispatch("datasetsFound", { datasets: result });
      } else {
        throw new Error(result.message || "Nie udało się wyszukać datasetów");
      }
    } catch (err) {
      error = err.message;
      datasets = null;
      console.error("Kaggle error:", err);
    } finally {
      isLoading = false;
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      searchDatasets();
    }
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function openFullKaggle() {
    window.open("/kaggle-datasets", "_blank");
  }

  function clearResults() {
    datasets = null;
    error = null;
  }

  function openDataset(datasetRef) {
    window.open(`https://www.kaggle.com/${datasetRef}`, "_blank");
  }
</script>

<div class="kaggle-widget" class:expanded={isExpanded}>
  <div class="widget-header">
    <div class="title-section">
      <h3>🔍 Kaggle Datasets</h3>
      <span class="service-badge">ML Platform</span>
    </div>
    <div class="header-actions">
      <button 
        on:click={() => window.open('/kaggle-datasets-pro', '_blank')} 
        class="pro-btn" 
        title="Wersja PRO z pełnymi instrukcjami ML"
      >
        ⭐ PRO
      </button>
      <button on:click={toggleExpanded} class="expand-btn" title="Rozwiń/Zwiń">
        {isExpanded ? "▼" : "▲"}
      </button>
      <button
        on:click={openFullKaggle}
        class="full-btn"
        title="Otwórz pełną platformę"
      >
        🔗
      </button>
    </div>
  </div>

  <div class="widget-content">
    {#if isExpanded && (datasets || error)}
      <div class="results-container">
        {#if error}
          <div class="error-message">
            <div class="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        {:else if datasets}
          <div class="results-display">
            <div class="query-info">
              <strong>Wyszukiwane:</strong>
              {datasets.query}
              <span class="mode-badge">Demo Mode</span>
            </div>
            <div class="datasets-grid">
              {#each datasets.data as dataset}
                <div
                  class="dataset-card"
                  on:click={() => openDataset(dataset.ref)}
                >
                  <div class="dataset-header">
                    <h4 class="dataset-title">{dataset.title}</h4>
                    <div class="dataset-stats">
                      <span class="stat"
                        >⬇️ {dataset.downloadCount.toLocaleString()}</span
                      >
                      <span class="stat">👍 {dataset.voteCount}</span>
                      <span class="stat">📦 {dataset.size}</span>
                    </div>
                  </div>
                  <p class="dataset-description">{dataset.description}</p>
                  <div class="dataset-tags">
                    {#each dataset.tags as tag}
                      <span class="tag">{tag}</span>
                    {/each}
                  </div>
                  <div class="dataset-footer">
                    <span class="updated"
                      >Zaktualizowano: {dataset.lastUpdated}</span
                    >
                    <span class="ref">{dataset.ref}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <div class="actions">
          <button
            on:click={clearResults}
            class="clear-btn"
            title="Wyczyść wyniki"
          >
            🗑️
          </button>
        </div>
      </div>
    {/if}

    <div class="input-section">
      <div class="input-container">
        <input
          type="text"
          bind:value={searchQuery}
          on:keypress={handleKeyPress}
          placeholder="machine learning, computer vision..."
          disabled={isLoading}
          class="search-input"
        />

        <button
          on:click={searchDatasets}
          disabled={!searchQuery.trim() || isLoading}
          class="search-btn"
          title="Wyszukaj datasets"
        >
          {#if isLoading}
            <span class="spinner"></span>
          {:else}
            🔍
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .kaggle-widget {
    border: 1px solid var(--color-edge, #ccc);
    padding: 20px;
    margin: 16px 0;
    background: var(--color-background, transparent);
    transition: all 0.3s ease;
  }

  .kaggle-widget:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .kaggle-widget.expanded {
    border-color: var(--color-primary, #666);
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--color-edge, #ccc);
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .title-section h3 {
    margin: 0;
    color: var(--color-foreground, #000);
    font-size: 1.1rem;
    font-weight: 600;
  }

  .service-badge {
    background: var(--color-primary, #666);
    color: var(--color-primary-foreground, #fff);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid var(--color-edge, #ccc);
  }

  .header-actions {
    display: flex;
    gap: 6px;
  }

  .pro-btn {
    background: linear-gradient(135deg, #9333ea, #7c3aed);
    border: 1px solid #7c3aed;
    color: white;
    font-weight: bold;
    font-size: 0.8rem;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(147, 51, 234, 0.3);
  }

  .pro-btn:hover {
    background: linear-gradient(135deg, #a855f7, #8b5cf6);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(147, 51, 234, 0.5);
  }

  .expand-btn,
  .full-btn {
    background: var(--color-secondary, #f5f5f5);
    border: 1px solid var(--color-edge, #ccc);
    color: var(--color-secondary-foreground, #000);
    width: 32px;
    height: 32px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .expand-btn:hover,
  .full-btn:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .widget-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .results-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .results-display {
    background: var(--color-muted, #f5f5f5);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid var(--color-edge, #ccc);
  }

  .query-info {
    background: var(--color-background, #fff);
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid var(--color-edge, #ccc);
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }

  .mode-badge {
    background: #20b2aa;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
  }

  .datasets-grid {
    display: grid;
    gap: 16px;
    max-height: 400px;
    overflow-y: auto;
  }

  .dataset-card {
    background: var(--color-background, #fff);
    border: 1px solid var(--color-edge, #ccc);
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .dataset-card:hover {
    filter: brightness(1.02);
    border-color: var(--color-primary, #666);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .dataset-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .dataset-title {
    margin: 0;
    color: var(--color-foreground, #000);
    font-size: 1rem;
    font-weight: 600;
    flex: 1;
  }

  .dataset-stats {
    display: flex;
    gap: 8px;
    font-size: 0.75rem;
    color: var(--color-muted-foreground, #666);
  }

  .stat {
    background: var(--color-muted, #f5f5f5);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid var(--color-edge, #ccc);
  }

  .dataset-description {
    color: var(--color-muted-foreground, #666);
    font-size: 0.85rem;
    line-height: 1.4;
    margin: 8px 0;
  }

  .dataset-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin: 12px 0;
  }

  .tag {
    background: var(--color-primary, #666);
    color: var(--color-primary-foreground, #fff);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    border: 1px solid var(--color-edge, #ccc);
  }

  .dataset-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px solid var(--color-edge, #ccc);
    font-size: 0.75rem;
    color: var(--color-muted-foreground, #666);
  }

  .ref {
    font-family: monospace;
    background: var(--color-muted, #f5f5f5);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .error-message {
    background: var(--color-destructive-background, #fee);
    border: 1px solid var(--color-destructive, #dc2626);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .error-icon {
    font-size: 1.5rem;
  }

  .error-message p {
    margin: 0;
    color: var(--color-destructive, #dc2626);
    font-size: 0.9rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }

  .clear-btn {
    background: var(--color-destructive-background, #fee);
    border: 1px solid var(--color-destructive, #dc2626);
    color: var(--color-destructive, #dc2626);
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
  }

  .clear-btn:hover {
    filter: brightness(1.05);
    border-color: var(--color-destructive, #dc2626);
  }

  .input-section {
    width: 100%;
  }

  .input-container {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .search-input {
    flex: 1;
    background: var(--color-input-background, transparent);
    border: 1px solid var(--color-edge, #ccc);
    border-radius: 8px;
    padding: 10px 12px;
    color: var(--color-foreground, #000);
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-primary, #666);
    box-shadow: 0 0 0 2px var(--color-primary-alpha, rgba(102, 102, 102, 0.2));
  }

  .search-input::placeholder {
    color: var(--color-muted-foreground, #666);
  }

  .search-btn {
    background: var(--color-primary, #666);
    border: 1px solid var(--color-edge, #ccc);
    color: var(--color-primary-foreground, #fff);
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-btn:hover:not(:disabled) {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .search-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--color-primary-alpha, rgba(255, 255, 255, 0.3));
    border-top: 2px solid var(--color-primary-foreground, #fff);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .kaggle-widget {
      padding: 16px;
    }

    .dataset-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .dataset-stats {
      align-self: stretch;
      justify-content: space-between;
    }

    .dataset-tags {
      justify-content: flex-start;
    }

    .dataset-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
</style>
