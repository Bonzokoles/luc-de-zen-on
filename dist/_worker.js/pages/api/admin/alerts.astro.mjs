globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
export { r as renderers } from '../../../chunks/_@astro-renderers_ChtfEq-M.mjs';
=======
export { r as renderers } from '../../../chunks/_@astro-renderers_DzCkhAcZ.mjs';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

const GET = async ({ request }) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
  try {
    const alertsData = {
      summary: {
        total: 12,
        critical: 2,
        warning: 5,
        info: 4,
        resolved: 1
      },
      alerts: [
        {
          id: "alert_001",
          type: "critical",
          title: "High Memory Usage",
          message: "Memory usage has exceeded 85% threshold on production worker",
          component: "ai-workers",
          timestamp: new Date(Date.now() - 15 * 60 * 1e3).toISOString(),
          // 15 minutes ago
          status: "active",
          severity: "critical",
          source: "system_monitor",
          details: {
            currentValue: "87.3%",
            threshold: "85%",
            trend: "increasing",
            affectedServices: ["polaczek-chat", "bielik-worker"]
          }
        },
        {
          id: "alert_002",
          type: "critical",
          title: "API Response Timeout",
          message: "Multiple API endpoints responding slowly (>5s response time)",
          component: "api-gateway",
          timestamp: new Date(Date.now() - 25 * 60 * 1e3).toISOString(),
          // 25 minutes ago
          status: "active",
          severity: "critical",
          source: "performance_monitor",
          details: {
            currentValue: "7.2s",
            threshold: "5.0s",
            trend: "stable",
            affectedServices: ["generate-image", "polaczek-chat", "bigquery"]
          }
        },
        {
          id: "alert_003",
          type: "warning",
          title: "High CPU Usage",
          message: "CPU usage has exceeded 75% threshold",
          component: "bielik-worker",
          timestamp: new Date(Date.now() - 45 * 60 * 1e3).toISOString(),
          // 45 minutes ago
          status: "active",
          severity: "warning",
          source: "resource_monitor",
          details: {
            currentValue: "78.5%",
            threshold: "75%",
            trend: "decreasing",
            affectedServices: ["bielik-chat"]
          }
        },
        {
          id: "alert_004",
          type: "warning",
          title: "Storage Space Low",
          message: "Available disk space is below 20%",
          component: "storage",
          timestamp: new Date(Date.now() - 60 * 60 * 1e3).toISOString(),
          // 1 hour ago
          status: "active",
          severity: "warning",
          source: "storage_monitor",
          details: {
            currentValue: "18.2%",
            threshold: "20%",
            trend: "decreasing",
            affectedServices: ["logs", "cache", "uploads"]
          }
        },
        {
          id: "alert_005",
          type: "warning",
          title: "Unusual Traffic Pattern",
          message: "Traffic spike detected - 300% above normal",
          component: "load_balancer",
          timestamp: new Date(Date.now() - 90 * 60 * 1e3).toISOString(),
          // 1.5 hours ago
          status: "monitoring",
          severity: "warning",
          source: "traffic_analyzer",
          details: {
            currentValue: "1,247 req/min",
            threshold: "400 req/min",
            trend: "stable",
            affectedServices: ["all"]
          }
        },
        {
          id: "alert_006",
          type: "info",
          title: "Scheduled Maintenance",
          message: "Maintenance window scheduled for tonight 2:00 AM - 4:00 AM UTC",
          component: "system",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString(),
          // 2 hours ago
          status: "scheduled",
          severity: "info",
          source: "maintenance_scheduler",
          details: {
            scheduledStart: new Date(Date.now() + 6 * 60 * 60 * 1e3).toISOString(),
            // 6 hours from now
            estimatedDuration: "2 hours",
            affectedServices: ["database", "cache"]
          }
        },
        {
          id: "alert_007",
          type: "info",
          title: "Backup Completed",
          message: "Daily backup successfully completed",
          component: "backup_system",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1e3).toISOString(),
          // 3 hours ago
          status: "resolved",
          severity: "info",
          source: "backup_monitor",
          details: {
            backupSize: "2.3 GB",
            duration: "12 minutes",
            location: "s3://mybonzo-backups/daily/"
          }
        }
      ],
      systemHealth: {
        overallStatus: "warning",
        uptime: "99.7%",
        lastIncident: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3).toISOString(),
        // 7 days ago
        mttr: "4.2 minutes",
        // Mean Time To Recovery
        mtbf: "168 hours"
        // Mean Time Between Failures
      }
    };
    return new Response(JSON.stringify(alertsData), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("Error fetching alerts data:", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch alerts data",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers
    });
  }
};
const POST = async ({ request }) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
  try {
    const body = await request.json();
    const { title, message, type = "info", component, severity = "info" } = body;
    if (!title || !message) {
      return new Response(JSON.stringify({
        error: "Missing required parameters",
        required: ["title", "message"]
      }), {
        status: 400,
        headers
      });
    }
    const newAlert = {
      id: `alert_${Date.now()}`,
      type,
      title,
      message,
      component: component || "manual",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "active",
      severity,
      source: "admin_panel",
      details: {
        createdBy: "admin@mybonzo.com",
        manual: true
      }
    };
    return new Response(JSON.stringify({
      success: true,
      alert: newAlert,
      message: "Alert created successfully"
    }), {
      status: 201,
      headers
    });
  } catch (error) {
    console.error("Error creating alert:", error);
    return new Response(JSON.stringify({
      error: "Failed to create alert",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers
    });
  }
};
const DELETE = async ({ request }) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
  try {
    const url = new URL(request.url);
    const alertId = url.searchParams.get("id");
    if (!alertId) {
      return new Response(JSON.stringify({
        error: "Missing alert ID parameter"
      }), {
        status: 400,
        headers
      });
    }
    return new Response(JSON.stringify({
      success: true,
      alertId,
      status: "resolved",
      resolvedAt: (/* @__PURE__ */ new Date()).toISOString(),
      resolvedBy: "admin@mybonzo.com",
      message: `Alert ${alertId} has been resolved`
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("Error resolving alert:", error);
    return new Response(JSON.stringify({
      error: "Failed to resolve alert",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers
    });
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
