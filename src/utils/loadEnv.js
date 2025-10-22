/**
 * System automatycznego wczytywania kluczy API
 * Centralny punkt zarządzania konfiguracją środowiska
 *
 * UWAGA: Ten moduł jest przeznaczony tylko do użycia serwerowego!
 * W przeglądarce zmienne środowiskowe nie są dostępne.
 */

// Sprawdź czy działamy w środowisku Node.js
const isNodeEnvironment = typeof process !== "undefined" && process.env;

// Klucze API dla różnych platform
export const API_KEYS = {
  // OpenAI dla generowania FAQ i AI funkcji (z fallback na alternatywny klucz)
  OPENAI_API_KEY: isNodeEnvironment
    ? process.env.OPENAI_API_KEY ||
      process.env.OPENAI_BACKUP_KEY ||
      process.env.OPENAI_ALTERNATIVE_KEY ||
      ""
    : "",

  // Flowise dla automatyzacji workflow
  FLOWISE_API_TOKEN: isNodeEnvironment
    ? process.env.FLOWISE_API_TOKEN || ""
    : "",

  // ActivePieces dla powiadomień i automatyzacji
  ACTIVEPIECES_API_KEY: isNodeEnvironment
    ? process.env.ACTIVEPIECES_API_KEY || ""
    : "",

  // Alternatywne klucze AI
  ANTHROPIC_API_KEY: isNodeEnvironment
    ? process.env.ANTHROPIC_API_KEY || ""
    : "",

  DEEPSEEK_API_KEY: isNodeEnvironment ? process.env.DEEPSEEK_API_KEY || "" : "",

  PERPLEXITY_API_KEY: isNodeEnvironment
    ? process.env.PERPLEXITY_API_KEY || ""
    : "",

  OPENROUTER_API_KEY: isNodeEnvironment
    ? process.env.OPENROUTER_API_KEY || ""
    : "",

  GEMINI_API_KEY: isNodeEnvironment ? process.env.GEMINI_API_KEY || "" : "",

  GROQ_API_KEY: isNodeEnvironment ? process.env.GROQ_API_KEY || "" : "",

  // Cloudflare dla Workers i deployment
  CLOUDFLARE_API_TOKEN: isNodeEnvironment
    ? process.env.CLOUDFLARE_API_TOKEN || ""
    : "",
  CLOUDFLARE_ACCOUNT_ID: isNodeEnvironment
    ? process.env.CLOUDFLARE_ACCOUNT_ID || "7f490d58a478c6baccb0ae01ea1d87c3"
    : "",
  CLOUDFLARE_ZONE_ID: isNodeEnvironment
    ? process.env.CLOUDFLARE_ZONE_ID || ""
    : "",

  // Inne integracje
  GITHUB_TOKEN: isNodeEnvironment ? process.env.GITHUB_TOKEN || "" : "",
  WEBHOOK_SECRET: isNodeEnvironment ? process.env.WEBHOOK_SECRET || "" : "",

  // Email/SMS dla powiadomień
  EMAIL_API_KEY: isNodeEnvironment ? process.env.EMAIL_API_KEY || "" : "",
  SMS_API_KEY: isNodeEnvironment ? process.env.SMS_API_KEY || "" : "",

  // Database i storage
  DATABASE_URL: isNodeEnvironment ? process.env.DATABASE_URL || "" : "",
  STORAGE_API_KEY: isNodeEnvironment ? process.env.STORAGE_API_KEY || "" : "",
};

// Sprawdzanie czy wymagane klucze są ustawione
export function validateRequiredKeys() {
  const required = ["OPENAI_API_KEY"];
  const missing = [];
  const alternatives = [
    "ANTHROPIC_API_KEY",
    "DEEPSEEK_API_KEY",
    "PERPLEXITY_API_KEY",
    "OPENROUTER_API_KEY",
    "GEMINI_API_KEY",
    "GROQ_API_KEY",
  ];

  required.forEach((key) => {
    if (!API_KEYS[key]) {
      missing.push(key);
    }
  });

  // Sprawdź czy są dostępne alternatywne klucze AI
  const hasAlternativeAI = alternatives.some((key) => API_KEYS[key]);

  // W środowisku CI/build nie blokuj procesu
  const isBuildEnvironment =
    process.env.CI ||
    process.env.NODE_ENV === "production" ||
    process.env.ASTRO_BUILD;

  if (missing.length > 0 && isNodeEnvironment && !isBuildEnvironment) {
    if (hasAlternativeAI) {
      console.warn(
        `⚠️  Brakuje głównego klucza OpenAI, ale dostępne są alternatywne klucze AI`
      );
    } else {
      console.warn(`⚠️  Brakuje kluczy API: ${missing.join(", ")}`);
      console.warn("Niektóre funkcje mogą nie działać poprawnie.");
    }
  } else if (missing.length > 0 && isBuildEnvironment) {
    console.log(`ℹ️  Build environment: Pomijam sprawdzanie kluczy API`);
  }

  return missing.length === 0 || hasAlternativeAI;
}

// Funkcja do bezpiecznego pobierania kluczy
export function getApiKey(keyName) {
  const key = API_KEYS[keyName];
  const isBuildEnvironment =
    process.env.CI ||
    process.env.NODE_ENV === "production" ||
    process.env.ASTRO_BUILD;

  if (!key && !isBuildEnvironment) {
    throw new Error(`Klucz API '${keyName}' nie został skonfigurowany`);
  }

  if (!key && isBuildEnvironment) {
    console.log(
      `ℹ️  Build environment: Brak klucza ${keyName}, zwracam pustą wartość`
    );
    return "";
  }

  return key;
}

// Funkcja do pobierania dostępnego klucza AI (z fallback)
export function getAvailableAIKey() {
  const aiKeys = [
    { name: "OPENAI_API_KEY", key: API_KEYS.OPENAI_API_KEY },
    { name: "OPENROUTER_API_KEY", key: API_KEYS.OPENROUTER_API_KEY },
    { name: "ANTHROPIC_API_KEY", key: API_KEYS.ANTHROPIC_API_KEY },
    { name: "DEEPSEEK_API_KEY", key: API_KEYS.DEEPSEEK_API_KEY },
    { name: "PERPLEXITY_API_KEY", key: API_KEYS.PERPLEXITY_API_KEY },
    { name: "GEMINI_API_KEY", key: API_KEYS.GEMINI_API_KEY },
    { name: "GROQ_API_KEY", key: API_KEYS.GROQ_API_KEY },
  ];

  for (const aiKey of aiKeys) {
    if (aiKey.key) {
      console.log(`✅ Używam klucza: ${aiKey.name}`);
      return { provider: aiKey.name, key: aiKey.key };
    }
  }

  const isBuildEnvironment =
    process.env.CI ||
    process.env.NODE_ENV === "production" ||
    process.env.ASTRO_BUILD;

  if (isBuildEnvironment) {
    console.log(`ℹ️  Build environment: Brak kluczy AI, zwracam pusty`);
    return { provider: "NONE", key: "" };
  }

  throw new Error("Brak dostępnych kluczy AI");
}

// Export dla kompatybilności wstecznej
export const OPENAI_API_KEY = API_KEYS.OPENAI_API_KEY;
export const ACTIVEPIECES_API_KEY = API_KEYS.ACTIVEPIECES_API_KEY;
export const FLOWISE_API_TOKEN = API_KEYS.FLOWISE_API_TOKEN;

// Eksport alternatywnych kluczy AI
export const ANTHROPIC_API_KEY = API_KEYS.ANTHROPIC_API_KEY;
export const DEEPSEEK_API_KEY = API_KEYS.DEEPSEEK_API_KEY;
export const PERPLEXITY_API_KEY = API_KEYS.PERPLEXITY_API_KEY;
export const OPENROUTER_API_KEY = API_KEYS.OPENROUTER_API_KEY;
export const GEMINI_API_KEY = API_KEYS.GEMINI_API_KEY;
export const GROQ_API_KEY = API_KEYS.GROQ_API_KEY;

// Inicjalizacja przy imporcie (tylko w środowisku Node.js)
if (isNodeEnvironment) {
  validateRequiredKeys();
  console.log("🔑 System zarządzania kluczami API załadowany");
}
