/**
 * Base Agent Class - Common functionality for all AI agents
 */

export interface AgentConfig {
  id: string;
  name: string;
  model: string;
  category: 'core' | 'specialized' | 'workflow' | 'productivity' | 'creative';
  icon: string;
  color: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  capabilities: string[];
  apiEndpoint?: string;
}

export interface AgentHistory {
  timestamp: number;
  type: string;
  input: any;
  output: any;
  duration?: number;
}

export type AgentStatus = 'ready' | 'processing' | 'error' | 'offline';

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected status: AgentStatus = 'ready';
  protected history: AgentHistory[] = [];
  protected lastActivity: number = Date.now();

  constructor(config: AgentConfig) {
    this.config = config;
    this.log(`Agent ${config.name} initialized`);
  }

  // Getters
  get id(): string { return this.config.id; }
  get name(): string { return this.config.name; }
  get model(): string { return this.config.model; }
  get category(): string { return this.config.category; }
  get icon(): string { return this.config.icon; }
  get color(): string { return this.config.color; }
  get priority(): string { return this.config.priority; }
  get description(): string { return this.config.description; }
  get capabilities(): string[] { return this.config.capabilities; }
  get agentStatus(): AgentStatus { return this.status; }
  get agentHistory(): AgentHistory[] { return [...this.history]; }

  // Status management
  protected updateStatus(status: AgentStatus): void {
    this.status = status;
    this.lastActivity = Date.now();
    this.log(`Status updated to: ${status}`);
  }

  // History management
  protected addToHistory(entry: Omit<AgentHistory, 'timestamp'>): void {
    this.history.push({
      ...entry,
      timestamp: Date.now()
    });
    
    // Keep only last 50 entries
    if (this.history.length > 50) {
      this.history = this.history.slice(-50);
    }
  }

  // Logging
  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${this.name}: ${message}`;
    
    switch (level) {
      case 'warn':
        console.warn(logMessage);
        break;
      case 'error':
        console.error(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  // Abstract methods that must be implemented by subclasses
  abstract chat?(message: string, context?: any): Promise<string>;
  abstract generateCode?(prompt: string, language?: string): Promise<string>;
  abstract analyzeImage?(imageData: string | File, prompt?: string): Promise<string>;

  // Common functionality
  async healthCheck(): Promise<boolean> {
    try {
      this.updateStatus('processing');
      // Basic health check - can be overridden by subclasses
      await new Promise(resolve => setTimeout(resolve, 100));
      this.updateStatus('ready');
      return true;
    } catch (error) {
      this.updateStatus('error');
      this.log(`Health check failed: ${error}`, 'error');
      return false;
    }
  }

  getInfo(): AgentConfig & { status: AgentStatus; lastActivity: number } {
    return {
      ...this.config,
      status: this.status,
      lastActivity: this.lastActivity
    };
  }

  clearHistory(): void {
    this.history = [];
    this.log('History cleared');
  }

  // Utility methods
  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  protected formatResponse(response: string): string {
    return response.trim();
  }
}