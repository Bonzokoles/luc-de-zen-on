import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user') || 'anonymous';
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    const env = (locals as any)?.runtime?.env;
    
    const userHistory = await getUserImageHistory(env, userId, limit);
    
    return new Response(JSON.stringify({
      success: true,
      service: 'Image Generator - History',
      userId: userId,
      history: userHistory,
      totalImages: userHistory.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      service: 'Image Generator - History',
      error: error instanceof Error ? error.message : 'Nieznany błąd history'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function getUserImageHistory(env: any, userId: string, limit: number) {
  // Mock user history
  const mockHistory = [
    {
      id: 'img_001',
      prompt: 'A majestic dragon flying over a medieval castle',
      style: 'fantasy',
      size: '1024x1024',
      created: '2025-09-26T10:30:00Z',
      imageUrl: 'https://placeholder.mybonzo.com/dragon-castle.png',
      liked: true,
      downloads: 3
    },
    {
      id: 'img_002',
      prompt: 'Modern city skyline at sunset',
      style: 'realistic',
      size: '1024x768',
      created: '2025-09-25T15:45:00Z',
      imageUrl: 'https://placeholder.mybonzo.com/city-sunset.png',
      liked: false,
      downloads: 1
    },
    {
      id: 'img_003',
      prompt: 'Abstract geometric patterns in blue and gold',
      style: 'abstract',
      size: '512x512',
      created: '2025-09-24T09:15:00Z',
      imageUrl: 'https://placeholder.mybonzo.com/abstract-patterns.png',
      liked: true,
      downloads: 5
    },
    {
      id: 'img_004',
      prompt: 'Cute cartoon cat wearing a wizard hat',
      style: 'cartoon',
      size: '1024x1024',
      created: '2025-09-23T14:20:00Z',
      imageUrl: 'https://placeholder.mybonzo.com/wizard-cat.png',
      liked: true,
      downloads: 8
    },
    {
      id: 'img_005',
      prompt: 'Vintage 1950s diner scene',
      style: 'vintage',
      size: '1024x768',
      created: '2025-09-22T11:10:00Z',
      imageUrl: 'https://placeholder.mybonzo.com/vintage-diner.png',
      liked: false,
      downloads: 2
    }
  ];

  return mockHistory.slice(0, limit);
}