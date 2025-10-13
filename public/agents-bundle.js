var AgentsBundle = (function () {
    'use strict';

    /**
     * Base Agent Class - Common functionality for all AI agents
     */
    class BaseAgent {
        config;
        status = 'ready';
        history = [];
        lastActivity = Date.now();
        constructor(config) {
            this.config = config;
            this.log(`Agent ${config.name} initialized`);
        }
        // Getters
        get id() { return this.config.id; }
        get name() { return this.config.name; }
        get model() { return this.config.model; }
        get category() { return this.config.category; }
        get icon() { return this.config.icon; }
        get color() { return this.config.color; }
        get priority() { return this.config.priority; }
        get description() { return this.config.description; }
        get capabilities() { return this.config.capabilities; }
        get agentStatus() { return this.status; }
        get agentHistory() { return [...this.history]; }
        // Status management
        updateStatus(status) {
            this.status = status;
            this.lastActivity = Date.now();
            this.log(`Status updated to: ${status}`);
        }
        // History management
        addToHistory(entry) {
            this.history.push({
                ...entry,
                timestamp: Date.now()
            });
            // Keep only last 50 entries
            if (this.history.length > 50) {
                this.history = this.history.slice(-50);
            }
        }
        // Logging
        log(message, level = 'info') {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] ${this.name}: ${message}`;
            switch (level) {
                case 'warn':
                    console.warn(logMessage);
                    break;
                case 'error':
                    console.error(logMessage);
                    break;
                default:
                    console.log(logMessage);
            }
        }
        // Common functionality
        async healthCheck() {
            try {
                this.updateStatus('processing');
                // Basic health check - can be overridden by subclasses
                await new Promise(resolve => setTimeout(resolve, 100));
                this.updateStatus('ready');
                return true;
            }
            catch (error) {
                this.updateStatus('error');
                this.log(`Health check failed: ${error}`, 'error');
                return false;
            }
        }
        getInfo() {
            return {
                ...this.config,
                status: this.status,
                lastActivity: this.lastActivity
            };
        }
        clearHistory() {
            this.history = [];
            this.log('History cleared');
        }
        // Utility methods
        async delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        sanitizeInput(input) {
            return input.trim().replace(/[<>]/g, '');
        }
        formatResponse(response) {
            return response.trim();
        }
    }

    class GeminiProAgent extends BaseAgent {
        config;
        apiEndpoint;
        constructor(config) {
            super(config);
            this.config = config;
            this.apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-pro'}:generateContent`;
        }
        async chat(message, context) {
            try {
                this.updateStatus('processing');
                const response = await fetch(this.apiEndpoint + `?key=${this.config.apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                                parts: [{
                                        text: message
                                    }]
                            }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024,
                        }
                    })
                });
                if (!response.ok) {
                    throw new Error(`Gemini API error: ${response.status}`);
                }
                const data = await response.json();
                const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Brak odpowiedzi';
                this.updateStatus('ready');
                this.addToHistory({ type: 'chat', input: message, output: result });
                return result;
            }
            catch (error) {
                this.updateStatus('error');
                console.error('🤖 Gemini Pro error:', error);
                throw error;
            }
        }
        async generateCode(prompt, language) {
            throw new Error("Method not implemented.");
        }
        async analyzeImage(imageData, prompt) {
            throw new Error("Method not implemented.");
        }
        async analyzeCode(code, language = 'typescript') {
            const prompt = 'Przeanalizuj następujący kod ' + language + ' i podaj szczegółową ocenę:\n\n' +
                '```' + language + '\n' +
                code + '\n' +
                '```' + '\n\n' +
                'Oceń:\n' +
                '1. Jakość kodu\n' +
                '2. Potencjalne problemy\n' +
                '3. Sugestie ulepszeń\n' +
                '4. Bezpieczeństwo\n' +
                '5. Wydajność';
            return this.chat(prompt);
        }
        async generateText(prompt, style = 'professional') {
            const styledPrompt = 'Napisz tekst w stylu ' + style + ' na temat: ' + prompt;
            return this.chat(styledPrompt);
        }
    }

    class GeminiVisionAgent extends BaseAgent {
        config;
        apiEndpoint;
        constructor(config) {
            super(config);
            this.config = config;
            this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';
        }
        async chat(message, context) {
            throw new Error("Method not implemented.");
        }
        async generateCode(prompt, language) {
            throw new Error("Method not implemented.");
        }
        async analyzeImage(imageData, prompt = "Opisz co widzisz na tym obrazie") {
            try {
                this.updateStatus('processing');
                const response = await fetch(this.apiEndpoint + `?key=${this.config.apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                                parts: [
                                    { text: prompt },
                                    {
                                        inline_data: {
                                            mime_type: "image/jpeg",
                                            data: imageData.split(',')[1] // Remove data:image/jpeg;base64, prefix
                                        }
                                    }
                                ]
                            }],
                        generationConfig: {
                            temperature: 0.4,
                            topK: 32,
                            topP: 1,
                            maxOutputTokens: 4096,
                        }
                    })
                });
                if (!response.ok) {
                    throw new Error(`Gemini Vision API error: ${response.status}`);
                }
                const data = await response.json();
                const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Nie udało się przeanalizować obrazu';
                this.updateStatus('ready');
                this.addToHistory({ type: 'image_analysis', input: prompt, output: result });
                return result;
            }
            catch (error) {
                this.updateStatus('error');
                console.error('👁️ Gemini Vision error:', error);
                throw error;
            }
        }
        async extractText(imageData) {
            return this.analyzeImage(imageData, "Wyciągnij cały tekst z tego obrazu. Zachowaj formatowanie i strukturę.");
        }
        async identifyObjects(imageData) {
            return this.analyzeImage(imageData, "Zidentyfikuj wszystkie obiekty na tym obrazie i opisz ich lokalizację.");
        }
    }

    class CodeBisonAgent extends BaseAgent {
        config;
        apiEndpoint;
        constructor(config) {
            super(config);
            this.config = config;
            this.apiEndpoint = `https://${config.location || 'us-central1'}-aiplatform.googleapis.com/v1/projects/${config.projectId}/locations/${config.location || 'us-central1'}/publishers/google/models/code-bison:predict`;
        }
        async chat(message, context) {
            return this.generateCode(message);
        }
        async analyzeImage(imageData, prompt) {
            throw new Error("Method not implemented.");
        }
        async generateCode(description, language = 'typescript') {
            try {
                this.updateStatus('processing');
                const prompt = "Wygeneruj kod w języku " + language + " na podstawie opisu: " + description + "\n      \n\nWymagania:\n- Kod powinien być czytelny i dobrze skomentowany\n- Użyj najlepszych praktyk dla " + language + "\n- Dodaj obsługę błędów gdzie to konieczne\n- Kod powinien być gotowy do użycia";
                const response = await fetch(this.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.config.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        instances: [{
                                prefix: prompt
                            }],
                        parameters: {
                            temperature: 0.2,
                            maxOutputTokens: 1024,
                            candidateCount: 1
                        }
                    })
                });
                if (!response.ok) {
                    throw new Error(`Code Bison API error: ${response.status}`);
                }
                const data = await response.json();
                const result = data.predictions?.[0]?.content || 'Nie udało się wygenerować kodu';
                this.updateStatus('ready');
                this.addToHistory({ type: 'code_generation', input: description, output: result });
                return result;
            }
            catch (error) {
                this.updateStatus('error');
                console.error('💻 Code Bison error:', error);
                throw error;
            }
        }
        async reviewCode(code, language = 'typescript') {
            const prompt = "Przejrzyj następujący kod " + language + " i podaj szczegółową analizę:\n\n" +
                "```" + language + "\n" +
                code + "\n" +
                "```" + "\n\n" +
                "Sprawdź:\n" +
                "- Jakość kodu i czytelność\n" +
                "- Potencjalne błędy i problemy\n" +
                "- Sugestie optymalizacji\n" +
                "- Zgodność z najlepszymi praktykami\n" +
                "- Bezpieczeństwo kodu";
            return this.generateCode(prompt, language);
        }
        async debugCode(code, error, language = 'typescript') {
            const prompt = "Pomóż debugować kod " + language + ":\n\n" +
                "Kod:\n" +
                "```" + language + "\n" +
                code + "\n" +
                "```" + "\n\n" +
                "Błąd: " + error + "\n\n" +
                "Znajdź przyczynę błędu i zaproponuj poprawkę.";
            return this.generateCode(prompt, language);
        }
        async refactorCode(code, language = 'typescript') {
            const prompt = "Refactor this " + language + " code to improve:\n" +
                "- Readability\n" +
                "- Performance\n" +
                "- Maintainability\n" +
                "- Best practices\n\n" +
                "Original code:\n" +
                "```" + language + "\n" +
                code + "\n" +
                "```" + "\n\n" +
                "Provide the refactored version with explanations of changes:";
            return this.generateCode(prompt, language);
        }
        async generateDocumentation(code, language = 'typescript') {
            const prompt = "Generate comprehensive documentation for this " + language + " code:\n\n" +
                "```" + language + "\n" +
                code + "\n" +
                "```" + "\n\n" +
                "Include:\n" +
                "- Function/class descriptions\n" +
                "- Parameter explanations\n" +
                "- Return value descriptions\n" +
                "- Usage examples\n" +
                "- JSDoc/TSDoc format";
            return this.generateCode(prompt, language);
        }
        async explainCode(code, language = 'typescript') {
            const prompt = "Explain this " + language + " code in detail:\n\n" +
                "```" + language + "\n" +
                code + "\n" +
                "```" + "\n\n" +
                "Provide:\n" +
                "- Step-by-step explanation\n" +
                "- Purpose of each part\n" +
                "- How it works\n" +
                "- Potential improvements";
            return this.generateCode(prompt, language);
        }
    }

    class TextBisonAgent extends BaseAgent {
        config;
        apiEndpoint;
        constructor(config) {
            super(config);
            this.config = config;
            this.apiEndpoint = `https://${config.location || 'us-central1'}-aiplatform.googleapis.com/v1/projects/${config.projectId}/locations/${config.location || 'us-central1'}/publishers/google/models/text-bison:predict`;
        }
        async generateText(prompt, maxTokens = 512) {
            try {
                this.updateStatus('processing');
                const response = await fetch(this.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.config.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        instances: [{
                                prompt: prompt
                            }],
                        parameters: {
                            temperature: 0.7,
                            maxOutputTokens: maxTokens,
                            topP: 0.8,
                            topK: 40
                        }
                    })
                });
                if (!response.ok) {
                    throw new Error(`Text Bison API error: ${response.status}`);
                }
                const data = await response.json();
                const result = data.predictions?.[0]?.content || 'Nie udało się wygenerować tekstu';
                this.updateStatus('ready');
                this.addToHistory({ type: 'text_generation', input: prompt, output: result });
                return result;
            }
            catch (error) {
                this.updateStatus('error');
                console.error('📝 Text Bison error:', error);
                throw error;
            }
        }
        async chat(message, context) {
            return this.generateText(message);
        }
        async generateCode(prompt, language) {
            throw new Error("Method not implemented.");
        }
        async analyzeImage(imageData, prompt) {
            throw new Error("Method not implemented.");
        }
        async summarize(text) {
            const prompt = 'Podsumuj następujący tekst w sposób zwięzły i treściwy:\n\n' +
                text + '\n\n' +
                'Podsumowanie:';
            return this.generateText(prompt, 256);
        }
        async translate(text, targetLanguage = 'polski') {
            const prompt = 'Przetłumacz następujący tekst na język ' + targetLanguage + ':\n\n' +
                text + '\n\n' +
                'Tłumaczenie:';
            return this.generateText(prompt, 512);
        }
    }

    class BusinessAssistantAgent extends BaseAgent {
        constructor(config) {
            super({
                id: 'business_assistant_agent',
                name: 'Business Assistant',
                model: 'business-assistant',
                category: 'productivity',
                icon: '💼',
                color: '#1f2937',
                priority: 'HIGH',
                description: 'Comprehensive business operations and management assistant',
                capabilities: ['Task Management', 'Meeting Planning', 'Document Generation', 'Email Drafting', 'Project Planning']
            });
        }
        async chat(message, context) {
            this.updateStatus('processing');
            // In a real scenario, this would call an AI model
            const response = `Response for: ${message}`;
            this.updateStatus('ready');
            return response;
        }
        async generateCode(prompt, language) {
            throw new Error("Method not implemented.");
        }
        async analyzeImage(imageData, prompt) {
            throw new Error("Method not implemented.");
        }
        async createMeetingAgenda(topic, duration, participants) {
            try {
                this.updateStatus('processing');
                const prompt = `Stwórz profesjonalną agendę spotkania:

Temat: ${topic}
Czas trwania: ${duration} minut
Uczestnicy: ${participants.join(', ')}

Agenda powinna zawierać:
- Cel spotkania
- Punkty dyskusji z przybliżonym czasem na każdy punkt
- Akcje i odpowiedzialności po spotkaniu
- Zasoby potrzebne do spotkania

Proszę stwórz agendę w formacie JSON z polami: title, purpose, agendaItems (tablica obiektów z punktami), actions, resources`;
                const response = await this.chat(prompt);
                return response;
            }
            catch (error) {
                this.updateStatus('error');
                throw new Error(`Failed to create meeting agenda: ${error}`);
            }
        }
        async draftEmail(subject, content, recipient, sender) {
            try {
                this.updateStatus('processing');
                const prompt = `Stwórz profesjonalny email na podstawie następujących danych:

Temat: ${subject}
Treść: ${content}
Odbiorca: ${recipient}
Nadawca: ${sender}

Email powinien zawierać:
- Przywitanie
- Główną treść wiadomości
- Zakończenie z podpisem
- Styl odpowiedni dla kontekstu biznesowego`;
                const response = await this.chat(prompt);
                return response;
            }
            catch (error) {
                this.updateStatus('error');
                throw new Error(`Failed to draft email: ${error}`);
            }
        }
        async generateFinancialReport(revenue, expenses, period) {
            try {
                this.updateStatus('processing');
                const profit = revenue - expenses;
                const profitMargin = ((profit / revenue) * 100).toFixed(2);
                const prompt = `Stwórz raport finansowy dla okresu ${period}:

Dane finansowe:
- Przychody: ${revenue.toLocaleString()} PLN
- Wydatki: ${expenses.toLocaleString()} PLN
- Zysk: ${profit.toLocaleString()} PLN
- Marża: ${profitMargin}%

Raport powinien zawierać:
- Podsumowanie finansowe
- Analizę wydatków i przychodów
- Wskazówki dotyczące poprawy wyników
- Prognozę na następny okres`;
                const response = await this.chat(prompt);
                return response;
            }
            catch (error) {
                this.updateStatus('error');
                throw new Error(`Failed to generate financial report: ${error}`);
            }
        }
        async planEcommerceLaunch(productName, targetAudience, launchDate) {
            try {
                this.updateStatus('processing');
                const prompt = `Zaprojektuj plan wdrożenia sklepu internetowego dla produktu:

Nazwa produktu: ${productName}
Docelowa grupa: ${targetAudience}
Data wdrożenia: ${launchDate}

Plan powinien zawierać:
- Etapy przygotowania sklepu
- Strategię marketingową
- Kanały promocji
- Harmonogram działań
- Krytyczne punkty do uwagi`;
                const response = await this.chat(prompt);
                return response;
            }
            catch (error) {
                this.updateStatus('error');
                throw new Error(`Failed to plan e-commerce launch: ${error}`);
            }
        }
        async manageTasks(tasks) {
            try {
                this.updateStatus('processing');
                const prompt = `Zarządzaj listą zadań:

Zadania:
${tasks.map((task, index) => `${index + 1}. ${task.description} (Priorytet: ${task.priority}, Status: ${task.status})`).join('\n')}

Proszę stworzyć:
- Raport zadań
- Priorytetyzację zadań
- Proponowane kroki działania
- Harmonogram realizacji`;
                const response = await this.chat(prompt);
                return response;
            }
            catch (error) {
                this.updateStatus('error');
                throw new Error(`Failed to manage tasks: ${error}`);
            }
        }
    }

    // Browser-compatible Google Agent Manager
    // Note: google-auth-library is not available in browser environment
    class GoogleAgentManager {
        config;
        constructor(config) {
            this.config = config;
            console.log('🔧 GoogleAgentManager initialized for browser environment');
        }
        /**
         * Tworzy nowego agenta Google Dialogflow (browser mock)
         */
        async createAgent() {
            try {
                const request = {
                    parent: `projects/${this.config.projectId}/locations/${this.config.location}`,
                    agent: {
                        displayName: this.config.displayName,
                        defaultLanguageCode: this.config.defaultLanguage,
                        timeZone: this.config.timeZone,
                        description: `Agent utworzony przez POLACZEK Agent System 23`,
                        avatarUri: '',
                        enableStackdriverLogging: true,
                        enableSpellChecking: true
                    }
                };
                console.log('✅ Google Agent utworzony (mock):', request);
                return { success: true, config: request };
            }
            catch (error) {
                console.error('❌ Błąd tworzenia Google Agent:', error);
                throw error;
            }
        }
        /**
         * Importuje agenta z ADK_AGEN_ts_zEN
         */
        async importFromADK(adkPath) {
            try {
                // Symulacja importu z ADK
                console.log(`🔄 Importuję agenta z: ${adkPath}`);
                const mockADKConfig = {
                    name: 'ADK_Voice_Agent',
                    description: 'Agent zaimportowany z ADK',
                    intents: [
                        {
                            name: 'voice_commands',
                            userSays: ['otwórz muzykę', 'uruchom asystenta', 'zamknij aplikację'],
                            responses: ['Wykonuję polecenie', 'Już się robi', 'W porządku']
                        }
                    ]
                };
                const dialogflowConfig = this.convertADKToDialogflow(mockADKConfig);
                const agent = await this.createAgent();
                return {
                    agent,
                    config: dialogflowConfig,
                    status: 'imported'
                };
            }
            catch (error) {
                console.error('❌ Błąd importu z ADK:', error);
                throw error;
            }
        }
        convertADKToDialogflow(adkConfig) {
            return {
                intents: adkConfig.intents?.map((intent) => ({
                    displayName: intent.name,
                    trainingPhrases: intent.userSays?.map((phrase) => ({
                        parts: [{ text: phrase }]
                    })) || [],
                    messages: intent.responses?.map((response) => ({
                        text: { text: [response] }
                    })) || []
                })) || [],
                entities: adkConfig.entities?.map((entity) => ({
                    displayName: entity.name,
                    kind: 'KIND_MAP',
                    entities: entity.entries?.map((entry) => ({
                        value: entry.value,
                        synonyms: entry.synonyms || [entry.value]
                    })) || []
                })) || []
            };
        }
        /**
         * Testuje połączenie z Google Cloud (browser mock)
         */
        async testConnection() {
            try {
                console.log('✅ Połączenie z Google Cloud nawiązane (mock)');
                return true;
            }
            catch (error) {
                console.error('❌ Błąd połączenia z Google Cloud:', error);
                return false;
            }
        }
    }

    class ADKAdapter {
        googleManager = null;
        constructor(googleConfig) {
            if (googleConfig) {
                this.googleManager = new GoogleAgentManager(googleConfig);
            }
        }
        /**
         * Skanuje katalog ADK_AGEN_ts_zEN i importuje wszystkich agentów
         */
        async importAllADKAgents(adkBasePath = 'Q:\\ADK_AGEN_ts_zEN') {
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
                    }
                    catch (error) {
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
            }
            catch (error) {
                console.error('❌ Błąd skanowania katalogu ADK:', error);
                throw error;
            }
        }
        async importSingleADKAgent(agentName) {
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
        async convertToPolaczekFormat(agentName) {
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
                        location: 'globalThis',
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
            }
            catch (error) {
                console.error('❌ Błąd konwersji do formatu POLACZEK:', error);
                throw error;
            }
        }
        generatePolaczekId(name) {
            return `google_${name.toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '')}_${Date.now()}`;
        }
        generateCapabilities(agentName) {
            const capabilityMap = {
                'voice_assistant_pl': ['voice_recognition', 'polish_language', 'conversation'],
                'music_controller': ['music_playback', 'playlist_management', 'audio_control'],
                'ai_helper': ['ai_assistance', 'problem_solving', 'information_lookup'],
                'system_navigator': ['system_control', 'navigation', 'file_management']
            };
            return capabilityMap[agentName] || ['general_assistance'];
        }
        generateSystemPrompt(agentName) {
            const promptMap = {
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
        async testADKAvailability() {
            try {
                console.log('🔄 Testuję dostępność systemu ADK...');
                // W środowisku przeglądarki nie mamy dostępu do systemu plików
                // Więc symulujemy test
                const isAvailable = typeof window !== 'undefined';
                if (isAvailable) {
                    console.log('✅ System ADK symulowany - gotowy do importu');
                }
                else {
                    console.log('❌ System ADK niedostępny w tym środowisku');
                }
                return isAvailable;
            }
            catch (error) {
                console.error('❌ Błąd testowania ADK:', error);
                return false;
            }
        }
    }

    // Browser-compatible Google Agent Factory
    // Zastąpiona implementacja dla środowiska przeglądarki
    class GoogleAgentFactory {
        config;
        constructor(config) {
            this.config = config;
            console.log('🔧 GoogleAgentFactory initialized for browser environment');
        }
        /**
         * Tworzy agenta Gemini Pro (browser mock)
         */
        async createGeminiProAgent() {
            return {
                id: 'gemini_pro_agent',
                name: 'Gemini Pro Agent',
                type: 'google-gemini',
                capabilities: ['text-generation', 'reasoning', 'analysis'],
                async chat(message, context) {
                    try {
                        console.log('🤖 Gemini Pro processing:', message.substring(0, 50) + '...');
                        // Mock response - w produkcji używaj Gemini API przez fetch
                        return `🤖 Gemini Pro odpowiada: To jest mockowana odpowiedź na: "${message.substring(0, 30)}..."
          
Możliwości agenta:
- Zaawansowane rozumowanie
- Analiza kontekstu  
- Generowanie tekstu
- Wielojęzyczność

Status: Browser Mock - w produkcji połączyć z Gemini API`;
                    }
                    catch (error) {
                        console.error('❌ Błąd Gemini Pro:', error);
                        throw error;
                    }
                }
            };
        }
        /**
         * Tworzy agenta Gemini Vision (browser mock)
         */
        async createGeminiVisionAgent() {
            return {
                id: 'gemini_vision_agent',
                name: 'Gemini Vision Agent',
                type: 'google-gemini-vision',
                capabilities: ['image-analysis', 'visual-qa', 'ocr', 'scene-understanding'],
                async analyzeImage(imageData, prompt) {
                    try {
                        console.log('👁️ Gemini Vision analyzing image with prompt:', prompt.substring(0, 30));
                        // Mock analysis - w produkcji używaj Gemini Vision API
                        return `👁️ Gemini Vision analiza:

Prompt: "${prompt}"
Wykryte elementy:
- Obiekty: [Mock detection]
- Tekst: [OCR Mock]
- Scena: [Scene analysis Mock]
- Kolory: [Color analysis Mock]

Opis: To jest mockowana analiza obrazu. W produkcji agent będzie używał Gemini Vision API do rzeczywistej analizy wizualnej.

Status: Browser Mock - gotowy do integracji z Gemini Vision API`;
                    }
                    catch (error) {
                        console.error('❌ Błąd Gemini Vision:', error);
                        throw error;
                    }
                }
            };
        }
        /**
         * Tworzy agenta Code Bison (browser mock)
         */
        async createCodeBisonAgent() {
            return {
                id: 'code_bison_agent',
                name: 'Code Bison Agent',
                type: 'google-code-bison',
                capabilities: ['code-generation', 'code-review', 'debugging', 'refactoring'],
                async generateCode(prompt, language = 'typescript') {
                    try {
                        console.log('💻 Code Bison generating', language, 'for:', prompt.substring(0, 30));
                        // Mock code generation - w produkcji używaj Code Bison API
                        const mockCode = `// 💻 Code Bison - Generated ${language.toUpperCase()} Code
// Prompt: ${prompt}

${language === 'typescript' ? `
interface MockInterface {
  id: string;
  name: string;
  execute(): Promise<void>;
}

class MockImplementation implements MockInterface {
  constructor(
    public id: string,
    public name: string
  ) {}
  
  async execute(): Promise<void> {
    console.log(\`Executing \${this.name} with ID: \${this.id}\`);
    // Implementation for: ${prompt}
  }
}

export { MockInterface, MockImplementation };
` : `
# Generated Python code for: ${prompt}
class MockClass:
    def __init__(self, name: str):
        self.name = name
    
    def execute(self):
        print(f"Executing {self.name}")
        # Implementation for: ${prompt}
`}

/* Status: Browser Mock - w produkcji połączyć z Code Bison API
   Capabilities: ${this.capabilities?.join(', ')}
*/`;
                        return mockCode;
                    }
                    catch (error) {
                        console.error('❌ Błąd Code Bison:', error);
                        throw error;
                    }
                }
            };
        }
        /**
         * Tworzy agenta Text Bison (browser mock)
         */
        async createTextBisonAgent() {
            return {
                id: 'text_bison_agent',
                name: 'Text Bison Agent',
                type: 'google-text-bison',
                capabilities: ['text-generation', 'summarization', 'translation', 'editing'],
                async chat(message, context) {
                    try {
                        console.log('📝 Text Bison processing text:', message.substring(0, 30));
                        return `📝 Text Bison - Zaawansowane przetwarzanie tekstu:

Oryginalny tekst: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"

Analiza:
- Długość: ${message.length} znaków
- Język: Polski (wykryty)
- Typ: ${context?.type || 'Ogólny tekst'}
- Sentiment: Neutralny (mock)

Możliwe akcje:
- Podsumowanie
- Tłumaczenie  
- Edycja stylistyczna
- Korekta gramatyczna

Status: Browser Mock - w produkcji używaj Text Bison API dla rzeczywistego przetwarzania tekstu`;
                    }
                    catch (error) {
                        console.error('❌ Błąd Text Bison:', error);
                        throw error;
                    }
                }
            };
        }
        /**
         * Pobiera wszystkie dostępne agenty
         */
        async getAllAgents() {
            const agents = await Promise.all([
                this.createGeminiProAgent(),
                this.createGeminiVisionAgent(),
                this.createCodeBisonAgent(),
                this.createTextBisonAgent()
            ]);
            console.log('🎯 Utworzono', agents.length, 'Google Agents');
            return agents;
        }
        /**
         * Testuje połączenie z Google Cloud (browser mock)
         */
        async testConnection() {
            try {
                console.log('🔗 Testowanie połączenia Google Cloud (mock)...');
                // W produkcji: rzeczywiste API call
                await new Promise(resolve => setTimeout(resolve, 500)); // Symulacja opóźnienia
                console.log('✅ Połączenie Google Cloud OK (mock)');
                return true;
            }
            catch (error) {
                console.error('❌ Błąd połączenia Google Cloud:', error);
                return false;
            }
        }
    }
    // Export default factory instance
    new GoogleAgentFactory({
        projectId: 'mybonzo-project',
        location: 'europe-west1',
        apiKey: process.env.GOOGLE_API_KEY
    });

    // MyBonzo Agents Bundle - Globalna i lokalna instalacja agentów
    // Automatyczne uruchamianie 3 sekundy po załadowaniu strony


    class MyBonzoAgentsSystem {
      constructor() {
        this.agents = new Map();
        this.isInitialized = false;
        this.autoStartDelay = 3000; // 3 sekundy
        this.adkAdapter = null;
        this.googleManager = null;
        this.googleFactory = null;
        this.localStorage = null;
        
        console.log('🤖 MyBonzo Agents System - Inicjalizacja...');
        
        // Bind methods to preserve context
        this.initializeGlobal = this.initializeGlobal.bind(this);
        this.initializeLocal = this.initializeLocal.bind(this);
        this.autoStart = this.autoStart.bind(this);
        this.createAgent = this.createAgent.bind(this);
        this.getAgent = this.getAgent.bind(this);
        this.getAllAgents = this.getAllAgents.bind(this);
        this.saveToLocal = this.saveToLocal.bind(this);
        this.loadFromLocal = this.loadFromLocal.bind(this);
      }

      async initializeGlobal() {
        try {
          console.log('🌍 Inicjalizacja globalnej instalacji agentów...');
          
          // Initialize adapters
          this.adkAdapter = new ADKAdapter();
          this.googleManager = new GoogleAgentManager();
          this.googleFactory = new GoogleAgentFactory();
          
          // Create globalThis agents with demo credentials
          const apiKey = "demo-key";
          const projectId = "mybonzo-project";
          const config = {
            apiKey,
            projectId,
            location: "europe-west1"
          };

          // Initialize all agent types
          const agentTypes = [
            { name: 'geminiPro', class: GeminiProAgent },
            { name: 'geminiVision', class: GeminiVisionAgent }, 
            { name: 'codeBison', class: CodeBisonAgent },
            { name: 'textBison', class: TextBisonAgent },
            { name: 'businessAssistant', class: BusinessAssistantAgent }
          ];

          for (const agentType of agentTypes) {
            try {
              const agent = new agentType.class(config);
              this.agents.set(agentType.name, {
                instance: agent,
                status: 'ready',
                type: agentType.name,
                config: config,
                createdAt: new Date().toISOString()
              });
              console.log(`✅ Agent ${agentType.name} - zainicjalizowany globalnie`);
            } catch (error) {
              console.warn(`⚠️ Błąd inicjalizacji ${agentType.name}:`, error);
            }
          }

          this.isInitialized = true;
          console.log(`🎉 Globalna instalacja ukończona - ${this.agents.size} agentów gotowych`);
          
          return true;
        } catch (error) {
          console.error('❌ Błąd globalnej inicjalizacji:', error);
          return false;
        }
      }

      initializeLocal() {
        try {
          console.log('💾 Inicjalizacja lokalnej instalacji agentów...');
          
          // Setup localStorage
          if (typeof window !== 'undefined' && window.localStorage) {
            this.localStorage = window.localStorage;
            
            // Load existing agents from local storage
            this.loadFromLocal();
            
            // Setup periodic save
            setInterval(() => {
              this.saveToLocal();
            }, 30000); // Save every 30 seconds
            
            console.log('✅ Lokalna instalacja skonfigurowana');
            return true;
          } else {
            console.warn('⚠️ localStorage niedostępne');
            return false;
          }
        } catch (error) {
          console.error('❌ Błąd lokalnej inicjalizacji:', error);
          return false;
        }
      }

      saveToLocal() {
        if (!this.localStorage) return;
        
        try {
          const agentsData = Array.from(this.agents.entries()).map(([name, data]) => ({
            name,
            status: data.status,
            type: data.type,
            config: { ...data.config, apiKey: 'REDACTED' }, // Don't save sensitive data
            createdAt: data.createdAt,
            lastSaved: new Date().toISOString(),
            version: '1.0.0',
            sessionId: this.getSessionId()
          }));
          
          // Also save system metadata
          const systemData = {
            agentCount: this.agents.size,
            lastAutoStart: new Date().toISOString(),
            browserInfo: {
              userAgent: navigator.userAgent,
              language: navigator.language,
              platform: navigator.platform
            },
            performance: {
              initTime: this.initTime || 0,
              avgResponseTime: this.calculateAvgResponseTime()
            }
          };
          
          this.localStorage.setItem('mybonzo_agents', JSON.stringify(agentsData));
          this.localStorage.setItem('mybonzo_system', JSON.stringify(systemData));
          console.log('💾 Agenci i metadane zapisane lokalnie');
        } catch (error) {
          console.warn('⚠️ Błąd zapisu lokalnego:', error);
        }
      }

      loadFromLocal() {
        if (!this.localStorage) return;
        
        try {
          const savedAgents = this.localStorage.getItem('mybonzo_agents');
          const savedSystem = this.localStorage.getItem('mybonzo_system');
          
          if (savedAgents) {
            const agentsData = JSON.parse(savedAgents);
            console.log(`💾 Wczytano ${agentsData.length} agentów z lokalnego storage`);
            
            // Restore agent preferences if available
            for (const agentData of agentsData) {
              if (this.agents.has(agentData.name)) {
                const currentAgent = this.agents.get(agentData.name);
                currentAgent.preferences = agentData.preferences || {};
                currentAgent.lastUsed = agentData.lastUsed;
              }
            }
          }
          
          if (savedSystem) {
            const systemData = JSON.parse(savedSystem);
            console.log('💾 Wczytano metadane systemu:', systemData);
            this.systemMetadata = systemData;
          }
          
          return { agents: savedAgents ? JSON.parse(savedAgents) : [], system: savedSystem ? JSON.parse(savedSystem) : null };
        } catch (error) {
          console.warn('⚠️ Błąd odczytu lokalnego:', error);
          return { agents: [], system: null };
        }
      }

      getSessionId() {
        if (!this.sessionId) {
          this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        return this.sessionId;
      }

      calculateAvgResponseTime() {
        // Placeholder for future response time tracking
        return 0;
      }

      clearLocalData() {
        if (this.localStorage) {
          this.localStorage.removeItem('mybonzo_agents');
          this.localStorage.removeItem('mybonzo_system');
          console.log('🗑️ Lokalne dane agentów wyczyszczone');
        }
      }

      createAgent(type, config = {}) {
        const agentClasses = {
          geminiPro: GeminiProAgent,
          geminiVision: GeminiVisionAgent,
          codeBison: CodeBisonAgent, 
          textBison: TextBisonAgent,
          businessAssistant: BusinessAssistantAgent
        };
        
        if (!agentClasses[type]) {
          throw new Error(`Nieznany typ agenta: ${type}`);
        }
        
        const AgentClass = agentClasses[type];
        const agent = new AgentClass(config);
        
        const agentData = {
          instance: agent,
          status: 'ready',
          type: type,
          config: config,
          createdAt: new Date().toISOString()
        };
        
        this.agents.set(type, agentData);
        this.saveToLocal();
        
        return agent;
      }

      getAgent(type) {
        const agentData = this.agents.get(type);
        return agentData ? agentData.instance : null;
      }

      getAllAgents() {
        const result = {};
        for (const [type, data] of this.agents.entries()) {
          result[type] = {
            instance: data.instance,
            status: data.status,
            type: data.type,
            createdAt: data.createdAt
          };
        }
        return result;
      }

      async autoStart() {
        console.log(`⏰ Auto-start agentów za ${this.autoStartDelay}ms...`);
        
        setTimeout(async () => {
          console.log('🚀 Rozpoczynam automatyczne uruchamianie agentów...');
          
          // Initialize globalThis and local systems
          const globalSuccess = await this.initializeGlobal();
          const localSuccess = this.initializeLocal();
          
          if (globalSuccess && localSuccess) {
            console.log('🎉 Wszystkie agenci gotowi do pracy!');
            
            // Expose globalThis API
            if (typeof window !== 'undefined') {
              window.MyBonzoAgents = this;
              window.AGENTS_READY = true;
              
              // Dispatch custom event
              window.dispatchEvent(new CustomEvent('mybonzo:agents:ready', {
                detail: { 
                  agents: this.getAllAgents(),
                  system: this
                }
              }));
            }
          } else {
            console.warn('⚠️ Nie wszystkie systemy agentów zostały zainicjalizowane poprawnie');
          }
        }, this.autoStartDelay);
      }

      // Public API methods for external access
      openAgent(type) {
        const agent = this.getAgent(type);
        if (agent) {
          console.log(`🎯 Otwieranie agenta: ${type}`);
          // Trigger opening agent interface
          if (window.GOOGLE_VOICE && window.GOOGLE_VOICE[`open${type.charAt(0).toUpperCase() + type.slice(1)}`]) {
            window.GOOGLE_VOICE[`open${type.charAt(0).toUpperCase() + type.slice(1)}`]();
          }
          return agent;
        } else {
          console.warn(`⚠️ Agent ${type} nie jest dostępny`);
          return null;
        }
      }

      getSystemStatus() {
        return {
          initialized: this.isInitialized,
          agentsCount: this.agents.size,
          autoStartDelay: this.autoStartDelay,
          hasLocalStorage: !!this.localStorage,
          agents: this.getAllAgents()
        };
      }
    }

    // Auto-initialize system when script loads
    const myBonzoAgentsSystem = new MyBonzoAgentsSystem();

    // Start auto-initialization on DOM ready or immediately if DOM is already loaded  
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          myBonzoAgentsSystem.autoStart();
        });
      } else {
        // DOM already loaded
        myBonzoAgentsSystem.autoStart();
      }
    } else if (typeof window !== 'undefined') {
      // Fallback for window-only environments
      window.addEventListener('load', () => {
        myBonzoAgentsSystem.autoStart();
      });
    }

    return myBonzoAgentsSystem;

})();
