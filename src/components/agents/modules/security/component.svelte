<!-- 🔐 Security Guard Agent Component - System zabezpieczeń -->
<script lang="ts">
  import { onMount } from "svelte";

  // Ikony
  const icons = {
    shield: "🛡️",
    scan: "🔍",
    alert: "⚠️",
    check: "✅",
    cross: "❌",
    warning: "⚠️",
    critical: "🚨",
    info: "ℹ️",
    settings: "⚙️",
    report: "📊",
  };

  // Stan komponentu
  let activeTab = "monitoring";
  let loading = false;
  let scanInProgress = false;
  let message = "";

  // Dane security
  let monitoringStatus = [];
  let alerts = [];
  let scanResults = [];
  let incidents = [];
  let policies = [];
  let quarantineItems = [];
  let complianceReport = null;

  // UI state
  let selectedAlert = null;
  let newIncident = {
    title: "",
    description: "",
    severity: "MEDIUM",
    category: "security",
  };

  onMount(async () => {
    await loadInitialData();
  });

  async function loadInitialData() {
    loading = true;
    try {
      await Promise.all([
        loadMonitoringStatus(),
        loadAlerts(),
        loadScanResults(),
        loadIncidents(),
        loadPolicies(),
      ]);
    } catch (error) {
      message = `Błąd ładowania danych: ${error.message}`;
    } finally {
      loading = false;
    }
  }

  async function loadMonitoringStatus() {
    const response = await fetch("/api/agents/agent-08", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get-monitoring-status" }),
    });
    const data = await response.json();
    if (data.success) {
      monitoringStatus = data.monitoring;
    }
  }

  async function loadAlerts() {
    const response = await fetch("/api/agents/agent-08", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get-alerts" }),
    });
    const data = await response.json();
    if (data.success) {
      alerts = data.alerts;
    }
  }

  async function loadScanResults() {
    const response = await fetch("/api/agents/agent-08", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get-scan-results" }),
    });
    const data = await response.json();
    if (data.success) {
      scanResults = data.scans;
    }
  }

  async function loadIncidents() {
    const response = await fetch("/api/agents/agent-08", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get-incidents" }),
    });
    const data = await response.json();
    if (data.success) {
      incidents = data.incidents;
    }
  }

  async function loadPolicies() {
    const response = await fetch("/api/agents/agent-08", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get-policies" }),
    });
    const data = await response.json();
    if (data.success) {
      policies = data.policies;
    }
  }

  async function startSecurityScan(scanType = "quick") {
    if (scanInProgress) return;

    scanInProgress = true;
    message = `Rozpoczynam ${scanType === "deep" ? "głębokie" : "szybkie"} skanowanie...`;

    try {
      const response = await fetch("/api/agents/agent-08", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start-scan",
          data: {
            scanType,
            targets: ["filesystem", "network", "processes", "registry"],
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        message = `${data.message}. Znaleziono: ${data.threatsFound} zagrożeń.`;
        await loadScanResults();
        await loadAlerts(); // Odśwież alerty po skanowaniu
      } else {
        message = `Błąd skanowania: ${data.message}`;
      }
    } catch (error) {
      message = `Błąd: ${error.message}`;
    } finally {
      scanInProgress = false;
    }
  }

  async function resolveAlert(alertId, resolution = "manual") {
    try {
      const response = await fetch("/api/agents/agent-08", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resolve-alert",
          data: { alertId, resolution },
        }),
      });

      const data = await response.json();
      if (data.success) {
        message = data.message;
        await loadAlerts();
        selectedAlert = null;
      } else {
        message = `Błąd: ${data.message}`;
      }
    } catch (error) {
      message = `Błąd: ${error.message}`;
    }
  }

  async function createIncident() {
    if (!newIncident.title.trim()) {
      message = "Tytuł incydentu jest wymagany";
      return;
    }

    try {
      const response = await fetch("/api/agents/agent-08", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-incident",
          data: newIncident,
        }),
      });

      const data = await response.json();
      if (data.success) {
        message = data.message;
        newIncident = {
          title: "",
          description: "",
          severity: "MEDIUM",
          category: "security",
        };
        await loadIncidents();
      } else {
        message = `Błąd: ${data.message}`;
      }
    } catch (error) {
      message = `Błąd: ${error.message}`;
    }
  }

  async function loadComplianceReport(framework = "gdpr") {
    try {
      const response = await fetch("/api/agents/agent-08", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get-compliance-report",
          data: { framework },
        }),
      });

      const data = await response.json();
      if (data.success) {
        complianceReport = data.compliance;
        message = `Raport zgodności ${data.compliance.frameworkName} został wygenerowany`;
      }
    } catch (error) {
      message = `Błąd: ${error.message}`;
    }
  }

  function getSeverityIcon(severity) {
    switch (severity) {
      case "CRITICAL":
        return icons.critical;
      case "HIGH":
        return "🔴";
      case "MEDIUM":
        return "🟡";
      case "LOW":
        return "🟢";
      case "INFO":
        return icons.info;
      default:
        return icons.warning;
    }
  }

  function getSeverityColor(severity) {
    switch (severity) {
      case "CRITICAL":
        return "text-red-400 bg-red-900/20";
      case "HIGH":
        return "text-red-300 bg-red-800/20";
      case "MEDIUM":
        return "text-yellow-300 bg-yellow-800/20";
      case "LOW":
        return "text-green-300 bg-green-800/20";
      case "INFO":
        return "text-blue-300 bg-blue-800/20";
      default:
        return "text-gray-300 bg-gray-800/20";
    }
  }

  function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString("pl-PL");
  }
</script>

<!-- Agent Container -->
<div
  class="security-guard-agent bg-gradient-to-br from-red-900/20 via-gray-900 to-purple-900/20 border border-red-500/30 rounded-xl p-6 min-h-[600px]"
>
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center space-x-3">
      <div class="text-3xl">🛡️</div>
      <div>
        <h2 class="text-xl font-bold text-red-400">Security Guard</h2>
        <p class="text-sm text-gray-400">
          System ochrony i monitorowania bezpieczeństwa
        </p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex space-x-2">
      <button
        on:click={() => startSecurityScan("quick")}
        disabled={scanInProgress}
        class="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
      >
        <span>{icons.scan}</span>
        <span>{scanInProgress ? "Skanowanie..." : "Szybki skan"}</span>
      </button>

      <button
        on:click={() => startSecurityScan("deep")}
        disabled={scanInProgress}
        class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
      >
        <span>{icons.scan}</span>
        <span>Głęboki skan</span>
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
  <div class="flex space-x-1 mb-6 bg-gray-800/50 rounded-lg p-1">
    {#each [{ id: "monitoring", label: "Monitorowanie", icon: "📊" }, { id: "alerts", label: "Alerty", icon: "⚠️" }, { id: "scans", label: "Skanowanie", icon: "🔍" }, { id: "incidents", label: "Incydenty", icon: "🚨" }, { id: "policies", label: "Polityki", icon: "📋" }, { id: "compliance", label: "Zgodność", icon: "✅" }] as tab}
      <button
        on:click={() => (activeTab = tab.id)}
        class="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all
               {activeTab === tab.id
          ? 'bg-red-600 text-white'
          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}"
      >
        <span>{tab.icon}</span>
        <span>{tab.label}</span>
      </button>
    {/each}
  </div>

  <!-- Tab Content -->
  <div class="tab-content">
    <!-- Monitoring Tab -->
    {#if activeTab === "monitoring"}
      <div class="monitoring-tab space-y-6">
        <h3 class="text-lg font-semibold text-red-400 mb-4">
          Status monitorowania systemu
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each monitoringStatus as area}
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">{area.icon}</span>
                  <h4 class="font-medium text-white">{area.name}</h4>
                </div>
                <span
                  class="px-2 py-1 rounded text-xs {area.status === 'active'
                    ? 'bg-green-900/50 text-green-400'
                    : 'bg-yellow-900/50 text-yellow-400'}"
                >
                  {area.status === "active" ? "Aktywny" : "Ostrzeżenie"}
                </span>
              </div>

              <div class="text-sm text-gray-400 space-y-1">
                <p>Ostatnia kontrola: {formatTimestamp(area.lastCheck)}</p>
                <p>Zdarzenia: {area.eventsCount}</p>
                <p>Zagrożenia: {area.threatsDetected}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Alerts Tab -->
    {#if activeTab === "alerts"}
      <div class="alerts-tab">
        <h3 class="text-lg font-semibold text-red-400 mb-4">
          Alerty bezpieczeństwa
        </h3>

        <div class="space-y-3">
          {#each alerts.slice(0, 10) as alert}
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3 flex-1">
                  <span class="text-lg">{getSeverityIcon(alert.severity)}</span>
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <h4 class="font-medium text-white">{alert.title}</h4>
                      <span
                        class="px-2 py-1 rounded text-xs {getSeverityColor(
                          alert.severity
                        )}"
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p class="text-sm text-gray-400 mb-2">
                      {alert.description}
                    </p>
                    <div class="text-xs text-gray-500">
                      <span>Źródło: {alert.source}</span> •
                      <span>{formatTimestamp(alert.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {#if alert.status === "active"}
                  <button
                    on:click={() => resolveAlert(alert.id)}
                    class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                  >
                    Rozwiąż
                  </button>
                {/if}
              </div>
            </div>
          {/each}

          {#if alerts.length === 0}
            <div class="text-center py-8 text-gray-400">
              <span class="text-4xl block mb-2">✅</span>
              <p>Brak aktywnych alertów bezpieczeństwa</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Scans Tab -->
    {#if activeTab === "scans"}
      <div class="scans-tab">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-red-400">
            Historia skanowania
          </h3>
          <div class="flex space-x-2">
            <button
              on:click={() => loadScanResults()}
              class="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
            >
              🔄 Odśwież
            </button>
          </div>
        </div>

        <div class="space-y-3">
          {#each scanResults.slice(0, 8) as scan}
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">{icons.scan}</span>
                  <h4 class="font-medium text-white">
                    Skanowanie {scan.type === "deep" ? "głębokie" : "szybkie"}
                  </h4>
                  <span
                    class="px-2 py-1 rounded text-xs bg-green-900/50 text-green-400"
                  >
                    {scan.status}
                  </span>
                </div>
                <span class="text-sm text-gray-400"
                  >{formatTimestamp(scan.startTime)}</span
                >
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-gray-400">Przeskanowane:</span>
                  <div class="text-white font-medium">
                    {scan.scannedItems.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span class="text-gray-400">Zagrożenia:</span>
                  <div class="text-red-400 font-medium">
                    {scan.threatsFound}
                  </div>
                </div>
                <div>
                  <span class="text-gray-400">Czyste:</span>
                  <div class="text-green-400 font-medium">
                    {scan.cleanItems.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span class="text-gray-400">Czas:</span>
                  <div class="text-white font-medium">
                    {Math.round(scan.duration / 1000)}s
                  </div>
                </div>
              </div>
            </div>
          {/each}

          {#if scanResults.length === 0}
            <div class="text-center py-8 text-gray-400">
              <span class="text-4xl block mb-2">🔍</span>
              <p>Brak wyników skanowania</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Incidents Tab -->
    {#if activeTab === "incidents"}
      <div class="incidents-tab">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-red-400">
            Incydenty bezpieczeństwa
          </h3>
        </div>

        <!-- Create New Incident -->
        <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-white mb-3">Utwórz nowy incydent</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1"
                >Tytuł incydentu</label
              >
              <input
                type="text"
                bind:value={newIncident.title}
                placeholder="Opisz incydent..."
                class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1"
                >Poziom ważności</label
              >
              <select
                bind:value={newIncident.severity}
                class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
              >
                <option value="LOW">NISKI</option>
                <option value="MEDIUM">ŚREDNI</option>
                <option value="HIGH">WYSOKI</option>
                <option value="CRITICAL">KRYTYCZNY</option>
              </select>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm text-gray-400 mb-1">Opis</label>
            <textarea
              bind:value={newIncident.description}
              placeholder="Szczegóły incydentu..."
              rows="3"
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none resize-none"
            ></textarea>
          </div>
          <button
            on:click={createIncident}
            class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Utwórz incydent
          </button>
        </div>

        <!-- Incidents List -->
        <div class="space-y-3">
          {#each incidents.slice(0, 8) as incident}
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <h4 class="font-medium text-white">{incident.title}</h4>
                    <span
                      class="px-2 py-1 rounded text-xs {getSeverityColor(
                        incident.severity
                      )}"
                    >
                      {incident.severity}
                    </span>
                    <span
                      class="px-2 py-1 rounded text-xs bg-blue-900/50 text-blue-400"
                    >
                      {incident.status}
                    </span>
                  </div>
                  {#if incident.description}
                    <p class="text-sm text-gray-400 mb-2">
                      {incident.description}
                    </p>
                  {/if}
                  <div class="text-xs text-gray-500">
                    Utworzony: {formatTimestamp(incident.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          {/each}

          {#if incidents.length === 0}
            <div class="text-center py-8 text-gray-400">
              <span class="text-4xl block mb-2">🚨</span>
              <p>Brak incydentów bezpieczeństwa</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Policies Tab -->
    {#if activeTab === "policies"}
      <div class="policies-tab">
        <h3 class="text-lg font-semibold text-red-400 mb-4">
          Polityki bezpieczeństwa
        </h3>

        <div class="space-y-3">
          {#each policies as policy}
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <h4 class="font-medium text-white">{policy.name}</h4>
                    <span
                      class="px-2 py-1 rounded text-xs {policy.enabled
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-gray-900/50 text-gray-400'}"
                    >
                      {policy.enabled ? "Aktywna" : "Nieaktywna"}
                    </span>
                  </div>
                  <p class="text-sm text-gray-400 mb-2">{policy.description}</p>
                  <div class="text-xs text-gray-500">
                    Próg: {policy.threshold} • Typ: {policy.type} • Uruchamiania:
                    {policy.triggerCount || 0}
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    on:click={() => {
                      /* Implement policy editing */
                    }}
                  >
                    Edytuj
                  </button>
                </div>
              </div>
            </div>
          {/each}

          {#if policies.length === 0}
            <div class="text-center py-8 text-gray-400">
              <span class="text-4xl block mb-2">📋</span>
              <p>Brak skonfigurowanych polityk</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Compliance Tab -->
    {#if activeTab === "compliance"}
      <div class="compliance-tab">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-red-400">Raport zgodności</h3>
          <div class="flex space-x-2">
            <select
              on:change={(event) =>
                loadComplianceReport(
                  (event.currentTarget as HTMLSelectElement).value
                )}
              class="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:border-red-500 focus:outline-none"
            >
              <option value="gdpr">GDPR</option>
              <option value="iso27001">ISO 27001</option>
              <option value="sox">SOX</option>
              <option value="hipaa">HIPAA</option>
              <option value="pci">PCI DSS</option>
            </select>
            <button
              on:click={() => loadComplianceReport()}
              class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
              Generuj raport
            </button>
          </div>
        </div>

        {#if complianceReport}
          <div class="space-y-6">
            <!-- Compliance Overview -->
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium text-white">
                  {complianceReport.frameworkName}
                </h4>
                <div class="text-right">
                  <div class="text-2xl font-bold text-green-400">
                    {complianceReport.score}%
                  </div>
                  <div class="text-xs text-gray-400">Poziom zgodności</div>
                </div>
              </div>

              <div class="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div
                  class="bg-green-400 h-2 rounded-full"
                  style="width: {complianceReport.score}%"
                ></div>
              </div>

              <div class="text-sm text-gray-400">
                Ostatnia ocena: {formatTimestamp(
                  complianceReport.lastAssessment
                )}
              </div>
            </div>

            <!-- Requirements -->
            <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 class="font-medium text-white mb-4">Wymagania zgodności</h4>
              <div class="space-y-3">
                {#each complianceReport.requirements as req}
                  <div
                    class="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0"
                  >
                    <div class="flex items-center space-x-3">
                      <span class="text-lg">
                        {req.status === "compliant"
                          ? "✅"
                          : req.status === "partial"
                            ? "⚠️"
                            : "❌"}
                      </span>
                      <span class="text-white">{req.name}</span>
                    </div>
                    <div class="text-right">
                      <div
                        class="font-medium {req.score >= 80
                          ? 'text-green-400'
                          : req.score >= 60
                            ? 'text-yellow-400'
                            : 'text-red-400'}"
                      >
                        {req.score}%
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Recommendations -->
            {#if complianceReport.recommendations && complianceReport.recommendations.length > 0}
              <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h4 class="font-medium text-white mb-4">Zalecenia</h4>
                <ul class="space-y-2">
                  {#each complianceReport.recommendations as recommendation}
                    <li
                      class="flex items-start space-x-2 text-sm text-gray-300"
                    >
                      <span class="text-yellow-400 mt-0.5">•</span>
                      <span>{recommendation}</span>
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        {:else}
          <div class="text-center py-8 text-gray-400">
            <span class="text-4xl block mb-2">✅</span>
            <p>Wybierz framework i wygeneruj raport zgodności</p>
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
        <div class="text-3xl mb-2">🔄</div>
        <div class="text-white">Ładowanie danych bezpieczeństwa...</div>
      </div>
    </div>
  {/if}
</div>

<style>
  .security-guard-agent {
    position: relative;
    font-family: "Inter", system-ui, sans-serif;
  }

  .tab-content {
    min-height: 400px;
  }

  /* Scroll styling for better UX */
  .space-y-3 {
    max-height: 600px;
    overflow-y: auto;
  }

  .space-y-3::-webkit-scrollbar {
    width: 6px;
  }

  .space-y-3::-webkit-scrollbar-track {
    background: rgba(55, 65, 81, 0.3);
    border-radius: 3px;
  }

  .space-y-3::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.5);
    border-radius: 3px;
  }

  .space-y-3::-webkit-scrollbar-thumb:hover {
    background: rgba(239, 68, 68, 0.7);
  }
</style>
