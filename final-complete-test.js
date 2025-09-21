// FINAL TEST - KOMPLETNA NAPRAWA PRZYCISKÓW 2-5
// Wklej ten kod w konsoli przeglądarki na https://luc-de-zen-on.pages.dev

console.log("🎯 FINAL TEST - KOMPLETNA NAPRAWA PRZYCISKÓW 2-5");
console.log("⏰", new Date().toLocaleString());
console.log("🌐 URL:", window.location.href);
console.log("🎤 AudioContext + Voice Functions + Button Functions");

function finalCompleteTest() {
  console.log("\n" + "=".repeat(60));
  console.log("🏁 FINAL TEST WSZYSTKICH NAPRAW");
  console.log("=".repeat(60));
  
  // TEST 1: AudioContext (czy błąd zniknął)
  console.log("\n1️⃣ TEST AUDIOCONTEXT:");
  try {
    const ctx = new AudioContext();
    console.log("✅ AudioContext można utworzyć bez błędu");
    console.log("   Stan:", ctx.state);
    console.log("   Sample rate:", ctx.sampleRate);
    ctx.close();
  } catch (e) {
    console.log("❌ AudioContext błąd:", e.message);
  }
  
  // TEST 2: Voice Functions (czy są dostępne globalnie)
  console.log("\n2️⃣ TEST VOICE FUNCTIONS:");
  const allVoiceFunctions = [
    // Gemini Pro
    "startGeminiProVoice", "stopGeminiProVoice", "toggleGeminiProVoice",
    // Gemini Vision  
    "startGeminiVisionVoice", "stopGeminiVisionVoice", "toggleGeminiVisionVoice",
    // Code Bison
    "startCodeBisonVoice", "stopCodeBisonVoice", "toggleCodeBisonVoice",
    // Text Bison
    "startTextBisonVoice", "stopTextBisonVoice", "toggleTextBisonVoice",
    // Bard
    "startBardVoice", "stopBardVoice", "toggleBardVoice",
    // PaLM
    "startPaLMVoice", "stopPaLMVoice", "togglePaLMVoice",
    // Vertex
    "startVertexVoice", "stopVertexVoice", "toggleVertexVoice",
    // AI Studio
    "startAIStudioVoice", "stopAIStudioVoice", "toggleAIStudioVoice"
  ];
  
  let voiceAvailable = 0;
  allVoiceFunctions.forEach(fn => {
    if (typeof window[fn] === 'function') {
      console.log(`   ✅ ${fn}`);
      voiceAvailable++;
    } else {
      console.log(`   ❌ ${fn}`);
    }
  });
  
  console.log(`📊 Voice Functions: ${voiceAvailable}/${allVoiceFunctions.length} dostępne`);
  
  // TEST 3: Floating Buttons (główny cel)
  console.log("\n3️⃣ TEST FLOATING BUTTONS 2-5:");
  const targetButtons = [
    { id: "geminiProBtn", name: "Gemini Pro", widgetId: "geminiProWidget", number: 2 },
    { id: "codeBisonBtn", name: "Code Bison", widgetId: "codeBisonWidget", number: 3 },
    { id: "textBisonBtn", name: "Text Bison", widgetId: "textBisonWidget", number: 4 },
    { id: "googleBardBtn", name: "Google Bard", widgetId: "googleBardWidget", number: 5 }
  ];
  
  let workingButtons = 0;
  let totalButtonTests = 0;
  
  targetButtons.forEach((button, index) => {
    console.log(`\n--- PRZYCISK ${button.number}: ${button.name} ---`);
    
    const btn = document.getElementById(button.id);
    const widget = document.getElementById(button.widgetId);
    
    // Test istnienia
    totalButtonTests++;
    if (btn && widget) {
      console.log(`✅ DOM elementy istnieją`);
      
      // Test widoczności
      const rect = btn.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      console.log(`   Widoczny: ${isVisible ? "✅" : "❌"}`);
      
      if (isVisible) {
        // Test kliknięcia
        console.log(`   🖱️ TESTUJE KLIKNIĘCIE...`);
        
        try {
          const hiddenBefore = widget.classList.contains("hidden");
          console.log(`   Widget przed: ${hiddenBefore ? "UKRYTY" : "WIDOCZNY"}`);
          
          // Kliknij
          btn.click();
          
          // Sprawdź po pauzie
          setTimeout(() => {
            const hiddenAfter = widget.classList.contains("hidden");
            console.log(`   Widget po: ${hiddenAfter ? "UKRYTY" : "WIDOCZNY"}`);
            
            const changed = hiddenBefore !== hiddenAfter;
            if (changed) {
              console.log(`   ✅ PRZYCISK DZIAŁA!`);
              workingButtons++;
              
              // Zamknij widget
              if (!hiddenAfter) {
                btn.click();
                console.log(`   Widget zamknięty`);
              }
            } else {
              console.log(`   ❌ Przycisk nie reaguje`);
            }
          }, 100 + (index * 50));
          
        } catch (error) {
          console.log(`   ❌ Błąd kliknięcia:`, error.message);
        }
      }
    } else {
      console.log(`❌ Brak DOM elementów`);
    }
  });
  
  // TEST 4: Voice Buttons w widgets (czy nie ma błędów)
  console.log("\n4️⃣ TEST VOICE BUTTONS:");
  setTimeout(() => {
    targetButtons.forEach(button => {
      const voiceBtn = document.querySelector(`#${button.widgetId} [onclick*="start"]`);
      if (voiceBtn) {
        try {
          console.log(`   Testuje voice button dla ${button.name}...`);
          // Nie klikamy - tylko sprawdzamy czy onclick nie ma błędów
          const onclick = voiceBtn.getAttribute('onclick');
          console.log(`   ✅ Voice button OK: ${onclick}`);
        } catch (e) {
          console.log(`   ❌ Voice button błąd:`, e.message);
        }
      }
    });
  }, 800);
  
  // FINAL SUMMARY
  setTimeout(() => {
    console.log("\n" + "=".repeat(60));
    console.log("🎯 FINAL RESULTS SUMMARY");
    console.log("=".repeat(60));
    
    console.log(`🎤 Voice Functions: ${voiceAvailable}/${allVoiceFunctions.length} (${Math.round(voiceAvailable/allVoiceFunctions.length*100)}%)`);
    console.log(`🖱️ Working Buttons: ${workingButtons}/${targetButtons.length} (${Math.round(workingButtons/targetButtons.length*100)}%)`);
    
    if (workingButtons === targetButtons.length) {
      console.log("\n🎉🎉🎉 SUKCES TOTALNY! 🎉🎉🎉");
      console.log("✅ Wszystkie przyciski 2-5 działają!");
      console.log("✅ Problem rozwiązany!");
    } else if (workingButtons >= 3) {
      console.log("\n🎊 ZNACZNY POSTĘP!");
      console.log(`✅ ${workingButtons} z 4 przycisków działa`);
      console.log("⚠️ Pozostałe wymagają dodatkowej uwagi");
    } else if (workingButtons > 0) {
      console.log("\n⚠️ CZĘŚCIOWY SUKCES");
      console.log(`✅ ${workingButtons} przycisk(ów) działa`);
      console.log("🔧 Wymagana dalsza praca nad resztą");
    } else {
      console.log("\n❌ BRAK SUKCESU");
      console.log("🔧 Przyciski nadal wymagają naprawy");
    }
    
    console.log("\n🔍 DIAGNOSTYKA:");
    console.log("1. Sprawdź console.log powyżej dla błędów");
    console.log("2. Jeśli Voice Functions = 100% → Voice naprawiony");
    console.log("3. Jeśli AudioContext OK → Audio naprawiony");  
    console.log("4. Jeśli Working Buttons < 100% → sprawdź CSS/HTML");
    
    console.log("\n✨ Test zakończony!");
    
  }, 1500);
}

// Quick helpers
function quickVoiceCheck() {
  const critical = ["startGeminiProVoice", "startGeminiVisionVoice", "startCodeBisonVoice", "startTextBisonVoice"];
  console.log("⚡ QUICK VOICE CHECK:");
  critical.forEach(fn => {
    console.log(`${fn}: ${typeof window[fn] === 'function' ? "✅" : "❌"}`);
  });
}

function quickButtonCheck() {
  const buttons = ["geminiProBtn", "codeBisonBtn", "textBisonBtn", "googleBardBtn"];
  console.log("⚡ QUICK BUTTON CHECK:");
  buttons.forEach((id, i) => {
    const btn = document.getElementById(id);
    console.log(`${i+2}. ${id}: ${btn ? "✅" : "❌"}`);
  });
}

// MAIN TEST
console.log("🎬 Starting Final Complete Test...");
finalCompleteTest();

// Available functions
console.log("\n💡 AVAILABLE FUNCTIONS:");
console.log("- finalCompleteTest() - full comprehensive test");
console.log("- quickVoiceCheck() - check critical voice functions");
console.log("- quickButtonCheck() - check button existence");

// Auto quick checks
setTimeout(() => {
  console.log("\n" + "=".repeat(30));
  quickVoiceCheck();
  console.log("");
  quickButtonCheck();
}, 2000);