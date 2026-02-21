import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import type { WorkflowNode } from '../workflowStore'
import { UniversalNode } from './UniversalNode'

export const AIAgentNode = memo((props: NodeProps<WorkflowNode>) => {
    return <UniversalNode {...props} />
})

AIAgentNode.displayName = 'AIAgentNode'
