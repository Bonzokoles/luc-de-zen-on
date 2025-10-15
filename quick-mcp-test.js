// Quick manual test - sprawdź podstawową funkcjonalność MCP
console.log("🔧 Quick MCP Test - Manual Check");

// Test czy floating buttons są załadowane
if (window.mybonzoButtons) {
  console.log("✅ MyBonzo Floating Buttons system loaded");
  console.log("📊 Active widgets:", window.mybonzoButtons.activeWidgets);
  console.log("🎯 Available agents:", window.mybonzoButtons.agents);
} else {
  console.log("❌ MyBonzo system NOT loaded!");
}

// Test przycisków DOM
const buttons = document.querySelectorAll("[data-agent]");
console.log(`🎛️ Found ${buttons.length} MCP agent buttons`);

buttons.forEach((btn, i) => {
  console.log(`Button ${i + 1}: Agent ${btn.dataset.agent} - ${btn.title}`);
});

// Test pierwszego przycisku (Voice Agent)
const voiceBtn = document.querySelector('[data-agent="1"]');
if (voiceBtn) {
  console.log("🎤 Voice Agent button found - ready for testing");
  console.log("Click to test:", voiceBtn);
} else {
  console.log("❌ Voice Agent button NOT found!");
}
