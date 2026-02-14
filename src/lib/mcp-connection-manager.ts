/**
 * MCP Connection Manager
 * Handles connection lifecycle, keepalive, and reconnection logic
 * Based on Model Context Protocol 2025 best practices
 */

export interface MCPConnectionConfig {
  serverUrl: string;
  reconnectInterval?: number; // ms between reconnect attempts
  maxReconnectAttempts?: number;
  heartbeatInterval?: number; // ms between heartbeat checks
  connectionTimeout?: number; // ms before connection considered dead
  enableSafetyChecks?: boolean;
}

export interface MCPConnectionStatus {
  connected: boolean;
  lastHeartbeat: number;
  reconnectAttempts: number;
  serverUrl: string;
  error?: string;
}

export class MCPConnectionManager {
  private config: Required<MCPConnectionConfig>;
  private status: MCPConnectionStatus;
  private heartbeatTimer?: NodeJS.Timeout;
  private reconnectTimer?: NodeJS.Timeout;
  private connectionCheckTimer?: NodeJS.Timeout;
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor(config: MCPConnectionConfig) {
    this.config = {
      serverUrl: config.serverUrl,
      reconnectInterval: config.reconnectInterval ?? 5000,
      maxReconnectAttempts: config.maxReconnectAttempts ?? 10,
      heartbeatInterval: config.heartbeatInterval ?? 30000, // 30 seconds
      connectionTimeout: config.connectionTimeout ?? 60000, // 60 seconds
      enableSafetyChecks: config.enableSafetyChecks ?? true,
    };

    this.status = {
      connected: false,
      lastHeartbeat: Date.now(),
      reconnectAttempts: 0,
      serverUrl: config.serverUrl,
    };
  }

  /**
   * Initialize connection to MCP server
   */
  async connect(): Promise<void> {
    try {
      // Test connection with health check
      const response = await fetch(`${this.config.serverUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      this.status.connected = true;
      this.status.lastHeartbeat = Date.now();
      this.status.reconnectAttempts = 0;
      this.status.error = undefined;

      // Start heartbeat monitoring
      this.startHeartbeat();
      this.startConnectionMonitor();

      this.emit('connected', this.status);
    } catch (error) {
      this.status.connected = false;
      this.status.error = error instanceof Error ? error.message : 'Connection failed';
      
      this.emit('error', this.status);
      
      // Attempt reconnection
      if (this.status.reconnectAttempts < this.config.maxReconnectAttempts) {
        this.scheduleReconnect();
      }
      
      throw error;
    }
  }

  /**
   * Disconnect from MCP server
   */
  disconnect(): void {
    this.stopHeartbeat();
    this.stopConnectionMonitor();
    this.stopReconnectTimer();
    
    this.status.connected = false;
    this.emit('disconnected', this.status);
  }

  /**
   * Send heartbeat to keep connection alive
   */
  private async sendHeartbeat(): Promise<void> {
    if (!this.status.connected) return;

    try {
      const response = await fetch(`${this.config.serverUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        this.status.lastHeartbeat = Date.now();
        this.emit('heartbeat', { timestamp: this.status.lastHeartbeat });
      } else {
        throw new Error('Heartbeat failed');
      }
    } catch (error) {
      console.error('Heartbeat error:', error);
      this.handleConnectionLoss();
    }
  }

  /**
   * Start periodic heartbeat
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(
      () => this.sendHeartbeat(),
      this.config.heartbeatInterval
    );
  }

  /**
   * Stop heartbeat timer
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  /**
   * Monitor connection health
   */
  private startConnectionMonitor(): void {
    this.stopConnectionMonitor();
    this.connectionCheckTimer = setInterval(() => {
      const timeSinceLastHeartbeat = Date.now() - this.status.lastHeartbeat;
      
      if (timeSinceLastHeartbeat > this.config.connectionTimeout) {
        console.warn('Connection timeout detected');
        this.handleConnectionLoss();
      }
    }, 10000); // Check every 10 seconds
  }

  /**
   * Stop connection monitor
   */
  private stopConnectionMonitor(): void {
    if (this.connectionCheckTimer) {
      clearInterval(this.connectionCheckTimer);
      this.connectionCheckTimer = undefined;
    }
  }

  /**
   * Handle connection loss
   */
  private handleConnectionLoss(): void {
    if (!this.status.connected) return;

    this.status.connected = false;
    this.status.error = 'Connection lost';
    this.stopHeartbeat();
    
    this.emit('disconnected', this.status);
    
    // Attempt reconnection
    if (this.status.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.scheduleReconnect();
    } else {
      this.emit('max_reconnect_attempts', this.status);
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    this.stopReconnectTimer();
    
    this.status.reconnectAttempts++;
    const delay = this.config.reconnectInterval * Math.min(this.status.reconnectAttempts, 5); // Exponential backoff
    
    this.emit('reconnecting', { 
      attempt: this.status.reconnectAttempts,
      maxAttempts: this.config.maxReconnectAttempts,
      delay 
    });

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(console.error);
    }, delay);
  }

  /**
   * Stop reconnect timer
   */
  private stopReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
  }

  /**
   * Get current connection status
   */
  getStatus(): MCPConnectionStatus {
    return { ...this.status };
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.status.connected;
  }

  /**
   * Event listener management
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  /**
   * Cleanup all resources
   */
  destroy(): void {
    this.disconnect();
    this.eventListeners.clear();
  }
}

export default MCPConnectionManager;
