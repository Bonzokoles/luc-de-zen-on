class AIAgentManager {
  constructor() {
    this.agents = new Map();
    this.conversations = new Map();
    this.setupEventListeners();
  }

  async createAgent(type, config = {}) {
    const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const agent = {
      id: agentId,
      type,
      config: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        ...config
      },
      status: 'initializing',
      created: Date.now(),
      conversations: []
    };

    try {
      // Initialize agent with Cloudflare Worker
      const response = await fetch('/api/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      agent.status = 'ready';
      agent.endpoint = result.endpoint;
      
      this.agents.set(agentId, agent);
      
      window.notifications?.success(`Agent ${type} został utworzony`, [
        { label: 'Otwórz', handler: () => this.openAgent(agentId) }
      ]);

      return agentId;
    } catch (error) {
      console.error('Failed to create agent:', error);
      window.notifications?.error(`Nie udało się utworzyć agenta: ${error.message}`);
      return null;
    }
  }

  async sendMessage(agentId, message, context = {}) {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error('Agent not found');

    const conversationId = context.conversationId || this.createConversation(agentId);
    
    try {
      const response = await fetch(agent.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationId,
          context,
          agentConfig: agent.config
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      
      // Store conversation
      this.addToConversation(conversationId, {
        user: message,
        agent: result.response,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error('Failed to send message:', error);
      window.notifications?.error(`Błąd komunikacji z agentem: ${error.message}`);
      throw error;
    }
  }

  createConversation(agentId) {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.conversations.set(conversationId, {
      id: conversationId,
      agentId,
      messages: [],
      created: Date.now()
    });
    return conversationId;
  }

  addToConversation(conversationId, message) {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.messages.push(message);
    }
  }

  getAgentStats() {
    return {
      totalAgents: this.agents.size,
      activeConversations: this.conversations.size,
      agentTypes: Array.from(this.agents.values()).reduce((acc, agent) => {
        acc[agent.type] = (acc[agent.type] || 0) + 1;
        return acc;
      }, {})
    };
  }
}

export default AIAgentManager;