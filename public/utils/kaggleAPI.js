/**
 * Kaggle API Integration for MyBonzo Platform
 * Handles Kaggle datasets and competitions
 */

class KaggleAPI {
    constructor() {
        this.baseURL = 'https://mybonzo.com/api/kaggle';
        this.username = null;
        this.initialized = false;
    }

    /**
     * Initialize Kaggle connection
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
                this.username = data.username;
                this.initialized = true;
                console.log('✅ Kaggle API initialized successfully');
                return { success: true, username: this.username };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ Kaggle initialization failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Search datasets
     */
    async searchDatasets(query, page = 1, pageSize = 20) {
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
                    action: 'search_datasets',
                    query: query,
                    page: page,
                    pageSize: pageSize
                })
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, datasets: data.datasets };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ Kaggle search failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get dataset details
     */
    async getDatasetDetails(ownerSlug, datasetSlug) {
        try {
            const response = await fetch(`${this.baseURL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'dataset_details',
                    ownerSlug: ownerSlug,
                    datasetSlug: datasetSlug
                })
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, dataset: data.dataset };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ Failed to get dataset details:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get popular datasets
     */
    async getPopularDatasets(category = null, sortBy = 'hottest') {
        try {
            const response = await fetch(`${this.baseURL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'popular_datasets',
                    category: category,
                    sortBy: sortBy
                })
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, datasets: data.datasets };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ Failed to get popular datasets:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get user's datasets
     */
    async getUserDatasets() {
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
                    action: 'user_datasets'
                })
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, datasets: data.datasets };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ Failed to get user datasets:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Test connection to Kaggle
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
                    message: data.message || 'Kaggle connection successful',
                    username: data.username
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
window.KaggleAPI = new KaggleAPI();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KaggleAPI;
}