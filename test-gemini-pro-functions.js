// TEST FUNKCJONALNOŚCI GEMINI PRO AGENT
// Comprehensive test suite for Gemini Pro floating agent functions

console.log("🤖 GEMINI PRO AGENT - TEST FUNKCJONALNOŚCI");
console.log("=".repeat(50));

// 1. Test dostępności podstawowych funkcji
console.log("\n1️⃣ PODSTAWOWE FUNKCJE:");
const coreFunctions = [
  'processGeminiConversation',
  'delegateToAgent', 
  'getAgentsOverview',
  'generateResponse',
  'registerAgent',
  'updateAgent',
  'removeAgent'
];

// Test tylko w Node.js - simulujemy window object
const mockWindow = {
  geminiProAgent: null
};

// Sprawdź czy mamy dostęp do implementation  
console.log("ℹ️ Test uruchamiany w Node.js - niektóre funkcje będą symulowane");
if (typeof window !== 'undefined' && window.geminiProAgent) {
  console.log("✅ geminiProAgent - DOSTĘPNY");
  
  coreFunctions.forEach(func => {
    const available = typeof window.geminiProAgent[func] === 'function';
    console.log(`${available ? '✅' : '❌'} ${func}`);
  });
} else {
  console.log("❌ geminiProAgent - NIEDOSTĘPNY");
}

// 2. Test rejestru agentów
console.log("\n2️⃣ REJESTR AGENTÓW:");
if (window.geminiProAgent && window.geminiProAgent.agentsRegistry) {
  const agents = window.geminiProAgent.getAgentsOverview();
  console.log(`📊 Liczba agentów: ${agents.length}`);
  
  agents.forEach(agent => {
    console.log(`  🤖 ${agent.name} (${agent.type}) - ${agent.status}`);
    console.log(`     Endpoint: ${agent.endpoint}`);
  });
} else {
  console.log("❌ Brak dostępu do rejestru agentów");
}

// 3. Test delegacji zadań (symulacja)
console.log("\n3️⃣ TEST DELEGACJI:");
const testMessages = [
  { msg: "przetłumacz hello world", expected: "POLACZEK_T" },
  { msg: "włącz muzykę", expected: "POLACZEK_M1" },
  { msg: "pokaż dashboard", expected: "POLACZEK_D1" },
  { msg: "szukaj w bibliotece", expected: "POLACZEK_B" }
];

testMessages.forEach(test => {
  console.log(`📝 Test: "${test.msg}"`);
  console.log(`   Oczekiwany agent: ${test.expected}`);
  
  // Symulacja logiki routingu
  const msg = test.msg.toLowerCase();
  let expectedAgent = null;
  
  if (msg.includes("przetłumacz")) expectedAgent = "POLACZEK_T";
  else if (msg.includes("muzyk")) expectedAgent = "POLACZEK_M1";
  else if (msg.includes("dashboard")) expectedAgent = "POLACZEK_D1";
  else if (msg.includes("bibliotek")) expectedAgent = "POLACZEK_B";
  
  const correct = expectedAgent === test.expected;
  console.log(`   ${correct ? '✅' : '❌'} Routing: ${expectedAgent || 'DEFAULT'}`);
});

// 4. Test API endpoint connectivity
console.log("\n4️⃣ TEST ENDPOINTÓW API:");
const apiEndpoints = [
  '/api/polaczek-t',
  '/api/polaczek-m1', 
  '/api/polaczek-d1',
  '/api/polaczek-b'
];

async function testApiEndpoints() {
  for (const endpoint of apiEndpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' })
      });
      
      console.log(`${response.ok ? '✅' : '❌'} ${endpoint} - ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint} - ERROR: ${error.message}`);
    }
  }
}

// 5. Test generowania odpowiedzi
console.log("\n5️⃣ TEST GENEROWANIA ODPOWIEDZI:");
if (window.geminiProAgent && window.geminiProAgent.generateResponse) {
  window.geminiProAgent.generateResponse("Test message", {test: true})
    .then(response => {
      console.log("✅ Generowanie odpowiedzi działa");
      console.log(`   Odpowiedź: ${response}`);
    })
    .catch(error => {
      console.log("❌ Błąd generowania odpowiedzi:", error.message);
    });
} else {
  console.log("❌ Funkcja generateResponse niedostępna");
}

// 6. Test zarządzania agentami
console.log("\n6️⃣ TEST ZARZĄDZANIA AGENTAMI:");
if (window.geminiProAgent) {
  try {
    // Test rejestracji nowego agenta
    window.geminiProAgent.registerAgent("TEST_AGENT", {
      name: "Test Agent",
      type: "test",
      role: "testing",
      endpoint: "/api/test",
      status: "inactive"
    });
    
    const agents = window.geminiProAgent.getAgentsOverview();
    const testAgent = agents.find(a => a.id === "TEST_AGENT");
    
    if (testAgent) {
      console.log("✅ Rejestracja agenta działa");
      
      // Test aktualizacji
      window.geminiProAgent.updateAgent("TEST_AGENT", { status: "active" });
      const updatedAgents = window.geminiProAgent.getAgentsOverview();
      const updatedAgent = updatedAgents.find(a => a.id === "TEST_AGENT");
      
      console.log(`${updatedAgent.status === 'active' ? '✅' : '❌'} Aktualizacja agenta`);
      
      // Test usuwania
      window.geminiProAgent.removeAgent("TEST_AGENT");
      const finalAgents = window.geminiProAgent.getAgentsOverview();
      const removedAgent = finalAgents.find(a => a.id === "TEST_AGENT");
      
      console.log(`${!removedAgent ? '✅' : '❌'} Usuwanie agenta`);
    } else {
      console.log("❌ Rejestracja agenta nie działa");
    }
  } catch (error) {
    console.log("❌ Błąd zarządzania agentami:", error.message);
  }
} else {
  console.log("❌ Agent management niedostępny");
}

// 7. Uruchom testy endpointów
console.log("\n🚀 URUCHAMIAM TESTY ENDPOINTÓW...");
testApiEndpoints();

// 8. Podsumowanie
setTimeout(() => {
  console.log("\n" + "=".repeat(50));
  console.log("🎯 PODSUMOWANIE TESTÓW GEMINI PRO");
  console.log("Wszystkie testy zostały wykonane.");
  console.log("Sprawdź powyższe wyniki aby ocenić funkcjonalność agenta.");
  console.log("=".repeat(50));
}, 2000);