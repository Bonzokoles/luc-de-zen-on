// Agent 04 - Web Crawler Configuration

export const AGENT_CONFIG = {
    // Basic Info
    id: 'agent-04-web-crawler',
    name: 'Web Crawler',
    version: '1.0.0',
    description: 'Automated web scraping, data collection and site analysis',

    // Status
    status: 'active', // 'active' | 'development' | 'disabled'

    // Capabilities
    capabilities: [
        'web_scraping',
        'data_extraction',
        'link_analysis',
        'content_monitoring',
        'seo_analysis'
    ],

    // Dependencies
    dependencies: [
        'Fetch API',
        'DOM Parser',
        'URL API'
    ],

    // Network
    ports: {
        api: 3004, // API endpoint port
        ws: 3104   // WebSocket port for real-time crawling updates
    },

    // UI Settings
    ui: {
        icon: '🕷️',
        color: '#ff4081',
        position: 4 // Floating button position
    },

    // API Configuration
    api: {
        endpoint: '/api/agents/web-crawler',
        methods: ['POST', 'GET'],
        rateLimit: 60, // requests per minute
        timeout: 30000  // 30 seconds for long scraping tasks
    },

    // Crawler Settings
    crawler: {
        maxDepth: 3,
        maxPages: 50,
        delayBetweenRequests: 1000, // ms
        respectRobotsTxt: true,
        userAgent: 'LucDeZenOn-WebCrawler/1.0',
        maxConcurrentRequests: 5
    },

    // Content Extraction
    extraction: {
        // Standard selectors for common content
        selectors: {
            title: ['title', 'h1', '[data-title]'],
            description: ['meta[name="description"]', '[data-description]'],
            keywords: ['meta[name="keywords"]', '[data-keywords]'],
            links: ['a[href]'],
            images: ['img[src]'],
            text: ['p', 'div', 'span'],
            headings: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        },
        
        // Content types to extract
        contentTypes: [
            'text/html',
            'application/json',
            'text/plain',
            'application/xml'
        ]
    },

    // Analysis Features
    analysis: {
        seo: {
            enabled: true,
            checkTitleLength: true,
            checkMetaDescription: true,
            checkHeadingStructure: true,
            checkImageAltText: true
        },
        
        performance: {
            enabled: true,
            checkLoadTime: true,
            checkResourceSizes: true,
            checkCaching: true
        },
        
        accessibility: {
            enabled: true,
            checkAltText: true,
            checkHeadingStructure: true,
            checkAriaLabels: true
        }
    },

    // Filter Settings
    filters: {
        allowedDomains: [], // Empty = all domains allowed
        blockedDomains: ['facebook.com', 'twitter.com'], // Social media
        allowedFileTypes: ['html', 'json', 'xml', 'txt'],
        blockedFileTypes: ['exe', 'zip', 'pdf', 'doc'],
        minContentLength: 100,
        maxContentLength: 1000000 // 1MB
    },

    // Storage
    storage: {
        maxStoredPages: 1000,
        cacheResults: true,
        cacheTTL: 3600000, // 1 hour in ms
        exportFormats: ['json', 'csv', 'txt']
    },

    // Resources
    resources: {
        maxMemory: '256MB',
        maxCpu: 40, // percentage
        priority: 'normal' // 'low' | 'normal' | 'high'
    }
};

export default AGENT_CONFIG;