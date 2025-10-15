import { agents } from "./agents/agent-store";

// Funkcja do pobierania statusu wszystkich agentów
export function getAgentsStatus() {
  return agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    status: agent.status,
    role: agent.role,
    type: agent.id.split("_")[1],
    description: agent.goal,
    endpoint: agent.tools.join(", "),
  }));
}

// Funkcja do dodawania nowego agenta
export interface AgentData {
  id?: string;
  type: string;
  created_at?: string | number;
  [key: string]: any;
}
export function addAgent(agentData: AgentData) {
  const newAgent = {
    ...agentData,
    id:
      agentData.id ||
      `POLACZEK_${agentData.type}${Math.floor(Math.random() * 100)}`,
    name: agentData.name || "Unnamed Agent",
    role: agentData.role || "Agent",
    goal: agentData.goal || "No goal specified",
    capabilities: agentData.capabilities || [],
    tools: agentData.tools || [],
    dependencies: agentData.dependencies || [],
    status: "idle",
    performance_metrics: {
      avg_response_time: "N/A",
      queries_per_minute: 0,
      error_rate: "0%",
    },
  };
  agents.push(newAgent as any);
  return newAgent;
}

// Funkcja do aktualizacji statusu agenta
export function updateAgentStatus(id: string, status: string) {
  const agent = agents.find((a) => a.id === id);
  if (agent) {
    agent.status = status;
    return agent;
  }
  return null;
}

// Funkcja do usuwania agenta
export function removeAgent(id: string) {
  const index = agents.findIndex((a) => a.id === id);
  if (index !== -1) {
    const removedAgent = agents.splice(index, 1);
    return removedAgent[0];
  }
  return null;
}

// Funkcja do pobierania konfiguracji (mock)
export function getConfig() {
  return {
    gpu: "NVIDIA RTX 4090",
    ram: "64GB DDR5",
    db: "PostgreSQL",
    routing: "Advanced",
    agentsCount: agents.length,
  };
}
