
import type { APIRoute } from 'astro';

// This is a mock database to simulate a multi-user KV store.
const userLearningData: Record<string, { dialogues: string[], vocab: Record<string, string> }> = {};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const ALL: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId parameter" }), { status: 400, headers: corsHeaders });
  }

  // Initialize data for new user
  if (!userLearningData[userId]) {
      userLearningData[userId] = { dialogues: [], vocab: {} };
  }

  if (request.method === 'GET') {
    const learningData = userLearningData[userId];
    return new Response(JSON.stringify(learningData), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }

  if (request.method === 'POST') {
    try {
        const payload = await request.json();
        const existing = userLearningData[userId];
        
        if (payload.dialogues && Array.isArray(payload.dialogues)) {
            existing.dialogues.push(...payload.dialogues);
        }
        if (payload.vocab) {
            Object.assign(existing.vocab, payload.vocab);
        }
        
        userLearningData[userId] = existing; // Save back to our mock DB

        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON payload" }), { status: 400, headers: corsHeaders });
    }
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
};
