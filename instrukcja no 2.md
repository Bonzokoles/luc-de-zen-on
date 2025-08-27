Oto zaproponowana struktura projektu oraz szczegółowy plan (taski) dla GitHub Copilota w VSCode, aby wprowadzić do Twojego projektu Astro podstawowe dodatki: prostego Cloudflare Workera AI oraz frontendowy chatbot i panel podstawowej kontroli agentów.

***

## Proponowana struktura projektu

```
/src
  /components
    Chatbot.astro           # Komponent frontend chatbota
    AgentsPanel.astro       # Panel do zarządzania statusami agentów
  /workers
    ai-bot-worker.ts       # Cloudflare Worker pośredniczący w AI (API)
  /pages
    index.astro            # Strona główna wywołująca Chatbot i AgentsPanel
/public
  /assets                  # Grafik, ikony itp.
wrangler.toml             # Konfiguracja Workers (jeśli jeszcze nie ma)
package.json              # Skrypt budujący, zależności
```

***

## Taski dla GitHub Copilot w VSCode

### Task 1: Stwórz Worker `ai-bot-worker.ts`

W pliku `src/workers/ai-bot-worker.ts`:

```ts
export async function fetch(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Only POST is allowed', { status: 405 });
  }
  try {
    const { prompt } = await request.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const json = await response.json();
    const answer = json.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}
```

(Ustaw zmienną `OPENAI_API_KEY` w sekretach Cloudflare.)

***

### Task 2: Stwórz komponent frontend `Chatbot.astro`

Plik `src/components/Chatbot.astro` z prostym UI wysyłającym zapytania do workera:

```astro
---
import { useState } from 'react';
const [input, setInput] = useState('');
const [messages, setMessages] = useState([]);
const sendMessage = async () => {
  if (!input) return;
  setMessages([...messages, { from: 'user', text: input }]);
  const res = await fetch('/api/ai-bot-worker', {
    method: 'POST',
    body: JSON.stringify({ prompt: input }),
    headers: { 'Content-Type': 'application/json' },
  });
  const { answer } = await res.json();
  setMessages([...messages, { from: 'user', text: input }, { from: 'bot', text: answer }]);
  setInput('');
};
---

<div>
  <div>
    {messages.map(m => (
      <p class={m.from}>{m.text}</p>
    ))}
  </div>
  <input type="text" bind:value={input} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
  <button onClick={sendMessage}>Wyślij</button>
</div>
```

***

### Task 3: Stwórz komponent panelu `AgentsPanel.astro`

Plik `src/components/AgentsPanel.astro`, prosty panel listujący agentów:

```astro
---
const agents = [
  { id: 1, name: 'Agent Demo', status: 'Aktywny' },
  { id: 2, name: 'Agent Testowy', status: 'Nieaktywny' },
  { id: 3, name: 'Agent MDX', status: 'W trakcie konfiguracji' },
];
---

<section>
  <h2>Panel Agentów</h2>
  <ul>
    {agents.map(agent => (
      <li>
        {agent.name} — Status: {agent.status}
        <button>Aktywuj</button>
        <button>Dezaktywuj</button>
      </li>
    ))}
  </ul>
</section>
```

***

### Task 4: Aktualizacja strony głównej `index.astro`

Importuj i użyj komponentów Chatbot i AgentsPanel:

```astro
---
import Chatbot from '../components/Chatbot.astro';
import AgentsPanel from '../components/AgentsPanel.astro';
---

<main>
  <Chatbot />
  <AgentsPanel />
</main>
```

***

### Task 5: Skonfiguruj `wrangler.toml`

Jeśli go nie masz, dodaj w katalogu głównym plik konfiguracyjny Workers:

```toml
name = "ai-bot-worker"
type = "javascript"

account_id = "<twoje-account-id>"
workers_dev = true
compatibility_date = "2025-08-27"

[vars]
OPENAI_API_KEY = "<tutaj-wstaw-klucz>"

[build]
command = "npm run build"

[site]
bucket = "./dist"
```

***

Po wykonaniu powyższych tasków:

- Przetestuj lokalnie frontend i Workera,
- Wypchnij zmiany na GitHub (`git push`),
- Cloudflare Workers oraz Pages zrobią build i deploy,
- Testuj działanie chatbota oraz panelu agentów online.

***

wygenerowane pliki :
1. Worker API AI – /src/workers/ai-bot-worker.ts
2. Komponent Chatbot – /src/components/Chatbot.astro
3. Panel Agentów – /src/components/AgentsPanel.astro
