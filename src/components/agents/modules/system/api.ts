// Agent 03 - System Monitor API
import type { APIRoute } from "astro";
import { AGENT_CONFIG } from "./config";

// System metrics storage
let metricsHistory: Array<{ timestamp: number; metrics: any }> = [];
let lastAlert: { [key: string]: number } = {};
let isMonitoring = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { action, data } = (await request.json()) as any;

    switch (action) {
      case "test":
        return testAgent();

      case "start_monitoring":
        return startMonitoring();

      case "stop_monitoring":
        return stopMonitoring();

      case "get_metrics":
        return getCurrentMetrics();

      case "get_history":
        return getMetricsHistory(data?.limit);

      case "get_alerts":
        return getActiveAlerts();

      case "status":
        return getAgentStatus();

      default:
        return errorResponse("Invalid action");
    }
  } catch (error) {
    console.error("System Monitor API error:", error);
    return errorResponse((error as Error).message);
  }
};

export const GET: APIRoute = async ({ url }) => {
  const action = url.searchParams.get("action");

  switch (action) {
    case "metrics":
      return getCurrentMetrics();
    case "status":
      return getAgentStatus();
    case "history":
      const limit = parseInt(url.searchParams.get("limit") || "10");
      return getMetricsHistory(limit);
    default:
      return getCurrentMetrics();
  }
};

// Core Functions
async function testAgent() {
  const testMetrics = await collectSystemMetrics();

  return successResponse({
    message: "System Monitor Agent test successful",
    agent: AGENT_CONFIG.name,
    capabilities: AGENT_CONFIG.capabilities,
    status: "operational",
    sampleMetrics: testMetrics,
  });
}

function startMonitoring() {
  isMonitoring = true;

  // Start collecting metrics at regular intervals
  const interval = setInterval(async () => {
    if (!isMonitoring) {
      clearInterval(interval);
      return;
    }

    const metrics = await collectSystemMetrics();
    addMetricsToHistory(metrics);
    checkAlerts(metrics);
  }, AGENT_CONFIG.monitoring.updateInterval);

  return successResponse({
    message: "Monitoring rozpoczęty",
    interval: AGENT_CONFIG.monitoring.updateInterval,
    isMonitoring: true,
  });
}

function stopMonitoring() {
  isMonitoring = false;

  return successResponse({
    message: "Monitoring zatrzymany",
    isMonitoring: false,
    historySize: metricsHistory.length,
  });
}

async function getCurrentMetrics() {
  const metrics = await collectSystemMetrics();

  return successResponse({
    timestamp: Date.now(),
    metrics: metrics,
    isMonitoring: isMonitoring,
  });
}

function getMetricsHistory(limit = 10) {
  const history = metricsHistory.slice(-limit).map((entry) => ({
    timestamp: entry.timestamp,
    metrics: entry.metrics,
  }));

  return successResponse({
    history: history,
    total: metricsHistory.length,
    limit: limit,
  });
}

async function collectSystemMetrics() {
  const metrics: any = {
    timestamp: Date.now(),
    system: {},
    performance: {},
    application: {},
  };

  // System Metrics
  if (
    "memory" in performance &&
    "usedJSHeapSize" in (performance as any).memory
  ) {
    const memory = (performance as any).memory;
    metrics.system.memory = {
      used: Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100, // MB
      total: Math.round((memory.totalJSHeapSize / 1024 / 1024) * 100) / 100, // MB
      limit: Math.round((memory.jsHeapSizeLimit / 1024 / 1024) * 100) / 100, // MB
      usage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100), // %
    };
  }

  // Network Connection
  if ("connection" in navigator) {
    const connection = (navigator as any).connection;
    metrics.system.network = {
      effectiveType: connection.effectiveType || "unknown",
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false,
    };
  }

  // Battery Status (if available)
  if ("getBattery" in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      metrics.system.battery = {
        level: Math.round(battery.level * 100), // %
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      };
    } catch (error) {
      // Battery API not available
    }
  }

  // Performance Metrics
  if ("getEntriesByType" in performance) {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      metrics.performance = {
        domLoadTime: Math.round(
          navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart
        ),
        pageLoadTime: Math.round(
          navigation.loadEventEnd - navigation.fetchStart
        ),
        dnsTime: Math.round(
          navigation.domainLookupEnd - navigation.domainLookupStart
        ),
        connectTime: Math.round(
          navigation.connectEnd - navigation.connectStart
        ),
        responseTime: Math.round(
          navigation.responseEnd - navigation.requestStart
        ),
      };
    }
  }

  // Application Metrics
  metrics.application = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    activeAgents: getActiveAgentsCount(),
    timestamp: new Date().toISOString(),
  };

  return metrics;
}

function addMetricsToHistory(metrics: any) {
  metricsHistory.push({
    timestamp: Date.now(),
    metrics: metrics,
  });

  // Keep only last N entries
  if (metricsHistory.length > AGENT_CONFIG.monitoring.historyLimit) {
    metricsHistory = metricsHistory.slice(
      -AGENT_CONFIG.monitoring.historyLimit
    );
  }
}

function checkAlerts(metrics: any) {
  const alerts = [];
  const now = Date.now();

  // Memory usage alert
  if (
    metrics.system.memory &&
    metrics.system.memory.usage > AGENT_CONFIG.monitoring.alertThresholds.memory
  ) {
    if (
      !lastAlert["memory"] ||
      now - lastAlert["memory"] > AGENT_CONFIG.alerts.cooldown
    ) {
      alerts.push({
        type: "memory",
        level: "warning",
        message: `Wysokie użycie pamięci: ${metrics.system.memory.usage}%`,
        value: metrics.system.memory.usage,
        threshold: AGENT_CONFIG.monitoring.alertThresholds.memory,
      });
      lastAlert["memory"] = now;
    }
  }

  // Battery level alert
  if (metrics.system.battery && metrics.system.battery.level < 20) {
    if (
      !lastAlert["battery"] ||
      now - lastAlert["battery"] > AGENT_CONFIG.alerts.cooldown
    ) {
      alerts.push({
        type: "battery",
        level: "warning",
        message: `Niski poziom baterii: ${metrics.system.battery.level}%`,
        value: metrics.system.battery.level,
        threshold: 20,
      });
      lastAlert["battery"] = now;
    }
  }

  return alerts;
}

function getActiveAlerts() {
  const recentAlerts = Object.entries(lastAlert)
    .filter(([_, timestamp]) => Date.now() - timestamp < 5 * 60 * 1000) // 5 minutes
    .map(([type, timestamp]) => ({ type, timestamp }));

  return successResponse({
    alerts: recentAlerts,
    alertsEnabled: AGENT_CONFIG.alerts.enabled,
  });
}

function getActiveAgentsCount() {
  // In a real implementation, this would check how many agents are currently running
  return Math.floor(Math.random() * 8) + 1; // Mock: 1-8 agents
}

function getAgentStatus() {
  return successResponse({
    agent: AGENT_CONFIG.name,
    status: "operational",
    isMonitoring: isMonitoring,
    historySize: metricsHistory.length,
    lastUpdate:
      metricsHistory.length > 0
        ? metricsHistory[metricsHistory.length - 1].timestamp
        : null,
    uptime: Date.now(), // In real app, this would be actual uptime
    config: {
      updateInterval: AGENT_CONFIG.monitoring.updateInterval,
      historyLimit: AGENT_CONFIG.monitoring.historyLimit,
      alertsEnabled: AGENT_CONFIG.alerts.enabled,
    },
  });
}

// Utility Functions
function successResponse(data: any) {
  return new Response(
    JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      agent: AGENT_CONFIG.id,
      ...data,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

function errorResponse(message: string) {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
      agent: AGENT_CONFIG.id,
    }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }
  );
}
