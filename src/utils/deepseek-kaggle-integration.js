/**
 * DeepSeek + Kaggle Integration
 * Temporary working solution for connecting DeepSeek AI with Kaggle datasets
 */

class DeepSeekKaggleIntegration {
    constructor(config = {}) {
        this.deepseekApiKey = config.deepseekApiKey || process.env.DEEPSEEK_API_KEY;
        this.kaggleUsername = config.kaggleUsername || process.env.KAGGLE_USERNAME;
        this.kaggleKey = config.kaggleKey || process.env.KAGGLE_KEY;
        this.baseUrl = 'https://api.deepseek.com/v1';
        this.kaggleApiUrl = 'https://www.kaggle.com/api/v1';
    }

    /**
     * Get available Kaggle datasets
     */
    async getKaggleDatasets(search = '', page = 1, pageSize = 20) {
        try {
            const auth = Buffer.from(`${this.kaggleUsername}:${this.kaggleKey}`).toString('base64');
            
            const response = await fetch(`${this.kaggleApiUrl}/datasets/list?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Kaggle API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching Kaggle datasets:', error);
            return { datasets: [], error: error.message };
        }
    }

    /**
     * Download and analyze dataset with DeepSeek
     */
    async analyzeDatasetWithDeepSeek(datasetRef, analysisPrompt = '') {
        try {
            // First, get dataset info
            const datasetInfo = await this.getDatasetInfo(datasetRef);
            
            // Prepare analysis prompt
            const prompt = `
Analyze this Kaggle dataset:
Dataset: ${datasetRef}
Description: ${datasetInfo.description || 'No description available'}
Files: ${datasetInfo.files ? datasetInfo.files.map(f => f.name).join(', ') : 'Unknown'}

${analysisPrompt || 'Please provide a comprehensive analysis of this dataset including potential use cases, data quality insights, and recommendations for analysis approaches.'}
            `.trim();

            // Send to DeepSeek
            const deepseekResponse = await this.queryDeepSeek(prompt);
            
            return {
                dataset: datasetInfo,
                analysis: deepseekResponse,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error analyzing dataset:', error);
            return { error: error.message };
        }
    }

    /**
     * Get specific dataset information
     */
    async getDatasetInfo(datasetRef) {
        try {
            const auth = Buffer.from(`${this.kaggleUsername}:${this.kaggleKey}`).toString('base64');
            
            const response = await fetch(`${this.kaggleApiUrl}/datasets/view/${datasetRef}`, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Kaggle API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching dataset info:', error);
            return { error: error.message };
        }
    }

    /**
     * Query DeepSeek AI
     */
    async queryDeepSeek(prompt, model = 'deepseek-chat') {
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.deepseekApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                throw new Error(`DeepSeek API error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || 'No response from DeepSeek';
        } catch (error) {
            console.error('Error querying DeepSeek:', error);
            return `Error: ${error.message}`;
        }
    }

    /**
     * Get popular datasets for quick testing
     */
    async getPopularDatasets() {
        return await this.getKaggleDatasets('', 1, 10);
    }

    /**
     * Quick analysis of a popular dataset
     */
    async quickAnalysis(datasetName = 'titanic') {
        try {
            // Search for the dataset
            const datasets = await this.getKaggleDatasets(datasetName, 1, 5);
            
            if (!datasets.datasets || datasets.datasets.length === 0) {
                return { error: 'No datasets found' };
            }

            const dataset = datasets.datasets[0];
            const datasetRef = `${dataset.ownerName}/${dataset.datasetSlug}`;
            
            return await this.analyzeDatasetWithDeepSeek(datasetRef, 
                'Provide a quick analysis focusing on data structure, potential machine learning applications, and key insights.');
        } catch (error) {
            console.error('Error in quick analysis:', error);
            return { error: error.message };
        }
    }

    /**
     * Test connection to both services
     */
    async testConnections() {
        const results = {
            deepseek: false,
            kaggle: false,
            timestamp: new Date().toISOString()
        };

        // Test DeepSeek
        try {
            const deepseekTest = await this.queryDeepSeek('Hello, this is a connection test. Please respond with "DeepSeek connection successful".');
            results.deepseek = deepseekTest.includes('successful') || deepseekTest.includes('DeepSeek');
            results.deepseekResponse = deepseekTest;
        } catch (error) {
            results.deepseekError = error.message;
        }

        // Test Kaggle
        try {
            const kaggleTest = await this.getKaggleDatasets('test', 1, 1);
            results.kaggle = !kaggleTest.error;
            results.kaggleResponse = kaggleTest;
        } catch (error) {
            results.kaggleError = error.message;
        }

        return results;
    }
}

// Export for use in other modules
export default DeepSeekKaggleIntegration;

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeepSeekKaggleIntegration;
}
