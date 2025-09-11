import type { APIRoute } from 'astro';

// Dynamic import for agents SDK to handle local development gracefully
let getAgentByName: any = null;
try {
    const agentsModule = await import('agents');
    getAgentByName = agentsModule.getAgentByName;
} catch (error) {
    console.warn('Agents SDK not available in local development environment');
}

/**
 * MyBonzo Agent Integration API
 * Connects the main Astro app with the MyBonzo agent using named addressing pattern
 * URL pattern: /api/agents/mybonzo
 */
export const POST: APIRoute = async ({ request, locals, url }) => {
    try {
        // Check if we're in local development without Cloudflare bindings
        const env = locals.runtime?.env;
        if (!env || !env.MYBONZO_AGENT || !getAgentByName) {
            // Fallback for local development
            const body = await request.json();
            const endpoint = body.endpoint || 'chat';

            // Mock responses for local testing
            const mockResponses = {
                chat: {
                    success: true,
                    response: `🤖 MyBonzo Agent (Local Mock): Received message "${body.message}". This is a mock response for local development.`,
                    timestamp: new Date().toISOString(),
                    agentId: body.agentId || 'default'
                },
                status: {
                    success: true,
                    status: 'online (mock)',
                    lastActivity: new Date().toISOString(),
                    stats: {
                        messagesCount: 5,
                        imagesGenerated: 2,
                        tasksCompleted: 3
                    },
                    conversationLength: 5
                },
                task: {
                    success: true,
                    result: `🎯 Task "${body.taskType}" completed (mock). In production, this would execute: ${JSON.stringify(body.taskData)}`,
                    timestamp: new Date().toISOString()
                },
                image: {
                    success: true,
                    response: `🖼️ Image generation (mock) for prompt: "${body.prompt}". In production, this would generate an actual image.`,
                    timestamp: new Date().toISOString()
                },
                analyze: {
                    success: true,
                    response: `📊 Text analysis (mock) completed. In production, this would analyze: "${body.text}"`,
                    timestamp: new Date().toISOString()
                },
                clear: {
                    success: true,
                    message: '🧹 History cleared (mock)',
                    timestamp: new Date().toISOString()
                }
            };

            const mockResponse = mockResponses[endpoint as keyof typeof mockResponses] || mockResponses.chat;

            return new Response(JSON.stringify(mockResponse), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }

        // Production code with actual agent
        const body = await request.json();
        const agentId = body.agentId || body.name || 'default';
        const endpoint = body.endpoint || 'chat';

        // Get agent by name using the getAgentByName pattern
        const agentStub = getAgentByName(env.MYBONZO_AGENT, agentId);
        const agent = await agentStub;

        // Create appropriate URL for the agent based on endpoint
        let agentUrl = new URL(request.url);
        switch (endpoint) {
            case 'chat':
                agentUrl.pathname = '/api/mybonzo-chat';
                break;
            case 'status':
                agentUrl.pathname = '/api/mybonzo-status';
                break;
            case 'task':
                agentUrl.pathname = '/api/mybonzo-task';
                break;
            case 'image':
                agentUrl.pathname = '/api/mybonzo-image';
                break;
            case 'analyze':
                agentUrl.pathname = '/api/mybonzo-analyze';
                break;
            case 'clear':
                agentUrl.pathname = '/api/mybonzo-clear';
                break;
            default:
                agentUrl.pathname = '/api/mybonzo-chat';
        }

        // Create a new request to send to the agent's fetch method
        const agentRequest = new Request(agentUrl.toString(), {
            method: request.method,
            headers: request.headers,
            body: JSON.stringify(body)
        });

        // Forward the request to the agent
        const response = await agent.fetch(agentRequest);

        // Add CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Create new response with CORS headers
        const responseBody = await response.text();
        return new Response(responseBody, {
            status: response.status,
            headers: {
                ...Object.fromEntries(response.headers.entries()),
                ...corsHeaders,
            }
        });

    } catch (error) {
        console.error('MyBonzo Agent API Error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to process agent request',
            success: false,
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
};

export const GET: APIRoute = async ({ locals, url }) => {
    try {
        // Check if we're in local development without Cloudflare bindings
        const env = locals.runtime?.env;
        if (!env || !env.MYBONZO_AGENT || !getAgentByName) {
            // Fallback for local development
            const action = url.searchParams.get('action');
            const agentId = url.searchParams.get('id') || 'default';

            if (action === 'status') {
                return new Response(JSON.stringify({
                    success: true,
                    status: 'online (mock)',
                    lastActivity: new Date().toISOString(),
                    stats: {
                        messagesCount: 5,
                        imagesGenerated: 2,
                        tasksCompleted: 3
                    },
                    conversationLength: 5
                }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                });
            }

            // Default response for missing action or connection test
            return new Response(JSON.stringify({
                success: true,
                message: '🤖 MyBonzo Agent API (Local Mock)',
                status: 'online (mock)',
                endpoints: ['chat', 'status', 'task', 'image'],
                timestamp: new Date().toISOString(),
                environment: 'local_development'
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }

        // Check if this is a status request
        const action = url.searchParams.get('action');
        const agentId = url.searchParams.get('id') || 'default';

        if (action === 'status') {
            // Get agent by name and request status
            const agentStub = getAgentByName(env.MYBONZO_AGENT, agentId);
            const agent = await agentStub;

            // Create status request URL
            const statusUrl = new URL(url);
            statusUrl.pathname = '/api/mybonzo-status';

            const statusRequest = new Request(statusUrl.toString(), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const response = await agent.fetch(statusRequest);
            const responseBody = await response.text();

            return new Response(responseBody, {
                status: response.status,
                headers: {
                    ...Object.fromEntries(response.headers.entries()),
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }

        // Default health check response
        return new Response(JSON.stringify({
            message: 'MyBonzo Agent is available',
            status: 'online',
            success: true,
            endpoints: {
                'POST /api/agents/mybonzo': 'Route requests to MyBonzo agent',
                'GET /api/agents/mybonzo?action=status&id=agentId': 'Get agent status'
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });

    } catch (error) {
        console.error('MyBonzo Agent Health Check Error:', error);
        return new Response(JSON.stringify({
            error: 'Agent health check failed',
            status: 'error',
            success: false
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
};

export const OPTIONS: APIRoute = () => {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
};