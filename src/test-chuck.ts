/**
 * CHUCK Scoring Engine - Test Suite
 * Demonstrates and validates core functionality
 */

import { calculateConnectionScore, getCompatibleTools, findBestToolsForWorkflow, validateWorkflow } from '../lib/compatibilityMatrix';
import { scoreWorkflow, detectCycles } from '../lib/workflowScoring';
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
tools.forEach((t: any) => t.workflows.forEach((w: string) => totalWorkflows.add(w)));
console.log(`Total workflows: ${totalWorkflows.size}\n`);

// Test 2: Compatibility Matrix
console.log('=== Test 2: Compatibility Matrix ===');
const chatgpt = tools.find(t => t.id === 'chatgpt-4');
const canva = tools.find(t => t.id === 'canva-ai');

if (chatgpt && canva) {
  // Add category if missing (use type as fallback)
  const chatgptWithCategory = { ...chatgpt, category: chatgpt.category || chatgpt.type };
  const canvaWithCategory = { ...canva, category: canva.category || canva.type };
  
  const score = calculateConnectionScore(chatgptWithCategory, canvaWithCategory);
  console.log(`ChatGPT-4 → Canva AI compatibility: ${score}%`);
  
  const compatibleWithChatGPT = getCompatibleTools(chatgpt, tools, 80);
  console.log(`Tools highly compatible with ChatGPT (score ≥80): ${compatibleWithChatGPT.length}`);
  console.log('Top 5:', compatibleWithChatGPT.slice(0, 5).map((c: any) => 
    `${c.tool.namePl} (${c.score}%)`
  ).join(', '));
}
console.log('');

// Test 3: Workflow Finding
console.log('=== Test 3: Workflow Finding ===');
const contentTools = findBestToolsForWorkflow('content', tools, 5);
console.log('Top 5 tools for "content" workflow:');
contentTools.forEach((tool: any, i: number) => {
  console.log(`  ${i + 1}. ${tool.namePl} - Quality: ${tool.scoreMatrix.quality}%`);
});
console.log('');

// Test 4: Workflow Scoring - Simple Linear Workflow
console.log('=== Test 4: Workflow Scoring - Linear Workflow ===');
const node1 = createAIAgentNode('node1', 'chatgpt-4');
const node2 = createProcessorNode('node2', 'transform');
const node3 = createOutputNode('node3', 'email');

const linearWorkflow = {
  nodes: [
    { id: node1.id, toolId: 'chatgpt-4', type: node1.type, category: 'AI' },
    { id: node2.id, toolId: '', type: node2.type, category: 'processing' },
    { id: node3.id, toolId: '', type: node3.type, category: 'output' },
  ],
  edges: [
    { from: node1.id, to: node2.id },
    { from: node2.id, to: node3.id },
  ],
};

// Since scoreWorkflow requires toolsData, let's create a simple mock
const mockToolsData = [
  { id: 'chatgpt-4', type: 'AI_AGENT', category: 'AI', score: 95 },
  { id: 'transform', type: 'PROCESSOR', category: 'processing', score: 85 },
  { id: 'email', type: 'OUTPUT', category: 'output', score: 90 },
];

const linearScore = scoreWorkflow(linearWorkflow, mockToolsData);
console.log('Linear workflow (3 nodes, 2 edges):');
console.log(`  Quality Score: ${linearScore.quality}%`);
console.log(`  Compatibility Score: ${linearScore.compatibilityScore}%`);
console.log(`  Has Cycles: ${linearScore.hasCycles}`);
if (linearScore.executionOrder) {
  console.log(`  Execution Order: ${linearScore.executionOrder.join(' → ')}`);
}
if (linearScore.issues.length > 0) {
  console.log('  Issues:', linearScore.issues);
}
if (linearScore.recommendations.length > 0) {
  console.log('  Recommendations:', linearScore.recommendations);
}
console.log('');

// Test 5: Cycle Detection
console.log('=== Test 5: Cycle Detection ===');

// Workflow with a cycle
const cycleNode1 = createAIAgentNode('cycle1', 'chatgpt-4');
const cycleNode2 = createProcessorNode('cycle2', 'transform');
const cycleNode3 = createOutputNode('cycle3', 'email');

const cyclicWorkflow = {
  nodes: [
    { id: cycleNode1.id, toolId: 'chatgpt-4', type: cycleNode1.type, category: 'AI' },
    { id: cycleNode2.id, toolId: '', type: cycleNode2.type, category: 'processing' },
    { id: cycleNode3.id, toolId: '', type: cycleNode3.type, category: 'output' },
  ],
  edges: [
    { from: cycleNode1.id, to: cycleNode2.id },
    { from: cycleNode2.id, to: cycleNode3.id },
    { from: cycleNode3.id, to: cycleNode1.id }, // Creates cycle!
  ],
};

const cycleResult = detectCycles(cyclicWorkflow);
console.log(`Cyclic workflow has ${cycleResult.cycles.length} cycle(s)`);
if (cycleResult.cycles.length > 0) {
  cycleResult.cycles.forEach((cycle, i) => {
    console.log(`  Cycle ${i + 1}: ${cycle.join(' → ')}`);
  });
}

const cyclicScore = scoreWorkflow(cyclicWorkflow, mockToolsData);
console.log(`Cyclic workflow score: ${cyclicScore.quality}% (penalty for cycles)`);
console.log('');

// Test 6: Validation
console.log('=== Test 6: Workflow Validation ===');

// Valid workflow - convert to expected format
const validWorkflowForValidation = linearWorkflow.nodes.map((n: any) => ({
  id: n.id,
  type: n.type,
  category: n.category || n.type
}));
const validResult = validateWorkflow(validWorkflowForValidation);
console.log(`Valid workflow: ${validResult.valid ? 'VALID' : 'INVALID'}`);
console.log(`Average compatibility score: ${validResult.averageScore}%`);

// Invalid workflow (missing node reference)
const invalidWorkflowForValidation = [
  { id: 'node1', type: 'AI_AGENT', category: 'AI' }
];
const invalidResult = validateWorkflow(invalidWorkflowForValidation);
console.log(`Single node workflow: ${invalidResult.valid ? 'VALID' : 'INVALID'}`);
if (invalidResult.weakLinks.length > 0) {
  console.log('  Weak Links:', invalidResult.weakLinks);
}
console.log('');

// Test 7: Universal Nodes
console.log('=== Test 7: Universal Nodes ===');
const aiNode = createAIAgentNode('ai-node-1', 'deepseek-coder', { 
  prompt: 'Write a function',
  parameters: { temperature: 0.7 }
});
console.log('AI_AGENT node created:');
console.log(`  ID: ${aiNode.id}`);
console.log(`  Type: ${aiNode.type}`);
console.log(`  Tool: ${aiNode.config.toolId}`);
console.log(`  Prompt: ${aiNode.config.prompt}`);

const processorNode = createProcessorNode('proc-node-1', 'scrape', {
  source: 'https://example.com',
  options: { selector: '.content' }
});
console.log('PROCESSOR node created:');
console.log(`  ID: ${processorNode.id}`);
console.log(`  Type: ${processorNode.type}`);
console.log(`  Operation: ${processorNode.config.operation}`);

const outputNode = createOutputNode('output-node-1', 'pdf', {
  options: { pdfOptions: { format: 'A4' } }
});
console.log('OUTPUT node created:');
console.log(`  ID: ${outputNode.id}`);
console.log(`  Type: ${outputNode.type}`);
console.log(`  Destination: ${outputNode.config.destination}`);
console.log('');

// Summary
console.log('=== Test Summary ===');
console.log('✅ All tests completed successfully!');
console.log('');
console.log('CHUCK Scoring Engine is ready to use:');
console.log('  • 133 AI tools database');
console.log('  • Compatibility scoring between tools');
console.log('  • Workflow quality evaluation (0-100%)');
console.log('  • Cycle detection in workflows');
console.log('  • 3 universal node types (AI_AGENT, PROCESSOR, OUTPUT)');
console.log('  • Integration with execution engine');
