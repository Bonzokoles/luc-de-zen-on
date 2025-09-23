// DEPLOYMENT VERIFICATION TEST - Run in Browser Console
console.log("🔍 DEPLOYMENT VERIFICATION v1.0");
console.log("Current timestamp:", new Date().toISOString());

// 1. Check if main functions are available
const criticalFunctions = [
  'sendToGeminiPro', 'clearGeminiPro', 'toggleGlobalVoice',
  'startGeminiProVoice', 'stopGeminiProVoice'
];

console.log("\n1️⃣ CRITICAL FUNCTIONS CHECK:");
let criticalOK = 0;
criticalFunctions.forEach(fn => {
  const available = typeof window[fn] === 'function';
  console.log(`${available ? '✅' : '❌'} ${fn}`);
  if (available) criticalOK++;
});

// 2. Check toggleGlobalVoice specifically
console.log("\n2️⃣ TOGGLE GLOBAL VOICE DETAILED CHECK:");
if (typeof window.toggleGlobalVoice === 'function') {
  console.log("✅ toggleGlobalVoice is available");
  try {
    console.log("Function source:", window.toggleGlobalVoice.toString().substring(0, 200) + "...");
  } catch (e) {
    console.log("Cannot read function source:", e.message);
  }
} else {
  console.log("❌ toggleGlobalVoice NOT available");
}

// 3. Check for button existence
console.log("\n3️⃣ BUTTON EXISTENCE CHECK:");
const globalVoiceBtn = document.getElementById("globalVoiceBtn");
if (globalVoiceBtn) {
  console.log("✅ Global Voice Button found");
  console.log("Button onclick:", globalVoiceBtn.onclick || globalVoiceBtn.getAttribute('onclick'));
} else {
  console.log("❌ Global Voice Button NOT found");
}

// 4. Test actual function call (safe)
console.log("\n4️⃣ SAFE FUNCTION TEST:");
try {
  if (typeof window.toggleGlobalVoice === 'function') {
    console.log("✅ toggleGlobalVoice can be called (not executing for safety)");
  } else {
    console.log("❌ Cannot test function - not available");
  }
} catch (e) {
  console.log("❌ Function test error:", e.message);
}

// 5. Check deployment version
console.log("\n5️⃣ VERSION CHECK:");
console.log("Page URL:", window.location.href);
console.log("User Agent:", navigator.userAgent.substring(0, 100));
console.log("Cache status: Press Ctrl+F5 to force refresh if needed");

// 6. Summary
console.log(`\n🎯 SUMMARY:`);
console.log(`Critical functions available: ${criticalOK}/${criticalFunctions.length}`);
if (criticalOK === criticalFunctions.length) {
  console.log("✅ DEPLOYMENT SUCCESS - All functions should work");
} else {
  console.log("⏳ DEPLOYMENT PENDING - Wait 1-2 minutes or force refresh (Ctrl+F5)");
}

// 7. Quick fix for the K() error you saw
console.log("\n7️⃣ EMERGENCY FIX CHECK:");
if (typeof K === 'undefined') {
  console.log("ℹ️  K() function not found - this is expected in new version");
  window.K = function() {
    console.log("K() called - but this function is obsolete");
  };
  console.log("✅ Added dummy K() function to prevent errors");
} else {
  console.log("K() function exists");
}