#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Kolory dla output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Konfiguracja walidacji
const config = {
  // Pliki do sprawdzenia
  extensions: ['.ts', '.js', '.astro', '.vue', '.jsx', '.tsx'],
  
  // Wzorce wrażliwych danych
  sensitivePatterns: [
    {
      pattern: /(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"]\w+['"]/i,
      message: 'Potencjalnie wrażliwe dane (API key, secret, token, password)'
    },
    {
      pattern: /sk-[a-zA-Z0-9]{48}/,
      message: 'OpenAI API key'
    },
    {
      pattern: /xoxb-[0-9]{11}-[0-9]{12}-[a-zA-Z0-9]{24}/,
      message: 'Slack Bot Token'
    },
    {
      pattern: /ghp_[a-zA-Z0-9]{36}/,
      message: 'GitHub Personal Access Token'
    }
  ],
  
  // Wzorce niebezpiecznego kodu
  dangerousPatterns: [
    {
      pattern: /eval\s*\(/,
      message: 'Niebezpieczne użycie eval()'
    },
    {
      pattern: /document\.write\s*\(/,
      message: 'Niebezpieczne użycie document.write()'
    },
    {
      pattern: /innerHTML\s*\+?=/,
      message: 'Potencjalnie niebezpieczne użycie innerHTML (XSS risk)'
    },
    {
      pattern: /\$\{[^}]*\}/g,
      message: 'Template literals - sprawdź czy dane są sanitized'
    }
  ],
  
  // Wzorce złych praktyk
  badPracticePatterns: [
    {
      pattern: /console\.log\s*\(/,
      message: 'console.log pozostały w kodzie'
    },
    {
      pattern: /debugger\s*;/,
      message: 'debugger statement pozostały w kodzie'
    },
    {
      pattern: /TODO|FIXME|HACK/i,
      message: 'Komentarze TODO/FIXME/HACK - rozważ usunięcie'
    }
  ],
  
  // Pliki do pominięcia
  excludePatterns: [
    /node_modules/,
    /\.git/,
    /dist/,
    /build/,
    /coverage/,
    /\.vscode/,
    /\.next/,
    /backups/
  ]
};

class PreCommitValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.filesChecked = 0;
    this.verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  error(message) {
    this.errors.push(message);
    this.log(`❌ ${message}`, 'red');
  }

  warn(message) {
    this.warnings.push(message);
    this.log(`⚠️  ${message}`, 'yellow');
  }

  success(message) {
    this.log(`✅ ${message}`, 'green');
  }

  info(message) {
    if (this.verbose) {
      this.log(`ℹ️  ${message}`, 'blue');
    }
  }

  async run() {
    this.log('\n🔍 MyBonzo Pre-Commit Validator', 'cyan');
    this.log('================================\n', 'cyan');

    try {
      // 1. Sprawdź staged files
      const stagedFiles = this.getStagedFiles();
      
      if (stagedFiles.length === 0) {
        this.log('Brak staged files do sprawdzenia', 'yellow');
        return true;
      }

      this.info(`Sprawdzanie ${stagedFiles.length} staged files...`);

      // 2. Walidacja TypeScript/JavaScript
      await this.validateTypeScript();

      // 3. Linting
      await this.runLinting();

      // 4. Format checking
      await this.checkFormatting();

      // 5. Sprawdzenie wrażliwych danych
      await this.scanForSensitiveData(stagedFiles);

      // 6. Sprawdzenie niebezpiecznych wzorców
      await this.scanForDangerousPatterns(stagedFiles);

      // 7. Sprawdzenie złych praktyk
      await this.scanForBadPractices(stagedFiles);

      // 8. Test build
      await this.testBuild();

      // 9. Sprawdzenie zależności
      await this.checkDependencies();

      // Podsumowanie
      this.printSummary();

      return this.errors.length === 0;

    } catch (error) {
      this.error(`Validator error: ${error.message}`);
      return false;
    }
  }

  getStagedFiles() {
    try {
      const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
      return output.trim().split('\n').filter(file => {
        if (!file) return false;
        
        // Sprawdź czy plik istnieje
        if (!fs.existsSync(file)) return false;
        
        // Sprawdź rozszerzenie
        const hasValidExtension = config.extensions.some(ext => file.endsWith(ext));
        
        // Sprawdź czy nie jest wykluczony
        const isExcluded = config.excludePatterns.some(pattern => pattern.test(file));
        
        return hasValidExtension && !isExcluded;
      });
    } catch (error) {
      this.warn('Nie udało się pobrać staged files');
      return [];
    }
  }

  async validateTypeScript() {
    this.info('Sprawdzanie TypeScript...');
    
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      this.success('TypeScript validation passed');
    } catch (error) {
      this.error('TypeScript validation failed');
      if (this.verbose) {
        this.log(error.stdout?.toString() || error.message, 'red');
      }
    }
  }

  async runLinting() {
    this.info('Uruchamianie ESLint...');
    
    try {
      execSync('npx eslint . --ext .ts,.js,.astro', { stdio: 'pipe' });
      this.success('ESLint passed');
    } catch (error) {
      // ESLint może zwrócić błąd nawet przy warnings
      const output = error.stdout?.toString() || '';
      if (output.includes('error')) {
        this.error('ESLint errors found');
        if (this.verbose) {
          this.log(output, 'red');
        }
      } else {
        this.warn('ESLint warnings found');
        if (this.verbose) {
          this.log(output, 'yellow');
        }
      }
    }
  }

  async checkFormatting() {
    this.info('Sprawdzanie formatowania...');
    
    try {
      execSync('npx prettier --check .', { stdio: 'pipe' });
      this.success('Code formatting is correct');
    } catch (error) {
      this.warn('Code formatting issues found - run "npm run format"');
      if (this.verbose) {
        this.log(error.stdout?.toString() || error.message, 'yellow');
      }
    }
  }

  async scanForSensitiveData(files) {
    this.info('Skanowanie wrażliwych danych...');
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        this.filesChecked++;
        
        for (const { pattern, message } of config.sensitivePatterns) {
          const matches = content.match(pattern);
          if (matches) {
            this.error(`${file}: ${message}`);
            if (this.verbose) {
              this.log(`  Znaleziony pattern: ${matches[0]}`, 'red');
            }
          }
        }
        
      } catch (error) {
        this.warn(`Nie można odczytać pliku: ${file}`);
      }
    }
    
    if (files.length > 0 && this.errors.filter(e => e.includes('wrażliwe')).length === 0) {
      this.success('Brak wrażliwych danych w staged files');
    }
  }

  async scanForDangerousPatterns(files) {
    this.info('Skanowanie niebezpiecznych wzorców...');
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        for (const { pattern, message } of config.dangerousPatterns) {
          const matches = content.match(pattern);
          if (matches) {
            this.error(`${file}: ${message}`);
            if (this.verbose) {
              this.log(`  Linia: ${this.getLineNumber(content, matches.index)}`, 'red');
            }
          }
        }
        
      } catch (error) {
        this.warn(`Nie można odczytać pliku: ${file}`);
      }
    }
  }

  async scanForBadPractices(files) {
    this.info('Sprawdzanie złych praktyk...');
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        for (const { pattern, message } of config.badPracticePatterns) {
          const matches = content.match(pattern);
          if (matches) {
            this.warn(`${file}: ${message}`);
            if (this.verbose) {
              this.log(`  Znalezione: ${matches.length} wystąpień`, 'yellow');
            }
          }
        }
        
      } catch (error) {
        this.warn(`Nie można odczytać pliku: ${file}`);
      }
    }
  }

  async testBuild() {
    this.info('Testowanie build...');
    
    try {
      execSync('npm run build', { stdio: 'pipe' });
      this.success('Test build successful');
    } catch (error) {
      this.error('Test build failed');
      if (this.verbose) {
        this.log(error.stdout?.toString() || error.message, 'red');
      }
    }
  }

  async checkDependencies() {
    this.info('Sprawdzanie zależności...');
    
    try {
      const auditOutput = execSync('npm audit --audit-level moderate', { 
        stdio: 'pipe',
        encoding: 'utf8' 
      });
      
      if (auditOutput.includes('vulnerabilities')) {
        this.warn('Znalezione vulnerabilities w dependencies');
        if (this.verbose) {
          this.log(auditOutput, 'yellow');
        }
      } else {
        this.success('Dependencies security check passed');
      }
    } catch (error) {
      const output = error.stdout?.toString() || '';
      if (output.includes('high') || output.includes('critical')) {
        this.error('Critical vulnerabilities found in dependencies');
      } else {
        this.warn('Some dependency issues found');
      }
      
      if (this.verbose) {
        this.log(output, 'yellow');
      }
    }
  }

  getLineNumber(content, index) {
    if (index === undefined) return 'unknown';
    return content.substring(0, index).split('\n').length;
  }

  printSummary() {
    this.log('\n📊 Podsumowanie Pre-Commit Validation', 'cyan');
    this.log('=====================================\n', 'cyan');
    
    this.log(`Sprawdzonych plików: ${this.filesChecked}`, 'blue');
    this.log(`Błędy: ${this.errors.length}`, this.errors.length > 0 ? 'red' : 'green');
    this.log(`Ostrzeżenia: ${this.warnings.length}`, this.warnings.length > 0 ? 'yellow' : 'green');
    
    if (this.errors.length > 0) {
      this.log('\n❌ COMMIT ZABLOKOWANY', 'red');
      this.log('Napraw błędy przed commit:', 'red');
      this.errors.forEach(error => this.log(`  • ${error}`, 'red'));
    } else {
      this.log('\n✅ COMMIT MOŻE ZOSTAĆ WYKONANY', 'green');
      if (this.warnings.length > 0) {
        this.log('Ostrzeżenia do rozważenia:', 'yellow');
        this.warnings.forEach(warning => this.log(`  • ${warning}`, 'yellow'));
      }
    }
    
    this.log('\n');
  }
}

// Uruchom validator jeśli plik jest wykonywany bezpośrednio
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new PreCommitValidator();
  
  validator.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error(`Pre-commit validation error: ${error.message}`);
    process.exit(1);
  });
}

export default PreCommitValidator;