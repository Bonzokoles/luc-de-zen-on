/**
 * Error and Health Monitoring Dashboard
 * React component for displaying system health and error logs
 */

import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";

interface ErrorReport {
  name: string;
  message: string;
  type: string;
  severity: string;
  timestamp: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  context?: Record<string, any>;
  stackTrace: string;
  serverTimestamp?: string;
  ip?: string;
}

interface HealthCheck {
  name: string;
  status: "healthy" | "warning" | "critical";
  lastCheck: string;
  responseTime: number;
  details?: Record<string, any>;
  error?: string;
}

interface HealthData {
  status: "healthy" | "warning" | "critical";
  timestamp: string;
  uptime: number;
  version: string;
  services: HealthCheck[];
  performance?: {
    averageResponseTime: number;
    requestCount: number;
    errorRate: number;
  };
  memoryUsage?: {
    used: number;
    total: number;
    percentage: number;
  };
}

interface ErrorData {
  errors: ErrorReport[];
  summary: {
    total: number;
    filtered: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    last24Hours: number;
  };
}

const MonitoringDashboard: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"health" | "errors">("health");

  // Fetch health data
  const fetchHealthData = async () => {
    try {
      const response = await fetch("/api/health?detailed=true");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = (await response.json()) as any;
      setHealthData(data);
    } catch (err) {
      console.error("Failed to fetch health data:", err);
      setError("Failed to load health data");
    }
  };

  // Fetch error data
  const fetchErrorData = async () => {
    try {
      const response = await fetch("/api/errors?limit=50");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = (await response.json()) as any;
      setErrorData(data);
    } catch (err) {
      console.error("Failed to fetch error data:", err);
      setError("Failed to load error data");
    }
  };

  // Load data
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([fetchHealthData(), fetchErrorData()]);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Clear all errors
  const clearErrors = async () => {
    try {
      const response = await fetch("/api/errors?action=clear", {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchErrorData(); // Refresh data
      }
    } catch (err) {
      console.error("Failed to clear errors:", err);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    loadData();

    if (autoRefresh) {
      const interval = setInterval(loadData, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Status badge component
  const StatusBadge: React.FC<{ status: string; children: ReactNode }> = ({
    status,
    children,
  }) => <span className={`status-badge status-${status}`}>{children}</span>;

  // Format uptime
  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading monitoring data...</p>
      </div>
    );
  }

  return (
    <div className="monitoring-dashboard">
      <div className="dashboard-header">
        <h1>System Monitoring Dashboard</h1>
        <div className="dashboard-controls">
          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh (30s)
          </label>
          <button onClick={loadData} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && <div className="dashboard-error">⚠️ {error}</div>}

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${selectedTab === "health" ? "active" : ""}`}
          onClick={() => setSelectedTab("health")}
        >
          System Health
        </button>
        <button
          className={`tab-btn ${selectedTab === "errors" ? "active" : ""}`}
          onClick={() => setSelectedTab("errors")}
        >
          Error Logs
          {(errorData?.summary.last24Hours || 0) > 0 && (
            <span className="error-count">
              {errorData?.summary.last24Hours}
            </span>
          )}
        </button>
      </div>

      {selectedTab === "health" && healthData && (
        <div className="health-panel">
          <div className="health-overview">
            <div className="health-card">
              <h3>Overall Status</h3>
              <StatusBadge status={healthData.status}>
                {healthData.status.toUpperCase()}
              </StatusBadge>
            </div>

            <div className="health-card">
              <h3>Uptime</h3>
              <div className="metric-value">
                {formatUptime(healthData.uptime)}
              </div>
            </div>

            <div className="health-card">
              <h3>Version</h3>
              <div className="metric-value">{healthData.version}</div>
            </div>

            {healthData.performance && (
              <div className="health-card">
                <h3>Performance</h3>
                <div className="metric-value">
                  {healthData.performance.averageResponseTime.toFixed(1)}ms avg
                </div>
                <div className="metric-detail">
                  {healthData.performance.requestCount} requests
                  {healthData.performance.errorRate > 0 && (
                    <span className="error-rate">
                      • {healthData.performance.errorRate.toFixed(1)}% errors
                    </span>
                  )}
                </div>
              </div>
            )}

            {healthData.memoryUsage && (
              <div className="health-card">
                <h3>Memory</h3>
                <div className="metric-value">
                  {healthData.memoryUsage.percentage.toFixed(1)}%
                </div>
                <div className="metric-detail">
                  {healthData.memoryUsage.used.toFixed(1)}MB /{" "}
                  {healthData.memoryUsage.total.toFixed(1)}MB
                </div>
              </div>
            )}
          </div>

          <div className="services-grid">
            {healthData.services.map((service) => (
              <div key={service.name} className="service-card">
                <div className="service-header">
                  <h4>{service.name}</h4>
                  <StatusBadge status={service.status}>
                    {service.status}
                  </StatusBadge>
                </div>
                <div className="service-metrics">
                  <div className="metric">
                    <span className="metric-label">Response Time:</span>
                    <span className="metric-value">
                      {service.responseTime.toFixed(1)}ms
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Last Check:</span>
                    <span className="metric-value">
                      {formatTimestamp(service.lastCheck)}
                    </span>
                  </div>
                </div>
                {service.error && (
                  <div className="service-error">❌ {service.error}</div>
                )}
                {service.details && (
                  <details className="service-details">
                    <summary>Details</summary>
                    <pre>{JSON.stringify(service.details, null, 2)}</pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === "errors" && errorData && (
        <div className="errors-panel">
          <div className="errors-header">
            <div className="errors-summary">
              <h3>Error Summary</h3>
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-label">Total:</span>
                  <span className="stat-value">{errorData.summary.total}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Last 24h:</span>
                  <span className="stat-value">
                    {errorData.summary.last24Hours}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={clearErrors} className="clear-errors-btn">
              🗑️ Clear All
            </button>
          </div>

          <div className="error-type-summary">
            <div className="type-breakdown">
              <h4>By Type</h4>
              {Object.entries(errorData.summary.byType).map(([type, count]) => (
                <div key={type} className="type-count">
                  <span className="type-name">{type}:</span>
                  <span className="type-value">{count}</span>
                </div>
              ))}
            </div>
            <div className="severity-breakdown">
              <h4>By Severity</h4>
              {Object.entries(errorData.summary.bySeverity).map(
                ([severity, count]) => (
                  <div key={severity} className="severity-count">
                    <StatusBadge
                      status={
                        severity === "critical" || severity === "high"
                          ? "critical"
                          : severity === "medium"
                          ? "warning"
                          : "healthy"
                      }
                    >
                      {severity}: {count}
                    </StatusBadge>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="errors-list">
            {errorData.errors.map((error, index) => (
              <div key={index} className="error-item">
                <div className="error-header">
                  <div className="error-title">
                    <StatusBadge
                      status={
                        error.severity === "critical" ||
                        error.severity === "high"
                          ? "critical"
                          : error.severity === "medium"
                          ? "warning"
                          : "healthy"
                      }
                    >
                      {error.severity}
                    </StatusBadge>
                    <span className="error-type">{error.type}</span>
                    <span className="error-timestamp">
                      {formatTimestamp(error.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="error-message">{error.message}</div>
                {error.url && (
                  <div className="error-url">
                    <span className="error-label">URL:</span> {error.url}
                  </div>
                )}
                {error.context && (
                  <details className="error-context">
                    <summary>Context</summary>
                    <pre>{JSON.stringify(error.context, null, 2)}</pre>
                  </details>
                )}
                <details className="error-stack">
                  <summary>Stack Trace</summary>
                  <pre>{error.stackTrace}</pre>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .monitoring-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          margin: 0;
          color: #1f2937;
        }

        .dashboard-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .auto-refresh-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .refresh-btn {
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .refresh-btn:hover {
          background: #2563eb;
        }

        .dashboard-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .dashboard-loading {
          text-align: center;
          padding: 4rem 2rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .dashboard-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 2rem;
        }

        .tab-btn {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          position: relative;
        }

        .tab-btn.active {
          border-bottom-color: #3b82f6;
          color: #3b82f6;
        }

        .error-count {
          background: #dc2626;
          color: white;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          margin-left: 0.5rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-healthy {
          background: #d1fae5;
          color: #065f46;
        }

        .status-warning {
          background: #fef3c7;
          color: #92400e;
        }

        .status-critical {
          background: #fee2e2;
          color: #991b1b;
        }

        .health-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .health-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .health-card h3 {
          margin: 0 0 1rem 0;
          font-size: 0.875rem;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.05em;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
        }

        .metric-detail {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .error-rate {
          color: #dc2626;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .service-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .service-header h4 {
          margin: 0;
          text-transform: capitalize;
        }

        .service-metrics {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .metric {
          display: flex;
          justify-content: space-between;
        }

        .metric-label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .service-error {
          background: #fef2f2;
          color: #dc2626;
          padding: 0.5rem;
          border-radius: 4px;
          margin-top: 0.5rem;
          font-size: 0.875rem;
        }

        .service-details {
          margin-top: 1rem;
        }

        .service-details pre {
          background: #f9fafb;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          overflow-x: auto;
        }

        .errors-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .errors-summary h3 {
          margin: 0 0 0.5rem 0;
        }

        .summary-stats {
          display: flex;
          gap: 2rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .clear-errors-btn {
          padding: 0.5rem 1rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .clear-errors-btn:hover {
          background: #b91c1c;
        }

        .error-type-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .type-breakdown h4,
        .severity-breakdown h4 {
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .type-count,
        .severity-count {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .errors-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .error-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
        }

        .error-header {
          margin-bottom: 0.5rem;
        }

        .error-title {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .error-type {
          font-weight: 600;
          color: #374151;
        }

        .error-timestamp {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .error-message {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .error-url {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .error-label {
          font-weight: 500;
        }

        .error-context,
        .error-stack {
          margin-top: 0.5rem;
        }

        .error-context pre,
        .error-stack pre {
          background: #f9fafb;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
};

export default MonitoringDashboard;
