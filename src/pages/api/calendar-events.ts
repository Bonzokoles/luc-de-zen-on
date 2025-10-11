
import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

// --- Symulacja dynamicznych danych kalendarza ---

const getEventsForToday = () => {
  const now = new Date();
  const events = [
    {
      id: 1,
      title: "Daily Stand-up Meeting",
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
      location: "Virtual - Zoom",
    },
    {
      id: 2,
      title: "Code Review Session",
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
      location: "Office - Room 3B",
    },
    {
      id: 3,
      title: "Client Presentation Prep",
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 30),
      location: "Focus Work",
    },
    {
      id: 4,
      title: "Client Presentation: AI Demo",
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0),
      location: "Virtual - Google Meet",
    },
  ];
  return events;
};

const generateAIReminders = (events: any[]) => {
  const now = new Date();
  const reminders = [];

  // Find the next upcoming event
  const nextEvent = events.find(event => event.startTime > now);

  if (nextEvent) {
    const timeToNext = (nextEvent.startTime.getTime() - now.getTime()) / (1000 * 60); // in minutes
    if (timeToNext <= 30 && timeToNext > 15) {
      reminders.push({ 
        id: 'rem_1', 
        type: 'info', 
        text: `Zbliża się spotkanie: ${nextEvent.title}.` 
      });
    }
    if (timeToNext <= 15) {
      reminders.push({ 
        id: 'rem_2', 
        type: 'high', 
        text: `Czas na przygotowanie do: ${nextEvent.title}.` 
      });
    }
  }

  // General reminders
  if (now.getHours() >= 12 && now.getHours() < 13) {
      reminders.push({ id: 'rem_3', type: 'low', text: 'Pora na przerwę obiadową.' });
  }

  if (events.filter(e => e.startTime > now).length > 2) {
      reminders.push({ id: 'rem_4', type: 'info', text: 'Masz dzisiaj jeszcze kilka spotkań. Dobrze zarządzaj czasem.' });
  }

  return reminders;
};

export const GET: APIRoute = async () => {
  try {
    const events = getEventsForToday();
    const reminders = generateAIReminders(events);

    const responseData = {
      events: events.map(e => ({
          ...e,
          startTime: e.startTime.toISOString(),
          endTime: e.endTime.toISOString(),
      })),
      reminders,
      syncStatus: {
          google: 'synced',
          outlook: 'synced',
          apple: 'pending'
      }
    };

    return createSuccessResponse(responseData);

  } catch (error) {
    console.error("Błąd w /api/calendar-events:", error);
    return createErrorResponse("Błąd podczas generowania danych kalendarza", 500);
  }
};
