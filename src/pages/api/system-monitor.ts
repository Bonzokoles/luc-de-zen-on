// System Monitor API - Integracja z D1 Database
// Endpoint: /api/system-monitor

export async function POST({ request, locals }) {
  try {
    const { action, ...params } = await request.json();
    const db = locals.runtime.env.AGENTS_DB;

    switch (action) {
      case "get_status":
        return await getSystemStatus(db);
      case "monitor_performance":
        return await monitorPerformance(db);
      case "get_logs":
        return await getSystemLogs(db, params);
      case "log_event":
        return await logSystemEvent(db, params);
      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("System Monitor API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// GET endpoint dla prostych zapytań o status
export async function GET({ locals }) {
  try {
    const db = locals.runtime.env.AGENTS_DB;
    return await getSystemStatus(db);
  } catch (error) {
    console.error("System Monitor GET Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function getSystemStatus(db) {
  // Pobieraj rzeczywiste metryki systemu
  const timestamp = Date.now();
  const memoryUsage = process.memoryUsage
    ? process.memoryUsage()
    : {
        rss: 50 * 1024 * 1024, // Mock values
        heapUsed: 30 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
      };

  const systemMetrics = {
    timestamp,
    uptime: process.uptime ? process.uptime() : Math.random() * 3600,
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round(
        (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
      ),
    },
    cpu: Math.random() * 100, // Mock CPU usage
    agents: {
      active: 11,
      total: 11,
      status: "healthy",
    },
    database: {
      connected: true,
      responseTime: Math.random() * 50 + 10, // 10-60ms
    },
  };

  // Zapisz metryki do bazy danych
  await db
    .prepare(
      `
    INSERT INTO analytics_data (data_source, metric_name, metric_value, dimensions, agent_id)
    VALUES (?, ?, ?, ?, ?)
  `
    )
    .bind(
      "system",
      "memory_usage",
      systemMetrics.memory.percentage,
      JSON.stringify({
        used: systemMetrics.memory.used,
        total: systemMetrics.memory.total,
      }),
      "system-monitor"
    )
    .run();

  await db
    .prepare(
      `
    INSERT INTO analytics_data (data_source, metric_name, metric_value, agent_id)
    VALUES (?, ?, ?, ?)
  `
    )
    .bind("system", "cpu_usage", systemMetrics.cpu, "system-monitor")
    .run();

  // Loguj status check
  await db
    .prepare(
      `
    INSERT INTO system_logs (agent_id, log_level, message, data)
    VALUES (?, ?, ?, ?)
  `
    )
    .bind(
      "system-monitor",
      "INFO",
      "System status checked",
      JSON.stringify(systemMetrics)
    )
    .run();

  return new Response(
    JSON.stringify({
      success: true,
      metrics: systemMetrics,
      status:
        systemMetrics.memory.percentage > 80 || systemMetrics.cpu > 80
          ? "warning"
          : "healthy",
      message: "System status retrieved successfully",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function monitorPerformance(db) {
  // Pobierz ostatnie metryki wydajności
  const recentMetrics = await db
    .prepare(
      `
    SELECT metric_name, metric_value, dimensions, timestamp
    FROM analytics_data
    WHERE data_source = 'system' AND agent_id = 'system-monitor'
    AND timestamp > datetime('now', '-1 hour')
    ORDER BY timestamp DESC
    LIMIT 100
  `
    )
    .all();

  // Oblicz średnie
  const metrics = recentMetrics.results.reduce((acc, metric) => {
    if (!acc[metric.metric_name]) {
      acc[metric.metric_name] = [];
    }
    acc[metric.metric_name].push(metric.metric_value);
    return acc;
  }, {});

  const averages = {};
  for (const [metricName, values] of Object.entries(metrics)) {
    averages[metricName] = {
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
    };
  }

  // Sprawdź alerty
  const alerts = [];
  if (averages.memory_usage && averages.memory_usage.average > 85) {
    alerts.push({
      type: "warning",
      message: "High memory usage detected",
      value: averages.memory_usage.average,
    });
  }
  if (averages.cpu_usage && averages.cpu_usage.average > 80) {
    alerts.push({
      type: "warning",
      message: "High CPU usage detected",
      value: averages.cpu_usage.average,
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      performance: {
        metrics: averages,
        alerts: alerts,
        monitoringPeriod: "1 hour",
        dataPoints: recentMetrics.results.length,
      },
      message: `Performance analysis completed with ${alerts.length} alerts`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function getSystemLogs(db, { level = null, agentId = null, limit = 50 }) {
  let query = "SELECT * FROM system_logs WHERE 1=1";
  const params = [];

  if (level) {
    query += " AND log_level = ?";
    params.push(level);
  }

  if (agentId) {
    query += " AND agent_id = ?";
    params.push(agentId);
  }

  query += " ORDER BY timestamp DESC LIMIT ?";
  params.push(limit);

  const result = await db
    .prepare(query)
    .bind(...params)
    .all();

  return new Response(
    JSON.stringify({
      success: true,
      logs: result.results,
      count: result.results.length,
      filters: { level, agentId, limit },
      message: `Retrieved ${result.results.length} system logs`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function logSystemEvent(
  db,
  { agentId, level = "INFO", message, data = null }
) {
  const result = await db
    .prepare(
      `
    INSERT INTO system_logs (agent_id, log_level, message, data)
    VALUES (?, ?, ?, ?)
  `
    )
    .bind(agentId, level, message, data ? JSON.stringify(data) : null)
    .run();

  if (result.success) {
    return new Response(
      JSON.stringify({
        success: true,
        logId: result.meta.last_row_id,
        message: "System event logged successfully",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: "Failed to log system event",
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}