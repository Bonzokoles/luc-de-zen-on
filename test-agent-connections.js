// Test połączeń agentów z wizualizatorami
// Do uruchomienia w konsoli przeglądarki na mybonzo.com

function testAgentConnections() {
  console.log("🔥 TESTOWANIE POŁĄCZEŃ AGENTÓW Z WIZUALIZATORAMI");

  const tests = [
    {
      name: "Agent 91/01 (Voice) → VOICE_DEBUG",
      api: "VOICE_DEBUG",
      test: () => {
        if (window.VOICE_DEBUG) {
          console.log("✅ VOICE_DEBUG API znaleziony");
          console.log("📊 Stan API:", typeof window.VOICE_DEBUG);
          console.log("🔍 Metody:", Object.keys(window.VOICE_DEBUG));
          return true;
        }
        return false;
      },
    },
    {
      name: "Agent 02 (Music EN) → CYBER_MUSIC",
      api: "CYBER_MUSIC",
      test: () => {
        if (window.CYBER_MUSIC) {
          console.log("✅ CYBER_MUSIC API znaleziony");
          console.log(
            "📊 Stan:",
            window.CYBER_MUSIC.getState
              ? window.CYBER_MUSIC.getState()
              : "brak getState()"
          );
          console.log("🔍 Metody:", Object.keys(window.CYBER_MUSIC));
          return true;
        }
        return false;
      },
    },
    {
      name: "Agent 02 (Music PL) → CYBER_MUSIC_PL",
      api: "CYBER_MUSIC_PL",
      test: () => {
        if (window.CYBER_MUSIC_PL) {
          console.log("✅ CYBER_MUSIC_PL API znaleziony");
          console.log(
            "📊 Stan:",
            window.CYBER_MUSIC_PL.stan
              ? window.CYBER_MUSIC_PL.stan()
              : "brak stan()"
          );
          console.log("🔍 Metody:", Object.keys(window.CYBER_MUSIC_PL));
          return true;
        }
        return false;
      },
    },
    {
      name: "Floating Buttons System",
      api: "mybonzoButtons",
      test: () => {
        if (window.mybonzoButtons) {
          console.log("✅ mybonzoButtons znaleziony");
          console.log(
            "📊 Agenci:",
            window.mybonzoButtons.agents
              ? window.mybonzoButtons.agents.size
              : "brak agents"
          );
          return true;
        }
        return false;
      },
    },
  ];

  let passedTests = 0;

  tests.forEach((test) => {
    console.log(`\n🧪 Test: ${test.name}`);
    try {
      const result = test.test();
      if (result) {
        passedTests++;
        console.log(`✅ PASSED`);
      } else {
        console.log(`❌ FAILED - ${test.api} nie znaleziony w window`);
      }
    } catch (error) {
      console.log(`💥 ERROR:`, error.message);
    }
  });

  console.log(`\n📈 WYNIKI: ${passedTests}/${tests.length} testów przeszło`);

  // Test floating buttons
  if (window.mybonzoButtons) {
    console.log("\n🎛️ TESTOWANIE AGENTÓW:");
    console.log("Agent 1 (Voice):", window.mybonzoButtons.agents.get("1"));
    console.log("Agent 2 (Music):", window.mybonzoButtons.agents.get("2"));
  }

  return {
    passed: passedTests,
    total: tests.length,
    apis: {
      voice: !!window.VOICE_DEBUG,
      musicEN: !!window.CYBER_MUSIC,
      musicPL: !!window.CYBER_MUSIC_PL,
      buttons: !!window.mybonzoButtons,
    },
  };
}

// Auto-run po załadowaniu
if (typeof window !== "undefined") {
  console.log("🌍 Test uruchomiony w przeglądarce");
  setTimeout(testAgentConnections, 1000);
} else {
  console.log(
    "📝 Test stworzony - skopiuj do konsoli przeglądarki na mybonzo.com"
  );
}
