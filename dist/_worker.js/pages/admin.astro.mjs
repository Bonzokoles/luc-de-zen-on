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
import { c as createComponent, r as renderComponent, a as renderTemplate, b as renderScript, m as maybeRenderHead } from '../chunks/vendor_DlPT8CWO.mjs';
export { d as renderers } from '../chunks/vendor_DlPT8CWO.mjs';
import { $ as $$UniversalPageLayout, a as $$GlassPanel, b as $$CyberpunkButton } from '../chunks/CyberpunkButton_B7SUA2GB.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const pageTitle = "Dashboard Admin | MyBonzo";
  const pageDescription = "G\u0142\xF3wny panel administracyjny systemu MyBonzo AI";
  const pageQuote = "Kontrola i zarz\u0105dzanie systemem w jednym miejscu.";
  const pageAuthor = "MyBonzo Team";
  return renderTemplate`${renderComponent($$result, "UniversalPageLayout", $$UniversalPageLayout, { "pageTitle": pageTitle, "pageDescription": pageDescription, "pageQuote": pageQuote, "pageAuthor": pageAuthor, "showRandomQuote": false }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u{1F3E0} Centrum Administracyjne MyBonzo", "variant": "highlight", "padding": "xl" }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<div style="text-align: center; margin-bottom: 30px;"> <div style="color: rgba(255,255,255,0.9); font-size: 1.2rem; margin-bottom: 20px;">
Witaj w centrum kontroli systemu MyBonzo AI. Wybierz obszar zarządzania:
</div> </div> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-bottom: 30px;"> <!-- Quick Login Panel --> <div style="background: rgba(0,217,255,0.1); border: 2px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 25px; text-align: center;"> <div style="font-size: 3rem; margin-bottom: 15px;">🔐</div> <h3 style="color: #00d9ff; margin-bottom: 15px; font-size: 1.4rem;">Panel Logowania</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">
Szybki dostęp do panelu administracyjnego z autoryzacją
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Przejd\u017A do logowania", "variant": "primary", "size": "md", "onclick": "window.location.href='/admin/login'" })} </div> <!-- Advanced Dashboard --> <div style="background: rgba(0,217,255,0.1); border: 2px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 25px; text-align: center;"> <div style="font-size: 3rem; margin-bottom: 15px;">📊</div> <h3 style="color: #00d9ff; margin-bottom: 15px; font-size: 1.4rem;">Zaawansowany Dashboard</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">
Kompleksowy panel z monitoringiem i zarządzaniem
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Otw\xF3rz Dashboard", "variant": "primary", "size": "md", "onclick": "window.location.href='/admin/dashboard'" })} </div> <!-- Admin AI Assistant --> <div style="background: rgba(0,217,255,0.1); border: 2px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 25px; text-align: center;"> <div style="font-size: 3rem; margin-bottom: 15px;">🤖</div> <h3 style="color: #00d9ff; margin-bottom: 15px; font-size: 1.4rem;">Admin AI Assistant</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">
Inteligentny asystent dla zadań administracyjnych
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Rozpocznij Chat", "variant": "primary", "size": "md", "onclick": "window.location.href='/admin/ai-chat'" })} </div> </div> ` })}  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u26A1 Szybki dost\u0119p", "variant": "default", "padding": "lg" }, { "default": async ($$result3) => renderTemplate` <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;"> <!-- System Monitoring --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
📊 <span style="margin-left: 10px;">Monitoring systemu</span> </h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Monitoruj wydajność, status workerów i logi systemowe
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zobacz status", "variant": "outline", "size": "sm", "onclick": "window.location.href='/admin/monitoring'" })} </div> <!-- User Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
👥 <span style="margin-left: 10px;">Zarządzanie użytkownikami</span> </h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Przeglądaj, edytuj i zarządzaj kontami użytkowników
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zarz\u0105dzaj", "variant": "outline", "size": "sm", "onclick": "window.location.href='/admin/users'" })} </div> <!-- AI Models --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
🤖 <span style="margin-left: 10px;">Modele AI</span> </h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Konfiguruj i zarządzaj modelami sztucznej inteligencji
</p> <div style="display: flex; gap: 8px;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Konfiguruj", "variant": "outline", "size": "sm", "onclick": "window.location.href='/admin/ai-models'" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "AI Chat", "variant": "primary", "size": "sm", "onclick": "window.location.href='/admin/ai-chat'" })} </div> </div> <!-- Security Center --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
🔒 <span style="margin-left: 10px;">Centrum bezpieczeństwa</span> </h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Konfiguruj zabezpieczenia i kontrolę dostępu
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zabezpieczenia", "variant": "outline", "size": "sm", "onclick": "window.location.href='/admin/security'" })} </div> <!-- Database Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
🗄️ <span style="margin-left: 10px;">Baza danych</span> </h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Zarządzaj bazą danych i wykonuj kopie zapasowe
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zarz\u0105dzaj", "variant": "outline", "size": "sm", "onclick": "window.location.href='/admin/database'" })} </div> <!-- API Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
🔌 <span style="margin-left: 10px;">API Management</span> </h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Zarządzaj kluczami API i limitami zapytań
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Konfiguruj API", "variant": "outline", "size": "sm", "onclick": "window.location.href='/admin/api'" })} </div> </div> ` })}  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u{1F4C8} Przegl\u0105d systemu", "variant": "success", "padding": "lg" }, { "default": async ($$result3) => renderTemplate` <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;"> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="systemStatus">🟢 ONLINE</div> <div style="color: rgba(255,255,255,0.7);">Status systemu</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="activeWorkers">8/10</div> <div style="color: rgba(255,255,255,0.7);">Aktywne workery</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="uptime">99.8%</div> <div style="color: rgba(255,255,255,0.7);">Uptime 24h</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="totalRequests">12.4k</div> <div style="color: rgba(255,255,255,0.7);">Zapytania dzisiaj</div> </div> </div> <div style="text-align: center; margin-top: 25px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F504} Od\u015Bwie\u017C dane", "variant": "outline", "size": "md", "onclick": "updateSystemStats()" })} </div> ` })} ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/admin/index.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
