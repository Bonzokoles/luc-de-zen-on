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
const isNodeEnvironment = typeof process !== "undefined" && process.env;
const API_KEYS = {
  // OpenAI dla generowania FAQ i AI funkcji
  OPENAI_API_KEY: isNodeEnvironment ? process.env.OPENAI_API_KEY || "" : "",
  // Flowise dla automatyzacji workflow
  FLOWISE_API_TOKEN: isNodeEnvironment ? process.env.FLOWISE_API_TOKEN || "" : "",
  // ActivePieces dla powiadomień i automatyzacji
  ACTIVEPIECES_API_KEY: isNodeEnvironment ? process.env.ACTIVEPIECES_API_KEY || "" : "",
  // Cloudflare dla Workers i deployment
  CLOUDFLARE_API_TOKEN: isNodeEnvironment ? process.env.CLOUDFLARE_API_TOKEN || "" : "",
  CLOUDFLARE_ACCOUNT_ID: isNodeEnvironment ? process.env.CLOUDFLARE_ACCOUNT_ID || "" : "",
  // Inne integracje
  GITHUB_TOKEN: isNodeEnvironment ? process.env.GITHUB_TOKEN || "" : "",
  WEBHOOK_SECRET: isNodeEnvironment ? process.env.WEBHOOK_SECRET || "" : "",
  // Email/SMS dla powiadomień
  EMAIL_API_KEY: isNodeEnvironment ? process.env.EMAIL_API_KEY || "" : "",
  SMS_API_KEY: isNodeEnvironment ? process.env.SMS_API_KEY || "" : "",
  // Database i storage
  DATABASE_URL: isNodeEnvironment ? process.env.DATABASE_URL || "" : "",
  STORAGE_API_KEY: isNodeEnvironment ? process.env.STORAGE_API_KEY || "" : ""
};
function validateRequiredKeys() {
  const required = ["OPENAI_API_KEY"];
  const missing = [];
  required.forEach((key) => {
    if (!API_KEYS[key]) {
      missing.push(key);
    }
  });
  if (missing.length > 0 && isNodeEnvironment) {
    console.warn(`⚠️  Brakuje kluczy API: ${missing.join(", ")}`);
    console.warn("Niektóre funkcje mogą nie działać poprawnie.");
  }
  return missing.length === 0;
}
function getApiKey(keyName) {
  const key = API_KEYS[keyName];
  if (!key) {
    throw new Error(`Klucz API '${keyName}' nie został skonfigurowany`);
  }
  return key;
}
if (isNodeEnvironment) {
  validateRequiredKeys();
  console.log("🔑 System zarządzania kluczami API załadowany");
}

export { getApiKey as g };
