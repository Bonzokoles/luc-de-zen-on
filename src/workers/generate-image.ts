export interface Env {
  AI: any;
  IMAGES: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Enhanced CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // POST /api/generate - Enhanced image generation based on user's code
      if (request.method === "POST" && path === "/api/generate") {
        const { prompt, width, height, steps, style, model } = await request.json() as {
          prompt: string;
          width?: number;
          height?: number;
          steps?: number;
          style?: string;
          model?: string;
        };

        // Enhanced validation (from user's example)
        if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
          return new Response(JSON.stringify({ 
            error: "Prompt musi mieæ co najmniej 5 znaków",
            success: false 
          }), { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          });
        }

        // Enhanced parameters with validation (from user's example)
        const imageWidth = Math.min(Math.max(width || 512, 256), 1024);
        const imageHeight = Math.min(Math.max(height || 512, 256), 1024);
        const inferenceSteps = Math.min(Math.max(steps || 8, 1), 20);
        const selectedModel = model || "@cf/black-forest-labs/flux-1-schnell";

        // Enhanced prompt with style (from user's example)
        let styledPrompt = prompt.trim();
        if (style && typeof style === "string" && style.trim().length > 0) {
          styledPrompt = `${prompt}, w stylu ${style.trim()}`;
        }

        // Enhanced parameters for AI model
        const aiParams = {
          prompt: styledPrompt,
          width: imageWidth,
          height: imageHeight,
          steps: inferenceSteps
        };

        console.log(' Generating image with enhanced params:', aiParams);

        // Generate image using Cloudflare Workers AI (from user's example)
        const result = await env.AI.run(selectedModel, aiParams);

        // Process result and create unique ID for storage
        const imageId = crypto.randomUUID();
        const timestamp = new Date().toISOString();
        
        // Handle different result formats from Cloudflare AI
        let imageData: string;
        let mimeType = 'image/png';
        
        if (result instanceof ArrayBuffer) {
          // Convert ArrayBuffer to base64
          const bytes = new Uint8Array(result);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          imageData = btoa(binary);
        } else if (typeof result === 'string') {
          // Handle base64 string
          imageData = result.startsWith('data:') ? 
            result.split(',')[1] : result;
        } else {
          imageData = result;
        }

        // Store image metadata in KV for gallery and downloads
        const imageMetadata = {
          id: imageId,
          prompt: styledPrompt,
          originalPrompt: prompt,
          style: style || null,
          model: selectedModel,
          parameters: {
            width: imageWidth,
            height: imageHeight,
            steps: inferenceSteps
          },
          created_at: timestamp,
          mime_type: mimeType,
          size: imageData.length
        };

        // Save to KV storage for persistence
        if (env.IMAGES) {
          await env.IMAGES.put(`image:${imageId}`, JSON.stringify(imageMetadata));
          await env.IMAGES.put(`data:${imageId}`, imageData);
        }

        // Return enhanced response with download capabilities
        return new Response(JSON.stringify({
          success: true,
          image: {
            id: imageId,
            prompt: styledPrompt,
            originalPrompt: prompt,
            style: style || null,
            data_url: `data:${mimeType};base64,${imageData}`,
            download_url: `/api/image/${imageId}/download`,
            parameters: {
              width: imageWidth,
              height: imageHeight,
              steps: inferenceSteps,
              model: selectedModel
            },
            metadata: imageMetadata
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // GET /api/image/{id}/download - Download image to device
      if (request.method === 'GET' && path.startsWith('/api/image/') && path.endsWith('/download')) {
        const imageId = path.split('/')[3];
        
        if (!imageId) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Image ID is required'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Get image data and metadata from KV
        const metadataJson = await env.IMAGES?.get(`image:${imageId}`);
        const imageData = await env.IMAGES?.get(`data:${imageId}`);

        if (!metadataJson || !imageData) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Image not found'
          }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const metadata = JSON.parse(metadataJson);
        
        // Convert base64 to binary for download
        const binaryString = atob(imageData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Generate descriptive filename
        const cleanPrompt = metadata.originalPrompt
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '_')
          .substring(0, 30);
        
        const timestamp = new Date(metadata.created_at).toISOString().split('T')[0];
        const filename = `mybonzo_ai_${cleanPrompt}_${timestamp}_${imageId.substring(0, 8)}.png`;

        return new Response(bytes, {
          headers: {
            ...corsHeaders,
            'Content-Type': metadata.mime_type,
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': bytes.length.toString(),
            'Cache-Control': 'public, max-age=31536000'
          }
        });
      }

      // GET /api/image/{id}/view - View image inline
      if (request.method === 'GET' && path.startsWith('/api/image/') && path.endsWith('/view')) {
        const imageId = path.split('/')[3];
        
        const imageData = await env.IMAGES?.get(`data:${imageId}`);
        const metadataJson = await env.IMAGES?.get(`image:${imageId}`);

        if (!imageData || !metadataJson) {
          return new Response('Image not found', { status: 404 });
        }

        const metadata = JSON.parse(metadataJson);
        
        // Convert base64 to binary
        const binaryString = atob(imageData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        return new Response(bytes, {
          headers: {
            ...corsHeaders,
            'Content-Type': metadata.mime_type,
            'Cache-Control': 'public, max-age=31536000'
          }
        });
      }

      // GET /api/images/gallery - Get recent images gallery
      if (request.method === 'GET' && path === '/api/images/gallery') {
        const limit = parseInt(url.searchParams.get('limit') || '12');
        
        const listResult = await env.IMAGES?.list({ prefix: 'image:', limit });
        
        if (!listResult) {
          return new Response(JSON.stringify({
            success: true,
            images: [],
            message: 'No images found'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const images = await Promise.all(
          listResult.keys.map(async (key) => {
            const metadataJson = await env.IMAGES?.get(key.name);
            if (metadataJson) {
              const metadata = JSON.parse(metadataJson);
              return {
                ...metadata,
                download_url: `/api/image/${metadata.id}/download`,
                view_url: `/api/image/${metadata.id}/view`,
                thumbnail_url: `/api/image/${metadata.id}/view`
              };
            }
            return null;
          })
        );

        return new Response(JSON.stringify({
          success: true,
          images: images.filter(img => img !== null).reverse(), // Newest first
          total: images.length
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        error: "Endpoint not found. Available: POST /api/generate, GET /api/images/gallery",
        success: false 
      }), { 
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (error) {
      console.error(' Enhanced image generation error:', error);
      return new Response(JSON.stringify({
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Nieznany b³¹d',
        success: false
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
