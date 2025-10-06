/**
 * MY-SECRETS-API ENDPOINT
 * Endpoint do zarządzania i testowania systemu sekretów
 */

import type { APIRoute } from 'astro';
import { createMySecretsAPI, getProviderKey, getProviderAuthHeader, type MySecretsAPI } from '../../utils/my-secrets-API';
import { createSuccessResponse, createErrorResponse, createOPTIONSHandler } from '../../utils/corsUtils';

interface ProviderValidation {
    provider: string;
    hasKey: boolean;
    source?: string;
}

interface SourceDebug {
    source: string;
    available: boolean;
    keys?: string[];
    error?: string;
    listError?: string;
}

export const OPTIONS = createOPTIONSHandler(['GET', 'POST']);

export const GET: APIRoute = async ({ locals, url }) => {
    try {
        const action = url.searchParams.get('action') || 'status';
        const secretsAPI = createMySecretsAPI(locals.runtime.env);

        switch (action) {
            case 'status':
                return await handleStatus(secretsAPI);

            case 'validate':
                return await handleValidate(secretsAPI);

            case 'debug':
                return await handleDebug(secretsAPI);

            case 'providers':
                return await handleProviders(secretsAPI);

            default:
                return createErrorResponse('Invalid action. Supported: status, validate, debug, providers', 400);
        }

    } catch (error) {
        console.error('❌ My-Secrets-API GET error:', error);
        return createErrorResponse('Internal server error', 500);
    }
};

export const POST: APIRoute = async ({ locals, request }) => {
    try {
        const data = await request.json();
        const action = data.action;
        const secretsAPI = createMySecretsAPI(locals.runtime.env);

        switch (action) {
            case 'getSecret':
                return await handleGetSecret(secretsAPI, data.key);

            case 'getProvider':
                return await handleGetProvider(locals.runtime.env, data.provider);

            case 'getAuthHeader':
                return await handleGetAuthHeader(secretsAPI, data.provider);

            case 'saveSecret':
                return await handleSaveSecret(secretsAPI, data.key, data.value);

            case 'testProvider':
                return await handleTestProvider(secretsAPI, data.provider);

            default:
                return createErrorResponse('Invalid action', 400);
        }

    } catch (error) {
        console.error('❌ My-Secrets-API POST error:', error);
        return createErrorResponse('Failed to process request', 500);
    }
};

/**
 * HANDLERS
 */

async function handleStatus(secretsAPI: MySecretsAPI) {
    const validation: ProviderValidation[] = await secretsAPI.validateProviderKeys();
    const debugInfo: SourceDebug[] = await secretsAPI.debugSecretSources();

    const summary = {
        totalProviders: validation.length,
        providersWithKeys: validation.filter((p: ProviderValidation) => p.hasKey).length,
        availableSources: debugInfo.filter((s: SourceDebug) => s.available).length,
        totalSources: debugInfo.length
    };

    return createSuccessResponse({
        status: 'ok',
        summary,
        providers: validation,
        sources: debugInfo
    });
}

async function handleValidate(secretsAPI: MySecretsAPI) {
    const validation: ProviderValidation[] = await secretsAPI.validateProviderKeys();

    return createSuccessResponse({
        validation,
        hasAnyKeys: validation.some((p: ProviderValidation) => p.hasKey),
        missingProviders: validation.filter((p: ProviderValidation) => !p.hasKey).map((p: ProviderValidation) => p.provider)
    });
}

async function handleDebug(secretsAPI: MySecretsAPI) {
    const debugInfo: SourceDebug[] = await secretsAPI.debugSecretSources();

    return createSuccessResponse({
        sources: debugInfo,
        cache: {
            // Nie udostępniamy rzeczywistych wartości cache ze względów bezpieczeństwa
            size: 'hidden',
            ttl: 'hidden'
        }
    });
}

async function handleProviders(secretsAPI: MySecretsAPI) {
    const allKeys = await secretsAPI.getAllProviderKeys();

    // Zwracamy tylko informację o dostępności, nie wartości
    const providers = Object.keys(allKeys).reduce((acc, key) => {
        acc[key] = allKeys[key] !== null;
        return acc;
    }, {} as Record<string, boolean>);

    return createSuccessResponse({
        providers,
        available: Object.values(providers).filter(Boolean).length,
        total: Object.keys(providers).length
    });
}

async function handleGetSecret(secretsAPI: MySecretsAPI, key: string) {
    if (!key) {
        return createErrorResponse('Key parameter is required', 400);
    }

    const hasSecret = await secretsAPI.hasSecret(key);

    return createSuccessResponse({
        key,
        exists: hasSecret,
        // Nie zwracamy wartości ze względów bezpieczeństwa
        value: hasSecret ? '[HIDDEN]' : null
    });
}

async function handleGetProvider(env: any, provider: string) {
    if (!provider) {
        return createErrorResponse('Provider parameter is required', 400);
    }

    const key = await getProviderKey(env, provider);

    return createSuccessResponse({
        provider,
        hasKey: key !== null,
        // Nie zwracamy wartości ze względów bezpieczeństwa
        keyPreview: key ? `${key.substring(0, 8)}...` : null
    });
}

async function handleGetAuthHeader(secretsAPI: MySecretsAPI, provider: string) {
    if (!provider) {
        return createErrorResponse('Provider parameter is required', 400);
    }

    const authHeader = await secretsAPI.getAuthHeader(provider);

    return createSuccessResponse({
        provider,
        hasAuth: authHeader !== null,
        // Nie zwracamy pełnego headera ze względów bezpieczeństwa
        authType: authHeader ? authHeader.split(' ')[0] : null
    });
}

async function handleSaveSecret(secretsAPI: MySecretsAPI, key: string, value: string) {
    if (!key || !value) {
        return createErrorResponse('Key and value parameters are required', 400);
    }

    const success = await secretsAPI.saveSecret(key, value);

    return createSuccessResponse({
        key,
        saved: success,
        message: success ? 'Secret saved successfully' : 'Failed to save secret'
    });
}

async function handleTestProvider(secretsAPI: MySecretsAPI, provider: string) {
    if (!provider) {
        return createErrorResponse('Provider parameter is required', 400);
    }

    try {
        const authHeader = await secretsAPI.getAuthHeader(provider);

        if (!authHeader) {
            return createSuccessResponse({
                provider,
                test: 'failed',
                reason: 'No API key found',
                hasKey: false
            });
        }

        // Test podstawowej funkcjonalności (bez rzeczywistego wywołania API)
        const testResult = {
            provider,
            test: 'passed',
            hasKey: true,
            authHeaderType: authHeader.split(' ')[0],
            // Można rozszerzyć o rzeczywisty test API, ale lepiej tego nie robić automatycznie
            note: 'Key exists and auth header generated successfully'
        };

        return createSuccessResponse(testResult);

    } catch (error) {
        return createSuccessResponse({
            provider,
            test: 'error',
            error: error instanceof Error ? error.message : String(error),
            hasKey: false
        });
    }
}