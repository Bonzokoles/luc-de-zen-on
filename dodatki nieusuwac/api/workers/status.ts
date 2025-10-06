// API endpoint for workers status
export async function GET() {
  return new Response(JSON.stringify({
    status: "online",
    workers: {
      "ai-bot": "active",
      "image-generator": "active", 
      "agents-api": "active"
    },
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
}
