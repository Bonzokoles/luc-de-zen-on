globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as srcExports } from '../../chunks/index_CXp9EPjx.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CsfOuLCA.mjs';

function getEnv(locals) {
  return locals?.runtime?.env || {};
}
function getCalendarClient(env) {
  const keyJson = env.GCP_SERVICE_ACCOUNT_KEY;
  if (!keyJson) {
    throw new Error("GCP_SERVICE_ACCOUNT_KEY must be configured in secrets.");
  }
  let credentials;
  try {
    credentials = JSON.parse(keyJson);
  } catch (e) {
    throw new Error("GCP_SERVICE_ACCOUNT_KEY is not a valid JSON string.");
  }
  const auth = new srcExports.google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });
  const calendar = srcExports.google.calendar({ version: "v3", auth });
  return calendar;
}
const GET = async ({ locals }) => {
  try {
    const env = getEnv(locals);
    const calendar = getCalendarClient(env);
    const calendarId = env.GOOGLE_CALENDAR_ID || "primary";
    const response = await calendar.events.list({
      calendarId,
      timeMin: (/* @__PURE__ */ new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime"
    });
    const events = response.data.items;
    return new Response(JSON.stringify({ success: true, events }), { status: 200 });
  } catch (error) {
    console.error("Google Calendar API GET Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};
const POST = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const { text } = await request.json();
    if (!text) {
      return new Response(JSON.stringify({ success: false, error: "Text for the event is required." }), { status: 400 });
    }
    const aiBinding = env.AI;
    if (!aiBinding) throw new Error("AI binding is not configured.");
    const systemPrompt = `You are an expert at parsing natural language into structured calendar events. Analyze the user's text and return a valid JSON object representing a Google Calendar event resource. The JSON object must include 'summary', 'start', and 'end'. The 'start' and 'end' objects must have a 'dateTime' property in ISO 8601 format. Assume the current year is ${(/* @__PURE__ */ new Date()).getFullYear()}`;
    const userPrompt = `Parse the following text into a Google Calendar event object: "${text}"`;
    const aiResponse = await aiBinding.run("@cf/google/gemma-2-9b-it", {
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }]
    });
    let eventResource;
    try {
      const jsonMatch = aiResponse.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("AI did not return a valid JSON object.");
      eventResource = JSON.parse(jsonMatch[0]);
    } catch (e) {
      throw new Error(`Failed to parse AI response: ${aiResponse.response}`);
    }
    const calendar = getCalendarClient(env);
    const calendarId = env.GOOGLE_CALENDAR_ID || "primary";
    const createdEvent = await calendar.events.insert({
      calendarId,
      requestBody: eventResource
    });
    return new Response(JSON.stringify({ success: true, event: createdEvent.data }), { status: 201 });
  } catch (error) {
    console.error("Google Calendar API POST Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
