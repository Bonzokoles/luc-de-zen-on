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
        recognition: {
            language: 'pl-PL',
            continuous: true,
            interimResults: true,
            maxAlternatives: 1
        },
        synthesis: {
            voice: 'pl-PL-Standard-A',
            rate: 1.0,
            pitch: 1.0,
            volume: 0.8
        }
    },

    // Commands
    commands: {
        wake_words: ['mybonzo', 'asystent', 'komputer'],
        stop_words: ['stop', 'koniec', 'zakończ'],
        system_commands: [
            'otwórz menu',
            'zamknij aplikację',
            'pokaż pomoc',
            'zmień język',
            'ustaw głośność'
        ]
    },

    // Performance
    performance: {
        memory_limit: '256MB',
        cpu_limit: '1 core',
        response_time: '<100ms',
        accuracy_target: '95%'
    },

    // Security
    security: {
        require_https: true,
        encrypt_audio: true,
        rate_limiting: true,
        user_permissions: ['microphone']
    },

    // Monitoring
    monitoring: {
        log_level: 'info',
        metrics: ['response_time', 'accuracy', 'usage'],
        alerts: ['high_error_rate', 'slow_response']
    }
};

export default AGENT_CONFIG;