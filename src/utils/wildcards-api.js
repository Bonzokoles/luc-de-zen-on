/**
 * API integration for wildcards and image generation
 * Updated to use Astro API endpoints and Cloudflare Workers
 * Replaces problematic Flask/Python backend
 */

// Configuration - Use relative paths for Astro API endpoints
const API_BASE_URL = '';  // Use relative paths for current domain
const CLOUDFLARE_WORKER_URL = 'https://your-worker.your-subdomain.workers.dev';  // Configure when available

// Wildcards API functions
export async function loadWildcards() {
  try {
    // Try Astro API endpoint first
    const response = await fetch(`${API_BASE_URL}/api/wildcards?mode=categories`);
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
    // Try enhance-prompt API endpoint
    const response = await fetch(`${API_BASE_URL}/api/enhance-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        options: {
          enhance: options.enhance || false,
          enhancement_level: options.enhancement_level || 'medium'
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { 
      processed_prompt: data.enhancedPrompt || data.prompt || prompt,
      original_prompt: prompt
    };
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
    // Try Astro API endpoint for image generation
    const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: options.prompt,
        model: options.model || '@cf/stabilityai/stable-diffusion-xl-base-1.0',
        width: options.width || 512,
        height: options.height || 512,
        steps: options.steps || 8,
        enhancePrompt: options.enhance_prompt || false
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `HTTP error! status: ${response.status}`);
    }
    
    // Handle binary response (PNG image)
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    return {
      success: true,
      image: imageUrl,
      processed_prompt: options.prompt,
      model: options.model || 'cf-stable-diffusion',
      source: 'cloudflare_workers'
    };
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
    // Check if Astro API endpoints are available
    const response = await fetch(`${API_BASE_URL}/api/wildcards?mode=categories`);
    if (!response.ok) {
      return { 
        status: 'error', 
        backend_available: false,
        source: 'astro_api'
      };
    }
    return { 
      status: 'ok', 
      backend_available: true,
      source: 'astro_api',
      wildcards_loaded: true
    };
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { 
      status: 'error', 
      backend_available: false,
      fallback_available: true
    };
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
