// 🗄️ Agent 06 - Database Query Configuration
export const AGENT_CONFIG = {
  id: 'agent-06-database-query',
  name: 'Database Query',
  displayName: 'Ekspert Baz Danych',
  description: 'Zaawansowany agent do zapytań SQL/NoSQL z wizualizacją',
  version: '1.0.0',
  author: 'LUC-DE-ZEN-ON',
  category: 'data',
  
  // Capabilities
  capabilities: [
    'sql-queries',
    'nosql-queries', 
    'data-visualization',
    'export-csv-json',
    'query-history',
    'connection-management',
    'query-optimization'
  ],

  // API Endpoints
  endpoints: {
    execute: '/api/agents/agent-06/execute',
    connections: '/api/agents/agent-06/connections',
    connect: '/api/agents/agent-06/connect',
    history: '/api/agents/agent-06/history',
    export: '/api/agents/agent-06/export'
  },

  // Supported databases
  supportedDatabases: [
    { type: 'mysql', name: 'MySQL', icon: '🐬' },
    { type: 'postgresql', name: 'PostgreSQL', icon: '🐘' },
    { type: 'mongodb', name: 'MongoDB', icon: '🍃' },
    { type: 'sqlite', name: 'SQLite', icon: '🗃️' },
    { type: 'redis', name: 'Redis', icon: '🔴' }
  ],

  // UI Configuration
  ui: {
    theme: 'database',
    colors: {
      primary: '#2563eb',
      secondary: '#7c3aed', 
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
    },
    layout: 'split-panel' // query editor + results
  },

  // Security settings
  security: {
    readOnly: false,
    allowDrop: false,
    allowTruncate: false,
    maxQueryTime: 30000, // 30 seconds
    maxResultRows: 1000
  }
};