import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const servers = [
    { name: 'MCP Browser', status: 'online' },
    { name: 'MCP Docker', status: 'online' },
    { name: 'MCP GitHub', status: 'degraded' },
    { name: 'MCP Knowledge', status: 'online' },
    { name: 'MCP SQLite', status: 'offline' },
    { name: 'MCP Filesystem', status: 'online' },
    { name: 'MCP Postgres', status: 'online' },
    { name: 'MCP Fetch', status: 'online' },
    { name: 'MCP Brave Search', status: 'online' },
    { name: 'MCP Obsidian', status: 'online' },
    { name: 'MCP Slack', status: 'online' },
  ];

  return new Response(JSON.stringify({ servers }), {
    headers: { 'Content-Type': 'application/json' }
  });
};