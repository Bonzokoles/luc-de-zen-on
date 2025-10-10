import type { APIRoute } from 'astro';
import { getAgentsStatus, addAgent, updateAgentStatus, removeAgent } from '../../lib/api';

export const GET: APIRoute = ({ params, request }) => {
  const statuses = getAgentsStatus();
  return new Response(
    JSON.stringify(statuses), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}

export const POST: APIRoute = async ({ request }) => {
  const agentData = await request.json();
  const newAgent = addAgent(agentData);
  return new Response(JSON.stringify(newAgent), {
    status: 201,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  const { status } = await request.json();
  if (id) {
    const updatedAgent = updateAgentStatus(id, status);
    if (updatedAgent) {
      return new Response(JSON.stringify(updatedAgent), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  }
  return new Response(JSON.stringify({ error: "Agent not found" }), {
    status: 404,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export const DELETE: APIRoute = ({ params }) => {
  const { id } = params;
  if (id) {
    const removedAgent = removeAgent(id);
    if (removedAgent) {
      return new Response(JSON.stringify(removedAgent), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  }
  return new Response(JSON.stringify({ error: "Agent not found" }), {
    status: 404,
    headers: {
      "Content-Type": "application/json"
    }
  });
}