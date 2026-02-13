/**
 * CHUCK API - Analyze Endpoint
 * Analyzes workflows and returns DAG + scoring
 */

import type { APIRoute } from 'astro';
import { analyzeWorkflow } from '@/lib/mcp-server/index';
import type { AnalyzeRequest } from '@/lib/mcp-server/index';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as AnalyzeRequest;
    
    if (!body.workflow) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing workflow in request body'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await analyzeWorkflow(body);

    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('CHUCK analyze error:', error);
    
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

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      name: 'CHUCK Analyze API',
      version: '1.0.0',
      description: 'Workflow analysis and scoring endpoint',
      methods: ['POST'],
      usage: {
        endpoint: '/api/chuck/analyze',
        method: 'POST',
        body: {
          workflow: {
            id: 'string',
            name: 'string',
            nodes: 'array',
            connections: 'array'
          },
          options: {
            includeRecommendations: 'boolean',
            includeCompatibility: 'boolean',
            includeExecutionPlan: 'boolean'
          }
        }
      }
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
