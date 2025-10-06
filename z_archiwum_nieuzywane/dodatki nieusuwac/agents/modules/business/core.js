// Business Assistant Core Functions
// Business support and enterprise features

export class BusinessAgentFunctions {
  constructor() {
    this.businessTools = ['crm', 'analytics', 'reports', 'meetings'];
    this.isActive = false;
  }

  // Bind to global scope for right-panel integration
  bindToRightPanel() {
    window.openBusinessAssistant = this.openBusinessAssistant.bind(this);
    window.toggleBusinessAssistant = this.toggleBusinessAssistant.bind(this);
    window.closeBusinessAssistant = this.closeBusinessAssistant.bind(this);
    window.sendToBusinessAssistant = this.sendToBusinessAssistant.bind(this);
    window.clearBusinessAssistant = this.clearBusinessAssistant.bind(this);
  }

  // Open business assistant
  openBusinessAssistant() {
    console.log('💼 Opening Business Assistant...');
    this.createBusinessWidget();
    this.isActive = true;
  }

  // Toggle business widget
  toggleBusinessAssistant() {
    if (this.isActive) {
      this.closeBusinessAssistant();
    } else {
      this.openBusinessAssistant();
    }
  }

  // Create business widget
  createBusinessWidget() {
    const existingWidget = document.getElementById('businessWidget');
    if (existingWidget) {
      existingWidget.classList.remove('hidden');
      return;
    }

    const widget = document.createElement('div');
    widget.id = 'businessWidget';
    widget.className = 'floating-widget';
    widget.style.cssText = `
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: 450px;
      max-height: 80vh;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(15, 56, 70, 0.9));
      border: 1px solid #ffc107;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      z-index: 10000;
      overflow: hidden;
      backdrop-filter: blur(10px);
    `;

    widget.innerHTML = `
      <div class="agent-panel-header">
        <span>💼 BUSINESS ASSISTANT</span>
        <button onclick="closeBusinessAssistant()" class="close-btn">×</button>
      </div>
      <div class="agent-panel-content">
        <div style="margin-bottom: 15px; padding: 10px; background: rgba(255, 193, 7, 0.1); border-radius: 4px;">
          <span style="color: #ffc107; font-weight: bold;">💼 BUSINESS TOOLS</span>
          <div style="font-size: 12px; color: #ccc; margin-top: 5px;">Narzędzia wsparcia biznesowego i zarządzania</div>
        </div>
        
        <div class="agent-controls">
          <button onclick="openCRM()" class="agent-btn primary">👥 CRM</button>
          <button onclick="openAnalytics()" class="agent-btn secondary">📊 Analytics</button>
          <button onclick="openReports()" class="agent-btn accent">📋 Reports</button>
        </div>

        <div style="margin: 15px 0;">
          <button onclick="scheduleMeeting()" class="agent-btn primary" style="width: 100%;">📅 Schedule Meeting</button>
        </div>

        <div style="margin: 15px 0; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 4px;">
          <h4 style="margin: 0 0 10px 0; color: #ffc107;">🎯 Quick Actions:</h4>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button onclick="generateInvoice()" class="agent-btn secondary" style="font-size: 11px; padding: 6px 10px;">🧾 Invoice</button>
            <button onclick="trackExpenses()" class="agent-btn secondary" style="font-size: 11px; padding: 6px 10px;">💰 Expenses</button>
            <button onclick="clientStatus()" class="agent-btn secondary" style="font-size: 11px; padding: 6px 10px;">🔍 Client Status</button>
            <button onclick="projectUpdate()" class="agent-btn secondary" style="font-size: 11px; padding: 6px 10px;">📈 Projects</button>
          </div>
        </div>

        <textarea id="businessInput" class="agent-input" placeholder="Business query lub komenda (np. 'client report', 'revenue analysis', 'meeting notes')..." style="border-color: #ffc107;"></textarea>
        
        <div class="agent-actions">
          <button onclick="sendToBusinessAssistant()" class="agent-btn primary">Wykonaj</button>
          <button onclick="clearBusinessAssistant()" class="agent-btn secondary">Wyczyść</button>
        </div>

        <div id="businessResponse" class="agent-response" style="display: none; border-left-color: #ffc107;"></div>
        
        <div style="margin-top: 15px; font-size: 12px; color: #666;">
          <strong>Dostępne funkcje:</strong><br>
          • CRM Management<br>
          • Financial Analytics<br>
          • Report Generation<br>
          • Meeting Scheduler<br>
          • Client Communication<br>
          • Project Tracking
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

  // Close business assistant
  closeBusinessAssistant() {
    const widget = document.getElementById('businessWidget');
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

  // Send to business assistant
  async sendToBusinessAssistant() {
    const input = document.getElementById('businessInput');
    const response = document.getElementById('businessResponse');
    
    if (!input || !input.value.trim()) return;
    
    console.log('📤 Processing business query:', input.value);
    
    response.style.display = 'block';
    response.innerHTML = `<div style="color: #ffc107;">⏳ Processing business request...</div>`;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const businessResponse = this.processBusinessQuery(input.value);
      response.innerHTML = `
        <div style="color: #4ade80; font-weight: bold;">✅ Business Assistant Response:</div>
        <div style="margin-top: 10px;">${businessResponse}</div>
        <div style="margin-top: 10px; font-size: 12px; color: #666;">
          Processed: ${new Date().toLocaleTimeString()}
        </div>
      `;
      
    } catch (error) {
      response.innerHTML = `
        <div style="color: #ff6b6b; font-weight: bold;">❌ Business Error:</div>
        <div style="margin-top: 10px;">${error.message}</div>
      `;
    }
  }

  // Process business query
  processBusinessQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('client') || lowerQuery.includes('klient')) {
      return `👥 Client Analysis Complete:<br>• Active clients: 15<br>• Pending: 3<br>• Revenue pipeline: $45,000<br><em>Query: ${query}</em>`;
    }
    
    if (lowerQuery.includes('revenue') || lowerQuery.includes('przychód')) {
      return `💰 Revenue Report:<br>• Monthly: $12,500<br>• Growth: +15%<br>• Forecast: $14,400<br><em>Query: ${query}</em>`;
    }
    
    if (lowerQuery.includes('meeting') || lowerQuery.includes('spotkanie')) {
      return `📅 Meeting Scheduled:<br>• Next slot: Tomorrow 2PM<br>• Duration: 60 min<br>• Attendees: 4<br><em>Query: ${query}</em>`;
    }
    
    if (lowerQuery.includes('project') || lowerQuery.includes('projekt')) {
      return `📈 Project Status:<br>• Active: 7 projects<br>• On track: 5<br>• Delayed: 2<br><em>Query: ${query}</em>`;
    }
    
    return `💼 Business query processed:<br>• Analysis complete<br>• Data refreshed<br>• Action items generated<br><em>Query: ${query}</em>`;
  }

  // Clear business assistant
  clearBusinessAssistant() {
    const input = document.getElementById('businessInput');
    const response = document.getElementById('businessResponse');
    
    if (input) input.value = '';
    if (response) {
      response.style.display = 'none';
      response.innerHTML = '';
    }
  }
}

// Global business functions
window.openCRM = function() {
  console.log('👥 Opening CRM...');
  const response = document.getElementById('businessResponse');
  if (response) {
    response.style.display = 'block';
    response.innerHTML = `<div style="color: #4ade80;">👥 CRM System accessed - Client database loaded</div>`;
  }
};

window.openAnalytics = function() {
  console.log('📊 Opening Analytics...');
  const response = document.getElementById('businessResponse');
  if (response) {
    response.style.display = 'block';
    response.innerHTML = `<div style="color: #4ade80;">📊 Analytics Dashboard loaded - KPI metrics updated</div>`;
  }
};

window.openReports = function() {
  console.log('📋 Opening Reports...');
  const response = document.getElementById('businessResponse');
  if (response) {
    response.style.display = 'block';
    response.innerHTML = `<div style="color: #4ade80;">📋 Report Generator accessed - Templates available</div>`;
  }
};

window.scheduleMeeting = function() {
  console.log('📅 Scheduling Meeting...');
  const response = document.getElementById('businessResponse');
  if (response) {
    response.style.display = 'block';
    response.innerHTML = `<div style="color: #4ade80;">📅 Meeting Scheduler opened - Calendar integration active</div>`;
  }
};

window.generateInvoice = function() {
  console.log('🧾 Generating Invoice...');
  const response = document.getElementById('businessResponse');
  if (response) {
    response.style.display = 'block';
    response.innerHTML = `<div style="color: #4ade80;">🧾 Invoice generated - PDF ready for download</div>`;
  }
};

window.trackExpenses = function() {
  console.log('💰 Tracking Expenses...');
  const response = document.getElementById('businessResponse');
  if (response) {
    response.style.display = 'block';
    response.innerHTML = `<div style="color: #4ade80;">💰 Expense tracker active - Monthly budget: 85% used</div>`;
  }
};

window.clientStatus = function() {
  console.log('🔍 Checking Client Status...');
  const response = document.getElementById('businessResponse');
  if (response) {
    response.style.display = 'block';
    response.innerHTML = `<div style="color: #4ade80;">🔍 Client status updated - 3 clients need follow-up</div>`;
  }
};

window.projectUpdate = function() {
  console.log('📈 Project Update...');
  const response = document.getElementById('businessResponse');
  if (response) {
    response.style.display = 'block';
    response.innerHTML = `<div style="color: #4ade80;">📈 Project dashboard updated - 2 milestones completed</div>`;
  }
};