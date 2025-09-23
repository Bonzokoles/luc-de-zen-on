Poniżej jest przewodnik krok po kroku, jak skonfigurować i wdrożyć Cloudflare Worker do proxy Stable Diffusion API, które użyjesz w projekcie MyBonzo.

***

## Krok 1: Załóż konto Cloudflare i zainstaluj narzędzia

- Załóż konto na [Cloudflare](https://dash.cloudflare.com)
- Zainstaluj [Cloudflare CLI - wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install/)
  
```bash
npm install -g wrangler
```

***

## Krok 2: Inicjalizacja projektu Workers

W terminalu utwórz folder dla workera i zainicjuj projekt:

```bash
mkdir stable-diffusion-proxy && cd stable-diffusion-proxy
wrangler init
```

Wyświetli się plik `wrangler.toml` i podstawowa struktura.

***

## Krok 3: Edytuj plik worker.js

W katalogu `src` utwórz (lub edytuj) plik `index.js` (lub `worker.js`) z kodem proxy (przykład):

```js
export default {
  async fetch(request) {
    const apiURL = 'https://api.stability.ai/v1/generate/text-to-image'

    // Przekieruj request POST do API SD z autoryzacją
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    const reqBody = await request.json()

    const apiResponse = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STABILITY_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    })

    const data = await apiResponse.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
}
```

***

## Krok 4: Ustawienie zmiennej środowiskowej z kluczem API

W pliku `wrangler.toml` dodaj konfigurację zmiennych środowiskowych:

```toml
name = "stable-diffusion-proxy"
type = "javascript"
account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"
workers_dev = true
compatibility_date = "2025-09-01"

[env.production]
account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"
route = "yourdomain.com/api/sd-proxy/*"
zone_id = "YOUR_ZONE_ID"

[vars]
STABILITY_AI_API_KEY = "wstaw-swoj-klucz-api"
```

- `account_id` znajdziesz na Dashboard Cloudflare
- `route` i `zone_id` ustawisz jeśli chcesz wdrożyć Worker na produkcyjnej domenie

***

## Krok 5: Deploy Workers

Zaloguj się w wrangler:

```bash
wrangler login
```

Uruchom deploy na workers.dev (domenie developerskiej CF):

```bash
wrangler publish
```

Po ukończeniu zobaczysz URL np. `https://stable-diffusion-proxy.<twoja-subdomena>.workers.dev`

***

## Krok 6: Test proxy

Naprawdę wykonaj POST request do tego URL z przykładowym JSON-em body (np. z Postmana):

```json
{
  "prompt": "fantasy castle on the hill at sunset",
  "cfg_scale": 7,
  "samples": 1,
  "steps": 30
}
```

***

## Krok 7: Wykorzystanie w Astro

- W frontendzie Astro ustaw fetch do tego endpointu proxy Cloudflare Workers (np. `/api/sd-proxy` lub pełny URL workers.dev)
- Możesz też utworzyć proxy lokalne w Astro, które przekierowuje zapytania do Workers

***

 i jeszcze sprawdz stable_4.md
 