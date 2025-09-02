Oto dodatkowy plan oraz przykłady automatyzacji wdrożeniowej, które zapewnią łatwe dodawanie i automatyczne wdrażanie kluczy API w Twoim systemie mybonzo, wraz z instrukcją i miejscem na konfigurację kluczy.

Automatyzacje dodawania i wdrażania kluczy API z automatycznym deploymentem
1. Miejsce na przechowywanie kluczy API
Propozycja: plik konfiguracyjny .env lub dedykowany plik JSON (lokalnie lub w repozytorium)
Przykład .env:

text
OPENAI_API_KEY=your_openai_api_key_here
ACTIVEPIECES_API_KEY=your_activepieces_api_key_here
FLOWISE_API_TOKEN=your_flowise_api_token_here
2. Automatyczne wczytywanie kluczy API w procesie build i deployment
Node.js (w skryptach build/deploy)
Plik loadEnv.js:

js
import dotenv from 'dotenv';
dotenv.config();

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const ACTIVEPIECES_API_KEY = process.env.ACTIVEPIECES_API_KEY;
export const FLOWISE_API_TOKEN = process.env.FLOWISE_API_TOKEN;
Ten plik importujesz w swoich skryptach deploymentu i backend API.

3. Automatyczny deployment workflow z podstawionymi kluczami (skrypt w Node.js)
Przykład deployWorkflows.js do automatycznego deployu do Flowise i ActivePieces z wczytaniem kluczy z env i podstawieniem ich w plikach JSON:

js
import fs from 'fs/promises';
import fetch from 'node-fetch';
import { OPENAI_API_KEY, ACTIVEPIECES_API_KEY, FLOWISE_API_TOKEN } from './loadEnv.js';

async function deployFlowise() {
  let flowJson = await fs.readFile('./workflow_flowise.json', 'utf8');
  flowJson = flowJson.replace(/<API_KEY>/g, FLOWISE_API_TOKEN);

  const response = await fetch('https://api.flowise.ai/v1/workflows/import', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FLOWISE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: flowJson
  });

  if (!response.ok) throw new Error(`Flowise deploy error: ${response.statusText}`);
  console.log('Flowise workflow deployed');
}

async function deployActivePieces() {
  let apJson = await fs.readFile('./workflow_activepieces.json', 'utf8');
  apJson = apJson.replace(/<API_KEY>/g, ACTIVEPIECES_API_KEY);

  const response = await fetch('https://api.activepieces.com/api/workflows/import', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACTIVEPIECES_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: apJson
  });

  if (!response.ok) throw new Error(`ActivePieces deploy error: ${response.statusText}`);
  console.log('ActivePieces workflow deployed');
}

async function main() {
  try {
    await deployFlowise();
    await deployActivePieces();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
Uruchom ten skrypt przez node deployWorkflows.js po uzupełnieniu .env.

4. Automatyczne przekazywanie kluczy do Cloudflare Workers
W pliku wrangler.toml
text
[vars]
OPENAI_API_KEY = "${OPENAI_API_KEY}"
ACTIVEPIECES_API_KEY = "${ACTIVEPIECES_API_KEY}"
Podczas wrangler publish, te zmienne zostaną podstawione z lokalnego środowiska, jeśli używasz np. wrangler secret lub innych mechanizmów CI/CD.

5. Integracja z CI/CD (np. GitHub Actions)
Przykład workflow:

text
name: Deploy mybonzo

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Load env vars
        run: echo "OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }}" >> $GITHUB_ENV
      - name: Deploy Cloudflare Workers
        run: wrangler publish
        env:
          CF_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}
          CF_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ACTIVEPIECES_API_KEY: ${{ secrets.ACTIVEPIECES_API_KEY }}
          FLOWISE_API_TOKEN: ${{ secrets.FLOWISE_API_TOKEN }}
      - name: Deploy workflows
        run: node deployWorkflows.js
        env:
          ACTIVEPIECES_API_KEY: ${{ secrets.ACTIVEPIECES_API_KEY }}
          FLOWISE_API_TOKEN: ${{ secrets.FLOWISE_API_TOKEN }}
Podsumowanie
Umieść klucze w pliku .env lokalnie lub w bezpiecznych sekretach CI.

Skrypt deployWorkflows.js automatycznie podmienia placeholdery i wdraża workflow Flowise i ActivePieces.

Zmienne środowiskowe są przekazywane do workerów w wrangler.toml lub przez CI/CD.

Workflow CI/CD (np. GitHub Actions) integruje cały proces buildu, publikacji workerów i workflow.