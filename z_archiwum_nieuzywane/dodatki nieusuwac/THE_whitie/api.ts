// Business Orchestrator API – Bielik-powered central agent
import type { APIRoute } from 'astro';
import { BUSINESS_ORCHESTRATOR_CONFIG } from './config';
import { BielikModel } from './bielik'; // Polskie LLM do workflow/orchestration
import { allAgentApis } from '../agents/allAgents'; // Importy agentów specjalistycznych

// Typy requestów (możesz rozbudować)
interface RouteTaskRequest {
  command: string;
  context?: Record<string, any>;
  data?: Record<string, any>;
}

interface DecisionRequest {
  inputs: Record<string, any>;
  context?: Record<string, any>;
}

// Główna obsługa POST
export const POST: APIRoute = async ({ request }) => {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'route-task':
        return await routeTask(data);
      case 'aggregate-status':
        return await aggregateStatus();
      case 'decision':
        return await makeDecision(data);
      case 'audit':
        return await getAuditLogs(data);
      default:
        return errorResponse('Invalid action for Business Orchestrator');
    }
  } catch (error: any) {
    return errorResponse(`Internal error: ${error?.message || String(error)}`);
  }
};

// 1. Orkiestracja workflow – delegacja zadań wg planu Bielik
async function routeTask(data: RouteTaskRequest) {
  // 1.1. Analiza polecenia i planowanie workflow przez Bielik
  const plan = await BielikModel.planWorkflow(data.command, data.context);

  // 1.2. Wywołania agentów wg planu
  const agentResponses = await Promise.all(
    plan.agents.map(async (agentName: string) => {
      try {
        return {
          agent: agentName,
          response: await allAgentApis[agentName].execute({
            task: plan.tasks[agentName],
            context: data.context,
          }),
        };
      } catch (err: any) {
        return {
          agent: agentName,
          error: err.message,
        };
      }
    })
  );

  // 1.3. Zwróć plan i odpowiedzi agentów
  return successResponse({
    plan,
    agentResponses,
  });
}

// 2. Globalny status agentów
async function aggregateStatus() {
  const statuses = await Promise.all(
    Object.entries(allAgentApis).map(async ([agentName, api]) => {
      try {
        return {
          agent: agentName,
          status: await api.status(),
        };
      } catch (err: any) {
        return {
          agent: agentName,
          status: 'unavailable',
          error: err.message,
        };
      }
    })
  );
  return successResponse({ statuses });
}

// 3. Decyzje przez LLM (Bielik)
async function makeDecision(data: DecisionRequest) {
  const decision = await BielikModel.decide(data.inputs, data.context);
  return successResponse({ decision });
}

// 4. Audyt/logi orchestratora
async function getAuditLogs({ filter, range, agent }: Record<string, any>) {
  // Tu: pobierz logi z bazy/in-memory
  const logs = []; // TODO: implementacja
  return successResponse({ logs });
}

// Helpers
function successResponse(payload: any) {
  return new Response(JSON.stringify({ success: true, ...payload }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({ success: false, error: 'Business Orchestrator Error', message }),
    { status, headers: { 'Content-Type': 'application/json' } }
  );
}