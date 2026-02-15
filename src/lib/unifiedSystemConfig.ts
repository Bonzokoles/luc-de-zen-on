/**
 * Jimbo Unified System Configuration
 * Central configuration for AI workflow automation
 */

import type { UniversalWorkflow, UniversalNode } from '../nodes/universal';

/**
 * System Configuration
 */
export interface UnifiedSystemConfig {
  chuckEndpoint: string;
  apiEndpoints: {
    tools: string;
    analyze: string;
    exec: string;
  };
  execution: {
    maxRetries: number;
    retryDelay: number;
    timeout: number;
  };
  validation: {
    requireDAG: boolean;
    minQualityScore: number;
  };
}

export const DEFAULT_CONFIG: UnifiedSystemConfig = {
  chuckEndpoint: 'http://localhost:5152',
  apiEndpoints: {
    tools: '/api/chuck/tools',
    analyze: '/api/chuck/analyze',
    exec: '/api/chuck/exec'
  },
  execution: {
    maxRetries: 3,
    retryDelay: 1000, // ms
    timeout: 30000 // 30 seconds
  },
  validation: {
    requireDAG: true,
    minQualityScore: 50
  }
};

/**
 * Workflow Execution Plan
 */
export interface ExecutionPlan {
  workflowId: string;
  steps: ExecutionStep[];
  estimatedDuration: number;
  dependencies: Record<string, string[]>;
}

export interface ExecutionStep {
  stepId: string;
  nodeId: string;
  type: string;
  order: number;
  dependencies: string[];
  config: Record<string, any>;
}

/**
 * Execution Result
 */
export interface ExecutionResult {
  workflowId: string;
  status: 'success' | 'partial' | 'failed';
  startTime: string;
  endTime: string;
  duration: number;
  steps: StepResult[];
  errors?: ExecutionError[];
}

export interface StepResult {
  stepId: string;
  nodeId: string;
  status: 'success' | 'failed' | 'skipped';
  output?: any;
  error?: string;
  duration: number;
}

export interface ExecutionError {
  stepId: string;
  nodeId: string;
  error: string;
  timestamp: string;
}

/**
 * Workflow Templates System
 */
export interface SystemTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  workflow: UniversalWorkflow;
  variables?: Record<string, TemplateVariable>;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  description: string;
  required: boolean;
  default?: any;
  options?: any[];
}

/**
 * System Metrics
 */
export interface SystemMetrics {
  totalWorkflows: number;
  successRate: number;
  averageQualityScore: number;
  averageExecutionTime: number;
  toolUsageStats: Record<string, number>;
  categoryStats: Record<string, number>;
}

/**
 * Helper Functions
 */

/**
 * Generate unique workflow ID
 */
export function generateWorkflowId(): string {
  return `workflow-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Generate unique node ID
 */
export function generateNodeId(type: string): string {
  return `${type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Validate system configuration
 */
export function validateConfig(config: Partial<UnifiedSystemConfig>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.execution?.maxRetries !== undefined && config.execution.maxRetries < 0) {
    errors.push('maxRetries must be non-negative');
  }

  if (config.execution?.retryDelay !== undefined && config.execution.retryDelay < 0) {
    errors.push('retryDelay must be non-negative');
  }

  if (config.execution?.timeout !== undefined && config.execution.timeout < 1000) {
    errors.push('timeout must be at least 1000ms');
  }

  if (config.validation?.minQualityScore !== undefined) {
    if (config.validation.minQualityScore < 0 || config.validation.minQualityScore > 100) {
      errors.push('minQualityScore must be between 0 and 100');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Merge configurations
 */
export function mergeConfig(
  base: UnifiedSystemConfig,
  override: Partial<UnifiedSystemConfig>
): UnifiedSystemConfig {
  return {
    ...base,
    ...override,
    apiEndpoints: {
      ...base.apiEndpoints,
      ...(override.apiEndpoints || {})
    },
    execution: {
      ...base.execution,
      ...(override.execution || {})
    },
    validation: {
      ...base.validation,
      ...(override.validation || {})
    }
  };
}

/**
 * Calculate estimated workflow duration
 */
export function estimateWorkflowDuration(workflow: UniversalWorkflow): number {
  const nodeCount = workflow.nodes.length;
  const avgNodeTime = 5000; // 5 seconds per node
  const overhead = 2000; // 2 seconds overhead
  
  return nodeCount * avgNodeTime + overhead;
}

/**
 * Export workflow to JSON
 */
export function exportWorkflow(workflow: UniversalWorkflow): string {
  return JSON.stringify(workflow, null, 2);
}

/**
 * Import workflow from JSON
 */
export function importWorkflow(json: string): UniversalWorkflow {
  try {
    const parsed = JSON.parse(json);
    
    // Basic validation
    if (!parsed.id || !parsed.name || !parsed.nodes || !parsed.connections) {
      throw new Error('Invalid workflow format');
    }
    
    return parsed as UniversalWorkflow;
  } catch (error) {
    throw new Error(`Failed to import workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Clone workflow with new ID
 */
export function cloneWorkflow(workflow: UniversalWorkflow, newName?: string): UniversalWorkflow {
  const newId = generateWorkflowId();
  
  return {
    ...workflow,
    id: newId,
    name: newName || `${workflow.name} (Copy)`,
    metadata: {
      ...workflow.metadata,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }
  };
}

/**
 * Get workflow statistics
 */
export function getWorkflowStats(workflow: UniversalWorkflow) {
  const nodeTypes = workflow.nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const toolIds = workflow.nodes
    .filter(node => node.type === 'AI_AGENT')
    .map(node => (node as any).config.toolId);

  return {
    totalNodes: workflow.nodes.length,
    totalConnections: workflow.connections.length,
    nodeTypes,
    uniqueTools: new Set(toolIds).size,
    estimatedDuration: estimateWorkflowDuration(workflow)
  };
}

export default {
  DEFAULT_CONFIG,
  generateWorkflowId,
  generateNodeId,
  validateConfig,
  mergeConfig,
  estimateWorkflowDuration,
  exportWorkflow,
  importWorkflow,
  cloneWorkflow,
  getWorkflowStats
};
