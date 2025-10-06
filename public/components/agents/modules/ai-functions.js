// AI Functions - MyBonzo Advanced AI Integration & Processing
// Version: 1.0.0

class AIAgent {
  constructor() {
    this.models = new Map();
    this.conversationHistory = [];
    this.apiEndpoints = {
      deepseek: '/api/deepseek',
      gemini: '/api/gemini',
      claude: '/api/claude',
      openai: '/api/openai'
    };
    this.currentModel = 'deepseek';
    this.maxHistoryLength = 50;
    this.processingQueue = [];
    this.isProcessing = false;
    
    this.initializeModels();
  }

  // Initialize AI models configuration
  initializeModels() {
    this.models.set('deepseek', {
      name: 'DeepSeek',
      endpoint: this.apiEndpoints.deepseek,
      maxTokens: 4000,
      temperature: 0.7,
      supportedFeatures: ['chat', 'completion', 'analysis', 'coding'],
      status: 'unknown'
    });

    this.models.set('gemini', {
      name: 'Google Gemini',
      endpoint: this.apiEndpoints.gemini,
      maxTokens: 8000,
      temperature: 0.8,
      supportedFeatures: ['chat', 'multimodal', 'analysis', 'vision'],
      status: 'unknown'
    });

    this.models.set('claude', {
      name: 'Anthropic Claude',
      endpoint: this.apiEndpoints.claude,
      maxTokens: 4000,
      temperature: 0.7,
      supportedFeatures: ['chat', 'analysis', 'reasoning', 'coding'],
      status: 'unknown'
    });

    this.models.set('openai', {
      name: 'OpenAI GPT',
      endpoint: this.apiEndpoints.openai,
      maxTokens: 4000,
      temperature: 0.7,
      supportedFeatures: ['chat', 'completion', 'embeddings', 'moderation'],
      status: 'unknown'
    });

    this.checkModelAvailability();
  }

  // Check availability of all models
  async checkModelAvailability() {
    for (const [modelId, model] of this.models) {
      try {
        const response = await fetch(`${model.endpoint}/health`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        
        model.status = response.ok ? 'available' : 'unavailable';
        model.lastCheck = new Date().toISOString();
        
      } catch (error) {
        model.status = 'error';
        model.error = error.message;
        model.lastCheck = new Date().toISOString();
      }
    }
  }

  // Process AI chat request
  async processChat(message, options = {}) {
    const model = options.model || this.currentModel;
    const modelConfig = this.models.get(model);
    
    if (!modelConfig) {
      throw new Error(`Model ${model} not found`);
    }

    if (modelConfig.status !== 'available') {
      throw new Error(`Model ${model} is not available`);
    }

    // Add to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    try {
      const requestData = {
        message,
        history: this.getRecentHistory(options.includeHistory),
        options: {
          temperature: options.temperature || modelConfig.temperature,
          maxTokens: options.maxTokens || modelConfig.maxTokens,
          systemPrompt: options.systemPrompt,
          ...options
        }
      };

      const response = await fetch(modelConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: result.response || result.message,
        model: model,
        timestamp: new Date().toISOString(),
        metadata: result.metadata
      });

      // Trim history if too long
      this.trimHistory();

      return {
        response: result.response || result.message,
        model: model,
        usage: result.usage,
        metadata: result.metadata,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`AI Chat Error (${model}):`, error);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }

  // Process text completion
  async processCompletion(prompt, options = {}) {
    const model = options.model || this.currentModel;
    const modelConfig = this.models.get(model);
    
    if (!modelConfig || !modelConfig.supportedFeatures.includes('completion')) {
      throw new Error(`Model ${model} does not support completion`);
    }

    try {
      const requestData = {
        prompt,
        options: {
          temperature: options.temperature || modelConfig.temperature,
          maxTokens: options.maxTokens || Math.min(2000, modelConfig.maxTokens),
          stopSequences: options.stopSequences || [],
          ...options
        }
      };

      const response = await fetch(`${modelConfig.endpoint}/completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        completion: result.completion || result.text,
        model: model,
        usage: result.usage,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`AI Completion Error (${model}):`, error);
      throw new Error(`Completion failed: ${error.message}`);
    }
  }

  // Analyze text with AI
  async analyzeText(text, analysisType = 'general', options = {}) {
    const model = options.model || this.currentModel;
    const analysisPrompts = {
      sentiment: `Przeanalizuj sentyment tego tekstu i określ czy jest pozytywny, negatywny czy neutralny: "${text}"`,
      summary: `Stwórz krótkie streszczenie tego tekstu: "${text}"`,
      keywords: `Wyextraktuj kluczowe słowa i frazy z tego tekstu: "${text}"`,
      language: `Określ język tego tekstu i poziom formalności: "${text}"`,
      topics: `Zidentyfikuj główne tematy poruszane w tym tekście: "${text}"`,
      general: `Przeanalizuj ten tekst pod kątem treści, stylu i znaczenia: "${text}"`
    };

    const prompt = analysisPrompts[analysisType] || analysisPrompts.general;
    
    try {
      const result = await this.processChat(prompt, {
        model,
        systemPrompt: 'Jesteś ekspertem w analizie tekstu. Odpowiadaj zwięźle i precyzyjnie w języku polskim.',
        includeHistory: false,
        ...options
      });

      return {
        analysis: result.response,
        type: analysisType,
        originalText: text,
        model: model,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      throw new Error(`Text analysis failed: ${error.message}`);
    }
  }

  // Generate embeddings for text
  async generateEmbeddings(text, options = {}) {
    const model = options.model || 'openai';
    const modelConfig = this.models.get(model);
    
    if (!modelConfig || !modelConfig.supportedFeatures.includes('embeddings')) {
      throw new Error(`Model ${model} does not support embeddings`);
    }

    try {
      const response = await fetch(`${modelConfig.endpoint}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text,
          model: options.embeddingModel || 'text-embedding-ada-002'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        embeddings: result.embeddings || result.data,
        dimensions: result.dimensions,
        model: model,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      throw new Error(`Embeddings generation failed: ${error.message}`);
    }
  }

  // Process image with vision models
  async processImage(imageData, prompt, options = {}) {
    const model = options.model || 'gemini';
    const modelConfig = this.models.get(model);
    
    if (!modelConfig || !modelConfig.supportedFeatures.includes('vision')) {
      throw new Error(`Model ${model} does not support vision`);
    }

    try {
      const requestData = {
        image: imageData,
        prompt: prompt || 'Opisz co widzisz na tym obrazku',
        options: {
          detail: options.detail || 'auto',
          maxTokens: options.maxTokens || 1000,
          ...options
        }
      };

      const response = await fetch(`${modelConfig.endpoint}/vision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        description: result.description || result.response,
        model: model,
        confidence: result.confidence,
        objects: result.objects,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  // Moderate content
  async moderateContent(content, options = {}) {
    const model = options.model || 'openai';
    const modelConfig = this.models.get(model);
    
    if (!modelConfig || !modelConfig.supportedFeatures.includes('moderation')) {
      throw new Error(`Model ${model} does not support moderation`);
    }

    try {
      const response = await fetch(`${modelConfig.endpoint}/moderation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        flagged: result.flagged,
        categories: result.categories,
        scores: result.scores,
        model: model,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      throw new Error(`Content moderation failed: ${error.message}`);
    }
  }

  // Get recent conversation history
  getRecentHistory(includeHistory = true, maxMessages = 10) {
    if (!includeHistory) return [];
    
    return this.conversationHistory
      .slice(-maxMessages * 2) // Get last N exchanges (user + assistant pairs)
      .map(entry => ({
        role: entry.role,
        content: entry.content
      }));
  }

  // Trim conversation history
  trimHistory() {
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
    }
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }

  // Switch current model
  switchModel(modelId) {
    if (this.models.has(modelId)) {
      this.currentModel = modelId;
      return true;
    }
    return false;
  }

  // Get available models
  getAvailableModels() {
    const availableModels = [];
    
    this.models.forEach((model, id) => {
      if (model.status === 'available') {
        availableModels.push({
          id,
          name: model.name,
          features: model.supportedFeatures,
          maxTokens: model.maxTokens
        });
      }
    });
    
    return availableModels;
  }

  // Get AI statistics
  getStats() {
    const totalMessages = this.conversationHistory.length;
    const userMessages = this.conversationHistory.filter(m => m.role === 'user').length;
    const assistantMessages = this.conversationHistory.filter(m => m.role === 'assistant').length;
    
    const modelUsage = {};
    this.conversationHistory.forEach(message => {
      if (message.model) {
        modelUsage[message.model] = (modelUsage[message.model] || 0) + 1;
      }
    });
    
    return {
      totalMessages,
      userMessages,
      assistantMessages,
      modelUsage,
      currentModel: this.currentModel,
      availableModels: this.getAvailableModels().length,
      historyLength: this.conversationHistory.length
    };
  }

  // Export conversation history
  exportHistory(format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(this.conversationHistory, null, 2);
      case 'text':
        return this.conversationHistory
          .map(entry => `${entry.role.toUpperCase()} (${entry.timestamp}):\n${entry.content}\n`)
          .join('\n');
      case 'markdown':
        return this.conversationHistory
          .map(entry => `## ${entry.role === 'user' ? 'User' : 'Assistant'} - ${new Date(entry.timestamp).toLocaleString()}\n\n${entry.content}\n`)
          .join('\n');
      default:
        return this.conversationHistory;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIAgent;
} else if (typeof window !== 'undefined') {
  window.AIAgent = AIAgent;
}