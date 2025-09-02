// API endpoint dla statystyk systemu MyBonzo Admin
export async function GET() {
  const stats = {
    totalVisitors: 12456,
    activeUsers: 45,
    openTickets: 12,
    systemLoad: 78,
    timestamp: new Date().toISOString()
  };

  return new Response(JSON.stringify(stats), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
