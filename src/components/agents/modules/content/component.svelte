<!-- 🛡️ Agent 11: Content Guardian - Interactive Dashboard Component -->
<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  // State Management
  let activeTab = "dashboard";
  let loading = false;
  let agentStatus = writable({ status: "checking...", uptime: "0%" });
  let moderationQueue = writable([]);
  let contentPerformance = writable({});
  let generatedContent = writable("");
  let lastGeneration = writable({});

  // Form Data
  let moderationContent = "";
  let moderationResult = null;
  let generationTemplate = "blog-post-seo";
  let generationVariables = {
    topic: "",
    keyword: "",
    brand: "Twoja Marka",
    cta: "Skontaktuj się z nami",
  };

  // Analytics Data
  let performanceMetrics = {
    moderationAccuracy: 94.2,
    responseTime: 1.8,
    contentQuality: 8.7,
    seoScore: 82,
    engagement: 5.6,
  };

  let trendingTopics = [];
  let abTestResults = null;

  // Content Templates
  const templates = [
    { id: "blog-post-seo", name: "Artykuł Blogowy SEO", type: "blog" },
    { id: "social-media-post", name: "Post Social Media", type: "social" },
    { id: "product-description", name: "Opis Produktu", type: "product" },
    { id: "email-campaign", name: "Kampania Email", type: "email" },
    { id: "seo-meta-tags", name: "Meta Tagi SEO", type: "seo" },
    { id: "newsletter-content", name: "Newsletter", type: "newsletter" },
  ];

  // API Functions
  async function callAgentAPI(action: string, data?: any) {
    loading = true;
    try {
      const response = await fetch("/api/agents/agent-11-content-guardian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    } finally {
      loading = false;
    }
  }

  async function checkAgentStatus() {
    try {
      const result = await callAgentAPI("status");
      if (result.success) {
        agentStatus.set({
          status: "active",
          uptime: "99.9%",
          version: result.data.version,
          capabilities: result.data.capabilities?.length || 0,
          lastUpdate: new Date(result.data.lastUpdate).toLocaleString("pl-PL"),
        });
      }
    } catch (error) {
      agentStatus.set({ status: "error", uptime: "0%" });
    }
  }

  async function loadModerationQueue() {
    try {
      const result = await callAgentAPI("get-moderation-queue");
      if (result.success) {
        moderationQueue.set(result.data || []);
      }
    } catch (error) {
      console.error("Error loading moderation queue:", error);
    }
  }

  async function moderateContent() {
    if (!moderationContent.trim()) return;

    try {
      const result = await callAgentAPI("moderate-text", {
        content: moderationContent,
      });
      if (result.success) {
        moderationResult = result.data;
      }
    } catch (error) {
      console.error("Moderation error:", error);
      moderationResult = {
        approved: false,
        explanation: "Błąd podczas moderacji",
      };
    }
  }

  async function generateContent() {
    if (!generationVariables.topic || !generationVariables.keyword) return;

    try {
      const result = await callAgentAPI("generate-content", {
        template: generationTemplate,
        variables: generationVariables,
      });

      if (result.success) {
        generatedContent.set(result.data.content);
        lastGeneration.set(result.data);
      }
    } catch (error) {
      console.error("Generation error:", error);
    }
  }

  async function loadTrendingTopics() {
    try {
      const result = await callAgentAPI("get-trending-topics");
      if (result.success) {
        trendingTopics = result.data.trending || [];
      }
    } catch (error) {
      console.error("Error loading trending topics:", error);
    }
  }

  async function loadContentPerformance() {
    try {
      const result = await callAgentAPI("get-content-performance");
      if (result.success) {
        contentPerformance.set(result.data);
      }
    } catch (error) {
      console.error("Error loading content performance:", error);
    }
  }

  // Lifecycle
  onMount(async () => {
    await checkAgentStatus();
    await loadModerationQueue();
    await loadTrendingTopics();
    await loadContentPerformance();
  });

  // Tab switching
  function switchTab(tab: string) {
    activeTab = tab;

    // Load tab-specific data
    if (tab === "moderation") {
      loadModerationQueue();
    } else if (tab === "analytics") {
      loadContentPerformance();
    }
  }

  // Utility functions
  function formatNumber(num: number): string {
    return new Intl.NumberFormat("pl-PL").format(num);
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "active":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  }

  function getSeverityColor(severity: string): string {
    switch (severity) {
      case "critical":
        return "text-red-500 bg-red-500/10";
      case "high":
        return "text-orange-500 bg-orange-500/10";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10";
      case "low":
        return "text-green-500 bg-green-500/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  }
</script>

<!-- Main Dashboard Container -->
<div class="content-guardian-dashboard">
  <!-- Header -->
  <div
    class="mb-8 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center"
        >
          <span class="text-2xl">🛡️</span>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Content Guardian</h2>
          <p class="text-cyan-300">
            AI-Powered Content Moderation & Generation
          </p>
        </div>
      </div>
      <div class="text-right">
        {#await $agentStatus}
          <div class="text-yellow-400">Sprawdzanie statusu...</div>
        {:then status}
          <div class="text-lg font-semibold {getStatusColor(status.status)}">
            Status: {status.status === "active" ? "Aktywny" : "Błąd"}
          </div>
          <div class="text-sm text-gray-400">Dostępność: {status.uptime}</div>
        {/await}
      </div>
    </div>
  </div>

  <!-- Tab Navigation -->
  <div class="mb-6">
    <div class="flex space-x-1 bg-gray-800/20 rounded-xl p-1">
      <button
        class="tab-button {activeTab === 'dashboard' ? 'active' : ''}"
        on:click={() => switchTab("dashboard")}
      >
        📊 Dashboard
      </button>
      <button
        class="tab-button {activeTab === 'moderation' ? 'active' : ''}"
        on:click={() => switchTab("moderation")}
      >
        🔍 Moderacja
      </button>
      <button
        class="tab-button {activeTab === 'generation' ? 'active' : ''}"
        on:click={() => switchTab("generation")}
      >
        ✍️ Generator
      </button>
      <button
        class="tab-button {activeTab === 'analytics' ? 'active' : ''}"
        on:click={() => switchTab("analytics")}
      >
        📈 Analityka
      </button>
      <button
        class="tab-button {activeTab === 'trending' ? 'active' : ''}"
        on:click={() => switchTab("trending")}
      >
        🔥 Trendy
      </button>
      <button
        class="tab-button {activeTab === 'settings' ? 'active' : ''}"
        on:click={() => switchTab("settings")}
      >
        ⚙️ Ustawienia
      </button>
    </div>
  </div>

  <!-- Tab Content -->
  <div class="tab-content">
    <!-- Dashboard Tab -->
    {#if activeTab === "dashboard"}
      <div class="space-y-6">
        <!-- KPI Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="metric-card">
            <div class="text-2xl mb-2">🎯</div>
            <div class="text-2xl font-bold text-cyan-400">
              {performanceMetrics.moderationAccuracy}%
            </div>
            <div class="text-sm text-gray-400">Dokładność Moderacji</div>
          </div>
          <div class="metric-card">
            <div class="text-2xl mb-2">⚡</div>
            <div class="text-2xl font-bold text-green-400">
              {performanceMetrics.responseTime}s
            </div>
            <div class="text-sm text-gray-400">Czas Odpowiedzi</div>
          </div>
          <div class="metric-card">
            <div class="text-2xl mb-2">📝</div>
            <div class="text-2xl font-bold text-blue-400">
              {performanceMetrics.contentQuality}/10
            </div>
            <div class="text-sm text-gray-400">Jakość Treści</div>
          </div>
          <div class="metric-card">
            <div class="text-2xl mb-2">🔍</div>
            <div class="text-2xl font-bold text-purple-400">
              {performanceMetrics.seoScore}
            </div>
            <div class="text-sm text-gray-400">Wynik SEO</div>
          </div>
          <div class="metric-card">
            <div class="text-2xl mb-2">💬</div>
            <div class="text-2xl font-bold text-orange-400">
              {performanceMetrics.engagement}%
            </div>
            <div class="text-sm text-gray-400">Zaangażowanie</div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div
          class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 class="text-xl font-semibold mb-4 text-white">
            Ostatnia Aktywność
          </h3>
          <div class="space-y-3">
            <div
              class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm"
                >
                  ✓
                </div>
                <div>
                  <div class="text-white">Moderacja tekstu zakończona</div>
                  <div class="text-sm text-gray-400">2 minuty temu</div>
                </div>
              </div>
              <div class="text-green-400 text-sm">Zatwierdzone</div>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm"
                >
                  📝
                </div>
                <div>
                  <div class="text-white">Wygenerowano artykuł blogowy</div>
                  <div class="text-sm text-gray-400">5 minut temu</div>
                </div>
              </div>
              <div class="text-blue-400 text-sm">1,247 słów</div>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm"
                >
                  ⚠️
                </div>
                <div>
                  <div class="text-white">Wykryto podejrzane treści</div>
                  <div class="text-sm text-gray-400">12 minut temu</div>
                </div>
              </div>
              <div class="text-orange-400 text-sm">Do przeglądu</div>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Moderation Tab -->
    {#if activeTab === "moderation"}
      <div class="space-y-6">
        <!-- Content Moderation Form -->
        <div
          class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 class="text-xl font-semibold mb-4 text-white">
            Moderacja Treści
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Treść do moderacji</label
              >
              <textarea
                bind:value={moderationContent}
                placeholder="Wklej treść do moderacji..."
                class="w-full h-32 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              ></textarea>
            </div>

            <button
              on:click={moderateContent}
              disabled={loading || !moderationContent.trim()}
              class="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold text-white transition-all"
            >
              {loading ? "Analizuję..." : "🔍 Moderuj Treść"}
            </button>
          </div>

          <!-- Moderation Results -->
          {#if moderationResult}
            <div
              class="mt-6 p-4 rounded-lg {moderationResult.approved
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'}"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold text-white">Wynik Moderacji</h4>
                <span
                  class="px-3 py-1 rounded-full text-sm {moderationResult.approved
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'}"
                >
                  {moderationResult.approved
                    ? "✅ Zatwierdzone"
                    : "❌ Odrzucone"}
                </span>
              </div>

              <p class="text-gray-300 mb-3">{moderationResult.explanation}</p>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div class="text-gray-400">Pewność:</div>
                  <div class="text-white">
                    {(moderationResult.confidence * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div class="text-gray-400">Ważność:</div>
                  <div class="text-white capitalize">
                    {moderationResult.severity}
                  </div>
                </div>
              </div>

              {#if moderationResult.flags && moderationResult.flags.length > 0}
                <div class="mt-3">
                  <div class="text-gray-400 text-sm mb-2">
                    Wykryte problemy:
                  </div>
                  <div class="flex flex-wrap gap-2">
                    {#each moderationResult.flags as flag}
                      <span
                        class="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs"
                        >{flag}</span
                      >
                    {/each}
                  </div>
                </div>
              {/if}

              {#if moderationResult.suggestedEdits && moderationResult.suggestedEdits.length > 0}
                <div class="mt-3">
                  <div class="text-gray-400 text-sm mb-2">
                    Sugerowane zmiany:
                  </div>
                  <ul class="list-disc list-inside text-sm text-gray-300">
                    {#each moderationResult.suggestedEdits as edit}
                      <li>{edit}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Moderation Queue -->
        <div
          class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 class="text-xl font-semibold mb-4 text-white">
            Kolejka Moderacji
          </h3>

          {#await $moderationQueue}
            <div class="text-gray-400">Ładowanie kolejki...</div>
          {:then queue}
            {#if queue.length === 0}
              <div class="text-center py-8 text-gray-400">
                <div class="text-4xl mb-2">✨</div>
                <div>Brak elementów do moderacji</div>
              </div>
            {:else}
              <div class="space-y-3">
                {#each queue as item}
                  <div
                    class="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30"
                  >
                    <div class="flex-1">
                      <div class="text-white font-medium">ID: {item.id}</div>
                      <div class="text-sm text-gray-400 mt-1">
                        {item.content.length > 100
                          ? item.content.substring(0, 100) + "..."
                          : item.content}
                      </div>
                      <div class="flex items-center gap-4 mt-2 text-sm">
                        <span class="text-gray-400">Typ: {item.type}</span>
                        <span class="text-gray-400">Autor: {item.author}</span>
                        <span class="text-gray-400">
                          {new Date(item.submittedAt).toLocaleDateString(
                            "pl-PL"
                          )}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center gap-3">
                      <span
                        class="px-2 py-1 rounded text-xs {getSeverityColor(
                          item.severity
                        )}"
                      >
                        {item.severity}
                      </span>
                      <div class="flex gap-2">
                        <button
                          class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white"
                        >
                          ✅ Zatwierdź
                        </button>
                        <button
                          class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white"
                        >
                          ❌ Odrzuć
                        </button>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          {/await}
        </div>
      </div>
    {/if}

    <!-- Content Generation Tab -->
    {#if activeTab === "generation"}
      <div class="space-y-6">
        <!-- Content Generation Form -->
        <div
          class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 class="text-xl font-semibold mb-4 text-white">
            Generator Treści AI
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Szablon</label
              >
              <select
                bind:value={generationTemplate}
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-500"
              >
                {#each templates as template}
                  <option value={template.id}>{template.name}</option>
                {/each}
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2"
                  >Temat</label
                >
                <input
                  type="text"
                  bind:value={generationVariables.topic}
                  placeholder="Główny temat treści..."
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2"
                  >Słowo kluczowe</label
                >
                <input
                  type="text"
                  bind:value={generationVariables.keyword}
                  placeholder="Główne słowo kluczowe..."
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2"
                  >Marka</label
                >
                <input
                  type="text"
                  bind:value={generationVariables.brand}
                  placeholder="Nazwa marki..."
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2"
                  >Call to Action</label
                >
                <input
                  type="text"
                  bind:value={generationVariables.cta}
                  placeholder="Wezwanie do działania..."
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              on:click={generateContent}
              disabled={loading ||
                !generationVariables.topic ||
                !generationVariables.keyword}
              class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold text-white transition-all"
            >
              {loading ? "Generuję..." : "✍️ Wygeneruj Treść"}
            </button>
          </div>
        </div>

        <!-- Generated Content Display -->
        {#await $generatedContent}
          {#if loading}
            <div
              class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            >
              <div class="flex items-center justify-center py-8">
                <div class="text-center">
                  <div class="animate-spin text-4xl mb-4">🤖</div>
                  <div class="text-white">AI generuje treść...</div>
                  <div class="text-gray-400 text-sm">
                    To może potrwać kilka sekund
                  </div>
                </div>
              </div>
            </div>
          {/if}
        {:then content}
          {#if content}
            <div
              class="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50"
            >
              <div class="p-6 border-b border-gray-700/50">
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-semibold text-white">
                    Wygenerowana Treść
                  </h3>
                  <div class="flex gap-2">
                    <button
                      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
                    >
                      📋 Kopiuj
                    </button>
                    <button
                      class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm"
                    >
                      📤 Eksportuj
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <div class="prose prose-invert max-w-none">
                  <pre
                    class="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">{content}</pre>
                </div>
              </div>

              <!-- Content Metrics -->
              {#await $lastGeneration}
                <!-- Loading -->
              {:then generation}
                {#if generation.metadata}
                  <div class="p-6 border-t border-gray-700/50">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div class="metric-small">
                        <div class="text-gray-400">Słowa:</div>
                        <div class="text-white font-semibold">
                          {formatNumber(generation.metadata.wordCount)}
                        </div>
                      </div>
                      <div class="metric-small">
                        <div class="text-gray-400">Czas czytania:</div>
                        <div class="text-white font-semibold">
                          {generation.metadata.readingTime} min
                        </div>
                      </div>
                      <div class="metric-small">
                        <div class="text-gray-400">Wynik SEO:</div>
                        <div class="text-white font-semibold">
                          {generation.seoScore}/100
                        </div>
                      </div>
                      <div class="metric-small">
                        <div class="text-gray-400">Czytelność:</div>
                        <div class="text-white font-semibold">
                          {generation.readabilityScore}/100
                        </div>
                      </div>
                    </div>

                    {#if generation.suggestions && generation.suggestions.length > 0}
                      <div class="mt-4">
                        <div class="text-gray-400 text-sm mb-2">
                          Sugestie AI:
                        </div>
                        <div class="space-y-1">
                          {#each generation.suggestions as suggestion}
                            <div
                              class="text-xs text-yellow-300 bg-yellow-500/10 px-2 py-1 rounded"
                            >
                              💡 {suggestion}
                            </div>
                          {/each}
                        </div>
                      </div>
                    {/if}
                  </div>
                {/if}
              {/await}
            </div>
          {/if}
        {/await}
      </div>
    {/if}

    <!-- Analytics Tab -->
    {#if activeTab === "analytics"}
      <div class="space-y-6">
        <!-- Content Performance Metrics -->
        {#await $contentPerformance}
          <div class="text-gray-400">Ładowanie analityki...</div>
        {:then performance}
          {#if performance.contentPerformance}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Content Performance -->
              <div
                class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <h3 class="text-lg font-semibold mb-4 text-white">
                  Wydajność Treści
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-400">Wyświetlenia:</span>
                    <span class="text-white font-semibold"
                      >{formatNumber(
                        performance.contentPerformance.views
                      )}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Zaangażowanie:</span>
                    <span class="text-green-400 font-semibold"
                      >{performance.contentPerformance.engagement.toFixed(
                        1
                      )}%</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Udostępnienia:</span>
                    <span class="text-white font-semibold"
                      >{formatNumber(
                        performance.contentPerformance.shares
                      )}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Konwersja:</span>
                    <span class="text-blue-400 font-semibold"
                      >{performance.contentPerformance.conversionRate.toFixed(
                        1
                      )}%</span
                    >
                  </div>
                </div>
              </div>

              <!-- SEO Metrics -->
              <div
                class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <h3 class="text-lg font-semibold mb-4 text-white">
                  Metryki SEO
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-400">Ruch organiczny:</span>
                    <span class="text-white font-semibold"
                      >{formatNumber(
                        performance.seoMetrics.organicTraffic
                      )}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">CTR:</span>
                    <span class="text-green-400 font-semibold"
                      >{performance.seoMetrics.clickThroughRate.toFixed(
                        1
                      )}%</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Backlinki:</span>
                    <span class="text-white font-semibold"
                      >{formatNumber(performance.seoMetrics.backlinks)}</span
                    >
                  </div>
                  <div class="text-sm text-gray-400 mt-4">Top pozycje:</div>
                  <div class="space-y-1">
                    {#each Object.entries(performance.seoMetrics.rankings) as [keyword, position]}
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-300">{keyword}:</span>
                        <span class="text-cyan-400">#{position}</span>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>

              <!-- Social Metrics -->
              <div
                class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <h3 class="text-lg font-semibold mb-4 text-white">
                  Social Media
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-400">Polubienia:</span>
                    <span class="text-pink-400 font-semibold"
                      >{formatNumber(performance.socialMetrics.likes)}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Komentarze:</span>
                    <span class="text-blue-400 font-semibold"
                      >{formatNumber(performance.socialMetrics.comments)}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Udostępnienia:</span>
                    <span class="text-green-400 font-semibold"
                      >{formatNumber(performance.socialMetrics.shares)}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Zasięg:</span>
                    <span class="text-purple-400 font-semibold"
                      >{formatNumber(performance.socialMetrics.reach)}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          {/if}
        {/await}
      </div>
    {/if}

    <!-- Trending Topics Tab -->
    {#if activeTab === "trending"}
      <div class="space-y-6">
        <div
          class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 class="text-xl font-semibold mb-4 text-white">
            🔥 Popularne Tematy w Polsce
          </h3>

          {#if trendingTopics.length > 0}
            <div class="space-y-3">
              {#each trendingTopics as topic, index}
                <div
                  class="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div class="text-white font-medium">{topic.topic}</div>
                      <div class="text-sm text-gray-400">
                        Zainteresowanie: {topic.interest}%
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span
                      class="px-2 py-1 rounded text-sm {topic.trend.startsWith(
                        '+'
                      )
                        ? 'text-green-400 bg-green-400/10'
                        : 'text-red-400 bg-red-400/10'}"
                    >
                      {topic.trend}
                    </span>
                    <button
                      class="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-xs text-white"
                    >
                      Użyj w treści
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-8 text-gray-400">
              <div class="text-4xl mb-2">📊</div>
              <div>Ładowanie popularnych tematów...</div>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Settings Tab -->
    {#if activeTab === "settings"}
      <div class="space-y-6">
        <div
          class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 class="text-xl font-semibold mb-4 text-white">
            ⚙️ Ustawienia Content Guardian
          </h3>

          <div class="space-y-6">
            <!-- AI Models Configuration -->
            <div>
              <h4 class="text-lg font-medium text-white mb-3">Modele AI</h4>
              <div class="space-y-3">
                <label
                  class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                >
                  <div>
                    <div class="text-white">
                      GPT-4 Turbo (Generowanie treści)
                    </div>
                    <div class="text-sm text-gray-400">
                      Zaawansowane generowanie długich treści
                    </div>
                  </div>
                  <input type="checkbox" checked class="text-cyan-500" />
                </label>
                <label
                  class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                >
                  <div>
                    <div class="text-white">Claude 3 (Długie artykuły)</div>
                    <div class="text-sm text-gray-400">
                      Specjalizacja w długich formach treści
                    </div>
                  </div>
                  <input type="checkbox" checked class="text-cyan-500" />
                </label>
                <label
                  class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                >
                  <div>
                    <div class="text-white">
                      Polish BERT (Analiza sentymentu)
                    </div>
                    <div class="text-sm text-gray-400">
                      Specjalistyczny model dla języka polskiego
                    </div>
                  </div>
                  <input type="checkbox" checked class="text-cyan-500" />
                </label>
              </div>
            </div>

            <!-- Moderation Settings -->
            <div>
              <h4 class="text-lg font-medium text-white mb-3">
                Ustawienia Moderacji
              </h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm text-gray-300 mb-2"
                    >Próg wykrywania spam (60-95%)</label
                  >
                  <input
                    type="range"
                    min="60"
                    max="95"
                    value="75"
                    class="w-full"
                  />
                  <div class="text-xs text-gray-400 mt-1">Obecny: 75%</div>
                </div>
                <div>
                  <label class="block text-sm text-gray-300 mb-2"
                    >Próg mowy nienawiści (70-95%)</label
                  >
                  <input
                    type="range"
                    min="70"
                    max="95"
                    value="85"
                    class="w-full"
                  />
                  <div class="text-xs text-gray-400 mt-1">Obecny: 85%</div>
                </div>
              </div>
            </div>

            <!-- Language & Localization -->
            <div>
              <h4 class="text-lg font-medium text-white mb-3">
                Język i Lokalizacja
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-300 mb-2"
                    >Główny język treści</label
                  >
                  <select
                    class="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  >
                    <option selected>Polski (PL)</option>
                    <option>Angielski (EN)</option>
                    <option>Oba języki</option>
                  </select>
                </div>
                <label class="flex items-center gap-3">
                  <input type="checkbox" checked class="text-cyan-500" />
                  <span class="text-white">Optymalizacja pod polski rynek</span>
                </label>
                <label class="flex items-center gap-3">
                  <input type="checkbox" checked class="text-cyan-500" />
                  <span class="text-white"
                    >Uwzględniaj polskie święta w content calendar</span
                  >
                </label>
              </div>
            </div>

            <div class="flex gap-4">
              <button
                class="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-semibold"
              >
                💾 Zapisz Ustawienia
              </button>
              <button
                class="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold"
              >
                🔄 Przywróć Domyślne
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .content-guardian-dashboard {
    @apply min-h-screen p-6;
    background: linear-gradient(135deg, #0c1221 0%, #1a1f2e 50%, #0c1221 100%);
  }

  .tab-button {
    @apply px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white transition-all;
  }

  .tab-button.active {
    @apply bg-gradient-to-r from-cyan-600 to-blue-600 text-white;
  }

  .tab-content {
    @apply min-h-[500px];
  }

  .metric-card {
    @apply bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center;
  }

  .metric-small {
    @apply text-center p-3 bg-gray-700/20 rounded-lg;
  }

  /* Loading animations */
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Custom scrollbar */
  .content-guardian-dashboard ::-webkit-scrollbar {
    width: 6px;
  }

  .content-guardian-dashboard ::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.3);
    border-radius: 3px;
  }

  .content-guardian-dashboard ::-webkit-scrollbar-thumb {
    background: rgba(6, 182, 212, 0.5);
    border-radius: 3px;
  }

  .content-guardian-dashboard ::-webkit-scrollbar-thumb:hover {
    background: rgba(6, 182, 212, 0.7);
  }
</style>
