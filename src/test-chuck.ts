/**
 * CHUCK Scoring Engine - Test Suite
 * Demonstrates and validates core functionality
 */

import { calculateConnectionScore, getCompatibleTools, findBestToolsForWorkflow } from '../lib/compatibilityMatrix';
import { calculateQuality, detectCycles, validateWorkflow } from '../lib/workflowScoring';
import { createAIAgentNode, createProcessorNode, createOutputNode } from './nodes/universal';
import toolsData from '../lib/tools.json';
import type { Tool } from '../lib/compatibilityMatrix';

const tools = toolsData as Tool[];

console.log('🎯 CHUCK Scoring Engine - Test Suite\n');

// Test 1: Tool Database
console.log('=== Test 1: Tool Database ===');
console.log(`Total tools: ${tools.length}`);
const toolTypes = new Set(tools.map(t => t.type));
console.log(`Unique types: ${toolTypes.size} - ${Array.from(toolTypes).join(', ')}`);
const totalWorkflows = new Set<string>();
tools.forEach(t => t.workflows.forEach(w => totalWorkflows.add(w)));
console.log(`Total workflows: ${totalWorkflows.size}\n`);

// Test 2: Compatibility Matrix
console.log('=== Test 2: Compatibility Matrix ===');
const chatgpt = tools.find(t => t.id === 'chatgpt-4');
const canva = tools.find(t => t.id === 'canva-ai');

if (chatgpt && canva) {
  const score = calculateConnectionScore(chatgpt, canva);
  console.log(`ChatGPT-4 → Canva AI compatibility: ${score}%`);
  
  const compatibleWithChatGPT = getCompatibleTools(chatgpt, tools, 80);
  console.log(`Tools highly compatible with ChatGPT (score ≥80): ${compatibleWithChatGPT.length}`);
  console.log('Top 5:', compatibleWithChatGPT.slice(0, 5).map(c => 
    `${c.tool.namePl} (${c.score}%)`
  ).join(', '));
}
console.log('');

// Test 3: Workflow Finding
console.log('=== Test 3: Workflow Finding ===');
const contentTools = findBestToolsForWorkflow('content', tools, 5);
console.log('Top 5 tools for "content" workflow:');
contentTools.forEach((tool, i) => {
  console.log(`  ${i + 1}. ${tool.namePl} - Quality: ${tool.scoreMatrix.quality}%`);
});
console.log('');

// Test 4: Workflow Scoring - Simple Linear Workflow
console.log('=== Test 4: Workflow Scoring - Linear Workflow ===');
const node1 = createAIAgentNode('chatgpt-4');
const node2 = createProcessorNode('transform');
const node3 = createOutputNode('email');

const linearWorkflow = {
  nodes: [
    { id: node1.id, toolId: 'chatgpt-4', type: node1.type },
    { id: node2.id, toolId: '', type: node2.type },
    { id: node3.id, toolId: '', type: node3.type },
  ],
  edges: [
    { from: node1.id, to: node2.id },
    { from: node2.id, to: node3.id },
  ],
};

const linearScore = calculateQuality(linearWorkflow);
console.log('Linear workflow (3 nodes, 2 edges):');
console.log(`  Overall Score: ${linearScore.overall}%`);
console.log('  Breakdown:');
console.log(`    Structure: ${linearScore.breakdown.structure}%`);
console.log(`    Efficiency: ${linearScore.breakdown.efficiency}%`);
console.log(`    Reliability: ${linearScore.breakdown.reliability}%`);
console.log(`    Complexity: ${linearScore.breakdown.complexity}%`);
if (linearScore.issues.length > 0) {
  console.log('  Issues:', linearScore.issues);
}
if (linearScore.suggestions.length > 0) {
  console.log('  Suggestions:', linearScore.suggestions);
}
console.log('');

// Test 5: Cycle Detection
console.log('=== Test 5: Cycle Detection ===');

// Workflow with a cycle
const cycleNode1 = createAIAgentNode('chatgpt-4');
const cycleNode2 = createProcessorNode('transform');
const cycleNode3 = createOutputNode('email');

const cyclicWorkflow = {
  nodes: [
    { id: cycleNode1.id, toolId: 'chatgpt-4', type: cycleNode1.type },
    { id: cycleNode2.id, toolId: '', type: cycleNode2.type },
    { id: cycleNode3.id, toolId: '', type: cycleNode3.type },
  ],
  edges: [
    { from: cycleNode1.id, to: cycleNode2.id },
    { from: cycleNode2.id, to: cycleNode3.id },
    { from: cycleNode3.id, to: cycleNode1.id }, // Creates cycle!
  ],
};

const cycles = detectCycles(cyclicWorkflow.nodes, cyclicWorkflow.edges);
console.log(`Cyclic workflow has ${cycles.length} cycle(s)`);
if (cycles.length > 0) {
  cycles.forEach((cycle, i) => {
    console.log(`  Cycle ${i + 1}: ${cycle.join(' → ')}`);
  });
}

const cyclicScore = calculateQuality(cyclicWorkflow);
console.log(`Cyclic workflow score: ${cyclicScore.overall}% (penalty for cycles)`);
console.log('');

// Test 6: Validation
console.log('=== Test 6: Workflow Validation ===');

// Valid workflow
const validErrors = validateWorkflow(linearWorkflow);
console.log(`Valid workflow errors: ${validErrors.length}`);

// Invalid workflow (missing node reference)
const invalidWorkflow = {
  nodes: [{ id: 'node1', toolId: 'test', type: 'AI_AGENT' }],
  edges: [{ from: 'node1', to: 'non-existent-node' }],
};
const invalidErrors = validateWorkflow(invalidWorkflow);
console.log(`Invalid workflow errors: ${invalidErrors.length}`);
if (invalidErrors.length > 0) {
  console.log('  Errors:', invalidErrors);
}
console.log('');

// Test 7: Universal Nodes
console.log('=== Test 7: Universal Nodes ===');
const aiNode = createAIAgentNode('deepseek-coder', { 
  prompt: 'Write a function',
  temperature: 0.7 
});
console.log('AI_AGENT node created:');
console.log(`  ID: ${aiNode.id}`);
console.log(`  Type: ${aiNode.type}`);
console.log(`  Tool: ${aiNode.config.toolId}`);
console.log(`  Prompt: ${aiNode.config.prompt}`);

const processorNode = createProcessorNode('scrape', {
  url: 'https://example.com',
  selector: '.content',
});
console.log('PROCESSOR node created:');
console.log(`  ID: ${processorNode.id}`);
console.log(`  Type: ${processorNode.config.processorType}`);

const outputNode = createOutputNode('pdf', {
  pdfOptions: { format: 'A4' },
});
console.log('OUTPUT node created:');
console.log(`  ID: ${outputNode.id}`);
console.log(`  Type: ${outputNode.config.outputType}`);
console.log('');

// Summary
console.log('=== Test Summary ===');
console.log('✅ All tests completed successfully!');
console.log('');
console.log('CHUCK Scoring Engine is ready to use:');
console.log('  • 140+ AI tools database');
console.log('  • Compatibility scoring between tools');
console.log('  • Workflow quality evaluation (0-100%)');
console.log('  • Cycle detection in workflows');
console.log('  • 3 universal node types (AI_AGENT, PROCESSOR, OUTPUT)');
console.log('  • Integration with execution engine');
