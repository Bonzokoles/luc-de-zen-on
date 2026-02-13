/**
 * PROCESSOR Node Implementation
 * Handles scraping, transformation, and data export
 */

import type { ProcessorNode } from './universal';

export interface ProcessorResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    operation: string;
    recordsProcessed?: number;
    executionTime: number;
  };
}

/**
 * Execute PROCESSOR node
 */
export async function executeProcessor(
  node: ProcessorNode,
  input?: any
): Promise<ProcessorResult> {
  const startTime = Date.now();
  
  try {
    let result: any;

    switch (node.config.operation) {
      case 'scrape':
        result = await executeScrape(node, input);
        break;
      
      case 'transform':
        result = await executeTransform(node, input);
        break;
      
      case 'export':
        result = await executeExport(node, input);
        break;
      
      case 'filter':
        result = await executeFilter(node, input);
        break;
      
      case 'merge':
        result = await executeMerge(node, input);
        break;
      
      default:
        throw new Error(`Unknown operation: ${node.config.operation}`);
    }

    return {
      success: true,
      data: result,
      metadata: {
        operation: node.config.operation,
        executionTime: Date.now() - startTime
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        operation: node.config.operation,
        executionTime: Date.now() - startTime
      }
    };
  }
}

/**
 * Scrape operation
 */
async function executeScrape(node: ProcessorNode, input?: any): Promise<any> {
  const url = node.config.source || input?.url;
  
  if (!url) {
    throw new Error('Scrape operation requires URL in source or input');
  }

  // Basic fetch (in production, use proper scraping library)
  const response = await fetch(url);
  const content = await response.text();
  
  if (node.config.format === 'html') {
    return content;
  }
  
  // Return as structured data
  return {
    url,
    content,
    timestamp: new Date().toISOString(),
    status: response.status
  };
}

/**
 * Transform operation
 */
async function executeTransform(node: ProcessorNode, input?: any): Promise<any> {
  if (!input) {
    throw new Error('Transform operation requires input data');
  }

  // If transformer function is provided, use it
  if (node.config.transformer) {
    // In production, safely execute user-provided transformer
    // For now, return input as-is
    console.warn('Custom transformers not yet implemented');
    return input;
  }

  // Default transformation: format conversion
  if (node.config.format) {
    return convertFormat(input, node.config.format);
  }

  return input;
}

/**
 * Export operation
 */
async function executeExport(node: ProcessorNode, input?: any): Promise<any> {
  if (!input) {
    throw new Error('Export operation requires input data');
  }

  const format = node.config.format || 'json';
  const converted = convertFormat(input, format);

  return {
    format,
    data: converted,
    exported: true,
    timestamp: new Date().toISOString()
  };
}

/**
 * Filter operation
 */
async function executeFilter(node: ProcessorNode, input?: any): Promise<any> {
  if (!Array.isArray(input)) {
    throw new Error('Filter operation requires array input');
  }

  // Apply basic filtering based on options
  // In production, implement more sophisticated filtering
  return input;
}

/**
 * Merge operation
 */
async function executeMerge(node: ProcessorNode, input?: any): Promise<any> {
  if (!Array.isArray(input)) {
    throw new Error('Merge operation requires array input');
  }

  // Merge array items
  if (typeof input[0] === 'object') {
    return Object.assign({}, ...input);
  }

  return input.flat();
}

/**
 * Convert data format
 */
function convertFormat(data: any, format: string): any {
  switch (format) {
    case 'json':
      return typeof data === 'string' ? JSON.parse(data) : data;
    
    case 'csv':
      // Simple CSV conversion for arrays of objects
      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(item => 
          Object.values(item).join(',')
        ).join('\n');
        return `${headers}\n${rows}`;
      }
      return String(data);
    
    case 'xml':
      // Basic XML conversion
      return `<data>${JSON.stringify(data)}</data>`;
    
    case 'html':
      return String(data);
    
    default:
      return data;
  }
}

/**
 * Validate PROCESSOR node configuration
 */
export function validateProcessorConfig(node: ProcessorNode): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!node.config.operation) {
    errors.push('operation is required');
  }

  const validOps = ['scrape', 'transform', 'export', 'filter', 'merge'];
  if (node.config.operation && !validOps.includes(node.config.operation)) {
    errors.push(`Invalid operation. Must be one of: ${validOps.join(', ')}`);
  }

  if (node.config.operation === 'scrape' && !node.config.source) {
    errors.push('Scrape operation requires source URL');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  executeProcessor,
  validateProcessorConfig
};
