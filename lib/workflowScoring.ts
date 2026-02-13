/**
 * Workflow Scoring Engine
 * 
 * Provides quality scoring (0-100%) for AI workflows with cycle detection
 */

import { calculateCompatibility, type ToolConnection } from './compatibilityMatrix';

export interface WorkflowNode {
  id: string;
  toolId: string;
  type: 'AI_AGENT' | 'PROCESSOR' | 'OUTPUT';
}

export interface WorkflowEdge {
  from: string; // node id
  to: string; // node id
}

export interface WorkflowScore {
  overall: number; // 0-100
  breakdown: {
    structure: number; // 0-100
    compatibility: number; // 0-100
    efficiency: number; // 0-100
  };
  issues: string[];
  warnings: string[];
  hasCycles: boolean;
  suggestions: string[];
}

/**
 * Detect cycles in the workflow using DFS
 */
export function detectCycles(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const graph = new Map<string, string[]>();
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  // Build adjacency list
  nodes.forEach((node) => graph.set(node.id, []));
  edges.forEach((edge) => {
    const neighbors = graph.get(edge.from) || [];
    neighbors.push(edge.to);
    graph.set(edge.from, neighbors);
  });

  // DFS to detect cycles
  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true; // Cycle detected
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  // Check all nodes
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}

/**
 * Topological sort to get execution order
 * Returns null if cycle detected
 */
export function topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] | null {
  if (detectCycles(nodes, edges)) {
    return null;
  }

  const graph = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // Initialize
  nodes.forEach((node) => {
    graph.set(node.id, []);
    inDegree.set(node.id, 0);
  });

  // Build graph
  edges.forEach((edge) => {
    const neighbors = graph.get(edge.from) || [];
    neighbors.push(edge.to);
    graph.set(edge.from, neighbors);
    inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
  });

  // Kahn's algorithm
  const queue: string[] = [];
  const result: string[] = [];

  // Find all nodes with no incoming edges
  nodes.forEach((node) => {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  });

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    result.push(nodeId);

    const neighbors = graph.get(nodeId) || [];
    neighbors.forEach((neighbor) => {
      const degree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, degree);
      if (degree === 0) {
        queue.push(neighbor);
      }
    });
  }

  return result.length === nodes.length ? result : null;
}

/**
 * Calculate structure score
 */
function calculateStructureScore(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): { score: number; issues: string[]; warnings: string[] } {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Check minimum nodes
  if (nodes.length === 0) {
    issues.push('Workflow has no nodes');
    return { score: 0, issues, warnings };
  }

  if (nodes.length === 1) {
    warnings.push('Workflow has only one node');
    score -= 10;
  }

  // Check for disconnected nodes
  const connectedNodes = new Set<string>();
  edges.forEach((edge) => {
    connectedNodes.add(edge.from);
    connectedNodes.add(edge.to);
  });

  const disconnectedNodes = nodes.filter((node) => !connectedNodes.has(node.id));
  if (disconnectedNodes.length > 0) {
    warnings.push(`${disconnectedNodes.length} disconnected node(s)`);
    score -= disconnectedNodes.length * 5;
  }

  // Check for OUTPUT nodes
  const hasOutput = nodes.some((node) => node.type === 'OUTPUT');
  if (!hasOutput) {
    warnings.push('No OUTPUT node - workflow has no final destination');
    score -= 15;
  }

  // Check for excessive complexity
  if (nodes.length > 50) {
    warnings.push('Very complex workflow (50+ nodes) may be hard to maintain');
    score -= 10;
  }

  // Check edges
  if (edges.length === 0 && nodes.length > 1) {
    issues.push('No connections between nodes');
    score -= 30;
  }

  return { score: Math.max(score, 0), issues, warnings };
}

/**
 * Calculate compatibility score
 */
function calculateCompatibilityScore(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  toolsMap: Map<string, any>
): { score: number; warnings: string[] } {
  const warnings: string[] = [];
  
  if (edges.length === 0) {
    return { score: 100, warnings };
  }

  let totalScore = 0;
  let connectionCount = 0;

  edges.forEach((edge) => {
    const fromNode = nodes.find((n) => n.id === edge.from);
    const toNode = nodes.find((n) => n.id === edge.to);

    if (!fromNode || !toNode) {
      warnings.push(`Invalid connection: ${edge.from} -> ${edge.to}`);
      return;
    }

    const fromTool = toolsMap.get(fromNode.toolId);
    const toTool = toolsMap.get(toNode.toolId);

    if (!fromTool || !toTool) {
      warnings.push(`Tool not found for connection`);
      return;
    }

    const compatibility = calculateCompatibility(fromTool, toTool);
    totalScore += compatibility.score;
    connectionCount++;

    if (compatibility.score < 40) {
      warnings.push(`Poor compatibility: ${fromTool.name} -> ${toTool.name} (${compatibility.score}%)`);
    }
  });

  const avgScore = connectionCount > 0 ? totalScore / connectionCount : 100;
  return { score: Math.round(avgScore), warnings };
}

/**
 * Calculate efficiency score
 */
function calculateEfficiencyScore(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): { score: number; warnings: string[]; suggestions: string[] } {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check for redundant paths
  const graph = new Map<string, Set<string>>();
  nodes.forEach((node) => graph.set(node.id, new Set()));
  edges.forEach((edge) => graph.get(edge.from)?.add(edge.to));

  // Check for nodes with excessive outgoing edges (potential bottleneck)
  nodes.forEach((node) => {
    const outgoing = graph.get(node.id)?.size || 0;
    if (outgoing > 5) {
      warnings.push(`Node ${node.id} has ${outgoing} outgoing connections - may be overloaded`);
      score -= 5;
    }
  });

  // Check for long sequential chains
  function getMaxDepth(nodeId: string, visited = new Set<string>()): number {
    if (visited.has(nodeId)) return 0;
    visited.add(nodeId);

    const neighbors = Array.from(graph.get(nodeId) || []);
    if (neighbors.length === 0) return 1;

    return 1 + Math.max(...neighbors.map((n) => getMaxDepth(n, new Set(visited))));
  }

  const startNodes = nodes.filter((node) => {
    return !edges.some((edge) => edge.to === node.id);
  });

  startNodes.forEach((node) => {
    const depth = getMaxDepth(node.id);
    if (depth > 10) {
      warnings.push(`Long sequential chain (${depth} steps) - consider parallelization`);
      suggestions.push('Consider splitting workflow into parallel branches');
      score -= 10;
    }
  });

  // Check for parallel opportunities
  const nodesByType = new Map<string, number>();
  nodes.forEach((node) => {
    nodesByType.set(node.type, (nodesByType.get(node.type) || 0) + 1);
  });

  if ((nodesByType.get('AI_AGENT') || 0) > 3 && edges.length < nodes.length) {
    suggestions.push('Multiple AI agents detected - consider parallel execution where possible');
  }

  return { score: Math.max(score, 0), warnings, suggestions };
}

/**
 * Calculate overall workflow score
 */
export function scoreWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  toolsMap: Map<string, any>
): WorkflowScore {
  const issues: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check for cycles
  const hasCycles = detectCycles(nodes, edges);
  if (hasCycles) {
    issues.push('Workflow contains cycles - execution will fail');
  }

  // Calculate individual scores
  const structure = calculateStructureScore(nodes, edges);
  const compatibility = calculateCompatibilityScore(nodes, edges, toolsMap);
  const efficiency = calculateEfficiencyScore(nodes, edges);

  // Combine results
  issues.push(...structure.issues);
  warnings.push(...structure.warnings, ...compatibility.warnings, ...efficiency.warnings);
  suggestions.push(...efficiency.suggestions);

  // Calculate overall score
  // If there are critical issues (cycles, no nodes, etc.), overall score is severely penalized
  let overall = 0;
  if (!hasCycles && structure.score > 0) {
    overall = Math.round(
      structure.score * 0.3 + compatibility.score * 0.4 + efficiency.score * 0.3
    );
  }

  return {
    overall,
    breakdown: {
      structure: structure.score,
      compatibility: compatibility.score,
      efficiency: efficiency.score,
    },
    issues,
    warnings,
    hasCycles,
    suggestions,
  };
}

/**
 * Validate workflow before execution
 */
export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (nodes.length === 0) {
    errors.push('Workflow must have at least one node');
  }

  if (detectCycles(nodes, edges)) {
    errors.push('Workflow contains cycles');
  }

  // Check for duplicate node IDs
  const nodeIds = new Set<string>();
  nodes.forEach((node) => {
    if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }
    nodeIds.add(node.id);
  });

  // Check for invalid edges
  const validNodeIds = new Set(nodes.map((n) => n.id));
  edges.forEach((edge) => {
    if (!validNodeIds.has(edge.from)) {
      errors.push(`Invalid edge: source node ${edge.from} does not exist`);
    }
    if (!validNodeIds.has(edge.to)) {
      errors.push(`Invalid edge: target node ${edge.to} does not exist`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
