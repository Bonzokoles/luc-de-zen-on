<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  // --- Stores for UI state ---
  const campaigns = writable([]);
  const performanceData = writable(null);
  const generatedCopy = writable([]);
  const generatedVisual = writable(null);
  const notifications = writable<
    { id: number; type: "success" | "error"; message: string }[]
  >([]);
  const isLoading = writable(false);
  const activeTab = writable("campaigns");

  let notificationId = 0;

  // --- Notification Helper ---
  function addNotification(
    type: "success" | "error",
    message: string,
    duration = 4000
  ) {
    const id = notificationId++;
    notifications.update((items) => [...items, { id, type, message }]);
    setTimeout(() => {
      notifications.update((items) => items.filter((n) => n.id !== id));
    }, duration);
  }

  // --- API Interaction ---
  async function callApi(action: string, data: any = {}) {
    isLoading.set(true);
    try {
      const response = await fetch("/api/agents/agent-12-marketing-maestro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || "Błąd serwera");
      }

      addNotification(
        "success",
        result.message || `Akcja "${action}" zakończona sukcesem!`
      );
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Nieznany błąd";
      addNotification("error", message);
      console.error(`API Call failed for action ${action}:`, error);
      return null;
    } finally {
      isLoading.set(false);
    }
  }

  // --- Component Actions ---
  async function createCampaign() {
    const result = await callApi("create-campaign", {
      name: "Nowa Kampania Produktowa",
      platform: "google-ads",
      budget: 5000,
      product: "Nasz Nowy Gadżet",
    });
    if (result && result.success) {
      campaigns.update((c) => [
        ...c,
        {
          id: result.campaignId,
          name: "Nowa Kampania Produktowa",
          status: "Aktywna",
        },
      ]);
    }
  }

  async function fetchPerformance() {
    const result = await callApi("get-campaign-performance", {
      campaignId: "camp_12345",
    });
    if (result && result.success) {
      performanceData.set(result.data);
    }
  }

  async function generateCopy() {
    const result = await callApi("generate-ad-copy", {
      product: "Innowacyjny Smartwatch",
      keywords: ["technologia", "fitness", "styl"],
    });
    if (result && result.success) {
      generatedCopy.set(result.copy);
    }
  }

  async function createVisual() {
    const result = await callApi("create-visual", {
      prompt:
        "Futurystyczny smartwatch na nadgarstku sportowca, neonowe akcenty, dynamiczne tło",
    });
    if (result && result.success) {
      generatedVisual.set(result.visualUrl);
    }
  }

  onMount(() => {
    // Initial data fetch
    callApi("test");
    fetchPerformance();
  });
</script>

<div
  class="marketing-maestro-container"
>
  <!-- Header -->
  <div class="agent-header">
    <div class="header-content">
      <div class="title-section">
        <div class="agent-icon">📊</div>
        <h2 class="agent-title">MARKETING MAESTRO</h2>
        <span class="agent-status">AKTYWNY</span>
      </div>
      <div class="loader-wrapper">
        <div class:is-loading={$isLoading} class="loader-indicator"></div>
      </div>
    </div>
    <div class="header-glow"></div>
  </div>

  <!-- Navigation Tabs -->
  <div class="cyber-tabs">
    <button
      class="cyber-tab"
      class:active={$activeTab === "campaigns"}
      on:click={() => activeTab.set("campaigns")}
    >
      <span class="tab-icon">🎯</span>
      <span class="tab-text">KAMPANIE</span>
    </button>
    <button
      class="cyber-tab"
      class:active={$activeTab === "performance"}
      on:click={() => activeTab.set("performance")}
    >
      <span class="tab-icon">📈</span>
      <span class="tab-text">WYDAJNOŚĆ</span>
    </button>
    <button
      class="cyber-tab"
      class:active={$activeTab === "creatives"}
      on:click={() => activeTab.set("creatives")}
    >
      <span class="tab-icon">🎨</span>
      <span class="tab-text">KREACJE</span>
    </button>
  </div>

  <!-- Content Panels -->
  <div class="content-matrix">
    {#if $activeTab === "campaigns"}
      <div class="campaign-panel cyber-panel">
        <div class="panel-header">
          <h3 class="panel-title">ZARZĄDZANIE KAMPANIAMI</h3>
          <div class="panel-indicator"></div>
        </div>
        <div class="action-grid">
          <button class="cyber-button primary" on:click={createCampaign} disabled={$isLoading}>
            <span class="btn-icon">⚡</span>
            <span class="btn-text">GOOGLE ADS</span>
            <div class="btn-glow"></div>
          </button>
          <button class="cyber-button secondary" on:click={createFacebookCampaign} disabled={$isLoading}>
            <span class="btn-icon">🎯</span>
            <span class="btn-text">FACEBOOK</span>
            <div class="btn-glow"></div>
          </button>
          <button class="cyber-button secondary" on:click={createAllegroCampaign} disabled={$isLoading}>
            <span class="btn-icon">🛒</span>
            <span class="btn-text">ALLEGRO</span>
            <div class="btn-glow"></div>
          </button>
        </div>
        <ul class="mt-4 space-y-2">
          {#each $campaigns as campaign}
            <li
              class="bg-gray-800/60 p-3 rounded-md flex justify-between items-center"
            >
              <span>{campaign.name}</span>
              <span class="text-green-400">{campaign.status}</span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if $activeTab === "performance"}
      <div class="performance-dashboard">
        <h3 class="text-xl font-steelfish mb-4">Dashboard Wydajności</h3>
        {#if $performanceData}
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div class="stat-card">
              <h4>Wyświetlenia</h4>
              <p>{$performanceData.impressions.toLocaleString("pl-PL")}</p>
            </div>
            <div class="stat-card">
              <h4>Kliknięcia</h4>
              <p>{$performanceData.clicks.toLocaleString("pl-PL")}</p>
            </div>
            <div class="stat-card">
              <h4>Wydatki</h4>
              <p>{$performanceData.spend.toFixed(2)} PLN</p>
            </div>
            <div class="stat-card">
              <h4>ROAS</h4>
              <p>{$performanceData.roas.toFixed(2)}x</p>
            </div>
          </div>
        {:else}
          <p>Ładowanie danych wydajności...</p>
        {/if}
      </div>
    {/if}

    {#if $activeTab === "creatives"}
      <div class="creative-studio">
        <h3 class="text-xl font-steelfish mb-4">Studio Kreacji</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <button on:click={generateCopy} disabled={$isLoading}
              >Generuj Teksty Reklamowe (AI)</button
            >
            {#if $generatedCopy.length > 0}
              <ul class="mt-4 space-y-2 text-sm">
                {#each $generatedCopy as copy}
                  <li
                    class="bg-gray-800/60 p-2 rounded-md border-l-2 border-cyan-400"
                  >
                    {copy}
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
          <div>
            <button on:click={createVisual} disabled={$isLoading}
              >Generuj Grafikę (AI)</button
            >
            {#if $generatedVisual}
              <img
                src={$generatedVisual}
                alt="Wygenerowana grafika"
                class="mt-4 rounded-lg border border-cyan-500/30"
              />
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Notifications -->
  <div class="notifications-container">
    {#each $notifications as notification}
      <div class="notification {notification.type}">
        {notification.message}
      </div>
    {/each}
  </div>
</div>

<style>
  .marketing-maestro-container {
    --theme-color: 180; /* Cyan */
  }
  .tabs {
    display: flex;
    border-bottom: 1px solid rgba(var(--theme-color), 0.2);
  }
  .tabs button {
    padding: 0.75rem 1.5rem;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }
  .tabs button.active {
    color: #22d3ee; /* Cyan-400 */
    border-bottom-color: #22d3ee;
  }
  .tab-content {
    padding-top: 1.5rem;
  }
  .stat-card {
    background: rgba(var(--theme-color), 0.1);
    border: 1px solid rgba(var(--theme-color), 0.2);
    padding: 1rem;
    border-radius: 0.5rem;
  }
  .stat-card h4 {
    font-size: 0.9rem;
    color: #9ca3af;
    margin-bottom: 0.5rem;
  }
  .stat-card p {
    font-size: 1.5rem;
    font-weight: bold;
    color: #e5e7eb;
  }
  button {
    background-color: #0891b2; /* Cyan-600 */
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  button:hover {
    background-color: #06b6d4; /* Cyan-500 */
  }
  button:disabled {
    background-color: #6b7280;
    cursor: not-allowed;
  }
  .notifications-container {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 9999;
  }
  .notification {
    padding: 1rem;
    border-radius: 0.5rem;
    color: white;
    min-width: 250px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .notification.success {
    background-color: #059669; /* Green-600 */
  }
  .notification.error {
    background-color: #dc2626; /* Red-600 */
  }
  .loader-indicator {
    width: 20px;
    height: 20px;
    border: 2px solid #22d3ee;
    border-top-color: transparent;
    border-radius: 50%;
    opacity: 0;
    transition:
      opacity 0.3s,
      transform 0.3s;
    transform: scale(0.5);
  }
  .loader-indicator.is-loading {
    opacity: 1;
    transform: scale(1);
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg) scale(1);
    }
  }
</style>
