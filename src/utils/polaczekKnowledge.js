// Enhanced POLACZEK Assistant with site knowledge
export class PolaczekKnowledgeBase {
  constructor(kvNamespace, d1Database) {
    this.kv = kvNamespace;
    this.db = d1Database;
    this.siteConfig = null;
    this.lastUpdated = null;
  }

  // Load site configuration and structure
  async loadSiteKnowledge() {
    try {
      // Load from KV storage or fallback to default
      const cachedConfig = await this.kv.get('site_knowledge');
      if (cachedConfig) {
        this.siteConfig = JSON.parse(cachedConfig);
        this.lastUpdated = new Date(this.siteConfig.lastUpdated);
      } else {
        // Initialize default knowledge base
        await this.initializeKnowledgeBase();
      }
      return this.siteConfig;
    } catch (error) {
      console.error('Failed to load site knowledge:', error);
      return this.getDefaultKnowledge();
    }
  }

  // Initialize knowledge base with current site structure
  async initializeKnowledgeBase() {
    const defaultKnowledge = {
      site: {
        title: "MyBonzo – Portfolio Karol Lisson",
        description: "Nowoczesne portfolio, design i AI. SYSTEM AGENTS.",
        url: "https://www.mybonzo.com",
        owner: "Karol Lisson",
        email: "LissonKarol.msa@gmail.com"
      },
      services: {
        "AI Image Generator": {
          endpoint: "/api/generate-image",
          description: "Generuje obrazy używając Flux-1 Schnell",
          features: ["Flux AI", "512-1024px", "Tłumaczenie PL"]
        },
        "AI Chatbot": {
          endpoint: "/api/chat", 
          description: "Inteligentny asystent do rozmów",
          models: ["OpenAI GPT", "DeepSeek", "Qwen"]
        },
        "BigQuery Analytics": {
          endpoint: "/api/bigquery",
          description: "Analizuj dane z Google BigQuery"
        },
        "Kaggle Datasets": {
          endpoint: "/api/kaggle", 
          description: "Przeszukuj zbiory danych Kaggle"
        },
        "Tavily AI Search": {
          endpoint: "/api/tavi",
          description: "Zaawansowane wyszukiwanie internetowe powered by AI"
        }
      },
      advanced_functions: [
        "Personalizowane rekomendacje",
        "Automatyzacja obsługi klienta", 
        "Monitorowanie i raportowanie",
        "Harmonogramowanie i przypomnienia",
        "Generator FAQ dynamiczny",
        "Rekomendacje edukacyjne",
        "System ticketów AI",
        "Quizy i testy interaktywne",
        "Generator treści marketingowych"
      ],
      technical_info: {
        framework: "Astro 5.13.5",
        hosting: "Cloudflare Pages",
        deployment_url: "https://b614b2e7.luc-de-zen-on.pages.dev",
        github_repo: "https://github.com/Bonzokoles/luc-de-zen-on",
        workers: {
          "Multi-AI Assistant": "https://multi-ai-assistant.stolarnia-ams.workers.dev",
          "Image Generator": "Generate images using FLUX model",
          "POLACZEK Chat": "Polish AI assistant"
        }
      },
      lastUpdated: new Date().toISOString()
    };

    // Store in KV
    await this.kv.put('site_knowledge', JSON.stringify(defaultKnowledge));
    this.siteConfig = defaultKnowledge;
    return defaultKnowledge;
  }

  // Get contextual response based on user query
  async getContextualResponse(userQuery, model = 'qwen') {
    await this.loadSiteKnowledge();
    
    const queryLower = userQuery.toLowerCase();
    let context = '';
    
    // Check if query is about specific services
    if (queryLower.includes('obraz') || queryLower.includes('generuj') || queryLower.includes('zdjęcie')) {
      context = `Mogę pomóc Ci z generatorem obrazów AI. Używamy modelu Flux-1 Schnell do tworzenia obrazów z tekstu. `;
      context += `Możesz przetestować generator na stronie /image-generator lub użyć API endpoint /api/generate-image.`;
    }
    
    else if (queryLower.includes('bigquery') || queryLower.includes('analiza') || queryLower.includes('dane')) {
      context = `MyBonzo oferuje analizę danych przez BigQuery Analytics na /bigquery-analytics. `;
      context += `Możesz wykonywać zapytania SQL i analizować dane z Google Cloud.`;
    }
    
    else if (queryLower.includes('kaggle') || queryLower.includes('dataset')) {
      context = `Mamy integrację z Kaggle do wyszukiwania zbiorów danych i konkursy ML. `;
      context += `Sprawdź /kaggle-datasets lub użyj API /api/kaggle.`;
    }
    
    else if (queryLower.includes('strona') || queryLower.includes('mybonzo') || queryLower.includes('portfolio')) {
      context = `To jest portfolio Karola Lissona (MyBonzo) - ${this.siteConfig.site.description}. `;
      context += `Strona oferuje zaawansowane funkcje AI i automatyzacji. Kontakt: ${this.siteConfig.site.email}`;
    }
    
    else if (queryLower.includes('api') || queryLower.includes('endpoint')) {
      const services = Object.entries(this.siteConfig.services)
        .map(([name, info]) => `${name}: ${info.endpoint}`)
        .join(', ');
      context = `Dostępne API endpoints: ${services}`;
    }
    
    return context;
  }

  // Update knowledge base with new information
  async updateKnowledge(key, data) {
    await this.loadSiteKnowledge();
    this.siteConfig[key] = { ...this.siteConfig[key], ...data };
    this.siteConfig.lastUpdated = new Date().toISOString();
    
    await this.kv.put('site_knowledge', JSON.stringify(this.siteConfig));
    return true;
  }

  // Get default knowledge for fallback
  getDefaultKnowledge() {
    return {
      site: {
        title: "MyBonzo AI Platform",
        description: "Platforma AI z zaawansowanymi funkcjami automatyzacji"
      }
    };
  }
}