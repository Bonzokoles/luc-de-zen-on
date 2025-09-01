
import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createSuccessResponse } from '../../utils/corsUtils';

export const OPTIONS = createOPTIONSHandler(['GET', 'OPTIONS']);

// This mock API simulates reading from a USAGE_LOGS_KV and aggregating the data.
const mockLogs = [
    { action: 'chat_message', userId: 'user_123' },
    { action: 'chat_message', userId: 'user_456' },
    { action: 'calendar', userId: 'user_123' },
    { action: 'chat_message', userId: 'user_123' },
    { action: 'finance', userId: 'user_789' },
    { action: 'email', userId: 'user_123' },
    { action: 'chat_message', userId: 'user_456' },
    { action: 'calendar', userId: 'user_123' },
    { action: 'calendar', userId: 'user_123' },
    { action: 'search', userId: 'user_123' }, // Low usage example
];

export const GET: APIRoute = () => {
  // Simple analysis: count actions by type
  const stats = mockLogs.reduce((acc: any, log: any) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {});

  const response = {
    totalActions: mockLogs.length,
    stats,
  };

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
};
