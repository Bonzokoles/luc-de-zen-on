/**
 * Enhanced MCP Server API
 * Integrates connection management and safety validation
 * Based on latest Model Context Protocol standards (2025)
 */

import type { APIRoute } from 'astro';
import { MCPSafetyValidator, SYSTEM_PROMPTS } from '../../lib/mcp-safety';

// Initialize safety validator
const safetyValidator = new MCPSafetyValidator({
  enablePromptValidation: true,
  enableSkillValidation: true,
  enableContentFiltering: true,
});

/**
 * POST /api/mcp-server - Execute MCP request with safety checks
 */
export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body = await request.json();
    const { action, prompt, skillId, parameters, context } = body;

    // Validate the request
    const safetyCheck = safetyValidator.validateMCPRequest({
      prompt,
      skillId,
      content: parameters?.content,
    });

    if (!safetyCheck.safe) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Safety validation failed',
          violations: safetyCheck.violations,
          warnings: safetyCheck.warnings,
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Log warnings if any
    if (safetyCheck.warnings.length > 0) {
      console.warn('MCP Safety Warnings:', safetyCheck.warnings);
    }

    // Get appropriate system prompt based on context
    const systemPrompt = safetyValidator.getSystemPrompt(context || 'general');

    // Process different actions
    switch (action) {
      case 'execute_skill':
        return await executeSkill({ skillId, prompt, parameters, systemPrompt }, corsHeaders);
      
      case 'validate_skill':
        return validateSkillAction(skillId, corsHeaders);
      
      case 'get_system_prompt':
        return getSystemPromptAction(context, corsHeaders);
      
      case 'health_check':
        return healthCheckAction(corsHeaders);
      
      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: `Unknown action: ${action}`,
          }),
          { status: 400, headers: corsHeaders }
        );
    }
  } catch (error) {
    console.error('MCP Server Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};

/**
 * GET /api/mcp-server - Server status and info
 */
export const GET: APIRoute = async () => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  return new Response(
    JSON.stringify({
      name: 'MCP Server Enhanced',
      version: '2.0.0',
      protocol: 'Model Context Protocol 2025',
      features: {
        connectionManagement: true,
        safetyValidation: true,
        systemPrompts: true,
        skillValidation: true,
        heartbeat: true,
      },
      endpoints: {
        execute_skill: 'POST /api/mcp-server with action: execute_skill',
        validate_skill: 'POST /api/mcp-server with action: validate_skill',
        get_system_prompt: 'POST /api/mcp-server with action: get_system_prompt',
        health_check: 'POST /api/mcp-server with action: health_check',
      },
      status: 'operational',
      timestamp: new Date().toISOString(),
    }),
    { status: 200, headers: corsHeaders }
  );
};

/**
 * OPTIONS - CORS preflight
 */
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

/**
 * Execute a skill with safety checks
 */
async function executeSkill(
  params: {
    skillId: string;
    prompt: string;
    parameters?: any;
    systemPrompt: string;
  },
  headers: Record<string, string>
) {
  const { skillId, prompt, parameters, systemPrompt } = params;

  // Validate skill
  const skillValidation = safetyValidator.validateSkill(skillId);
  if (!skillValidation.safe) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Skill validation failed',
        violations: skillValidation.violations,
      }),
      { status: 400, headers }
    );
  }

  // In production, this would call the actual AI service
  // For now, return a mock safe response
  const response = {
    success: true,
    skillId,
    result: {
      message: `Skill '${skillId}' executed successfully with safety checks`,
      systemPrompt,
      prompt,
      parameters,
      safetyValidated: true,
      warnings: skillValidation.warnings,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      safetyChecksEnabled: true,
      protocolVersion: '2025',
    },
  };

  // Validate the response content
  const contentCheck = safetyValidator.validateContent(JSON.stringify(response.result));
  if (!contentCheck.safe) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Response content failed safety validation',
        violations: contentCheck.violations,
      }),
      { status: 500, headers }
    );
  }

  return new Response(JSON.stringify(response), { status: 200, headers });
}

/**
 * Validate a skill
 */
function validateSkillAction(skillId: string, headers: Record<string, string>) {
  const validation = safetyValidator.validateSkill(skillId);
  
  return new Response(
    JSON.stringify({
      success: true,
      skillId,
      valid: validation.safe,
      violations: validation.violations,
      warnings: validation.warnings,
    }),
    { status: 200, headers }
  );
}

/**
 * Get system prompt for a context
 */
function getSystemPromptAction(
  context: 'business' | 'code' | 'data' | 'general' | undefined,
  headers: Record<string, string>
) {
  const systemPrompt = safetyValidator.getSystemPrompt(context || 'general');
  
  return new Response(
    JSON.stringify({
      success: true,
      context: context || 'general',
      systemPrompt,
      availableContexts: ['general', 'business', 'code', 'data'],
    }),
    { status: 200, headers }
  );
}

/**
 * Health check endpoint
 */
function healthCheckAction(headers: Record<string, string>) {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime?.() ?? 0,
      safetyValidator: {
        enabled: true,
        checks: ['prompt', 'skill', 'content'],
      },
    }),
    { status: 200, headers }
  );
}
