/**
 * Przykłady użycia Workers API - gotowe funkcje do testowania
 * Korzysta z centralnego modułu cloudflareApi.ts
 */

import { fetchFromWorker, postToWorker, getFromWorker } from '../cloudflareApi';

/**
 * Test prostego endpointu Workers
 */
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
      return { success: true, message: 'Chat API is working correctly', data: result };
    } else {
      console.log('❌ Chat API test failed:', result);
      return { success: false, message: result.error || 'Chat API test failed' };
    }
  } catch (error) {
    console.log('❌ Chat API test error:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Test wysyłania wiadomości do AI chatbota
 */
export async function testAIBot(message: string = 'Test message') {
  console.log('🤖 Testing AI Bot API...');
  
  try {
    const response = await fetch('/api/ai-bot-worker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        context: 'test'
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ AI Bot API test successful:', result);
      return { success: true, message: 'AI Bot API is working correctly', data: result };
    } else {
      console.log('❌ AI Bot API test failed:', result);
      return { success: false, message: result.error || 'AI Bot API test failed' };
    }
  } catch (error) {
    console.log('❌ AI Bot API test error:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Test generowania obrazów
 */
export async function testImageGeneration(prompt: string = 'beautiful landscape') {
  console.log('🎨 Testing Image Generation API...');
  
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        size: '512x512'
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Image Generation API test successful:', result);
      return { success: true, message: 'Image Generation API is working correctly', data: result };
    } else {
      console.log('❌ Image Generation API test failed:', result);
      return { success: false, message: result.error || 'Image Generation API test failed' };
    }
  } catch (error) {
    console.log('❌ Image Generation API test error:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Test Kaggle API
 */
export async function testKaggleAPI(search: string = 'machine learning') {
  console.log('📊 Testing Kaggle API...');
  
  try {
    const response = await fetch('/api/kaggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search: search
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Kaggle API test successful:', result);
      return { success: true, message: 'Kaggle API is working correctly', data: result };
    } else {
      console.log('❌ Kaggle API test failed:', result);
      return { success: false, message: result.error || 'Kaggle API test failed' };
    }
  } catch (error) {
    console.log('❌ Kaggle API test error:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Test Tavily Search API
 */
export async function testTavilyAPI(query: string = 'AI technology') {
  console.log('🔍 Testing Tavily Search API...');
  
  try {
    const response = await fetch('/api/tavi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Tavily API test successful:', result);
      return { success: true, message: 'Tavily API is working correctly', data: result };
    } else {
      console.log('❌ Tavily API test failed:', result);
      return { success: false, message: result.error || 'Tavily API test failed' };
    }
  } catch (error) {
    console.log('❌ Tavily API test error:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Test wszystkich API po kolei
 */
export async function testAllAPIs() {
  console.log('🚀 Testowanie wszystkich API...');
  
  const results = {
    chat: null as any,
    aiBot: null as any,
    imageGen: null as any,
    kaggle: null as any,
    tavily: null as any,
    errors: [] as string[]
  };

  // Test Chat API
  try {
    results.chat = await testChatAPI();
  } catch (error) {
    results.errors.push(`Chat API: ${error}`);
  }

  // Test AI Bot
  try {
    results.aiBot = await testAIBot('Cześć! To jest test.');
  } catch (error) {
    results.errors.push(`AI Bot: ${error}`);
  }

  // Test Image Generation
  try {
    results.imageGen = await testImageGeneration('futuristic city');
  } catch (error) {
    results.errors.push(`Image Gen: ${error}`);
  }

  // Test Kaggle
  try {
    results.kaggle = await testKaggleAPI('deep learning');
  } catch (error) {
    results.errors.push(`Kaggle: ${error}`);
  }

  // Test Tavily
  try {
    results.tavily = await testTavilyAPI('artificial intelligence news');
  } catch (error) {
    results.errors.push(`Tavily: ${error}`);
  }

  console.log('🏁 Test zakończony. Wyniki:', results);
  return results;
}

/**
 * Funkcje globalne dla łatwego testowania w konsoli
 */
if (typeof window !== 'undefined') {
  (window as any).testAPIs = {
    chat: testChatAPI,
    aiBot: testAIBot,
    imageGen: testImageGeneration,
    kaggle: testKaggleAPI,
    tavily: testTavilyAPI,
    all: testAllAPIs
  };
  
  console.log('🔧 API testy dostępne globalnie:', 
    'window.testAPIs.chat(), window.testAPIs.aiBot(), window.testAPIs.all()');
}
