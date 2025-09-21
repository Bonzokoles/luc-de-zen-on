// Kaggle Worker API Integration
// Komunikacja frontend-backend dla Kaggle Worker

class KaggleAPI {
  constructor() {
    this.baseUrl = 'https://mybonzo.com/api/polaczek/kaggle';
    this.endpoints = {
      datasets: '/datasets',
      search: '/search',
      download: '/download',
      competitions: '/competitions',
      kernels: '/kernels',
      status: '/status'
    };
  }

  // Wyszukaj datasety Kaggle
  async searchDatasets(query, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.search}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          query: query,
          search_type: 'datasets',
          options: {
            language: 'polish',
            category: options.category || 'all',
            size: options.size || 'any',
            license: options.license || 'any',
            ...options
          },
          timestamp: new Date().toISOString(),
          user_context: this.getUserContext()
        })
      });

      if (!response.ok) {
        throw new Error(`Kaggle API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Kaggle Search Error:', error);
      throw error;
    }
  }

  // Pobierz informacje o datasetach
  async getDatasets(filters = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.datasets}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filters: {
            focus: 'polish-nlp,sentiment-analysis,qa-datasets',
            language: 'polish',
            ...filters
          },
          timestamp: new Date().toISOString()
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Kaggle Datasets Error:', error);
      throw error;
    }
  }

  // Pobierz informacje o konkursach
  async getCompetitions(category = 'nlp') {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.competitions}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: category,
          active: true,
          language_focus: 'polish',
          timestamp: new Date().toISOString()
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Kaggle Competitions Error:', error);
      throw error;
    }
  }

  // Pobierz kernels/notebooks
  async getKernels(topic = 'polish-nlp') {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.kernels}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: topic,
          language: 'python',
          sort_by: 'votes',
          timestamp: new Date().toISOString()
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Kaggle Kernels Error:', error);
      throw error;
    }
  }

  // Inicjuj pobieranie datasetu
  async downloadDataset(datasetUrl, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.download}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dataset_url: datasetUrl,
          download_options: {
            format: options.format || 'csv',
            compress: options.compress !== false,
            ...options
          },
          timestamp: new Date().toISOString()
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Kaggle Download Error:', error);
      throw error;
    }
  }

  // Status serwisu
  async getStatus() {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.status}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Kaggle Status Error:', error);
      throw error;
    }
  }

  // Helper: Kontekst użytkownika
  getUserContext() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString()
    };
  }
}

// Funkcje pomocnicze dla interfejsu
class KaggleInterface {
  constructor() {
    this.api = new KaggleAPI();
  }

  // Otwórz popup Kaggle
  openKagglePopup() {
    if (typeof window.openWorkerPopup === 'function') {
      window.openWorkerPopup(
        'Kaggle',
        'https://mybonzo.com/api/polaczek/kaggle/search',
        '🏆 Kaggle Research - Datasety i Konkursy'
      );
    } else {
      console.error('WorkerCommunicationPopup not available');
    }
  }

  // Szybkie wyszukiwanie
  async quickSearch(searchType) {
    const searches = {
      'polish-nlp': {
        query: 'polish natural language processing',
        options: { category: 'nlp', language: 'polish' }
      },
      'sentiment': {
        query: 'polish sentiment analysis',
        options: { category: 'text', language: 'polish' }
      },
      'qa-datasets': {
        query: 'polish question answering',
        options: { category: 'nlp', language: 'polish' }
      },
      'competitions': {
        query: 'nlp competitions',
        options: { category: 'competitions', active: true }
      }
    };

    const searchConfig = searches[searchType];
    if (searchConfig) {
      try {
        const result = await this.api.searchDatasets(searchConfig.query, searchConfig.options);
        this.displayQuickResult(searchType, result);
        return result;
      } catch (error) {
        console.error(`Quick Search ${searchType} Error:`, error);
        alert(`Błąd wyszukiwania ${searchType}: ${error.message}`);
      }
    }
  }

  // Wyświetl szybki wynik
  displayQuickResult(searchType, result) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'kaggle-quick-result';
    resultDiv.innerHTML = `
      <div class="quick-result-header">
        <h4>🏆 ${searchType.toUpperCase()} - Wynik Wyszukiwania</h4>
        <span class="result-timestamp">${new Date().toLocaleString()}</span>
        <button class="close-result" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
      <div class="quick-result-content">
        <div class="result-summary">
          <strong>Znaleziono: ${result.datasets?.length || result.total || 0} wyników</strong>
        </div>
        <div class="result-details">
          <pre>${JSON.stringify(result, null, 2)}</pre>
        </div>
      </div>
    `;

    // Dodaj do istniejącego kontenera lub utwórz nowy
    let container = document.getElementById('kaggle-results-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'kaggle-results-container';
      container.className = 'kaggle-results-container';
      document.body.appendChild(container);
    }

    container.appendChild(resultDiv);

    // Auto-remove po 45 sekundach
    setTimeout(() => {
      if (resultDiv.parentNode) {
        resultDiv.remove();
      }
    }, 45000);
  }

  // Browse popularnych datasetów
  async browsePopularDatasets() {
    try {
      const result = await this.api.getDatasets({
        sort_by: 'votes',
        category: 'nlp',
        language: 'polish'
      });
      
      this.displayDatasetBrowser(result);
      return result;
    } catch (error) {
      console.error('Browse Popular Datasets Error:', error);
      alert(`Błąd przeglądania datasetów: ${error.message}`);
    }
  }

  // Wyświetl przeglądarkę datasetów
  displayDatasetBrowser(datasets) {
    const browserDiv = document.createElement('div');
    browserDiv.className = 'kaggle-dataset-browser';
    browserDiv.innerHTML = `
      <div class="dataset-browser-header">
        <h3>📚 Popularne Polskie Datasety Kaggle</h3>
        <button class="close-browser" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
      <div class="dataset-browser-content">
        ${datasets.datasets ? datasets.datasets.map(dataset => `
          <div class="dataset-item">
            <h5>${dataset.title || dataset.name}</h5>
            <p>${dataset.description || 'Brak opisu'}</p>
            <div class="dataset-stats">
              <span>👍 ${dataset.votes || 0}</span>
              <span>📥 ${dataset.downloads || 0}</span>
              <span>📊 ${dataset.size || 'N/A'}</span>
            </div>
            <a href="${dataset.url || '#'}" target="_blank" class="dataset-link">Otwórz na Kaggle</a>
          </div>
        `).join('') : '<p>Brak dostępnych datasetów</p>'}
      </div>
    `;

    document.body.appendChild(browserDiv);

    // Auto-remove po 60 sekundach
    setTimeout(() => {
      if (browserDiv.parentNode) {
        browserDiv.remove();
      }
    }, 60000);
  }

  // Test połączenia
  async testConnection() {
    try {
      const status = await this.api.getStatus();
      console.log('Kaggle Connection Test:', status);
      
      if (status.status === 'ok' || status.ready) {
        alert('✅ Kaggle Worker - Połączenie OK!');
      } else {
        alert('⚠️ Kaggle Worker - Problemy z połączeniem');
      }
      
      return status;
    } catch (error) {
      alert(`❌ Kaggle Worker - Błąd połączenia: ${error.message}`);
      console.error('Kaggle Connection Test Error:', error);
    }
  }
}

// Style dla Kaggle wyników
const kaggleStyles = `
<style>
.kaggle-results-container {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9999;
  max-width: 400px;
}

.kaggle-quick-result {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);
  animation: slideInLeft 0.3s ease-out;
}

.quick-result-header {
  background: rgba(255, 193, 7, 0.2);
  padding: 10px 15px;
  border-bottom: 1px solid rgba(255, 193, 7, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.quick-result-header h4 {
  margin: 0;
  color: #ffc107;
  font-family: 'Orbitron', monospace;
  font-size: 14px;
  flex-grow: 1;
}

.result-timestamp {
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  margin-right: 10px;
}

.close-result {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  padding: 2px 6px;
}

.quick-result-content {
  padding: 15px;
  max-height: 250px;
  overflow-y: auto;
}

.result-summary {
  color: #ffc107;
  margin-bottom: 10px;
  font-weight: 600;
}

.result-details pre {
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.kaggle-dataset-browser {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(20, 20, 20, 0.95);
  border: 2px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  width: 80%;
  max-width: 600px;
  max-height: 70vh;
  overflow-y: auto;
  z-index: 10001;
  box-shadow: 0 20px 60px rgba(255, 193, 7, 0.3);
}

.dataset-browser-header {
  background: rgba(255, 193, 7, 0.1);
  padding: 20px;
  border-bottom: 1px solid rgba(255, 193, 7, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dataset-browser-header h3 {
  color: #ffc107;
  margin: 0;
  font-family: 'Orbitron', monospace;
}

.close-browser {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
}

.dataset-browser-content {
  padding: 20px;
}

.dataset-item {
  background: rgba(255, 193, 7, 0.05);
  border: 1px solid rgba(255, 193, 7, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.dataset-item h5 {
  color: #ffc107;
  margin: 0 0 8px 0;
  font-size: 16px;
}

.dataset-item p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 10px 0;
  font-size: 14px;
}

.dataset-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.dataset-stats span {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.dataset-link {
  display: inline-block;
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 12px;
  transition: all 0.3s ease;
}

.dataset-link:hover {
  background: rgba(255, 193, 7, 0.3);
  text-decoration: none;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
`;

// Dodaj style do dokumentu
if (!document.getElementById('kaggle-styles')) {
  const styleElement = document.createElement('div');
  styleElement.id = 'kaggle-styles';
  styleElement.innerHTML = kaggleStyles;
  document.head.appendChild(styleElement);
}

// Inicjalizacja Kaggle Interface
const kaggleInterface = new KaggleInterface();

// Export do globalnego zakresu
window.KaggleAPI = KaggleAPI;
window.KaggleInterface = KaggleInterface;
window.kaggleInterface = kaggleInterface;

// Funkcje globalne dla łatwego dostępu
window.openKagglePopup = () => kaggleInterface.openKagglePopup();
window.testKaggleConnection = () => kaggleInterface.testConnection();
window.kaggleQuickSearch = (type) => kaggleInterface.quickSearch(type);
window.browsePopularDatasets = () => kaggleInterface.browsePopularDatasets();

console.log('✅ Kaggle API Integration loaded successfully');