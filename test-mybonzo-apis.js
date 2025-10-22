#!/usr/bin/env node
/**
 * Tester API MyBonzo - sprawdza działanie wszystkich głównych API endpoints
 */

const API_BASE = 'http://localhost:5030/api';

const tests = [
  {
    name: 'Chat API (Universal)',
    endpoint: '/chat',
    method: 'POST',
    data: { message: 'Test message', model: 'gemma' }
  },
  {
    name: 'Image Generator API',
    endpoint: '/generate-image',
    method: 'POST',
    data: { prompt: 'test cat', model: 'flux' }
  },
  {
    name: 'Kaggle API',
    endpoint: '/kaggle',
    method: 'GET'
  },
  {
    name: 'BigQuery API',
    endpoint: '/bigquery',
    method: 'POST',
    data: { query: 'SELECT 1 as test' }
  },
  {
    name: 'Tavily Search API',
    endpoint: '/tavily',
    method: 'POST',
    data: { query: 'test search' }
  },
  {
    name: 'Business Analytics API',
    endpoint: '/business-analytics',
    method: 'GET'
  },
  {
    name: 'MCP Agent 1',
    endpoint: '/mcp-1',
    method: 'POST',
    data: { action: 'test' }
  },
  {
    name: 'Bielik Polish API',
    endpoint: '/bielik-polish',
    method: 'POST',
    data: { message: 'Witaj świecie' }
  }
];

async function testAPI(test) {
  try {
    const url = `${API_BASE}${test.endpoint}`;
    console.log(`🧪 Testing: ${test.name} (${test.method} ${test.endpoint})`);
    
    const options = {
      method: test.method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (test.data && test.method !== 'GET') {
      options.body = JSON.stringify(test.data);
    }
    
    const response = await fetch(url, options);
    const status = response.status;
    
    if (status === 200) {
      console.log(`✅ ${test.name} - OK (${status})`);
      return true;
    } else if (status === 401 || status === 403) {
      console.log(`🔑 ${test.name} - Auth required (${status})`);
      return 'auth';
    } else if (status === 404) {
      console.log(`❌ ${test.name} - Not found (${status})`);
      return false;
    } else {
      console.log(`⚠️  ${test.name} - Error (${status})`);
      return 'error';
    }
  } catch (error) {
    console.log(`💥 ${test.name} - Connection failed: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 MyBonzo API Tester\n');
  console.log('📍 Testing server: http://localhost:5030\n');
  
  const results = { ok: 0, auth: 0, error: 0, failed: 0 };
  
  for (const test of tests) {
    const result = await testAPI(test);
    
    if (result === true) results.ok++;
    else if (result === 'auth') results.auth++;
    else if (result === 'error') results.error++;
    else results.failed++;
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Delay between tests
  }
  
  console.log('\n📊 PODSUMOWANIE:');
  console.log(`✅ Working: ${results.ok}`);
  console.log(`🔑 Auth needed: ${results.auth}`);
  console.log(`⚠️  Errors: ${results.error}`);
  console.log(`💥 Failed: ${results.failed}`);
  console.log(`📋 Total: ${tests.length}`);
  
  if (results.ok > 0) {
    console.log('\n🎉 Aplikacja MyBonzo uruchomiona i dostępna!');
  } else {
    console.log('\n❌ Sprawdź czy serwer działa: npm run dev');
  }
}

runAllTests();