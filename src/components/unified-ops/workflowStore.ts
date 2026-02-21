import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import type { Node, Edge, Connection, NodeChange, EdgeChange } from '@xyflow/react'

export type NodeStatus = 'idle' | 'running' | 'complete' | 'error'

export interface WorkflowNode extends Node {
    data: {
        label: string
        type: string
        status?: NodeStatus
        config?: Record<string, any>
        result?: any
        error?: string
    }
}

export interface WorkflowState {
    nodes: WorkflowNode[]
    edges: Edge[]
    selectedNode: WorkflowNode | null
    isExecuting: boolean
    workflowName: string
    history: { nodes: WorkflowNode[], edges: Edge[] }[]
    historyIndex: number

    setNodes: (nodes: WorkflowNode[]) => void
    setEdges: (edges: Edge[]) => void
    onNodesChange: (changes: NodeChange[]) => void
    onEdgesChange: (changes: EdgeChange[]) => void
    onConnect: (connection: Connection) => void

    addNode: (node: WorkflowNode) => void
    removeNode: (nodeId: string) => void
    updateNode: (nodeId: string, data: Partial<WorkflowNode['data']>) => void
    setNodeStatus: (nodeId: string, status: NodeStatus) => void

    selectNode: (nodeId: string | null) => void
    setWorkflowName: (name: string) => void

    executeWorkflow: () => Promise<void>
    resetWorkflow: () => void

    undo: () => void
    redo: () => void
    canUndo: () => boolean
    canRedo: () => boolean
    addToHistory: () => void

    exportWorkflow: () => string
    importWorkflow: (data: string) => void
    clearWorkflow: () => void
}

export const useWorkflowStore = create<WorkflowState>()(
    immer((set, get) => ({
        nodes: [],
        edges: [],
        selectedNode: null,
        isExecuting: false,
        workflowName: 'Untitled Workflow',
        history: [],
        historyIndex: -1,

        setNodes: (nodes) => set({ nodes }),
        setEdges: (edges) => set({ edges }),

        onNodesChange: (changes) => set((state) => {
            // @ts-ignore
            state.nodes = applyNodeChanges(changes, state.nodes as any) as WorkflowNode[]
        }),

        onEdgesChange: (changes) => set((state) => {
            state.edges = applyEdgeChanges(changes, state.edges)
        }),

        onConnect: (connection) => set((state) => {
            state.edges = addEdge(connection, state.edges)
        }),

        addNode: (node) => set((state) => {
            state.nodes.push(node)
            get().addToHistory()
        }),

        removeNode: (nodeId) => set((state) => {
            state.nodes = state.nodes.filter(n => n.id !== nodeId)
            state.edges = state.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
            if (state.selectedNode?.id === nodeId) {
                state.selectedNode = null
            }
            get().addToHistory()
        }),

        updateNode: (nodeId, data) => set((state) => {
            const node = state.nodes.find(n => n.id === nodeId)
            if (node) {
                node.data = { ...node.data, ...data }
            }
        }),

        setNodeStatus: (nodeId, status) => set((state) => {
            const node = state.nodes.find(n => n.id === nodeId)
            if (node) {
                node.data = { ...node.data, status }
            }
        }),

        selectNode: (nodeId) => set((state) => {
            state.selectedNode = nodeId ? state.nodes.find(n => n.id === nodeId) || null : null
        }),

        setWorkflowName: (name) => set({ workflowName: name }),

        addToHistory: () => set((state) => {
            const currentState = { nodes: JSON.parse(JSON.stringify(state.nodes)), edges: JSON.parse(JSON.stringify(state.edges)) }
            state.history = state.history.slice(0, state.historyIndex + 1)
            state.history.push(currentState)
            if (state.history.length > 50) {
                state.history.shift()
            } else {
                state.historyIndex++
            }
        }),

        undo: () => set((state) => {
            if (state.historyIndex > 0) {
                state.historyIndex--
                const previousState = state.history[state.historyIndex]
                state.nodes = JSON.parse(JSON.stringify(previousState.nodes))
                state.edges = JSON.parse(JSON.stringify(previousState.edges))
            }
        }),

        redo: () => set((state) => {
            if (state.historyIndex < state.history.length - 1) {
                state.historyIndex++
                const nextState = state.history[state.historyIndex]
                state.nodes = JSON.parse(JSON.stringify(nextState.nodes))
                state.edges = JSON.parse(JSON.stringify(nextState.edges))
            }
        }),

        canUndo: () => {
            return get().historyIndex > 0
        },

        canRedo: () => {
            const { history, historyIndex } = get()
            return historyIndex < history.length - 1
        },

        exportWorkflow: () => {
            const { nodes, edges, workflowName } = get()
            return JSON.stringify({ nodes, edges, workflowName }, null, 2)
        },

        importWorkflow: (data: string) => {
            try {
                const workflow = JSON.parse(data)
                set({
                    nodes: workflow.nodes || [],
                    edges: workflow.edges || [],
                    workflowName: workflow.workflowName || 'Imported Workflow'
                })
                get().addToHistory()
            } catch (error) {
                console.error('Failed to import workflow:', error)
            }
        },

        clearWorkflow: () => set({
            nodes: [],
            edges: [],
            selectedNode: null,
            workflowName: 'Untitled Workflow'
        }),

        executeWorkflow: async () => {
            const { nodes, edges } = get()

            set({ isExecuting: true })

            // Reset statuses
            nodes.forEach(node => {
                get().setNodeStatus(node.id, 'running')
                get().updateNode(node.id, { result: undefined, error: undefined })
            })

            try {
                // Use CHUCK Tunnel or Localhost
                // For now hardcoded to localhost as per plan, user can switch to tunnel URL
                const endpoint = 'http://localhost:5152/mcpexecute'

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nodes, edges }),
                })

                if (!response.ok) {
                    throw new Error(`Execution failed: ${response.statusText}`)
                }

                const data = await response.json()

                if (!data.success) {
                    throw new Error(data.error || 'Unknown execution error')
                }

                // Update nodes with results
                Object.entries(data.results).forEach(([nodeId, result]: [string, any]) => {
                    get().updateNode(nodeId, {
                        result: result.output || result,
                        status: 'complete',
                        error: undefined
                    })
                })

            } catch (error) {
                console.error('Workflow execution failed:', error)
                get().nodes.forEach(node => {
                    if (node.data.status === 'running') {
                        get().updateNode(node.id, {
                            status: 'error',
                            error: error instanceof Error ? error.message : 'Execution failed'
                        })
                    }
                })
            } finally {
                set({ isExecuting: false })
            }
        },

        resetWorkflow: () => set((state) => {
            state.nodes.forEach(node => {
                node.data.status = 'idle'
                node.data.result = undefined
                node.data.error = undefined
            })
        }),
    }))
)
