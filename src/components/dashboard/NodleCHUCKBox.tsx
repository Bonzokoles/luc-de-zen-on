import { useState } from 'react';
import { Cpu, Workflow, ChevronDown, ChevronUp } from 'lucide-react';

const NodleCHUCKBox = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const workflows = [
    { name: 'SEO Content Pipeline', status: 'active', score: 92 },
    { name: 'Code Review & Docs', status: 'ready', score: 88 },
    { name: 'E-commerce Optimizer', status: 'draft', score: 75 },
  ];

  return (
    <div className="relative z-20">
      <div
        className={`bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-lg overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-[600px] ring-1 ring-indigo-500/30' : 'max-h-[80px] hover:bg-gray-800/60'
          }`}
      >
        {/* Header - Always Visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-indigo-500/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-indigo-300">
              AI Workflow / Nodle CHUCK
            </h2>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-indigo-400" />
          ) : (
            <ChevronDown className="w-6 h-6 text-indigo-400" />
          )}
        </button>

        {/* Expandable Content - Expands UP-DOWN (scaleY) */}
        <div
          className={`px-6 pb-6 transition-all duration-500 ease-out origin-top ${isExpanded ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
            }`}
        >
          {/* Mini Canvas / Workflow List */}
          <div className="space-y-3 mb-4">
            {workflows.map((workflow, idx) => (
              <div
                key={idx}
                className="p-4 bg-indigo-900/30 border border-indigo-500/30 rounded-lg hover:border-indigo-400 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-indigo-400" />
                    <span className="font-semibold text-gray-200">{workflow.name}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${workflow.status === 'active'
                        ? 'bg-green-500/20 text-green-300'
                        : workflow.status === 'ready'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}
                  >
                    {workflow.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${workflow.score}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">{workflow.score}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <a
            href="/narzedzia/workflow-builder"
            className="block w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-center rounded-lg font-semibold transition-colors"
          >
            Otwórz Workflow Builder
          </a>
        </div>
      </div>
    </div>
  );
};

export default NodleCHUCKBox;
