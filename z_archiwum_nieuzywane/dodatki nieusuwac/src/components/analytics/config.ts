// 📊 Agent 10 Analytics Prophet - Configuration
import type { AnalyticsModelConfig, DataSourceConfig, AlertConfig } from '../../types/analytics';

export const AGENT_CONFIG = {
  // Podstawowe informacje o agencie
  agentId: 'agent-10-analytics-prophet',
  name: 'Analytics Prophet',
  version: '1.0.0',
  description: 'Zaawansowany system analityki predykcyjnej z ML forecasting',
  
  // Modele Machine Learning
  mlModels: {
    forecasting: {
      prophet: {
        enabled: true,
        horizon: 90, // dni prognozy
        confidence: 0.95, // poziom ufności
        seasonality: true,
        holidays: true,
        growth: 'linear', // 'linear' | 'logistic'
        changepoints: 0.8,
        parameters: {
          seasonality_prior_scale: 10.0,
          holidays_prior_scale: 10.0,
          changepoint_prior_scale: 0.05
        }
      },
      
      arima: {
        enabled: true,
        order: [1, 1, 1], // (p,d,q)
        seasonal_order: [1, 1, 1, 12], // (P,D,Q,s)
        horizon: 30,
        confidence: 0.90
      },
      
      linearRegression: {
        enabled: true,
        features: ['trend', 'seasonality', 'external_factors'],
        regularization: 'ridge',
        alpha: 0.1,
        horizon: 60
      },
      
      neuralNetwork: {
        enabled: false, // Wyłączone domyślnie - wymaga więcej danych
        architecture: 'lstm',
        layers: [50, 25, 1],
        epochs: 100,
        horizon: 30,
        validation_split: 0.2
      }
    },
    
    anomalyDetection: {
      isolationForest: {
        enabled: true,
        contamination: 0.1,
        n_estimators: 100,
        sensitivity: 'medium'
      },
      
      zScore: {
        enabled: true,
        threshold: 3.0,
        window: 30, // dni
        min_periods: 7
      },
      
      dbscan: {
        enabled: false,
        eps: 0.5,
        min_samples: 5
      }
    },
    
    attribution: {
      multiTouch: {
        enabled: true,
        model: 'time_decay', // 'linear' | 'time_decay' | 'position_based'
        lookback_window: 30, // dni
        decay_factor: 0.6
      },
      
      shapley: {
        enabled: true,
        iterations: 1000,
        channels: ['organic', 'paid_search', 'social', 'direct', 'referral', 'email']
      }
    }
  },
  
  // Źródła danych
  dataSources: {
    googleAnalytics4: {
      enabled: true,
      property_id: '',
      metrics: [
        'sessions',
        'totalUsers',
        'screenPageViews',
        'bounceRate',
        'averageSessionDuration',
        'conversions',
        'totalRevenue'
      ],
      dimensions: [
        'date',
        'sessionSource',
        'sessionMedium',
        'sessionCampaignName',
        'country',
        'deviceCategory',
        'sessionDefaultChannelGrouping'
      ],
      quotas: {
        daily: 25000,
        hourly: 14000
      }
    },
    
    googleSearchConsole: {
      enabled: true,
      site_url: '',
      metrics: ['clicks', 'impressions', 'ctr', 'position'],
      dimensions: ['date', 'query', 'page', 'country', 'device'],
      max_rows: 25000
    },
    
    googleAds: {
      enabled: true,
      customer_id: '',
      metrics: [
        'impressions', 'clicks', 'cost', 'conversions', 
        'conversion_value', 'ctr', 'cpc', 'cpa', 'roas'
      ],
      segments: ['date', 'campaign', 'adGroup', 'device'],
      version: 'v14'
    },
    
    facebookAds: {
      enabled: true,
      ad_account_id: '',
      metrics: [
        'impressions', 'clicks', 'spend', 'reach', 'frequency',
        'cpm', 'cpc', 'ctr', 'conversions', 'conversion_value'
      ],
      breakdowns: ['age', 'gender', 'country', 'placement', 'device_platform']
    },
    
    ecommerce: {
      woocommerce: {
        enabled: false,
        api_url: '',
        consumer_key: '',
        consumer_secret: '',
        version: 'wc/v3'
      },
      
      shopify: {
        enabled: false,
        shop_domain: '',
        access_token: '',
        version: '2023-10'
      }
    },
    
    crm: {
      hubspot: {
        enabled: false,
        api_key: '',
        portal_id: ''
      },
      
      salesforce: {
        enabled: false,
        instance_url: '',
        access_token: '',
        version: 'v58.0'
      }
    }
  },
  
  // Metryki i KPI
  kpiTargets: {
    traffic: {
      monthly_sessions: 100000,
      monthly_users: 75000,
      bounce_rate_max: 0.45,
      session_duration_min: 120, // sekundy
      pages_per_session_min: 2.5
    },
    
    conversion: {
      overall_rate_min: 0.02, // 2%
      ecommerce_rate_min: 0.015, // 1.5%
      lead_gen_rate_min: 0.05, // 5%
      micro_conversion_rate: 0.1 // 10%
    },
    
    revenue: {
      monthly_target: 500000, // PLN
      avg_order_value_min: 150, // PLN
      customer_lifetime_value: 800, // PLN
      return_customer_rate: 0.3 // 30%
    },
    
    marketing: {
      cac_max: 50, // PLN - Customer Acquisition Cost
      roas_min: 4.0, // Return on Ad Spend
      ltv_cac_ratio_min: 16, // LTV/CAC ratio
      payback_period_max: 3 // miesiące
    }
  },
  
  // Alerty i notyfikacje
  alerts: {
    traffic: {
      daily_drop: {
        enabled: true,
        threshold: -0.2, // -20%
        metric: 'sessions',
        comparison: 'previous_day',
        channels: ['email', 'slack']
      },
      
      weekly_drop: {
        enabled: true,
        threshold: -0.15, // -15%
        metric: 'users',
        comparison: 'previous_week',
        channels: ['email']
      }
    },
    
    conversion: {
      rate_drop: {
        enabled: true,
        threshold: -0.25, // -25%
        metric: 'conversion_rate',
        comparison: 'previous_7_days',
        channels: ['email', 'slack']
      },
      
      goal_completion: {
        enabled: true,
        threshold: -0.3, // -30%
        metric: 'goal_completions',
        comparison: 'previous_day',
        channels: ['email']
      }
    },
    
    revenue: {
      daily_target: {
        enabled: true,
        target: 16667, // PLN (500k/30 dni)
        metric: 'revenue',
        comparison: 'target',
        channels: ['email', 'slack']
      },
      
      roas_drop: {
        enabled: true,
        threshold: 3.0, // poniżej 3.0
        metric: 'roas',
        comparison: 'absolute',
        channels: ['email']
      }
    },
    
    anomalies: {
      traffic_spike: {
        enabled: true,
        algorithm: 'z_score',
        sensitivity: 3.0,
        channels: ['slack']
      },
      
      cost_anomaly: {
        enabled: true,
        algorithm: 'isolation_forest',
        sensitivity: 'medium',
        channels: ['email', 'slack']
      }
    }
  },
  
  // Harmonogramy raportów
  reportSchedules: {
    executive_daily: {
      enabled: true,
      frequency: 'daily',
      time: '08:00',
      timezone: 'Europe/Warsaw',
      recipients: ['ceo@company.com', 'cmo@company.com'],
      format: 'pdf',
      metrics: ['revenue', 'sessions', 'conversions', 'roas']
    },
    
    marketing_weekly: {
      enabled: true,
      frequency: 'weekly',
      day: 'monday',
      time: '09:00',
      timezone: 'Europe/Warsaw',
      recipients: ['marketing@company.com'],
      format: 'html',
      sections: ['campaign_performance', 'channel_attribution', 'forecasts']
    },
    
    detailed_monthly: {
      enabled: true,
      frequency: 'monthly',
      day: 1,
      time: '10:00',
      timezone: 'Europe/Warsaw',
      recipients: ['analytics@company.com'],
      format: 'excel',
      include_raw_data: true
    }
  },
  
  // Polski rynek - specyfika
  polishMarket: {
    holidays: [
      { date: '2024-01-01', name: 'Nowy Rok' },
      { date: '2024-01-06', name: 'Trzech Króli' },
      { date: '2024-03-31', name: 'Wielkanoc' },
      { date: '2024-04-01', name: 'Poniedziałek Wielkanocny' },
      { date: '2024-05-01', name: 'Święto Pracy' },
      { date: '2024-05-03', name: 'Święto Konstytucji 3 Maja' },
      { date: '2024-05-19', name: 'Zielone Świątki' },
      { date: '2024-05-30', name: 'Boże Ciało' },
      { date: '2024-08-15', name: 'Wniebowzięcie NMP' },
      { date: '2024-11-01', name: 'Wszystkich Świętych' },
      { date: '2024-11-11', name: 'Niepodległość' },
      { date: '2024-12-25', name: 'Boże Narodzenie' },
      { date: '2024-12-26', name: 'Drugi dzień świąt' }
    ],
    
    seasonality: {
      shopping: {
        back_to_school: { start: '2024-08-15', end: '2024-09-15', impact: 1.3 },
        black_friday: { start: '2024-11-24', end: '2024-11-30', impact: 2.5 },
        christmas: { start: '2024-12-01', end: '2024-12-24', impact: 2.0 },
        january_sales: { start: '2024-01-02', end: '2024-01-31', impact: 1.4 },
        valentines: { start: '2024-02-10', end: '2024-02-14', impact: 1.2 }
      },
      
      traffic: {
        summer_vacation: { start: '2024-07-01', end: '2024-08-31', impact: 0.8 },
        winter_holidays: { start: '2024-12-20', end: '2024-01-07', impact: 0.7 },
        easter_break: { start: '2024-03-28', end: '2024-04-02', impact: 0.9 }
      }
    },
    
    paymentMethods: {
      blik: { market_share: 0.35, growth_rate: 0.15 },
      card: { market_share: 0.40, growth_rate: 0.05 },
      transfer: { market_share: 0.20, growth_rate: -0.05 },
      cod: { market_share: 0.05, growth_rate: -0.10 }
    },
    
    demographics: {
      age_groups: {
        '18_24': { share: 0.15, digital_adoption: 0.95 },
        '25_34': { share: 0.25, digital_adoption: 0.90 },
        '35_44': { share: 0.20, digital_adoption: 0.85 },
        '45_54': { share: 0.20, digital_adoption: 0.75 },
        '55_plus': { share: 0.20, digital_adoption: 0.60 }
      },
      
      regions: {
        mazowieckie: { share: 0.17, gdp_per_capita: 'high' },
        slaskie: { share: 0.13, gdp_per_capita: 'medium' },
        wielkopolskie: { share: 0.10, gdp_per_capita: 'high' },
        malopolskie: { share: 0.09, gdp_per_capita: 'medium' },
        dolnoslaskie: { share: 0.08, gdp_per_capita: 'high' }
      }
    }
  },
  
  // Cache i wydajność
  performance: {
    cache: {
      ttl_short: 300, // 5 minut
      ttl_medium: 3600, // 1 godzina
      ttl_long: 86400, // 24 godziny
      ttl_forecasts: 43200 // 12 godzin
    },
    
    batch_processing: {
      max_batch_size: 1000,
      concurrent_requests: 5,
      retry_attempts: 3,
      retry_delay: 2000 // ms
    },
    
    real_time: {
      update_frequency: 60000, // 1 minuta
      buffer_size: 100,
      websocket_timeout: 30000
    }
  },
  
  // Limity API
  apiLimits: {
    ga4: {
      requests_per_day: 25000,
      requests_per_hour: 14000,
      concurrent_requests: 10
    },
    
    google_ads: {
      requests_per_day: 15000,
      requests_per_minute: 40,
      operations_per_minute: 8000
    },
    
    facebook: {
      requests_per_hour: 200,
      requests_per_app_per_hour: 4800
    }
  }
} as const;

// Typy konfiguracji
export type AnalyticsConfig = typeof AGENT_CONFIG;
export type MLModel = keyof typeof AGENT_CONFIG.mlModels;
export type DataSource = keyof typeof AGENT_CONFIG.dataSources;
export type AlertType = keyof typeof AGENT_CONFIG.alerts;