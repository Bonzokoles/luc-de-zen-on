/**
 * CHUCK Workflow Scoring Engine
 * Evaluates workflow quality and detects cycles in node graphs
 */

export interface WorkflowNode {
  id: string;
  toolId: string;
  type: string;
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
  metadata?: {
    name?: string;
    description?: string;
    created?: string;
  };
}

export interface QualityScore {
  overall: number;
  breakdown: {
    structure: number;
    efficiency: number;
    reliability: number;
    complexity: number;
  };
  issues: string[];
  suggestions: string[];
}

/**
 * Detect cycles in a directed graph using DFS
 * @param nodes Array of workflow nodes
 * @param edges Array of workflow edges
 * @returns Array of cycles found (each cycle is an array of node IDs)
 */
export function detectCycles(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const path: string[] = [];

  // Build adjacency list
  const adjacencyList = new Map<string, string[]>();
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    const neighbors = adjacencyList.get(edge.from) || [];
    neighbors.push(edge.to);
    adjacencyList.set(edge.from, neighbors);
  });

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        // Found a cycle
        const cycleStartIndex = path.indexOf(neighbor);
        const cycle = path.slice(cycleStartIndex);
        cycles.push([...cycle, neighbor]); // Complete the cycle
      }
    }

    recursionStack.delete(nodeId);
    path.pop();
    return false;
  }

  // Check each node for cycles
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  }

  return cycles;
}

/**
 * Calculate workflow structure score (0-100)
 * Evaluates graph structure, connections, and organization
 */
function calculateStructureScore(workflow: Workflow): number {
  const { nodes, edges } = workflow;
  let score = 100;
  const issues: string[] = [];

  // Check if workflow has nodes
  if (nodes.length === 0) {
    return 0;
  }

  // Detect cycles (major issue)
  const cycles = detectCycles(nodes, edges);
  if (cycles.length > 0) {
    score -= cycles.length * 20;
    issues.push(`Found ${cycles.length} cycle(s) in workflow`);
  }

  // Check for orphaned nodes (no incoming or outgoing edges)
  const connectedNodes = new Set<string>();
  edges.forEach(edge => {
    connectedNodes.add(edge.from);
    connectedNodes.add(edge.to);
  });
  const orphanedCount = nodes.filter(n => !connectedNodes.has(n.id)).length;
  if (orphanedCount > 0) {
    score -= orphanedCount * 5;
    issues.push(`${orphanedCount} orphaned node(s)`);
  }

  // Check for multiple entry points (might be intentional but worth noting)
  const hasIncoming = new Set(edges.map(e => e.to));
  const entryPoints = nodes.filter(n => !hasIncoming.has(n.id));
  if (entryPoints.length > 3) {
    score -= 5;
  }

  // Check for multiple exit points
  const hasOutgoing = new Set(edges.map(e => e.from));
  const exitPoints = nodes.filter(n => !hasOutgoing.has(n.id));
  if (exitPoints.length > 3) {
    score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate workflow efficiency score (0-100)
 * Evaluates redundancy, path length, and optimization
 */
function calculateEfficiencyScore(workflow: Workflow): number {
  const { nodes, edges } = workflow;
  let score = 100;

  // Penalize overly complex workflows
  if (nodes.length > 20) {
    score -= Math.floor((nodes.length - 20) / 2);
  }

  // Check edge to node ratio (too many edges might indicate redundancy)
  const edgeRatio = edges.length / nodes.length;
  if (edgeRatio > 2) {
    score -= 10;
  }

  // Check for very long paths (calculate max path length)
  const maxPathLength = calculateMaxPathLength(nodes, edges);
  if (maxPathLength > 10) {
    score -= (maxPathLength - 10) * 3;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate maximum path length in the workflow
 */
function calculateMaxPathLength(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): number {
  // Build adjacency list
  const adjacencyList = new Map<string, string[]>();
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    const neighbors = adjacencyList.get(edge.from) || [];
    neighbors.push(edge.to);
    adjacencyList.set(edge.from, neighbors);
  });

  let maxLength = 0;

  function dfs(nodeId: string, visited: Set<string>, depth: number): void {
    maxLength = Math.max(maxLength, depth);
    visited.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, visited, depth + 1);
      }
    }

    visited.delete(nodeId);
  }

  // Start DFS from all entry points
  const hasIncoming = new Set(edges.map(e => e.to));
  const entryPoints = nodes.filter(n => !hasIncoming.has(n.id));

  for (const entry of entryPoints) {
    dfs(entry.id, new Set(), 0);
  }

  return maxLength;
}

/**
 * Calculate workflow reliability score (0-100)
 * Evaluates error handling, fallbacks, and robustness
 */
function calculateReliabilityScore(workflow: Workflow): number {
  const { nodes } = workflow;
  let score = 80; // Base score

  // Check if workflow has error handling nodes
  const hasErrorHandling = nodes.some(n => 
    n.type === 'error-handler' || n.config?.errorHandling
  );
  if (hasErrorHandling) {
    score += 10;
  }

  // Check if workflow has retry logic
  const hasRetry = nodes.some(n => n.config?.retry);
  if (hasRetry) {
    score += 10;
  }

  return Math.min(100, score);
}

/**
 * Calculate workflow complexity score (0-100)
 * Lower complexity is better (inverse score)
 */
function calculateComplexityScore(workflow: Workflow): number {
  const { nodes, edges } = workflow;
  
  // Calculate cyclomatic complexity
  const complexity = edges.length - nodes.length + 2;
  
  // Convert to 0-100 score (lower complexity = higher score)
  // Complexity 1-5: excellent (90-100)
  // Complexity 6-10: good (70-89)
  // Complexity 11-20: moderate (50-69)
  // Complexity 21+: complex (0-49)
  
  if (complexity <= 5) {
    return 100 - (complexity - 1) * 2;
  } else if (complexity <= 10) {
    return 90 - (complexity - 5) * 4;
  } else if (complexity <= 20) {
    return 70 - (complexity - 10) * 2;
  } else {
    return Math.max(0, 50 - (complexity - 20));
  }
}

/**
 * Calculate overall workflow quality score
 * @param workflow The workflow to evaluate
 * @returns Quality score with breakdown and recommendations
 */
export function calculateQuality(workflow: Workflow): QualityScore {
  const structure = calculateStructureScore(workflow);
  const efficiency = calculateEfficiencyScore(workflow);
  const reliability = calculateReliabilityScore(workflow);
  const complexity = calculateComplexityScore(workflow);

  // Weighted average
  const overall = Math.round(
    structure * 0.35 +
    efficiency * 0.25 +
    reliability * 0.20 +
    complexity * 0.20
  );

  const issues: string[] = [];
  const suggestions: string[] = [];

  // Analyze results and provide feedback
  const cycles = detectCycles(workflow.nodes, workflow.edges);
  if (cycles.length > 0) {
    issues.push(`Workflow contains ${cycles.length} cycle(s) - this may cause infinite loops`);
    suggestions.push('Remove cycles or add cycle breaking conditions');
  }

  if (structure < 70) {
    issues.push('Workflow structure needs improvement');
    suggestions.push('Review node connections and remove orphaned nodes');
  }

  if (efficiency < 70) {
    issues.push('Workflow could be more efficient');
    suggestions.push('Consider simplifying the workflow or combining similar steps');
  }

  if (reliability < 70) {
    suggestions.push('Add error handling and retry logic for better reliability');
  }

  if (complexity < 70) {
    issues.push('Workflow is complex and may be hard to maintain');
    suggestions.push('Break down into smaller sub-workflows');
  }

  if (workflow.nodes.length === 0) {
    issues.push('Workflow has no nodes');
  }

  if (workflow.edges.length === 0 && workflow.nodes.length > 1) {
    issues.push('Nodes are not connected');
  }

  return {
    overall,
    breakdown: {
      structure,
      efficiency,
      reliability,
      complexity,
    },
    issues,
    suggestions,
  };
}

/**
 * Validate workflow and return validation errors
 * @param workflow The workflow to validate
 * @returns Array of validation errors
 */
export function validateWorkflow(workflow: Workflow): string[] {
  const errors: string[] = [];

  if (!workflow.nodes || workflow.nodes.length === 0) {
    errors.push('Workflow must have at least one node');
  }

  if (!workflow.edges || !Array.isArray(workflow.edges)) {
    errors.push('Workflow must have an edges array');
  }

  // Check for invalid edge references
  const nodeIds = new Set(workflow.nodes.map(n => n.id));
  workflow.edges.forEach((edge, index) => {
    if (!nodeIds.has(edge.from)) {
      errors.push(`Edge ${index}: 'from' node '${edge.from}' does not exist`);
    }
    if (!nodeIds.has(edge.to)) {
      errors.push(`Edge ${index}: 'to' node '${edge.to}' does not exist`);
    }
  });

  // Check for duplicate node IDs
  const seenIds = new Set<string>();
  workflow.nodes.forEach(node => {
    if (seenIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }
    seenIds.add(node.id);
  });

  return errors;
}
