globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as renderScript } from '../../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$UniversalPageLayout, a as $$GlassPanel, b as $$CyberpunkButton } from '../../chunks/CyberpunkButton_BsyRwZt1.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const pageTitle = "Panel Administracyjny MyBonzo";
  const pageDescription = "Centrum kontroli i zarz\u0105dzania systemem MyBonzo AI";
  const pageQuote = "Z wielk\u0105 moc\u0105 idzie wielka odpowiedzialno\u015B\u0107.";
  const pageAuthor = "Stan Lee";
  return renderTemplate`${renderComponent($$result, "UniversalPageLayout", $$UniversalPageLayout, { "pageTitle": pageTitle, "pageDescription": pageDescription, "pageQuote": pageQuote, "pageAuthor": pageAuthor, "showRandomQuote": false }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div id="loginSection"> ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u{1F510} Autoryzacja Administratora", "variant": "warning", "padding": "lg" }, { "default": async ($$result3) => renderTemplate` <div style="text-align: center; margin-bottom: 20px;"> <div style="color: rgba(255,255,255,0.8); margin-bottom: 20px;">
Dostęp tylko dla autoryzowanych administratorów systemu MyBonzo
</div> </div> <div style="max-width: 400px; margin: 0 auto;"> <div style="margin-bottom: 20px;"> <label style="display: block; color: #00d9ff; font-weight: 600; margin-bottom: 8px;">Hasło dostępu</label> <input type="password" id="adminPassword" placeholder="Wprowadź hasło administratora..." style="width: 100%; padding: 12px; background: rgba(0,0,0,0.6); border: 1px solid rgba(0,217,255,0.3); border-radius: 6px; color: white; font-size: 16px;" onkeypress="handleEnterKey(event)"> </div> <div style="text-align: center;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F680} Zaloguj si\u0119", "variant": "primary", "size": "lg", "onclick": "checkPassword()" })} </div> <div id="errorMessage" style="color: #ff4444; text-align: center; margin-top: 15px; display: none;">
Nieprawidłowe hasło! Dostęp zabroniony.
</div> </div> ` })} </div>  <div id="adminDashboard" style="display: none;"> <!-- Admin Stats --> ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u{1F4CA} Status Systemu", "variant": "highlight", "padding": "lg" }, { "default": async ($$result3) => renderTemplate` <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;"> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="activeUsers">247</div> <div style="color: rgba(255,255,255,0.7);">Aktywni użytkownicy</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="totalRequests">12,384</div> <div style="color: rgba(255,255,255,0.7);">Zapytania dzisiaj</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="systemUptime">99.8%</div> <div style="color: rgba(255,255,255,0.7);">Uptime systemu</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; text-align: center;"> <div style="color: #00d9ff; font-size: 2rem; font-weight: 700;" id="aiModels">15</div> <div style="color: rgba(255,255,255,0.7);">Aktywne modele AI</div> </div> </div> ` })} <!-- Admin Actions --> ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u26A1 Szybkie Akcje", "variant": "default", "padding": "lg" }, { "default": async ($$result3) => renderTemplate` <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;"> <!-- User Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
👥 Zarządzanie użytkownikami
</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Przeglądaj, edytuj i zarządzaj kontami użytkowników
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zarz\u0105dzaj u\u017Cytkownikami", "variant": "outline", "size": "sm", "onclick": "openUserManagement()" })} </div> <!-- System Monitoring --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
📊 Monitoring systemu
</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Monitoruj wydajność i logi systemowe
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zobacz monitoring", "variant": "outline", "size": "sm", "onclick": "openSystemMonitoring()" })} </div> <!-- AI Models Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
🤖 Modele AI
</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Konfiguruj i zarządzaj modelami sztucznej inteligencji
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zarz\u0105dzaj modelami", "variant": "outline", "size": "sm", "onclick": "openAIModels()" })} </div> <!-- Database Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
🗄️ Baza danych
</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Zarządzaj bazą danych i wykonuj kopie zapasowe
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zarz\u0105dzaj baz\u0105", "variant": "outline", "size": "sm", "onclick": "openDatabaseManagement()" })} </div> <!-- Security Center --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
🔒 Centrum bezpieczeństwa
</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Konfiguruj zabezpieczenia i kontrolę dostępu
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zabezpieczenia", "variant": "warning", "size": "sm", "onclick": "openSecurityCenter()" })} </div> <!-- API Management --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;"> <h3 style="color: #00d9ff; margin-bottom: 15px; display: flex; align-items: center;">
🔌 API Management
</h3> <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px; font-size: 0.9rem;">
Zarządzaj kluczami API i limitami zapytań
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Zarz\u0105dzaj API", "variant": "outline", "size": "sm", "onclick": "openAPIManagement()" })} </div> </div> ` })} <!-- Recent Activity --> ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u{1F550} Ostatnia aktywno\u015B\u0107", "variant": "default", "padding": "lg" }, { "default": async ($$result3) => renderTemplate` <div style="max-height: 300px; overflow-y: auto;"> <div id="activityLog" style="space-y: 10px;"> <!-- Activity items will be loaded here --> </div> </div> <div style="text-align: center; margin-top: 20px;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Od\u015Bwie\u017C logi", "variant": "outline", "size": "sm", "onclick": "refreshActivityLog()" })} </div> ` })} <!-- Logout --> <div style="text-align: center; margin-top: 30px;"> ${renderComponent($$result2, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F6AA} Wyloguj si\u0119", "variant": "outline", "size": "md", "onclick": "logout()" })} </div> </div> ${renderScript($$result2, "Q:/mybonzo/mybonzo-github/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "Q:/mybonzo/mybonzo-github/src/pages/admin/login.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
