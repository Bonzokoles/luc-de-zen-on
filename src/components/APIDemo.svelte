<script lang="ts">
  import { onMount } from "svelte";
  import { fetchFromWorker, postToWorker } from "../cloudflareApi";

  let chatResponse = "";
  let imageResponse = "";
  let loading = false;

  async function testChatAPI() {
    loading = true;
    try {
      const response = await postToWorker("/api/chat", {
        message: "Napisz krótki wiersz o AI",
      });
      chatResponse =
        response.message || response.result || "Odpowiedź otrzymana";
    } catch (error) {
      chatResponse = `Błąd: ${error.message}`;
    } finally {
      loading = false;
    }
  }

  async function testImageAPI() {
    loading = true;
    try {
      const response = await postToWorker("/api/generate-image", {
        prompt: "Beautiful sunset over mountains",
      });
      imageResponse = response.result || "Obrazek wygenerowany pomyślnie";
    } catch (error) {
      imageResponse = `Błąd: ${error.message}`;
    } finally {
      loading = false;
    }
  }

  async function testAnalyzeAPI() {
    loading = true;
    try {
      const response = await postToWorker("/api/data-analyze", {
        data: [1, 2, 3, 4, 5],
        analysis: "basic_stats",
      });
      console.log("Analysis result:", response);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      loading = false;
    }
  }
</script>

<div class="api-demo">
  <h3>🧪 API Demo - Cloudflare Workers</h3>
  <p class="demo-description">
    Demonstracja działania naszych API endpointów w środowisku Cloudflare
    Workers
  </p>

  <div class="demo-grid">
    <!-- Chat API Test -->
    <div class="demo-card">
      <h4>💬 Chat API Test</h4>
      <button class="demo-btn" on:click={testChatAPI} disabled={loading}>
        {#if loading}
          ⏳ Przetwarzanie...
        {:else}
          🚀 Test Chat API
        {/if}
      </button>

      {#if chatResponse}
        <div class="response-box">
          <strong>Odpowiedź:</strong>
          <p>{chatResponse}</p>
        </div>
      {/if}
    </div>

    <!-- Image API Test -->
    <div class="demo-card">
      <h4>🎨 Image Generator Test</h4>
      <button class="demo-btn" on:click={testImageAPI} disabled={loading}>
        {#if loading}
          ⏳ Generowanie...
        {:else}
          🎨 Test Image API
        {/if}
      </button>

      {#if imageResponse}
        <div class="response-box">
          <strong>Status:</strong>
          <p>{imageResponse}</p>
        </div>
      {/if}
    </div>

    <!-- Data Analyze Test -->
    <div class="demo-card">
      <h4>📊 Data Analysis Test</h4>
      <button class="demo-btn" on:click={testAnalyzeAPI} disabled={loading}>
        {#if loading}
          ⏳ Analizowanie...
        {:else}
          📊 Test Analyze API
        {/if}
      </button>

      <div class="response-box">
        <strong>Info:</strong>
        <p>Sprawdź konsolę przeglądarki (F12) aby zobaczyć wynik analizy</p>
      </div>
    </div>
  </div>

  <div class="integration-info">
    <h4>📋 Implementacja w kodzie:</h4>
    <pre class="code-example"><code
        >{`// Import API functions
import { postToWorker } from '../cloudflareApi';

// Chat API usage
const chatResponse = await postToWorker('/api/chat', {
  message: 'Your message here'
});

// Image generation usage  
const imageResponse = await postToWorker('/api/generate-image', {
  prompt: 'Your image description'
});

// Data analysis usage
const analysisResponse = await postToWorker('/api/data-analyze', {
  data: yourDataArray,
  analysis: 'basic_stats'
});`}</code
      ></pre>
  </div>

  <div class="features-list">
    <h4>✨ Funkcjonalności systemu:</h4>
    <ul>
      <li>🔄 Centralne API z obsługą CORS i błędów</li>
      <li>🎯 Jednolite endpointy dla wszystkich Workers</li>
      <li>🛡️ Walidacja danych i bezpieczne zapytania</li>
      <li>📊 Monitoring i logowanie aktywności</li>
      <li>⚡ Optymalizacja dla Cloudflare Edge</li>
      <li>🔧 Łatwa integracja z Svelte/Astro</li>
    </ul>
  </div>
</div>

<style>
  .api-demo {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .api-demo h3 {
    text-align: center;
    color: #2d3748;
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
  }

  .demo-description {
    text-align: center;
    color: #718096;
    margin-bottom: 2rem;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .demo-card {
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.2s;
  }

  .demo-card:hover {
    border-color: #cbd5e0;
    transform: translateY(-2px);
  }

  .demo-card h4 {
    margin: 0 0 1rem 0;
    color: #2d3748;
  }

  .demo-btn {
    width: 100%;
    padding: 0.75rem;
    background: #3182ce;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-bottom: 1rem;
  }

  .demo-btn:hover:not(:disabled) {
    background: #2c5aa0;
  }

  .demo-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .response-box {
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 1rem;
    font-size: 0.9rem;
  }

  .response-box strong {
    color: #2d3748;
  }

  .response-box p {
    margin: 0.5rem 0 0 0;
    color: #4a5568;
  }

  .integration-info {
    background: #1a202c;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
  }

  .integration-info h4 {
    color: #e2e8f0;
    margin: 0 0 1rem 0;
  }

  .code-example {
    background: #2d3748;
    border-radius: 6px;
    padding: 1rem;
    overflow-x: auto;
    margin: 0;
  }

  .code-example code {
    color: #e2e8f0;
    font-family: "Courier New", monospace;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .features-list {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .features-list h4 {
    margin: 0 0 1rem 0;
  }

  .features-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .features-list li {
    padding: 0.5rem 0;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    .api-demo {
      padding: 1rem;
      margin: 1rem;
    }

    .demo-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
