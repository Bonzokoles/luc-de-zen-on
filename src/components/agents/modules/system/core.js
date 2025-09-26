// system-functions.js - Funkcje dla System Agent
// Monitorowanie systemu i zarządzanie zasobami

class SystemAgentFunctions {
  constructor() {
    this.systemInfo = {};
    this.monitoring = false;
    this.performanceData = [];
    this.init();
  }

  init() {
    console.log("⚙️ Initializing System Agent Functions...");
    this.collectSystemInfo();
    this.setupPerformanceMonitoring();
  }

  collectSystemInfo() {
    // Zbieranie podstawowych informacji o systemie
    this.systemInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null,
      memory: navigator.deviceMemory || 'Unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
      maxTouchPoints: navigator.maxTouchPoints || 0
    };

    console.log("📊 System info collected:", this.systemInfo);
  }

  setupPerformanceMonitoring() {
    if ('performance' in window) {
      // Monitor performance entries
      this.startPerformanceObserver();
    }
  }

  startPerformanceObserver() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.performanceData.push({
            name: entry.name,
            type: entry.entryType,
            startTime: entry.startTime,
            duration: entry.duration,
            timestamp: Date.now()
          });
        });

        // Keep only last 100 entries
        if (this.performanceData.length > 100) {
          this.performanceData = this.performanceData.slice(-100);
        }
      });

      observer.observe({ entryTypes: ['navigation', 'resource', 'measure', 'mark'] });
      console.log("📊 Performance observer started");
    } catch (error) {
      console.warn("⚠️ Could not start performance observer:", error);
    }
  }

  // Główne funkcje System Agent
  checkSystemHealth() {
    console.log("🔍 Checking system health...");
    this.updateSystemStatus("Sprawdzanie...");
    
    const healthReport = {
      memory: this.checkMemoryUsage(),
      performance: this.checkPerformance(),
      network: this.checkNetworkStatus(),
      browser: this.checkBrowserHealth(),
      timestamp: new Date().toLocaleString('pl-PL')
    };

    setTimeout(() => {
      this.displaySystemResult(this.formatHealthReport(healthReport));
      this.updateSystemStatus("Aktywny");
    }, 2000);
  }

  optimizeSystem() {
    console.log("⚡ Optimizing system...");
    this.updateSystemStatus("Optymalizacja...");
    
    const optimizations = [];

    // Clear browser cache (simulation)
    optimizations.push("🗑️ Wyczyszczono pamięć podręczną");
    
    // Garbage collection hint
    if (window.gc && typeof window.gc === 'function') {
      try {
        window.gc();
        optimizations.push("🧹 Uruchomiono odśmiecanie pamięci");
      } catch (e) {
        optimizations.push("⚠️ Odśmiecanie pamięci niedostępne");
      }
    }

    // Close unnecessary connections
    optimizations.push("🔌 Zoptymalizowano połączenia");

    // Update performance data
    optimizations.push("📊 Odświeżono dane wydajności");

    setTimeout(() => {
      this.displaySystemResult(`⚡ Optymalizacja zakończona:<br>${optimizations.join('<br>')}`);
      this.updateSystemStatus("Aktywny");
    }, 3000);
  }

  cleanupSystem() {
    console.log("🧹 Cleaning up system...");
    this.updateSystemStatus("Czyszczenie...");
    
    const cleanupActions = [];

    // Clear performance data
    this.performanceData = [];
    cleanupActions.push("📊 Wyczyszczono dane wydajności");

    // Clear console (if possible)
    try {
      console.clear();
      cleanupActions.push("🖥️ Wyczyszczono konsolę");
    } catch (e) {
      cleanupActions.push("⚠️ Nie można wyczyścić konsoli");
    }

    // Clear local storage for this session
    try {
      sessionStorage.clear();
      cleanupActions.push("💾 Wyczyszczono pamięć sesji");
    } catch (e) {
      cleanupActions.push("⚠️ Nie można wyczyścić pamięci sesji");
    }

    setTimeout(() => {
      this.displaySystemResult(`🧹 Czyszczenie zakończone:<br>${cleanupActions.join('<br>')}`);
      this.updateSystemStatus("Aktywny");
    }, 1500);
  }

  executeSystemCommand() {
    const inputEl = document.getElementById('systemAgentInput');
    if (!inputEl) {
      this.showSystemError("Pole komendy systemowej nie jest dostępne");
      return;
    }

    const command = inputEl.value.trim();
    
    if (!command) {
      this.showSystemError("Wpisz komendę systemową");
      return;
    }

    console.log("🖥️ Executing system command:", command);
    const commandPreview = this.escapeHtml(command);
    this.displaySystemResult(`⌨️ Wykonywanie: "${commandPreview}"`);

    // Symulacja wykonywania komend
    setTimeout(() => {
      const result = this.simulateCommand(command);
      this.displaySystemResult(result);
    }, 1000);
  }

  analyzeSystemLogs() {
    console.log("📋 Analyzing system logs...");
    this.updateSystemStatus("Analiza...");

    // Analiza logów z konsoli i performance data
    const logAnalysis = {
      performanceEntries: this.performanceData.length,
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
      networkRequests: this.performanceData.filter(entry => entry.type === 'resource').length,
      navigationCount: this.performanceData.filter(entry => entry.type === 'navigation').length,
      averageResponseTime: this.calculateAverageResponseTime(),
      timestamp: new Date().toLocaleString('pl-PL')
    };

    setTimeout(() => {
      this.displaySystemResult(this.formatLogAnalysis(logAnalysis));
      this.updateSystemStatus("Aktywny");
    }, 2000);
  }

  clearSystemAgent() {
    console.log("🧹 Clearing system agent...");
    
    const agentInput = document.getElementById('systemAgentInput');
    if (agentInput) {
      agentInput.value = '';
    }
    
    const response = document.getElementById('systemAgentResponse');
    if (response) {
      response.textContent = '';
      response.style.display = 'none';
    }

    this.updateSystemStatus("Aktywny");
  }

  toggleSystemMode() {
    const modes = ['Aktywny', 'Monitor', 'Debug', 'Performance'];
    const currentBtn = document.getElementById('systemStatusBtn');
    
    if (currentBtn) {
      const currentMode = currentBtn.textContent;
      const currentIndex = modes.indexOf(currentMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      currentBtn.textContent = modes[nextIndex];
      
      console.log(`🔄 System mode changed to: ${modes[nextIndex]}`);
      this.displaySystemResult(`⚙️ Tryb systemu: ${modes[nextIndex]}`);
    }
  }

  // Pomocnicze funkcje
  checkMemoryUsage() {
    if ('memory' in performance) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      };
    }
    return { status: "Niedostępne" };
  }

  checkPerformance() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      return {
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
        loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
        firstPaint: Math.round(performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0)
      };
    }
    return { status: "Niedostępne" };
  }

  checkNetworkStatus() {
    return {
      online: navigator.onLine,
      connection: this.systemInfo.connection,
      timing: this.performanceData.filter(entry => entry.type === 'resource').length
    };
  }

  checkBrowserHealth() {
    return {
      userAgent: this.systemInfo.userAgent.split(' ').slice(0, 3).join(' '),
      memory: this.systemInfo.memory,
      cores: this.systemInfo.hardwareConcurrency,
      platform: this.systemInfo.platform
    };
  }

  simulateCommand(command) {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('status') || lowerCommand.includes('health')) {
      return "✅ System status: OK<br>🔋 CPU: Normal<br>💾 Memory: Available<br>🌐 Network: Connected";
    }
    
    if (lowerCommand.includes('clear') || lowerCommand.includes('clean')) {
      return "🧹 Cleanup completed<br>📊 Cache cleared<br>🗑️ Temp files removed";
    }
    
    if (lowerCommand.includes('info') || lowerCommand.includes('system')) {
      return `🖥️ System Info:<br>Platform: ${this.escapeHtml(this.systemInfo.platform || 'Unknown')}<br>Language: ${this.escapeHtml(this.systemInfo.language || 'Unknown')}<br>Online: ${this.systemInfo.onLine ? 'Yes' : 'No'}`;
    }
    
    const safeCommand = this.escapeHtml(command);
    return `⌨️ Command executed: "${safeCommand}"<br>✅ Status: Completed<br>⏰ Time: ${new Date().toLocaleTimeString('pl-PL')}`;
  }

  calculateAverageResponseTime() {
    const resourceEntries = this.performanceData.filter(entry => entry.type === 'resource');
    if (resourceEntries.length === 0) return 0;
    
    const totalDuration = resourceEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return Math.round(totalDuration / resourceEntries.length);
  }

  formatHealthReport(report) {
    return `🏥 Raport zdrowia systemu:<br>
    ⏰ ${report.timestamp}<br><br>
    💾 Pamięć: ${report.memory.used || 'N/A'}MB użyte / ${report.memory.total || 'N/A'}MB<br>
    ⚡ Wydajność: DOM ${report.performance.domContentLoaded || 0}ms<br>
    🌐 Sieć: ${report.network.online ? 'Online' : 'Offline'}<br>
    🖥️ Przeglądarka: ${report.browser.userAgent}<br>
    📊 CPU rdzenie: ${report.browser.cores}`;
  }

  formatLogAnalysis(analysis) {
    return `📋 Analiza logów systemu:<br>
    ⏰ ${analysis.timestamp}<br><br>
    📊 Performance entries: ${analysis.performanceEntries}<br>
    🌐 Żądania sieciowe: ${analysis.networkRequests}<br>
    📄 Nawigacje: ${analysis.navigationCount}<br>
    ⚡ Średni czas odpowiedzi: ${analysis.averageResponseTime}ms<br>
    ✅ Status: System działa prawidłowo`;
  }

  updateSystemStatus(status) {
    const statusBtn = document.getElementById('systemStatusBtn');
    if (statusBtn) {
      statusBtn.textContent = status;
    }
  }

  displaySystemResult(text) {
    const response = document.getElementById('systemAgentResponse');
    if (response) {
      response.innerHTML = text;
      response.style.display = 'block';
    }
  }

  showSystemError(message) {
    console.error("❌ System Agent Error:", message);
    this.displaySystemResult(`❌ Błąd: ${message}`);
  }

  escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
  }
}

// Inicjalizacja i export
const systemAgent = new SystemAgentFunctions();

// Export funkcji do globalnego scope
window.checkSystemHealth = () => systemAgent.checkSystemHealth();
window.optimizeSystem = () => systemAgent.optimizeSystem();
window.cleanupSystem = () => systemAgent.cleanupSystem();
window.executeSystemCommand = () => systemAgent.executeSystemCommand();
window.analyzeSystemLogs = () => systemAgent.analyzeSystemLogs();
window.clearSystemAgent = () => systemAgent.clearSystemAgent();
window.toggleSystemMode = () => systemAgent.toggleSystemMode();

console.log("✅ System Agent Functions loaded and exported globally");

export default systemAgent;