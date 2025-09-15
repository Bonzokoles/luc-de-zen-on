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
import { c as createComponent, a as renderTemplate, m as maybeRenderHead, r as renderComponent, b as renderScript } from '../chunks/vendor_QZhDtzeH.mjs';
export { d as renderers } from '../chunks/vendor_QZhDtzeH.mjs';
import { $ as $$UniversalPageLayout, a as $$GlassPanel, b as $$CyberpunkButton } from '../chunks/CyberpunkButton_DXYzsUGS.mjs';
import { $ as $$RandomPolishFonts, a as $$PolishAdminStyles } from '../chunks/PolishAdminStyles_DMeNoAhy.mjs';
/* empty css                                 */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$PolishFontsDemo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", `<div class="polish-fonts-demo" style="margin: 20px 0; padding: 20px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px;" data-astro-cid-dpzbftxb> <h3 style="color: #00d9ff; margin-bottom: 20px; text-align: center;" data-astro-cid-dpzbftxb>
\u{1F3A8} Demo Polskich Font\xF3w w Admin Panelu
</h3> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;" data-astro-cid-dpzbftxb> <!-- Neuropol Demo --> <div style="background: rgba(220,20,60,0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(220,20,60,0.3);" data-astro-cid-dpzbftxb> <h4 style="font-family: 'Neuropol', system-ui, sans-serif; color: #dc143c; margin-bottom: 10px; font-size: 1.3rem; letter-spacing: 0.05em;" data-astro-cid-dpzbftxb>
NEUROPOL FONT
</h4> <p style="font-family: 'Neuropol', system-ui, sans-serif; color: rgba(255,255,255,0.8); font-size: 0.9rem;" data-astro-cid-dpzbftxb>
Panel Administracyjny MyBonzo<br data-astro-cid-dpzbftxb>
Zarz\u0105dzanie systemem AI<br data-astro-cid-dpzbftxb>
Mo\u017Cliwo\u015Bci bez granic<br data-astro-cid-dpzbftxb>
\u0141\u0105czymy przysz\u0142o\u015B\u0107 z tera\u017Aniejszo\u015Bci\u0105
</p> </div> <!-- Kenyan Coffee Demo --> <div style="background: rgba(0,217,255,0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(0,217,255,0.3);" data-astro-cid-dpzbftxb> <h4 style="font-family: 'Kenyan Coffee', system-ui, sans-serif; color: #00d9ff; margin-bottom: 10px; font-size: 1.3rem; letter-spacing: 0.03em;" data-astro-cid-dpzbftxb>
Kenyan Coffee Font
</h4> <p style="font-family: 'Kenyan Coffee', system-ui, sans-serif; color: rgba(255,255,255,0.8); font-size: 0.9rem;" data-astro-cid-dpzbftxb>
Witaj w panelu administracyjnym!<br data-astro-cid-dpzbftxb>
Tw\xF3j asystent AI jest gotowy<br data-astro-cid-dpzbftxb>
\u015Amia\u0142o eksploruj wszystkie funkcje<br data-astro-cid-dpzbftxb>
\u017Bywotno\u015B\u0107 systemu: 99.8%
</p> </div> <!-- Rajdhani Demo --> <div style="background: rgba(139,92,246,0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(139,92,246,0.3);" data-astro-cid-dpzbftxb> <h4 style="font-family: 'Rajdhani', system-ui, sans-serif; color: #8b5cf6; margin-bottom: 10px; font-size: 1.3rem; font-weight: 600; letter-spacing: 0.04em;" data-astro-cid-dpzbftxb>
Rajdhani Font
</h4> <p style="font-family: 'Rajdhani', system-ui, sans-serif; color: rgba(255,255,255,0.8); font-size: 0.9rem; font-weight: 400;" data-astro-cid-dpzbftxb>
Statystyki dzia\u0142aj\u0105 w\u0142a\u015Bciwie<br data-astro-cid-dpzbftxb>
U\u017Cytkownicy: Aktywni i zaanga\u017Cowani<br data-astro-cid-dpzbftxb>
B\u0142\u0119dy: Minimalne wyst\u0119powanie<br data-astro-cid-dpzbftxb>
Pr\u0119dko\u015B\u0107 odpowiedzi: B\u0142yskawiczna
</p> </div> </div> <!-- Przyciski testowe --> <div style="text-align: center; margin-top: 20px;" data-astro-cid-dpzbftxb> <button onclick="document.querySelector('.polish-fonts-demo').style.transform = 'scale(1.05)'; setTimeout(() => document.querySelector('.polish-fonts-demo').style.transform = 'scale(1)', 200)" style="
                background: linear-gradient(135deg, #dc143c 0%, #8b0000 50%, #dc143c 100%);
                border: 2px solid #dc143c;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-family: 'Neuropol', system-ui, sans-serif;
                letter-spacing: 0.05em;
                cursor: pointer;
                margin: 0 5px;
                transition: all 0.3s ease;
            " onmouseover="this.style.boxShadow='0 0 20px rgba(220,20,60,0.6)'" onmouseout="this.style.boxShadow='none'" data-astro-cid-dpzbftxb>
\u{1F1F5}\u{1F1F1} TEST POLSKICH FONT\xD3W
</button> <button onclick="refreshAdminFonts(); alert('Polskie fonty zosta\u0142y od\u015Bwie\u017Cone! \u{1F3A8}')" style="
                background: linear-gradient(135deg, #00d9ff 0%, #0066cc 50%, #00d9ff 100%);
                border: 2px solid #00d9ff;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-family: 'Kenyan Coffee', system-ui, sans-serif;
                letter-spacing: 0.03em;
                cursor: pointer;
                margin: 0 5px;
                transition: all 0.3s ease;
            " onmouseover="this.style.boxShadow='0 0 20px rgba(0,217,255,0.6)'" onmouseout="this.style.boxShadow='none'" data-astro-cid-dpzbftxb>
\u{1F504} LOSUJ PONOWNIE
</button> </div> <!-- Info o aktualnych fontach --> <div id="current-fonts-info" style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 6px; font-size: 0.85rem; color: rgba(255,255,255,0.6); text-align: center;" data-astro-cid-dpzbftxb> <strong data-astro-cid-dpzbftxb>Aktualne polskie fonty:</strong> Neuropol \u2022 Kenyan Coffee \u2022 Rajdhani
</div> </div>  <script>
    // Dodatkowy skrypt do demo polskich font\xF3w
    document.addEventListener('DOMContentLoaded', function() {
        // Aktualizuj info o fontach co 3 sekundy
        setInterval(function() {
            const info = document.getElementById('current-fonts-info');
            if (info && window.location.pathname.includes('/admin')) {
                const root = document.documentElement;
                const headingFont = root.style.getPropertyValue('--admin-heading-font') || 'Neuropol';
                const textFont = root.style.getPropertyValue('--admin-text-font') || 'Kenyan Coffee';
                const buttonFont = root.style.getPropertyValue('--admin-button-font') || 'Rajdhani';
                
                info.innerHTML = \`<strong>Aktualne polskie fonty:</strong> \${headingFont.replace(/"/g, '')} \u2022 \${textFont.replace(/"/g, '')} \u2022 \${buttonFont.replace(/"/g, '')}\`;
            }
        }, 3000);
    });
<\/script>`], ["", `<div class="polish-fonts-demo" style="margin: 20px 0; padding: 20px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px;" data-astro-cid-dpzbftxb> <h3 style="color: #00d9ff; margin-bottom: 20px; text-align: center;" data-astro-cid-dpzbftxb>
\u{1F3A8} Demo Polskich Font\xF3w w Admin Panelu
</h3> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;" data-astro-cid-dpzbftxb> <!-- Neuropol Demo --> <div style="background: rgba(220,20,60,0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(220,20,60,0.3);" data-astro-cid-dpzbftxb> <h4 style="font-family: 'Neuropol', system-ui, sans-serif; color: #dc143c; margin-bottom: 10px; font-size: 1.3rem; letter-spacing: 0.05em;" data-astro-cid-dpzbftxb>
NEUROPOL FONT
</h4> <p style="font-family: 'Neuropol', system-ui, sans-serif; color: rgba(255,255,255,0.8); font-size: 0.9rem;" data-astro-cid-dpzbftxb>
Panel Administracyjny MyBonzo<br data-astro-cid-dpzbftxb>
Zarz\u0105dzanie systemem AI<br data-astro-cid-dpzbftxb>
Mo\u017Cliwo\u015Bci bez granic<br data-astro-cid-dpzbftxb>
\u0141\u0105czymy przysz\u0142o\u015B\u0107 z tera\u017Aniejszo\u015Bci\u0105
</p> </div> <!-- Kenyan Coffee Demo --> <div style="background: rgba(0,217,255,0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(0,217,255,0.3);" data-astro-cid-dpzbftxb> <h4 style="font-family: 'Kenyan Coffee', system-ui, sans-serif; color: #00d9ff; margin-bottom: 10px; font-size: 1.3rem; letter-spacing: 0.03em;" data-astro-cid-dpzbftxb>
Kenyan Coffee Font
</h4> <p style="font-family: 'Kenyan Coffee', system-ui, sans-serif; color: rgba(255,255,255,0.8); font-size: 0.9rem;" data-astro-cid-dpzbftxb>
Witaj w panelu administracyjnym!<br data-astro-cid-dpzbftxb>
Tw\xF3j asystent AI jest gotowy<br data-astro-cid-dpzbftxb>
\u015Amia\u0142o eksploruj wszystkie funkcje<br data-astro-cid-dpzbftxb>
\u017Bywotno\u015B\u0107 systemu: 99.8%
</p> </div> <!-- Rajdhani Demo --> <div style="background: rgba(139,92,246,0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(139,92,246,0.3);" data-astro-cid-dpzbftxb> <h4 style="font-family: 'Rajdhani', system-ui, sans-serif; color: #8b5cf6; margin-bottom: 10px; font-size: 1.3rem; font-weight: 600; letter-spacing: 0.04em;" data-astro-cid-dpzbftxb>
Rajdhani Font
</h4> <p style="font-family: 'Rajdhani', system-ui, sans-serif; color: rgba(255,255,255,0.8); font-size: 0.9rem; font-weight: 400;" data-astro-cid-dpzbftxb>
Statystyki dzia\u0142aj\u0105 w\u0142a\u015Bciwie<br data-astro-cid-dpzbftxb>
U\u017Cytkownicy: Aktywni i zaanga\u017Cowani<br data-astro-cid-dpzbftxb>
B\u0142\u0119dy: Minimalne wyst\u0119powanie<br data-astro-cid-dpzbftxb>
Pr\u0119dko\u015B\u0107 odpowiedzi: B\u0142yskawiczna
</p> </div> </div> <!-- Przyciski testowe --> <div style="text-align: center; margin-top: 20px;" data-astro-cid-dpzbftxb> <button onclick="document.querySelector('.polish-fonts-demo').style.transform = 'scale(1.05)'; setTimeout(() => document.querySelector('.polish-fonts-demo').style.transform = 'scale(1)', 200)" style="
                background: linear-gradient(135deg, #dc143c 0%, #8b0000 50%, #dc143c 100%);
                border: 2px solid #dc143c;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-family: 'Neuropol', system-ui, sans-serif;
                letter-spacing: 0.05em;
                cursor: pointer;
                margin: 0 5px;
                transition: all 0.3s ease;
            " onmouseover="this.style.boxShadow='0 0 20px rgba(220,20,60,0.6)'" onmouseout="this.style.boxShadow='none'" data-astro-cid-dpzbftxb>
\u{1F1F5}\u{1F1F1} TEST POLSKICH FONT\xD3W
</button> <button onclick="refreshAdminFonts(); alert('Polskie fonty zosta\u0142y od\u015Bwie\u017Cone! \u{1F3A8}')" style="
                background: linear-gradient(135deg, #00d9ff 0%, #0066cc 50%, #00d9ff 100%);
                border: 2px solid #00d9ff;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-family: 'Kenyan Coffee', system-ui, sans-serif;
                letter-spacing: 0.03em;
                cursor: pointer;
                margin: 0 5px;
                transition: all 0.3s ease;
            " onmouseover="this.style.boxShadow='0 0 20px rgba(0,217,255,0.6)'" onmouseout="this.style.boxShadow='none'" data-astro-cid-dpzbftxb>
\u{1F504} LOSUJ PONOWNIE
</button> </div> <!-- Info o aktualnych fontach --> <div id="current-fonts-info" style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 6px; font-size: 0.85rem; color: rgba(255,255,255,0.6); text-align: center;" data-astro-cid-dpzbftxb> <strong data-astro-cid-dpzbftxb>Aktualne polskie fonty:</strong> Neuropol \u2022 Kenyan Coffee \u2022 Rajdhani
</div> </div>  <script>
    // Dodatkowy skrypt do demo polskich font\xF3w
    document.addEventListener('DOMContentLoaded', function() {
        // Aktualizuj info o fontach co 3 sekundy
        setInterval(function() {
            const info = document.getElementById('current-fonts-info');
            if (info && window.location.pathname.includes('/admin')) {
                const root = document.documentElement;
                const headingFont = root.style.getPropertyValue('--admin-heading-font') || 'Neuropol';
                const textFont = root.style.getPropertyValue('--admin-text-font') || 'Kenyan Coffee';
                const buttonFont = root.style.getPropertyValue('--admin-button-font') || 'Rajdhani';
                
                info.innerHTML = \\\`<strong>Aktualne polskie fonty:</strong> \\\${headingFont.replace(/"/g, '')} \u2022 \\\${textFont.replace(/"/g, '')} \u2022 \\\${buttonFont.replace(/"/g, '')}\\\`;
            }
        }, 3000);
    });
<\/script>`])), maybeRenderHead());
}, "Q:/mybonzo/luc-de-zen-on/src/components/admin/PolishFontsDemo.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Panel Administracyjny MyBonzo";
  const pageDescription = "Centrum kontroli i zarz\u0105dzania systemem MyBonzo AI";
  const pageQuote = "Zarz\u0105dzanie to sztuka, a kontrola to nauka.";
  const pageAuthor = "MyBonzo Team";
  return renderTemplate`${renderComponent($$result, "RandomPolishFonts", $$RandomPolishFonts, {})} ${renderComponent($$result, "PolishAdminStyles", $$PolishAdminStyles, {})} ${renderComponent($$result, "UniversalPageLayout", $$UniversalPageLayout, { "pageTitle": pageTitle, "pageDescription": pageDescription, "pageQuote": pageQuote, "pageAuthor": pageAuthor, "showRandomQuote": false }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u{1F3E0} Centrum Administracyjne MyBonzo", "variant": "highlight", "padding": "xl" }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div style="text-align: center; margin-bottom: 30px;"> <div style="color: rgba(255,255,255,0.9); font-size: 1.2rem; margin-bottom: 20px;">
Witaj w centrum kontroli systemu MyBonzo AI. Wybierz obszar zarządzania:
</div> </div> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-bottom: 30px;"> <!-- Quick Login Panel --> <div style="background: rgba(0,217,255,0.1); border: 2px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 25px; text-align: center;"> <div style="font-size: 3rem; margin-bottom: 15px;">🔐</div> <h3 style="color: #00d9ff; margin-bottom: 15px; font-size: 1.4rem;">Panel Logowania</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">
Szybki dostęp do panelu administracyjnego z autoryzacją
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Przejd\u017A do logowania", "variant": "primary", "size": "md", "onclick": "window.location.href='/admin/login'" })} </div> <!-- Advanced Dashboard --> <div style="background: rgba(0,217,255,0.1); border: 2px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 25px; text-align: center;"> <div style="font-size: 3rem; margin-bottom: 15px;">📊</div> <h3 style="color: #00d9ff; margin-bottom: 15px; font-size: 1.4rem;">Zaawansowany Dashboard</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">
Kompleksowy panel z monitoringiem i zarządzaniem
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Otw\xF3rz Dashboard", "variant": "primary", "size": "md", "onclick": "window.location.href='/admin/dashboard'" })} </div> <!-- Admin AI Assistant --> <div style="background: rgba(139,92,246,0.1); border: 2px solid rgba(139,92,246,0.3); border-radius: 12px; padding: 25px; text-align: center;"> <div style="font-size: 3rem; margin-bottom: 15px;">🤖</div> <h3 style="color: #8b5cf6; margin-bottom: 15px; font-size: 1.4rem;">Admin AI Assistant</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">
Inteligentny asystent dla zadań administracyjnych
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Rozpocznij Chat", "variant": "secondary", "size": "md", "onclick": "window.location.href='/admin/ai-chat'" })} </div> </div> ` })}  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u26A1 Szybki dost\u0119p", "variant": "default", "padding": "lg" }, { "default": ($$result3) => renderTemplate` <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;"> <!-- System Monitoring --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
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
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zabezpieczenia", "variant": "warning", "size": "sm", "onclick": "window.location.href='/admin/security'" })} </div> <!-- Database Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
🗄️ <span style="margin-left: 10px;">Baza danych</span> </h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Zarządzaj bazą danych i wykonuj kopie zapasowe
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zarz\u0105dzaj", "variant": "outline", "size": "sm", "onclick": "window.location.href='/admin/database'" })} </div> <!-- API Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
🔌 <span style="margin-left: 10px;">API Management</span> </h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Zarządzaj kluczami API i limitami zapytań
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Konfiguruj API", "variant": "outline", "size": "sm", "onclick": "window.location.href='/admin/api'" })} </div> </div> ` })}  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u{1F4C8} Przegl\u0105d systemu", "variant": "success", "padding": "lg" }, { "default": ($$result3) => renderTemplate` <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;"> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="systemStatus">🟢 ONLINE</div> <div style="color: rgba(255,255,255,0.7);">Status systemu</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="activeWorkers">8/10</div> <div style="color: rgba(255,255,255,0.7);">Aktywne workery</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="uptime">99.8%</div> <div style="color: rgba(255,255,255,0.7);">Uptime 24h</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="totalRequests">12.4k</div> <div style="color: rgba(255,255,255,0.7);">Zapytania dzisiaj</div> </div> </div> <div style="text-align: center; margin-top: 25px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F504} Od\u015Bwie\u017C dane", "variant": "outline", "size": "md", "onclick": "updateSystemStats()" })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F3A8} Losowe polskie fonty", "variant": "secondary", "size": "md", "onclick": "refreshAdminFonts()" })} </div> ` })}  ${renderComponent($$result2, "PolishFontsDemo", $$PolishFontsDemo, {})} ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
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
