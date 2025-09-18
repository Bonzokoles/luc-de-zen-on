if (typeof MessageChannel === 'undefined') {
  class __PolyfillPort {
    constructor(){ this.onmessage = null; }
    postMessage(data){ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> this.onmessage && this.onmessage(e)); }
    start(){} close(){}
  }
  class MessageChannel {
    constructor(){
      this.port1 = new __PolyfillPort();
      this.port2 = new __PolyfillPort();
      const dispatch = (target, data)=>{ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> target.onmessage && target.onmessage(e)); };
      this.port1.postMessage = (d)=> dispatch(this.port2, d);
      this.port2.postMessage = (d)=> dispatch(this.port1, d);
    }
  }
  globalThis.MessageChannel = MessageChannel;
}
export { d as renderers } from '../../../chunks/vendor_CYa9XZjz.mjs';

async function GET() {
  const logs = [
    {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      level: "INFO",
      message: "System uruchomiony pomyślnie",
      component: "SYSTEM"
    },
    {
      timestamp: new Date(Date.now() - 3e5).toISOString(),
      level: "INFO",
      message: "Zalogowano administratora do panelu",
      component: "AUTH"
    },
    {
      timestamp: new Date(Date.now() - 6e5).toISOString(),
      level: "WARNING",
      message: "Wysokie obciążenie serwera API (78%)",
      component: "PERFORMANCE"
    },
    {
      timestamp: new Date(Date.now() - 9e5).toISOString(),
      level: "INFO",
      message: "Wykonano backup bazy danych",
      component: "DATABASE"
    },
    {
      timestamp: new Date(Date.now() - 12e5).toISOString(),
      level: "ERROR",
      message: "Błąd połączenia z zewnętrznym API",
      component: "API"
    },
    {
      timestamp: new Date(Date.now() - 15e5).toISOString(),
      level: "INFO",
      message: "Wdrożono nowe funkcje AI",
      component: "DEPLOYMENT"
    },
    {
      timestamp: new Date(Date.now() - 18e5).toISOString(),
      level: "INFO",
      message: "Automatyczne odświeżenie workers",
      component: "WORKERS"
    },
    {
      timestamp: new Date(Date.now() - 21e5).toISOString(),
      level: "WARNING",
      message: "Przekroczono limit zapytań dla użytkownika",
      component: "RATE_LIMIT"
    }
  ];
  return new Response(JSON.stringify(logs), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
async function POST({ request }) {
  try {
    const logData = await request.json();
    const newLog = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      level: logData.level || "INFO",
      message: logData.message,
      component: logData.component || "SYSTEM",
      userId: logData.userId || null
    };
    return new Response(JSON.stringify({
      success: true,
      message: "Log zapisany pomyślnie",
      log: newLog
    }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid log data" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
