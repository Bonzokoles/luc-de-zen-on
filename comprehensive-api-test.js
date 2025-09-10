// Comprehensive test of all AI Workers API endpoints
// Tests button functionality and verifies no demo responses

async function testAllAPIs() {
  console.log('🧪 COMPREHENSIVE AI WORKERS API TEST\n');
  
  const baseUrl = 'https://cef3269e.luc-de-zen-on.pages.dev';
  
  const tests = [
    {
      name: 'Chat API (Real AI)',
      url: `${baseUrl}/api/ai-bot-worker`,
      method: 'POST',
      body: { prompt: 'Powiedz krótko dzień dobry' },
      expectStatus: 200,
      expectReal: true
    },
    {
      name: 'Image Generator API',
      url: `${baseUrl}/api/generate-image`,
      method: 'POST', 
      body: { prompt: 'beautiful sunset' },
      expectStatus: [200, 503],
      checkFor: ['success', 'error']
    },
    {
      name: 'BigQuery API',
      url: `${baseUrl}/api/bigquery`,
      method: 'GET',
      expectStatus: 503,
      expectError: 'nie jest skonfigurowane'
    },
    {
      name: 'Kaggle API', 
      url: `${baseUrl}/api/kaggle`,
      method: 'GET',
      expectStatus: 503,
      expectError: 'nie jest skonfigurowane'
    },
    {
      name: 'Tavily Search API',
      url: `${baseUrl}/api/tavi`,
      method: 'GET',
      params: { query: 'AI technology' },
      expectStatus: 503,
      expectError: 'nie jest skonfigurowane'
    },
    {
      name: 'AI Workers Manager',
      url: `${baseUrl}/api/ai-workers?action=list`,
      method: 'GET',
      expectStatus: 200,
      expectReal: true
    }
  ];

  let allPassed = true;
  let demoDetected = false;

  for (const test of tests) {
    try {
      console.log(`\n📡 Testing: ${test.name}`);
      
      // Build URL with params
      let testUrl = test.url;
      if (test.params) {
        const params = new URLSearchParams(test.params);
        testUrl += `?${params}`;
      }
      
      const options = {
        method: test.method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(testUrl, options);
      
      if (!response.ok) {
        console.log(`   ❌ HTTP ${response.status}: ${response.statusText}`);
        const text = await response.text();
        console.log(`   📄 Response: ${text.substring(0, 200)}...`);
        allPassed = false;
        continue;
      }
      
      const text = await response.text();
      console.log(`   📄 Raw response: ${text.substring(0, 200)}...`);
      
      try {
        const data = JSON.parse(text);
        console.log(`   Status: ${response.status}`);
      } catch (parseError) {
        console.log(`   ❌ JSON Parse Error: ${parseError.message}`);
        allPassed = false;
        continue;
      }
      const expectedStatuses = Array.isArray(test.expectStatus) ? test.expectStatus : [test.expectStatus];
      const statusOK = expectedStatuses.includes(response.status);
      
      if (statusOK) {
        console.log('   ✅ Status OK');
      } else {
        console.log(`   ❌ Status FAIL - Expected ${test.expectStatus}, got ${response.status}`);
        allPassed = false;
      }

      // Check for demo indicators
      const responseText = JSON.stringify(data).toLowerCase();
      const demoIndicators = [
        'demo',
        'mock',
        'sample data',
        'tryb demo',
        'example.com',
        'placeholder',
        'fake',
        'simulation'
      ];
      
      const foundDemo = demoIndicators.some(indicator => 
        responseText.includes(indicator) && !responseText.includes('nie jest skonfigurowane')
      );
      
      if (foundDemo) {
        console.log('   ⚠️  WARNING: Demo content detected!');
        console.log(`   Demo indicators: ${demoIndicators.filter(i => responseText.includes(i))}`);
        demoDetected = true;
      } else if (test.expectReal) {
        console.log('   ✅ Real API response (no demo content)');
      } else {
        console.log('   ✅ Proper error response (no demo fallback)');
      }

      // Check for expected error messages  
      if (test.expectError && responseText.includes(test.expectError.toLowerCase())) {
        console.log('   ✅ Expected error message found');
      } else if (test.expectError) {
        console.log(`   ❌ Expected error "${test.expectError}" not found`);
        allPassed = false;
      }

      // Check response content
      if (test.checkFor) {
        const hasRequired = test.checkFor.some(keyword => 
          responseText.includes(keyword.toLowerCase())
        );
        if (hasRequired) {
          console.log('   ✅ Required content found');
        } else {
          console.log(`   ❌ Required content missing: ${test.checkFor}`);
          allPassed = false;
        }
      }

      // Show response preview
      const preview = JSON.stringify(data, null, 2).substring(0, 150) + '...';
      console.log(`   Preview: ${preview}`);

    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      allPassed = false;
    }
  }

  // Final results
  console.log('\n🏁 TEST RESULTS SUMMARY');
  console.log('========================');
  
  if (allPassed && !demoDetected) {
    console.log('✅ ALL TESTS PASSED');
    console.log('✅ NO DEMO RESPONSES DETECTED');
    console.log('✅ APIs properly require configuration');
    console.log('✅ Real AI responses working');
  } else {
    console.log('❌ SOME TESTS FAILED');
    if (demoDetected) {
      console.log('❌ Demo content still detected in responses');
    }
    if (!allPassed) {
      console.log('❌ Status or content checks failed');
    }
  }

  return { allPassed, demoDetected };
}

// Run the comprehensive test
testAllAPIs().then(results => {
  console.log('\n📊 Final Status:', results.allPassed && !results.demoDetected ? 'SUCCESS' : 'NEEDS FIXING');
}).catch(console.error);
