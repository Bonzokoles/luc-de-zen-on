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
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, b as renderScript, m as maybeRenderHead } from '../chunks/vendor_BHZTJLV0.mjs';
export { d as renderers } from '../chunks/vendor_BHZTJLV0.mjs';
import { $ as $$UniversalPageLayout, a as $$GlassPanel, b as $$CyberpunkButton } from '../chunks/CyberpunkButton_DGnPc2jR.mjs';
/* empty css                                      */

const $$Astro = createAstro("https://www.mybonzo.com");
const $$AgentsNew = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AgentsNew;
  const pageTitle = "Zarz\u0105dzanie Agentami AI";
  const pageDescription = "Tw\xF3rz, konfiguruj i zarz\u0105dzaj agentami sztucznej inteligencji";
  const pageQuote = "Przysz\u0142o\u015B\u0107 nale\u017Cy do tych, kt\xF3rzy potrafi\u0105 wsp\xF3\u0142pracowa\u0107 z maszynami.";
  const pageAuthor = "Garry Kasparov";
  let userAgents = [];
  try {
    const response = await fetch(new URL("/api/agents/list", Astro2.url.origin));
    if (response.ok) {
      userAgents = await response.json();
    }
  } catch (e) {
    console.error("Could not fetch user agents:", e);
  }
  return renderTemplate`${renderComponent($$result, "UniversalPageLayout", $$UniversalPageLayout, { "pageTitle": pageTitle, "pageDescription": pageDescription, "pageQuote": pageQuote, "pageAuthor": pageAuthor, "showRandomQuote": false, "data-astro-cid-vlnzz4pe": true }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u{1F916} Kreator Nowego Agenta", "variant": "highlight", "padding": "lg", "data-astro-cid-vlnzz4pe": true }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<div style="margin-bottom: 20px;" data-astro-cid-vlnzz4pe> <p style="color: rgba(255,255,255,0.8); font-size: 1.1rem; line-height: 1.6;" data-astro-cid-vlnzz4pe>
Stwórz spersonalizowanego agenta AI dostosowanego do Twoich potrzeb. 
                Wybierz specjalizację, ustaw parametry i rozpocznij pracę z AI asystentem.
</p> </div> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;" data-astro-cid-vlnzz4pe> <!-- Quick Agent Templates --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;" data-astro-cid-vlnzz4pe> <h3 style="color: #00d9ff; margin-bottom: 15px;" data-astro-cid-vlnzz4pe>⚡ Szybkie szablony</h3> <div style="space-y: 10px;" data-astro-cid-vlnzz4pe> <button class="agent-template-btn" data-template="business" style="width: 100%; padding: 12px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); border-radius: 6px; color: white; cursor: pointer; transition: all 0.3s ease; margin-bottom: 8px;" data-astro-cid-vlnzz4pe>
💼 Agent Biznesowy
</button> <button class="agent-template-btn" data-template="creative" style="width: 100%; padding: 12px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); border-radius: 6px; color: white; cursor: pointer; transition: all 0.3s ease; margin-bottom: 8px;" data-astro-cid-vlnzz4pe>
🎨 Agent Kreatywny
</button> <button class="agent-template-btn" data-template="technical" style="width: 100%; padding: 12px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); border-radius: 6px; color: white; cursor: pointer; transition: all 0.3s ease; margin-bottom: 8px;" data-astro-cid-vlnzz4pe>
🔧 Agent Techniczny
</button> <button class="agent-template-btn" data-template="research" style="width: 100%; padding: 12px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); border-radius: 6px; color: white; cursor: pointer; transition: all 0.3s ease; margin-bottom: 8px;" data-astro-cid-vlnzz4pe>
📊 Agent Badawczy
</button> </div> </div> <!-- Agent Configuration --> <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;" data-astro-cid-vlnzz4pe> <h3 style="color: #00d9ff; margin-bottom: 15px;" data-astro-cid-vlnzz4pe>⚙️ Konfiguracja</h3> <div style="margin-bottom: 15px;" data-astro-cid-vlnzz4pe> <label style="display: block; color: #00d9ff; font-weight: 600; margin-bottom: 8px;" data-astro-cid-vlnzz4pe>Nazwa agenta</label> <input type="text" id="agentName" placeholder="np. Mój Asystent Biznesowy" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.6); border: 1px solid rgba(0,217,255,0.3); border-radius: 6px; color: white;" data-astro-cid-vlnzz4pe> </div> <div style="margin-bottom: 15px;" data-astro-cid-vlnzz4pe> <label style="display: block; color: #00d9ff; font-weight: 600; margin-bottom: 8px;" data-astro-cid-vlnzz4pe>Specjalizacja</label> <select id="agentSpecialization" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.6); border: 1px solid rgba(0,217,255,0.3); border-radius: 6px; color: white;" data-astro-cid-vlnzz4pe> <option value="" data-astro-cid-vlnzz4pe>Wybierz specjalizację...</option> <option value="general" data-astro-cid-vlnzz4pe>Asystent ogólny</option> <option value="marketing" data-astro-cid-vlnzz4pe>Marketing i sprzedaż</option> <option value="content" data-astro-cid-vlnzz4pe>Tworzenie treści</option> <option value="analysis" data-astro-cid-vlnzz4pe>Analiza danych</option> <option value="coding" data-astro-cid-vlnzz4pe>Programowanie</option> <option value="education" data-astro-cid-vlnzz4pe>Edukacja</option> <option value="customer" data-astro-cid-vlnzz4pe>Obsługa klienta</option> </select> </div> <div style="margin-bottom: 20px;" data-astro-cid-vlnzz4pe> <label style="display: block; color: #00d9ff; font-weight: 600; margin-bottom: 8px;" data-astro-cid-vlnzz4pe>Poziom kreatywności</label> <input type="range" id="creativityLevel" min="0" max="100" value="50" style="width: 100%;" data-astro-cid-vlnzz4pe> <div style="display: flex; justify-content: space-between; color: rgba(255,255,255,0.6); font-size: 0.8rem; margin-top: 5px;" data-astro-cid-vlnzz4pe> <span data-astro-cid-vlnzz4pe>Konserwatywny</span> <span data-astro-cid-vlnzz4pe>Zbalansowany</span> <span data-astro-cid-vlnzz4pe>Kreatywny</span> </div> </div> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F680} Stw\xF3rz Agenta", "variant": "primary", "size": "md", "onclick": "createAgent()", "data-astro-cid-vlnzz4pe": true })} </div> </div>  <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px;" data-astro-cid-vlnzz4pe> <h3 style="color: #00d9ff; margin-bottom: 15px;" data-astro-cid-vlnzz4pe>🎭 Osobowość i styl komunikacji</h3> <textarea id="agentPersonality" placeholder="Opisz jak agent ma się zachowywać, jaki ma być jego styl komunikacji, jakie ma mieć specjalne umiejętności..." style="width: 100%; height: 120px; padding: 12px; background: rgba(0,0,0,0.6); border: 1px solid rgba(0,217,255,0.3); border-radius: 6px; color: white; resize: vertical;" data-astro-cid-vlnzz4pe></textarea> </div> ` })}  ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "\u{1F465} Twoi Agenci AI", "variant": "default", "padding": "lg", "data-astro-cid-vlnzz4pe": true }, { "default": async ($$result3) => renderTemplate` <div id="agentsContainer" data-astro-cid-vlnzz4pe> ${userAgents && userAgents.length > 0 ? renderTemplate`<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;" data-astro-cid-vlnzz4pe> ${userAgents.map((agent) => renderTemplate`<div class="agent-card" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 12px; padding: 20px; transition: all 0.3s ease;" data-astro-cid-vlnzz4pe> <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;" data-astro-cid-vlnzz4pe> <h3 style="color: #00d9ff; margin: 0;" data-astro-cid-vlnzz4pe>${agent.name}</h3> <span style="background: rgba(34,197,94,0.2); color: #22c55e; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;" data-astro-cid-vlnzz4pe>
Aktywny
</span> </div> <div style="margin-bottom: 15px;" data-astro-cid-vlnzz4pe> <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-bottom: 5px;" data-astro-cid-vlnzz4pe> <strong data-astro-cid-vlnzz4pe>Specjalizacja:</strong> ${agent.specialization || "Og\xF3lna"} </div> <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-bottom: 10px;" data-astro-cid-vlnzz4pe> <strong data-astro-cid-vlnzz4pe>Utworzony:</strong> ${new Date(agent.createdAt).toLocaleDateString()} </div> <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; line-height: 1.4;" data-astro-cid-vlnzz4pe> ${agent.description?.substring(0, 100)}...
</p> </div> <div style="display: flex; gap: 10px; flex-wrap: wrap;" data-astro-cid-vlnzz4pe> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F4AC} Chat", "variant": "primary", "size": "sm", "href": `/chat/${agent.id}`, "data-astro-cid-vlnzz4pe": true })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u2699\uFE0F Edytuj", "variant": "outline", "size": "sm", "onclick": `editAgent('${agent.id}')`, "data-astro-cid-vlnzz4pe": true })} ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F4CA} Stats", "variant": "outline", "size": "sm", "onclick": `showAgentStats('${agent.id}')`, "data-astro-cid-vlnzz4pe": true })} </div> </div>`)} </div>` : renderTemplate`<div style="text-align: center; padding: 40px 20px;" data-astro-cid-vlnzz4pe> <div style="color: rgba(255,255,255,0.6); font-size: 1.1rem; margin-bottom: 20px;" data-astro-cid-vlnzz4pe>
Nie masz jeszcze żadnych agentów AI
</div> <p style="color: rgba(255,255,255,0.4); margin-bottom: 20px;" data-astro-cid-vlnzz4pe>
Stwórz swojego pierwszego agenta używając kreatora powyżej
</p> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "\u{1F680} Stw\xF3rz pierwszego agenta", "variant": "primary", "size": "lg", "onclick": "scrollToCreator()", "data-astro-cid-vlnzz4pe": true })} </div>`} </div>  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(0,217,255,0.2);" data-astro-cid-vlnzz4pe> <h3 style="color: #00d9ff; margin-bottom: 20px; text-align: center;" data-astro-cid-vlnzz4pe>💡 Przykłady agentów do stworzenia</h3> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;" data-astro-cid-vlnzz4pe> <div style="background: rgba(0,217,255,0.05); border: 1px solid rgba(0,217,255,0.2); border-radius: 8px; padding: 15px;" data-astro-cid-vlnzz4pe> <div style="color: #00d9ff; font-weight: 600; margin-bottom: 8px;" data-astro-cid-vlnzz4pe>📧 Email Marketing Specialist</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;" data-astro-cid-vlnzz4pe>Ekspert od kampanii mailowych i automation marketingu</div> </div> <div style="background: rgba(0,217,255,0.05); border: 1px solid rgba(0,217,255,0.2); border-radius: 8px; padding: 15px;" data-astro-cid-vlnzz4pe> <div style="color: #00d9ff; font-weight: 600; margin-bottom: 8px;" data-astro-cid-vlnzz4pe>📊 Data Analyst</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;" data-astro-cid-vlnzz4pe>Analizuje dane i tworzy raporty biznesowe</div> </div> <div style="background: rgba(0,217,255,0.05); border: 1px solid rgba(0,217,255,0.2); border-radius: 8px; padding: 15px;" data-astro-cid-vlnzz4pe> <div style="color: #00d9ff; font-weight: 600; margin-bottom: 8px;" data-astro-cid-vlnzz4pe>✍️ Content Writer</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;" data-astro-cid-vlnzz4pe>Tworzy angażujące treści dla social media i blogów</div> </div> <div style="background: rgba(0,217,255,0.05); border: 1px solid rgba(0,217,255,0.2); border-radius: 8px; padding: 15px;" data-astro-cid-vlnzz4pe> <div style="color: #00d9ff; font-weight: 600; margin-bottom: 8px;" data-astro-cid-vlnzz4pe>🎓 Learning Assistant</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;" data-astro-cid-vlnzz4pe>Pomaga w nauce i rozwoju zawodowym</div> </div> </div> </div> ` })}  ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/agents-new.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/agents-new.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/agents-new.astro";
const $$url = "/agents-new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AgentsNew,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
