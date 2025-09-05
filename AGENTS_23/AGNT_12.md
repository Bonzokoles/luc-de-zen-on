Oto kompletne rozwiązanie:

1. Proste API Node.js do dostarczania danych agentów na dashboard MyBonzo.  
2. Dockerfile’y i plik docker-compose do uruchomienia API, orchestratora oraz eksportera metryk w kontenerach.

***

## 1. Endpointy API dla dashboardu MyBonzo (Express)

```js
// api-server.js
const express = require('express');
const app = express();
app.use(express.json());

// Tymczasowa baza danych w pamięci
const agents = [
  { id: 'agent_1', name: 'Agent MyBonzo-1', status: 'online', lastActive: new Date().toISOString(), cpuUsage: 12.4 },
  { id: 'agent_2', name: 'Agent MyBonzo-2', status: 'offline', lastActive: new Date(Date.now() - 600000).toISOString(), cpuUsage: 0 },
];

// Endpoint pobierający status agentów
app.get('/api/mybonzo/agents/status', (req, res) => {
  res.json(agents);
});

// Endpoint aktualizacji statusu (symulacja)
app.post('/api/mybonzo/agents/update', (req, res) => {
  const { id, status, cpuUsage } = req.body;
  const agent = agents.find(a => a.id === id);
  if (!agent) return res.status(404).json({ error: 'Agent nie znaleziony' });

  agent.status = status;
  agent.cpuUsage = cpuUsage;
  agent.lastActive = new Date().toISOString();

  res.json({ message: 'Status agenta zaktualizowany', agent });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API MyBonzo działa na porcie ${PORT}`));
```

***

## 2. Dockerfile’y dla komponentów MyBonzo

### a) API Server (`Dockerfile.api`)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY api-server.js ./

EXPOSE 4000

CMD ["node", "api-server.js"]
```

***

### b) Orchestrator (`Dockerfile.orchestrator`)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install amqplib

COPY orchestrator.js ./

CMD ["node", "orchestrator.js"]
```

***

### c) Exporter metryk Prometheus (`Dockerfile.metrics`)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install prom-client express

COPY metrics-exporter.js ./

EXPOSE 9100

CMD ["node", "metrics-exporter.js"]
```

***

## 3. Plik docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - '4000:4000'
    environment:
      - PORT=4000

  orchestrator:
    build:
      context: .
      dockerfile: Dockerfile.orchestrator
    environment:
      - MYBONZO_RABBITMQ_URI=amqp://rabbitmq:5672
    depends_on:
      - rabbitmq

  metrics-exporter:
    build:
      context: .
      dockerfile: Dockerfile.metrics
    ports:
      - '9100:9100'

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - '5672:5672'
      - '15672:15672' # Panel zarządzania
    environment:
      RABBITMQ_DEFAULT_USER: mybonzo
      RABBITMQ_DEFAULT_PASS: mybonzopass
```

***

## Podsumowanie

- **API Server** obsługuje dashboard, aktualizacje statusów agentów itp.  
- **Orchestrator** steruje pracą agentów komunikujących się przez RabbitMQ.  
- **Prometheus Exporter** udostępnia metryki do monitoringu.  
- **RabbitMQ** stanowi broker wiadomości w systemie.  

Ten setup jest gotowy do uruchomienia na serwerze lub lokalnie. Po uruchomieniu dashboard MyBonzo pobiera dane z API `http://localhost:4000/api/mybonzo/agents/status` i wyświetla w UI.

nastepne w AGNT_13.md
