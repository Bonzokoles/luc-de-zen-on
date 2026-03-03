import { Play, ArrowCounterClockwise, Trash } from '@phosphor-icons/react'
import { useWorkflowStore } from './workflowStore'

export function Toolbar() {
    const { executeWorkflow, isExecuting, resetWorkflow, clearWorkflow } = useWorkflowStore()

    return (
        <div className="h-14 border-b border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => executeWorkflow()}
                    disabled={isExecuting}
                    className={`
            flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all
            ${isExecuting
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'}
          `}
                >
                    {isExecuting ? (
                        <Play className="w-4 h-4 animate-spin" weight="fill" />
                    ) : (
                        <Play className="w-4 h-4" weight="fill" />
                    )}
                    {isExecuting ? 'Running...' : 'Run Workflow'}
                </button>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={resetWorkflow}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-all"
                    title="Reset Status"
                >
                    <ArrowCounterClockwise className="w-5 h-5" />
                </button>
                <button
                    onClick={clearWorkflow}
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/10 rounded-md transition-all"
                    title="Clear All"
                >
                    <Trash className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
