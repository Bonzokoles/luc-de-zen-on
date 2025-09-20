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
/* empty css                                  */
import { c as createComponent, e as renderHead, b as renderScript, a as renderTemplate } from '../chunks/astro/server_xZvTY01m.mjs';
/* empty css                                      */
export { r as renderers } from '../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const $$TestAgent = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="pl" data-astro-cid-jm2rxbbk> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>MyBonzo Agent Test</title>${renderHead()}</head> <body data-astro-cid-jm2rxbbk> <div class="container" data-astro-cid-jm2rxbbk> <h1 data-astro-cid-jm2rxbbk>🤖 MyBonzo Agent Integration Test</h1> <div class="test-section" data-astro-cid-jm2rxbbk> <h2 data-astro-cid-jm2rxbbk>🔗 Agent Connection Test</h2> <button class="test-button" onclick="testConnection()" data-astro-cid-jm2rxbbk>Test Connection</button> <div id="connection-result" class="result" style="display: none;" data-astro-cid-jm2rxbbk></div> </div> <div class="test-section" data-astro-cid-jm2rxbbk> <h2 data-astro-cid-jm2rxbbk>💬 Chat Test</h2> <input type="text" id="chat-message" placeholder="Napisz wiadomość..." style="width: 70%; padding: 10px; background: #0a0a0a; border: 1px solid #00fff3; color: #00fff3; border-radius: 5px; margin-right: 10px;" data-astro-cid-jm2rxbbk> <button class="test-button" onclick="testChat()" data-astro-cid-jm2rxbbk>Send Chat</button> <div id="chat-result" class="result" style="display: none;" data-astro-cid-jm2rxbbk></div> </div> <div class="test-section" data-astro-cid-jm2rxbbk> <h2 data-astro-cid-jm2rxbbk>📊 Status Test</h2> <button class="test-button" onclick="testStatus()" data-astro-cid-jm2rxbbk>Get Status</button> <div id="status-result" class="result" style="display: none;" data-astro-cid-jm2rxbbk></div> </div> <div class="test-section" data-astro-cid-jm2rxbbk> <h2 data-astro-cid-jm2rxbbk>🎯 Task Test</h2> <button class="test-button" onclick="testTask('research', {topic: 'AI w 2025'})" data-astro-cid-jm2rxbbk>Research Task</button> <button class="test-button" onclick="testTask('creative', {prompt: 'futurystyczne miasto', style: 'cyberpunk'})" data-astro-cid-jm2rxbbk>Creative Task</button> <button class="test-button" onclick="testTask('code', {request: 'React component example'})" data-astro-cid-jm2rxbbk>Code Task</button> <div id="task-result" class="result" style="display: none;" data-astro-cid-jm2rxbbk></div> </div> <div class="test-section" data-astro-cid-jm2rxbbk> <h2 data-astro-cid-jm2rxbbk>🖼️ Image Generation Test</h2> <input type="text" id="image-prompt" placeholder="Opisz obraz do wygenerowania..." style="width: 70%; padding: 10px; background: #0a0a0a; border: 1px solid #00fff3; color: #00fff3; border-radius: 5px; margin-right: 10px;" data-astro-cid-jm2rxbbk> <button class="test-button" onclick="testImageGeneration()" data-astro-cid-jm2rxbbk>Generate Image</button> <div id="image-result" class="result" style="display: none;" data-astro-cid-jm2rxbbk></div> </div> </div> ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/test-agent.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/test-agent.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/test-agent.astro";
const $$url = "/test-agent";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$TestAgent,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
