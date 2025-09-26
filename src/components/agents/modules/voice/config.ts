// Agent 01 - Voice Command Configuration

export const AGENT_CONFIG = {
    // Basic Info
    id: 'agent-01-voice-command',
    name: 'Voice Command',
    version: '1.0.0',
    description: 'Voice recognition and command processing system with Polish language support',

    // Status
    status: 'active', // 'active' | 'development' | 'disabled'

    // Capabilities
    capabilities: [
        'voice_recognition',
        'polish_language',
        'command_processing',
        'speech_synthesis',
        'voice_analysis'
    ],

    // Dependencies
    dependencies: [
        'Web Speech API',
        'SpeechRecognition',
        'SpeechSynthesis'
    ],

    // Network
    ports: {
        api: 3001, // API endpoint port
        ws: 3101   // WebSocket port for real-time audio
    },

    // UI Settings
    ui: {
        icon: '🎤',
        color: '#ff6b35',
        position: 1 // Floating button position
    },

    // API Configuration
    api: {
        endpoint: '/api/agents/voice-command',
        methods: ['POST'],
        rateLimit: 60, // requests per minute
        timeout: 10000  // 10 seconds
    },

    // Voice Settings
    voice: {
        language: 'pl-PL',
        fallback: 'en-US',
        continuous: true,
        interimResults: true,
        maxAlternatives: 3,

        // Speech Synthesis
        synthesis: {
            lang: 'pl-PL',
            rate: 1.0,
            pitch: 1.0,
            volume: 0.8
        }
    },

    // Commands Configuration
    commands: {
        // Navigation commands
        navigation: [
            { trigger: ['idź do', 'otwórz', 'przejdź do'], action: 'navigate' },
            { trigger: ['wróć', 'cofnij', 'powrót'], action: 'back' },
            { trigger: ['odśwież', 'reload'], action: 'refresh' }
        ],

        // System commands  
        system: [
            { trigger: ['czas', 'jaka godzina'], action: 'get_time' },
            { trigger: ['data', 'dzisiaj'], action: 'get_date' },
            { trigger: ['pogoda'], action: 'get_weather' }
        ],

        // Agent commands
        agents: [
            { trigger: ['uruchom agenta', 'wywołaj agenta'], action: 'activate_agent' },
            { trigger: ['zatrzymaj agenta', 'zakończ agenta'], action: 'stop_agent' },
            { trigger: ['status agentów', 'lista agentów'], action: 'list_agents' }
        ]
    },

    // Resources
    resources: {
        maxMemory: '256MB',
        maxCpu: 30, // percentage
        priority: 'high' // 'low' | 'normal' | 'high'
    }
};

export default AGENT_CONFIG;