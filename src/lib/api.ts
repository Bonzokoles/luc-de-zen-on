import { agentB } from "./agents/polaczek/b";
import { agentD1 } from "./agents/polaczek/d1";
import { agentDyrektor } from "./agents/polaczek/dyrektor";
import { agentM1 } from "./agents/polaczek/m1";
import { agentT } from "./agents/polaczek/t";
import { bielikAgent } from "./agents/bielik";

// Agreguje wszystkich agentów w jednym miejscu dla łatwego dostępu
export const allAgents = {
    b: agentB,
    d1: agentD1,
    dyrektor: agentDyrektor,
    m1: agentM1,
    t: agentT,
};

export const advancedAgents = {
    bielik: bielikAgent,
}

// Funkcja do pobierania statusu wszystkich agentów
export function getAgentsStatus() {
    const polaczekStatus = Object.values(allAgents).map(agent => ({
        id: agent.id,
        name: agent.name,
        status: agent.status,
    }));

    const bielikStatus = advancedAgents.bielik.getStatus();

    return [...polaczekStatus, bielikStatus];
}
