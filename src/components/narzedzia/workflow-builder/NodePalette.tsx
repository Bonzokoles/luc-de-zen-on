/**
 * NodePalette Component
 * Displays available AI tools from CHUCK database for workflow building
 */

import { useState, useMemo } from 'react';
import type { Tool } from 'lib/compatibilityMatrix';
import toolsData from 'lib/tools.json';

const tools = toolsData as Tool[];

interface NodePaletteProps {
  onSelectTool?: (tool: Tool) => void;
  filterType?: string;
  filterWorkflow?: string;
}

export default function NodePalette({ 
  onSelectTool, 
  filterType, 
  filterWorkflow 
}: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(filterType || 'all');
  const [selectedWorkflow, setSelectedWorkflow] = useState(filterWorkflow || 'all');
  const [sortBy, setSortBy] = useState<'name' | 'quality' | 'speed'>('name');

  // Get unique types and workflows
  const types = useMemo(() => {
    const typeSet = new Set(tools.map(t => t.type));
    return ['all', ...Array.from(typeSet).sort()];
  }, []);

  const workflows = useMemo(() => {
    const workflowSet = new Set<string>();
    tools.forEach(t => t.workflows.forEach(w => workflowSet.add(w)));
    return ['all', ...Array.from(workflowSet).sort()];
  }, []);

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let filtered = tools;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.namePl.toLowerCase().includes(query) ||
        tool.type.toLowerCase().includes(query) ||
        tool.workflows.some(w => w.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(tool => tool.type === selectedType);
    }

    // Apply workflow filter
    if (selectedWorkflow !== 'all') {
      filtered = filtered.filter(tool => tool.workflows.includes(selectedWorkflow));
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'quality') {
        return b.scoreMatrix.quality - a.scoreMatrix.quality;
      } else if (sortBy === 'speed') {
        return b.scoreMatrix.speed - a.scoreMatrix.speed;
      }
      return 0;
    });

    return filtered;
  }, [searchQuery, selectedType, selectedWorkflow, sortBy]);

  // Get type color
  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      writer: 'bg-blue-100 text-blue-800',
      social: 'bg-purple-100 text-purple-800',
      design: 'bg-pink-100 text-pink-800',
      code: 'bg-green-100 text-green-800',
      video: 'bg-red-100 text-red-800',
      audio: 'bg-yellow-100 text-yellow-800',
      research: 'bg-indigo-100 text-indigo-800',
      analytics: 'bg-teal-100 text-teal-800',
      productivity: 'bg-cyan-100 text-cyan-800',
      automation: 'bg-orange-100 text-orange-800',
      crm: 'bg-lime-100 text-lime-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-xl font-bold mb-1">🎯 CHUCK Node Palette</h2>
        <p className="text-sm opacity-90">{tools.length} narzędzi AI dostępnych</p>
      </div>

      {/* Controls */}
      <div className="p-4 border-b space-y-3">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="🔍 Szukaj narzędzia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">Wszystkie typy</option>
            {types.slice(1).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={selectedWorkflow}
            onChange={(e) => setSelectedWorkflow(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">Wszystkie workflow</option>
            {workflows.slice(1).map(workflow => (
              <option key={workflow} value={workflow}>{workflow}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sortuj:</span>
          <button
            onClick={() => setSortBy('name')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'name' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Nazwa
          </button>
          <button
            onClick={() => setSortBy('quality')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'quality' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Jakość
          </button>
          <button
            onClick={() => setSortBy('speed')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'speed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Szybkość
          </button>
        </div>
      </div>

      {/* Tools List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-sm text-gray-600 mb-3">
          Znaleziono: {filteredTools.length} narzędzi
        </div>
        
        <div className="space-y-2">
          {filteredTools.map(tool => (
            <div
              key={tool.id}
              onClick={() => onSelectTool?.(tool)}
              className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-blue-400"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-600">{tool.namePl}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(tool.type)}`}>
                  {tool.type}
                </span>
              </div>

              {/* Workflows */}
              <div className="flex flex-wrap gap-1 mb-2">
                {tool.workflows.map(workflow => (
                  <span 
                    key={workflow}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {workflow}
                  </span>
                ))}
              </div>

              {/* Score bars */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-16">Jakość:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${tool.scoreMatrix.quality}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">
                    {tool.scoreMatrix.quality}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-16">Szybkość:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${tool.scoreMatrix.speed}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">
                    {tool.scoreMatrix.speed}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">🔍</p>
            <p>Nie znaleziono narzędzi</p>
            <p className="text-sm mt-1">Spróbuj zmienić filtry lub wyszukiwanie</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 bg-gray-50 border-t text-sm text-gray-600">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="font-semibold text-gray-900">{tools.length}</div>
            <div className="text-xs">Narzędzi</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{types.length - 1}</div>
            <div className="text-xs">Typy</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{workflows.length - 1}</div>
            <div className="text-xs">Workflows</div>
          </div>
        </div>
      </div>
    </div>
  );
}
