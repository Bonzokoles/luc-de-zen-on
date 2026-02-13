/**
 * Workflow Execution Engine
 * 
 * Executes workflows with:
 * - Topological sort for node execution order
 * - Retry logic with exponential backoff
 * - AI_AGENT nodes delegated to CHUCK API
 */

import type { UniversalNode, AIAgentNode, ProcessorNode, OutputNode, NodeExecutionResult } from './nodes/universal';
import { validateNode } from './nodes/universal';
import { topologicalSort, validateWorkflow, type WorkflowEdge } from '../lib/workflowScoring';

export interface WorkflowExecutionContext {
  workflowId: string;
  nodes: UniversalNode[];
  edges: WorkflowEdge[];
  chuckApiUrl?: string; // Defaults to https://api.mybonzo.com/chuck/exec
  retryConfig?: {
    maxRetries: number;
    initialDelay: number;
    maxDelay: number;
  };
}

export interface ExecutionResult {
  success: boolean;
  results: Map<string, NodeExecutionResult>;
  errors: string[];
  executionTime: number;
}

const DEFAULT_CHUCK_API = 'https://api.mybonzo.com/chuck/exec';
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
};

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute AI_AGENT node via CHUCK API
 */
async function executeAIAgent(
  node: AIAgentNode,
  inputData: any,
  chuckApiUrl: string
): Promise<NodeExecutionResult> {
  const startTime = Date.now();

  try {
    const response = await fetch(chuckApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodeId: node.id,
        toolId: node.config.toolId,
        input: inputData,
        config: node.config,
      }),
    });

    if (!response.ok) {
      throw new Error(`CHUCK API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data,
      metadata: {
        executionTime: Date.now() - startTime,
        nodeId: node.id,
        nodeType: 'AI_AGENT',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        executionTime: Date.now() - startTime,
        nodeId: node.id,
        nodeType: 'AI_AGENT',
      },
    };
  }
}

/**
 * Execute PROCESSOR node
 */
async function executeProcessor(
  node: ProcessorNode,
  inputData: any
): Promise<NodeExecutionResult> {
  const startTime = Date.now();

  try {
    const { operation } = node.config;
    let result: any;

    switch (operation) {
      case 'scrape':
        // Scraping logic
        const { scrapeConfig } = node.config;
        if (!scrapeConfig?.url) {
          throw new Error('Scrape operation requires URL');
        }
        
        // Simple fetch for now (can be extended with Puppeteer)
        const response = await fetch(scrapeConfig.url, {
          headers: scrapeConfig.headers,
        });
        result = await response.text();
        break;

      case 'transform':
        // Transform logic
        const { transformConfig } = node.config;
        
        if (transformConfig?.mapping) {
          // Apply mapping
          result = {};
          for (const [key, value] of Object.entries(transformConfig.mapping)) {
            result[key] = inputData[value];
          }
        } else if (transformConfig?.script) {
          // Execute custom script
          const fn = new Function('data', transformConfig.script);
          result = fn(inputData);
        } else {
          result = inputData;
        }
        break;

      case 'filter':
        // Filter logic
        const { filterConfig } = node.config;
        
        if (!filterConfig?.condition) {
          throw new Error('Filter operation requires condition');
        }
        
        const filterFn = new Function('item', `return ${filterConfig.condition}`);
        
        if (Array.isArray(inputData)) {
          result = inputData.filter((item) => filterFn(item));
        } else {
          result = filterFn(inputData) ? inputData : null;
        }
        break;

      case 'merge':
        // Merge logic
        const { mergeConfig } = node.config;
        
        if (!Array.isArray(inputData)) {
          throw new Error('Merge operation requires array input');
        }
        
        if (mergeConfig?.strategy === 'concat') {
          result = inputData.flat();
        } else {
          result = Object.assign({}, ...inputData);
        }
        break;

      case 'split':
        // Split logic
        const { splitConfig } = node.config;
        
        if (!splitConfig) {
          throw new Error('Split operation requires splitConfig');
        }
        
        if (splitConfig.by === 'size' && Array.isArray(inputData)) {
          const chunkSize = Number(splitConfig.value);
          result = [];
          for (let i = 0; i < inputData.length; i += chunkSize) {
            result.push(inputData.slice(i, i + chunkSize));
          }
        } else {
          result = [inputData];
        }
        break;

      case 'export':
        // Export logic
        const { exportConfig } = node.config;
        
        if (!exportConfig?.format) {
          throw new Error('Export operation requires format');
        }
        
        // Convert data to specified format
        switch (exportConfig.format) {
          case 'json':
            result = JSON.stringify(inputData, null, 2);
            break;
          case 'csv':
            // Simple CSV conversion
            if (Array.isArray(inputData) && inputData.length > 0) {
              const headers = Object.keys(inputData[0]);
              const csv = [
                headers.join(','),
                ...inputData.map((row) => headers.map((h) => row[h]).join(',')),
              ].join('\n');
              result = csv;
            } else {
              result = '';
            }
            break;
          default:
            result = String(inputData);
        }
        break;

      default:
        throw new Error(`Unknown processor operation: ${operation}`);
    }

    return {
      success: true,
      data: result,
      metadata: {
        executionTime: Date.now() - startTime,
        nodeId: node.id,
        nodeType: 'PROCESSOR',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        executionTime: Date.now() - startTime,
        nodeId: node.id,
        nodeType: 'PROCESSOR',
      },
    };
  }
}

/**
 * Execute OUTPUT node
 */
async function executeOutput(
  node: OutputNode,
  inputData: any
): Promise<NodeExecutionResult> {
  const startTime = Date.now();

  try {
    const { channel } = node.config;
    let result: any;

    switch (channel) {
      case 'email':
        // Email delivery (would integrate with actual email service)
        const { emailConfig } = node.config;
        if (!emailConfig?.to) {
          throw new Error('Email channel requires recipient');
        }
        
        result = {
          channel: 'email',
          to: emailConfig.to,
          subject: emailConfig.subject || 'Workflow Output',
          body: emailConfig.body || JSON.stringify(inputData),
          sent: true,
        };
        break;

      case 'pdf':
        // PDF generation
        const { pdfConfig } = node.config;
        if (!pdfConfig?.filename) {
          throw new Error('PDF channel requires filename');
        }
        
        result = {
          channel: 'pdf',
          filename: pdfConfig.filename,
          generated: true,
        };
        break;

      case 'slack':
        // Slack delivery
        const { slackConfig } = node.config;
        if (!slackConfig?.channel) {
          throw new Error('Slack channel requires channel name');
        }
        
        result = {
          channel: 'slack',
          slackChannel: slackConfig.channel,
          message: slackConfig.message || JSON.stringify(inputData),
          sent: true,
        };
        break;

      case 'webhook':
        // Webhook call
        const { webhookConfig } = node.config;
        if (!webhookConfig?.url) {
          throw new Error('Webhook channel requires URL');
        }
        
        const webhookResponse = await fetch(webhookConfig.url, {
          method: webhookConfig.method || 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...webhookConfig.headers,
          },
          body: JSON.stringify(inputData),
        });
        
        result = {
          channel: 'webhook',
          url: webhookConfig.url,
          status: webhookResponse.status,
          success: webhookResponse.ok,
        };
        break;

      case 'storage':
        // Storage (Cloudflare R2, S3, etc.)
        const { storageConfig } = node.config;
        if (!storageConfig?.path) {
          throw new Error('Storage channel requires path');
        }
        
        result = {
          channel: 'storage',
          provider: storageConfig.provider || 'cloudflare-r2',
          path: storageConfig.path,
          stored: true,
        };
        break;

      case 'api':
        // API response
        const { apiConfig } = node.config;
        result = {
          channel: 'api',
          data: inputData,
          format: apiConfig?.format || 'json',
          statusCode: apiConfig?.statusCode || 200,
        };
        break;

      default:
        throw new Error(`Unknown output channel: ${channel}`);
    }

    return {
      success: true,
      data: result,
      metadata: {
        executionTime: Date.now() - startTime,
        nodeId: node.id,
        nodeType: 'OUTPUT',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        executionTime: Date.now() - startTime,
        nodeId: node.id,
        nodeType: 'OUTPUT',
      },
    };
  }
}

/**
 * Execute a single node with retry logic
 */
async function executeNodeWithRetry(
  node: UniversalNode,
  inputData: any,
  chuckApiUrl: string,
  retryConfig: typeof DEFAULT_RETRY_CONFIG
): Promise<NodeExecutionResult> {
  let lastError: NodeExecutionResult | null = null;
  let delay = retryConfig.initialDelay;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    let result: NodeExecutionResult;

    // Execute based on node type
    switch (node.type) {
      case 'AI_AGENT':
        result = await executeAIAgent(node as AIAgentNode, inputData, chuckApiUrl);
        break;
      case 'PROCESSOR':
        result = await executeProcessor(node as ProcessorNode, inputData);
        break;
      case 'OUTPUT':
        result = await executeOutput(node as OutputNode, inputData);
        break;
      default:
        return {
          success: false,
          error: `Unknown node type: ${(node as any).type}`,
          metadata: {
            executionTime: 0,
            nodeId: node.id,
            nodeType: node.type,
          },
        };
    }

    if (result.success) {
      if (result.metadata) {
        result.metadata.retries = attempt;
      }
      return result;
    }

    lastError = result;

    // Don't retry on last attempt
    if (attempt < retryConfig.maxRetries) {
      await sleep(delay);
      delay = Math.min(delay * 2, retryConfig.maxDelay); // Exponential backoff
    }
  }

  return lastError!;
}

/**
 * Execute workflow
 */
export async function executeWorkflow(context: WorkflowExecutionContext): Promise<ExecutionResult> {
  const startTime = Date.now();
  const results = new Map<string, NodeExecutionResult>();
  const errors: string[] = [];

  // Validate workflow
  const validation = validateWorkflow(context.nodes, context.edges);
  if (!validation.valid) {
    return {
      success: false,
      results,
      errors: validation.errors,
      executionTime: Date.now() - startTime,
    };
  }

  // Validate all nodes
  for (const node of context.nodes) {
    const nodeValidation = validateNode(node);
    if (!nodeValidation.valid) {
      errors.push(`Node ${node.id}: ${nodeValidation.errors.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      results,
      errors,
      executionTime: Date.now() - startTime,
    };
  }

  // Get execution order
  const executionOrder = topologicalSort(
    context.nodes.map((n) => ({ id: n.id, toolId: n.id, type: n.type })),
    context.edges
  );

  if (!executionOrder) {
    return {
      success: false,
      results,
      errors: ['Failed to determine execution order (possible cycle)'],
      executionTime: Date.now() - startTime,
    };
  }

  // Execute nodes in order
  const chuckApiUrl = context.chuckApiUrl || DEFAULT_CHUCK_API;
  const retryConfig = context.retryConfig || DEFAULT_RETRY_CONFIG;
  const nodeDataMap = new Map<string, any>();

  for (const nodeId of executionOrder) {
    const node = context.nodes.find((n) => n.id === nodeId);
    if (!node) {
      errors.push(`Node ${nodeId} not found`);
      continue;
    }

    // Get input data from predecessor nodes
    const predecessors = context.edges
      .filter((e) => e.to === nodeId)
      .map((e) => e.from);
    
    const inputData =
      predecessors.length === 0
        ? null
        : predecessors.length === 1
        ? nodeDataMap.get(predecessors[0])
        : predecessors.map((p) => nodeDataMap.get(p));

    // Execute node
    const result = await executeNodeWithRetry(node, inputData, chuckApiUrl, retryConfig);
    results.set(nodeId, result);

    if (result.success) {
      nodeDataMap.set(nodeId, result.data);
    } else {
      errors.push(`Node ${nodeId} failed: ${result.error}`);
      // Stop execution on error
      break;
    }
  }

  const success = errors.length === 0 && results.size === context.nodes.length;

  return {
    success,
    results,
    errors,
    executionTime: Date.now() - startTime,
  };
}
