// Database Query API - Integracja z D1 Database
// Endpoint: /api/database-query

export async function POST({ request, locals }) { 
  try {
    const {
      action,
      query,
      database = "default",
      ...params
    } = await request.json();
    const db = locals.runtime.env.AGENTS_DB;

    switch (action) {
      case "execute_query":
        return await executeUserQuery(db, { query, database });
      case "get_schema":
        return await getTableSchema(db, params);
      case "get_tables":
        return await getTables(db);
      case "get_query_history":
        return await getQueryHistory(db, params);
      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Database Query API Error:", error);
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

async function executeUserQuery(db, { query, database }) {
  const startTime = Date.now();
  let success = false;
  let rowsAffected = 0;
  let results = null;
  let errorMessage = null;

  try {
    // Sprawdź czy zapytanie jest bezpieczne (podstawowa walidacja)
    const queryLower = query.toLowerCase().trim();

    if (
      queryLower.startsWith("drop") ||
      queryLower.startsWith("delete") ||
      queryLower.startsWith("truncate") ||
      queryLower.includes("system_logs")
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Destructive queries and system table access are not allowed",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (queryLower.startsWith("select")) {
      // Query SELECT
      const result = await db.prepare(query).all();
      results = result.results;
      rowsAffected = result.results.length;
      success = true;
    } else if (
      queryLower.startsWith("insert") ||
      queryLower.startsWith("update")
    ) {
      // Query INSERT/UPDATE
      const result = await db.prepare(query).run();
      success = result.success;
      rowsAffected = result.meta?.changes || 0;
    } else {
      // Inne zapytania
      const result = await db.prepare(query).run();
      success = result.success;
    }
  } catch (error) {
    errorMessage = error.message;
    console.error("Query execution failed:", error);
  }

  const executionTime = Date.now() - startTime;

  // Zapisz w historii zapytań
  await db
    .prepare(
      `
    INSERT INTO query_history (query_text, database_name, execution_time, rows_affected, success, error_message, agent_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `
    )
    .bind(
      query,
      database,
      executionTime,
      rowsAffected,
      success,
      errorMessage,
      "database-manager"
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
      "database-manager",
      success ? "INFO" : "ERROR",
      "Database query executed",
      JSON.stringify({
        query: query.substring(0, 100),
        success,
        executionTime,
        rowsAffected,
      })
    )
    .run();

  return new Response(
    JSON.stringify({
      success: success,
      results: results,
      rowsAffected: rowsAffected,
      executionTime: executionTime,
      error: errorMessage,
      message: success
        ? `Query executed successfully in ${executionTime}ms, ${rowsAffected} rows affected`
        : `Query failed: ${errorMessage}`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function getTableSchema(db, { tableName }) {
  try {
    const schema = await db.prepare(`PRAGMA table_info(${tableName})`).all();
    return new Response(
      JSON.stringify({
        success: true,
        tableName: tableName,
        schema: schema.results,
        message: `Retrieved schema for table: ${tableName}`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Failed to get schema for table ${tableName}: ${error.message}`,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function getTables(db) {
  try {
    const tables = await db
      .prepare(
        `
      SELECT name FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `
      )
      .all();

    return new Response(
      JSON.stringify({
        success: true,
        tables: tables.results.map((t) => t.name),
        count: tables.results.length,
        message: `Found ${tables.results.length} tables`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Failed to get tables: ${error.message}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function getQueryHistory(db, { limit = 20, agentId = null }) {
  try {
    let query = "SELECT * FROM query_history";
    const params = [];

    if (agentId) {
      query += " WHERE agent_id = ?";
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
        history: result.results,
        count: result.results.length,
        message: `Retrieved ${result.results.length} queries from history`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Failed to get query history: ${error.message}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}