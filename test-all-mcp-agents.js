// Systematyczny test wszystkich 12 przycisków MCP
// Deployment: https://196488be.luc-de-zen-on.pages.dev

console.log(
  "🚀 Rozpoczynamy systematyczne testowanie wszystkich 12 przycisków MCP..."
);

const agents = [
  { id: "1", name: "Voice Command Agent", icon: "🎤", btn: "voiceAgentBtn" },
  { id: "2", name: "Music Control Agent", icon: "🎵", btn: "musicAgentBtn" },
  { id: "3", name: "System Monitor Agent", icon: "⚡", btn: "systemAgentBtn" },
  { id: "4", name: "Web Crawler Agent", icon: "🕷️", btn: "crawlerAgentBtn" },
  { id: "5", name: "Email Manager Agent", icon: "📧", btn: "emailAgentBtn" },
  {
    id: "6",
    name: "Database Query Agent",
    icon: "💾",
    btn: "databaseAgentBtn",
  },
  {
    id: "7",
    name: "Content Creator Agent",
    icon: "✍️",
    btn: "contentAgentBtn",
  },
  {
    id: "8",
    name: "Security Guard Agent",
    icon: "🔒",
    btn: "securityAgentBtn",
  },
  {
    id: "9",
    name: "Dyrektor Biznesowy",
    icon: "👔",
    btn: "agent09DyrektorBtn",
  },
  {
    id: "10",
    name: "Analytics Prophet Agent",
    icon: "📊",
    btn: "analyticsAgentBtn",
  },
  { id: "file", name: "File Manager Agent", icon: "📁", btn: "fileAgentBtn" },
  {
    id: "marketing",
    name: "Marketing Maestro Agent",
    icon: "🎯",
    btn: "marketingAgentBtn",
  },
];

let testResults = [];
let currentAgentIndex = 0;

function testAgent(agent) {
  return new Promise((resolve) => {
    console.log(
      `\n📋 Testowanie ${agent.icon} Agent ${agent.id} - ${agent.name}`
    );

    const button = document.querySelector(`[data-agent="${agent.id}"]`);

    if (!button) {
      console.error(
        `❌ Przycisk dla agenta ${agent.id} nie został znaleziony!`
      );
      testResults.push({
        agent: agent.id,
        name: agent.name,
        status: "FAILED - Button not found",
        error: "DOM element missing",
      });
      resolve();
      return;
    }

    console.log(`✅ Przycisk znaleziony: ${button.id}`);

    // Test kliknięcia
    try {
      button.click();

      // Czekamy 2 sekundy na otwarcie widgetu
      setTimeout(() => {
        // Sprawdzamy czy widget się otworzył
        const widgets = document.querySelectorAll(
          ".floating-widget:not(.hidden)"
        );
        const activeWidget = Array.from(widgets).find((w) =>
          w.classList.contains("active")
        );

        if (activeWidget) {
          console.log(`✅ Widget otworzony poprawnie: ${activeWidget.id}`);

          // Test zamknięcia
          const closeBtn = activeWidget.querySelector(".close-btn");
          if (closeBtn) {
            closeBtn.click();
            console.log(`✅ Widget zamknięty poprawnie`);

            testResults.push({
              agent: agent.id,
              name: agent.name,
              status: "SUCCESS",
              widget: activeWidget.id,
              features: "Open/Close working",
            });
          } else {
            console.log(`⚠️ Przycisk zamknięcia nie znaleziony`);
            testResults.push({
              agent: agent.id,
              name: agent.name,
              status: "PARTIAL - No close button",
              widget: activeWidget.id,
            });
          }
        } else {
          console.error(`❌ Widget nie otworzył się po kliknięciu`);
          testResults.push({
            agent: agent.id,
            name: agent.name,
            status: "FAILED - Widget not opened",
            error: "No widget response",
          });
        }

        resolve();
      }, 2000);
    } catch (error) {
      console.error(`❌ Błąd podczas kliknięcia: ${error.message}`);
      testResults.push({
        agent: agent.id,
        name: agent.name,
        status: "FAILED - Click error",
        error: error.message,
      });
      resolve();
    }
  });
}

async function runAllTests() {
  console.log("🔥 Rozpoczynamy testy wszystkich 12 agentów MCP...\n");

  for (let i = 0; i < agents.length; i++) {
    await testAgent(agents[i]);

    // Krótka przerwa między testami
    if (i < agents.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Podsumowanie wyników
  console.log("\n🏁 WYNIKI TESTÓW WSZYSTKICH AGENTÓW MCP:");
  console.log("=".repeat(60));

  const successful = testResults.filter((r) => r.status === "SUCCESS").length;
  const failed = testResults.filter((r) => r.status.includes("FAILED")).length;
  const partial = testResults.filter((r) =>
    r.status.includes("PARTIAL")
  ).length;

  console.log(`✅ Sukces: ${successful}/${agents.length}`);
  console.log(`❌ Błędy: ${failed}/${agents.length}`);
  console.log(`⚠️ Częściowe: ${partial}/${agents.length}`);

  console.log("\nSzczegóły:");
  testResults.forEach((result, index) => {
    const status = result.status.includes("SUCCESS")
      ? "✅"
      : result.status.includes("PARTIAL")
      ? "⚠️"
      : "❌";
    console.log(
      `${status} Agent ${result.agent}: ${result.name} - ${result.status}`
    );
    if (result.error) {
      console.log(`   Błąd: ${result.error}`);
    }
    if (result.widget) {
      console.log(`   Widget: ${result.widget}`);
    }
  });

  return testResults;
}

// Automatyczne uruchomienie testów po załadowaniu strony
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(runAllTests, 2000); // Czekamy 2s na pełne załadowanie
  });
} else {
  setTimeout(runAllTests, 1000); // Już załadowana
}

// Export dla ręcznego uruchomienia
window.testAllMCPAgents = runAllTests;

console.log("📋 Test gotowy! Uruchom ręcznie: window.testAllMCPAgents()");
