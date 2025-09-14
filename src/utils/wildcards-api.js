/**
 * API integration for wildcards and image generation
 * Integrates with work_page Flask backend
 */

// Configuration
const API_BASE_URL = 'http://localhost:5000';

// Wildcards API functions
export async function loadWildcards() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wildcards/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading wildcards:', error);
    // Return mock data as fallback
    return getMockWildcardsData();
  }
}

export async function processWildcards(prompt, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wildcards/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        enhance: options.enhance || false,
        enhancement_level: options.enhancement_level || 'medium'
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error processing wildcards:', error);
    return { processed_prompt: prompt };
  }
}

export async function generateRandomPrompt(template = null) {
  try {
    const url = new URL(`${API_BASE_URL}/api/wildcards/random`);
    if (template) {
      url.searchParams.append('template', template);
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating random prompt:', error);
    return { random_prompt: 'beautiful landscape painting' };
  }
}

// Image generation API
export async function generateImage(options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: options.prompt,
        model: options.model || 'realistic_vision',
        process_wildcards: options.process_wildcards || true,
        enhance_prompt: options.enhance_prompt || false,
        enhancement_level: options.enhancement_level || 'medium'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating image:', error);
    // Return mock image for demo
    return {
      success: true,
      image: `https://picsum.photos/512/512?random=${Date.now()}`,
      processed_prompt: options.prompt,
      model: options.model || 'demo',
      source: 'fallback'
    };
  }
}

// Health check
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      return { status: 'error', backend_available: false };
    }
    return await response.json();
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { status: 'error', backend_available: false };
  }
}

// Mock data for fallback
function getMockWildcardsData() {
  return {
    artists: {
      name: 'Artyści',
      icon: '🎨',
      items: [
        'Greg Rutkowski', 'Artgerm', 'Charlie Bowater', 'Makoto Shinkai',
        'Studio Ghibli', 'Boris Vallejo', 'Frank Frazetta', 'H.R. Giger',
        'Salvador Dali', 'Van Gogh', 'Leonardo da Vinci', 'Picasso',
        'Zdzisław Beksiński', 'Simon Stalenhag', 'Alex Grey', 'MC Escher'
      ]
    },
    creatures: {
      name: 'Stworzenia',
      icon: '🐉',
      items: [
        'dragon', 'phoenix', 'unicorn', 'griffin', 'wolf', 'eagle',
        'tiger', 'lion', 'bear', 'shark', 'whale', 'dolphin',
        'serpent', 'raven', 'butterfly', 'spider'
      ]
    },
    castle: {
      name: 'Zamki i Budynki',
      icon: '🏰',
      items: [
        'medieval castle', 'gothic cathedral', 'ancient temple', 'fortress',
        'tower', 'palace', 'ruins', 'monastery', 'citadel', 'stronghold',
        'watchtower', 'keep', 'battlements', 'drawbridge'
      ]
    },
    styles: {
      name: 'Style Artystyczne',
      icon: '🎭',
      items: [
        'cyberpunk', 'steampunk', 'fantasy art', 'concept art', 'digital painting',
        'oil painting', 'watercolor', 'pencil sketch', 'anime style', 'photorealistic',
        'abstract', 'surreal', 'gothic', 'art nouveau', 'minimalist', 'impressionist'
      ]
    },
    lighting: {
      name: 'Oświetlenie',
      icon: '💡',
      items: [
        'dramatic lighting', 'soft lighting', 'neon lights', 'golden hour',
        'blue hour', 'candlelight', 'moonlight', 'sunlight', 'studio lighting',
        'volumetric lighting', 'rim lighting', 'backlighting'
      ]
    }
  };
}

// Utility functions
export function isBackendAvailable() {
  return checkBackendHealth().then(health => health.backend_available);
}

export function formatPrompt(prompt, wildcards = []) {
  let formattedPrompt = prompt;
  
  // Add wildcards to prompt if provided
  if (wildcards.length > 0) {
    formattedPrompt += ', ' + wildcards.join(', ');
  }
  
  return formattedPrompt;
}

// Export default object with all functions
export default {
  loadWildcards,
  processWildcards,
  generateRandomPrompt,
  generateImage,
  checkBackendHealth,
  isBackendAvailable,
  formatPrompt,
  getMockWildcardsData
};
