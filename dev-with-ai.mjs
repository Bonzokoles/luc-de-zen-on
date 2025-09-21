#!/usr/bin/env node
/**
 * Development script for MyBonzo with Cloudflare AI binding
 * This script starts both Astro dev server and Wrangler in proxy mode
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, prefix, message) {
  console.log(`${color}${colors.bright}[${prefix}]${colors.reset}${color} ${message}${colors.reset}`);
}

function logAstro(message) {
  log(colors.cyan, 'ASTRO', message);
}

function logWrangler(message) {
  log(colors.yellow, 'WRANGLER', message);
}

function logSystem(message) {
  log(colors.green, 'SYSTEM', message);
}

function logError(message) {
  log(colors.red, 'ERROR', message);
}

async function startDev() {
  logSystem('🚀 Starting MyBonzo development environment with Cloudflare AI');
  
  // Check if .env.local exists and has Cloudflare keys
  try {
    const fs = await import('fs');
    const envContent = fs.readFileSync(join(__dirname, '.env.local'), 'utf8');
    
    if (!envContent.includes('CLOUDFLARE_API_TOKEN=your-cloudflare') || 
        !envContent.includes('CLOUDFLARE_ACCOUNT_ID=your-cloudflare')) {
      logError('⚠️  Cloudflare credentials not configured!');
      logSystem('Please edit .env.local and add your Cloudflare API token and Account ID');
      logSystem('1. Get API token: https://dash.cloudflare.com/profile/api-tokens');
      logSystem('2. Get Account ID: https://dash.cloudflare.com/ (sidebar)');
      logSystem('3. Update .env.local with real values');
      return;
    }
  } catch (error) {
    logError('Could not read .env.local file');
    return;
  }

  // Start Astro dev server with platform proxy
  logAstro('Starting Astro dev server...');
  logWrangler('Cloudflare AI binding will be available via platform proxy');
  const astroProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname,
    env: {
      ...process.env,
      ASTRO_PLATFORM_PROXY: 'true'
    }
  });

  astroProcess.on('error', (error) => {
    logError(`Astro process error: ${error.message}`);
  });

  astroProcess.on('exit', (code) => {
    if (code !== 0) {
      logError(`Astro process exited with code ${code}`);
    }
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    logSystem('🛑 Shutting down development environment...');
    astroProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    logSystem('🛑 Shutting down development environment...');
    astroProcess.kill('SIGTERM');
    process.exit(0);
  });
}

// Run the development environment
startDev().catch((error) => {
  logError(`Failed to start development environment: ${error.message}`);
  process.exit(1);
});