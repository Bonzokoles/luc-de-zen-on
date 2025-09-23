/**
 * Production Testing Script dla MyBonzo  
 * Test wszystkich endpoint i funkcjonalności na live deployment
 */

// Use global fetch (available in Node.js 18+)
const fetchApi = globalThis.fetch;

const PROD_URL = 'https://29dcf914.luc-de-zen-on.pages.dev';

// Test API endpoints
async function testEndpoints() {
    console.log('🌐 Testing production API endpoints...');
    
    const endpoints = [
        { path: '/api/health', method: 'GET' },
        { path: '/api/chat', method: 'GET' },
        { path: '/api/polaczek-chat', method: 'GET' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`\n🔍 Testing: ${PROD_URL}${endpoint.path}`);
            
            const response = await fetchApi(`${PROD_URL}${endpoint.path}`, {
                method: endpoint.method,
                headers: { 
                    'Content-Type': 'application/json',
                    'User-Agent': 'MyBonzo-Test-Script/1.0'
                }
            });
            
            const status = response.status;
            const ok = response.ok;
            
            console.log(`${ok ? '✅' : '❌'} Status: ${status} ${ok ? 'OK' : 'FAILED'}`);
            
            if (ok) {
                try {
                    const data = await response.json();
                    console.log('📄 Response:', JSON.stringify(data, null, 2));
                } catch (e) {
                    console.log('📄 Response: Non-JSON content');
                }
            } else {
                console.log('⚠️  Error response received');
            }
            
        } catch (error) {
            console.log(`❌ ERROR: ${error.message}`);
        }
    }
}

// Test POST functionality
async function testChatPost() {
    console.log('\n💬 Testing POST /api/chat...');
    
    try {
        const response = await fetchApi(`${PROD_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: 'Test message from production test script',
                model: 'qwen',
                language: 'pl'
            })
        });
        
        console.log(`Status: ${response.status} ${response.ok ? 'OK' : 'FAILED'}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Chat response received:', data.answer ? 'Yes' : 'No');
        }
    } catch (error) {
        console.log(`❌ Chat POST ERROR: ${error.message}`);
    }
}

// Test POLACZEK POST
async function testPolaczekPost() {
    console.log('\n🤖 Testing POST /api/polaczek-chat...');
    
    try {
        const response = await fetch(`${PROD_URL}/api/polaczek-chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: 'Cześć! Test połączenia z POLACZEK',
                model: 'qwen',
                language: 'pl'
            })
        });
        
        console.log(`Status: ${response.status} ${response.ok ? 'OK' : 'FAILED'}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('POLACZEK response received:', data.answer ? 'Yes' : 'No');
        }
    } catch (error) {
        console.log(`❌ POLACZEK POST ERROR: ${error.message}`);
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 MyBonzo Production Test Suite');
    console.log('=================================');
    console.log(`Testing: ${PROD_URL}`);
    console.log(`Time: ${new Date().toISOString()}\n`);
    
    await testEndpoints();
    await testChatPost();
    await testPolaczekPost();
    
    console.log('\n✨ Production tests completed!');
    console.log('\nNext steps:');
    console.log('1. Check browser console on live site for client-side logs');
    console.log('2. Test button functionality manually'); 
    console.log('3. Verify agent status and connections');
}

// Run tests if in Node.js environment
if (typeof window === 'undefined') {
    console.log('🔍 Starting Node.js test execution...');
    runAllTests().catch(console.error);
}

// Export for browser use
if (typeof window !== 'undefined') {
    window.MyBonzoProductionTest = {
        runAllTests,
        testEndpoints,
        testChatPost,
        testPolaczekPost
    };
}