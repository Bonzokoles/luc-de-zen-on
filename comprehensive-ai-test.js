/**
 * Comprehensive AI Workers and API Keys Test
 * Tests all available AI services, workers, and model responses
 */

console.log('🚀 Starting comprehensive AI Workers test...\n');

// Test configuration
const TEST_TIMEOUT = 30000; // 30 seconds
const BASE_URL = 'https://www.mybonzo.com'; // Change if testing locally

// Test data
const testPrompt = "What is the capital of Poland? Answer in one sentence.";
const testImagePrompt = "A beautiful sunset over mountains";

// Available endpoints to test
const endpoints = {
    // Main AI chat endpoints
    chat: '/api/chat',
    polaczekChat: '/api/polaczek-chat',
    bielikChat: '/api/bielik-chat',
    
    // AI Workers
    aiWorkers: '/api/ai-workers',
    aiBotWorker: '/api/ai-bot-worker',
    
    // Image generation
    generateImage: '/api/generate-image',
    
    // External APIs
    bigquery: '/api/bigquery',
    kaggle: '/api/kaggle',
    tavilyOld: '/api/tavi',
    tavilyNew: '/api/tavi-new',
    kaggleNew: '/api/kaggle-new',
    
    // Analytics and utilities
    bielikAnalytics: '/api/bielik-analytics',
    dataAnalyze: '/api/data-analyze',
    usageStats: '/api/usage-stats',
    search: '/api/search'
};

// Test results storage
const results = {
    passed: [],
    failed: [],
    warnings: []
};

/**
 * Make API request with timeout
 */
async function makeRequest(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TEST_TIMEOUT);
    
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Test AI chat endpoint
 */
async function testChatEndpoint(name, endpoint) {
    console.log(`🧪 Testing ${name} (${endpoint})...`);
    
    try {
        const response = await makeRequest(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                prompt: testPrompt,
                model: '@cf/meta/llama-3.1-8b-instruct'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Check if response contains actual AI-generated content
        const responseText = data.response || data.answer || data.result;
        if (responseText && responseText.length > 10) {
            console.log(`✅ ${name}: Working - Response: "${responseText.substring(0, 100)}..."`);
            results.passed.push({
                endpoint: name,
                status: 'success',
                response: responseText.substring(0, 200),
                source: data.source || 'unknown'
            });
        } else if (data.error && data.answer) {
            console.log(`⚠️  ${name}: Error but fallback response - ${data.error}`);
            results.warnings.push({
                endpoint: name,
                status: 'warning',
                issue: 'Error with fallback response',
                data: data
            });
        } else {
            console.log(`⚠️  ${name}: Questionable response - ${JSON.stringify(data)}`);
            results.warnings.push({
                endpoint: name,
                status: 'warning',
                issue: 'Response too short or empty',
                data: data
            });
        }
        
    } catch (error) {
        console.log(`❌ ${name}: Failed - ${error.message}`);
        results.failed.push({
            endpoint: name,
            status: 'failed',
            error: error.message
        });
    }
}

/**
 * Test Bielik model specifically
 */
async function testBielik() {
    console.log(`🇵🇱 Testing Bielik model...`);
    
    try {
        const response = await makeRequest('/api/bielik-chat', {
            method: 'POST',
            body: JSON.stringify({
                message: "Jaka jest stolica Polski? Odpowiedz po polsku.",
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.response && data.response.includes('Warszaw')) {
            console.log(`✅ Bielik: Working correctly - Polish response detected`);
            results.passed.push({
                endpoint: 'Bielik',
                status: 'success',
                response: data.response,
                note: 'Polish language detected'
            });
        } else {
            console.log(`⚠️  Bielik: Response received but unclear if model is working: ${data.response}`);
            results.warnings.push({
                endpoint: 'Bielik',
                status: 'warning',
                issue: 'Response unclear',
                data: data
            });
        }
        
    } catch (error) {
        console.log(`❌ Bielik: Failed - ${error.message}`);
        results.failed.push({
            endpoint: 'Bielik',
            status: 'failed',
            error: error.message
        });
    }
}

/**
 * Test image generation
 */
async function testImageGeneration() {
    console.log(`🎨 Testing image generation...`);
    
    try {
        const response = await makeRequest('/api/generate-image', {
            method: 'POST',
            body: JSON.stringify({
                prompt: testImagePrompt
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && (data.image || data.url)) {
            console.log(`✅ Image Generation: Working - Image generated successfully`);
            results.passed.push({
                endpoint: 'Image Generation',
                status: 'success',
                note: 'Image generated successfully'
            });
        } else {
            console.log(`⚠️  Image Generation: Questionable response - ${JSON.stringify(data)}`);
            results.warnings.push({
                endpoint: 'Image Generation',
                status: 'warning',
                issue: 'No image data in response',
                data: data
            });
        }
        
    } catch (error) {
        console.log(`❌ Image Generation: Failed - ${error.message}`);
        results.failed.push({
            endpoint: 'Image Generation',
            status: 'failed',
            error: error.message
        });
    }
}

/**
 * Test external API integrations
 */
async function testExternalAPIs() {
    console.log(`🔗 Testing external API integrations...`);
    
    // Test Tavily
    try {
        const response = await makeRequest('/api/tavi', {
            method: 'POST',
            body: JSON.stringify({
                query: "current weather in Warsaw"
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Tavily API: Working`);
            results.passed.push({
                endpoint: 'Tavily',
                status: 'success'
            });
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ Tavily API: Failed - ${error.message}`);
        results.failed.push({
            endpoint: 'Tavily',
            status: 'failed',
            error: error.message
        });
    }
    
    // Test Kaggle
    try {
        const response = await makeRequest('/api/kaggle', {
            method: 'GET'
        });
        
        if (response.ok) {
            console.log(`✅ Kaggle API: Working`);
            results.passed.push({
                endpoint: 'Kaggle',
                status: 'success'
            });
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ Kaggle API: Failed - ${error.message}`);
        results.failed.push({
            endpoint: 'Kaggle',
            status: 'failed',
            error: error.message
        });
    }
    
    // Test BigQuery
    try {
        const response = await makeRequest('/api/bigquery', {
            method: 'POST',
            body: JSON.stringify({
                query: "SELECT 1 as test"
            })
        });
        
        if (response.ok) {
            console.log(`✅ BigQuery API: Working`);
            results.passed.push({
                endpoint: 'BigQuery',
                status: 'success'
            });
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ BigQuery API: Failed - ${error.message}`);
        results.failed.push({
            endpoint: 'BigQuery',
            status: 'failed',
            error: error.message
        });
    }
}

/**
 * Test AI Workers Manager endpoint
 */
async function testAIWorkers() {
    console.log(`🤖 Testing AI Workers endpoint...`);
    
    try {
        const response = await makeRequest('/api/ai-workers', {
            method: 'POST',
            body: JSON.stringify({
                action: 'chat',
                message: testPrompt,
                model: 'default'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.response) {
            console.log(`✅ AI Workers: Working - Response received`);
            results.passed.push({
                endpoint: 'AI Workers',
                status: 'success',
                response: data.response.substring(0, 100)
            });
        } else {
            console.log(`⚠️  AI Workers: Questionable response - ${JSON.stringify(data)}`);
            results.warnings.push({
                endpoint: 'AI Workers',
                status: 'warning',
                data: data
            });
        }
        
    } catch (error) {
        console.log(`❌ AI Workers: Failed - ${error.message}`);
        results.failed.push({
            endpoint: 'AI Workers',
            status: 'failed',
            error: error.message
        });
    }
}

/**
 * Run all tests
 */
async function runAllTests() {
    console.log('🔍 Starting comprehensive API and AI Workers test...\n');
    
    // Test main chat endpoints
    await testChatEndpoint('Main Chat', '/api/chat');
    await testChatEndpoint('Polaczek Chat', '/api/polaczek-chat');
    
    // Test Bielik specifically
    await testBielik();
    
    // Test AI Workers
    await testAIWorkers();
    
    // Test image generation
    await testImageGeneration();
    
    // Test external APIs
    await testExternalAPIs();
    
    // Generate final report
    console.log('\n📊 TEST RESULTS SUMMARY:');
    console.log('=' .repeat(50));
    
    console.log(`✅ PASSED (${results.passed.length}):`);
    results.passed.forEach(result => {
        console.log(`   - ${result.endpoint}: ${result.status}`);
        if (result.response) {
            console.log(`     Response: ${result.response.substring(0, 80)}...`);
        }
    });
    
    console.log(`\n⚠️  WARNINGS (${results.warnings.length}):`);
    results.warnings.forEach(result => {
        console.log(`   - ${result.endpoint}: ${result.issue || 'Unknown issue'}`);
    });
    
    console.log(`\n❌ FAILED (${results.failed.length}):`);
    results.failed.forEach(result => {
        console.log(`   - ${result.endpoint}: ${result.error}`);
    });
    
    const totalTests = results.passed.length + results.warnings.length + results.failed.length;
    const successRate = ((results.passed.length / totalTests) * 100).toFixed(1);
    
    console.log(`\n📈 Success Rate: ${successRate}% (${results.passed.length}/${totalTests})`);
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (results.failed.length > 0) {
        console.log('   - Check failed endpoints and verify API keys in Cloudflare secrets');
        console.log('   - Ensure all workers are properly deployed');
    }
    if (results.warnings.length > 0) {
        console.log('   - Review endpoints with warnings for potential issues');
    }
    if (results.passed.length === totalTests) {
        console.log('   - All systems operational! 🎉');
    }
    
    console.log('\n🏁 Test completed!');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
    runAllTests().catch(console.error);
} else {
    console.log('Run runAllTests() to start testing');
}

// Export for browser usage
if (typeof window !== 'undefined') {
    window.runAllTests = runAllTests;
}
