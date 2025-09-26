// Loading States Manager
class LoadingManager {
  constructor() {
    this.activeLoaders = new Set();
    this.setupGlobalLoader();
  }

  setupGlobalLoader() {
    // Create global loading overlay
    const overlay = document.createElement('div');
    overlay.id = 'global-loading-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;
    
    overlay.innerHTML = `
      <div style="
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        color: white;
      ">
        <div class="spinner" style="
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid #00d9ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        "></div>
        <div id="loading-text">Ładowanie...</div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  show(message = 'Ładowanie...', id = 'default') {
    this.activeLoaders.add(id);
    
    const overlay = document.getElementById('global-loading-overlay');
    const loadingText = document.getElementById('loading-text');
    
    if (overlay && loadingText) {
      loadingText.textContent = message;
      overlay.style.display = 'flex';
    }
  }

  hide(id = 'default') {
    this.activeLoaders.delete(id);
    
    // Hide only if no other loaders are active
    if (this.activeLoaders.size === 0) {
      const overlay = document.getElementById('global-loading-overlay');
      if (overlay) {
        overlay.style.display = 'none';
      }
    }
  }

  // Button loading state
  setButtonLoading(buttonElement, isLoading = true) {
    if (isLoading) {
      buttonElement.disabled = true;
      buttonElement.originalText = buttonElement.textContent;
      buttonElement.textContent = '⏳ Ładowanie...';
      buttonElement.style.opacity = '0.7';
    } else {
      buttonElement.disabled = false;
      buttonElement.textContent = buttonElement.originalText || buttonElement.textContent;
      buttonElement.style.opacity = '1';
    }
  }

  // API call wrapper with loading
  async withLoading(asyncFunction, message = 'Przetwarzanie...', id = 'api-call') {
    this.show(message, id);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      this.hide(id);
    }
  }
}

// Initialize loading manager
const loadingManager = new LoadingManager();

// Make it globally available
window.loadingManager = loadingManager;

// Export
export { LoadingManager };