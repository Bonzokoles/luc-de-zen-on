import type { APIRoute } from 'astro';
import { AGENT_CONFIG } from './config';

// Standard response helper
const createResponse = (data: any, status: number = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
};

// Template Agent API
export const POST: APIRoute = async ({ request }) => {
    try {
        const { action, data } = await request.json();

        switch (action) {
            case 'test':
                return testAgent();

            case 'execute':
                return executeAgent(data);

            case 'status':
                return getAgentStatus();

            case 'config':
                return getAgentConfig();

            default:
                return createResponse({
                    error: 'Invalid action',
                    available_actions: ['test', 'execute', 'status', 'config']
                }, 400);
        }

    } catch (error) {
        console.error(`${AGENT_CONFIG.name} API Error:`, error);
        return createResponse({
            error: 'Internal server error',
            agent: AGENT_CONFIG.name,
            timestamp: new Date().toISOString()
        }, 500);
    }
};

// Handle CORS preflight
export const OPTIONS: APIRoute = async () => {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
};

// Agent Functions
async function testAgent() {
    return createResponse({
        success: true,
        message: `${AGENT_CONFIG.name} is responding correctly`,
        agent: AGENT_CONFIG.name,
        version: AGENT_CONFIG.version,
        timestamp: new Date().toISOString()
    });
}

async function executeAgent(data: any) {
    // Implement your agent logic here

    return createResponse({
        success: true,
        message: `${AGENT_CONFIG.name} executed successfully`,
        input: data,
        result: 'Template execution result',
        timestamp: new Date().toISOString()
    });
}

async function getAgentStatus() {
    const uptime =
        typeof process !== 'undefined' && typeof process.uptime === 'function'
            ? process.uptime()
            : null;

    const memory =
        typeof process !== 'undefined' && typeof process.memoryUsage === 'function'
            ? process.memoryUsage()
            : null;

    return createResponse({
        agent: AGENT_CONFIG.name,
        status: AGENT_CONFIG.status,
        version: AGENT_CONFIG.version,
        uptime,
        memory,
        timestamp: new Date().toISOString()
    });
}

async function getAgentConfig() {
    return createResponse({
        config: AGENT_CONFIG,
        timestamp: new Date().toISOString()
    });
}