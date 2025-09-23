Poniżej znajduje się kompletna implementacja integrująca MyBonzo z modułem Stable Diffusion, zawierająca obsługę wildcardów w promptach, tłumaczenie z polskiego na angielski oraz wywołanie API Stable Diffusion poprzez Cloudflare Worker proxy. Całość podzielona na części backend i frontend.

***

## 1. Cloudflare Worker Proxy - z obsługą wildcardów i tłumaczenia

Plik `worker.js`:

```js
/**
 * Cloudflare Worker jako proxy i procesor promptów:
 * - Zamienia wildcardy w promptach
 * - Tłumaczy prompt z PL na EN (Google Translate API)
 * - Wywołuje Stable Diffusion API z przetworzonym promptem
 */

const wildcards = {
  postac: ['smok', 'rycerz', 'elf', 'robot'],
  styl: ['cyberpunk', 'renesans', 'retro', 'futurystyczny'],
  miejsce: ['miejska ulica', 'górski szczyt', 'kosmiczna stacja', 'jaskinia'],
}

// Zastępowanie wildcardów losowymi wartościami
function replaceWildcards(prompt) {
  return prompt.replace(/\{(\w+)\}/g, (match, key) => {
    if (wildcards[key]) {
      const options = wildcards[key]
      return options[Math.floor(Math.random() * options.length)]
    }
    return match
  })
}

// Tłumaczenie promptu z pl na en, korzystając z Google Translate API przez endpoint REST
async function translatePromptToEnglish(promptPL) {
  const translateUrl = 'https://translation.googleapis.com/language/translate/v2'
  const apiKey = STABILITY_AI_TRANSLATE_API_KEY // ustaw w Workers secrets

  const response = await fetch(`${translateUrl}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: promptPL,
      source: 'pl',
      target: 'en',
      format: 'text',
    }),
  })

  const data = await response.json()
  return data.data?.translations?.[0]?.translatedText || promptPL
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  let bodyJson
  try {
    bodyJson = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  if (!bodyJson.prompt) {
    return new Response('Prompt missing', { status: 400 })
  }

  // 1. Zamiana wildcardów
  const promptWithWildcardsReplaced = replaceWildcards(bodyJson.prompt)

  // 2. Tłumaczenie na angielski
  const translatedPrompt = await translatePromptToEnglish(promptWithWildcardsReplaced)

  // 3. Przygotowanie zapytania do Stable Diffusion API
  const sdApiUrl = 'https://api.stability.ai/v1/generate/text-to-image'
  const sdApiKey = STABILITY_AI_API_KEY // ustaw w Workers secrets

  const sdRequestBody = {
    ...bodyJson,
    prompt: translatedPrompt,
  }

  const sdResponse = await fetch(sdApiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sdApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sdRequestBody),
  })

  const sdData = await sdResponse.json()

  return new Response(JSON.stringify(sdData), {
    headers: { 'Content-Type': 'application/json' },
  })
}
```

### Ustaw secrets w Workers:

```bash
wrangler secret put STABILITY_AI_API_KEY
wrangler secret put STABILITY_AI_TRANSLATE_API_KEY
```

***

## 2. Frontend React w Astro: Obsługa promptów, wildcards, wywołanie proxy

Plik: `src/components/StableDiffusionForm.jsx`

```jsx
import React, { useState } from 'react'

export default function StableDiffusionForm() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [error, setError] = useState(null)

  async function generateImage() {
    if (!prompt) return
    setLoading(true)
    setError(null)
    setImageUrl(null)

    try {
      const response = await fetch('/api/sd-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (data && data.output && data.output.length > 0) {
        setImageUrl(data.output[0].url)
      } else {
        setError('Brak wyników z API')
      }
    } catch (e) {
      setError('Błąd generowania obrazu')
    }

    setLoading(false)
  }

  return (
    <div>
      <h2>Generuj obraz AI (Stable Diffusion)</h2>
      <textarea
        rows={4}
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Wpisz prompt (możesz używać {postac}, {styl}, {miejsce})"
        style={{ width: '100%', marginBottom: '1em' }}
      />
      <button onClick={generateImage} disabled={loading || !prompt}>
        {loading ? 'Generuję...' : 'Generuj'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && <img src={imageUrl} alt="Wygenerowany obraz" style={{ marginTop: '1em', maxWidth: '100%' }} />}
    </div>
  )
}
```

***

## 3. Proxy Astro API do Cloudflare Workers

Plik `src/pages/api/sd-proxy.ts`

```ts
import type { APIRoute } from 'astro'

export const post: APIRoute = async ({ request }) => {
  const body = await request.json()

  // Adres Twojego Cloudflare Worker (proxy)
  const workerUrl = 'https://twoj-worker-workers.dev/'

  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

***

## 4. Strona Astro korzystająca z komponentu

Plik `src/pages/stable-diffusion/index.astro`

```astro
---
import StableDiffusionForm from '../../components/StableDiffusionForm.jsx'
---

<html lang="pl">
  <head>
    <title>Stable Diffusion - MyBonzo</title>
  </head>
  <body>
    <main>
      <StableDiffusionForm />
    </main>
  </body>
</html>
```

***

## Podsumowanie

| Część                  | Opis                                                |
|------------------------|----------------------------------------------------|
| Cloudflare Worker       | Proxy + zastępowanie wildcardów + tłumaczenie PL→EN |
| Frontend React         | Formularz promptu z wildcards i obsługą API proxy  |
| Astro API Proxy         | Przekierowanie zapytań do Cloudflare Worker        |
| Strona Astro            | Integracja z MyBonzo, dostęp pod `/stable-diffusion`|

***

wdruz całośc i upewnij sie ze działa.