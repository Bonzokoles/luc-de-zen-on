/**
 * BROWSER AUTOMATION AGENT
 * Wykorzystuje Cloudflare Browser Rendering API do automatyzacji przeglądarki
 */

export interface BrowserRequest {
  url: string;
  action: 'screenshot' | 'pdf' | 'html' | 'text' | 'click' | 'type' | 'scroll';
  selector?: string;
  value?: string;
  waitFor?: 'load' | 'networkidle' | 'domcontentloaded';
  viewport?: {
    width: number;
    height: number;
  };
  options?: Record<string, any>;
}

export interface BrowserResult {
  success: boolean;
  data?: string | ArrayBuffer;
  metadata?: {
    title?: string;
    url?: string;
    timestamp: Date;
    duration: number;
  };
  error?: string;
}

export class BrowserAgent {
  private env: any;

  constructor(env: any) {
    this.env = env;
  }

  async browse(request: BrowserRequest): Promise<BrowserResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🌐 Browser action: ${request.action} on ${request.url}`);
      
      // Configure browser options
      const browserOptions = {
        url: request.url,
        viewport: request.viewport || { width: 1920, height: 1080 },
        waitFor: request.waitFor || 'load',
        ...request.options
      };
      
      let result: any;
      
      switch (request.action) {
        case 'screenshot':
          result = await this.takeScreenshot(browserOptions);
          break;
        case 'pdf':
          result = await this.generatePDF(browserOptions);
          break;
        case 'html':
          result = await this.getHTML(browserOptions);
          break;
        case 'text':
          result = await this.extractText(browserOptions);
          break;
        case 'click':
          result = await this.clickElement(browserOptions, request.selector!);
          break;
        case 'type':
          result = await this.typeText(browserOptions, request.selector!, request.value!);
          break;
        case 'scroll':
          result = await this.scrollPage(browserOptions);
          break;
        default:
          throw new Error(`Unsupported action: ${request.action}`);
      }
      
      const duration = Date.now() - startTime;
      
      return {
        success: true,
        data: result.data,
        metadata: {
          title: result.title,
          url: request.url,
          timestamp: new Date(),
          duration
        }
      };
      
    } catch (error) {
      console.error('Browser automation failed:', error);
      
      return {
        success: false,
        error: error.message,
        metadata: {
          url: request.url,
          timestamp: new Date(),
          duration: Date.now() - startTime
        }
      };
    }
  }

  private async takeScreenshot(options: any): Promise<any> {
    // Using Cloudflare Browser Rendering API
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/browser', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: options.url,
        viewport: options.viewport,
        action: 'screenshot',
        format: 'png',
        quality: 90,
        fullPage: true,
        waitFor: options.waitFor
      })
    });
    
    if (!response.ok) {
      throw new Error(`Screenshot failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return {
      data: result.screenshot, // Base64 encoded image
      title: result.title
    };
  }

  private async generatePDF(options: any): Promise<any> {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/browser', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: options.url,
        viewport: options.viewport,
        action: 'pdf',
        format: 'A4',
        landscape: false,
        margin: {
          top: '1cm',
          bottom: '1cm',
          left: '1cm',
          right: '1cm'
        },
        waitFor: options.waitFor
      })
    });
    
    if (!response.ok) {
      throw new Error(`PDF generation failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return {
      data: result.pdf, // Base64 encoded PDF
      title: result.title
    };
  }

  private async getHTML(options: any): Promise<any> {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/browser', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: options.url,
        viewport: options.viewport,
        action: 'html',
        waitFor: options.waitFor
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTML extraction failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return {
      data: result.html,
      title: result.title
    };
  }

  private async extractText(options: any): Promise<any> {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/browser', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: options.url,
        viewport: options.viewport,
        action: 'text',
        removeStyles: true,
        removeScripts: true,
        waitFor: options.waitFor
      })
    });
    
    if (!response.ok) {
      throw new Error(`Text extraction failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return {
      data: result.text,
      title: result.title
    };
  }

  private async clickElement(options: any, selector: string): Promise<any> {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/browser', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: options.url,
        viewport: options.viewport,
        action: 'click',
        selector: selector,
        waitFor: options.waitFor
      })
    });
    
    if (!response.ok) {
      throw new Error(`Click action failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return {
      data: `Clicked element: ${selector}`,
      title: result.title
    };
  }

  private async typeText(options: any, selector: string, value: string): Promise<any> {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/browser', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: options.url,
        viewport: options.viewport,
        action: 'type',
        selector: selector,
        value: value,
        waitFor: options.waitFor
      })
    });
    
    if (!response.ok) {
      throw new Error(`Type action failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return {
      data: `Typed "${value}" into ${selector}`,
      title: result.title
    };
  }

  private async scrollPage(options: any): Promise<any> {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/browser', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: options.url,
        viewport: options.viewport,
        action: 'scroll',
        direction: 'down',
        amount: 'page',
        waitFor: options.waitFor
      })
    });
    
    if (!response.ok) {
      throw new Error(`Scroll action failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return {
      data: 'Page scrolled',
      title: result.title
    };
  }
}

/**
 * RAG (Retrieval Augmented Generation) AGENT
 * Wykorzystuje Cloudflare Vectorize do przechowywania i wyszukiwania embeddings
 */

export interface RAGDocument {
  id: string;
  content: string;
  metadata: {
    title?: string;
    source?: string;
    timestamp: Date;
    category?: string;
    tags?: string[];
  };
  embedding?: number[];
}

export interface RAGSearchRequest {
  query: string;
  limit?: number;
  threshold?: number;
  filters?: Record<string, any>;
  includeContent?: boolean;
}

export interface RAGSearchResult {
  documents: Array<{
    id: string;
    content?: string;
    score: number;
    metadata: any;
  }>;
  query: string;
  totalResults: number;
  processingTime: number;
}

export class RAGAgent {
  private env: any;

  constructor(env: any) {
    this.env = env;
  }

  async addDocument(document: RAGDocument): Promise<string> {
    try {
      console.log(`📚 Adding document to RAG: ${document.id}`);
      
      // Generate embedding if not provided
      if (!document.embedding) {
        document.embedding = await this.generateEmbedding(document.content);
      }
      
      // Store in Vectorize
      await this.env.VOICE_EMBEDDINGS.upsert([
        {
          id: document.id,
          values: document.embedding,
          metadata: {
            ...document.metadata,
            content: document.content
          }
        }
      ]);
      
      console.log(`✅ Document ${document.id} added to RAG`);
      return document.id;
      
    } catch (error) {
      console.error('Failed to add document to RAG:', error);
      throw error;
    }
  }

  async addDocuments(documents: RAGDocument[]): Promise<string[]> {
    try {
      console.log(`📚 Adding ${documents.length} documents to RAG`);
      
      // Generate embeddings for documents that don't have them
      const documentsWithEmbeddings = await Promise.all(
        documents.map(async (doc) => {
          if (!doc.embedding) {
            doc.embedding = await this.generateEmbedding(doc.content);
          }
          return doc;
        })
      );
      
      // Prepare vectors for Vectorize
      const vectors = documentsWithEmbeddings.map(doc => ({
        id: doc.id,
        values: doc.embedding!,
        metadata: {
          ...doc.metadata,
          content: doc.content
        }
      }));
      
      // Batch upsert to Vectorize
      await this.env.VOICE_EMBEDDINGS.upsert(vectors);
      
      console.log(`✅ ${documents.length} documents added to RAG`);
      return documents.map(doc => doc.id);
      
    } catch (error) {
      console.error('Failed to add documents to RAG:', error);
      throw error;
    }
  }

  async search(request: RAGSearchRequest): Promise<RAGSearchResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 RAG search: "${request.query}"`);
      
      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(request.query);
      
      // Search Vectorize
      const searchResults = await this.env.VOICE_EMBEDDINGS.query(queryEmbedding, {
        topK: request.limit || 5,
        returnMetadata: true,
        filter: request.filters
      });
      
      // Filter by threshold if specified
      let filteredResults = searchResults.matches;
      if (request.threshold) {
        filteredResults = filteredResults.filter(match => match.score >= request.threshold);
      }
      
      // Format results
      const documents = filteredResults.map(match => ({
        id: match.id,
        content: request.includeContent !== false ? match.metadata?.content : undefined,
        score: match.score,
        metadata: {
          ...match.metadata,
          content: undefined // Remove content from metadata to avoid duplication
        }
      }));
      
      const processingTime = Date.now() - startTime;
      
      console.log(`✅ RAG search completed: ${documents.length} results in ${processingTime}ms`);
      
      return {
        documents,
        query: request.query,
        totalResults: documents.length,
        processingTime
      };
      
    } catch (error) {
      console.error('RAG search failed:', error);
      throw error;
    }
  }

  async generateContextualResponse(query: string, context: string): Promise<string> {
    try {
      // First, search for relevant documents
      const searchResults = await this.search({
        query,
        limit: 5,
        includeContent: true
      });
      
      // Build context from search results
      const ragContext = searchResults.documents
        .map(doc => `Source: ${doc.metadata.title || doc.id}\nContent: ${doc.content}`)
        .join('\n\n');
      
      // Create contextual prompt
      const prompt = `Based on the following context information and conversation history, please provide a helpful response.

Context Information:
${ragContext}

Conversation History:
${context}

Current Question: ${query}

Please provide a comprehensive and accurate response based on the available information.`;

      // This would typically call an AI model
      console.log('🤖 Generating contextual response with RAG');
      
      // Placeholder response - in production, call your AI model
      return `Based on the retrieved information, here's a contextual response to: "${query}". The search found ${searchResults.documents.length} relevant documents that inform this response.`;
      
    } catch (error) {
      console.error('Failed to generate contextual response:', error);
      throw error;
    }
  }

  async updateDocument(id: string, updates: Partial<RAGDocument>): Promise<void> {
    try {
      console.log(`📝 Updating RAG document: ${id}`);
      
      // Get existing document
      const existing = await this.getDocument(id);
      if (!existing) {
        throw new Error(`Document ${id} not found`);
      }
      
      // Merge updates
      const updatedDocument: RAGDocument = {
        ...existing,
        ...updates,
        metadata: {
          ...existing.metadata,
          ...updates.metadata
        }
      };
      
      // Regenerate embedding if content changed
      if (updates.content && updates.content !== existing.content) {
        updatedDocument.embedding = await this.generateEmbedding(updates.content);
      }
      
      // Update in Vectorize
      await this.env.VOICE_EMBEDDINGS.upsert([
        {
          id: updatedDocument.id,
          values: updatedDocument.embedding!,
          metadata: {
            ...updatedDocument.metadata,
            content: updatedDocument.content
          }
        }
      ]);
      
      console.log(`✅ Document ${id} updated in RAG`);
      
    } catch (error) {
      console.error('Failed to update RAG document:', error);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting RAG document: ${id}`);
      
      await this.env.VOICE_EMBEDDINGS.deleteByIds([id]);
      
      console.log(`✅ Document ${id} deleted from RAG`);
      
    } catch (error) {
      console.error('Failed to delete RAG document:', error);
      throw error;
    }
  }

  async getDocument(id: string): Promise<RAGDocument | null> {
    try {
      // Vectorize doesn't have a direct get by ID, so we'll use a search with exact match
      const results = await this.env.VOICE_EMBEDDINGS.query(
        new Array(768).fill(0), // Dummy query vector
        {
          topK: 1,
          returnMetadata: true,
          filter: { id: { $eq: id } }
        }
      );
      
      if (results.matches.length === 0) {
        return null;
      }
      
      const match = results.matches[0];
      return {
        id: match.id,
        content: match.metadata.content,
        metadata: {
          ...match.metadata,
          content: undefined
        },
        embedding: match.values
      };
      
    } catch (error) {
      console.error('Failed to get RAG document:', error);
      return null;
    }
  }

  async listDocuments(options: {
    limit?: number;
    category?: string;
    tags?: string[];
  } = {}): Promise<Array<{ id: string; metadata: any }>> {
    try {
      // Build filter
      const filter: any = {};
      if (options.category) {
        filter.category = { $eq: options.category };
      }
      if (options.tags && options.tags.length > 0) {
        filter.tags = { $in: options.tags };
      }
      
      // Search with dummy vector to get all documents
      const results = await this.env.VOICE_EMBEDDINGS.query(
        new Array(768).fill(0),
        {
          topK: options.limit || 100,
          returnMetadata: true,
          filter: Object.keys(filter).length > 0 ? filter : undefined
        }
      );
      
      return results.matches.map(match => ({
        id: match.id,
        metadata: {
          ...match.metadata,
          content: undefined // Don't include full content in listings
        }
      }));
      
    } catch (error) {
      console.error('Failed to list RAG documents:', error);
      throw error;
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Use Cloudflare Workers AI for embeddings
      const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/@cf/baai/bge-base-en-v1.5', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) {
        throw new Error(`Embedding generation failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data[0];
      
    } catch (error) {
      console.error('Embedding generation failed:', error);
      
      // Fallback: generate dummy embedding
      console.warn('Using dummy embedding for development');
      return new Array(768).fill(0).map(() => Math.random());
    }
  }

  async getStats(): Promise<{
    totalDocuments: number;
    categories: Record<string, number>;
    recentActivity: Array<{ action: string; timestamp: Date }>;
  }> {
    try {
      // Get all documents to compute stats
      const allDocs = await this.listDocuments({ limit: 1000 });
      
      // Count by categories
      const categories: Record<string, number> = {};
      allDocs.forEach(doc => {
        const category = doc.metadata.category || 'uncategorized';
        categories[category] = (categories[category] || 0) + 1;
      });
      
      return {
        totalDocuments: allDocs.length,
        categories,
        recentActivity: [] // Would be populated from activity logs
      };
      
    } catch (error) {
      console.error('Failed to get RAG stats:', error);
      throw error;
    }
  }
}
