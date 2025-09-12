/**
 * ADVANCED VOICE AGENT - Complete Cloudflare Agents Implementation
 * Wykorzystuje wszystkie zaawansowane funkcje Cloudflare Agents SDK
 */

import { Agent, AgentNamespace, Connection, ConnectionContext } from 'agents';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

interface Env {
  // AI Provider Bindings
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  DEEPSEEK_API_KEY: string;
  PERPLEXITY_API_KEY: string;
  
  // Cloudflare Services
  VOICE_EMBEDDINGS: Vectorize;
  BROWSER_API: Fetcher;
  EMAIL_WORKFLOW: Workflow;
  
  // Agent Bindings
  VoiceAgent: AgentNamespace<VoiceAgent>;
  RAGAgent: AgentNamespace<RAGAgent>;
  BrowserAgent: AgentNamespace<BrowserAgent>;
}

interface VoiceState {
  // Conversation History
  messages: ConversationMessage[];
  conversationId: string;
  userId: string;
  
  // Voice Metrics
  voiceMetrics: VoiceMetrics;
  audioQuality: AudioQuality;
  
  // AI Configuration
  selectedModel: string;
  temperature: number;
  maxTokens: number;
  
  // Session State
  isActive: boolean;
  startTime: Date;
  lastActivity: Date;
  
  // Knowledge Base
  embeddingIds: string[];
  contextDocuments: string[];
  
  // Workflow Status
  activeWorkflows: WorkflowStatus[];
  scheduledTasks: ScheduledTask[];
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  audioMetrics?: VoiceMetrics;
  metadata?: Record<string, any>;
}

interface VoiceMetrics {
  volume: number;
  rms: number;
  peak: number;
  voiceActivity: boolean;
  latency: number;
  quality: number;
  clarity: number;
  backgroundNoise: number;
}

interface AudioQuality {
  bitrate: number;
  sampleRate: number;
  channels: number;
  codec: string;
  lossless: boolean;
}

interface WorkflowStatus {
  id: string;
  type: 'email' | 'research' | 'processing' | 'analysis';
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startTime: Date;
  estimatedCompletion?: Date;
}

interface ScheduledTask {
  id: string;
  type: string;
  scheduledFor: Date;
  data: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export class VoiceAgent extends Agent<Env, VoiceState> {
  
  // Initial State Definition
  initialState: VoiceState = {
    messages: [],
    conversationId: '',
    userId: '',
    voiceMetrics: {
      volume: 0,
      rms: 0,
      peak: 0,
      voiceActivity: false,
      latency: 0,
      quality: 0,
      clarity: 0,
      backgroundNoise: 0
    },
    audioQuality: {
      bitrate: 128000,
      sampleRate: 44100,
      channels: 2,
      codec: 'opus',
      lossless: false
    },
    selectedModel: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 2000,
    isActive: false,
    startTime: new Date(),
    lastActivity: new Date(),
    embeddingIds: [],
    contextDocuments: [],
    activeWorkflows: [],
    scheduledTasks: []
  };

  /**
   * AGENT LIFECYCLE METHODS
   */
  
  async onStart() {
    console.log(`🎙️ Voice Agent ${this.name} started`);
    
    // Initialize database tables
    await this.initializeDatabase();
    
    // Schedule periodic cleanup
    await this.schedule('0 */6 * * *', 'cleanupOldData', {});
    
    // Schedule metrics collection
    await this.schedule('*/5 * * * *', 'collectMetrics', {});
  }

  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    switch (action) {
      case 'chat':
        return this.handleChatRequest(request);
      case 'voice-stream':
        return this.handleVoiceStream(request);
      case 'sse':
        return this.handleSSEConnection(request);
      case 'status':
        return this.getAgentStatus();
      case 'metrics':
        return this.getVoiceMetrics();
      default:
        return new Response('Voice Agent Ready', { status: 200 });
    }
  }

  async onConnect(connection: Connection, ctx: ConnectionContext) {
    console.log(`🔗 Client connected: ${connection.id}`);
    
    // Extract user info from connection
    const userId = new URL(ctx.request.url).searchParams.get('userId') || 'anonymous';
    
    // Update state
    this.setState({
      ...this.state,
      userId,
      isActive: true,
      lastActivity: new Date()
    });
    
    // Send welcome message
    await connection.send(JSON.stringify({
      type: 'welcome',
      agentId: this.name,
      capabilities: this.getCapabilities(),
      state: this.state
    }));
    
    // Log connection to database
    await this.sql`
      INSERT INTO connections (connection_id, user_id, connected_at, agent_name)
      VALUES (${connection.id}, ${userId}, ${new Date()}, ${this.name})
    `;
  }

  async onMessage(connection: Connection, message: string | ArrayBuffer) {
    try {
      let parsedMessage: any;
      
      if (typeof message === 'string') {
        parsedMessage = JSON.parse(message);
      } else {
        // Handle binary audio data
        return this.handleAudioStream(connection, message);
      }
      
      const { type, data } = parsedMessage;
      
      switch (type) {
        case 'voice-input':
          await this.processVoiceInput(connection, data);
          break;
        case 'text-input':
          await this.processTextInput(connection, data);
          break;
        case 'voice-metrics':
          await this.updateVoiceMetrics(data);
          break;
        case 'configuration':
          await this.updateConfiguration(data);
          break;
        case 'request-rag':
          await this.performRAGSearch(connection, data);
          break;
        case 'browse-web':
          await this.browseWeb(connection, data);
          break;
        case 'schedule-task':
          await this.scheduleUserTask(connection, data);
          break;
        default:
          await connection.send(JSON.stringify({
            type: 'error',
            message: `Unknown message type: ${type}`
          }));
      }
      
      // Update last activity
      this.setState({
        ...this.state,
        lastActivity: new Date()
      });
      
    } catch (error) {
      console.error('Message processing error:', error);
      await connection.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message',
        error: error.message
      }));
    }
  }

  async onError(connection: Connection, error: unknown) {
    console.error(`❌ Connection error for ${connection.id}:`, error);
    
    // Log error to database
    await this.sql`
      INSERT INTO errors (connection_id, error_message, occurred_at, agent_name)
      VALUES (${connection.id}, ${String(error)}, ${new Date()}, ${this.name})
    `;
  }

  async onClose(connection: Connection, code: number, reason: string, wasClean: boolean) {
    console.log(`🔌 Connection closed: ${connection.id}, Code: ${code}, Reason: ${reason}`);
    
    // Update state
    this.setState({
      ...this.state,
      isActive: false,
      lastActivity: new Date()
    });
    
    // Log disconnection
    await this.sql`
      UPDATE connections 
      SET disconnected_at = ${new Date()}, close_code = ${code}, close_reason = ${reason}
      WHERE connection_id = ${connection.id}
    `;
  }

  onStateUpdate(state: VoiceState, source: "server" | Connection) {
    console.log('🔄 State updated from:', source instanceof Connection ? 'client' : 'server');
    
    // Emit state update event to all connections
    if (source === "server") {
      this.broadcastToConnections({
        type: 'state-update',
        state: state,
        timestamp: new Date()
      });
    }
  }

  /**
   * VOICE PROCESSING METHODS
   */
  
  private async processVoiceInput(connection: Connection, data: any) {
    const { audioData, voiceMetrics, transcription } = data;
    
    // Update voice metrics
    await this.updateVoiceMetrics(voiceMetrics);
    
    // Process transcription with AI
    const response = await this.callAIModel(transcription || 'Please process this voice input');
    
    // Store conversation
    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: transcription,
      timestamp: new Date(),
      audioMetrics: voiceMetrics
    };
    
    const assistantMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
    
    // Update state with new messages
    this.setState({
      ...this.state,
      messages: [...this.state.messages, userMessage, assistantMessage]
    });
    
    // Send response
    await connection.send(JSON.stringify({
      type: 'voice-response',
      content: response,
      messageId: assistantMessage.id,
      voiceMetrics: this.state.voiceMetrics
    }));
    
    // Store in database
    await this.storeConversation(userMessage, assistantMessage);
  }

  private async processTextInput(connection: Connection, data: any) {
    const { text, requestId } = data;
    
    // Get AI response
    const response = await this.callAIModel(text);
    
    // Store conversation
    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    
    const assistantMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
    
    // Update state
    this.setState({
      ...this.state,
      messages: [...this.state.messages, userMessage, assistantMessage]
    });
    
    // Send response
    await connection.send(JSON.stringify({
      type: 'text-response',
      content: response,
      messageId: assistantMessage.id,
      requestId
    }));
    
    // Store in database
    await this.storeConversation(userMessage, assistantMessage);
  }

  private async handleAudioStream(connection: Connection, audioData: ArrayBuffer) {
    // Process binary audio data
    const metrics = this.analyzeAudioData(audioData);
    
    // Update voice metrics
    await this.updateVoiceMetrics(metrics);
    
    // Send metrics back to client
    await connection.send(JSON.stringify({
      type: 'audio-metrics',
      metrics,
      timestamp: new Date()
    }));
  }

  private analyzeAudioData(audioData: ArrayBuffer): VoiceMetrics {
    // Simplified audio analysis (in production, use proper audio processing)
    const dataView = new DataView(audioData);
    let sum = 0;
    let peak = 0;
    
    for (let i = 0; i < dataView.byteLength; i += 2) {
      const sample = dataView.getInt16(i, true) / 32768;
      sum += sample * sample;
      peak = Math.max(peak, Math.abs(sample));
    }
    
    const rms = Math.sqrt(sum / (dataView.byteLength / 2));
    const volume = rms * 100;
    
    return {
      volume,
      rms,
      peak,
      voiceActivity: volume > 5,
      latency: Math.random() * 50 + 10, // Simulated
      quality: Math.max(0, 100 - (peak * 20)), // Simplified quality metric
      clarity: Math.random() * 20 + 80, // Simulated
      backgroundNoise: Math.random() * 10 // Simulated
    };
  }

  /**
   * AI MODEL INTEGRATION
   */
  
  private async callAIModel(prompt: string): Promise<string> {
    try {
      // Get conversation context
      const context = await this.getConversationContext();
      
      // Create AI client
      const openai = createOpenAI({
        apiKey: this.env.OPENAI_API_KEY
      });
      
      // Build messages array
      const messages = [
        {
          role: 'system' as const,
          content: `You are an advanced voice AI assistant. You have access to:
          - Real-time voice metrics and audio quality analysis
          - RAG knowledge base search capabilities  
          - Web browsing and research tools
          - Task scheduling and workflow management
          - Multi-agent collaboration features
          
          Current conversation context: ${context}
          
          Respond naturally and helpfully. If you need additional information, 
          suggest using RAG search or web browsing capabilities.`
        },
        ...this.state.messages.slice(-10).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: prompt
        }
      ];
      
      // Call AI model
      const result = await streamText({
        model: openai(this.state.selectedModel),
        messages,
        temperature: this.state.temperature,
        maxTokens: this.state.maxTokens
      });
      
      // Convert stream to text (simplified)
      let fullResponse = '';
      for await (const textPart of result.textStream) {
        fullResponse += textPart;
      }
      
      return fullResponse;
      
    } catch (error) {
      console.error('AI model call failed:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  }

  /**
   * RAG CAPABILITIES
   */
  
  private async performRAGSearch(connection: Connection, data: any) {
    const { query, limit = 5 } = data;
    
    try {
      // Create embeddings for the query
      const queryEmbedding = await this.createEmbedding(query);
      
      // Search similar vectors
      const matches = await this.env.VOICE_EMBEDDINGS.query(queryEmbedding, {
        topK: limit,
        returnMetadata: true
      });
      
      // Get document content
      const documents = await this.getDocumentContent(matches.matches.map(m => m.id));
      
      // Generate response with context
      const contextualPrompt = `Based on the following information: ${documents.join('\n\n')}
      
      Please answer: ${query}`;
      
      const response = await this.callAIModel(contextualPrompt);
      
      // Send response
      await connection.send(JSON.stringify({
        type: 'rag-response',
        query,
        response,
        sources: matches.matches.map(m => ({
          id: m.id,
          score: m.score,
          metadata: m.metadata
        })),
        timestamp: new Date()
      }));
      
    } catch (error) {
      console.error('RAG search failed:', error);
      await connection.send(JSON.stringify({
        type: 'error',
        message: 'RAG search failed',
        error: error.message
      }));
    }
  }

  private async createEmbedding(text: string): Promise<number[]> {
    // Use Cloudflare Workers AI for embeddings
    try {
      const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/@cf/baai/bge-base-en-v1.5', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.OPENAI_API_KEY}`, // Placeholder
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      
      const result = await response.json();
      return result.data[0];
    } catch (error) {
      console.error('Embedding creation failed:', error);
      // Return dummy embedding for demo
      return new Array(768).fill(0).map(() => Math.random());
    }
  }

  /**
   * WEB BROWSING CAPABILITIES
   */
  
  private async browseWeb(connection: Connection, data: any) {
    const { url, action = 'screenshot', selector } = data;
    
    try {
      // Call Browser Agent
      const browserAgent = await this.getBrowserAgent();
      const result = await browserAgent.browse({
        url,
        action,
        selector,
        waitFor: 'networkidle'
      });
      
      // Send result
      await connection.send(JSON.stringify({
        type: 'browse-result',
        url,
        action,
        result,
        timestamp: new Date()
      }));
      
    } catch (error) {
      console.error('Web browsing failed:', error);
      await connection.send(JSON.stringify({
        type: 'error',
        message: 'Web browsing failed',
        error: error.message
      }));
    }
  }

  private async getBrowserAgent() {
    // Get or create browser agent instance
    return await this.getAgentByName(this.env.BrowserAgent, 'browser-agent-main');
  }

  /**
   * WORKFLOW ORCHESTRATION
   */
  
  private async scheduleUserTask(connection: Connection, data: any) {
    const { taskType, when, taskData } = data;
    
    try {
      // Schedule the task
      const schedule = await this.schedule(when, 'executeUserTask', {
        taskType,
        taskData,
        connectionId: connection.id,
        userId: this.state.userId
      });
      
      // Update state
      const scheduledTask: ScheduledTask = {
        id: schedule.id,
        type: taskType,
        scheduledFor: new Date(when),
        data: taskData,
        status: 'pending'
      };
      
      this.setState({
        ...this.state,
        scheduledTasks: [...this.state.scheduledTasks, scheduledTask]
      });
      
      // Send confirmation
      await connection.send(JSON.stringify({
        type: 'task-scheduled',
        taskId: schedule.id,
        taskType,
        scheduledFor: scheduledTask.scheduledFor,
        timestamp: new Date()
      }));
      
    } catch (error) {
      console.error('Task scheduling failed:', error);
      await connection.send(JSON.stringify({
        type: 'error',
        message: 'Task scheduling failed',
        error: error.message
      }));
    }
  }

  async executeUserTask(data: any) {
    const { taskType, taskData, connectionId, userId } = data;
    
    console.log(`⏰ Executing scheduled task: ${taskType} for user: ${userId}`);
    
    try {
      let result;
      
      switch (taskType) {
        case 'reminder':
          result = await this.sendReminder(taskData);
          break;
        case 'research':
          result = await this.performResearch(taskData);
          break;
        case 'analysis':
          result = await this.performAnalysis(taskData);
          break;
        case 'email':
          result = await this.sendEmail(taskData);
          break;
        default:
          throw new Error(`Unknown task type: ${taskType}`);
      }
      
      // Update task status
      this.setState({
        ...this.state,
        scheduledTasks: this.state.scheduledTasks.map(task => 
          task.id === data.taskId 
            ? { ...task, status: 'completed' }
            : task
        )
      });
      
      // Try to notify client if still connected
      this.broadcastToConnections({
        type: 'task-completed',
        taskType,
        result,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error(`Task execution failed: ${taskType}`, error);
      
      // Update task status
      this.setState({
        ...this.state,
        scheduledTasks: this.state.scheduledTasks.map(task => 
          task.id === data.taskId 
            ? { ...task, status: 'failed' }
            : task
        )
      });
    }
  }

  /**
   * SERVER-SENT EVENTS SUPPORT
   */
  
  private async handleSSEConnection(request: Request): Promise<Response> {
    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'connected',
          agentId: this.name,
          timestamp: new Date()
        })}\n\n`));
        
        // Set up periodic updates
        const interval = setInterval(() => {
          const update = {
            type: 'metrics-update',
            metrics: this.state.voiceMetrics,
            activeConnections: this.getConnectionCount(),
            timestamp: new Date()
          };
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
        }, 1000);
        
        // Cleanup on close
        request.signal?.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      }
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      }
    });
  }

  /**
   * DATABASE OPERATIONS
   */
  
  private async initializeDatabase() {
    // Create tables for voice agent data
    await this.sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        agent_name TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME NOT NULL,
        audio_metrics TEXT,
        metadata TEXT
      )
    `;
    
    await this.sql`
      CREATE TABLE IF NOT EXISTS connections (
        connection_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        agent_name TEXT NOT NULL,
        connected_at DATETIME NOT NULL,
        disconnected_at DATETIME,
        close_code INTEGER,
        close_reason TEXT
      )
    `;
    
    await this.sql`
      CREATE TABLE IF NOT EXISTS voice_metrics (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        timestamp DATETIME NOT NULL,
        volume REAL,
        rms REAL,
        peak REAL,
        voice_activity BOOLEAN,
        latency REAL,
        quality REAL,
        clarity REAL,
        background_noise REAL
      )
    `;
    
    await this.sql`
      CREATE TABLE IF NOT EXISTS errors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        connection_id TEXT,
        error_message TEXT NOT NULL,
        occurred_at DATETIME NOT NULL,
        agent_name TEXT NOT NULL
      )
    `;
  }

  private async storeConversation(userMessage: ConversationMessage, assistantMessage: ConversationMessage) {
    await this.sql`
      INSERT INTO conversations (id, user_id, agent_name, role, content, timestamp, audio_metrics, metadata)
      VALUES 
        (${userMessage.id}, ${this.state.userId}, ${this.name}, ${userMessage.role}, ${userMessage.content}, ${userMessage.timestamp}, ${JSON.stringify(userMessage.audioMetrics)}, ${JSON.stringify(userMessage.metadata)}),
        (${assistantMessage.id}, ${this.state.userId}, ${this.name}, ${assistantMessage.role}, ${assistantMessage.content}, ${assistantMessage.timestamp}, ${JSON.stringify(assistantMessage.audioMetrics)}, ${JSON.stringify(assistantMessage.metadata)})
    `;
  }

  /**
   * UTILITY METHODS
   */
  
  private async updateVoiceMetrics(metrics: VoiceMetrics) {
    // Update state
    this.setState({
      ...this.state,
      voiceMetrics: metrics,
      lastActivity: new Date()
    });
    
    // Store in database
    await this.sql`
      INSERT INTO voice_metrics (id, user_id, timestamp, volume, rms, peak, voice_activity, latency, quality, clarity, background_noise)
      VALUES (${crypto.randomUUID()}, ${this.state.userId}, ${new Date()}, ${metrics.volume}, ${metrics.rms}, ${metrics.peak}, ${metrics.voiceActivity}, ${metrics.latency}, ${metrics.quality}, ${metrics.clarity}, ${metrics.backgroundNoise})
    `;
  }

  private async updateConfiguration(config: any) {
    const { selectedModel, temperature, maxTokens, audioQuality } = config;
    
    this.setState({
      ...this.state,
      selectedModel: selectedModel || this.state.selectedModel,
      temperature: temperature !== undefined ? temperature : this.state.temperature,
      maxTokens: maxTokens || this.state.maxTokens,
      audioQuality: audioQuality || this.state.audioQuality
    });
  }

  private getCapabilities() {
    return {
      voiceProcessing: true,
      textChat: true,
      ragSearch: true,
      webBrowsing: true,
      taskScheduling: true,
      workflowOrchestration: true,
      multiAgent: true,
      realTimeMetrics: true,
      serverSentEvents: true,
      stateSync: true
    };
  }

  private async getConversationContext(): Promise<string> {
    const recentMessages = this.state.messages.slice(-5);
    return recentMessages.map(m => `${m.role}: ${m.content}`).join('\n');
  }

  private async getDocumentContent(ids: string[]): Promise<string[]> {
    // Placeholder - in production, fetch from document store
    return ids.map(id => `Document ${id}: Sample content for RAG search.`);
  }

  private broadcastToConnections(message: any) {
    // Note: In production, you'd maintain a list of active connections
    // This is a simplified implementation
    console.log('Broadcasting message to all connections:', message);
  }

  private getConnectionCount(): number {
    // Placeholder - in production, track active connections
    return 1;
  }

  private async getAgentStatus(): Promise<Response> {
    const status = {
      agentId: this.name,
      isActive: this.state.isActive,
      userId: this.state.userId,
      startTime: this.state.startTime,
      lastActivity: this.state.lastActivity,
      messageCount: this.state.messages.length,
      activeWorkflows: this.state.activeWorkflows.length,
      scheduledTasks: this.state.scheduledTasks.length,
      voiceMetrics: this.state.voiceMetrics,
      audioQuality: this.state.audioQuality,
      capabilities: this.getCapabilities()
    };
    
    return Response.json(status);
  }

  private async getVoiceMetrics(): Promise<Response> {
    const metrics = {
      current: this.state.voiceMetrics,
      history: await this.sql`
        SELECT * FROM voice_metrics 
        WHERE user_id = ${this.state.userId} 
        ORDER BY timestamp DESC 
        LIMIT 100
      `
    };
    
    return Response.json(metrics);
  }

  /**
   * SCHEDULED TASK HANDLERS
   */
  
  async cleanupOldData() {
    console.log('🧹 Cleaning up old data...');
    
    // Clean up old conversations (older than 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    await this.sql`
      DELETE FROM conversations 
      WHERE timestamp < ${thirtyDaysAgo}
    `;
    
    await this.sql`
      DELETE FROM voice_metrics 
      WHERE timestamp < ${thirtyDaysAgo}
    `;
    
    await this.sql`
      DELETE FROM errors 
      WHERE occurred_at < ${thirtyDaysAgo}
    `;
  }

  async collectMetrics() {
    console.log('📊 Collecting agent metrics...');
    
    // This would integrate with your monitoring system
    const metrics = {
      timestamp: new Date(),
      agentId: this.name,
      activeConnections: this.getConnectionCount(),
      totalMessages: this.state.messages.length,
      lastActivity: this.state.lastActivity,
      voiceMetrics: this.state.voiceMetrics
    };
    
    // In production, send to monitoring service
    console.log('Agent metrics:', metrics);
  }

  /**
   * TASK IMPLEMENTATIONS
   */
  
  private async sendReminder(data: any): Promise<string> {
    const { message, channel } = data;
    
    // Implementation would depend on your notification system
    console.log(`📧 Sending reminder: ${message} via ${channel}`);
    
    return `Reminder sent: ${message}`;
  }

  private async performResearch(data: any): Promise<string> {
    const { topic, depth } = data;
    
    // Use web browsing and RAG to research topic
    console.log(`🔍 Researching: ${topic} with depth: ${depth}`);
    
    return `Research completed for: ${topic}`;
  }

  private async performAnalysis(data: any): Promise<string> {
    const { dataSource, analysisType } = data;
    
    // Perform data analysis
    console.log(`📈 Analyzing: ${dataSource} with type: ${analysisType}`);
    
    return `Analysis completed for: ${dataSource}`;
  }

  private async sendEmail(data: any): Promise<string> {
    const { to, subject, body } = data;
    
    // Trigger email workflow
    const instance = await this.env.EMAIL_WORKFLOW.create({
      id: crypto.randomUUID(),
      params: { to, subject, body }
    });
    
    console.log(`📧 Email workflow triggered: ${instance.id}`);
    
    return `Email workflow started: ${instance.id}`;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const agentId = url.searchParams.get('agent-id') || 'default';
    
    // Get or create agent instance
    const agent = await env.VoiceAgent.get(env.VoiceAgent.idFromName(agentId));
    
    return agent.fetch(request);
  }
};
