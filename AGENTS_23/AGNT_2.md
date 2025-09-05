Oto zaawansowane przykłady implementacji agenta AI dla kolejnych metod wdrożenia: Cloudflare Tunnel, lokalny serwer, WebSocket, REST API i gRPC. Każdy przykład uwzględnia obsługę autoryzacji, błędów oraz elementy ułatwiające produkcyjne wdrożenie.

***

## 1. Zaawansowany agent przez Cloudflare Tunnel

### Backend Express + Token JWT + Logowanie (Node.js)

```js
const express = require('express');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(morgan('combined'));

const SECRET_KEY = 'twój_klucz_sekretny'; // Zmien na silny klucz i przechowuj bezpiecznie

// Middleware do weryfikacji JWT tokena
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/api/agent', authenticateToken, (req, res) => {
  const { message } = req.body;
  console.log(`[${new Date().toISOString()}] User ${req.user.name} sent: ${message}`);

  // Tutaj integracja z modelem AI lub logika agenta
  // Przykładowa odpowiedź
  const response = `Echo: ${message.toUpperCase()}`;

  res.json({ response });
});

app.listen(5000, () => {
  console.log('Agent działa lokalnie na porcie 5000');
});
```

### Uruchomienie tunelu Cloudflare

```bash
cloudflared tunnel --url http://localhost:5000 --hostname mojagent.twojadomena.com
```

### Przykład generowania JWT tokena (w backendzie autoryzującym)

```js
const token = jwt.sign({ name: 'user1', role: 'user' }, SECRET_KEY, { expiresIn: '1h' });
console.log(token);
```

### Frontend z autoryzacją

```js
async function sendMessageToAgent(message, token) {
  try {
    const response = await fetch('https://mojagent.twojadomena.com/api/agent', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Błąd połączenia');
    const data = await response.json();
    console.log('Agent odpowiedział:', data.response);
  } catch (error) {
    console.error('Błąd:', error.message);
  }
}
```

***

## 2. Zaawansowany agent lokalny (Node.js + autoryzacja Basic + monitoring)

```js
const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();

app.use(express.json());

// Prosta autoryzacja Basic
app.use(basicAuth({
  users: { 'admin': 'haslo123' },
  challenge: true
}));

// Endpoint agenta
app.post('/agent', (req, res) => {
  const { query } = req.body;

  // Tu można podłączyć modele AI, np. przez API zewnętrzne
  console.log(`[${new Date().toISOString()}] Zapytanie: ${query}`);

  res.json({ answer: `Lokalny agent odpowiedział na: ${query}` });
});

app.listen(4000, () => {
  console.log('Lokalny agent na porcie 4000');
});
```

***

## 3. WebSocket – zaawansowany serwer Node.js + uwierzytelnienie i obsługa stanów

```js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Prosta lista z autoryzowanymi tokenami (do zastąpienia realnym auth)
const authorizedTokens = new Set(['token123', 'token456']);

wss.on('connection', (ws, req) => {
  const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');
  if (!authorizedTokens.has(token)) {
    ws.close(4001, 'Unauthorized');
    return;
  }

  ws.send('Witaj w agencie WebSocket!');

  ws.on('message', message => {
    console.log('Odebrano:', message);
    // Przykładowe przetworzenie wiadomości
    const response = `Agent odpowiada (WS): ${message.toUpperCase()}`;
    ws.send(response);
  });

  ws.on('error', err => {
    console.error('WebSocket error:', err);
  });
});

console.log('Serwer WebSocket działa na porcie 8080');
```

### Klient WebSocket z tokenem (JS)

```js
const token = 'token123';
const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

ws.onopen = () => {
  ws.send('Cześć agent!');
};
ws.onmessage = e => {
  console.log('Odpowiedź agenta:', e.data);
};
ws.onerror = e => {
  console.error('Błąd WS:', e);
};
```

***

## 4. REST API z paginacją, walidacją i obsługą błędów (Express + Joi)

```js
const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());

const schema = Joi.object({
  prompt: Joi.string().min(1).required(),
  maxTokens: Joi.number().integer().min(10).max(1000).default(100),
});

app.post('/v1/agent/respond', async (req, res) => {
  try {
    const { prompt, maxTokens } = await schema.validateAsync(req.body);

    // Tutaj wywołanie zewnętrznego API AI lub lokalnej logiki
    const responseText = `Odpowiedź na "${prompt}" (maxTokens: ${maxTokens})`;

    res.json({ response: responseText });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('REST API agenta działa na porcie 3000'));
```

***

## 5. gRPC – koncepcja (Node.js)

### Plik proto (agent.proto)

```proto
syntax = "proto3";

service Agent {
  rpc Respond (Request) returns (Response);
}

message Request {
  string prompt = 1;
}

message Response {
  string reply = 1;
}
```

### Prosty serwer (implementacja w Node.js)

```js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('./agent.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const agentPackage = grpcObject.Agent;

function respond(call, callback) {
  const prompt = call.request.prompt;
  callback(null, { reply: `Agent odpowiada na: ${prompt}` });
}

const server = new grpc.Server();
server.addService(agentPackage.service, { Respond: respond });

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('gRPC agent działa na porcie 50051');
});
```

### Klient gRPC (Node.js)

```js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('./agent.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const agentPackage = grpcObject.Agent;

const client = new agentPackage('localhost:50051', grpc.credentials.createInsecure());

client.Respond({ prompt: 'Jak się masz?' }, (err, response) => {
  if (err) console.error(err);
  else console.log('Odpowiedź agenta:', response.reply);
});
```

***

Każdy z tych przykładów może być rozbudowany o zaawansowaną autoryzację (OAuth, JWT), retry policy, monitorowanie i skalowanie. W praktyce warto zintegrować logowanie zdarzeń, metryki (np. Prometheus), wsparcie dla aktualizacji agentów i zaawansowane przetwarzanie odpowiedzi AI (np. parsowanie, sanityzacja).

Następne instrukcje w AGNT_3.md