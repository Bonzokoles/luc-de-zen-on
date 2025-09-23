<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let query = "";
  let results = null;
  let isLoading = false;
  let error = null;
  let isExpanded = false;

  async function executeQuery() {
    if (!query.trim() || isLoading) return;

    const sqlQuery = query.trim();
    query = "";

    isLoading = true;
    error = null;

    try {
      const response = await fetch("/api/bigquery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: sqlQuery,
          dataset: "analytics",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        results = result;
        dispatch("queryExecuted", { results: result });
      } else {
        throw new Error(result.message || "Nie udało się wykonać zapytania");
      }
    } catch (err) {
      error = err.message;
      results = null;
      console.error("BigQuery error:", err);
    } finally {
      isLoading = false;
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      executeQuery();
    }
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function openFullBigQuery() {
    window.open("/bigquery-analytics", "_blank");
  }

  function clearResults() {
    results = null;
    error = null;
  }
</script>

<div class="bigquery-widget" class:expanded={isExpanded}>
  <div class="widget-header">
    <div class="title-section">
      <h3>📊 BigQuery Analytics</h3>
      <span class="service-badge">Google Cloud</span>
    </div>
    <div class="header-actions">
      <button on:click={toggleExpanded} class="expand-btn" title="Rozwiń/Zwiń">
        {isExpanded ? "▼" : "▲"}
      </button>
      <button
        on:click={openFullBigQuery}
        class="full-btn"
        title="Otwórz pełną analitykę"
      >
        🔗
      </button>
    </div>
  </div>

  <div class="widget-content">
    {#if isExpanded && (results || error)}
      <div class="results-container">
        {#if error}
          <div class="error-message">
            <div class="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        {:else if results}
          <div class="results-display">
            <div class="query-info">
              <strong>Query:</strong>
              {results.query}
            </div>
            <div class="metadata">
              <span
                >Rows: {results.metadata?.totalRows || results.rowCount}</span
              >
              <span
                >Time: {results.metadata?.executionTime ||
                  results.executionTime}</span
              >
              <span
                >Processed: {results.metadata?.bytesProcessed ||
                  results.bytesProcessed}</span
              >
            </div>
            <div class="data-grid">
              {#if results.results?.rows || results.results}
                {#each results.results?.rows || results.results as row}
                  <div class="data-row">
                    {#if typeof row === "object"}
                      {#each Object.entries(row) as [key, value]}
                        <div class="data-cell">
                          <strong>{key}:</strong>
                          {value}
                        </div>
                      {/each}
                    {:else}
                      <div class="data-cell">{JSON.stringify(row)}</div>
                    {/if}
                  </div>
                {/each}
              {:else}
                <p>Brak danych do wyświetlenia</p>
              {/if}
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
        <textarea
          bind:value={query}
          on:keypress={handleKeyPress}
          placeholder="SELECT * FROM dataset.table WHERE..."
          rows={isExpanded ? "3" : "2"}
          disabled={isLoading}
          class="sql-input"
        ></textarea>

        <button
          on:click={executeQuery}
          disabled={!query.trim() || isLoading}
          class="execute-btn"
          title="Wykonaj zapytanie SQL"
        >
          {#if isLoading}
            <span class="spinner"></span>
          {:else}
            📊
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .bigquery-widget {
    border: 1px solid var(--color-edge, #ccc);
    padding: 20px;
    margin: 16px 0;
    background: var(--color-background, transparent);
    transition: all 0.3s ease;
  }

  .bigquery-widget:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .bigquery-widget.expanded {
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
    margin-bottom: 12px;
    font-family: monospace;
    font-size: 0.9rem;
    word-break: break-all;
  }

  .metadata {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
    font-size: 0.85rem;
    color: var(--color-muted-foreground, #666);
  }

  .data-grid {
    max-height: 300px;
    overflow-y: auto;
  }

  .data-row {
    background: var(--color-background, #fff);
    border: 1px solid var(--color-edge, #ccc);
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .data-cell {
    background: var(--color-muted, #f5f5f5);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
    border: 1px solid var(--color-edge, #ccc);
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
    align-items: flex-end;
  }

  .sql-input {
    flex: 1;
    background: var(--color-input-background, transparent);
    border: 1px solid var(--color-edge, #ccc);
    border-radius: 8px;
    padding: 10px 12px;
    color: var(--color-foreground, #000);
    font-size: 0.9rem;
    font-family: monospace;
    resize: none;
    transition: all 0.3s ease;
  }

  .sql-input:focus {
    outline: none;
    border-color: var(--color-primary, #666);
    box-shadow: 0 0 0 2px var(--color-primary-alpha, rgba(102, 102, 102, 0.2));
  }

  .sql-input::placeholder {
    color: var(--color-muted-foreground, #666);
  }

  .execute-btn {
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

  .execute-btn:hover:not(:disabled) {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .execute-btn:disabled {
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
    .bigquery-widget {
      padding: 16px;
    }

    .metadata {
      flex-direction: column;
      gap: 8px;
    }

    .data-row {
      flex-direction: column;
    }

    .input-container {
      flex-direction: column;
      gap: 8px;
    }

    .execute-btn {
      width: 100%;
      height: 36px;
    }
  }
</style>
