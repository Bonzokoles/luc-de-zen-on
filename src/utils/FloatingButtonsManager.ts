// Floating Buttons Interface - Google ADK Integration
// Centralized management for all floating buttons and their functionality

export interface FloatingButtonConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  position: { x: number; y: number };
  isVisible: boolean;
  isActive: boolean;
  agentId?: string;
  category: 'core' | 'ai' | 'utility' | 'media' | 'custom';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  requiresADK?: boolean;
}

export interface WidgetState {
  id: string;
  isOpen: boolean;
  position: { x: number; y: number; width: number; height: number };
  zIndex: number;
  minimized: boolean;
  data?: any;
}

export class FloatingButtonsManager {
  private static instance: FloatingButtonsManager | null = null;
  private buttons: Map<string, FloatingButtonConfig> = new Map();
  private widgets: Map<string, WidgetState> = new Map();
  private adkManager: any = null;
  private zIndexCounter: number = 1000;

  private constructor() {
    this.initializeDefaultButtons();
  }

  static getInstance(): FloatingButtonsManager {
    if (!FloatingButtonsManager.instance) {
      FloatingButtonsManager.instance = new FloatingButtonsManager();
    }
    return FloatingButtonsManager.instance;
  }

  private initializeDefaultButtons(): void {
    const defaultButtons: FloatingButtonConfig[] = [
      {
        id: 'voice-command',
        name: 'Voice Command',
        icon: '🎤',
        color: '#22c55e',
        position: { x: 20, y: 120 },
        isVisible: true,
        isActive: false,
        agentId: 'voice_command_001',
        category: 'ai',
        priority: 'HIGH',
        description: 'Voice command and speech recognition',
        requiresADK: true
      },
      {
        id: 'music-control',
        name: 'Music Control',
        icon: '🎵',
        color: '#3b82f6',
        position: { x: 20, y: 180 },
        isVisible: true,
        isActive: false,
        agentId: 'music_control_001',
        category: 'media',
        priority: 'HIGH',
        description: 'Music playback and audio control',
        requiresADK: true
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        icon: '🧠',
        color: '#6366f1',
        position: { x: 20, y: 240 },
        isVisible: true,
        isActive: false,
        agentId: 'gemini-pro',
        category: 'ai',
        priority: 'HIGH',
        description: 'Advanced AI conversation and analysis',
        requiresADK: true
      },
      {
        id: 'gemini-vision',
        name: 'Gemini Vision',
        icon: '👁️',
        color: '#8b5cf6',
        position: { x: 20, y: 300 },
        isVisible: true,
        isActive: false,
        agentId: 'gemini-vision',
        category: 'ai',
        priority: 'HIGH',
        description: 'Image analysis and computer vision',
        requiresADK: true
      },
      {
        id: 'code-bison',
        name: 'Code Bison',
        icon: '💻',
        color: '#10b981',
        position: { x: 20, y: 360 },
        isVisible: true,
        isActive: false,
        agentId: 'code-bison',
        category: 'ai',
        priority: 'HIGH',
        description: 'Code generation and analysis',
        requiresADK: true
      },
      {
        id: 'text-bison',
        name: 'Text Bison',
        icon: '📝',
        color: '#1976d2',
        position: { x: 20, y: 420 },
        isVisible: true,
        isActive: false,
        agentId: 'text-bison',
        category: 'ai',
        priority: 'HIGH',
        description: 'Text processing and generation',
        requiresADK: true
      },
      {
        id: 'vertex-ai',
        name: 'Vertex AI',
        icon: '🔮',
        color: '#4285f4',
        position: { x: 20, y: 480 },
        isVisible: true,
        isActive: false,
        agentId: 'vertex-ai',
        category: 'ai',
        priority: 'HIGH',
        description: 'Google Cloud Vertex AI services',
        requiresADK: true
      },
      {
        id: 'google-bard',
        name: 'Google Bard',
        icon: '🎨',
        color: '#ea4335',
        position: { x: 20, y: 540 },
        isVisible: true,
        isActive: false,
        agentId: 'google-bard',
        category: 'ai',
        priority: 'HIGH',
        description: 'Creative AI and research assistant',
        requiresADK: true
      },
      {
        id: 'palm-api',
        name: 'PaLM API',
        icon: '🌴',
        color: '#fbbc04',
        position: { x: 20, y: 600 },
        isVisible: true,
        isActive: false,
        agentId: 'palm-api',
        category: 'ai',
        priority: 'HIGH',
        description: 'Google PaLM API integration',
        requiresADK: true
      },
      // Module Agents
      {
        id: 'analytics-agent',
        name: 'Analytics Prophet',
        icon: '📊',
        color: '#8b5a2b',
        position: { x: 20, y: 660 },
        isVisible: true,
        isActive: false,
        agentId: 'agent-10-analytics-prophet',
        category: 'utility',
        priority: 'HIGH',
        description: 'Zaawansowany system analityki predykcyjnej z ML forecasting',
        requiresADK: false
      },
      {
        id: 'webmaster-agent',
        name: 'Webmaster',
        icon: '🌐',
        color: '#16537e',
        position: { x: 20, y: 720 },
        isVisible: true,
        isActive: false,
        agentId: 'agent-09-webmaster',
        category: 'utility',
        priority: 'HIGH',
        description: 'Zaawansowany system SEO i monitoringu stron internetowych',
        requiresADK: false
      },
      {
        id: 'security-agent',
        name: 'Security Guard',
        icon: '🔐',
        color: '#dc2626',
        position: { x: 20, y: 780 },
        isVisible: true,
        isActive: false,
        agentId: 'agent-08-security-guard',
        category: 'core',
        priority: 'HIGH',
        description: 'System monitorowania i ochrony bezpieczeństwa',
        requiresADK: false
      },
      {
        id: 'content-agent',
        name: 'Content Creator',
        icon: '✍️',
        color: '#7c3aed',
        position: { x: 80, y: 120 },
        isVisible: true,
        isActive: false,
        agentId: 'agent-07-content-creator',
        category: 'media',
        priority: 'HIGH',
        description: 'System tworzenia i zarządzania treścią',
        requiresADK: false
      },
      {
        id: 'crawler-agent',
        name: 'Web Crawler',
        icon: '🕷️',
        color: '#059669',
        position: { x: 80, y: 180 },
        isVisible: true,
        isActive: false,
        agentId: 'agent-06-web-crawler',
        category: 'utility',
        priority: 'HIGH',
        description: 'System pobierania i analizy danych z internetu',
        requiresADK: false
      },
      {
        id: 'email-agent',
        name: 'Email Manager',
        icon: '📧',
        color: '#0891b2',
        position: { x: 80, y: 240 },
        isVisible: true,
        isActive: false,
        agentId: 'agent-05-email-manager',
        category: 'utility',
        priority: 'HIGH',
        description: 'System zarządzania i automatyzacji email',
        requiresADK: false
      },
      {
        id: 'file-agent',
        name: 'File Manager',
        icon: '📁',
        color: '#ca8a04',
        position: { x: 80, y: 300 },
        isVisible: true,
        isActive: false,
        agentId: 'agent-04-file-manager',
        category: 'core',
        priority: 'HIGH',
        description: 'System zarządzania plikami i dokumentami',
        requiresADK: false
      },
      {
        id: 'database-agent',
        name: 'Database Manager',
        icon: '🗄️',
        color: '#db2777',
        position: { x: 80, y: 360 },
        isVisible: true,
        isActive: false,
        agentId: 'agent-03-database-manager',
        category: 'core',
        priority: 'HIGH',
        description: 'System zarządzania bazami danych',
        requiresADK: false
      },
      {
        id: 'system-agent',
        name: 'System Monitor',
        icon: '⚙️',
        color: '#374151',
        position: { x: 80, y: 420 },
        isVisible: true,
        isActive: false,
        agentId: 'agent-01-system-monitor',
        category: 'core',
        priority: 'HIGH',
        description: 'System monitorowania wydajności systemu',
        requiresADK: false
      }
    ];

    defaultButtons.forEach(button => {
      this.buttons.set(button.id, button);
    });
  }

  async setADKManager(adkManager: any): Promise<void> {
    this.adkManager = adkManager;
    console.log('🔗 ADK Manager connected to FloatingButtonsManager');
  }

  registerButton(config: FloatingButtonConfig): void {
    this.buttons.set(config.id, config);
    this.renderButton(config);
  }

  renderAll(): void {
    console.log('🎨 Rendering all floating buttons...');
    this.buttons.forEach(button => {
      this.renderButton(button);
    });
    console.log(`✅ Rendered ${this.buttons.size} floating buttons`);
  }

  async toggleButton(buttonId: string): Promise<void> {
    const button = this.buttons.get(buttonId);
    if (!button) return;

    if (button.requiresADK && !this.adkManager) {
      console.warn(`⚠️ ADK Manager required for ${button.name}`);
      return;
    }

    button.isActive = !button.isActive;

    if (button.isActive) {
      await this.activateButton(button);
    } else {
      this.deactivateButton(button);
    }

    this.updateButtonVisual(button);
  }

  private async activateButton(button: FloatingButtonConfig): Promise<void> {
    try {
      // Check if this is a Google ADK agent that should open a page
      const googleAgents = ['gemini-pro', 'gemini-vision', 'code-bison', 'text-bison', 'google-bard', 'palm-api', 'vertex-ai', 'ai-studio', 'voice-command', 'music-control'];
      
      if (googleAgents.includes(button.id)) {
        // Open agent page in new tab
        window.open(`/agents/${button.id}`, '_blank');
        button.isActive = false; // Reset button state
        this.updateButtonVisual(button);
        return;
      }

      // Default widget behavior for other buttons
      const widgetId = `${button.id}-widget`;
      let widget = this.widgets.get(widgetId);

      if (!widget) {
        widget = {
          id: widgetId,
          isOpen: true,
          position: {
            x: button.position.x + 80,
            y: button.position.y,
            width: 400,
            height: 300
          },
          zIndex: this.zIndexCounter++,
          minimized: false
        };
        this.widgets.set(widgetId, widget);
      } else {
        widget.isOpen = true;
        widget.zIndex = this.zIndexCounter++;
      }

      // Initialize ADK agent if required
      if (button.requiresADK && button.agentId && this.adkManager) {
        const agent = await this.adkManager.getAgent(button.agentId);
        if (agent) {
          console.log(`🚀 Activated ${button.name} with agent ${button.agentId}`);
          widget.data = { agent, agentId: button.agentId };
        }
      }

      this.renderWidget(widget, button);

    } catch (error) {
      console.error(`❌ Failed to activate ${button.name}:`, error);
    }
  }

  private deactivateButton(button: FloatingButtonConfig): void {
    const widgetId = `${button.id}-widget`;
    const widget = this.widgets.get(widgetId);
    
    if (widget) {
      widget.isOpen = false;
      this.hideWidget(widgetId);
    }
  }

  private renderButton(button: FloatingButtonConfig): void {
    const existingButton = document.getElementById(`floating-btn-${button.id}`);
    if (existingButton) return;

    const buttonElement = document.createElement('div');
    buttonElement.id = `floating-btn-${button.id}`;
    buttonElement.className = 'floating-button';
    buttonElement.style.cssText = `
      position: fixed;
      left: ${button.position.x}px;
      top: ${button.position.y}px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: ${button.color};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      z-index: 900;
      font-size: 18px;
      user-select: none;
    `;

    buttonElement.innerHTML = button.icon;
    buttonElement.title = button.description;

    buttonElement.addEventListener('click', async () => {
      await this.toggleButton(button.id);
    });

    buttonElement.addEventListener('mouseenter', () => {
      buttonElement.style.transform = 'scale(1.1)';
      buttonElement.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
    });

    buttonElement.addEventListener('mouseleave', () => {
      buttonElement.style.transform = 'scale(1)';
      buttonElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    document.body.appendChild(buttonElement);
  }

  private updateButtonVisual(button: FloatingButtonConfig): void {
    const buttonElement = document.getElementById(`floating-btn-${button.id}`);
    if (!buttonElement) return;

    if (button.isActive) {
      buttonElement.style.background = `linear-gradient(45deg, ${button.color}, #ffffff33)`;
      buttonElement.style.border = '2px solid #ffffff66';
    } else {
      buttonElement.style.background = button.color;
      buttonElement.style.border = 'none';
    }
  }

  private renderWidget(widget: WidgetState, button: FloatingButtonConfig): void {
    let widgetElement = document.getElementById(widget.id);
    
    if (!widgetElement) {
      widgetElement = document.createElement('div');
      widgetElement.id = widget.id;
      widgetElement.className = 'floating-widget';
      document.body.appendChild(widgetElement);
    }

    widgetElement.style.cssText = `
      position: fixed;
      left: ${widget.position.x}px;
      top: ${widget.position.y}px;
      width: ${widget.position.width}px;
      height: ${widget.position.height}px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      z-index: ${widget.zIndex};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    `;

    // Create widget header
    const header = document.createElement('div');
    header.className = 'widget-header';
    header.style.cssText = `
      background: ${button.color};
      color: white;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
    `;

    header.innerHTML = `
      <span style="font-weight: 600;">${button.icon} ${button.name}</span>
      <div style="display: flex; gap: 8px;">
        <button onclick="floatingButtons.minimizeWidget('${widget.id}')" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">−</button>
        <button onclick="floatingButtons.closeWidget('${widget.id}', '${button.id}')" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">×</button>
      </div>
    `;

    // Create widget content
    const content = document.createElement('div');
    content.className = 'widget-content';
    content.style.cssText = `
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    `;

    content.innerHTML = this.getWidgetContent(button, widget);

    widgetElement.innerHTML = '';
    widgetElement.appendChild(header);
    widgetElement.appendChild(content);

    // Make widget draggable
    this.makeWidgetDraggable(widgetElement, header);

    widgetElement.style.display = widget.isOpen ? 'flex' : 'none';
  }

  private getWidgetContent(button: FloatingButtonConfig, widget: WidgetState): string {
    switch (button.id) {
      case 'voice-command':
        return `
          <div style="text-align: center;">
            <h3 style="margin: 0 0 16px 0; color: #374151;">Voice Command</h3>
            <div style="margin-bottom: 16px;">
              <button id="voice-start-btn" style="background: #22c55e; color: white; border: none; border-radius: 8px; padding: 12px 24px; font-size: 16px; cursor: pointer;">
                🎤 Start Listening
              </button>
            </div>
            <div id="voice-status" style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">Ready to listen...</div>
            <div id="voice-transcript" style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; min-height: 100px; text-align: left; font-size: 14px; color: #374151;"></div>
          </div>
        `;
      
      case 'music-control':
        return `
          <div style="text-align: center;">
            <h3 style="margin: 0 0 16px 0; color: #374151;">Music Control</h3>
            <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 16px;">
              <button onclick="window.musicControls?.previous()" style="background: #3b82f6; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;">⏮️</button>
              <button onclick="window.musicControls?.toggle()" style="background: #3b82f6; color: white; border: none; border-radius: 50%; width: 48px; height: 48px; cursor: pointer; font-size: 18px;">⏯️</button>
              <button onclick="window.musicControls?.next()" style="background: #3b82f6; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;">⏭️</button>
            </div>
            <div style="margin-bottom: 16px;">
              <input type="range" id="volume-slider" min="0" max="100" value="70" style="width: 100%;" onchange="window.musicControls?.setVolume(this.value)">
              <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Volume: <span id="volume-display">70%</span></div>
            </div>
            <div id="current-track" style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #374151;">No track playing</div>
          </div>
        `;

      case 'gemini-pro':
        return `
          <div>
            <h3 style="margin: 0 0 16px 0; color: #374151;">🧠 Gemini Pro Chat</h3>
            <div id="gemini-chat" style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; height: 180px; overflow-y: auto; margin-bottom: 12px; font-size: 14px;"></div>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="gemini-input" placeholder="Ask Gemini Pro..." style="flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
              <button onclick="floatingButtons.sendToGemini()" style="background: #6366f1; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer;">Send</button>
            </div>
          </div>
        `;

      case 'gemini-vision':
        return `
          <div>
            <h3 style="margin: 0 0 16px 0; color: #374151;">👁️ Gemini Vision</h3>
            <div style="margin-bottom: 12px;">
              <input type="file" id="vision-upload" accept="image/*" style="margin-bottom: 8px; font-size: 14px;">
              <button onclick="floatingButtons.analyzeImage()" style="background: #8b5cf6; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-size: 14px;">Analyze Image</button>
            </div>
            <div id="vision-preview" style="margin-bottom: 12px; text-align: center;"></div>
            <div id="vision-results" style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; height: 120px; overflow-y: auto; font-size: 14px; color: #374151;"></div>
          </div>
        `;

      case 'analytics-agent':
        return `
          <div>
            <h3 style="margin: 0 0 16px 0; color: #374151;">📊 Analytics Prophet</h3>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <button onclick="window.openAgent?.('analytics')" style="background: #8b5a2b; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-size: 14px;">Open Dashboard</button>
              <button onclick="window.analytics?.forecast()" style="background: #059669; color: white; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 14px;">Forecast</button>
            </div>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #374151;">
              📈 Machine Learning forecasting<br>
              📊 ROI Analysis<br>  
              🎯 Cohort Analysis<br>
              📋 Performance Reports
            </div>
          </div>
        `;

      case 'webmaster-agent':
        return `
          <div>
            <h3 style="margin: 0 0 16px 0; color: #374151;">🌐 Webmaster</h3>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <button onclick="window.openAgent?.('webmaster')" style="background: #16537e; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-size: 14px;">SEO Dashboard</button>
              <button onclick="window.webmaster?.audit()" style="background: #059669; color: white; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 14px;">Audit</button>
            </div>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #374151;">
              🔍 Audyt techniczny SEO<br>
              📝 Analiza słów kluczowych<br>
              📊 Monitoring wydajności<br>
              🏆 Analiza konkurencji
            </div>
          </div>
        `;

      case 'security-agent':
        return `
          <div>
            <h3 style="margin: 0 0 16px 0; color: #374151;">🔐 Security Guard</h3>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <button onclick="window.openAgent?.('security')" style="background: #dc2626; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-size: 14px;">Security Center</button>
              <button onclick="window.security?.scan()" style="background: #f59e0b; color: white; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 14px;">Scan</button>
            </div>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #374151;">
              🛡️ Wykrywanie zagrożeń<br>
              📊 Monitoring bezpieczeństwa<br>
              🚨 Reakcja na incydenty<br>
              📋 Raporty bezpieczeństwa
            </div>
          </div>
        `;

      case 'content-agent':
        return `
          <div>
            <h3 style="margin: 0 0 16px 0; color: #374151;">✍️ Content Creator</h3>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <button onclick="window.openAgent?.('content')" style="background: #7c3aed; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-size: 14px;">Content Hub</button>
              <button onclick="window.content?.generate()" style="background: #059669; color: white; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 14px;">Generate</button>
            </div>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #374151;">
              📝 Tworzenie treści<br>
              🎨 Szablony i wzory<br>
              📊 Zarządzanie publikacjami<br>
              📈 Analiza efektywności
            </div>
          </div>
        `;

      case 'crawler-agent':
        return `
          <div>
            <h3 style="margin: 0 0 16px 0; color: #374151;">🕷️ Web Crawler</h3>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <button onclick="window.openAgent?.('crawler')" style="background: #059669; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-size: 14px;">Crawler Panel</button>
              <button onclick="window.crawler?.crawl()" style="background: #0891b2; color: white; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 14px;">Start Crawl</button>
            </div>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #374151;">
              🌐 Pobieranie danych z sieci<br>
              📊 Analiza struktury stron<br>
              🔍 Indeksowanie treści<br>
              📋 Raportowanie wyników
            </div>
          </div>
        `;

      case 'email-agent':
        return `
          <div>
            <h3 style="margin: 0 0 16px 0; color: #374151;">📧 Email Manager</h3>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <button onclick="window.openAgent?.('email')" style="background: #0891b2; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-size: 14px;">Email Center</button>
              <button onclick="window.email?.send()" style="background: #059669; color: white; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 14px;">Send</button>
            </div>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #374151;">
              📬 Zarządzanie skrzynkami<br>
              🤖 Automatyzacja email<br>
              📊 Kampanie marketingowe<br>
              📈 Analiza efektywności
            </div>
          </div>
        `;

      case 'file-agent':
        return `
          <div>
            <h3 style="margin: 0 0 16px 0; color: #374151;">📁 File Manager</h3>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <button onclick="window.openAgent?.('file')" style="background: #ca8a04; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-size: 14px;">File Browser</button>
              <button onclick="window.files?.organize()" style="background: #059669; color: white; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 14px;">Organize</button>
            </div>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #374151;">
              📂 Zarządzanie plikami<br>
              🔍 Wyszukiwanie dokumentów<br>
              🗂️ Organizacja folderów<br>
              📊 Analiza użycia dysku
            </div>
          </div>
        `;

      case 'database-agent':
        return `
          <div>
            <h3 style="margin: 0 0 16px 0; color: #374151;">🗄️ Database Manager</h3>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <button onclick="window.openAgent?.('database')" style="background: #db2777; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-size: 14px;">DB Console</button>
              <button onclick="window.database?.query()" style="background: #059669; color: white; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 14px;">Query</button>
            </div>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #374151;">
              💾 Zarządzanie bazami danych<br>
              🔍 Optymalizacja zapytań<br>
              📊 Monitoring wydajności<br>
              🔧 Backup i restore
            </div>
          </div>
        `;

      case 'system-agent':
        return `
          <div>
            <h3 style="margin: 0 0 16px 0; color: #374151;">⚙️ System Monitor</h3>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <button onclick="window.openAgent?.('system')" style="background: #374151; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-size: 14px;">System Panel</button>
              <button onclick="window.system?.check()" style="background: #059669; color: white; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 14px;">Health Check</button>
            </div>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #374151;">
              📊 Monitoring wydajności<br>
              💾 Użycie zasobów<br>
              🔧 Diagnostyka systemu<br>
              📈 Raportowanie statusu
            </div>
          </div>
        `;

      default:
        return `
          <div style="text-align: center;">
            <h3 style="margin: 0 0 16px 0; color: #374151;">${button.name}</h3>
            <p style="color: #6b7280; margin-bottom: 16px;">${button.description}</p>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; font-size: 14px; color: #374151;">
              Agent integration in development...
            </div>
          </div>
        `;
    }
  }

  private makeWidgetDraggable(widget: HTMLElement, header: HTMLElement): void {
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      initialX = e.clientX - widget.offsetLeft;
      initialY = e.clientY - widget.offsetTop;
      widget.style.zIndex = (this.zIndexCounter++).toString();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        widget.style.left = currentX + 'px';
        widget.style.top = currentY + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  closeWidget(widgetId: string, buttonId: string): void {
    const widget = this.widgets.get(widgetId);
    const button = this.buttons.get(buttonId);
    
    if (widget && button) {
      widget.isOpen = false;
      button.isActive = false;
      this.hideWidget(widgetId);
      this.updateButtonVisual(button);
    }
  }

  minimizeWidget(widgetId: string): void {
    const widget = this.widgets.get(widgetId);
    if (widget) {
      widget.minimized = !widget.minimized;
      const widgetElement = document.getElementById(widgetId);
      if (widgetElement) {
        if (widget.minimized) {
          widgetElement.style.height = '60px';
          const content = widgetElement.querySelector('.widget-content') as HTMLElement;
          if (content) content.style.display = 'none';
        } else {
          widgetElement.style.height = widget.position.height + 'px';
          const content = widgetElement.querySelector('.widget-content') as HTMLElement;
          if (content) content.style.display = 'flex';
        }
      }
    }
  }

  private hideWidget(widgetId: string): void {
    const widgetElement = document.getElementById(widgetId);
    if (widgetElement) {
      widgetElement.style.display = 'none';
    }
  }

  async sendToGemini(): Promise<void> {
    const input = document.getElementById('gemini-input') as HTMLInputElement;
    const chatDiv = document.getElementById('gemini-chat');
    
    if (!input?.value || !chatDiv) return;

    const message = input.value;
    input.value = '';

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.style.cssText = 'margin-bottom: 8px; text-align: right;';
    userMsg.innerHTML = `<span style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 12px; font-size: 13px;">You: ${message}</span>`;
    chatDiv.appendChild(userMsg);

    // Add loading indicator
    const loadingMsg = document.createElement('div');
    loadingMsg.style.cssText = 'margin-bottom: 8px;';
    loadingMsg.innerHTML = `<span style="background: #f3f4f6; color: #6b7280; padding: 6px 12px; border-radius: 12px; font-size: 13px;">Gemini: Thinking...</span>`;
    chatDiv.appendChild(loadingMsg);
    chatDiv.scrollTop = chatDiv.scrollHeight;

    try {
      if (this.adkManager) {
        const agent = await this.adkManager.getAgent('gemini-pro');
        if (agent) {
          const response = await agent.processMessage(message);
          loadingMsg.remove();
          
          const aiMsg = document.createElement('div');
          aiMsg.style.cssText = 'margin-bottom: 8px;';
          aiMsg.innerHTML = `<span style="background: #6366f1; color: white; padding: 6px 12px; border-radius: 12px; font-size: 13px;">Gemini: ${response.response}</span>`;
          chatDiv.appendChild(aiMsg);
        }
      }
    } catch (error) {
      loadingMsg.remove();
      const errorMsg = document.createElement('div');
      errorMsg.style.cssText = 'margin-bottom: 8px;';
      errorMsg.innerHTML = `<span style="background: #ef4444; color: white; padding: 6px 12px; border-radius: 12px; font-size: 13px;">Error: ${error}</span>`;
      chatDiv.appendChild(errorMsg);
    }

    chatDiv.scrollTop = chatDiv.scrollHeight;
  }

  async analyzeImage(): Promise<void> {
    const fileInput = document.getElementById('vision-upload') as HTMLInputElement;
    const previewDiv = document.getElementById('vision-preview');
    const resultsDiv = document.getElementById('vision-results');
    
    if (!fileInput?.files?.[0] || !resultsDiv) return;

    const file = fileInput.files[0];
    
    // Show preview
    if (previewDiv) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.cssText = 'max-width: 100%; max-height: 120px; border-radius: 6px; border: 1px solid #e5e7eb;';
      previewDiv.innerHTML = '';
      previewDiv.appendChild(img);
    }

    resultsDiv.innerHTML = 'Analyzing image...';

    try {
      if (this.adkManager) {
        const agent = await this.adkManager.getAgent('gemini-vision');
        if (agent) {
          // Convert file to base64 or handle image upload
          const reader = new FileReader();
          reader.onload = async (e) => {
            const imageData = e.target?.result as string;
            const response = await agent.processMessage(`Analyze image: ${imageData}`);
            resultsDiv.innerHTML = response.response;
          };
          reader.readAsDataURL(file);
        }
      }
    } catch (error) {
      resultsDiv.innerHTML = `Error analyzing image: ${error}`;
    }
  }

  getAllButtons(): FloatingButtonConfig[] {
    return Array.from(this.buttons.values());
  }

  getButton(buttonId: string): FloatingButtonConfig | null {
    return this.buttons.get(buttonId) || null;
  }

  hideAllWidgets(): void {
    this.widgets.forEach((widget, widgetId) => {
      if (widget.isOpen) {
        widget.isOpen = false;
        this.hideWidget(widgetId);
      }
    });

    this.buttons.forEach(button => {
      button.isActive = false;
      this.updateButtonVisual(button);
    });
  }

  showButtonsByCategory(category: string): void {
    this.buttons.forEach(button => {
      if (button.category === category) {
        button.isVisible = true;
        const buttonElement = document.getElementById(`floating-btn-${button.id}`);
        if (buttonElement) {
          buttonElement.style.display = 'flex';
        }
      }
    });
  }

  hideButtonsByCategory(category: string): void {
    this.buttons.forEach(button => {
      if (button.category === category) {
        button.isVisible = false;
        if (button.isActive) {
          this.toggleButton(button.id);
        }
        const buttonElement = document.getElementById(`floating-btn-${button.id}`);
        if (buttonElement) {
          buttonElement.style.display = 'none';
        }
      }
    });
  }
}

// Global instance
export const floatingButtons = FloatingButtonsManager.getInstance();

// Make available globally for HTML onclick handlers
if (typeof window !== 'undefined') {
  (window as any).floatingButtons = floatingButtons;
  
  // Global function to open agent modules
  (window as any).openAgent = (agentType: string) => {
    const agentRoutes: Record<string, string> = {
      'analytics': '/agents/agent-10-analytics-prophet',
      'webmaster': '/agents/agent-09-webmaster', 
      'security': '/agents/agent-08-security-guard',
      'content': '/agents/agent-07-content-creator',
      'crawler': '/agents/agent-06-web-crawler',
      'email': '/agents/agent-05-email-manager',
      'file': '/agents/agent-04-file-manager',
      'database': '/agents/agent-03-database-manager',
      'system': '/agents/agent-01-system-monitor',
      'voice': '/agents/voice_command_001',
      'music': '/agents/music_control_001'
    };
    
    const route = agentRoutes[agentType];
    if (route) {
      window.open(route, '_blank');
    } else {
      console.warn(`Agent route not found for: ${agentType}`);
    }
  };
}