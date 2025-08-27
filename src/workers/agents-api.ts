/**
 * Extended Cloudflare Workers API for Agent Management
 * Includes predefined agents from ZENON AI System
 */

export interface Env {
  AI_AGENTS: KVNamespace;
  AI: any;
}

export interface Agent {
  id: string;
  name: string;
  model: string;
  description: string;
  systemPrompt?: string;
  category?: string;
  specializations?: string[];
  config: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    enabledFeatures?: string[];
    customInstructions?: string;
    port?: number;
    language?: string;
    capabilities?: string[];
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDefault?: boolean;
  authorInfo?: {
    creator: string;
    version: string;
    lastModified: string;
  };
}

// Predefined ZENON AI System Agents
const ZENON_AGENTS: Partial<Agent>[] = [
  {
    id: "polaczek_a1_monitor",
    name: "POLACZEK_A1 - Analytics & Monitoring Agent",
    model: "gpt-4",
    description: "Agent monitorujący system i alarmujący o problemach. Oferuje monitoring CPU, pamięci, dysku, sieci oraz wykrywanie anomalii w czasie rzeczywistym.",
    category: "System Monitoring",
    specializations: [
      "System monitoring (CPU, Memory, Disk, Network)",
      "Process analysis i anomaly detection", 
      "Real-time alerts i notifications",
      "Resource optimization recommendations",
      "Performance tracking i reporting"
    ],
    systemPrompt: "Jesteś ekspertem od monitorowania systemów. Analizujesz metryki systemu, wykrywasz anomalie i dostarczasz rekomendacje optymalizacyjne. Komunikujesz się jasno i precyzyjnie, skupiając się na praktycznych rozwiązaniach problemów wydajnościowych.",
    config: {
      temperature: 0.3,
      maxTokens: 2000,
      port: 3001,
      language: "python",
      capabilities: ["system_monitoring", "anomaly_detection", "performance_analysis", "alerting"],
      enabledFeatures: ["real_time_monitoring", "resource_tracking", "alert_system"]
    },
    isDefault: true,
    authorInfo: {
      creator: "Jimbo (ZENON AI Coordinator)",
      version: "1.0",
      lastModified: "2025-06-08"
    }
  },
  {
    id: "polaczek_art_ai_discovery",
    name: "POLACZEK_ART - AI Art Discovery Agent",
    model: "gpt-4",
    description: "Agent specjalizujący się w odkrywaniu i analizie plików artystycznych z wykorzystaniem AI. Skanuje katalogi, analizuje style i kategoryzuje dzieła sztuki.",
    category: "Art Analysis",
    specializations: [
      "AI-powered art file discovery",
      "Style analysis and categorization",
      "Metadata extraction from art files",
      "Art collection management",
      "Visual content analysis"
    ],
    systemPrompt: "Jesteś ekspertem od analizy sztuki i AI. Specjalizujesz się w rozpoznawaniu stylów artystycznych, kategoryzacji dzieł sztuki oraz ekstrakcji metadanych z plików graficznych. Dostarczasz szczegółowe analizy wizualne i rekomendacje kuratorskie.",
    config: {
      temperature: 0.7,
      maxTokens: 1500,
      port: 3002,
      language: "python",
      capabilities: ["image_analysis", "style_recognition", "metadata_extraction", "file_discovery"],
      enabledFeatures: ["ai_art_analysis", "batch_processing", "style_classification"]
    },
    authorInfo: {
      creator: "ZENON AI System",
      version: "1.0",
      lastModified: "2025-06-07"
    }
  },
  {
    id: "polaczek_art_discovery",
    name: "POLACZEK_ART - Art Discovery Agent",
    model: "gpt-3.5-turbo",
    description: "Agent do odkrywania i katalogowania plików artystycznych. Skanuje systemy plików w poszukiwaniu dzieł sztuki i tworzy uporządkowane kolekcje.",
    category: "File Discovery",
    specializations: [
      "Art file discovery and cataloging",
      "File system scanning",
      "Collection organization",
      "Format recognition",
      "Directory structure analysis"
    ],
    systemPrompt: "Jesteś specjalistą od organizacji i katalogowania dzieł sztuki. Twoja rola to systematyczne odkrywanie, kategoryzowanie i organizowanie plików artystycznych w spójne kolekcje.",
    config: {
      temperature: 0.5,
      maxTokens: 1200,
      port: 3003,
      language: "python",
      capabilities: ["file_scanning", "format_recognition", "collection_management"],
      enabledFeatures: ["recursive_search", "format_filtering", "metadata_storage"]
    },
    authorInfo: {
      creator: "ZENON AI System",
      version: "1.0", 
      lastModified: "2025-06-07"
    }
  },
  {
    id: "polaczek_d_dashboard",
    name: "POLACZEK_D - Dashboard Agent",
    model: "gpt-4",
    description: "Agent zarządzający dashboardem i interfejsem użytkownika systemu ZENON. Wyświetla metryki, raporty i statusy innych agentów.",
    category: "Interface Management",
    specializations: [
      "Dashboard management",
      "UI/UX coordination",
      "Metrics visualization",
      "Real-time status display",
      "Agent coordination interface"
    ],
    systemPrompt: "Jesteś menedżerem interfejsu użytkownika i dashboardu. Koordynujesz wyświetlanie informacji z różnych agentów, tworzysz przejrzyste wizualizacje danych i zarządzasz interakcjami użytkownika z systemem.",
    config: {
      temperature: 0.4,
      maxTokens: 1800,
      port: 3004,
      language: "python",
      capabilities: ["dashboard_management", "data_visualization", "ui_coordination"],
      enabledFeatures: ["real_time_updates", "multi_agent_display", "interactive_interface"]
    },
    authorInfo: {
      creator: "ZENON AI System",
      version: "1.0",
      lastModified: "2025-06-08"
    }
  },
  {
    id: "polaczek_s1_fixed",
    name: "POLACZEK_S1 - Search Agent (Fixed)",
    model: "gpt-4",
    description: "Ulepszony agent wyszukiwania z poprawkami błędów. Oferuje zaawansowane funkcje wyszukiwania i filtrowania danych.",
    category: "Search & Discovery",
    specializations: [
      "Advanced search algorithms",
      "Data filtering and sorting",
      "Query optimization",
      "Result ranking",
      "Search performance tuning"
    ],
    systemPrompt: "Jesteś ekspertem od systemów wyszukiwania i odzyskiwania informacji. Specjalizujesz się w optymalizacji zapytań, rankingu wyników oraz dostarczaniu najrelewantniejszych informacji dla użytkowników.",
    config: {
      temperature: 0.6,
      maxTokens: 1600,
      port: 3005,
      language: "python",
      capabilities: ["advanced_search", "query_optimization", "result_ranking"],
      enabledFeatures: ["fuzzy_search", "semantic_search", "real_time_indexing"]
    },
    authorInfo: {
      creator: "ZENON AI System",
      version: "2.0 (Fixed)",
      lastModified: "2025-06-08"
    }
  },
  {
    id: "polaczek_s1_movie_api",
    name: "POLACZEK_S1 - Movie API Agent",
    model: "gpt-3.5-turbo",
    description: "Agent specjalizujący się w pracy z API filmowymi. Wyszukuje informacje o filmach, serialach i treściach multimedialnych.",
    category: "Media API",
    specializations: [
      "Movie database integration",
      "API data processing",
      "Media content search",
      "Metadata enrichment",
      "Recommendation systems"
    ],
    systemPrompt: "Jesteś specjalistą od baz danych filmowych i API mediów. Pomagasz w wyszukiwaniu informacji o filmach, serialach i innych treściach multimedialnych, oraz dostarczasz rekomendacje oparte na preferencjach użytkowników.",
    config: {
      temperature: 0.7,
      maxTokens: 1400,
      port: 3006,
      language: "python",
      capabilities: ["movie_api_integration", "media_search", "recommendation_engine"],
      enabledFeatures: ["tmdb_integration", "content_filtering", "personalized_recommendations"]
    },
    authorInfo: {
      creator: "ZENON AI System",
      version: "1.0",
      lastModified: "2025-06-08"
    }
  },
  {
    id: "polaczek_s1_searcher",
    name: "POLACZEK_S1 - Advanced Searcher Agent",
    model: "gpt-4",
    description: "Zaawansowany agent wyszukiwania z możliwościami semantycznymi i kontekstowymi. Oferuje inteligentne wyszukiwanie w różnych źródłach danych.",
    category: "Intelligent Search",
    specializations: [
      "Semantic search capabilities",
      "Multi-source data integration",
      "Context-aware searching",
      "Natural language queries",
      "Advanced filtering and ranking"
    ],
    systemPrompt: "Jesteś zaawansowanym systemem wyszukiwania z możliwościami semantycznymi. Rozumiesz kontekst zapytań w języku naturalnym i dostarczasz najbardziej relevantne wyniki z różnych źródeł danych.",
    config: {
      temperature: 0.5,
      maxTokens: 2000,
      port: 3007,
      language: "python",
      capabilities: ["semantic_search", "multi_source_integration", "nlp_processing"],
      enabledFeatures: ["context_awareness", "intelligent_ranking", "cross_reference_search"]
    },
    authorInfo: {
      creator: "ZENON AI System",
      version: "1.0",
      lastModified: "2025-06-08"
    }
  },
  {
    id: "polaczek_t1_translator",
    name: "POLACZEK_T1 - Translation & Cultural Content Agent",
    model: "gpt-4",
    description: "Agent specjalizujący się w tłumaczeniach i adaptacji kulturowej treści. Zachowuje osobisty styl głosu i zapewnia konsystencję stylistyczną między językami.",
    category: "Translation & Localization",
    specializations: [
      "Personal content translation",
      "Cultural adaptation of text",
      "Style consistency across languages", 
      "Personal voice preservation",
      "Biographical content processing"
    ],
    systemPrompt: "Jesteś ekspertem od tłumaczeń i adaptacji kulturowej. Specjalizujesz się w zachowaniu osobistego stylu i głosu autora podczas tłumaczenia, szczególnie w przypadku treści biograficznych i osobistych recenzji.",
    config: {
      temperature: 0.6,
      maxTokens: 1800,
      port: 3008,
      language: "python",
      capabilities: ["translation", "cultural_adaptation", "style_preservation"],
      enabledFeatures: ["personal_voice_analysis", "cultural_context_awareness", "style_consistency_check"]
    },
    authorInfo: {
      creator: "ZENON AI System",
      version: "1.0",
      lastModified: "2025-06-07"
    }
  }
];

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET /api/agents/initialize - Initialize with ZENON agents
      if (request.method === 'GET' && path === '/api/agents/initialize') {
        const existingAgentsData = await env.AI_AGENTS.get('agents_list');
        let agents: Agent[] = existingAgentsData ? JSON.parse(existingAgentsData) : [];

        // Add ZENON agents if they don't exist
        for (const zenonAgent of ZENON_AGENTS) {
          const exists = agents.find(a => a.id === zenonAgent.id);
          if (!exists) {
            const fullAgent: Agent = {
              ...zenonAgent,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: true
            } as Agent;

            agents.push(fullAgent);
            await env.AI_AGENTS.put(`agent_${zenonAgent.id}`, JSON.stringify(fullAgent));
          }
        }

        await env.AI_AGENTS.put('agents_list', JSON.stringify(agents));

        return new Response(JSON.stringify({
          message: 'ZENON agents initialized successfully',
          count: ZENON_AGENTS.length,
          agents: agents.filter(a => a.isDefault)
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // GET /api/agents - Lista wszystkich agentów
      if (request.method === 'GET' && path === '/api/agents') {
        const agentsData = await env.AI_AGENTS.get('agents_list');
        const agents: Agent[] = agentsData ? JSON.parse(agentsData) : [];
        
        // Group by category
        const categorizedAgents = agents.reduce((acc, agent) => {
          const category = agent.category || 'Other';
          if (!acc[category]) acc[category] = [];
          acc[category].push(agent);
          return acc;
        }, {} as Record<string, Agent[]>);
        
        return new Response(JSON.stringify({
          agents,
          categorized: categorizedAgents,
          total: agents.length
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // GET /api/agents/:id - Pobierz konkretnego agenta
      if (request.method === 'GET' && path.startsWith('/api/agents/')) {
        const agentId = path.split('/').pop();
        if (!agentId) {
          return new Response(JSON.stringify({ error: 'Agent ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const agentData = await env.AI_AGENTS.get(`agent_${agentId}`);
        if (!agentData) {
          return new Response(JSON.stringify({ error: 'Agent not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(agentData, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // POST /api/agents - Tworzenie nowego agenta
      if (request.method === 'POST' && path === '/api/agents') {
        const agentData = await request.json() as Partial<Agent>;
        
        // Walidacja danych
        if (!agentData.name || !agentData.model || !agentData.description) {
          return new Response(JSON.stringify({ 
            error: 'Name, model, and description are required' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Generowanie ID
        const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const newAgent: Agent = {
          id: agentId,
          name: agentData.name,
          model: agentData.model,
          description: agentData.description,
          category: agentData.category || 'Custom',
          specializations: agentData.specializations || [],
          systemPrompt: agentData.systemPrompt || '',
          config: {
            temperature: agentData.config?.temperature || 0.7,
            maxTokens: agentData.config?.maxTokens || 1000,
            topP: agentData.config?.topP || 1,
            frequencyPenalty: agentData.config?.frequencyPenalty || 0,
            presencePenalty: agentData.config?.presencePenalty || 0,
            enabledFeatures: agentData.config?.enabledFeatures || [],
            customInstructions: agentData.config?.customInstructions || '',
            capabilities: agentData.config?.capabilities || [],
            language: agentData.config?.language || 'javascript',
            ...agentData.config
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: agentData.isActive !== undefined ? agentData.isActive : true,
          isDefault: false,
          authorInfo: agentData.authorInfo || {
            creator: 'User',
            version: '1.0',
            lastModified: new Date().toISOString()
          }
        };

        // Zapisz agenta
        await env.AI_AGENTS.put(`agent_${agentId}`, JSON.stringify(newAgent));

        // Aktualizuj listę agentów
        const agentsData = await env.AI_AGENTS.get('agents_list');
        const agents: Agent[] = agentsData ? JSON.parse(agentsData) : [];
        agents.push(newAgent);
        await env.AI_AGENTS.put('agents_list', JSON.stringify(agents));

        return new Response(JSON.stringify(newAgent), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // PUT /api/agents/:id - Edycja agenta
      if (request.method === 'PUT' && path.startsWith('/api/agents/')) {
        const agentId = path.split('/').pop();
        if (!agentId) {
          return new Response(JSON.stringify({ error: 'Agent ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const updateData = await request.json() as Partial<Agent>;
        
        // Pobierz istniejącego agenta
        const existingAgentData = await env.AI_AGENTS.get(`agent_${agentId}`);
        if (!existingAgentData) {
          return new Response(JSON.stringify({ error: 'Agent not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const existingAgent: Agent = JSON.parse(existingAgentData);
        
        // Aktualizuj agenta
        const updatedAgent: Agent = {
          ...existingAgent,
          ...updateData,
          id: existingAgent.id, // ID nie może być zmienione
          createdAt: existingAgent.createdAt, // Data utworzenia nie może być zmieniona
          updatedAt: new Date().toISOString(),
          config: {
            ...existingAgent.config,
            ...updateData.config
          },
          authorInfo: {
            ...existingAgent.authorInfo,
            ...updateData.authorInfo,
            lastModified: new Date().toISOString()
          }
        };

        // Zapisz zaktualizowanego agenta
        await env.AI_AGENTS.put(`agent_${agentId}`, JSON.stringify(updatedAgent));

        // Aktualizuj listę agentów
        const agentsData = await env.AI_AGENTS.get('agents_list');
        const agents: Agent[] = agentsData ? JSON.parse(agentsData) : [];
        const agentIndex = agents.findIndex(a => a.id === agentId);
        if (agentIndex !== -1) {
          agents[agentIndex] = updatedAgent;
          await env.AI_AGENTS.put('agents_list', JSON.stringify(agents));
        }

        return new Response(JSON.stringify(updatedAgent), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // DELETE /api/agents/:id - Usuwanie agenta
      if (request.method === 'DELETE' && path.startsWith('/api/agents/')) {
        const agentId = path.split('/').pop();
        if (!agentId) {
          return new Response(JSON.stringify({ error: 'Agent ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Sprawdź czy agent istnieje
        const existingAgentData = await env.AI_AGENTS.get(`agent_${agentId}`);
        if (!existingAgentData) {
          return new Response(JSON.stringify({ error: 'Agent not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const agent: Agent = JSON.parse(existingAgentData);
        
        // Nie pozwalaj na usunięcie domyślnych agentów ZENON
        if (agent.isDefault) {
          return new Response(JSON.stringify({ 
            error: 'Cannot delete default ZENON system agents' 
          }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Usuń agenta
        await env.AI_AGENTS.delete(`agent_${agentId}`);

        // Aktualizuj listę agentów
        const agentsData = await env.AI_AGENTS.get('agents_list');
        const agents: Agent[] = agentsData ? JSON.parse(agentsData) : [];
        const filteredAgents = agents.filter(a => a.id !== agentId);
        await env.AI_AGENTS.put('agents_list', JSON.stringify(filteredAgents));

        return new Response(JSON.stringify({ message: 'Agent deleted successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};
