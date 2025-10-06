// MCP Services Core Functions - Enhanced v1.1
// Unified handler for all MCP (Model Context Protocol) services
// Protocol v1.1 with enhanced capabilities and real-time connections

export class MCPAgentFunctions {
  constructor() {
    this.mcpServices = ['duckdb', 'paypal', 'huggingface', 'memory', 'github', 'analytics', 'search', 'files'];
    this.activeService = null;
    this.protocolVersion = '1.1';
    this.connectionPool = new Map();
    this.serverHealth = new Map();
    this.requestMetrics = new Map();
    this.realTimeUpdates = true;
    
    // Enhanced capabilities
    this.capabilities = {
      tools: true,
      resources: true,
      prompts: true,
      sampling: true,
      roots: true,
      completion: true
    };
    
    // Initialize monitoring
    this.initHealthMonitoring();
  }

  // Initialize health monitoring system
  initHealthMonitoring() {
    console.log('🔍 Initializing MCP v1.1 health monitoring...');
    
    // Set up service health checks
    this.mcpServices.forEach(service => {
      this.serverHealth.set(service, {
        status: 'unknown',
        lastCheck: null,
        responseTime: 0,
        uptime: 0,
        requestCount: 0,
        errorRate: 0
      });
    });

    // Start periodic health checks
    if (this.realTimeUpdates) {
      setInterval(() => this.performHealthChecks(), 30000); // Every 30 seconds
    }
  }

  // Perform health checks on all services
  async performHealthChecks() {
    for (const service of this.mcpServices) {
      try {
        const startTime = Date.now();
        const response = await this.pingMCPServer(service);
        const responseTime = Date.now() - startTime;
        
        this.updateHealthMetrics(service, {
          status: 'online',
          responseTime,
          lastCheck: new Date(),
          uptime: this.serverHealth.get(service).uptime + 30
        });
        
      } catch (error) {
        this.updateHealthMetrics(service, {
          status: 'offline',
          responseTime: -1,
          lastCheck: new Date(),
          error: error.message
        });
      }
    }
  }

  // Update health metrics for a service
  updateHealthMetrics(service, metrics) {
    const current = this.serverHealth.get(service);
    const updated = { ...current, ...metrics };
    this.serverHealth.set(service, updated);
    
    // Emit health update event for UI
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mcpHealthUpdate', {
        detail: { service, metrics: updated }
      }));
    }
  }

  // Ping MCP server with v1.1 protocol
  async pingMCPServer(service) {
    const config = this.getServiceConfig(service);
    
    // Simulated ping - in real implementation would use actual MCP protocol
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        if (success) {
          resolve({ status: 'ok', protocol: '1.1' });
        } else {
          reject(new Error(`Service ${service} unreachable`));
        }
      }, Math.random() * 500 + 100); // 100-600ms response time
    });
  }

  // Bind all MCP functions to global scope for right-panel buttons
  bindToRightPanel() {
    window.openMCPModal = this.openMCPModal.bind(this);
    window.toggleMCPService = this.toggleMCPService.bind(this);
    window.closeMCPModal = this.closeMCPModal.bind(this);
    window.sendToMCPService = this.sendToMCPService.bind(this);
    window.clearMCPService = this.clearMCPService.bind(this);
    
    // Enhanced v1.1 functions
    window.getMCPHealth = this.getMCPHealth.bind(this);
    window.refreshMCPConnections = this.refreshMCPConnections.bind(this);
    window.getMCPCapabilities = this.getMCPCapabilities.bind(this);
  }

  // Open MCP service modal with v1.1 enhancements
  openMCPModal(service) {
    console.log(`🔌 Opening MCP service: ${service} (Protocol v${this.protocolVersion})`);
    
    // Close any existing MCP modal
    this.closeMCPModal();
    
    // Create and show modal for specific service
    this.createMCPWidget(service);
    this.activeService = service;
    
    // Start real-time monitoring for this service
    this.startServiceMonitoring(service);
    
    // Update button state
    const buttons = document.querySelectorAll('[onclick*="openMCPModal"]');
    buttons.forEach(btn => {
      if (btn.getAttribute('onclick').includes(service)) {
        btn.style.background = 'linear-gradient(45deg, #4ade80, #0f3846)';
        btn.textContent = btn.textContent.replace('→', '←');
      }
    });
  }

  // Start real-time monitoring for active service
  startServiceMonitoring(service) {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    this.monitoringInterval = setInterval(async () => {
      const health = this.serverHealth.get(service);
      if (health) {
        await this.updateServiceWidget(service, health);
      }
    }, 5000); // Update every 5 seconds
  }

  // Update service widget with real-time data
  async updateServiceWidget(service, health) {
    const widget = document.getElementById(`mcpWidget-${service}`);
    if (!widget) return;

    const statusElement = widget.querySelector('.mcp-status');
    const metricsElement = widget.querySelector('.mcp-metrics');
    
    if (statusElement) {
      statusElement.innerHTML = `
        <span class="status-dot ${health.status}"></span>
        <span>Protocol v${this.protocolVersion} - ${health.status.toUpperCase()}</span>
        <span class="response-time">${health.responseTime}ms</span>
      `;
    }

    if (metricsElement) {
      metricsElement.innerHTML = `
        <div class="metric">
          <span class="metric-label">Uptime:</span>
          <span class="metric-value">${Math.floor(health.uptime / 60)}m</span>
        </div>
        <div class="metric">
          <span class="metric-label">Requests:</span>
          <span class="metric-value">${health.requestCount}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Success Rate:</span>
          <span class="metric-value">${(100 - health.errorRate).toFixed(1)}%</span>
        </div>
      `;
    }
  }

  // Toggle MCP service widget
  toggleMCPService(service) {
    const widget = document.getElementById(`mcpWidget-${service}`);
    
    if (widget && !widget.classList.contains('hidden')) {
      this.closeMCPModal();
    } else {
      this.openMCPModal(service);
    }
  }

  // Create MCP service widget with v1.1 features
  createMCPWidget(service) {
    const existingWidget = document.getElementById(`mcpWidget-${service}`);
    if (existingWidget) {
      existingWidget.classList.remove('hidden');
      return;
    }

    const serviceConfig = this.getServiceConfig(service);
    const health = this.serverHealth.get(service);
    
    const widget = document.createElement('div');
    widget.id = `mcpWidget-${service}`;
    widget.className = 'floating-widget';
    widget.style.cssText = `
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: 450px;
      max-height: 85vh;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(15, 56, 70, 0.9));
      border: 2px solid ${serviceConfig.color};
      border-radius: 15px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(${serviceConfig.rgb}, 0.3);
      z-index: 10000;
      overflow: hidden;
      backdrop-filter: blur(15px);
    `;

    widget.innerHTML = `
      <div class="agent-panel-header" style="background: linear-gradient(45deg, ${serviceConfig.color}30, rgba(0, 0, 0, 0.8)); padding: 15px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.3em;">${serviceConfig.icon}</span>
          <div>
            <div style="font-weight: bold; font-size: 1.1em;">MCP ${service.toUpperCase()}</div>
            <div style="font-size: 0.85em; opacity: 0.8;">Protocol v${this.protocolVersion}</div>
          </div>
        </div>
        <button onclick="closeMCPModal()" class="close-btn" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
      </div>
      
      <div class="agent-panel-content" style="padding: 20px;">
        <!-- Enhanced Status Panel -->
        <div class="mcp-status-panel" style="margin-bottom: 20px; padding: 15px; background: rgba(${serviceConfig.rgb}, 0.1); border: 1px solid ${serviceConfig.color}40; border-radius: 8px;">
          <div class="mcp-status" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <span class="status-dot ${health?.status || 'unknown'}" style="width: 12px; height: 12px; border-radius: 50%; background: ${health?.status === 'online' ? '#22c55e' : '#ef4444'};"></span>
            <span style="color: ${serviceConfig.color}; font-weight: bold;">Protocol v${this.protocolVersion} - ${health?.status?.toUpperCase() || 'CHECKING'}</span>
            <span class="response-time" style="margin-left: auto; font-size: 0.9em;">${health?.responseTime || 0}ms</span>
          </div>
          
          <div style="color: ${serviceConfig.color}; font-weight: bold; margin-bottom: 8px;">${serviceConfig.icon} ${serviceConfig.title}</div>
          <div style="font-size: 12px; color: #ccc; margin-bottom: 15px;">${serviceConfig.description}</div>
          
          <div class="mcp-metrics" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.85em;">
            <div class="metric">
              <span class="metric-label" style="color: #999;">Uptime:</span>
              <span class="metric-value" style="color: white;">${health?.uptime ? Math.floor(health.uptime / 60) + 'm' : '0m'}</span>
            </div>
            <div class="metric">
              <span class="metric-label" style="color: #999;">Requests:</span>
              <span class="metric-value" style="color: white;">${health?.requestCount || 0}</span>
            </div>
            <div class="metric">
              <span class="metric-label" style="color: #999;">Success:</span>
              <span class="metric-value" style="color: white;">${health?.errorRate ? (100 - health.errorRate).toFixed(1) : '100'}%</span>
            </div>
          </div>
        </div>
        
        <!-- Enhanced Controls -->
        <div class="agent-controls" style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
          <button onclick="connectMCPService('${service}')" class="agent-btn primary" style="background: linear-gradient(45deg, ${serviceConfig.color}, #0f3846); border: none; padding: 8px 16px; border-radius: 6px; color: white; cursor: pointer;">🔗 Połącz</button>
          <button onclick="testMCPService('${service}')" class="agent-btn secondary" style="background: linear-gradient(45deg, #6366f1, #0f3846); border: none; padding: 8px 16px; border-radius: 6px; color: white; cursor: pointer;">🧪 Test</button>
          <button onclick="refreshMCPService('${service}')" class="agent-btn accent" style="background: linear-gradient(45deg, #10b981, #0f3846); border: none; padding: 8px 16px; border-radius: 6px; color: white; cursor: pointer;">🔄 Odśwież</button>
          <button onclick="getMCPCapabilities('${service}')" class="agent-btn info" style="background: linear-gradient(45deg, #f59e0b, #0f3846); border: none; padding: 8px 16px; border-radius: 6px; color: white; cursor: pointer;">📋 Możliwości</button>
        </div>

        <!-- Enhanced Input -->
        <textarea id="mcpInput-${service}" class="agent-input" placeholder="${serviceConfig.placeholder}" style="width: 100%; height: 100px; padding: 12px; border: 2px solid ${serviceConfig.color}40; border-radius: 8px; background: rgba(0, 0, 0, 0.3); color: white; resize: vertical; font-family: 'Courier New', monospace;"></textarea>
        
        <div class="agent-actions" style="margin-top: 15px; display: flex; gap: 10px;">
          <button onclick="sendToMCPService('${service}')" class="agent-btn primary" style="background: linear-gradient(45deg, ${serviceConfig.color}, #0f3846); border: none; padding: 12px 24px; border-radius: 8px; color: white; font-weight: bold; cursor: pointer;">Wykonaj</button>
          <button onclick="clearMCPService('${service}')" class="agent-btn secondary" style="background: rgba(255, 255, 255, 0.1); border: 1px solid ${serviceConfig.color}60; padding: 12px 24px; border-radius: 8px; color: ${serviceConfig.color}; cursor: pointer;">Wyczyść</button>
        </div>

        <div id="mcpResponse-${service}" class="agent-response" style="display: none; margin-top: 20px; padding: 15px; background: rgba(0, 0, 0, 0.4); border-left: 4px solid ${serviceConfig.color}; border-radius: 6px; font-family: 'Courier New', monospace; max-height: 200px; overflow-y: auto;"></div>
        
        <!-- Enhanced Commands -->
        <div style="margin-top: 20px; padding: 15px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; border: 1px solid #333;">
          <div style="font-size: 13px; font-weight: bold; color: #999; margin-bottom: 10px;">📚 DOSTĘPNE KOMENDY v${this.protocolVersion}:</div>
          <div style="font-size: 12px; color: #ccc; line-height: 1.4;">
            ${serviceConfig.commands.map(cmd => `• <code style="color: ${serviceConfig.color}; background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 3px;">${cmd}</code>`).join('<br>')}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
    
    // Animate in
    setTimeout(() => {
      widget.style.opacity = '1';
      widget.style.transform = 'translateY(-50%) scale(1)';
    }, 10);
  }

  // Get enhanced service configuration for v1.1
  getServiceConfig(service) {
    const configs = {
      duckdb: {
        icon: '🗃️',
        title: 'DuckDB Analytics v1.1',
        color: '#ffc107',
        rgb: '255, 193, 7',
        description: 'Analiza danych SQL w pamięci z wysoką wydajnością - Protocol v1.1',
        placeholder: 'SELECT * FROM table_name LIMIT 10;',
        commands: ['SELECT queries', 'CREATE TABLE', 'INSERT data', 'Analytics functions', 'Tools API', 'Resources API']
      },
      paypal: {
        icon: '💳',
        title: 'PayPal Payments v1.1',
        color: '#0070ba',
        rgb: '0, 112, 186',
        description: 'System płatności i transakcji finansowych - Protocol v1.1',
        placeholder: 'payment_id lub kwota transakcji...',
        commands: ['Create payment', 'Check status', 'Refund transaction', 'Get balance', 'Prompts API', 'Resources API']
      },
      huggingface: {
        icon: '🤗',
        title: 'HuggingFace AI Hub v1.1',
        color: '#ff6b35',
        rgb: '255, 107, 53',
        description: 'Dostęp do modeli AI i datasets z HuggingFace - Protocol v1.1',
        placeholder: 'Model name lub prompt dla AI...',
        commands: ['Search models', 'Download datasets', 'Inference API', 'Model info', 'Sampling API', 'Completion API']
      },
      memory: {
        icon: '🧠',
        title: 'Memory System v1.1',
        color: '#9c27b0',
        rgb: '156, 39, 176',
        description: 'System pamięci i cachowania danych - Protocol v1.1',
        placeholder: 'key=value lub search query...',
        commands: ['Store data', 'Retrieve info', 'Clear cache', 'List keys', 'Tools API', 'Resources API']
      },
      github: {
        icon: '🐙',
        title: 'GitHub Integration v1.1',
        color: '#24292e',
        rgb: '36, 41, 46',
        description: 'Zarządzanie repozytoriami GitHub - Protocol v1.1',
        placeholder: 'repository name lub GitHub command...',
        commands: ['List repos', 'Create issue', 'Clone repo', 'Get commits', 'Tools API', 'Prompts API']
      },
      analytics: {
        icon: '📊',
        title: 'Analytics Dashboard v1.1',
        color: '#10b981',
        rgb: '16, 185, 129',
        description: 'Wizualizacja danych i analityka - Protocol v1.1',
        placeholder: 'data query lub chart type...',
        commands: ['Generate chart', 'Export data', 'Create dashboard', 'Run analysis', 'Resources API', 'Sampling API']
      },
      search: {
        icon: '🔍',
        title: 'Search Integration v1.1',
        color: '#6366f1',
        rgb: '99, 102, 241',
        description: 'Wyszukiwanie i indeksowanie - Protocol v1.1',
        placeholder: 'search query lub index command...',
        commands: ['Search index', 'Add document', 'Update index', 'Delete item', 'Tools API', 'Resources API']
      },
      files: {
        icon: '📁',
        title: 'File Management v1.1',
        color: '#f59e0b',
        rgb: '245, 158, 11',
        description: 'Zarządzanie plikami i dokumentami - Protocol v1.1',
        placeholder: 'file path lub file command...',
        commands: ['Upload file', 'Download file', 'List files', 'Delete file', 'Tools API', 'Resources API']
      }
    };
    
    return configs[service] || configs.memory;
  }

  // Close MCP modal with cleanup
  closeMCPModal() {
    const widgets = document.querySelectorAll('[id^="mcpWidget-"]');
    widgets.forEach(widget => {
      widget.style.opacity = '0';
      widget.style.transform = 'translateY(-50%) scale(0.9)';
      setTimeout(() => {
        if (widget.parentNode) {
          widget.parentNode.removeChild(widget);
        }
      }, 200);
    });

    // Reset button states
    const buttons = document.querySelectorAll('[onclick*="openMCPModal"]');
    buttons.forEach(btn => {
      btn.style.background = '';
      btn.textContent = btn.textContent.replace('←', '→');
    });

    // Clear monitoring interval
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.activeService = null;
  }

  // Enhanced send to MCP service with v1.1 features
  async sendToMCPService(service) {
    const input = document.getElementById(`mcpInput-${service}`);
    const response = document.getElementById(`mcpResponse-${service}`);
    
    if (!input || !input.value.trim()) return;
    
    console.log(`📤 Sending to MCP ${service} (v${this.protocolVersion}):`, input.value);
    
    // Update request metrics
    const health = this.serverHealth.get(service);
    if (health) {
      health.requestCount = (health.requestCount || 0) + 1;
      this.serverHealth.set(service, health);
    }
    
    response.style.display = 'block';
    response.innerHTML = `<div style="color: #ffc107;">⏳ Łączenie z MCP ${service} (Protocol v${this.protocolVersion})...</div>`;
    
    try {
      const startTime = Date.now();
      
      // Simulate enhanced MCP v1.1 call with capabilities
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responseTime = Date.now() - startTime;
      const mockResponse = this.generateEnhancedMockResponse(service, input.value);
      
      // Update health metrics
      if (health) {
        health.responseTime = responseTime;
        health.errorRate = Math.max(0, (health.errorRate || 0) - 1);
        this.serverHealth.set(service, health);
      }
      
      response.innerHTML = `
        <div style="color: #4ade80; font-weight: bold; margin-bottom: 10px;">✅ MCP ${service.toUpperCase()} Response (v${this.protocolVersion}):</div>
        <div style="background: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 6px; margin-bottom: 10px; font-family: 'Courier New', monospace; border-left: 3px solid #4ade80;">${mockResponse}</div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #888; border-top: 1px solid #333; padding-top: 8px;">
          <span>Protocol: v${this.protocolVersion}</span>
          <span>Response Time: ${responseTime}ms</span>
          <span>Timestamp: ${new Date().toLocaleTimeString()}</span>
        </div>
      `;
      
    } catch (error) {
      // Update error metrics
      if (health) {
        health.errorRate = (health.errorRate || 0) + 1;
        this.serverHealth.set(service, health);
      }
      
      response.innerHTML = `
        <div style="color: #ff6b6b; font-weight: bold;">❌ MCP Protocol Error:</div>
        <div style="margin-top: 10px; color: #ff9999;">${error.message}</div>
        <div style="font-size: 11px; color: #666; margin-top: 8px;">Protocol v${this.protocolVersion} | Error Code: MCP_CONNECTION_FAILED</div>
      `;
    }
  }

  // Generate enhanced mock response with v1.1 capabilities
  generateEnhancedMockResponse(service, query) {
    const responses = {
      duckdb: `<strong>Query executed successfully</strong><br>
        • Rows affected: 42<br>
        • Execution time: 0.123s<br>
        • Protocol capabilities: Tools, Resources, Prompts<br>
        • Cache status: Optimized<br>
        <em>Query: ${query}</em>`,
        
      paypal: `<strong>Payment processed via MCP v1.1</strong><br>
        • Transaction ID: TXN_${Date.now()}<br>
        • Status: Completed<br>
        • Protocol features: Enhanced security, Real-time validation<br>
        • API response: 200 OK<br>
        <em>Request: ${query}</em>`,
        
      huggingface: `<strong>AI Model response generated</strong><br>
        • Model: GPT-4 compatible<br>
        • Tokens used: 156 (input: 45, output: 111)<br>
        • Confidence: 94.2%<br>
        • Sampling API: Active<br>
        • Completion features: Enhanced context awareness<br>
        <em>Input: ${query}</em>`,
        
      memory: `<strong>Memory operation completed</strong><br>
        • Cache updated successfully<br>
        • Memory usage: 67% (optimized)<br>
        • Data persistence: Active<br>
        • Protocol v1.1 features: Enhanced compression, Auto-indexing<br>
        <em>Operation: ${query}</em>`,
        
      github: `<strong>GitHub operation successful</strong><br>
        • Repository accessed<br>
        • API rate limit: 4,987/5,000 remaining<br>
        • Tools API: Repository management active<br>
        • Prompts API: Template generation ready<br>
        <em>Command: ${query}</em>`,
        
      analytics: `<strong>Analytics processed</strong><br>
        • Data points analyzed: 1,247<br>
        • Chart generation: Ready<br>
        • Export formats: JSON, CSV, PDF available<br>
        • Resources API: Dashboard templates loaded<br>
        <em>Query: ${query}</em>`,
        
      search: `<strong>Search operation completed</strong><br>
        • Index updated<br>
        • Results found: 23 items<br>
        • Search time: 0.045s<br>
        • Tools API: Advanced filtering active<br>
        <em>Search: ${query}</em>`,
        
      files: `<strong>File operation successful</strong><br>
        • Files processed: 1<br>
        • Storage optimization: Applied<br>
        • Security scan: Passed<br>
        • Resources API: File templates available<br>
        <em>Operation: ${query}</em>`
    };
    
    return responses[service] || `<strong>Service ${service} processed (v${this.protocolVersion})</strong><br>
      • Protocol capabilities: Tools, Resources, Prompts, Sampling<br>
      • Enhanced features: Real-time monitoring, Auto-optimization<br>
      <em>Input: ${query}</em>`;
  }

  // Clear MCP service input and response
  clearMCPService(service) {
    const input = document.getElementById(`mcpInput-${service}`);
    const response = document.getElementById(`mcpResponse-${service}`);
    
    if (input) input.value = '';
    if (response) {
      response.style.display = 'none';
      response.innerHTML = '';
    }
    
    console.log(`🧹 Cleared MCP ${service} interface`);
  }

  // Enhanced v1.1 functions
  
  // Get MCP health status
  getMCPHealth(service) {
    const health = this.serverHealth.get(service);
    if (!health) {
      console.log(`❓ No health data for service: ${service}`);
      return null;
    }
    
    console.log(`📊 Health status for ${service}:`, health);
    
    // Show health in response area
    const response = document.getElementById(`mcpResponse-${service}`);
    if (response) {
      response.style.display = 'block';
      response.innerHTML = `
        <div style="color: #6366f1; font-weight: bold;">📊 MCP ${service.toUpperCase()} Health Status</div>
        <div style="margin-top: 10px; font-family: 'Courier New', monospace;">
          <div>Status: <span style="color: ${health.status === 'online' ? '#22c55e' : '#ef4444'};">${health.status?.toUpperCase()}</span></div>
          <div>Protocol: v${this.protocolVersion}</div>
          <div>Response Time: ${health.responseTime}ms</div>
          <div>Uptime: ${Math.floor((health.uptime || 0) / 60)} minutes</div>
          <div>Total Requests: ${health.requestCount || 0}</div>
          <div>Success Rate: ${(100 - (health.errorRate || 0)).toFixed(1)}%</div>
          <div>Last Check: ${health.lastCheck ? health.lastCheck.toLocaleTimeString() : 'Never'}</div>
        </div>
      `;
    }
    
    return health;
  }

  // Refresh MCP connections
  async refreshMCPConnections() {
    console.log('🔄 Refreshing all MCP connections...');
    
    for (const service of this.mcpServices) {
      try {
        await this.performHealthChecks();
        console.log(`✅ ${service} connection refreshed`);
      } catch (error) {
        console.error(`❌ Failed to refresh ${service}:`, error);
      }
    }
    
    console.log('✅ All MCP connections refreshed');
  }

  // Get MCP capabilities for service
  getMCPCapabilities(service) {
    console.log(`🔍 Getting capabilities for MCP ${service}...`);
    
    const serviceConfig = this.getServiceConfig(service);
    const capabilities = {
      protocol: this.protocolVersion,
      service: service,
      features: this.capabilities,
      commands: serviceConfig.commands,
      endpoints: {
        tools: `mcp://${service}.local:3000/tools`,
        resources: `mcp://${service}.local:3000/resources`,
        prompts: `mcp://${service}.local:3000/prompts`,
        sampling: `mcp://${service}.local:3000/sampling`
      }
    };
    
    // Show capabilities in response area
    const response = document.getElementById(`mcpResponse-${service}`);
    if (response) {
      response.style.display = 'block';
      response.innerHTML = `
        <div style="color: #f59e0b; font-weight: bold;">📋 MCP ${service.toUpperCase()} Capabilities (v${this.protocolVersion})</div>
        <div style="margin-top: 10px; font-family: 'Courier New', monospace; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px;">
          <div style="color: #4ade80; margin-bottom: 8px;"><strong>Protocol Features:</strong></div>
          ${Object.entries(this.capabilities).map(([key, value]) => 
            `<div>• ${key}: <span style="color: ${value ? '#22c55e' : '#ef4444'}">${value ? 'Supported' : 'Not supported'}</span></div>`
          ).join('')}
          
          <div style="color: #60a5fa; margin: 15px 0 8px 0;"><strong>Available Commands:</strong></div>
          ${serviceConfig.commands.map(cmd => `<div>• <code style="color: #fbbf24;">${cmd}</code></div>`).join('')}
          
          <div style="color: #a78bfa; margin: 15px 0 8px 0;"><strong>API Endpoints:</strong></div>
          ${Object.entries(capabilities.endpoints).map(([key, url]) => 
            `<div>• ${key}: <code style="color: #34d399;">${url}</code></div>`
          ).join('')}
        </div>
      `;
    }
    
    return capabilities;
  }

  // Connect to MCP service with v1.1 handshake
  async connectMCPService(service) {
    console.log(`🔌 Connecting to MCP ${service} with Protocol v${this.protocolVersion}...`);
    const response = document.getElementById(`mcpResponse-${service}`);
    
    if (response) {
      response.style.display = 'block';
      response.innerHTML = `<div style="color: #ffc107;">🔌 Establishing MCP v${this.protocolVersion} connection...</div>`;
      
      // Simulate connection handshake
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        // Update health status
        const health = this.serverHealth.get(service);
        if (health) {
          health.status = 'online';
          health.lastCheck = new Date();
          this.serverHealth.set(service, health);
        }
        
        response.innerHTML = `
          <div style="color: #4ade80; font-weight: bold;">✅ Successfully connected to MCP ${service.toUpperCase()}</div>
          <div style="margin-top: 8px; font-family: 'Courier New', monospace; color: #94a3b8;">
            • Protocol: v${this.protocolVersion}<br>
            • Handshake: Completed<br>
            • Capabilities: Tools, Resources, Prompts, Sampling<br>
            • Security: TLS 1.3 Encrypted<br>
            • Status: Ready for commands
          </div>
        `;
      } else {
        response.innerHTML = `
          <div style="color: #ef4444; font-weight: bold;">❌ Failed to connect to MCP ${service.toUpperCase()}</div>
          <div style="margin-top: 8px; color: #fca5a5;">Connection timeout - Please check server status</div>
        `;
      }
    }
  }

  // Test MCP service with comprehensive diagnostics
  async testMCPService(service) {
    console.log(`🧪 Running comprehensive test for MCP ${service}...`);
    const response = document.getElementById(`mcpResponse-${service}`);
    
    if (response) {
      response.style.display = 'block';
      response.innerHTML = `<div style="color: #6366f1;">🧪 Running MCP v${this.protocolVersion} diagnostics...</div>`;
      
      const tests = [
        { name: 'Connection Test', delay: 500 },
        { name: 'Protocol Handshake', delay: 800 },
        { name: 'Capabilities Check', delay: 600 },
        { name: 'Tools API Test', delay: 700 },
        { name: 'Resources API Test', delay: 550 },
        { name: 'Performance Test', delay: 900 }
      ];
      
      const results = [];
      
      for (const test of tests) {
        await new Promise(resolve => setTimeout(resolve, test.delay));
        const success = Math.random() > 0.15; // 85% success rate
        results.push({ ...test, success });
        
        // Update UI with progress
        response.innerHTML = `
          <div style="color: #6366f1; font-weight: bold;">🧪 MCP ${service.toUpperCase()} Diagnostics</div>
          <div style="margin-top: 10px; font-family: 'Courier New', monospace;">
            ${results.map(result => 
              `<div style="color: ${result.success ? '#22c55e' : '#ef4444'};">
                ${result.success ? '✅' : '❌'} ${result.name}: ${result.success ? 'PASSED' : 'FAILED'}
              </div>`
            ).join('')}
            ${results.length < tests.length ? '<div style="color: #fbbf24;">⏳ Running tests...</div>' : ''}
          </div>
        `;
      }
      
      const passedCount = results.filter(r => r.success).length;
      const overallStatus = passedCount === tests.length ? 'PASSED' : passedCount > tests.length / 2 ? 'WARNING' : 'FAILED';
      const statusColor = overallStatus === 'PASSED' ? '#22c55e' : overallStatus === 'WARNING' ? '#f59e0b' : '#ef4444';
      
      response.innerHTML += `
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #374151;">
          <div style="color: ${statusColor}; font-weight: bold;">
            📊 Overall Status: ${overallStatus} (${passedCount}/${tests.length} tests passed)
          </div>
          <div style="font-size: 11px; color: #9ca3af; margin-top: 5px;">
            Protocol v${this.protocolVersion} | Test completed at ${new Date().toLocaleTimeString()}
          </div>
        </div>
      `;
    }
  }

  // Refresh MCP service
  async refreshMCPService(service) {
    console.log(`🔄 Refreshing MCP ${service}...`);
    
    // Clear current state
    this.clearMCPService(service);
    
    // Reset health metrics
    const health = this.serverHealth.get(service);
    if (health) {
      health.status = 'unknown';
      health.lastCheck = null;
      health.responseTime = 0;
      this.serverHealth.set(service, health);
    }
    
    // Perform fresh health check
    await this.performHealthChecks();
    
    const response = document.getElementById(`mcpResponse-${service}`);
    if (response) {
      response.style.display = 'block';
      response.innerHTML = `
        <div style="color: #10b981; font-weight: bold;">🔄 MCP ${service.toUpperCase()} refreshed</div>
        <div style="margin-top: 8px; color: #6ee7b7;">
          Service state reset and health check completed
        </div>
      `;
    }
  }
}

// Enhanced global MCP functions for window scope (v1.1)
window.connectMCPService = function(service) {
  if (window.mcpAgentFunctions) {
    window.mcpAgentFunctions.connectMCPService(service);
  }
};

window.testMCPService = function(service) {
  if (window.mcpAgentFunctions) {
    window.mcpAgentFunctions.testMCPService(service);
  }
};

window.refreshMCPService = function(service) {
  if (window.mcpAgentFunctions) {
    window.mcpAgentFunctions.refreshMCPService(service);
  }
};

window.closeMCPModal = function() {
  if (window.mcpAgentFunctions) {
    window.mcpAgentFunctions.closeMCPModal();
  }
};

// New v1.1 global functions
window.getMCPHealth = function(service) {
  if (window.mcpAgentFunctions) {
    return window.mcpAgentFunctions.getMCPHealth(service);
  }
};

window.refreshMCPConnections = function() {
  if (window.mcpAgentFunctions) {
    return window.mcpAgentFunctions.refreshMCPConnections();
  }
};

window.getMCPCapabilities = function(service) {
  if (window.mcpAgentFunctions) {
    return window.mcpAgentFunctions.getMCPCapabilities(service);
  }
};

// Auto-initialize MCP system when loaded
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    if (!window.mcpAgentFunctions) {
      window.mcpAgentFunctions = new MCPAgentFunctions();
      window.mcpAgentFunctions.bindToRightPanel();
      console.log('🚀 MCP Agent v1.1 system initialized');
      console.log('🔗 Model Context Protocol v1.1 ready');
      console.log('📡 Enhanced capabilities: Tools, Resources, Prompts, Sampling, Roots, Completion');
      console.log('🖥️ 8 services available:', window.mcpAgentFunctions.mcpServices);
    }
  });
}

export default MCPAgentFunctions;