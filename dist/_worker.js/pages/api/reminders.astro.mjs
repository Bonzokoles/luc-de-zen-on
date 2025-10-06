globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as srcExports } from '../../chunks/index_CXp9EPjx.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CsfOuLCA.mjs';

function getEnv(locals) {
  return locals?.runtime?.env || {};
}
function getCalendarClient(env) {
  const keyJson = env.GCP_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error("GCP_SERVICE_ACCOUNT_KEY must be configured.");
  let credentials;
  try {
    credentials = JSON.parse(keyJson);
  } catch (e) {
    throw new Error("GCP_SERVICE_ACCOUNT_KEY is not valid JSON.");
  }
  const auth = new srcExports.google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });
  return srcExports.google.calendar({ version: "v3", auth });
}
const REMINDER_COLOR_ID = "5";
const GET = async ({ locals }) => {
  try {
    const env = getEnv(locals);
    const calendar = getCalendarClient(env);
    const calendarId = env.GOOGLE_CALENDAR_ID || "primary";
    const response = await calendar.events.list({
      calendarId,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250
      // Fetch more events to filter
    });
    const allEvents = response.data.items || [];
    const reminders = allEvents.filter((event) => event.colorId === REMINDER_COLOR_ID && event.start?.date).map((event) => ({
      // Map to the format expected by the Svelte component
      id: event.id,
      title: event.summary,
      description: event.description,
      dueDate: event.start.date,
      // YYYY-MM-DD
      completed: event.status === "cancelled",
      // Other fields can be mapped or defaulted
      priority: "medium",
      createdAt: new Date(event.created).getTime(),
      notifications: { email: true, push: false, sms: false }
    }));
    return new Response(JSON.stringify({ success: true, reminders, stats: {
      /* mock stats */
    } }), { status: 200 });
  } catch (error) {
    console.error("Reminders API GET Error:", error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};
const POST = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const calendar = getCalendarClient(env);
    const calendarId = env.GOOGLE_CALENDAR_ID || "primary";
    const { title, dueDate, description, priority } = await request.json();
    if (!title || !dueDate) {
      return new Response(JSON.stringify({ success: false, message: "Title and dueDate are required." }), { status: 400 });
    }
    const eventResource = {
      summary: title,
      description: description || "",
      start: { date: dueDate.split("T")[0] },
      // Ensure YYYY-MM-DD format
      end: { date: dueDate.split("T")[0] },
      colorId: REMINDER_COLOR_ID
    };
    const createdEvent = await calendar.events.insert({
      calendarId,
      requestBody: eventResource
    });
    return new Response(JSON.stringify({ success: true, reminder: createdEvent.data }), { status: 201 });
  } catch (error) {
    console.error("Reminders API POST Error:", error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};
const PUT = async ({ request, locals }) => {
  return new Response(JSON.stringify({ success: true, message: "Update functionality to be implemented." }), { status: 200 });
};
const DELETE = async ({ url, locals }) => {
  try {
    const env = getEnv(locals);
    const calendar = getCalendarClient(env);
    const calendarId = env.GOOGLE_CALENDAR_ID || "primary";
    const eventId = url.searchParams.get("id");
    if (!eventId) {
      return new Response(JSON.stringify({ success: false, message: "Event ID is required." }), { status: 400 });
    }
    await calendar.events.delete({ calendarId, eventId });
    return new Response(JSON.stringify({ success: true, message: "Reminder deleted successfully." }), { status: 200 });
  } catch (error) {
    console.error("Reminders API DELETE Error:", error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
