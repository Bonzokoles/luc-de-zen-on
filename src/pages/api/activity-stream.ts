
import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

// --- Symulacja dynamicznych danych ---

const eventTemplates = [
  { type: 'success', message: 'User login: {email}' },
  { type: 'warning', message: 'API rate limit warning: {api}' },
  { type: 'threat', message: 'Failed authentication attempt from IP: {ip}' },
  { type: 'info', message: 'New user registration: {email}' },
  { type: 'alert', message: 'High CPU usage detected on server: {server}' },
  { type: 'success', message: 'Data export completed: {report}' },
];

const randomData = {
  emails: ['admin@techcorp.pl', 'j.kowalski@gmail.com', 'anna.z@example.com', 'test@mybonzo.com'],
  apis: ['/api/chat', '/api/generate-image', '/api/tavily/search'],
  ips: ['185.1.2.3 (RU)', '102.5.6.7 (CN)', '99.1.8.2 (US)'],
  servers: ['worker-1', 'worker-2', 'worker-3'],
  reports: ['Q3_Sales.csv', 'User_Activity.pdf', 'Marketing_Campaign.xlsx'],
};

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomEvent() {
  const template = getRandomElement(eventTemplates);
  let message = template.message;

  message = message.replace('{email}', getRandomElement(randomData.emails));
  message = message.replace('{api}', getRandomElement(randomData.apis));
  message = message.replace('{ip}', getRandomElement(randomData.ips));
  message = message.replace('{server}', getRandomElement(randomData.servers));
  message = message.replace('{report}', getRandomElement(randomData.reports));

  return {
    type: template.type,
    message: message,
    details: `Location: ${getRandomElement(['Warszawa, PL', 'New York, US', 'Berlin, DE'])} | Client: app.mybonzo.com`,
    time: `${Math.floor(Math.random() * 59)}s ago`
  };
}

export const GET: APIRoute = async () => {
  try {
    // Generuj 5 losowych zdarzeń na potrzeby symulacji
    const liveFeed = Array.from({ length: 5 }, generateRandomEvent);

    // Generuj losowe statystyki
    const stats = {
      activeUsers: Math.floor(2000 + Math.random() * 1000),
      eventsPerMin: Math.floor(15000 + Math.random() * 5000),
      threatsBlocked: Math.floor(200 + Math.random() * 100),
      systemLoad: Math.random() > 0.8 ? 'High' : 'Normal',
    };

    return createSuccessResponse({ stats, feed: liveFeed });

  } catch (error) {
    console.error("Błąd w /api/activity-stream:", error);
    return createErrorResponse("Błąd podczas generowania strumienia aktywności", 500);
  }
};
