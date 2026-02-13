/**
 * CHUCK Client Library
 * 
 * Client-side library for executing workflows via CHUCK proxy
 */

export interface WorkflowExecution {
  nodeId?: string;
  toolId?: string;
  input?: any;
  config?: Record<string, any>;
  workflow?: {
    nodes: any[];
    edges: any[];
  };
}

export interface ChuckResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    executionTime: number;
    nodeId?: string;
    nodeType?: string;
  };
}

export interface ChuckClientConfig {
  apiUrl?: string;
  authToken?: string;
  onRateLimit?: (retryAfter: number) => void;
  onError?: (error: Error) => void;
}

export class ChuckClient {
  private apiUrl: string;
  private authToken?: string;
  private config: ChuckClientConfig;

  constructor(config: ChuckClientConfig = {}) {
    this.apiUrl = config.apiUrl || 'https://api.mybonzo.com/chuck/exec';
    this.authToken = config.authToken;
    this.config = config;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Execute a workflow or single node
   */
  async exec(execution: WorkflowExecution): Promise<ChuckResponse> {
    if (!this.authToken) {
      throw new Error('Authentication token required. Call setAuthToken() first.');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify(execution),
      });

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
        
        if (this.config.onRateLimit) {
          this.config.onRateLimit(retryAfter);
        }

        return {
          success: false,
          error: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
          metadata: {
            executionTime: 0,
          },
        };
      }

      // Handle authentication errors
      if (response.status === 401) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Authentication failed',
          metadata: {
            executionTime: 0,
          },
        };
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          metadata: {
            executionTime: 0,
          },
        };
      }

      // Success
      const data = await response.json();
      return {
        success: true,
        data,
        metadata: {
          executionTime: 0,
        },
      };
    } catch (error) {
      if (this.config.onError) {
        this.config.onError(error as Error);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          executionTime: 0,
        },
      };
    }
  }

  /**
   * Execute a complete workflow
   */
  async execWorkflow(workflow: { nodes: any[]; edges: any[] }): Promise<ChuckResponse> {
    return this.exec({ workflow });
  }

  /**
   * Execute a single tool
   */
  async execTool(toolId: string, input?: any, config?: Record<string, any>): Promise<ChuckResponse> {
    return this.exec({ toolId, input, config });
  }

  /**
   * Get health status of CHUCK service
   */
  async health(): Promise<{ status: string; service: string; version: string }> {
    try {
      const healthUrl = this.apiUrl.replace('/chuck/exec', '/health');
      const response = await fetch(healthUrl);

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Health check error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Create a CHUCK client instance
 */
export function createChuckClient(config?: ChuckClientConfig): ChuckClient {
  return new ChuckClient(config);
}

// Default export for convenience
export default ChuckClient;
