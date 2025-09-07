Oto konkretne szablony UI dla wizualizacji agentów MyBonzo w Astro (z React) oraz przykładowy orchestrator komunikacji agentów i pipeline komunikacji oparte na RabbitMQ.

***

## 1. Szablon UI w Astro + React dla platformy MyBonzo

### Plik: `src/components/AgentDashboard.jsx`

```jsx
import React, { useEffect, useState } from 'react';

export default function AgentDashboard() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch('/api/mybonzo/agents/status');
        const data = await res.json();
        setAgents(data);
      } catch {
        setAgents([]);
      }
    }
    fetchAgents();
    const interval = setInterval(fetchAgents, 10000); // Odświeżanie co 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{
      backgroundColor: '#0B0F17',
      color: '#00FFF3',
      fontFamily: "'Orbitron', monospace",
      padding: '1.5rem',
      borderRadius: '8px',
      maxWidth: '900px',
      margin: 'auto'
    }}>
      <h1 style={{ textAlign: 'center', fontWeight: '900', fontSize: '2rem' }}>MyBonzo AI Workers Dashboard</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #00FFF3' }}>
            <th style={{ padding: '0.5rem' }}>Nazwa</th>
            <th>Status</th>
            <th>Ostatnia Aktywność</th>
            <th>CPU (%)</th>
          </tr>
        </thead>
        <tbody>
          {agents.length === 0 && (
            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>Brak aktywnych agentów</td></tr>
          )}
          {agents.map(agent => (
            <tr key={agent.id} style={{
              color: agent.status === 'online' ? '#0FF' : '#FF4444',
              borderBottom: '1px solid #003333'
            }}>
              <td style={{ padding: '0.6rem' }}>{agent.name}</td>
              <td style={{ textTransform: 'uppercase' }}>{agent.status}</td>
              <td>{new Date(agent.lastActive).toLocaleString()}</td>
              <td>{agent.cpuUsage.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
```

***

### Plik strony w Astro: `src/pages/mybonzo-dashboard.astro`

```jsx
---
import AgentDashboard from '../components/AgentDashboard.jsx';
---

<html lang="pl" style="background-color:#0B0F17; color:#00FFF3; font-family:Orbitron, monospace;">
  <head>
    <meta charset="UTF-8" />
    <title>MyBonzo AI Workers Dashboard</title>
  </head>
  <body>
    <AgentDashboard />
  </body>
</html>
```

***

## 2. Orchestrator komunikacji agentów MyBonzo (Node.js + RabbitMQ)

```js
// orchestrator.js
const amqp = require('amqplib');

const RABBIT_URI = process.env.MYBONZO_RABBITMQ_URI || 'amqp://localhost';
const TASK_QUEUE = 'mybonzo_agent_tasks';
const RESULT_QUEUE = 'mybonzo_agent_results';

async function start() {
  const connection = await amqp.connect(RABBIT_URI);
  const channel = await connection.createChannel();

  await channel.assertQueue(TASK_QUEUE, { durable: true });
  await channel.assertQueue(RESULT_QUEUE, { durable: true });

  console.log('Orchestrator nasłuchuje zadań i wyników agentów...');

  // Przykład wysyłania zadania
  function sendTask(agentId, task) {
    const message = { agentId, task, timestamp: new Date().toISOString() };
    channel.sendToQueue(TASK_QUEUE, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Wysłano zadanie do agenta ${agentId}`, message);
  }

  // Odbieranie wyników
  channel.consume(RESULT_QUEUE, msg => {
    if (msg !== null) {
      const result = JSON.parse(msg.content.toString());
      console.log('Odebrano wynik od agenta:', result);
      channel.ack(msg);
      // Tutaj można aktualizować stan w DB lub powiadamiać UI
    }
  });

  // Przykładowe wysłanie zadania do agenta
  sendTask('agent_1', { type: 'analyze_text', content: 'Przykładowy tekst do analizy' });
}

start().catch(console.error);
```

***

## 3. Pipeline komunikacji agentów MyBonzo (funkcje wsparcia)

```js
const amqp = require('amqplib');

async function sendMessage(queue, message, rabbitUri) {
  const conn = await amqp.connect(rabbitUri);
  const channel = await conn.createChannel();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  setTimeout(() => {
    channel.close();
    conn.close();
  }, 500);
}

async function listenMessages(queue, rabbitUri, callback) {
  const conn = await amqp.connect(rabbitUri);
  const channel = await conn.createChannel();
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, (msg) => {
    if (msg != null) {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      channel.ack(msg);
    }
  });
}

module.exports = { sendMessage, listenMessages };
```

***

# Podsumowanie

- **UI Astro** utrzymany w kolorystyce i stylu MyBonzo: czarne tło, neonowe błękity, futurystyczna czcionka.
- **Orchestrator** – centralna logika sterująca zadaniami agentów i zbierająca wyniki przez RabbitMQ.
- **Pipelines** – abstrakcja wysyłania i odbierania komunikatów, pozwalająca na elastyczną skalowalność.

następne w AGNT_12.md