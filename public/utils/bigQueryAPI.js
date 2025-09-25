/**
 * BigQuery API Integration for MyBonzo Platform
 * Handles Google BigQuery connections and data analytics
 */

class BigQueryAPI {
    constructor() {
        this.baseURL = 'https://mybonzo.com/api/bigquery';
        this.projectId = null;
        this.initialized = false;
    }

    /**
     * Initialize BigQuery connection
     */
    async initialize() {
        try {
            const response = await fetch(`${this.baseURL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'initialize'
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.projectId = data.projectId;
                this.initialized = true;
                console.log('✅ BigQuery API initialized successfully');
                return { success: true, projectId: this.projectId };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ BigQuery initialization failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Execute BigQuery query
     */
    async executeQuery(query) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            const response = await fetch(`${this.baseURL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'query',
                    query: query
                })
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data: data.results };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ BigQuery query failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get dataset information
     */
    async getDatasets() {
        try {
            const response = await fetch(`${this.baseURL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'datasets'
                })
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, datasets: data.datasets };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ Failed to get datasets:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Test connection to BigQuery
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'test'
                })
            });

            if (response.ok) {
                const data = await response.json();
                return { 
                    success: true, 
                    status: 'connected',
                    message: data.message || 'BigQuery connection successful'
                };
            } else {
                return { 
                    success: false, 
                    status: 'error',
                    error: `HTTP ${response.status}` 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                status: 'error',
                error: error.message 
            };
        }
    }
}

// Global instance
window.BigQueryAPI = new BigQueryAPI();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BigQueryAPI;
}