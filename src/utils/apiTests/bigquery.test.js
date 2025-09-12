export async function testBigQuery() {
  console.log('🧪 Testing BigQuery API...');
  
  try {
    const response = await fetch('/api/bigquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'SELECT * FROM test LIMIT 5'
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ BigQuery API test successful:', result);
      return { success: true, message: 'BigQuery API is working correctly' };
    } else {
      console.log('❌ BigQuery API test failed:', result);
      return { success: false, message: result.error || 'BigQuery API test failed' };
    }
  } catch (error) {
    console.log('❌ BigQuery API test error:', error);
    return { success: false, message: error.message };
  }
}
