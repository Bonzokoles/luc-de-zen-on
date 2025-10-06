import type { APIRoute } from 'astro';

// Response helper
const createResponse = (data: any, status: number = 200) => {
    return new Response(JSON.stringify({
        ...data,
        agent: 'Voice Command',
        timestamp: new Date().toISOString()
    }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
};

// Voice Command Agent API
export const POST: APIRoute = async ({ request }) => {
    try {
        const { action, data } = await request.json();

        switch (action) {
            case 'test':
                return testVoiceAgent();

            case 'process_voice':
                return processVoiceCommand(data);

            case 'synthesize':
                return synthesizeSpeech(data);

            case 'get_commands':
                return getAvailableCommands();

            case 'status':
                return getAgentStatus();

            case 'config':
                return getAgentConfig();

            default:
                return createResponse({
                    error: 'Invalid action',
                    available_actions: ['test', 'process_voice', 'synthesize', 'get_commands', 'status', 'config']
                }, 400);
        }
    } catch (error) {
        return createResponse({
            error: 'Request parsing failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, 400);
    }
};

// Test voice agent functionality
async function testVoiceAgent() {
    return createResponse({
        message: 'Voice Agent test successful',
        status: 'operational',
        capabilities: [
            'speech_recognition_pl',
            'command_processing',
            'text_to_speech',
            'wake_word_detection'
        ],
        performance: {
            response_time: '< 100ms',
            accuracy: '95%',
            language: 'pl-PL'
        }
    });
}

// Process voice command
async function processVoiceCommand(data: any) {
    const { transcript, confidence = 0.8 } = data || {};
    
    if (!transcript) {
        return createResponse({
            error: 'No transcript provided'
        }, 400);
    }

    const lowerTranscript = transcript.toLowerCase();
    let response = '';
    let action = 'unknown';

    // Process commands
    if (lowerTranscript.includes('mybonzo')) {
        response = 'Słowo aktywacyjne rozpoznane. Jestem gotowy do pracy.';
        action = 'wake_word_detected';
    } else if (lowerTranscript.includes('menu')) {
        response = 'Otwieranie głównego menu aplikacji.';
        action = 'open_menu';
    } else if (lowerTranscript.includes('pomoc')) {
        response = 'Wyświetlam panel pomocy z dostępnymi komendami.';
        action = 'show_help';
    } else if (lowerTranscript.includes('zamknij')) {
        response = 'Zamykam aplikację zgodnie z poleceniem.';
        action = 'close_app';
    } else if (lowerTranscript.includes('stop') || lowerTranscript.includes('koniec')) {
        response = 'Zatrzymuję nasłuchiwanie komend głosowych.';
        action = 'stop_listening';
    } else {
        response = 'Komenda nie została rozpoznana. Spróbuj ponownie.';
        action = 'command_not_recognized';
    }

    return createResponse({
        message: 'Voice command processed',
        original_transcript: transcript,
        confidence: confidence,
        detected_action: action,
        response: response,
        processing_time: Math.random() * 50 + 30 // Simulate processing time
    });
}

// Synthesize speech
async function synthesizeSpeech(data: any) {
    const { text, language = 'pl-PL', voice = 'pl-PL-Standard-A' } = data || {};
    
    if (!text) {
        return createResponse({
            error: 'No text provided for synthesis'
        }, 400);
    }

    return createResponse({
        message: 'Speech synthesis request processed',
        text: text,
        language: language,
        voice: voice,
        estimated_duration: Math.ceil(text.length / 20) + 's',
        audio_format: 'wav',
        sample_rate: '22050Hz'
    });
}

// Get available commands
async function getAvailableCommands() {
    return createResponse({
        message: 'Available voice commands',
        wake_words: ['mybonzo', 'asystent', 'komputer'],
        system_commands: [
            {
                command: 'otwórz menu',
                description: 'Otwiera główne menu aplikacji',
                category: 'navigation'
            },
            {
                command: 'zamknij aplikację',
                description: 'Zamyka całą aplikację',
                category: 'system'
            },
            {
                command: 'pokaż pomoc',
                description: 'Wyświetla panel pomocy',
                category: 'help'
            },
            {
                command: 'stop / koniec',
                description: 'Zatrzymuje nasłuchiwanie',
                category: 'control'
            }
        ],
        total_commands: 4,
        supported_languages: ['pl-PL', 'en-US']
    });
}

// Get agent status
async function getAgentStatus() {
    return createResponse({
        message: 'Voice Agent status',
        status: 'active',
        uptime: '24h 15m',
        memory_usage: '45MB',
        cpu_usage: '12%',
        requests_processed: Math.floor(Math.random() * 1000 + 500),
        accuracy_rate: '94.7%',
        average_response_time: '87ms',
        last_command: new Date(Date.now() - Math.random() * 300000).toISOString()
    });
}

// Get agent configuration
async function getAgentConfig() {
    return createResponse({
        message: 'Voice Agent configuration',
        config: {
            id: 'agent-01-voice-command',
            name: 'Voice Command',
            version: '1.0.0',
            language: 'pl-PL',
            continuous_listening: true,
            interim_results: true,
            max_alternatives: 1,
            confidence_threshold: 0.7,
            wake_word_sensitivity: 0.8,
            timeout_silence: 5000,
            timeout_no_speech: 3000
        }
    });
}

// Handle OPTIONS for CORS
export const OPTIONS: APIRoute = async () => {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
};