export async function testChatAPI() {
  console.log('🧪 Testing Chat API...');
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Test message from API test',
        model: 'gpt-3.5-turbo'
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Chat API test successful:', result);
      return { success: true, message: 'Chat API is working correctly' };
    } else {
      console.log('❌ Chat API test failed:', result);
      return { success: false, message: result.error || 'Chat API test failed' };
    }
  } catch (error) {
    console.log('❌ Chat API test error:', error);
    return { success: false, message: error.message };
  }
}
