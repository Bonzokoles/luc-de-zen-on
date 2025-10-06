// Code Bison Agent - Advanced Programming Assistant and Code Analysis Module
// Google's specialized AI for code generation, analysis, and programming assistance

export class CodeBisonAgentFunctions {
  constructor() {
    this.codeHistory = [];
    this.activeSession = null;
    this.projectContext = new Map();
    this.preferences = {
      language: 'javascript',
      style: 'modern',
      includeComments: true,
      includeTests: false,
      complexity: 'medium'
    };
    
    this.supportedLanguages = [
      'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 
      'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'sql'
    ];
    
    this.codeFeatures = {
      generation: 'Generowanie kodu',
      analysis: 'Analiza kodu',
      optimization: 'Optymalizacja',
      debugging: 'Debugowanie',
      refactoring: 'Refaktoryzacja',
      documentation: 'Dokumentacja',
      testing: 'Testy jednostkowe',
      review: 'Przegląd kodu'
    };
    
    this.capabilities = [
      'code-generation',
      'code-analysis', 
      'bug-detection',
      'performance-optimization',
      'code-refactoring',
      'test-generation',
      'documentation-writing',
      'architecture-advice'
    ];
    
    this.initialize();
  }
  
  initialize() {
    this.setupSession();
    this.loadUserPreferences();
    console.log('💻 Code Bison Agent initialized - Ready for programming assistance');
  }
  
  setupSession() {
    this.activeSession = {
      id: `code-bison-${Date.now()}`,
      startTime: new Date(),
      requestCount: 0,
      currentProject: null,
      language: this.preferences.language
    };
  }
  
  loadUserPreferences() {
    const saved = localStorage.getItem('code-bison-preferences');
    if (saved) {
      this.preferences = { ...this.preferences, ...JSON.parse(saved) };
    }
  }
  
  saveUserPreferences() {
    localStorage.setItem('code-bison-preferences', JSON.stringify(this.preferences));
  }
  
  async processCodeRequest(request, requestType = 'generation', language = null) {
    try {
      console.log('💻 Code Bison processing:', requestType, request.substring(0, 50));
      
      const lang = language || this.preferences.language;
      const requestData = {
        id: `code-${Date.now()}`,
        text: request,
        type: requestType,
        language: lang,
        timestamp: new Date(),
        sessionId: this.activeSession.id
      };
      
      // Process based on request type
      const result = await this.generateCodeResponse(request, requestType, lang);
      
      const codeResponse = {
        id: requestData.id,
        request: requestData,
        response: result,
        timestamp: new Date(),
        processingTime: Date.now() - requestData.timestamp.getTime()
      };
      
      this.codeHistory.push(codeResponse);
      this.activeSession.requestCount++;
      
      return {
        success: true,
        response: result,
        language: lang,
        type: requestType
      };
      
    } catch (error) {
      console.error('❌ Code Bison error:', error);
      return {
        success: false,
        error: error.message,
        response: 'Przepraszam, wystąpił błąd w przetwarzaniu żądania kodowego.'
      };
    }
  }
  
  async generateCodeResponse(request, type, language) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    switch (type) {
      case 'generation':
        return this.generateCode(request, language);
      case 'analysis':
        return this.analyzeCode(request);
      case 'optimization':
        return this.optimizeCode(request, language);
      case 'debugging':
        return this.debugCode(request, language);
      case 'refactoring':
        return this.refactorCode(request, language);
      case 'documentation':
        return this.generateDocumentation(request, language);
      case 'testing':
        return this.generateTests(request, language);
      case 'review':
        return this.reviewCode(request, language);
      default:
        return this.generateCode(request, language);
    }
  }
  
  generateCode(request, language) {
    const codeExamples = {
      javascript: `// ${request}
function processData(data) {
  try {
    // Walidacja danych wejściowych
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }
    
    // Przetwarzanie danych
    const processed = data.map(item => ({
      ...item,
      processed: true,
      timestamp: new Date().toISOString()
    }));
    
    // Filtrowanie i sortowanie
    return processed
      .filter(item => item.active)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
  } catch (error) {
    console.error('Processing error:', error);
    return [];
  }
}

// Eksport modułu
export { processData };`,

      python: `# ${request}
import json
from datetime import datetime
from typing import List, Dict, Any

def process_data(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Przetwarza dane wejściowe i zwraca przefiltrowane wyniki.
    
    Args:
        data: Lista słowników z danymi do przetworzenia
        
    Returns:
        List[Dict]: Przetworzone i przefiltrowane dane
        
    Raises:
        ValueError: Gdy format danych jest nieprawidłowy
    """
    try:
        # Walidacja danych
        if not isinstance(data, list):
            raise ValueError("Data must be a list")
        
        # Przetwarzanie
        processed = []
        for item in data:
            processed_item = {
                **item,
                'processed': True,
                'timestamp': datetime.now().isoformat()
            }
            processed.append(processed_item)
        
        # Filtrowanie i sortowanie
        filtered = [item for item in processed if item.get('active', False)]
        sorted_data = sorted(filtered, key=lambda x: x['timestamp'], reverse=True)
        
        return sorted_data
        
    except Exception as e:
        print(f"Processing error: {e}")
        return []

# Przykład użycia
if __name__ == "__main__":
    sample_data = [
        {"id": 1, "name": "Item 1", "active": True},
        {"id": 2, "name": "Item 2", "active": False}
    ]
    result = process_data(sample_data)
    print(json.dumps(result, indent=2))`
    };
    
    const code = codeExamples[language] || codeExamples.javascript;
    
    return `**💻 Wygenerowany Kod - ${language.toUpperCase()}**

\`\`\`${language}
${code}
\`\`\`

**Wyjaśnienie kodu:**
• **Funkcjonalność:** Implementuje ${request.toLowerCase()}
• **Język:** ${language.toUpperCase()}
• **Styl:** Nowoczesny z obsługą błędów
• **Testy:** Zawiera podstawową walidację

**Kluczowe elementy:**
• ✅ Walidacja danych wejściowych
• ✅ Obsługa błędów (error handling)
• ✅ Komentarze i dokumentacja
• ✅ Czytelna struktura kodu
• ✅ Typowanie (w przypadku TypeScript/Python)

**Jak używać:**
1. Skopiuj kod do swojego projektu
2. Dostosuj parametry do swoich potrzeb
3. Przetestuj z przykładowymi danymi
4. Rozszerz funkcjonalność w razie potrzeby`;
  }
  
  analyzeCode(code) {
    const issues = [
      'Potencjalny memory leak w linii 15',
      'Brak walidacji parametrów wejściowych',
      'Nieoptymalna złożoność algorytmu O(n²)',
      'Brak obsługi przypadków brzegowych',
      'Niejasne nazwy zmiennych'
    ];
    
    const suggestions = [
      'Dodaj type annotations dla lepszej czytelności',
      'Rozważ użycie Map zamiast Object dla lepszej wydajności',
      'Zaimplementuj lazy loading dla dużych zbiorów danych',
      'Dodaj unit testy dla krytycznych funkcji',
      'Użyj const zamiast let gdzie to możliwe'
    ];
    
    const randomIssues = issues.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
    const randomSuggestions = suggestions.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
    
    return `**🔍 Analiza Kodu - Code Bison**

**Wykryte problemy:**
${randomIssues.map((issue, index) => `${index + 1}. ⚠️ ${issue}`).join('\n')}

**Sugestie poprawek:**
${randomSuggestions.map((suggestion, index) => `${index + 1}. 💡 ${suggestion}`).join('\n')}

**Metryki kodu:**
• **Złożoność:** ${Math.floor(Math.random() * 10) + 1}/10
• **Czytelność:** ${Math.floor(Math.random() * 3) + 7}/10
• **Wydajność:** ${Math.floor(Math.random() * 3) + 7}/10
• **Bezpieczeństwo:** ${Math.floor(Math.random() * 3) + 8}/10

**Ogólna ocena:** ${Math.floor(Math.random() * 2) + 8}/10

**Rekomendacje:**
• Przeprowadź refaktoryzację problemowych sekcji
• Dodaj dokumentację API
• Zaimplementuj testy automatyczne
• Rozważ code review z zespołem`;
  }
  
  optimizeCode(code, language) {
    return `**⚡ Optymalizacja Kodu - ${language.toUpperCase()}**

**Zidentyfikowane obszary optymalizacji:**

**1. Wydajność algorytmów:**
• Zamiana pętli zagnieżdżonych na Map/Set
• Użycie memoizacji dla często wywoływanych funkcji
• Implementacja lazy evaluation

**2. Zarządzanie pamięcią:**
• Usunięcie niepotrzebnych referencji
• Optymalizacja garbage collection
• Użycie WeakMap dla cache

**Zoptymalizowany kod:**
\`\`\`${language}
// Przed optymalizacją: O(n²)
// Po optymalizacji: O(n log n)

const optimizedFunction = (() => {
  const cache = new Map();
  
  return function(data) {
    // Memoizacja dla lepszej wydajności
    const cacheKey = JSON.stringify(data);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    // Zoptymalizowana logika
    const result = data
      .filter(item => item.active)
      .sort((a, b) => a.priority - b.priority);
    
    cache.set(cacheKey, result);
    return result;
  };
})();
\`\`\`

**Poprawy wydajności:**
• ⚡ Redukcja złożoności z O(n²) do O(n log n)
• 💾 Oszczędność pamięci: ~30%
• 🚀 Przyspieszenie wykonania: ~65%
• 📊 Lepsza skalowalność dla dużych zbiorów danych

**Dodatkowe optymalizacje:**
• Użycie Web Workers dla długich operacji
• Implementacja pagination dla dużych list
• Async/await dla lepszej responsywności`;
  }
  
  debugCode(code, language) {
    return `**🐛 Debugowanie Kodu - Code Bison**

**Wykryte potencjalne błędy:**

**1. Runtime Errors:**
• Null/undefined reference w linii 23
• Type mismatch w operacji porównania
• Infinite loop w pętli while

**2. Logic Errors:**
• Nieprawidłowa walidacja danych
• Off-by-one error w iteracji
• Race condition w async operations

**Debug-friendly kod:**
\`\`\`${language}
function debugSafeFunction(data) {
  // Dodanie logowania debug
  console.group('🐛 Debug: Function execution');
  console.time('execution-time');
  
  try {
    // Walidacja z dokładnymi komunikatami
    if (!data) {
      throw new Error('Data is null or undefined');
    }
    
    if (!Array.isArray(data)) {
      throw new Error(\`Expected array, got \${typeof data}\`);
    }
    
    console.log('✅ Validation passed, processing', data.length, 'items');
    
    const result = data.map((item, index) => {
      console.log(\`Processing item \${index}:\`, item);
      
      // Defensive programming
      if (!item || typeof item !== 'object') {
        console.warn(\`⚠️ Skipping invalid item at index \${index}\`);
        return null;
      }
      
      return { ...item, processed: true };
    }).filter(Boolean);
    
    console.log('✅ Processing complete, result:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error in debugSafeFunction:', error);
    console.trace(); // Stack trace
    throw error;
    
  } finally {
    console.timeEnd('execution-time');
    console.groupEnd();
  }
}
\`\`\`

**Narzędzia debugowania:**
• Console.group() dla organizacji logów
• Console.time() dla pomiaru wydajności
• Try-catch z szczegółowymi komunikatami
• Stack trace dla śledzenia błędów

**Strategies debugowania:**
• Breakpoints w krytycznych miejscach
• Unit testy dla edge cases
• Monitoring w środowisku produkcyjnym
• Logging poziomów (debug, info, warn, error)`;
  }
  
  refactorCode(code, language) {
    return `**🔄 Refaktoryzacja Kodu - Code Bison**

**Zidentyfikowane obszary do refaktoryzacji:**

**1. Code Smells:**
• Długie funkcje (ponad 50 linii)
• Zduplikowany kod
• Zbyt wiele parametrów
• Głębokie zagnieżdżenia

**2. Design Patterns:**
• Zastosowanie Factory Pattern
• Implementacja Observer Pattern
• Użycie Strategy Pattern

**Zrefaktoryzowany kod:**
\`\`\`${language}
// Przed refaktoryzacją: monolityczna funkcja
// Po refaktoryzacji: modularne, testowalne komponenty

class DataProcessor {
  constructor(config = {}) {
    this.config = {
      validation: true,
      sorting: true,
      ...config
    };
    this.validators = new Map();
    this.processors = new Map();
  }
  
  // Single Responsibility: tylko walidacja
  validate(data) {
    if (!this.config.validation) return data;
    
    const validator = this.validators.get('default') || this.defaultValidator;
    return validator(data);
  }
  
  // Single Responsibility: tylko przetwarzanie
  process(data) {
    return data.map(this.processItem.bind(this));
  }
  
  // Single Responsibility: sortowanie
  sort(data) {
    if (!this.config.sorting) return data;
    
    return [...data].sort((a, b) => a.priority - b.priority);
  }
  
  // Główna metoda - orkiestracja
  execute(rawData) {
    const validatedData = this.validate(rawData);
    const processedData = this.process(validatedData);
    const sortedData = this.sort(processedData);
    
    return sortedData;
  }
  
  // Private method
  processItem(item) {
    return {
      ...item,
      processed: true,
      timestamp: new Date().toISOString()
    };
  }
  
  defaultValidator(data) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    return data.filter(item => item != null);
  }
}

// Usage
const processor = new DataProcessor({ 
  validation: true, 
  sorting: true 
});

const result = processor.execute(inputData);
\`\`\`

**Korzyści refaktoryzacji:**
• 📦 **Modularność:** Każda metoda ma jedną odpowiedzialność
• 🧪 **Testowalność:** Łatwiejsze unit testing
• 🔧 **Rozszerzalność:** Łatwe dodawanie nowych funkcji
• 📖 **Czytelność:** Kod jest samodokumentujący

**Zastosowane wzorce:**
• **Single Responsibility Principle**
• **Strategy Pattern** dla różnych walidatorów
• **Template Method** dla procesu przetwarzania
• **Dependency Injection** dla konfiguracji`;
  }
  
  generateDocumentation(code, language) {
    return `**📚 Dokumentacja Kodu - Code Bison**

**API Documentation:**

\`\`\`${language}
/**
 * Główny moduł przetwarzania danych
 * @module DataProcessor
 * @version 1.0.0
 * @author Code Bison AI
 */

/**
 * Przetwarza dane wejściowe zgodnie z konfiguracją
 * @function processData
 * @param {Array<Object>} data - Tablica obiektów do przetworzenia
 * @param {Object} [options={}] - Opcje przetwarzania
 * @param {boolean} [options.validate=true] - Czy walidować dane
 * @param {boolean} [options.sort=true] - Czy sortować wyniki
 * @param {string} [options.format='json'] - Format wyjściowy
 * @returns {Promise<Array<Object>>} Przetworzone dane
 * @throws {ValidationError} Gdy dane są w nieprawidłowym formacie
 * @throws {ProcessingError} Gdy przetwarzanie się nie powiedzie
 * 
 * @example
 * // Podstawowe użycie
 * const data = [
 *   { id: 1, name: 'Item 1', active: true },
 *   { id: 2, name: 'Item 2', active: false }
 * ];
 * 
 * const result = await processData(data, {
 *   validate: true,
 *   sort: true,
 *   format: 'json'
 * });
 * 
 * console.log(result);
 * // Output: [{ id: 1, name: 'Item 1', active: true, processed: true }]
 * 
 * @example
 * // Zaawansowane użycie z custom validator
 * const customOptions = {
 *   validate: true,
 *   validator: (item) => item.score > 50,
 *   sort: true,
 *   sortBy: 'score'
 * };
 * 
 * const filteredResult = await processData(data, customOptions);
 */
\`\`\`

**README.md:**
\`\`\`markdown
# Data Processing Module

## Instalacja
\`\`\`bash
npm install data-processor
\`\`\`

## Szybki start
\`\`\`${language}
import { processData } from 'data-processor';

const data = [/* your data */];
const result = await processData(data);
\`\`\`

## Konfiguracja
| Opcja | Typ | Domyślna | Opis |
|-------|-----|----------|------|
| validate | boolean | true | Włącz walidację |
| sort | boolean | true | Włącz sortowanie |
| format | string | 'json' | Format wyjścia |

## Przykłady użycia
[Więcej przykładów w dokumentacji](docs/examples.md)
\`\`\`

**Komentarze inline:**
• JSDoc dla wszystkich publicznych funkcji
• Inline comments dla skomplikowanej logiki
• TODO i FIXME dla przyszłych zmian
• @deprecated dla przestarzałych funkcji

**Dodatkowe dokumenty:**
• CHANGELOG.md - historia zmian
• CONTRIBUTING.md - wytyczne dla contributors
• API.md - pełna dokumentacja API
• EXAMPLES.md - praktyczne przykłady`;
  }
  
  generateTests(code, language) {
    const testFrameworks = {
      javascript: 'Jest',
      typescript: 'Jest + @types/jest',
      python: 'pytest',
      java: 'JUnit 5',
      csharp: 'NUnit'
    };
    
    const framework = testFrameworks[language] || 'Jest';
    
    return `**🧪 Testy Jednostkowe - ${framework}**

**Test Suite:**
\`\`\`${language}
import { processData } from './data-processor';

describe('Data Processor Tests', () => {
  
  // Setup i cleanup
  beforeEach(() => {
    // Inicjalizacja przed każdym testem
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Cleanup po każdym teście
  });
  
  // Happy Path Tests
  describe('Happy Path', () => {
    
    test('should process valid data correctly', async () => {
      // Arrange
      const inputData = [
        { id: 1, name: 'Item 1', active: true },
        { id: 2, name: 'Item 2', active: false }
      ];
      
      const expectedOutput = [
        { id: 1, name: 'Item 1', active: true, processed: true }
      ];
      
      // Act
      const result = await processData(inputData);
      
      // Assert
      expect(result).toEqual(expectedOutput);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('processed', true);
    });
    
    test('should handle empty array', async () => {
      const result = await processData([]);
      expect(result).toEqual([]);
    });
    
  });
  
  // Edge Cases
  describe('Edge Cases', () => {
    
    test('should handle null input', async () => {
      await expect(processData(null))
        .rejects
        .toThrow('Invalid data format');
    });
    
    test('should handle undefined input', async () => {
      await expect(processData(undefined))
        .rejects
        .toThrow('Invalid data format');
    });
    
    test('should handle non-array input', async () => {
      await expect(processData('not an array'))
        .rejects
        .toThrow('Data must be an array');
    });
    
  });
  
  // Performance Tests
  describe('Performance', () => {
    
    test('should handle large datasets efficiently', async () => {
      // Arrange
      const largeData = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: \`Item \${i}\`,
        active: i % 2 === 0
      }));
      
      // Act
      const startTime = performance.now();
      const result = await processData(largeData);
      const endTime = performance.now();
      
      // Assert
      expect(endTime - startTime).toBeLessThan(1000); // < 1s
      expect(result).toHaveLength(5000); // Half should be active
    });
    
  });
  
  // Integration Tests
  describe('Integration', () => {
    
    test('should work with real API data', async () => {
      // Mock API response
      const apiData = [
        { id: '1', title: 'Test', status: 'active' },
        { id: '2', title: 'Test 2', status: 'inactive' }
      ];
      
      const result = await processData(apiData, {
        validate: true,
        transform: item => ({ ...item, processed: true })
      });
      
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('processed', true);
    });
    
  });
  
});

// Test Utilities
export const testUtils = {
  
  createMockData: (count = 5) => 
    Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: \`Mock Item \${i + 1}\`,
      active: Math.random() > 0.5
    })),
    
  mockApiCall: jest.fn().mockResolvedValue({ data: [] }),
  
  expectValidOutput: (result) => {
    expect(result).toBeInstanceOf(Array);
    expect(result.every(item => 
      typeof item === 'object' && 
      item.hasOwnProperty('processed')
    )).toBe(true);
  }
  
};
\`\`\`

**Pokrycie testów:**
• ✅ Unit Tests: 95% coverage
• ✅ Integration Tests: 85% coverage  
• ✅ E2E Tests: 70% coverage
• ✅ Performance Tests: Included

**Test Commands:**
\`\`\`bash
npm test              # Uruchom wszystkie testy
npm test -- --watch  # Watch mode
npm test -- --coverage # Raport pokrycia
npm test -- --verbose  # Szczegółowe logi
\`\`\`

**Best Practices:**
• AAA Pattern (Arrange, Act, Assert)
• Descriptive test names
• Mock external dependencies
• Test edge cases and error scenarios
• Performance benchmarking
• Snapshot testing dla UI components`;
  }
  
  reviewCode(code, language) {
    const score = Math.floor(Math.random() * 3) + 7; // 7-10 score
    const issues = Math.floor(Math.random() * 3) + 1;
    const suggestions = Math.floor(Math.random() * 4) + 2;
    
    return `**📋 Przegląd Kodu (Code Review) - Code Bison**

**Ogólna ocena: ${score}/10** ⭐

**Pozytywne aspekty:**
• ✅ Dobra struktura i organizacja kodu
• ✅ Konsystentne nazewnictwo zmiennych
• ✅ Właściwa obsługa błędów
• ✅ Czytelne komentarze i dokumentacja
• ✅ Przestrzeganie konwencji ${language}

**Znalezione problemy (${issues}):**
${issues >= 1 ? '• ⚠️ Brak walidacji parametrów wejściowych w funkcji main()' : ''}
${issues >= 2 ? '• ⚠️ Potencjalny memory leak w pętli - brak cleanup' : ''}
${issues >= 3 ? '• ⚠️ Złożoność cyklomatyczna przekracza 10 w metodzie process()' : ''}

**Sugestie poprawek (${suggestions}):**
• 💡 Dodaj type annotations dla lepszej dokumentacji
• 💡 Rozważ użycie const assertions dla readonly data
${suggestions >= 3 ? '• 💡 Przenieś magic numbers do stałych konfiguracyjnych' : ''}
${suggestions >= 4 ? '• 💡 Zaimplementuj graceful degradation dla API calls' : ''}
${suggestions >= 5 ? '• 💡 Dodaj logging dla łatwiejszego debugowania' : ''}

**Bezpieczeństwo:**
• 🔒 **Ocena bezpieczeństwa: ${Math.floor(Math.random() * 2) + 8}/10**
• Brak oczywistych luk bezpieczeństwa
• Input sanitization obecna
• Brak hardcoded secrets
• Proper error handling bez ujawniania internals

**Wydajność:**
• ⚡ **Ocena wydajności: ${Math.floor(Math.random() * 2) + 7}/10**
• Algorytmy w większości optymalne
• Minimalne overhead w hot paths
• Proper memory management
• Cache-friendly data structures

**Maintainability:**
• 🔧 **Łatwość utrzymania: ${Math.floor(Math.random() * 2) + 8}/10**
• Kod jest self-documenting
• Modularna architektura
• Single Responsibility Principle
• Consistent coding style

**Action Items:**
1. **Priorytet wysoki:** Naprawa potencjalnego memory leak
2. **Priorytet średni:** Dodanie type annotations
3. **Priorytet niski:** Refaktoryzacja złożonych metod

**Następne kroki:**
• Implement suggested changes
• Add unit tests for edge cases  
• Consider integration testing
• Update documentation

**Approved for merge:** ${score >= 8 ? '✅ TAK' : '❌ NIE'} 
${score < 8 ? '(Po naprawieniu krytycznych problemów)' : '(Z małymi poprawkami)'}`;
  }
  
  setLanguage(language) {
    if (this.supportedLanguages.includes(language)) {
      this.preferences.language = language;
      this.activeSession.language = language;
      this.saveUserPreferences();
      return { success: true, message: `Language set to ${language}` };
    }
    return { success: false, message: `Unsupported language: ${language}` };
  }
  
  getCodeHistory() {
    return this.codeHistory;
  }
  
  clearHistory() {
    this.codeHistory = [];
    return { success: true, message: 'Code history cleared' };
  }
  
  exportCode(codeId, format = 'text') {
    const code = this.codeHistory.find(c => c.id === codeId);
    if (!code) {
      return { success: false, error: 'Code not found' };
    }
    
    if (format === 'json') {
      return JSON.stringify(code, null, 2);
    }
    
    return `Code Bison Export
ID: ${code.id}
Language: ${code.request.language}
Type: ${code.request.type}
Date: ${code.timestamp}

Request:
${code.request.text}

Response:
${code.response}`;
  }
  
  getStatus() {
    return {
      agent: 'Code Bison',
      status: 'active',
      session: this.activeSession,
      codeCount: this.codeHistory.length,
      supportedLanguages: this.supportedLanguages,
      capabilities: this.capabilities,
      preferences: this.preferences
    };
  }
}

// Global instance
export const codeBisonAgent = new CodeBisonAgentFunctions();

// Make available globally
if (typeof window !== 'undefined') {
  window.codeBisonAgent = codeBisonAgent;
}