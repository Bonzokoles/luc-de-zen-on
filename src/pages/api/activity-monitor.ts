import type { APIRoute } from 'astro';
import { Logging } from '@google-cloud/logging';

// Helper to get secrets
function getEnv(locals: App.Locals): Record<string, any> {
  return import.meta.env.DEV ? process.env : locals?.runtime?.env || {};
}

let logging: Logging;

// Initialize the Logging client
function initializeLogging(env: Record<string, any>) {
  if (logging) return;

  const projectId = env.GCP_PROJECT_ID;
  const keyJson = env.GCP_SERVICE_ACCOUNT_KEY;

  if (!projectId || !keyJson) {
    throw new Error('GCP_PROJECT_ID and GCP_SERVICE_ACCOUNT_KEY must be configured.');
  }

  let credentials;
  try {
    credentials = JSON.parse(keyJson);
  } catch (e) {
    throw new Error('GCP_SERVICE_ACCOUNT_KEY is not valid JSON.');
  }

  logging = new Logging({ projectId, credentials });
  console.log('Cloud Logging client initialized successfully.');
}

// --- GET: List log entries ---
export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const env = getEnv(locals);
    initializeLogging(env);

    const logName = env.GCP_LOG_NAME || 'my-bonzo-app-log'; // Default log name
    const type = url.searchParams.get('type')?.toUpperCase();
    
    let filter = `logName="projects/${env.GCP_PROJECT_ID}/logs/${logName}"`;
    if (type && ['INFO', 'WARNING', 'ERROR', 'DEBUG', 'NOTICE'].includes(type)) {
        filter += ` AND severity="${type}"`;
    }

    const [entries] = await logging.getEntries({
      filter: filter,
      pageSize: 50,
      orderBy: 'timestamp desc',
    });

    const formattedLogs = entries.map(entry => {
      const payload = entry.jsonPayload?.fields || {};
      return {
        id: entry.insertId,
        action: payload.action?.stringValue || 'Generic Log',
        userId: payload.userId?.stringValue,
        timestamp: new Date(entry.metadata.timestamp as string).getTime(),
        details: payload.details?.structValue?.fields || { message: entry.textPayload },
        type: (entry.metadata.severity as string || 'info').toLowerCase(),
        source: entry.resource.type,
      }
    });
    
    // In a real app, stats would be calculated from a larger dataset or a monitoring service
    const stats = {
        total: formattedLogs.length,
        errors: formattedLogs.filter(l => l.type === 'error').length,
        warnings: formattedLogs.filter(l => l.type === 'warning').length,
        info: formattedLogs.filter(l => l.type === 'info').length,
        lastHour: formattedLogs.filter(l => l.timestamp > Date.now() - 3600000).length,
        sources: [...new Set(formattedLogs.map(l => l.source))],
        anomalies: formattedLogs.filter(l => l.type === 'error').length > 5
    };

    return new Response(JSON.stringify({ success: true, logs: formattedLogs, stats }), { status: 200 });

  } catch (error) {
    console.error('Activity Monitor GET Error:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};

// --- POST: Write a new log entry ---
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    initializeLogging(env);

    const logName = env.GCP_LOG_NAME || 'my-bonzo-app-log';
    const log = logging.log(logName);

    const { action, details, type = 'INFO', userId } = await request.json();

    if (!action) {
        return new Response(JSON.stringify({ success: false, message: 'Action is required.' }), { status: 400 });
    }

    const metadata = {
      resource: { type: 'global' }, // Or more specific resource
      severity: type.toUpperCase(),
    };

    const entry = log.entry(metadata, { action, userId, details });
    await log.write(entry);

    return new Response(JSON.stringify({ success: true, message: 'Activity logged' }), { status: 200 });

  } catch (error) {
    console.error('Activity Monitor POST Error:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};
