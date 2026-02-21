import { memo } from 'react'
import type { NodeProps } from '@xyflow/react'
import type { WorkflowNode } from '../workflowStore'
import { UniversalNode } from './UniversalNode'

export const OutputNode = memo((props: NodeProps<WorkflowNode>) => {
    return <UniversalNode {...props} />
})

OutputNode.displayName = 'OutputNode'
