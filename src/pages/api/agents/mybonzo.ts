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
export const POST = async ({ request, locals, url }: { request: Request; locals: any; url: URL }) => {
    try {
        // Check environment and available bindings
        const env = locals.runtime?.env;
        const body = await request.json();

        // For now, use mock responses since MYBONZO_AGENT binding is not configured
        // In production, this would connect to the actual MyBonzo agent
        if (!getAgentByName) {
            // Fallback for local development and when agent SDK is not available
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
        const agentId = body.agentId || body.name || 'default';
        const endpoint = body.endpoint || 'chat';

        // TODO: This section would work when MYBONZO_AGENT binding is configured
        // For now, return mock response since binding is commented out in wrangler.toml
        return new Response(JSON.stringify({
            success: true,
            response: `🚧 MyBonzo Agent (Production Mock): Received ${endpoint} request. Agent binding not yet configured in wrangler.toml`,
            timestamp: new Date().toISOString(),
            agentId: agentId,
            endpoint: endpoint,
            note: "This would connect to real MyBonzo agent when MYBONZO_AGENT binding is configured"
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
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

export const GET = async ({ locals, url }: { locals: any; url: URL }) => {
    try {
        // Diagnostic logging for Cloudflare environment
        console.log('GET request to mybonzo agent');
        console.log('locals:', typeof locals, Object.keys(locals || {}));
        console.log('locals.runtime:', typeof locals?.runtime, Object.keys(locals?.runtime || {}));
        console.log('locals.runtime.env:', typeof locals?.runtime?.env, Object.keys(locals?.runtime?.env || {}));

        // Since MYBONZO_AGENT binding is not configured, use mock responses
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
            message: '🤖 MyBonzo Agent API (Mock)',
            status: 'online (mock)',
            endpoints: ['chat', 'status', 'task', 'image'],
            timestamp: new Date().toISOString(),
            environment: 'cloudflare_pages_mock',
            debug: {
                hasLocals: !!locals,
                hasRuntime: !!locals?.runtime,
                hasEnv: !!locals?.runtime?.env,
                localsKeys: Object.keys(locals || {}),
                runtimeKeys: Object.keys(locals?.runtime || {}),
                envKeys: Object.keys(locals?.runtime?.env || {})
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });

    } catch (error) {
        const err = error as Error;
        console.error('MyBonzo Agent GET Error:', error);
        console.error('Error details:', {
            message: err?.message,
            stack: err?.stack,
            type: typeof error
        });

        return new Response(JSON.stringify({
            error: 'Agent GET request failed',
            status: 'error',
            success: false,
            debug: {
                errorMessage: err?.message,
                errorType: typeof error,
                timestamp: new Date().toISOString()
            }
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
};

export const OPTIONS = () => {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
};