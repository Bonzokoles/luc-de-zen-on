// Error Boundary Component dla React/Astro
class ErrorHandler {
  constructor() {
    this.errors = [];
    this.setupGlobalErrorHandling();
  }

  setupGlobalErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', event.error, event.filename, event.lineno);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', event.reason);
    });

    // API errors
    this.interceptFetch();
  }

  logError(type, error, file = '', line = 0) {
    const errorInfo = {
      type,
      message: error?.message || error,
      file,
      line,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errors.push(errorInfo);
    
    // Send to console
    console.error(`[${type}]`, errorInfo);
    
    // Send to admin if needed
    if (this.errors.length > 10) {
      this.sendErrorsToAdmin();
    }
  }

  interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok && response.status >= 400) {
          this.logError('API Error', `${response.status}: ${response.statusText}`, args[0]);
        }
        return response;
      } catch (error) {
        this.logError('Network Error', error, args[0]);
        throw error;
      }
    };
  }

  async sendErrorsToAdmin() {
    try {
      await fetch('/api/admin/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errors: this.errors })
      });
      this.errors = []; // Clear after sending
    } catch (e) {
      console.error('Failed to send errors to admin:', e);
    }
  }

  getRecentErrors(limit = 5) {
    return this.errors.slice(-limit);
  }

  showUserFriendlyError(message = 'Wystąpił problem. Spróbuj ponownie.') {
    // Create user-friendly error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.innerHTML = `
      <div style="display: flex; justify-content: between; align-items: center;">
        <span>⚠️ ${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          margin-left: 10px;
        ">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
}

// Initialize error handler
const errorHandler = new ErrorHandler();

// Make it globally available
window.errorHandler = errorHandler;

// Export dla Astro components
export { ErrorHandler };