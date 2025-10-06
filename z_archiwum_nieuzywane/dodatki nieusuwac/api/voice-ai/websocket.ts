// Enhanced WebSocket API endpoint for Voice AI with Cloudflare Workers AI
import type { APIRoute } from 'astro';

function upgradeToWebSocket(request: Request): Response {
  const upgradeHeader = request.headers.get('upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket upgrade', { status: 400 });
  }

  // Create WebSocket pair (Cloudflare specific)
  const WebSocketPairCtor = (globalThis as any).WebSocketPair;
  if (!WebSocketPairCtor) {
    return new Response('WebSocketPair not available in this environment', { status: 500 });
  }
  const pair = new WebSocketPairCtor();
  const [client, server] = Object.values(pair) as [WebSocket, WebSocket];

  // Accept WebSocket connection (Cloudflare specific)
  (server as any).accept?.();

  let metricsInterval: ReturnType<typeof setInterval> | null = null;

  server.addEventListener('message', async (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data as string);
      switch (data.type) {
        case 'configure':
          server.send(JSON.stringify({
            type: 'configured',
            sessionId: crypto.randomUUID(),
            timestamp: Date.now(),
          }));
          break;
        case 'start_recording':
          server.send(JSON.stringify({ type: 'recording_started', timestamp: Date.now() }));
          // Start simulated metrics interval
          metricsInterval = setInterval(() => {
            server.send(JSON.stringify({
              type: 'metrics',
              metrics: {
                volume: Math.random() * 100,
                rms: Math.random() * 50,
                peak: Math.random() * 80,
                voiceActive: Math.random() > 0.7,
                latency: 200 + Math.random() * 300,
                quality: 'good',
                timestamp: Date.now(),
              },
            }));
          }, 1000);
          break;
        case 'stop_recording':
          if (metricsInterval) {
            clearInterval(metricsInterval);
            metricsInterval = null;
          }
          server.send(JSON.stringify({ type: 'recording_stopped', timestamp: Date.now() }));
          break;
        case 'audio_data':
          // TODO: Integrate with actual AI processing
          server.send(JSON.stringify({
            type: 'transcription',
            text: 'Przykładowa transkrypcja audio...',
            timestamp: Date.now(),
          }));
          break;
        default:
          server.send(JSON.stringify({ type: 'error', message: `Unknown message type: ${data.type}` }));
      }
    } catch (error: any) {
      server.send(JSON.stringify({ type: 'error', message: `Failed to process message: ${error?.message || error}` }));
    }
  });

  server.addEventListener('close', () => {
    if (metricsInterval) {
      clearInterval(metricsInterval);
      metricsInterval = null;
    }
  });

  return new Response(null as any, { status: 101, webSocket: client } as any);
}

export const GET: APIRoute = async ({ request }) => {
  // Standard browser WebSocket handshakes use GET
  return upgradeToWebSocket(request);
};

export const POST: APIRoute = async ({ request }) => {
  // Allow POST as well (for flexibility), but still require upgrade
  return upgradeToWebSocket(request);
};
