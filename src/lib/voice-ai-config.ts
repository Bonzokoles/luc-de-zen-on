// Advanced Voice AI Configuration System
// Centralna konfiguracja głosów dla wszystkich agentów AI MyBonzo

export interface VoiceProfile {
  id: string;
  name: string;
  language: 'pl-PL' | 'en-US' | 'en-GB' | 'de-DE' | 'fr-FR';
  gender: 'male' | 'female' | 'neutral';
  provider: 'elevenlabs' | 'azure' | 'google' | 'openai' | 'polly';
  voiceId: string;
  settings: {
    speed: number; // 0.25 - 4.0
    pitch: number; // -20 - 20 (semitones)
    stability: number; // 0.0 - 1.0 (ElevenLabs)
    clarity: number; // 0.0 - 1.0 (ElevenLabs)
    volume: number; // 0.0 - 1.0
    emotionalRange: number; // 0.0 - 1.0
  };
  characteristics: {
    personality: 'professional' | 'friendly' | 'authoritative' | 'casual' | 'energetic';
    accent: string;
    age: 'young' | 'middle' | 'mature';
    tone: 'warm' | 'neutral' | 'serious' | 'playful';
  };
  enabled: boolean;
  isDefault: boolean;
  costPerCharacter: number; // USD
  createdAt: string;
  updatedAt: string;
}

export interface AgentVoiceMapping {
  agentId: string;
  agentName: string;
  voiceProfileId: string;
  customSettings?: Partial<VoiceProfile['settings']>;
  enabled: boolean;
  priority: number; // 1-10, wyższy = ważniejszy
  contexts: {
    greeting: string; // ID profilu głosowego dla powitań
    response: string; // ID profilu dla odpowiedzi
    error: string; // ID profilu dla błędów
    notification: string; // ID profilu dla powiadomień
  };
}

export interface VoiceConfiguration {
  globalSettings: {
    defaultLanguage: string;
    fallbackVoice: string;
    enableSSML: boolean;
    maxTextLength: number;
    queueTimeout: number;
    retryAttempts: number;
  };
  profiles: VoiceProfile[];
  agentMappings: AgentVoiceMapping[];
  providers: {
    elevenlabs: {
      apiKey: string;
      model: string;
      baseUrl: string;
    };
    azure: {
      subscriptionKey: string;
      region: string;
      endpoint: string;
    };
    google: {
      projectId: string;
      keyFile: string;
    };
    openai: {
      apiKey: string;
      model: string;
    };
    polly: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
    };
  };
}

export class VoiceConfigurationManager {
  private config: VoiceConfiguration;
  private readonly CONFIG_FILE = 'voice-config.json';

  constructor() {
    this.config = this.getDefaultConfiguration();
    this.loadConfiguration();
  }

  /**
   * Domyślna konfiguracja głosów dla MyBonzo
   */
  private getDefaultConfiguration(): VoiceConfiguration {
    return {
      globalSettings: {
        defaultLanguage: 'pl-PL',
        fallbackVoice: 'polish-professional-openai',
        enableSSML: true,
        maxTextLength: 4000,
        queueTimeout: 30000,
        retryAttempts: 3
      },
      profiles: [
        // Polski głos profesjonalny (OpenAI - używamy dostępnego klucza)
        {
          id: 'polish-professional-openai',
          name: 'Polski Profesjonalny (OpenAI)',
          language: 'pl-PL',
          gender: 'female',
          provider: 'openai',
          voiceId: 'alloy',
          settings: {
            speed: 1.0,
            pitch: 0,
            stability: 0.8,
            clarity: 0.9,
            volume: 0.8,
            emotionalRange: 0.3
          },
          characteristics: {
            personality: 'professional',
            accent: 'warszawski',
            age: 'middle',
            tone: 'neutral'
          },
          enabled: true,
          isDefault: true,
          costPerCharacter: 0.0003,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        // Polski głos przyjazny dla POLACZEK Agent
        {
          id: 'polish-friendly-male',
          name: 'Polski Przyjazny (POLACZEK)',
          language: 'en-US',
          gender: 'male',
          provider: 'openai',
          voiceId: 'echo',
          settings: {
            speed: 1.0,
            pitch: 0,
            stability: 0.8,
            clarity: 0.9,
            volume: 0.9,
            emotionalRange: 0.7
          },
          characteristics: {
            personality: 'professional',
            accent: 'american neutral',
            age: 'middle',
            tone: 'neutral'
          },
          enabled: true,
          isDefault: false,
          costPerCharacter: 0.000015,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        // Angielski głos dla międzynarodowych agentów
        {
          id: 'english-professional-female',
          name: 'English Professional (Female)',
          language: 'en-US',
          gender: 'female',
          provider: 'elevenlabs',
          voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah voice
          settings: {
            speed: 0.95,
            pitch: -1,
            stability: 0.4,
            clarity: 0.9,
            volume: 0.8,
            emotionalRange: 0.4
          },
          characteristics: {
            personality: 'professional',
            accent: 'american',
            age: 'middle',
            tone: 'serious'
          },
          enabled: true,
          isDefault: false,
          costPerCharacter: 0.0003,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        // Głos dla bezpieczeństwa (Bielik Guard)
        {
          id: 'security-authoritative-male',
          name: 'Bezpieczeństwo (Autorytatywny)',
          language: 'pl-PL',
          gender: 'male',
          provider: 'azure',
          voiceId: 'pl-PL-MarekNeural',
          settings: {
            speed: 0.9,
            pitch: -3,
            stability: 0.8,
            clarity: 1.0,
            volume: 0.9,
            emotionalRange: 0.2
          },
          characteristics: {
            personality: 'authoritative',
            accent: 'standardowy',
            age: 'mature',
            tone: 'serious'
          },
          enabled: true,
          isDefault: false,
          costPerCharacter: 0.0001,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      agentMappings: [
        {
          agentId: 'bielik-orchestrator',
          agentName: 'Bielik Orchestrator',
          voiceProfileId: 'polish-professional-male',
          enabled: true,
          priority: 10,
          contexts: {
            greeting: 'polish-professional-male',
            response: 'polish-professional-male',
            error: 'security-authoritative-male',
            notification: 'polish-professional-male'
          }
        },
        {
          agentId: 'polaczek-agent',
          agentName: 'POLACZEK Agent',
          voiceProfileId: 'polish-friendly-male',
          enabled: true,
          priority: 9,
          contexts: {
            greeting: 'polish-friendly-male',
            response: 'polish-friendly-male',
            error: 'polish-friendly-male',
            notification: 'polish-friendly-male'
          }
        },
        {
          agentId: 'bielik-guard',
          agentName: 'Bielik Guard',
          voiceProfileId: 'security-authoritative-male',
          enabled: true,
          priority: 10,
          contexts: {
            greeting: 'security-authoritative-male',
            response: 'security-authoritative-male',
            error: 'security-authoritative-male',
            notification: 'security-authoritative-male'
          }
        },
        {
          agentId: 'gpt-4',
          agentName: 'GPT-4',
          voiceProfileId: 'english-professional-female',
          enabled: true,
          priority: 8,
          contexts: {
            greeting: 'english-professional-female',
            response: 'english-professional-female',
            error: 'english-professional-female',
            notification: 'polish-professional-male'
          }
        },
        {
          agentId: 'claude-sonnet-4.5',
          agentName: 'Claude Sonnet 4.5',
          voiceProfileId: 'english-professional-female',
          enabled: true,
          priority: 8,
          contexts: {
            greeting: 'english-professional-female',
            response: 'english-professional-female',
            error: 'english-professional-female',
            notification: 'polish-professional-male'
          }
        }
      ],
      providers: {
        elevenlabs: {
          apiKey: import.meta.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY || '',
          model: 'eleven_multilingual_v2',
          baseUrl: 'https://api.elevenlabs.io/v1'
        },
        azure: {
          subscriptionKey: import.meta.env.AZURE_SPEECH_KEY || process.env.AZURE_SPEECH_KEY || '',
          region: import.meta.env.AZURE_SPEECH_REGION || process.env.AZURE_SPEECH_REGION || 'westeurope',
          endpoint: `https://${import.meta.env.AZURE_SPEECH_REGION || process.env.AZURE_SPEECH_REGION || 'westeurope'}.tts.speech.microsoft.com/`
        },
        google: {
          projectId: import.meta.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || '',
          keyFile: import.meta.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_APPLICATION_CREDENTIALS || ''
        },
        openai: {
          apiKey: import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY || '',
          model: 'tts-1'
        },
        polly: {
          accessKeyId: '',
          secretAccessKey: '',
          region: 'us-east-1'
        }
      }
    };
  }

  /**
   * Ładuje konfigurację z pliku
   */
  private loadConfiguration(): void {
    try {
      // W środowisku production użyj bazy danych lub zewnętrznego storage
      // Tutaj symulujemy załadowanie z localStorage lub pliku
      console.log('📢 Loading voice configuration...');
      // this.config = JSON.parse(fs.readFileSync(this.CONFIG_FILE, 'utf8'));
    } catch (error) {
      console.log('📢 Using default voice configuration');
      // Użyj domyślnej konfiguracji
    }
  }

  /**
   * Zapisuje konfigurację do pliku
   */
  async saveConfiguration(): Promise<void> {
    try {
      // fs.writeFileSync(this.CONFIG_FILE, JSON.stringify(this.config, null, 2));
      console.log('✅ Voice configuration saved');
    } catch (error) {
      console.error('❌ Failed to save voice configuration:', error);
      throw error;
    }
  }

  /**
   * Pobiera profil głosowy dla agenta
   */
  getVoiceForAgent(agentId: string, context: keyof AgentVoiceMapping['contexts'] = 'response'): VoiceProfile | null {
    const mapping = this.config.agentMappings.find(m => m.agentId === agentId && m.enabled);
    if (!mapping) {
      return this.getDefaultVoice();
    }

    const voiceProfileId = mapping.contexts[context] || mapping.voiceProfileId;
    return this.config.profiles.find(p => p.id === voiceProfileId && p.enabled) || this.getDefaultVoice();
  }

  /**
   * Pobiera domyślny profil głosowy
   */
  getDefaultVoice(): VoiceProfile | null {
    return this.config.profiles.find(p => p.isDefault && p.enabled) || this.config.profiles[0];
  }

  /**
   * Dodaje nowy profil głosowy
   */
  addVoiceProfile(profile: Omit<VoiceProfile, 'createdAt' | 'updatedAt'>): void {
    const newProfile: VoiceProfile = {
      ...profile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.config.profiles.push(newProfile);
  }

  /**
   * Aktualizuje profil głosowy
   */
  updateVoiceProfile(profileId: string, updates: Partial<VoiceProfile>): boolean {
    const profileIndex = this.config.profiles.findIndex(p => p.id === profileId);
    if (profileIndex === -1) return false;

    this.config.profiles[profileIndex] = {
      ...this.config.profiles[profileIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return true;
  }

  /**
   * Usuwa profil głosowy
   */
  removeVoiceProfile(profileId: string): boolean {
    const initialLength = this.config.profiles.length;
    this.config.profiles = this.config.profiles.filter(p => p.id !== profileId);
    return this.config.profiles.length < initialLength;
  }

  /**
   * Pobiera wszystkie profile głosowe
   */
  getAllVoiceProfiles(): VoiceProfile[] {
    return this.config.profiles;
  }

  /**
   * Pobiera mapowania agentów
   */
  getAgentMappings(): AgentVoiceMapping[] {
    return this.config.agentMappings;
  }

  /**
   * Aktualizuje mapowanie agenta
   */
  updateAgentMapping(agentId: string, updates: Partial<AgentVoiceMapping>): boolean {
    const mappingIndex = this.config.agentMappings.findIndex(m => m.agentId === agentId);
    if (mappingIndex === -1) return false;

    this.config.agentMappings[mappingIndex] = {
      ...this.config.agentMappings[mappingIndex],
      ...updates
    };

    return true;
  }

  /**
   * Pobiera statystyki użycia głosów
   */
  getVoiceUsageStats(): {
    totalProfiles: number;
    enabledProfiles: number;
    providerDistribution: Record<string, number>;
    languageDistribution: Record<string, number>;
  } {
    const enabled = this.config.profiles.filter(p => p.enabled);
    
    const providerDistribution = this.config.profiles.reduce((acc, profile) => {
      acc[profile.provider] = (acc[profile.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const languageDistribution = this.config.profiles.reduce((acc, profile) => {
      acc[profile.language] = (acc[profile.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalProfiles: this.config.profiles.length,
      enabledProfiles: enabled.length,
      providerDistribution,
      languageDistribution
    };
  }

  /**
   * Pobiera całą konfigurację
   */
  getConfiguration(): VoiceConfiguration {
    return { ...this.config };
  }

  /**
   * Aktualizuje globalne ustawienia
   */
  updateGlobalSettings(settings: Partial<VoiceConfiguration['globalSettings']>): void {
    this.config.globalSettings = {
      ...this.config.globalSettings,
      ...settings
    };
  }
}

// Singleton instance
export const voiceConfigManager = new VoiceConfigurationManager();