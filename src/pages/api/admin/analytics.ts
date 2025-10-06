import type { APIRoute } from 'astro';
import { createSuccessResponse, createErrorResponse, createOPTIONSHandler } from '@/utils/corsUtils';

export const OPTIONS = createOPTIONSHandler(['GET']);

export const GET: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const hasAuth = authHeader.includes('HAOS77');

    const analytics = {
      realTimeUsers: 7,
      totalSessions: 18425,
      bounceRate: 36.4,
      avgSessionDuration: 327,
      time: new Date().toISOString(),
      demoAuth: hasAuth
    };

    return createSuccessResponse(analytics);
  } catch (e) {
    console.error('analytics error', e);
    return createErrorResponse('Failed to load analytics', 500);
  }
};
