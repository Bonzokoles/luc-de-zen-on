#!/usr/bin/env node

/**
 * Git Pre-commit Hook - MyBonzo Application
 * Automatyczna walidacja przed każdym commitem
 * 
 * Ten hook uruchamia się automatycznie przed każdym git commit
 * i sprawdza kod pod kątem błędów, problemów bezpieczeństwa i stylu
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Konfiguracja
const CONFIG = {
  enabledChecks: {
    eslint: true,
    typescript: true,
    prettier: true,
    security: true,
    buildTest: true,
    customRules: true
  },
  maxWarnings: 5,
  failOnWarnings: false,
  skipOnEmergency: false // Ustaw na true aby pominąć w sytuacjach awaryjnych
};

// Kolory dla terminala
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.cyan}${colors.bold}=== ${title} ===${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Główna funkcja walidacji
async function runPreCommitChecks() {
  logSection('MyBonzo Pre-commit Validation');
  
  const startTime = Date.now();
  let totalWarnings = 0;
  let totalErrors = 0;
  const results = [];

  try {
    // Sprawdź czy to emergency commit
    if (isEmergencyCommit() && CONFIG.skipOnEmergency) {
      logWarning('Emergency commit detected - skipping validation');
      return true;
    }

    // 1. Sprawdź staged files
    const stagedFiles = getStagedFiles();
    if (stagedFiles.length === 0) {
      logWarning('No staged files found');
      return true;
    }

    logInfo(`Validating ${stagedFiles.length} staged files...`);

    // 2. ESLint Check
    if (CONFIG.enabledChecks.eslint) {
      const eslintResult = await runESLint(stagedFiles);
      results.push(eslintResult);
      totalWarnings += eslintResult.warnings;
      totalErrors += eslintResult.errors;
    }

    // 3. TypeScript Check
    if (CONFIG.enabledChecks.typescript) {
      const tsResult = await runTypeScriptCheck();
      results.push(tsResult);
      totalWarnings += tsResult.warnings;
      totalErrors += tsResult.errors;
    }

    // 4. Prettier Check
    if (CONFIG.enabledChecks.prettier) {
      const prettierResult = await runPrettierCheck(stagedFiles);
      results.push(prettierResult);
      totalErrors += prettierResult.errors;
    }

    // 5. Security Check
    if (CONFIG.enabledChecks.security) {
      const securityResult = await runSecurityCheck(stagedFiles);
      results.push(securityResult);
      totalWarnings += securityResult.warnings;
      totalErrors += securityResult.errors;
    }

    // 6. Custom Rules Check
    if (CONFIG.enabledChecks.customRules) {
      const customResult = await runCustomRules(stagedFiles);
      results.push(customResult);
      totalWarnings += customResult.warnings;
      totalErrors += customResult.errors;
    }

    // 7. Build Test (opcjonalnie)
    if (CONFIG.enabledChecks.buildTest && shouldRunBuildTest(stagedFiles)) {
      const buildResult = await runBuildTest();
      results.push(buildResult);
      totalErrors += buildResult.errors;
    }

    // Podsumowanie
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    logSection('Pre-commit Summary');
    
    results.forEach(result => {
      if (result.errors === 0 && result.warnings === 0) {
        logSuccess(`${result.name}: PASSED (${result.duration})`);
      } else if (result.errors === 0) {
        logWarning(`${result.name}: ${result.warnings} warnings (${result.duration})`);
      } else {
        logError(`${result.name}: ${result.errors} errors, ${result.warnings} warnings (${result.duration})`);
      }
    });

    console.log(`\n${colors.bold}Total: ${totalErrors} errors, ${totalWarnings} warnings in ${duration}s${colors.reset}`);

    // Sprawdź czy commit może przejść
    if (totalErrors > 0) {
      logError('❌ COMMIT REJECTED: Fix errors before committing');
      logInfo('Run the following to fix issues:');
      logInfo('  npm run lint:fix    # Fix ESLint issues');
      logInfo('  npm run format      # Fix Prettier issues');
      logInfo('  npm run type-check  # Check TypeScript issues');
      return false;
    }

    if (totalWarnings > CONFIG.maxWarnings && CONFIG.failOnWarnings) {
      logError(`❌ COMMIT REJECTED: Too many warnings (${totalWarnings}/${CONFIG.maxWarnings})`);
      return false;
    }

    if (totalWarnings > 0) {
      logWarning(`⚠️ COMMIT ALLOWED with ${totalWarnings} warnings`);
      logInfo('Consider fixing warnings before pushing to production');
    } else {
      logSuccess('🎉 ALL CHECKS PASSED - COMMIT ALLOWED');
    }

    return true;

  } catch (error) {
    logError(`Pre-commit hook failed: ${error.message}`);
    return false;
  }
}

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
    return output.trim().split('\n').filter(file => file.length > 0);
  } catch (error) {
    logWarning('Could not get staged files');
    return [];
  }
}

function isEmergencyCommit() {
  // Sprawdź czy commit message zawiera słowa kluczowe awaryjne
  try {
    const commitMessage = process.env.GIT_COMMIT_MESSAGE || '';
    const emergencyKeywords = ['EMERGENCY', 'HOTFIX', 'CRITICAL', 'URGENT'];
    return emergencyKeywords.some(keyword => 
      commitMessage.toUpperCase().includes(keyword)
    );
  } catch {
    return false;
  }
}

async function runESLint(stagedFiles) {
  const startTime = Date.now();
  let errors = 0;
  let warnings = 0;

  try {
    logInfo('Running ESLint...');
    
    const jsFiles = stagedFiles.filter(file => 
      /\.(js|jsx|ts|tsx|astro)$/.test(file) && fs.existsSync(file)
    );

    if (jsFiles.length === 0) {
      return { name: 'ESLint', errors: 0, warnings: 0, duration: '0.0s' };
    }

    try {
      execSync(`npx eslint ${jsFiles.join(' ')} --format=json`, { 
        encoding: 'utf-8',
        stdio: 'pipe'
      });
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      
      if (output.includes('[')) {
        try {
          const results = JSON.parse(output);
          results.forEach(result => {
            errors += result.errorCount || 0;
            warnings += result.warningCount || 0;
            
            if (result.messages && result.messages.length > 0) {
              result.messages.forEach(msg => {
                const type = msg.severity === 2 ? 'ERROR' : 'WARNING';
                const color = msg.severity === 2 ? 'red' : 'yellow';
                log(`  ${result.filePath}:${msg.line}:${msg.column} ${type}: ${msg.message}`, color);
              });
            }
          });
        } catch {
          // Fallback - traktuj jako błąd
          errors = 1;
        }
      } else {
        errors = 1;
      }
    }

  } catch (error) {
    logWarning(`ESLint check failed: ${error.message}`);
    errors = 1;
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
  return { name: 'ESLint', errors, warnings, duration };
}

async function runTypeScriptCheck() {
  const startTime = Date.now();
  let errors = 0;
  let warnings = 0;

  try {
    logInfo('Running TypeScript check...');
    
    execSync('npx tsc --noEmit', { 
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    
  } catch (error) {
    const output = error.stdout || error.stderr || '';
    
    // Zlicz błędy TypeScript
    const errorLines = output.split('\n').filter(line => 
      line.includes('error TS') || line.includes('Error:')
    );
    
    errors = errorLines.length;
    
    if (errors > 0) {
      errorLines.forEach(line => {
        log(`  ${line}`, 'red');
      });
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
  return { name: 'TypeScript', errors, warnings, duration };
}

async function runPrettierCheck(stagedFiles) {
  const startTime = Date.now();
  let errors = 0;

  try {
    logInfo('Running Prettier check...');
    
    const prettierFiles = stagedFiles.filter(file => 
      /\.(js|jsx|ts|tsx|json|css|scss|html|md|astro)$/.test(file) && fs.existsSync(file)
    );

    if (prettierFiles.length === 0) {
      return { name: 'Prettier', errors: 0, warnings: 0, duration: '0.0s' };
    }

    try {
      execSync(`npx prettier --check ${prettierFiles.join(' ')}`, { 
        encoding: 'utf-8',
        stdio: 'pipe'
      });
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      
      // Zlicz pliki które nie przeszły formatowania
      const unformattedFiles = output.split('\n').filter(line => 
        line.trim().length > 0 && !line.includes('Code style issues')
      );
      
      errors = unformattedFiles.length;
      
      if (errors > 0) {
        logError('Files with formatting issues:');
        unformattedFiles.forEach(file => {
          log(`  ${file}`, 'red');
        });
        logInfo('Run "npm run format" to fix formatting issues');
      }
    }

  } catch (error) {
    logWarning(`Prettier check failed: ${error.message}`);
    errors = 1;
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
  return { name: 'Prettier', errors, warnings: 0, duration };
}

async function runSecurityCheck(stagedFiles) {
  const startTime = Date.now();
  let errors = 0;
  let warnings = 0;

  try {
    logInfo('Running security checks...');

    // Sprawdź czy nie commitujemy wrażliwych danych
    const sensitivePatterns = [
      /password\s*=\s*['"]\w+['"]|password:\s*['"]\w+['"]/i,
      /api[_-]?key\s*[=:]\s*['"]\w+['"]/i,
      /secret\s*[=:]\s*['"]\w+['"]/i,
      /token\s*[=:]\s*['"]\w+['"]/i,
      /private[_-]?key/i,
      /-{5}BEGIN\s+PRIVATE\s+KEY-{5}/,
      /sk_live_|pk_live_|sk_test_|pk_test_/,
      /AKIA[0-9A-Z]{16}/,  // AWS Access Key
      /[0-9a-f]{32,}/  // Potencjalny hash lub token
    ];

    stagedFiles.forEach(file => {
      if (!fs.existsSync(file)) return;
      
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        sensitivePatterns.forEach((pattern, index) => {
          if (pattern.test(content)) {
            errors++;
            logError(`Potential sensitive data in ${file} (pattern ${index + 1})`);
          }
        });
        
        // Sprawdź wielkość pliku
        const stats = fs.statSync(file);
        if (stats.size > 10 * 1024 * 1024) { // 10MB
          warnings++;
          logWarning(`Large file detected: ${file} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
        }
        
        // Sprawdź czy nie commitujemy plików log lub tmp
        if (/\.(log|tmp|cache|swp|bak)$/.test(file)) {
          warnings++;
          logWarning(`Temporary/log file detected: ${file}`);
        }
        
      } catch (error) {
        logWarning(`Could not read file ${file}: ${error.message}`);
      }
    });

    // Sprawdź package.json pod kątem niebezpiecznych dependencji
    if (stagedFiles.includes('package.json')) {
      try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        Object.keys(deps).forEach(dep => {
          // Sprawdź czy nie ma podejrzanych pakietów
          if (/^[a-f0-9]{32,}$/.test(dep) || dep.includes('..')) {
            warnings++;
            logWarning(`Suspicious dependency name: ${dep}`);
          }
        });
      } catch (error) {
        logWarning('Could not parse package.json');
      }
    }

  } catch (error) {
    logWarning(`Security check failed: ${error.message}`);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
  return { name: 'Security', errors, warnings, duration };
}

async function runCustomRules(stagedFiles) {
  const startTime = Date.now();
  let errors = 0;
  let warnings = 0;

  try {
    logInfo('Running custom rules...');

    stagedFiles.forEach(file => {
      if (!fs.existsSync(file)) return;
      
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Regel 1: Brak console.log w produkcyjnym kodzie
          if (/console\.log|console\.warn|console\.error/.test(line) && 
              !file.includes('test') && !file.includes('spec')) {
            warnings++;
            logWarning(`Console statement in ${file}:${index + 1}`);
          }
          
          // Regel 2: Brak TODO w commitowanych plikach
          if (/TODO|FIXME|HACK|XXX/.test(line)) {
            warnings++;
            logWarning(`TODO/FIXME found in ${file}:${index + 1}: ${line.trim()}`);
          }
          
          // Regel 3: Długie linie (>120 znaków)
          if (line.length > 120 && !line.includes('http') && !line.includes('import')) {
            warnings++;
            logWarning(`Long line in ${file}:${index + 1} (${line.length} chars)`);
          }
          
          // Regel 4: Brak właściwego typu pliku dla importów
          if (/import.*from\s+['"]\.[^'"]*['"]\s*$/.test(line) && 
              !/\.(js|ts|jsx|tsx|astro|css|scss|json)['"]/.test(line)) {
            warnings++;
            logWarning(`Import without file extension in ${file}:${index + 1}`);
          }
        });
        
        // Regel 5: Pliki Astro powinny mieć proper frontmatter
        if (file.endsWith('.astro')) {
          if (!content.startsWith('---')) {
            warnings++;
            logWarning(`Astro file ${file} missing frontmatter`);
          }
        }
        
        // Regel 6: TypeScript pliki powinny mieć proper typy
        if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          if (content.includes(': any') && !file.includes('types.ts')) {
            warnings++;
            logWarning(`'any' type usage in ${file} (consider specific types)`);
          }
        }
        
      } catch (error) {
        logWarning(`Could not analyze file ${file}: ${error.message}`);
      }
    });

  } catch (error) {
    logWarning(`Custom rules check failed: ${error.message}`);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
  return { name: 'Custom Rules', errors, warnings, duration };
}

function shouldRunBuildTest(stagedFiles) {
  // Uruchom build test tylko jeśli zmienione są pliki które mogą wpłynąć na build
  const criticalFiles = [
    'astro.config.mjs',
    'package.json',
    'tsconfig.json',
    'tailwind.config.js',
    'vite.config.js'
  ];
  
  const hasCriticalChanges = criticalFiles.some(file => stagedFiles.includes(file));
  const hasSourceChanges = stagedFiles.some(file => 
    file.startsWith('src/') || file.endsWith('.astro') || file.endsWith('.ts') || file.endsWith('.tsx')
  );
  
  return hasCriticalChanges || (hasSourceChanges && stagedFiles.length > 10);
}

async function runBuildTest() {
  const startTime = Date.now();
  let errors = 0;

  try {
    logInfo('Running build test...');
    
    execSync('npm run build', { 
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    
    logInfo('Build test completed successfully');
    
  } catch (error) {
    errors = 1;
    logError('Build test failed');
    
    const output = error.stdout || error.stderr || '';
    if (output) {
      log(output.substring(0, 500), 'red'); // Pokaż pierwsze 500 znaków błędu
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
  return { name: 'Build Test', errors, warnings: 0, duration };
}

// Funkcja pomocnicza do logowania stanu
function logPreCommitState() {
  logSection('Pre-commit Hook Information');
  logInfo(`Enabled checks: ${Object.keys(CONFIG.enabledChecks).filter(k => CONFIG.enabledChecks[k]).join(', ')}`);
  logInfo(`Max warnings: ${CONFIG.maxWarnings}`);
  logInfo(`Fail on warnings: ${CONFIG.failOnWarnings}`);
  logInfo(`Skip on emergency: ${CONFIG.skipOnEmergency}`);
}

// Main execution
if (require.main === module) {
  // Pokaż informacje o konfiguracji w trybie verbose
  if (process.argv.includes('--verbose') || process.env.VERBOSE === 'true') {
    logPreCommitState();
  }
  
  runPreCommitChecks()
    .then(success => {
      if (success) {
        console.log(''); // Dodaj pustą linię na końcu
        process.exit(0);
      } else {
        console.log(''); // Dodaj pustą linię na końcu
        process.exit(1);
      }
    })
    .catch(error => {
      logError(`Pre-commit hook crashed: ${error.message}`);
      console.log(''); // Dodaj pustą linię na końcu
      process.exit(1);
    });
}

module.exports = {
  runPreCommitChecks,
  CONFIG
};