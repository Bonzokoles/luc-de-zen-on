// API endpoint dla logów systemu MyBonzo Admin

interface LogPayload {
  level?: string;
  message: string;
  component?: string;
  userId?: string;
}

export async function GET() {
  const logs = [
    { 
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: 'System uruchomiony pomyślnie',
      component: 'SYSTEM'
    },
    { 
      timestamp: new Date(Date.now() - 300000).toISOString(),
      level: 'INFO',
      message: 'Zalogowano administratora do panelu',
      component: 'AUTH'
    },
    { 
      timestamp: new Date(Date.now() - 600000).toISOString(),
      level: 'WARNING',
      message: 'Wysokie obciążenie serwera API (78%)',
      component: 'PERFORMANCE'
    },
    { 
      timestamp: new Date(Date.now() - 900000).toISOString(),
      level: 'INFO',
      message: 'Wykonano backup bazy danych',
      component: 'DATABASE'
    },
    { 
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      level: 'ERROR',
      message: 'Błąd połączenia z zewnętrznym API',
      component: 'API'
    },
    { 
      timestamp: new Date(Date.now() - 1500000).toISOString(),
      level: 'INFO',
      message: 'Wdrożono nowe funkcje AI',
      component: 'DEPLOYMENT'
    },
    { 
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      level: 'INFO',
      message: 'Automatyczne odświeżenie workers',
      component: 'WORKERS'
    },
    { 
      timestamp: new Date(Date.now() - 2100000).toISOString(),
      level: 'WARNING',
      message: 'Przekroczono limit zapytań dla użytkownika',
      component: 'RATE_LIMIT'
    }
  ];

  return new Response(JSON.stringify(logs), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function POST({ request }: { request: Request }) {
  try {
    const logData: LogPayload = await request.json();
    
    // Symulacja dodania nowego loga
    const newLog = {
      timestamp: new Date().toISOString(),
      level: logData.level || 'INFO',
      message: logData.message,
      component: logData.component || 'SYSTEM',
      userId: logData.userId || null
    };

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Log zapisany pomyślnie',
      log: newLog 
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid log data' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
