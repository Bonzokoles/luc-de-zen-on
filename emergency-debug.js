// EMERGENCY DEBUG - sprawdź czy eksporty zadziałały
console.log("🚨 EMERGENCY DEBUG - Sprawdzam eksporty Voice Functions");

// 1. Sprawdź czy funkcje są w window
console.log("\n1️⃣ SPRAWDZAM GLOBALNE FUNKCJE:");
const functionsToCheck = [
  "startGeminiVisionVoice",
  "stopGeminiVisionVoice", 
  "toggleGeminiVisionVoice",
  "startGeminiProVoice",
  "startCodeBisonVoice",
  "startTextBisonVoice"
];

functionsToCheck.forEach(fn => {
  const exists = typeof window[fn] === 'function';
  console.log(`${fn}: ${exists ? "✅ DOSTĘPNA" : "❌ BRAK"}`);
  if (!exists && typeof eval(`typeof ${fn}`) !== 'undefined') {
    console.log(`  → Funkcja istnieje lokalnie ale nie w window`);
  }
});

// 2. Sprawdź czy można wykonać funkcję
console.log("\n2️⃣ TEST WYKONANIA:");
if (typeof window.startGeminiVisionVoice === 'function') {
  console.log("✅ startGeminiVisionVoice jest dostępna globalnie");
} else {
  console.log("❌ startGeminiVisionVoice NIE JEST dostępna globalnie");
  
  // Sprawdź czy istnieje w scope
  try {
    if (typeof startGeminiVisionVoice !== 'undefined') {
      console.log("⚠️ Funkcja istnieje w local scope - problem z eksportem");
      window.startGeminiVisionVoice = startGeminiVisionVoice;
      console.log("🔧 Próba ręcznego eksportu...");
    }
  } catch (e) {
    console.log("❌ Funkcja nie istnieje wcale:", e.message);
  }
}

// 3. Sprawdź czy przycisk istnieje
console.log("\n3️⃣ SPRAWDZAM PRZYCISK:");
const visionButtons = document.querySelectorAll('[onclick*="startGeminiVisionVoice"]');
console.log(`Znalezione przyciski Vision Voice: ${visionButtons.length}`);

visionButtons.forEach((btn, i) => {
  console.log(`Przycisk ${i+1}:`, btn.onclick || btn.getAttribute('onclick'));
});

// 4. Sprawdź wszystkie funkcje Voice w kodzie źródłowym
console.log("\n4️⃣ LISTA WSZYSTKICH FUNKCJI VOICE W WINDOW:");
Object.keys(window).filter(key => key.includes('Voice')).forEach(key => {
  console.log(`window.${key}: ${typeof window[key]}`);
});

console.log("\n🎯 DIAGNOZA:");
console.log("- Sprawdź wyniki powyżej");
console.log("- Jeśli funkcje BRAK → eksport nie zadziałał");
console.log("- Jeśli funkcje OK → problem z innerHTML/DOM");

// 5. Stwórz funkcję awaryjną
console.log("\n🔧 TWORZĘ AWARYJNĄ FUNKCJĘ:");
if (typeof window.startGeminiVisionVoice !== 'function') {
  window.startGeminiVisionVoice = function() {
    console.log("🚨 AWARYJNA FUNKCJA startGeminiVisionVoice");
    alert("Funkcja Voice tymczasowo niedostępna - trwa naprawa");
  };
  console.log("✅ Awaryjna funkcja utworzona");
}

// 6. Test awaryjny kliknięcia
setTimeout(() => {
  console.log("\n6️⃣ TEST AWARYJNEGO KLIKNIĘCIA:");
  const btn = document.querySelector('[onclick*="startGeminiVisionVoice"]');
  if (btn) {
    try {
      btn.click();
      console.log("✅ Kliknięcie wykonane bez błędu");
    } catch (e) {
      console.log("❌ Błąd kliknięcia:", e.message);
    }
  }
}, 1000);