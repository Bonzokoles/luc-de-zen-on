// Voice AI Management API Endpoints
// REST API dla zarządzania konfiguracją głosów

import type { APIRoute } from 'astro';
import { voiceAIService, type VoiceRequest } from '../../lib/voice-ai-service';
import { voiceConfigManager, type VoiceProfile, type AgentVoiceMapping } from '../../lib/voice-ai-config';

export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URL(url).searchParams;
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'profiles':
        return new Response(JSON.stringify({
          success: true,
          data: voiceConfigManager.getAllVoiceProfiles(),
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'mappings':
        return new Response(JSON.stringify({
          success: true,
          data: voiceConfigManager.getAgentMappings(),
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'stats':
        const stats = voiceConfigManager.getVoiceUsageStats();
        const queueStatus = voiceAIService.getQueueStatus();
        
        return new Response(JSON.stringify({
          success: true,
          data: {
            profiles: stats,
            queue: queueStatus,
            uptime: Date.now()
          },
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'config':
        return new Response(JSON.stringify({
          success: true,
          data: voiceConfigManager.getConfiguration(),
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({
          success: true,
          message: 'Voice AI Management API',
          endpoints: {
            'GET ?action=profiles': 'Get all voice profiles',
            'GET ?action=mappings': 'Get agent voice mappings',
            'GET ?action=stats': 'Get usage statistics',
            'GET ?action=config': 'Get full configuration',
            'POST': 'Text-to-speech synthesis',
            'PUT': 'Update configuration',
            'DELETE': 'Remove voice profile'
          },
          version: '1.0.0',
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error: any) {
    console.error('❌ Voice AI GET error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to process voice AI request',
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as any;
    const { action, ...data } = body;

    switch (action) {
      case 'synthesize':
        const voiceRequest: VoiceRequest = {
          text: data.text,
          agentId: data.agentId,
          context: data.context || 'response',
          language: data.language,
          priority: data.priority || 5,
          sessionId: data.sessionId,
          userId: data.userId
        };

        // Walidacja
        if (!voiceRequest.text || !voiceRequest.agentId) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Missing required fields: text, agentId'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const startTime = Date.now();
        
        let result;
        if (data.useQueue && (voiceRequest.priority ?? 5) < 8) {
          // Użyj kolejki dla niskiego priorytetu
          const queueId = await voiceAIService.queueTextToSpeech(voiceRequest);
          result = {
            queueId,
            message: 'Request added to queue',
            status: 'queued'
          };
        } else {
          // Natychmiastowa synteza
          result = await voiceAIService.textToSpeech(voiceRequest);
        }

        const processingTime = Date.now() - startTime;

        return new Response(JSON.stringify({
          success: true,
          data: result,
          processingTime,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Processing-Time': processingTime.toString()
          }
        });

      case 'queue-cleanup':
        voiceAIService.cleanupQueue();
        return new Response(JSON.stringify({
          success: true,
          message: 'Queue cleaned up',
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Unknown action. Supported: synthesize, queue-cleanup'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

  } catch (error: any) {
    console.error('❌ Voice AI POST error:', error);
    
    let statusCode = 500;
    let errorMessage = 'Internal voice AI error';

    if (error?.message?.includes('Text too long')) {
      statusCode = 400;
      errorMessage = 'Text exceeds maximum length';
    } else if (error?.message?.includes('No voice profile')) {
      statusCode = 404;
      errorMessage = 'Voice profile not found for agent';
    } else if (error?.message?.includes('API key not configured')) {
      statusCode = 503;
      errorMessage = 'Voice service not properly configured';
    }

    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as any;
    const { action, ...data } = body;

    switch (action) {
      case 'update-profile':
        if (!data.profileId) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Missing profileId'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const updated = voiceConfigManager.updateVoiceProfile(data.profileId, data.updates);
        
        if (!updated) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Voice profile not found'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        await voiceConfigManager.saveConfiguration();

        return new Response(JSON.stringify({
          success: true,
          message: 'Voice profile updated',
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'update-mapping':
        if (!data.agentId) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Missing agentId'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const mappingUpdated = voiceConfigManager.updateAgentMapping(data.agentId, data.updates);
        
        if (!mappingUpdated) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Agent mapping not found'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        await voiceConfigManager.saveConfiguration();

        return new Response(JSON.stringify({
          success: true,
          message: 'Agent voice mapping updated',
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'update-global':
        voiceConfigManager.updateGlobalSettings(data.settings);
        await voiceConfigManager.saveConfiguration();

        return new Response(JSON.stringify({
          success: true,
          message: 'Global voice settings updated',
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Unknown action. Supported: update-profile, update-mapping, update-global'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

  } catch (error: any) {
    console.error('❌ Voice AI PUT error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update voice configuration',
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as any;
    const { profileId } = body;

    if (!profileId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing profileId'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const removed = voiceConfigManager.removeVoiceProfile(profileId);
    
    if (!removed) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Voice profile not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await voiceConfigManager.saveConfiguration();

    return new Response(JSON.stringify({
      success: true,
      message: 'Voice profile removed',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('❌ Voice AI DELETE error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to remove voice profile',
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};