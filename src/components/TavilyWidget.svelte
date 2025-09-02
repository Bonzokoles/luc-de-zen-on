<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let searchQuery = "";
  let results = null;
  let isLoading = false;
  let error = null;
  let isExpanded = false;

  async function searchWeb() {
    if (!searchQuery.trim() || isLoading) return;

    const query = searchQuery.trim();
    searchQuery = "";

    isLoading = true;
    error = null;

    try {
      const response = await fetch("/api/tavi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          maxResults: 5,
          includeAnswer: true,
          includeImages: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        results = result;
        dispatch("searchCompleted", { results: result });
      } else {
        throw new Error(result.error || "Nie udało się wykonać wyszukiwania");
      }
    } catch (err) {
      error = err.message;
      results = null;
      console.error("Tavily error:", err);
    } finally {
      isLoading = false;
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      searchWeb();
    }
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function openFullTavily() {
    window.open("/tavily-search", "_blank");
  }

  function clearResults() {
    results = null;
    error = null;
  }

  function openResult(url) {
    window.open(url, "_blank");
  }
</script>

<div class="tavily-widget" class:expanded={isExpanded}>
  <div class="widget-header">
    <div class="title-section">
      <h3>🌐 Tavily AI Search</h3>
      <span class="service-badge">AI Powered</span>
    </div>
    <div class="header-actions">
      <button on:click={toggleExpanded} class="expand-btn" title="Rozwiń/Zwiń">
        {isExpanded ? "▼" : "▲"}
      </button>
      <button
        on:click={openFullTavily}
        class="full-btn"
        title="Otwórz pełne wyszukiwanie"
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
              <strong>Wyszukiwanie:</strong>
              {results.query}
            </div>

            {#if results.answer}
              <div class="ai-answer">
                <h4>🤖 AI Odpowiedź:</h4>
                <p>{results.answer}</p>
              </div>
            {/if}

            <div class="search-results">
              <h4>📝 Wyniki wyszukiwania:</h4>
              {#each results.results as result}
                <div
                  class="result-card"
                  on:click={() => openResult(result.url)}
                >
                  <div class="result-header">
                    <h5 class="result-title">{result.title}</h5>
                    <span class="result-score"
                      >Score: {(result.score * 100).toFixed(0)}%</span
                    >
                  </div>
                  <p class="result-content">{result.content}</p>
                  <div class="result-footer">
                    <span class="result-url">{result.url}</span>
                    {#if result.publishedDate}
                      <span class="result-date"
                        >{new Date(result.publishedDate).toLocaleDateString(
                          "pl-PL"
                        )}</span
                      >
                    {/if}
                  </div>
                </div>
              {/each}
            </div>

            {#if results.usage}
              <div class="usage-info">
                <span>Tokeny: {results.usage.tokensUsed}</span>
                <span>Pozostało: {results.usage.requestsRemaining}</span>
              </div>
            {/if}
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
          placeholder="Wyszukaj w internecie..."
          disabled={isLoading}
          class="search-input"
        />

        <button
          on:click={searchWeb}
          disabled={!searchQuery.trim() || isLoading}
          class="search-btn"
          title="Wyszukaj w internecie"
        >
          {#if isLoading}
            <span class="spinner"></span>
          {:else}
            🌐
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .tavily-widget {
    border: 1px solid var(--color-edge, #ccc);
    padding: 20px;
    margin: 16px 0;
    background: var(--color-background, transparent);
    transition: all 0.3s ease;
  }

  .tavily-widget:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .tavily-widget.expanded {
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
    margin-bottom: 16px;
    font-size: 0.9rem;
  }

  .ai-answer {
    background: var(--color-secondary, #f5f5f5);
    border: 1px solid var(--color-edge, #ccc);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 16px;
  }

  .ai-answer h4 {
    margin: 0 0 8px 0;
    color: var(--color-primary, #666);
    font-size: 0.9rem;
  }

  .ai-answer p {
    margin: 0;
    color: var(--color-foreground, #000);
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .search-results h4 {
    margin: 0 0 12px 0;
    color: var(--color-foreground, #000);
    font-size: 0.9rem;
  }

  .result-card {
    background: var(--color-background, #fff);
    border: 1px solid var(--color-edge, #ccc);
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .result-card:hover {
    filter: brightness(1.02);
    border-color: var(--color-primary, #666);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6px;
  }

  .result-title {
    margin: 0;
    color: var(--color-foreground, #000);
    font-size: 0.9rem;
    font-weight: 600;
    flex: 1;
  }

  .result-score {
    background: var(--color-primary, #666);
    color: var(--color-primary-foreground, #fff);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.7rem;
    margin-left: 8px;
  }

  .result-content {
    color: var(--color-muted-foreground, #666);
    font-size: 0.8rem;
    line-height: 1.4;
    margin: 6px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .result-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding-top: 6px;
    border-top: 1px solid var(--color-edge, #ccc);
    font-size: 0.7rem;
    color: var(--color-muted-foreground, #666);
  }

  .result-url {
    font-family: monospace;
    background: var(--color-muted, #f5f5f5);
    padding: 2px 4px;
    border-radius: 3px;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .usage-info {
    display: flex;
    gap: 16px;
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px solid var(--color-edge, #ccc);
    font-size: 0.75rem;
    color: var(--color-muted-foreground, #666);
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
    .tavily-widget {
      padding: 16px;
    }

    .result-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .result-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .result-url {
      max-width: 100%;
    }
  }
</style>
