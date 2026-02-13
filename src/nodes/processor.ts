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
 * Validate URL to prevent SSRF attacks
 */
function validateUrl(urlString: string): void {
  let url: URL;
  
  try {
    url = new URL(urlString);
  } catch {
    throw new Error('Invalid URL format');
  }

  // Block localhost and private IP ranges
  const hostname = url.hostname.toLowerCase();
  
  // Block localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    throw new Error('Access to localhost is not allowed');
  }
  
  // Block private IP ranges
  const privateIpPatterns = [
    /^10\./,                    // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
    /^192\.168\./,              // 192.168.0.0/16
    /^169\.254\./,              // 169.254.0.0/16 (link-local)
    /^127\./,                   // 127.0.0.0/8 (loopback)
    /^0\.0\.0\.0$/,             // 0.0.0.0
    /^fc00:/i,                  // fc00::/7 (IPv6 private)
    /^fe80:/i,                  // fe80::/10 (IPv6 link-local)
  ];
  
  for (const pattern of privateIpPatterns) {
    if (pattern.test(hostname)) {
      throw new Error('Access to private IP ranges is not allowed');
    }
  }
  
  // Only allow http and https protocols
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS protocols are allowed');
  }
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

  // Validate URL to prevent SSRF attacks
  validateUrl(url);

  // Basic fetch (in production, use proper scraping library)
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
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

  // Handle empty arrays
  if (input.length === 0) {
    return [];
  }

  // Merge array items (filter out null/undefined)
  const validItems = input.filter(item => item != null);
  
  if (validItems.length === 0) {
    return [];
  }
  
  if (typeof validItems[0] === 'object') {
    return Object.assign({}, ...validItems);
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
      // Proper CSV conversion for arrays of objects
      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
        const headers = Object.keys(data[0]).map(escapeCSV).join(',');
        const rows = data.map(item => 
          Object.values(item).map(v => escapeCSV(String(v))).join(',')
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
 * Escape CSV value (handle commas, quotes, newlines)
 */
function escapeCSV(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
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
