/**
 * Voice AI API Integration for MyBonzo Platform
 * Handles speech recognition, synthesis and voice AI interactions
 */

class VoiceAiAPI {
    constructor() {
        this.baseURL = 'https://mybonzo.com/api/voice';
        this.speechRecognition = null;
        this.speechSynthesis = null;
        this.initialized = false;
        this.isListening = false;
    }

    /**
     * Initialize Voice AI system
     */
    async initialize() {
        try {
            // Initialize browser speech APIs
            this.initializeBrowserAPIs();

            // Test server connection
            const response = await fetch(`${this.baseURL}/recognition`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'initialize'
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.initialized = true;
                console.log('✅ Voice AI API initialized successfully');
                return { success: true, capabilities: data.capabilities };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ Voice AI initialization failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Initialize browser speech APIs
     */
    initializeBrowserAPIs() {
        // Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.speechRecognition = new SpeechRecognition();
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = true;
            this.speechRecognition.lang = 'pl-PL';
        }

        // Speech Synthesis
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
        }
    }

    /**
     * Start voice recognition
     */
    async startListening(onResult, onError) {
        if (!this.speechRecognition) {
            return { success: false, error: 'Speech recognition not supported' };
        }

        try {
            this.speechRecognition.onresult = (event) => {
                const result = event.results[event.results.length - 1];
                const transcript = result.transcript;
                const confidence = result.confidence;
                
                if (onResult) {
                    onResult({ transcript, confidence, isFinal: result.isFinal });
                }
            };

            this.speechRecognition.onerror = (event) => {
                this.isListening = false;
                if (onError) {
                    onError(event.error);
                }
            };

            this.speechRecognition.onend = () => {
                this.isListening = false;
            };

            this.speechRecognition.start();
            this.isListening = true;
            
            return { success: true, message: 'Voice recognition started' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Stop voice recognition
     */
    stopListening() {
        if (this.speechRecognition && this.isListening) {
            this.speechRecognition.stop();
            this.isListening = false;
            return { success: true };
        }
        return { success: false, error: 'Not currently listening' };
    }

    /**
     * Text-to-speech synthesis
     */
    async speak(text, options = {}) {
        if (!this.speechSynthesis) {
            return { success: false, error: 'Speech synthesis not supported' };
        }

        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = options.lang || 'pl-PL';
            utterance.rate = options.rate || 1;
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || 1;

            return new Promise((resolve) => {
                utterance.onend = () => {
                    resolve({ success: true });
                };
                
                utterance.onerror = (event) => {
                    resolve({ success: false, error: event.error });
                };

                this.speechSynthesis.speak(utterance);
            });
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Send voice command to AI
     */
    async processVoiceCommand(transcript) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            const response = await fetch(`${this.baseURL}/commands`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'process_command',
                    transcript: transcript
                })
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, response: data.response };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ Voice command processing failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get available voices
     */
    getAvailableVoices() {
        if (!this.speechSynthesis) {
            return [];
        }
        return this.speechSynthesis.getVoices();
    }

    /**
     * Test Voice AI connection
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}/recognition`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'test'
                })
            });

            if (response.ok) {
                const data = await response.json();
                return { 
                    success: true, 
                    status: 'connected',
                    message: data.message || 'Voice AI connection successful',
                    browserSupport: {
                        speechRecognition: !!this.speechRecognition,
                        speechSynthesis: !!this.speechSynthesis
                    }
                };
            } else {
                return { 
                    success: false, 
                    status: 'error',
                    error: `HTTP ${response.status}` 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                status: 'error',
                error: error.message,
                browserSupport: {
                    speechRecognition: !!this.speechRecognition,
                    speechSynthesis: !!this.speechSynthesis
                }
            };
        }
    }
}

// Global instance
window.VoiceAiAPI = new VoiceAiAPI();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceAiAPI;
}