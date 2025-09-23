globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as renderScript } from '../../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$UniversalPageLayout } from '../../chunks/UniversalPageLayout_ChsqH4EH.mjs';
import { $ as $$GlassPanel, a as $$CyberpunkButton } from '../../chunks/CyberpunkButton_DtfwayTf.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Login = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Panel Administracyjny MyBonzo";
  const pageDescription = "Centrum kontroli i zarz\xC4\u2026dzania systemem MyBonzo AI";
  const pageQuote = "Z wielk\xC4\u2026 moc\xC4\u2026 idzie wielka odpowiedzialno\u0139\u203A\xC4\u2021.";
  const pageAuthor = "Stan Lee";
  return renderTemplate`${renderComponent($$result, "UniversalPageLayout", $$UniversalPageLayout, { "pageTitle": pageTitle, "pageDescription": pageDescription, "pageQuote": pageQuote, "pageAuthor": pageAuthor, "showRandomQuote": false }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div id="loginSection"> ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u0111\u017A\u201D\x90 Autoryzacja Administratora", "variant": "warning", "padding": "lg" }, { "default": ($$result3) => renderTemplate` <div style="text-align: center; margin-bottom: 20px;"> <div style="color: rgba(255,255,255,0.8); margin-bottom: 20px;">
DostÄ™p tylko dla autoryzowanych administratorĂłw systemu MyBonzo
</div> </div> <div style="max-width: 400px; margin: 0 auto;"> <div style="margin-bottom: 20px;"> <label style="display: block; color: #00d9ff; font-weight: 600; margin-bottom: 8px;">HasĹ‚o dostÄ™pu</label> <input type="password" id="adminPassword" placeholder="WprowadĹş hasĹ‚o administratora..." style="width: 100%; padding: 12px; background: rgba(0,0,0,0.6); border: 1px solid rgba(0,217,255,0.3); border-radius: 6px; color: white; font-size: 16px;" onkeypress="handleEnterKey(event)"> </div> <div style="text-align: center;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u0111\u017A\u0161\u20AC Zaloguj si\xC4\u2122", "variant": "primary", "size": "lg", "onclick": "checkPassword()" })} </div> <div id="errorMessage" style="color: #ff4444; text-align: center; margin-top: 15px; display: none;">
NieprawidĹ‚owe hasĹ‚o! DostÄ™p zabroniony.
</div> </div> ` })} </div>  <div id="adminDashboard" style="display: none;"> <!-- Admin Stats --> ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u0111\u017A\u201C\u0160 Status Systemu", "variant": "highlight", "padding": "lg" }, { "default": ($$result3) => renderTemplate` <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;"> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="activeUsers">247</div> <div style="color: rgba(255,255,255,0.7);">Aktywni uĹĽytkownicy</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="totalRequests">12,384</div> <div style="color: rgba(255,255,255,0.7);">Zapytania dzisiaj</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="systemUptime">99.8%</div> <div style="color: rgba(255,255,255,0.7);">Uptime systemu</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="aiModels">15</div> <div style="color: rgba(255,255,255,0.7);">Aktywne modele AI</div> </div> </div> ` })} <!-- Admin Actions --> ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\xE2\u0161\u02C7 Szybkie Akcje", "variant": "default", "padding": "lg" }, { "default": ($$result3) => renderTemplate` <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;"> <!-- User Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
đź‘Ą ZarzÄ…dzanie uĹĽytkownikami
</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
PrzeglÄ…daj, edytuj i zarzÄ…dzaj kontami uĹĽytkownikĂłw
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zarz\xC4\u2026dzaj u\u0139\u013Dytkownikami", "variant": "outline", "size": "sm", "onclick": "openUserManagement()" })} </div> <!-- System Monitoring --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
đź“Š Monitoring systemu
</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Monitoruj wydajnoĹ›Ä‡ i logi systemowe
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zobacz monitoring", "variant": "outline", "size": "sm", "onclick": "openSystemMonitoring()" })} </div> <!-- AI Models Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
đź¤– Modele AI
</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Konfiguruj i zarzÄ…dzaj modelami sztucznej inteligencji
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zarz\xC4\u2026dzaj modelami", "variant": "outline", "size": "sm", "onclick": "openAIModels()" })} </div> <!-- Database Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
đź—„ď¸Ź Baza danych
</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
ZarzÄ…dzaj bazÄ… danych i wykonuj kopie zapasowe
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zarz\xC4\u2026dzaj baz\xC4\u2026", "variant": "outline", "size": "sm", "onclick": "openDatabaseManagement()" })} </div> <!-- Security Center --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
đź”’ Centrum bezpieczeĹ„stwa
</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Konfiguruj zabezpieczenia i kontrolÄ™ dostÄ™pu
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zabezpieczenia", "variant": "warning", "size": "sm", "onclick": "openSecurityCenter()" })} </div> <!-- API Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
đź”Ś API Management
</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
ZarzÄ…dzaj kluczami API i limitami zapytaĹ„
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zarz\xC4\u2026dzaj API", "variant": "outline", "size": "sm", "onclick": "openAPIManagement()" })} </div> </div> ` })} <!-- Recent Activity --> ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u0111\u017A\u2022\x90 Ostatnia aktywno\u0139\u203A\xC4\u2021", "variant": "default", "padding": "lg" }, { "default": ($$result3) => renderTemplate` <div style="max-height: 300px; overflow-y: auto;"> <div id="activityLog" style="space-y: 10px;"> <!-- Activity items will be loaded here --> </div> </div> <div style="text-align: center; margin-top: 20px;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Od\u0139\u203Awie\u0139\u013D logi", "variant": "outline", "size": "sm", "onclick": "refreshActivityLog()" })} </div> ` })} <!-- Logout --> <div style="text-align: center; margin-top: 30px;"> ${renderComponent($$result2, "CyberpunkButton", $$CyberpunkButton, { "text": "\u0111\u017A\u0161\u015E Wyloguj si\xC4\u2122", "variant": "danger", "size": "md", "onclick": "logout()" })} </div> </div> ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/admin/login.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
