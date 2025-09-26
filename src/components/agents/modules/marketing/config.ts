// Type definitions for Marketing Maestro
interface AdPlatform {
  id: string;
  name: string;
  type: string;
  apiVersion: string;
  capabilities: string[];
  bidStrategies: string[];
  dailyBudgetRange: { min: number; max: number; currency: string };
  targetingOptions: string[];
  adFormats: string[];
  polishFeatures: any;
}

interface CampaignTemplate {
  id: string;
  name: string;
  type: string;
  platforms: string[];
  objectives: string[];
  budgetAllocation: Record<string, number>;
  targeting: any;
  creativeStrategy: any;
}

interface PolishMarketConfig {
  holidays: any;
  seasonality: any;
  regions: any;
  paymentMethods: any;
  consumerBehavior: any;
  language: any;
}

interface MarketingKPIs {
  acquisition: any;
  retention: any;
  engagement: any;
  business: any;
}

interface AttributionModel {
  id: string;
  name: string;
  description: string;
  weight: string;
  useCase: string;
  advantages: string[];
  limitations: string[];
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  frequency: string;
  enabled: boolean;
  description: string;
}

interface MarketingConfig {
  agent: any;
  platforms: any;
  templates: any;
  creativeAI: any;
  polishMarket: any;
  kpis: any;
  attribution: any;
  automation: any;
  optimization: any;
  reporting: any;
  integrations: any;
}

/**
 * Marketing Maestro Configuration
 * Advanced AI-powered marketing campaign management system
 * Optimized for Polish market with multi-platform support
 */

// Marketing Platform Integrations
export const marketingPlatforms: Record<string, AdPlatform> = {
  googleAds: {
    id: 'google-ads',
    name: 'Google Ads',
    type: 'search-display',
    apiVersion: 'v14',
    capabilities: ['search', 'display', 'shopping', 'video', 'app'],
    bidStrategies: ['TARGET_CPA', 'TARGET_ROAS', 'MAXIMIZE_CONVERSIONS', 'SMART_BIDDING'],
    dailyBudgetRange: { min: 50, max: 50000, currency: 'PLN' },
    targetingOptions: ['keywords', 'demographics', 'interests', 'remarketing', 'similar'],
    adFormats: ['text', 'responsive', 'image', 'video', 'shopping'],
    polishFeatures: {
      languageTargeting: ['pl', 'en'],
      locationTargeting: ['poland', 'cities', 'voivodeships'],
      localExtensions: true,
      polishHolidays: true
    }
  },
  facebookAds: {
    id: 'facebook-ads',
    name: 'Facebook & Instagram Ads',
    type: 'social-media',
    apiVersion: 'v18',
    capabilities: ['awareness', 'traffic', 'engagement', 'leads', 'conversions', 'catalog'],
    bidStrategies: ['LOWEST_COST_WITHOUT_CAP', 'LOWEST_COST_WITH_BID_CAP', 'TARGET_COST'],
    dailyBudgetRange: { min: 20, max: 20000, currency: 'PLN' },
    targetingOptions: ['demographics', 'interests', 'behaviors', 'custom', 'lookalike'],
    adFormats: ['image', 'video', 'carousel', 'collection', 'stories', 'reels'],
    polishFeatures: {
      languageTargeting: ['pl', 'en'],
      locationTargeting: ['poland', 'detailed-geo'],
      culturalInterests: true,
      polishEvents: true
    }
  },
  linkedinAds: {
    id: 'linkedin-ads',
    name: 'LinkedIn Campaign Manager',
    type: 'professional',
    apiVersion: 'v2',
    capabilities: ['awareness', 'consideration', 'conversions'],
    bidStrategies: ['MAX_DELIVERY', 'TARGET_CPA', 'MANUAL_BID'],
    dailyBudgetRange: { min: 100, max: 10000, currency: 'PLN' },
    targetingOptions: ['job-title', 'company', 'industry', 'skills', 'education'],
    adFormats: ['single-image', 'video', 'carousel', 'text', 'dynamic'],
    polishFeatures: {
      languageTargeting: ['pl', 'en'],
      locationTargeting: ['poland', 'cities'],
      polishCompanies: true,
      localIndustries: true
    }
  },
  allegroAds: {
    id: 'allegro-ads',
    name: 'Allegro Ads',
    type: 'marketplace',
    apiVersion: 'v1',
    capabilities: ['product-ads', 'brand-ads', 'display'],
    bidStrategies: ['CPC', 'CPM', 'AUTO_BID'],
    dailyBudgetRange: { min: 30, max: 5000, currency: 'PLN' },
    targetingOptions: ['categories', 'keywords', 'demographics', 'interests'],
    adFormats: ['product', 'banner', 'video', 'sponsored'],
    polishFeatures: {
      languageTargeting: ['pl'],
      locationTargeting: ['poland', 'detailed'],
      localCategories: true,
      polishBrands: true
    }
  },
  tiktokAds: {
    id: 'tiktok-ads',
    name: 'TikTok Ads Manager',
    type: 'social-video',
    apiVersion: 'v1.3',
    capabilities: ['reach', 'video-views', 'traffic', 'conversions', 'app-promotion'],
    bidStrategies: ['COST_CAP', 'BID_CAP', 'LOWEST_COST'],
    dailyBudgetRange: { min: 80, max: 8000, currency: 'PLN' },
    targetingOptions: ['demographics', 'interests', 'behaviors', 'custom', 'lookalike'],
    adFormats: ['video', 'image', 'carousel', 'collection'],
    polishFeatures: {
      languageTargeting: ['pl', 'en'],
      locationTargeting: ['poland', 'cities'],
      polishTrends: true,
      localMusic: true
    }
  }
};

// AI Creative Generation Models
export const creativeModels = {
  adCopy: {
    primary: 'gpt-4-turbo',
    backup: 'claude-3-opus',
    polish: 'polish-gpt-large',
    settings: {
      temperature: 0.7,
      maxTokens: 500,
      frequencyPenalty: 0.3,
      presencePenalty: 0.1
    },
    templates: {
      search: ['CTA-focused', 'benefit-driven', 'problem-solution', 'urgency'],
      social: ['story-telling', 'user-generated', 'behind-scenes', 'educational'],
      display: ['visual-first', 'brand-awareness', 'product-showcase', 'promotional'],
      email: ['welcome', 'nurture', 'promotion', 'retention', 'win-back'],
      polish: ['formal', 'casual', 'regional', 'cultural', 'seasonal']
    }
  },
  visualCreative: {
    primary: 'dall-e-3',
    backup: 'midjourney-v6',
    polish: 'polish-visual-ai',
    settings: {
      quality: 'hd',
      style: ['natural', 'vivid'],
      size: ['1024x1024', '1792x1024', '1024x1792'],
      polishStyle: ['minimalist', 'traditional', 'modern', 'premium']
    },
    formats: {
      social: ['square', 'story', 'carousel'],
      display: ['banner', 'leaderboard', 'sidebar', 'mobile'],
      video: ['16:9', '9:16', '1:1', 'banner'],
      print: ['a4', 'poster', 'flyer', 'business-card']
    }
  },
  videoGeneration: {
    primary: 'runway-ml',
    backup: 'pika-labs',
    settings: {
      duration: [15, 30, 60, 90],
      quality: '1080p',
      framerate: 30,
      aspect: ['16:9', '9:16', '1:1']
    },
    templates: ['product-demo', 'testimonial', 'brand-story', 'explainer', 'promotional']
  }
};

// Campaign Templates
export const campaignTemplates: Record<string, CampaignTemplate> = {
  ecommerce: {
    id: 'ecommerce-master',
    name: 'E-commerce Master Campaign',
    type: 'conversion',
    platforms: ['google-ads', 'facebook-ads', 'allegro-ads'],
    objectives: ['sales', 'catalog-promotion', 'retargeting'],
    budgetAllocation: {
      'google-ads': 0.5,
      'facebook-ads': 0.3,
      'allegro-ads': 0.2
    },
    targeting: {
      demographics: ['25-55', 'income-medium-high'],
      interests: ['shopping', 'online-buying', 'fashion', 'tech'],
      behaviors: ['frequent-shoppers', 'brand-loyal', 'price-conscious'],
      custom: ['website-visitors', 'cart-abandoners', 'past-purchasers']
    },
    creativeStrategy: {
      adCopy: ['product-benefits', 'social-proof', 'urgency', 'promotion'],
      visuals: ['product-showcase', 'lifestyle', 'user-generated', 'comparison'],
      callToAction: ['Kup teraz', 'Sprawdź ofertę', 'Zamów dzisiaj', 'Zobacz więcej']
    }
  },
  leadGeneration: {
    id: 'lead-gen-b2b',
    name: 'B2B Lead Generation',
    type: 'leads',
    platforms: ['linkedin-ads', 'google-ads', 'facebook-ads'],
    objectives: ['lead-generation', 'brand-awareness', 'consideration'],
    budgetAllocation: {
      'linkedin-ads': 0.6,
      'google-ads': 0.3,
      'facebook-ads': 0.1
    },
    targeting: {
      job: ['director', 'manager', 'ceo', 'founder', 'owner'],
      company: ['100-500', '500+', 'tech', 'consulting', 'manufacturing'],
      industry: ['technology', 'consulting', 'finance', 'healthcare'],
      location: ['poland', 'major-cities']
    },
    creativeStrategy: {
      adCopy: ['problem-solution', 'industry-insights', 'case-studies', 'expertise'],
      visuals: ['professional', 'infographics', 'team-photos', 'office'],
      callToAction: ['Pobierz raport', 'Umów demo', 'Skontaktuj się', 'Dowiedz się więcej']
    }
  },
  brandAwareness: {
    id: 'brand-awareness-campaign',
    name: 'Brand Awareness & Reach',
    type: 'awareness',
    platforms: ['facebook-ads', 'tiktok-ads', 'google-ads'],
    objectives: ['reach', 'impressions', 'brand-recall', 'engagement'],
    budgetAllocation: {
      'facebook-ads': 0.4,
      'tiktok-ads': 0.3,
      'google-ads': 0.3
    },
    targeting: {
      demographics: ['18-65', 'all-income'],
      interests: ['broad-relevant', 'competitors', 'industry'],
      location: ['poland', 'tier1-cities', 'target-regions'],
      exclusions: ['existing-customers', 'employees']
    },
    creativeStrategy: {
      adCopy: ['brand-story', 'values', 'mission', 'personality'],
      visuals: ['brand-colors', 'logo-prominent', 'lifestyle', 'emotional'],
      callToAction: ['Poznaj nas', 'Zobacz więcej', 'Obserwuj', 'Sprawdź']
    }
  },
  localBusiness: {
    id: 'local-business-promotion',
    name: 'Local Business Promotion',
    type: 'local',
    platforms: ['google-ads', 'facebook-ads'],
    objectives: ['store-visits', 'phone-calls', 'local-awareness'],
    budgetAllocation: {
      'google-ads': 0.7,
      'facebook-ads': 0.3
    },
    targeting: {
      location: ['city-radius-10km', 'neighborhood', 'local-zip'],
      demographics: ['local-age-groups', 'local-income'],
      interests: ['local-services', 'community', 'local-events'],
      time: ['business-hours', 'lunch-time', 'evening']
    },
    creativeStrategy: {
      adCopy: ['local-benefits', 'community-focused', 'personal-service', 'proximity'],
      visuals: ['store-front', 'local-landmarks', 'staff', 'products'],
      callToAction: ['Odwiedź nas', 'Zadzwoń teraz', 'Sprawdź lokalizację', 'Umów wizytę']
    }
  }
};

// Polish Market Configuration
export const polishMarketConfig: PolishMarketConfig = {
  holidays: {
    newYear: { date: '01-01', impact: 'high', campaigns: ['year-start', 'resolutions'] },
    epiphany: { date: '01-06', impact: 'low', campaigns: ['traditional'] },
    easter: { date: 'variable', impact: 'high', campaigns: ['family', 'spring', 'renewal'] },
    mayDay: { date: '05-01', impact: 'medium', campaigns: ['spring', 'outdoor'] },
    constitution: { date: '05-03', impact: 'low', campaigns: ['patriotic'] },
    corpusChristi: { date: 'variable', impact: 'medium', campaigns: ['traditional'] },
    assumption: { date: '08-15', impact: 'medium', campaigns: ['summer', 'traditional'] },
    allSaints: { date: '11-01', impact: 'medium', campaigns: ['memorial', 'flowers'] },
    independence: { date: '11-11', impact: 'medium', campaigns: ['patriotic', 'national'] },
    christmas: { date: '12-24-26', impact: 'very-high', campaigns: ['family', 'gifts', 'food'] }
  },
  seasonality: {
    spring: {
      months: [3, 4, 5],
      trends: ['gardening', 'renovation', 'fashion-spring', 'outdoor'],
      budgetMultiplier: 1.1,
      topCategories: ['home', 'fashion', 'beauty', 'travel']
    },
    summer: {
      months: [6, 7, 8],
      trends: ['vacation', 'outdoor-activities', 'festivals', 'bbq'],
      budgetMultiplier: 0.9,
      topCategories: ['travel', 'outdoor', 'fashion-summer', 'food']
    },
    autumn: {
      months: [9, 10, 11],
      trends: ['back-to-school', 'preparation', 'cozy-home', 'warm-clothes'],
      budgetMultiplier: 1.2,
      topCategories: ['education', 'home', 'fashion-autumn', 'electronics']
    },
    winter: {
      months: [12, 1, 2],
      trends: ['christmas', 'gifts', 'indoor-activities', 'new-year'],
      budgetMultiplier: 1.4,
      topCategories: ['gifts', 'electronics', 'home', 'food']
    }
  },
  regions: {
    mazowieckie: { population: 5423000, urbanization: 0.65, avgIncome: 'high' },
    slaskie: { population: 4533000, urbanization: 0.77, avgIncome: 'medium-high' },
    wielkopolskie: { population: 3496000, urbanization: 0.56, avgIncome: 'medium-high' },
    malopolskie: { population: 3410000, urbanization: 0.50, avgIncome: 'medium' },
    dolnoslaskie: { population: 2899000, urbanization: 0.69, avgIncome: 'medium-high' },
    lodzkie: { population: 2466000, urbanization: 0.63, avgIncome: 'medium' },
    zachodniopomorskie: { population: 1703000, urbanization: 0.69, avgIncome: 'medium' },
    lubelskie: { population: 2122000, urbanization: 0.47, avgIncome: 'medium-low' }
  },
  paymentMethods: {
    blik: { popularity: 0.45, ageGroups: ['18-35', '36-50'], regions: ['urban'] },
    card: { popularity: 0.35, ageGroups: ['25-65'], regions: ['all'] },
    przelewy24: { popularity: 0.28, ageGroups: ['25-55'], regions: ['all'] },
    payu: { popularity: 0.25, ageGroups: ['18-45'], regions: ['all'] },
    bankTransfer: { popularity: 0.20, ageGroups: ['35-65'], regions: ['all'] },
    cod: { popularity: 0.15, ageGroups: ['45-65'], regions: ['rural', 'small-cities'] }
  },
  consumerBehavior: {
    priceConsciousness: 'high',
    brandLoyalty: 'medium',
    onlineShoppingGrowth: 0.15,
    mobileCommerce: 0.78,
    socialCommerce: 0.42,
    reviewImportance: 'very-high',
    comparisonShopping: 'high',
    impulsePurchases: 'medium'
  },
  language: {
    formal: { usage: ['B2B', 'luxury', 'healthcare', 'finance'] },
    informal: { usage: ['B2C', 'youth', 'social-media', 'entertainment'] },
    regional: {
      silesian: { region: 'slaskie', usage: 'local-campaigns' },
      kashubian: { region: 'pomorskie', usage: 'regional-identity' },
      highlander: { region: 'malopolskie', usage: 'tourism-mountain' }
    }
  }
};

// KPI Targets and Benchmarks
export const marketingKPIs: MarketingKPIs = {
  acquisition: {
    costPerAcquisition: { target: 150, benchmark: 200, unit: 'PLN' },
    returnOnAdSpend: { target: 4.0, benchmark: 3.2, unit: 'ratio' },
    clickThroughRate: { target: 2.5, benchmark: 1.8, unit: 'percentage' },
    conversionRate: { target: 3.5, benchmark: 2.1, unit: 'percentage' },
    costPerClick: { target: 2.5, benchmark: 3.2, unit: 'PLN' },
    qualityScore: { target: 8, benchmark: 6, unit: 'score-10' }
  },
  retention: {
    customerLifetimeValue: { target: 1500, benchmark: 1200, unit: 'PLN' },
    retentionRate: { target: 85, benchmark: 75, unit: 'percentage' },
    churnRate: { target: 15, benchmark: 25, unit: 'percentage' },
    repeatPurchaseRate: { target: 35, benchmark: 28, unit: 'percentage' },
    averageOrderValue: { target: 250, benchmark: 200, unit: 'PLN' },
    purchaseFrequency: { target: 3.2, benchmark: 2.6, unit: 'times-year' }
  },
  engagement: {
    emailOpenRate: { target: 25, benchmark: 20, unit: 'percentage' },
    emailClickRate: { target: 4, benchmark: 2.5, unit: 'percentage' },
    socialEngagementRate: { target: 5, benchmark: 3, unit: 'percentage' },
    contentShareRate: { target: 2, benchmark: 1.2, unit: 'percentage' },
    brandMentions: { target: 100, benchmark: 60, unit: 'per-month' },
    netPromoterScore: { target: 50, benchmark: 30, unit: 'nps' }
  },
  business: {
    marketShare: { target: 15, benchmark: 10, unit: 'percentage' },
    brandAwareness: { target: 40, benchmark: 25, unit: 'percentage' },
    customerSatisfaction: { target: 4.5, benchmark: 4.0, unit: 'score-5' },
    monthlyRecurringRevenue: { target: 50000, benchmark: 35000, unit: 'PLN' },
    revenueGrowth: { target: 20, benchmark: 12, unit: 'percentage-annual' },
    profitMargin: { target: 25, benchmark: 18, unit: 'percentage' }
  }
};

// Attribution Models Configuration
export const attributionModels: Record<string, AttributionModel> = {
  firstTouch: {
    id: 'first-touch',
    name: 'First Touch Attribution',
    description: 'Przypisuje 100% konwersji pierwszemu punktowi kontaktu',
    weight: 'first-100',
    useCase: 'awareness-campaigns',
    advantages: ['simple', 'awareness-focused'],
    limitations: ['ignores-nurturing', 'oversimplified']
  },
  lastTouch: {
    id: 'last-touch',
    name: 'Last Touch Attribution',
    description: 'Przypisuje 100% konwersji ostatniemu punktowi kontaktu',
    weight: 'last-100',
    useCase: 'conversion-campaigns',
    advantages: ['simple', 'conversion-focused'],
    limitations: ['ignores-journey', 'undervalues-awareness']
  },
  linear: {
    id: 'linear',
    name: 'Linear Attribution',
    description: 'Równomiernie rozdziela wartość między wszystkie punkty kontaktu',
    weight: 'equal-all',
    useCase: 'full-funnel-analysis',
    advantages: ['fair-distribution', 'comprehensive'],
    limitations: ['treats-all-equal', 'may-dilute-impact']
  },
  timeDecay: {
    id: 'time-decay',
    name: 'Time Decay Attribution',
    description: 'Więcej wagi dla punktów kontaktu bliższych konwersji',
    weight: 'time-weighted',
    useCase: 'consideration-phase-focus',
    advantages: ['conversion-proximity', 'logical-weighting'],
    limitations: ['undervalues-early-touch', 'complex-calculation']
  },
  positionBased: {
    id: 'position-based',
    name: 'Position Based Attribution',
    description: '40% pierwszy + 40% ostatni + 20% środkowe punkty kontaktu',
    weight: 'u-shaped',
    useCase: 'balanced-approach',
    advantages: ['highlights-key-moments', 'practical-balance'],
    limitations: ['arbitrary-percentages', 'mid-funnel-undervalue']
  },
  dataDriven: {
    id: 'data-driven',
    name: 'Data-Driven Attribution',
    description: 'ML model określa wagę na podstawie rzeczywistych danych konwersji',
    weight: 'ml-calculated',
    useCase: 'advanced-analysis',
    advantages: ['data-based', 'accurate', 'dynamic'],
    limitations: ['requires-volume', 'complex', 'black-box']
  }
};

// Automation Rules
export const automationRules: AutomationRule[] = [
  {
    id: 'budget-reallocation',
    name: 'Automatyczna realokacja budżetu',
    trigger: 'performance-threshold',
    condition: 'roas < 2.0',
    action: 'reduce-budget-20',
    frequency: 'daily',
    enabled: true,
    description: 'Redukuje budżet kampanii o 20% gdy ROAS spadnie poniżej 2.0'
  },
  {
    id: 'bid-increase',
    name: 'Zwiększenie stawek dla wysokiej wydajności',
    trigger: 'performance-threshold',
    condition: 'roas > 5.0 AND impression-share < 80',
    action: 'increase-bid-15',
    frequency: 'daily',
    enabled: true,
    description: 'Zwiększa stawki o 15% dla kampanii z ROAS > 5.0 i niskim impression share'
  },
  {
    id: 'pause-low-performance',
    name: 'Wstrzymaj słabo działające reklamy',
    trigger: 'performance-threshold',
    condition: 'ctr < 1.0 AND spend > 100',
    action: 'pause-ad',
    frequency: 'daily',
    enabled: true,
    description: 'Wstrzymuje reklamy z CTR < 1% po wydaniu >100 PLN'
  },
  {
    id: 'audience-expansion',
    name: 'Ekspansja grup docelowych',
    trigger: 'performance-threshold',
    condition: 'roas > 4.0 AND frequency < 2.0',
    action: 'expand-audience-10',
    frequency: 'weekly',
    enabled: true,
    description: 'Rozszerza grupy docelowe o 10% dla dobrze działających kampanii'
  },
  {
    id: 'creative-refresh',
    name: 'Odświeżanie kreacji',
    trigger: 'time-based',
    condition: 'creative-age > 14-days',
    action: 'generate-new-creative',
    frequency: 'weekly',
    enabled: true,
    description: 'Generuje nowe kreacje dla reklam starszych niż 14 dni'
  },
  {
    id: 'seasonal-budget-adjustment',
    name: 'Sezonowe dostosowanie budżetu',
    trigger: 'calendar-based',
    condition: 'polish-holiday-week',
    action: 'increase-budget-25',
    frequency: 'event-driven',
    enabled: true,
    description: 'Zwiększa budżet o 25% w tygodniu polskich świąt'
  }
];

// Main Marketing Configuration
export const marketingConfig: MarketingConfig = {
  agent: {
    id: 'agent-12-marketing-maestro',
    name: 'Marketing Maestro',
    version: '1.0.0',
    description: 'AI-powered marketing campaign management and optimization',
    capabilities: [
      'multi-platform-campaigns',
      'ai-creative-generation',
      'automated-optimization',
      'advanced-attribution',
      'polish-market-expertise',
      'predictive-analytics'
    ]
  },
  platforms: marketingPlatforms,
  templates: campaignTemplates,
  creativeAI: creativeModels,
  polishMarket: polishMarketConfig,
  kpis: marketingKPIs,
  attribution: attributionModels,
  automation: automationRules,
  
  // Performance Optimization Settings
  optimization: {
    bidding: {
      strategy: 'smart-bidding',
      adjustmentFrequency: 'hourly',
      performanceWindow: 7,
      confidenceLevel: 0.95
    },
    budget: {
      reallocationThreshold: 0.2,
      maxDailyIncrease: 0.3,
      minCampaignBudget: 50,
      emergencyPause: true
    },
    creative: {
      refreshFrequency: 14,
      testDuration: 7,
      winnersThreshold: 0.05,
      maxVariations: 5
    },
    targeting: {
      audienceExpansion: true,
      lookalikeSimilarity: 0.8,
      exclusionList: true,
      geofencing: true
    }
  },

  // Reporting and Analytics
  reporting: {
    dashboardRefresh: 'real-time',
    reportFrequency: 'daily',
    alertThresholds: {
      roas: 2.0,
      cpa: 200,
      budget: 0.9,
      ctr: 1.0
    },
    customMetrics: [
      'polish-market-score',
      'seasonal-performance',
      'competitive-position',
      'brand-lift'
    ]
  },

  // Integration Settings
  integrations: {
    analytics: ['google-analytics-4', 'facebook-pixel', 'polish-analytics'],
    crm: ['hubspot', 'salesforce', 'polish-crm'],
    ecommerce: ['shopify', 'woocommerce', 'allegro', 'prestashop'],
    email: ['mailchimp', 'getresponse', 'sendinblue'],
    social: ['facebook', 'instagram', 'linkedin', 'tiktok'],
    attribution: ['google-analytics', 'facebook-conversions-api', 'custom-tracking']
  }
};

export default marketingConfig;