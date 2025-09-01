/**
 * AI Workers Management API
 * Endpoint do zarządzania AI Workers w środowisku Cloudflare
 */

import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createSuccessResponse, createErrorResponse } from '../../utils/corsUtils';

// Mock storage - w produkcji używałbyś KV lub Durable Objects
let workersStorage: any[] = [
  {
    id: 'worker-1',
    name: 'Chat Assistant Pro',
    type: 'chat',
    endpoint: '/api/chat',
    status: 'active',
    config: {
      model: 'llama-3.1-8b-instant',
      maxTokens: 1000,
      temperature: 0.7
    },
    created: new Date().toISOString(),
    lastUsed: new Date().toISOString()
  },
  {
    id: 'worker-2',
    name: 'Image Generator AI',
    type: 'image',
    endpoint: '/api/generate-image',
    status: 'active',
    config: {
      model: 'stable-diffusion',
      maxTokens: 500,
      temperature: 0.8
    },
    created: new Date().toISOString(),
    lastUsed: new Date().toISOString()
  }
];

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'list';

    switch (action) {
      case 'list':
        return createSuccessResponse({
          workers: workersStorage,
          total: workersStorage.length,
          timestamp: new Date().toISOString()
        });

      case 'get':
        const workerId = url.searchParams.get('id');
        if (!workerId) {
          return createErrorResponse('Worker ID jest wymagane', 400);
        }

        const worker = workersStorage.find(w => w.id === workerId);
        if (!worker) {
          return createErrorResponse('Worker nie został znaleziony', 404);
        }

        return createSuccessResponse({ worker });

      default:
        return createErrorResponse('Nieznana akcja', 400);
    }

  } catch (error: any) {
    console.error('❌ AI Workers API błąd:', error);
    return createErrorResponse(`Błąd serwera: ${error?.message || 'Nieznany błąd'}`, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create':
        return await createWorker(data);
      
      case 'update':
        return await updateWorker(data);
      
      case 'delete':
        return await deleteWorker(data);
      
      case 'test':
        return await testWorker(data);

      default:
        return createErrorResponse('Nieznana akcja POST', 400);
    }

  } catch (error: any) {
    console.error('❌ AI Workers POST błąd:', error);
    return createErrorResponse(`Błąd przetwarzania: ${error?.message || 'Nieznany błąd'}`, 500);
  }
};

// Helper functions

async function createWorker(data: any) {
  const { name, type, config, endpoint } = data;

  if (!name || !type) {
    return createErrorResponse('Nazwa i typ worker są wymagane', 400);
  }

  // Generate unique ID
  const workerId = `worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const newWorker = {
    id: workerId,
    name: name.trim(),
    type,
    endpoint: endpoint || `/api/${type}`,
    status: 'active',
    config: {
      model: config?.model || 'llama-3.1-8b-instant',
      maxTokens: config?.maxTokens || 1000,
      temperature: config?.temperature || 0.7,
      ...config
    },
    created: new Date().toISOString(),
    lastUsed: null
  };

  workersStorage.push(newWorker);

  console.log(`✅ Utworzono nowy worker: ${name} (${workerId})`);

  return createSuccessResponse({
    message: 'Worker został utworzony pomyślnie',
    worker: newWorker
  });
}

async function updateWorker(data: any) {
  const { workerId, updates } = data;

  if (!workerId) {
    return createErrorResponse('Worker ID jest wymagane', 400);
  }

  const workerIndex = workersStorage.findIndex(w => w.id === workerId);
  if (workerIndex === -1) {
    return createErrorResponse('Worker nie został znaleziony', 404);
  }

  // Update worker
  workersStorage[workerIndex] = {
    ...workersStorage[workerIndex],
    ...updates,
    lastUsed: new Date().toISOString()
  };

  console.log(`✅ Zaktualizowano worker: ${workerId}`);

  return createSuccessResponse({
    message: 'Worker został zaktualizowany',
    worker: workersStorage[workerIndex]
  });
}

async function deleteWorker(data: any) {
  const { workerId } = data;

  if (!workerId) {
    return createErrorResponse('Worker ID jest wymagane', 400);
  }

  const workerIndex = workersStorage.findIndex(w => w.id === workerId);
  if (workerIndex === -1) {
    return createErrorResponse('Worker nie został znaleziony', 404);
  }

  const deletedWorker = workersStorage.splice(workerIndex, 1)[0];

  console.log(`✅ Usunięto worker: ${deletedWorker.name} (${workerId})`);

  return createSuccessResponse({
    message: 'Worker został usunięty',
    deletedWorker
  });
}

async function testWorker(data: any) {
  const { workerId, testData } = data;

  if (!workerId) {
    return createErrorResponse('Worker ID jest wymagane', 400);
  }

  const worker = workersStorage.find(w => w.id === workerId);
  if (!worker) {
    return createErrorResponse('Worker nie został znaleziony', 404);
  }

  // Update last used timestamp
  worker.lastUsed = new Date().toISOString();

  // Simulate worker test based on type
  let testResult;
  switch (worker.type) {
    case 'chat':
      testResult = {
        response: `Cześć! Jestem ${worker.name} i działam poprawnie! 🤖`,
        model: worker.config.model,
        tokensUsed: 12
      };
      break;

    case 'image':
      testResult = {
        response: 'Test generowania obrazu zakończony pomyślnie',
        imageUrl: 'https://via.placeholder.com/512x512?text=Test+Image',
        model: worker.config.model
      };
      break;

    case 'analyze':
      testResult = {
        response: 'Analiza danych dostępna i działająca',
        dataProcessed: true,
        capabilities: ['text', 'csv', 'json']
      };
      break;

    case 'search':
      testResult = {
        response: 'Wyszukiwarka gotowa do działania',
        indexSize: 10000,
        avgResponseTime: '250ms'
      };
      break;

    default:
      testResult = {
        response: 'Worker test completed',
        status: 'active'
      };
  }

  console.log(`✅ Test worker: ${worker.name} (${workerId}) - sukces`);

  return createSuccessResponse({
    message: 'Test worker zakończony pomyślnie',
    worker: worker.name,
    result: testResult,
    timestamp: new Date().toISOString()
  });
}
