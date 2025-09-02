<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let prompt = "";
  let isGenerating = false;
  let generatedImage = null;
  let error = null;

  async function generateImage() {
    if (!prompt.trim() || isGenerating) return;

    isGenerating = true;
    error = null;
    generatedImage = null;

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.imageUrl) {
        generatedImage = result.imageUrl;
        dispatch("imageGenerated", {
          url: result.imageUrl,
          prompt: prompt.trim(),
        });
      } else {
        throw new Error(result.error || "Nie udało się wygenerować obrazu");
      }
    } catch (err) {
      error = err.message;
      console.error("Image generation error:", err);
    } finally {
      isGenerating = false;
    }
  }

  function openFullGenerator() {
    window.open("/image-generator", "_blank");
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      generateImage();
    }
  }
</script>

<div class="image-generator-widget">
  <div class="widget-header">
    <h3>🎨 Generator Obrazów</h3>
    <span class="badge">Flux-1 Schnell</span>
  </div>

  <div class="widget-content">
    <div class="input-section">
      <textarea
        bind:value={prompt}
        on:keypress={handleKeyPress}
        placeholder="Opisz obraz, który chcesz wygenerować..."
        rows="3"
        disabled={isGenerating}
        class="prompt-input"
      ></textarea>

      <div class="action-buttons">
        <button
          on:click={generateImage}
          disabled={!prompt.trim() || isGenerating}
          class="generate-btn"
        >
          {#if isGenerating}
            <span class="spinner"></span>
            Generuję...
          {:else}
            🚀 Generuj
          {/if}
        </button>

        <button on:click={openFullGenerator} class="full-btn">
          Pełny Generator
        </button>
      </div>
    </div>

    {#if error}
      <div class="error-message">
        ❌ {error}
      </div>
    {/if}

    {#if generatedImage}
      <div class="result-section">
        <img
          src={generatedImage}
          alt="Wygenerowany obraz"
          class="generated-image"
        />
        <div class="image-actions">
          <a
            href={generatedImage}
            download="generated-image.png"
            class="download-btn"
          >
            💾 Pobierz
          </a>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .image-generator-widget {
    border: 1px solid var(--color-edge, #ccc);
    padding: 20px;
    margin: 16px 0;
    background: var(--color-background, transparent);
    transition: all 0.3s ease;
  }

  .image-generator-widget:hover {
    filter: brightness(1.05);
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

  .widget-header h3 {
    margin: 0;
    color: #00d9ff;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .badge {
    background: var(--color-primary, #666);
    color: var(--color-primary-foreground, #fff);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid var(--color-edge, #ccc);
  }

  .widget-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .input-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .prompt-input {
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 217, 255, 0.3);
    padding: 12px;
    color: #e0e0e0;
    font-size: 0.9rem;
    resize: vertical;
    min-height: 80px;
    transition: all 0.3s ease;
  }

  .prompt-input:focus {
    outline: none;
    border-color: #00d9ff;
    box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
  }

  .prompt-input::placeholder {
    color: #888;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .generate-btn,
  .full-btn {
    padding: 10px 16px;
    border: 1px solid var(--color-edge, #ccc);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .generate-btn {
    background: var(--color-primary, #666);
    color: var(--color-primary-foreground, #fff);
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .generate-btn:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  .generate-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .full-btn {
    background: var(--color-secondary, #f5f5f5);
    color: var(--color-secondary-foreground, #000);
  }

  .full-btn:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .error-message {
    background: var(--color-destructive-background, #fee);
    border: 1px solid var(--color-destructive, #dc2626);
    color: var(--color-destructive-foreground, #dc2626);
    padding: 12px;
    font-size: 0.9rem;
  }

  .result-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .generated-image {
    width: 100%;
    max-width: 300px;
    border: 1px solid var(--color-edge, #ccc);
    margin: 0 auto;
    display: block;
  }

  .image-actions {
    display: flex;
    justify-content: center;
  }

  .download-btn {
    background: var(--color-secondary, #f5f5f5);
    color: var(--color-secondary-foreground, #000);
    border: 1px solid var(--color-edge, #ccc);
    padding: 8px 12px;
    text-decoration: none;
    font-size: 0.85rem;
    transition: all 0.3s ease;
  }

  .download-btn:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .image-generator-widget {
      padding: 16px;
    }

    .action-buttons {
      flex-direction: column;
    }

    .full-btn {
      order: 2;
    }
  }
</style>
