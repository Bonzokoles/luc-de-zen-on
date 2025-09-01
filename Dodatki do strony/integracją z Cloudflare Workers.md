Oto przygotowana struktura plików oraz wzorce kodu do łatwego włączenia do instrukcji `.md`. Umożliwi to przejrzyste zarządzanie integracją z Cloudflare Workers i ułatwi rozwój nowej wersji strony.

***

# Instrukcja: Integracja Cloudflare Workers w nowym projekcie

***

## Struktura katalogów

```plaintext
/project-root
├── src/
│   ├── cloudflareApi.ts       # Centralny moduł do komunikacji z Workers API
│   ├── durableObjects.ts      # Wrapper do Durable Objects (jeśli używasz)
│   └── utils/
│       └── fetchHelpers.ts    # Dodatkowe funkcje fetch (np. obsługa autoryzacji, błędów)
├── .env                      # Zmienne środowiskowe z URL i kluczami
├── package.json              # Konfiguracja NPM z zależnościami i skryptami
└── README.md                 # Instrukcja obsługi (ta dokumentacja)
```

***

## 1. `src/cloudflareApi.ts` — Centralny moduł fetch

```ts
const WORKER_BASE_URL = import.meta.env.PUBLIC_WORKER_BASE_URL || "https://your-worker-domain.workers.dev";

export async function fetchFromWorker(path: string, options: RequestInit = {}) {
  try {
    const url = `${WORKER_BASE_URL}${path}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Worker API error: ${response.status} - ${errorText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching from Worker:", error);
    throw error;
  }
}
```

***

## 2. `src/durableObjects.ts` — Wrapper Durable Objects

```ts
import { fetchFromWorker } from "./cloudflareApi";

export class DurableObjectClient {
  constructor(private namespace: any) {}

  async fetchFromDO(id: string, path: string, options?: RequestInit) {
    try {
      const stub = this.namespace.get(id);
      const url = new URL(path, "https://example.com"); // baza URL gdzie path jest ścieżką
      const request = new Request(url.toString(), options);
      const response = await stub.fetch(request);
      if (!response.ok) {
        throw new Error(`Durable Object error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("DO fetch error:", error);
      throw error;
    }
  }
}
```

***

## 3. `src/utils/fetchHelpers.ts` — Funkcje pomocnicze

```ts
export async function safeFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Fetch error ${response.status}: ${error}`);
  }
  return response.json();
}

export function authFetch(url: string, token: string, options: RequestInit = {}) {
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`
  };
  return fetch(url, options);
}
```

***

## 4. `.env` — Przykładowe zmienne środowiskowe

```
PUBLIC_WORKER_BASE_URL=https://yourworker.domain.workers.dev
WORKER_API_KEY=twoj_klucz_api_tutaj
```

***

## 5. `package.json` — kluczowe skrypty (przykład)

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "deploy": "wrangler deploy",
    "generate-types": "wrangler types"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^12.6.7",
    "astro": "^5.13.5",
    "svelte": "^5.22.1",
    "tailwindcss": "^4.0.9"
  },
  "devDependencies": {
    "wrangler": "^4.21.0",
    "@tailwindcss/typography": "^0.5.16"
  }
}
```

***

## Rekomendacje dodatkowe

- Regularnie uruchamiaj `npm run generate-types` po aktualizacji workerów dla aktualnych typów,
- Wykorzystaj `.env` do przechowywania wszystkich wrażliwych danych i endpointów,
- Używaj `fetchFromWorker` jako głównej metody komunikacji,
- Waliduj odpowiedzi i obsługuj błędy jak w przykładzie `safeFetch`,
- Testuj lokalnie z `astro dev` i `wrangler dev`.

***

wnastepnym pliku Wzory API.,md  bedą wzory wywołan api