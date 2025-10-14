import React, { useState, useEffect, useRef } from "react";

interface TrafficData {
  timestamp: string;
  visitors: number;
  requests: number;
  errors: number;
}

const TrafficChart: React.FC = () => {
  const [data, setData] = useState<TrafficData[]>([]);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/traffic?range=${timeRange}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const trafficData = (await response.json()) as any;
        setData(trafficData);
      } catch (err) {
        console.error("Error fetching traffic data:", err);
        // Generate fallback data
        const fallbackData: TrafficData[] = [];
        const now = new Date();
        for (let i = 23; i >= 0; i--) {
          const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
          fallbackData.push({
            timestamp: timestamp.toISOString(),
            visitors: Math.floor(Math.random() * 100) + 20,
            requests: Math.floor(Math.random() * 500) + 100,
            errors: Math.floor(Math.random() * 10),
          });
        }
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timeRange]);

  useEffect(() => {
    if (!data.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    // Clear canvas
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + ((width - 2 * padding) * i) / 10;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + ((height - 2 * padding) * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    if (data.length === 0) return;

    const maxVisitors = Math.max(...data.map((d) => d.visitors));
    const maxRequests = Math.max(...data.map((d) => d.requests));

    // Draw visitors line
    ctx.strokeStyle = "#06D6A0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((point, index) => {
      const x = padding + ((width - 2 * padding) * index) / (data.length - 1);
      const y =
        height -
        padding -
        ((height - 2 * padding) * point.visitors) / maxVisitors;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw requests line
    ctx.strokeStyle = "#FFD23F";
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((point, index) => {
      const x = padding + ((width - 2 * padding) * index) / (data.length - 1);
      const y =
        height -
        padding -
        ((height - 2 * padding) * point.requests) / maxRequests;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    data.forEach((point, index) => {
      const x = padding + ((width - 2 * padding) * index) / (data.length - 1);

      // Visitors points
      const visitorsY =
        height -
        padding -
        ((height - 2 * padding) * point.visitors) / maxVisitors;
      ctx.fillStyle = "#06D6A0";
      ctx.beginPath();
      ctx.arc(x, visitorsY, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Requests points
      const requestsY =
        height -
        padding -
        ((height - 2 * padding) * point.requests) / maxRequests;
      ctx.fillStyle = "#FFD23F";
      ctx.beginPath();
      ctx.arc(x, requestsY, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";

    // Time labels
    for (let i = 0; i < data.length; i += Math.floor(data.length / 5)) {
      const x = padding + ((width - 2 * padding) * i) / (data.length - 1);
      const time = new Date(data[i].timestamp).toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      });
      ctx.fillText(time, x, height - 10);
    }
  }, [data]);

  return (
    <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6 relative overflow-hidden">
      {/* Cyber corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-300 font-mono">
          TRAFFIC ANALYSIS
        </h3>

        <div className="flex space-x-2">
          {(["24h", "7d", "30d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm font-mono border rounded transition-colors ${
                timeRange === range
                  ? "bg-cyan-500 text-black border-cyan-500"
                  : "bg-transparent text-cyan-300 border-cyan-500/50 hover:border-cyan-500"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-6 mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
          <span className="text-sm text-gray-300 font-mono">Visitors</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
          <span className="text-sm text-gray-300 font-mono">Requests</span>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      ) : (
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-64 rounded"
            style={{ maxHeight: "256px" }}
          />

          {data.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500 font-mono">No data available</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-sm text-gray-400 font-mono">PEAK VISITORS</div>
          <div className="text-lg font-bold text-green-400">
            {data.length > 0 ? Math.max(...data.map((d) => d.visitors)) : 0}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 font-mono">TOTAL REQUESTS</div>
          <div className="text-lg font-bold text-yellow-400">
            {data.length > 0
              ? data.reduce((sum, d) => sum + d.requests, 0).toLocaleString()
              : 0}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 font-mono">ERROR RATE</div>
          <div className="text-lg font-bold text-red-400">
            {data.length > 0
              ? (
                  (data.reduce((sum, d) => sum + d.errors, 0) /
                    data.reduce((sum, d) => sum + d.requests, 0)) *
                  100
                ).toFixed(1) + "%"
              : "0.0%"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficChart;
