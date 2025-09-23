// BigQuery Worker API Integration
// Komunikacja frontend-backend dla BigQuery Worker

class BigQueryAPI {
  constructor() {
    this.baseUrl = 'https://mybonzo.com/api/polaczek/bigquery';
    this.endpoints = {
      query: '/query',
      analytics: '/analytics',
      datasets: '/datasets',
      performance: '/performance',
      status: '/status'
    };
  }

  // Podstawowe zapytanie do BigQuery
  async sendQuery(query, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.query}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          query: query,
          options: options,
          timestamp: new Date().toISOString(),
          user_context: this.getUserContext()
        })
      });

      if (!response.ok) {
        throw new Error(`BigQuery API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('BigQuery API Error:', error);
      throw error;
    }
  }

  // Analiza danych
  async getAnalytics(type = 'overview', filters = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.analytics}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: type,
          filters: filters,
          timestamp: new Date().toISOString()
        })
      });

      return await response.json();
    } catch (error) {
      console.error('BigQuery Analytics Error:', error);
      throw error;
    }
  }

  // Lista dostępnych datasetów
  async getDatasets() {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.datasets}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      return await response.json();
    } catch (error) {
      console.error('BigQuery Datasets Error:', error);
      throw error;
    }
  }

  // Statystyki wydajności
  async getPerformanceStats(timeRange = '24h') {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.performance}?range=${timeRange}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      return await response.json();
    } catch (error) {
      console.error('BigQuery Performance Error:', error);
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
      console.error('BigQuery Status Error:', error);
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
class BigQueryInterface {
  constructor() {
    this.api = new BigQueryAPI();
  }

  // Otwórz popup BigQuery
  openBigQueryPopup() {
    if (typeof window.openWorkerPopup === 'function') {
      window.openWorkerPopup(
        'BigQuery',
        'https://mybonzo.com/api/polaczek/bigquery/query',
        '📊 BigQuery Analytics - Analiza Danych'
      );
    } else {
      console.error('WorkerCommunicationPopup not available');
    }
  }

  // Szybkie zapytania BigQuery
  async quickQuery(queryType) {
    const queries = {
      overview: 'SELECT COUNT(*) as total_records, DATE(timestamp) as date FROM polish_ai_interactions.conversations GROUP BY date ORDER BY date DESC LIMIT 7',
      performance: 'SELECT AVG(response_time) as avg_response, COUNT(*) as total_queries FROM polish_ai_interactions.performance WHERE DATE(timestamp) = CURRENT_DATE()',
      users: 'SELECT COUNT(DISTINCT user_id) as active_users FROM polish_ai_interactions.users WHERE DATE(last_activity) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)',
      feedback: 'SELECT rating, COUNT(*) as count FROM polish_ai_interactions.feedback WHERE DATE(timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) GROUP BY rating ORDER BY rating DESC'
    };

    if (queries[queryType]) {
      try {
        const result = await this.api.sendQuery(queries[queryType]);
        this.displayQuickResult(queryType, result);
        return result;
      } catch (error) {
        console.error(`Quick Query ${queryType} Error:`, error);
        alert(`Błąd zapytania ${queryType}: ${error.message}`);
      }
    }
  }

  // Wyświetl szybki wynik
  displayQuickResult(queryType, result) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'bigquery-quick-result';
    resultDiv.innerHTML = `
      <div class="quick-result-header">
        <h4>📊 ${queryType.toUpperCase()} - Szybki Wynik</h4>
        <span class="result-timestamp">${new Date().toLocaleString()}</span>
      </div>
      <div class="quick-result-content">
        <pre>${JSON.stringify(result, null, 2)}</pre>
      </div>
    `;

    // Dodaj do istniejącego kontenera lub utwórz nowy
    let container = document.getElementById('bigquery-results-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'bigquery-results-container';
      container.className = 'bigquery-results-container';
      document.body.appendChild(container);
    }

    container.appendChild(resultDiv);

    // Auto-remove po 30 sekundach
    setTimeout(() => {
      if (resultDiv.parentNode) {
        resultDiv.remove();
      }
    }, 30000);
  }

  // Test połączenia
  async testConnection() {
    try {
      const status = await this.api.getStatus();
      console.log('BigQuery Connection Test:', status);
      
      if (status.status === 'ok' || status.ready) {
        alert('✅ BigQuery Worker - Połączenie OK!');
      } else {
        alert('⚠️ BigQuery Worker - Problemy z połączeniem');
      }
      
      return status;
    } catch (error) {
      alert(`❌ BigQuery Worker - Błąd połączenia: ${error.message}`);
      console.error('BigQuery Connection Test Error:', error);
    }
  }
}

// Style dla szybkich wyników
const bigQueryStyles = `
<style>
.bigquery-results-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.bigquery-quick-result {
  background: rgba(0, 123, 255, 0.1);
  border: 1px solid rgba(0, 123, 255, 0.3);
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
  animation: slideInRight 0.3s ease-out;
}

.quick-result-header {
  background: rgba(0, 123, 255, 0.2);
  padding: 10px 15px;
  border-bottom: 1px solid rgba(0, 123, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quick-result-header h4 {
  margin: 0;
  color: #007bff;
  font-family: 'Orbitron', monospace;
  font-size: 14px;
}

.result-timestamp {
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
}

.quick-result-content {
  padding: 15px;
  max-height: 200px;
  overflow-y: auto;
}

.quick-result-content pre {
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
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
if (!document.getElementById('bigquery-styles')) {
  const styleElement = document.createElement('div');
  styleElement.id = 'bigquery-styles';
  styleElement.innerHTML = bigQueryStyles;
  document.head.appendChild(styleElement);
}

// Inicjalizacja BigQuery Interface
const bigQueryInterface = new BigQueryInterface();

// Export do globalnego zakresu
window.BigQueryAPI = BigQueryAPI;
window.BigQueryInterface = BigQueryInterface;
window.bigQueryInterface = bigQueryInterface;

// Funkcje globalne dla łatwego dostępu
window.openBigQueryPopup = () => bigQueryInterface.openBigQueryPopup();
window.testBigQueryConnection = () => bigQueryInterface.testConnection();
window.bigQueryQuickQuery = (type) => bigQueryInterface.quickQuery(type);

console.log('✅ BigQuery API Integration loaded successfully');