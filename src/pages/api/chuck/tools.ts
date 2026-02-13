/**
 * CHUCK API - Tools Endpoint
 * Returns list of available AI tools
 */

import type { APIRoute } from 'astro';
import toolsData from '../../../lib/tools-extended.json';

// Cache the flattened tools array at module level for performance
let cachedTools: any[] | null = null;

function getAllTools(): any[] {
  if (!cachedTools) {
    cachedTools = [];
    Object.values(toolsData.categories).forEach((cat: any) => {
      cachedTools = cachedTools!.concat(cat.tools);
    });
  }
  return cachedTools;
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const category = url.searchParams.get('category');
    const type = url.searchParams.get('type');
    const minScoreParam = url.searchParams.get('minScore');
    const parsedMinScore = parseInt(minScoreParam || '0', 10);
    const minScore = Number.isNaN(parsedMinScore) ? 0 : parsedMinScore;

    let tools = getAllTools();

    // Apply filters
    if (category) {
      tools = tools.filter(t => t.category === category);
    }

    if (type) {
      tools = tools.filter(t => t.type === type);
    }

    if (minScore > 0) {
      tools = tools.filter(t => t.score >= minScore);
    }

    // Sort by score (highest first)
    tools.sort((a, b) => b.score - a.score);

    return new Response(
      JSON.stringify({
        success: true,
        total: tools.length,
        tools,
        categories: Object.keys(toolsData.categories),
        metadata: toolsData.metadata
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('CHUCK tools error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
