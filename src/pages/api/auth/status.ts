// API endpoint for auth status
export async function GET() {
  try {
    return new Response(JSON.stringify({
      status: "authenticated",
      user: "guest",
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Auth status error:', error);
    return new Response(JSON.stringify({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
}
