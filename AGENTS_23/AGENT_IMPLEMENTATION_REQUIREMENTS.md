# AGENT_IMPLEMENTATION_REQUIREMENTS.md

## Wymagania implementacji agentów zgodne z Cloudflare Agents SDK

### ❌ PROBLEMY W OBECNEJ IMPLEMENTACJI AGENTS_23:

1. **Brak zgodności z Cloudflare Agents SDK**
   - Pliki AGNT_*.md zawierają tylko przykłady Node.js/Express
   - Brak implementacji `class Agent extends Agent`
   - Brak konfiguracji Durable Objects

2. **Puste pliki konfiguracyjne**
   - `wrangler-agent-worker.toml` jest pusty
   - `MYBONZO_AGENTS_CONFIG_2025.md` był pusty (teraz uzupełniony)

3. **Niezgodność z oficjalną dokumentacją**
   - Brak użycia `AgentNamespace`, `getAgentByName`, `routeAgentRequest`
   - Brak implementacji state management przez Durable Objects

### ✅ CO TRZEBA ZROBIĆ:

#### 1. Przepisać agentów zgodnie z SDK
Zamienić wszystkie `AGNT_*.md` na rzeczywiste implementacje:

```typescript
// Zamiast Express API z AGNT_1.md:
app.post('/api/agent', (req, res) => { ... })

// Użyj Cloudflare Agents:
export class MyBonzoAgent extends Agent {
  async chat(message: string) { ... }
}
```

#### 2. Skonfigurować wrangler.toml
```toml
[[durable_objects.bindings]]
name = "MYBONZO_AGENT"
class_name = "MyBonzoAgent"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["MyBonzoAgent"]
```

#### 3. Zaimplementować routing agentów
```typescript
// W main Worker:
return await routeAgentRequest(request, env) || 
       new Response("Agent not found", { status: 404 });
```

#### 4. Użyć React hooks w frontend
```tsx
import { useAgent } from "agents/react";
const agent = useAgent<MyBonzoAgent>("/agents/mybonzo-agent/user123");
```

### 📋 LISTA ZADAŃ DO WYKONANIA:

1. ☐ Przepisać AGNT_1.md -> implementacja MyBonzoAgent class
2. ☐ Skonfigurować wrangler-mybonzo-agents.toml
3. ☐ Dodać Durable Objects bindings do głównego wrangler.toml
4. ☐ Zaimplementować routeAgentRequest w głównym Worker
5. ☐ Dodać AgentClient integrację w React komponentach
6. ☐ Przetestować deployment agentów
7. ☐ Zaktualizować dokumentację AGENTS_23

### 🔗 REFERENCJE:
- AgentsAPI.md - `Agent` class methods
- buildagentscloud.md - podstawowa konfiguracja
- CallingAgents.md - routeAgentRequest usage
- MYBONZO_AGENTS_CONFIG_2025.md - kompletna implementacja
