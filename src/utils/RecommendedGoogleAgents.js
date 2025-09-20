
export const AGENT_CATEGORIES = [
  {
    key: "core",
    name: "Core",
    icon: "🎯",
    color: "#4285f4"
  },
  {
    key: "specialized", 
    name: "Specialized",
    icon: "🔧",
    color: "#34a853"
  },
  {
    key: "experimental",
    name: "Experimental", 
    icon: "🧪",
    color: "#fbbc04"
  }
];

export const RECOMMENDED_GOOGLE_AGENTS = [
  {
    id: "gemini_pro_agent",
    name: "Gemini Pro",
    model: "gemini-pro",
    category: "core",
    icon: "🤖",
    color: "#4285f4",
    priority: "HIGH",
    description: "Advanced conversational AI with reasoning capabilities",
    capabilities: ["Chat", "Reasoning", "Analysis", "Code Review", "Writing"]
  },
  {
    id: "gemini_vision_agent", 
    name: "Gemini Vision",
    model: "gemini-pro-vision",
    category: "specialized",
    icon: "👁️",
    color: "#34a853", 
    priority: "HIGH",
    description: "Multimodal AI for image and visual content analysis",
    capabilities: ["Image Analysis", "OCR", "Visual QA", "Chart Reading"]
  },
  {
    id: "code_bison_agent",
    name: "Code Bison", 
    model: "code-bison",
    category: "specialized",
    icon: "💻",
    color: "#ea4335",
    priority: "MEDIUM", 
    description: "Specialized code generation and programming assistant",
    capabilities: ["Code Generation", "Debugging", "Refactoring", "Documentation"]
  },
  {
    id: "text_bison_agent",
    name: "Text Bison",
    model: "text-bison", 
    category: "core",
    icon: "📝",
    color: "#fbbc04",
    priority: "MEDIUM",
    description: "Text generation and natural language processing",
    capabilities: ["Text Generation", "Summarization", "Translation", "Editing"]
  }
];

export function getAllAgents() {
  return RECOMMENDED_GOOGLE_AGENTS;
}

export function getAgentsByCategory(category) {
  return RECOMMENDED_GOOGLE_AGENTS.filter(agent => agent.category === category);
}

export function getAgentById(id) {
  return RECOMMENDED_GOOGLE_AGENTS.find(agent => agent.id === id);
}
