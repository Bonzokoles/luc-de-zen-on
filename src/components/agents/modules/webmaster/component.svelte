<!-- 🌐 Webmaster Agent Component - SEO i monitoring -->
<script lang="ts">
  import { onMount } from "svelte";

  // Ikony
  const icons = {
    seo: "🌐",
    audit: "🔍",
    keywords: "🎯",
    performance: "⚡",
    competitors: "⚔️",
    content: "📝",
    backlinks: "🔗",
    report: "📊",
    chart: "📈",
    warning: "⚠️",
    success: "✅",
    error: "❌",
  };

  // Stan komponentu
  let activeTab = "overview";
  let loading = false;
  let message = "";

  // Dane SEO
  let seoOverview = null;
  let currentAudit = null;
  let keywordData = [];
  let performanceMetrics = null;
  let competitorAnalysis = null;
  let backlinksData = null;
  let crawlErrors = [];
  let contentAnalysis = null;
  let reports = [];

  // Formularz auditów
  let auditForm = {
    url: "https://example.pl",
    auditType: "comprehensive",
  };

  // Formularz słów kluczowych
  let keywordForm = {
    url: "https://example.pl",
    keywords: "seo, optymalizacja, marketing",
    language: "pl",
  };

  onMount(async () => {
    await loadInitialData();
  });

  async function loadInitialData() {
    loading = true;
    try {
      await Promise.all([loadSEOOverview(), loadCrawlErrors(), loadReports()]);
    } catch (error) {
      message = `Błąd ładowania danych: ${error.message}`;
    } finally {
      loading = false;
    }
  }

  async function loadSEOOverview() {
    const response = await fetch("/api/agents/agent-09", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get-monitoring-data" }),
    });
    const data = await response.json();
    if (data.success) {
      seoOverview = data.summary;
    }
  }

  async function runSEOAudit() {
    if (!auditForm.url.trim()) {
      message = "URL jest wymagany do audytu";
      return;
    }

    loading = true;
    message = "Uruchamianie audytu SEO...";

    try {
      const response = await fetch("/api/agents/agent-09", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "run-seo-audit",
          data: auditForm,
        }),
      });

      const data = await response.json();
      if (data.success) {
        currentAudit = data.audit;
        message = `${data.message}. Wynik: ${data.score}/100 punktów.`;
        activeTab = "audit";
      } else {
        message = `Błąd audytu: ${data.message}`;
      }
    } catch (error) {
      message = `Błąd: ${error.message}`;
    } finally {
      loading = false;
    }
  }

  async function analyzeKeywords() {
    if (!keywordForm.url.trim() && !keywordForm.keywords.trim()) {
      message = "URL lub słowa kluczowe są wymagane";
      return;
    }

    loading = true;
    message = "Analizowanie słów kluczowych...";

    try {
      const response = await fetch("/api/agents/agent-09", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze-keywords",
          data: keywordForm,
        }),
      });

      const data = await response.json();
      if (data.success) {
        keywordData = [data.analysis];
        message = `${data.message}. Znaleziono ${data.summary.totalKeywords} słów.`;
        activeTab = "keywords";
      } else {
        message = `Błąd analizy: ${data.message}`;
      }
    } catch (error) {
      message = `Błąd: ${error.message}`;
    } finally {
      loading = false;
    }
  }

  async function checkPerformance() {
    if (!auditForm.url.trim()) {
      message = "URL jest wymagany do testu wydajności";
      return;
    }

    loading = true;
    message = "Testowanie wydajności...";

    try {
      const response = await fetch("/api/agents/agent-09", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check-performance",
          data: { url: auditForm.url, device: "desktop" },
        }),
      });

      const data = await response.json();
      if (data.success) {
        performanceMetrics = data.performance;
        message = `Test wydajności ukończony. Wynik: ${data.overallScore}/100.`;
        activeTab = "performance";
      } else {
        message = `Błąd testu: ${data.message}`;
      }
    } catch (error) {
      message = `Błąd: ${error.message}`;
    } finally {
      loading = false;
    }
  }

  async function analyzeCompetitors() {
    if (!auditForm.url.trim()) {
      message = "URL jest wymagany do analizy konkurencji";
      return;
    }

    loading = true;
    message = "Analizowanie konkurencji...";

    try {
      const domain = new URL(auditForm.url).hostname.replace("www.", "");
      const response = await fetch("/api/agents/agent-09", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze-competitors",
          data: { domain },
        }),
      });

      const data = await response.json();
      if (data.success) {
        competitorAnalysis = data.analysis;
        message = `${data.message}. Średni DA: ${data.summary.averageDA}.`;
        activeTab = "competitors";
      } else {
        message = `Błąd analizy: ${data.message}`;
      }
    } catch (error) {
      message = `Błąd: ${error.message}`;
    } finally {
      loading = false;
    }
  }

  async function analyzeBacklinks() {
    if (!auditForm.url.trim()) {
      message = "URL jest wymagany do analizy linków";
      return;
    }

    loading = true;
    message = "Analizowanie profilu linków...";

    try {
      const domain = new URL(auditForm.url).hostname.replace("www.", "");
      const response = await fetch("/api/agents/agent-09", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get-backlinks",
          data: { domain },
        }),
      });

      const data = await response.json();
      if (data.success) {
        backlinksData = data.backlinks;
        message = `${data.message}. Znaleziono ${data.backlinks.summary.totalBacklinks} linków.`;
        activeTab = "backlinks";
      } else {
        message = `Błąd analizy: ${data.message}`;
      }
    } catch (error) {
      message = `Błąd: ${error.message}`;
    } finally {
      loading = false;
    }
  }

  async function loadCrawlErrors() {
    const response = await fetch("/api/agents/agent-09", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get-crawl-errors" }),
    });
    const data = await response.json();
    if (data.success) {
      crawlErrors = data.errors;
    }
  }

  async function loadReports() {
    const response = await fetch("/api/agents/agent-09", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get-monitoring-data" }),
    });
    const data = await response.json();
    if (data.success && data.monitoring.reports) {
      reports = data.monitoring.reports;
    }
  }

  async function generateSEOReport(reportType = "weekly") {
    loading = true;
    message = `Generowanie raportu ${reportType}...`;

    try {
      const domain = auditForm.url
        ? new URL(auditForm.url).hostname.replace("www.", "")
        : "example.pl";
      const response = await fetch("/api/agents/agent-09", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-seo-report",
          data: { reportType, domain },
        }),
      });

      const data = await response.json();
      if (data.success) {
        await loadReports();
        message = `${data.message}. Raport został zapisany.`;
        activeTab = "reports";
      } else {
        message = `Błąd generowania: ${data.message}`;
      }
    } catch (error) {
      message = `Błąd: ${error.message}`;
    } finally {
      loading = false;
    }
  }

  function getScoreColor(score) {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-400";
  }

  function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString("pl-PL");
  }

  function getCompetitionColor(competition) {
    switch (competition) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  }
</script>

<!-- Agent Container -->
<div
  class="webmaster-agent bg-gradient-to-br from-blue-900/20 via-gray-900 to-green-900/20 border border-blue-500/30 rounded-xl p-6 min-h-[600px]"
>
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center space-x-3">
      <div class="text-3xl">🌐</div>
      <div>
        <h2 class="text-xl font-bold text-blue-400">Webmaster</h2>
        <p class="text-sm text-gray-400">
          Zaawansowany system SEO i monitoringu stron
        </p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex space-x-2">
      <button
        on:click={runSEOAudit}
        disabled={loading}
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
      >
        <span>{icons.audit}</span>
        <span>Audyt SEO</span>
      </button>

      <button
        on:click={checkPerformance}
        disabled={loading}
        class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
      >
        <span>{icons.performance}</span>
        <span>Test wydajności</span>
      </button>
    </div>
  </div>

  <!-- Message Display -->
  {#if message}
    <div
      class="mb-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg text-blue-300 text-sm"
    >
      {message}
    </div>
  {/if}

  <!-- Navigation Tabs -->
  <div class="flex space-x-1 mb-6 bg-gray-800/50 rounded-lg p-1 flex-wrap">
    {#each [{ id: "overview", label: "Przegląd", icon: "📊" }, { id: "audit", label: "Audyt SEO", icon: "🔍" }, { id: "keywords", label: "Słowa kluczowe", icon: "🎯" }, { id: "performance", label: "Wydajność", icon: "⚡" }, { id: "competitors", label: "Konkurencja", icon: "⚔️" }, { id: "backlinks", label: "Linki", icon: "🔗" }, { id: "content", label: "Treści", icon: "📝" }, { id: "reports", label: "Raporty", icon: "📊" }] as tab}
      <button
        on:click={() => (activeTab = tab.id)}
        class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all
               {activeTab === tab.id
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}"
      >
        <span>{tab.icon}</span>
        <span class="hidden sm:inline">{tab.label}</span>
      </button>
    {/each}
  </div>

  <!-- Tab Content -->
  <div class="tab-content">
    <!-- Overview Tab -->
    {#if activeTab === "overview"}
      <div class="overview-tab space-y-6">
        <h3 class="text-lg font-semibold text-blue-400 mb-4">Przegląd SEO</h3>

        <!-- URL Input Form -->
        <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-white mb-3">Konfiguracja analizy</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">URL strony</label>
              <input
                type="url"
                bind:value={auditForm.url}
                placeholder="https://example.pl"
                class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Typ audytu</label>
              <select
                bind:value={auditForm.auditType}
                class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="quick">Szybki</option>
                <option value="comprehensive">Kompleksowy</option>
                <option value="technical">Techniczny</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        {#if seoOverview}
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <div
              class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
            >
              <div class="text-2xl font-bold text-blue-400">
                {seoOverview.totalAudits || 0}
              </div>
              <div class="text-sm text-gray-400">Audyty wykonane</div>
            </div>
            <div
              class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
            >
              <div
                class="text-2xl font-bold {seoOverview.avgSEOScore
                  ? getScoreColor(seoOverview.avgSEOScore)
                  : 'text-gray-400'}"
              >
                {seoOverview.avgSEOScore || "--"}/100
              </div>
              <div class="text-sm text-gray-400">Średni wynik SEO</div>
            </div>
            <div
              class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
            >
              <div class="text-2xl font-bold text-red-400">
                {seoOverview.activeErrors || 0}
              </div>
              <div class="text-sm text-gray-400">Aktywne błędy</div>
            </div>
            <div
              class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
            >
              <div class="text-2xl font-bold text-green-400">
                {reports.length || 0}
              </div>
              <div class="text-sm text-gray-400">Raporty</div>
            </div>
          </div>
        {/if}

        <!-- Quick Actions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            on:click={analyzeKeywords}
            disabled={loading}
            class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 p-4 rounded-lg transition-all"
          >
            <div class="text-2xl mb-2">{icons.keywords}</div>
            <div class="font-medium">Analiza słów kluczowych</div>
            <div class="text-sm text-purple-200 mt-1">
              Zbadaj pozycjonowanie fraz
            </div>
          </button>

          <button
            on:click={analyzeCompetitors}
            disabled={loading}
            class="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 p-4 rounded-lg transition-all"
          >
            <div class="text-2xl mb-2">{icons.competitors}</div>
            <div class="font-medium">Analiza konkurencji</div>
            <div class="text-sm text-red-200 mt-1">Porównaj z rywalami</div>
          </button>

          <button
            on:click={analyzeBacklinks}
            disabled={loading}
            class="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-600 p-4 rounded-lg transition-all"
          >
            <div class="text-2xl mb-2">{icons.backlinks}</div>
            <div class="font-medium">Profil linków</div>
            <div class="text-sm text-green-200 mt-1">Sprawdź backlinki</div>
          </button>
        </div>
      </div>
    {/if}

    <!-- SEO Audit Tab -->
    {#if activeTab === "audit"}
      <div class="audit-tab">
        <h3 class="text-lg font-semibold text-blue-400 mb-4">
          Wyniki audytu SEO
        </h3>

        {#if currentAudit}
          <!-- Overall Score -->
          <div
            class="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6 text-center"
          >
            <div
              class="text-4xl font-bold {getScoreColor(
                currentAudit.overallScore
              )} mb-2"
            >
              {currentAudit.overallScore}/100
            </div>
            <div class="text-white font-medium">Ogólny wynik SEO</div>
            <div class="text-sm text-gray-400 mt-1">
              Audyt: {currentAudit.url} • {formatTimestamp(
                currentAudit.startTime
              )}
            </div>
          </div>

          <!-- Category Scores -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
          >
            {#each Object.entries(currentAudit.categoryScores) as [category, score]}
              <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <span class="text-white capitalize">{category}</span>
                  <span class="font-bold {getScoreColor(score)}">{score}</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    class="bg-blue-500 h-2 rounded-full transition-all"
                    style="width: {score}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>

          <!-- Issues -->
          <div
            class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6"
          >
            <h4 class="font-medium text-white mb-4">Znalezione problemy</h4>
            <div class="space-y-3">
              {#each currentAudit.issues as issue}
                <div
                  class="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0"
                >
                  <div class="flex items-center space-x-3">
                    <span class="text-lg">
                      {#if issue.severity === "critical"}🔴
                      {:else if issue.severity === "high"}🟠
                      {:else if issue.severity === "medium"}🟡
                      {:else}🟢{/if}
                    </span>
                    <div>
                      <span class="text-white"
                        >{issue.type.replace(/_/g, " ")}</span
                      >
                      <div class="text-xs text-gray-400">{issue.severity}</div>
                    </div>
                  </div>
                  <span
                    class="bg-red-900/50 text-red-400 px-2 py-1 rounded text-sm"
                  >
                    {issue.count}
                  </span>
                </div>
              {/each}
            </div>
          </div>

          <!-- Recommendations -->
          <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h4 class="font-medium text-white mb-4">Zalecenia</h4>
            <ul class="space-y-2">
              {#each currentAudit.recommendations as recommendation}
                <li class="flex items-start space-x-2 text-sm text-gray-300">
                  <span class="text-green-400 mt-0.5">•</span>
                  <span>{recommendation}</span>
                </li>
              {/each}
            </ul>
          </div>
        {:else}
          <div class="text-center py-8 text-gray-400">
            <span class="text-4xl block mb-2">{icons.audit}</span>
            <p>Uruchom audyt SEO aby zobaczyć wyniki</p>
            <button
              on:click={runSEOAudit}
              disabled={loading}
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-4"
            >
              Rozpocznij audyt
            </button>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Keywords Tab -->
    {#if activeTab === "keywords"}
      <div class="keywords-tab">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-blue-400">
            Analiza słów kluczowych
          </h3>
        </div>

        <!-- Keywords Form -->
        <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-white mb-3">Konfiguracja analizy</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">URL strony</label>
              <input
                type="url"
                bind:value={keywordForm.url}
                placeholder="https://example.pl"
                class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Język</label>
              <select
                bind:value={keywordForm.language}
                class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="pl">Polski</option>
                <option value="en">Angielski</option>
                <option value="de">Niemiecki</option>
              </select>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm text-gray-400 mb-1"
              >Słowa kluczowe (oddzielone przecinkami)</label
            >
            <textarea
              bind:value={keywordForm.keywords}
              placeholder="seo, optymalizacja, marketing, strony internetowe"
              rows="2"
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
            ></textarea>
          </div>
          <button
            on:click={analyzeKeywords}
            disabled={loading}
            class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Analizuj słowa kluczowe
          </button>
        </div>

        <!-- Keywords Results -->
        {#if keywordData.length > 0}
          <div class="space-y-4">
            {#each keywordData as analysis}
              <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-medium text-white">Wyniki analizy</h4>
                  <div class="text-sm text-gray-400">
                    {formatTimestamp(analysis.analyzedAt)}
                  </div>
                </div>

                <!-- Summary Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-lg font-bold text-purple-400">
                      {analysis.keywords.length}
                    </div>
                    <div class="text-xs text-gray-400">Słowa</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-bold text-blue-400">
                      {analysis.totalVolume.toLocaleString()}
                    </div>
                    <div class="text-xs text-gray-400">Volume</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-bold text-yellow-400">
                      {analysis.averageDifficulty}
                    </div>
                    <div class="text-xs text-gray-400">Średnia trudność</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-bold text-green-400">
                      {analysis.opportunityScore}
                    </div>
                    <div class="text-xs text-gray-400">Potencjał</div>
                  </div>
                </div>

                <!-- Keywords Table -->
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b border-gray-700">
                        <th class="text-left py-2 text-gray-400"
                          >Słowo kluczowe</th
                        >
                        <th class="text-right py-2 text-gray-400">Volume</th>
                        <th class="text-right py-2 text-gray-400">Trudność</th>
                        <th class="text-right py-2 text-gray-400">CPC</th>
                        <th class="text-right py-2 text-gray-400">Pozycja</th>
                        <th class="text-right py-2 text-gray-400">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each analysis.keywords.slice(0, 10) as keyword}
                        <tr class="border-b border-gray-800">
                          <td class="py-2 text-white">{keyword.keyword}</td>
                          <td class="py-2 text-right text-blue-400"
                            >{keyword.volume.toLocaleString()}</td
                          >
                          <td class="py-2 text-right text-yellow-400"
                            >{keyword.difficulty}</td
                          >
                          <td class="py-2 text-right text-green-400"
                            >${keyword.cpc}</td
                          >
                          <td
                            class="py-2 text-right {getCompetitionColor(
                              keyword.competition
                            )}"
                          >
                            #{keyword.currentRanking}
                          </td>
                          <td class="py-2 text-right">
                            {#if keyword.trend === "rising"}📈
                            {:else if keyword.trend === "falling"}📉
                            {:else}➡️{/if}
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8 text-gray-400">
            <span class="text-4xl block mb-2">{icons.keywords}</span>
            <p>Wprowadź słowa kluczowe i uruchom analizę</p>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Performance Tab -->
    {#if activeTab === "performance"}
      <div class="performance-tab">
        <h3 class="text-lg font-semibold text-blue-400 mb-4">
          Wydajność strony
        </h3>

        {#if performanceMetrics}
          <!-- Lighthouse Scores -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {#each Object.entries(performanceMetrics.scores) as [category, score]}
              <div
                class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
              >
                <div class="text-2xl font-bold {getScoreColor(score)} mb-1">
                  {score}
                </div>
                <div class="text-sm text-gray-400 capitalize">{category}</div>
                <div class="w-full bg-gray-700 rounded-full h-1 mt-2">
                  <div
                    class="bg-blue-500 h-1 rounded-full"
                    style="width: {score}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>

          <!-- Core Web Vitals -->
          <div
            class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6"
          >
            <h4 class="font-medium text-white mb-4">Core Web Vitals</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-lg font-bold text-blue-400">
                  {performanceMetrics.coreWebVitals.lcp.value}s
                </div>
                <div class="text-sm text-gray-400">LCP</div>
                <div
                  class="text-xs text-{performanceMetrics.coreWebVitals.lcp
                    .rating === 'good'
                    ? 'green'
                    : 'yellow'}-400"
                >
                  {performanceMetrics.coreWebVitals.lcp.rating}
                </div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-green-400">
                  {performanceMetrics.coreWebVitals.fid.value}ms
                </div>
                <div class="text-sm text-gray-400">FID</div>
                <div
                  class="text-xs text-{performanceMetrics.coreWebVitals.fid
                    .rating === 'good'
                    ? 'green'
                    : 'yellow'}-400"
                >
                  {performanceMetrics.coreWebVitals.fid.rating}
                </div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-purple-400">
                  {performanceMetrics.coreWebVitals.cls.value}
                </div>
                <div class="text-sm text-gray-400">CLS</div>
                <div
                  class="text-xs text-{performanceMetrics.coreWebVitals.cls
                    .rating === 'good'
                    ? 'green'
                    : 'yellow'}-400"
                >
                  {performanceMetrics.coreWebVitals.cls.rating}
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 class="font-medium text-white mb-4">Metryki wydajności</h4>
              <div class="space-y-3">
                {#each Object.entries(performanceMetrics.metrics) as [metric, value]}
                  <div class="flex justify-between items-center">
                    <span class="text-gray-300 text-sm capitalize"
                      >{metric.replace(/([A-Z])/g, " $1")}</span
                    >
                    <span class="text-white font-medium">
                      {typeof value === "number" && value > 100
                        ? `${value}ms`
                        : typeof value === "string" && value.includes(".")
                          ? `${value}s`
                          : value}
                    </span>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Opportunities -->
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 class="font-medium text-white mb-4">
                Możliwości optymalizacji
              </h4>
              <div class="space-y-3">
                {#each performanceMetrics.opportunities as opportunity}
                  <div class="flex items-start space-x-3">
                    <span
                      class="text-{opportunity.impact === 'high'
                        ? 'red'
                        : opportunity.impact === 'medium'
                          ? 'yellow'
                          : 'green'}-400 text-sm mt-0.5"
                    >
                      {opportunity.impact === "high"
                        ? "🔴"
                        : opportunity.impact === "medium"
                          ? "🟡"
                          : "🟢"}
                    </span>
                    <div class="flex-1">
                      <div class="text-white text-sm font-medium">
                        {opportunity.title}
                      </div>
                      <div class="text-gray-400 text-xs">
                        {opportunity.description}
                      </div>
                      {#if opportunity.savings}
                        <div class="text-green-400 text-xs">
                          Oszczędność: {opportunity.savings}
                        </div>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {:else}
          <div class="text-center py-8 text-gray-400">
            <span class="text-4xl block mb-2">{icons.performance}</span>
            <p>Uruchom test wydajności aby zobaczyć wyniki</p>
            <button
              on:click={checkPerformance}
              disabled={loading}
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-4"
            >
              Testuj wydajność
            </button>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Competitors Tab -->
    {#if activeTab === "competitors"}
      <div class="competitors-tab">
        <h3 class="text-lg font-semibold text-blue-400 mb-4">
          Analiza konkurencji
        </h3>

        {#if competitorAnalysis}
          <div class="space-y-6">
            <!-- Analysis Summary -->
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 class="font-medium text-white mb-4">Podsumowanie analizy</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-lg font-bold text-purple-400">
                    {competitorAnalysis.competitors.length}
                  </div>
                  <div class="text-xs text-gray-400">Konkurentów</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-blue-400">
                    {Math.round(
                      competitorAnalysis.competitors.reduce(
                        (sum, comp) => sum + comp.domainAuthority,
                        0
                      ) / competitorAnalysis.competitors.length
                    )}
                  </div>
                  <div class="text-xs text-gray-400">Średnie DA</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-green-400">
                    {competitorAnalysis.opportunities.length}
                  </div>
                  <div class="text-xs text-gray-400">Szanse</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-yellow-400">
                    {competitorAnalysis.insights.length}
                  </div>
                  <div class="text-xs text-gray-400">Wnioski</div>
                </div>
              </div>
            </div>

            <!-- Competitors Comparison -->
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 class="font-medium text-white mb-4">
                Porównanie konkurentów
              </h4>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-gray-700">
                      <th class="text-left py-2 text-gray-400">Domena</th>
                      <th class="text-right py-2 text-gray-400">DA</th>
                      <th class="text-right py-2 text-gray-400">Backlinki</th>
                      <th class="text-right py-2 text-gray-400">Domeny</th>
                      <th class="text-right py-2 text-gray-400">Keywords</th>
                      <th class="text-right py-2 text-gray-400">Traffic</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each competitorAnalysis.competitors as competitor}
                      <tr class="border-b border-gray-800">
                        <td class="py-2 text-white">{competitor.domain}</td>
                        <td class="py-2 text-right text-yellow-400"
                          >{competitor.domainAuthority}</td
                        >
                        <td class="py-2 text-right text-blue-400"
                          >{competitor.backlinks.toLocaleString()}</td
                        >
                        <td class="py-2 text-right text-green-400"
                          >{competitor.referringDomains.toLocaleString()}</td
                        >
                        <td class="py-2 text-right text-purple-400"
                          >{competitor.organicKeywords.toLocaleString()}</td
                        >
                        <td class="py-2 text-right text-orange-400"
                          >{competitor.organicTraffic.toLocaleString()}</td
                        >
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Opportunities -->
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 class="font-medium text-white mb-4">Możliwości rozwoju</h4>
              <div class="space-y-3">
                {#each competitorAnalysis.opportunities as opportunity}
                  <div
                    class="flex items-start space-x-3 p-3 bg-gray-900/50 rounded"
                  >
                    <span
                      class="text-{opportunity.priority === 'high'
                        ? 'red'
                        : 'yellow'}-400 text-lg"
                    >
                      {opportunity.priority === "high" ? "🔥" : "💡"}
                    </span>
                    <div class="flex-1">
                      <div class="text-white font-medium">
                        {opportunity.title}
                      </div>
                      <div class="text-gray-400 text-sm">
                        {opportunity.description}
                      </div>
                      <div
                        class="text-xs text-{opportunity.priority === 'high'
                          ? 'red'
                          : 'yellow'}-400 mt-1"
                      >
                        Priorytet: {opportunity.priority}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {:else}
          <div class="text-center py-8 text-gray-400">
            <span class="text-4xl block mb-2">{icons.competitors}</span>
            <p>Uruchom analizę konkurencji aby zobaczyć wyniki</p>
            <button
              on:click={analyzeCompetitors}
              disabled={loading}
              class="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-4"
            >
              Analizuj konkurencję
            </button>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Backlinks Tab -->
    {#if activeTab === "backlinks"}
      <div class="backlinks-tab">
        <h3 class="text-lg font-semibold text-blue-400 mb-4">Profil linków</h3>

        {#if backlinksData}
          <div class="space-y-6">
            <!-- Backlinks Summary -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div
                class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
              >
                <div class="text-2xl font-bold text-blue-400">
                  {backlinksData.summary.totalBacklinks.toLocaleString()}
                </div>
                <div class="text-sm text-gray-400">Backlinki</div>
              </div>
              <div
                class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
              >
                <div class="text-2xl font-bold text-green-400">
                  {backlinksData.summary.referringDomains.toLocaleString()}
                </div>
                <div class="text-sm text-gray-400">Domeny</div>
              </div>
              <div
                class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
              >
                <div class="text-2xl font-bold text-yellow-400">
                  {backlinksData.summary.domainRating}
                </div>
                <div class="text-sm text-gray-400">Domain Rating</div>
              </div>
              <div
                class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
              >
                <div class="text-2xl font-bold text-purple-400">
                  {backlinksData.summary.organicKeywords.toLocaleString()}
                </div>
                <div class="text-sm text-gray-400">Keywords</div>
              </div>
            </div>

            <!-- Link Types Distribution -->
            <div
              class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6"
            >
              <h4 class="font-medium text-white mb-4">Rozkład typów linków</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {#each Object.entries(backlinksData.linkTypes) as [type, percentage]}
                  <div class="text-center">
                    <div
                      class="text-lg font-bold text-{type === 'dofollow'
                        ? 'green'
                        : type === 'nofollow'
                          ? 'yellow'
                          : 'gray'}-400"
                    >
                      {percentage}%
                    </div>
                    <div class="text-xs text-gray-400 capitalize">{type}</div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Top Backlinks -->
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 class="font-medium text-white mb-4">Najlepsze backlinki</h4>
              <div class="space-y-3">
                {#each backlinksData.topBacklinks as backlink}
                  <div
                    class="flex items-center justify-between p-3 bg-gray-900/50 rounded"
                  >
                    <div class="flex-1">
                      <div class="text-white text-sm font-medium truncate">
                        {backlink.url}
                      </div>
                      <div class="text-gray-400 text-xs">
                        Anchor: "{backlink.anchorText}" • DR: {backlink.domainRating}
                        •
                        {backlink.type}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-yellow-400 font-medium">
                        {backlink.urlRating}
                      </div>
                      <div class="text-xs text-gray-400">URL Rating</div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {:else}
          <div class="text-center py-8 text-gray-400">
            <span class="text-4xl block mb-2">{icons.backlinks}</span>
            <p>Uruchom analizę linków aby zobaczyć profil</p>
            <button
              on:click={analyzeBacklinks}
              disabled={loading}
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-4"
            >
              Analizuj backlinki
            </button>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Content Tab -->
    {#if activeTab === "content"}
      <div class="content-tab">
        <h3 class="text-lg font-semibold text-blue-400 mb-4">Analiza treści</h3>

        <div class="text-center py-8 text-gray-400">
          <span class="text-4xl block mb-2">{icons.content}</span>
          <p>Analiza treści będzie dostępna wkrótce</p>
          <div class="text-sm text-gray-500 mt-2">
            Funkcjonalność w przygotowaniu: analiza readability, keyword
            density, content structure
          </div>
        </div>
      </div>
    {/if}

    <!-- Reports Tab -->
    {#if activeTab === "reports"}
      <div class="reports-tab">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-blue-400">Raporty SEO</h3>
          <div class="flex space-x-2">
            <button
              on:click={() => generateSEOReport("daily")}
              disabled={loading}
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm"
            >
              Dzienny
            </button>
            <button
              on:click={() => generateSEOReport("weekly")}
              disabled={loading}
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm"
            >
              Tygodniowy
            </button>
            <button
              on:click={() => generateSEOReport("monthly")}
              disabled={loading}
              class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm"
            >
              Miesięczny
            </button>
          </div>
        </div>

        {#if reports.length > 0}
          <div class="space-y-4">
            {#each reports as report}
              <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <span class="text-2xl">{icons.report}</span>
                    <div>
                      <h4 class="font-medium text-white">
                        Raport {report.type}
                      </h4>
                      <div class="text-sm text-gray-400">
                        {report.domain} • {formatTimestamp(report.generatedAt)}
                      </div>
                    </div>
                  </div>
                  <button
                    class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                  >
                    Pobierz
                  </button>
                </div>

                <!-- Report Preview -->
                {#if report.sections?.executiveSummary}
                  <div class="mt-4 p-3 bg-gray-900/50 rounded">
                    <h5 class="text-sm font-medium text-white mb-2">
                      Podsumowanie wykonawcze
                    </h5>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {#each Object.entries(report.sections.executiveSummary.keyMetrics) as [metric, data]}
                        <div>
                          <div class="text-gray-400">
                            {metric.replace(/_/g, " ")}
                          </div>
                          <div class="text-white font-medium">
                            {data.value}
                            <span
                              class="text-{data.change.startsWith('+')
                                ? 'green'
                                : 'red'}-400">{data.change}</span
                            >
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8 text-gray-400">
            <span class="text-4xl block mb-2">{icons.report}</span>
            <p>Brak wygenerowanych raportów</p>
            <p class="text-sm mt-2">
              Użyj przycisków powyżej aby wygenerować pierwszy raport
            </p>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Loading Overlay -->
  {#if loading}
    <div
      class="absolute inset-0 bg-gray-900/80 flex items-center justify-center rounded-xl"
    >
      <div class="text-center">
        <div class="text-3xl mb-2">⚡</div>
        <div class="text-white">Przetwarzanie danych SEO...</div>
      </div>
    </div>
  {/if}
</div>

<style>
  .webmaster-agent {
    position: relative;
    font-family: "Inter", system-ui, sans-serif;
  }

  .tab-content {
    min-height: 400px;
  }

  /* Scroll styling for better UX */
  .space-y-3,
  .space-y-4,
  .space-y-6 {
    max-height: 600px;
    overflow-y: auto;
  }

  .space-y-3::-webkit-scrollbar,
  .space-y-4::-webkit-scrollbar,
  .space-y-6::-webkit-scrollbar {
    width: 6px;
  }

  .space-y-3::-webkit-scrollbar-track,
  .space-y-4::-webkit-scrollbar-track,
  .space-y-6::-webkit-scrollbar-track {
    background: rgba(55, 65, 81, 0.3);
    border-radius: 3px;
  }

  .space-y-3::-webkit-scrollbar-thumb,
  .space-y-4::-webkit-scrollbar-thumb,
  .space-y-6::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.5);
    border-radius: 3px;
  }

  .space-y-3::-webkit-scrollbar-thumb:hover,
  .space-y-4::-webkit-scrollbar-thumb:hover,
  .space-y-6::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.7);
  }

  /* Responsive table */
  .overflow-x-auto table {
    min-width: 600px;
  }

  @media (max-width: 768px) {
    .grid.grid-cols-4 {
      grid-template-columns: repeat(2, 1fr);
    }

    .overflow-x-auto {
      -webkit-overflow-scrolling: touch;
    }
  }
</style>
