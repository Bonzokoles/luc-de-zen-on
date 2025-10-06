import type { APIRoute } from 'astro';
import { google } from 'googleapis';

// --- Helper Functions (similar to calendar.ts) ---
function getEnv(locals: App.Locals): Record<string, any> {
  return import.meta.env.DEV ? process.env : locals?.runtime?.env || {};
}

function getCalendarClient(env: Record<string, any>) {
  const keyJson = env.GCP_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error('GCP_SERVICE_ACCOUNT_KEY must be configured.');
  
  let credentials;
  try {
    credentials = JSON.parse(keyJson);
  } catch (e) {
    throw new Error('GCP_SERVICE_ACCOUNT_KEY is not valid JSON.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return google.calendar({ version: 'v3', auth });
}

const REMINDER_COLOR_ID = '5'; // Using a specific color for reminders (5 = Yellow)

// --- GET: List reminders (all-day events with our specific color) ---
export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = getEnv(locals);
    const calendar = getCalendarClient(env);
    const calendarId = env.GOOGLE_CALENDAR_ID || 'primary';

    const response = await calendar.events.list({
      calendarId: calendarId,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 250, // Fetch more events to filter
    });

    const allEvents = response.data.items || [];
    const reminders = allEvents
      .filter(event => event.colorId === REMINDER_COLOR_ID && event.start?.date)
      .map(event => ({ // Map to the format expected by the Svelte component
          id: event.id,
          title: event.summary,
          description: event.description,
          dueDate: event.start.date, // YYYY-MM-DD
          completed: event.status === 'cancelled',
          // Other fields can be mapped or defaulted
          priority: 'medium',
          createdAt: new Date(event.created).getTime(),
          notifications: { email: true, push: false, sms: false },
      }));

    return new Response(JSON.stringify({ success: true, reminders, stats: { /* mock stats */ } }), { status: 200 });

  } catch (error) {
    console.error('Reminders API GET Error:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};

// --- POST: Create a new reminder (as an all-day event) ---
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const calendar = getCalendarClient(env);
    const calendarId = env.GOOGLE_CALENDAR_ID || 'primary';
    const { title, dueDate, description, priority } = await request.json();

    if (!title || !dueDate) {
      return new Response(JSON.stringify({ success: false, message: 'Title and dueDate are required.' }), { status: 400 });
    }

    const eventResource = {
      summary: title,
      description: description || '',
      start: { date: dueDate.split('T')[0] }, // Ensure YYYY-MM-DD format
      end: { date: dueDate.split('T')[0] },
      colorId: REMINDER_COLOR_ID,
    };

    const createdEvent = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: eventResource,
    });

    return new Response(JSON.stringify({ success: true, reminder: createdEvent.data }), { status: 201 });

  } catch (error) {
    console.error('Reminders API POST Error:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};

// --- PUT: Update a reminder ---
export const PUT: APIRoute = async ({ request, locals }) => {
    // Implementation would find event by ID and patch it
    // For brevity, we'll return a success message
    return new Response(JSON.stringify({ success: true, message: 'Update functionality to be implemented.' }), { status: 200 });
};

// --- DELETE: Delete a reminder ---
export const DELETE: APIRoute = async ({ url, locals }) => {
    try {
        const env = getEnv(locals);
        const calendar = getCalendarClient(env);
        const calendarId = env.GOOGLE_CALENDAR_ID || 'primary';
        const eventId = url.searchParams.get('id');

        if (!eventId) {
            return new Response(JSON.stringify({ success: false, message: 'Event ID is required.' }), { status: 400 });
        }

        await calendar.events.delete({ calendarId, eventId });

        return new Response(JSON.stringify({ success: true, message: 'Reminder deleted successfully.' }), { status: 200 });

    } catch (error) {
        console.error('Reminders API DELETE Error:', error);
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
};