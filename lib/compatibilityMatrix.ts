/**
 * CHUCK Compatibility Matrix
 * Calculates connection scores between different AI tools based on their types and workflows
 */

export interface Tool {
  id: string;
  name: string;
  namePl: string;
  type: string;
  workflows: string[];
  scoreMatrix: {
    quality: number;
    speed: number;
    creativity: number;
    technical: number;
  };
}

/**
 * Connection compatibility table
 * Defines how well different tool types work together (0-100%)
 */
const CONNECTION_TABLE: Record<string, Record<string, number>> = {
  writer: {
    writer: 75,
    social: 95,
    design: 85,
    code: 60,
    video: 80,
    audio: 70,
    research: 90,
    analytics: 85,
    productivity: 88,
    automation: 82,
    crm: 75,
  },
  social: {
    writer: 95,
    social: 85,
    design: 90,
    code: 50,
    video: 92,
    audio: 75,
    research: 65,
    analytics: 88,
    productivity: 80,
    automation: 90,
    crm: 85,
  },
  design: {
    writer: 85,
    social: 90,
    design: 80,
    code: 70,
    video: 95,
    audio: 65,
    research: 60,
    analytics: 70,
    productivity: 75,
    automation: 72,
    crm: 65,
  },
  code: {
    writer: 60,
    social: 50,
    design: 70,
    code: 90,
    video: 55,
    audio: 55,
    research: 75,
    analytics: 85,
    productivity: 88,
    automation: 95,
    crm: 70,
  },
  video: {
    writer: 80,
    social: 92,
    design: 95,
    code: 55,
    video: 85,
    audio: 90,
    research: 60,
    analytics: 75,
    productivity: 70,
    automation: 75,
    crm: 65,
  },
  audio: {
    writer: 70,
    social: 75,
    design: 65,
    code: 55,
    video: 90,
    audio: 85,
    research: 65,
    analytics: 70,
    productivity: 75,
    automation: 72,
    crm: 70,
  },
  research: {
    writer: 90,
    social: 65,
    design: 60,
    code: 75,
    video: 60,
    audio: 65,
    research: 88,
    analytics: 92,
    productivity: 85,
    automation: 78,
    crm: 75,
  },
  analytics: {
    writer: 85,
    social: 88,
    design: 70,
    code: 85,
    video: 75,
    audio: 70,
    research: 92,
    analytics: 90,
    productivity: 88,
    automation: 85,
    crm: 95,
  },
  productivity: {
    writer: 88,
    social: 80,
    design: 75,
    code: 88,
    video: 70,
    audio: 75,
    research: 85,
    analytics: 88,
    productivity: 85,
    automation: 92,
    crm: 90,
  },
  automation: {
    writer: 82,
    social: 90,
    design: 72,
    code: 95,
    video: 75,
    audio: 72,
    research: 78,
    analytics: 85,
    productivity: 92,
    automation: 88,
    crm: 88,
  },
  crm: {
    writer: 75,
    social: 85,
    design: 65,
    code: 70,
    video: 65,
    audio: 70,
    research: 75,
    analytics: 95,
    productivity: 90,
    automation: 88,
    crm: 85,
  },
};

/**
 * Workflow compatibility bonuses
 * Additional score if tools share common workflows
 */
const WORKFLOW_BONUS = 15;
const MAX_WORKFLOW_BONUS = 30;

/**
 * Calculate connection score between two tools
 * @param toolA First tool
 * @param toolB Second tool
 * @returns Connection score (0-100%)
 */
export function calculateConnectionScore(toolA: Tool, toolB: Tool): number {
  // Base compatibility from connection table
  const typeA = toolA.type;
  const typeB = toolB.type;
  
  let baseScore = CONNECTION_TABLE[typeA]?.[typeB] ?? 50;
  
  // Calculate workflow overlap bonus
  const sharedWorkflows = toolA.workflows.filter(w => 
    toolB.workflows.includes(w)
  );
  const workflowBonus = Math.min(
    sharedWorkflows.length * WORKFLOW_BONUS,
    MAX_WORKFLOW_BONUS
  );
  
  // Calculate quality difference penalty (if tools have very different quality levels)
  const qualityDiff = Math.abs(
    toolA.scoreMatrix.quality - toolB.scoreMatrix.quality
  );
  const qualityPenalty = qualityDiff > 20 ? Math.floor(qualityDiff / 5) : 0;
  
  // Final score calculation
  let finalScore = baseScore + workflowBonus - qualityPenalty;
  
  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, finalScore));
}

/**
 * Get all tools compatible with a given tool
 * @param tool Source tool
 * @param allTools All available tools
 * @param minScore Minimum compatibility score (default: 70)
 * @returns Array of compatible tools with scores
 */
export function getCompatibleTools(
  tool: Tool,
  allTools: Tool[],
  minScore: number = 70
): Array<{ tool: Tool; score: number }> {
  return allTools
    .filter(t => t.id !== tool.id)
    .map(t => ({
      tool: t,
      score: calculateConnectionScore(tool, t),
    }))
    .filter(({ score }) => score >= minScore)
    .sort((a, b) => b.score - a.score);
}

/**
 * Calculate average compatibility for a tool across all tool types
 * @param tool The tool to analyze
 * @returns Average compatibility score
 */
export function calculateAverageCompatibility(tool: Tool): number {
  const typeScores = Object.values(CONNECTION_TABLE[tool.type] || {});
  if (typeScores.length === 0) return 50;
  
  const sum = typeScores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / typeScores.length);
}

/**
 * Find best tool combinations for a workflow
 * @param workflow Workflow type
 * @param allTools All available tools
 * @param count Number of tools to return
 * @returns Best tools for the workflow
 */
export function findBestToolsForWorkflow(
  workflow: string,
  allTools: Tool[],
  count: number = 5
): Tool[] {
  return allTools
    .filter(tool => tool.workflows.includes(workflow))
    .sort((a, b) => {
      // Sort by quality score
      return b.scoreMatrix.quality - a.scoreMatrix.quality;
    })
    .slice(0, count);
}
