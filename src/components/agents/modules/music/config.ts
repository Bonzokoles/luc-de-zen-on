// Agent 02 - Music Control Configuration

export const AGENT_CONFIG = {
    // Basic Info
    id: 'agent-02-music-control',
    name: 'Music Control',
    version: '1.0.0',
    description: 'Audio streaming, playlist management and music control system',

    // Status
    status: 'active', // 'active' | 'development' | 'disabled'

    // Capabilities
    capabilities: [
        'audio_streaming',
        'playlist_management',
        'volume_control',
        'music_search',
        'audio_analysis'
    ],

    // Dependencies
    dependencies: [
        'Web Audio API',
        'Spotify Web API',
        'YouTube Music API'
    ],

    // Network
    ports: {
        api: 3002, // API endpoint port
        ws: 3102   // WebSocket port for real-time audio control
    },

    // UI Settings
    ui: {
        icon: '🎵',
        color: '#1db954',
        position: 2 // Floating button position
    },

    // API Configuration
    api: {
        endpoint: '/api/agents/music-control',
        methods: ['POST', 'GET'],
        rateLimit: 120, // requests per minute (higher for audio)
        timeout: 15000  // 15 seconds for streaming
    },

    // Music Services
    services: {
        spotify: {
            enabled: false, // requires API keys
            scopes: ['streaming', 'user-read-playback-state', 'user-modify-playback-state']
        },
        youtube: {
            enabled: false, // requires API keys  
            quality: 'high'
        },
        local: {
            enabled: true,
            formats: ['mp3', 'wav', 'ogg', 'm4a']
        }
    },

    // Audio Settings
    audio: {
        defaultVolume: 0.7,
        maxVolume: 1.0,
        fadeTime: 2000, // ms
        sampleRate: 44100,
        bitRate: 320 // kbps
    },

    // Commands Configuration
    commands: {
        // Playback commands
        playback: [
            { trigger: ['graj', 'play', 'odtwórz'], action: 'play' },
            { trigger: ['zatrzymaj', 'stop', 'pauza'], action: 'pause' },
            { trigger: ['następny', 'next', 'dalej'], action: 'next' },
            { trigger: ['poprzedni', 'previous', 'wstecz'], action: 'previous' }
        ],

        // Volume commands  
        volume: [
            { trigger: ['głośniej', 'zwiększ głośność'], action: 'volume_up' },
            { trigger: ['ciszej', 'zmniejsz głośność'], action: 'volume_down' },
            { trigger: ['wycisz', 'mute'], action: 'mute' }
        ],

        // Search commands
        search: [
            { trigger: ['znajdź', 'szukaj'], action: 'search_and_play' },
            { trigger: ['playlista', 'lista odtwarzania'], action: 'show_playlist' },
            { trigger: ['losowo', 'shuffle'], action: 'shuffle' }
        ]
    },

    // Resources
    resources: {
        maxMemory: '512MB',
        maxCpu: 25, // percentage
        priority: 'normal' // 'low' | 'normal' | 'high'
    }
};

export default AGENT_CONFIG;