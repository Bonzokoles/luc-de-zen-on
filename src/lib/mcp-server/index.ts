/**
 * MCP Server - Model Context Protocol Server
 * Provides /analyze endpoint for DAG analysis and workflow scoring
 */

import type { UniversalWorkflow } from '@/nodes/universal';
import { scoreWorkflow, detectCycles, getExecutionOrder, type Workflow, type WorkflowNode } from 'lib/workflowScoring';
import { validateWorkflow } from 'lib/compatibilityMatrix';
// @ts-ignore - JSON import
import toolsData from 'lib/tools-extended.json';

export interface AnalyzeRequest {
  workflow: UniversalWorkflow;
  options?: {
    includeRecommendations?: boolean;
    includeCompatibility?: boolean;
    includeExecutionPlan?: boolean;
  };
}

export interface AnalyzeResponse {
  success: boolean;
  workflow: {
    id: string;
    name: string;
    nodeCount: number;
    connectionCount: number;
  };
  score: {
    overall: number; // 0-100
    quality: number;
    compatibility: number;
  };
  dag: {
    isValid: boolean;
    hasCycles: boolean;
    cycles?: string[][];
    executionOrder?: string[];
  };
  recommendations?: string[];
  compatibility?: {
    averageScore: number;
    weakLinks: Array<{
      from: string;
      to: string;
      score: number;
    }>;
  };
  error?: string;
}

/**
 * Analyze workflow endpoint
 */
export async function analyzeWorkflow(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  const { workflow, options = {} } = request;

  try {
    // Extract tool information from workflow nodes
    const tools = workflow.nodes
      .filter((node: any) => node.type === 'AI_AGENT')
      .map((node: any) => {
        const toolId = (node as any).config?.toolId;
        
        // Find tool in tools-extended.json
        let toolInfo: any = null;
        for (const category of Object.values(toolsData.categories)) {
          toolInfo = (category as any).tools.find((t: any) => t.id === toolId);
          if (toolInfo) break;
        }

        return {
          id: toolId || node.id,
          type: toolInfo?.type || 'unknown',
          category: toolInfo?.category || 'unknown',
          score: toolInfo?.score || 70
        };
      });

    // Convert UniversalWorkflow to Workflow format for scoring
    const workflowGraph = {
      nodes: workflow.nodes.map((node: any) => {
        const toolId = (node as any).config?.toolId || node.id;
        const toolInfo = tools.find(t => t.id === toolId);
        return {
          id: node.id,
          toolId,
          type: toolInfo?.type || 'unknown',
          category: toolInfo?.category || 'unknown',
          config: (node as any).config
        };
      }),
      edges: workflow.connections.map(conn => ({
        from: conn.from,
        to: conn.to,
        weight: conn.weight
      }))
    };

    const cycleDetection = detectCycles(workflowGraph);
    const executionOrder = getExecutionOrder(workflowGraph);

    // Calculate workflow score
    const workflowScore = scoreWorkflow(workflowGraph, tools);

    // Calculate compatibility if requested
    let compatibilityInfo;
    if (options.includeCompatibility && tools.length > 1) {
      const toolSequence = tools.map(t => ({
        id: t.id,
        type: t.type,
        category: t.category
      }));

      const validation = validateWorkflow(toolSequence);
      compatibilityInfo = {
        averageScore: validation.averageScore,
        weakLinks: validation.weakLinks
      };
    }

    // Build response
    const response: AnalyzeResponse = {
      success: true,
      workflow: {
        id: workflow.id,
        name: workflow.name,
        nodeCount: workflow.nodes.length,
        connectionCount: workflow.connections.length
      },
      score: {
        overall: workflowScore.quality,
        quality: workflowScore.quality,
        compatibility: workflowScore.compatibilityScore
      },
      dag: {
        isValid: !cycleDetection.hasCycles,
        hasCycles: cycleDetection.hasCycles,
        cycles: cycleDetection.hasCycles ? cycleDetection.cycles : undefined,
        executionOrder: options.includeExecutionPlan ? executionOrder || undefined : undefined
      }
    };

    if (options.includeRecommendations) {
      response.recommendations = workflowScore.recommendations;
    }

    if (options.includeCompatibility && compatibilityInfo) {
      response.compatibility = compatibilityInfo;
    }

    return response;
  } catch (error) {
    return {
      success: false,
      workflow: {
        id: workflow.id,
        name: workflow.name,
        nodeCount: workflow.nodes.length,
        connectionCount: workflow.connections.length
      },
      score: {
        overall: 0,
        quality: 0,
        compatibility: 0
      },
      dag: {
        isValid: false,
        hasCycles: false
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * MCP Server HTTP handler
 */
export async function handleMCPRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // /analyze endpoint
  if (url.pathname === '/api/analyze' && request.method === 'POST') {
    try {
      const body = await request.json() as AnalyzeRequest;
      const result = await analyzeWorkflow(body);
      
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Invalid request'
        }),
        { status: 400, headers }
      );
    }
  }

  // /exec endpoint (CHUCK proxy)
  if (url.pathname === '/api/exec' && request.method === 'POST') {
    try {
      const body = await request.json();
      
      // In production, execute the AI tool
      // For now, return mock response
      return new Response(
        JSON.stringify({
          success: true,
          toolId: body.toolId,
          result: {
            message: `Tool ${body.toolId} executed successfully`,
            data: body.parameters
          }
        }),
        { status: 200, headers }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Execution failed'
        }),
        { status: 500, headers }
      );
    }
  }

  // Health check
  if (url.pathname === '/health') {
    return new Response(
      JSON.stringify({ status: 'ok', version: '1.0.0' }),
      { headers }
    );
  }

  return new Response(
    JSON.stringify({ error: 'Not found' }),
    { status: 404, headers }
  );
}

export default {
  analyzeWorkflow,
  handleMCPRequest
};
