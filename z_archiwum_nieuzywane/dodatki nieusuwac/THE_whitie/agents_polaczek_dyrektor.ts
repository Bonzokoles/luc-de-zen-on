// POLACZEK_D – Dyrektor agentów
export class PolaczekDyrektor {
  agents: Record<string, { name: string, type: string, role: string, status: string, description?: string }> = {};

  registerAgent(agentId: string, config: { name: string, type: string, role: string, description?: string }) {
    this.agents[agentId] = { ...config, status: "active" };
  }

  updateAgentStatus(agentId: string, status: string) {
    if (this.agents[agentId]) this.agents[agentId].status = status;
  }

  listAgents(type?: string) {
    return Object.entries(this.agents)
      .filter(([_, agent]) => !type || agent.type === type)
      .map(([id, agent]) => ({ id, ...agent }));
  }

  getAgent(agentId: string) {
    return this.agents[agentId];
  }
}

// Przykład rejestracji agentów:
const dyrektor = new PolaczekDyrektor();
dyrektor.registerAgent("POLACZEK_T", { name: "Tłumacz", type: "translator", role: "tlumacz" });
dyrektor.registerAgent("POLACZEK_M1", { name: "Music Assistant 1", type: "music", role: "music-player" });
dyrektor.registerAgent("POLACZEK_M2", { name: "Music Assistant 2", type: "music", role: "music-streamer" });
dyrektor.registerAgent("POLACZEK_D1", { name: "Dashboard Keeper 1", type: "dashboard", role: "dashboard-keeper" });
dyrektor.registerAgent("POLACZEK_B", { name: "Bibliotekarz", type: "library", role: "bibliotekarz" });