// Agent Configuration Template
// Copy this file and customize for your agent

export const AGENT_CONFIG = {
    // Basic Info
    id: 'agent-template',
    name: 'Template Agent',
    version: '1.0.0',
    description: 'Template agent for creating new agents',

    // Status
    status: 'development', // 'active' | 'development' | 'disabled'

    // Capabilities
    capabilities: [
        'template',
        'example'
    ],

    // Dependencies
    dependencies: [],

    // Network
    ports: {
        api: 3000, // API endpoint port
        ws: null   // WebSocket port (if needed)
    },

    // UI Settings
    ui: {
        icon: '🤖',
        color: '#00d7ef',
        position: 1 // Floating button position
    },

    // API Configuration
    api: {
        endpoint: '/api/agents/template',
        methods: ['POST'],
        rateLimit: 100, // requests per minute
        timeout: 30000  // 30 seconds
    },

    // Resources
    resources: {
        maxMemory: '128MB',
        maxCpu: 50, // percentage
        priority: 'normal' // 'low' | 'normal' | 'high'
    }
};

export default AGENT_CONFIG;