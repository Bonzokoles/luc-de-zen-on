import type { APIRoute } from 'astro';

// Helper to get secrets from Cloudflare environment
function getEnv(locals: App.Locals): Record<string, any> {
  return import.meta.env.DEV ? process.env : locals?.runtime?.env || {};
}

// In-memory "database" for tickets for demonstration purposes
const ticketDatabase: Map<string, any> = new Map();

// --- POST: Create and Classify a new Ticket ---
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const aiBinding = env.AI;

    if (!aiBinding) {
      throw new Error('AI binding is not configured in your environment.');
    }

    const { description, email, priority = 'medium', category = '' } = await request.json();
    
    if (!description || !email) {
      return new Response(JSON.stringify({ error: 'Description and email are required' }), { status: 400 });
    }

    const ticketId = `TICK-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const classificationPrompt = `Classify the following support ticket and return a JSON object.

    Ticket ID: ${ticketId}
    Email: ${email}
    User-provided Priority: ${priority}
    Category: ${category || 'not provided'}
    Description: ${description}

    Your task is to analyze the description and return a valid JSON object with the following structure:
    {
      "team": "[tech-support/billing/sales/other]",
      "priority": "[low/medium/high/critical]",
      "category": "[bug/feature-request/question/complaint/other]",
      "summary": "[a short summary of the issue in Polish]",
      "suggested_actions": "[suggested next steps for the support team in Polish]"
    }`;

    const aiResponse = await aiBinding.run('@cf/google/gemma-2-9b-it', {
        messages: [
          { role: 'system', content: 'You are an expert at classifying technical support tickets. You must respond ONLY with a valid JSON object.' },
          { role: 'user', content: classificationPrompt }
        ],
        max_tokens: 500,
        temperature: 0.2
    });

    let classification;
    try {
      const jsonMatch = aiResponse.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch || !jsonMatch[0]) throw new Error('No JSON object found in AI response.');
      classification = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      classification = { team: 'tech-support', priority: priority, category: 'other', summary: description.substring(0, 100) + '...', suggested_actions: 'Manual review required.' };
    }

    const newTicket = {
      id: ticketId,
      title: classification.summary || 'New Ticket',
      description: description,
      status: 'open',
      priority: classification.priority || priority,
      user: email,
      assignee: null,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      category: classification.category || 'other',
      team: classification.team,
      updates: [{ timestamp: new Date().toISOString(), message: 'Ticket created and classified by AI.' }]
    };

    ticketDatabase.set(ticketId, newTicket);
    
    return new Response(JSON.stringify({ 
      ticketId,
      classification,
      status: 'created',
      timestamp: new Date().toISOString(),
    }), { status: 200 });

  } catch (error) {
    console.error('Ticket creation error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), { status: 500 });
  }
};

// --- GET: Retrieve one or all tickets ---
export const GET: APIRoute = async ({ url }) => {
  const ticketId = url.searchParams.get('id');
  
  // Return a single ticket if ID is provided
  if (ticketId) {
    const ticket = ticketDatabase.get(ticketId);
    if (!ticket) {
      return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(ticket), { status: 200 });
  }

  // Return all tickets if no ID is provided
  const allTickets = Array.from(ticketDatabase.values());
  return new Response(JSON.stringify(allTickets), { status: 200 });
};
