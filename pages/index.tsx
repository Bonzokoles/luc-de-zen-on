import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Play, Save, Download, Trash2, Plus, Code, Zap, Database, Mail, Settings, CreditCard, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { createChuckClient, type ChuckClient } from '../client/src/lib/chuckClient';
import type { UniversalNode, AIAgentNode, ProcessorNode, OutputNode } from '../src/nodes/universal';
import type { WorkflowEdge } from '../lib/workflowScoring';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Tool {
  id: string;
  name: string;
  category: string;
  provider: string;
  capabilities: string[];
  compatibility: string[];
}

interface WorkflowNode extends UniversalNode {
  position?: { x: number; y: number };
}

interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

interface CustomPlugin {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
}

interface BillingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  executions: number;
}

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function MyBonzoDashboard() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'tools' | 'workflow' | 'plugins' | 'billing'>('tools');
  
  // Tools state
  const [tools, setTools] = useState<Tool[]>([]);
  const [toolsLoading, setToolsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  
  // Workflow state
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  
  // Plugin state
  const [plugins, setPlugins] = useState<CustomPlugin[]>([]);
  const [selectedPlugin, setSelectedPlugin] = useState<CustomPlugin | null>(null);
  const [pluginCode, setPluginCode] = useState('');
  
  // Billing state
  const [currentPlan] = useState<string>('free');
  const [usageStats, setUsageStats] = useState({
    executions: 0,
    limit: 100,
    resetDate: new Date().toISOString()
  });
  
  // CHUCK client
  const [chuckClient, setChuckClient] = useState<ChuckClient | null>(null);
  const [authToken, setAuthToken] = useState('');
  
  // Toast notifications
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Load tools from tools.json
  useEffect(() => {
    const loadTools = async () => {
      try {
        const response = await fetch('/lib/tools.json');
        const data = await response.json();
        setTools(data);
      } catch (error) {
        console.error('Failed to load tools:', error);
      } finally {
        setToolsLoading(false);
      }
    };
    loadTools();
  }, []);

  // Initialize CHUCK client
  useEffect(() => {
    const client = createChuckClient({
      apiUrl: 'https://api.mybonzo.com/chuck/exec',
      onRateLimit: (retryAfter) => {
        showToast(`Rate limit exceeded. Please wait ${retryAfter} seconds.`, 'error');
      },
      onError: (error) => {
        console.error('CHUCK client error:', error);
      }
    });
    setChuckClient(client);
  }, [showToast]);

  // Set auth token when available
  useEffect(() => {
    if (chuckClient && authToken) {
      chuckClient.setAuthToken(authToken);
    }
  }, [chuckClient, authToken]);

  // Load saved workflows from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mybonzo-workflows');
    if (saved) {
      try {
        setWorkflows(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load workflows:', error);
      }
    }
  }, []);

  // Load plugins from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mybonzo-plugins');
    if (saved) {
      try {
        setPlugins(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load plugins:', error);
      }
    }
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const categories = useMemo(() => {
    const cats = new Set(tools.map(t => t.category));
    return ['all', ...Array.from(cats).sort()];
  }, [tools]);

  const providers = useMemo(() => {
    const provs = new Set(tools.map(t => t.provider));
    return ['all', ...Array.from(provs).sort()];
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesProvider = selectedProvider === 'all' || tool.provider === selectedProvider;
      return matchesSearch && matchesCategory && matchesProvider;
    });
  }, [tools, searchQuery, selectedCategory, selectedProvider]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleCreateWorkflow = useCallback(() => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: `New Workflow ${workflows.length + 1}`,
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setWorkflows([...workflows, newWorkflow]);
    setCurrentWorkflow(newWorkflow);
    localStorage.setItem('mybonzo-workflows', JSON.stringify([...workflows, newWorkflow]));
  }, [workflows]);

  const handleAddNode = useCallback((type: 'AI_AGENT' | 'PROCESSOR' | 'OUTPUT', toolId?: string) => {
    if (!currentWorkflow) return;
    
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      name: `${type} Node`,
      config: type === 'AI_AGENT' ? { toolId: toolId || '' } :
             type === 'PROCESSOR' ? { operation: 'transform' } :
             { channel: 'email' },
      position: { 
        x: Math.random() * 400 + 50, 
        y: Math.random() * 300 + 50 
      }
    };
    
    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: [...currentWorkflow.nodes, newNode],
      updatedAt: new Date().toISOString()
    };
    
    setCurrentWorkflow(updatedWorkflow);
    setWorkflows(workflows.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
    localStorage.setItem('mybonzo-workflows', JSON.stringify(workflows.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w)));
    setSelectedNode(newNode);
  }, [currentWorkflow, workflows]);

  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    if (!currentWorkflow) return;
    
    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: currentWorkflow.nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n),
      updatedAt: new Date().toISOString()
    };
    
    setCurrentWorkflow(updatedWorkflow);
    setWorkflows(workflows.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
    localStorage.setItem('mybonzo-workflows', JSON.stringify(workflows.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w)));
  }, [currentWorkflow, workflows]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    if (!currentWorkflow) return;
    
    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: currentWorkflow.nodes.filter(n => n.id !== nodeId),
      edges: currentWorkflow.edges.filter(e => e.from !== nodeId && e.to !== nodeId),
      updatedAt: new Date().toISOString()
    };
    
    setCurrentWorkflow(updatedWorkflow);
    setWorkflows(workflows.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
    localStorage.setItem('mybonzo-workflows', JSON.stringify(workflows.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w)));
    setSelectedNode(null);
  }, [currentWorkflow, workflows]);

  const handleExecuteWorkflow = useCallback(async () => {
    if (!currentWorkflow || !chuckClient) {
      showToast('Please create a workflow and set authentication token first', 'error');
      return;
    }
    
    if (!authToken) {
      showToast('Please set your authentication token in the settings', 'error');
      return;
    }
    
    setIsExecuting(true);
    setExecutionResult(null);
    
    try {
      const result = await chuckClient.execWorkflow({
        nodes: currentWorkflow.nodes,
        edges: currentWorkflow.edges
      });
      
      setExecutionResult(result);
      
      if (result.success) {
        setUsageStats(prev => ({
          ...prev,
          executions: prev.executions + 1
        }));
        showToast('Workflow executed successfully', 'success');
      } else {
        showToast(`Workflow execution failed: ${result.error}`, 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setExecutionResult({
        success: false,
        error: errorMessage
      });
      showToast(`Execution error: ${errorMessage}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  }, [currentWorkflow, chuckClient, authToken, showToast]);

  const handleSavePlugin = useCallback(() => {
    if (!selectedPlugin) {
      const newPlugin: CustomPlugin = {
        id: `plugin-${Date.now()}`,
        name: `Plugin ${plugins.length + 1}`,
        code: pluginCode,
        enabled: true
      };
      setPlugins([...plugins, newPlugin]);
      setSelectedPlugin(newPlugin);
      localStorage.setItem('mybonzo-plugins', JSON.stringify([...plugins, newPlugin]));
    } else {
      const updated = plugins.map(p => 
        p.id === selectedPlugin.id ? { ...p, code: pluginCode } : p
      );
      setPlugins(updated);
      localStorage.setItem('mybonzo-plugins', JSON.stringify(updated));
    }
  }, [selectedPlugin, pluginCode, plugins]);

  const handleDeletePlugin = useCallback((pluginId: string) => {
    const updated = plugins.filter(p => p.id !== pluginId);
    setPlugins(updated);
    localStorage.setItem('mybonzo-plugins', JSON.stringify(updated));
    if (selectedPlugin?.id === pluginId) {
      setSelectedPlugin(null);
      setPluginCode('');
    }
  }, [plugins, selectedPlugin]);

  const handleStripeCheckout = useCallback(async (planId: string) => {
    showToast(`Redirecting to Stripe checkout for ${planId} plan...`, 'info');
    // In production, this would redirect to Stripe Checkout
    // window.location.href = `https://checkout.stripe.com/...?plan=${planId}`;
  }, [showToast]);

  // ============================================================================
  // RENDER: TOOLS GRID
  // ============================================================================

  const renderToolsGrid = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tools, providers, capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
            
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {providers.map(prov => (
                <option key={prov} value={prov}>
                  {prov === 'all' ? 'All Providers' : prov}
                </option>
              ))}
            </select>
            
            <div className="flex-1 text-right">
              <span className="text-sm text-gray-600">
                Showing {filteredTools.length} of {tools.length} tools
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      {toolsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map(tool => (
            <div
              key={tool.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-600">{tool.provider}</p>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {tool.capabilities.slice(0, 3).map(cap => (
                    <span
                      key={cap}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      {cap}
                    </span>
                  ))}
                  {tool.capabilities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{tool.capabilities.length - 3}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setActiveTab('workflow');
                    if (currentWorkflow) {
                      handleAddNode('AI_AGENT', tool.id);
                    }
                  }}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Add to Workflow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ============================================================================
  // RENDER: WORKFLOW BUILDER
  // ============================================================================

  const renderWorkflowBuilder = () => (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <select
              value={currentWorkflow?.id || ''}
              onChange={(e) => {
                const workflow = workflows.find(w => w.id === e.target.value);
                setCurrentWorkflow(workflow || null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Workflow</option>
              {workflows.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            
            <button
              onClick={handleCreateWorkflow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Workflow
            </button>
          </div>
          
          {currentWorkflow && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExecuteWorkflow}
                disabled={isExecuting || currentWorkflow.nodes.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Execute
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  const data = JSON.stringify(currentWorkflow, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${currentWorkflow.name}.json`;
                  a.click();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          )}
        </div>
        
        {currentWorkflow && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={currentWorkflow.name}
              onChange={(e) => {
                const updated = { ...currentWorkflow, name: e.target.value };
                setCurrentWorkflow(updated);
                setWorkflows(workflows.map(w => w.id === updated.id ? updated : w));
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {currentWorkflow && (
        <>
          {/* Node Toolbar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Add Node:</span>
              <button
                onClick={() => handleAddNode('AI_AGENT')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                AI Agent
              </button>
              <button
                onClick={() => handleAddNode('PROCESSOR')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Processor
              </button>
              <button
                onClick={() => handleAddNode('OUTPUT')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Output
              </button>
            </div>
          </div>

          {/* Workflow Canvas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Nodes List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-semibold text-gray-900">Workflow Nodes</h3>
                {currentWorkflow.nodes.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No nodes yet. Click the buttons above to add nodes.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentWorkflow.nodes.map((node, idx) => (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedNode?.id === node.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              node.type === 'AI_AGENT' ? 'bg-purple-100 text-purple-700' :
                              node.type === 'PROCESSOR' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {node.type === 'AI_AGENT' ? <Zap className="w-5 h-5" /> :
                               node.type === 'PROCESSOR' ? <Database className="w-5 h-5" /> :
                               <Mail className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{node.name}</div>
                              <div className="text-sm text-gray-600">{node.type}</div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNode(node.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {idx < currentWorkflow.nodes.length - 1 && (
                          <div className="ml-5 mt-2 h-6 w-0.5 bg-gray-300"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Node Editor */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Node Configuration</h3>
                {selectedNode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Node Name
                      </label>
                      <input
                        type="text"
                        value={selectedNode.name}
                        onChange={(e) => handleUpdateNode(selectedNode.id, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    {selectedNode.type === 'AI_AGENT' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tool
                        </label>
                        <select
                          value={(selectedNode.config as any).toolId || ''}
                          onChange={(e) => handleUpdateNode(selectedNode.id, {
                            config: { ...selectedNode.config, toolId: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Tool</option>
                          {tools.map(tool => (
                            <option key={tool.id} value={tool.id}>
                              {tool.name} ({tool.provider})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {selectedNode.type === 'PROCESSOR' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Operation
                        </label>
                        <select
                          value={(selectedNode.config as any).operation || 'transform'}
                          onChange={(e) => handleUpdateNode(selectedNode.id, {
                            config: { ...selectedNode.config, operation: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="scrape">Scrape</option>
                          <option value="transform">Transform</option>
                          <option value="export">Export</option>
                          <option value="filter">Filter</option>
                          <option value="merge">Merge</option>
                          <option value="split">Split</option>
                        </select>
                      </div>
                    )}
                    
                    {selectedNode.type === 'OUTPUT' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Channel
                        </label>
                        <select
                          value={(selectedNode.config as any).channel || 'email'}
                          onChange={(e) => handleUpdateNode(selectedNode.id, {
                            config: { ...selectedNode.config, channel: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="email">Email</option>
                          <option value="slack">Slack</option>
                          <option value="webhook">Webhook</option>
                          <option value="pdf">PDF</option>
                          <option value="storage">Storage</option>
                          <option value="api">API</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t">
                      <details className="text-sm">
                        <summary className="cursor-pointer font-medium text-gray-700">
                          Advanced Config (JSON)
                        </summary>
                        <textarea
                          value={JSON.stringify(selectedNode.config, null, 2)}
                          onChange={(e) => {
                            try {
                              const config = JSON.parse(e.target.value);
                              handleUpdateNode(selectedNode.id, { config });
                            } catch (error) {
                              // Invalid JSON - show error to user
                              console.error('Invalid JSON in node configuration:', error);
                              showToast('Invalid JSON in node configuration. Please fix the JSON and try again.', 'error');
                            }
                          }}
                          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs"
                          rows={8}
                        />
                      </details>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Select a node to configure
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Execution Result */}
          {executionResult && (
            <div className={`rounded-lg border-2 p-6 ${
              executionResult.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {executionResult.success ? (
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    executionResult.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {executionResult.success ? 'Execution Successful' : 'Execution Failed'}
                  </h3>
                  <pre className="mt-2 text-sm whitespace-pre-wrap">
                    {JSON.stringify(executionResult, null, 2)}
                  </pre>
                </div>
                <button
                  onClick={() => setExecutionResult(null)}
                  className="p-1 hover:bg-white/50 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ============================================================================
  // RENDER: PLUGIN MANAGER
  // ============================================================================

  const renderPluginManager = () => (
    <div className="space-y-6">
      {/* Plugin Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={selectedPlugin?.id || ''}
              onChange={(e) => {
                const plugin = plugins.find(p => p.id === e.target.value);
                setSelectedPlugin(plugin || null);
                setPluginCode(plugin?.code || '');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">New Plugin</option>
              {plugins.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            
            {selectedPlugin && (
              <input
                type="text"
                value={selectedPlugin.name}
                onChange={(e) => {
                  const updated = plugins.map(p =>
                    p.id === selectedPlugin.id ? { ...p, name: e.target.value } : p
                  );
                  setPlugins(updated);
                  setSelectedPlugin({ ...selectedPlugin, name: e.target.value });
                  localStorage.setItem('mybonzo-plugins', JSON.stringify(updated));
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSavePlugin}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Plugin
            </button>
            
            {selectedPlugin && (
              <button
                onClick={() => handleDeletePlugin(selectedPlugin.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Plugin Code Editor
          </h3>
        </div>
        <div className="h-[600px]">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={pluginCode}
            onChange={(value) => setPluginCode(value || '')}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </div>
      </div>

      {/* Plugin Template */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Plugin Template</h4>
        <pre className="text-sm text-blue-800 whitespace-pre-wrap">
{`// Custom Plugin Template
export default {
  name: "My Custom Plugin",
  version: "1.0.0",
  
  // Plugin initialization
  async init(context) {
    console.log("Plugin initialized");
  },
  
  // Main execution function
  async execute(input, config) {
    // Your custom logic here
    return {
      success: true,
      data: input,
      message: "Plugin executed successfully"
    };
  },
  
  // Cleanup function
  async cleanup() {
    console.log("Plugin cleanup");
  }
};`}
        </pre>
      </div>

      {/* Plugin List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Installed Plugins</h3>
        {plugins.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No plugins installed yet
          </div>
        ) : (
          <div className="space-y-2">
            {plugins.map(plugin => (
              <div
                key={plugin.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    plugin.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="font-medium text-gray-900">{plugin.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const updated = plugins.map(p =>
                        p.id === plugin.id ? { ...p, enabled: !p.enabled } : p
                      );
                      setPlugins(updated);
                      localStorage.setItem('mybonzo-plugins', JSON.stringify(updated));
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      plugin.enabled
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {plugin.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlugin(plugin);
                      setPluginCode(plugin.code);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: BILLING
  // ============================================================================

  const billingPlans: BillingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      executions: 100,
      features: [
        '100 workflow executions/month',
        'Access to 140+ tools',
        'Basic workflow builder',
        'Community support'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 49,
      interval: 'month',
      executions: 10000,
      features: [
        '10,000 workflow executions/month',
        'Access to 140+ tools',
        'Advanced workflow builder',
        'Custom plugins',
        'Priority support',
        'API access'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      interval: 'month',
      executions: -1,
      features: [
        'Unlimited workflow executions',
        'Access to 140+ tools',
        'Advanced workflow builder',
        'Custom plugins',
        'Dedicated support',
        'API access',
        'SLA guarantee',
        'Custom integrations',
        'On-premise deployment'
      ]
    }
  ];

  const renderBilling = () => (
    <div className="space-y-6">
      {/* Current Usage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Current Usage</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Workflow Executions</span>
              <span className="text-sm font-medium text-gray-900">
                {usageStats.executions} / {usageStats.limit === -1 ? '∞' : usageStats.limit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: usageStats.limit === -1 ? '100%' : `${Math.min((usageStats.executions / usageStats.limit) * 100, 100)}%`
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <div className="text-sm text-gray-600">Current Plan</div>
              <div className="text-lg font-semibold text-gray-900 capitalize">{currentPlan}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Next Reset</div>
              <div className="text-sm font-medium text-gray-900">
                {new Date(usageStats.resetDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          API Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Authentication Token
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Enter your API token"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  if (authToken) {
                    // SECURITY WARNING: Storing auth tokens in localStorage makes them accessible to any JavaScript
                    // running in this origin, which means they can be exfiltrated if an XSS vulnerability exists.
                    // Prefer HTTP-only cookies where possible. If using localStorage, ensure you have strong XSS
                    // protections (e.g., strict Content Security Policy headers and robust input sanitization) in
                    // place at the application and infrastructure level.
                    localStorage.setItem('mybonzo-auth-token', authToken);
                    showToast('Authentication token saved successfully', 'success');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Get your API token from your account settings
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-6 text-xl">Pricing Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {billingPlans.map(plan => (
            <div
              key={plan.id}
              className={`rounded-lg border-2 p-6 ${
                currentPlan === plan.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {currentPlan === plan.id ? (
                <button
                  disabled
                  className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-medium"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => handleStripeCheckout(plan.id)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {plan.price === 0 ? 'Start Free' : 'Upgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
        <div className="text-center py-8 text-gray-500">
          No payment history yet
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">MB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MyBonzo</h1>
                <p className="text-xs text-gray-600">B2B AI Workflow Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                <Zap className="w-4 h-4" />
                <span className="font-medium">{usageStats.executions} / {usageStats.limit === -1 ? '∞' : usageStats.limit}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {[
              { id: 'tools', label: 'Tools', icon: Database },
              { id: 'workflow', label: 'Workflow Builder', icon: Zap },
              { id: 'plugins', label: 'Plugins', icon: Code },
              { id: 'billing', label: 'Billing', icon: CreditCard }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-1 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'tools' && renderToolsGrid()}
        {activeTab === 'workflow' && renderWorkflowBuilder()}
        {activeTab === 'plugins' && renderPluginManager()}
        {activeTab === 'billing' && renderBilling()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            © 2024 MyBonzo.com - B2B AI Workflow Platform
          </div>
        </div>
      </footer>
      
      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in ${
              toast.type === 'success' ? 'bg-green-600 text-white' :
              toast.type === 'error' ? 'bg-red-600 text-white' :
              'bg-blue-600 text-white'
            }`}
          >
            {toast.type === 'success' && <Check className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'info' && <Settings className="w-5 h-5 flex-shrink-0" />}
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
