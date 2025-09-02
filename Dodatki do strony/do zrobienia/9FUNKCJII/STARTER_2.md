Oto przykładowy automatyczny skrypt deploymentu w Node.js, który wykonuje:

- Budowę projektu Astro (`npm run build`)
- Deployment Cloudflare Workers (`wrangler publish`)
- Automatyczny import workflow do Flowise i ActivePieces z plików JSON w workspace
- Korzysta ze zmiennych środowiskowych w pliku `.env` (np. API key dla ActivePieces i Flowise)

***

# Skrypt automatycznego deploymentu – `deployMybonzo.js`

```js
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const baseDir = 'T:/MY_LUC_ZEN_ON';
const flowiseApiUrl = 'https://api.flowise.ai/v1/workflows/import';
const activepiecesApiUrl = 'https://api.activepieces.com/api/workflows/import';

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      console.log(stdout);
      if (stderr) console.error(stderr);
      resolve();
    });
    process.stdout?.pipe(process.stdout);
    process.stderr?.pipe(process.stderr);
  });
}

async function deployWorkers() {
  console.log('Buduję projekt Astro...');
  await runCommand('npm run build');

  console.log('Publikuję Cloudflare Workers...');
  await runCommand('wrangler publish');
}

async function deployWorkflow(filePath, apiUrl, apiKey) {
  console.log(`Deployuję workflow z pliku ${filePath}...`);
  const fullPath = path.join(baseDir, filePath);
  let content = await fs.readFile(fullPath, 'utf8');

  // Podstawiamy klucze API w treści workflow
  if (apiKey) {
    content = content.replace(/<API_KEY>/g, apiKey);
  }

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: content
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Błąd deploymentu workflow: ${res.status} ${text}`);
  }

  console.log(`Workflow z pliku ${filePath} wdrożony pomyślnie.`);
}

async function main() {
  try {
    await deployWorkers();

    await deployWorkflow('src/workflows/flowise/flowise_monitoring_workflow.json',
      flowiseApiUrl,
      process.env.FLOWISE_API_TOKEN);

    await deployWorkflow('src/workflows/activepieces/activepieces_reminders_workflow.json',
      activepiecesApiUrl,
      process.env.ACTIVEPIECES_API_KEY);

    await deployWorkflow('src/workflows/activepieces/activepieces_ticket_assignment_workflow.json',
      activepiecesApiUrl,
      process.env.ACTIVEPIECES_API_KEY);

    console.log('Deployment zakończony pomyślnie.');
  } catch (error) {
    console.error('Deployment zakończony błędem:', error);
    process.exit(1);
  }
}

main();
```

***

# Instrukcja uruchomienia skryptu

1. Umieść skrypt `deployMybonzo.js` w swoim workspace (np. `T:\MY_LUC_ZEN_ON`).
2. Uzupełnij plik `.env` w tym samym katalogu o wymagane zmienne:

```
FLOWISE_API_TOKEN=Twój_klucz_Flowise
ACTIVEPIECES_API_KEY=Twój_klucz_ActivePieces
```

3. Upewnij się, że masz zainstalowane wymagane pakiety:

```bash
npm install node-fetch dotenv
```

4. Uruchom deployment w terminalu:

```bash
node deployMybonzo.js
```

***

Ten skrypt zbuduje frontend, opublikuje Workers i zaimportuje zdefiniowane workflow w Flowise i ActivePieces, automatycznie podstawiając klucze API.

