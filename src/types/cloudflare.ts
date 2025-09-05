// Modern Cloudflare Worker Environment Types
// Based on Cloudflare best practices documentation

export interface Env {
  // AI binding for Workers AI
  AI: any; // Cloudflare AI binding
  
  // R2 Storage for images  
  IMAGES: any; // R2Bucket binding
  
  // KV Namespaces
  SESSION: any; // KVNamespace binding
  KNOWLEDGE_BASE: any; // KVNamespace binding
  
  // Service bindings
  POLACZEK_WORKER?: any; // Service binding
  
  // Environment variables
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
  PUBLIC_SITE_URL?: string;
  PUBLIC_BIELIK_MODEL?: string;
  PUBLIC_DEFAULT_MODEL?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  model?: string;
  style?: string;
  width?: number;
  height?: number;
  steps?: number;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  imageId?: string;
  prompt: string;
  translatedPrompt?: string;
  model: string;
  metadata?: {
    width: number;
    height: number;
    steps: number;
    timestamp: string;
  };
  error?: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  model?: string;
  temperature?: number;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  sessionId: string;
  model: string;
  timestamp: string;
  error?: string;
}

// Function calling types for @cloudflare/ai-utils
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
  function: (args: any) => Promise<string>;
}

export interface FunctionCallingRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  tools: ToolDefinition[];
  model?: string;
}
