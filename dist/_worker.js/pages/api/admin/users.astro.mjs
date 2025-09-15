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
export { d as renderers } from '../../../chunks/vendor_QZhDtzeH.mjs';

async function GET() {
  const users = [
    {
      id: 1,
      name: "Jan Kowalski",
      email: "jan.kowalski@example.com",
      active: true,
      role: "admin",
      lastLogin: new Date(Date.now() - 36e5).toISOString()
    },
    {
      id: 2,
      name: "Anna Nowak",
      email: "anna.nowak@example.com",
      active: false,
      role: "user",
      lastLogin: new Date(Date.now() - 864e5).toISOString()
    },
    {
      id: 3,
      name: "Piotr Wiśniewski",
      email: "piotr.wisniewski@example.com",
      active: true,
      role: "moderator",
      lastLogin: new Date(Date.now() - 72e5).toISOString()
    },
    {
      id: 4,
      name: "Maria Kowalczyk",
      email: "maria.kowalczyk@example.com",
      active: true,
      role: "user",
      lastLogin: new Date(Date.now() - 18e5).toISOString()
    },
    {
      id: 5,
      name: "Tomasz Nowicki",
      email: "tomasz.nowicki@example.com",
      active: false,
      role: "user",
      lastLogin: new Date(Date.now() - 2592e5).toISOString()
    }
  ];
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
async function POST({ request }) {
  try {
    const userData = await request.json();
    const newUser = {
      id: Math.floor(Math.random() * 1e4),
      name: userData.name,
      email: userData.email,
      active: userData.active || true,
      role: userData.role || "user",
      lastLogin: null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request data" }), {
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
