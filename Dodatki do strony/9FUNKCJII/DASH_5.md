Oto kompleksowa propozycja integracji CI/CD, szablonów dokumentacji dla każdej sekcji panelu administracyjnego mybonzo oraz rozbudowanych skryptów deploymentu, które zapewnią sprawne zarządzanie projektem i automatyzację wdrożeń.

***

# 1. Integracja CI/CD – przykładowy workflow GitHub Actions

Plik `.github/workflows/deploy.yml`

```yaml
name: Deploy mybonzo project

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test  # lub inny framework testowy

      - name: Build Astro frontend
        run: npm run build

      - name: Publish Cloudflare Workers
        env:
          CF_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
          CF_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ACTIVEPIECES_API_KEY: ${{ secrets.ACTIVEPIECES_API_KEY }}
          FLOWISE_API_TOKEN: ${{ secrets.FLOWISE_API_TOKEN }}
        run: wrangler publish

      - name: Deploy Flowise workflows
        env:
          FLOWISE_API_TOKEN: ${{ secrets.FLOWISE_API_TOKEN }}
        run: |
          node ./scripts/deployFlowiseWorkflows.js

      - name: Deploy ActivePieces workflows
        env:
          ACTIVEPIECES_API_KEY: ${{ secrets.ACTIVEPIECES_API_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          node ./scripts/deployActivePiecesWorkflows.js
```

***

# 2. Szablony dokumentacji dla każdej sekcji

Tworzymy oddzielny plik Markdown w folderze `Documentation/` dla każdego modułu.

***

## Przykład: `Documentation/Functionality_VisitorsStats.md`

```md
# VisitorsStats – Statystyki odwiedzin

## Lokalizacja

- Frontend: `/src/components/Admin/VisitorsStats.jsx`
- Backend API: `/src/api/admin/visitors.js`

## Opis

Wyświetla liczbę odwiedzających stronę, aktywnych użytkowników oraz statystykę odwiedzin za ostatnie 24h.  
Dane są pobierane z backendu i aktualizowane automatycznie po załadowaniu komponentu.

## Parametry

- Brak parametrów wejściowych (statystyki globalne)

## Możliwości Rozszerzenia

- Integracja z Google Analytics API
- Filtracja po czasie, lokalizacji
- Eksport do CSV
```

***

## Przykład: `Documentation/Functionality_CodeManager.md`

```md
# CodeManager – Zarządzanie kodem i deploymentem

## Lokalizacja

- Frontend: `/src/components/Admin/CodeManager.jsx`
- Backend API: `/src/api/admin/deploy.js`

## Opis

Panel umożliwia wklejanie fragmentów kodu, ich edycję oraz wywoływanie deploymentu do produkcji.  
Obsługuje wdrożenia frontend, backend i workflow AI.

## Użycie

- Wprowadź kod w polu tekstowym.  
- Naciśnij "Wdrażaj kod" aby zapisać i uruchomić wdrożenie.  
- Wyświetla logi i status deploymentu.

## Bezpieczeństwo

- Dostęp chroniony hasłem (HAOS77) w panelu.
- Rekomendowane uwierzytelnianie tokenami dla endpointów.

## Planowane Rozszerzenia

- Historia wdrożeń i rollback  
- Integracja z repozytorium git (pull/push)  
- Automatyczne testy po wdrożeniu
```

***

# 3. Rozbudowane skrypty deploymentu (Node.js)

***

## 3.1. `scripts/deployFlowiseWorkflows.js`

```js
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const flowiseUrl = 'https://api.flowise.ai/v1/workflows/import';
const workflowsDir = './src/workflows/flowise';

async function deploy() {
  try {
    const files = await fs.readdir(workflowsDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(workflowsDir, file);
        let content = await fs.readFile(filePath, 'utf8');
        content = content.replace(/<API_KEY>/g, process.env.FLOWISE_API_TOKEN);

        const res = await fetch(flowiseUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.FLOWISE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: content
        });

        if (!res.ok) {
          const text = await res.text();
          console.error(`Błąd deployu Flowise workflow "${file}": ${text}`);
        } else {
          console.log(`Workflow Flowise "${file}" wdrożony pomyślnie.`);
        }
      }
    }
  } catch (e) {
    console.error('Błąd przy deployu Flowise:', e);
  }
}

deploy();
```

***

## 3.2. `scripts/deployActivePiecesWorkflows.js`

```js
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const activepiecesUrl = 'https://api.activepieces.com/api/workflows/import';
const workflowsDir = './src/workflows/activepieces';

async function deploy() {
  try {
    const files = await fs.readdir(workflowsDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(workflowsDir, file);
        let content = await fs.readFile(filePath, 'utf8');
        content = content.replace(/<API_KEY>/g, process.env.ACTIVEPIECES_API_KEY);
        content = content.replace(/<OPENAI_API_KEY>/g, process.env.OPENAI_API_KEY);

        const res = await fetch(activepiecesUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.ACTIVEPIECES_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: content
        });

        if (!res.ok) {
          const text = await res.text();
          console.error(`Błąd deployu ActivePieces workflow "${file}": ${text}`);
        } else {
          console.log(`Workflow ActivePieces "${file}" wdrożony pomyślnie.`);
        }
      }
    }
  } catch (e) {
    console.error('Błąd przy deployu ActivePieces:', e);
  }
}

deploy();
```

***

# 4. Jak korzystać z powyższych rozwiązań

1. Wgraj skrypty do folderu `scripts/` w repozytorium projektu.  
2. Ustaw zmienne środowiskowe w `.env` (FLOWISE_API_TOKEN, ACTIVEPIECES_API_KEY, OPENAI_API_KEY).  
3. Dodaj do workflow CI/CD kroki uruchamiające te skrypty po buildzie/pushu.  
4. Dokumentuj każdy workflow i endpoint w folderze `Documentation` jako Markdown.  
5. Rozwijaj panel admina bazując na komponentach i endpointach według dokumentacji.

 pomogę wygenerować gotowe pliki `.env.example`, dodatkowe komponenty UI patrz DASH_6.md