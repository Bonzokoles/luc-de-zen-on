/**
 * AI_AGENT Node Implementation
 * Delegates tool execution to CHUCK API
 */

import type { AIAgentNode } from './universal';

export interface CHUCKExecutionRequest {
  toolId: string;
  prompt?: string;
  parameters?: Record<string, any>;
}

export interface CHUCKExecutionResponse {
  success: boolean;
  result?: any;
  error?: string;
  metadata?: {
    toolId: string;
    executionTime: number;
    tokensUsed?: number;
  };
}

/**
 * Execute AI_AGENT node via CHUCK API
 */
export async function executeAIAgent(
  node: AIAgentNode,
  input?: any
): Promise<CHUCKExecutionResponse> {
  const endpoint = node.config.chuckEndpoint || 'http://localhost:4321/api/chuck/exec';
  
  const request: CHUCKExecutionRequest = {
    toolId: node.config.toolId,
    prompt: node.config.prompt || (typeof input === 'string' ? input : JSON.stringify(input)),
    parameters: {
      ...node.config.parameters,
      input
    }
  };

  try {
    const startTime = Date.now();
    
    // Make request to CHUCK API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`CHUCK API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const executionTime = Date.now() - startTime;

    return {
      success: true,
      result: result.data || result,
      metadata: {
        toolId: node.config.toolId,
        executionTime,
        tokensUsed: result.tokensUsed
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        toolId: node.config.toolId,
        executionTime: 0
      }
    };
  }
}

/**
 * Validate AI_AGENT node configuration
 */
export function validateAIAgentConfig(node: AIAgentNode): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!node.config.toolId) {
    errors.push('toolId is required');
  }

  if (node.config.chuckEndpoint) {
    try {
      new URL(node.config.chuckEndpoint);
    } catch {
      errors.push('Invalid CHUCK endpoint URL');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get tool metadata from tools-extended.json
 */
export async function getToolMetadata(toolId: string): Promise<{
  id: string;
  type: string;
  category: string;
  pl: string;
  score: number;
} | null> {
  try {
    // In a real implementation, this would load from lib/tools-extended.json
    // For now, return null to indicate tool lookup needed
    return null;
  } catch {
    return null;
  }
}

export default {
  executeAIAgent,
  validateAIAgentConfig,
  getToolMetadata
};
