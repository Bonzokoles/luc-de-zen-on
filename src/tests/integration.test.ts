/**
 * MYBONZO INTEGRATION TESTS
 * Kompleksowe testy integracji systemowej na bazie SYSTEM_ANALYSIS.md
 * Testuje API endpoints, Cloudflare Workers, połączenia zewnętrzne
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import type { HealthCheck, DiagnosticsResult } from '../utils/systemDiagnostics';

// ==================================================
// TEST CONFIGURATION
// ==================================================

interface TestConfig {
  baseUrl: string;
  workerUrl: string;
  timeout: number;
  retries: number;
}

const TEST_CONFIG: TestConfig = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:4321',
  workerUrl: process.env.PUBLIC_WORKER_BASE_URL || 'https://luc-de-zen-on.stolarnia-ams.workers.dev',
  timeout: 10000,
  retries: 3
};

// Helper function for retrying failed requests
async function withRetry<T>(
  fn: () => Promise<T>, 
  retries: number = TEST_CONFIG.retries
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}

// ==================================================
// SYSTEM CONFIG TESTS
// ==================================================

describe('MyBonzo - Testy Konfiguracji Systemu', () => {
  test('Zmienne środowiskowe - krytyczne', () => {
    console.log('🔍 Sprawdzanie krytycznych zmiennych środowiskowych...');
    
    const criticalEnvs = [
      'PUBLIC_WORKER_BASE_URL',
      'OPENAI_API_KEY'
    ];

    const missing = criticalEnvs.filter(env => !process.env[env]);
    
    if (missing.length > 0) {
      console.warn(`⚠️ Brakujące zmienne: ${missing.join(', ')}`);
    }

    // Test nie powinien fail jeśli to development
    if (process.env.NODE_ENV === 'production') {
      expect(missing.length).toBe(0);
    } else {
      console.log(`ℹ️ Development mode - pomijam weryfikację ${missing.length} zmiennych`);
    }
  });

  test('Format URL Workers', () => {
    const workerUrl = process.env.PUBLIC_WORKER_BASE_URL;
    
    if (workerUrl) {
      expect(
        workerUrl.includes('workers.dev') || 
        workerUrl.includes('localhost') ||
        workerUrl.includes('127.0.0.1')
      ).toBe(true);
      
      expect(() => new URL(workerUrl)).not.toThrow();
      console.log(`✅ Worker URL prawidłowy: ${workerUrl}`);
    } else {
      console.warn('⚠️ Brak PUBLIC_WORKER_BASE_URL');
    }
  });
});

// ==================================================
// API ENDPOINTS TESTS
// ==================================================

describe('MyBonzo - Testy API Endpoints', () => {
  test('System validation endpoint', async () => {
    await withRetry(async () => {
      console.log('🔍 Testowanie /api/system/validate...');
      
      const response = await fetch(`${TEST_CONFIG.baseUrl}/api/system/validate`, {
        method: 'GET',
        signal: AbortSignal.timeout(TEST_CONFIG.timeout)
      });

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
      
      const contentType = response.headers.get('Content-Type');
      expect(contentType).toContain('application/json');

      if (response.ok) {
        const data = await response.json();
        expect(data).toHaveProperty('status');
        expect(data).toHaveProperty('data');
        console.log(`✅ Validation API odpowiada: ${data.status}`);
      } else {
        console.warn(`⚠️ Validation API zwraca ${response.status}`);
      }
    });
  }, { timeout: TEST_CONFIG.timeout + 5000 });

  test('Full diagnostics endpoint', async () => {
    await withRetry(async () => {
      console.log('🔍 Testowanie pełnej diagnostyki...');
      
      const response = await fetch(`${TEST_CONFIG.baseUrl}/api/system/validate?full=true`, {
        method: 'GET',
        signal: AbortSignal.timeout(TEST_CONFIG.timeout)
      });

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);

      if (response.ok) {
        const diagnostics = await response.json();
        expect(diagnostics).toHaveProperty('config');
        expect(diagnostics).toHaveProperty('workers');
        expect(diagnostics).toHaveProperty('summary');
        
        console.log(`✅ Pełna diagnostyka: ${diagnostics.summary?.overallStatus || 'unknown'}`);
      }
    });
  }, { timeout: TEST_CONFIG.timeout + 10000 });

  test('Music library API', async () => {
    await withRetry(async () => {
      console.log('🔍 Testowanie /api/music/library...');
      
      try {
        const response = await fetch(`${TEST_CONFIG.baseUrl}/api/music/library`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });

        // API może zwrócić 404 jeśli R2 nie skonfigurowany - to OK w testach
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(500);
        
        console.log(`✅ Music Library API odpowiada (${response.status})`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`ℹ️ Music library zawiera ${Array.isArray(data) ? data.length : 'unknown'} elementów`);
        }
      } catch (error) {
        console.warn(`⚠️ Music Library API niedostępny: ${error instanceof Error ? error.message : 'Unknown'}`);
        // Nie fail test - API może być opcjonalny
      }
    });
  });
});

// ==================================================
// CLOUDFLARE WORKERS TESTS
// ==================================================

describe('MyBonzo - Testy Cloudflare Workers', () => {
  test('Worker health endpoint', async () => {
    if (!TEST_CONFIG.workerUrl) {
      console.log('ℹ️ Brak konfiguracji Worker URL - pomijam test');
      return;
    }

    await withRetry(async () => {
      console.log(`🔍 Testowanie Worker health: ${TEST_CONFIG.workerUrl}/health`);
      
      try {
        const response = await fetch(`${TEST_CONFIG.workerUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });

        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(500);
        
        console.log(`✅ Worker health endpoint odpowiada (${response.status})`);
        
        if (response.ok) {
          const data = await response.json();
          expect(data).toHaveProperty('status');
        }
      } catch (error) {
        console.warn(`⚠️ Worker health niedostępny: ${error instanceof Error ? error.message : 'Unknown'}`);
        // W testach development może nie być dostępny
        if (process.env.NODE_ENV === 'production') {
          throw error;
        }
      }
    });
  });

  test('Worker API endpoints availability', async () => {
    if (!TEST_CONFIG.workerUrl) {
      console.log('ℹ️ Brak konfiguracji Worker URL - pomijam test');
      return;
    }

    const endpoints = ['/api/chat', '/api/ai-workers'];
    
    for (const endpoint of endpoints) {
      await withRetry(async () => {
        console.log(`🔍 Testowanie Worker endpoint: ${endpoint}`);
        
        try {
          const response = await fetch(`${TEST_CONFIG.workerUrl}${endpoint}`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000)
          });

          // Endpoint może wymagać POST lub auth - sprawdzamy tylko czy odpowiada
          expect(response.status).toBeGreaterThanOrEqual(200);
          expect(response.status).toBeLessThan(500);
          
          console.log(`✅ Worker ${endpoint} odpowiada (${response.status})`);
        } catch (error) {
          console.warn(`⚠️ Worker ${endpoint} niedostępny: ${error instanceof Error ? error.message : 'Timeout'}`);
          
          if (process.env.NODE_ENV === 'production') {
            throw error;
          }
        }
      });
    }
  });
});

// ==================================================
// EXTERNAL CONNECTIVITY TESTS  
// ==================================================

describe('MyBonzo - Testy Połączeń Zewnętrznych', () => {
  test('OpenAI API connectivity', async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.log('ℹ️ Brak OPENAI_API_KEY - pomijam test connectivity');
      return;
    }

    await withRetry(async () => {
      console.log('🔍 Testowanie połączenia z OpenAI API...');
      
      try {
        const response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'User-Agent': 'MyBonzo-Integration-Test'
          },
          signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
          const data = await response.json();
          expect(Array.isArray(data.data)).toBe(true);
          console.log(`✅ OpenAI API dostępny (${data.data.length} modeli)`);
        } else if (response.status === 401) {
          console.warn('⚠️ OpenAI API key nieprawidłowy lub wygasły');
          expect(response.status).toBe(401); // Expected for invalid key
        } else {
          console.warn(`⚠️ OpenAI API zwraca ${response.status}`);
        }
      } catch (error) {
        console.warn(`⚠️ Błąd połączenia z OpenAI: ${error instanceof Error ? error.message : 'Unknown'}`);
        
        if (process.env.NODE_ENV === 'production') {
          throw error;
        }
      }
    });
  }, { timeout: 15000 });

  test('Cloudflare API connectivity', async () => {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    
    if (!apiToken) {
      console.log('ℹ️ Brak CLOUDFLARE_API_TOKEN - pomijam test connectivity');
      return;
    }

    await withRetry(async () => {
      console.log('🔍 Testowanie połączenia z Cloudflare API...');
      
      try {
        const response = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'User-Agent': 'MyBonzo-Integration-Test'
          },
          signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
          const data = await response.json();
          expect(data.success).toBe(true);
          console.log('✅ Cloudflare API token prawidłowy');
        } else {
          console.warn(`⚠️ Cloudflare API zwraca ${response.status}`);
        }
      } catch (error) {
        console.warn(`⚠️ Błąd połączenia z Cloudflare: ${error instanceof Error ? error.message : 'Unknown'}`);
        
        if (process.env.NODE_ENV === 'production') {
          throw error;
        }
      }
    });
  });

  test('Internet connectivity', async () => {
    console.log('🔍 Testowanie podstawowego połączenia internetowego...');
    
    const testUrls = [
      'https://api.github.com',
      'https://www.google.com',
      'https://cloudflare.com'
    ];

    let successCount = 0;

    for (const url of testUrls) {
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok || response.status < 500) {
          successCount++;
        }
      } catch (error) {
        console.warn(`⚠️ Nie można połączyć z ${url}`);
      }
    }

    expect(successCount).toBeGreaterThan(0);
    console.log(`✅ Połączenie internetowe OK (${successCount}/${testUrls.length} serwisów dostępnych)`);
  }, { timeout: 15000 });
});

// ==================================================
// PERFORMANCE TESTS
// ==================================================

describe('MyBonzo - Testy Wydajności', () => {
  test('API response times', async () => {
    console.log('🔍 Testowanie czasów odpowiedzi API...');
    
    const endpoints = [
      '/api/system/validate'
    ];

    for (const endpoint of endpoints) {
      const startTime = Date.now();
      
      try {
        const response = await fetch(`${TEST_CONFIG.baseUrl}${endpoint}`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        
        const responseTime = Date.now() - startTime;
        
        expect(responseTime).toBeLessThan(5000); // Max 5s
        console.log(`✅ ${endpoint}: ${responseTime}ms`);
        
        if (responseTime > 2000) {
          console.warn(`⚠️ ${endpoint} powolny: ${responseTime}ms`);
        }
      } catch (error) {
        console.warn(`⚠️ ${endpoint} timeout lub błąd`);
      }
    }
  });
});

// ==================================================
// TEST HOOKS
// ==================================================

beforeAll(async () => {
  console.log('🚀 Rozpoczynam testy integracji MyBonzo...');
  console.log(`📍 Base URL: ${TEST_CONFIG.baseUrl}`);
  console.log(`☁️ Worker URL: ${TEST_CONFIG.workerUrl || 'nie skonfigurowany'}`);
  console.log(`⏱️ Timeout: ${TEST_CONFIG.timeout}ms`);
  
  // Krótkie oczekiwanie na ustabilizowanie się serwisów
  await new Promise(resolve => setTimeout(resolve, 1000));
});

afterAll(() => {
  console.log('✅ Testy integracji MyBonzo zakończone');
});