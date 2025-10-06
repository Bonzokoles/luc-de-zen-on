// Agent 03 - System Monitor Configuration

export const AGENT_CONFIG = {
    // Basic Info
    id: 'agent-03-system-monitor',
    name: 'System Monitor',
    version: '1.0.0',
    description: 'Performance monitoring and system health tracking',

    // Status
    status: 'active', // 'active' | 'development' | 'disabled'

    // Capabilities
    capabilities: [
        'performance_monitoring',
        'health_tracking',
        'resource_analysis',
        'alerts_system',
        'real_time_stats'
    ],

    // Dependencies
    dependencies: [
        'Navigator API',
        'Performance Observer',
        'Memory API'
    ],

    // Network
    ports: {
        api: 3003, // API endpoint port
        ws: 3103   // WebSocket port for real-time monitoring
    },

    // UI Settings
    ui: {
        icon: '📊',
        color: '#00d084',
        position: 3 // Floating button position
    },

    // API Configuration
    api: {
        endpoint: '/api/agents/system-monitor',
        methods: ['POST', 'GET'],
        rateLimit: 300, // requests per minute (high for monitoring)
        timeout: 5000   // 5 seconds
    },

    // Monitoring Settings
    monitoring: {
        updateInterval: 2000, // ms
        historyLimit: 100, // number of data points to keep
        alertThresholds: {
            memory: 85, // percentage
            cpu: 80,    // percentage
            disk: 90,   // percentage
            network: 1000 // Mbps
        }
    },

    // Metrics Configuration
    metrics: {
        system: [
            'memory_usage',
            'cpu_usage', 
            'network_speed',
            'page_load_time',
            'fps',
            'battery_level'
        ],
        
        performance: [
            'dom_load_time',
            'resource_load_time',
            'largest_contentful_paint',
            'first_input_delay',
            'cumulative_layout_shift'
        ],

        application: [
            'agents_active',
            'api_response_time',
            'error_rate',
            'user_interactions'
        ]
    },

    // Alerts Configuration
    alerts: {
        enabled: true,
        channels: ['ui', 'console', 'webhook'],
        levels: ['info', 'warning', 'critical'],
        cooldown: 30000 // 30 seconds between same alerts
    },

    // Resources
    resources: {
        maxMemory: '128MB',
        maxCpu: 15, // percentage
        priority: 'low' // 'low' | 'normal' | 'high'
    }
};

export default AGENT_CONFIG;