/**
 * CHUCK Workflow Scoring Engine
 * Analyzes and scores complete workflows with cycle detection
 */

import { validateWorkflow } from './compatibilityMatrix';

export interface WorkflowNode {
  id: string;
  toolId: string;
  type: string;
  category: string;
  config?: Record<string, any>;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  weight?: number;
}

export interface Workflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowScore {
  quality: number; // 0-100%
  hasCycles: boolean;
  cycles?: string[][];
  compatibilityScore: number;
  executionOrder?: string[];
  issues: string[];
  recommendations: string[];
}

/**
 * Detect cycles in workflow using DFS
 */
export function detectCycles(workflow: Workflow): {
  hasCycles: boolean;
  cycles: string[][];
} {
  const { nodes, edges } = workflow;
  const adjacencyList = new Map<string, string[]>();
  
  // Build adjacency list
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    const neighbors = adjacencyList.get(edge.from) || [];
    neighbors.push(edge.to);
    adjacencyList.set(edge.from, neighbors);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[][] = [];
  const currentPath: string[] = [];

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    currentPath.push(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        // Cycle detected
        const cycleStartIndex = currentPath.indexOf(neighbor);
        const cycle = currentPath.slice(cycleStartIndex);
        cycles.push([...cycle, neighbor]);
      }
    }

    currentPath.pop();
    recursionStack.delete(nodeId);
    return false;
  }

  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  });

  return {
    hasCycles: cycles.length > 0,
    cycles
  };
}

/**
 * Topological sort for execution order
 */
export function getExecutionOrder(workflow: Workflow): string[] | null {
  const { nodes, edges } = workflow;
  const inDegree = new Map<string, number>();
  const adjacencyList = new Map<string, string[]>();
  
  // Initialize
  nodes.forEach(node => {
    inDegree.set(node.id, 0);
    adjacencyList.set(node.id, []);
  });

  // Build graph
  edges.forEach(edge => {
    adjacencyList.get(edge.from)?.push(edge.to);
    inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
  });

  // Find nodes with no incoming edges
  const queue: string[] = [];
  nodes.forEach(node => {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  });

  const order: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    const neighbors = adjacencyList.get(current) || [];
    neighbors.forEach(neighbor => {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    });
  }

  // If order doesn't include all nodes, there's a cycle
  return order.length === nodes.length ? order : null;
}

/**
 * Calculate workflow quality score
 */
export function scoreWorkflow(
  workflow: Workflow,
  toolsData: Array<{ id: string; type: string; category: string; score: number }>
): WorkflowScore {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for cycles
  const cycleDetection = detectCycles(workflow);
  if (cycleDetection.hasCycles) {
    issues.push(`Workflow contains ${cycleDetection.cycles.length} cycle(s)`);
  }

  // Get execution order
  const executionOrder = getExecutionOrder(workflow);
  if (!executionOrder) {
    issues.push('Cannot determine execution order (cycle detected)');
  }

  // Calculate compatibility score
  let compatibilityScore = 100;
  if (workflow.nodes.length > 1) {
    const toolSequence = workflow.nodes.map(node => {
      const tool = toolsData.find(t => t.id === node.toolId);
      return {
        id: node.toolId,
        type: tool?.type || 'unknown',
        category: tool?.category || 'unknown'
      };
    });

    const validation = validateWorkflow(toolSequence);
    compatibilityScore = validation.averageScore;

    if (!validation.valid) {
      issues.push('Workflow has weak compatibility links');
      validation.weakLinks.forEach(link => {
        recommendations.push(
          `Consider improving connection between ${link.from} → ${link.to} (score: ${link.score})`
        );
      });
    }
  }

  // Calculate average tool score
  const toolScores = workflow.nodes.map(node => {
    const tool = toolsData.find(t => t.id === node.toolId);
    return tool?.score || 70;
  });
  const avgToolScore = toolScores.length > 0
    ? Math.round(toolScores.reduce((a, b) => a + b, 0) / toolScores.length)
    : 70;

  // Calculate final quality score
  // 40% compatibility, 30% tool quality, 30% structure (no cycles = 100, with cycles = 0)
  const structureScore = cycleDetection.hasCycles ? 0 : 100;
  const quality = Math.round(
    compatibilityScore * 0.4 +
    avgToolScore * 0.3 +
    structureScore * 0.3
  );

  // Add recommendations based on score
  if (quality < 70) {
    recommendations.push('Consider using higher-rated tools');
    recommendations.push('Review tool sequence for better compatibility');
  }
  if (workflow.nodes.length > 10) {
    recommendations.push('Large workflow - consider breaking into sub-workflows');
  }

  return {
    quality,
    hasCycles: cycleDetection.hasCycles,
    cycles: cycleDetection.hasCycles ? cycleDetection.cycles : undefined,
    compatibilityScore,
    executionOrder: executionOrder || undefined,
    issues,
    recommendations
  };
}

/**
 * Optimize workflow by reordering nodes for better compatibility
 */
export function optimizeWorkflow(
  workflow: Workflow,
  toolsData: Array<{ id: string; type: string; category: string; score: number }>
): Workflow {
  // For now, return as-is
  // Future: implement greedy optimization algorithm
  return workflow;
}

export default {
  detectCycles,
  getExecutionOrder,
  scoreWorkflow,
  optimizeWorkflow
};
