// API endpoint dla zarządzania użytkownikami MyBonzo Admin
export async function GET({ request }: { request: Request }) {
  // Sprawdzenie autoryzacji
  const auth = request.headers.get('authorization') || '';
  const isAuth = auth.includes('HAOS77');
  
  if (!isAuth) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  
  try {
    // Tymczasowe dane użytkowników - zastąp prawdziwą bazą danych
    const usersData = [
      { 
        id: 1, 
        username: 'bonzo.admin',
        name: 'Bonzo Admin', 
        email: 'admin@mybonzo.com', 
        active: true,
        role: 'admin',
        lastLogin: new Date().toISOString()
      },
      { 
        id: 2, 
        username: 'user.demo',
        name: 'Demo User', 
        email: 'demo@mybonzo.com', 
        active: true,
        role: 'user',
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      { 
        id: 3, 
        username: 'test.account',
        name: 'Test Account', 
        email: 'test@mybonzo.com', 
        active: false,
        role: 'user',
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const userData = {
      users: usersData.map((user: any) => ({
        id: user.id,
        username: user.username || user.name,
        email: user.email,
        status: user.active ? 'active' : 'inactive',
        role: user.role,
        lastActivity: new Date(user.lastLogin).toLocaleDateString('pl-PL')
      })),
      totalCount: usersData.length,
      activeCount: usersData.filter((u: any) => u.active).length,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(userData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const userData = await request.json();
    
    // Symulacja utworzenia nowego użytkownika
    const newUser = {
      id: Math.floor(Math.random() * 10000),
      name: userData.name,
      email: userData.email,
      active: userData.active || true,
      role: userData.role || 'user',
      lastLogin: null,
      createdAt: new Date().toISOString()
    };

    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request data' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
