import { useCallback, useRef, useMemo } from 'react'
import type { DragEvent } from 'react'
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
    ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useWorkflowStore } from './workflowStore'
import { AIAgentNode } from './nodes/AIAgentNode'
import { ProcessorNode } from './nodes/ProcessorNode'
import { OutputNode } from './nodes/OutputNode'

const nodeTypes = {
    aiAgent: AIAgentNode,
    processor: ProcessorNode,
    output: OutputNode,
}

interface WorkflowCanvasProps {
    minimapEnabled?: boolean
    minimapOpacity?: number
    backgroundImage?: string | null
    backgroundOpacity?: number
}

export function WorkflowCanvas({
    minimapEnabled = true,
    minimapOpacity = 1,
    backgroundImage = null,
    backgroundOpacity = 0.3,
}: WorkflowCanvasProps) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        selectNode,
    } = useWorkflowStore()

    const enhancedEdges = useMemo(() => {
        return edges.map(edge => {
            // @ts-ignore
            const sourceNode = nodes.find(n => n.id === edge.source)
            // @ts-ignore
            const targetNode = nodes.find(n => n.id === edge.target)

            const isActive = sourceNode?.data.status === 'complete' && targetNode?.data.status === 'running'
            const isCompleted = sourceNode?.data.status === 'complete' && targetNode?.data.status === 'complete'

            return {
                ...edge,
                animated: isActive,
                style: {
                    stroke: isActive
                        ? 'oklch(0.75 0.19 145)'
                        : isCompleted
                            ? 'oklch(0.55 0.22 145)'
                            : 'oklch(0.45 0.05 265)',
                    strokeWidth: isActive ? 3 : 2,
                },
            }
        })
    }, [edges, nodes])

    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault()

            const type = event.dataTransfer.getData('application/reactflow')
            if (!type) return

            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
            if (!reactFlowBounds) return

            const position = {
                x: event.clientX - reactFlowBounds.left - 100,
                y: event.clientY - reactFlowBounds.top - 50,
            }

            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: {
                    label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
                    type,
                    status: 'idle' as const,
                    config: {},
                },
            }

            addNode(newNode as any)
        },
        [addNode]
    )

    const onNodeClick = useCallback(
        (_: any, node: any) => {
            selectNode(node.id)
        },
        [selectNode]
    )

    return (
        <div ref={reactFlowWrapper} className="flex-1 h-full w-full h-screen relative bg-zinc-950" id="workflow-canvas">
            <ReactFlow
                nodes={nodes}
                edges={enhancedEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                className="bg-zinc-950"
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={16}
                    size={1}
                    color="#333"
                />
                <Controls className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                {minimapEnabled && (
                    <MiniMap
                        nodeColor={(node) => {
                            const status = node.data?.status
                            if (status === 'running') return 'oklch(0.75 0.19 145)'
                            if (status === 'complete') return 'oklch(0.55 0.22 145)'
                            if (status === 'error') return 'oklch(0.55 0.22 25)'
                            return 'oklch(0.35 0.05 265)'
                        }}
                        className="!bg-card !border-border"
                        style={{
                            opacity: minimapOpacity,
                        }}
                    />
                )}
            </ReactFlow>
        </div>
    )
}

export function WorkflowCanvasWithProvider(props: WorkflowCanvasProps) {
    return (
        <ReactFlowProvider>
            <WorkflowCanvas {...props} />
        </ReactFlowProvider>
    )
}
