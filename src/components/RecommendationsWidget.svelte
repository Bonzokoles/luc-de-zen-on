<script lang="ts">
  import { onMount } from 'svelte';
  
  let preferences = '';
  let history = '';
  let recommendations: any[] = [];
  let loading = false;
  let error = '';
  
  // Sample user preferences for demo
  const samplePreferences = [
    'technologie, nowoczesne rozwiązania',
    'marketing cyfrowy, social media',
    'e-commerce, sprzedaż online',
    'automatyzacja procesów biznesowych',
    'analityka danych, AI',
    'rozwiązania chmurowe, SaaS'
  ];

  async function fetchRecommendations() {
    if (!preferences.trim()) {
      error = 'Proszę podać preferencje użytkownika';
      return;
    }

    loading = true;
    error = '';
    
    try {
      const historyArray = history.trim() ? history.split(',').map(item => item.trim()) : [];
      
      const res = await fetch('/api/get-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          preferences, 
          history: historyArray,
          userProfile: { timestamp: new Date().toISOString() }
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        recommendations = data.recommendations || [];
      } else {
        error = data.error || 'Wystąpił błąd podczas generowania rekomendacji';
      }
    } catch (err) {
      error = 'Błąd połączenia z serwerem';
      console.error('Error:', err);
    } finally {
      loading = false;
    }
  }

  function refreshRecommendations() {
    recommendations = [];
    fetchRecommendations();
  }

  function loadSamplePreferences(sample: string) {
    preferences = sample;
    history = 'wcześniejsze zakupy, przeglądane kategorie';
  }

  function getPriorityColor(priority: number) {
    if (priority >= 4) return 'border-green-400 bg-green-900/10';
    if (priority >= 3) return 'border-yellow-400 bg-yellow-900/10';
    return 'border-gray-500 bg-gray-900/10';
  }

  function getPriorityText(priority: number) {
    if (priority >= 4) return 'Wysoki priorytet';
    if (priority >= 3) return 'Średni priorytet';
    return 'Niski priorytet';
  }
</script>

<div class="worker-card bg-black border border-cyan-500/30 p-6 rounded-lg shadow-2xl">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-cyan-300 mb-2 uppercase tracking-wider">Personalizowane rekomendacje</h2>
    <p class="text-gray-400">System rekomendacji produktów i usług oparty na preferencjach użytkownika</p>
  </div>

  <div class="space-y-4">
    <!-- Preferences input -->
    <div>
      <label for="preferences" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">
        Preferencje użytkownika
      </label>
      <textarea
        id="preferences"
        bind:value={preferences}
        placeholder="Wpisz preferencje użytkownika (np. technologie, marketing, e-commerce)..."
        rows="3"
        class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
      ></textarea>
      
      <!-- Sample preferences -->
      <div class="mt-2 flex flex-wrap gap-2">
        <span class="text-sm text-gray-400 uppercase tracking-wide">Przykłady:</span>
        {#each samplePreferences as sample}
          <button
            on:click={() => loadSamplePreferences(sample)}
            class="px-2 py-1 bg-gray-800/50 border border-gray-600/30 text-cyan-400 rounded text-xs hover:bg-gray-700/50 hover:border-cyan-500/50 transition-all duration-200 font-mono"
          >
            {sample}
          </button>
        {/each}
      </div>
    </div>

    <!-- History input -->
    <div>
      <label for="history" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">
        Historia użytkownika (opcjonalnie)
      </label>
      <input
        id="history"
        bind:value={history}
        placeholder="Historia zakupów, odwiedzonych stron (oddziel przecinkami)..."
        class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
      />
    </div>

    <!-- Action buttons -->
    <div class="flex gap-4">
      <button
        on:click={fetchRecommendations}
        disabled={loading || !preferences.trim()}
        class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-cyan-500/50 uppercase tracking-wide"
      >
        {loading ? 'Generuję...' : 'Generuj rekomendacje'}
      </button>
      
      {#if recommendations.length > 0}
        <button
          on:click={refreshRecommendations}
          disabled={loading}
          class="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg font-semibold hover:bg-gray-600/50 hover:border-gray-500/50 transition-all duration-300 disabled:opacity-50 uppercase tracking-wide"
        >
          Odśwież
        </button>
      {/if}
    </div>

    <!-- Error message -->
    {#if error}
      <div class="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 font-mono">
        {error}
      </div>
    {/if}

    <!-- Loading state -->
    {#if loading}
      <div class="text-center py-8">
        <div class="text-cyan-400 mb-4">
          <div class="w-12 h-12 mx-auto border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
        <p class="text-cyan-300 uppercase tracking-wide">Analizuję preferencje i generuję rekomendacje...</p>
      </div>
    {/if}

    <!-- Recommendations display -->
    {#if recommendations.length > 0 && !loading}
      <div class="mt-6">
        <h3 class="text-lg font-semibold text-cyan-300 mb-4 uppercase tracking-wider">
          Rekomendacje dla Ciebie ({recommendations.length})
        </h3>
        
        <div class="grid gap-4">
          {#each recommendations as rec, idx}
            <div class="p-4 rounded-lg border {getPriorityColor(rec.priority || 3)} transition-all duration-300 hover:shadow-xl hover:border-opacity-80 bg-gray-900/20">
              <div class="flex justify-between items-start mb-3">
                <h4 class="text-white font-bold text-lg uppercase tracking-wide">{rec.title}</h4>
                {#if rec.priority}
                  <span class="px-2 py-1 bg-gray-800/50 border border-gray-600/30 text-xs rounded text-gray-300 uppercase tracking-wide">
                    {getPriorityText(rec.priority)}
                  </span>
                {/if}
              </div>
              
              <p class="text-gray-300 mb-3 leading-relaxed font-mono text-sm">{rec.description}</p>
              
              {#if rec.reason}
                <div class="mb-3">
                  <span class="text-cyan-400 text-sm font-semibold uppercase tracking-wide">Dlaczego dla Ciebie:</span>
                  <p class="text-gray-400 text-sm italic font-mono">{rec.reason}</p>
                </div>
              {/if}
              
              {#if rec.category}
                <div class="flex justify-between items-center">
                  <span class="px-3 py-1 bg-cyan-900/20 border border-cyan-500/30 text-cyan-300 text-xs rounded uppercase tracking-wide font-semibold">
                    {rec.category}
                  </span>
                  <button class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-sm rounded hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 uppercase tracking-wide font-semibold border border-cyan-500/50">
                    Dowiedz się więcej
                  </button>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Empty state -->
    {#if !loading && recommendations.length === 0 && preferences}
      <div class="text-center py-8 text-gray-500">
        <div class="text-4xl mb-2">🤖</div>
        <p class="font-mono uppercase tracking-wide">Brak rekomendacji dla podanych preferencji. Spróbuj ponownie z innymi danymi.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .worker-card {
    background: linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.9) 100%);
    backdrop-filter: blur(10px);
  }
</style>
