export async function testAIBot() {
  console.log('🧪 Testing AI Bot API...');
  
  try {
    const response = await fetch('/api/ai-bot-worker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Test message for AI bot',
        context: 'test'
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ AI Bot API test successful:', result);
      return { success: true, message: 'AI Bot API is working correctly' };
    } else {
      console.log('❌ AI Bot API test failed:', result);
      return { success: false, message: result.error || 'AI Bot API test failed' };
    }
  } catch (error) {
    console.log('❌ AI Bot API test error:', error);
    return { success: false, message: error.message };
  }
}
