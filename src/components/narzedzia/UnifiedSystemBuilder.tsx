import { useState, useEffect } from 'react';
import type { UniversalWorkflow, UniversalNode, NodeConnection, AIAgentNode, ProcessorNode, OutputNode } from '../../nodes/universal';

interface Tool {
  id: string;
  name: string;
  pl: string;
  type: string;
  category: string;
  score: number;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  workflow: Partial<UniversalWorkflow>;
}

// Type guard functions
function isAIAgentNode(node: UniversalNode): node is AIAgentNode {
  return node.type === 'AI_AGENT';
}

function isProcessorNode(node: UniversalNode): node is ProcessorNode {
  return node.type === 'PROCESSOR';
}

function isOutputNode(node: UniversalNode): node is OutputNode {
  return node.type === 'OUTPUT';
}

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'seo-content-pipeline',
    name: 'SEO Content Pipeline',
    description: 'Research → Write → Optimize → Publish',
    category: 'SEO/Content',
    workflow: {
      name: 'SEO Content Pipeline',
      nodes: [
        { id: 'node1', type: 'AI_AGENT', config: { toolId: 'perplexity', prompt: 'Research topic' } },
        { id: 'node2', type: 'AI_AGENT', config: { toolId: 'jasper', prompt: 'Write article' } },
        { id: 'node3', type: 'AI_AGENT', config: { toolId: 'surfer-seo', prompt: 'Optimize for SEO' } },
        { id: 'node4', type: 'OUTPUT', config: { destination: 'webhook', target: 'https://cms.example.com/publish' } }
      ],
      connections: [
        { from: 'node1', to: 'node2' },
        { from: 'node2', to: 'node3' },
        { from: 'node3', to: 'node4' }
      ]
    }
  },
  {
    id: 'code-review-pipeline',
    name: 'Code Review & Documentation',
    description: 'Review → Document → Test → Deploy',
    category: 'Code/Dev',
    workflow: {
      name: 'Code Review Pipeline',
      nodes: [
        { id: 'node1', type: 'AI_AGENT', config: { toolId: 'cursor', prompt: 'Review code for issues' } },
        { id: 'node2', type: 'AI_AGENT', config: { toolId: 'github-copilot', prompt: 'Generate documentation' } },
        { id: 'node3', type: 'PROCESSOR', config: { operation: 'export', format: 'markdown' } },
        { id: 'node4', type: 'OUTPUT', config: { destination: 'file', target: 'docs/review.md' } }
      ],
      connections: [
        { from: 'node1', to: 'node2' },
        { from: 'node2', to: 'node3' },
        { from: 'node3', to: 'node4' }
      ]
    }
  },
  {
    id: 'ecommerce-optimization',
    name: 'E-commerce Product Optimization',
    description: 'Analyze → Optimize → Update → Notify',
    category: 'E-commerce/B2B',
    workflow: {
      name: 'Product Optimization Pipeline',
      nodes: [
        { id: 'node1', type: 'PROCESSOR', config: { operation: 'scrape', source: 'https://shop.example.com/products' } },
        { id: 'node2', type: 'AI_AGENT', config: { toolId: 'jasper', prompt: 'Optimize product descriptions' } },
        { id: 'node3', type: 'AI_AGENT', config: { toolId: 'shopify-magic', prompt: 'Generate SEO metadata' } },
        { id: 'node4', type: 'OUTPUT', config: { destination: 'webhook', target: 'https://shop.example.com/api/update' } }
      ],
      connections: [
        { from: 'node1', to: 'node2' },
        { from: 'node2', to: 'node3' },
        { from: 'node3', to: 'node4' }
      ]
    }
  },
  {
    id: 'social-media-campaign',
    name: 'Social Media Campaign',
    description: 'Generate content for all platforms',
    category: 'Creative/Productivity',
    workflow: {
      name: 'Social Media Campaign',
      nodes: [
        { id: 'node1', type: 'AI_AGENT', config: { toolId: 'jasper', prompt: 'Generate campaign idea' } },
        { id: 'node2', type: 'AI_AGENT', config: { toolId: 'canva-ai', prompt: 'Create visuals' } },
        { id: 'node3', type: 'PROCESSOR', config: { operation: 'transform', format: 'json' } },
        { id: 'node4', type: 'OUTPUT', config: { destination: 'slack', target: '#marketing' } }
      ],
      connections: [
        { from: 'node1', to: 'node2' },
        { from: 'node2', to: 'node3' },
        { from: 'node3', to: 'node4' }
      ]
    }
  },
  {
    id: 'data-analysis-report',
    name: 'Data Analysis & Reporting',
    description: 'Collect → Analyze → Visualize → Send',
    category: 'New 2026',
    workflow: {
      name: 'Data Analysis Pipeline',
      nodes: [
        { id: 'node1', type: 'PROCESSOR', config: { operation: 'scrape', source: 'https://analytics.example.com' } },
        { id: 'node2', type: 'AI_AGENT', config: { toolId: 'claude', prompt: 'Analyze trends and insights' } },
        { id: 'node3', type: 'AI_AGENT', config: { toolId: 'gamma-app', prompt: 'Create presentation' } },
        { id: 'node4', type: 'OUTPUT', config: { destination: 'email', target: 'team@example.com' } }
      ],
      connections: [
        { from: 'node1', to: 'node2' },
        { from: 'node2', to: 'node3' },
        { from: 'node3', to: 'node4' }
      ]
    }
  }
];

export default function UnifiedSystemBuilder() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [workflow, setWorkflow] = useState<Partial<UniversalWorkflow> | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    qualityScore?: number;
    isValidDAG?: boolean;
    executionOrder?: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: string;
    executedNodes: number;
    results: any[];
  } | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const response = await fetch('/api/chuck/tools');
      const data = await response.json();
      setTools(data.tools || []);
    } catch (err) {
      console.error('Failed to load tools:', err);
      setError('Failed to load AI tools');
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = WORKFLOW_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setWorkflow({
        id: `workflow-${Date.now()}`,
        ...template.workflow
      });
      setAnalysisResult(null);
      setExecutionResult(null);
      setError('');
    }
  };

  const analyzeWorkflow = async () => {
    if (!workflow) return;

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/chuck/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow: {
            ...workflow,
            id: workflow.id || `workflow-${Date.now()}`,
            name: workflow.name || 'Unnamed Workflow'
          },
          options: {
            includeRecommendations: true,
            includeCompatibility: true,
            includeExecutionPlan: true
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze workflow');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeWorkflow = async () => {
    if (!workflow) return;

    setIsExecuting(true);
    setError('');

    try {
      // Execute each node in the workflow
      const results: Array<{
        nodeId: string;
        type: string;
        toolId?: string;
        result: any;
      }> = [];
      
      for (const node of workflow.nodes || []) {
        if (isAIAgentNode(node)) {
          const response = await fetch('/api/chuck/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              toolId: node.config.toolId,
              prompt: node.config.prompt || '',
              parameters: node.config.parameters || {}
            })
          });

          const data = await response.json();
          results.push({
            nodeId: node.id,
            type: node.type,
            toolId: node.config.toolId,
            result: data
          });
        }
      }

      setExecutionResult({
        status: 'success',
        executedNodes: results.length,
        results
      });
    } catch (err: any) {
      setError(err.message || 'Failed to execute workflow');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">🚀 Jimbo Unified System</h1>
        <p className="text-xl text-gray-600">
          Create, analyze, and execute AI workflows using 140+ tools
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-6">
          <div className="text-3xl font-bold text-blue-600 mb-1">{tools.length}</div>
          <div className="text-sm text-gray-700">AI Tools Available</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-6">
          <div className="text-3xl font-bold text-green-600 mb-1">{WORKFLOW_TEMPLATES.length}</div>
          <div className="text-sm text-gray-700">Ready Templates</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-6">
          <div className="text-3xl font-bold text-purple-600 mb-1">3</div>
          <div className="text-sm text-gray-700">Node Types</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-lg p-6">
          <div className="text-3xl font-bold text-orange-600 mb-1">5</div>
          <div className="text-sm text-gray-700">Categories</div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">📋 Choose Workflow Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORKFLOW_TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className={`text-left p-4 border-2 rounded-lg transition-all hover:shadow-lg ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <h3 className="font-bold text-lg mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
              <span className="inline-block text-xs bg-gray-100 px-2 py-1 rounded">
                {template.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Details */}
      {workflow && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">⚙️ Workflow Configuration</h2>
          <div className="mb-4">
            <h3 className="font-bold mb-2">Name: {workflow.name}</h3>
            <p className="text-sm text-gray-600 mb-4">ID: {workflow.id}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Nodes ({workflow.nodes?.length || 0}):</h3>
            <div className="space-y-2">
              {workflow.nodes?.map((node, idx) => (
                <div key={node.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <span className="text-2xl">
                    {node.type === 'AI_AGENT' && '🤖'}
                    {node.type === 'PROCESSOR' && '⚙️'}
                    {node.type === 'OUTPUT' && '📤'}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold">{node.type}</div>
                    <div className="text-sm text-gray-600">
                      {node.type === 'AI_AGENT' && node.config?.toolId && `Tool: ${node.config.toolId}`}
                      {node.type === 'PROCESSOR' && node.config?.operation && `Operation: ${node.config.operation}`}
                      {node.type === 'OUTPUT' && node.config?.destination && `Destination: ${node.config.destination}`}
                    </div>
                  </div>
                  {idx < (workflow.nodes?.length || 0) - 1 && (
                    <span className="text-gray-400">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={analyzeWorkflow}
              disabled={isAnalyzing}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-semibold"
            >
              {isAnalyzing ? 'Analyzing...' : '🔍 Analyze Workflow'}
            </button>
            <button
              onClick={executeWorkflow}
              disabled={isExecuting || !analysisResult}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400 font-semibold"
            >
              {isExecuting ? 'Executing...' : '▶️ Execute Workflow'}
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-semibold">❌ Error: {error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">📊 Analysis Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <div className="text-sm text-gray-600 mb-1">Quality Score</div>
              <div className="text-2xl font-bold text-green-600">
                {analysisResult.qualityScore?.toFixed(1) || 'N/A'}%
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <div className="text-sm text-gray-600 mb-1">Valid DAG</div>
              <div className="text-2xl font-bold text-blue-600">
                {analysisResult.isValidDAG ? '✅ Yes' : '❌ No'}
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded p-4">
              <div className="text-sm text-gray-600 mb-1">Execution Steps</div>
              <div className="text-2xl font-bold text-purple-600">
                {analysisResult.executionOrder?.length || 0}
              </div>
            </div>
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700">
              View Full Analysis
            </summary>
            <pre className="mt-2 p-4 bg-gray-50 rounded text-sm overflow-auto">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Execution Results */}
      {executionResult && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">✅ Execution Results</h2>
          <div className="mb-4">
            <p className="text-lg">
              Status: <span className="font-bold text-green-600">{executionResult.status}</span>
            </p>
            <p className="text-sm text-gray-600">
              Executed {executionResult.executedNodes} nodes
            </p>
          </div>
          <details>
            <summary className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700">
              View Full Results
            </summary>
            <pre className="mt-2 p-4 bg-gray-50 rounded text-sm overflow-auto">
              {JSON.stringify(executionResult, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
