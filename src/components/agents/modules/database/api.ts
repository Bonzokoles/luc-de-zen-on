// 🗄️ Database Query Agent API - Zaawansowane zapytania SQL/NoSQL
import type { APIRoute } from "astro";
import { AGENT_CONFIG } from "./config";

// Symulacja połączeń do baz danych (w produkcji użyj prawdziwych sterowników)
const connections: Map<string, any> = new Map();

// Historia zapytań użytkownika
const queryHistory: Array<{
  id: string;
  query: string;
  database: string;
  timestamp: number;
  executionTime: number;
  rows: number;
  status: "success" | "error";
}> = [];

export const POST: APIRoute = async ({ request }) => {
  try {
    const { action, data } = (await request.json()) as any;

    switch (action) {
      case "test":
        return testAgent();

      case "execute":
        return executeQuery(data);

      case "connect":
        return connectDatabase(data);

      case "disconnect":
        return disconnectDatabase(data);

      case "list-connections":
        return listConnections();

      case "query-history":
        return getQueryHistory();

      case "export":
        return exportResults(data);

      case "optimize":
        return optimizeQuery(data);

      default:
        return errorResponse("Nieprawidłowa akcja");
    }
  } catch (error) {
    return errorResponse(
      `Błąd serwera: ${
        error instanceof Error ? error.message : "Nieznany błąd"
      }`
    );
  }
};

// Test agent functionality
async function testAgent() {
  return new Response(
    JSON.stringify({
      success: true,
      message: "Agent Database Query działa poprawnie",
      agent: AGENT_CONFIG.displayName,
      capabilities: AGENT_CONFIG.capabilities,
      supportedDatabases: AGENT_CONFIG.supportedDatabases.map((db) => db.name),
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Execute SQL/NoSQL query
async function executeQuery(data: any) {
  const { query, connectionId, options = {} } = data;

  if (!query || !connectionId) {
    return errorResponse("Brak zapytania lub identyfikatora połączenia");
  }

  const startTime = Date.now();

  try {
    // Symulacja wykonania zapytania
    const mockResults = generateMockResults(query);
    const executionTime = Date.now() - startTime;

    // Zapisz w historii
    const historyEntry = {
      id: generateId(),
      query: query.trim(),
      database: connectionId,
      timestamp: Date.now(),
      executionTime,
      rows: mockResults.rows.length,
      status: "success" as const,
    };
    queryHistory.unshift(historyEntry);

    // Zachowaj tylko 100 ostatnich zapytań
    if (queryHistory.length > 100) {
      queryHistory.pop();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Zapytanie wykonane pomyślnie",
        results: mockResults,
        executionTime,
        affectedRows: mockResults.rows.length,
        queryId: historyEntry.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const executionTime = Date.now() - startTime;

    // Zapisz błędne zapytanie w historii
    const historyEntry = {
      id: generateId(),
      query: query.trim(),
      database: connectionId,
      timestamp: Date.now(),
      executionTime,
      rows: 0,
      status: "error" as const,
    };
    queryHistory.unshift(historyEntry);

    return errorResponse(
      `Błąd wykonania zapytania: ${
        error instanceof Error ? error.message : "Nieznany błąd"
      }`
    );
  }
}

// Connect to database
async function connectDatabase(data: any) {
  const { type, host, port, database, username, password, name } = data;

  if (!type || !name) {
    return errorResponse("Brak typu bazy danych lub nazwy połączenia");
  }

  const connectionId = generateId();
  const connection = {
    id: connectionId,
    name,
    type,
    host: host || "localhost",
    port: port || getDefaultPort(type),
    database: database || "test",
    username: username || "user",
    connected: true,
    createdAt: Date.now(),
  };

  connections.set(connectionId, connection);

  return new Response(
    JSON.stringify({
      success: true,
      message: `Połączono z bazą ${type.toUpperCase()}`,
      connection: {
        id: connectionId,
        name: connection.name,
        type: connection.type,
        status: "connected",
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Disconnect from database
async function disconnectDatabase(data: any) {
  const { connectionId } = data;

  if (!connectionId || !connections.has(connectionId)) {
    return errorResponse("Nieprawidłowy identyfikator połączenia");
  }

  connections.delete(connectionId);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Rozłączono z bazą danych",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// List active connections
async function listConnections() {
  const connectionList = Array.from(connections.values()).map((conn) => ({
    id: conn.id,
    name: conn.name,
    type: conn.type,
    host: conn.host,
    database: conn.database,
    status: conn.connected ? "connected" : "disconnected",
    createdAt: conn.createdAt,
  }));

  return new Response(
    JSON.stringify({
      success: true,
      connections: connectionList,
      count: connectionList.length,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get query history
async function getQueryHistory() {
  return new Response(
    JSON.stringify({
      success: true,
      history: queryHistory.slice(0, 50), // Ostatnie 50 zapytań
      total: queryHistory.length,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Export query results
async function exportResults(data: any) {
  const { queryId, format = "json" } = data;

  // W rzeczywistej implementacji eksportuj rzeczywiste wyniki
  const mockData = {
    query: "SELECT * FROM users LIMIT 10",
    results: generateMockResults("SELECT * FROM users").rows,
    exportedAt: new Date().toISOString(),
    format,
  };

  return new Response(
    JSON.stringify({
      success: true,
      message: `Wyniki wyeksportowane do formatu ${format.toUpperCase()}`,
      downloadUrl: `/api/agents/agent-06/download/${queryId}.${format}`,
      data: format === "json" ? mockData : null,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Optimize query (basic suggestions)
async function optimizeQuery(data: any) {
  const { query } = data;

  if (!query) {
    return errorResponse("Brak zapytania do optymalizacji");
  }

  const suggestions = analyzeQuery(query);

  return new Response(
    JSON.stringify({
      success: true,
      originalQuery: query,
      suggestions,
      optimizedQuery:
        suggestions.length > 0 ? suggestions[0].optimizedQuery : query,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Helper functions
function generateMockResults(query: string) {
  const queryType = query.trim().toUpperCase();

  if (queryType.startsWith("SELECT")) {
    return {
      columns: ["id", "name", "email", "created_at"],
      rows: [
        [1, "Jan Kowalski", "jan@example.com", "2024-01-15 10:30:00"],
        [2, "Anna Nowak", "anna@example.com", "2024-01-14 09:15:00"],
        [3, "Piotr Wiśniewski", "piotr@example.com", "2024-01-13 14:45:00"],
      ],
    };
  } else if (queryType.startsWith("INSERT")) {
    return {
      columns: ["affected_rows"],
      rows: [[1]],
    };
  } else if (queryType.startsWith("UPDATE")) {
    return {
      columns: ["affected_rows"],
      rows: [[2]],
    };
  } else if (queryType.startsWith("DELETE")) {
    return {
      columns: ["affected_rows"],
      rows: [[1]],
    };
  }

  return {
    columns: ["result"],
    rows: [["OK"]],
  };
}

function getDefaultPort(dbType: string): number {
  const ports: Record<string, number> = {
    mysql: 3306,
    postgresql: 5432,
    mongodb: 27017,
    redis: 6379,
    sqlite: 0,
  };
  return ports[dbType] || 3306;
}

function analyzeQuery(
  query: string
): Array<{ issue: string; suggestion: string; optimizedQuery: string }> {
  const suggestions = [];
  const upperQuery = query.toUpperCase();

  // Brak LIMIT w SELECT
  if (upperQuery.includes("SELECT") && !upperQuery.includes("LIMIT")) {
    suggestions.push({
      issue: "Brak ograniczenia LIMIT",
      suggestion: "Dodaj LIMIT aby ograniczyć ilość zwracanych rekordów",
      optimizedQuery: query + " LIMIT 100",
    });
  }

  // SELECT *
  if (upperQuery.includes("SELECT *")) {
    suggestions.push({
      issue: "Używanie SELECT *",
      suggestion: "Określ konkretne kolumny zamiast używać *",
      optimizedQuery: query.replace("SELECT *", "SELECT id, name, email"),
    });
  }

  return suggestions;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function errorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}
