/**
 * WorkflowBuilder Component
 * Visual workflow builder using CHUCK scoring engine
 */

import { useState, useCallback } from 'react';
import { scoreWorkflow, detectCycles } from 'lib/workflowScoring';
import type { UniversalNode } from '../../nodes/universal';
import { 
  createAIAgentNode, 
  createProcessorNode, 
  createOutputNode
} from '../../nodes/universal';
import NodePalette from './NodePalette';
import toolsData from 'lib/tools.json';

interface Tool {
  id: string;
  name: string;
  namePl: string;
  type: string;
  workflows: string[];
  scoreMatrix: {
    quality: number;
    speed: number;
    creativity: number;
    technical: number;
  };
}

const tools = toolsData as Tool[];

interface WorkflowEdge {
  from: string;
  to: string;
}

export default function WorkflowBuilder() {
  const [nodes, setNodes] = useState<UniversalNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showPalette, setShowPalette] = useState(true);
  const [workflowScore, setWorkflowScore] = useState<any>(null);

  // Add node from selected tool
  const handleSelectTool = useCallback((tool: Tool) => {
    const nodeId = `node-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const newNode = createAIAgentNode(nodeId, tool.id, {
      prompt: 'Wygeneruj treść...',
    });
    
    setNodes(prev => [...prev, newNode]);
    setSelectedTool(tool);
  }, []);

  // Add processor node
  const addProcessorNode = useCallback((processorType: 'scrape' | 'transform' | 'export' | 'filter' | 'merge') => {
    const nodeId = `processor-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const newNode = createProcessorNode(nodeId, processorType, {});
    setNodes(prev => [...prev, newNode]);
  }, []);

  // Add output node
  const addOutputNode = useCallback((outputType: 'email' | 'pdf' | 'slack' | 'webhook' | 'database' | 'file') => {
    const nodeId = `output-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const newNode = createOutputNode(nodeId, outputType, {});
    setNodes(prev => [...prev, newNode]);
  }, []);

  // Connect two nodes
  const connectNodes = useCallback((fromId: string, toId: string) => {
    setEdges(prev => {
      // Check if edge already exists
      if (prev.some(e => e.from === fromId && e.to === toId)) {
        return prev;
      }
      return [...prev, { from: fromId, to: toId }];
    });
  }, []);

  // Remove node
  const removeNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
  }, []);

  // Calculate workflow score
  const evaluateWorkflow = useCallback(() => {
    if (nodes.length === 0) {
      alert('Dodaj przynajmniej jeden węzeł do workflow');
      return;
    }

    const workflowNodes = nodes.map(node => ({
      id: node.id,
      toolId: node.type === 'AI_AGENT' ? (node as any).config.toolId : node.id,
      type: node.type,
      category: 'general', // Default category
    }));

    const result = scoreWorkflow({
      nodes: workflowNodes,
      edges,
    }, []);

    setWorkflowScore(result.quality);
  }, [nodes, edges]);

  // Detect cycles
  const checkCycles = useCallback(() => {
    const workflowNodes = nodes.map(node => ({
      id: node.id,
      toolId: node.type === 'AI_AGENT' ? (node as any).config.toolId : node.id,
      type: node.type,
      category: 'general', // Default category
    }));

    const result = detectCycles({ nodes: workflowNodes, edges });
    
    if (!result.hasCycles) {
      alert('✅ Brak cykli w workflow!');
    } else {
      alert(`⚠️ Znaleziono ${result.cycles.length} cykl(i):\n${result.cycles.map((c: string[]) => c.join(' → ')).join('\n')}`);
    }
  }, [nodes, edges]);

  // Get tool by ID
  const getToolById = (toolId: string): Tool | undefined => {
    return tools.find(t => t.id === toolId);
  };

  // Get node display name
  const getNodeDisplayName = (node: UniversalNode): string => {
    if (node.type === 'AI_AGENT') {
      const tool = getToolById((node as any).config.toolId);
      return tool?.namePl || tool?.name || 'AI Agent';
    }
    return node.label || node.type;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Node Palette Sidebar */}
      {showPalette && (
        <div className="w-80 flex-shrink-0">
          <NodePalette onSelectTool={handleSelectTool} />
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {showPalette ? '◀ Ukryj' : '▶ Pokaż'} Paletę
            </button>

            <div className="h-6 w-px bg-gray-300" />

            <button
              onClick={() => addProcessorNode('transform')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Processor
            </button>

            <button
              onClick={() => addOutputNode('email')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              + Output
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={checkCycles}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              🔍 Sprawdź Cykle
            </button>
            <button
              onClick={evaluateWorkflow}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              📊 Oceń Workflow
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Workflow Stats */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-3xl font-bold text-blue-600">{nodes.length}</div>
                <div className="text-sm text-gray-600">Węzłów</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-3xl font-bold text-green-600">{edges.length}</div>
                <div className="text-sm text-gray-600">Połączeń</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-3xl font-bold text-purple-600">
                  {workflowScore ? `${workflowScore.overall}%` : '-'}
                </div>
                <div className="text-sm text-gray-600">Wynik Jakości</div>
              </div>
            </div>

            {/* Workflow Score Details */}
            {workflowScore && (
              <div className="mb-6 bg-white rounded-lg p-6 shadow">
                <h3 className="text-lg font-bold mb-4">📊 Ocena Workflow</h3>
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Struktura</div>
                    <div className="text-2xl font-bold">{workflowScore.breakdown.structure}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Wydajność</div>
                    <div className="text-2xl font-bold">{workflowScore.breakdown.efficiency}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Niezawodność</div>
                    <div className="text-2xl font-bold">{workflowScore.breakdown.reliability}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Prostota</div>
                    <div className="text-2xl font-bold">{workflowScore.breakdown.complexity}%</div>
                  </div>
                </div>

                {workflowScore.issues.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-red-600 mb-2">⚠️ Problemy:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {workflowScore.issues.map((issue: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {workflowScore.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">💡 Sugestie:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {workflowScore.suggestions.map((suggestion: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Nodes List */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-bold mb-4">🔗 Węzły Workflow</h3>
              
              {nodes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">👈</p>
                  <p>Wybierz narzędzie z palety aby rozpocząć</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {nodes.map((node, index) => (
                    <div 
                      key={node.id}
                      className="border rounded-lg p-4 hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-bold text-gray-700">
                              #{index + 1}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {node.type}
                            </span>
                          </div>
                          <h4 className="font-semibold">{getNodeDisplayName(node)}</h4>
                          <p className="text-sm text-gray-600">ID: {node.id}</p>
                        </div>
                        <button
                          onClick={() => removeNode(node.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          Usuń
                        </button>
                      </div>

                      {/* Node connections */}
                      <div className="mt-3 space-y-2">
                        {index < nodes.length - 1 && (
                          <button
                            onClick={() => connectNodes(node.id, nodes[index + 1].id)}
                            className="w-full px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                          >
                            ↓ Połącz z #{index + 2}
                          </button>
                        )}
                        
                        {/* Show connections */}
                        {edges.filter(e => e.from === node.id).length > 0 && (
                          <div className="text-xs text-gray-600">
                            Połączony z: {
                              edges
                                .filter(e => e.from === node.id)
                                .map(e => {
                                  const targetIndex = nodes.findIndex(n => n.id === e.to);
                                  return `#${targetIndex + 1}`;
                                })
                                .join(', ')
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clear All */}
            {nodes.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    if (confirm('Czy na pewno chcesz wyczyścić cały workflow?')) {
                      setNodes([]);
                      setEdges([]);
                      setWorkflowScore(null);
                    }
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  🗑️ Wyczyść Workflow
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
