
import fetch from 'node-fetch';

const BASE_URL = 'https://889a27e1.luc-de-zen-on.pages.dev';

const tests = [
    { name: 'Middleware Fix Test: /api/debug-env', endpoint: '/api/debug-env', method: 'GET' },
    { name: 'Middleware Fix Test: /api/image-generator/styles', endpoint: '/api/image-generator/styles', method: 'GET' },
    { name: 'Image Generation Test (Default CF Worker)', endpoint: '/api/generate-image', method: 'POST', body: { prompt: 'a cat sitting on a table' } },
    { name: 'Image Generation Test (External Together AI)', endpoint: '/api/generate-image', method: 'POST', body: { prompt: 'a robot painting a masterpiece', model: 'together_flux' } },
    { name: 'Image Generation Test (External Hugging Face)', endpoint: '/api/generate-image', method: 'POST', body: { prompt: 'a photorealistic portrait of a woman', model: 'realistic_vision' } },
    { name: 'Bielik Polish API Test', endpoint: '/api/bielik-polish', method: 'POST', body: { prompt: 'test' } }
];

async function runTests() {
    console.log('Starting API endpoint functionality test...');
    let allTestsPassed = true;

    for (const test of tests) {
        try {
            const options = {
                method: test.method,
                headers: { 'Content-Type': 'application/json' }
            };
            if (test.body) {
                options.body = JSON.stringify(test.body);
            }

            const response = await fetch(BASE_URL + test.endpoint, options);
            
            if (response.ok) {
                console.log(`✅ [PASS] ${test.name} - Status: ${response.status}`);
            } else {
                allTestsPassed = false;
                console.error(`❌ [FAIL] ${test.name} - Status: ${response.status}`);
                const errorText = await response.text();
                console.error(`   Response: ${errorText.substring(0, 200)}...`);
            }
        } catch (error) {
            allTestsPassed = false;
            console.error(`❌ [FAIL] ${test.name} - Error: ${error.message}`);
        }
    }

    console.log('\n----------------------------------------');
    if (allTestsPassed) {
        console.log('🎉 All API tests passed successfully!');
    } else {
        console.log('🔥 Some API tests failed. Please review the logs.');
    }
    console.log('----------------------------------------');
}

runTests();
