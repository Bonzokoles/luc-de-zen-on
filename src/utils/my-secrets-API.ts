/**
 * MY-SECRETS-API - CENTRALNE ZARZĄDZANIE SEKRETAMI
 * Obsługa GitHub Secrets, Cloudflare Secrets, i Secrets Store
 */

export interface SecretSource {
    name: string;
    priority: number;
    get: (key: string) => Promise<string | null>;
}

export interface MySecretsConfig {
    sources: SecretSource[];
    cache?: boolean;
    cacheTTL?: number;
}

export interface SecretsStore {
    get(name: string): Promise<string | null>;
    put(name: string, value: string): Promise<void>;
    delete(name: string): Promise<void>;
    list(): Promise<string[]>;
}

export class MySecretsAPI {
    private cache = new Map<string, { value: string; expires: number }>();
    private sources: SecretSource[] = [];
    private cacheTTL: number;

    constructor(private env: any, config: Partial<MySecretsConfig> = {}) {
        this.cacheTTL = config.cacheTTL || 300000; // 5 minut domyślnie
        this.initializeSources();
    }

    /**
     * INICJALIZACJA ŹRÓDEŁ SEKRETÓW W KOLEJNOŚCI PRIORYTETU
     */
    private initializeSources() {
        // 1. Cloudflare Secrets Store (najwyższy priorytet)
        if (this.env.SECRETS_STORE) {
            this.sources.push({
                name: 'CloudflareSecretsStore',
                priority: 1,
                get: async (key: string) => {
                    try {
                        return await this.env.SECRETS_STORE.get(key);
                    } catch (error) {
                        console.warn(`❌ CloudflareSecretsStore error for ${key}:`, error);
                        return null;
                    }
                }
            });
        }

        // 2. Zmienne środowiskowe Worker (średni priorytet)
        this.sources.push({
            name: 'WorkerEnvironment',
            priority: 2,
            get: async (key: string) => {
                try {
                    return this.env[key] || null;
                } catch (error) {
                    console.warn(`❌ WorkerEnvironment error for ${key}:`, error);
                    return null;
                }
            }
        });

        // 3. GitHub/Cloudflare Secrets przez process.env (niski priorytet)
        this.sources.push({
            name: 'ProcessEnvironment',
            priority: 3,
            get: async (key: string) => {
                try {
                    // W środowisku Cloudflare Workers nie ma process.env
                    // ale można zastąpić to przez globalThis lub inne mechanizmy
                    return (globalThis as any).process?.env?.[key] || null;
                } catch (error) {
                    console.warn(`❌ ProcessEnvironment error for ${key}:`, error);
                    return null;
                }
            }
        });

        // Sortuj według priorytetu
        this.sources.sort((a, b) => a.priority - b.priority);
    }

    /**
     * GŁÓWNA METODA - POBIERANIE SEKRETU Z OBSŁUGĄ CACHE I FALLBACK
     */
    async getSecret(key: string): Promise<string | null> {
        // Sprawdź cache
        if (this.isInCache(key)) {
            const cached = this.cache.get(key)!;
            console.log(`🔍 Cache hit for ${key} from cache`);
            return cached.value;
        }

        // Iteruj przez źródła w kolejności priorytetu
        for (const source of this.sources) {
            try {
                const value = await source.get(key);
                if (value) {
                    console.log(`🔑 Secret ${key} loaded from ${source.name}`);

                    // Cache successful result
                    this.cacheSecret(key, value);
                    return value;
                }
            } catch (error) {
                console.warn(`❌ Failed to load ${key} from ${source.name}:`, error);
                continue;
            }
        }

        console.error(`❌ Secret ${key} not found in any source`);
        return null;
    }

    /**
     * SPECJALIZED GETTERS DLA RÓŻNYCH API PROVIDERS
     */
    async getOpenAIKey(): Promise<string | null> {
        return await this.getSecret('OPENAI_API_KEY');
    }

    async getAnthropicKey(): Promise<string | null> {
        return await this.getSecret('ANTHROPIC_API_KEY');
    }

    async getHuggingFaceKey(): Promise<string | null> {
        return await this.getSecret('HUGGINGFACE_API_KEY') ||
            await this.getSecret('HF_API_TOKEN');
    }

    async getGoogleAIKey(): Promise<string | null> {
        return await this.getSecret('GOOGLE_AI_STUDIO_API_KEY') ||
            await this.getSecret('GOOGLE_AI_API_KEY');
    }

    async getCoherKey(): Promise<string | null> {
        return await this.getSecret('COHERE_API_KEY');
    }

    async getMistralKey(): Promise<string | null> {
        return await this.getSecret('MISTRAL_API_KEY');
    }

    async getPerplexityKey(): Promise<string | null> {
        return await this.getSecret('PERPLEXITY_API_KEY');
    }

    async getGroqKey(): Promise<string | null> {
        return await this.getSecret('GROQ_API_KEY');
    }

    /**
     * BATCH LOADING - POBIERANIE WIELU SEKRETÓW JEDNOCZEŚNIE
     */
    async getMultipleSecrets(keys: string[]): Promise<Record<string, string | null>> {
        const results: Record<string, string | null> = {};

        const promises = keys.map(async (key) => {
            const value = await this.getSecret(key);
            results[key] = value;
        });

        await Promise.all(promises);
        return results;
    }

    /**
     * GET ALL PROVIDER KEYS - POBIERZ WSZYSTKIE DOSTĘPNE API KEYS
     */
    async getAllProviderKeys(): Promise<Record<string, string | null>> {
        const providerKeys = [
            'OPENAI_API_KEY',
            'ANTHROPIC_API_KEY',
            'HUGGINGFACE_API_KEY',
            'HF_API_TOKEN',
            'GOOGLE_AI_STUDIO_API_KEY',
            'GOOGLE_AI_API_KEY',
            'COHERE_API_KEY',
            'MISTRAL_API_KEY',
            'PERPLEXITY_API_KEY',
            'GROQ_API_KEY'
        ];

        return await this.getMultipleSecrets(providerKeys);
    }

    /**
     * VALIDATION - SPRAWDŹ DOSTĘPNOŚĆ KLUCZY
     */
    async validateProviderKeys(): Promise<{ provider: string; hasKey: boolean; source?: string }[]> {
        const results = [];

        const providers = [
            { name: 'OpenAI', key: 'OPENAI_API_KEY' },
            { name: 'Anthropic', key: 'ANTHROPIC_API_KEY' },
            { name: 'HuggingFace', key: 'HUGGINGFACE_API_KEY' },
            { name: 'Google AI', key: 'GOOGLE_AI_STUDIO_API_KEY' },
            { name: 'Cohere', key: 'COHERE_API_KEY' },
            { name: 'Mistral', key: 'MISTRAL_API_KEY' },
            { name: 'Perplexity', key: 'PERPLEXITY_API_KEY' },
            { name: 'Groq', key: 'GROQ_API_KEY' }
        ];

        for (const provider of providers) {
            const key = await this.getSecret(provider.key);
            const source = key ? this.getKeySource(provider.key) : undefined;

            results.push({
                provider: provider.name,
                hasKey: !!key,
                source
            });
        }

        return results;
    }

    /**
     * DEBUGGING - INFORMACJE O ŹRÓDŁACH
     */
    async debugSecretSources(): Promise<{ source: string; available: boolean; keys?: string[] }[]> {
        const results = [];

        for (const source of this.sources) {
            const debug: any = {
                source: source.name,
                available: false
            };

            try {
                // Test dostępności źródła
                const testResult = await source.get('TEST_KEY_THAT_DOES_NOT_EXIST');
                debug.available = true; // Jeśli nie rzuca błędu, źródło jest dostępne

                // Jeśli to Secrets Store, pobierz listę kluczy
                if (source.name === 'CloudflareSecretsStore' && this.env.SECRETS_STORE?.list) {
                    try {
                        debug.keys = await this.env.SECRETS_STORE.list();
                    } catch (error) {
                        debug.listError = error instanceof Error ? error.message : String(error);
                    }
                }

            } catch (error) {
                debug.available = false;
                debug.error = error instanceof Error ? error.message : String(error);
            }

            results.push(debug);
        }

        return results;
    }

    /**
     * CACHE MANAGEMENT
     */
    private isInCache(key: string): boolean {
        const cached = this.cache.get(key);
        if (!cached) return false;

        if (Date.now() > cached.expires) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    private cacheSecret(key: string, value: string): void {
        this.cache.set(key, {
            value,
            expires: Date.now() + this.cacheTTL
        });
    }

    private getKeySource(key: string): string | undefined {
        // Logika do sprawdzenia z którego źródła pochodzi klucz
        // Można to rozszerzyć o rzeczywiste śledzenie źródeł
        return 'Unknown';
    }

    /**
     * AUTORYZACJA HEADERS - GENEROWANIE NAGŁÓWKÓW DLA RÓŻNYCH PROVIDERÓW
     */
    async getAuthHeader(provider: string): Promise<string | null> {
        switch (provider.toLowerCase()) {
            case 'openai':
                const openaiKey = await this.getOpenAIKey();
                return openaiKey ? `Bearer ${openaiKey}` : null;

            case 'anthropic':
                const anthropicKey = await this.getAnthropicKey();
                return anthropicKey ? `x-api-key ${anthropicKey}` : null;

            case 'huggingface':
                const hfKey = await this.getHuggingFaceKey();
                return hfKey ? `Bearer ${hfKey}` : null;

            case 'google':
            case 'google-ai':
                const googleKey = await this.getGoogleAIKey();
                return googleKey ? `x-goog-api-key ${googleKey}` : null;

            case 'cohere':
                const cohereKey = await this.getCoherKey();
                return cohereKey ? `Bearer ${cohereKey}` : null;

            case 'mistral':
                const mistralKey = await this.getMistralKey();
                return mistralKey ? `Bearer ${mistralKey}` : null;

            case 'perplexity':
                const perplexityKey = await this.getPerplexityKey();
                return perplexityKey ? `Bearer ${perplexityKey}` : null;

            case 'groq':
                const groqKey = await this.getGroqKey();
                return groqKey ? `Bearer ${groqKey}` : null;

            default:
                console.warn(`❌ Unknown provider: ${provider}`);
                return null;
        }
    }

    /**
     * CLEANUP
     */
    clearCache(): void {
        this.cache.clear();
        console.log('🧹 Secrets cache cleared');
    }

    /**
     * UTILITY - CHECK IF SECRET EXISTS WITHOUT RETRIEVING VALUE
     */
    async hasSecret(key: string): Promise<boolean> {
        const value = await this.getSecret(key);
        return value !== null;
    }

    /**
     * SAVE SECRET TO SECRETS STORE (if available)
     */
    async saveSecret(key: string, value: string): Promise<boolean> {
        if (this.env.SECRETS_STORE?.put) {
            try {
                await this.env.SECRETS_STORE.put(key, value);
                console.log(`✅ Secret ${key} saved to Secrets Store`);

                // Update cache
                this.cacheSecret(key, value);
                return true;
            } catch (error) {
                console.error(`❌ Failed to save secret ${key}:`, error);
                return false;
            }
        }

        console.warn('❌ Secrets Store not available for saving');
        return false;
    }
}

/**
 * FACTORY FUNCTION - TWORZENIE INSTANCJI MY-SECRETS-API
 */
export function createMySecretsAPI(env: any, config?: Partial<MySecretsConfig>): MySecretsAPI {
    return new MySecretsAPI(env, config);
}

/**
 * CONVENIENCE FUNCTIONS
 */
export async function getProviderKey(env: any, provider: string): Promise<string | null> {
    const secretsAPI = createMySecretsAPI(env);

    switch (provider.toLowerCase()) {
        case 'openai':
            return await secretsAPI.getOpenAIKey();
        case 'anthropic':
            return await secretsAPI.getAnthropicKey();
        case 'huggingface':
            return await secretsAPI.getHuggingFaceKey();
        case 'google':
            return await secretsAPI.getGoogleAIKey();
        case 'cohere':
            return await secretsAPI.getCoherKey();
        case 'mistral':
            return await secretsAPI.getMistralKey();
        case 'perplexity':
            return await secretsAPI.getPerplexityKey();
        case 'groq':
            return await secretsAPI.getGroqKey();
        default:
            return await secretsAPI.getSecret(provider);
    }
}

export async function getProviderAuthHeader(env: any, provider: string): Promise<string | null> {
    const secretsAPI = createMySecretsAPI(env);
    return await secretsAPI.getAuthHeader(provider);
}