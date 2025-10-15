// 🎨 TEST GENERATORA OBRAZÓW - AI IMAGE GENERATOR
// Deployment: https://196488be.luc-de-zen-on.pages.dev/image-generator
// API Endpoints: /api/generate-image, /api/image-generator/generate
// Testowane: 15.10.2025 04:40

console.log("🎨 Rozpoczynamy test generatora obrazów AI...");

const imageTestCases = [
  {
    id: "test1",
    prompt: "Beautiful sunset over mountains, photographic style",
    model: "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    style: "realistic",
    size: "512x512",
    expectedDuration: "3-8 seconds"
  },
  {
    id: "test2", 
    prompt: "Futuristic city, cyberpunk style, neon lights",
    model: "@cf/black-forest-labs/flux-1-schnell",
    style: "artistic",
    size: "1024x1024",
    expectedDuration: "5-10 seconds"
  },
  {
    id: "test3",
    prompt: "Kot w kosmosie, styl fotograficzny, 4K",
    model: "@cf/lykon/dreamshaper-8-lcm", 
    style: "realistic",
    size: "512x512",
    expectedDuration: "2-5 seconds"
  }
];

let testResults = [];

function testImageGeneration(testCase) {
  return new Promise(async (resolve) => {
    console.log(`\n🖼️ Test: ${testCase.id} - ${testCase.prompt}`);
    console.log(`📱 Model: ${testCase.model}`);
    console.log(`📐 Rozmiar: ${testCase.size}`);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: testCase.prompt,
          model: testCase.model,
          style: testCase.style,
          width: parseInt(testCase.size.split('x')[0]),
          height: parseInt(testCase.size.split('x')[1])
        })
      });
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      if (!response.ok) {
        console.error(`❌ HTTP Error: ${response.status}`);
        const errorText = await response.text();
        console.error(`Błąd: ${errorText}`);
        
        testResults.push({
          test: testCase.id,
          status: "FAILED",
          error: `HTTP ${response.status}`,
          duration: duration + "s",
          model: testCase.model
        });
        resolve();
        return;
      }
      
      const contentType = response.headers.get('content-type');
      console.log(`📄 Content-Type: ${contentType}`);
      
      if (contentType && contentType.includes('image/')) {
        // Binary image response
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        console.log(`✅ Obraz wygenerowany pomyślnie!`);
        console.log(`⏱️ Czas generacji: ${duration}s`);
        console.log(`📦 Rozmiar pliku: ${(blob.size / 1024).toFixed(1)}KB`);
        console.log(`🔗 URL: ${imageUrl}`);
        
        testResults.push({
          test: testCase.id,
          status: "SUCCESS",
          duration: duration + "s",
          size: (blob.size / 1024).toFixed(1) + "KB",
          model: testCase.model,
          imageUrl: imageUrl
        });
        
      } else if (contentType && contentType.includes('application/json')) {
        // JSON response
        const jsonData = await response.json();
        
        if (jsonData.success && jsonData.data && jsonData.data.url) {
          console.log(`✅ Obraz wygenerowany przez zewnętrzny model!`);
          console.log(`⏱️ Czas generacji: ${duration}s`);
          console.log(`🔗 URL: ${jsonData.data.url}`);
          
          testResults.push({
            test: testCase.id,
            status: "SUCCESS",
            duration: duration + "s", 
            model: testCase.model,
            imageUrl: jsonData.data.url,
            external: true
          });
        } else {
          console.error(`❌ Nieprawidłowa odpowiedź JSON:`, jsonData);
          testResults.push({
            test: testCase.id,
            status: "FAILED",
            error: "Invalid JSON response",
            duration: duration + "s",
            model: testCase.model
          });
        }
      } else {
        console.error(`❌ Nieznany Content-Type: ${contentType}`);
        testResults.push({
          test: testCase.id,
          status: "FAILED", 
          error: "Unknown content type",
          duration: duration + "s",
          model: testCase.model
        });
      }
      
    } catch (error) {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.error(`❌ Błąd podczas generacji:`, error);
      testResults.push({
        test: testCase.id,
        status: "FAILED",
        error: error.message,
        duration: duration + "s", 
        model: testCase.model
      });
    }
    
    resolve();
  });
}

async function runAllImageTests() {
  console.log("🚀 Rozpoczynamy testy generacji obrazów...\n");
  
  for (let i = 0; i < imageTestCases.length; i++) {
    await testImageGeneration(imageTestCases[i]);
    
    // Krótka przerwa między testami
    if (i < imageTestCases.length - 1) {
      console.log("⏳ Oczekiwanie 3 sekundy...");
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  // Podsumowanie wyników
  console.log("\n🏁 WYNIKI TESTÓW GENERACJI OBRAZÓW:");
  console.log("=" .repeat(60));
  
  const successful = testResults.filter(r => r.status === "SUCCESS").length;
  const failed = testResults.filter(r => r.status === "FAILED").length;
  
  console.log(`✅ Sukces: ${successful}/${imageTestCases.length}`);
  console.log(`❌ Błędy: ${failed}/${imageTestCases.length}`);
  
  console.log("\nSzczegóły:");
  testResults.forEach((result, index) => {
    const status = result.status === "SUCCESS" ? "✅" : "❌";
    console.log(`${status} ${result.test}: ${result.model} - ${result.status} (${result.duration})`);
    if (result.error) {
      console.log(`   Błąd: ${result.error}`);
    }
    if (result.size) {
      console.log(`   Rozmiar: ${result.size}`);
    }
    if (result.imageUrl) {
      console.log(`   URL: ${result.imageUrl.substring(0, 50)}...`);
    }
  });
  
  return testResults;
}

// Auto-run po załadowaniu strony
if (document.readyState === 'complete') {
  setTimeout(runAllImageTests, 2000);
} else {
  window.addEventListener('load', () => {
    setTimeout(runAllImageTests, 2000);
  });
}

// Export dla ręcznego uruchomienia
window.testImageGeneration = runAllImageTests;

console.log("📋 Test generacji obrazów gotowy!");
console.log("Uruchom ręcznie: window.testImageGeneration()");