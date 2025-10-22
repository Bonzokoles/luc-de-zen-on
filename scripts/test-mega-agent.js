#!/usr/bin/env node
/**
 * Test Script dla Mega Agent Orchestrator
 * Bielik 11B v2.6 jako główny koordynator
 */

const testCases = [
  {
    name: "🎯 Proste zadanie językowe",
    task: "Przetłumacz na angielski: 'Dzień dobry, jak się masz?'",
    priority: "balanced",
    expectedAgents: ["gemma-3-12b", "claude-sonnet-4.5"],
    context: "Zadanie tłumaczenia"
  },
  {
    name: "🧮 Zadanie programistyczne", 
    task: "Napisz funkcję JavaScript do sortowania tablicy obiektów po dacie",
    priority: "quality",
    expectedAgents: ["deepseek-coder", "gpt-4"],
    context: "Programowanie JavaScript"
  },
  {
    name: "🎵 Kompleksowe zadanie multimodalne",
    task: "Znajdź podobną muzykę do Beethovena, przetłumacz tekst na polski i napisz kod do odtwarzania",
    priority: "comprehensive", 
    expectedAgents: ["claude-sonnet-4.5", "deepseek-coder", "gemma-3-12b"],
    requireSpecialist: true,
    maxAgents: 4,
    context: "Muzyka + Programowanie + Tłumaczenie"
  },
  {
    name: "⚡ Zadanie wysokiej priorytetu",
    task: "PILNE: Sprawdź status systemu i wygeneruj raport bezpieczeństwa",
    priority: "speed",
    expectedAgents: ["bielik-guard", "polaczek-agent"], 
    context: "Bezpieczeństwo systemu"
  }
];

async function testMegaAgent() {
  console.log('🚀 Rozpoczynam testy Mega Agent Orchestrator...\n');
  
  const results = [];
  
  for (const testCase of testCases) {
    console.log(`\n📋 Test: ${testCase.name}`);
    console.log(`📝 Zadanie: ${testCase.task.substring(0, 60)}...`);
    console.log(`⚖️ Priorytet: ${testCase.priority}`);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch('http://localhost:4321/api/mega-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: testCase.task,
          priority: testCase.priority,
          context: testCase.context,
          requireSpecialist: testCase.requireSpecialist,
          maxAgents: testCase.maxAgents || 3,
          userId: 'test-user-123',
          sessionId: `test-session-${Date.now()}`
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      const duration = Date.now() - startTime;
      
      console.log(`✅ Odpowiedź otrzymana w ${duration}ms`);
      console.log(`🧠 Orchestrator: ${result.orchestrator}`);
      console.log(`🎯 Wybrane agenty: ${result.orchestratorDecision.selectedAgents.join(', ')}`);
      console.log(`📊 Strategia: ${result.orchestratorDecision.strategy}`);
      console.log(`💎 Pewność: ${result.confidence}%`);
      console.log(`💰 Koszt: $${result.totalCost}`);
      
      // Sprawdź czy wybrane agenty są zgodne z oczekiwaniami
      const expectedMatch = testCase.expectedAgents.some(agent => 
        result.orchestratorDecision.selectedAgents.includes(agent)
      );
      
      if (expectedMatch) {
        console.log(`✅ Agenty zgodne z oczekiwaniami`);
      } else {
        console.log(`⚠️ Nieoczekiwane agenty - sprawdź logikę Bielika`);
      }
      
      results.push({
        test: testCase.name,
        success: true,
        duration,
        agents: result.orchestratorDecision.selectedAgents,
        confidence: result.confidence,
        cost: result.totalCost
      });
      
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
      results.push({
        test: testCase.name,
        success: false,
        error: error.message
      });
    }
    
    console.log(`${'='.repeat(60)}`);
  }
  
  // Podsumowanie wyników
  console.log(`\n📊 PODSUMOWANIE TESTÓW`);
  console.log(`${'='.repeat(60)}`);
  
  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;
  
  console.log(`✅ Udane: ${successful}/${results.length}`);
  console.log(`❌ Nieudane: ${failed}/${results.length}`);
  
  if (successful > 0) {
    const avgDuration = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + r.duration, 0) / successful;
    
    const totalCost = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + r.cost, 0);
    
    const avgConfidence = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + r.confidence, 0) / successful;
    
    console.log(`⏱️ Średni czas: ${Math.round(avgDuration)}ms`);
    console.log(`💰 Łączny koszt: $${totalCost.toFixed(4)}`);
    console.log(`💎 Średnia pewność: ${Math.round(avgConfidence)}%`);
  }
  
  console.log(`\n🎯 Orchestrator Bielik 11B v2.6 ${successful === results.length ? 'PRZESZEDŁ' : 'CZĘŚCIOWO PRZESZEDŁ'} wszystkie testy!`);
}

// Uruchom testy
if (require.main === module) {
  testMegaAgent().catch(console.error);
}

module.exports = { testMegaAgent };