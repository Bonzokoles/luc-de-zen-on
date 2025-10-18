// KOMPLEKSOWY TEST AGENTÓW I WIZUALIZATORÓW
// Do uruchomienia w konsoli przeglądarki na mybonzo.com

async function completeAgentTest() {
  console.log("🚀 KOMPLEKSOWY TEST AGENTÓW MYBONZO");

  const results = {
    apis: {},
    agents: {},
    buttons: {},
    connectivity: {},
  };

  // 1. TEST APIS WIZUALIZATORÓW
  console.log("\n📡 1. TESTING VISUALIZER APIS...");

  const apiTests = [
    { name: "VOICE_DEBUG", key: "VOICE_DEBUG" },
    { name: "CYBER_MUSIC", key: "CYBER_MUSIC" },
    { name: "CYBER_MUSIC_PL", key: "CYBER_MUSIC_PL" },
    { name: "mybonzoButtons", key: "mybonzoButtons" },
  ];

  apiTests.forEach((test) => {
    const found = !!window[test.key];
    results.apis[test.name] = found;
    console.log(
      `${found ? "✅" : "❌"} ${test.name}: ${found ? "FOUND" : "NOT FOUND"}`
    );

    if (found && window[test.key]) {
      try {
        const api = window[test.key];
        console.log(`   📋 Methods: ${Object.keys(api).join(", ")}`);
        if (api.getState)
          console.log(`   🔍 State: ${JSON.stringify(api.getState())}`);
        if (api.stan) console.log(`   🔍 Stan: ${JSON.stringify(api.stan())}`);
      } catch (e) {
        console.log(`   ⚠️ Error reading API:`, e.message);
      }
    }
  });

  // 2. TEST PRZYCISKÓW AGENTÓW
  console.log("\n🎮 2. TESTING AGENT BUTTONS...");

  for (let i = 1; i <= 10; i++) {
    const btn = document.querySelector(`[data-agent="${i}"]`);
    const found = !!btn;
    results.buttons[`agent${i}`] = found;
    console.log(
      `${found ? "✅" : "❌"} Agent ${i.toString().padStart(2, "0")} button: ${
        found ? "FOUND" : "MISSING"
      }`
    );

    if (found) {
      console.log(`   📝 Text: "${btn.textContent.trim()}"`);
      console.log(`   🎯 ID: ${btn.id || "no ID"}`);
    }
  }

  // Specjalne przyciski (91, file, marketing)
  const specialButtons = [
    { agent: "91", name: "Agent 91 (Voice Alt)" },
    { agent: "file", name: "File Manager" },
    { agent: "marketing", name: "Marketing" },
  ];

  specialButtons.forEach((spec) => {
    const btn = document.querySelector(`[data-agent="${spec.agent}"]`);
    const found = !!btn;
    results.buttons[spec.agent] = found;
    console.log(
      `${found ? "✅" : "❌"} ${spec.name}: ${found ? "FOUND" : "MISSING"}`
    );
  });

  // 3. TEST AGENTÓW W MYBONZOBUTTONS
  console.log("\n🤖 3. TESTING MYBONZOBUTTONS AGENTS...");

  if (window.mybonzoButtons && window.mybonzoButtons.agents) {
    const agents = window.mybonzoButtons.agents;
    console.log(`📊 Total agents configured: ${agents.size}`);

    [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "file",
      "marketing",
    ].forEach((id) => {
      const agent = agents.get(id);
      const exists = !!agent;
      results.agents[`agent${id}`] = exists;
      console.log(
        `${exists ? "✅" : "❌"} Agent ${id}: ${
          exists ? agent.name : "NOT CONFIGURED"
        }`
      );

      if (exists) {
        console.log(
          `   🎯 Handler: ${
            typeof agent.handler === "function" ? "FUNCTION" : "MISSING"
          }`
        );
      }
    });
  } else {
    console.log("❌ mybonzoButtons.agents not found");
  }

  // 4. TEST POŁĄCZENIA AGENTÓW Z WIZUALIZATORAMI
  console.log("\n🔗 4. TESTING AGENT-VISUALIZER CONNECTIONS...");

  const connections = [
    {
      agent: "Agent 01 (Voice)",
      visualizer: "VOICE_DEBUG",
      test: () => {
        if (window.VOICE_DEBUG && window.mybonzoButtons) {
          return window.mybonzoButtons.agents.has("1");
        }
        return false;
      },
    },
    {
      agent: "Agent 02 (Music EN)",
      visualizer: "CYBER_MUSIC",
      test: () => {
        if (window.CYBER_MUSIC && window.mybonzoButtons) {
          return window.mybonzoButtons.agents.has("2");
        }
        return false;
      },
    },
    {
      agent: "Agent 02 (Music PL)",
      visualizer: "CYBER_MUSIC_PL",
      test: () => {
        if (window.CYBER_MUSIC_PL && window.mybonzoButtons) {
          return window.mybonzoButtons.agents.has("2");
        }
        return false;
      },
    },
  ];

  connections.forEach((conn) => {
    const connected = conn.test();
    results.connectivity[conn.agent] = connected;
    console.log(
      `${connected ? "✅" : "❌"} ${conn.agent} ↔️ ${conn.visualizer}: ${
        connected ? "CONNECTED" : "DISCONNECTED"
      }`
    );
  });

  // 5. TEST MUSIK API
  console.log("\n🎵 5. TESTING MUSIC API...");

  try {
    const response = await fetch("/api/music/library");
    const data = await response.json();
    const apiWorks = response.ok && data.success;
    results.connectivity["music_api"] = apiWorks;

    console.log(
      `${apiWorks ? "✅" : "❌"} Music Library API: ${
        apiWorks ? "WORKING" : "FAILED"
      }`
    );
    if (apiWorks) {
      console.log(
        `   📀 Tracks available: ${data.tracks ? data.tracks.length : 0}`
      );
      console.log(`   🏷️ Mode: ${data.note || "Production"}`);
    }
  } catch (error) {
    results.connectivity["music_api"] = false;
    console.log(`❌ Music API Error: ${error.message}`);
  }

  // 6. PODSUMOWANIE
  console.log("\n📊 FINAL REPORT:");

  const apiScore = Object.values(results.apis).filter(Boolean).length;
  const buttonScore = Object.values(results.buttons).filter(Boolean).length;
  const agentScore = Object.values(results.agents).filter(Boolean).length;
  const connScore = Object.values(results.connectivity).filter(Boolean).length;

  console.log(`📡 APIs: ${apiScore}/${Object.keys(results.apis).length}`);
  console.log(
    `🎮 Buttons: ${buttonScore}/${Object.keys(results.buttons).length}`
  );
  console.log(`🤖 Agents: ${agentScore}/${Object.keys(results.agents).length}`);
  console.log(
    `🔗 Connections: ${connScore}/${Object.keys(results.connectivity).length}`
  );

  const totalScore = apiScore + buttonScore + agentScore + connScore;
  const maxScore =
    Object.keys(results.apis).length +
    Object.keys(results.buttons).length +
    Object.keys(results.agents).length +
    Object.keys(results.connectivity).length;

  console.log(
    `\n🏆 OVERALL SYSTEM STATUS: ${totalScore}/${maxScore} (${Math.round(
      (totalScore / maxScore) * 100
    )}%)`
  );

  // Recommendations
  console.log("\n💡 RECOMMENDATIONS:");
  if (!results.apis.VOICE_DEBUG) console.log("❗ Voice visualizer not loaded");
  if (!results.apis.CYBER_MUSIC)
    console.log("❗ Music visualizer (EN) not loaded");
  if (!results.apis.CYBER_MUSIC_PL)
    console.log("❗ Music visualizer (PL) not loaded");
  if (!results.connectivity.music_api)
    console.log("❗ Music API not responding");
  if (!results.buttons.agent91)
    console.log("💡 Consider adding Agent 91 button mapping");

  return results;
}

// Auto-run
if (typeof window !== "undefined") {
  setTimeout(
    () =>
      completeAgentTest().then((results) => {
        console.log("\n🎯 Test complete. Results stored in:", results);
        window.testResults = results;
      }),
    2000
  );
} else {
  console.log("📋 Copy this script to browser console on mybonzo.com");
}
