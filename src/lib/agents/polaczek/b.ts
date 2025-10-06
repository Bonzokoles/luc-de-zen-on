// Agent "Bibliotekarz" - zarządza wiedzą, dokumentacją i zasobami
export const agentB = {
  id: "POLACZEK_B",
  name: "Bibliotekarz",
  role: "Zarządzanie Wiedzą",
  goal: "Indeksowanie, wyszukiwanie i udostępnianie informacji z bazy wiedzy.",
  capabilities: ["search", "index", "retrieval", "summarize"],
  tools: ["file-reader", "vector-db", "search-api"],
  status: "idle", // active, busy, idle, error
  dependencies: ["vector-db-service"],
  performance_metrics: {
    avg_response_time: "150ms",
    queries_per_minute: 200,
    error_rate: "0.5%",
  },
};
