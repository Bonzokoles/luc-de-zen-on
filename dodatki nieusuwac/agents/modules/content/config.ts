// 🛡️ Agent 11: Content Guardian - Configuration
// AI-Powered Content Moderation & Generation System

export interface ContentModerationRule {
  id: string;
  name: string;
  type: 'text' | 'image' | 'video' | 'audio';
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'flag' | 'review' | 'block' | 'auto-approve';
  threshold: number;
  enabled: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'google' | 'anthropic' | 'huggingface' | 'aws' | 'custom';
  type: 'moderation' | 'generation' | 'analysis';
  endpoint: string;
  apiKey?: string;
  maxTokens: number;
  temperature: number;
  enabled: boolean;
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'blog' | 'social' | 'email' | 'product' | 'seo' | 'newsletter';
  language: 'pl' | 'en' | 'both';
  prompt: string;
  variables: string[];
  seoOptimized: boolean;
  brandVoice: string;
}

export interface ModerationCategory {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  patterns: RegExp[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoAction: 'approve' | 'flag' | 'block';
}

export interface PerformanceMetric {
  name: string;
  target: number;
  current: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  priority: 'low' | 'medium' | 'high';
}

export const AGENT_CONFIG = {
  id: 'agent-11-content-guardian',
  name: 'Content Guardian',
  description: 'AI-Powered Content Moderation & Generation System',
  version: '1.0.0',
  status: 'active' as const,
  capabilities: [
    'Content Moderation',
    'AI Content Generation', 
    'Sentiment Analysis',
    'Spam Detection',
    'SEO Optimization',
    'Polish Market Focus',
    'Multi-platform Publishing',
    'Performance Analytics'
  ],
  
  // AI Models Configuration
  aiModels: {
    moderation: {
      textModeration: {
        id: 'gpt-4-moderation',
        name: 'OpenAI GPT-4 Moderation',
        provider: 'openai' as const,
        type: 'moderation' as const,
        endpoint: 'https://api.openai.com/v1/moderations',
        maxTokens: 4000,
        temperature: 0.1,
        enabled: true
      },
      perspectiveApi: {
        id: 'google-perspective',
        name: 'Google Perspective API',
        provider: 'google' as const,
        type: 'moderation' as const,
        endpoint: 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze',
        maxTokens: 1000,
        temperature: 0.0,
        enabled: true
      },
      imageModeration: {
        id: 'aws-rekognition',
        name: 'AWS Rekognition',
        provider: 'aws' as const,
        type: 'moderation' as const,
        endpoint: 'https://rekognition.amazonaws.com/',
        maxTokens: 0,
        temperature: 0.0,
        enabled: true
      },
      polishSentiment: {
        id: 'polish-bert-sentiment',
        name: 'Polish BERT Sentiment',
        provider: 'huggingface' as const,
        type: 'analysis' as const,
        endpoint: 'https://api-inference.huggingface.co/models/allegro/herbert-base-cased',
        maxTokens: 512,
        temperature: 0.0,
        enabled: true
      }
    },
    
    generation: {
      gpt4Turbo: {
        id: 'gpt-4-turbo-content',
        name: 'GPT-4 Turbo Content',
        provider: 'openai' as const,
        type: 'generation' as const,
        endpoint: 'https://api.openai.com/v1/chat/completions',
        maxTokens: 4000,
        temperature: 0.7,
        enabled: true
      },
      claude3: {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'anthropic' as const,
        type: 'generation' as const,
        endpoint: 'https://api.anthropic.com/v1/messages',
        maxTokens: 4000,
        temperature: 0.8,
        enabled: true
      },
      geminiPro: {
        id: 'gemini-pro',
        name: 'Google Gemini Pro',
        provider: 'google' as const,
        type: 'generation' as const,
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro',
        maxTokens: 8000,
        temperature: 0.7,
        enabled: true
      },
      polishGpt: {
        id: 'polish-gpt-large',
        name: 'Polish GPT Large',
        provider: 'huggingface' as const,
        type: 'generation' as const,
        endpoint: 'https://api-inference.huggingface.co/models/sdadas/polish-gpt2-large',
        maxTokens: 1024,
        temperature: 0.8,
        enabled: true
      }
    }
  },

  // Moderation Rules & Categories
  moderationRules: [
    {
      id: 'hate-speech-pl',
      name: 'Polish Hate Speech Detection',
      type: 'text' as const,
      severity: 'critical' as const,
      action: 'block' as const,
      threshold: 0.8,
      enabled: true
    },
    {
      id: 'spam-detection',
      name: 'Spam Content Detection',
      type: 'text' as const,
      severity: 'medium' as const,
      action: 'flag' as const,
      threshold: 0.7,
      enabled: true
    },
    {
      id: 'nsfw-images',
      name: 'NSFW Image Detection',
      type: 'image' as const,
      severity: 'high' as const,
      action: 'block' as const,
      threshold: 0.85,
      enabled: true
    },
    {
      id: 'phishing-detection',
      name: 'Phishing Links Detection',
      type: 'text' as const,
      severity: 'critical' as const,
      action: 'block' as const,
      threshold: 0.9,
      enabled: true
    },
    {
      id: 'profanity-pl',
      name: 'Polish Profanity Filter',
      type: 'text' as const,
      severity: 'medium' as const,
      action: 'flag' as const,
      threshold: 0.6,
      enabled: true
    }
  ] as ContentModerationRule[],

  moderationCategories: [
    {
      id: 'hate-speech',
      name: 'Mowa Nienawiści',
      description: 'Treści zawierające mowę nienawiści na tle rasowym, religijnym lub narodowościowym',
      keywords: ['nienawiść', 'rasizm', 'ksenofobia', 'antysemityzm'],
      patterns: [
        /(?:^|[^\p{L}\p{N}_])(żydzi|murzyni|ukraincy).*(źli|gorsi|winni)(?=$|[^\p{L}\p{N}_])/giu,
      ],
      severity: 'critical' as const,
      autoAction: 'block' as const
    },
    {
      id: 'spam',
      name: 'Spam i Reklamy',
      description: 'Niechciane treści reklamowe i spam',
      keywords: ['kup teraz', 'promocja', 'darmowe', 'zarobek', 'bitcoin'],
      patterns: [
        /(?:^|[^\p{L}\p{N}_])(kliknij|sprawdź|zobacz).*(link|tutaj|www)(?=$|[^\p{L}\p{N}_])/giu,
      ],
      severity: 'medium' as const,
      autoAction: 'flag' as const
    },
    {
      id: 'violence',
      name: 'Przemoc i Zagrożenia',
      description: 'Treści zawierające groźby lub przemoc',
      keywords: ['zabić', 'zniszczyć', 'zemsta', 'terror', 'bomba'],
      patterns: [
        /(?:^|[^\p{L}\p{N}_])(zabiję|zniszczę|zemścię się)(?=$|[^\p{L}\p{N}_])/giu,
      ],
      severity: 'critical' as const,
      autoAction: 'block' as const
    },
    {
      id: 'misinformation',
      name: 'Dezinformacja',
      description: 'Fałszywe informacje i teorie spiskowe',
      keywords: ['fałszywa pandemia', 'chip w szczepionkach', 'płaska ziemia'],
      patterns: [
        /(?:^|[^\p{L}\p{N}_])(rząd kłamie|ukrywają prawdę|spisek)(?=$|[^\p{L}\p{N}_])/giu,
      ],
      severity: 'high' as const,
      autoAction: 'flag' as const
    },
    {
      id: 'personal-data',
      name: 'Dane Osobowe',
      description: 'Nieautoryzowane udostępnianie danych osobowych',
      keywords: ['pesel', 'numer telefonu', 'adres zamieszkania'],
      patterns: [
        /(?:^|[^\p{L}\p{N}_])(\d{11}|\+48\s?\d{9})(?=$|[^\p{L}\p{N}_])/giu,
      ],
      severity: 'high' as const,
      autoAction: 'block' as const
    }
  ] as ModerationCategory[],

  // Content Generation Templates
  contentTemplates: [
    {
      id: 'blog-post-seo',
      name: 'Artykuł Blogowy SEO',
      type: 'blog' as const,
      language: 'pl' as const,
      prompt: `Napisz artykuł blogowy na temat "{topic}" w języku polskim. Artykuł powinien:
- Mieć 800-1200 słów
- Zawierać słowo kluczowe "{keyword}" 5-7 razy naturalnie
- Mieć strukturę H2/H3 dla lepszego SEO  
- Być napisany w przyjaznym, ale profesjonalnym tonie
- Zawierać praktyczne porady i przykłady
- Mieć engaging intro i podsumowanie z call-to-action`,
      variables: ['topic', 'keyword', 'brand', 'cta'],
      seoOptimized: true,
      brandVoice: 'professional-friendly'
    },
    {
      id: 'social-media-post',
      name: 'Post Social Media',
      type: 'social' as const,
      language: 'pl' as const,
      prompt: `Utwórz angażujący post na social media na temat "{topic}". Post powinien:
- Mieć maksymalnie 280 znaków (Twitter) lub 500 znaków (Facebook/LinkedIn)
- Zawierać relevant hashtagi (#hashtag1 #hashtag2)
- Mieć call-to-action zachęcający do interakcji
- Być napisany w tonie marki: {brandVoice}
- Zawierać emoji dla większej atrakcyjności wizualnej`,
      variables: ['topic', 'hashtags', 'brandVoice', 'platform'],
      seoOptimized: false,
      brandVoice: 'casual-engaging'
    },
    {
      id: 'product-description',
      name: 'Opis Produktu',
      type: 'product' as const,
      language: 'pl' as const,
      prompt: `Napisz przekonujący opis produktu "{productName}". Opis powinien:
- Mieć 150-300 słów
- Podkreślać główne korzyści i cechy produktu
- Używać persuasyjnego języka sprzedażowego
- Zawierać słowa kluczowe: {keywords}
- Odpowiadać na potencjalne obiekcje klientów
- Kończyć się silnym call-to-action`,
      variables: ['productName', 'features', 'benefits', 'keywords', 'price'],
      seoOptimized: true,
      brandVoice: 'persuasive-trustworthy'
    },
    {
      id: 'email-campaign',
      name: 'Kampania Email',
      type: 'email' as const,
      language: 'pl' as const,
      prompt: `Utwórz email marketingowy na temat "{subject}". Email powinien:
- Mieć captivating subject line (maksymalnie 50 znaków)
- Personalizowany opening z imieniem: {firstName}
- Główną treść 200-400 słów z jasnym value proposition
- Maksymalnie 2 call-to-action buttony
- Professional ale warm ton komunikacji
- P.S. z dodatkową motywacją do działania`,
      variables: ['subject', 'firstName', 'offer', 'deadline', 'benefits'],
      seoOptimized: false,
      brandVoice: 'professional-warm'
    },
    {
      id: 'seo-meta-tags',
      name: 'Meta Tagi SEO',
      type: 'seo' as const,
      language: 'pl' as const,
      prompt: `Stwórz meta title i description dla strony o temacie "{topic}":

META TITLE (maksymalnie 60 znaków):
- Zawiera główne słowo kluczowe "{keyword}"
- Jest klikalne i engaging
- Zawiera markę/domenę na końcu

META DESCRIPTION (maksymalnie 160 znaków):
- Opisuje zawartość strony w sposób przekonujący
- Zawiera słowo kluczowe i synonymy
- Zawiera call-to-action zachęcający do kliknięcia
- Jest napisana naturalnie dla użytkownika`,
      variables: ['topic', 'keyword', 'brand', 'pageType'],
      seoOptimized: true,
      brandVoice: 'seo-optimized'
    },
    {
      id: 'newsletter-content',
      name: 'Newsletter Content',
      type: 'newsletter' as const,
      language: 'pl' as const,
      prompt: `Napisz content do newslettera tygodniowego. Newsletter powinien zawierać:
- Catchy intro z powitaniem czytelników
- 3-4 główne sekcje z różnymi tematami: {topics}
- Krótkie, scannowalne akapity (2-3 zdania max)
- Linki do pełnych artykułów na stronie
- Sekcję "Tip of the Week" z praktyczną radą
- Warm closing z zachętą do odpowiedzi`,
      variables: ['topics', 'weekNumber', 'mainTheme', 'tipOfWeek'],
      seoOptimized: false,
      brandVoice: 'friendly-informative'
    }
  ] as ContentTemplate[],

  // Polish Market Specific Configuration
  polishMarketConfig: {
    holidays: [
      { date: '2024-01-01', name: 'Nowy Rok' },
      { date: '2024-01-06', name: 'Święto Trzech Króli' },
      { date: '2024-03-31', name: 'Wielkanoc' },
      { date: '2024-04-01', name: 'Poniedziałek Wielkanocny' },
      { date: '2024-05-01', name: 'Święto Pracy' },
      { date: '2024-05-03', name: 'Święto Konstytucji 3 Maja' },
      { date: '2024-05-19', name: 'Zielone Świątki' },
      { date: '2024-05-30', name: 'Boże Ciało' },
      { date: '2024-08-15', name: 'Wniebowzięcie NMP' },
      { date: '2024-11-01', name: 'Wszystkich Świętych' },
      { date: '2024-11-11', name: 'Narodowe Święto Niepodległości' },
      { date: '2024-12-25', name: 'Boże Narodzenie' },
      { date: '2024-12-26', name: 'Drugi dzień Świąt' }
    ],
    
    seasonalTrends: {
      'Q1': ['noworoczne postanowienia', 'walentynki', 'dzień kobiet'],
      'Q2': ['wielkanoc', 'majówka', 'dzień matki', 'wakacje'],
      'Q3': ['wakacje', 'powrót do szkoły', 'jesienne trendy'],
      'Q4': ['black friday', 'mikołajki', 'boże narodzenie', 'sylwester']
    },
    
    culturalContext: {
      formalityLevel: 'mixed', // formal business, informal social media
      preferredSocialPlatforms: ['Facebook', 'Instagram', 'TikTok', 'LinkedIn'],
      paymentMethods: ['BLIK', 'Karty płatnicze', 'Przelew tradycyjny', 'Za pobraniem'],
      shoppingBehavior: {
        peakHours: ['19:00-22:00'],
        peakDays: ['Thursday', 'Friday', 'Saturday'],
        mobilePurchases: 0.65,
        avgOrderValue: 180
      }
    },
    
    seoKeywords: {
      highValue: ['jak', 'najlepsze', 'porównanie', 'opinie', 'cena', 'sklep', 'gdzie kupić'],
      localModifiers: ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań'],
      seasonalModifiers: ['2024', 'aktualne', 'nowe', 'promocja', 'wyprzedaż']
    }
  },

  // Performance Metrics & Targets
  performanceTargets: {
    moderation: {
      accuracy: { target: 95, current: 0, unit: '%', trend: 'stable' as const, priority: 'high' as const },
      responseTime: { target: 2, current: 0, unit: 'seconds', trend: 'stable' as const, priority: 'high' as const },
      falsePositives: { target: 5, current: 0, unit: '%', trend: 'down' as const, priority: 'medium' as const },
      queueProcessing: { target: 60, current: 0, unit: 'minutes', trend: 'down' as const, priority: 'medium' as const }
    },
    
    contentGeneration: {
      qualityScore: { target: 8, current: 0, unit: '/10', trend: 'up' as const, priority: 'high' as const },
      seoRankings: { target: 70, current: 0, unit: '% in top 10', trend: 'up' as const, priority: 'high' as const },
      engagementRate: { target: 5, current: 0, unit: '%', trend: 'up' as const, priority: 'medium' as const },
      timeToPublish: { target: 30, current: 0, unit: 'minutes', trend: 'down' as const, priority: 'low' as const }
    },
    
    business: {
      costReduction: { target: 60, current: 0, unit: '% savings', trend: 'up' as const, priority: 'high' as const },
      contentVolume: { target: 300, current: 0, unit: '% increase', trend: 'up' as const, priority: 'medium' as const },
      revenueImpact: { target: 25, current: 0, unit: '% growth', trend: 'up' as const, priority: 'high' as const },
      teamProductivity: { target: 150, current: 0, unit: '% increase', trend: 'up' as const, priority: 'medium' as const }
    }
  },

  // Alert System Configuration
  alertSystem: {
    moderationAlerts: {
      criticalContent: {
        enabled: true,
        threshold: 0.9,
        channels: ['email', 'slack', 'dashboard'],
        escalationTime: 300 // 5 minutes
      },
      queueBacklog: {
        enabled: true,
        threshold: 100, // items in queue
        channels: ['email', 'dashboard'],
        escalationTime: 1800 // 30 minutes
      },
      falsePositiveRate: {
        enabled: true,
        threshold: 10, // % false positives
        channels: ['email'],
        escalationTime: 3600 // 1 hour
      }
    },
    
    performanceAlerts: {
      apiResponseTime: {
        enabled: true,
        threshold: 5000, // 5 seconds
        channels: ['slack', 'dashboard'],
        escalationTime: 900 // 15 minutes
      },
      generationFailures: {
        enabled: true,
        threshold: 5, // % failure rate
        channels: ['email', 'slack'],
        escalationTime: 1800 // 30 minutes
      }
    }
  },

  // Integration Settings
  integrations: {
    cms: {
      wordpress: { enabled: true, webhook: '/api/webhook/wordpress' },
      drupal: { enabled: false, webhook: '/api/webhook/drupal' },
      shopify: { enabled: true, webhook: '/api/webhook/shopify' }
    },
    
    socialMedia: {
      facebook: { enabled: true, apiVersion: 'v18.0' },
      instagram: { enabled: true, businessAccount: true },
      twitter: { enabled: true, apiVersion: 'v2' },
      linkedin: { enabled: false, companyPage: true }
    },
    
    email: {
      mailchimp: { enabled: true, listId: '' },
      sendgrid: { enabled: false, templateId: '' },
      getresponse: { enabled: false, campaignId: '' }
    },
    
    analytics: {
      googleAnalytics: { enabled: true, propertyId: '' },
      googleSearchConsole: { enabled: true, siteUrl: '' },
      facebookPixel: { enabled: true, pixelId: '' }
    }
  }
};

export default AGENT_CONFIG;