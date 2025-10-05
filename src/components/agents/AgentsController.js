// AgentsController.js - Centralny kontroler dla wszystkich agentów
// Zarządza funkcjami toggle i komunikacją między agentami

class AgentsController {
  constructor() {
    this.activeAgents = new Set();
    this.agentStates = new Map();
    this.agentRegistry = new Map();
    this.init();
  }

  init() {
    console.log("🚀 Initializing Agents Controller...");
    this.registerAllAgents();
    this.bindGlobalEvents();
    this.loadAgentScripts();
  }

  registerAllAgents() {
    // Rejestracja wszystkich agentów
    const agents = [
      { id: 'voice', name: 'Voice Agent', emoji: '🎙️', color: '#ff6b9d' },
      { id: 'music', name: 'Music Agent', emoji: '🎵', color: '#9333ea' },
      { id: 'system', name: 'System Agent', emoji: '⚙️', color: '#ef4444' },
      { id: 'crawler', name: 'Crawler Agent', emoji: '🕷️', color: '#22c55e' },
      { id: 'file', name: 'File Agent', emoji: '📁', color: '#3b82f6' },
      { id: 'database', name: 'Database Agent', emoji: '🗄️', color: '#a855f7' },
      { id: 'email', name: 'Email Agent', emoji: '📧', color: '#ec4899' },
      { id: 'security', name: 'Security Agent', emoji: '🔒', color: '#dc267f' },
      { id: 'webmaster', name: 'Webmaster Agent', emoji: '🌐', color: '#06b6d4' },
      { id: 'analytics', name: 'Analytics Agent', emoji: '📊', color: '#6366f1' },
      { id: 'content', name: 'Content Agent', emoji: '📝', color: '#22c55e' },
      { id: 'marketing', name: 'Marketing Agent', emoji: '📈', color: '#f59e0b' }
    ];

    agents.forEach(agent => {
      this.agentRegistry.set(agent.id, agent);
      this.agentStates.set(agent.id, { active: false, initialized: false });
    });

    console.log(`✅ Registered ${agents.length} agents`);
  }

  // Uniwersalna funkcja toggle dla wszystkich agentów
  toggleAgent(agentId, manualClick = true) {
    if (!manualClick) {
      console.log(`🚫 Auto-activation blocked for ${agentId} Agent`);
      return;
    }

    const agent = this.agentRegistry.get(agentId);
    if (!agent) {
      console.error(`❌ Agent ${agentId} not found in registry`);
      return;
    }

    console.log(`${agent.emoji} Toggling ${agent.name} (manual click)`);
    
    const btn = document.getElementById(`${agentId}AgentBtn`);
    const widget = document.getElementById(`${agentId}AgentWidget`);

    if (btn && widget) {
      // Button scaling effect
      btn.style.transform = "scale(1.1) translateY(-2px)";
      setTimeout(() => {
        btn.style.transform = "";
      }, 200);

      // Toggle widget visibility
      const isVisible = !widget.classList.contains('hidden');
      widget.classList.toggle("hidden");

      // Update agent state
      const state = this.agentStates.get(agentId);
      state.active = !isVisible;
      this.agentStates.set(agentId, state);

      // Update active agents set
      if (state.active) {
        this.activeAgents.add(agentId);
        this.initializeAgent(agentId);
      } else {
        this.activeAgents.delete(agentId);
      }

      this.updateAgentsStatus();
    }
  }

  // Inicjalizacja konkretnego agenta
  async initializeAgent(agentId) {
    const state = this.agentStates.get(agentId);
    if (state.initialized) return;

    console.log(`🔄 Initializing ${agentId} Agent...`);
    
    try {
      // Dynamiczne ładowanie modułu agenta - currently using modules structure
      // const agentModule = await import(`./agents/${agentId}-agent.js`);
      // TODO: Implement proper agent module loading when structure is ready
      
      // Placeholder for now
      const agentModule = { default: { init: null } };
      
      if (agentModule.default && typeof agentModule.default.init === 'function') {
        await agentModule.default.init();
        state.initialized = true;
        this.agentStates.set(agentId, state);
        console.log(`✅ ${agentId} Agent initialized successfully`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not load ${agentId} agent module:`, error);
      // Agent will work with basic functionality
      state.initialized = true;
      this.agentStates.set(agentId, state);
    }
  }

  // Ładowanie skryptów agentów
  async loadAgentScripts() {
    console.log("📦 Loading agent scripts...");
    
    // Load core agent functions - disabled for now
    try {
      // TODO: Implement agent functions when available
      // await import('./agents/voice-functions.js');
      // await import('./agents/music-functions.js');
      // await import('./agents/system-functions.js');
      console.log("✅ Core agent functions loaded (placeholder)");
    } catch (error) {
      console.warn("⚠️ Some agent functions could not be loaded:", error);
    }
  }

  // Aktualizacja statusu agentów
  updateAgentsStatus() {
    const activeCount = this.activeAgents.size;
    console.log(`📊 Active agents: ${activeCount}/${this.agentRegistry.size}`);
    
    // Można dodać dodatkową logikę zarządzania zasobami
    if (activeCount > 5) {
      console.warn("⚠️ Many agents active - consider performance impact");
    }
  }

  // Globalne bindowanie eventów
  bindGlobalEvents() {
    // ESC key closes all agents
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllAgents();
      }
    });

    // Prevent too many agents open simultaneously
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('right-btn') && this.activeAgents.size > 3) {
        console.warn("⚠️ Too many agents active - consider closing some");
      }
    });
  }

  // Zamknięcie wszystkich agentów
  closeAllAgents() {
    console.log("🔄 Closing all agents...");
    
    this.activeAgents.forEach(agentId => {
      const widget = document.getElementById(`${agentId}AgentWidget`);
      if (widget && !widget.classList.contains('hidden')) {
        widget.classList.add('hidden');
      }
    });

    this.activeAgents.clear();
    this.agentStates.forEach((state, id) => {
      state.active = false;
      this.agentStates.set(id, state);
    });

    console.log("✅ All agents closed");
  }

  // Get agent status
  getAgentStatus(agentId) {
    return this.agentStates.get(agentId) || { active: false, initialized: false };
  }

  // Get all active agents
  getActiveAgents() {
    return Array.from(this.activeAgents);
  }
}

// Inicjalizacja globalnego kontrolera
const agentsController = new AgentsController();

// Export funkcji toggle dla kompatybilności wstecznej
window.toggleVoiceAgent = (manualClick) => agentsController.toggleAgent('voice', manualClick);
window.toggleMusicAgent = (manualClick) => agentsController.toggleAgent('music', manualClick);
window.toggleSystemAgent = (manualClick) => agentsController.toggleAgent('system', manualClick);
window.toggleCrawlerAgent = (manualClick) => agentsController.toggleAgent('crawler', manualClick);
window.toggleFileAgent = (manualClick) => agentsController.toggleAgent('file', manualClick);
window.toggleDatabaseAgent = (manualClick) => agentsController.toggleAgent('database', manualClick);
window.toggleEmailAgent = (manualClick) => agentsController.toggleAgent('email', manualClick);
window.toggleSecurityAgent = (manualClick) => agentsController.toggleAgent('security', manualClick);
window.toggleWebmasterAgent = (manualClick) => agentsController.toggleAgent('webmaster', manualClick);
window.toggleAnalyticsAgent = (manualClick) => agentsController.toggleAgent('analytics', manualClick);
window.toggleContentAgent = (manualClick) => agentsController.toggleAgent('content', manualClick);
window.toggleMarketingAgent = (manualClick) => agentsController.toggleAgent('marketing', manualClick);

// Export kontrolera do globalnego scope
window.agentsController = agentsController;

console.log("✅ AgentsController initialized and exported globally");

export default agentsController;