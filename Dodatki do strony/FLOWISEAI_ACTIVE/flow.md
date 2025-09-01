1. API dla Flowise AI
Założenia
Flowise AI udostępnia endpoint do wywoływania workflowów (np. /api/flow/run).

Wymaga autoryzacji tokenem Bearer.

Endpoint przyjmuje JSON z parametrami (np. prompt).

Struktura backendu (np. Node.js + Express lub Astro API)

/flowise-api
  ├─ index.js                # główny serwer/endpoint
  ├─ config.js               # konfiguracja API i tokenów
  └─ package.json


Przykładowy config.js

module.exports = {
  FLOWISE_API_URL: "https://twoj-flowise-endpoint/api/flow/run",
  FLOWISE_API_TOKEN: "twoj_token_api_flowise"
}

Przykładowy index.js (Express)

const express = require("express")
const fetch = require("node-fetch")
const { FLOWISE_API_URL, FLOWISE_API_TOKEN } = require("./config")

const app = express()
app.use(express.json())

app.post("/run-flowise", async (req, res) => {
  const { prompt } = req.body
  if (!prompt) {
    return res.status(400).json({ error: "Brak promptu" })
  }
  try {
    const response = await fetch(FLOWISE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FLOWISE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    })
    if (!response.ok) {
      const error = await response.text()
      return res.status(response.status).json({ error })
    }
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Flowise API proxy działa na porcie ${port}`)
})

 Backend: Astro API proxy do Flowise — src/pages/api/flowise.js
  Frontend: Komponent Astro przycisku Flowise — src/components/FlowiseButton.astro
text

 Dodaj do .env (lub astro.config.mjs)
text
PUBLIC_FLOWISE_API_TOKEN=twoj_token_api_flowise
PUBLIC_ACTIVEPIECES_API_TOKEN=twoj_token_api_activepieces
6. Użycie komponentów w aplikacji Astro
text
---
import FlowiseButton from '../components/FlowiseButton.astro'
import ActivePiecesButton from '../components/ActivePiecesButton.astro'
---

<h2>Flowise AI</h2>
<FlowiseButton />

<h2>ActivePieces</h2>
<ActivePiecesButton />
W ten sposób masz prosty i skalowalny proxy API oraz UI do wywoływania workflowów na Flowise i ActivePieces z aplikacji Astro.