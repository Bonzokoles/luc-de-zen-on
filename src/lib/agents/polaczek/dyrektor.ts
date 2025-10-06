
// Agent "Dyrektor" - główny agent orkiestrujący, podejmujący decyzje
export const agentDyrektor = {
  id: "POLACZEK_DYREKTOR",
  name: "Dyrektor",
  role: "Orkiestracja i Decyzje",
  goal: "Zarządzanie przepływem pracy, delegowanie zadań do innych agentów i zapewnienie realizacji celów.",
  capabilities: ["planning", "delegation", "supervision", "decision-making"],
  tools: ["workflow-engine", "agent-manager", "event-bus"],
  status: "active",
  dependencies: ["agent-manager-service", "event-bus-service"],
  performance_metrics: {
    avg_decision_time: "80ms",
    tasks_managed_per_minute: 500,
    error_rate: "0.2%",
  },
};
