/**
 * Enhanced OpenAI Worker with My-Secrets-API Integration
 * Demonstracja użycia my-secrets-API do zarządzania kluczami API
 */

import { createMySecretsAPI, getProviderAuthHeader } from '../utils/my-secrets-API';

export interface Env {
    // Fallback environment variables
    OPENAI_API_KEY?: string;
    AI_GATEWAY_ACCOUNT_ID?: string;
    AI_GATEWAY_ID?: string;

    // Secrets Store (Cloudflare KV lub inny)
    SECRETS_STORE?: {
        get(name: string): Promise<string | null>;
        put(name: string, value: string): Promise<void>;
        delete(name: string): Promise<void>;
        list(): Promise<string[]>;
    };
}

interface OpenAIRequest {
    model?: string;
    messages: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
    }>;
    max_tokens?: number;
    temperature?: number;
    stream?: boolean;
    useMySecretsAPI?: boolean; // Flag to force using my-secrets-API
}

interface OpenAIResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // Handle CORS
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Use-My-Secrets-API',
                },
            });
        }

        if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        try {
            const requestData: OpenAIRequest = await request.json();

            // Initialize My-Secrets-API
            const secretsAPI = createMySecretsAPI(env);

            // Get OpenAI API key using my-secrets-API with fallback
            let openaiKey: string | null = null;
            let keySource = 'unknown';

            if (requestData.useMySecretsAPI || !env.OPENAI_API_KEY) {
                console.log('🔑 Using my-secrets-API to retrieve OpenAI key...');
                openaiKey = await secretsAPI.getOpenAIKey();
                keySource = 'my-secrets-API';

                if (!openaiKey && env.OPENAI_API_KEY) {
                    console.log('⚠️ Fallback to environment variable');
                    openaiKey = env.OPENAI_API_KEY;
                    keySource = 'environment';
                }
            } else {
                console.log('🔑 Using environment variable for OpenAI key');
                openaiKey = env.OPENAI_API_KEY;
                keySource = 'environment';
            }

            if (!openaiKey) {
                return new Response(
                    JSON.stringify({
                        error: 'OpenAI API key not found',
                        details: 'Klucz API nie został znaleziony w my-secrets-API ani w zmiennych środowiskowych',
                        keySource: 'none'
                    }),
                    {
                        status: 401,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                    }
                );
            }

            // Get auth header using my-secrets-API
            const authHeader = await secretsAPI.getAuthHeader('openai');
            const authHeaderToUse = authHeader || `Bearer ${openaiKey}`;

            // Default configuration
            const config = {
                model: requestData.model || 'gpt-4o-mini',
                messages: requestData.messages,
                max_tokens: requestData.max_tokens || 1000,
                temperature: requestData.temperature || 0.7,
                stream: false,
            };

            // Build URL - with AI Gateway if available
            let apiUrl = 'https://api.openai.com/v1/chat/completions';

            if (env.AI_GATEWAY_ACCOUNT_ID && env.AI_GATEWAY_ID) {
                apiUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/openai/chat/completions`;
                console.log('🌐 Using Cloudflare AI Gateway');
            } else {
                console.log('🔗 Using direct OpenAI API');
            }

            console.log(`🔑 API Key source: ${keySource}`);
            console.log(`🤖 Model: ${config.model}`);

            // Make request to OpenAI
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': authHeaderToUse,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('OpenAI API error:', response.status, errorText);

                // Enhanced error handling for API key issues
                let errorMessage = 'OpenAI API error';
                let details = errorText;

                if (response.status === 401) {
                    errorMessage = 'Authentication failed';
                    details = `Klucz API jest nieprawidłowy lub wygasł (źródło: ${keySource})`;
                } else if (response.status === 403) {
                    errorMessage = 'Access forbidden';
                    details = `Brak uprawnień dla tego modelu (źródło klucza: ${keySource})`;
                } else if (response.status === 429) {
                    errorMessage = 'Rate limit exceeded';
                    details = 'Przekroczono limit requestów API';
                }

                return new Response(
                    JSON.stringify({
                        error: errorMessage,
                        details,
                        status: response.status,
                        keySource,
                        model: config.model
                    }),
                    {
                        status: response.status,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                    }
                );
            }

            const data: OpenAIResponse = await response.json();

            // Enhanced response with my-secrets-API info
            return new Response(
                JSON.stringify({
                    success: true,
                    response: data.choices[0]?.message?.content || '',
                    model: data.model,
                    usage: data.usage,
                    provider: 'openai',
                    keySource,
                    secretsAPI: {
                        used: requestData.useMySecretsAPI || !env.OPENAI_API_KEY,
                        version: '1.0'
                    },
                    timestamp: new Date().toISOString()
                }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'X-Key-Source': keySource,
                        'X-Secrets-API-Used': String(requestData.useMySecretsAPI || !env.OPENAI_API_KEY),
                    },
                }
            );

        } catch (error) {
            console.error('Worker error:', error);

            return new Response(
                JSON.stringify({
                    error: 'Internal server error',
                    details: error instanceof Error ? error.message : 'Unknown error',
                    secretsAPI: {
                        available: !!env.SECRETS_STORE,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    },
                    timestamp: new Date().toISOString()
                }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );
        }
    },

    /**
     * Dodatkowe metody dla testowania my-secrets-API
     */
    async handleSecretsTest(request: Request, env: Env): Promise<Response> {
        try {
            const secretsAPI = createMySecretsAPI(env);

            // Test różnych metod my-secrets-API
            const results = {
                openaiKey: await secretsAPI.hasSecret('OPENAI_API_KEY'),
                authHeader: await secretsAPI.getAuthHeader('openai'),
                allProviders: await secretsAPI.validateProviderKeys(),
                debugInfo: await secretsAPI.debugSecretSources(),
                timestamp: new Date().toISOString()
            };

            return new Response(JSON.stringify(results, null, 2), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });

        } catch (error) {
            return new Response(
                JSON.stringify({
                    error: 'Secrets test failed',
                    details: error instanceof Error ? error.message : 'Unknown error'
                }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );
        }
    }
};

/**
 * INSTRUKCJE UŻYCIA:
 * 
 * 1. Dodaj do wrangler.toml:
 *    [[kv_namespaces]]
 *    binding = "SECRETS_STORE"
 *    id = "your-kv-namespace-id"
 * 
 * 2. Ustaw sekrety w Cloudflare:
 *    wrangler secret put OPENAI_API_KEY
 * 
 * 3. Wywołuj worker z flagą useMySecretsAPI:
 *    {
 *      "messages": [...],
 *      "useMySecretsAPI": true
 *    }
 * 
 * 4. Test funkcjonalności my-secrets-API:
 *    GET /secrets-test
 */