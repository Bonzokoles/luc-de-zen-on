// 🎨 COMPREHENSIVE IMAGE GENERATOR TEST
// Deployment: https://947ab8be.luc-de-zen-on.pages.dev
// Date: 15.10.2025
// Target: Diagnoza Cloudflare AI binding issue

console.log(
  "🚀 Starting comprehensive image generator test on deployment 947ab8be..."
);

// Test Case 1: Manual UI Test
function testGeneratorUI() {
  console.log("\n=== TEST 1: Generator UI Functionality ===");

  // Check if page elements exist
  const promptInput = document.getElementById("imagePrompt");
  const generateBtn = document.getElementById("generateBtn");
  const modelSelect = document.getElementById("imageModel");

  console.log("✅ Prompt input found:", !!promptInput);
  console.log("✅ Generate button found:", !!generateBtn);
  console.log("✅ Model selector found:", !!modelSelect);

  if (modelSelect) {
    console.log("Available models:");
    Array.from(modelSelect.options).forEach((option, i) => {
      console.log(`  ${i + 1}. ${option.value} - ${option.textContent}`);
    });
  }

  return {
    promptInput: !!promptInput,
    generateBtn: !!generateBtn,
    modelSelect: !!modelSelect,
  };
}

// Test Case 2: API Endpoint Test
async function testAPIEndpoint() {
  console.log("\n=== TEST 2: API Endpoint Test ===");

  const testPrompt = "Beautiful sunset over mountains, photographic style";

  try {
    console.log("📡 Testing /api/generate-image endpoint...");

    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: testPrompt,
        model: "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        style: "realistic",
        width: 512,
        height: 512,
      }),
    });

    console.log("📊 Response status:", response.status);
    console.log("📊 Response ok:", response.ok);
    console.log("📊 Content-Type:", response.headers.get("content-type"));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error:", errorText);
      return { success: false, error: errorText };
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("image/")) {
      // Binary image response
      const blob = await response.blob();
      console.log("✅ Binary image received");
      console.log("📦 Size:", (blob.size / 1024).toFixed(1) + "KB");
      return { success: true, type: "binary", size: blob.size };
    } else if (contentType && contentType.includes("json")) {
      // JSON response
      const jsonData = await response.json();
      console.log("✅ JSON response received");
      console.log("📄 Data:", jsonData);
      return { success: true, type: "json", data: jsonData };
    } else {
      console.error("❌ Unknown content type:", contentType);
      return { success: false, error: "Unknown content type" };
    }
  } catch (error) {
    console.error("❌ API Test failed:", error);
    return { success: false, error: error.message };
  }
}

// Test Case 3: Debug Info Analysis
async function analyzeDebugInfo() {
  console.log("\n=== TEST 3: Debug Info Analysis ===");

  // This will trigger our debug logs in the API
  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Debug test image",
        model: "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      }),
    });

    console.log(
      "🔍 Debug request sent - check browser network tab and Cloudflare logs"
    );
    console.log(
      "🔍 Look for console logs starting with '=== GENERATE IMAGE DEBUG ==='"
    );

    if (response.ok) {
      const result = await response.json();
      console.log("🔍 Debug result received:", result);

      if (result.real_generation === false) {
        console.log("❌ CONFIRMED: Using demo mode - AI binding not working");
        console.log("🔧 Need to fix Cloudflare AI binding in wrangler.toml");
      } else if (result.real_generation === true) {
        console.log("✅ CONFIRMED: Real AI generation working!");
      }

      return {
        success: true,
        realGeneration: result.real_generation,
        source: result.source,
      };
    }
  } catch (error) {
    console.error("❌ Debug analysis failed:", error);
    return { success: false, error: error.message };
  }
}

// Test Case 4: Generator Instructions API
async function testInstructionsAPI() {
  console.log("\n=== TEST 4: Instructions API Test ===");

  try {
    const response = await fetch(
      "/api/image-generator/generate?instructions=true"
    );

    if (response.ok) {
      const instructions = await response.json();
      console.log("✅ Instructions API working");
      console.log(
        "📖 Available features:",
        Object.keys(instructions.instructions?.sections || {})
      );
      return { success: true, data: instructions };
    } else {
      console.error("❌ Instructions API failed:", response.status);
      return { success: false, error: response.status };
    }
  } catch (error) {
    console.error("❌ Instructions test failed:", error);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runAllTests() {
  console.log("🎯 Running comprehensive image generator tests...\n");

  const results = {
    ui: null,
    api: null,
    debug: null,
    instructions: null,
  };

  // Test 1: UI
  results.ui = testGeneratorUI();

  // Test 2: API
  results.api = await testAPIEndpoint();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Test 3: Debug Analysis
  results.debug = await analyzeDebugInfo();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Test 4: Instructions API
  results.instructions = await testInstructionsAPI();

  // Summary
  console.log("\n🏁 TEST RESULTS SUMMARY:");
  console.log("=".repeat(50));
  console.log(
    "UI Elements:",
    results.ui.promptInput && results.ui.generateBtn
      ? "✅ Working"
      : "❌ Issues"
  );
  console.log(
    "API Endpoint:",
    results.api.success ? "✅ Working" : "❌ Failed"
  );
  console.log(
    "Debug Analysis:",
    results.debug.success ? "✅ Working" : "❌ Failed"
  );
  console.log(
    "Instructions API:",
    results.instructions.success ? "✅ Working" : "❌ Failed"
  );

  if (results.debug.success) {
    console.log("\n🔍 AI GENERATION STATUS:");
    console.log(
      "Real Generation:",
      results.debug.realGeneration ? "✅ YES" : "❌ NO (Demo Mode)"
    );
    console.log("Source:", results.debug.source || "Unknown");

    if (!results.debug.realGeneration) {
      console.log("\n🔧 NEXT STEPS TO FIX:");
      console.log("1. Check Cloudflare AI binding in wrangler.toml");
      console.log("2. Verify AI binding is available in runtime environment");
      console.log("3. Check Cloudflare account permissions for AI");
    }
  }

  return results;
}

// Auto-run tests when page loads
if (document.readyState === "complete") {
  setTimeout(runAllTests, 2000);
} else {
  window.addEventListener("load", () => {
    setTimeout(runAllTests, 2000);
  });
}

// Manual trigger
window.runImageGeneratorTests = runAllTests;

console.log("📋 Image generator tests ready!");
console.log("🔧 Manual trigger: window.runImageGeneratorTests()");

// Quick single test for immediate use
window.quickImageTest = async function () {
  console.log("🚀 Quick image generation test...");

  const result = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: "Test image generation",
      model: "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    }),
  });

  if (result.ok) {
    const data = await result.json();
    console.log("✅ Quick test result:", data);
    console.log("Real generation:", data.real_generation);
    return data;
  } else {
    console.error("❌ Quick test failed:", result.status);
    return null;
  }
};
