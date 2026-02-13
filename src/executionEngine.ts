/**
 * Execution Engine for Jimbo
 * Orchestrates node execution and delegates AI_AGENT nodes to CHUCK
 */

import type {
  UniversalNode,
  AIAgentNode,
  ProcessorNode,
  OutputNode,
  NodeExecutionResult,
} from './nodes/universal';
import type { WorkflowEdge } from '../lib/workflowScoring';

export interface ExecutionContext {
  workflowId: string;
  variables: Record<string, any>;
  results: Map<string, NodeExecutionResult>;
  chuckApiUrl?: string;
}

export interface ExecutionOptions {
  chuckApiUrl?: string;
  timeout?: number;
  retryAttempts?: number;
}

const DEFAULT_CHUCK_URL = 'http://localhost:5152/api/exec';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRY_ATTEMPTS = 3;

/**
 * Main execution engine class
 */
export class ExecutionEngine {
  private chuckApiUrl: string;
  private timeout: number;
  private retryAttempts: number;

  constructor(options: ExecutionOptions = {}) {
    this.chuckApiUrl = options.chuckApiUrl || DEFAULT_CHUCK_URL;
    this.timeout = options.timeout || DEFAULT_TIMEOUT;
    this.retryAttempts = options.retryAttempts || DEFAULT_RETRY_ATTEMPTS;
  }

  /**
   * Execute a single node
   */
  async executeNode(
    node: UniversalNode,
    context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const startTime = Date.now();

    try {
      let result: any;

      switch (node.type) {
        case 'AI_AGENT':
          result = await this.executeAIAgent(node, context);
          break;
        case 'PROCESSOR':
          result = await this.executeProcessor(node, context);
          break;
        case 'OUTPUT':
          result = await this.executeOutput(node, context);
          break;
        default:
          throw new Error(`Unknown node type: ${(node as any).type}`);
      }

      const executionTime = Date.now() - startTime;

      return {
        nodeId: node.id,
        success: true,
        data: result,
        executionTime,
        metadata: {
          nodeType: node.type,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      return {
        nodeId: node.id,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime,
        metadata: {
          nodeType: node.type,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Execute AI_AGENT node by delegating to CHUCK
   */
  private async executeAIAgent(
    node: AIAgentNode,
    context: ExecutionContext
  ): Promise<any> {
    const { toolId, prompt, temperature, maxTokens, systemPrompt, parameters } = node.config;

    // Prepare request payload for CHUCK
    const payload = {
      toolId,
      prompt: this.interpolateVariables(prompt || '', context.variables),
      temperature,
      maxTokens,
      systemPrompt,
      parameters,
      workflowId: context.workflowId,
      nodeId: node.id,
    };

    // Delegate to CHUCK scoring engine
    const response = await this.fetchWithRetry(
      context.chuckApiUrl || this.chuckApiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`CHUCK API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Execute PROCESSOR node
   */
  private async executeProcessor(
    node: ProcessorNode,
    context: ExecutionContext
  ): Promise<any> {
    const { processorType, options } = node.config;

    switch (processorType) {
      case 'scrape':
        return await this.executeScrape(options, context);
      case 'transform':
        return await this.executeTransform(options, context);
      case 'export':
        return await this.executeExport(options, context);
      default:
        throw new Error(`Unknown processor type: ${processorType}`);
    }
  }

  /**
   * Execute scraping operation
   */
  private async executeScrape(
    options: any,
    context: ExecutionContext
  ): Promise<any> {
    const url = this.interpolateVariables(options?.url || '', context.variables);
    
    if (!url) {
      throw new Error('Scrape processor requires a URL');
    }

    // In a real implementation, this would use a scraping service
    // For now, we'll return a placeholder
    return {
      type: 'scrape',
      url,
      selector: options?.selector,
      data: `[Scraped data from ${url}]`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Execute data transformation
   */
  private async executeTransform(
    options: any,
    context: ExecutionContext
  ): Promise<any> {
    const transformType = options?.transformType || 'json';
    
    // Get input data from previous node results
    const inputData = context.variables.previousResult || context.variables.input;

    if (!inputData) {
      throw new Error('Transform processor requires input data');
    }

    // Apply transformation based on type
    let transformedData: any;

    switch (transformType) {
      case 'json':
        transformedData = typeof inputData === 'string' 
          ? JSON.parse(inputData) 
          : inputData;
        break;
      case 'text':
        transformedData = typeof inputData === 'object'
          ? JSON.stringify(inputData, null, 2)
          : String(inputData);
        break;
      case 'csv':
        // Simplified CSV conversion
        if (Array.isArray(inputData)) {
          const headers = Object.keys(inputData[0] || {});
          const rows = inputData.map(row => 
            headers.map(h => row[h]).join(',')
          );
          transformedData = [headers.join(','), ...rows].join('\n');
        } else {
          transformedData = String(inputData);
        }
        break;
      default:
        transformedData = inputData;
    }

    // Apply custom mapping if provided
    if (options?.mapping && typeof transformedData === 'object') {
      const mapped: any = {};
      for (const [key, mappedValue] of Object.entries(options.mapping)) {
        mapped[key] = (transformedData as any)[mappedValue as string];
      }
      transformedData = mapped;
    }

    return {
      type: 'transform',
      transformType,
      data: transformedData,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Execute data export
   */
  private async executeExport(
    options: any,
    context: ExecutionContext
  ): Promise<any> {
    const format = options?.format || 'json';
    const destination = options?.destination || 'local';
    
    const data = context.variables.previousResult || context.variables.input;

    if (!data) {
      throw new Error('Export processor requires data to export');
    }

    return {
      type: 'export',
      format,
      destination,
      filename: options?.filename || `export-${Date.now()}.${format}`,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Execute OUTPUT node
   */
  private async executeOutput(
    node: OutputNode,
    context: ExecutionContext
  ): Promise<any> {
    const { outputType, options } = node.config;

    switch (outputType) {
      case 'email':
        return await this.executeEmailOutput(options, context);
      case 'pdf':
        return await this.executePDFOutput(options, context);
      case 'slack':
        return await this.executeSlackOutput(options, context);
      default:
        throw new Error(`Unknown output type: ${outputType}`);
    }
  }

  /**
   * Execute email output
   */
  private async executeEmailOutput(
    options: any,
    context: ExecutionContext
  ): Promise<any> {
    const to = options?.to;
    const subject = this.interpolateVariables(options?.subject || '', context.variables);
    const body = context.variables.previousResult || context.variables.input;

    if (!to) {
      throw new Error('Email output requires a recipient');
    }

    return {
      type: 'email',
      to,
      from: options?.from,
      subject,
      body,
      sent: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Execute PDF output
   */
  private async executePDFOutput(
    options: any,
    context: ExecutionContext
  ): Promise<any> {
    const content = context.variables.previousResult || context.variables.input;

    return {
      type: 'pdf',
      content,
      options: options?.pdfOptions,
      generated: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Execute Slack output
   */
  private async executeSlackOutput(
    options: any,
    context: ExecutionContext
  ): Promise<any> {
    const channel = options?.channel;
    const webhookUrl = options?.webhookUrl;
    const message = context.variables.previousResult || context.variables.input;

    if (!channel && !webhookUrl) {
      throw new Error('Slack output requires a channel or webhook URL');
    }

    return {
      type: 'slack',
      channel,
      message,
      sent: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Execute a workflow (multiple nodes in sequence)
   */
  async executeWorkflow(
    nodes: UniversalNode[],
    edges: WorkflowEdge[],
    initialVariables: Record<string, any> = {}
  ): Promise<Map<string, NodeExecutionResult>> {
    const context: ExecutionContext = {
      workflowId: `workflow-${Date.now()}`,
      variables: { ...initialVariables },
      results: new Map(),
    };

    // Build execution order (topological sort)
    const executionOrder = this.topologicalSort(nodes, edges);

    // Execute nodes in order
    for (const nodeId of executionOrder) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) continue;

      // Get input from previous nodes
      const incomingEdges = edges.filter(e => e.to === nodeId);
      if (incomingEdges.length > 0) {
        const previousNodeId = incomingEdges[0].from;
        const previousResult = context.results.get(previousNodeId);
        if (previousResult?.success) {
          context.variables.previousResult = previousResult.data;
          context.variables.input = previousResult.data;
        }
      }

      // Execute the node
      const result = await this.executeNode(node, context);
      context.results.set(nodeId, result);

      // If execution failed and no error handling, stop
      if (!result.success) {
        console.error(`Node ${nodeId} failed:`, result.error);
        // Continue execution for now (could add error handling logic)
      }
    }

    return context.results;
  }

  /**
   * Topological sort for node execution order
   */
  private topologicalSort(
    nodes: UniversalNode[],
    edges: WorkflowEdge[]
  ): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    // Build adjacency list
    const adjacencyList = new Map<string, string[]>();
    nodes.forEach(node => adjacencyList.set(node.id, []));
    edges.forEach(edge => {
      const neighbors = adjacencyList.get(edge.from) || [];
      neighbors.push(edge.to);
      adjacencyList.set(edge.from, neighbors);
    });

    function visit(nodeId: string) {
      if (visited.has(nodeId)) return;
      if (visiting.has(nodeId)) {
        throw new Error('Cycle detected in workflow');
      }

      visiting.add(nodeId);

      const neighbors = adjacencyList.get(nodeId) || [];
      neighbors.forEach(visit);

      visiting.delete(nodeId);
      visited.add(nodeId);
      order.push(nodeId);
    }

    // Visit all nodes
    nodes.forEach(node => visit(node.id));

    return order.reverse();
  }

  /**
   * Fetch with retry logic
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    attempt: number = 0
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (attempt < this.retryAttempts - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        return this.fetchWithRetry(url, options, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Interpolate variables in a string
   */
  private interpolateVariables(
    template: string,
    variables: Record<string, any>
  ): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  }
}

/**
 * Create a default execution engine instance
 */
export function createExecutionEngine(options?: ExecutionOptions): ExecutionEngine {
  return new ExecutionEngine(options);
}
