<script>
  let dataInput = "2023-01, 150\n2023-02, 160\n2023-03, 175\n2023-04, 170\n2023-05, 190\n2023-06, 210";
  let promptInput = "Analyze the sales trend and predict the value for the next month.";
  let analysis = null;
  let isLoading = false;
  let error = null;

  async function getAnalysis() {
    if (!dataInput.trim() || !promptInput.trim() || isLoading) return;
    isLoading = true;
    error = null;
    try {
      const response = await fetch("/api/analytics/prophet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataInput, prompt: promptInput }),
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      if (data.status === 'success') {
        analysis = data.analysis;
      } else {
        throw new Error(data.message || "Failed to get analysis.");
      }
    } catch (err) {
      error = err.message;
      analysis = null;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="analytics-widget">
  <h3>Analytics Prophet (AI Demo)</h3>
  <p>Wprowadź dane (np. w formacie CSV) oraz zapytanie w języku naturalnym, aby uzyskać analizę i prognozę od AI.</p>
  
  <div class="input-container">
    <textarea bind:value={dataInput} rows="6" placeholder="np. 2023-01, 150..."></textarea>
    <input type="text" bind:value={promptInput} placeholder="np. przeanalizuj trend sprzedaży..." />
    <button on:click={getAnalysis} disabled={isLoading}>
      {isLoading ? 'Analizuję...' : 'Uruchom Analizę'}
    </button>
  </div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  {#if analysis}
    <div class="results">
      <h4>Analiza AI:</h4>
      <pre>{analysis}</pre>
    </div>
  {/if}
</div>

<style>
  .analytics-widget {
    border: 1px solid #e5e7eb;
    padding: 1.5rem;
    border-radius: 8px;
    background-color: #fff;
  }
  .input-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  textarea, input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
  }
  textarea {
      font-family: monospace;
  }
  button {
    padding: 0.75rem 1.5rem;
    border: none;
    background-color: #3b82f6;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    align-self: flex-start;
  }
  button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
  }
  .error {
    color: #ef4444;
    margin-top: 1rem;
  }
  .results {
      margin-top: 1.5rem;
  }
  .results h4 {
    margin-top: 0;
    font-size: 1.25rem;
  }
  .results pre {
      background-color: #f9fafb;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 0.9rem;
      line-height: 1.6;
  }
</style>