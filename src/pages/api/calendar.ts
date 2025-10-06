import type { APIRoute } from 'astro';
import { google } from 'googleapis';

// Helper to get secrets
function getEnv(locals: App.Locals): Record<string, any> {
  return import.meta.env.DEV ? process.env : locals?.runtime?.env || {};
}

// Initialize the Google Calendar client
function getCalendarClient(env: Record<string, any>) {
  const keyJson = env.GCP_SERVICE_ACCOUNT_KEY;
  if (!keyJson) {
    throw new Error('GCP_SERVICE_ACCOUNT_KEY must be configured in secrets.');
  }

  let credentials;
  try {
    credentials = JSON.parse(keyJson);
  } catch (e) {
    throw new Error('GCP_SERVICE_ACCOUNT_KEY is not a valid JSON string.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const calendar = google.calendar({ version: 'v3', auth });
  return calendar;
}

// --- GET: List upcoming events ---
export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = getEnv(locals);
    const calendar = getCalendarClient(env);
    const calendarId = env.GOOGLE_CALENDAR_ID || 'primary';

    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    return new Response(JSON.stringify({ success: true, events }), { status: 200 });

  } catch (error) {
    console.error('Google Calendar API GET Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};

// --- POST: Create a new event using AI ---
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const { text } = await request.json();

    if (!text) {
      return new Response(JSON.stringify({ success: false, error: 'Text for the event is required.' }), { status: 400 });
    }

    // Use AI to parse the natural language text
    const aiBinding = env.AI;
    if (!aiBinding) throw new Error('AI binding is not configured.');

    const systemPrompt = `You are an expert at parsing natural language into structured calendar events. Analyze the user's text and return a valid JSON object representing a Google Calendar event resource. The JSON object must include 'summary', 'start', and 'end'. The 'start' and 'end' objects must have a 'dateTime' property in ISO 8601 format. Assume the current year is ${new Date().getFullYear()}`;
    const userPrompt = `Parse the following text into a Google Calendar event object: "${text}"`;

    const aiResponse = await aiBinding.run('@cf/google/gemma-2-9b-it', {
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
    });

    let eventResource;
    try {
      const jsonMatch = aiResponse.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('AI did not return a valid JSON object.');
      eventResource = JSON.parse(jsonMatch[0]);
    } catch (e) {
      throw new Error(`Failed to parse AI response: ${aiResponse.response}`);
    }

    // Create the event in Google Calendar
    const calendar = getCalendarClient(env);
    const calendarId = env.GOOGLE_CALENDAR_ID || 'primary';

    const createdEvent = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: eventResource,
    });

    return new Response(JSON.stringify({ success: true, event: createdEvent.data }), { status: 201 });

  } catch (error) {
    console.error('Google Calendar API POST Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};