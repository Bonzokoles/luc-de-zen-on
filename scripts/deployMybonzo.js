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
    console.log('🚀 Rozpoczynanie deploymentu mybonzo...');
    
    // Deploy Cloudflare Workers
    await deployWorkers();

    console.log('📋 Deployowanie workflow...');

    // Deploy Flowise workflows
    if (process.env.FLOWISE_API_TOKEN) {
      await deployWorkflow('src/workflows/flowise/flowise_monitoring_workflow.json',
        flowiseApiUrl,
        process.env.FLOWISE_API_TOKEN);

      await deployWorkflow('workflows/flowise_faq_generation_workflow.json',
        flowiseApiUrl,
        process.env.FLOWISE_API_TOKEN);
    } else {
      console.warn('⚠️  FLOWISE_API_TOKEN nie został ustawiony, pomijam deployment Flowise');
    }

    // Deploy ActivePieces workflows
    if (process.env.ACTIVEPIECES_API_KEY) {
      await deployWorkflow('src/workflows/activepieces/activepieces_reminders_workflow.json',
        activepiecesApiUrl,
        process.env.ACTIVEPIECES_API_KEY);

      await deployWorkflow('workflows/activepieces_reminders_workflow.json',
        activepiecesApiUrl,
        process.env.ACTIVEPIECES_API_KEY);
    } else {
      console.warn('⚠️  ACTIVEPIECES_API_KEY nie został ustawiony, pomijam deployment ActivePieces');
    }

    console.log('✅ Deployment zakończony pomyślnie.');
    console.log('📊 Podsumowanie:');
    console.log('- Astro projekt zbudowany');
    console.log('- Cloudflare Workers opublikowane');
    console.log('- Workflow zaimportowane do platform');
    
  } catch (error) {
    console.error('❌ Deployment zakończony błędem:', error);
    process.exit(1);
  }
}

main();
