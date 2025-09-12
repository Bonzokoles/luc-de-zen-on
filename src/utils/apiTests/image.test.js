export async function testImageGeneration() {
  console.log('🧪 Testing Image Generation API...');
  
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Test image generation from API test',
        size: '512x512'
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Image Generation API test successful:', result);
      return { success: true, message: 'Image Generation API is working correctly' };
    } else {
      console.log('❌ Image Generation API test failed:', result);
      return { success: false, message: result.error || 'Image Generation API test failed' };
    }
  } catch (error) {
    console.log('❌ Image Generation API test error:', error);
    return { success: false, message: error.message };
  }
}
