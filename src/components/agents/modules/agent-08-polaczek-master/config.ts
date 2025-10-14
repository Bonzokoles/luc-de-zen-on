// Agent-08-Polaczek-Master Configuration

// Environment validation
function validateEnvironment() {
  const requiredKeys = ["DEEPSEEK_API_KEY"];
  const missing = requiredKeys.filter(
    (key) => !process.env[key] && !import.meta.env[key]
  );

  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missing.join(", ")}`);
    console.warn("Some features may not work properly.");
  }
  return missing.length === 0;
}

// Model configuration from environment with fallbacks
const getModelConfig = () => ({
  primary:
    import.meta.env.PUBLIC_PRIMARY_MODEL ||
    process.env.PRIMARY_MODEL ||
    "deepseek-r1",
  local:
    import.meta.env.PUBLIC_LOCAL_MODEL ||
    process.env.LOCAL_MODEL ||
    "qwen2.5:3b",
  backup:
    import.meta.env.PUBLIC_BACKUP_MODEL ||
    process.env.BACKUP_MODEL ||
    "gemma2:2b",
  translation:
    import.meta.env.PUBLIC_TRANSLATION_MODEL ||
    process.env.TRANSLATION_MODEL ||
    "deepseek-r1",
});

export const POLACZEK_CONFIG = {
  // Validate environment on startup
  isConfigValid: validateEnvironment(),

  // Model hierarchy for Polish AI tasks
  models: getModelConfig(),

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
