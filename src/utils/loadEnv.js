/**
 * System automatycznego wczytywania kluczy API
 * Centralny punkt zarządzania konfiguracją środowiska
 * 
 * UWAGA: Ten moduł jest przeznaczony tylko do użycia serwerowego!
 * W przeglądarce zmienne środowiskowe nie są dostępne.
 */

// Sprawdź czy działamy w środowisku Node.js
const isNodeEnvironment = typeof process !== 'undefined' && process.env;

// Klucze API dla różnych platform
export const API_KEYS = {
  // OpenAI dla generowania FAQ i AI funkcji
  OPENAI_API_KEY: isNodeEnvironment ? (process.env.OPENAI_API_KEY || '') : '',
  
  // Flowise dla automatyzacji workflow
  FLOWISE_API_TOKEN: isNodeEnvironment ? (process.env.FLOWISE_API_TOKEN || '') : '',
  
  // ActivePieces dla powiadomień i automatyzacji
  ACTIVEPIECES_API_KEY: isNodeEnvironment ? (process.env.ACTIVEPIECES_API_KEY || '') : '',
  
  // Cloudflare dla Workers i deployment
  CLOUDFLARE_API_TOKEN: isNodeEnvironment ? (process.env.CLOUDFLARE_API_TOKEN || '') : '',
  CLOUDFLARE_ACCOUNT_ID: isNodeEnvironment ? (process.env.CLOUDFLARE_ACCOUNT_ID || '') : '',
  
  // Inne integracje
  GITHUB_TOKEN: isNodeEnvironment ? (process.env.GITHUB_TOKEN || '') : '',
  WEBHOOK_SECRET: isNodeEnvironment ? (process.env.WEBHOOK_SECRET || '') : '',
  
  // Email/SMS dla powiadomień
  EMAIL_API_KEY: isNodeEnvironment ? (process.env.EMAIL_API_KEY || '') : '',
  SMS_API_KEY: isNodeEnvironment ? (process.env.SMS_API_KEY || '') : '',
  
  // Database i storage
  DATABASE_URL: isNodeEnvironment ? (process.env.DATABASE_URL || '') : '',
  STORAGE_API_KEY: isNodeEnvironment ? (process.env.STORAGE_API_KEY || '') : ''
};

// Sprawdzanie czy wymagane klucze są ustawione
export function validateRequiredKeys() {
  const required = ['OPENAI_API_KEY'];
  const missing = [];
  
  required.forEach(key => {
    if (!API_KEYS[key]) {
      missing.push(key);
    }
  });
  
  if (missing.length > 0 && isNodeEnvironment) {
    console.warn(`⚠️  Brakuje kluczy API: ${missing.join(', ')}`);
    console.warn('Niektóre funkcje mogą nie działać poprawnie.');
  }
  
  return missing.length === 0;
}

// Funkcja do bezpiecznego pobierania kluczy
export function getApiKey(keyName) {
  const key = API_KEYS[keyName];
  if (!key) {
    throw new Error(`Klucz API '${keyName}' nie został skonfigurowany`);
  }
  return key;
}

// Export dla kompatybilności wstecznej
export const OPENAI_API_KEY = API_KEYS.OPENAI_API_KEY;
export const ACTIVEPIECES_API_KEY = API_KEYS.ACTIVEPIECES_API_KEY;
export const FLOWISE_API_TOKEN = API_KEYS.FLOWISE_API_TOKEN;

// Inicjalizacja przy imporcie (tylko w środowisku Node.js)
if (isNodeEnvironment) {
  validateRequiredKeys();
  console.log('🔑 System zarządzania kluczami API załadowany');
}
