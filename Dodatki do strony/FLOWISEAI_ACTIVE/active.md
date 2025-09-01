2. API dla ActivePieces
Założenia
ActivePieces udostępnia endpoint do startu workflow, np. POST /api/workflows/{workflowId}/run.

Wymaga tokenu w nagłówku Authorization.

Wysyłasz dane jako JSON.

Struktura backendu (analogiczna do Flowise)

/activepieces-api
  ├─ index.js
  ├─ config.js
  └─ package.json


config.js

module.exports = {
  ACTIVEPIECES_API_URL: "https://twoj-activepieces-endpoint/api/workflows/TWÓJ_WORKFLOW_ID/run",
  ACTIVEPIECES_API_TOKEN: "twoj_token_api_activepieces"
}


index.js (Express)
const express = require("express")
const fetch = require("node-fetch")
const { ACTIVEPIECES_API_URL, ACTIVEPIECES_API_TOKEN } = require("./config")

const app = express()
app.use(express.json())

app.post("/run-activepieces", async (req, res) => {
  const inputData = req.body
  try {
    const response = await fetch(ACTIVEPIECES_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACTIVEPIECES_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(inputData)
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

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`ActivePieces API proxy działa na porcie ${port}`)
})

3. Podsumowanie struktury projektu aplikacji:

/your-app
  ├─ /api
  │    ├─ flowise.js       # endpoint Astro lub express proxy do flowise
  │    └─ activepieces.js  # podobnie dla ActivePieces
  ├─ /components
  │    ├─ FlowiseButton.astro
  │    └─ ActivePiecesButton.astro
  ├─ package.json
  └─ ...
  
4. Integracja w aplikacji Astro
Frontend wywołuje /api/flowise i /api/activepieces (endpointy proxy).

Proxy wywołuje API faktyczne z tokenem.

Zabezpiecz API proxy przed nieautoryzowanym dostępem (np. token, sesja).

 Backend: Astro API proxy do ActivePieces — src/pages/api/activepieces.js
 
 Frontend: Komponent Astro przycisku ActivePieces — src/components/ActivePiecesButton.astro
 
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