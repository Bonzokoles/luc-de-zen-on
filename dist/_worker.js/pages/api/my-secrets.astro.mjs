globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_D_xeYX_3.mjs';

class MySecretsAPI {
  constructor(env, config = {}) {
    this.env = env;
    this.cacheTTL = config.cacheTTL || 3e5;
    this.initializeSources();
  }
  cache = /* @__PURE__ */ new Map();
  sources = [];
  cacheTTL;
  /**
   * INICJALIZACJA ŹRÓDEŁ SEKRETÓW W KOLEJNOŚCI PRIORYTETU
   */
  initializeSources() {
    if (this.env.SECRETS_STORE) {
      this.sources.push({
        name: "CloudflareSecretsStore",
        priority: 1,
        get: async (key) => {
          try {
            return await this.env.SECRETS_STORE.get(key);
          } catch (error) {
            console.warn(`❌ CloudflareSecretsStore error for ${key}:`, error);
            return null;
          }
        }
      });
    }
    this.sources.push({
      name: "WorkerEnvironment",
      priority: 2,
      get: async (key) => {
        try {
          return this.env[key] || null;
        } catch (error) {
          console.warn(`❌ WorkerEnvironment error for ${key}:`, error);
          return null;
        }
      }
    });
    this.sources.push({
      name: "ProcessEnvironment",
      priority: 3,
      get: async (key) => {
        try {
          return globalThis.process?.env?.[key] || null;
        } catch (error) {
          console.warn(`❌ ProcessEnvironment error for ${key}:`, error);
          return null;
        }
      }
    });
    this.sources.sort((a, b) => a.priority - b.priority);
  }
  /**
   * GŁÓWNA METODA - POBIERANIE SEKRETU Z OBSŁUGĄ CACHE I FALLBACK
   */
  async getSecret(key) {
    if (this.isInCache(key)) {
      const cached = this.cache.get(key);
      console.log(`🔍 Cache hit for ${key} from cache`);
      return cached.value;
    }
    for (const source of this.sources) {
      try {
        const value = await source.get(key);
        if (value) {
          console.log(`🔑 Secret ${key} loaded from ${source.name}`);
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
  async getOpenAIKey() {
    return await this.getSecret("OPENAI_API_KEY");
  }
  async getAnthropicKey() {
    return await this.getSecret("ANTHROPIC_API_KEY");
  }
  async getHuggingFaceKey() {
    return await this.getSecret("HUGGINGFACE_API_KEY") || await this.getSecret("HF_API_TOKEN");
  }
  async getGoogleAIKey() {
    return await this.getSecret("GOOGLE_AI_STUDIO_API_KEY") || await this.getSecret("GOOGLE_AI_API_KEY");
  }
  async getCoherKey() {
    return await this.getSecret("COHERE_API_KEY");
  }
  async getMistralKey() {
    return await this.getSecret("MISTRAL_API_KEY");
  }
  async getPerplexityKey() {
    return await this.getSecret("PERPLEXITY_API_KEY");
  }
  async getGroqKey() {
    return await this.getSecret("GROQ_API_KEY");
  }
  /**
   * BATCH LOADING - POBIERANIE WIELU SEKRETÓW JEDNOCZEŚNIE
   */
  async getMultipleSecrets(keys) {
    const results = {};
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
  async getAllProviderKeys() {
    const providerKeys = [
      "OPENAI_API_KEY",
      "ANTHROPIC_API_KEY",
      "HUGGINGFACE_API_KEY",
      "HF_API_TOKEN",
      "GOOGLE_AI_STUDIO_API_KEY",
      "GOOGLE_AI_API_KEY",
      "COHERE_API_KEY",
      "MISTRAL_API_KEY",
      "PERPLEXITY_API_KEY",
      "GROQ_API_KEY"
    ];
    return await this.getMultipleSecrets(providerKeys);
  }
  /**
   * VALIDATION - SPRAWDŹ DOSTĘPNOŚĆ KLUCZY
   */
  async validateProviderKeys() {
    const results = [];
    const providers = [
      { name: "OpenAI", key: "OPENAI_API_KEY" },
      { name: "Anthropic", key: "ANTHROPIC_API_KEY" },
      { name: "HuggingFace", key: "HUGGINGFACE_API_KEY" },
      { name: "Google AI", key: "GOOGLE_AI_STUDIO_API_KEY" },
      { name: "Cohere", key: "COHERE_API_KEY" },
      { name: "Mistral", key: "MISTRAL_API_KEY" },
      { name: "Perplexity", key: "PERPLEXITY_API_KEY" },
      { name: "Groq", key: "GROQ_API_KEY" }
    ];
    for (const provider of providers) {
      const key = await this.getSecret(provider.key);
      const source = key ? this.getKeySource(provider.key) : void 0;
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
  async debugSecretSources() {
    const results = [];
    for (const source of this.sources) {
      const debug = {
        source: source.name,
        available: false
      };
      try {
        const testResult = await source.get("TEST_KEY_THAT_DOES_NOT_EXIST");
        debug.available = true;
        if (source.name === "CloudflareSecretsStore" && this.env.SECRETS_STORE?.list) {
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
  isInCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return false;
    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
  cacheSecret(key, value) {
    this.cache.set(key, {
      value,
      expires: Date.now() + this.cacheTTL
    });
  }
  getKeySource(key) {
    return "Unknown";
  }
  /**
   * AUTORYZACJA HEADERS - GENEROWANIE NAGŁÓWKÓW DLA RÓŻNYCH PROVIDERÓW
   */
  async getAuthHeader(provider) {
    switch (provider.toLowerCase()) {
      case "openai":
        const openaiKey = await this.getOpenAIKey();
        return openaiKey ? `Bearer ${openaiKey}` : null;
      case "anthropic":
        const anthropicKey = await this.getAnthropicKey();
        return anthropicKey ? `x-api-key ${anthropicKey}` : null;
      case "huggingface":
        const hfKey = await this.getHuggingFaceKey();
        return hfKey ? `Bearer ${hfKey}` : null;
      case "google":
      case "google-ai":
        const googleKey = await this.getGoogleAIKey();
        return googleKey ? `x-goog-api-key ${googleKey}` : null;
      case "cohere":
        const cohereKey = await this.getCoherKey();
        return cohereKey ? `Bearer ${cohereKey}` : null;
      case "mistral":
        const mistralKey = await this.getMistralKey();
        return mistralKey ? `Bearer ${mistralKey}` : null;
      case "perplexity":
        const perplexityKey = await this.getPerplexityKey();
        return perplexityKey ? `Bearer ${perplexityKey}` : null;
      case "groq":
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
  clearCache() {
    this.cache.clear();
    console.log("🧹 Secrets cache cleared");
  }
  /**
   * UTILITY - CHECK IF SECRET EXISTS WITHOUT RETRIEVING VALUE
   */
  async hasSecret(key) {
    const value = await this.getSecret(key);
    return value !== null;
  }
  /**
   * SAVE SECRET TO SECRETS STORE (if available)
   */
  async saveSecret(key, value) {
    if (this.env.SECRETS_STORE?.put) {
      try {
        await this.env.SECRETS_STORE.put(key, value);
        console.log(`✅ Secret ${key} saved to Secrets Store`);
        this.cacheSecret(key, value);
        return true;
      } catch (error) {
        console.error(`❌ Failed to save secret ${key}:`, error);
        return false;
      }
    }
    console.warn("❌ Secrets Store not available for saving");
    return false;
  }
}
function createMySecretsAPI(env, config) {
  return new MySecretsAPI(env, config);
}
async function getProviderKey(env, provider) {
  const secretsAPI = createMySecretsAPI(env);
  switch (provider.toLowerCase()) {
    case "openai":
      return await secretsAPI.getOpenAIKey();
    case "anthropic":
      return await secretsAPI.getAnthropicKey();
    case "huggingface":
      return await secretsAPI.getHuggingFaceKey();
    case "google":
      return await secretsAPI.getGoogleAIKey();
    case "cohere":
      return await secretsAPI.getCoherKey();
    case "mistral":
      return await secretsAPI.getMistralKey();
    case "perplexity":
      return await secretsAPI.getPerplexityKey();
    case "groq":
      return await secretsAPI.getGroqKey();
    default:
      return await secretsAPI.getSecret(provider);
  }
}

const OPTIONS = createOPTIONSHandler(["GET", "POST"]);
const GET = async ({ locals, url }) => {
  try {
    const action = url.searchParams.get("action") || "status";
    const secretsAPI = createMySecretsAPI(locals.runtime.env);
    switch (action) {
      case "status":
        return await handleStatus(secretsAPI);
      case "validate":
        return await handleValidate(secretsAPI);
      case "debug":
        return await handleDebug(secretsAPI);
      case "providers":
        return await handleProviders(secretsAPI);
      default:
        return createErrorResponse("Invalid action. Supported: status, validate, debug, providers", 400);
    }
  } catch (error) {
    console.error("❌ My-Secrets-API GET error:", error);
    return createErrorResponse("Internal server error", 500);
  }
};
const POST = async ({ locals, request }) => {
  try {
    const data = await request.json();
    const action = data.action;
    const secretsAPI = createMySecretsAPI(locals.runtime.env);
    switch (action) {
      case "getSecret":
        return await handleGetSecret(secretsAPI, data.key);
      case "getProvider":
        return await handleGetProvider(locals.runtime.env, data.provider);
      case "getAuthHeader":
        return await handleGetAuthHeader(secretsAPI, data.provider);
      case "saveSecret":
        return await handleSaveSecret(secretsAPI, data.key, data.value);
      case "testProvider":
        return await handleTestProvider(secretsAPI, data.provider);
      default:
        return createErrorResponse("Invalid action", 400);
    }
  } catch (error) {
    console.error("❌ My-Secrets-API POST error:", error);
    return createErrorResponse("Failed to process request", 500);
  }
};
async function handleStatus(secretsAPI) {
  const validation = await secretsAPI.validateProviderKeys();
  const debugInfo = await secretsAPI.debugSecretSources();
  const summary = {
    totalProviders: validation.length,
    providersWithKeys: validation.filter((p) => p.hasKey).length,
    availableSources: debugInfo.filter((s) => s.available).length,
    totalSources: debugInfo.length
  };
  return createSuccessResponse({
    status: "ok",
    summary,
    providers: validation,
    sources: debugInfo
  });
}
async function handleValidate(secretsAPI) {
  const validation = await secretsAPI.validateProviderKeys();
  return createSuccessResponse({
    validation,
    hasAnyKeys: validation.some((p) => p.hasKey),
    missingProviders: validation.filter((p) => !p.hasKey).map((p) => p.provider)
  });
}
async function handleDebug(secretsAPI) {
  const debugInfo = await secretsAPI.debugSecretSources();
  return createSuccessResponse({
    sources: debugInfo,
    cache: {
      // Nie udostępniamy rzeczywistych wartości cache ze względów bezpieczeństwa
      size: "hidden",
      ttl: "hidden"
    }
  });
}
async function handleProviders(secretsAPI) {
  const allKeys = await secretsAPI.getAllProviderKeys();
  const providers = Object.keys(allKeys).reduce((acc, key) => {
    acc[key] = allKeys[key] !== null;
    return acc;
  }, {});
  return createSuccessResponse({
    providers,
    available: Object.values(providers).filter(Boolean).length,
    total: Object.keys(providers).length
  });
}
async function handleGetSecret(secretsAPI, key) {
  if (!key) {
    return createErrorResponse("Key parameter is required", 400);
  }
  const hasSecret = await secretsAPI.hasSecret(key);
  return createSuccessResponse({
    key,
    exists: hasSecret,
    // Nie zwracamy wartości ze względów bezpieczeństwa
    value: hasSecret ? "[HIDDEN]" : null
  });
}
async function handleGetProvider(env, provider) {
  if (!provider) {
    return createErrorResponse("Provider parameter is required", 400);
  }
  const key = await getProviderKey(env, provider);
  return createSuccessResponse({
    provider,
    hasKey: key !== null,
    // Nie zwracamy wartości ze względów bezpieczeństwa
    keyPreview: key ? `${key.substring(0, 8)}...` : null
  });
}
async function handleGetAuthHeader(secretsAPI, provider) {
  if (!provider) {
    return createErrorResponse("Provider parameter is required", 400);
  }
  const authHeader = await secretsAPI.getAuthHeader(provider);
  return createSuccessResponse({
    provider,
    hasAuth: authHeader !== null,
    // Nie zwracamy pełnego headera ze względów bezpieczeństwa
    authType: authHeader ? authHeader.split(" ")[0] : null
  });
}
async function handleSaveSecret(secretsAPI, key, value) {
  if (!key || !value) {
    return createErrorResponse("Key and value parameters are required", 400);
  }
  const success = await secretsAPI.saveSecret(key, value);
  return createSuccessResponse({
    key,
    saved: success,
    message: success ? "Secret saved successfully" : "Failed to save secret"
  });
}
async function handleTestProvider(secretsAPI, provider) {
  if (!provider) {
    return createErrorResponse("Provider parameter is required", 400);
  }
  try {
    const authHeader = await secretsAPI.getAuthHeader(provider);
    if (!authHeader) {
      return createSuccessResponse({
        provider,
        test: "failed",
        reason: "No API key found",
        hasKey: false
      });
    }
    const testResult = {
      provider,
      test: "passed",
      hasKey: true,
      authHeaderType: authHeader.split(" ")[0],
      // Można rozszerzyć o rzeczywisty test API, ale lepiej tego nie robić automatycznie
      note: "Key exists and auth header generated successfully"
    };
    return createSuccessResponse(testResult);
  } catch (error) {
    return createSuccessResponse({
      provider,
      test: "error",
      error: error instanceof Error ? error.message : String(error),
      hasKey: false
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    OPTIONS,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
