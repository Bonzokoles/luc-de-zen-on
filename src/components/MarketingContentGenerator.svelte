<script lang="ts">
<<<<<<< HEAD
  import { onMount } from 'svelte';
  
  let prompt = '';
  let contentType = 'post na social media';
  let output = '';
  let loading = false;
  let error = '';

  const contentTypes = [
    'post na social media',
    'e-mail marketingowy',
    'opis produktu',
    'artykuł na blog',
    'treść reklamowa',
    'newsletter'
=======
  import { onMount } from "svelte";

  let prompt = "";
  let contentType = "post na social media";
  let output = "";
  let loading = false;
  let error = "";

  const contentTypes = [
    "post na social media",
    "e-mail marketingowy",
    "opis produktu",
    "artykuł na blog",
    "treść reklamowa",
    "newsletter",
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
  ];

  async function generateContent() {
    if (!prompt.trim()) {
<<<<<<< HEAD
      error = 'Proszę wpisać temat treści';
=======
      error = "Proszę wpisać temat treści";
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
      return;
    }

    loading = true;
<<<<<<< HEAD
    error = '';
    
    try {
      const res = await fetch('/api/generate-marketing-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, contentType }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        output = data.text;
      } else {
        error = data.error || 'Wystąpił błąd podczas generowania treści';
      }
    } catch (err) {
      error = 'Błąd połączenia z serwerem';
      console.error('Error:', err);
=======
    error = "";

    try {
      const res = await fetch("/api/generate-marketing-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, contentType }),
      });

      const data = await res.json();

      if (data.success) {
        output = data.text;
      } else {
        error = data.error || "Wystąpił błąd podczas generowania treści";
      }
    } catch (err) {
      error = "Błąd połączenia z serwerem";
      console.error("Error:", err);
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
    } finally {
      loading = false;
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(output);
    // You could add a toast notification here
  }

  function clearForm() {
<<<<<<< HEAD
    prompt = '';
    output = '';
    error = '';
  }
</script>

<div class="worker-card bg-black border border-cyan-500/30 p-6 rounded-lg shadow-2xl">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-cyan-300 mb-2 uppercase tracking-wider">Generator treści marketingowych</h2>
    <p class="text-gray-400">Automatyczne generowanie profesjonalnych treści marketingowych przy użyciu AI</p>
=======
    prompt = "";
    output = "";
    error = "";
  }
</script>

<div
  class="worker-card bg-black border border-cyan-500/30 p-6 rounded-lg shadow-2xl"
>
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-cyan-300 mb-2 uppercase tracking-wider">
      Generator treści marketingowych
    </h2>
    <p class="text-gray-400">
      Automatyczne generowanie profesjonalnych treści marketingowych przy użyciu
      AI
    </p>
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
  </div>

  <div class="space-y-4">
    <!-- Prompt input -->
    <div>
<<<<<<< HEAD
      <label for="prompt" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">
=======
      <label
        for="prompt"
        class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide"
      >
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
        Temat treści
      </label>
      <textarea
        id="prompt"
        bind:value={prompt}
        placeholder="Wpisz temat, o którym ma być treść marketingowa..."
        rows="4"
<<<<<<< HEAD
        class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
=======
        class="w-full p-3 bg-white border border-gray-600/50 rounded-lg text-black placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
      ></textarea>
    </div>

    <!-- Content type selector -->
    <div>
<<<<<<< HEAD
      <label for="contentType" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">
=======
      <label
        for="contentType"
        class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide"
      >
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
        Rodzaj treści
      </label>
      <select
        id="contentType"
        bind:value={contentType}
<<<<<<< HEAD
        class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
=======
        class="w-full p-3 bg-white border border-gray-600/50 rounded-lg text-black focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
      >
        {#each contentTypes as type}
          <option value={type}>{type}</option>
        {/each}
      </select>
    </div>

    <!-- Action buttons -->
    <div class="flex gap-4">
      <button
        on:click={generateContent}
        disabled={loading || !prompt.trim()}
        class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-cyan-500/50 uppercase tracking-wide"
      >
<<<<<<< HEAD
        {loading ? 'Generuję...' : 'Generuj treść'}
      </button>
      
=======
        {loading ? "Generuję..." : "Generuj treść"}
      </button>

>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
      <button
        on:click={clearForm}
        class="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg font-semibold hover:bg-gray-600/50 hover:border-gray-500/50 transition-all duration-300 uppercase tracking-wide"
      >
        Wyczyść
      </button>
    </div>

    <!-- Error message -->
    {#if error}
<<<<<<< HEAD
      <div class="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 font-mono">
=======
      <div
        class="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 font-mono"
      >
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
        ⚠️ {error}
      </div>
    {/if}

    <!-- Output -->
    {#if output}
      <div class="mt-6">
        <div class="flex justify-between items-center mb-2">
<<<<<<< HEAD
          <h3 class="text-lg font-semibold text-cyan-300 uppercase tracking-wider">Wygenerowana treść:</h3>
=======
          <h3
            class="text-lg font-semibold text-cyan-300 uppercase tracking-wider"
          >
            Wygenerowana treść:
          </h3>
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
          <button
            on:click={copyToClipboard}
            class="px-4 py-2 bg-gray-800/50 border border-gray-600/30 text-gray-300 rounded-md hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300 text-sm uppercase tracking-wide font-semibold"
          >
            Skopiuj
          </button>
        </div>
<<<<<<< HEAD
        <div class="p-4 bg-gray-800/40 border border-gray-600/30 rounded-lg whitespace-pre-wrap text-gray-100 leading-relaxed font-mono text-sm">
=======
        <div
          class="p-4 bg-gray-900 border border-gray-600/50 rounded-lg whitespace-pre-wrap text-gray-100 leading-relaxed font-mono text-sm"
        >
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
          {output}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .worker-card {
<<<<<<< HEAD
    background: linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.9) 100%);
=======
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(20, 20, 20, 0.9) 100%
    );
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
    backdrop-filter: blur(10px);
  }
</style>
