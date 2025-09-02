// Test script to verify AI Workers are configured properly
// This will check if demo responses are disabled and real workers are active

async function testWorkers() {
  console.log('🧪 Testing AI Workers Configuration...\n');

  const tests = [
    {
      name: 'Multi-AI Worker Direct Test',
      url: 'https://multi-ai-assistant.stolarnia-ams.workers.dev/qwen',
      method: 'POST',
      body: { message: 'Czy działasz poprawnie? Odpowiedz krótko.' }
    },
    {
      name: 'Local Chat API Test',
      url: 'http://localhost:4321/api/chat',
      method: 'POST',
      body: { prompt: 'Test connection - odpowiedz krótko' }
    },
    {
      name: 'AI Workers Manager List',
      url: 'http://localhost:4321/api/ai-workers?action=list',
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n📡 Testing: ${test.name}`);
      console.log(`URL: ${test.url}`);

      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(test.url, options);
      const data = await response.json();

      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        console.log('✅ SUCCESS');
        
        // Check for demo response indicators
        const responseText = JSON.stringify(data).toLowerCase();
        const hasDemoIndicators = responseText.includes('demo') || 
                                 responseText.includes('mock') || 
                                 responseText.includes('gpt-4') ||
                                 responseText.includes('chatbot pracuje w trybie demo');
        
        if (hasDemoIndicators) {
          console.log('⚠️  WARNING: Response contains demo indicators');
          console.log('Demo text found:', responseText.match(/(demo|mock|gpt-4|chatbot.*demo)/gi));
        } else {
          console.log('✅ No demo responses detected - using real AI');
        }
        
        console.log('Response preview:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
      } else {
        console.log('❌ FAILED');
        console.log('Error:', data);
      }

    } catch (error) {
      console.log('❌ ERROR');
      console.log('Error details:', error.message);
    }
  }

  console.log('\n🏁 Test completed!');
}

// Run tests
testWorkers().catch(console.error);
