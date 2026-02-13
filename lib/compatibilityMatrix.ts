/**
 * Compatibility Matrix for AI Tools
 * 
 * This module provides compatibility scoring between different AI tools
 * to help determine which tools work well together in a workflow.
 */

export interface CompatibilityScore {
  score: number; // 0-100
  reason: string;
}

export interface ToolConnection {
  fromToolId: string;
  toToolId: string;
  score: number;
  category: 'excellent' | 'good' | 'fair' | 'poor';
}

/**
 * Category compatibility rules
 * Higher scores indicate better compatibility
 */
const CATEGORY_COMPATIBILITY: Record<string, Record<string, number>> = {
  'text-generation': {
    'text-generation': 30, // Can chain LLMs
    'embeddings': 90,
    'vector-database': 95,
    'code-generation': 85,
    'productivity': 80,
    'automation': 75,
    'orchestration': 95,
    'image-generation': 70,
    'audio-generation': 65,
    'document-analysis': 90,
  },
  'image-generation': {
    'text-generation': 85,
    'image-generation': 50,
    'creative-tools': 90,
    'design': 95,
    'web-design': 85,
    'video-generation': 80,
    'automation': 70,
  },
  'audio-generation': {
    'text-generation': 80,
    'audio-processing': 95,
    'video-generation': 90,
    'meeting-assistant': 85,
    'content-generation': 75,
  },
  'video-generation': {
    'text-generation': 75,
    'image-generation': 85,
    'audio-generation': 90,
    'creative-tools': 95,
    'audio-video-editing': 100,
  },
  'code-generation': {
    'text-generation': 90,
    'code-generation': 40,
    'ci-cd': 85,
    'development': 95,
    'mlops': 80,
    'testing': 90,
  },
  'embeddings': {
    'vector-database': 100,
    'text-generation': 85,
    'search': 95,
    'document-analysis': 90,
  },
  'vector-database': {
    'embeddings': 100,
    'text-generation': 90,
    'search': 95,
    'orchestration': 85,
  },
  'automation': {
    'text-generation': 80,
    'productivity': 90,
    'integration': 95,
    'workflow': 100,
  },
  'orchestration': {
    'text-generation': 95,
    'embeddings': 90,
    'vector-database': 90,
    'automation': 95,
    'workflow': 100,
  },
  'web-scraping': {
    'text-generation': 85,
    'document-analysis': 90,
    'automation': 95,
    'data-transformation': 90,
  },
  'document-analysis': {
    'text-generation': 95,
    'embeddings': 90,
    'ocr': 100,
    'data-extraction': 95,
  },
  'mlops': {
    'model-hosting': 100,
    'ml-platform': 95,
    'monitoring': 90,
    'deployment': 95,
  },
  'ci-cd': {
    'code-generation': 85,
    'testing': 95,
    'deployment': 100,
    'infrastructure': 90,
  },
  'analytics': {
    'bi': 95,
    'data-warehouse': 90,
    'visualization': 95,
    'monitoring': 85,
  },
  'backend': {
    'database': 95,
    'auth': 100,
    'serverless': 90,
    'hosting': 85,
  },
  'hosting': {
    'backend': 85,
    'frontend': 90,
    'deployment': 95,
    'serverless': 90,
  },
  'serverless': {
    'hosting': 90,
    'backend': 85,
    'edge': 95,
    'api': 90,
  },
};

/**
 * Provider compatibility bonuses
 * Some providers integrate better with each other
 */
const PROVIDER_COMPATIBILITY: Record<string, string[]> = {
  'OpenAI': ['Pinecone', 'LangChain', 'Vercel', 'Supabase'],
  'Anthropic': ['LangChain', 'Pinecone', 'Vercel'],
  'Google': ['Google', 'Firebase', 'BigQuery', 'Vertex AI'],
  'AWS': ['AWS', 'Databricks', 'Snowflake'],
  'Microsoft': ['Azure', 'Microsoft', 'GitHub'],
  'HuggingFace': ['HuggingFace', 'Gradio', 'Streamlit'],
  'Cloudflare': ['Cloudflare', 'Vercel', 'Supabase'],
};

/**
 * Calculate compatibility score between two tools
 */
export function calculateCompatibility(
  fromTool: { id: string; category: string; provider: string; capabilities: string[] },
  toTool: { id: string; category: string; provider: string; capabilities: string[] }
): CompatibilityScore {
  let score = 50; // Base score
  let reasons: string[] = [];

  // Category compatibility
  const categoryScore = CATEGORY_COMPATIBILITY[fromTool.category]?.[toTool.category];
  if (categoryScore !== undefined) {
    score = categoryScore;
    if (categoryScore >= 80) {
      reasons.push('Excellent category match');
    } else if (categoryScore >= 60) {
      reasons.push('Good category match');
    } else if (categoryScore >= 40) {
      reasons.push('Fair category match');
    } else {
      reasons.push('Limited category compatibility');
    }
  }

  // Provider bonus (if same ecosystem)
  if (fromTool.provider === toTool.provider) {
    score += 15;
    reasons.push('Same provider ecosystem');
  } else if (
    PROVIDER_COMPATIBILITY[fromTool.provider]?.includes(toTool.provider) ||
    PROVIDER_COMPATIBILITY[toTool.provider]?.includes(fromTool.provider)
  ) {
    score += 10;
    reasons.push('Compatible provider ecosystem');
  }

  // Capability overlap bonus
  const sharedCapabilities = fromTool.capabilities.filter((cap) =>
    toTool.capabilities.includes(cap)
  );
  if (sharedCapabilities.length > 0) {
    score += Math.min(sharedCapabilities.length * 5, 20);
    reasons.push(`Shared capabilities: ${sharedCapabilities.join(', ')}`);
  }

  // Prevent self-loops penalty (usually not useful)
  if (fromTool.id === toTool.id) {
    score = Math.min(score, 30);
    reasons.push('Self-connection discouraged');
  }

  // Cap score at 100
  score = Math.min(Math.max(score, 0), 100);

  return {
    score,
    reason: reasons.join('; '),
  };
}

/**
 * Get compatibility category from score
 */
export function getCompatibilityCategory(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

/**
 * Calculate all connections for a workflow
 */
export function calculateWorkflowConnections(
  tools: Array<{ id: string; category: string; provider: string; capabilities: string[] }>,
  connections: Array<{ from: number; to: number }>
): ToolConnection[] {
  return connections.map(({ from, to }) => {
    const fromTool = tools[from];
    const toTool = tools[to];
    const compatibility = calculateCompatibility(fromTool, toTool);

    return {
      fromToolId: fromTool.id,
      toToolId: toTool.id,
      score: compatibility.score,
      category: getCompatibilityCategory(compatibility.score),
    };
  });
}

/**
 * Detect compatibility issues in a workflow
 */
export function detectCompatibilityIssues(
  connections: ToolConnection[]
): Array<{ connection: ToolConnection; issue: string }> {
  return connections
    .filter((conn) => conn.score < 60)
    .map((conn) => ({
      connection: conn,
      issue:
        conn.score < 40
          ? `Poor compatibility between ${conn.fromToolId} and ${conn.toToolId}`
          : `Fair compatibility between ${conn.fromToolId} and ${conn.toToolId}`,
    }));
}
