// 📧 Agent 07 - Email Handler Configuration
export const AGENT_CONFIG = {
  id: 'agent-07-email-handler',
  name: 'Email Handler',
  displayName: 'Menedżer Email',
  description: 'Zaawansowany system obsługi poczty elektronicznej z kampaniami i analytics',
  version: '1.0.0',
  author: 'LUC-DE-ZEN-ON',
  category: 'communication',
  
  // Capabilities
  capabilities: [
    'send-email',
    'receive-email',
    'email-templates',
    'newsletter-campaigns',
    'email-analytics',
    'spam-filtering',
    'email-scheduling',
    'contact-management',
    'autoresponder',
    'email-tracking'
  ],

  // API Endpoints
  endpoints: {
    send: '/api/agents/agent-07/send',
    receive: '/api/agents/agent-07/receive',
    templates: '/api/agents/agent-07/templates',
    campaigns: '/api/agents/agent-07/campaigns',
    contacts: '/api/agents/agent-07/contacts',
    analytics: '/api/agents/agent-07/analytics',
    filters: '/api/agents/agent-07/filters',
    accounts: '/api/agents/agent-07/accounts'
  },

  // Supported email providers
  supportedProviders: [
    { type: 'smtp', name: 'SMTP/IMAP', icon: '📧' },
    { type: 'gmail', name: 'Gmail', icon: '🟥' },
    { type: 'outlook', name: 'Outlook', icon: '🔷' },
    { type: 'yahoo', name: 'Yahoo', icon: '🟣' },
    { type: 'exchange', name: 'Exchange', icon: '💼' }
  ],

  // Email template types
  templateTypes: [
    { id: 'welcome', name: 'Powitanie', icon: '👋' },
    { id: 'newsletter', name: 'Newsletter', icon: '📰' },
    { id: 'promotional', name: 'Promocyjny', icon: '🏷️' },
    { id: 'transactional', name: 'Transakcyjny', icon: '💳' },
    { id: 'reminder', name: 'Przypomnienie', icon: '⏰' },
    { id: 'confirmation', name: 'Potwierdzenie', icon: '✅' }
  ],

  // UI Configuration
  ui: {
    theme: 'email',
    colors: {
      primary: '#1f2937', // Szary
      secondary: '#3b82f6', // Niebieski
      success: '#10b981', // Zielony
      warning: '#f59e0b', // Żółty
      error: '#ef4444', // Czerwony
      accent: '#8b5cf6' // Fioletowy
    },
    layout: 'email-client' // Email client layout
  },

  // Security settings
  security: {
    encryptEmails: true,
    spamProtection: true,
    rateLimiting: {
      hourly: 100,
      daily: 1000
    },
    allowedDomains: [], // Empty = all domains allowed
    blockedDomains: ['spam.com', 'fake.org'],
    requireAuth: true
  },

  // Default settings
  defaults: {
    fromName: 'LUC-DE-ZEN-ON',
    replyTo: 'noreply@luc-de-zen-on.com',
    charset: 'UTF-8',
    trackOpens: true,
    trackClicks: true,
    autoUnsubscribe: true
  }
};