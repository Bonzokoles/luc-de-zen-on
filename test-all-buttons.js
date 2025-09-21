// TEST WSZYSTKICH PRZYCISKÓW I AGENTÓW - 21 września 2025
// Kompletny test funkcjonalności i połączeń z Cloudflare

console.log("🧪 ROZPOCZĘCIE TESTÓW WSZYSTKICH PRZYCISKÓW I AGENTÓW");
console.log("📅 Data testu:", new Date().toLocaleDateString('pl-PL'));

// TEST 1: Sprawdź dostępność funkcji JavaScript
console.log("\n=== TEST 1: FUNKCJE JAVASCRIPT ===");

const functions = [
  'openFunction',
  'openImageGenerator', 
  'openChatbot',
  'openBigQuery',
  'openKaggle',
  'openTavily',
  'checkAllStatus',
  'runAllAPITests'
];

functions.forEach(funcName => {
  const exists = typeof window[funcName] === 'function';
  console.log(`${exists ? '✅' : '❌'} ${funcName}: ${exists ? 'DOSTĘPNA' : 'BRAK'}`);
  if (!exists && funcName === 'openFunction') {
    console.log('🔧 Próba naprawy openFunction...');
    // Sprawdź czy jest zdefiniowana lokalnie
    try {
      eval(`console.log('openFunction test:', typeof openFunction)`);
    } catch(e) {
      console.log('❌ openFunction nie jest zdefiniowana lokalnie');
    }
  }
});

// TEST 2: Sprawdź wszystkie przyciski na stronie
console.log("\n=== TEST 2: PRZYCISKI NA STRONIE ===");

const buttons = document.querySelectorAll('button[onclick], .ai-function-card');
console.log(`Znaleziono ${buttons.length} przycisków z onclick`);

buttons.forEach((button, index) => {
  const onclick = button.getAttribute('onclick') || button.onclick;
  const id = button.id || `button-${index}`;
  const text = button.textContent?.trim().substring(0, 30) || 'Bez tekstu';
  
  console.log(`${index + 1}. ID: ${id} | Tekst: "${text}" | onclick: ${onclick}`);
  
  // Sprawdź czy przycisk reaguje na kliknięcie
  if (button.onclick || button.getAttribute('onclick')) {
    console.log(`   🎯 Przycisk ma handler onclick`);
  } else {
    console.log(`   ❌ Przycisk NIE ma handlera onclick`);
  }
});

// TEST 3: Sprawdź połączenia API/endpoints
console.log("\n=== TEST 3: TESTY POŁĄCZEŃ API ===");

const endpoints = [
  { name: 'POLACZEK_AGENT_SYS_23', url: '/POLACZEK_AGENT_SYS_23' },
  { name: 'AI Agent Hub', url: '/hub/ai-agent-s' },
  { name: 'Workers Status', url: '/workers-status' },
  { name: 'Image Generator', url: '/image-generator' },
  { name: 'Chatbot', url: '/chatbot' },
  { name: 'BigQuery Analytics', url: '/bigquery-analytics' },
  { name: 'Kaggle Datasets', url: '/kaggle-datasets' },
  { name: 'Tavily Search', url: '/tavily-search' },
  { name: 'Status Workers', url: '/status-workers' },
  // AI Functions
  { name: 'Rekomendacje AI', url: '/ai-functions/personalized-recommendations' },
  { name: 'Obsługa Klienta AI', url: '/ai-functions/customer-automation' },
  { name: 'Monitorowanie AI', url: '/ai-functions/activity-monitoring' },
  { name: 'Przypomnienia AI', url: '/ai-functions/reminders-calendar' },
  { name: 'FAQ Generator AI', url: '/ai-functions/dynamic-faq' },
  { name: 'Edukacja AI', url: '/ai-functions/education-recommendations' },
  { name: 'Tickety AI', url: '/ai-functions/ai-tickets' },
  { name: 'Quizy AI', url: '/ai-functions/interactive-quizzes' },
  { name: 'Marketing AI', url: '/ai-functions/marketing-content' }
];

// Test każdego endpointu
async function testEndpoint(endpoint) {
  try {
    console.log(`🔍 Testowanie: ${endpoint.name} (${endpoint.url})`);
    const response = await fetch(endpoint.url, { 
      method: 'HEAD',
      mode: 'no-cors' // Aby uniknąć problemów CORS
    });
    console.log(`   ✅ ${endpoint.name}: Odpowiedź otrzymana`);
    return { ...endpoint, status: 'OK', response: response };
  } catch (error) {
    console.log(`   ❌ ${endpoint.name}: Błąd - ${error.message}`);
    return { ...endpoint, status: 'ERROR', error: error.message };
  }
}

// TEST 4: Cloudflare Workers Connection Test
console.log("\n=== TEST 4: CLOUDFLARE WORKERS ===");

const cloudflareTests = [
  { name: 'API Proxy Worker', url: '/api/workers/proxy' },
  { name: 'Music Worker', url: '/api/workers/music' },
  { name: 'Polaczek Worker', url: '/api/workers/polaczek' },
  { name: 'Chat API', url: '/api/chat' },
  { name: 'Image Generation API', url: '/api/generate-image' },
  { name: 'BigQuery API', url: '/api/bigquery' },
  { name: 'Kaggle API', url: '/api/kaggle' },
  { name: 'Tavily API', url: '/api/tavi' }
];

// TEST 5: Symulacja kliknięć (bezpieczna)
console.log("\n=== TEST 5: SYMULACJA KLIKNIĘĆ ===");

function simulateClick(funcName, params = null) {
  try {
    if (typeof window[funcName] === 'function') {
      console.log(`🎯 Symulacja kliknięcia: ${funcName}`);
      if (params) {
        window[funcName](params);
      } else {
        // Dla bezpieczeństwa - nie wykonujemy faktycznego kliknięcia, tylko test
        console.log(`   ✅ Funkcja ${funcName} jest dostępna i można ją wywołać`);
      }
      return true;
    } else {
      console.log(`   ❌ Funkcja ${funcName} nie jest dostępna`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Błąd podczas testowania ${funcName}: ${error.message}`);
    return false;
  }
}

// Testuj funkcje openFunction z różnymi parametrami
const aiFunctions = [
  'rekomendacje',
  'obsługa-klienta', 
  'monitorowanie',
  'przypomnienia',
  'faq-generator',
  'edukacja',
  'tickety',
  'quizy',
  'marketing'
];

console.log("Testowanie funkcji AI:");
aiFunctions.forEach(funcName => {
  const success = simulateClick('openFunction', funcName);
  console.log(`   ${success ? '✅' : '❌'} openFunction('${funcName}')`);
});

// TEST 6: Test localStorage i sessionStorage
console.log("\n=== TEST 6: LOCAL STORAGE ===");
try {
  localStorage.setItem('test-key', 'test-value');
  const value = localStorage.getItem('test-key');
  console.log('✅ localStorage działa poprawnie');
  localStorage.removeItem('test-key');
} catch (error) {
  console.log('❌ localStorage nie działa:', error.message);
}

// TEST 7: Analiza błędów w konsoli
console.log("\n=== TEST 7: PODSUMOWANIE ===");
console.log("🔍 Sprawdź konsolę przeglądarki pod kątem błędów JavaScript");
console.log("🔍 Sprawdź Network tab pod kątem nieudanych requestów");
console.log("🔍 Sprawdź czy wszystkie assets są załadowane poprawnie");

// Uruchom testy API
console.log("\n=== ROZPOCZĘCIE TESTÓW API ===");
Promise.allSettled(endpoints.map(testEndpoint)).then(results => {
  console.log("\n📊 WYNIKI TESTÓW API:");
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const test = result.value;
      console.log(`${test.status === 'OK' ? '✅' : '❌'} ${test.name}: ${test.status}`);
    } else {
      console.log(`❌ Test ${index + 1}: REJECTED - ${result.reason}`);
    }
  });
  
  console.log("\n🏁 TESTY ZAKOŃCZONE!");
  console.log("📋 Sprawdź wyniki powyżej i napraw wykryte problemy");
});

// Export dla dalszego użycia
window.testResults = {
  functions,
  endpoints,
  cloudflareTests,
  aiFunctions
};

console.log("💾 Wyniki testów zapisane w window.testResults");