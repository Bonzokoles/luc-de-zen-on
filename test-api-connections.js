// ANALIZA POŁĄCZEŃ API - CLOUDFLARE vs GOOGLE
// 21 września 2025 - Sprawdzenie konfiguracji agentów

console.log("🔍 ANALIZA POŁĄCZEŃ API AGENTÓW");
console.log("===============================");

const apiEndpoints = {
  // CLOUDFLARE WORKERS AI - tylko POLACZEK
  cloudflare: {
    polaczekChat: {
      url: '/api/polaczek-chat',
      description: 'POLACZEK AI Assistant - polski agent z Cloudflare AI',
      model: '@cf/google/gemma-7b-it, @cf/qwen/qwen2.5-7b-instruct',
      status: 'POPRAWNE - używa Cloudflare AI'
    }
  },
  
  // GOOGLE SERVICES - wszystkie pozostałe powinny używać Google
  google: {
    chat: {
      url: '/api/chat',
      description: 'Główny chat API - POWINIEN używać Google AI nie Cloudflare',
      currentModel: '@cf/google/gemma-3-12b-it (BŁĄD!)',
      shouldUse: 'Google AI API / Vertex AI',
      status: 'BŁĄD - używa Cloudflare zamiast Google'
    },
    imageGenerator: {
      url: '/api/generate-image',
      description: 'Generator obrazów - POWINIEN używać Google nie Cloudflare',
      currentModel: 'Cloudflare AI (BŁĄD!)',
      shouldUse: 'Google Imagen API',
      status: 'BŁĄD - używa Cloudflare zamiast Google'
    },
    bigQuery: {
      url: '/api/bigquery',
      description: 'Google BigQuery Analytics - POPRAWNIE używa Google',
      currentModel: 'Google Cloud BigQuery',
      status: 'POPRAWNE - używa Google Cloud'
    },
    kaggle: {
      url: '/api/kaggle',
      description: 'Kaggle Datasets - używa Kaggle API (nie Google/CF)',
      currentModel: 'Kaggle API',
      status: 'NEUTRALNE - używa zewnętrznego API'
    },
    tavily: {
      url: '/api/tavi',
      description: 'Tavily Search - używa Tavily API (nie Google/CF)', 
      currentModel: 'Tavily API',
      status: 'NEUTRALNE - używa zewnętrznego API'
    }
  }
};

console.log("\n📊 SZCZEGÓŁOWA ANALIZA:");
console.log("======================");

console.log("\n✅ CLOUDFLARE - TYLKO POLACZEK (POPRAWNE):");
Object.entries(apiEndpoints.cloudflare).forEach(([key, api]) => {
  console.log(`✅ ${key}: ${api.description}`);
  console.log(`   URL: ${api.url}`);
  console.log(`   Model: ${api.model}`);
  console.log(`   Status: ${api.status}\n`);
});

console.log("\n🔍 GOOGLE SERVICES - WYMAGAJĄ KOREKCJI:");
Object.entries(apiEndpoints.google).forEach(([key, api]) => {
  const icon = api.status.includes('BŁĄD') ? '❌' : 
               api.status.includes('POPRAWNE') ? '✅' : '⚠️';
  console.log(`${icon} ${key}: ${api.description}`);
  console.log(`   URL: ${api.url}`);
  if (api.currentModel) console.log(`   Aktualnie: ${api.currentModel}`);
  if (api.shouldUse) console.log(`   Powinien: ${api.shouldUse}`);
  console.log(`   Status: ${api.status}\n`);
});

// TEST PRZYCISKÓW NA STRONIE
console.log("\n🎯 TEST PRZYCISKÓW - SPRAWDŹ REAKCJE:");
console.log("=====================================");

const buttonsToTest = [
  { name: 'POLACZEK Agent', selector: 'button[onclick*="POLACZEK"]', expected: 'Cloudflare ✅' },
  { name: 'Chat API', selector: 'button[onclick*="openChatbot"]', expected: 'POWINIEN: Google ❌' },
  { name: 'Image Generator', selector: 'button[onclick*="openImageGenerator"]', expected: 'POWINIEN: Google ❌' },
  { name: 'BigQuery', selector: 'button[onclick*="openBigQuery"]', expected: 'Google ✅' },
  { name: 'Kaggle', selector: 'button[onclick*="openKaggle"]', expected: 'Kaggle API ⚠️' },
  { name: 'Tavily', selector: 'button[onclick*="openTavily"]', expected: 'Tavily API ⚠️' }
];

buttonsToTest.forEach(btn => {
  const element = document.querySelector(btn.selector);
  const exists = element !== null;
  console.log(`${exists ? '✅' : '❌'} ${btn.name}: ${exists ? 'Znaleziony' : 'Nie znaleziony'}`);
  if (exists) {
    console.log(`   Onclick: ${element.getAttribute('onclick')}`);
    console.log(`   Konfiguracja: ${btn.expected}`);
  }
  console.log('');
});

// ZALECENIA NAPRAW
console.log("\n🔧 ZALECANE NAPRAWY:");
console.log("===================");
console.log("1. ❌ /api/chat.ts - zmień z Cloudflare AI na Google AI/Vertex AI");
console.log("2. ❌ /api/generate-image.ts - zmień z Cloudflare AI na Google Imagen API");  
console.log("3. ✅ /api/polaczek-chat.ts - zostaw Cloudflare AI (POPRAWNE)");
console.log("4. ✅ /api/bigquery.ts - zostaw Google Cloud (POPRAWNE)");
console.log("5. ⚠️  /api/kaggle.ts i /api/tavi.ts - zewnętrzne API (OK)");

console.log("\n📋 NASTĘPNE KROKI:");
console.log("=================");
console.log("1. Sprawdź czy przyciski reagują na kliknięcie");
console.log("2. Jeśli nie reagują - problem z JavaScript, nie z API");
console.log("3. Jeśli reagują ale API nie działają - problem z konfiguracją modeli");
console.log("4. Popraw /api/chat.ts aby używał Google AI zamiast Cloudflare");
console.log("5. Popraw /api/generate-image.ts aby używał Google Imagen zamiast Cloudflare");

// TEST MANUAL PRZYCISKÓW
console.log("\n🧪 TEST MANUAL - KLIKNIJ KAŻDY PRZYCISK:");
console.log("======================================");
buttonsToTest.forEach((btn, i) => {
  console.log(`${i+1}. Kliknij "${btn.name}" i sprawdź czy działa`);
});

console.log("\n🔍 Jeśli przyciski nie reagują - problem z JavaScript");
console.log("🔍 Jeśli reagują ale zwracają błędy - problem z konfiguracją API");