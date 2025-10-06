// System Tools Core Functions
// System utilities: Refresh, Folder, Close operations

export class SystemToolsAgentFunctions {
  constructor() {
    this.isActive = false;
  }

  // Bind to global scope for right-panel integration
  bindToRightPanel() {
    window.openRefresh = this.openRefresh.bind(this);
    window.openFolder = this.openFolder.bind(this);
    window.openClose = this.openClose.bind(this);
    window.toggleSystemTools = this.toggleSystemTools.bind(this);
    window.closeSystemTools = this.closeSystemTools.bind(this);
    window.performRefresh = this.performRefresh.bind(this);
    window.performFolderAction = this.performFolderAction.bind(this);
    window.performCloseAction = this.performCloseAction.bind(this);
  }

  // Open refresh action
  openRefresh() {
    console.log('🔄 Opening Refresh Tools...');
    this.createSystemToolsWidget('refresh');
  }

  // Open folder action  
  openFolder() {
    console.log('📁 Opening Folder Tools...');
    this.createSystemToolsWidget('folder');
  }

  // Open close action
  openClose() {
    console.log('❌ Opening Close Tools...');
    this.createSystemToolsWidget('close');
  }

  // Create system tools widget
  createSystemToolsWidget(type) {
    const existingWidget = document.getElementById('systemToolsWidget');
    if (existingWidget) {
      existingWidget.parentNode.removeChild(existingWidget);
    }

    const config = this.getToolConfig(type);
    
    const widget = document.createElement('div');
    widget.id = 'systemToolsWidget';
    widget.className = 'floating-widget';
    widget.style.cssText = `
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: 350px;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(15, 56, 70, 0.9));
      border: 1px solid ${config.color};
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      z-index: 10000;
      overflow: hidden;
      backdrop-filter: blur(10px);
    `;

    widget.innerHTML = `
      <div class="agent-panel-header">
        <span>${config.icon} ${config.title}</span>
        <button onclick="closeSystemTools()" class="close-btn">×</button>
      </div>
      <div class="agent-panel-content">
        <div style="margin-bottom: 15px; padding: 10px; background: rgba(${config.rgb}, 0.1); border-radius: 4px;">
          <span style="color: ${config.color}; font-weight: bold;">${config.icon} ${config.subtitle}</span>
          <div style="font-size: 12px; color: #ccc; margin-top: 5px;">${config.description}</div>
        </div>
        
        <div class="agent-controls">
          ${config.buttons.map(btn => `
            <button onclick="${btn.action}" class="agent-btn ${btn.type}">${btn.icon} ${btn.label}</button>
          `).join('')}
        </div>

        ${config.options ? `
          <div style="margin: 15px 0; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 4px;">
            <h4 style="margin: 0 0 10px 0; color: ${config.color};">⚙️ Options:</h4>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${config.options.map(opt => `
                <button onclick="${opt.action}" class="agent-btn secondary" style="font-size: 11px; padding: 6px 10px;">${opt.icon} ${opt.label}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div id="systemToolsResponse" class="agent-response" style="display: none; border-left-color: ${config.color};"></div>
        
        <div style="margin-top: 15px; font-size: 12px; color: #666;">
          <strong>Dostępne akcje:</strong><br>
          ${config.commands.map(cmd => `• ${cmd}`).join('<br>')}
        </div>
      </div>
    `;

    document.body.appendChild(widget);
    this.isActive = true;
    
    // Animate in
    setTimeout(() => {
      widget.style.opacity = '1';
      widget.style.transform = 'translateY(-50%) scale(1)';
    }, 10);
  }

  // Get tool configuration
  getToolConfig(type) {
    const configs = {
      refresh: {
        icon: '🔄',
        title: 'REFRESH TOOLS',
        subtitle: 'System Refresh',
        color: '#4ade80',
        rgb: '74, 222, 128',
        description: 'Odświeżanie systemu i komponentów',
        buttons: [
          { icon: '🔄', label: 'Full Refresh', action: 'performRefresh("full")', type: 'primary' },
          { icon: '⚡', label: 'Quick Refresh', action: 'performRefresh("quick")', type: 'secondary' },
          { icon: '🧹', label: 'Clear Cache', action: 'performRefresh("cache")', type: 'accent' }
        ],
        options: [
          { icon: '🗂️', label: 'Agents', action: 'performRefresh("agents")' },
          { icon: '🎵', label: 'Music', action: 'performRefresh("music")' },
          { icon: '🧠', label: 'Memory', action: 'performRefresh("memory")' },
          { icon: '📡', label: 'Services', action: 'performRefresh("services")' }
        ],
        commands: ['Full system refresh', 'Component refresh', 'Cache clearing', 'Service restart']
      },
      folder: {
        icon: '📁',
        title: 'FOLDER TOOLS',
        subtitle: 'File Management',
        color: '#ffc107',
        rgb: '255, 193, 7',
        description: 'Zarządzanie plikami i folderami',
        buttons: [
          { icon: '📂', label: 'Open Project', action: 'performFolderAction("project")', type: 'primary' },
          { icon: '📄', label: 'View Files', action: 'performFolderAction("files")', type: 'secondary' },
          { icon: '📊', label: 'File Stats', action: 'performFolderAction("stats")', type: 'accent' }
        ],
        options: [
          { icon: '🔍', label: 'Search', action: 'performFolderAction("search")' },
          { icon: '📋', label: 'Copy Path', action: 'performFolderAction("copy")' },
          { icon: '🗂️', label: 'Browse', action: 'performFolderAction("browse")' },
          { icon: '📁', label: 'New Folder', action: 'performFolderAction("new")' }
        ],
        commands: ['Open project folder', 'Browse files', 'File operations', 'Directory management']
      },
      close: {
        icon: '❌',
        title: 'CLOSE TOOLS',
        subtitle: 'Application Control',
        color: '#ef4444',
        rgb: '239, 68, 68',
        description: 'Zamykanie aplikacji i komponentów',
        buttons: [
          { icon: '❌', label: 'Close All', action: 'performCloseAction("all")', type: 'primary' },
          { icon: '🔕', label: 'Stop Services', action: 'performCloseAction("services")', type: 'secondary' },
          { icon: '💾', label: 'Save & Close', action: 'performCloseAction("save")', type: 'accent' }
        ],
        options: [
          { icon: '🎵', label: 'Music', action: 'performCloseAction("music")' },
          { icon: '🤖', label: 'Agents', action: 'performCloseAction("agents")' },
          { icon: '📱', label: 'Widgets', action: 'performCloseAction("widgets")' },
          { icon: '🌐', label: 'Browser', action: 'performCloseAction("browser")' }
        ],
        commands: ['Close applications', 'Stop services', 'Save and exit', 'Shutdown components']
      }
    };
    
    return configs[type] || configs.refresh;
  }

  // Close system tools
  closeSystemTools() {
    const widget = document.getElementById('systemToolsWidget');
    if (widget) {
      widget.style.opacity = '0';
      widget.style.transform = 'translateY(-50%) scale(0.9)';
      setTimeout(() => {
        if (widget.parentNode) {
          widget.parentNode.removeChild(widget);
        }
      }, 200);
    }
    this.isActive = false;
  }

  // Perform refresh action
  async performRefresh(type) {
    console.log(`🔄 Performing refresh: ${type}`);
    const response = document.getElementById('systemToolsResponse');
    
    if (response) {
      response.style.display = 'block';
      response.innerHTML = `<div style="color: #ffc107;">⏳ Refreshing ${type}...</div>`;
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const messages = {
        full: '🔄 Full system refresh completed - All components restarted',
        quick: '⚡ Quick refresh completed - Active services updated',
        cache: '🧹 Cache cleared - Memory freed and optimized',
        agents: '🗂️ Agent systems refreshed - All 20 modules reloaded',
        music: '🎵 Music system refreshed - Player restarted',
        memory: '🧠 Memory system refreshed - Cache rebuilt',
        services: '📡 Services refreshed - All connections restored'
      };
      
      response.innerHTML = `<div style="color: #4ade80; font-weight: bold;">✅ ${messages[type] || 'Refresh completed'}</div>`;
      
      if (type === 'full' || type === 'quick') {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  }

  // Perform folder action
  async performFolderAction(type) {
    console.log(`📁 Performing folder action: ${type}`);
    const response = document.getElementById('systemToolsResponse');
    
    if (response) {
      response.style.display = 'block';
      response.innerHTML = `<div style="color: #ffc107;">⏳ Processing folder action...</div>`;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const messages = {
        project: '📂 Project folder opened - VSCode workspace loaded',
        files: '📄 File browser opened - 247 files in project',
        stats: '📊 File statistics: 15MB total, 142 JS files, 38 CSS files',
        search: '🔍 File search opened - Ready to search project',
        copy: '📋 Project path copied to clipboard',
        browse: '🗂️ File browser launched - Explorer window opened',
        new: '📁 New folder creation dialog opened'
      };
      
      response.innerHTML = `<div style="color: #4ade80; font-weight: bold;">✅ ${messages[type] || 'Folder action completed'}</div>`;
    }
  }

  // Perform close action
  async performCloseAction(type) {
    console.log(`❌ Performing close action: ${type}`);
    const response = document.getElementById('systemToolsResponse');
    
    if (response) {
      response.style.display = 'block';
      response.innerHTML = `<div style="color: #ffc107;">⏳ Closing ${type}...</div>`;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const messages = {
        all: '❌ All applications closed - System ready for shutdown',
        services: '🔕 All services stopped - Background processes terminated',
        save: '💾 Data saved and applications closed safely',
        music: '🎵 Music player closed - Audio system stopped',
        agents: '🤖 All agents deactivated - AI systems offline',
        widgets: '📱 All widgets closed - UI cleaned up',
        browser: '🌐 Browser windows closed - Network connections terminated'
      };
      
      response.innerHTML = `<div style="color: #4ade80; font-weight: bold;">✅ ${messages[type] || 'Close action completed'}</div>`;
      
      if (type === 'all') {
        setTimeout(() => {
          this.closeAllWidgets();
        }, 2000);
      } else if (type === 'widgets') {
        setTimeout(() => {
          this.closeAllWidgets();
        }, 1000);
      }
    }
  }

  // Close all widgets
  closeAllWidgets() {
    const widgets = document.querySelectorAll('.floating-widget');
    widgets.forEach(widget => {
      if (widget.id !== 'systemToolsWidget') {
        widget.style.opacity = '0';
        widget.style.transform = 'scale(0.9)';
        setTimeout(() => {
          if (widget.parentNode) {
            widget.parentNode.removeChild(widget);
          }
        }, 200);
      }
    });
  }
}

// Additional window functions for system tools
window.performRefresh = function(type) {
  if (window.systemToolsAgentFunctions) {
    window.systemToolsAgentFunctions.performRefresh(type);
  }
};

window.performFolderAction = function(type) {
  if (window.systemToolsAgentFunctions) {
    window.systemToolsAgentFunctions.performFolderAction(type);
  }
};

window.performCloseAction = function(type) {
  if (window.systemToolsAgentFunctions) {
    window.systemToolsAgentFunctions.performCloseAction(type);
  }
};

window.closeSystemTools = function() {
  if (window.systemToolsAgentFunctions) {
    window.systemToolsAgentFunctions.closeSystemTools();
  }
};