// API endpoint dla zarządzania użytkownikami MyBonzo Admin
export async function GET() {
  const users = [
    { 
      id: 1, 
      name: 'Jan Kowalski', 
      email: 'jan.kowalski@example.com', 
      active: true,
      role: 'admin',
      lastLogin: new Date(Date.now() - 3600000).toISOString()
    },
    { 
      id: 2, 
      name: 'Anna Nowak', 
      email: 'anna.nowak@example.com', 
      active: false,
      role: 'user',
      lastLogin: new Date(Date.now() - 86400000).toISOString()
    },
    { 
      id: 3, 
      name: 'Piotr Wiśniewski', 
      email: 'piotr.wisniewski@example.com', 
      active: true,
      role: 'moderator',
      lastLogin: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 4,
      name: 'Maria Kowalczyk',
      email: 'maria.kowalczyk@example.com',
      active: true,
      role: 'user',
      lastLogin: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 5,
      name: 'Tomasz Nowicki',
      email: 'tomasz.nowicki@example.com',
      active: false,
      role: 'user',
      lastLogin: new Date(Date.now() - 259200000).toISOString()
    }
  ];

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
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
