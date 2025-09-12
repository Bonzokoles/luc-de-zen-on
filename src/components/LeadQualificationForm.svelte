<script lang="ts">
  import { onMount } from 'svelte';
  
  let name = '';
  let email = '';
  let message = '';
  let phone = '';
  let company = '';
  let budget = '';
  let loading = false;
  let error = '';
  let response = '';
  let leadScore = '';
  let priority = 0;
  let category = '';
  let suggestedAction = '';

  const budgetOptions = [
    '< 5000 PLN',
    '5000 - 15000 PLN', 
    '15000 - 50000 PLN',
    '50000 - 100000 PLN',
    '> 100000 PLN',
    'Nie określono'
  ];

  async function submitLead() {
    if (!name.trim() || !email.trim() || !message.trim()) {
      error = 'Proszę wypełnić wszystkie wymagane pola';
      return;
    }

    loading = true;
    error = '';
    response = '';
    
    try {
      const res = await fetch('/api/qualify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          message, 
          phone, 
          company, 
          budget 
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        response = data.reply;
        leadScore = data.leadScore;
        priority = data.priority;
        category = data.category;
        suggestedAction = data.suggestedAction;
      } else {
        error = data.error || 'Wystąpił błąd podczas przetwarzania zapytania';
      }
    } catch (err) {
      error = 'Błąd połączenia z serwerem';
      console.error('Error:', err);
    } finally {
      loading = false;
    }
  }

  function clearForm() {
    name = '';
    email = '';
    message = '';
    phone = '';
    company = '';
    budget = '';
    response = '';
    error = '';
    leadScore = '';
    priority = 0;
    category = '';
    suggestedAction = '';
  }

  function getScoreColor(score: string) {
    switch (score) {
      case 'WYSOKI': return 'text-green-400';
      case 'ŚREDNI': return 'text-yellow-400';
      case 'NISKI': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }

  function getPriorityColor(priority: number) {
    if (priority >= 4) return 'bg-green-500';
    if (priority >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  }
</script>

<div class="worker-card bg-black border border-cyan-500/30 p-6 rounded-lg shadow-2xl">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-cyan-300 mb-2 uppercase tracking-wider">Automatyzacja obsługi klienta</h2>
    <p class="text-gray-400">Inteligentny system kwalifikacji leadów z automatyczną odpowiedzią AI</p>
  </div>

  <div class="space-y-4">
    <!-- Required fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="name" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">
          Imię i nazwisko *
        </label>
        <input
          id="name"
          bind:value={name}
          placeholder="Jan Kowalski"
          required
          class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
        />
      </div>

      <div>
        <label for="email" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">
          E-mail *
        </label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="jan@example.com"
          required
          class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
        />
      </div>
    </div>

    <!-- Optional fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="phone" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">
          Telefon
        </label>
        <input
          id="phone"
          bind:value={phone}
          placeholder="+48 123 456 789"
          class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
        />
      </div>

      <div>
        <label for="company" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">
          Firma
        </label>
        <input
          id="company"
          bind:value={company}
          placeholder="Nazwa firmy"
          class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
        />
      </div>
    </div>

    <!-- Budget selection -->
    <div>
      <label for="budget" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">
        Budżet projektu
      </label>
      <select
        id="budget"
        bind:value={budget}
        class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
      >
        <option value="">Wybierz budżet...</option>
        {#each budgetOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>

    <!-- Message -->
    <div>
      <label for="message" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">
        Wiadomość *
      </label>
      <textarea
        id="message"
        bind:value={message}
        placeholder="Opisz swoje potrzeby i oczekiwania..."
        rows="4"
        required
        class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"
      ></textarea>
    </div>

    <!-- Action buttons -->
    <div class="flex gap-4">
      <button
        on:click={submitLead}
        disabled={loading || !name.trim() || !email.trim() || !message.trim()}
        class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-cyan-500/50 uppercase tracking-wide"
      >
        {loading ? 'Przetwarzam...' : 'Wyślij zapytanie'}
      </button>
      
      <button
        on:click={clearForm}
        class="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg font-semibold hover:bg-gray-600/50 hover:border-gray-500/50 transition-all duration-300 uppercase tracking-wide"
      >
        Wyczyść
      </button>
    </div>

    <!-- Error message -->
    {#if error}
      <div class="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 font-mono">
        ⚠️ {error}
      </div>
    {/if}

    <!-- Loading state -->
    {#if loading}
      <div class="text-center py-8">
        <div class="text-cyan-400 mb-4">
          <div class="w-12 h-12 mx-auto border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
        <p class="text-cyan-300 uppercase tracking-wide">Analizuję zapytanie i kwalifikuję lead...</p>
      </div>
    {/if}

    <!-- Response display -->
    {#if response && !loading}
      <div class="mt-6 p-6 bg-gray-900/40 border border-gray-600/30 rounded-lg">
        <h3 class="text-lg font-semibold text-cyan-300 mb-4 uppercase tracking-wider">
          Automatyczna odpowiedź AI
        </h3>
        
        <!-- Lead analysis summary -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="text-center p-3 bg-gray-800/30 border border-gray-600/20 rounded">
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Ocena Lead</div>
            <div class="text-sm font-bold {getScoreColor(leadScore)}">{leadScore}</div>
          </div>
          
          <div class="text-center p-3 bg-gray-800/30 border border-gray-600/20 rounded">
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Priorytet</div>
            <div class="flex items-center justify-center">
              <div class="w-2 h-2 rounded-full {getPriorityColor(priority)} mr-1"></div>
              <span class="text-sm font-bold text-white">{priority}/5</span>
            </div>
          </div>
          
          <div class="text-center p-3 bg-gray-800/30 border border-gray-600/20 rounded">
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Kategoria</div>
            <div class="text-sm font-bold text-cyan-300">{category}</div>
          </div>
          
          <div class="text-center p-3 bg-gray-800/30 border border-gray-600/20 rounded">
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Status</div>
            <div class="text-sm font-bold text-green-400">Przetworzone</div>
          </div>
        </div>

        <!-- AI Response -->
        <div class="mb-4">
          <h4 class="text-cyan-400 text-sm font-semibold uppercase tracking-wide mb-2">Odpowiedź dla klienta:</h4>
          <div class="p-4 bg-gray-800/40 border border-gray-600/30 rounded text-gray-100 leading-relaxed font-mono text-sm">
            {response}
          </div>
        </div>

        <!-- Suggested Action -->
        {#if suggestedAction}
          <div>
            <h4 class="text-cyan-400 text-sm font-semibold uppercase tracking-wide mb-2">Sugerowane działania:</h4>
            <div class="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-200 text-sm font-mono">
              💡 {suggestedAction}
            </div>
          </div>
        {/if}

        <!-- Contact info confirmation -->
        <div class="mt-4 p-3 bg-cyan-900/20 border border-cyan-500/30 rounded">
          <div class="text-cyan-300 text-xs uppercase tracking-wide mb-2">Dane kontaktowe zapisane:</div>
          <div class="text-gray-300 text-sm font-mono">
            {name} • {email} {phone ? `• ${phone}` : ''} {company ? `• ${company}` : ''}
          </div>
        </div>
      </div>
    {/if}

    <!-- Success message -->
    {#if response}
      <div class="p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-300 font-mono text-center">
        ✅ Zapytanie zostało przetworzone pomyślnie! Skontaktujemy się z Tobą wkrótce.
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
