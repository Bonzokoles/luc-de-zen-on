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
export { d as renderers } from '../../../chunks/vendor_DCrrhcp4.mjs';

async function GET() {
  const queries = [
    {
      id: 1,
      user: "Jan Kowalski",
      text: "Jak działa funkcja personalizowanych rekomendacji?",
      date: new Date(Date.now() - 3e5).toISOString(),
      status: "pending"
    },
    {
      id: 2,
      user: "Anna Nowak",
      text: "Problem z logowaniem do systemu AI",
      date: new Date(Date.now() - 6e5).toISOString(),
      status: "resolved"
    },
    {
      id: 3,
      user: "Piotr Wiśniewski",
      text: "Prośba o zwiększenie limitów API",
      date: new Date(Date.now() - 9e5).toISOString(),
      status: "in_progress"
    },
    {
      id: 4,
      user: "Maria Kowalczyk",
      text: "Błąd w generatorze treści marketingowych",
      date: new Date(Date.now() - 12e5).toISOString(),
      status: "pending"
    }
  ];
  return new Response(JSON.stringify(queries), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
