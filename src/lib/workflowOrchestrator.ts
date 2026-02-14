/**
 * Jimbo Unified System - Workflow Orchestrator
 * Handles workflow execution, monitoring, and coordination
 */

import type { 
  UniversalWorkflow, 
  UniversalNode, 
  NodeConnection 
} from '../nodes/universal';
import type {
  UnifiedSystemConfig,
  ExecutionPlan,
  ExecutionStep,
  ExecutionResult,
  StepResult,
  ExecutionError
} from './unifiedSystemConfig';
import { DEFAULT_CONFIG } from './unifiedSystemConfig';

/**
 * Workflow Orchestrator Class
 */
export class WorkflowOrchestrator {
  private config: UnifiedSystemConfig;
  private executionHistory: Map<string, ExecutionResult>;

  constructor(config?: Partial<UnifiedSystemConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.executionHistory = new Map();
  }

  /**
   * Create execution plan from workflow
   */
  async createExecutionPlan(workflow: UniversalWorkflow): Promise<ExecutionPlan> {
    // Get topological order
    const executionOrder = await this.getTopologicalOrder(workflow);
    
    // Build dependency map
    const dependencies = this.buildDependencyMap(workflow);
    
    // Create execution steps
    const steps: ExecutionStep[] = executionOrder.map((nodeId, index) => {
      const node = workflow.nodes.find(n => n.id === nodeId);
      if (!node) throw new Error(`Node ${nodeId} not found`);

      return {
        stepId: `step-${index + 1}`,
        nodeId: node.id,
        type: node.type,
        order: index + 1,
        dependencies: dependencies[nodeId] || [],
        config: node.config
      };
    });

    return {
      workflowId: workflow.id,
      steps,
      estimatedDuration: this.estimateDuration(steps),
      dependencies
    };
  }

  /**
   * Execute workflow
   */
  async executeWorkflow(workflow: UniversalWorkflow): Promise<ExecutionResult> {
    const startTime = new Date().toISOString();
    const startMs = Date.now();
    
    const result: ExecutionResult = {
      workflowId: workflow.id,
      status: 'success',
      startTime,
      endTime: '',
      duration: 0,
      steps: [],
      errors: []
    };

    try {
      // Create execution plan
      const plan = await this.createExecutionPlan(workflow);
      
      // Execute steps in order
      for (const step of plan.steps) {
        const stepResult = await this.executeStep(step, workflow);
        result.steps.push(stepResult);

        if (stepResult.status === 'failed') {
          result.status = 'partial';
          result.errors?.push({
            stepId: step.stepId,
            nodeId: step.nodeId,
            error: stepResult.error || 'Unknown error',
            timestamp: new Date().toISOString()
          });

          // Continue or stop based on config
          // For now, continue execution
        }
      }

      // Check if all steps succeeded
      const allSuccess = result.steps.every(s => s.status === 'success');
      if (!allSuccess && result.status === 'success') {
        result.status = 'partial';
      }

    } catch (error) {
      result.status = 'failed';
      result.errors?.push({
        stepId: 'orchestrator',
        nodeId: 'N/A',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }

    const endMs = Date.now();
    result.endTime = new Date().toISOString();
    result.duration = endMs - startMs;

    // Store in history
    this.executionHistory.set(workflow.id, result);

    return result;
  }

  /**
   * Execute single step
   */
  private async executeStep(
    step: ExecutionStep,
    workflow: UniversalWorkflow
  ): Promise<StepResult> {
    const startMs = Date.now();
    const stepResult: StepResult = {
      stepId: step.stepId,
      nodeId: step.nodeId,
      status: 'success',
      duration: 0
    };

    try {
      const node = workflow.nodes.find(n => n.id === step.nodeId);
      if (!node) throw new Error('Node not found');

      // Execute based on node type
      switch (node.type) {
        case 'AI_AGENT':
          stepResult.output = await this.executeAIAgent(node as any);
          break;
        case 'PROCESSOR':
          stepResult.output = await this.executeProcessor(node as any);
          break;
        case 'OUTPUT':
          stepResult.output = await this.executeOutput(node as any);
          break;
        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }

    } catch (error) {
      stepResult.status = 'failed';
      stepResult.error = error instanceof Error ? error.message : 'Unknown error';
    }

    stepResult.duration = Date.now() - startMs;
    return stepResult;
  }

  /**
   * Execute AI_AGENT node
   */
  private async executeAIAgent(node: any): Promise<any> {
    const endpoint = this.config.apiEndpoints.exec;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolId: node.config.toolId,
        prompt: node.config.prompt || '',
        parameters: node.config.parameters || {}
      })
    });

    if (!response.ok) {
      throw new Error(`AI Agent execution failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Execute PROCESSOR node
   */
  private async executeProcessor(node: any): Promise<any> {
    // Mock implementation for now
    return {
      type: 'processor',
      operation: node.config.operation,
      status: 'completed',
      message: `Processor operation '${node.config.operation}' executed`
    };
  }

  /**
   * Execute OUTPUT node
   */
  private async executeOutput(node: any): Promise<any> {
    // Mock implementation for now
    return {
      type: 'output',
      destination: node.config.destination,
      status: 'sent',
      message: `Output sent to '${node.config.destination}'`
    };
  }

  /**
   * Get topological order using DFS
   */
  private async getTopologicalOrder(workflow: UniversalWorkflow): Promise<string[]> {
    const adjacency = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Initialize
    workflow.nodes.forEach(node => {
      adjacency.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    // Build graph
    workflow.connections.forEach(conn => {
      adjacency.get(conn.from)?.push(conn.to);
      inDegree.set(conn.to, (inDegree.get(conn.to) || 0) + 1);
    });

    // Kahn's algorithm
    const queue: string[] = [];
    const result: string[] = [];

    // Add nodes with no incoming edges
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) queue.push(nodeId);
    });

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      result.push(nodeId);

      adjacency.get(nodeId)?.forEach(neighbor => {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      });
    }

    if (result.length !== workflow.nodes.length) {
      throw new Error('Workflow contains cycles');
    }

    return result;
  }

  /**
   * Build dependency map
   */
  private buildDependencyMap(workflow: UniversalWorkflow): Record<string, string[]> {
    const deps: Record<string, string[]> = {};

    workflow.nodes.forEach(node => {
      deps[node.id] = [];
    });

    workflow.connections.forEach(conn => {
      if (!deps[conn.to]) deps[conn.to] = [];
      deps[conn.to].push(conn.from);
    });

    return deps;
  }

  /**
   * Estimate execution duration
   */
  private estimateDuration(steps: ExecutionStep[]): number {
    // 5 seconds per step + 2 seconds overhead
    return steps.length * 5000 + 2000;
  }

  /**
   * Get execution history
   */
  getExecutionHistory(workflowId?: string): ExecutionResult[] {
    if (workflowId) {
      const result = this.executionHistory.get(workflowId);
      return result ? [result] : [];
    }
    return Array.from(this.executionHistory.values());
  }

  /**
   * Clear execution history
   */
  clearHistory(workflowId?: string): void {
    if (workflowId) {
      this.executionHistory.delete(workflowId);
    } else {
      this.executionHistory.clear();
    }
  }

  /**
   * Get execution statistics
   */
  getExecutionStats(): {
    totalExecutions: number;
    successRate: number;
    averageDuration: number;
  } {
    const results = Array.from(this.executionHistory.values());
    
    if (results.length === 0) {
      return { totalExecutions: 0, successRate: 0, averageDuration: 0 };
    }

    const successful = results.filter(r => r.status === 'success').length;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    return {
      totalExecutions: results.length,
      successRate: (successful / results.length) * 100,
      averageDuration: totalDuration / results.length
    };
  }
}

/**
 * Create singleton instance
 */
let orchestratorInstance: WorkflowOrchestrator | null = null;

export function getOrchestrator(config?: Partial<UnifiedSystemConfig>): WorkflowOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new WorkflowOrchestrator(config);
  }
  return orchestratorInstance;
}

export default WorkflowOrchestrator;
