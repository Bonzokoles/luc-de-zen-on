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
export { d as renderers } from '../../../chunks/vendor_BHZTJLV0.mjs';

async function GET({ request }) {
  const auth = request.headers.get("authorization") || "";
  const isAuth = auth.includes("HAOS77");
  if (!isAuth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const usersData = [
      {
        id: 1,
        username: "bonzo.admin",
        name: "Bonzo Admin",
        email: "admin@mybonzo.com",
        active: true,
        role: "admin",
        lastLogin: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: 2,
        username: "user.demo",
        name: "Demo User",
        email: "demo@mybonzo.com",
        active: true,
        role: "user",
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString()
      },
      {
        id: 3,
        username: "test.account",
        name: "Test Account",
        email: "test@mybonzo.com",
        active: false,
        role: "user",
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3).toISOString()
      }
    ];
    const userData = {
      users: usersData.map((user) => ({
        id: user.id,
        username: user.username || user.name,
        email: user.email,
        status: user.active ? "active" : "inactive",
        role: user.role,
        lastActivity: new Date(user.lastLogin).toLocaleDateString("pl-PL")
      })),
      totalCount: usersData.length,
      activeCount: usersData.filter((u) => u.active).length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Response(JSON.stringify(userData), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
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
