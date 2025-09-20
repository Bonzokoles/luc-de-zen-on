import { GoogleAgentManager } from './GoogleAgentManager';

export class ADKAdapter {
  private googleManager: GoogleAgentManager | null = null;

  constructor(googleConfig?: any) {
    if (googleConfig) {
      this.googleManager = new GoogleAgentManager(googleConfig);
    }
  }

  /**
   * Skanuje katalog ADK_AGEN_ts_zEN i importuje wszystkich agentów
   */
  async importAllADKAgents(adkBasePath: string = 'Q:\\ADK_AGEN_ts_zEN'): Promise<any[]> {
    try {
      console.log(`🔄 Skanowanie katalogu ADK: ${adkBasePath}`);
      
      // Symulacja skanowania katalogu (dla środowiska przeglądarki)
      const mockAgents = [
        'voice_assistant_pl',
        'music_controller',
        'ai_helper',
        'system_navigator'
      ];
      
      const importResults = [];
      
      for (const agentName of mockAgents) {
        try {
          console.log(`🔄 Importuję agenta: ${agentName}`);
          
          const result = await this.importSingleADKAgent(agentName);
          importResults.push({
            name: agentName,
            status: 'success',
            agent: result,
            path: `${adkBasePath}/${agentName}`
          });
          
        } catch (error) {
          console.error(`❌ Błąd importu agenta ${agentName}:`, error);
          importResults.push({
            name: agentName,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            path: `${adkBasePath}/${agentName}`
          });
        }
      }
      
      return importResults;
      
    } catch (error) {
      console.error('❌ Błąd skanowania katalogu ADK:', error);
      throw error;
    }
  }

  private async importSingleADKAgent(agentName: string): Promise<any> {
    if (!this.googleManager) {
      throw new Error('Google Agent Manager nie jest skonfigurowany');
    }

    // Symulacja importu pojedynczego agenta
    const mockAgentPath = `mock://adk/${agentName}`;
    return await this.googleManager.importFromADK(mockAgentPath);
  }

  /**
   * Konwertuje agenta ADK na format POLACZEK Agent System
   */
  async convertToPolaczekFormat(agentName: string): Promise<any> {
    try {
      const polaczekAgent = {
        id: this.generatePolaczekId(agentName),
        name: agentName,
        description: `Agent zaimportowany z ADK: ${agentName}`,
        type: 'google-dialogflow',
        model: '@google/dialogflow-cx',
        capabilities: this.generateCapabilities(agentName),
        systemPrompt: this.generateSystemPrompt(agentName),
        configuration: {
          projectId: 'vertxaizenon-project-467918',
          location: 'global',
          agentId: this.generatePolaczekId(agentName),
          language: 'pl',
          timeZone: 'Europe/Warsaw'
        },
        metadata: {
          source: 'ADK_AGEN_ts_zEN',
          importedAt: new Date().toISOString(),
          originalPath: `mock://adk/${agentName}`,
          version: '1.0.0'
        },
        createdAt: new Date().toISOString(),
        isCustom: true,
        isActive: true
      };
      
      return polaczekAgent;
      
    } catch (error) {
      console.error('❌ Błąd konwersji do formatu POLACZEK:', error);
      throw error;
    }
  }

  private generatePolaczekId(name: string): string {
    return `google_${name.toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')}_${Date.now()}`;
  }

  private generateCapabilities(agentName: string): string[] {
    const capabilityMap: { [key: string]: string[] } = {
      'voice_assistant_pl': ['voice_recognition', 'polish_language', 'conversation'],
      'music_controller': ['music_playback', 'playlist_management', 'audio_control'],
      'ai_helper': ['ai_assistance', 'problem_solving', 'information_lookup'],
      'system_navigator': ['system_control', 'navigation', 'file_management']
    };
    
    return capabilityMap[agentName] || ['general_assistance'];
  }

  private generateSystemPrompt(agentName: string): string {
    const promptMap: { [key: string]: string } = {
      'voice_assistant_pl': 'Jesteś asystentem głosowym mówiącym po polsku. Pomagasz użytkownikom w codziennych zadaniach.',
      'music_controller': 'Jesteś kontrolerem muzyki. Zarządzasz odtwarzaniem, playlistami i ustawieniami audio.',
      'ai_helper': 'Jesteś asystentem AI. Pomagasz rozwiązywać problemy i znajdować informacje.',
      'system_navigator': 'Jesteś nawigatortem systemowym. Pomagasz w poruszaniu się po systemie i zarządzaniu plikami.'
    };
    
    return promptMap[agentName] || 'Jesteś pomocnym asystentem AI.';
  }

  /**
   * Testuje dostępność systemu ADK
   */
  async testADKAvailability(): Promise<boolean> {
    try {
      console.log('🔄 Testuję dostępność systemu ADK...');
      
      // W środowisku przeglądarki nie mamy dostępu do systemu plików
      // Więc symulujemy test
      const isAvailable = typeof window !== 'undefined';
      
      if (isAvailable) {
        console.log('✅ System ADK symulowany - gotowy do importu');
      } else {
        console.log('❌ System ADK niedostępny w tym środowisku');
      }
      
      return isAvailable;
      
    } catch (error) {
      console.error('❌ Błąd testowania ADK:', error);
      return false;
    }
  }
}