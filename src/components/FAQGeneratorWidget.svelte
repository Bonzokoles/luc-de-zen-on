<script>
  let knowledgeBase = '';
  let faqItems = [];
  let loading = false;
  let error = '';

  async function generateFAQ() {
    if (!knowledgeBase.trim()) {
      error = 'Proszę wpisać bazę wiedzy';
      return;
    }

    loading = true;
    error = '';
    
    try {
      const response = await fetch('/api/faq-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ knowledgeBase }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Błąd podczas generowania FAQ');
      }
      
      faqItems = data.faq;
    } catch (err) {
      error = err.message;
      console.error('FAQ generation error:', err);
    } finally {
      loading = false;
    }
  }

  function clearAll() {
    knowledgeBase = '';
    faqItems = [];
    error = '';
  }

  function getFaqAsText() {
      return faqItems.map(item => `Q: ${item.question}\n\nA: ${item.answer}`).join('\n\n---\n\n');
  }
</script>

<div class="faq-widget-container">
  <h2 class="widget-title">🤖 Generator FAQ dynamiczny</h2>
  
  <div class="space-y-4">
    <div>
      <label for="knowledge-base" class="block text-sm font-medium mb-2">
        Baza wiedzy (tekst źródłowy):
      </label>
      <textarea
        id="knowledge-base"
        bind:value={knowledgeBase}
        rows="8"
        placeholder="Wklej tutaj treść bazy wiedzy, dokumentację, instrukcje lub inne materiały z których ma zostać wygenerowane FAQ..."
        class="widget-textarea"
      ></textarea>
    </div>

    <div class="flex gap-3">
      <button
        on:click={generateFAQ}
        disabled={loading || !knowledgeBase.trim()}
        class="action-btn primary"
      >
        {#if loading}
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-cyan-300 border-t-transparent"></div>
          Generuję FAQ...
        {:else}
          ⚡ Generuj FAQ
        {/if}
      </button>

      <button
        on:click={clearAll}
        class="action-btn secondary"
      >
        🗑️ Wyczyść
      </button>
    </div>

    {#if error}
      <div class="error-container">
        <p class="error-text">❌ {error}</p>
      </div>
    {/if}

    {#if faqItems.length > 0}
      <div class="result-container">
        <div class="result-header">
          <h3 class="result-title">📋 Wygenerowane FAQ:</h3>
        </div>
        <div class="result-content">
          {#each faqItems as item, i (item.id)}
            <div class="faq-item">
              <h4 class="question">{i + 1}. {item.question}</h4>
              <p class="answer">{item.answer}</p>
            </div>
          {/each}
        </div>
        <div class="result-footer">
          <button
            on:click={() => navigator.clipboard.writeText(getFaqAsText())}
            class="copy-btn"
          >
            📋 Skopiuj wszystko jako tekst
          </button>
        </div>
      </div>
    {/if}

    <div class="tip-text">
      💡 Tip: Im bardziej szczegółowa baza wiedzy, tym lepsze FAQ zostanie wygenerowane
    </div>
  </div>
</div>

<style>
  .faq-widget-container {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
    box-shadow: 0 1px 26px rgba(20, 215, 230, 0.2);
    padding: 24px;
    transition: all 0.3s ease;
    color: #94aec4;
  }
  .widget-title {
    color: #00d7ef;
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  .widget-textarea {
    width: 100%;
    padding: 12px;
    background: #131e28;
    border: 2px solid rgba(0, 217, 255, 0.4);
    color: #00d7ef;
    font-size: 1rem;
  }
  .action-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 0px !important;
    font-weight: 600;
    cursor: pointer;
  }
  .action-btn.primary {
    background-color: #164e63;
    color: white;
  }
  .action-btn.primary:disabled {
    background-color: #0f2027;
    color: #566973;
    cursor: not-allowed;
  }
  .action-btn.secondary {
    background-color: rgba(0, 0, 0, 0.3);
    color: #00d7ef;
    border: 1px solid rgba(0, 217, 255, 0.4);
  }
  .error-container {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    padding: 16px;
  }
  .result-container {
    border: 1px solid rgba(0, 217, 255, 0.3);
  }
  .result-header {
    background: rgba(0, 217, 255, 0.1);
    padding: 12px 16px;
  }
  .result-content {
    padding: 16px;
    max-height: 400px;
    overflow-y: auto;
  }
  .faq-item {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(0, 217, 255, 0.2);
  }
  .faq-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
  }
  .question {
      color: #00d7ef;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
  }
  .answer {
      color: #94aec4;
      margin: 0;
      white-space: pre-wrap;
  }
  .result-footer {
    background: rgba(0, 217, 255, 0.05);
    padding: 12px 16px;
    text-align: right;
  }
  .copy-btn {
    background: none;
    border: none;
    color: #00d7ef;
    cursor: pointer;
  }
  .tip-text {
    color: rgba(0, 217, 255, 0.6);
    font-size: 0.8rem;
    text-align: center;
    margin-top: 16px;
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); } to { transform: rotate(360deg); }
  }
</style>