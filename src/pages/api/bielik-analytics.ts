
import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createSuccessResponse } from '../../utils/corsUtils';

export const OPTIONS = createOPTIONSHandler(['GET', 'OPTIONS']);

// API provided by BIELIK Orchestrator
// In a real-world scenario, Bielik would connect to a database or a KV store
// to aggregate and return real usage data, potentially with learned insights.

const mockStats = {
  totalRequests: 1483,
  topAgents: [
    { name: 'AI Chatbot', count: 672 },
    { name: 'WildcardPrompt AI', count: 451 },
    { name: 'Image Generator', count: 310 },
    { name: 'POLACZEK_AGENT_SYS_23', count: 50 },
    { name: 'Other', count: 10 },
  ],
  topPrompts: [
    { name: 'cyberpunk', count: 189 },
    { name: 'fantasy', count: 124 },
    { name: 'space_opera', count: 98 },
    { name: 'realistic_portrait', count: 25 },
    { name: 'architectural_design', count: 15 },
  ],
};

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(mockStats), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
