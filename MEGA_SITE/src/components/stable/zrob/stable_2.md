Poniżej są przykładowe, podstawowe kody dla poszczególnych części zaawansowanej integracji Stable Diffusion z Astro i Cloudflare Workers na Twojej stronie MyBonzo.

***

## 1. Cloudflare Worker Proxy (`worker.js`)

```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Adres API Stability AI (przykład)
  const apiURL = 'https://api.stability.ai/v1/generate/text-to-image'
  
  // Pobierz dane od klienta (frontend)
  const requestBody = await request.json()

  // Wywołaj API Stable Diffusion z kluczem Bearer (wstaw swój klucz)
  const apiResponse = await fetch(apiURL, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_STABILITY_AI_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  // Pobierz tekstową odpowiedź z API
  const data = await apiResponse.json()

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

- Zastąp `YOUR_STABILITY_AI_API_KEY` prawdziwym kluczem API.
- Wdróż ten worker na Cloudflare i zanotuj URL (np. `https://myproxy.cloudflareworkers.net`).

***

## 2. API Proxy w Astro (opcjonalnie, jeśli chcesz proxy lokalny)

`src/pages/api/sd-proxy.ts`

```ts
import type { APIRoute } from 'astro'

export const post: APIRoute = async ({ request }) => {
  const body = await request.json()

  const response = await fetch('https://myproxy.cloudflareworkers.net', { // URL do CF Worker
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

- Ten plik przekazuje zapytania z frontendu do Cloudflare Worker.

***

## 3. Komponent React (w Astro) do generowania obrazów

Stwórz plik komponentu React np. `src/components/StableDiffusionForm.jsx`:

```jsx
import React, { useState } from 'react'

export default function StableDiffusionForm() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [error, setError] = useState(null)

  const generateImage = async () => {
    if (!prompt) return
    setLoading(true)
    setError(null)
    setImageUrl(null)

    try {
      const response = await fetch('/api/sd-proxy', { // kieruj do Astro API proxy
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      if (data && data.output && data.output.length > 0) {
        setImageUrl(data.output[0].url) // dostosuj ścieżkę do struktury odpowiedzi API
      } else {
        setError('Brak wyniku z API')
      }
    } catch (err) {
      setError('Błąd sieci lub API')
    }
    setLoading(false)
  }

  return (
    <div>
      <h2>Generuj obraz AI (Stable Diffusion)</h2>
      <textarea
        rows={4}
        placeholder="Napisz co chcesz wygenerować..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />
      <button onClick={generateImage} disabled={loading || !prompt}>
        {loading ? 'Generowanie...' : 'Generuj obraz'}
      </button>
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      {imageUrl && <img src={imageUrl} alt="Wygenerowany obraz" style={{ marginTop: '1rem', maxWidth: '100%' }} />}
    </div>
  )
}
```

***

## 4. Strona w Astro korzystająca z komponentu React

`src/pages/stable-diffusion/index.astro`

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

## Podsumowanie i dalsze kroki

- Wdróż Cloudflare Worker i ustaw endpoint API proxy
- Skonfiguruj proxy w Astro (opcjonalne)
- Uruchom frontend Astro z Reactem wywołującym proxy
- Testuj generowanie obrazów z Stable Diffusion przez API
- Dodaj style, obsługę błędów i rozszerzenia UX wedle potrzeb

***sprawdz stable_3.md z konfiguracją Cloudflare Workers 