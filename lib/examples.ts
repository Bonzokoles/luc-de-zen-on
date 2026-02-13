/**
 * Example: Create and Execute a Simple Workflow
 * 
 * This example demonstrates how to:
 * 1. Create a workflow using universal nodes
 * 2. Analyze the workflow for quality and compatibility
 * 3. Execute the workflow
 */

import { createAIAgentNode, createProcessorNode, createOutputNode } from '../src/nodes/universal';
import { executeWorkflow } from '../src/executionEngine';
import { analyzeWorkflow } from '../mcp-server';
import type { UniversalWorkflow } from '../src/nodes/universal';

/**
 * Example 1: Simple SEO Workflow
 */
export async function simpleWorkflowExample() {
  // Create workflow
  const workflow: UniversalWorkflow = {
    id: 'seo-example-001',
    name: 'Simple SEO Workflow',
    description: 'Research keywords and generate content',
    nodes: [
      // Step 1: Research keywords
      createAIAgentNode('research', 'perplexity', {
        prompt: 'Research trending keywords for: AI tools 2026'
      }),
      
      // Step 2: Generate content
      createAIAgentNode('write', 'jasper', {
        prompt: 'Write blog post based on keyword research'
      }),
      
      // Step 3: Save as file
      createOutputNode('save', 'file', {
        target: '/tmp/blog-post.md'
      })
    ],
    connections: [
      { from: 'research', to: 'write' },
      { from: 'write', to: 'save' }
    ],
    metadata: {
      created: new Date().toISOString(),
      author: 'example-user'
    }
  };

  // Analyze workflow first
  console.log('📊 Analyzing workflow...');
  const analysis = await analyzeWorkflow({
    workflow,
    options: {
      includeRecommendations: true,
      includeCompatibility: true,
      includeExecutionPlan: true
    }
  });

  console.log('Analysis results:');
  console.log(`- Overall score: ${analysis.score.overall}/100`);
  console.log(`- DAG valid: ${analysis.dag.isValid}`);
  console.log(`- Execution order: ${analysis.dag.executionOrder?.join(' → ')}`);

  if (analysis.recommendations) {
    console.log('Recommendations:', analysis.recommendations);
  }

  // Execute workflow if analysis is good
  if (analysis.score.overall >= 70) {
    console.log('\n🚀 Executing workflow...');
    const result = await executeWorkflow(workflow);
    
    if (result.success) {
      console.log('✅ Workflow completed successfully!');
      console.log('Results:', result.results);
    } else {
      console.error('❌ Workflow failed:', result.errors);
    }
  } else {
    console.warn('⚠️ Workflow score too low, skipping execution');
  }
}

/**
 * Example 2: Data Processing Pipeline
 */
export async function dataProcessingExample() {
  const workflow: UniversalWorkflow = {
    id: 'data-pipeline-001',
    name: 'Data Processing Pipeline',
    nodes: [
      // Scrape data
      createProcessorNode('scrape', 'scrape', {
        source: 'https://example.com/data.json',
        format: 'json'
      }),
      
      // Transform data
      createProcessorNode('transform', 'transform', {
        format: 'csv'
      }),
      
      // Export to multiple destinations
      createOutputNode('email', 'email', {
        target: 'team@example.com',
        template: 'Data processing complete: {{timestamp}}'
      }),
      
      createOutputNode('webhook', 'webhook', {
        target: 'https://api.example.com/webhook'
      })
    ],
    connections: [
      { from: 'scrape', to: 'transform' },
      { from: 'transform', to: 'email' },
      { from: 'transform', to: 'webhook' }
    ]
  };

  console.log('🔄 Executing data pipeline...');
  const result = await executeWorkflow(workflow, {
    continueOnError: true, // Don't stop if email fails
    maxRetries: 2
  });

  console.log('Pipeline result:', result);
}

/**
 * Example 3: Multi-Tool AI Chain
 */
export async function multiToolChainExample() {
  const workflow: UniversalWorkflow = {
    id: 'multi-tool-001',
    name: 'Multi-Tool AI Chain',
    nodes: [
      // Research with Perplexity
      createAIAgentNode('research', 'perplexity', {
        prompt: 'What are the latest AI coding tools?'
      }),
      
      // Analyze with Claude
      createAIAgentNode('analyze', 'anthropic-claude', {
        prompt: 'Analyze and categorize the AI tools from research'
      }),
      
      // Create presentation with Gamma
      createAIAgentNode('present', 'gamma-app', {
        prompt: 'Create presentation from analysis'
      }),
      
      // Generate cover image with Midjourney
      createAIAgentNode('image', 'midjourney', {
        prompt: 'Create cover image for AI tools presentation'
      }),
      
      // Send to Slack
      createOutputNode('notify', 'slack', {
        target: process.env.SLACK_WEBHOOK || 'https://hooks.slack.com/...',
        template: 'New AI tools presentation ready! 🎉'
      })
    ],
    connections: [
      { from: 'research', to: 'analyze' },
      { from: 'analyze', to: 'present' },
      { from: 'analyze', to: 'image' },
      { from: 'present', to: 'notify' },
      { from: 'image', to: 'notify' }
    ]
  };

  // This demonstrates parallel execution
  // Both 'present' and 'image' can run simultaneously
  // Both feed into 'notify'
  
  const result = await executeWorkflow(workflow, {
    timeout: 600000 // 10 minutes for AI generation
  });

  console.log('Multi-tool chain result:', result);
}

/**
 * Run examples
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  void (async () => {
    console.log('=== CHUCK + Jimbo Examples ===\n');
    
    // Run example 1
    console.log('Example 1: Simple SEO Workflow');
    console.log('================================');
    await simpleWorkflowExample();
    
    console.log('\n\nExample 2: Data Processing Pipeline');
    console.log('=====================================');
    await dataProcessingExample();
    
    console.log('\n\nExample 3: Multi-Tool AI Chain');
    console.log('================================');
    await multiToolChainExample();
  })();
}
