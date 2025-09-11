import type { APIRoute } from 'astro';
import { createSuccessResponse, createErrorResponse } from '../../../../utils/corsUtils';

// In-memory storage for created agents (in production would use database/KV)
const createdAgents = new Map();

// Mock some default agents for demonstration
if (createdAgents.size === 0) {
    createdAgents.set('polaczek_system_monitor', {
        name: 'polaczek_system_monitor',
        type: 'monitor',
        description: 'System monitoring agent',
        status: 'running',
        cpu_usage: 8,
        memory_usage: 145,
        messages_processed: 234,
        errors_count: 0,
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        last_activity: new Date().toISOString(),
        version: '1.0.0',
        port: 3001
    });
    
    createdAgents.set('polaczek_translator', {
        name: 'polaczek_translator',
        type: 'translator',
        description: 'Multi-language translation agent',
        status: 'running',
        cpu_usage: 12,
        memory_usage: 198,
        messages_processed: 67,
        errors_count: 1,
        created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        last_activity: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        version: '1.0.0',
        port: 3002
    });
    
    createdAgents.set('polaczek_chatbot', {
        name: 'polaczek_chatbot',
        type: 'chatbot',
        description: 'General purpose conversation agent',
        status: 'stopped',
        cpu_usage: 0,
        memory_usage: 0,
        messages_processed: 456,
        errors_count: 3,
        created_at: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
        last_activity: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        version: '1.0.0',
        port: 3003
    });
}

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const status = url.searchParams.get('status');
        const type = url.searchParams.get('type');
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        // Get all agents
        let agents = Array.from(createdAgents.values());

        // Apply filters
        if (status) {
            agents = agents.filter(agent => agent.status === status);
        }
        
        if (type) {
            agents = agents.filter(agent => agent.type === type);
        }

        // Sort by last activity (most recent first)
        agents.sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime());

        // Apply pagination
        const total = agents.length;
        const paginatedAgents = agents.slice(offset, offset + limit);

        // Calculate statistics
        const stats = {
            total: total,
            active: agents.filter(a => a.status === 'running').length,
            stopped: agents.filter(a => a.status === 'stopped').length,
            error: agents.filter(a => a.status === 'error').length,
            total_messages: agents.reduce((sum, a) => sum + a.messages_processed, 0),
            total_errors: agents.reduce((sum, a) => sum + a.errors_count, 0),
            types: [...new Set(agents.map(a => a.type))],
            avg_cpu: agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + a.cpu_usage, 0) / agents.length) : 0,
            avg_memory: agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + a.memory_usage, 0) / agents.length) : 0
        };

        console.log(`[AGENTS LIST] Retrieved ${paginatedAgents.length}/${total} agents`);

        return createSuccessResponse({
            agents: paginatedAgents,
            pagination: {
                total,
                limit,
                offset,
                has_more: offset + limit < total
            },
            statistics: stats,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching agents:', error);
        return createErrorResponse('Failed to fetch agents list', 500);
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        
        if (body.action === 'refresh') {
            // Simulate refreshing agent statuses
            for (const [key, agent] of createdAgents) {
                // Simulate some status changes
                if (Math.random() > 0.9) {
                    agent.last_activity = new Date().toISOString();
                    agent.messages_processed += Math.floor(Math.random() * 5);
                }
                
                // Update CPU and memory usage
                if (agent.status === 'running') {
                    agent.cpu_usage = Math.max(1, Math.min(30, agent.cpu_usage + (Math.random() - 0.5) * 4));
                    agent.memory_usage = Math.max(50, Math.min(500, agent.memory_usage + (Math.random() - 0.5) * 20));
                }
            }
            
            return createSuccessResponse({
                message: 'Agent statuses refreshed',
                refreshed_count: createdAgents.size,
                timestamp: new Date().toISOString()
            });
        }
        
        return createErrorResponse('Invalid action', 400);
        
    } catch (error) {
        console.error('Error in agents list POST:', error);
        return createErrorResponse('Failed to process request', 500);
    }
};

// Helper function to add agent to the list (called from create.ts)
export function addAgentToList(agentData: any) {
    const agent = {
        name: agentData.name,
        type: agentData.type,
        description: agentData.description,
        status: 'stopped', // New agents start stopped
        cpu_usage: 0,
        memory_usage: 0,
        messages_processed: 0,
        errors_count: 0,
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        version: agentData.version || '1.0.0',
        port: agentData.port || 3000,
        model: agentData.model,
        language: agentData.language || 'pl',
        activity_level: agentData.activity_level || 'medium',
        instructions: agentData.instructions
    };
    
    createdAgents.set(agentData.name, agent);
    console.log(`[AGENTS LIST] Added new agent: ${agentData.name}`);
    return agent;
}