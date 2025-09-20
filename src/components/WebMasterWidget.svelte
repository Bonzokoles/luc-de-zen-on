<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let activeTab = "seo"; // seo, performance, competitive
  let analysisQuery = "";
  let results = null;
  let isLoading = false;
  let error = null;
  let isExpanded = false;

  // WebMaster Agent funkcje
  async function analyzeSEO() {
    if (!analysisQuery.trim() || isLoading) return;

    const url = analysisQuery.trim();
    analysisQuery = "";

    isLoading = true;
    error = null;

    try {
      const response = await fetch("/api/webmaster/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          checks: ["meta", "headings", "images", "links", "schema"],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      results = result;
      dispatch("seoAnalysisCompleted", { results: result });
    } catch (err) {
      error = err.message;
      results = null;
      console.error("SEO Analysis error:", err);
    } finally {
      isLoading = false;
    }
  }

  async function analyzePerformance() {
    if (!analysisQuery.trim() || isLoading) return;

    const url = analysisQuery.trim();
    analysisQuery = "";

    isLoading = true;
    error = null;

    try {
      const response = await fetch("/api/webmaster/performance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          metrics: ["lcp", "fid", "cls", "fcp", "ttfb"],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      results = result;
      dispatch("performanceAnalysisCompleted", { results: result });
    } catch (err) {
      error = err.message;
      results = null;
      console.error("Performance Analysis error:", err);
    } finally {
      isLoading = false;
    }
  }

  async function analyzeCompetitive() {
    if (!analysisQuery.trim() || isLoading) return;

    const domain = analysisQuery.trim();
    analysisQuery = "";

    isLoading = true;
    error = null;

    try {
      const response = await fetch("/api/webmaster/competitive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: domain,
          analysis: ["keywords", "backlinks", "traffic", "tech_stack"],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      results = result;
      dispatch("competitiveAnalysisCompleted", { results: result });
    } catch (err) {
      error = err.message;
      results = null;
      console.error("Competitive Analysis error:", err);
    } finally {
      isLoading = false;
    }
  }

  function handleAnalysis() {
    switch (activeTab) {
      case "seo":
        analyzeSEO();
        break;
      case "performance":
        analyzePerformance();
        break;
      case "competitive":
        analyzeCompetitive();
        break;
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAnalysis();
    }
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function openFullWebMaster() {
    window.open("/webmaster-dashboard", "_blank");
  }

  function clearResults() {
    results = null;
    error = null;
  }

  function getScoreColor(score) {
    if (score >= 90) return "var(--color-success, #22c55e)";
    if (score >= 70) return "var(--color-warning, #f59e0b)";
    return "var(--color-destructive, #dc2626)";
  }

  function getTabLabel(tab) {
    switch (tab) {
      case "seo":
        return "🔍 SEO Analysis";
      case "performance":
        return "⚡ Core Web Vitals";
      case "competitive":
        return "🏆 Competitive Analysis";
      default:
        return tab;
    }
  }

  function getPlaceholder() {
    switch (activeTab) {
      case "seo":
        return "Wprowadź URL do analizy SEO...";
      case "performance":
        return "Wprowadź URL do testowania wydajności...";
      case "competitive":
        return "Wprowadź domenę konkurenta...";
      default:
        return "Wprowadź URL lub domenę...";
    }
  }
</script>

<div class="webmaster-widget" class:expanded={isExpanded}>
  <div class="widget-header">
    <div class="title-section">
      <h3>🎯 WebMaster Agent</h3>
      <span class="service-badge">AI-Powered</span>
    </div>
    <div class="header-actions">
      <button class="expand-btn" on:click={toggleExpanded} title="Rozwiń/Zwiń">
        {isExpanded ? "−" : "+"}
      </button>
      <button
        class="full-btn"
        on:click={openFullWebMaster}
        title="Otwórz pełny dashboard"
      >
        ⎋
      </button>
    </div>
  </div>

  {#if isExpanded}
    <div class="widget-content">
      <!-- Tabs Navigation -->
      <div class="tabs-nav">
        {#each ["seo", "performance", "competitive"] as tab}
          <button
            class="tab-btn"
            class:active={activeTab === tab}
            on:click={() => (activeTab = tab)}
          >
            {getTabLabel(tab)}
          </button>
        {/each}
      </div>

      <!-- Input Section -->
      <div class="input-section">
        <div class="input-container">
          <input
            type="text"
            class="analysis-input"
            bind:value={analysisQuery}
            placeholder={getPlaceholder()}
            on:keypress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            class="analysis-btn"
            on:click={handleAnalysis}
            disabled={isLoading || !analysisQuery.trim()}
          >
            {#if isLoading}
              <span class="spinner"></span>
            {:else if activeTab === "seo"}
              🔍
            {:else if activeTab === "performance"}
              ⚡
            {:else}
              🏆
            {/if}
          </button>
        </div>
      </div>

      <!-- Results Display -->
      {#if results || error}
        <div class="results-container">
          {#if error}
            <div class="error-message">
              <span class="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          {:else if results}
            <div class="results-display">
              <!-- Query Info -->
              <div class="query-info">
                <strong>Analiza:</strong>
                {results.analyzedUrl || results.domain || "N/A"}
                <span class="analysis-type">{getTabLabel(activeTab)}</span>
              </div>

              <!-- SEO Results -->
              {#if activeTab === "seo" && results.seo}
                <div class="seo-results">
                  <div class="score-section">
                    <h4>📊 SEO Score</h4>
                    <div class="score-display">
                      <span
                        class="score-value"
                        style="color: {getScoreColor(results.seo.overallScore)}"
                      >
                        {results.seo.overallScore}/100
                      </span>
                    </div>
                  </div>

                  <div class="checks-section">
                    <h4>🔍 Detailed Checks</h4>
                    {#each results.seo.checks as check}
                      <div class="check-item">
                        <span
                          class="check-status"
                          class:passed={check.passed}
                          class:failed={!check.passed}
                        >
                          {check.passed ? "✅" : "❌"}
                        </span>
                        <span class="check-name">{check.name}</span>
                        <span class="check-description"
                          >{check.description}</span
                        >
                      </div>
                    {/each}
                  </div>

                  {#if results.seo.recommendations}
                    <div class="recommendations-section">
                      <h4>💡 Recommendations</h4>
                      {#each results.seo.recommendations as rec}
                        <div class="recommendation-item">
                          <span
                            class="rec-priority"
                            class:high={rec.priority === "high"}
                            class:medium={rec.priority === "medium"}
                          >
                            {rec.priority === "high"
                              ? "🔴"
                              : rec.priority === "medium"
                                ? "🟡"
                                : "🟢"}
                          </span>
                          <span class="rec-text">{rec.text}</span>
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/if}

              <!-- Performance Results -->
              {#if activeTab === "performance" && results.performance}
                <div class="performance-results">
                  <div class="metrics-grid">
                    {#each results.performance.metrics as metric}
                      <div class="metric-card">
                        <div class="metric-name">{metric.name}</div>
                        <div
                          class="metric-value"
                          style="color: {getScoreColor(metric.score)}"
                        >
                          {metric.value}
                        </div>
                        <div class="metric-score">{metric.score}/100</div>
                      </div>
                    {/each}
                  </div>

                  {#if results.performance.opportunities}
                    <div class="opportunities-section">
                      <h4>🚀 Performance Opportunities</h4>
                      {#each results.performance.opportunities as opp}
                        <div class="opportunity-item">
                          <span
                            class="opp-impact"
                            style="color: {getScoreColor(100 - opp.impact)}"
                          >
                            Impact: {opp.impact}
                          </span>
                          <span class="opp-description">{opp.description}</span>
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/if}

              <!-- Competitive Results -->
              {#if activeTab === "competitive" && results.competitive}
                <div class="competitive-results">
                  {#if results.competitive.keywords}
                    <div class="keywords-section">
                      <h4>🔑 Top Keywords</h4>
                      {#each results.competitive.keywords.slice(0, 5) as keyword}
                        <div class="keyword-item">
                          <span class="keyword-text">{keyword.keyword}</span>
                          <span class="keyword-position"
                            >#{keyword.position}</span
                          >
                          <span class="keyword-volume">{keyword.volume}</span>
                        </div>
                      {/each}
                    </div>
                  {/if}

                  {#if results.competitive.techStack}
                    <div class="tech-section">
                      <h4>🛠️ Technology Stack</h4>
                      <div class="tech-tags">
                        {#each results.competitive.techStack as tech}
                          <span class="tech-tag">{tech}</span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              {/if}

              <!-- Usage Info -->
              {#if results.usage}
                <div class="usage-info">
                  <span>Czas analizy: {results.usage.analysisTime}ms</span>
                  <span>API calls: {results.usage.apiCalls}</span>
                </div>
              {/if}
            </div>
          {/if}

          <div class="actions">
            <button class="clear-btn" on:click={clearResults}
              >Wyczyść wyniki</button
            >
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .webmaster-widget {
    border: 1px solid var(--color-edge, #ccc);
    padding: 20px;
    margin: 16px 0;
    background: var(--color-background, transparent);
    transition: all 0.3s ease;
  }

  .webmaster-widget:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .webmaster-widget.expanded {
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
    border-radius: 6px;
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
    gap: 16px;
  }

  /* Tabs Navigation */
  .tabs-nav {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid var(--color-edge, #ccc);
  }

  .tab-btn {
    background: var(--color-secondary, #f5f5f5);
    border: 1px solid var(--color-edge, #ccc);
    color: var(--color-secondary-foreground, #000);
    padding: 8px 16px;
    border-radius: 6px 6px 0 0;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.3s ease;
    border-bottom: none;
  }

  .tab-btn.active {
    background: var(--color-background, #fff);
    color: var(--color-primary, #666);
    border-color: var(--color-primary, #666);
    border-bottom: 1px solid var(--color-background, #fff);
    margin-bottom: -1px;
  }

  .tab-btn:hover:not(.active) {
    filter: brightness(1.05);
  }

  /* Input Section */
  .input-section {
    width: 100%;
  }

  .input-container {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .analysis-input {
    flex: 1;
    background: var(--color-input-background, transparent);
    border: 1px solid var(--color-edge, #ccc);
    border-radius: 8px;
    padding: 10px 12px;
    color: var(--color-foreground, #000);
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .analysis-input:focus {
    outline: none;
    border-color: var(--color-primary, #666);
  }

  .analysis-btn {
    background: var(--color-primary, #666);
    color: var(--color-primary-foreground, #fff);
    border: 1px solid var(--color-edge, #ccc);
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 50px;
  }

  .analysis-btn:hover:not(:disabled) {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .analysis-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Results */
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
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .analysis-type {
    font-size: 0.8rem;
    color: var(--color-muted-foreground, #666);
  }

  /* SEO Results */
  .seo-results {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .score-section {
    text-align: center;
  }

  .score-display {
    font-size: 2rem;
    font-weight: bold;
    margin-top: 8px;
  }

  .checks-section,
  .recommendations-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .check-item,
  .recommendation-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background: var(--color-background, #fff);
    border-radius: 4px;
    border: 1px solid var(--color-edge, #ccc);
  }

  .check-description,
  .rec-text {
    font-size: 0.85rem;
    color: var(--color-muted-foreground, #666);
  }

  /* Performance Results */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .metric-card {
    background: var(--color-background, #fff);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--color-edge, #ccc);
    text-align: center;
  }

  .metric-name {
    font-size: 0.8rem;
    color: var(--color-muted-foreground, #666);
    margin-bottom: 4px;
  }

  .metric-value {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 2px;
  }

  .metric-score {
    font-size: 0.75rem;
    color: var(--color-muted-foreground, #666);
  }

  /* Competitive Results */
  .competitive-results {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .keyword-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background: var(--color-background, #fff);
    border-radius: 4px;
    border: 1px solid var(--color-edge, #ccc);
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tech-tag {
    background: var(--color-primary, #666);
    color: var(--color-primary-foreground, #fff);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
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

  .error-message p {
    margin: 0;
    color: var(--color-destructive, #dc2626);
    font-size: 0.9rem;
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
    .webmaster-widget {
      padding: 16px;
    }

    .tabs-nav {
      flex-direction: column;
      gap: 2px;
    }

    .tab-btn {
      border-radius: 6px;
      border-bottom: 1px solid var(--color-edge, #ccc);
      margin-bottom: 0;
    }

    .metrics-grid {
      grid-template-columns: 1fr;
    }

    .keyword-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
</style>
