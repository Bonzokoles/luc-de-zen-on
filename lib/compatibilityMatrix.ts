/**
 * CHUCK Compatibility Matrix
 * Scores tool-to-tool compatibility for workflow optimization
 */

export interface Tool {
  id: string;
  name: string;
  namePl: string;
  type: string;
  category?: string;  // Make optional for backward compatibility
  workflows: string[];
  scoreMatrix: {
    quality: number;
    speed: number;
    creativity: number;
    technical: number;
  };
}

export interface CompatibilityScore {
  source: string;
  target: string;
  score: number; // 0-100%
  reason?: string;
}

export interface CategoryCompatibility {
  [key: string]: {
    [key: string]: number; // category -> category score
  };
}

/**
 * Category-level compatibility scores
 * Higher scores = better workflow integration
 */
export const categoryCompatibility: CategoryCompatibility = {
  'seo-content': {
    'seo-content': 95,
    'code-dev': 70,
    'ecommerce-b2b': 90,
    'creative-productivity': 85,
    'new-2026': 80
  },
  'code-dev': {
    'seo-content': 65,
    'code-dev': 100,
    'ecommerce-b2b': 75,
    'creative-productivity': 80,
    'new-2026': 85
  },
  'ecommerce-b2b': {
    'seo-content': 88,
    'code-dev': 70,
    'ecommerce-b2b': 95,
    'creative-productivity': 85,
    'new-2026': 82
  },
  'creative-productivity': {
    'seo-content': 82,
    'code-dev': 75,
    'ecommerce-b2b': 80,
    'creative-productivity': 98,
    'new-2026': 90
  },
  'new-2026': {
    'seo-content': 78,
    'code-dev': 82,
    'ecommerce-b2b': 80,
    'creative-productivity': 92,
    'new-2026': 95
  }
};

/**
 * Type-level compatibility scores
 * Specific tool type interactions
 */
export const typeCompatibility: { [key: string]: { [key: string]: number } } = {
  'research': {
    'research': 100,
    'writing': 95,
    'seo': 98,
    'content': 92,
    'coding': 85,
    'productivity': 88,
    'meetings': 75,
    'email': 70
  },
  'writing': {
    'research': 90,
    'writing': 100,
    'seo': 95,
    'content': 98,
    'productivity': 85,
    'copywriting': 95
  },
  'seo': {
    'research': 95,
    'writing': 92,
    'seo': 100,
    'content': 95,
    'analytics': 90,
    'ecom': 85
  },
  'coding': {
    'coding': 100,
    'ui': 95,
    'webdev': 92,
    'ide': 98,
    'docs': 88,
    'devtools': 90
  },
  'productivity': {
    'productivity': 100,
    'notes': 95,
    'email': 90,
    'meetings': 92,
    'research': 85
  },
  'video': {
    'video': 100,
    'image': 88,
    '3d': 85,
    'audio': 90,
    'creative': 92
  },
  'ecom': {
    'ecom': 100,
    'analytics': 95,
    'support': 88,
    'crm': 90,
    'sales': 92,
    'marketing': 85
  }
};

/**
 * Calculate compatibility score between two tools
 */
export function calculateCompatibility(
  sourceTool: { id: string; type: string; category: string },
  targetTool: { id: string; type: string; category: string }
): number {
  // Same tool = perfect compatibility
  if (sourceTool.id === targetTool.id) {
    return 100;
  }

  // Get category compatibility (60% weight)
  const categoryScore = categoryCompatibility[sourceTool.category]?.[targetTool.category] || 50;
  
  // Get type compatibility (40% weight)
  const typeScore = typeCompatibility[sourceTool.type]?.[targetTool.type] || 60;
  
  // Weighted average
  const finalScore = Math.round(categoryScore * 0.6 + typeScore * 0.4);
  
  return Math.min(100, Math.max(0, finalScore));
}

/**
 * Get all compatibility scores for a specific tool
 */
export function getToolCompatibilities(
  tool: { id: string; type: string; category: string },
  allTools: Array<{ id: string; type: string; category: string }>
): CompatibilityScore[] {
  return allTools
    .filter(t => t.id !== tool.id)
    .map(targetTool => ({
      source: tool.id,
      target: targetTool.id,
      score: calculateCompatibility(tool, targetTool)
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Find best next tools for a given tool (top 10)
 */
export function findBestNextTools(
  currentTool: { id: string; type: string; category: string },
  allTools: Array<{ id: string; type: string; category: string; pl: string }>,
  limit: number = 10
): Array<{ tool: any; score: number }> {
  const compatibilities = getToolCompatibilities(currentTool, allTools);
  
  return compatibilities
    .slice(0, limit)
    .map(comp => ({
      tool: allTools.find(t => t.id === comp.target)!,
      score: comp.score
    }));
}

/**
 * Validate workflow compatibility (sequence of tools)
 */
export function validateWorkflow(
  workflow: Array<{ id: string; type: string; category: string }>,
  threshold: number = 70
): {
  valid: boolean;
  averageScore: number;
  weakLinks: Array<{ from: string; to: string; score: number }>;
} {
  if (workflow.length < 2) {
    return { valid: true, averageScore: 100, weakLinks: [] };
  }

  const scores: number[] = [];
  const weakLinks: Array<{ from: string; to: string; score: number }> = [];

  for (let i = 0; i < workflow.length - 1; i++) {
    const score = calculateCompatibility(workflow[i], workflow[i + 1]);
    scores.push(score);
    
    if (score < threshold) {
      weakLinks.push({
        from: workflow[i].id,
        to: workflow[i + 1].id,
        score
      });
    }
  }

  const averageScore = Math.round(
    scores.reduce((sum, s) => sum + s, 0) / scores.length
  );

  return {
    valid: weakLinks.length === 0,
    averageScore,
    weakLinks
  };
}

export default {
  categoryCompatibility,
  typeCompatibility,
  calculateCompatibility,
  getToolCompatibilities,
  findBestNextTools,
  validateWorkflow
};

// Aliases for backward compatibility
export const calculateConnectionScore = calculateCompatibility;

export function getCompatibleTools(
  tool: Tool,
  allTools: Tool[],
  minScore: number = 70
): Array<{ tool: Tool; score: number }> {
  const toolWithCategory = {
    id: tool.id,
    type: tool.type,
    category: tool.category || tool.type  // Use type as fallback for category
  };
  
  return getToolCompatibilities(toolWithCategory, allTools.map(t => ({
    id: t.id,
    type: t.type,
    category: t.category || t.type
  })))
    .filter(comp => comp.score >= minScore)
    .map(comp => ({
      tool: allTools.find(t => t.id === comp.target)!,
      score: comp.score
    }));
}

export function findBestToolsForWorkflow(
  workflowType: string,
  allTools: Tool[],
  limit: number = 10
): Tool[] {
  return allTools
    .filter(tool => tool.workflows.includes(workflowType))
    .sort((a, b) => b.scoreMatrix.quality - a.scoreMatrix.quality)
    .slice(0, limit);
}
