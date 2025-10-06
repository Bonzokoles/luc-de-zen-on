// 🌐 Webmaster Agent Configuration - SEO i monitoring stron
export const AGENT_CONFIG = {
  id: 'agent-09-webmaster',
  name: 'webmaster',
  displayName: 'Webmaster',
  description: 'Zaawansowany system SEO i monitoringu stron internetowych',
  version: '1.0.0',
  author: 'LUC-DE-ZEN-ON',
  
  capabilities: [
    'Audyt techniczny SEO',
    'Analiza słów kluczowych', 
    'Monitoring wydajności stron',
    'Analiza konkurencji',
    'Raportowanie SEO',
    'Core Web Vitals monitoring',
    'Backlink analysis',
    'Content optimization'
  ],

  // SEO audit categories
  auditCategories: [
    {
      id: 'technical',
      name: 'Technical SEO',
      icon: '⚙️',
      description: 'Audyt techniczny struktury strony',
      weight: 25
    },
    {
      id: 'onpage',
      name: 'On-Page SEO', 
      icon: '📝',
      description: 'Optymalizacja treści i meta tagów',
      weight: 30
    },
    {
      id: 'performance',
      name: 'Performance',
      icon: '⚡',
      description: 'Szybkość i Core Web Vitals',
      weight: 20
    },
    {
      id: 'content',
      name: 'Content Quality',
      icon: '📖',
      description: 'Jakość i optymalizacja treści',
      weight: 15
    },
    {
      id: 'links',
      name: 'Link Building',
      icon: '🔗',
      description: 'Analiza linków wewnętrznych i zewnętrznych',
      weight: 10
    }
  ],

  // SEO metrics to track
  seoMetrics: [
    {
      id: 'organic_traffic',
      name: 'Ruch organiczny',
      icon: '📈',
      unit: 'sessions',
      target: 'increase',
      critical: true
    },
    {
      id: 'keyword_rankings',
      name: 'Pozycje słów kluczowych',
      icon: '🎯',
      unit: 'positions',
      target: 'decrease',
      critical: true
    },
    {
      id: 'page_speed',
      name: 'Szybkość strony',
      icon: '⚡',
      unit: 'seconds',
      target: 'decrease',
      threshold: 3.0
    },
    {
      id: 'core_web_vitals',
      name: 'Core Web Vitals',
      icon: '🚀',
      unit: 'score',
      target: 'increase',
      threshold: 75
    },
    {
      id: 'crawl_errors',
      name: 'Błędy crawlingu',
      icon: '🐛',
      unit: 'errors',
      target: 'decrease',
      threshold: 5
    },
    {
      id: 'backlinks',
      name: 'Linki zewnętrzne',
      icon: '🔗',
      unit: 'links',
      target: 'increase',
      critical: false
    }
  ],

  // Performance thresholds (Google PageSpeed standards)
  performanceThresholds: {
    lcp: { good: 2.5, poor: 4.0 }, // Largest Contentful Paint
    fid: { good: 100, poor: 300 }, // First Input Delay  
    cls: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
    ttfb: { good: 800, poor: 1800 }, // Time to First Byte
    speed_index: { good: 3.4, poor: 5.8 }
  },

  // SEO tools integrations
  integrations: [
    {
      id: 'google_search_console',
      name: 'Google Search Console',
      icon: '🔍',
      description: 'Dane wyszukiwania i błędy crawlingu',
      required: true
    },
    {
      id: 'google_analytics',
      name: 'Google Analytics 4',
      icon: '📊',
      description: 'Analityka ruchu i konwersji',
      required: true
    },
    {
      id: 'pagespeed_insights',
      name: 'PageSpeed Insights',
      icon: '⚡',
      description: 'Testy wydajności stron',
      required: false
    },
    {
      id: 'lighthouse',
      name: 'Google Lighthouse',
      icon: '🏮',
      description: 'Audyty jakości i wydajności',
      required: false
    },
    {
      id: 'screaming_frog',
      name: 'Screaming Frog',
      icon: '🐸',
      description: 'Zaawansowany crawling',
      required: false
    }
  ],

  // Content optimization rules
  contentRules: [
    {
      id: 'title_length',
      name: 'Długość tytułu',
      min: 30,
      max: 60,
      unit: 'characters'
    },
    {
      id: 'meta_description_length', 
      name: 'Długość meta description',
      min: 120,
      max: 160,
      unit: 'characters'
    },
    {
      id: 'content_length',
      name: 'Długość treści',
      min: 300,
      recommended: 1500,
      unit: 'words'
    },
    {
      id: 'keyword_density',
      name: 'Gęstość słów kluczowych',
      min: 0.5,
      max: 3.0,
      unit: 'percent'
    },
    {
      id: 'heading_structure',
      name: 'Struktura nagłówków',
      required: ['h1'],
      recommended: ['h1', 'h2', 'h3']
    },
    {
      id: 'internal_links',
      name: 'Linki wewnętrzne',
      min: 3,
      recommended: 8,
      unit: 'links'
    }
  ],

  // Competitive analysis metrics
  competitorMetrics: [
    'domain_authority',
    'backlink_count', 
    'referring_domains',
    'organic_keywords',
    'estimated_traffic',
    'content_gap',
    'top_pages',
    'social_signals'
  ],

  // Default monitoring intervals
  monitoringIntervals: {
    realtime: 5, // minutes
    hourly: 60, // minutes  
    daily: 1440, // minutes (24h)
    weekly: 10080, // minutes (7 days)
    monthly: 43200 // minutes (30 days)
  },

  // Report templates
  reportTemplates: [
    {
      id: 'daily_summary',
      name: 'Podsumowanie dzienne',
      frequency: 'daily',
      sections: ['traffic', 'rankings', 'errors', 'alerts']
    },
    {
      id: 'weekly_performance',
      name: 'Wydajność tygodniowa', 
      frequency: 'weekly',
      sections: ['traffic_trends', 'ranking_changes', 'competitor_analysis', 'content_performance']
    },
    {
      id: 'monthly_comprehensive',
      name: 'Raport miesięczny',
      frequency: 'monthly', 
      sections: ['executive_summary', 'traffic_analysis', 'seo_audit', 'competitor_insights', 'recommendations']
    }
  ],

  // Default settings
  defaultSettings: {
    autoMonitoring: true,
    alertThresholds: {
      trafficDrop: 20, // percent
      rankingDrop: 5, // positions
      errorIncrease: 10, // errors
      speedDecrease: 1 // seconds
    },
    crawlFrequency: 'weekly',
    reportFrequency: 'weekly',
    competitorTracking: 5 // max competitors
  },

  // Polish SEO considerations
  polishSEO: {
    searchEngines: ['google.pl', 'bing.pl', 'duckduckgo.pl'],
    localDirectories: ['pkt.pl', 'firmy.net', 'zlote-strony.pl'],
    socialPlatforms: ['facebook.pl', 'linkedin.com', 'twitter.com'],
    languageCodes: ['pl-PL', 'pl'],
    currency: 'PLN',
    timeZone: 'Europe/Warsaw'
  }
};