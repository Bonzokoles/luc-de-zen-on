Oto przykładowe, uproszczone fragmenty kodu do różnych sposobów wdrażania agenta AI: przez Cloudflare Tunnel, lokalnie, przez WebSocket i inne wybrane metody. Każdy przykład pokazuje główne elementy implementacji i połączenia.

***

## 1. Połączenie przez Cloudflare Tunnel

### Backend lokalny (Node.js) – serwer agenta:

```js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/agent', (req, res) => {
  const { message } = req.body;
  // prosty echo-response lub wywołanie AI
  console.log('Received message:', message);
  res.json({ response: `Odpowiedź agenta: ${message}` });
});

app.listen(5000, () => {
  console.log('Agent lokalny działa na porcie 5000');
});
```

### Uruchomienie tunelu Cloudflare (lokalnie w terminalu):

```bash
cloudflared tunnel --url http://localhost:5000 --hostname mojagent.twojadomena.com
```

### Frontend (JavaScript)

```js
async function sendToAgent(message) {
  const response = await fetch('https://mojagent.twojadomena.com/api/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  const data = await response.json();
  console.log('Odpowiedź agenta:', data.response);
}
```

***

## 2. Wdrożenie agenta lokalnie (Node.js)

### Prostą komunikację lokalną obsłuży Express:

```js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/agent', (req, res) => {
  const { query } = req.body;
  // przykład prostej odpowiedzi
  const answer = `Lokalna odpowiedź na: ${query}`;
  res.json({ answer });
});

app.listen(4000, () => console.log('Agent lokalny na porcie 4000'));
```

### Wywołanie z frontendu (np. innej aplikacji lokalnej):

```js
fetch('http://localhost:4000/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'Cześć agent!' })
})
.then(res => res.json())
.then(data => console.log(data.answer));
```

***

## 3. Komunikacja przez WebSocket (Node.js + klient JS)

### Serwer WebSocket (Node.js):

```js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log('Otrzymano:', message);
    ws.send(`Agent odpowiada: ${message}`);
  });
});

console.log('WebSocket server działa na porcie 8080');
```

### Klient WebSocket (JavaScript w przeglądarce):

```js
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  ws.send('Cześć agent!');
};

ws.onmessage = (event) => {
  console.log('Odpowiedź agenta:', event.data);
};
```

***

## 4. Integracja przez REST API (np. system zewnętrzny)

### API agenta (Node.js Express):

```js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/v1/agent/respond', (req, res) => {
  const { prompt } = req.body;
  // Tu wywołanie modeli AI, np. GPT lub innego systemu
  const response = `Odpowiedź na prompt: ${prompt}`;
  res.json({ response });
});

app.listen(3000, () => console.log('Agent API na porcie 3000'));
```

### Klient wywołujący API:

```js
async function callAgentAPI(prompt) {
  const res = await fetch('http://localhost:3000/v1/agent/respond', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ prompt })
  });
  const data = await res.json();
  console.log('Agent odpowiedział:', data.response);
}
```

***

## 5. Przykład połączenia przez gRPC (Node.js)

### Serwer (prosty przykład):

```js
// Define protokół .proto i wygeneruj kod serwera z grpc-tools
// Serwer implementuje funkcję Respond(Request) returns (Response)
```

### Klient gRPC (Node.js):

```js
// Użyj biblioteki grpc-node, użytkownik wywołuje metody RPC
```

(gRPC wymaga dodatkowej konfiguracji i narzędzi, poniżej tylko koncepcja)

***

## Podsumowanie

- **Cloudflare Tunnel** – idealny do wystawienia lokalnego serwera agenta na zewnątrz bez potrzeby konfiguracji sieci i firewalli.
- **Agent lokalny** – najprostsze wdrożenie, serwer nasłuchuje lokalnie na porcie.
- **WebSocket** – do komunikacji w czasie rzeczywistym, np. czaty, gdzie potrzebna jest szybka dwukierunkowa wymiana.
- **REST API** – standardowa integracja z dowolnym systemem zewnętrznym.
- **gRPC** – wydajna komunikacja binarna dla rozbudowanych wdrożeń mikroserwisowych.

Każdy z tych przykładów można rozbudować o uwierzytelnianie, obsługę błędów, retry, logowanie i monitoring. Wdrożenie zależy od obszaru użycia i wymagań integracji.

nastepne instrukcje w AGN_2.md