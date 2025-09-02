/**
 * Skrypt automatycznego deployment workflow do Flowise i ActivePieces
 * System MyBonzo - Automatyzacja wdrożeniowa
 */
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import { API_KEYS, validateRequiredKeys } from '../src/utils/loadEnv.js';

// Konfiguracja deployment
const DEPLOYMENT_CONFIG = {
  flowise: {
    baseUrl: process.env.FLOWISE_API_URL || 'https://api.flowise.com/api/v1',
    importEndpoint: '/chatflows/import',
    timeout: 30000
  },
  activepieces: {
    baseUrl: process.env.ACTIVEPIECES_API_URL || 'https://api.activepieces.com/api/v1',
    importEndpoint: '/flows/import',
    timeout: 30000
  }
};

// Lista workflow do wdrożenia
const WORKFLOWS = [
  {
    file: 'flowise_monitoring_workflow.json',
    platform: 'flowise',
    name: 'Activity Monitor - Error Detection',
    description: 'Monitorowanie błędów i alerty'
  },
  {
    file: 'flowise_faq_generation_workflow.json',
    platform: 'flowise', 
    name: 'Automated FAQ Generation',
    description: 'Automatyczne generowanie FAQ z AI'
  },
  {
    file: 'activepieces_reminders_workflow.json',
    platform: 'activepieces',
    name: 'Smart Reminders Notification',
    description: 'Wielokanałowe powiadomienia przypomnień'
  }
];

/**
 * Podmień placeholdery API keys w contencie JSON
 */
function replaceApiKeyPlaceholders(content) {
  let processedContent = content;
  
  // Mapa placeholderów na rzeczywiste klucze
  const placeholders = {
    '<OPENAI_API_KEY>': API_KEYS.OPENAI_API_KEY,
    '<ACTIVEPIECES_API_KEY>': API_KEYS.ACTIVEPIECES_API_KEY,
    '<FLOWISE_API_TOKEN>': API_KEYS.FLOWISE_API_TOKEN,
    '<MYBONZO_API_KEY>': API_KEYS.MYBONZO_API_KEY || API_KEYS.CLOUDFLARE_API_TOKEN,
    '<CLOUDFLARE_API_TOKEN>': API_KEYS.CLOUDFLARE_API_TOKEN,
    '<EMAIL_API_KEY>': API_KEYS.EMAIL_API_KEY,
    '<SMS_API_KEY>': API_KEYS.SMS_API_KEY
  };
  
  // Podmień wszystkie placeholdery
  Object.entries(placeholders).forEach(([placeholder, value]) => {
    if (value) {
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value);
    }
  });
  
  return processedContent;
}

/**
 * Wczytaj i przetworz plik workflow
 */
async function loadWorkflow(filename) {
  try {
    const workflowPath = path.join(process.cwd(), 'workflows', filename);
    const content = await fs.readFile(workflowPath, 'utf8');
    const processedContent = replaceApiKeyPlaceholders(content);
    return JSON.parse(processedContent);
  } catch (error) {
    throw new Error(`Błąd wczytywania workflow ${filename}: ${error.message}`);
  }
}

/**
 * Wyślij workflow do Flowise
 */
async function deployToFlowise(workflowData, workflowInfo) {
  console.log(`📤 Wdrażanie do Flowise: ${workflowInfo.name}`);
  
  if (!API_KEYS.FLOWISE_API_TOKEN) {
    throw new Error('Brak klucza FLOWISE_API_TOKEN');
  }
  
  const url = `${DEPLOYMENT_CONFIG.flowise.baseUrl}${DEPLOYMENT_CONFIG.flowise.importEndpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.FLOWISE_API_TOKEN}`,
        'User-Agent': 'MyBonzo-Deploy/1.0'
      },
      body: JSON.stringify({
        chatflow: workflowData,
        override: true,
        metadata: {
          deployedBy: 'mybonzo-auto-deploy',
          deployedAt: new Date().toISOString(),
          version: workflowData.version || '1.0.0'
        }
      }),
      timeout: DEPLOYMENT_CONFIG.flowise.timeout
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }
    
    const result = await response.json();
    console.log(`✅ Flowise deployment sukces: ${result.id || 'OK'}`);
    return result;
    
  } catch (error) {
    console.error(`❌ Błąd Flowise deployment: ${error.message}`);
    throw error;
  }
}

/**
 * Wyślij workflow do ActivePieces
 */
async function deployToActivePieces(workflowData, workflowInfo) {
  console.log(`📤 Wdrażanie do ActivePieces: ${workflowInfo.name}`);
  
  if (!API_KEYS.ACTIVEPIECES_API_KEY) {
    throw new Error('Brak klucza ACTIVEPIECES_API_KEY');
  }
  
  const url = `${DEPLOYMENT_CONFIG.activepieces.baseUrl}${DEPLOYMENT_CONFIG.activepieces.importEndpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.ACTIVEPIECES_API_KEY}`,
        'User-Agent': 'MyBonzo-Deploy/1.0'
      },
      body: JSON.stringify({
        flow: workflowData,
        publishImmediately: true,
        metadata: {
          deployedBy: 'mybonzo-auto-deploy',
          deployedAt: new Date().toISOString(),
          version: workflowData.version || '1.0.0'
        }
      }),
      timeout: DEPLOYMENT_CONFIG.activepieces.timeout
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }
    
    const result = await response.json();
    console.log(`✅ ActivePieces deployment sukces: ${result.id || 'OK'}`);
    return result;
    
  } catch (error) {
    console.error(`❌ Błąd ActivePieces deployment: ${error.message}`);
    throw error;
  }
}

/**
 * Wdróż pojedynczy workflow
 */
async function deployWorkflow(workflowInfo) {
  try {
    console.log(`\n🚀 Rozpoczynam deployment: ${workflowInfo.name}`);
    console.log(`📁 Plik: ${workflowInfo.file}`);
    console.log(`🎯 Platforma: ${workflowInfo.platform}`);
    
    // Wczytaj workflow
    const workflowData = await loadWorkflow(workflowInfo.file);
    
    // Wdróż na odpowiednią platformę
    let result;
    if (workflowInfo.platform === 'flowise') {
      result = await deployToFlowise(workflowData, workflowInfo);
    } else if (workflowInfo.platform === 'activepieces') {
      result = await deployToActivePieces(workflowData, workflowInfo);
    } else {
      throw new Error(`Nieznana platforma: ${workflowInfo.platform}`);
    }
    
    return {
      success: true,
      workflow: workflowInfo.name,
      platform: workflowInfo.platform,
      result
    };
    
  } catch (error) {
    return {
      success: false,
      workflow: workflowInfo.name,
      platform: workflowInfo.platform,
      error: error.message
    };
  }
}

/**
 * Główna funkcja deployment
 */
async function main() {
  console.log('🤖 MyBonzo Workflow Deployment System');
  console.log('=====================================');
  
  try {
    // Sprawdź klucze API
    console.log('\n🔑 Sprawdzanie kluczy API...');
    const isValid = validateRequiredKeys();
    if (!isValid) {
      console.warn('⚠️  Niektóre klucze API mogą być brakujące. Kontynuuję deployment...');
    }
    
    // Wdróż wszystkie workflow
    console.log('\n📦 Rozpoczynam deployment workflow...');
    const results = [];
    
    for (const workflow of WORKFLOWS) {
      const result = await deployWorkflow(workflow);
      results.push(result);
      
      // Pauza między deploymentami
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Podsumowanie
    console.log('\n📊 PODSUMOWANIE DEPLOYMENT:');
    console.log('============================');
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Pomyślnych: ${successful.length}`);
    console.log(`❌ Nieudanych: ${failed.length}`);
    console.log(`📈 Razem: ${results.length}`);
    
    if (successful.length > 0) {
      console.log('\n✅ POMYŚLNE DEPLOYMENTY:');
      successful.forEach(result => {
        console.log(`  • ${result.workflow} (${result.platform})`);
      });
    }
    
    if (failed.length > 0) {
      console.log('\n❌ NIEUDANE DEPLOYMENTY:');
      failed.forEach(result => {
        console.log(`  • ${result.workflow} (${result.platform}): ${result.error}`);
      });
    }
    
    // Exit code
    const exitCode = failed.length > 0 ? 1 : 0;
    console.log(`\n🏁 Deployment zakończony z kodem: ${exitCode}`);
    process.exit(exitCode);
    
  } catch (error) {
    console.error('\n💥 KRYTYCZNY BŁĄD DEPLOYMENT:');
    console.error(error.message);
    process.exit(1);
  }
}

// Uruchom jeśli plik jest wykonywany bezpośrednio
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { deployWorkflow, main as deployAllWorkflows };
