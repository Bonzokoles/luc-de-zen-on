import type { APIRoute } from 'astro';
import { createSuccessResponse, createErrorResponse, createOPTIONSHandler } from '../../../utils/corsUtils';

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    user: string;
    assignee?: string;
    created: string;
    updated: string;
    category: 'bug' | 'feature' | 'support' | 'question';
}

function generateFallbackTickets(): Ticket[] {
    return [
        {
            id: 'TIC-001',
            title: 'Voice AI not responding',
            description: 'The voice AI system stops responding after multiple queries',
            status: 'open',
            priority: 'high',
            user: 'user_watson',
            created: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            category: 'bug'
        },
        {
            id: 'TIC-002',
            title: 'Feature request: Dark mode toggle',
            description: 'Add ability to toggle between dark and light themes',
            status: 'in_progress',
            priority: 'medium',
            user: 'mod_nexus',
            assignee: 'admin_haos77',
            created: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            category: 'feature'
        },
        {
            id: 'TIC-003',
            title: 'System performance issues',
            description: 'Page loading times are significantly slower',
            status: 'resolved',
            priority: 'critical',
            user: 'test_user',
            assignee: 'admin_haos77',
            created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            category: 'bug'
        },
        {
            id: 'TIC-004',
            title: 'How to use API endpoints?',
            description: 'Need documentation for API integration',
            status: 'closed',
            priority: 'low',
            user: 'user_watson',
            created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'question'
        }
    ];
}

export const OPTIONS: APIRoute = createOPTIONSHandler(['GET', 'POST', 'PUT']);

export const GET: APIRoute = async ({ locals, request }) => {
    try {
        const env = (locals as any)?.runtime?.env;

        // Check authentication
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Warning: No authentication provided for admin tickets');
        }

        let tickets: Ticket[];

        try {
            if (env?.ADMIN_DATA) {
                const cachedTickets = await env.ADMIN_DATA.get('tickets_list');
                if (cachedTickets) {
                    tickets = JSON.parse(cachedTickets);
                } else {
                    throw new Error('No cached tickets');
                }
            } else {
                throw new Error('No KV store available');
            }
        } catch (err) {
            // Generate fallback tickets
            tickets = generateFallbackTickets();

            // Try to cache the generated tickets
            if (env?.ADMIN_DATA) {
                try {
                    await env.ADMIN_DATA.put('tickets_list', JSON.stringify(tickets), {
                        expirationTtl: 1800 // 30 minutes
                    });
                } catch (cacheErr) {
                    console.error('Failed to cache tickets:', cacheErr);
                }
            }
        }

        return createSuccessResponse(tickets);

    } catch (error) {
        console.error('Error fetching tickets:', error);

        // Return fallback data on error
        const fallbackTickets = generateFallbackTickets();
        return createSuccessResponse(fallbackTickets);
    }
};

export const POST: APIRoute = async ({ locals, request }) => {
    try {
        const env = (locals as any)?.runtime?.env;

        // Check authentication
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return createErrorResponse('Unauthorized', 401);
        }

        const body = await request.json();
        const { title, description, priority, user, category } = body;

        if (!title || !description || !user) {
            return createErrorResponse('Missing required fields: title, description, user', 400);
        }

        // Generate ticket ID
        const ticketNumber = Math.floor(Math.random() * 9000) + 1000;
        const ticketId = `TIC-${ticketNumber.toString().padStart(3, '0')}`;

        const newTicket: Ticket = {
            id: ticketId,
            title,
            description,
            status: 'open',
            priority: priority || 'medium',
            user,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            category: category || 'support'
        };

        // Try to add ticket to KV store
        if (env?.ADMIN_DATA) {
            try {
                const existingTickets = await env.ADMIN_DATA.get('tickets_list');
                const tickets = existingTickets ? JSON.parse(existingTickets) : generateFallbackTickets();

                tickets.unshift(newTicket); // Add to beginning for newest first

                await env.ADMIN_DATA.put('tickets_list', JSON.stringify(tickets), {
                    expirationTtl: 1800
                });
            } catch (err) {
                console.error('Failed to save ticket to KV:', err);
            }
        }

        return createSuccessResponse({
            message: 'Ticket created successfully',
            ticket: newTicket
        });

    } catch (error) {
        console.error('Error creating ticket:', error);
        return createErrorResponse('Internal server error', 500);
    }
};

export const PUT: APIRoute = async ({ locals, request }) => {
    try {
        const env = (locals as any)?.runtime?.env;

        // Check authentication
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return createErrorResponse('Unauthorized', 401);
        }

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return createErrorResponse('Ticket ID is required', 400);
        }

        // Try to update ticket in KV store
        if (env?.ADMIN_DATA) {
            try {
                const existingTickets = await env.ADMIN_DATA.get('tickets_list');
                const tickets = existingTickets ? JSON.parse(existingTickets) : generateFallbackTickets();

                const ticketIndex = tickets.findIndex((t: Ticket) => t.id === id);
                if (ticketIndex === -1) {
                    return createErrorResponse('Ticket not found', 404);
                }

                // Update ticket with provided fields and set updated timestamp
                tickets[ticketIndex] = {
                    ...tickets[ticketIndex],
                    ...updates,
                    updated: new Date().toISOString()
                };

                await env.ADMIN_DATA.put('tickets_list', JSON.stringify(tickets), {
                    expirationTtl: 1800
                });

                return createSuccessResponse({
                    message: 'Ticket updated successfully',
                    ticket: tickets[ticketIndex]
                });
            } catch (err) {
                console.error('Failed to update ticket in KV:', err);
            }
        }

        return createErrorResponse('Failed to update ticket', 500);

    } catch (error) {
        console.error('Error updating ticket:', error);
        return createErrorResponse('Internal server error', 500);
    }
};