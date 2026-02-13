#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🧪 Testing add-skill CLI tool...\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error.message}`);
    testsFailed++;
  }
}

// Test 1: Help command
test('Help command works', () => {
  const output = execSync('node bin/add-skill.js --help', { 
    cwd: projectRoot,
    encoding: 'utf8' 
  });
  if (!output.includes('Usage:')) {
    throw new Error('Help output missing');
  }
});

// Test 2: List command
test('List command shows available skills', () => {
  const output = execSync('node bin/add-skill.js google-labs-code/stitch-skills --list', { 
    cwd: projectRoot,
    encoding: 'utf8' 
  });
  if (!output.includes('react:components')) {
    throw new Error('react:components not in list');
  }
  if (!output.includes('design-md')) {
    throw new Error('design-md not in list');
  }
  if (!output.includes('shadcn-ui')) {
    throw new Error('shadcn-ui not in list');
  }
});

// Test 3: Install skill globally
test('Install react:components skill globally', () => {
  const skillsDir = join(projectRoot, '.github', 'agents', 'skills');
  
  // Clean up first
  if (existsSync(skillsDir)) {
    rmSync(skillsDir, { recursive: true });
  }
  
  const output = execSync('node bin/add-skill.js google-labs-code/stitch-skills --skill react:components --global', { 
    cwd: projectRoot,
    encoding: 'utf8' 
  });
  
  if (!output.includes('Installing skill: react:components')) {
    throw new Error('Installation output missing');
  }
  
  const skillFile = join(skillsDir, 'react-components.md');
  if (!existsSync(skillFile)) {
    throw new Error('Skill file not created');
  }
  
  const content = readFileSync(skillFile, 'utf8');
  if (!content.includes('React Components Skill')) {
    throw new Error('Skill file has incorrect content');
  }
});

// Test 4: Manifest file created
test('Manifest file is created correctly', () => {
  const manifestPath = join(projectRoot, '.github', 'agents', 'skills', 'skills-manifest.json');
  
  if (!existsSync(manifestPath)) {
    throw new Error('Manifest file not created');
  }
  
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  
  if (!manifest.skills || !Array.isArray(manifest.skills)) {
    throw new Error('Manifest has incorrect structure');
  }
  
  const reactSkill = manifest.skills.find(s => s.name === 'react:components');
  if (!reactSkill) {
    throw new Error('react:components not in manifest');
  }
  
  if (reactSkill.repository !== 'google-labs-code/stitch-skills') {
    throw new Error('Incorrect repository in manifest');
  }
});

// Test 5: Install another skill (updates manifest)
test('Installing second skill updates manifest', () => {
  execSync('node bin/add-skill.js google-labs-code/stitch-skills --skill design-md --global', { 
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  const manifestPath = join(projectRoot, '.github', 'agents', 'skills', 'skills-manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  
  if (manifest.skills.length !== 2) {
    throw new Error(`Expected 2 skills, got ${manifest.skills.length}`);
  }
  
  const designSkill = manifest.skills.find(s => s.name === 'design-md');
  if (!designSkill) {
    throw new Error('design-md not in manifest');
  }
});

// Print results
console.log('\n' + '='.repeat(50));
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);
console.log('='.repeat(50) + '\n');

if (testsFailed > 0) {
  process.exit(1);
}

console.log('✨ All tests passed!\n');
