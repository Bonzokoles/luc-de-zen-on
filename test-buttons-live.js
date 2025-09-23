// LIVE BROWSER TEST - WYKRYCIE PROBLEMU Z PRZYCISKAMI
// Wklej ten kod w konsolę przeglądarki na https://29dcf914.luc-de-zen-on.pages.dev

console.log("🔍 DIAGNOZA PRZYCISKÓW - 21 września 2025");
console.log("===================================================");

// 1. Test podstawowy - czy funkcje są dostępne
console.log("\n1️⃣ SPRAWDŹ DOSTĘPNOŚĆ FUNKCJI:");
const functionsToTest = [
  'openFunction',
  'openImageGenerator', 
  'openChatbot',
  'openBigQuery',
  'openKaggle',
  'openTavily',
  'checkAllStatus',
  'runAllAPITests'
];

functionsToTest.forEach(funcName => {
  const exists = typeof window[funcName] === 'function';
  console.log(`${exists ? '✅' : '❌'} window.${funcName}: ${exists ? 'DOSTĘPNA' : 'BRAK'}`);
});

// 2. Test przycisków - znajdź wszystkie przyciski z onclick
console.log("\n2️⃣ ZNAJDŹ PRZYCISKI Z ONCLICK:");
const buttons = document.querySelectorAll('button[onclick], .ai-function-card[onclick], [onclick]');
console.log(`Znaleziono ${buttons.length} elementów z onclick`);

buttons.forEach((btn, i) => {
  const onclick = btn.getAttribute('onclick');
  const text = btn.textContent?.trim().substring(0, 30) || 'Bez tekstu';
  console.log(`${i+1}. "${text}" → ${onclick}`);
});

// 3. Test konkretnych przycisków AI Functions
console.log("\n3️⃣ TEST AI FUNCTION CARDS:");
const aiCards = document.querySelectorAll('.ai-function-card');
console.log(`Znaleziono ${aiCards.length} AI function cards`);

aiCards.forEach((card, i) => {
  const onclick = card.getAttribute('onclick');
  const title = card.querySelector('h3, .font-bold')?.textContent?.trim() || `Card ${i+1}`;
  console.log(`${i+1}. "${title}" → onclick: ${onclick}`);
  
  // Test czy kliknięcie działa
  if (onclick) {
    console.log(`   🎯 Próba wykonania: ${onclick}`);
    try {
      // Bezpieczny test - nie wykonujemy faktycznego kliknięcia
      const funcCall = onclick.match(/(\w+)\(/);
      if (funcCall && typeof window[funcCall[1]] === 'function') {
        console.log(`   ✅ Funkcja ${funcCall[1]} jest dostępna`);
      } else {
        console.log(`   ❌ Funkcja nie jest dostępna lub błędna składnia`);
      }
    } catch(e) {
      console.log(`   ❌ Błąd w onclick: ${e.message}`);
    }
  }
});

// 4. Test event listenerów
console.log("\n4️⃣ TEST EVENT LISTENERÓW:");
// Sprawdź czy przyciski mają event listenery
aiCards.forEach((card, i) => {
  const hasClick = card.onclick !== null;
  const hasEventListener = card.addEventListener !== undefined;
  console.log(`Card ${i+1}: onclick=${hasClick}, addEventListener dostępne=${hasEventListener}`);
});

// 5. Test konkretny - spróbuj kliknąć pierwszy przycisk AI
console.log("\n5️⃣ TEST KLIKNIĘCIA (PIERWSZY PRZYCISK AI):");
const firstAiCard = document.querySelector('.ai-function-card[onclick]');
if (firstAiCard) {
  const onclick = firstAiCard.getAttribute('onclick');
  console.log(`Pierwszy przycisk AI: ${onclick}`);
  
  // Symulacja kliknięcia - BEZ faktycznego wykonania
  console.log("🔍 Czy przycisk odpowiada na hover?");
  firstAiCard.addEventListener('mouseenter', () => {
    console.log("✅ Przycisk reaguje na hover");
  }, { once: true });
  
  console.log("🔍 Spróbuj kliknąć pierwszy przycisk AI ręcznie i sprawdź czy pojawi się komunikat...");
} else {
  console.log("❌ Nie znaleziono przycisków AI z onclick");
}

// 6. Test DOMContentLoaded
console.log("\n6️⃣ TEST DOM I JAVASCRIPT:");
console.log("Document ready state:", document.readyState);
console.log("Scripts załadowane:", document.scripts.length);

// 7. Test błędów JavaScript
console.log("\n7️⃣ SPRAWDŹ BŁĘDY W KONSOLI:");
console.log("Sprawdź konsolę przeglądarki pod kątem czerwonych błędów!");
console.log("Sprawdź Network tab pod kątem nieudanych requestów!");

// 8. Spróbuj manualnie wywołać openFunction
console.log("\n8️⃣ TEST MANUALNY OPENFUNCTION:");
if (typeof window.openFunction === 'function') {
  console.log("✅ openFunction jest dostępna, testuję...");
  try {
    // Bezpieczny test z console.log zamiast alert
    const originalConsoleLog = console.log;
    window.testOpenFunction = function(name) {
      console.log(`🎯 TEST: openFunction('${name}') została wywołana!`);
      return false; // Zapobiegaj rzeczywistemu przekierowaniu
    };
    console.log("Spróbuj w konsoli: testOpenFunction('rekomendacje')");
  } catch(e) {
    console.log("❌ Błąd podczas testowania openFunction:", e.message);
  }
} else {
  console.log("❌ openFunction nie jest dostępna");
}

console.log("\n🏁 DIAGNOZA ZAKOŃCZONA!");
console.log("======================");
console.log("NASTĘPNE KROKI:");
console.log("1. Sprawdź czerwone błędy w konsoli");
console.log("2. Sprawdź Network tab pod kątem 404/500"); 
console.log("3. Spróbuj kliknąć przyciski ręcznie");
console.log("4. Jeśli widzisz błędy, skopiuj je i prześlij do naprawy");