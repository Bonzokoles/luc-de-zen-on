/**
 * Unified System API Endpoint
 * Handles workflow orchestration and system management
 */

import type { APIRoute } from 'astro';
import { WorkflowOrchestrator } from '../../../lib/workflowOrchestrator';
import type { UniversalWorkflow } from '../../../nodes/universal';

const orchestrator = new WorkflowOrchestrator();

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, workflow, workflowId, config } = body;

    switch (action) {
      case 'execute':
        // Execute workflow
        if (!workflow) {
          return new Response(
            JSON.stringify({ error: 'Workflow is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        const executionResult = await orchestrator.executeWorkflow(workflow as UniversalWorkflow);
        
        return new Response(
          JSON.stringify({
            success: true,
            result: executionResult
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

      case 'plan':
        // Create execution plan
        if (!workflow) {
          return new Response(
            JSON.stringify({ error: 'Workflow is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        const plan = await orchestrator.createExecutionPlan(workflow as UniversalWorkflow);
        
        return new Response(
          JSON.stringify({
            success: true,
            plan
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

      case 'history':
        // Get execution history
        const history = orchestrator.getExecutionHistory(workflowId);
        
        return new Response(
          JSON.stringify({
            success: true,
            history
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

      case 'stats':
        // Get execution statistics
        const stats = orchestrator.getExecutionStats();
        
        return new Response(
          JSON.stringify({
            success: true,
            stats
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

      case 'clear-history':
        // Clear execution history
        orchestrator.clearHistory(workflowId);
        
        return new Response(
          JSON.stringify({
            success: true,
            message: workflowId 
              ? `History cleared for workflow ${workflowId}`
              : 'All history cleared'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Unified System API error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const action = url.searchParams.get('action');
    const workflowId = url.searchParams.get('workflowId');

    switch (action) {
      case 'stats':
        const stats = orchestrator.getExecutionStats();
        return new Response(
          JSON.stringify({ success: true, stats }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

      case 'history':
        const history = orchestrator.getExecutionHistory(workflowId || undefined);
        return new Response(
          JSON.stringify({ success: true, history }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

      case 'health':
        return new Response(
          JSON.stringify({
            success: true,
            status: 'healthy',
            timestamp: new Date().toISOString()
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Unified System API',
            endpoints: {
              POST: {
                execute: 'Execute a workflow',
                plan: 'Create execution plan',
                history: 'Get execution history',
                stats: 'Get execution statistics',
                'clear-history': 'Clear execution history'
              },
              GET: {
                'stats': 'Get execution statistics',
                'history': 'Get execution history',
                'health': 'Health check'
              }
            }
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Unified System API error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
