// Documentation Index for POLACZEK AI Assistant
// This file maps all available documentation for contextual responses

export const documentationIndex = {
    // AI Functions Documentation
    ai_functions: {
        title: "AI Functions Documentation",
        file: "AI_FUNCTIONS_DOCUMENTATION.md",
        description: "Complete documentation of all AI functions available in MyBonzo",
        keywords: ["ai", "functions", "artificial intelligence", "automation", "features"]
    },

    // System Components
    bielik_buttons: {
        title: "Bielik Buttons System",
        files: [
            "BIELIK_PRZYCISKI_DEBUGGING_REPORT.md",
            "BIELIK_PRZYCISKI_QUICK_REFERENCE.md"
        ],
        description: "Documentation for Bielik button system debugging and reference",
        keywords: ["bielik", "buttons", "interface", "debugging", "ui"]
    },

    bigquery_analytics: {
        title: "BigQuery Analytics",
        file: "bigquery_analytics_summary.md",
        description: "BigQuery integration and analytics functionality",
        keywords: ["bigquery", "analytics", "data", "sql", "statistics"]
    },

    // Complete System Documentation
    system_overview: {
        title: "Complete System Overview",
        file: "COMPLETE_SYSTEM_OVERVIEW.md",
        description: "Comprehensive overview of the entire MyBonzo system",
        keywords: ["system", "overview", "architecture", "complete", "documentation"]
    },

    // Flowise AI Integration
    flowise: {
        title: "Flowise AI Integration",
        files: [
            "FLOWISE_AI_DOCUMENTATION_INDEX.md",
            "FLOWISE_AI_INTEGRATION_STATUS.md",
            "FLOWISE_AI_QUICK_REFERENCE.md",
            "FLOWISE_AI_TECHNICAL_GUIDE.md",
            "FLOWISE_AI_USER_GUIDE.md"
        ],
        description: "Complete Flowise AI integration documentation",
        keywords: ["flowise", "ai integration", "workflows", "automation", "technical guide"]
    },

    // Business Functions
    business_functions: {
        title: "Business AI Functions",
        file: "FUNKCJE_BIZNESOWE_AI_DOKUMENTACJA.md",
        description: "Documentation of AI business functions and features",
        keywords: ["business", "functions", "ai features", "automation", "enterprise"]
    },

    // User Instructions
    user_guide: {
        title: "User Instructions and Guides",
        files: [
            "INSTRUKCJE_UZYTKOWNIKA.md",
            "QUICK_START_GUIDE.md"
        ],
        description: "User instructions and quick start guides",
        keywords: ["user guide", "instructions", "quick start", "tutorial", "help"]
    },

    // MyBonzo Documentation
    mybonzo_docs: {
        title: "MyBonzo Complete Documentation",
        files: [
            "MYBONZO_COMPLETE_DOCUMENTATION_2025.md",
            "MYBONZO_COMPLETE_PROJECT_DOCUMENTATION.md",
            "MYBONZO_PROJECT_ROADMAP_2025.md"
        ],
        description: "Complete MyBonzo project documentation and roadmap",
        keywords: ["mybonzo", "project", "documentation", "roadmap", "complete"]
    },

    // POLACZEK AI Assistant
    polaczek: {
        title: "POLACZEK AI Assistant",
        files: [
            "POLACZEK_AI_ASSISTANT_INTEGRATION_COMPLETE_2025.md",
            "POLACZEK_SUBPAGES_FUNCTIONALITY_REPORT.md"
        ],
        description: "POLACZEK AI Assistant integration and functionality",
        keywords: ["polaczek", "ai assistant", "integration", "chat", "assistant"]
    },

    // Implementation Reports
    implementation: {
        title: "Implementation Reports",
        files: [
            "DODATKI_IMPLEMENTATION_FINAL_REPORT.md",
            "DODATKI_TECHNICAL_IMPLEMENTATION_REPORT.md",
            "INTERFACE_UPDATE_REPORT.md",
            "LOKALNY_TEST_APLIKACJI_RAPORT.md"
        ],
        description: "Technical implementation and testing reports",
        keywords: ["implementation", "reports", "technical", "testing", "development"]
    },

    // System Management
    system_management: {
        title: "System Management and Deployment",
        files: [
            "SYSTEM_AUTOMATYZACJI_DEPLOYMENT_DOKUMENTACJA.md",
            "SYSTEM_VERIFICATION_REPORT_2025-09-06.md",
            "ZENON_WORKERS_STATUS_IMPLEMENTATION_REPORT.md"
        ],
        description: "System deployment, automation and verification documentation",
        keywords: ["deployment", "automation", "system management", "workers", "verification"]
    }
};

// Function to find relevant documentation based on query
export function findRelevantDocs(query) {
    const queryLower = query.toLowerCase();
    const relevantDocs = [];

    for (const [key, doc] of Object.entries(documentationIndex)) {
        // Check if query matches keywords or title
        const matchesKeywords = doc.keywords.some(keyword =>
            queryLower.includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(queryLower)
        );

        const matchesTitle = doc.title.toLowerCase().includes(queryLower);
        const matchesDescription = doc.description.toLowerCase().includes(queryLower);

        if (matchesKeywords || matchesTitle || matchesDescription) {
            relevantDocs.push({
                category: key,
                ...doc,
                relevanceScore: calculateRelevanceScore(query, doc)
            });
        }
    }

    // Sort by relevance score
    return relevantDocs.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function calculateRelevanceScore(query, doc) {
    const queryLower = query.toLowerCase();
    let score = 0;

    // Title match (highest priority)
    if (doc.title.toLowerCase().includes(queryLower)) score += 10;

    // Keyword matches
    doc.keywords.forEach(keyword => {
        if (queryLower.includes(keyword.toLowerCase())) score += 5;
        if (keyword.toLowerCase().includes(queryLower)) score += 3;
    });

    // Description match
    if (doc.description.toLowerCase().includes(queryLower)) score += 2;

    return score;
}

// Get documentation path
export function getDocumentationPath(filename) {
    return `/src/docs/${filename}`;
}

// Categories for organized browsing
export const documentationCategories = {
    "AI & Automation": ["ai_functions", "flowise", "business_functions"],
    "System Documentation": ["system_overview", "system_management", "implementation"],
    "User Guides": ["user_guide", "mybonzo_docs"],
    "Components": ["bielik_buttons", "bigquery_analytics", "polaczek"],
    "Technical Reports": ["implementation"]
};