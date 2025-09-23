// API endpoint dla ostatnich zapytań użytkowników MyBonzo Admin
export async function GET() {
  const queries = [
    { 
      id: 1, 
      user: 'Jan Kowalski', 
      text: 'Jak działa funkcja personalizowanych rekomendacji?', 
      date: new Date(Date.now() - 300000).toISOString(),
      status: 'pending'
    },
    { 
      id: 2, 
      user: 'Anna Nowak', 
      text: 'Problem z logowaniem do systemu AI', 
      date: new Date(Date.now() - 600000).toISOString(),
      status: 'resolved'
    },
    { 
      id: 3, 
      user: 'Piotr Wiśniewski', 
      text: 'Prośba o zwiększenie limitów API', 
      date: new Date(Date.now() - 900000).toISOString(),
      status: 'in_progress'
    },
    {
      id: 4,
      user: 'Maria Kowalczyk',
      text: 'Błąd w generatorze treści marketingowych',
      date: new Date(Date.now() - 1200000).toISOString(),
      status: 'pending'
    }
  ];

  return new Response(JSON.stringify(queries), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
