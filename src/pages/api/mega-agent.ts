// API Endpoint dla Mega Agent Orchestrator
// Bielik 11B v2.6 jako główny koordynator wszystkich agentów AI

import type { APIRoute } from 'astro';
import { megaAgentOrchestrator, type MegaAgentRequest, type MegaAgentResponse } from '../../lib/mega-agent-orchestrator';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    status: 'active',
    orchestrator: 'Bielik-11B-v2.6-Instruct',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    availableAgents: [
      'gemma-3-12b',
      'llama-3.3-70b', 
      'claude-sonnet-4.5',
      'gpt-4',
      'deepseek-coder',
      'mistral-7b',
      'polaczek-agent',
      'bielik-guard'
    ],
    message: 'Mega Agent Orchestrator ready to coordinate AI tasks'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const body = await request.json() as any;
    const { task, priority = 'balanced', context, requireSpecialist, maxAgents = 3, userId, sessionId } = body;

    // Validate input
    if (!task || typeof task !== 'string' || task.trim().length === 0) {
      return new Response(JSON.stringify({
        error: 'Task is required and must be a non-empty string'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log orchestration request
    console.log(`🧠 Mega Agent Request:`, {
      task: task.substring(0, 100) + '...',
      priority,
      userId,
      timestamp: new Date().toISOString()
    });

    // Prepare orchestrator request
    const orchestratorRequest: MegaAgentRequest = {
      task: task.trim(),
      priority,
      context,
      requireSpecialist,
      maxAgents: Math.min(maxAgents, 5), // Cap at 5 agents max
      userId,
      sessionId
    };

    // Start timer for performance tracking
    const startTime = Date.now();

    // Process through Bielik Orchestrator
    const orchestratorResponse: MegaAgentResponse = await megaAgentOrchestrator.processRequest(orchestratorRequest);

    // Calculate total processing time
    const totalTime = Date.now() - startTime;

    // Log orchestration results
    console.log(`✅ Mega Agent Response:`, {
      selectedAgents: orchestratorResponse.orchestratorDecision.selectedAgents,
      strategy: orchestratorResponse.orchestratorDecision.strategy,
      confidence: orchestratorResponse.confidence,
      executionTime: totalTime,
      cost: orchestratorResponse.totalCost
    });

    // Prepare response with additional metadata
    const response = {
      success: true,
      orchestrator: 'Bielik-11B-v2.6-Instruct',
      timestamp: new Date().toISOString(),
      processingTime: totalTime,
      ...orchestratorResponse,
      metadata: {
        version: '1.0.0',
        apiEndpoint: '/api/mega-agent',
        userId,
        sessionId
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Orchestrator': 'Bielik-Mega-Agent',
        'X-Processing-Time': totalTime.toString(),
        'X-Agent-Count': orchestratorResponse.orchestratorDecision.selectedAgents.length.toString()
      }
    });

  } catch (error: any) {
    console.error('🚨 Mega Agent API Error:', error);

    // Determine error type and status code
    let statusCode = 500;
    let errorMessage = 'Internal server error during orchestration';

    if (error?.message?.includes('rate limit')) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (error?.message?.includes('authentication')) {
      statusCode = 401;
      errorMessage = 'Authentication failed for AI models';
    } else if (error?.message?.includes('timeout')) {
      statusCode = 408;
      errorMessage = 'Request timeout. Task was too complex.';
    }

    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      timestamp: new Date().toISOString(),
      orchestrator: 'Bielik-11B-v2.6-Instruct'
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};