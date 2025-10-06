// Worker Management Functions - MyBonzo Worker Orchestration
// Version: 1.0.0

class WorkerManager {
  constructor() {
    this.workers = new Map();
    this.workerTypes = {
      ai: 'AI Processing Worker',
      audio: 'Audio Processing Worker', 
      image: 'Image Processing Worker',
      data: 'Data Processing Worker',
      background: 'Background Tasks Worker'
    };
    this.workerStatus = new Map();
    this.messageQueue = new Map();
    this.maxWorkers = navigator.hardwareConcurrency || 4;
    
    this.initializeWorkerPool();
  }

  // Initialize worker pool
  initializeWorkerPool() {
    console.log(`Initializing worker pool with max ${this.maxWorkers} workers`);
    
    // Create workers for each type
    Object.keys(this.workerTypes).forEach(type => {
      this.createWorker(type);
    });
  }

  // Create a new worker
  createWorker(type, scriptPath = null) {
    try {
      const workerScript = scriptPath || this.getWorkerScript(type);
      const worker = new Worker(workerScript);
      
      const workerId = `${type}_${Date.now()}`;
      
      // Setup worker event handlers
      worker.onmessage = (event) => this.handleWorkerMessage(workerId, event);
      worker.onerror = (error) => this.handleWorkerError(workerId, error);
      worker.onmessageerror = (error) => this.handleWorkerMessageError(workerId, error);
      
      // Store worker
      this.workers.set(workerId, {
        worker,
        type,
        status: 'idle',
        created: new Date().toISOString(),
        tasksCompleted: 0,
        lastActivity: new Date().toISOString()
      });
      
      this.workerStatus.set(workerId, 'idle');
      this.messageQueue.set(workerId, []);
      
      console.log(`Worker created: ${workerId} (${this.workerTypes[type]})`);
      return workerId;
      
    } catch (error) {
      console.error(`Failed to create ${type} worker:`, error);
      return null;
    }
  }

  // Get worker script path based on type
  getWorkerScript(type) {
    const workerScripts = {
      ai: '/workers/ai-worker.js',
      audio: '/workers/audio-worker.js',
      image: '/workers/image-worker.js',
      data: '/workers/data-worker.js',
      background: '/workers/background-worker.js'
    };
    
    return workerScripts[type] || this.createInlineWorker(type);
  }

  // Create inline worker for basic tasks
  createInlineWorker(type) {
    const workerCode = `
      class ${type.charAt(0).toUpperCase() + type.slice(1)}Worker {
        constructor() {
          this.tasks = new Map();
          this.processing = false;
        }
        
        processTask(taskId, data) {
          this.processing = true;
          
          try {
            let result;
            
            switch(data.operation) {
              case 'calculate':
                result = this.calculate(data.params);
                break;
              case 'transform':
                result = this.transform(data.params);
                break;
              case 'analyze':
                result = this.analyze(data.params);
                break;
              default:
                result = { error: 'Unknown operation: ' + data.operation };
            }
            
            self.postMessage({
              taskId,
              type: 'result',
              data: result,
              status: 'completed'
            });
            
          } catch (error) {
            self.postMessage({
              taskId,
              type: 'error',
              error: error.message,
              status: 'failed'
            });
          } finally {
            this.processing = false;
          }
        }
        
        calculate(params) {
          // Basic calculation operations
          const { operation, values } = params;
          
          switch(operation) {
            case 'sum':
              return values.reduce((a, b) => a + b, 0);
            case 'average':
              return values.reduce((a, b) => a + b, 0) / values.length;
            case 'max':
              return Math.max(...values);
            case 'min':
              return Math.min(...values);
            default:
              return { error: 'Unknown calculation: ' + operation };
          }
        }
        
        transform(params) {
          // Data transformation operations
          const { type, data } = params;
          
          switch(type) {
            case 'sort':
              return [...data].sort();
            case 'filter':
              return data.filter(params.filterFn);
            case 'map':
              return data.map(params.mapFn);
            default:
              return data;
          }
        }
        
        analyze(params) {
          // Basic analysis operations
          const { data, type } = params;
          
          switch(type) {
            case 'count':
              return { count: data.length };
            case 'stats':
              return {
                count: data.length,
                type: typeof data[0],
                sample: data.slice(0, 3)
              };
            default:
              return { analyzed: Date.now() };
          }
        }
      }
      
      const worker = new ${type.charAt(0).toUpperCase() + type.slice(1)}Worker();
      
      self.addEventListener('message', (event) => {
        const { taskId, type, data } = event.data;
        
        if (type === 'task') {
          worker.processTask(taskId, data);
        } else if (type === 'status') {
          self.postMessage({
            taskId,
            type: 'status',
            data: {
              processing: worker.processing,
              timestamp: Date.now()
            }
          });
        }
      });
      
      // Send ready signal
      self.postMessage({ type: 'ready', workerId: '${type}' });
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
  }

  // Handle worker messages
  handleWorkerMessage(workerId, event) {
    const { taskId, type, data, status, error } = event.data;
    
    if (type === 'ready') {
      this.workerStatus.set(workerId, 'ready');
      console.log(`Worker ${workerId} is ready`);
      return;
    }
    
    const workerInfo = this.workers.get(workerId);
    if (workerInfo) {
      workerInfo.lastActivity = new Date().toISOString();
      
      if (status === 'completed') {
        workerInfo.tasksCompleted++;
        workerInfo.status = 'idle';
      }
    }
    
    // Handle specific message types
    switch (type) {
      case 'result':
        this.handleTaskResult(taskId, data, workerId);
        break;
      case 'error':
        this.handleTaskError(taskId, error, workerId);
        break;
      case 'progress':
        this.handleTaskProgress(taskId, data, workerId);
        break;
      case 'status':
        this.updateWorkerStatus(workerId, data);
        break;
      default:
        console.log(`Unhandled message type: ${type} from worker ${workerId}`);
    }
  }

  // Handle worker errors
  handleWorkerError(workerId, error) {
    console.error(`Worker error in ${workerId}:`, error);
    
    const workerInfo = this.workers.get(workerId);
    if (workerInfo) {
      workerInfo.status = 'error';
      workerInfo.lastError = {
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
    
    // Restart worker if needed
    this.restartWorker(workerId);
  }

  // Handle worker message errors
  handleWorkerMessageError(workerId, error) {
    console.error(`Worker message error in ${workerId}:`, error);
  }

  // Execute task on appropriate worker
  executeTask(taskType, taskData, priority = 'normal') {
    return new Promise((resolve, reject) => {
      const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Find available worker
      const availableWorker = this.findAvailableWorker(taskType);
      
      if (!availableWorker) {
        reject(new Error(`No available worker for task type: ${taskType}`));
        return;
      }
      
      const workerInfo = this.workers.get(availableWorker);
      workerInfo.status = 'busy';
      
      // Store task callback
      this.taskCallbacks = this.taskCallbacks || new Map();
      this.taskCallbacks.set(taskId, { resolve, reject, workerId: availableWorker });
      
      // Send task to worker
      workerInfo.worker.postMessage({
        taskId,
        type: 'task',
        data: taskData,
        priority
      });
      
      console.log(`Task ${taskId} assigned to worker ${availableWorker}`);
    });
  }

  // Find available worker for task
  findAvailableWorker(taskType) {
    // First, try to find a worker of the specific type
    const preferredWorkers = Array.from(this.workers.entries())
      .filter(([id, info]) => info.type === taskType && info.status === 'idle');
    
    if (preferredWorkers.length > 0) {
      return preferredWorkers[0][0];
    }
    
    // If no specific type available, find any idle worker
    const anyAvailableWorker = Array.from(this.workers.entries())
      .find(([id, info]) => info.status === 'idle');
    
    return anyAvailableWorker ? anyAvailableWorker[0] : null;
  }

  // Handle task results
  handleTaskResult(taskId, data, workerId) {
    const callbacks = this.taskCallbacks?.get(taskId);
    if (callbacks) {
      callbacks.resolve({ data, workerId });
      this.taskCallbacks.delete(taskId);
    }
  }

  // Handle task errors
  handleTaskError(taskId, error, workerId) {
    const callbacks = this.taskCallbacks?.get(taskId);
    if (callbacks) {
      callbacks.reject(new Error(`Worker ${workerId}: ${error}`));
      this.taskCallbacks.delete(taskId);
    }
  }

  // Handle task progress
  handleTaskProgress(taskId, progressData, workerId) {
    console.log(`Task ${taskId} progress:`, progressData);
    
    // Emit progress event if needed
    if (this.onTaskProgress) {
      this.onTaskProgress(taskId, progressData, workerId);
    }
  }

  // Update worker status
  updateWorkerStatus(workerId, statusData) {
    const workerInfo = this.workers.get(workerId);
    if (workerInfo) {
      workerInfo.status = statusData.processing ? 'busy' : 'idle';
      this.workerStatus.set(workerId, workerInfo.status);
    }
  }

  // Restart worker
  restartWorker(workerId) {
    const workerInfo = this.workers.get(workerId);
    if (!workerInfo) return;
    
    console.log(`Restarting worker ${workerId}`);
    
    // Terminate old worker
    workerInfo.worker.terminate();
    
    // Create new worker
    const newWorkerId = this.createWorker(workerInfo.type);
    
    // Remove old worker
    this.workers.delete(workerId);
    this.workerStatus.delete(workerId);
    this.messageQueue.delete(workerId);
    
    return newWorkerId;
  }

  // Get worker statistics
  getWorkerStats() {
    const stats = {
      totalWorkers: this.workers.size,
      workerTypes: {},
      statusCounts: {
        idle: 0,
        busy: 0,
        error: 0,
        ready: 0
      },
      totalTasksCompleted: 0
    };
    
    this.workers.forEach((info, id) => {
      // Count by type
      if (!stats.workerTypes[info.type]) {
        stats.workerTypes[info.type] = 0;
      }
      stats.workerTypes[info.type]++;
      
      // Count by status
      if (stats.statusCounts[info.status] !== undefined) {
        stats.statusCounts[info.status]++;
      }
      
      // Total tasks
      stats.totalTasksCompleted += info.tasksCompleted;
    });
    
    return stats;
  }

  // Terminate all workers
  terminateAll() {
    console.log('Terminating all workers...');
    
    this.workers.forEach((info, id) => {
      info.worker.terminate();
    });
    
    this.workers.clear();
    this.workerStatus.clear();
    this.messageQueue.clear();
    
    if (this.taskCallbacks) {
      this.taskCallbacks.clear();
    }
  }

  // Get worker details
  getWorkerDetails(workerId) {
    return this.workers.get(workerId);
  }

  // Get all workers status
  getAllWorkersStatus() {
    const status = {};
    
    this.workers.forEach((info, id) => {
      status[id] = {
        type: info.type,
        status: info.status,
        created: info.created,
        tasksCompleted: info.tasksCompleted,
        lastActivity: info.lastActivity,
        lastError: info.lastError
      };
    });
    
    return status;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WorkerManager;
} else if (typeof window !== 'undefined') {
  window.WorkerManager = WorkerManager;
}