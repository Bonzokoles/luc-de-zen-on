<script lang="ts">
  import { onMount } from "svelte";

  // 📊 Agent 10 Analytics Prophet - Advanced ML-Powered Business Intelligence

  let isLoading = false;
  let agentStatus = null;
  let activeTab = "dashboard";
  let apiResponse = null;
  let apiError = null;

  // Dashboard data
  let dashboardData = null;
  let realTimeMetrics = null;

  // Forecasting
  let forecastMetric = "revenue";
  let forecastModel = "prophet";
  let forecastHorizon = 30;
  let forecastResult = null;

  // Anomaly Detection
  let anomalyMetric = "traffic";
  let anomalyAlgorithm = "isolation_forest";
  let anomalySensitivity = "medium";
  let anomalyResult = null;

  // Attribution Analysis
  let attributionModel = "time_decay";
  let attributionLookback = 30;
  let attributionResult = null;

  // ROI Calculator
  let roiCampaigns = [];
  let includeLTV = true;
  let roiResult = null;

  // Cohort Analysis
  let cohortPeriod = "monthly";
  let cohortMetric = "retention";
  let cohortResult = null;

  // User Segmentation
  let segmentationAlgorithm = "kmeans";
  let segmentCount = 5;
  let segmentationResult = null;

  // Churn Prediction
  let churnModel = "random_forest";
  let churnThreshold = 0.7;
  let churnResult = null;

  // Customer Journey
  let journeyTouchpoints = [
    "organic_search",
    "social_media",
    "email",
    "paid_ads",
  ];
  let journeyResult = null;

  // Insights & Reports
  let insightsResult = null;
  let customReports = [];
  let alertRules = [];

  const tabs = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: "📊",
      description: "Real-time KPI monitoring",
    },
    {
      id: "forecasting",
      name: "Forecasting",
      icon: "📈",
      description: "ML predictions & trends",
    },
    {
      id: "anomalies",
      name: "Anomalie",
      icon: "🚨",
      description: "Anomaly detection",
    },
    {
      id: "attribution",
      name: "Atrybucja",
      icon: "🎯",
      description: "Attribution modeling",
    },
    { id: "roi", name: "ROI", icon: "💰", description: "ROI & ROAS analysis" },
    {
      id: "cohorts",
      name: "Kohorty",
      icon: "👥",
      description: "Cohort analysis",
    },
    {
      id: "segmentation",
      name: "Segmentacja",
      icon: "🔍",
      description: "User segmentation",
    },
    { id: "churn", name: "Churn", icon: "⚠️", description: "Churn prediction" },
    {
      id: "journey",
      name: "Journey",
      icon: "🗺️",
      description: "Customer journey",
    },
    {
      id: "insights",
      name: "Insights",
      icon: "💡",
      description: "AI insights & reports",
    },
  ];

  onMount(async () => {
    await loadAgentStatus();
    await loadDashboard();
    await loadRealTimeMetrics();
  });

  async function makeApiCall(action: string, data: any = {}) {
    isLoading = true;
    apiError = null;

    try {
      const response = await fetch(
        "/api/agents/agent-10-analytics-prophet/api",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, data }),
        }
      );

      const result = await response.json();

      if (result.success) {
        apiResponse = result;
        return result;
      } else {
        throw new Error(result.message || "API Error");
      }
    } catch (error: any) {
      console.error("Analytics Prophet API Error:", error);
      apiError = error.message;
      return null;
    } finally {
      isLoading = false;
    }
  }

  async function loadAgentStatus() {
    const result = await makeApiCall("status");
    if (result) {
      agentStatus = result?.status || null;
    }
  }

  async function loadDashboard() {
    const result = await makeApiCall("get-kpi-dashboard", {
      period: "last_30_days",
    });
    if (result) {
      dashboardData = result?.dashboard || null;
    }
  }

  async function loadRealTimeMetrics() {
    const result = await makeApiCall("get-real-time-metrics");
    if (result) {
      realTimeMetrics = result?.real_time_data || null;
    }
  }

  async function generateForecast() {
    const result = await makeApiCall("generate-forecast", {
      metric: forecastMetric,
      model: forecastModel,
      horizon: forecastHorizon,
      confidence: 0.95,
    });

    if (result) {
      forecastResult = result?.forecast || null;
    }
  }

  async function detectAnomalies() {
    const result = await makeApiCall("detect-anomalies", {
      metric: anomalyMetric,
      algorithm: anomalyAlgorithm,
      sensitivity: anomalySensitivity,
      window: 30,
    });

    if (result) {
      anomalyResult = result?.anomaly_analysis || null;
    }
  }

  async function analyzeAttribution() {
    const result = await makeApiCall("analyze-attribution", {
      model: attributionModel,
      lookback: attributionLookback,
    });

    if (result) {
      attributionResult = result?.attribution || null;
    }
  }

  async function calculateROI() {
    const result = await makeApiCall("calculate-roi", {
      campaigns: roiCampaigns,
      period: 30,
      include_ltv: includeLTV,
    });

    if (result) {
      roiResult = result.roi_analysis;
    }
  }

  async function runCohortAnalysis() {
    const result = await makeApiCall("run-cohort-analysis", {
      period: cohortPeriod,
      metric: cohortMetric,
      cohorts: 12,
    });

    if (result) {
      cohortResult = result.cohort_analysis;
    }
  }

  async function segmentUsers() {
    const result = await makeApiCall("segment-users", {
      algorithm: segmentationAlgorithm,
      segments: segmentCount,
    });

    if (result) {
      segmentationResult = result.user_segmentation;
    }
  }

  async function predictChurn() {
    const result = await makeApiCall("predict-churn", {
      model: churnModel,
      threshold: churnThreshold,
    });

    if (result) {
      churnResult = result.churn_prediction;
    }
  }

  async function analyzeCustomerJourney() {
    const result = await makeApiCall("analyze-customer-journey", {
      touchpoints: journeyTouchpoints,
      conversion_window: 30,
    });

    if (result) {
      journeyResult = result.journey_analysis;
    }
  }

  async function generateInsights() {
    const result = await makeApiCall("generate-insights", {
      data_sources: ["ga4", "google_ads", "facebook_ads"],
      time_range: "30d",
    });

    if (result) {
      insightsResult = result.insights;
    }
  }

  async function testAgent() {
    const result = await makeApiCall("test");
    if (result) {
      alert(`✅ Analytics Prophet Test: ${result.message}`);
    }
  }

  function addCampaign() {
    roiCampaigns = [
      ...roiCampaigns,
      {
        id: `campaign_${Date.now()}`,
        name: `Kampania ${roiCampaigns.length + 1}`,
        budget: 5000,
        roas: 3.5,
        conversions: 120,
      },
    ];
  }

  function removeCampaign(index: number) {
    roiCampaigns = roiCampaigns.filter((_, i) => i !== index);
  }

  function addAlertRule() {
    alertRules = [
      ...alertRules,
      {
        metric: "revenue",
        condition: "below",
        threshold: 10000,
        frequency: "daily",
        channels: ["email"],
      },
    ];
  }

  function formatNumber(num: number, decimals = 0): string {
    return new Intl.NumberFormat("pl-PL", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "excellent":
        return "text-green-400";
      case "good":
      case "on_track":
        return "text-blue-400";
      case "needs_attention":
      case "below_target":
        return "text-yellow-400";
      case "critical":
      case "needs_improvement":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  }

  function getTrendIcon(trend: string): string {
    switch (trend) {
      case "up":
        return "▲";
      case "down":
        return "▼";
      case "stable":
        return "●";
      default:
        return "◯";
    }
  }
</script>

<div class="agent-container p-6 max-w-7xl mx-auto">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center space-x-4">
      <div class="text-4xl animate-pulse-glow">📊</div>
      <div>
        <h2 class="text-2xl font-bold text-cyan-300 glow-text">
          Analytics Prophet
        </h2>
        <p class="text-sm text-gray-400">
          ML-Powered Predictive Business Intelligence
        </p>
        {#if agentStatus}
          <div class="flex items-center space-x-2 mt-1">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <span class="text-xs text-green-400">
              {Object.keys(agentStatus?.ml_models?.forecasting ?? {}).filter(
                (m) => agentStatus?.ml_models?.forecasting?.[m]
              ).length} ML models active
            </span>
          </div>
        {/if}
      </div>
    </div>

    <div class="flex space-x-2">
      <button
        on:click={testAgent}
        class="action-button text-sm"
        disabled={isLoading}
      >
        {#if isLoading}
          <div class="loading-spinner inline-block mr-2"></div>
        {/if}
        Test Agent
      </button>
    </div>
  </div>

  <!-- Navigation Tabs -->
  <div class="grid grid-cols-5 gap-2 mb-6">
    {#each tabs as tab}
      <button
        class="tab-button {activeTab === tab.id ? 'active' : ''}"
        on:click={() => (activeTab = tab.id)}
      >
        <div class="text-lg mb-1">{tab.icon}</div>
        <div class="font-medium">{tab.name}</div>
        <div class="text-xs opacity-70">{tab.description}</div>
      </button>
    {/each}
  </div>

  <!-- API Error Display -->
  {#if apiError}
    <div class="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
      <div class="flex items-center space-x-2">
        <span class="text-red-400">❌</span>
        <span class="text-red-300 font-medium">Błąd API:</span>
        <span class="text-red-200">{apiError}</span>
      </div>
    </div>
  {/if}

  <!-- Tab Content -->
  <div class="space-y-6">
    <!-- Dashboard Tab -->
    {#if activeTab === "dashboard"}
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-cyan-300">
            📊 Real-Time Dashboard
          </h3>
          <button
            on:click={loadRealTimeMetrics}
            class="action-button text-sm"
            disabled={isLoading}
          >
            Odśwież Metryki
          </button>
        </div>

        <!-- Real-time Metrics -->
        {#if realTimeMetrics}
          <div class="grid grid-cols-4 gap-4 mb-6">
            <div class="metric-card text-center">
              <div class="text-2xl font-bold text-cyan-300">
                {formatNumber(realTimeMetrics.current_activity.active_users)}
              </div>
              <div class="text-sm text-gray-400">Aktywni Użytkownicy</div>
              <div class="text-xs text-green-400 mt-1">🟢 Live</div>
            </div>
            <div class="metric-card text-center">
              <div class="text-2xl font-bold text-cyan-300">
                {formatNumber(realTimeMetrics.current_activity.sessions_today)}
              </div>
              <div class="text-sm text-gray-400">Sesje Dzisiaj</div>
            </div>
            <div class="metric-card text-center">
              <div class="text-2xl font-bold text-cyan-300">
                {formatNumber(
                  realTimeMetrics.current_activity.conversions_today
                )}
              </div>
              <div class="text-sm text-gray-400">Konwersje Dzisiaj</div>
            </div>
            <div class="metric-card text-center">
              <div class="text-2xl font-bold text-cyan-300">
                {formatCurrency(realTimeMetrics.current_activity.revenue_today)}
              </div>
              <div class="text-sm text-gray-400">Przychód Dzisiaj</div>
            </div>
          </div>
        {/if}

        <!-- KPI Dashboard -->
        {#if dashboardData}
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-cyan-300">KPI Performance</h4>

            <div class="grid grid-cols-2 gap-6">
              <!-- Traffic Metrics -->
              <div class="metric-card">
                <h5 class="text-md font-medium text-cyan-300 mb-3">
                  🌐 Traffic
                </h5>
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-300">Sesje</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-cyan-300 font-medium"
                        >{formatNumber(
                          dashboardData.key_metrics.traffic.sessions.value
                        )}</span
                      >
                      <span
                        class="text-xs {dashboardData.key_metrics.traffic
                          .sessions.change > 0
                          ? 'text-green-400'
                          : 'text-red-400'}"
                      >
                        {getTrendIcon(
                          dashboardData.key_metrics.traffic.sessions.trend
                        )}
                        {dashboardData.key_metrics.traffic.sessions.change}%
                      </span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-300">Użytkownicy</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-cyan-300 font-medium"
                        >{formatNumber(
                          dashboardData.key_metrics.traffic.users.value
                        )}</span
                      >
                      <span
                        class="text-xs {dashboardData.key_metrics.traffic.users
                          .change > 0
                          ? 'text-green-400'
                          : 'text-red-400'}"
                      >
                        {getTrendIcon(
                          dashboardData.key_metrics.traffic.users.trend
                        )}
                        {dashboardData.key_metrics.traffic.users.change}%
                      </span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-300">Bounce Rate</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-cyan-300 font-medium"
                        >{(
                          dashboardData.key_metrics.traffic.bounce_rate.value *
                          100
                        ).toFixed(1)}%</span
                      >
                      <span
                        class="text-xs {getStatusColor(
                          dashboardData.key_metrics.traffic.bounce_rate.status
                        )}"
                      >
                        {dashboardData.key_metrics.traffic.bounce_rate.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Conversion Metrics -->
              <div class="metric-card">
                <h5 class="text-md font-medium text-cyan-300 mb-3">
                  🎯 Conversions
                </h5>
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-300">Overall Rate</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-cyan-300 font-medium"
                        >{(
                          dashboardData.key_metrics.conversion.overall_rate
                            .value * 100
                        ).toFixed(2)}%</span
                      >
                      <span
                        class="text-xs {getStatusColor(
                          dashboardData.key_metrics.conversion.overall_rate
                            .status
                        )}"
                      >
                        {dashboardData.key_metrics.conversion.overall_rate
                          .status}
                      </span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-300">E-commerce Rate</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-cyan-300 font-medium"
                        >{(
                          dashboardData.key_metrics.conversion.ecommerce_rate
                            .value * 100
                        ).toFixed(2)}%</span
                      >
                      <span
                        class="text-xs {getStatusColor(
                          dashboardData.key_metrics.conversion.ecommerce_rate
                            .status
                        )}"
                      >
                        {dashboardData.key_metrics.conversion.ecommerce_rate
                          .status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Revenue & Marketing -->
            <div class="grid grid-cols-2 gap-6">
              <div class="metric-card">
                <h5 class="text-md font-medium text-cyan-300 mb-3">
                  💰 Revenue
                </h5>
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-300">Total Revenue</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-cyan-300 font-medium"
                        >{formatCurrency(
                          dashboardData.key_metrics.revenue.total.value
                        )}</span
                      >
                      <span
                        class="text-xs {getStatusColor(
                          dashboardData.key_metrics.revenue.total.status
                        )}"
                      >
                        {dashboardData.key_metrics.revenue.total.status}
                      </span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-300">AOV</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-cyan-300 font-medium"
                        >{formatCurrency(
                          dashboardData.key_metrics.revenue.avg_order_value
                            .value
                        )}</span
                      >
                      <span
                        class="text-xs {getStatusColor(
                          dashboardData.key_metrics.revenue.avg_order_value
                            .status
                        )}"
                      >
                        {dashboardData.key_metrics.revenue.avg_order_value
                          .status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="metric-card">
                <h5 class="text-md font-medium text-cyan-300 mb-3">
                  📈 Marketing
                </h5>
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-300">ROAS</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-cyan-300 font-medium"
                        >{dashboardData.key_metrics.marketing.roas.value}</span
                      >
                      <span
                        class="text-xs {getStatusColor(
                          dashboardData.key_metrics.marketing.roas.status
                        )}"
                      >
                        {dashboardData.key_metrics.marketing.roas.status}
                      </span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-300">CAC</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-cyan-300 font-medium"
                        >{formatCurrency(
                          dashboardData.key_metrics.marketing.cac.value
                        )}</span
                      >
                      <span
                        class="text-xs {getStatusColor(
                          dashboardData.key_metrics.marketing.cac.status
                        )}"
                      >
                        {dashboardData.key_metrics.marketing.cac.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alerts -->
            {#if dashboardData.alerts && dashboardData.alerts.length > 0}
              <div class="space-y-2">
                <h5 class="text-md font-medium text-cyan-300">
                  🚨 Active Alerts
                </h5>
                {#each dashboardData.alerts as alert}
                  <div
                    class="p-3 rounded-lg {alert.type === 'warning'
                      ? 'bg-yellow-500/20 border border-yellow-500/50'
                      : 'bg-green-500/20 border border-green-500/50'}"
                  >
                    <div class="flex items-start space-x-2">
                      <span class="text-lg"
                        >{alert.type === "warning" ? "⚠️" : "✅"}</span
                      >
                      <div class="flex-1">
                        <div
                          class="text-sm font-medium {alert.type === 'warning'
                            ? 'text-yellow-300'
                            : 'text-green-300'}"
                        >
                          {alert.message}
                        </div>
                        <div class="text-xs text-gray-400 mt-1">
                          {alert.action}
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {:else}
          <button
            on:click={loadDashboard}
            class="action-button"
            disabled={isLoading}
          >
            Załaduj Dashboard
          </button>
        {/if}
      </div>

      <!-- Forecasting Tab -->
    {:else if activeTab === "forecasting"}
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-cyan-300">
            📈 Predictive Forecasting
          </h3>
        </div>

        <div class="grid grid-cols-3 gap-4 p-4 bg-black/20 rounded-lg">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Metryka</label
            >
            <select
              bind:value={forecastMetric}
              class="w-full p-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
            >
              <option value="revenue">Revenue</option>
              <option value="traffic">Traffic</option>
              <option value="conversions">Conversions</option>
              <option value="orders">Orders</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Model ML</label
            >
            <select
              bind:value={forecastModel}
              class="w-full p-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
            >
              <option value="prophet">Prophet (FB)</option>
              <option value="arima">ARIMA</option>
              <option value="linear_regression">Linear Regression</option>
              <option value="neural_network">Neural Network</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Horyzont (dni)</label
            >
            <input
              type="number"
              bind:value={forecastHorizon}
              min="7"
              max="365"
              class="w-full p-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
            />
          </div>
        </div>

        <button
          on:click={generateForecast}
          class="action-button"
          disabled={isLoading}
        >
          {#if isLoading}
            <div class="loading-spinner inline-block mr-2"></div>
          {/if}
          🔮 Generuj Prognozę
        </button>

        {#if forecastResult}
          <div class="result-card">
            <h4 class="text-lg font-medium text-cyan-300 mb-4">
              📊 Prognoza {forecastResult.metric} ({forecastResult.model})
            </h4>

            <div class="grid grid-cols-3 gap-4 mb-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-cyan-300">
                  {forecastResult.insights.predicted_change}
                </div>
                <div class="text-sm text-gray-400">Przewidywana Zmiana</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-cyan-300">
                  {forecastResult.quality_metrics.accuracy}
                </div>
                <div class="text-sm text-gray-400">Dokładność Modelu</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-cyan-300">
                  {forecastResult.historical_summary.trend}
                </div>
                <div class="text-sm text-gray-400">Trend Historyczny</div>
              </div>
            </div>

            <div class="chart-container">
              <div
                class="flex items-center justify-center h-full text-gray-400"
              >
                📈 Chart: {forecastResult.forecast_data?.length || 0} punktów prognozy
                <br />
                <span class="text-xs"
                  >Integracja z Chart.js w przyszłej wersji</span
                >
              </div>
            </div>

            <div class="mt-4">
              <h5 class="font-medium text-cyan-300 mb-2">
                🇵🇱 Czynniki Polskiego Rynku
              </h5>
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span class="text-gray-300">Wpływ świąt:</span>
                  <span class="text-cyan-300 ml-2"
                    >{forecastResult.polish_factors.holiday_impact}</span
                  >
                </div>
                <div>
                  <span class="text-gray-300">Korekty sezonowe:</span>
                  <span class="text-cyan-300 ml-2"
                    >{forecastResult.polish_factors.seasonal_adjustments}</span
                  >
                </div>
                <div>
                  <span class="text-gray-300">Warunki rynkowe:</span>
                  <span class="text-cyan-300 ml-2"
                    >{forecastResult.polish_factors.market_conditions}</span
                  >
                </div>
              </div>
            </div>

            <div class="mt-4">
              <h5 class="font-medium text-cyan-300 mb-2">💡 Rekomendacje</h5>
              <ul class="space-y-1">
                {#each forecastResult.recommendations as rec}
                  <li class="text-sm text-gray-300">• {rec}</li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}
      </div>

      <!-- Anomalies Tab -->
    {:else if activeTab === "anomalies"}
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-cyan-300">
            🚨 Anomaly Detection
          </h3>
        </div>

        <div class="grid grid-cols-3 gap-4 p-4 bg-black/20 rounded-lg">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Metryka</label
            >
            <select
              bind:value={anomalyMetric}
              class="w-full p-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
            >
              <option value="traffic">Traffic</option>
              <option value="revenue">Revenue</option>
              <option value="conversions">Conversions</option>
              <option value="bounce_rate">Bounce Rate</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Algorytm</label
            >
            <select
              bind:value={anomalyAlgorithm}
              class="w-full p-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
            >
              <option value="isolation_forest">Isolation Forest</option>
              <option value="z_score">Z-Score</option>
              <option value="dbscan">DBSCAN</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Sensitivity</label
            >
            <select
              bind:value={anomalySensitivity}
              class="w-full p-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button
          on:click={detectAnomalies}
          class="action-button"
          disabled={isLoading}
        >
          {#if isLoading}
            <div class="loading-spinner inline-block mr-2"></div>
          {/if}
          🔍 Wykryj Anomalie
        </button>

        {#if anomalyResult}
          <div class="result-card">
            <h4 class="text-lg font-medium text-cyan-300 mb-4">
              🚨 Anomalie w {anomalyResult.metric}
            </h4>

            <div class="grid grid-cols-4 gap-4 mb-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-cyan-300">
                  {anomalyResult.summary.anomalies_detected}
                </div>
                <div class="text-sm text-gray-400">Wykryte Anomalie</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-cyan-300">
                  {anomalyResult.summary.anomaly_rate}%
                </div>
                <div class="text-sm text-gray-400">Wskaźnik Anomalii</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-red-400">
                  {anomalyResult.summary.severity_breakdown.critical || 0}
                </div>
                <div class="text-sm text-gray-400">Krytyczne</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-yellow-400">
                  {anomalyResult.summary.severity_breakdown.medium || 0}
                </div>
                <div class="text-sm text-gray-400">Średnie</div>
              </div>
            </div>

            {#if anomalyResult.alert_triggered}
              <div
                class="p-3 rounded-lg bg-red-500/20 border border-red-500/50 mb-4"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-red-400">🚨</span>
                  <span class="text-red-300 font-medium"
                    >Alert krytyczny uruchomiony!</span
                  >
                </div>
              </div>
            {/if}

            <div class="space-y-2">
              <h5 class="font-medium text-cyan-300">📋 Lista Anomalii</h5>
              {#if anomalyResult.anomalies && anomalyResult.anomalies.length > 0}
                <div class="space-y-2 max-h-64 overflow-y-auto">
                  {#each anomalyResult.anomalies.slice(0, 10) as anomaly}
                    <div
                      class="p-2 bg-black/30 rounded-lg border-l-4 {anomaly.severity ===
                      'critical'
                        ? 'border-l-red-400'
                        : anomaly.severity === 'medium'
                          ? 'border-l-yellow-400'
                          : 'border-l-blue-400'}"
                    >
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="text-sm text-cyan-300">
                            {anomaly.date}
                          </div>
                          <div class="text-xs text-gray-400">
                            Wartość: {formatNumber(anomaly.value)}
                            | Odchylenie: {(anomaly.deviation * 100).toFixed(
                              1
                            )}% | Confidence: {(
                              anomaly.confidence * 100
                            ).toFixed(0)}%
                          </div>
                        </div>
                        <span
                          class="text-xs px-2 py-1 rounded {anomaly.severity ===
                          'critical'
                            ? 'bg-red-500/20 text-red-300'
                            : anomaly.severity === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-blue-500/20 text-blue-300'}"
                        >
                          {anomaly.severity}
                        </span>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>

            <div class="mt-4">
              <h5 class="font-medium text-cyan-300 mb-2">💡 Rekomendacje</h5>
              <ul class="space-y-1">
                {#each anomalyResult.recommendations as rec}
                  <li class="text-sm text-gray-300">• {rec}</li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}
      </div>

      <!-- Attribution Tab -->
    {:else if activeTab === "attribution"}
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-cyan-300">
            🎯 Attribution Analysis
          </h3>
        </div>

        <div class="grid grid-cols-2 gap-4 p-4 bg-black/20 rounded-lg">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Model Atrybucji</label
            >
            <select
              bind:value={attributionModel}
              class="w-full p-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
            >
              <option value="first_touch">First Touch</option>
              <option value="last_touch">Last Touch</option>
              <option value="time_decay">Time Decay</option>
              <option value="linear">Linear</option>
              <option value="position_based">Position Based</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Okno Lookback (dni)</label
            >
            <input
              type="number"
              bind:value={attributionLookback}
              min="7"
              max="90"
              class="w-full p-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
            />
          </div>
        </div>

        <button
          on:click={analyzeAttribution}
          class="action-button"
          disabled={isLoading}
        >
          {#if isLoading}
            <div class="loading-spinner inline-block mr-2"></div>
          {/if}
          🎯 Analizuj Atrybucję
        </button>

        {#if attributionResult}
          <div class="result-card">
            <h4 class="text-lg font-medium text-cyan-300 mb-4">
              🎯 Attribution Analysis - {attributionResult.attribution_model}
            </h4>

            <div class="grid grid-cols-3 gap-4 mb-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-cyan-300">
                  {attributionResult.summary.total_conversions}
                </div>
                <div class="text-sm text-gray-400">Całkowite Konwersje</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-cyan-300">
                  {formatCurrency(attributionResult.summary.total_value)}
                </div>
                <div class="text-sm text-gray-400">Całkowita Wartość</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-cyan-300">
                  {attributionResult.summary.average_path_length.toFixed(1)}
                </div>
                <div class="text-sm text-gray-400">Śr. Długość Ścieżki</div>
              </div>
            </div>

            <div class="space-y-3">
              <h5 class="font-medium text-cyan-300">
                📊 Attribution by Channel
              </h5>
              {#each attributionResult.channel_attribution as channel}
                <div class="p-3 bg-black/30 rounded-lg">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-cyan-300 font-medium"
                      >{channel.channel}</span
                    >
                    <span class="text-sm text-gray-400"
                      >{channel.attribution_percentage}% attribution</span
                    >
                  </div>

                  <div class="grid grid-cols-4 gap-4 text-xs text-gray-300">
                    <div>
                      <div class="text-cyan-300 font-medium">
                        {channel.attributed_conversions}
                      </div>
                      <div>Conversions</div>
                    </div>
                    <div>
                      <div class="text-cyan-300 font-medium">
                        {formatCurrency(channel.attributed_value)}
                      </div>
                      <div>Value</div>
                    </div>
                    <div>
                      <div class="text-cyan-300 font-medium">{channel.roi}</div>
                      <div>ROI</div>
                    </div>
                    <div>
                      <div class="text-cyan-300 font-medium">
                        {(channel.assisted_rate * 100).toFixed(0)}%
                      </div>
                      <div>Assisted Rate</div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>

            <div class="mt-4">
              <h5 class="font-medium text-cyan-300 mb-2">
                💡 Optimization Insights
              </h5>
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span class="text-gray-300">Najsilniejsze kanały:</span>
                  <div class="text-cyan-300">
                    {attributionResult.insights.strongest.join(", ")}
                  </div>
                </div>
                <div>
                  <span class="text-gray-300">Niedowartościowane:</span>
                  <div class="text-cyan-300">
                    {attributionResult.insights.undervalued.join(", ")}
                  </div>
                </div>
                <div>
                  <span class="text-gray-300">Możliwości:</span>
                  <div class="text-cyan-300">
                    {attributionResult.insights.opportunities.length} identified
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- ROI Tab -->
    {:else if activeTab === "roi"}
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-cyan-300">
            💰 ROI & ROAS Analysis
          </h3>
          <button on:click={addCampaign} class="action-button text-sm">
            ➕ Dodaj Kampanię
          </button>
        </div>

        <!-- Campaign Configuration -->
        <div class="p-4 bg-black/20 rounded-lg">
          <div class="flex items-center space-x-4 mb-4">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                bind:checked={includeLTV}
                class="form-checkbox"
              />
              <span class="text-sm text-gray-300"
                >Uwzględnij LTV w kalkulacjach</span
              >
            </label>
          </div>

          {#if roiCampaigns.length > 0}
            <div class="space-y-2 max-h-48 overflow-y-auto">
              {#each roiCampaigns as campaign, index}
                <div
                  class="flex items-center space-x-4 p-2 bg-gray-800/50 rounded"
                >
                  <input
                    bind:value={campaign.name}
                    placeholder="Nazwa kampanii"
                    class="flex-1 p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                  />
                  <input
                    type="number"
                    bind:value={campaign.budget}
                    placeholder="Budżet"
                    class="w-24 p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                  />
                  <input
                    type="number"
                    step="0.1"
                    bind:value={campaign.roas}
                    placeholder="ROAS"
                    class="w-20 p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                  />
                  <button
                    on:click={() => removeCampaign(index)}
                    class="text-red-400 hover:text-red-300 p-2"
                  >
                    🗑️
                  </button>
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center text-gray-400 py-4">
              Dodaj kampanie aby przeprowadzić analizę ROI
            </div>
          {/if}
        </div>

        <button
          on:click={calculateROI}
          class="action-button"
          disabled={isLoading || roiCampaigns.length === 0}
        >
          {#if isLoading}
            <div class="loading-spinner inline-block mr-2"></div>
          {/if}
          📊 Kalkuluj ROI
        </button>

        {#if roiResult}
          <div class="result-card">
            <h4 class="text-lg font-medium text-cyan-300 mb-4">
              💰 ROI Analysis Results
            </h4>

            <div class="grid grid-cols-4 gap-4 mb-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-cyan-300">
                  {formatCurrency(roiResult.overall_summary.total_spend)}
                </div>
                <div class="text-sm text-gray-400">Total Spend</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-cyan-300">
                  {formatCurrency(roiResult.overall_summary.total_revenue)}
                </div>
                <div class="text-sm text-gray-400">Total Revenue</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-400">
                  {roiResult.overall_summary.overall_roi}%
                </div>
                <div class="text-sm text-gray-400">Overall ROI</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-cyan-300">
                  {roiResult.overall_summary.overall_roas}
                </div>
                <div class="text-sm text-gray-400">Overall ROAS</div>
              </div>
            </div>

            {#if roiResult.campaigns}
              <div class="space-y-3">
                <h5 class="font-medium text-cyan-300">
                  📊 Campaign Performance
                </h5>
                {#each roiResult.campaigns as campaign}
                  <div class="p-3 bg-black/30 rounded-lg">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-cyan-300 font-medium"
                        >{campaign.campaign_name}</span
                      >
                      <span
                        class="text-sm px-2 py-1 rounded {campaign.performance_grade ===
                        'A'
                          ? 'bg-green-500/20 text-green-300'
                          : campaign.performance_grade === 'B'
                            ? 'bg-blue-500/20 text-blue-300'
                            : campaign.performance_grade === 'C'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-red-500/20 text-red-300'}"
                      >
                        Grade {campaign.performance_grade}
                      </span>
                    </div>

                    <div class="grid grid-cols-5 gap-4 text-xs text-gray-300">
                      <div>
                        <div class="text-cyan-300 font-medium">
                          {formatCurrency(campaign.metrics.spend)}
                        </div>
                        <div>Spend</div>
                      </div>
                      <div>
                        <div class="text-cyan-300 font-medium">
                          {formatCurrency(campaign.metrics.revenue)}
                        </div>
                        <div>Revenue</div>
                      </div>
                      <div>
                        <div class="text-cyan-300 font-medium">
                          {campaign.roi_metrics.roi}%
                        </div>
                        <div>ROI</div>
                      </div>
                      <div>
                        <div class="text-cyan-300 font-medium">
                          {campaign.roi_metrics.roas}
                        </div>
                        <div>ROAS</div>
                      </div>
                      <div>
                        <div class="text-cyan-300 font-medium">
                          {formatCurrency(campaign.roi_metrics.cpa)}
                        </div>
                        <div>CPA</div>
                      </div>
                    </div>

                    {#if includeLTV && campaign.ltv_analysis}
                      <div
                        class="grid grid-cols-3 gap-4 mt-2 pt-2 border-t border-gray-700 text-xs text-gray-300"
                      >
                        <div>
                          <div class="text-cyan-300 font-medium">
                            {formatCurrency(
                              campaign.ltv_analysis.estimated_ltv
                            )}
                          </div>
                          <div>Est. LTV</div>
                        </div>
                        <div>
                          <div class="text-cyan-300 font-medium">
                            {campaign.ltv_analysis.ltv_cac_ratio}
                          </div>
                          <div>LTV/CAC</div>
                        </div>
                        <div>
                          <div class="text-cyan-300 font-medium">
                            {campaign.ltv_analysis.payback_period} mies.
                          </div>
                          <div>Payback Period</div>
                        </div>
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Other tabs would continue here with similar structure -->
    {:else if activeTab === "insights"}
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-cyan-300">
            💡 AI-Powered Insights
          </h3>
        </div>

        <button
          on:click={generateInsights}
          class="action-button"
          disabled={isLoading}
        >
          {#if isLoading}
            <div class="loading-spinner inline-block mr-2"></div>
          {/if}
          🤖 Generuj Insights
        </button>

        {#if insightsResult}
          <div class="result-card">
            <h4 class="text-lg font-medium text-cyan-300 mb-4">
              💡 AI Analytics Insights
            </h4>

            <div class="space-y-4">
              <h5 class="font-medium text-cyan-300">🎯 Key Insights</h5>
              {#each insightsResult.key_insights as insight}
                <div class="insight-card insight-{insight.type}">
                  <div class="flex items-start space-x-3">
                    <span class="text-2xl">
                      {#if insight.type === "opportunity"}💡
                      {:else if insight.type === "trend"}📈
                      {:else if insight.type === "alert"}🚨
                      {:else if insight.type === "prediction"}🔮
                      {/if}
                    </span>
                    <div class="flex-1">
                      <h6 class="font-medium text-cyan-300 mb-1">
                        {insight.title}
                      </h6>
                      <p class="text-sm text-gray-300 mb-2">
                        {insight.description}
                      </p>
                      <div class="flex items-center space-x-4 text-xs">
                        <span class="text-gray-400"
                          >Impact: <span class="text-cyan-300"
                            >{insight.impact}</span
                          ></span
                        >
                        <span class="text-gray-400"
                          >Effort: <span class="text-cyan-300"
                            >{insight.effort}</span
                          ></span
                        >
                        <span class="text-gray-400"
                          >Uplift: <span class="text-green-400"
                            >{insight.estimated_uplift}</span
                          ></span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>

            <div class="space-y-4 mt-6">
              <h5 class="font-medium text-cyan-300">
                🤖 Automated Recommendations
              </h5>
              <ul class="space-y-2">
                {#each insightsResult.automated_recommendations as rec}
                  <li class="text-sm text-gray-300 flex items-center space-x-2">
                    <span class="text-cyan-400">▶</span>
                    <span>{rec}</span>
                  </li>
                {/each}
              </ul>
            </div>

            <div class="space-y-4 mt-6">
              <h5 class="font-medium text-cyan-300">🔮 Predictive Alerts</h5>
              {#each insightsResult.predictive_alerts as alert}
                <div class="p-3 bg-black/30 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-300">
                      {alert.metric}:
                      <span class="text-cyan-300">{alert.prediction}</span>
                    </span>
                    <span class="text-xs text-gray-400">
                      {(alert.confidence * 100).toFixed(0)}% confidence | {alert.timeframe}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Placeholder for other tabs -->
    {:else}
      <div class="text-center py-12">
        <div class="text-4xl mb-4">🚧</div>
        <h3 class="text-xl text-cyan-300 mb-2">Tab "{activeTab}" w budowie</h3>
        <p class="text-gray-400">
          Ta funkcja zostanie dodana w następnej wersji
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  .agent-container {
    background: linear-gradient(
      135deg,
      rgba(0, 255, 255, 0.05) 0%,
      rgba(0, 150, 255, 0.05) 100%
    );
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-radius: 16px;
    backdrop-filter: blur(10px);
  }

  .tab-button {
    @apply px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium;
    background: rgba(0, 255, 255, 0.05);
    border: 1px solid rgba(0, 255, 255, 0.2);
  }

  .tab-button:hover {
    @apply transform scale-105;
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }

  .tab-button.active {
    @apply bg-cyan-500/20 text-cyan-300 border-cyan-400/50;
    box-shadow: 0 0 25px rgba(0, 255, 255, 0.4);
  }

  .metric-card {
    @apply p-4 rounded-lg;
    background: rgba(0, 255, 255, 0.05);
    border: 1px solid rgba(0, 255, 255, 0.2);
    backdrop-filter: blur(5px);
  }

  .metric-card:hover {
    @apply transform scale-105;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }

  .action-button {
    @apply px-6 py-3 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-400/50 hover:bg-cyan-500/30 hover:scale-105 transition-all duration-300;
  }

  .action-button:hover {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
  }

  .result-card {
    @apply p-4 rounded-lg mt-4;
    background: rgba(0, 255, 255, 0.03);
    border: 1px solid rgba(0, 255, 255, 0.15);
  }

  .glow-text {
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  .chart-container {
    @apply w-full h-64 bg-black/20 rounded-lg p-4 border border-cyan-500/30;
  }

  .insight-card {
    @apply p-3 rounded-lg border-l-4;
    background: rgba(0, 255, 255, 0.05);
  }

  .insight-opportunity {
    @apply border-l-green-400;
  }
  .insight-trend {
    @apply border-l-blue-400;
  }
  .insight-alert {
    @apply border-l-red-400;
  }
  .insight-prediction {
    @apply border-l-purple-400;
  }

  .loading-spinner {
    border: 2px solid rgba(0, 255, 255, 0.1);
    border-left-color: #00ffff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite alternate;
  }

  @keyframes pulse-glow {
    from {
      text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
    }
    to {
      text-shadow:
        0 0 20px rgba(0, 255, 255, 0.8),
        0 0 30px rgba(0, 255, 255, 0.4);
    }
  }
</style>
