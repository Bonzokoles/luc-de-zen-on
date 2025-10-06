// Agent-08-Polaczek-Master Configuration
export const POLACZEK_CONFIG = {
  // Model hierarchy for Polish AI tasks
  models: {
    primary: "deepseek-r1", // Main reasoning model (MyBonzo existing)
    local: "qwen2.5:3b", // Local Ollama model for privacy
    backup: "gemma2:2b", // Cloudflare Workers fallback
    translation: "deepseek-r1", // Best for Polish language tasks
  },

  // Agent registry and roles
  agents: {
    POLACZEK_D: {
      name: "Dyrektor",
      role: "orchestrator",
      description: "Zarządza wszystkimi agentami polskojęzycznymi",
      model: "deepseek-r1",
      capabilities: ["orchestration", "planning", "coordination"],
    },
    POLACZEK_T: {
      name: "Tłumacz",
      role: "translator",
      description: "Specjalista od polskiego contentu i tłumaczeń",
      model: "deepseek-r1",
      capabilities: ["translation", "content-generation", "polish-language"],
    },
    POLACZEK_B: {
      name: "Bibliotekarz",
      role: "knowledge-manager",
      description: "Zarządza bazą wiedzy i dokumentacją",
      model: "qwen2.5:3b",
      capabilities: ["knowledge-management", "search", "documentation"],
    },
    POLACZEK_M1: {
      name: "Manager-1",
      role: "task-coordinator",
      description: "Koordynuje zadania między agentami",
      model: "gemma2:2b",
      capabilities: ["task-management", "workflow", "coordination"],
    },
    POLACZEK_D1: {
      name: "Dashboard",
      role: "ui-manager",
      description: "Zarządza interfejsem użytkownika",
      model: "qwen2.5:3b",
      capabilities: ["ui-management", "dashboard", "visualization"],
    },
  },

  // API endpoints configuration
  endpoints: {
    orchestrate: "/api/polaczek/orchestrate",
    agents: "/api/polaczek/agents",
    status: "/api/polaczek/status",
    translate: "/api/polaczek/translate",
    manage: "/api/polaczek/manage",
  },

  // Performance settings
  performance: {
    maxConcurrentAgents: 3,
    timeoutMs: 30000,
    retryAttempts: 2,
    cacheTTL: 300000, // 5 minutes
  },

  // Polish language specific settings
  language: {
    primary: "pl",
    encoding: "utf-8",
    dateFormat: "DD.MM.YYYY",
    numberFormat: "pl-PL",
    currency: "PLN",
  },
} as const;

// Environment variable names
export const ENV_VARS = {
  QWEN_API_KEY: "QWEN_API_KEY",
  OLLAMA_ENDPOINT: "OLLAMA_ENDPOINT",
  POLACZEK_ENABLED: "POLACZEK_ENABLED",
  DEEPSEEK_API_KEY: "DEEPSEEK_API_KEY", // Already exists in MyBonzo
} as const;

// Agent types for TypeScript
export type AgentType = keyof typeof POLACZEK_CONFIG.agents;
export type ModelType = keyof typeof POLACZEK_CONFIG.models;
export type AgentCapability = string;

export interface Agent {
  id: AgentType;
  name: string;
  role: string;
  description: string;
  model: string;
  capabilities: AgentCapability[];
  status: "active" | "inactive" | "busy" | "error";
  lastUsed?: Date;
  performance?: {
    successRate: number;
    avgResponseTime: number;
    totalTasks: number;
  };
}

export interface OrchestrationRequest {
  task: string;
  context?: Record<string, any>;
  preferredAgent?: AgentType;
  priority: "low" | "normal" | "high" | "urgent";
  language: "pl" | "en";
}

export interface OrchestrationResult {
  success: boolean;
  result?: any;
  agent: AgentType;
  executionTime: number;
  error?: string;
  metadata?: Record<string, any>;
}
