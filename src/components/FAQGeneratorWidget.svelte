<script>
  let knowledgeBase = '';
  let faq = '';
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
      const response = await fetch('/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ knowledgeBase }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Błąd podczas generowania FAQ');
      }
      
      faq = data.faq;
    } catch (err) {
      error = err.message;
      console.error('FAQ generation error:', err);
    } finally {
      loading = false;
    }
  }

  function clearAll() {
    knowledgeBase = '';
    faq = '';
    error = '';
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
        rows="6"
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

    {#if faq}
      <div class="result-container">
        <div class="result-header">
          <h3 class="result-title">📋 Wygenerowane FAQ:</h3>
        </div>
        <div class="result-content">
          <pre class="result-text">{faq}</pre>
        </div>
        <div class="result-footer">
          <button
            on:click={() => navigator.clipboard.writeText(faq)}
            class="copy-btn"
          >
            📋 Skopiuj do schowka
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

  .faq-widget-container:hover {
    border-color: #00d7ef;
    box-shadow: 0 4px 30px rgba(0, 217, 255, 0.4);
    transform: translateY(-2px);
  }

  .widget-title {
    color: #00d7ef;
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
    text-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
  }

  .widget-textarea {
    width: 100%;
    padding: 12px;
    background: #131e28;
    border: 2px solid rgba(0, 217, 255, 0.4);
    border-radius: 0px !important;
    color: #00d7ef;
    font-size: 1rem;
    transition: all 0.2s ease;
    resize: vertical;
    min-height: 120px;
  }

  .widget-textarea:focus {
    outline: none;
    border-color: #00d7ef;
    box-shadow: 0 0 12px rgba(0, 217, 255, 0.4);
  }

  .widget-textarea::placeholder {
    color: rgba(0, 217, 255, 0.5);
  }

  .action-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 0px !important;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-btn.primary {
    background-color: #164e63;
    color: white;
    box-shadow: 0 2px 12px rgba(0, 217, 255, 0.2);
  }

  .action-btn.primary:hover:not(:disabled) {
    background-color: #1be1ff;
    color: #000;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 217, 255, 0.4);
  }

  .action-btn.primary:disabled {
    background-color: #0f2027;
    color: #566973;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .action-btn.secondary {
    background-color: rgba(0, 0, 0, 0.3);
    color: #00d7ef;
    border: 1px solid rgba(0, 217, 255, 0.4);
  }

  .action-btn.secondary:hover {
    background-color: rgba(0, 217, 255, 0.1);
    border-color: #00d7ef;
    transform: translateY(-1px);
  }

  .error-container {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 0px !important;
    padding: 16px;
  }

  .error-text {
    color: #fca5a5;
    margin: 0;
  }

  .result-container {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
    overflow: hidden;
  }

  .result-header {
    background: rgba(0, 217, 255, 0.1);
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0, 217, 255, 0.3);
  }

  .result-title {
    color: #00d7ef;
    font-weight: 600;
    margin: 0;
  }

  .result-content {
    padding: 16px;
    max-height: 400px;
    overflow-y: auto;
  }

  .result-text {
    color: #94aec4;
    font-family: monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
    white-space: pre-wrap;
  }

  .result-footer {
    background: rgba(0, 217, 255, 0.05);
    padding: 12px 16px;
    border-top: 1px solid rgba(0, 217, 255, 0.3);
    text-align: right;
  }

  .copy-btn {
    background: none;
    border: none;
    color: #00d7ef;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 4px 8px;
    transition: all 0.2s ease;
    border-radius: 0px !important;
  }

  .copy-btn:hover {
    color: #1be1ff;
    transform: scale(1.05);
  }

  .tip-text {
    color: rgba(0, 217, 255, 0.6);
    font-size: 0.8rem;
    font-style: italic;
    text-align: center;
    margin-top: 16px;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .faq-widget-container {
      padding: 16px;
    }
    
    .widget-title {
      font-size: 1.25rem;
    }
    
    .action-btn {
      padding: 10px 20px;
      font-size: 0.9rem;
    }
  }
</style>
