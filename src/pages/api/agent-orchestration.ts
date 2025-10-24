// Agent Orchestration API - Centralne zarządzanie agentami
// Endpoint: /api/agent-orchestration

export async function POST({ request, locals }: { request: Request, locals: any }) {
  try {
    const { action, agentId, payload, ...params } = await request.json();
    const db = locals.runtime.env.AGENTS_DB;

    switch (action) {
      case "delegate_to_agent":
        return await delegateToAgent(db, { agentId, payload });
      case "get_agents_registry":
        return await getAgentsRegistry(db);
      case "get_agent_status":
        return await getAgentStatus(db, { agentId });
      case "get_communications_log":
        return await getCommunicationsLog(db, params);
      case "test_agent_connection":
        return await testAgentConnection(db, { agentId });
      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Agent Orchestration API Error:", error);
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

async function delegateToAgent(db, { agentId, payload }) {
  const startTime = Date.now();
  let success = false;
  let response = null;
  let errorMessage = null;

  // Mapowanie agentów na endpointy
  const agentEndpoints = {
    voice: "/api/voice-commands",
    music: "/api/music-control",
    system: "/api/system-monitor",
    crawler: "/api/web-crawler",
    files: "/api/file-manager",
    database: "/api/database-query",
    email: "/api/email-handler",
    security: "/api/security-scan",
    webmaster: "/api/webmaster",
    analytics: "/api/analytics",
    polaczek: "/api/polaczek-chat",
  };

  const endpoint = agentEndpoints[agentId];

  if (!endpoint) {
    errorMessage = `Unknown agent: ${agentId}`;
  } else {
    try {
      const agentResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      response = await agentResponse.json();
      success = agentResponse.ok;

      if (!success) {
        errorMessage = response.error || "Agent request failed";
      }
    } catch (error) {
      errorMessage = error.message;
      console.error(`Failed to delegate to agent ${agentId}:`, error);
    }
  }

  const responseTime = Date.now() - startTime;

  // Zapisz komunikację w logu
  await db
    .prepare(
      `
    INSERT INTO agent_communications (source_agent, target_agent, message_type, payload, success, response_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `
    )
    .bind(
      "orchestrator",
      agentId,
      "delegation",
      JSON.stringify(payload),
      success,
      responseTime
    )
    .run();

  // Loguj w system_logs
  await db
    .prepare(
      `
    INSERT INTO system_logs (agent_id, log_level, message, data)
    VALUES (?, ?, ?, ?)
  `
    )
    .bind(
      "orchestrator",
      success ? "INFO" : "ERROR",
      "Agent delegation",
      JSON.stringify({
        targetAgent: agentId,
        success,
        responseTime,
        error: errorMessage,
      })
    )
    .run();

  return new Response(
    JSON.stringify({
      success: success,
      agentId: agentId,
      response: response,
      responseTime: responseTime,
      error: errorMessage,
      message: success
        ? `Successfully delegated to ${agentId} in ${responseTime}ms`
        : `Failed to delegate to ${agentId}: ${errorMessage}`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function getAgentsRegistry(db) {
  // Pobierz statystyki dla każdego agenta z ostatnich komunikacji
  const agentStats = await db
    .prepare(
      `
    SELECT
      target_agent,
      COUNT(*) as total_calls,
      SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_calls,
      AVG(response_time) as avg_response_time,
      MAX(timestamp) as last_communication
    FROM agent_communications
    WHERE timestamp > datetime('now', '-24 hours')
    GROUP BY target_agent
  `
    )
    .all();

  const registry = {
    voice: {
      name: "Voice Command",
      endpoint: "/api/voice-commands",
      capabilities: ["recognition", "commands", "delegation"],
      status: "active",
    },
    music: {
      name: "Music Control",
      endpoint: "/api/music-control",
      capabilities: ["play", "playlist", "library", "control"],
      status: "active",
    },
    system: {
      name: "System Monitor",
      endpoint: "/api/system-monitor",
      capabilities: ["status", "performance", "health", "logs"],
      status: "active",
    },
    crawler: {
      name: "Web Crawler",
      endpoint: "/api/web-crawler",
      capabilities: ["scraping", "extraction", "monitoring"],
      status: "active",
    },
    files: {
      name: "File Manager",
      endpoint: "/api/file-manager",
      capabilities: ["upload", "organize", "search"],
      status: "active",
    },
    database: {
      name: "Database Query",
      endpoint: "/api/database-query",
      capabilities: ["sql", "schema", "analysis"],
      status: "active",
    },
    email: {
      name: "Email Handler",
      endpoint: "/api/email-handler",
      capabilities: ["send", "receive", "automation"],
      status: "active",
    },
    security: {
      name: "Security Guard",
      endpoint: "/api/security-scan",
      capabilities: ["auth", "threats", "monitoring"],
      status: "active",
    },
    webmaster: {
      name: "Webmaster",
      endpoint: "/api/webmaster",
      capabilities: ["seo", "performance", "optimization"],
      status: "active",
    },
    analytics: {
      name: "Analytics Prophet",
      endpoint: "/api/analytics",
      capabilities: ["analysis", "predictions", "insights"],
      status: "active",
    },
    polaczek: {
      name: "Polaczek Master",
      endpoint: "/api/polaczek-chat",
      capabilities: ["polish", "translation", "nlp", "chat"],
      status: "active",
    },
  };

  // Wzbogać registry o statystyki
  for (const stat of agentStats.results) {
    if (registry[stat.target_agent]) {
      registry[stat.target_agent].stats = {
        totalCalls: stat.total_calls,
        successfulCalls: stat.successful_calls,
        successRate: ((stat.successful_calls / stat.total_calls) * 100).toFixed(
          1
        ),
        avgResponseTime: Math.round(stat.avg_response_time),
        lastCommunication: stat.last_communication,
      };
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      registry: registry,
      totalAgents: Object.keys(registry).length,
      activeAgents: Object.values(registry).filter(
        (agent) => agent.status === "active"
      ).length,
      message: "Agents registry retrieved successfully",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function getAgentStatus(db, { agentId }) {
  // Pobierz ostatnie komunikacje dla agenta
  const recentCommunications = await db
    .prepare(
      `
    SELECT * FROM agent_communications
    WHERE target_agent = ? OR source_agent = ?
    ORDER BY timestamp DESC
    LIMIT 10
  `
    )
    .bind(agentId, agentId)
    .all();

  // Pobierz ostatnie logi systemowe
  const recentLogs = await db
    .prepare(
      `
    SELECT * FROM system_logs
    WHERE agent_id = ?
    ORDER BY timestamp DESC
    LIMIT 5
  `
    )
    .bind(agentId)
    .all();

  return new Response(
    JSON.stringify({
      success: true,
      agentId: agentId,
      recentCommunications: recentCommunications.results,
      recentLogs: recentLogs.results,
      message: `Retrieved status for agent: ${agentId}`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function getCommunicationsLog(db, { limit = 50, agentId = null }) {
  let query = "SELECT * FROM agent_communications WHERE 1=1";
  const params = [];

  if (agentId) {
    query += " AND (source_agent = ? OR target_agent = ?)";
    params.push(agentId, agentId);
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
      communications: result.results,
      count: result.results.length,
      filters: { agentId, limit },
      message: `Retrieved ${result.results.length} communication logs`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function testAgentConnection(db, { agentId }) {
  const startTime = Date.now();

  // Test basic ping to agent
  const testResult = await delegateToAgent(db, {
    agentId: agentId,
    payload: { action: "ping", test: true },
  });

  const testResponse = await testResult.json();
  const responseTime = Date.now() - startTime;

  return new Response(
    JSON.stringify({
      success: testResponse.success,
      agentId: agentId,
      responseTime: responseTime,
      connectionStatus: testResponse.success ? "healthy" : "error",
      testResult: testResponse,
      message: testResponse.success
        ? `Agent ${agentId} is responding (${responseTime}ms)`
        : `Agent ${agentId} connection failed`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
