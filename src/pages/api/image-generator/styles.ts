import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const style = url.searchParams.get('style') || 'realistic';
    const size = url.searchParams.get('size') || '1024x1024';
    
    const env = (locals as any)?.runtime?.env;
    
    return new Response(JSON.stringify({
      success: true,
      service: 'Image Generator - Styles',
      availableStyles: [
        {
          name: 'realistic',
          description: 'Photorealistic images with high detail',
          examples: ['portrait', 'landscape', 'product photography']
        },
        {
          name: 'artistic',
          description: 'Creative artistic interpretations',
          examples: ['oil painting', 'watercolor', 'digital art']
        },
        {
          name: 'cartoon',
          description: 'Cartoon and animated style',
          examples: ['character design', 'illustration', 'comics']
        },
        {
          name: 'abstract',
          description: 'Abstract and conceptual art',
          examples: ['geometric', 'surreal', 'modern art']
        },
        {
          name: 'vintage',
          description: 'Retro and vintage aesthetics',
          examples: ['1950s style', 'film noir', 'vintage poster']
        }
      ],
      availableSizes: ['512x512', '1024x1024', '1024x768', '768x1024'],
      currentStyle: style,
      currentSize: size,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      service: 'Image Generator - Styles',
      error: error instanceof Error ? error.message : 'Nieznany błąd styles'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};