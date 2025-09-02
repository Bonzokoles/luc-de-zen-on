#!/usr/bin/env node

/**
 * Skrypt do deployowania Marketing Content Worker do Cloudflare
 * Wykonuje deployment, konfigurację i testy podstawowe
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Rozpoczynam deployment Marketing Content Worker...');

try {
  // Sprawdzenie czy plik worker istnieje
  const workerPath = path.join(__dirname, '../src/workers/marketing-content.js');
  if (!fs.existsSync(workerPath)) {
    throw new Error('Plik marketing-content.js nie istnieje!');
  }

  // Sprawdzenie czy konfiguracja wrangler istnieje
  const wranglerPath = path.join(__dirname, '../wrangler-marketing.toml');
  if (!fs.existsSync(wranglerPath)) {
    throw new Error('Plik wrangler-marketing.toml nie istnieje!');
  }

  console.log('✅ Pliki konfiguracyjne znalezione');

  // Sprawdzenie czy wrangler jest zainstalowany
  try {
    execSync('wrangler --version', { stdio: 'pipe' });
    console.log('✅ Wrangler CLI zainstalowany');
  } catch (error) {
    console.log('⚠️  Instaluję Wrangler CLI...');
    execSync('npm install -g wrangler', { stdio: 'inherit' });
  }

  // Weryfikacja logowania do Cloudflare
  console.log('🔑 Sprawdzam autoryzację Cloudflare...');
  try {
    execSync('wrangler whoami', { stdio: 'pipe' });
    console.log('✅ Zalogowany do Cloudflare');
  } catch (error) {
    console.log('⚠️  Musisz się zalogować do Cloudflare:');
    console.log('   Uruchom: wrangler login');
    process.exit(1);
  }

  // Deployment do środowiska deweloperskiego
  console.log('📦 Deployuję worker do środowiska deweloperskiego...');
  execSync(`wrangler publish --config ${wranglerPath}`, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('✅ Marketing Content Worker został pomyślnie wdrożony!');
  
  // Podsumowanie endpointów
  console.log('\n📋 Dostępne endpointy:');
  console.log('   POST /generate-marketing-content - Generowanie treści marketingowych');
  console.log('   POST /generate-recommendations   - Generowanie rekomendacji');  
  console.log('   POST /qualify-lead              - Kwalifikacja leadów');
  
  console.log('\n🔧 Następne kroki:');
  console.log('   1. Ustaw OPENAI_API_KEY w konfiguracji Cloudflare');
  console.log('   2. Skonfiguruj KV namespace MARKETING_CACHE');
  console.log('   3. Przetestuj endpointy używając npm run test:marketing');
  
  console.log('\n🎉 Deployment zakończony pomyślnie!');

} catch (error) {
  console.error('❌ Błąd podczas deploymentu:', error.message);
  process.exit(1);
}
