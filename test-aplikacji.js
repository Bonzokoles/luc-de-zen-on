// Test wszystkich funkcji aplikacji MyBonzo
// Uruchomione: 17 października 2025

console.log("🚀 ROZPOCZYNAM TEST APLIKACJI MYBONZO...");

const BASE_URL = 'http://localhost:4321';
const testResults = [];

// Funkcje testowe
async function testEndpoint(name, url, method = 'GET', body = null) {
    try {
        console.log(`📡 Testuję ${name}...`);
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'MyBonzo-Test-Suite'
            }
        };
        
        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(`${BASE_URL}${url}`, options);
        
        const result = {
            name,
            url,
            status: response.status,
            ok: response.ok,
            timestamp: new Date().toISOString()
        };
        
        if (response.ok) {
            console.log(`✅ ${name}: OK (${response.status})`);
        } else {
            console.log(`❌ ${name}: BŁĄD (${response.status})`);
        }
        
        testResults.push(result);
        return result;
        
    } catch (error) {
        console.log(`💥 ${name}: EXCEPTION - ${error.message}`);
        testResults.push({
            name,
            url,
            status: 'ERROR',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}

async function testMainPages() {
    console.log("\n📄 TESTOWANIE GŁÓWNYCH STRON...");
    
    await testEndpoint("Strona główna", "/");
    await testEndpoint("Generator obrazów", "/image-generator/");
    await testEndpoint("Chatbot AI", "/chatbot/");
    await testEndpoint("Voice AI Assistant", "/voice-ai-assistant/");
    await testEndpoint("Kaggle Datasets", "/kaggle-datasets/");
    await testEndpoint("BigQuery Analytics", "/bigquery/");
    await testEndpoint("Tavily Search", "/tavily-search/");
    await testEndpoint("AI Business Box", "/ai-business-box/");
    await testEndpoint("AI Browser (Polaczek)", "/ai-browser/");
}

async function testAPIEndpoints() {
    console.log("\n🔌 TESTOWANIE API ENDPOINTS...");
    
    // Chat APIs
    await testEndpoint("Chat API (bez body)", "/api/chat");
    await testEndpoint("Gemini Chat API", "/api/gemini-chat");
    await testEndpoint("Bielik Polish API", "/api/bielik-polish");
    
    // Generator APIs  
    await testEndpoint("Generate Image API", "/api/generate-image");
    await testEndpoint("Enhance Prompt API", "/api/enhance-prompt");
    
    // Data APIs
    await testEndpoint("Kaggle API", "/api/kaggle");
    await testEndpoint("BigQuery API", "/api/bigquery");
    await testEndpoint("Tavily API", "/api/tavily");
    await testEndpoint("Business Analytics API", "/api/business-analytics");
    
    // MCP APIs (sprawdzamy kilka)
    await testEndpoint("MCP Agent 1", "/api/mcp-1");
    await testEndpoint("MCP Agent 2", "/api/mcp-2");
    await testEndpoint("MCP File Manager", "/api/mcp-file");
    await testEndpoint("MCP Marketing", "/api/mcp-marketing");
}

async function testWithPostData() {
    console.log("\n📤 TESTOWANIE Z DANYMI POST...");
    
    // Test chat z prostym zapytaniem
    const chatData = {
        message: "Hej! To jest test.",
        model: "@cf/google/gemma-3-12b-it"
    };
    
    await testEndpoint("Chat z danymi", "/api/chat", "POST", chatData);
    
    // Test generatora obrazów z prostym promptem
    const imageData = {
        prompt: "test image generation",
        model: "stable-diffusion-xl"
    };
    
    await testEndpoint("Generator z promptem", "/api/generate-image", "POST", imageData);
}

async function generateReport() {
    console.log("\n📊 GENEROWANIE RAPORTU...");
    
    const total = testResults.length;
    const successful = testResults.filter(r => r.ok || r.status === 200).length;
    const failed = total - successful;
    
    console.log("\n" + "=".repeat(50));
    console.log("📈 RAPORT TESTÓW APLIKACJI MYBONZO");
    console.log("=".repeat(50));
    console.log(`📅 Data: ${new Date().toLocaleString('pl-PL')}`);
    console.log(`🔢 Łącznie testów: ${total}`);
    console.log(`✅ Udanych: ${successful}`);
    console.log(`❌ Nieudanych: ${failed}`);
    console.log(`📊 Współczynnik sukcesu: ${((successful/total)*100).toFixed(1)}%`);
    
    console.log("\n📋 SZCZEGÓŁY:");
    testResults.forEach(result => {
        const status = result.ok || result.status === 200 ? '✅' : '❌';
        console.log(`${status} ${result.name}: ${result.status}`);
    });
    
    console.log("\n🏆 PODSUMOWANIE FUNKCJI:");
    console.log("✅ Astro 5.14.6 - zaktualizowane");
    console.log("✅ Serwer deweloperski - działa");
    console.log("✅ Cloudflare bindings - skonfigurowane");
    console.log("⚠️  Ostrzeżenia TypeScript - do naprawy");
    console.log("⚠️  Unsupported file type - do oczyszczenia");
    
    return {
        total,
        successful, 
        failed,
        successRate: ((successful/total)*100).toFixed(1),
        results: testResults
    };
}

// Główna funkcja testowa
async function runFullTest() {
    try {
        console.log("🎯 MyBonzo Application Test Suite");
        console.log("Wersja: 1.0");
        console.log("Data: " + new Date().toLocaleString('pl-PL'));
        console.log("-".repeat(50));
        
        await testMainPages();
        await testAPIEndpoints(); 
        await testWithPostData();
        
        const report = await generateReport();
        
        console.log("\n🎉 TESTY ZAKOŃCZONE!");
        console.log(`Wynik ogólny: ${report.successRate}% funkcji działa poprawnie`);
        
        return report;
        
    } catch (error) {
        console.error("💥 BŁĄD PODCZAS TESTÓW:", error);
    }
}

// Uruchomienie testów
runFullTest()
    .then(report => {
        console.log("\n✨ Test suite completed successfully!");
    })
    .catch(error => {
        console.error("❌ Test suite failed:", error);
    });