// 🔐 Agent 08 - Security Guard Configuration
export const AGENT_CONFIG = {
  id: 'agent-08-security-guard',
  name: 'Security Guard',
  displayName: 'Strażnik Bezpieczeństwa',
  description: 'Zaawansowany system monitorowania i ochrony bezpieczeństwa z wykrywaniem zagrożeń',
  version: '1.0.0',
  author: 'LUC-DE-ZEN-ON',
  category: 'security',
  
  // Capabilities
  capabilities: [
    'threat-detection',
    'security-monitoring',
    'incident-response',
    'vulnerability-scanning',
    'access-control',
    'compliance-check',
    'malware-detection',
    'network-monitoring',
    'log-analysis',
    'security-reports'
  ],

  // API Endpoints
  endpoints: {
    scan: '/api/agents/agent-08/scan',
    monitor: '/api/agents/agent-08/monitor',
    alerts: '/api/agents/agent-08/alerts',
    incidents: '/api/agents/agent-08/incidents',
    reports: '/api/agents/agent-08/reports',
    policies: '/api/agents/agent-08/policies',
    compliance: '/api/agents/agent-08/compliance',
    quarantine: '/api/agents/agent-08/quarantine'
  },

  // Security threat types
  threatTypes: [
    { id: 'malware', name: 'Malware', icon: '🦠', severity: 'CRITICAL' },
    { id: 'phishing', name: 'Phishing', icon: '🎣', severity: 'HIGH' },
    { id: 'bruteforce', name: 'Brute Force', icon: '🔨', severity: 'HIGH' },
    { id: 'ddos', name: 'DDoS', icon: '💥', severity: 'CRITICAL' },
    { id: 'sql_injection', name: 'SQL Injection', icon: '💉', severity: 'HIGH' },
    { id: 'xss', name: 'XSS', icon: '⚡', severity: 'MEDIUM' },
    { id: 'csrf', name: 'CSRF', icon: '🔄', severity: 'MEDIUM' },
    { id: 'privilege_escalation', name: 'Privilege Escalation', icon: '⬆️', severity: 'CRITICAL' }
  ],

  // Security levels
  securityLevels: [
    { level: 'CRITICAL', name: 'Krytyczny', color: '#dc2626', priority: 5 },
    { level: 'HIGH', name: 'Wysoki', color: '#ea580c', priority: 4 },
    { level: 'MEDIUM', name: 'Średni', color: '#d97706', priority: 3 },
    { level: 'LOW', name: 'Niski', color: '#65a30d', priority: 2 },
    { level: 'INFO', name: 'Info', color: '#2563eb', priority: 1 }
  ],

  // Monitoring areas
  monitoringAreas: [
    { id: 'filesystem', name: 'System plików', icon: '📁' },
    { id: 'network', name: 'Sieć', icon: '🌐' },
    { id: 'processes', name: 'Procesy', icon: '⚙️' },
    { id: 'logs', name: 'Logi', icon: '📝' },
    { id: 'users', name: 'Użytkownicy', icon: '👥' },
    { id: 'registry', name: 'Rejestr', icon: '📋' },
    { id: 'services', name: 'Usługi', icon: '🔧' },
    { id: 'ports', name: 'Porty', icon: '🔌' }
  ],

  // UI Configuration
  ui: {
    theme: 'security',
    colors: {
      primary: '#dc2626', // Czerwony
      secondary: '#1f2937', // Ciemnoszary
      success: '#059669', // Zielony
      warning: '#d97706', // Pomarańczowy
      error: '#dc2626', // Czerwony
      info: '#2563eb' // Niebieski
    },
    layout: 'security-dashboard' // Security dashboard layout
  },

  // Security policies
  defaultPolicies: [
    {
      id: 'failed_login_attempts',
      name: 'Nieudane próby logowania',
      description: 'Monitoruje nieudane próby logowania',
      threshold: 5,
      timeWindow: 300000, // 5 minut
      enabled: true
    },
    {
      id: 'file_integrity',
      name: 'Integralność plików',
      description: 'Monitoruje zmiany w krytycznych plikach',
      paths: ['/etc', '/boot', '/usr/bin'],
      enabled: true
    },
    {
      id: 'unusual_network_activity',
      name: 'Nietypowa aktywność sieciowa',
      description: 'Wykrywa podejrzaną aktywność sieciową',
      threshold: 1000, // połączenia/min
      enabled: true
    }
  ],

  // Compliance frameworks
  complianceFrameworks: [
    { id: 'gdpr', name: 'GDPR/RODO', icon: '🇪🇺' },
    { id: 'iso27001', name: 'ISO 27001', icon: '🏢' },
    { id: 'sox', name: 'SOX', icon: '💼' },
    { id: 'hipaa', name: 'HIPAA', icon: '🏥' },
    { id: 'pci_dss', name: 'PCI DSS', icon: '💳' }
  ],

  // Alert settings
  alertSettings: {
    emailNotifications: true,
    dashboardAlerts: true,
    soundAlerts: false,
    escalationDelay: 1800000, // 30 minut
    maxAlertsPerHour: 50,
    autoQuarantine: false
  },

  // Scan settings
  scanSettings: {
    realTimeMonitoring: true,
    scheduledScans: true,
    deepScanInterval: 86400000, // 24 godziny
    quickScanInterval: 3600000, // 1 godzina
    maxScanDuration: 3600000, // 1 godzina
    quarantineThreats: false
  }
};