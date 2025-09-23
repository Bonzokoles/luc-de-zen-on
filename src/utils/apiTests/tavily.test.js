export async function testTavily() {
  console.log('🧪 Testing Tavily API...');
  
  try {
    const response = await fetch('/api/tavi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'artificial intelligence'
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Tavily API test successful:', result);
      return { success: true, message: 'Tavily API is working correctly' };
    } else {
      console.log('❌ Tavily API test failed:', result);
      return { success: false, message: result.error || 'Tavily API test failed' };
    }
  } catch (error) {
    console.log('❌ Tavily API test error:', error);
    return { success: false, message: error.message };
  }
}
