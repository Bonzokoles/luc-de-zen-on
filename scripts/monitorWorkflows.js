#!/usr/bin/env node
/**
 * Monitoring deployment script dla workflow automation
 * Sprawdza status wszystkich workflow i API endpoints
 */

import fetch from 'node-fetch';
import { API_KEYS } from '../src/utils/loadEnv.js';

const ENDPOINTS = {
  local: {
    activity: 'http://localhost:4321/api/activity-monitor',
    reminders: 'http://localhost:4321/api/reminders',
    faq: 'http://localhost:4321/api/faq-generator',
    bielik: 'http://localhost:4321/api/bielik-chat'
  },
  production: {
    activity: 'https://mybonzo.pl/api/activity-monitor',
    reminders: 'https://mybonzo.pl/api/reminders',
    faq: 'https://mybonzo.pl/api/faq-generator',
    bielik: 'https://mybonzo.pl/api/bielik-chat'
  },
  workers: {
    bielik: 'https://bielik-worker.stolarnia-ams.workers.dev'
  }
};

async function checkEndpoint(name, url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const status = response.ok ? '✅' : '❌';
    const time = Date.now();
    
    console.log(`${status} ${name}: ${response.status} (${url})`);
    
    return {
      name,
      url,
      status: response.status,
      ok: response.ok,
      timestamp: time
    };
  } catch (error) {
    console.log(`❌ ${name}: ERROR - ${error.message}`);
    return {
      name,
      url,
      status: 'ERROR',
      ok: false,
      error: error.message,
      timestamp: Date.now()
    };
  }
}

async function checkLocalAPIs() {
  console.log('\n🔍 Checking Local APIs...');
  
  const results = [];
  
  // Test activity monitor
  results.push(await checkEndpoint(
    'Activity Monitor', 
    ENDPOINTS.local.activity,
    'GET'
  ));
  
  // Test reminders with sample data
  results.push(await checkEndpoint(
    'Reminders API',
    ENDPOINTS.local.reminders,
    'POST',
    { 
      title: 'Test Reminder',
      description: 'Monitoring test',
      dueDate: new Date().toISOString(),
      priority: 'medium'
    }
  ));
  
  // Test FAQ generator
  results.push(await checkEndpoint(
    'FAQ Generator',
    ENDPOINTS.local.faq,
    'POST',
    { query: 'What is MyBonzo?' }
  ));
  
  // Test BIELIK chat
  results.push(await checkEndpoint(
    'BIELIK Chat',
    ENDPOINTS.local.bielik,
    'POST',
    { message: 'Cześć, jak się masz?' }
  ));
  
  return results;
}

async function checkWorkers() {
  console.log('\n🌐 Checking Cloudflare Workers...');
  
  const results = [];
  
  // Test BIELIK worker
  results.push(await checkEndpoint(
    'BIELIK Worker',
    `${ENDPOINTS.workers.bielik}/api/chat`,
    'POST',
    { 
      message: 'Test monitoring',
      context: 'monitoring'
    }
  ));
  
  return results;
}

async function checkWorkflowPlatforms() {
  console.log('\n⚙️ Checking Workflow Platforms...');
  
  const results = [];
  
  // Check Flowise API (if configured)
  if (API_KEYS.FLOWISE_API_TOKEN) {
    results.push(await checkEndpoint(
      'Flowise API',
      'https://api.flowise.com/api/v1/chatflows',
      'GET'
    ));
  }
  
  // Check ActivePieces API (if configured)
  if (API_KEYS.ACTIVEPIECES_API_KEY) {
    results.push(await checkEndpoint(
      'ActivePieces API',
      'https://api.activepieces.com/api/v1/flows',
      'GET'
    ));
  }
  
  return results;
}

async function generateReport(results) {
  const timestamp = new Date().toISOString();
  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  
  const report = {
    timestamp,
    summary: {
      total: results.length,
      passed,
      failed,
      success_rate: ((passed / results.length) * 100).toFixed(1) + '%'
    },
    results,
    recommendations: []
  };
  
  // Add recommendations based on failures
  if (failed > 0) {
    report.recommendations.push('Some endpoints are failing - check logs for details');
  }
  
  if (results.some(r => r.name.includes('Worker') && !r.ok)) {
    report.recommendations.push('Cloudflare Workers need attention - check deployment');
  }
  
  if (results.some(r => r.name.includes('API') && !r.ok)) {
    report.recommendations.push('Local APIs failing - check if dev server is running');
  }
  
  return report;
}

async function main() {
  console.log('🚀 MyBonzo - Workflow Monitoring Check');
  console.log('=====================================');
  
  try {
    const allResults = [];
    
    // Run all checks
    allResults.push(...await checkLocalAPIs());
    allResults.push(...await checkWorkers());
    allResults.push(...await checkWorkflowPlatforms());
    
    // Generate report
    const report = await generateReport(allResults);
    
    console.log('\n📊 MONITORING REPORT');
    console.log('===================');
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`📈 Success Rate: ${report.summary.success_rate}`);
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      report.recommendations.forEach(rec => console.log(`- ${rec}`));
    }
    
    // Save report to file
    const reportPath = `./monitoring/reports/check-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📋 Report saved to: ${reportPath}`);
    
    // Exit with appropriate code
    process.exit(report.summary.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('💥 Monitoring check failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { checkLocalAPIs, checkWorkers, checkWorkflowPlatforms, generateReport };
