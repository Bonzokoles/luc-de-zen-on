/**
 * Universal Node Types for Jimbo Workflow System
 * 
 * Three universal node types that handle all workflow operations:
 * 1. AI_AGENT - Delegates to CHUCK API for AI operations
 * 2. PROCESSOR - Scrape, transform, and export data
 * 3. OUTPUT - Deliver results via email, PDF, Slack, etc.
 */

export type NodeType = 'AI_AGENT' | 'PROCESSOR' | 'OUTPUT';

export interface BaseNode {
  id: string;
  type: NodeType;
  name: string;
  config: Record<string, any>;
}

/**
 * AI_AGENT Node
 * Delegates to CHUCK API (localhost:5152/api/exec or via cloudflared tunnel)
 */
export interface AIAgentNode extends BaseNode {
  type: 'AI_AGENT';
  config: {
    toolId: string; // Reference to tool in lib/tools.json
    prompt?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    customParams?: Record<string, any>;
  };
}

/**
 * PROCESSOR Node
 * Handles data transformation, scraping, and processing
 */
export interface ProcessorNode extends BaseNode {
  type: 'PROCESSOR';
  config: {
    operation: 'scrape' | 'transform' | 'export' | 'filter' | 'merge' | 'split';
    
    // Scraping config
    scrapeConfig?: {
      url?: string;
      selector?: string;
      method?: 'puppeteer' | 'cheerio' | 'api';
      headers?: Record<string, string>;
    };
    
    // Transform config
    transformConfig?: {
      script?: string; // JavaScript code
      mapping?: Record<string, string>;
      format?: 'json' | 'csv' | 'xml' | 'text';
    };
    
    // Export config
    exportConfig?: {
      format: 'json' | 'csv' | 'xlsx' | 'pdf' | 'xml';
      destination?: string;
    };
    
    // Filter config
    filterConfig?: {
      condition: string; // JavaScript expression
      keep?: 'matching' | 'non-matching';
    };
    
    // Merge config
    mergeConfig?: {
      strategy: 'concat' | 'merge' | 'join';
      key?: string;
    };
    
    // Split config
    splitConfig?: {
      by: 'size' | 'field' | 'pattern';
      value: number | string;
    };
  };
}

/**
 * OUTPUT Node
 * Delivers final results through various channels
 */
export interface OutputNode extends BaseNode {
  type: 'OUTPUT';
  config: {
    channel: 'email' | 'pdf' | 'slack' | 'webhook' | 'storage' | 'api';
    
    // Email config
    emailConfig?: {
      to: string | string[];
      subject: string;
      body?: string;
      attachments?: boolean;
    };
    
    // PDF config
    pdfConfig?: {
      template?: string;
      filename: string;
      download?: boolean;
    };
    
    // Slack config
    slackConfig?: {
      channel: string;
      message: string;
      blocks?: any[];
    };
    
    // Webhook config
    webhookConfig?: {
      url: string;
      method: 'POST' | 'PUT' | 'PATCH';
      headers?: Record<string, string>;
    };
    
    // Storage config
    storageConfig?: {
      provider: 'cloudflare-r2' | 's3' | 'gcs' | 'local';
      bucket?: string;
      path: string;
    };
    
    // API response config
    apiConfig?: {
      format: 'json' | 'xml' | 'text';
      statusCode?: number;
      headers?: Record<string, string>;
    };
  };
}

export type UniversalNode = AIAgentNode | ProcessorNode | OutputNode;

/**
 * Node execution result
 */
export interface NodeExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    executionTime: number;
    retries?: number;
    nodeId: string;
    nodeType: NodeType;
  };
}

/**
 * Validate node configuration
 */
export function validateNode(node: UniversalNode): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Basic validation
  if (!node.id) errors.push('Node ID is required');
  if (!node.type) errors.push('Node type is required');
  if (!node.name) errors.push('Node name is required');

  // Type-specific validation
  switch (node.type) {
    case 'AI_AGENT':
      const aiNode = node as AIAgentNode;
      if (!aiNode.config.toolId) {
        errors.push('AI_AGENT node requires toolId in config');
      }
      break;

    case 'PROCESSOR':
      const procNode = node as ProcessorNode;
      if (!procNode.config.operation) {
        errors.push('PROCESSOR node requires operation in config');
      }
      
      // Validate operation-specific config
      const { operation } = procNode.config;
      if (operation === 'scrape' && !procNode.config.scrapeConfig) {
        errors.push('PROCESSOR scrape operation requires scrapeConfig');
      }
      if (operation === 'transform' && !procNode.config.transformConfig) {
        errors.push('PROCESSOR transform operation requires transformConfig');
      }
      if (operation === 'export' && !procNode.config.exportConfig) {
        errors.push('PROCESSOR export operation requires exportConfig');
      }
      break;

    case 'OUTPUT':
      const outNode = node as OutputNode;
      if (!outNode.config.channel) {
        errors.push('OUTPUT node requires channel in config');
      }
      
      // Validate channel-specific config
      const { channel } = outNode.config;
      if (channel === 'email' && !outNode.config.emailConfig) {
        errors.push('OUTPUT email channel requires emailConfig');
      }
      if (channel === 'pdf' && !outNode.config.pdfConfig) {
        errors.push('OUTPUT pdf channel requires pdfConfig');
      }
      if (channel === 'slack' && !outNode.config.slackConfig) {
        errors.push('OUTPUT slack channel requires slackConfig');
      }
      if (channel === 'webhook' && !outNode.config.webhookConfig) {
        errors.push('OUTPUT webhook channel requires webhookConfig');
      }
      if (channel === 'storage' && !outNode.config.storageConfig) {
        errors.push('OUTPUT storage channel requires storageConfig');
      }
      break;

    default:
      errors.push(`Unknown node type: ${(node as any).type}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create a default AI_AGENT node
 */
export function createAIAgentNode(
  id: string,
  toolId: string,
  options?: Partial<AIAgentNode['config']>
): AIAgentNode {
  return {
    id,
    type: 'AI_AGENT',
    name: `AI Agent (${toolId})`,
    config: {
      toolId,
      ...options,
    },
  };
}

/**
 * Create a default PROCESSOR node
 */
export function createProcessorNode(
  id: string,
  operation: ProcessorNode['config']['operation'],
  config: Partial<ProcessorNode['config']>
): ProcessorNode {
  return {
    id,
    type: 'PROCESSOR',
    name: `Processor (${operation})`,
    config: {
      operation,
      ...config,
    },
  };
}

/**
 * Create a default OUTPUT node
 */
export function createOutputNode(
  id: string,
  channel: OutputNode['config']['channel'],
  config: Partial<OutputNode['config']>
): OutputNode {
  return {
    id,
    type: 'OUTPUT',
    name: `Output (${channel})`,
    config: {
      channel,
      ...config,
    },
  };
}
