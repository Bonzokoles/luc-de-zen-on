export async function GET({ request }: { request: Request }) {
  const auth = request.headers.get('authorization') || '';
  if (!auth.includes('HAOS77')) {
    // Demo: zwróć ograniczone dane bez 401, by UI nie psuć
    return json({ services: [], system: { mode: 'demo' } });
  }

  const services = [
    { name: 'API Gateway', status: 'online', responseTime: 42 },
    { name: 'Workers Manager', status: 'online', responseTime: 57 },
    { name: 'Image Service', status: 'degraded', responseTime: 180 }
  ];

  const system = {
    env: 'local',
    version: '1.0.0',
    time: new Date().toISOString()
  };

  return json({ services, system });
}

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    ...init
  });
}
