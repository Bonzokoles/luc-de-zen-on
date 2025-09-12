export async function testKaggle() {
  console.log('🧪 Testing Kaggle API...');
  
  try {
    const response = await fetch('/api/kaggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search: 'machine learning'
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Kaggle API test successful:', result);
      return { success: true, message: 'Kaggle API is working correctly' };
    } else {
      console.log('❌ Kaggle API test failed:', result);
      return { success: false, message: result.error || 'Kaggle API test failed' };
    }
  } catch (error) {
    console.log('❌ Kaggle API test error:', error);
    return { success: false, message: error.message };
  }
}
