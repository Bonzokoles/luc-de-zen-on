Poniżej znajduje się zestaw przykładowych skryptów oraz wskazówki, jak uruchomić mikroserwisy z modelami AI, zautomatyzować testy i zabezpieczyć wdrożenie na www.mybonzo.com.

1. Przykładowy skrypt uruchomienia mikroserwisu modelu AI (Node.js + Express)
js
// server.js
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

// Przykładowy endpoint modelu Bielik
app.post('/api', (req, res) => {
  const input = req.body.prompt || ''
  
  // Logika modelu AI lub wywołanie zewnętrznego modelu
  const output = `Model Bielik odpowiedź na: ${input}`

  res.json({ result: output })
})

app.listen(PORT, () => {
  console.log(`Model AI Bielik działa na porcie ${PORT}`)
})
Uruchom serwis:

bash
node server.js
2. Prosty test działania mikroserwisu (Node.js, npm install node-fetch@2)
js
const fetch = require('node-fetch')

async function testModel() {
  const response = await fetch('http://localhost:3000/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Test pytania' }),
  })
  const data = await response.json()
  console.log('Odpowiedź z modelu: ', data)
}

testModel()
3. Automatyzacja testów (np. z użyciem GitHub Actions)
Plik .github/workflows/test.yml:

text
name: Test AI Model

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: node test.js
4. Wskazówki do zabezpieczeń i wdrożeń
Przechowuj tajne klucze i tokeny w bezpiecznym miejscu, np. w Secrets GitHub lub Cloudflare Environments Variables.

W API i workerach używaj uwierzytelniania JWT lub tokenów Bearer.

Korzystaj z Cloudflare Firewall Rules do ochrony endpointów.

Monitoruj logi i alerty dla podejrzanej aktywności.

Stosuj limitację zapytań (rate limiting) w workerach lub na backendzie.

