Oto wygenerowany task dla VSCode oraz przykładowe kody i ustawienia dla Cloudflare Workers z modelami AI, które można wykorzystać do implementacji pierwszych trzech funkcji systemu mybonzo:

***

### Plik task dla VSCode (tasks.json)

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Deploy Cloudflare Workers",
      "type": "shell",
      "command": "wrangler publish",
      "group": "build",
      "problemMatcher": [],
      "detail": "Publikuje workers do Cloudflare z konfiguracją wrangler.toml"
    },
    {
      "label": "Run Dev Server",
      "type": "shell",
      "command": "wrangler dev",
      "group": "build",
      "problemMatcher": [],
      "detail": "Uruchamia lokalny serwer developerski Cloudflare Workers"
    },
    {
      "label": "Build Astro Project",
      "type": "shell",
      "command": "npm run build",
      "group": "build",
      "problemMatcher": ["$tsc"],
      "detail": "Buduje projekt Astro dla deploymentu"
    },
    {
      "label": "Install Dependencies",
      "type": "shell",
      "command": "npm install",
      "problemMatcher": [],
      "detail": "Instaluje brakujące pakiety npm"
    }
  ]
}
```

***

### Przykładowy plik `wrangler.toml`

```toml
name = "mybonzo-workers"
main = "./dist/index.js"
type = "javascript"
account_id = "<YOUR_ACCOUNT_ID>"
workers_dev = true
compatibility_date = "2025-09-01"

env = {
  production = {
    route = "mybonzo.com/*"
    zone_id = "<YOUR_ZONE_ID>"
  }
}

[vars]
OPENAI_API_KEY = "<YOUR_OPENAI_API_KEY>"

[triggers]
crons = ["0 9 * * *"]  # codzienny cron job o 9 rano
```

***

### Przykład kodu Cloudflare Worker dla funkcji generowania treści marketingowych

```javascript
import { OpenAI } from "openai";

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST' && new URL(request.url).pathname === '/generate-marketing-content') {
    const data = await request.json();
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Jesteś ekspertem marketingu, twórz dynamiczne teksty." },
        { role: "user", content: `Napisz ${data.contentType} na temat: ${data.prompt}.` }
      ],
      max_tokens: 500
    });

    return new Response(JSON.stringify({ text: response.choices[0].message.content }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Not found", { status: 404 });
}
```

***

### Podsumowanie

- Task VSCode zawiera podstawowe polecenia do instalacji pakietów, budowy, lokalnego testowania i deploymentu Cloudflare Workers.
- Konfiguracja `wrangler.toml` wskazuje na niezbędne dane (account_id, zone_id, key API) oraz środowisko produkcyjne z routingiem domeny.
- Przykład worker pokazuje prosty endpoint do wywołania modelu AI OpenAI (np. GPT-4o-mini) do automatycznego generowania treści marketingowych.
- Frontend (Astro + React) może się łączyć z tym workerem wywołując endpoint `/generate-marketing-content` metodą POST.

W razie potrzeby mogę też dostarczyć przykładowy frontendowy komponent do tych funkcji lub rozszerzyć kod o kolejne endpointy pod pozostałe funkcje.

To gotowa, dobrze dopasowana do Cloudflare Workers i frameworka Astro baza startowa do implementacji pierwszych 3 funkcji w projekcie mybonzo.