import type { APIRoute } from 'astro';
import { createSuccessResponse, createErrorResponse, createOPTIONSHandler } from '../../../utils/corsUtils';

// Interface for stats data
interface StatsData {
  visitors: number;
  queries: number;
  uptime: string;
  responseTime: number;
  storage: number;
  bandwidth: number;
  timestamp: string;
}

// Mock function to get system uptime
function getSystemUptime(): string {
  const uptimeSeconds = process.uptime ? process.uptime() : Math.random() * 86400 * 15;
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

// Mock function to generate realistic stats
function generateStats(): StatsData {
  const baseVisitors = 1000;
  const baseQueries = 3500;
  const hourlyVariation = new Date().getHours() / 24; // Peak at noon
  const dailyBoost = Math.sin(hourlyVariation * Math.PI) * 0.3 + 1;

  return {
    visitors: Math.floor((baseVisitors + Math.random() * 500) * dailyBoost),
    queries: Math.floor((baseQueries + Math.random() * 1000) * dailyBoost),
    uptime: getSystemUptime(),
    responseTime: Math.floor(80 + Math.random() * 100), // 80-180ms
    storage: Number((1.5 + Math.random() * 2).toFixed(1)), // 1.5-3.5 GB
    bandwidth: Number((30 + Math.random() * 40).toFixed(1)), // 30-70 GB
    timestamp: new Date().toISOString()
  };
}

export const OPTIONS: APIRoute = createOPTIONSHandler(['GET', 'POST']);

export const GET: APIRoute = async ({ locals, request }) => {
  try {
    const env = (locals as any)?.runtime?.env;

    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // For development, allow without auth
      console.log('Warning: No authentication provided for admin stats');
    }

    // Try to get real data from KV store if available
    let stats: StatsData;

    try {
      if (env?.ADMIN_DATA) {
        const cachedStats = await env.ADMIN_DATA.get('current_stats');
        if (cachedStats) {
          const parsedStats = JSON.parse(cachedStats);
          // Check if data is fresh (less than 5 minutes old)
          const dataAge = Date.now() - new Date(parsedStats.timestamp).getTime();
          if (dataAge < 5 * 60 * 1000) {
            stats = parsedStats;
          } else {
            throw new Error('Stale data');
          }
        } else {
          throw new Error('No cached data');
        }
      } else {
        throw new Error('No KV store available');
      }
    } catch (err) {
      // Generate fallback stats
      stats = generateStats();

      // Try to cache the generated stats
      if (env?.ADMIN_DATA) {
        try {
          await env.ADMIN_DATA.put('current_stats', JSON.stringify(stats), {
            expirationTtl: 300 // 5 minutes
          });
        } catch (cacheErr) {
          console.error('Failed to cache stats:', cacheErr);
        }
      }
    }

    return createSuccessResponse(stats);

  } catch (error) {
    console.error('Error fetching admin stats:', error);

    // Return fallback data on error
    const fallbackStats = generateStats();
    return createSuccessResponse(fallbackStats);
  }
};

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const env = (locals as any)?.runtime?.env;

    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'update_stats':
        if (env?.ADMIN_DATA) {
          const updatedStats = {
            ...data,
            timestamp: new Date().toISOString()
          };

          await env.ADMIN_DATA.put('current_stats', JSON.stringify(updatedStats), {
            expirationTtl: 300
          });

          return createSuccessResponse({
            message: 'Stats updated successfully',
            stats: updatedStats
          });
        }
        break;

      case 'reset_stats':
        if (env?.ADMIN_DATA) {
          await env.ADMIN_DATA.delete('current_stats');
          return createSuccessResponse({ message: 'Stats reset successfully' });
        }
        break;

      default:
        return createErrorResponse('Invalid action', 400);
    }

    return createErrorResponse('Operation not supported', 500);

  } catch (error) {
    console.error('Error in admin stats POST:', error);
    return createErrorResponse('Internal server error', 500);
  }
};
