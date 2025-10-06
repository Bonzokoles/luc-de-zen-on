globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_D_xeYX_3.mjs';

function upgradeToWebSocket(request) {
  const upgradeHeader = request.headers.get("upgrade");
  if (upgradeHeader !== "websocket") {
    return new Response("Expected websocket upgrade", { status: 400 });
  }
  const WebSocketPairCtor = globalThis.WebSocketPair;
  if (!WebSocketPairCtor) {
    return new Response("WebSocketPair not available in this environment", { status: 500 });
  }
  const pair = new WebSocketPairCtor();
  const [client, server] = Object.values(pair);
  server.accept?.();
  let metricsInterval = null;
  server.addEventListener("message", async (event) => {
    try {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "configure":
          server.send(JSON.stringify({
            type: "configured",
            sessionId: crypto.randomUUID(),
            timestamp: Date.now()
          }));
          break;
        case "start_recording":
          server.send(JSON.stringify({ type: "recording_started", timestamp: Date.now() }));
          metricsInterval = setInterval(() => {
            server.send(JSON.stringify({
              type: "metrics",
              metrics: {
                volume: Math.random() * 100,
                rms: Math.random() * 50,
                peak: Math.random() * 80,
                voiceActive: Math.random() > 0.7,
                latency: 200 + Math.random() * 300,
                quality: "good",
                timestamp: Date.now()
              }
            }));
          }, 1e3);
          break;
        case "stop_recording":
          if (metricsInterval) {
            clearInterval(metricsInterval);
            metricsInterval = null;
          }
          server.send(JSON.stringify({ type: "recording_stopped", timestamp: Date.now() }));
          break;
        case "audio_data":
          server.send(JSON.stringify({
            type: "transcription",
            text: "Przykładowa transkrypcja audio...",
            timestamp: Date.now()
          }));
          break;
        default:
          server.send(JSON.stringify({ type: "error", message: `Unknown message type: ${data.type}` }));
      }
    } catch (error) {
      server.send(JSON.stringify({ type: "error", message: `Failed to process message: ${error?.message || error}` }));
    }
  });
  server.addEventListener("close", () => {
    if (metricsInterval) {
      clearInterval(metricsInterval);
      metricsInterval = null;
    }
  });
  return new Response(null, { status: 101, webSocket: client });
}
const GET = async ({ request }) => {
  return upgradeToWebSocket(request);
};
const POST = async ({ request }) => {
  return upgradeToWebSocket(request);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
