/**
 * Jimbo Universal Node Types
 * 3 node types that map to 140+ tools
 */

export type NodeType = 'AI_AGENT' | 'PROCESSOR' | 'OUTPUT';

export interface BaseNode {
  id: string;
  type: NodeType;
  label?: string;
  config: Record<string, any>;
}

/**
 * AI_AGENT Node
 * Delegates to CHUCK API for AI tool execution
 */
export interface AIAgentNode extends BaseNode {
  type: 'AI_AGENT';
  config: {
    toolId: string; // ID from tools-extended.json
    prompt?: string;
    parameters?: Record<string, any>;
    chuckEndpoint?: string; // Default: localhost:4321/api/chuck/exec
  };
}

/**
 * PROCESSOR Node
 * Data transformation and scraping
 */
export interface ProcessorNode extends BaseNode {
  type: 'PROCESSOR';
  config: {
    operation: 'scrape' | 'transform' | 'export' | 'filter' | 'merge';
    source?: string; // URL or data source
    transformer?: string; // JavaScript function or library path
    format?: 'json' | 'csv' | 'xml' | 'html';
    options?: Record<string, any>;
  };
}

/**
 * OUTPUT Node
 * Final output destinations
 */
export interface OutputNode extends BaseNode {
  type: 'OUTPUT';
  config: {
    destination: 'email' | 'pdf' | 'slack' | 'webhook' | 'database' | 'file';
    target?: string; // Email address, file path, webhook URL, etc.
    template?: string; // Template for formatting
    options?: Record<string, any>;
  };
}

export type UniversalNode = AIAgentNode | ProcessorNode | OutputNode;

/**
 * Node Connection
 */
export interface NodeConnection {
  from: string; // Source node ID
  to: string; // Target node ID
  label?: string;
  weight?: number; // For workflow scoring
}

/**
 * Complete Workflow
 */
export interface UniversalWorkflow {
  id: string;
  name: string;
  description?: string;
  nodes: UniversalNode[];
  connections: NodeConnection[];
  metadata?: {
    created?: string;
    modified?: string;
    author?: string;
    version?: string;
  };
}

/**
 * Validate node configuration
 */
export function validateNode(node: UniversalNode): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!node.id) {
    errors.push('Node ID is required');
  }

  if (!node.type) {
    errors.push('Node type is required');
  }

  // Type-specific validation
  switch (node.type) {
    case 'AI_AGENT':
      const agentNode = node as AIAgentNode;
      if (!agentNode.config.toolId) {
        errors.push('AI_AGENT requires toolId');
      }
      break;

    case 'PROCESSOR':
      const processorNode = node as ProcessorNode;
      if (!processorNode.config.operation) {
        errors.push('PROCESSOR requires operation');
      }
      break;

    case 'OUTPUT':
      const outputNode = node as OutputNode;
      if (!outputNode.config.destination) {
        errors.push('OUTPUT requires destination');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Create AI_AGENT node
 */
export function createAIAgentNode(
  id: string,
  toolId: string,
  config?: Partial<AIAgentNode['config']>
): AIAgentNode {
  return {
    id,
    type: 'AI_AGENT',
    config: {
      toolId,
      chuckEndpoint: 'http://localhost:4321/api/chuck/exec',
      ...config
    }
  };
}

/**
 * Create PROCESSOR node
 */
export function createProcessorNode(
  id: string,
  operation: ProcessorNode['config']['operation'],
  config?: Partial<ProcessorNode['config']>
): ProcessorNode {
  return {
    id,
    type: 'PROCESSOR',
    config: {
      operation,
      format: 'json',
      ...config
    }
  };
}

/**
 * Create OUTPUT node
 */
export function createOutputNode(
  id: string,
  destination: OutputNode['config']['destination'],
  config?: Partial<OutputNode['config']>
): OutputNode {
  return {
    id,
    type: 'OUTPUT',
    config: {
      destination,
      ...config
    }
  };
}

export default {
  validateNode,
  createAIAgentNode,
  createProcessorNode,
  createOutputNode
};
