export interface NodeDefinition {
    type: string
    label: string
    iconName: string
    category: 'ai' | 'process' | 'output'
    description: string
    color?: string
}

export const nodeDefinitions: NodeDefinition[] = [
    {
        type: 'aiAgent',
        label: 'AI Agent',
        iconName: 'Brain',
        category: 'ai',
        description: 'Generative AI model (Gemini, Claude, GPT)',
        color: 'oklch(0.65 0.2 145)'
    },
    {
        type: 'processor',
        label: 'Processor',
        iconName: 'GearSix',
        category: 'process',
        description: 'Data transformation or logic',
        color: 'oklch(0.7 0.18 265)'
    },
    {
        type: 'output',
        label: 'Output',
        iconName: 'Export',
        category: 'output',
        description: 'Final result or external action',
        color: 'oklch(0.65 0.2 30)'
    }
]

export function getNodeDefinition(type: string): NodeDefinition | undefined {
    return nodeDefinitions.find(def => def.type === type)
}
