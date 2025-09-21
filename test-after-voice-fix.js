// TEST PRZYCISKÓW PO NAPRAWIE VOICE FUNCTIONS
// Wklej ten kod w konsoli przeglądarki na https://luc-de-zen-on.pages.dev

console.log("🎤 TEST PO NAPRAWIE VOICE FUNCTIONS");
console.log("⏰", new Date().toLocaleString());
console.log("🌐 URL:", window.location.href);

function testButtonsAfterVoiceFix() {
  console.log("\n🔍 TESTOWANIE PRZYCISKÓW 2-5 PO NAPRAWIE VOICE...");
  
  const buttons = [
    { 
      id: "geminiProBtn", 
      name: "Gemini Pro", 
      widgetId: "geminiProWidget", 
      toggle: "toggleGeminiPro",
      voiceFunctions: ["startGeminiProVoice", "stopGeminiProVoice", "toggleGeminiProVoice"]
    },
    { 
      id: "codeBisonBtn", 
      name: "Code Bison", 
      widgetId: "codeBisonWidget", 
      toggle: "toggleCodeBison",
      voiceFunctions: ["startCodeBisonVoice", "stopCodeBisonVoice", "toggleCodeBisonVoice"]
    },
    { 
      id: "textBisonBtn", 
      name: "Text Bison", 
      widgetId: "textBisonWidget", 
      toggle: "toggleTextBison",
      voiceFunctions: ["startTextBisonVoice", "stopTextBisonVoice", "toggleTextBisonVoice"]
    },
    { 
      id: "googleBardBtn", 
      name: "Google Bard", 
      widgetId: "googleBardWidget", 
      toggle: "toggleGoogleBard",
      voiceFunctions: ["startGoogleBardVoice", "stopGoogleBardVoice", "toggleGoogleBardVoice"] // Te są zmapowane na startBardVoice etc.
    }
  ];

  let totalTests = 0;
  let passedTests = 0;

  buttons.forEach((button, index) => {
    console.log(`\n${"=".repeat(15)} PRZYCISK ${index + 2}: ${button.name} ${"=".repeat(15)}`);
    
    // Test 1: DOM Elements
    const btn = document.getElementById(button.id);
    const widget = document.getElementById(button.widgetId);
    
    totalTests += 2;
    console.log(`📍 DOM Test:`);
    if (btn) {
      console.log(`   ✅ Przycisk ${button.id} - ISTNIEJE`);
      passedTests++;
    } else {
      console.log(`   ❌ Przycisk ${button.id} - BRAK`);
    }
    
    if (widget) {
      console.log(`   ✅ Widget ${button.widgetId} - ISTNIEJE`);
      passedTests++;
    } else {
      console.log(`   ❌ Widget ${button.widgetId} - BRAK`);
    }
    
    if (!btn) return;
    
    // Test 2: Toggle Functions
    totalTests++;
    const toggleFunc = window[button.toggle];
    console.log(`\n🔧 Toggle Function Test:`);
    if (typeof toggleFunc === 'function') {
      console.log(`   ✅ ${button.toggle} - DOSTĘPNA`);
      passedTests++;
    } else {
      console.log(`   ❌ ${button.toggle} - NIEDOSTĘPNA`);
    }
    
    // Test 3: Voice Functions
    console.log(`\n🎤 Voice Functions Test:`);
    button.voiceFunctions.forEach(funcName => {
      totalTests++;
      if (typeof window[funcName] === 'function') {
        console.log(`   ✅ ${funcName} - DOSTĘPNA`);
        passedTests++;
      } else {
        console.log(`   ❌ ${funcName} - NIEDOSTĘPNA`);
      }
    });
    
    // Test 4: Button Click (actual functionality)
    if (typeof toggleFunc === 'function' && widget) {
      console.log(`\n🖱️ Click Test:`);
      totalTests++;
      
      try {
        const hiddenBefore = widget.classList.contains("hidden");
        console.log(`   Widget przed kliknięciem: ${hiddenBefore ? "UKRYTY" : "WIDOCZNY"}`);
        
        // Kliknij przycisk
        btn.click();
        
        // Sprawdź po małej pauzie
        setTimeout(() => {
          const hiddenAfter = widget.classList.contains("hidden");
          console.log(`   Widget po kliknięciu: ${hiddenAfter ? "UKRYTY" : "WIDOCZNY"}`);
          
          const clickWorks = hiddenBefore !== hiddenAfter;
          if (clickWorks) {
            console.log(`   ✅ KLIKNIĘCIE DZIAŁA - widget zmienił stan`);
            passedTests++;
            
            // Przywróć stan
            if (!hiddenBefore) {
              btn.click();
            }
          } else {
            console.log(`   ❌ KLIKNIĘCIE NIE DZIAŁA - widget nie zmienił stanu`);
          }
        }, 150);
        
      } catch (error) {
        console.log(`   ❌ BŁĄD przy kliknięciu:`, error.message);
      }
    }
    
    // Test 5: Voice Button Click (if voice buttons exist)
    setTimeout(() => {
      const voiceStartBtn = document.querySelector(`#${button.widgetId} [onclick*="start${button.name.replace(/\s/g, '')}Voice"]`);
      if (voiceStartBtn) {
        console.log(`\n🎤 Voice Button Test dla ${button.name}:`);
        totalTests++;
        
        try {
          console.log(`   Testuję kliknięcie voice button...`);
          voiceStartBtn.click();
          console.log(`   ✅ Voice button kliknięty bez błędu`);
          passedTests++;
        } catch (error) {
          console.log(`   ❌ Voice button błąd:`, error.message);
        }
      }
    }, 300 + (index * 100));
  });
  
  // Podsumowanie końcowe
  setTimeout(() => {
    console.log(`\n${"=".repeat(50)}`);
    console.log("🏁 PODSUMOWANIE TESTÓW PO NAPRAWIE VOICE");
    console.log(`${"=".repeat(50)}`);
    console.log(`📊 Wyniki: ${passedTests}/${totalTests} testów zaliczonych`);
    console.log(`📈 Procent sukcesu: ${Math.round((passedTests/totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
      console.log(`🎉 PERFEKCYJNY WYNIK! Wszystkie testy zaliczone!`);
    } else if (passedTests > totalTests * 0.8) {
      console.log(`✅ BARDZO DOBRY WYNIK! Większość funkcji działa poprawnie.`);
    } else if (passedTests > totalTests * 0.5) {
      console.log(`⚠️ PRZECIĘTNY WYNIK - niektóre funkcje wymagają naprawy.`);
    } else {
      console.log(`❌ SŁABY WYNIK - większość funkcji wymaga naprawy.`);
    }
    
    console.log(`\n🔧 STATUS INDIVIDUAL BUTTONS:`);
    buttons.forEach((button, i) => {
      const btn = document.getElementById(button.id);
      const widget = document.getElementById(button.widgetId);
      const toggle = window[button.toggle];
      const voiceOK = button.voiceFunctions.every(fn => typeof window[fn] === 'function');
      
      console.log(`${i+2}. ${button.name}:`);
      console.log(`   DOM: ${btn && widget ? "✅" : "❌"} | Toggle: ${toggle ? "✅" : "❌"} | Voice: ${voiceOK ? "✅" : "❌"}`);
    });
    
    console.log(`\n🚀 NASTĘPNE KROKI:`);
    console.log(`1. Jeśli wszystkie testy zaliczone - system działa!`);
    console.log(`2. Jeśli są błędy Voice - sprawdź console.log dla szczegółów`);
    console.log(`3. Jeśli przyciski nie reagują - problem może być w CSS/HTML`);
    console.log(`4. Spróbuj ręcznie kliknąć przyciski 2-5 na stronie`);
    
  }, 2000);
}

// Funkcja pomocnicza - szybki test dostępności funkcji
function quickVoiceTest() {
  console.log("⚡ QUICK VOICE TEST:");
  
  const voiceFunctions = [
    "startGeminiProVoice", "stopGeminiProVoice", "toggleGeminiProVoice",
    "startCodeBisonVoice", "stopCodeBisonVoice", "toggleCodeBisonVoice", 
    "startTextBisonVoice", "stopTextBisonVoice", "toggleTextBisonVoice",
    "startGoogleBardVoice", "stopGoogleBardVoice", "toggleGoogleBardVoice"
  ];
  
  voiceFunctions.forEach(fn => {
    const available = typeof window[fn] === 'function';
    console.log(`${fn}: ${available ? "✅" : "❌"}`);
  });
}

// URUCHOM TEST
console.log("🎬 Uruchamiam test po naprawie Voice Functions...");
testButtonsAfterVoiceFix();

console.log("\n💡 DOSTĘPNE FUNKCJE:");
console.log("- testButtonsAfterVoiceFix() - pełny test po naprawie");
console.log("- quickVoiceTest() - szybki test funkcji voice");

// Auto quick test
setTimeout(() => {
  console.log("\n" + "=".repeat(30));
  quickVoiceTest();
}, 3000);