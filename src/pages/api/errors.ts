import type { APIRoute } from 'astro';
import { createSuccessResponse, createErrorResponse, createOPTIONSHandler } from '../../utils/corsUtils';

export const OPTIONS = createOPTIONSHandler(['GET', 'POST']);

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Mock error data dla demonstracji
    const errors = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 30000).toISOString(),
        level: 'warning',
        message: 'High memory usage detected',
        source: 'system',
        details: 'Memory usage at 85%'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 120000).toISOString(),
        level: 'error',
        message: 'Failed API request to external service',
        source: 'api',
        details: 'Timeout after 30s'
      }
    ].slice(0, limit);

    return createSuccessResponse({
      errors,
      total: errors.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Errors API error:', error);
    return createErrorResponse('Failed to fetch errors', 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'clear') {
      // Mock clearing errors
      return createSuccessResponse({
        success: true,
        message: 'Errors cleared',
        timestamp: new Date().toISOString()
      });
    }

    return createErrorResponse('Unknown action', 400);
    
  } catch (error) {
    console.error('Clear errors error:', error);
    return createErrorResponse('Failed to clear errors', 500);
  }
};