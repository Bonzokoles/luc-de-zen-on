
import type { APIRoute } from 'astro';

// Mock KV store for calendar events
const calendarData: Record<string, { events: any[] }> = {};

export const ALL: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  if (!userId) return new Response("Missing userId", { status: 400 });

  if (!calendarData[userId]) {
      calendarData[userId] = { events: [] };
  }

  if (request.method === "GET") {
    const data = calendarData[userId];
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
  }

  if (request.method === "POST") {
    const payload = await request.json();
    calendarData[userId] = payload;
    return new Response(JSON.stringify({ success: true }));
  }

  return new Response("Method not allowed", { status: 405 });
};
