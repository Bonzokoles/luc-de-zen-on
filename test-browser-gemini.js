// TEST GEMINI PRO W PRZEGLĄDARCE
// Wklej ten kod do konsoli przeglądarki na localhost:4321

console.log("🤖 GEMINI PRO - TEST W PRZEGLĄDARCE");
console.log("=".repeat(50));

// 1. Test dostępności agenta
console.log("\n1️⃣ DOSTĘPNOŚĆ AGENTA:");
console.log("window.geminiProAgent:", typeof window.geminiProAgent);

if (window.geminiProAgent) {
  console.log("✅ geminiProAgent jest dostępny");
  
  // 2. Test metod agenta
  console.log("\n2️⃣ METODY AGENTA:");
  const methods = [
    'processGeminiConversation',
    'delegateToAgent',
    'getAgentsOverview',
    'generateResponse',
    'registerAgent',
    'updateAgent',
    'removeAgent'
  ];
  
  methods.forEach(method => {
    const available = typeof window.geminiProAgent[method] === 'function';
    console.log(`${available ? '✅' : '❌'} ${method}`);
  });
  
  // 3. Test rejestru agentów
  console.log("\n3️⃣ REJESTR AGENTÓW:");
  try {
    const agents = window.geminiProAgent.getAgentsOverview();
    console.log(`📊 Liczba agentów: ${agents.length}`);
    agents.forEach(agent => {
      console.log(`🤖 ${agent.name} (${agent.type}) - ${agent.status}`);
    });
  } catch (error) {
    console.log("❌ Błąd pobierania agentów:", error.message);
  }
  
  // 4. Test generowania odpowiedzi
  console.log("\n4️⃣ TEST GENEROWANIA ODPOWIEDZI:");
  window.geminiProAgent.generateResponse("Test message", {test: true})
    .then(response => {
      console.log("✅ Odpowiedź:", response);
    })
    .catch(error => {
      console.log("❌ Błąd:", error.message);
    });
    
  // 5. Test routingu wiadomości
  console.log("\n5️⃣ TEST ROUTINGU:");
  const testMessages = [
    "przetłumacz hello world",
    "włącz muzykę", 
    "pokaż dashboard",
    "szukaj w bibliotece"
  ];
  
  testMessages.forEach(msg => {
    console.log(`📝 Test: "${msg}"`);
    window.geminiProAgent.processGeminiConversation(msg, {test: true})
      .then(result => {
        console.log(`   ✅ Wynik: ${JSON.stringify(result).substring(0, 100)}...`);
      })
      .catch(error => {
        console.log(`   ❌ Błąd: ${error.message}`);
      });
  });
  
} else {
  console.log("❌ geminiProAgent nie jest dostępny");
  console.log("Sprawdź czy agents-bundle.js został załadowany");
}

// 6. Test agents-bundle
console.log("\n6️⃣ AGENTS BUNDLE:");
console.log("window.BaseAgent:", typeof window.BaseAgent);
console.log("window.GeminiProAgent:", typeof window.GeminiProAgent);

// 7. Test elementów DOM
console.log("\n7️⃣ ELEMENTY DOM:");
const geminiElements = [
  'geminiProBtn',
  'geminiProWidget', 
  'geminiProInput',
  'geminiProOutput'
];

geminiElements.forEach(id => {
  const element = document.getElementById(id);
  console.log(`${element ? '✅' : '❌'} #${id}`);
});

console.log("\n" + "=".repeat(50));
console.log("🎯 Test zakończony - sprawdź wyniki powyżej");
console.log("=".repeat(50));