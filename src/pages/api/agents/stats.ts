import type { APIRoute } from 'astro';
import { createSuccessResponse, createErrorResponse } from '@/utils/corsUtils';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = locals.runtime.env;

    // Pobierz statystyki wszystkich agentów
    const agentIds = ['mybonzo', 'polaczek', 'bielik', 'assistant'];
    let totalMessages = 0;
    let totalImages = 0;
    let totalTasks = 0;

    for (const agentId of agentIds) {
      try {
        const statsKey = `agent_stats_${agentId}`;
        const stats = await env.AI_AGENTS?.get(statsKey);
        if (stats) {
          const agentStats = JSON.parse(stats);
          totalMessages += agentStats.messagesCount || 0;
          totalImages += agentStats.imagesGenerated || 0;
          totalTasks += agentStats.tasksCompleted || 0;
        }
      } catch (error) {
        console.warn(`Could not fetch stats for ${agentId}:`, error);
      }
    }

    return createSuccessResponse({
      success: true,
      totalMessages,
      imagesGenerated: totalImages,
      tasksCompleted: totalTasks,
      activeAgents: agentIds.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Stats error:", error);
    return createErrorResponse("Internal server error", 500);
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
