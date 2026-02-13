/**
 * Workflow Execution Engine
 * Orchestrates universal node execution with topological sort and retry logic
 */

import type { UniversalWorkflow, UniversalNode } from './nodes/universal';
import { executeAIAgent } from './nodes/ai-agent';
import { executeProcessor } from './nodes/processor';
import { executeOutput } from './nodes/output';
import { getExecutionOrder } from '../lib/workflowScoring';

export interface ExecutionContext {
  workflowId: string;
  startTime: number;
  results: Map<string, any>;
  errors: Map<string, Error>;
}

export interface ExecutionOptions {
  maxRetries?: number;
  retryDelay?: number; // milliseconds
  timeout?: number; // milliseconds per node
  continueOnError?: boolean;
}

export interface ExecutionResult {
  success: boolean;
  workflowId: string;
  executionTime: number;
  results: Record<string, any>;
  errors: Record<string, string>;
  executionOrder: string[];
}

const DEFAULT_OPTIONS: Required<ExecutionOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 300000, // 5 minutes
  continueOnError: false
};

/**
 * Execute complete workflow
 */
export async function executeWorkflow(
  workflow: UniversalWorkflow,
  options: ExecutionOptions = {}
): Promise<ExecutionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const startTime = Date.now();
  
  const context: ExecutionContext = {
    workflowId: workflow.id,
    startTime,
    results: new Map(),
    errors: new Map()
  };

  // Get execution order using topological sort
  const workflowGraph = {
    nodes: workflow.nodes,
    edges: workflow.connections.map(conn => ({
      from: conn.from,
      to: conn.to,
      weight: conn.weight
    }))
  };

  const executionOrder = getExecutionOrder(workflowGraph);
  
  if (!executionOrder) {
    return {
      success: false,
      workflowId: workflow.id,
      executionTime: Date.now() - startTime,
      results: {},
      errors: { workflow: 'Cannot determine execution order - workflow contains cycles' },
      executionOrder: []
    };
  }

  // Execute nodes in topological order
  for (const nodeId of executionOrder) {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) {
      context.errors.set(nodeId, new Error(`Node ${nodeId} not found`));
      if (!opts.continueOnError) break;
      continue;
    }

    // Get input from connected nodes
    const input = getNodeInput(workflow, nodeId, context);

    // Execute node with retry logic
    const result = await executeNodeWithRetry(node, input, opts);

    if (result.success) {
      context.results.set(nodeId, result.data);
    } else {
      context.errors.set(nodeId, new Error(result.error || 'Unknown error'));
      if (!opts.continueOnError) break;
    }
  }

  // Build final result
  const results: Record<string, any> = {};
  context.results.forEach((value, key) => {
    results[key] = value;
  });

  const errors: Record<string, string> = {};
  context.errors.forEach((error, key) => {
    errors[key] = error.message;
  });

  return {
    success: context.errors.size === 0,
    workflowId: workflow.id,
    executionTime: Date.now() - startTime,
    results,
    errors,
    executionOrder
  };
}

/**
 * Get input for a node from its connected predecessors
 */
function getNodeInput(
  workflow: UniversalWorkflow,
  nodeId: string,
  context: ExecutionContext
): any {
  const incomingConnections = workflow.connections.filter(conn => conn.to === nodeId);
  
  if (incomingConnections.length === 0) {
    return undefined; // No input
  }

  if (incomingConnections.length === 1) {
    const sourceId = incomingConnections[0].from;
    return context.results.get(sourceId);
  }

  // Multiple inputs - merge them
  const inputs: any[] = [];
  incomingConnections.forEach(conn => {
    const result = context.results.get(conn.from);
    if (result !== undefined) {
      inputs.push(result);
    }
  });

  return inputs;
}

/**
 * Execute single node with retry logic and exponential backoff
 */
async function executeNodeWithRetry(
  node: UniversalNode,
  input: any,
  options: Required<ExecutionOptions>
): Promise<{ success: boolean; data?: any; error?: string }> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      // Apply timeout
      const result = await executeNodeWithTimeout(node, input, options.timeout);
      return { success: true, data: result };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on last attempt
      if (attempt < options.maxRetries) {
        // Exponential backoff
        const delay = options.retryDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Unknown error after retries'
  };
}

/**
 * Execute node with timeout
 */
async function executeNodeWithTimeout(
  node: UniversalNode,
  input: any,
  timeout: number
): Promise<any> {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Node execution timeout')), timeout);
  });

  const executionPromise = executeNode(node, input);

  return Promise.race([executionPromise, timeoutPromise]);
}

/**
 * Execute single node based on type
 */
async function executeNode(node: UniversalNode, input: any): Promise<any> {
  switch (node.type) {
    case 'AI_AGENT':
      const agentResult = await executeAIAgent(node, input);
      if (!agentResult.success) {
        throw new Error(agentResult.error || 'AI_AGENT execution failed');
      }
      return agentResult.result;

    case 'PROCESSOR':
      const processorResult = await executeProcessor(node, input);
      if (!processorResult.success) {
        throw new Error(processorResult.error || 'PROCESSOR execution failed');
      }
      return processorResult.data;

    case 'OUTPUT':
      const outputResult = await executeOutput(node, input);
      if (!outputResult.success) {
        throw new Error(outputResult.error || 'OUTPUT execution failed');
      }
      return outputResult.message;

    default:
      throw new Error(`Unknown node type: ${(node as any).type}`);
  }
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate workflow before execution
 */
export function validateWorkflowExecution(workflow: UniversalWorkflow): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!workflow.nodes || workflow.nodes.length === 0) {
    errors.push('Workflow must contain at least one node');
  }

  // Check for orphaned connections
  workflow.connections.forEach(conn => {
    const fromExists = workflow.nodes.some(n => n.id === conn.from);
    const toExists = workflow.nodes.some(n => n.id === conn.to);
    
    if (!fromExists) {
      errors.push(`Connection references non-existent source node: ${conn.from}`);
    }
    if (!toExists) {
      errors.push(`Connection references non-existent target node: ${conn.to}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  executeWorkflow,
  validateWorkflowExecution
};
