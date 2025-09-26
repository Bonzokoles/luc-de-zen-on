class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.setupGlobalErrorHandling();
  }

  setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', event.reason);
    });
  }

  logError(type, error, context = {}) {
    const errorData = {
      type,
      message: error?.message || error,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context
    };
    
    this.errors.push(errorData);
    console.error(`🚨 ${type}:`, errorData);
    
    // Wyślij do systemu monitorowania
    this.sendToMonitoring(errorData);
  }

  async sendToMonitoring(errorData) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      });
    } catch (e) {
      console.warn('Failed to send error to monitoring:', e);
    }
  }

  getErrorReport() {
    return {
      totalErrors: this.errors.length,
      recentErrors: this.errors.slice(-10),
      errorTypes: this.groupErrorsByType()
    };
  }

  groupErrorsByType() {
    return this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {});
  }
}

export default ErrorMonitor;