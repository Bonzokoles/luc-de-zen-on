// Konfiguracja rekomendowanych Google Agents dla POLACZEK Agent System 23

export interface RecommendedAgent {
  name: string;
  id: string;
  model: string;
  description: string;
  capabilities: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  integration: string;
  icon?: string;
  color?: string;
}

export const RECOMMENDED_GOOGLE_AGENTS = {
  // 1. CORE AI AGENTS - Główne agenty AI
  core: [
    {
      name: "Gemini Pro Agent",
      id: "gemini_pro_agent",
      model: "@google/gemini-pro",
      description: "Zaawansowany agent konwersacyjny z możliwościami multimodalnymi",
      capabilities: ["text-generation", "code-analysis", "reasoning", "multimodal"],
      priority: "HIGH" as const,
      integration: "direct-api",
      icon: "🤖",
      color: "#4285F4"
    },
    {
      name: "Gemini Vision Agent", 
      id: "gemini_vision_agent",
      model: "@google/gemini-pro-vision",
      description: "Agent do analizy obrazów i wizualnego rozumowania",
      capabilities: ["image-analysis", "visual-qa", "ocr", "scene-understanding"],
      priority: "HIGH" as const,
      integration: "direct-api",
      icon: "👁️",
      color: "#34A853"
    },
    {
      name: "PaLM 2 Chat Agent",
      id: "palm2_chat_agent", 
      model: "@google/chat-bison",
      description: "Specjalistyczny agent do konwersacji i dialogu",
      capabilities: ["conversation", "context-awareness", "personality"],
      priority: "MEDIUM" as const,
      integration: "vertex-ai",
      icon: "💬",
      color: "#FBBC04"
    }
  ],

  // 2. SPECIALIZED AGENTS - Agenty specjalistyczne
  specialized: [
    {
      name: "Code Bison Agent",
      id: "code_bison_agent",
      model: "@google/code-bison",
      description: "Agent specjalizujący się w generowaniu i analizie kodu",
      capabilities: ["code-generation", "code-review", "debugging", "refactoring"],
      priority: "HIGH" as const,
      integration: "vertex-ai",
      icon: "💻",
      color: "#EA4335"
    },
    {
      name: "Text Bison Agent",
      id: "text_bison_agent", 
      model: "@google/text-bison",
      description: "Agent do zaawansowanego przetwarzania tekstu",
      capabilities: ["text-generation", "summarization", "translation", "editing"],
      priority: "MEDIUM" as const,
      integration: "vertex-ai",
      icon: "📝",
      color: "#9AA0A6"
    },
    {
      name: "Embedding Agent",
      id: "embedding_agent",
      model: "@google/textembedding-gecko",
      description: "Agent do tworzenia embeddingów tekstowych",
      capabilities: ["embeddings", "similarity", "clustering", "search"],
      priority: "MEDIUM" as const, 
      integration: "vertex-ai",
      icon: "🔗",
      color: "#0F9D58"
    }
  ],

  // 3. WORKFLOW AGENTS - Agenty przepływu pracy
  workflow: [
    {
      name: "Dialogflow CX Agent",
      id: "dialogflow_cx_agent",
      model: "@google/dialogflow-cx",
      description: "Zaawansowany agent konwersacyjny z zarządzaniem przepływem",
      capabilities: ["conversation-flow", "intent-recognition", "entity-extraction", "webhook-integration"],
      priority: "HIGH" as const,
      integration: "dialogflow-cx",
      icon: "🌊",
      color: "#4285F4"
    },
    {
      name: "Contact Center AI Agent",
      id: "ccai_agent",
      model: "@google/ccai",
      description: "Agent do obsługi klienta i centrum kontaktowego",
      capabilities: ["customer-service", "call-routing", "sentiment-analysis", "escalation"],
      priority: "MEDIUM" as const,
      integration: "ccai-api",
      icon: "📞",
      color: "#34A853"
    },
    {
      name: "Document AI Agent",
      id: "document_ai_agent",
      model: "@google/documentai",
      description: "Agent do przetwarzania i analizy dokumentów",
      capabilities: ["document-parsing", "form-processing", "data-extraction", "ocr"],
      priority: "MEDIUM" as const,
      integration: "document-ai",
      icon: "📄",
      color: "#FBBC04"
    }
  ],

  // 4. PRODUCTIVITY AGENTS - Agenty produktywności
  productivity: [
    {
      name: "Google Workspace Agent",
      id: "workspace_agent",
      model: "@google/workspace-ai",
      description: "Agent do integracji z Google Workspace",
      capabilities: ["gmail-automation", "docs-generation", "sheets-analysis", "calendar-management"],
      priority: "HIGH" as const,
      integration: "workspace-api",
      icon: "🏢",
      color: "#4285F4"
    },
    {
      name: "Google Search Agent",
      id: "search_agent",
      model: "@google/search-ai",
      description: "Agent do zaawansowanego wyszukiwania i research",
      capabilities: ["web-search", "fact-checking", "research", "information-synthesis"],
      priority: "HIGH" as const,
      integration: "search-api",
      icon: "🔍",
      color: "#34A853"
    },
    {
      name: "Google Translate Agent",
      id: "translate_agent",
      model: "@google/translate",
      description: "Agent do tłumaczeń i lokalizacji",
      capabilities: ["translation", "language-detection", "localization", "cultural-adaptation"],
      priority: "MEDIUM" as const,
      integration: "translate-api",
      icon: "🌐",
      color: "#FBBC04"
    }
  ],

  // 5. CREATIVE AGENTS - Agenty kreatywne
  creative: [
    {
      name: "Imagen Agent",
      id: "imagen_agent",
      model: "@google/imagen",
      description: "Agent do generowania obrazów z tekstu",
      capabilities: ["text-to-image", "image-editing", "style-transfer", "creative-generation"],
      priority: "HIGH" as const,
      integration: "vertex-ai",
      icon: "🎨",
      color: "#EA4335"
    },
    {
      name: "MusicLM Agent",
      id: "musiclm_agent",
      model: "@google/musiclm",
      description: "Agent do generowania muzyki z opisów tekstowych",
      capabilities: ["text-to-music", "music-generation", "audio-synthesis", "style-control"],
      priority: "LOW" as const,
      integration: "vertex-ai",
      icon: "🎵",
      color: "#9AA0A6"
    },
    {
      name: "Phenaki Agent",
      id: "phenaki_agent",
      model: "@google/phenaki",
      description: "Agent do generowania wideo z tekstu",
      capabilities: ["text-to-video", "video-generation", "temporal-consistency", "narrative-creation"],
      priority: "LOW" as const,
      integration: "vertex-ai",
      icon: "🎬",
      color: "#0F9D58"
    }
  ]
};

// Helper functions
export function getAllAgents(): RecommendedAgent[] {
  return [
    ...RECOMMENDED_GOOGLE_AGENTS.core,
    ...RECOMMENDED_GOOGLE_AGENTS.specialized,
    ...RECOMMENDED_GOOGLE_AGENTS.workflow,
    ...RECOMMENDED_GOOGLE_AGENTS.productivity,
    ...RECOMMENDED_GOOGLE_AGENTS.creative
  ];
}

export function getAgentsByPriority(priority: 'HIGH' | 'MEDIUM' | 'LOW'): RecommendedAgent[] {
  return getAllAgents().filter(agent => agent.priority === priority);
}

export function getAgentsByCategory(category: keyof typeof RECOMMENDED_GOOGLE_AGENTS): RecommendedAgent[] {
  return RECOMMENDED_GOOGLE_AGENTS[category] || [];
}

export function getAgentById(id: string): RecommendedAgent | undefined {
  return getAllAgents().find(agent => agent.id === id);
}

export function getAgentsByCapability(capability: string): RecommendedAgent[] {
  return getAllAgents().filter(agent => 
    agent.capabilities.includes(capability)
  );
}

// Domyślne kategorie dla UI
export const AGENT_CATEGORIES = [
  { key: 'core', name: 'Główne Agenty', icon: '🤖', color: '#4285F4' },
  { key: 'specialized', name: 'Specjalistyczne', icon: '⚡', color: '#EA4335' },
  { key: 'workflow', name: 'Przepływ Pracy', icon: '🌊', color: '#34A853' },
  { key: 'productivity', name: 'Produktywność', icon: '🏢', color: '#FBBC04' },
  { key: 'creative', name: 'Kreatywne', icon: '🎨', color: '#9AA0A6' }
] as const;