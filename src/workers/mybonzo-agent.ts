import { Agent, Connection, ConnectionContext, WSMessage } from "agents";
import { OpenAI } from "openai";

interface Env {
  // Environment bindings
  AI: any;
  OPENAI_API_KEY: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
  
  // Durable Object bindings
  MYBONZO_AGENT: any;
  
  // KV and R2 bindings
  SESSION: any;
  IMAGES: any;
}

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface AgentState {
  conversationHistory: ConversationMessage[];
  sessionId: string;
  userPreferences: {
    language: 'polish' | 'english';
    preferredModel: string;
    imageStyle: string;
  };
  lastActivity: number;
}

/**
 * MyBonzo AI Agent - Enterprise-grade AI assistant with persistent state
 * 
 * Features:
 * - Real-time WebSocket communication
 * - Persistent conversation history
 * - Multi-model AI support (OpenAI, Cloudflare Workers AI)
 * - Image generation with R2 storage
 * - Polish-English translation
 * - Scheduled tasks and autonomous operations
 */
export class MyBonzoAgent extends Agent<Env> {
  private state: AgentState;
  private openai: OpenAI;

  constructor(state: any, env: Env) {
    super(state, env);
    
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    // Initialize default state
    this.state = {
      conversationHistory: [],
      sessionId: '',
      userPreferences: {
        language: 'polish',
        preferredModel: '@cf/meta/llama-3.1-8b-instruct',
        imageStyle: 'realistic'
      },
      lastActivity: Date.now()
    };
  }

  /**
   * Called when a client establishes WebSocket connection
   */
  async onConnect(connection: Connection, ctx: ConnectionContext): Promise<void> {
    console.log(`🔗 New connection: ${connection.id}`);
    
    // Load existing state
    const savedState = await this.state.storage.get<AgentState>('agentState');
    if (savedState) {
      this.state = { ...this.state, ...savedState };
    }

    // Extract session info from URL or headers
    const url = new URL(ctx.request.url);
    const sessionId = url.searchParams.get('sessionId') || `session-${Date.now()}`;
    this.state.sessionId = sessionId;

    // Send welcome message with conversation history
    await connection.send(JSON.stringify({
      type: 'welcome',
      sessionId: sessionId,
      conversationHistory: this.state.conversationHistory.slice(-10), // Last 10 messages
      capabilities: [
        'Real-time AI chat',
        'Image generation',
        'Polish-English translation',
        'Persistent memory',
        'Multi-model support'
      ]
    }));

    // Update activity timestamp
    this.state.lastActivity = Date.now();
    await this.setState({ agentState: this.state });
  }

  /**
   * Handle incoming WebSocket messages
   */
  async onMessage(connection: Connection, message: WSMessage): Promise<void> {
    try {
      const data = JSON.parse(message as string);
      console.log(`📨 Message from ${connection.id}:`, data.type);

      this.state.lastActivity = Date.now();

      switch (data.type) {
        case 'chat':
          await this.handleChatMessage(connection, data);
          break;
        
        case 'generate_image':
          await this.handleImageGeneration(connection, data);
          break;
        
        case 'translate':
          await this.handleTranslation(connection, data);
          break;
        
        case 'get_history':
          await this.sendConversationHistory(connection);
          break;
        
        case 'update_preferences':
          await this.updateUserPreferences(connection, data.preferences);
          break;
        
        default:
          await connection.send(JSON.stringify({
            type: 'error',
            message: `Unknown message type: ${data.type}`
          }));
      }

      // Persist state after each interaction
      await this.setState({ agentState: this.state });

    } catch (error) {
      console.error('Error handling message:', error);
      await connection.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  }

  /**
   * Handle chat messages with streaming AI responses
   */
  private async handleChatMessage(connection: Connection, data: any): Promise<void> {
    const userMessage = data.message;
    
    // Add user message to history
    this.state.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    });

    // Send typing indicator
    await connection.send(JSON.stringify({
      type: 'typing',
      status: true
    }));

    try {
      // Choose AI provider based on preferences
      if (data.useOpenAI || this.state.userPreferences.preferredModel.startsWith('gpt')) {
        await this.streamOpenAIResponse(connection, userMessage);
      } else {
        await this.streamWorkersAIResponse(connection, userMessage);
      }
    } catch (error) {
      console.error('AI response error:', error);
      await connection.send(JSON.stringify({
        type: 'error',
        message: 'Failed to generate AI response'
      }));
    }

    // Clear typing indicator
    await connection.send(JSON.stringify({
      type: 'typing',
      status: false
    }));
  }

  /**
   * Stream OpenAI response with chunks
   */
  private async streamOpenAIResponse(connection: Connection, prompt: string): Promise<void> {
    const stream = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are MyBonzo, a helpful AI assistant. Respond in Polish unless asked otherwise.' },
        ...this.state.conversationHistory.slice(-5), // Last 5 messages for context
        { role: 'user', content: prompt }
      ],
      stream: true,
      max_tokens: 1000
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        await connection.send(JSON.stringify({
          type: 'chat_chunk',
          content: content,
          isDone: false
        }));
      }
    }

    // Add complete response to history
    this.state.conversationHistory.push({
      role: 'assistant',
      content: fullResponse,
      timestamp: Date.now()
    });

    // Send completion signal
    await connection.send(JSON.stringify({
      type: 'chat_chunk',
      content: '',
      isDone: true,
      fullResponse: fullResponse
    }));
  }

  /**
   * Stream Workers AI response
   */
  private async streamWorkersAIResponse(connection: Connection, prompt: string): Promise<void> {
    const response = await this.env.AI.run(this.state.userPreferences.preferredModel, {
      messages: [
        { role: 'system', content: 'You are MyBonzo, a helpful AI assistant. Respond in Polish unless asked otherwise.' },
        ...this.state.conversationHistory.slice(-5),
        { role: 'user', content: prompt }
      ],
      stream: true
    });

    let fullResponse = '';

    // Handle Workers AI streaming
    if (response instanceof ReadableStream) {
      const reader = response.getReader();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = new TextDecoder().decode(value);
          fullResponse += chunk;
          
          await connection.send(JSON.stringify({
            type: 'chat_chunk',
            content: chunk,
            isDone: false
          }));
        }
      } finally {
        reader.releaseLock();
      }
    } else {
      fullResponse = response.response || 'No response generated';
      await connection.send(JSON.stringify({
        type: 'chat_chunk',
        content: fullResponse,
        isDone: false
      }));
    }

    // Add to history
    this.state.conversationHistory.push({
      role: 'assistant',
      content: fullResponse,
      timestamp: Date.now()
    });

    // Send completion
    await connection.send(JSON.stringify({
      type: 'chat_chunk',
      content: '',
      isDone: true,
      fullResponse: fullResponse
    }));
  }

  /**
   * Handle image generation with R2 storage
   */
  private async handleImageGeneration(connection: Connection, data: any): Promise<void> {
    await connection.send(JSON.stringify({
      type: 'image_generation_start',
      prompt: data.prompt
    }));

    try {
      // Translate prompt if needed
      let finalPrompt = data.prompt;
      if (this.state.userPreferences.language === 'polish') {
        finalPrompt = await this.translateText(data.prompt, 'polish', 'english');
      }

      // Generate image using Workers AI
      const imageResponse = await this.env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
        prompt: finalPrompt,
        width: data.width || 512,
        height: data.height || 512
      });

      // Store in R2
      const imageId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await this.env.IMAGES.put(imageId, imageResponse);

      // Send result
      await connection.send(JSON.stringify({
        type: 'image_generated',
        imageId: imageId,
        originalPrompt: data.prompt,
        translatedPrompt: finalPrompt,
        url: `/api/images/${imageId}`
      }));

    } catch (error) {
      console.error('Image generation error:', error);
      await connection.send(JSON.stringify({
        type: 'error',
        message: 'Failed to generate image'
      }));
    }
  }

  /**
   * Handle translation requests
   */
  private async handleTranslation(connection: Connection, data: any): Promise<void> {
    try {
      const translatedText = await this.translateText(
        data.text,
        data.sourceLanguage || 'polish',
        data.targetLanguage || 'english'
      );

      await connection.send(JSON.stringify({
        type: 'translation_result',
        originalText: data.text,
        translatedText: translatedText,
        sourceLanguage: data.sourceLanguage,
        targetLanguage: data.targetLanguage
      }));
    } catch (error) {
      await connection.send(JSON.stringify({
        type: 'error',
        message: 'Translation failed'
      }));
    }
  }

  /**
   * Send conversation history
   */
  private async sendConversationHistory(connection: Connection): Promise<void> {
    await connection.send(JSON.stringify({
      type: 'conversation_history',
      history: this.state.conversationHistory,
      sessionId: this.state.sessionId
    }));
  }

  /**
   * Update user preferences
   */
  private async updateUserPreferences(connection: Connection, preferences: any): Promise<void> {
    this.state.userPreferences = { ...this.state.userPreferences, ...preferences };
    
    await connection.send(JSON.stringify({
      type: 'preferences_updated',
      preferences: this.state.userPreferences
    }));
  }

  /**
   * Utility: Translate text using existing translation API
   */
  private async translateText(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    // Use the existing translation system
    // This would call our translation API or implement dictionary lookup
    return text; // Placeholder - integrate with existing translation
  }

  /**
   * Scheduled task for cleanup and maintenance
   */
  async onScheduled(event: ScheduledEvent): Promise<void> {
    console.log('🔄 Running scheduled maintenance...');
    
    // Clean old conversation history (keep last 100 messages)
    if (this.state.conversationHistory.length > 100) {
      this.state.conversationHistory = this.state.conversationHistory.slice(-100);
      await this.setState({ agentState: this.state });
    }

    // Clean inactive sessions
    const inactiveThreshold = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
    if (this.state.lastActivity < inactiveThreshold) {
      console.log('🧹 Cleaning inactive session');
      await this.state.storage.deleteAll();
    }
  }

  /**
   * HTTP request handler for REST API compatibility
   */
  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        agent: 'MyBonzoAgent',
        sessionId: this.state.sessionId,
        conversationLength: this.state.conversationHistory.length,
        lastActivity: new Date(this.state.lastActivity).toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      // HTTP fallback for chat
      const body = await request.json();
      // Implementation for HTTP-based chat
      return new Response('WebSocket preferred for real-time chat', { status: 200 });
    }

    return new Response('Not Found', { status: 404 });
  }
}
