import type React from 'react'
import type { DragEvent } from 'react'
import { Brain, GearSix, Export, Cube } from '@phosphor-icons/react'
import { nodeDefinitions } from './nodeDefinitions'

const iconMap: Record<string, React.ElementType> = { Brain, GearSix, Export }

export function NodePalette() {
    const onDragStart = (event: DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }

    const getIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName]
        return IconComponent ? <IconComponent className="w-5 h-5" /> : <Cube className="w-5 h-5" />
    }

    return (
        <div className="w-64 border-r border-zinc-800 bg-zinc-950 p-4 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white mb-4">Unified Ops</h2>

            <div className="space-y-4">
                {['ai', 'process', 'output'].map((category) => (
                    <div key={category}>
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">{category}</h3>
                        <div className="space-y-2">
                            {nodeDefinitions
                                .filter(node => node.category === category)
                                .map((node) => (
                                    <div
                                        key={node.type}
                                        className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 cursor-grab hover:bg-zinc-800 hover:border-zinc-700 transition-all text-zinc-300"
                                        draggable
                                        onDragStart={(event) => onDragStart(event, node.type)}
                                    >
                                        <div style={{ color: node.color }}>
                                            {getIcon(node.iconName)}
                                        </div>
                                        <span className="text-sm font-medium">{node.label}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
