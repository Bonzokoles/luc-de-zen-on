// Main Chat Core Functions
// Central chat interface and communication hub

export class MainChatAgentFunctions {
  constructor() {
    this.isActive = false;
    this.chatHistory = [];
  }

  // Bind to global scope for right-panel integration
  bindToRightPanel() {
    window.openMainChat = this.openMainChat.bind(this);
    window.toggleMainChat = this.toggleMainChat.bind(this);
    window.closeMainChat = this.closeMainChat.bind(this);
    window.sendToMainChat = this.sendToMainChat.bind(this);
    window.clearMainChat = this.clearMainChat.bind(this);
  }

  // Open main chat
  openMainChat() {
    console.log('💬 Opening Main Chat...');
    this.createChatWidget();
    this.isActive = true;
  }

  // Toggle chat widget
  toggleMainChat() {
    if (this.isActive) {
      this.closeMainChat();
    } else {
      this.openMainChat();
    }
  }

  // Create chat widget
  createChatWidget() {
    const existingWidget = document.getElementById('mainChatWidget');
    if (existingWidget) {
      existingWidget.classList.remove('hidden');
      return;
    }

    const widget = document.createElement('div');
    widget.id = 'mainChatWidget';
    widget.className = 'floating-widget';
    widget.style.cssText = `
      position: fixed;
      top: 10%;
      right: 20px;
      width: 400px;
      height: 600px;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(15, 56, 70, 0.9));
      border: 1px solid #1be1ff;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      z-index: 10000;
      overflow: hidden;
      backdrop-filter: blur(10px);
      display: flex;
      flex-direction: column;
    `;

    widget.innerHTML = `
      <div class="agent-panel-header">
        <span>💬 MAIN CHAT</span>
        <button onclick="closeMainChat()" class="close-btn">×</button>
      </div>
      <div class="agent-panel-content" style="flex: 1; display: flex; flex-direction: column; padding: 0;">
        <div style="padding: 15px 15px 10px 15px;">
          <div style="margin-bottom: 15px; padding: 10px; background: rgba(27, 225, 255, 0.1); border-radius: 4px;">
            <span style="color: #1be1ff; font-weight: bold;">💬 CHAT HUB</span>
            <div style="font-size: 12px; color: #ccc; margin-top: 5px;">Centralny system komunikacji</div>
          </div>
          
          <div class="agent-controls">
            <button onclick="connectToAssistant()" class="agent-btn primary">🤖 AI Assistant</button>
            <button onclick="openChannels()" class="agent-btn secondary">📺 Channels</button>
            <button onclick="chatHistory()" class="agent-btn accent">📋 History</button>
          </div>
        </div>

        <div id="chatMessages" style="flex: 1; padding: 0 15px; overflow-y: auto; background: rgba(0, 0, 0, 0.2); margin: 0 10px; border-radius: 8px; max-height: 300px;">
          <div style="padding: 15px; color: #ccc; text-align: center; font-size: 14px;">
            💬 Witaj w Main Chat!<br>
            <small>Rozpocznij rozmowę wpisując wiadomość poniżej</small>
          </div>
        </div>

        <div style="padding: 15px;">
          <textarea id="chatInput" class="agent-input" placeholder="Wpisz swoją wiadomość..." style="border-color: #1be1ff; height: 80px; resize: none;"></textarea>
          
          <div class="agent-actions" style="margin-top: 10px;">
            <button onclick="sendToMainChat()" class="agent-btn primary">📤 Wyślij</button>
            <button onclick="clearMainChat()" class="agent-btn secondary">🗑️ Wyczyść</button>
          </div>

          <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
            <button onclick="quickMessage('status')" class="agent-btn secondary" style="font-size: 11px; padding: 4px 8px;">📊 Status</button>
            <button onclick="quickMessage('help')" class="agent-btn secondary" style="font-size: 11px; padding: 4px 8px;">❓ Help</button>
            <button onclick="quickMessage('agents')" class="agent-btn secondary" style="font-size: 11px; padding: 4px 8px;">🤖 Agents</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
    
    // Animate in
    setTimeout(() => {
      widget.style.opacity = '1';
      widget.style.transform = 'scale(1)';
    }, 10);
  }

  // Close chat
  closeMainChat() {
    const widget = document.getElementById('mainChatWidget');
    if (widget) {
      widget.style.opacity = '0';
      widget.style.transform = 'scale(0.9)';
      setTimeout(() => {
        if (widget.parentNode) {
          widget.parentNode.removeChild(widget);
        }
      }, 200);
    }
    this.isActive = false;
  }

  // Send to chat
  async sendToMainChat() {
    const input = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('chatMessages');
    
    if (!input || !input.value.trim()) return;
    
    const message = input.value.trim();
    console.log('📤 Sending chat message:', message);
    
    // Add user message
    this.addMessage('user', message);
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    this.addMessage('system', '⏳ Assistant is typing...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove typing indicator
      const messages = messagesContainer.querySelectorAll('.message');
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.textContent.includes('typing')) {
        messagesContainer.removeChild(lastMessage);
      }
      
      // Add response
      const response = this.generateChatResponse(message);
      this.addMessage('assistant', response);
      
    } catch (error) {
      this.addMessage('error', `❌ Error: ${error.message}`);
    }
  }

  // Add message to chat
  addMessage(type, content) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.style.cssText = `
      margin: 10px 0;
      padding: 10px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.4;
      ${type === 'user' ? 'background: rgba(27, 225, 255, 0.1); border-left: 3px solid #1be1ff; margin-left: 20px;' : ''}
      ${type === 'assistant' ? 'background: rgba(74, 222, 128, 0.1); border-left: 3px solid #4ade80; margin-right: 20px;' : ''}
      ${type === 'system' ? 'background: rgba(255, 193, 7, 0.1); border-left: 3px solid #ffc107; text-align: center; font-style: italic;' : ''}
      ${type === 'error' ? 'background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444;' : ''}
    `;
    
    const timestamp = new Date().toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    messageDiv.innerHTML = `
      <div>${content}</div>
      <div style="font-size: 11px; color: #666; margin-top: 5px; text-align: right;">${timestamp}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store in history
    this.chatHistory.push({
      type,
      content,
      timestamp: new Date()
    });
  }

  // Generate chat response
  generateChatResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('status')) {
      return `📊 System Status:<br>• Agents: 20 active<br>• Services: All operational<br>• Memory: 67% used<br>• Uptime: 99.9%`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('pomoc')) {
      return `❓ Available Commands:<br>• "status" - system status<br>• "agents" - list agents<br>• "weather" - weather info<br>• "time" - current time<br>• Type any question for AI assistance`;
    }
    
    if (lowerMessage.includes('agents') || lowerMessage.includes('agent')) {
      return `🤖 Active Agents:<br>• Voice Agent ✅<br>• Music Agent ✅<br>• System Agent ✅<br>• Business Agent ✅<br>• MCP Services ✅`;
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('pogoda')) {
      return `🌤️ Weather Update:<br>• Temperature: 22°C<br>• Condition: Partly cloudy<br>• Humidity: 65%<br>• Wind: 12 km/h`;
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('czas')) {
      const now = new Date();
      return `🕐 Current Time:<br>• ${now.toLocaleTimeString('pl-PL')}<br>• ${now.toLocaleDateString('pl-PL')}<br>• Timezone: Europe/Warsaw`;
    }
    
    return `💬 I understand: "${message}"<br><br>I'm your AI assistant! I can help with:<br>• System monitoring<br>• Agent management<br>• Information queries<br>• Task automation<br><br>What would you like to know?`;
  }

  // Clear chat
  clearMainChat() {
    const input = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('chatMessages');
    
    if (input) input.value = '';
    if (messagesContainer) {
      messagesContainer.innerHTML = `
        <div style="padding: 15px; color: #ccc; text-align: center; font-size: 14px;">
          💬 Chat cleared!<br>
          <small>Start a new conversation</small>
        </div>
      `;
    }
    
    this.chatHistory = [];
  }
}

// Global chat functions
window.connectToAssistant = function() {
  console.log('🤖 Connecting to AI Assistant...');
  const messagesContainer = document.getElementById('chatMessages');
  if (messagesContainer) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'padding: 10px; color: #4ade80; text-align: center; font-style: italic;';
    messageDiv.innerHTML = '🤖 AI Assistant connected - Ready to help!';
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
};

window.openChannels = function() {
  console.log('📺 Opening Channels...');
  const messagesContainer = document.getElementById('chatMessages');
  if (messagesContainer) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'padding: 10px; color: #1be1ff; text-align: center; font-style: italic;';
    messageDiv.innerHTML = '📺 Available channels: #general, #agents, #support, #updates';
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
};

window.chatHistory = function() {
  console.log('📋 Loading Chat History...');
  const messagesContainer = document.getElementById('chatMessages');
  if (messagesContainer && window.mainChatAgentFunctions) {
    const history = window.mainChatAgentFunctions.chatHistory;
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'padding: 10px; color: #ffc107; text-align: center; font-style: italic;';
    messageDiv.innerHTML = `📋 Chat history: ${history.length} messages stored`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
};

window.quickMessage = function(type) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = type;
    window.sendToMainChat();
  }
};