class AnalyticsManager {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.setupTracking();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setupTracking() {
    // Track page views
    this.track('page_view', {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });

    // Track clicks on AI function buttons
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[onclick*="openFunction"], .ai-function-card');
      if (button) {
        const functionName = this.extractFunctionName(button);
        this.track('ai_function_click', {
          function: functionName,
          element: button.tagName.toLowerCase()
        });
      }
    });
  }

  extractFunctionName(element) {
    // Extract function name from onclick or data attributes
    const onclick = element.getAttribute('onclick');
    if (onclick) {
      const match = onclick.match(/openFunction\(['"]([^'"]+)['"]\)/);
      if (match) return match[1];
    }
    
    return element.textContent?.trim()?.substring(0, 50) || 'unknown';
  }

  track(eventName, data = {}) {
    const event = {
      name: eventName,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: window.location.href
    };
    
    this.events.push(event);
    
    // Send to server if online
    if (navigator.onLine) {
      this.sendEvent(event);
    } else {
      // Queue for later when online
      this.queueEvent(event);
    }
  }

  async sendEvent(event) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.warn('Failed to send analytics:', error);
      this.queueEvent(event);
    }
  }

  queueEvent(event) {
    const queue = JSON.parse(localStorage.getItem('analytics_queue') || '[]');
    queue.push(event);
    localStorage.setItem('analytics_queue', JSON.stringify(queue));
  }
}

export default AnalyticsManager;