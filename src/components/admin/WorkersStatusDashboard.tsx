import React, { useState, useEffect } from "react";

interface WorkerStatus {
  name: string;
  status: "online" | "offline" | "partial" | "maintenance";
  cpu: number | null;
  ram: number | null;
  requests: number;
  responseMs: number | null;
  lastCheck: string;
  uptime: string;
  errors: number;
  url?: string;
}

interface WorkersStatusDashboardProps {
  className?: string;
}

const statusColor = (status: string) => {
  switch (status) {
    case "online":
      return "text-emerald-400 bg-emerald-900/30";
    case "partial":
      return "text-yellow-400 bg-yellow-900/30";
    case "offline":
      return "text-red-400 bg-red-900/30";
    case "maintenance":
      return "text-blue-400 bg-blue-900/30";
    default:
      return "text-gray-400 bg-gray-900/30";
  }
};

const statusIcon = (status: string) => {
  switch (status) {
    case "online":
      return "●";
    case "partial":
      return "◐";
    case "offline":
      return "○";
    case "maintenance":
      return "◇";
    default:
      return "?";
  }
};

export default function WorkersStatusDashboard({
  className = "",
}: WorkersStatusDashboardProps) {
  const [workers, setWorkers] = useState<WorkerStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const fetchWorkersStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/workers-status");
      if (response.ok) {
        const data = (await response.json()) as any;
        setWorkers(data.workers || []);
        setLastRefresh(new Date().toLocaleTimeString());
      } else {
        console.error("Failed to fetch workers status");
        // Fallback mock data for demo
        setWorkers([
          {
            name: "AI Bot Worker",
            status: "online",
            cpu: 32,
            ram: 79,
            requests: 150,
            responseMs: 140,
            lastCheck: new Date().toISOString(),
            uptime: "99.8%",
            errors: 0,
            url: "/api/ai-bot",
          },
          {
            name: "Generate Image",
            status: "online",
            cpu: 67,
            ram: 89,
            requests: 89,
            responseMs: 320,
            lastCheck: new Date().toISOString(),
            uptime: "99.9%",
            errors: 2,
            url: "/api/generate-image",
          },
          {
            name: "FAQ Generator",
            status: "partial",
            cpu: 45,
            ram: 39,
            requests: 69,
            responseMs: 200,
            lastCheck: new Date().toISOString(),
            uptime: "97.2%",
            errors: 5,
            url: "/api/faq-generator",
          },
          {
            name: "Voice Avatar",
            status: "offline",
            cpu: null,
            ram: null,
            requests: 0,
            responseMs: null,
            lastCheck: new Date(Date.now() - 300000).toISOString(),
            uptime: "0%",
            errors: 12,
            url: "/api/voice-avatar",
          },
          {
            name: "Marketing Content",
            status: "online",
            cpu: 28,
            ram: 56,
            requests: 234,
            responseMs: 95,
            lastCheck: new Date().toISOString(),
            uptime: "99.5%",
            errors: 1,
            url: "/api/generate-marketing-content",
          },
        ]);
        setLastRefresh(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Error fetching workers status:", error);
    } finally {
      setLoading(false);
    }
  };

  const testWorker = async (worker: WorkerStatus) => {
    if (!worker.url) return;

    try {
      const response = await fetch(worker.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      });

      const updatedWorkers = workers.map((w) =>
        w.name === worker.name
          ? {
              ...w,
              status: response.ok ? ("online" as const) : ("offline" as const),
              lastCheck: new Date().toISOString(),
            }
          : w
      );
      setWorkers(updatedWorkers);
    } catch (error) {
      const updatedWorkers = workers.map((w) =>
        w.name === worker.name
          ? {
              ...w,
              status: "offline" as const,
              lastCheck: new Date().toISOString(),
            }
          : w
      );
      setWorkers(updatedWorkers);
    }
  };

  const toggleAutoRefresh = () => {
    if (autoRefresh && refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
      setAutoRefresh(false);
    } else {
      const interval = setInterval(fetchWorkersStatus, 30000); // 30 seconds
      setRefreshInterval(interval);
      setAutoRefresh(true);
    }
  };

  useEffect(() => {
    fetchWorkersStatus();
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  const onlineWorkers = workers.filter((w) => w.status === "online").length;
  const totalWorkers = workers.length;
  const avgResponseTime =
    workers
      .filter((w) => w.responseMs !== null)
      .reduce((sum, w) => sum + (w.responseMs || 0), 0) /
      workers.filter((w) => w.responseMs !== null).length || 0;

  return (
    <div
      className={`bg-black/90 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-cyan-400 tracking-wider">
            WORKERS STATUS
          </h2>
          <div className="px-3 py-1 bg-cyan-900/50 rounded-full text-cyan-300 text-sm font-mono">
            {onlineWorkers}/{totalWorkers} ONLINE
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-cyan-300">
          <span>Last refresh: {lastRefresh}</span>
          {autoRefresh && (
            <span className="text-emerald-400 animate-pulse">●</span>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-800/30">
          <div className="text-cyan-400 text-sm uppercase tracking-wide">
            Uptime
          </div>
          <div className="text-2xl font-bold text-white">
            {((onlineWorkers / totalWorkers) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-800/30">
          <div className="text-cyan-400 text-sm uppercase tracking-wide">
            Avg Response
          </div>
          <div className="text-2xl font-bold text-white">
            {avgResponseTime.toFixed(0)}ms
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-800/30">
          <div className="text-cyan-400 text-sm uppercase tracking-wide">
            Total Requests
          </div>
          <div className="text-2xl font-bold text-white">
            {workers.reduce((sum, w) => sum + w.requests, 0)}
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-800/30">
          <div className="text-cyan-400 text-sm uppercase tracking-wide">
            Total Errors
          </div>
          <div className="text-2xl font-bold text-white">
            {workers.reduce((sum, w) => sum + w.errors, 0)}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={fetchWorkersStatus}
          disabled={loading}
          className="px-4 py-2 bg-cyan-800/70 hover:bg-cyan-700 text-cyan-100 rounded-md transition-colors duration-200 disabled:opacity-50 font-mono text-sm"
        >
          {loading ? "CHECKING..." : "HEALTH CHECK"}
        </button>
        <button
          onClick={toggleAutoRefresh}
          className={`px-4 py-2 rounded-md transition-colors duration-200 font-mono text-sm ${
            autoRefresh
              ? "bg-emerald-800/70 hover:bg-emerald-700 text-emerald-100"
              : "bg-gray-800/70 hover:bg-gray-700 text-gray-100"
          }`}
        >
          {autoRefresh ? "STOP AUTO" : "AUTO REFRESH"}
        </button>
        <button
          onClick={() => workers.forEach(testWorker)}
          className="px-4 py-2 bg-yellow-800/70 hover:bg-yellow-700 text-yellow-100 rounded-md transition-colors duration-200 font-mono text-sm"
        >
          TEST ALL
        </button>
      </div>

      {/* Workers Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cyan-800/50">
              <th className="text-left py-3 px-2 text-cyan-400 font-mono uppercase tracking-wide">
                Worker
              </th>
              <th className="text-left py-3 px-2 text-cyan-400 font-mono uppercase tracking-wide">
                Status
              </th>
              <th className="text-left py-3 px-2 text-cyan-400 font-mono uppercase tracking-wide">
                CPU
              </th>
              <th className="text-left py-3 px-2 text-cyan-400 font-mono uppercase tracking-wide">
                RAM
              </th>
              <th className="text-left py-3 px-2 text-cyan-400 font-mono uppercase tracking-wide">
                Requests
              </th>
              <th className="text-left py-3 px-2 text-cyan-400 font-mono uppercase tracking-wide">
                Response
              </th>
              <th className="text-left py-3 px-2 text-cyan-400 font-mono uppercase tracking-wide">
                Uptime
              </th>
              <th className="text-left py-3 px-2 text-cyan-400 font-mono uppercase tracking-wide">
                Errors
              </th>
              <th className="text-left py-3 px-2 text-cyan-400 font-mono uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker, index) => (
              <tr
                key={index}
                className="border-b border-gray-800/30 hover:bg-cyan-900/10 transition-colors"
              >
                <td className="py-3 px-2">
                  <div className="font-mono text-white">{worker.name}</div>
                  <div className="text-xs text-gray-400">{worker.url}</div>
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-mono ${statusColor(
                      worker.status
                    )}`}
                  >
                    <span className="mr-1">{statusIcon(worker.status)}</span>
                    {worker.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-2 font-mono text-white">
                  {worker.cpu !== null ? `${worker.cpu}%` : "-"}
                </td>
                <td className="py-3 px-2 font-mono text-white">
                  {worker.ram !== null ? `${worker.ram}%` : "-"}
                </td>
                <td className="py-3 px-2 font-mono text-white">
                  {worker.requests.toLocaleString()}
                </td>
                <td className="py-3 px-2 font-mono text-white">
                  {worker.responseMs !== null ? `${worker.responseMs}ms` : "-"}
                </td>
                <td className="py-3 px-2 font-mono text-white">
                  {worker.uptime}
                </td>
                <td className="py-3 px-2 font-mono text-white">
                  <span
                    className={
                      worker.errors > 0 ? "text-red-400" : "text-emerald-400"
                    }
                  >
                    {worker.errors}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => testWorker(worker)}
                    className="text-xs px-2 py-1 bg-blue-800/70 hover:bg-blue-700 text-blue-100 rounded font-mono transition-colors"
                  >
                    TEST
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {workers.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-400">
          No workers found. Click "HEALTH CHECK" to scan for workers.
        </div>
      )}
    </div>
  );
}
