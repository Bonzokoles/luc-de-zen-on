/**
 * Universal Node Types for Jimbo
 * Three core node types that integrate with CHUCK scoring engine
 */

export type NodeType = 'AI_AGENT' | 'PROCESSOR' | 'OUTPUT';

export type ProcessorType = 'scrape' | 'transform' | 'export';
export type OutputType = 'email' | 'pdf' | 'slack';

/**
 * Base node interface
 */
export interface BaseNode {
  id: string;
  type: NodeType;
  label?: string;
  position?: { x: number; y: number };
}

/**
 * AI_AGENT Node
 * Proxies execution to CHUCK scoring engine
 * Uses toolId to reference tools from lib/tools.json
 */
export interface AIAgentNode extends BaseNode {
  type: 'AI_AGENT';
  config: {
    toolId: string; // Reference to tool in lib/tools.json
    prompt?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    parameters?: Record<string, any>;
  };
}

/**
 * PROCESSOR Node
 * Handles data processing operations
 */
export interface ProcessorNode extends BaseNode {
  type: 'PROCESSOR';
  config: {
    processorType: ProcessorType;
    options?: ProcessorOptions;
  };
}

export interface ProcessorOptions {
  // Scrape options
  url?: string;
  selector?: string;
  waitFor?: number;
  
  // Transform options
  transformType?: 'json' | 'xml' | 'csv' | 'markdown' | 'html' | 'text';
  transformScript?: string;
  mapping?: Record<string, string>;
  
  // Export options
  format?: 'json' | 'csv' | 'xlsx' | 'xml';
  destination?: string;
  filename?: string;
}

/**
 * OUTPUT Node
 * Handles final output destinations
 */
export interface OutputNode extends BaseNode {
  type: 'OUTPUT';
  config: {
    outputType: OutputType;
    options?: OutputOptions;
  };
}

export interface OutputOptions {
  // Email options
  to?: string | string[];
  from?: string;
  subject?: string;
  template?: string;
  attachments?: string[];
  
  // PDF options
  pdfTemplate?: string;
  pdfOptions?: {
    format?: 'A4' | 'Letter';
    orientation?: 'portrait' | 'landscape';
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
  };
  
  // Slack options
  channel?: string;
  webhookUrl?: string;
  username?: string;
  iconEmoji?: string;
  blocks?: any[];
}

/**
 * Union type for all node types
 */
export type UniversalNode = AIAgentNode | ProcessorNode | OutputNode;

/**
 * Node execution result
 */
export interface NodeExecutionResult {
  nodeId: string;
  success: boolean;
  data?: any;
  error?: string;
  executionTime?: number;
  metadata?: Record<string, any>;
}

/**
 * Create an AI_AGENT node
 */
export function createAIAgentNode(
  toolId: string,
  config?: Partial<AIAgentNode['config']>,
  metadata?: Partial<BaseNode>
): AIAgentNode {
  return {
    id: metadata?.id || `ai-agent-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    type: 'AI_AGENT',
    label: metadata?.label || `AI Agent: ${toolId}`,
    position: metadata?.position || { x: 0, y: 0 },
    config: {
      toolId,
      ...config,
    },
  };
}

/**
 * Create a PROCESSOR node
 */
export function createProcessorNode(
  processorType: ProcessorType,
  options?: ProcessorOptions,
  metadata?: Partial<BaseNode>
): ProcessorNode {
  return {
    id: metadata?.id || `processor-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    type: 'PROCESSOR',
    label: metadata?.label || `Processor: ${processorType}`,
    position: metadata?.position || { x: 0, y: 0 },
    config: {
      processorType,
      options,
    },
  };
}

/**
 * Create an OUTPUT node
 */
export function createOutputNode(
  outputType: OutputType,
  options?: OutputOptions,
  metadata?: Partial<BaseNode>
): OutputNode {
  return {
    id: metadata?.id || `output-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    type: 'OUTPUT',
    label: metadata?.label || `Output: ${outputType}`,
    position: metadata?.position || { x: 0, y: 0 },
    config: {
      outputType,
      options,
    },
  };
}

/**
 * Validate a universal node
 */
export function validateNode(node: UniversalNode): string[] {
  const errors: string[] = [];

  if (!node.id) {
    errors.push('Node must have an id');
  }

  if (!node.type) {
    errors.push('Node must have a type');
  }

  switch (node.type) {
    case 'AI_AGENT':
      if (!node.config.toolId) {
        errors.push('AI_AGENT node must have a toolId');
      }
      break;

    case 'PROCESSOR':
      if (!node.config.processorType) {
        errors.push('PROCESSOR node must have a processorType');
      }
      if (!['scrape', 'transform', 'export'].includes(node.config.processorType)) {
        errors.push('processorType must be one of: scrape, transform, export');
      }
      break;

    case 'OUTPUT':
      if (!node.config.outputType) {
        errors.push('OUTPUT node must have an outputType');
      }
      if (!['email', 'pdf', 'slack'].includes(node.config.outputType)) {
        errors.push('outputType must be one of: email, pdf, slack');
      }
      break;

    default:
      errors.push(`Unknown node type: ${(node as any).type}`);
  }

  return errors;
}

/**
 * Get node type display name
 */
export function getNodeTypeDisplayName(type: NodeType): string {
  const names: Record<NodeType, string> = {
    AI_AGENT: 'AI Agent',
    PROCESSOR: 'Processor',
    OUTPUT: 'Output',
  };
  return names[type] || type;
}

/**
 * Get processor type display name
 */
export function getProcessorTypeDisplayName(type: ProcessorType): string {
  const names: Record<ProcessorType, string> = {
    scrape: 'Web Scraping',
    transform: 'Data Transform',
    export: 'Data Export',
  };
  return names[type] || type;
}

/**
 * Get output type display name
 */
export function getOutputTypeDisplayName(type: OutputType): string {
  const names: Record<OutputType, string> = {
    email: 'Email',
    pdf: 'PDF Document',
    slack: 'Slack Message',
  };
  return names[type] || type;
}
