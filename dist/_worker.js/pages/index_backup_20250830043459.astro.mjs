globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, m as maybeRenderHead, b as renderScript, a as renderTemplate, r as renderComponent } from '../chunks/astro/server_DFvGEJvU.mjs';
import { $ as $$Layout } from '../chunks/Layout_bupQxkWv.mjs';
import { $ as $$Section } from '../chunks/Section_Dr1Qq6ry.mjs';
import { e as ensure_array_like } from '../chunks/_@astro-renderers_Ba3qNCWV.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Ba3qNCWV.mjs';
import { $ as $$CosmeticText } from '../chunks/CosmeticText_Bae1DsvE.mjs';
/* empty css                                                       */
import { S as SiteDescription, s as siteTitle } from '../chunks/site_BkxpWSbL.mjs';
import { g as getCollection } from '../chunks/_astro_content_CYbi7Bl_.mjs';

function Tags($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { tags } = $$props;

		function tag($$renderer, title) {
			{
				$$renderer.push('<!--[!-->');
			}

			$$renderer.push(`<!--]-->`);
		}

		$$renderer.push(`<div class="flex flex-row flex-wrap justify-center gap-2 mt-4 text-lg"><!--[-->`);

		const each_array = ensure_array_like(tags);

		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			each_array[$$index];

			tag($$renderer);
		}

		$$renderer.push(`<!--]--></div>`);
	});
}

const $$AIWorkersNav = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="ai-workers-section" id="ai-workers" data-astro-cid-my52qgmw> <div class="section-container" data-astro-cid-my52qgmw> <h2 class="section-title" data-astro-cid-my52qgmw>AI WORKERS</h2> <p class="section-description" data-astro-cid-my52qgmw>
Zaawansowane narzędzia AI dostępne na platformie
</p> <!-- System Control Buttons --> <div class="tags-section" data-astro-cid-my52qgmw> <button class="tag-btn" onclick="window.open('/POLACZEK_AGENT_SYS_23', '_blank')" data-astro-cid-my52qgmw>
POLACZEK_AGENT_SYS_23
</button> <button class="tag-btn" onclick="window.open('/bielik-enon-dev', '_blank')" data-astro-cid-my52qgmw>
BIELIK
</button> <button class="tag-btn" onclick="window.open('/zenon-mcp-server', '_blank')" data-astro-cid-my52qgmw>
ZENON
</button> <button class="tag-btn" onclick="window.open('/klf-sheed-shop', '_blank')" data-astro-cid-my52qgmw>
KLF_SHEED_SHOOP
</button> <button class="tag-btn" onclick="window.open('/ai-workers-manager', '_blank')" data-astro-cid-my52qgmw>
AI WORKERS MANAGER
</button> <button class="tag-btn" onclick="window.open('/api-demo', '_blank')" data-astro-cid-my52qgmw>
API DEMO
</button> <button class="tag-btn" onclick="window.open('/animations-showcase', '_blank')" data-astro-cid-my52qgmw>
ANIMACJE SVELTE
</button> </div> <div class="workers-grid" data-astro-cid-my52qgmw> <!-- Image Generator --> <div class="worker-card" data-worker="image" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>Generator Obrazów</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Twórz niesamowite obrazy z tekstu używając Flux-1 Schnell
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Flux AI</span> <span class="feature-tag" data-astro-cid-my52qgmw>512-1024px</span> <span class="feature-tag" data-astro-cid-my52qgmw>Tłumaczenie PL</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="Opisz obraz..." class="quick-prompt" id="imagePrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="openImageGenerator()" data-astro-cid-my52qgmw>Generuj</button> <button class="action-btn secondary" onclick="window.open('/image-generator', '_blank')" data-astro-cid-my52qgmw>Otwórz</button> </div> </div> <!-- AI Chatbot --> <div class="worker-card" data-worker="chat" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>AI Chatbot</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Inteligentny asystent do rozmów i odpowiadania na pytania
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>OpenAI GPT</span> <span class="feature-tag" data-astro-cid-my52qgmw>Język polski</span> <span class="feature-tag" data-astro-cid-my52qgmw>Kontekst</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="Zadaj pytanie..." class="quick-prompt" id="chatPrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="openChatbot()" data-astro-cid-my52qgmw>Chat</button> <button class="action-btn secondary" onclick="window.open('/chatbot', '_blank')" data-astro-cid-my52qgmw>Otwórz</button> </div> </div> <!-- BigQuery Analytics --> <div class="worker-card" data-worker="bigquery" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>BigQuery Analytics</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Analizuj dane z Google BigQuery, wykonuj zapytania SQL
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Google Cloud</span> <span class="feature-tag" data-astro-cid-my52qgmw>SQL Query</span> <span class="feature-tag" data-astro-cid-my52qgmw>Analytics</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="SELECT * FROM..." class="quick-prompt" id="bigqueryPrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="openBigQuery()" data-astro-cid-my52qgmw>Analizuj</button> <button class="action-btn secondary" onclick="window.open('/bigquery-analytics', '_blank')" data-astro-cid-my52qgmw>Otwórz</button> </div> </div> <!-- Kaggle Datasets --> <div class="worker-card" data-worker="kaggle" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>Kaggle Datasets</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Przeszukuj zbiory danych, konkursy i profile Kaggle
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Machine Learning</span> <span class="feature-tag" data-astro-cid-my52qgmw>Datasets</span> <span class="feature-tag" data-astro-cid-my52qgmw>Competitions</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="machine learning..." class="quick-prompt" id="kagglePrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="openKaggle()" data-astro-cid-my52qgmw>Wyszukaj</button> <button class="action-btn secondary" onclick="window.open('/kaggle-datasets', '_blank')" data-astro-cid-my52qgmw>Otwórz</button> </div> </div> <!-- Tavily Search --> <div class="worker-card" data-worker="tavily" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>Tavily AI Search</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Zaawansowane wyszukiwanie internetowe powered by AI
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>AI Search</span> <span class="feature-tag" data-astro-cid-my52qgmw>Real-time</span> <span class="feature-tag" data-astro-cid-my52qgmw>Deep Analysis</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="wyszukaj w sieci..." class="quick-prompt" id="tavilyPrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="openTavily()" data-astro-cid-my52qgmw>Szukaj</button> <button class="action-btn secondary" onclick="window.open('/tavily-search', '_blank')" data-astro-cid-my52qgmw>Otwórz</button> </div> </div> <!-- Status Monitor --> <div class="worker-card" data-worker="status" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>Status Workerów</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Sprawdź status i dostępność wszystkich API workerów
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Health Check</span> <span class="feature-tag" data-astro-cid-my52qgmw>Monitoring</span> <span class="feature-tag" data-astro-cid-my52qgmw>API Status</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <div class="status-indicator" id="overallStatus" data-astro-cid-my52qgmw> <span class="status-dot" data-astro-cid-my52qgmw></span> <span data-astro-cid-my52qgmw>Sprawdzanie...</span> </div> <button class="action-btn primary" onclick="checkAllStatus()" data-astro-cid-my52qgmw>Sprawdź wszystkie</button> <button class="action-btn secondary" onclick="window.open('/status', '_blank')" data-astro-cid-my52qgmw>Otwórz</button> </div> </div> </div> <!-- Advanced Agent Systems --> <div class="advanced-agents-section" data-astro-cid-my52qgmw> <h3 class="agents-title" data-astro-cid-my52qgmw>ZAAWANSOWANE SYSTEMY AGENTÓW</h3> <div class="agent-buttons" data-astro-cid-my52qgmw> <button class="agent-btn ai-agent-s" onclick="openAIAgentS()" data-astro-cid-my52qgmw> <div class="agent-icon" data-astro-cid-my52qgmw>🧠</div> <div class="agent-label" data-astro-cid-my52qgmw>AI_AGENT_S</div> <div class="agent-desc" data-astro-cid-my52qgmw>Advanced AI Reasoning</div> </button> <button class="agent-btn polaczek-sys-t" onclick="openPolaczekSysT()" data-astro-cid-my52qgmw> <div class="agent-icon" data-astro-cid-my52qgmw>⚙️</div> <div class="agent-label" data-astro-cid-my52qgmw>POLACZEK_SYS_T</div> <div class="agent-desc" data-astro-cid-my52qgmw>System Monitoring</div> </button> </div> </div> </div> </section>  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/components/AIWorkersNav.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/AIWorkersNav.astro", void 0);

const userProfessionalDescription = "Specjalista graficzny i designer z ponad 10-letnim doświadczeniem. Od 2 lat rozwijam projekty wykorzystujące sztuczną inteligencję, tworząc innowacyjne rozwiązania dla nowoczesnych firm.";

const $$IndexBackup20250830043459 = createComponent(async ($$result, $$props, $$slots) => {
  const allPosts = (await getCollection("posts")).filter(
    (post) => post.data.published
  );
  const heroTags = new Set(
    allPosts.flatMap((post) => post.data.tags)
  );
  const cosmeticTexts = {
    header: "BACKROOM",
    hero: "CLICK ON A TAG"};
  const agents = await getCollection("posts", (post) => post.data.published);
  ({
    activeAgents: agents.filter((a) => a.data.published).length,
    totalAgents: agents.length});
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "siteTitle": siteTitle, "siteDescription": SiteDescription, "headerCosmeticText": cosmeticTexts.header }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "Section", $$Section, { "class": "relative flex min-h-72 pl-4 bg-radial-[at_50%_10%] from-accent/10 to-transparent" }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="max-w-md m-auto text-center"> <span class="text-2xl">${userProfessionalDescription}</span> ${renderComponent($$result3, "Tags", Tags, { "client:load": true, "tags": heroTags, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/reactive/Tags.svelte", "client:component-export": "default" })} </div> ${renderComponent($$result3, "CosmeticText", $$CosmeticText, { "text": cosmeticTexts.hero, "vertical": true })} ` })}  ${renderComponent($$result2, "AIWorkersNav", $$AIWorkersNav, {})} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/index_backup_20250830043459.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/index_backup_20250830043459.astro";
const $$url = "/index_backup_20250830043459";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$IndexBackup20250830043459,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
