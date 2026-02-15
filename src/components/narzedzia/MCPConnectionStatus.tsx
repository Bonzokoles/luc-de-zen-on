/**
 * MCP Connection Status Component
 * Displays real-time connection status and allows manual control
 */

import { useState, useEffect, useCallback } from 'react';
import { Activity, Check, X, RefreshCw, AlertTriangle, Zap } from 'lucide-react';

interface ConnectionStatus {
  connected: boolean;
  lastHeartbeat: number;
  reconnectAttempts: number;
  serverUrl: string;
  error?: string;
}

interface MCPStatusProps {
  serverUrl?: string;
  autoConnect?: boolean;
}

const MCPConnectionStatus: React.FC<MCPStatusProps> = ({
  serverUrl = '/api/mcp-server',
  autoConnect = true,
}) => {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    lastHeartbeat: Date.now(),
    reconnectAttempts: 0,
    serverUrl,
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [heartbeats, setHeartbeats] = useState<number[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  }, []);

  const testConnection = useCallback(async () => {
    setIsConnecting(true);
    addLog('Testing connection...');

    try {
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(prev => ({
          ...prev,
          connected: true,
          lastHeartbeat: Date.now(),
          error: undefined,
        }));
        addLog(`✅ Connected to ${data.name} v${data.version}`);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Connection failed';
      setStatus(prev => ({
        ...prev,
        connected: false,
        error: errorMsg,
      }));
      addLog(`❌ Connection failed: ${errorMsg}`);
    } finally {
      setIsConnecting(false);
    }
  }, [serverUrl, addLog]);

  const sendHeartbeat = useCallback(async () => {
    if (!status.connected) return;

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'health_check' }),
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const timestamp = Date.now();
        setStatus(prev => ({
          ...prev,
          lastHeartbeat: timestamp,
        }));
        setHeartbeats(prev => [...prev.slice(-9), timestamp]);
        addLog('💓 Heartbeat OK');
      } else {
        throw new Error('Heartbeat failed');
      }
    } catch (error) {
      addLog('⚠️ Heartbeat failed - connection may be lost');
      setStatus(prev => ({ ...prev, connected: false }));
    }
  }, [status.connected, serverUrl, addLog]);

  const disconnect = useCallback(() => {
    setStatus(prev => ({
      ...prev,
      connected: false,
    }));
    addLog('🔌 Disconnected manually');
  }, [addLog]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      testConnection();
    }
  }, [autoConnect, testConnection]);

  // Heartbeat interval
  useEffect(() => {
    if (!status.connected) return;

    const interval = setInterval(() => {
      sendHeartbeat();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [status.connected, sendHeartbeat]);

  const timeSinceLastHeartbeat = Date.now() - status.lastHeartbeat;
  const isHealthy = status.connected && timeSinceLastHeartbeat < 60000;

  return (
    <div className="card bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isHealthy ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <Activity className={`w-6 h-6 ${
              isHealthy ? 'text-green-500' : 'text-red-500'
            }`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">MCP Connection Status</h3>
            <p className="text-sm text-slate-400">Model Context Protocol 2025</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
          isHealthy 
            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
            : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {isHealthy ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Connection Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Server URL */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-slate-300">Server</span>
          </div>
          <p className="text-white font-mono text-sm truncate">{status.serverUrl}</p>
        </div>

        {/* Last Heartbeat */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-slate-300">Last Heartbeat</span>
          </div>
          <p className="text-white text-sm">
            {Math.floor(timeSinceLastHeartbeat / 1000)}s ago
          </p>
        </div>

        {/* Heartbeat History */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-slate-300">Heartbeat History</span>
          </div>
          <div className="flex gap-1">
            {heartbeats.length === 0 ? (
              <span className="text-xs text-slate-500">No heartbeats yet</span>
            ) : (
              heartbeats.map((beat, i) => (
                <div
                  key={i}
                  className="flex-1 h-8 bg-green-500/20 border border-green-500/50 rounded"
                  title={new Date(beat).toLocaleTimeString()}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {status.error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400">Connection Error</p>
              <p className="text-sm text-red-300 mt-1">{status.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={testConnection}
          disabled={isConnecting}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 
                   disabled:bg-slate-600 disabled:cursor-not-allowed
                   text-white rounded-lg font-semibold transition-colors"
        >
          {isConnecting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {status.connected ? 'Reconnect' : 'Connect'}
        </button>

        {status.connected && (
          <>
            <button
              onClick={sendHeartbeat}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 
                       text-white rounded-lg font-semibold transition-colors"
            >
              <Activity className="w-4 h-4" />
              Send Heartbeat
            </button>

            <button
              onClick={disconnect}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 
                       text-white rounded-lg font-semibold transition-colors"
            >
              <X className="w-4 h-4" />
              Disconnect
            </button>
          </>
        )}
      </div>

      {/* Connection Logs */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">Connection Log</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-xs text-slate-500">No logs yet</p>
          ) : (
            logs.map((log, i) => (
              <p key={i} className="text-xs text-slate-400 font-mono">
                {log}
              </p>
            ))
          )}
        </div>
      </div>

      {/* Features */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">Features</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Connection Management',
            'Auto-reconnect',
            'Heartbeat Monitoring',
            'Safety Validation',
            'Skill Validation',
            'System Prompts',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MCPConnectionStatus;
