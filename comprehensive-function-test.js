// COMPREHENSIVE FUNCTION TEST - Run in Browser Console
console.log("🧪 TESTING ALL AI FUNCTIONS - v2.0");

const allFunctions = [
  // Voice Functions
  'startGeminiProVoice', 'stopGeminiProVoice', 'toggleGeminiProVoice',
  'startGeminiVisionVoice', 'stopGeminiVisionVoice', 'toggleGeminiVisionVoice',
  'startCodeBisonVoice', 'stopCodeBisonVoice', 'toggleCodeBisonVoice',
  'startTextBisonVoice', 'stopTextBisonVoice', 'toggleTextBisonVoice',
  'startBardVoice', 'stopBardVoice', 'toggleBardVoice',
  'startPaLMVoice', 'stopPaLMVoice', 'togglePaLMVoice',
  'startVertexVoice', 'stopVertexVoice', 'toggleVertexVoice',
  'startAIStudioVoice', 'stopAIStudioVoice', 'toggleAIStudioVoice',
  
  // Main AI Functions
  'sendToGeminiPro', 'clearGeminiPro',
  'sendToGeminiVision', 'clearGeminiVision',
  'sendToCodeBison', 'clearCodeBison',
  'sendToTextBison', 'clearTextBison',
  'sendToGoogleBard', 'clearGoogleBard',
  'sendToPaLMAPI', 'clearPaLMAPI',
  'sendToVertexAI', 'clearVertexAI',
  'sendToAIStudio', 'clearAIStudio',
  
  // Toggle Functions
  'toggleGeminiPro', 'toggleGeminiVision', 'toggleCodeBison', 'toggleTextBison',
  'toggleGoogleBard', 'togglePaLMAPI', 'toggleVertexAI', 'toggleAIStudio',
  
  // Helper Functions
  'closeTab'
];

console.log(`\n📊 Testing ${allFunctions.length} functions...`);

let available = 0;
let missing = [];

allFunctions.forEach(fn => {
  if (typeof window[fn] === 'function') {
    console.log(`✅ ${fn}`);
    available++;
  } else {
    console.log(`❌ ${fn} - NOT AVAILABLE`);
    missing.push(fn);
  }
});

console.log(`\n🎯 RESULTS:`);
console.log(`✅ Available: ${available}/${allFunctions.length}`);
console.log(`❌ Missing: ${missing.length}`);

if (missing.length > 0) {
  console.log(`\n🚨 MISSING FUNCTIONS:`);
  missing.forEach(fn => console.log(`  - ${fn}`));
}

// Test actual button clicks that were failing
console.log(`\n🔗 TESTING FAILING BUTTONS:`);
const testButtons = [
  'startGeminiProVoice',
  'sendToGeminiPro',
  'clearGeminiPro',
  'stopGeminiProVoice',
  'toggleGeminiProVoice'
];

testButtons.forEach(fn => {
  if (typeof window[fn] === 'function') {
    console.log(`✅ ${fn} - READY FOR ONCLICK`);
  } else {
    console.log(`❌ ${fn} - WILL FAIL IN ONCLICK`);
  }
});

console.log(`\n💡 If all functions show ✅, the ReferenceError should be fixed!`);