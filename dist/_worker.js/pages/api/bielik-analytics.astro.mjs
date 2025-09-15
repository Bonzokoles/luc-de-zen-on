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
export { d as renderers } from '../../chunks/vendor_QZhDtzeH.mjs';

const OPTIONS = () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};
const GET = () => {
  const bielikStats = {
    total_requests: 2847,
    requests_last_24h: 156,
    requests_last_7d: 892,
    avg_response_time: 1243,
    success_rate: 98.7,
    model_versions: {
      "bielik-7b-instruct": { requests: 1825, avg_tokens: 342 },
      "bielik-13b-instruct": { requests: 721, avg_tokens: 487 },
      "bielik-70b-instruct": { requests: 301, avg_tokens: 612 }
    },
    top_use_cases: [
      { name: "Odpowiedzi na pytania", count: 1247, percentage: 43.8 },
      { name: "Tłumaczenia", count: 542, percentage: 19 },
      { name: "Analiza tekstu", count: 398, percentage: 14 },
      { name: "Zadania programistyczne", count: 287, percentage: 10.1 },
      { name: "Kreatywne pisanie", count: 189, percentage: 6.6 },
      { name: "Inne", count: 184, percentage: 6.5 }
    ],
    language_stats: {
      polish: 89.3,
      english: 8.7,
      mixed: 2
    },
    total_tokens: 1247832,
    tokens_last_24h: 67234,
    error_rate: 1.3,
    active_users_24h: 89,
    worker_status: "active",
    last_updated: (/* @__PURE__ */ new Date()).toISOString()
  };
  return new Response(JSON.stringify(bielikStats), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
