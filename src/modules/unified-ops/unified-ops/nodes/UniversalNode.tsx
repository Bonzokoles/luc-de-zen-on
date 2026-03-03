import { memo, useState } from 'react'
import type React from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { Brain, GearSix, Export, Cube, CheckCircle, WarningCircle, Circle, Clock, CaretUp, CaretDown } from '@phosphor-icons/react'
import type { WorkflowNode } from '../workflowStore'
import { getNodeDefinition } from '../nodeDefinitions'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for classes (since I'm not sure if src/lib/utils is available/compatible)
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Inline simple UI components to avoid dependency on missing @/components/ui/card etc
const Card = ({ className, children, ...props }: any) => (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm bg-white dark:bg-zinc-950", className)} {...props}>
        {children}
    </div>
)

const Badge = ({ className, variant, ...props }: any) => (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)} {...props} />
)

const Button = ({ className, variant, size, ...props }: any) => (
    <button className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", className)} {...props} />
)

export const UniversalNode = memo(({ data, id, selected }: NodeProps<WorkflowNode>) => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const statusColors = {
        idle: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
        running: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        complete: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
        error: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    }

    const statusIcons = {
        idle: <Clock className="w-3 h-3" />,
        running: <Circle className="w-3 h-3 animate-spin" weight="bold" />,
        complete: <CheckCircle className="w-3 h-3" weight="fill" />,
        error: <WarningCircle className="w-3 h-3" weight="fill" />,
    }

    const borderClass = data.status === 'running'
        ? 'border-blue-500 shadow-lg shadow-blue-500/20'
        : data.status === 'error'
            ? 'border-red-500 shadow-md shadow-red-500/20'
            : data.status === 'complete'
                ? 'border-green-500/50 shadow-sm shadow-green-500/10'
                : selected
                    ? 'border-primary shadow-lg shadow-primary/20'
                    : 'border-zinc-200 dark:border-zinc-800'

    const nodeDef = getNodeDefinition(data.type)

    const getIcon = () => {
        if (!nodeDef) return <Cube className="w-4 h-4" />
        const iconMap: Record<string, React.ElementType> = { Brain, GearSix, Export }
        const IconComponent = iconMap[nodeDef.iconName]
        return IconComponent ? <IconComponent className="w-4 h-4" /> : <Cube className="w-4 h-4" />
    }

    const getCategoryColor = () => {
        if (!nodeDef) return 'text-zinc-500'
        switch (nodeDef.category) {
            case 'ai': return 'text-green-500'
            case 'process': return 'text-purple-500'
            case 'output': return 'text-orange-500'
            default: return 'text-zinc-500'
        }
    }

    const formatResult = (result: any) => {
        if (!result) return null
        const str = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
        return str.length > 150 ? str.slice(0, 150) + '...' : str
    }

    const isNodeActive = data.status === 'running' || data.status === 'complete'

    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 transition-all duration-200 !bg-blue-500 !border-blue-600 hover:!bg-blue-400"
            />
            <Card className={cn(
                'min-w-[240px] transition-all duration-300 border bg-white dark:bg-zinc-900',
                isCollapsed ? 'max-w-[280px]' : 'max-w-[320px]',
                borderClass
            )}>
                <div
                    className={cn(
                        "flex items-center justify-between gap-2 cursor-pointer p-4",
                        !isCollapsed && "pb-3 border-b border-zinc-100 dark:border-zinc-800"
                    )}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                            className={cn(
                                "w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300",
                                isNodeActive ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-400"
                            )}
                        />
                        <div className={getCategoryColor()}>
                            {getIcon()}
                        </div>
                        <h3 className="font-semibold text-sm truncate">{data.label}</h3>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {isCollapsed && data.status && (
                            <Badge className={cn('text-xs', statusColors[data.status])}>
                                {statusIcons[data.status]}
                            </Badge>
                        )}
                        {isCollapsed ? <CaretDown className="w-4 h-4" /> : <CaretUp className="w-4 h-4" />}
                    </div>
                </div>

                {!isCollapsed && (
                    <div className="p-4 pt-3">
                        <div className="flex items-start justify-between gap-2 mb-3">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{nodeDef?.label || data.type}</p>
                            {data.status && (
                                <Badge className={cn('text-xs flex-shrink-0', statusColors[data.status])}>
                                    <span className="flex items-center gap-1">
                                        {statusIcons[data.status]}
                                        {data.status}
                                    </span>
                                </Badge>
                            )}
                        </div>

                        {data.result && data.status === 'complete' && (
                            <div className="max-h-20 mb-2 overflow-y-auto">
                                <div className="text-xs font-mono text-zinc-500 p-2 bg-zinc-50 dark:bg-zinc-950 rounded border border-zinc-100 dark:border-zinc-800">
                                    {formatResult(data.result)}
                                </div>
                            </div>
                        )}

                        {data.error && (
                            <div className="text-xs text-red-600 mb-2 p-2 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-900/20">
                                <div className="flex items-start gap-1">
                                    <WarningCircle className="w-3 h-3 flex-shrink-0 mt-0.5" weight="fill" />
                                    <span>{data.error}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 transition-all duration-200 !bg-green-500 !border-green-600 hover:!bg-green-400"
            />
        </>
    )
})

UniversalNode.displayName = 'UniversalNode'
