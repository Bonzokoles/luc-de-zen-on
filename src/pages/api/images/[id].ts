import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  const runtime = (locals as any)?.runtime;
  
  if (!runtime?.env?.IMAGES) {
    return new Response('R2 storage not configured', { status: 503 });
  }

  const imageId = params.id;
  if (!imageId) {
    return new Response('Image ID required', { status: 400 });
  }

  try {
    const object = await runtime.env.IMAGES.get(`${imageId}.png`);
    
    if (!object) {
      return new Response('Image not found', { status: 404 });
    }

    const imageData = await object.arrayBuffer();
    
    return new Response(imageData, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000', // 1 year cache
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('R2 retrieval error:', error);
    return new Response('Failed to retrieve image', { status: 500 });
  }
};
