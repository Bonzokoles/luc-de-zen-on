<script>
  let form = {
    description: "",
    email: "",
    priority: "medium",
    category: "",
  };
  let result = null;
  let loading = false;
  let error = "";
  let ticketStatus = null;
  let loadingStatus = false;

  async function submitTicket() {
    // Basic validation
    if (!form.description || !form.email) {
      error = "Opis problemu i email są wymagane";
      return;
    }

    loading = true;
    error = "";
    result = null;

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Błąd podczas tworzenia ticket");
      }

      result = data;
    } catch (err) {
      error = err.message;
      console.error("Ticket submission error:", err);
    } finally {
      loading = false;
    }
  }

  async function checkTicketStatus(ticketId) {
    loadingStatus = true;
    ticketStatus = null;

    try {
      const response = await fetch(
        `/api/tickets?id=${encodeURIComponent(ticketId)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Błąd podczas pobierania statusu");
      }

      ticketStatus = data;
    } catch (err) {
      error = err.message;
      console.error("Status check error:", err);
    } finally {
      loadingStatus = false;
    }
  }

  function clearAll() {
    form = {
      description: "",
      email: "",
      priority: "medium",
      category: "",
    };
    result = null;
    error = "";
    ticketStatus = null;
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-orange-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-cyan-400";
    }
  }

  function getTeamName(team) {
    switch (team) {
      case "tech-support":
        return "Wsparcie Techniczne";
      case "billing":
        return "Dział Płatności";
      case "sales":
        return "Dział Sprzedaży";
      case "other":
        return "Zespół Ogólny";
      default:
        return team;
    }
  }
</script>

<div class="ticket-widget-container">
  <h2 class="widget-title">🎫 System zgłoszeń i ticketów</h2>

  <div class="space-y-4">
    <!-- Ticket Submission Form -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-2">Email *</label>
        <input
          type="email"
          bind:value={form.email}
          placeholder="twoj.email@example.com"
          class="widget-input"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Priorytet</label>
        <select bind:value={form.priority} class="widget-select">
          <option value="low">🟢 Niski</option>
          <option value="medium">🟡 Średni</option>
          <option value="high">🟠 Wysoki</option>
          <option value="critical">🔴 Krytyczny</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2"
        >Kategoria (opcjonalna)</label
      >
      <select bind:value={form.category} class="widget-select">
        <option value="">Wybierz kategorię</option>
        <option value="bug">🐛 Błąd w systemie</option>
        <option value="feature-request">✨ Prośba o funkcję</option>
        <option value="question">❓ Pytanie</option>
        <option value="billing">💰 Płatności/Faktury</option>
        <option value="integration">🔗 Integracje</option>
        <option value="performance">⚡ Wydajność</option>
        <option value="other">🤔 Inne</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Opis problemu *</label>
      <textarea
        bind:value={form.description}
        rows="6"
        placeholder="Opisz szczegółowo swój problem lub zapytanie. Im więcej informacji podasz, tym szybciej będziemy mogli pomóc..."
        class="widget-textarea"
      ></textarea>
    </div>

    <div class="flex gap-3">
      <button
        on:click={submitTicket}
        disabled={loading || !form.description || !form.email}
        class="action-btn primary"
      >
        {#if loading}
          <div
            class="animate-spin rounded-full h-4 w-4 border-2 border-cyan-300 border-t-transparent"
          ></div>
          Tworzę ticket...
        {:else}
          🎫 Wyślij zgłoszenie
        {/if}
      </button>

      <button on:click={clearAll} class="action-btn secondary">
        🗑️ Wyczyść
      </button>
    </div>

    {#if error}
      <div class="error-container">
        <p class="error-text">❌ {error}</p>
      </div>
    {/if}

    {#if result}
      <div class="result-container">
        <div class="result-header">
          <h3 class="result-title">✅ Zgłoszenie zostało utworzone</h3>
        </div>
        <div class="result-content">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-sm text-gray-400 mb-1">Numer zgłoszenia:</p>
              <p class="font-mono text-cyan-300 font-bold">{result.ticketId}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400 mb-1">Status:</p>
              <p class="text-green-400 font-medium">Utworzone</p>
            </div>
            {#if result.classification}
              <div>
                <p class="text-sm text-gray-400 mb-1">Przypisane do zespołu:</p>
                <p class="text-cyan-300 font-medium">
                  {getTeamName(result.classification.team)}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-400 mb-1">Priorytet:</p>
                <p
                  class="{getPriorityColor(
                    result.classification.priority
                  )} font-medium capitalize"
                >
                  {result.classification.priority}
                </p>
              </div>
            {/if}
          </div>

          {#if result.classification?.summary}
            <div class="bg-gray-900 p-3 rounded-lg mb-3">
              <p class="text-sm text-gray-400 mb-1">Podsumowanie AI:</p>
              <p class="text-cyan-100">{result.classification.summary}</p>
            </div>
          {/if}

          <div class="flex gap-2">
            <button
              on:click={() => checkTicketStatus(result.ticketId)}
              disabled={loadingStatus}
              class="bg-blue-700 hover:bg-blue-600 disabled:bg-gray-700 px-4 py-2 rounded text-sm transition-colors duration-200 flex items-center gap-2"
            >
              {#if loadingStatus}
                <div
                  class="animate-spin rounded-full h-3 w-3 border-2 border-blue-300 border-t-transparent"
                ></div>
              {/if}
              📊 Sprawdź status
            </button>

            <button
              on:click={() => navigator.clipboard.writeText(result.ticketId)}
              class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition-colors duration-200"
            >
              📋 Kopiuj ID
            </button>
          </div>
        </div>
      </div>
    {/if}

    {#if ticketStatus}
      <div class="bg-blue-900/30 border border-blue-500 rounded-lg">
        <div
          class="bg-blue-800/50 px-4 py-2 rounded-t-lg border-b border-blue-500"
        >
          <h3 class="font-medium text-blue-300">📊 Status zgłoszenia</h3>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-sm text-gray-400 mb-1">Numer:</p>
              <p class="font-mono text-cyan-300">{ticketStatus.ticketId}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400 mb-1">Status:</p>
              <p class="text-green-400 capitalize font-medium">
                {ticketStatus.status}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-400 mb-1">Zespół:</p>
              <p class="text-cyan-300">{getTeamName(ticketStatus.team)}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400 mb-1">Ostatnia aktualizacja:</p>
              <p class="text-gray-300 text-sm">
                {new Date(ticketStatus.lastUpdate).toLocaleString()}
              </p>
            </div>
          </div>

          {#if ticketStatus.updates?.length}
            <div class="bg-gray-900 p-3 rounded-lg">
              <p class="text-sm text-gray-400 mb-2">Historia aktualizacji:</p>
              {#each ticketStatus.updates as update}
                <div class="text-sm mb-2 last:mb-0">
                  <span class="text-gray-400"
                    >{new Date(update.timestamp).toLocaleString()}</span
                  >
                  <span class="text-cyan-100 ml-2">→ {update.message}</span>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <div class="text-xs text-gray-400 italic">
      💡 Tip: Podanie szczegółowego opisu problemu pomoże naszemu systemowi AI
      lepiej sklasyfikować zgłoszenie
    </div>
  </div>
</div>

<style>
  .ticket-widget-container {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
    box-shadow: 0 1px 26px rgba(20, 215, 230, 0.2);
    padding: 24px;
    transition: all 0.3s ease;
    color: #94aec4;
  }

  .ticket-widget-container:hover {
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

  .widget-input {
    width: 100%;
    padding: 12px;
    background: #131e28;
    border: 2px solid rgba(0, 217, 255, 0.4);
    border-radius: 0px !important;
    color: #00d7ef;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .widget-input:focus {
    outline: none;
    border-color: #00d7ef;
    box-shadow: 0 0 12px rgba(0, 217, 255, 0.4);
  }

  .widget-input::placeholder {
    color: rgba(0, 217, 255, 0.5);
  }

  .widget-select {
    width: 100%;
    padding: 12px;
    background: #131e28;
    border: 2px solid rgba(0, 217, 255, 0.4);
    border-radius: 0px !important;
    color: #00d7ef;
    font-size: 1rem;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .widget-select:focus {
    outline: none;
    border-color: #00d7ef;
    box-shadow: 0 0 12px rgba(0, 217, 255, 0.4);
  }

  .widget-select option {
    background: #131e28;
    color: #00d7ef;
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
  }

  .tip-text {
    color: rgba(0, 217, 255, 0.6);
    font-size: 0.75rem;
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
    .ticket-widget-container {
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
