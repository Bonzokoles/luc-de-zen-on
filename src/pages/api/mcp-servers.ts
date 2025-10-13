import type { APIRoute } from "astro";
import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "src", "data", "mcp-servers.json");

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as any).code === "ENOENT") {
      return { servers: [] };
    }
    throw error;
  }
}

async function writeDB(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { action, server_name, config = {} } = (await request.json()) as any;

    if (!action) {
      return new Response(
        JSON.stringify({
          status: "error",
          error: "Action is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let response_data;

    switch (action) {
      case "list_servers":
        response_data = await listMCPServers();
        break;
      case "get_server_status":
        response_data = await getServerStatus(server_name);
        break;
      case "start_server":
        response_data = await startMCPServer(server_name, config);
        break;
      case "stop_server":
        response_data = await stopMCPServer(server_name);
        break;
      case "server_logs":
        response_data = await getServerLogs(server_name);
        break;
      case "create_server":
        response_data = await createMCPServer(server_name, config);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({
        status: "success",
        data: response_data,
        timestamp: Date.now(),
        mcp_integration: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("MCP Servers API Error:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const action = url.searchParams.get("action") || "list_servers";

    let response_data;

    switch (action) {
      case "list_servers":
        response_data = await listMCPServers();
        break;
      case "server_health":
        response_data = await getServerHealth();
        break;
      case "monitoring":
        response_data = await getMonitoringData();
        break;
      default:
        response_data = await listMCPServers();
    }

    return new Response(
      JSON.stringify({
        status: "success",
        data: response_data,
        timestamp: Date.now(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("MCP Servers API Error:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

async function listMCPServers() {
  const db = await readDB();
  const running_servers = db.servers.filter(
    (s: any) => s.status === "running"
  ).length;
  const stopped_servers = db.servers.length - running_servers;
  const total_memory = db.servers.reduce(
    (acc: any, s: any) => acc + parseInt(s.memory_usage),
    0
  );
  const total_cpu = db.servers.reduce(
    (acc: any, s: any) => acc + parseInt(s.cpu_usage),
    0
  );

  return {
    active_servers: db.servers,
    total_servers: db.servers.length,
    running_servers: running_servers,
    stopped_servers: stopped_servers,
    total_memory: `${total_memory}MB`,
    total_cpu: `${total_cpu}%`,
  };
}

async function getServerStatus(serverName: string) {
  const db = await readDB();
  const server = db.servers.find((s: any) => s.name === serverName);

  if (!server) {
    throw new Error(`Server ${serverName} not found`);
  }

  return {
    server,
    metrics: {
      requests_per_minute: Math.floor(Math.random() * 50) + 10,
      error_rate: Math.random() * 5,
      response_time_avg: Math.floor(Math.random() * 200) + 50,
      active_connections: Math.floor(Math.random() * 20) + 5,
    },
    logs: [
      `[${new Date().toISOString()}] Server ${serverName} responding normally`,
      `[${new Date(
        Date.now() - 60000
      ).toISOString()}] Processing request from client`,
      `[${new Date(
        Date.now() - 120000
      ).toISOString()}] Server started successfully`,
    ],
  };
}

async function startMCPServer(serverName: string, config: any) {
  const db = await readDB();
  const server = db.servers.find((s: any) => s.name === serverName);
  if (server) {
    server.status = "running";
    await writeDB(db);
  }
  return { server_name: serverName, status: "running" };
}

async function stopMCPServer(serverName: string) {
  const db = await readDB();
  const server = db.servers.find((s: any) => s.name === serverName);
  if (server) {
    server.status = "stopped";
    await writeDB(db);
  }
  return { server_name: serverName, status: "stopped" };
}

async function getServerLogs(serverName: string) {
  return {
    server_name: serverName,
    logs: [
      `[${new Date().toISOString()}] INFO: Server ${serverName} processing requests`,
      `[${new Date(
        Date.now() - 60000
      ).toISOString()}] DEBUG: Memory usage: 156MB`,
      `[${new Date(
        Date.now() - 120000
      ).toISOString()}] INFO: Client connected from 192.168.1.100`,
      `[${new Date(
        Date.now() - 180000
      ).toISOString()}] WARN: High CPU usage detected: 85%`,
      `[${new Date(
        Date.now() - 240000
      ).toISOString()}] INFO: Server ${serverName} started successfully`,
    ],
    log_level: "INFO",
    total_entries: 247,
  };
}

async function createMCPServer(serverName: string, config: any) {
  const db = await readDB();
  const newServer = {
    name: serverName,
    status: "stopped",
    port: config.port || 3000 + Math.floor(Math.random() * 100),
    uptime: "0m",
    memory_usage: "0MB",
    cpu_usage: "0%",
    last_request: null,
    version: "1.0.0",
    ...config,
  };
  db.servers.push(newServer);
  await writeDB(db);
  return newServer;
}

async function getServerHealth() {
  const db = await readDB();
  const running_servers = db.servers.filter(
    (s: any) => s.status === "running"
  ).length;
  const total_servers = db.servers.length;
  return {
    overall_health: "healthy",
    services_up: running_servers,
    services_down: total_servers - running_servers,
    avg_response_time: 125,
    error_rate: 0.5,
    system_load: {
      cpu: "15%",
      memory: "245MB / 2GB",
      disk: "1.2GB / 50GB",
      network: "12KB/s",
    },
  };
}

async function getMonitoringData() {
  const db = await readDB();
  const running_servers = db.servers.filter(
    (s: any) => s.status === "running"
  ).length;
  return {
    timestamp: new Date().toISOString(),
    metrics: {
      total_requests: 1247,
      successful_requests: 1235,
      failed_requests: 12,
      avg_response_time: 125,
      peak_response_time: 1250,
      active_servers: running_servers,
      total_uptime: "15d 4h 23m",
    },
    alerts: [
      {
        level: "warning",
        message: "High memory usage on voice-ai-mcp",
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
    ],
  };
}
