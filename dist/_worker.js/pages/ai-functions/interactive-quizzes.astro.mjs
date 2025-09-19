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
import { i as ensure_array_like, j as attr_class, k as escape_html, l as stringify, n as attr, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/vendor_BHZTJLV0.mjs';
export { d as renderers } from '../../chunks/vendor_BHZTJLV0.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_DH5CUiol.mjs';
/* empty css                                                  */
import { $ as $$DecorativeLines } from '../../chunks/DecorativeLines_CfAAnw2w.mjs';

function InteractiveQuizWidget($$payload, $$props) {
	$$payload.component(($$payload) => {

		let selectedTopic = "";
		let difficulty = "beginner";

		const topics = [
			{
				id: "programming",
				name: "💻 Programowanie",
				description: "JavaScript, Python, React, Node.js"
			},

			{
				id: "design",
				name: "🎨 Design & UX",
				description: "UI/UX design, design thinking, prototyping"
			},

			{
				id: "data-science",
				name: "📊 Data Science",
				description: "Machine learning, statystyka, Python, R"
			},

			{
				id: "marketing",
				name: "📢 Marketing",
				description: "Digital marketing, SEO, content marketing"
			},

			{
				id: "business",
				name: "💼 Business",
				description: "Zarządzanie, finanse, strategia biznesowa"
			},

			{
				id: "ai",
				name: "🤖 Sztuczna Inteligencja",
				description: "AI, machine learning, deep learning"
			}
		];

		const difficultyLevels = [
			{
				id: "beginner",
				name: "🌱 Początkujący",
				description: "Podstawowe pytania wprowadzające"
			},

			{
				id: "intermediate",
				name: "⚡ Średniozaawansowany",
				description: "Pytania wymagające analizy"
			},

			{
				id: "advanced",
				name: "🔥 Zaawansowany",
				description: "Kompleksowe scenariusze"
			},

			{
				id: "expert",
				name: "💎 Ekspert",
				description: "Najwyższy poziom trudności"
			}
		];

		$$payload.push(`<div class="quiz-widget-container svelte-14iho1h"><h2 class="widget-title svelte-14iho1h">🧠 Interaktywny Quiz AI</h2> `);

		{
			$$payload.push('<!--[-->');
			$$payload.push(`<div class="quiz-setup svelte-14iho1h"><div class="setup-section svelte-14iho1h"><h3 class="setup-title svelte-14iho1h">📖 Wybierz temat</h3> <div class="topics-grid svelte-14iho1h"><!--[-->`);

			const each_array = ensure_array_like(topics);

			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let topic = each_array[$$index];

				$$payload.push(`<button${attr_class(`topic-card ${stringify(selectedTopic === topic.id ? 'selected' : '')}`, 'svelte-14iho1h')}><div class="topic-name svelte-14iho1h">${escape_html(topic.name)}</div> <div class="topic-description svelte-14iho1h">${escape_html(topic.description)}</div></button>`);
			}

			$$payload.push(`<!--]--></div></div> <div class="setup-section svelte-14iho1h"><h3 class="setup-title svelte-14iho1h">⚡ Poziom trudności</h3> <div class="difficulty-grid svelte-14iho1h"><!--[-->`);

			const each_array_1 = ensure_array_like(difficultyLevels);

			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let level = each_array_1[$$index_1];

				$$payload.push(`<button${attr_class(`difficulty-card ${stringify(difficulty === level.id ? 'selected' : '')}`, 'svelte-14iho1h')}><div class="difficulty-name svelte-14iho1h">${escape_html(level.name)}</div> <div class="difficulty-description svelte-14iho1h">${escape_html(level.description)}</div></button>`);
			}

			$$payload.push(`<!--]--></div></div> <button class="start-quiz-btn svelte-14iho1h"${attr('disabled', !selectedTopic, true)}>🚀 Rozpocznij Quiz</button></div>`);
		}

		$$payload.push(`<!--]--> `);

		{
			$$payload.push('<!--[!-->');
		}

		$$payload.push(`<!--]--> `);

		{
			$$payload.push('<!--[!-->');
		}

		$$payload.push(`<!--]--> `);

		{
			$$payload.push('<!--[!-->');
		}

		$$payload.push(`<!--]--> `);

		{
			$$payload.push('<!--[!-->');
		}

		$$payload.push(`<!--]--></div>`);
	});
}

const $$InteractiveQuizzes = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Quizy i testy interaktywne | AI Functions | KAROL LISSON", "data-astro-cid-6sce2xus": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, { "data-astro-cid-6sce2xus": true })} ${maybeRenderHead()}<main class="min-h-svh relative z-10" data-astro-cid-6sce2xus> <!-- Background Grid Pattern --> <div class="fixed inset-0 bg-[#0a0a0a]" data-astro-cid-6sce2xus> <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-black" data-astro-cid-6sce2xus></div> <div class="cyber-grid absolute inset-0" data-astro-cid-6sce2xus></div> </div> <!-- Header Section --> <section class="relative z-20 border-b border-[#333333] pt-20" data-astro-cid-6sce2xus> <div class="max-w-6xl mx-auto px-4 py-8" data-astro-cid-6sce2xus> <div class="flex items-center justify-between mb-8" data-astro-cid-6sce2xus> <div data-astro-cid-6sce2xus> <h1 class="text-4xl md:text-5xl font-bold text-[#00ffff] mb-2 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6sce2xus>
Quizy i testy interaktywne
</h1> <p class="text-[#a0a0a0] text-lg font-['Kenyan_Coffee']" data-astro-cid-6sce2xus>
Framework do tworzenia quizów z AI oceną i spersonalizowanym
              feedbackiem
</p> </div> <div class="text-right text-sm text-[#a0a0a0] font-mono" data-astro-cid-6sce2xus> <div class="mb-1" data-astro-cid-6sce2xus>
STATUS: <span class="text-[#00ffff]" data-astro-cid-6sce2xus>INTERACTIVE</span> </div> <div data-astro-cid-6sce2xus>AI SCORING: <span class="text-[#00ffff]" data-astro-cid-6sce2xus>ACTIVE</span></div> </div> </div> <!-- Navigation --> <div class="flex gap-4 mb-8" data-astro-cid-6sce2xus> <a href="/" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm" data-astro-cid-6sce2xus>
← Powrót do głównej
</a> <a href="/zaawansowane-funkcje-ai" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#e0e0e0] hover:text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm" data-astro-cid-6sce2xus>
Wszystkie funkcje AI
</a> </div> </div> </section> <!-- Main Content --> <section class="relative z-20 py-12" data-astro-cid-6sce2xus> <div class="max-w-4xl mx-auto px-4" data-astro-cid-6sce2xus> <!-- Interactive Quiz Widget --> ${renderComponent($$result2, "InteractiveQuizWidget", InteractiveQuizWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/InteractiveQuizWidget.svelte", "client:component-export": "default", "data-astro-cid-6sce2xus": true })} <!-- Features Description --> <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6" data-astro-cid-6sce2xus> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect" data-astro-cid-6sce2xus> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6sce2xus>
Funkcjonalności
</h3> <ul class="space-y-2 text-[#e0e0e0] font-['Kenyan_Coffee']" data-astro-cid-6sce2xus> <li class="flex items-center gap-2" data-astro-cid-6sce2xus> <span class="text-[#00ffff]" data-astro-cid-6sce2xus>✓</span>
Tworzenie quizów wielokrotnego wyboru
</li> <li class="flex items-center gap-2" data-astro-cid-6sce2xus> <span class="text-[#00ffff]" data-astro-cid-6sce2xus>✓</span>
Pytania otwarte z analizą AI
</li> <li class="flex items-center gap-2" data-astro-cid-6sce2xus> <span class="text-[#00ffff]" data-astro-cid-6sce2xus>✓</span>
Automatyczne ocenianie odpowiedzi
</li> <li class="flex items-center gap-2" data-astro-cid-6sce2xus> <span class="text-[#00ffff]" data-astro-cid-6sce2xus>✓</span>
Spersonalizowany feedback
</li> <li class="flex items-center gap-2" data-astro-cid-6sce2xus> <span class="text-[#00ffff]" data-astro-cid-6sce2xus>✓</span>
Analiza wyników i raportowanie
</li> </ul> </div> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect" data-astro-cid-6sce2xus> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6sce2xus>
Możliwości AI
</h3> <ul class="space-y-2 text-[#e0e0e0] font-['Kenyan_Coffee']" data-astro-cid-6sce2xus> <li class="flex items-center gap-2" data-astro-cid-6sce2xus> <span class="text-[#00ffff]" data-astro-cid-6sce2xus>⚡</span>
Adaptacyjny poziom trudności
</li> <li class="flex items-center gap-2" data-astro-cid-6sce2xus> <span class="text-[#00ffff]" data-astro-cid-6sce2xus>⚡</span>
Analiza sentymentu odpowiedzi
</li> <li class="flex items-center gap-2" data-astro-cid-6sce2xus> <span class="text-[#00ffff]" data-astro-cid-6sce2xus>⚡</span>
Sugestie ulepszenia wiedzy
</li> <li class="flex items-center gap-2" data-astro-cid-6sce2xus> <span class="text-[#00ffff]" data-astro-cid-6sce2xus>⚡</span>
Przewidywanie wyników
</li> <li class="flex items-center gap-2" data-astro-cid-6sce2xus> <span class="text-[#00ffff]" data-astro-cid-6sce2xus>⚡</span>
Personalizowane ścieżki nauki
</li> </ul> </div> </div> <!-- Quiz Types --> <div class="mt-8 p-6 bg-gradient-to-r from-cyan-900/20 to-cyan-800/20 border border-[#00ffff]/30 glass-effect" data-astro-cid-6sce2xus> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6sce2xus>
📝 Typy quizów i testów
</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-astro-cid-6sce2xus> <div class="p-4 bg-[#111111] border border-[#333333]" data-astro-cid-6sce2xus> <div class="text-2xl mb-2" data-astro-cid-6sce2xus>🧠</div> <div class="text-lg font-bold text-[#00ffff] mb-2 font-['Neuropol']" data-astro-cid-6sce2xus>
WIEDZA
</div> <p class="text-[#a0a0a0] text-sm font-['Kenyan_Coffee'] mb-3" data-astro-cid-6sce2xus>
Sprawdzanie znajomości faktów, definicji, procedur
</p> <div class="text-xs text-[#00ffff]" data-astro-cid-6sce2xus>
Multiple choice, True/False, Fill-in-blank
</div> </div> <div class="p-4 bg-[#111111] border border-[#333333]" data-astro-cid-6sce2xus> <div class="text-2xl mb-2" data-astro-cid-6sce2xus>🎯</div> <div class="text-lg font-bold text-[#00ffff] mb-2 font-['Neuropol']" data-astro-cid-6sce2xus>
UMIEJĘTNOŚCI
</div> <p class="text-[#a0a0a0] text-sm font-['Kenyan_Coffee'] mb-3" data-astro-cid-6sce2xus>
Ocena praktycznych kompetencji i zastosowania wiedzy
</p> <div class="text-xs text-[#00ffff]" data-astro-cid-6sce2xus>
Scenario-based, Problem solving, Case studies
</div> </div> <div class="p-4 bg-[#111111] border border-[#333333]" data-astro-cid-6sce2xus> <div class="text-2xl mb-2" data-astro-cid-6sce2xus>🔍</div> <div class="text-lg font-bold text-[#00ffff] mb-2 font-['Neuropol']" data-astro-cid-6sce2xus>
OSOBOWOŚĆ
</div> <p class="text-[#a0a0a0] text-sm font-['Kenyan_Coffee'] mb-3" data-astro-cid-6sce2xus>
Profiling preferencji, stylów pracy, motywacji
</p> <div class="text-xs text-[#00ffff]" data-astro-cid-6sce2xus>
Likert scale, Behavioral questions, 360° feedback
</div> </div> </div> </div> <!-- AI Scoring System --> <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6" data-astro-cid-6sce2xus> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect" data-astro-cid-6sce2xus> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6sce2xus>
🤖 System oceniania AI
</h3> <div class="space-y-3" data-astro-cid-6sce2xus> <div class="p-3 bg-[#00ffff]/10 border border-[#00ffff]/30" data-astro-cid-6sce2xus> <div class="font-bold text-[#00ffff] font-['Neuropol']" data-astro-cid-6sce2xus>
SEMANTIC ANALYSIS
</div> <p class="text-[#a0a0a0] text-sm font-['Kenyan_Coffee']" data-astro-cid-6sce2xus>
Analiza znaczenia odpowiedzi, nie tylko słów kluczowych
</p> </div> <div class="p-3 bg-[#00ffff]/10 border border-[#00ffff]/30" data-astro-cid-6sce2xus> <div class="font-bold text-[#00ffff] font-['Neuropol']" data-astro-cid-6sce2xus>
CONTEXT UNDERSTANDING
</div> <p class="text-[#a0a0a0] text-sm font-['Kenyan_Coffee']" data-astro-cid-6sce2xus>
Uwzględnienie kontekstu i nuansów w odpowiedziach
</p> </div> <div class="p-3 bg-[#00ffff]/10 border border-[#00ffff]/30" data-astro-cid-6sce2xus> <div class="font-bold text-[#00ffff] font-['Neuropol']" data-astro-cid-6sce2xus>
PARTIAL CREDIT
</div> <p class="text-[#a0a0a0] text-sm font-['Kenyan_Coffee']" data-astro-cid-6sce2xus>
Przyznawanie punktów częściowych za niepełne odpowiedzi
</p> </div> <div class="p-3 bg-[#00ffff]/10 border border-[#00ffff]/30" data-astro-cid-6sce2xus> <div class="font-bold text-[#00ffff] font-['Neuropol']" data-astro-cid-6sce2xus>
ADAPTIVE FEEDBACK
</div> <p class="text-[#a0a0a0] text-sm font-['Kenyan_Coffee']" data-astro-cid-6sce2xus>
Feedback dostosowany do poziomu i stylu uczenia
</p> </div> </div> </div> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect" data-astro-cid-6sce2xus> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6sce2xus>
📊 Analityka wyników
</h3> <div class="p-4 bg-[#111111]/50 border border-[#333333] rounded" data-astro-cid-6sce2xus> <p class="text-[#a0a0a0] text-sm font-['Kenyan_Coffee'] italic" data-astro-cid-6sce2xus>
📊 Analityka wyników będzie dostępna po rozpoczęciu korzystania
                z systemu quizów.
</p> </div> <div class="mt-4 p-3 bg-gradient-to-r from-cyan-800/20 to-blue-800/20 border border-[#00ffff]/20" data-astro-cid-6sce2xus> <p class="text-[#e0e0e0] text-xs font-['Kenyan_Coffee']" data-astro-cid-6sce2xus> <strong class="text-[#00ffff]" data-astro-cid-6sce2xus>Learning Path Integration:</strong>
Wyniki quizów automatycznie aktualizują profile uczniów i wpływają
                na rekomendacje kolejnych materiałów edukacyjnych.
</p> </div> </div> </div> <!-- Quiz Builder --> <div class="mt-8 p-6 bg-[#111111] border border-[#333333] glass-effect" data-astro-cid-6sce2xus> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6sce2xus>
🛠️ Quiz Builder - Tworzenie testów
</h3> <div class="grid grid-cols-1 md:grid-cols-4 gap-4" data-astro-cid-6sce2xus> <div class="text-center p-3 bg-[#00ffff]/10 border border-[#00ffff]/30" data-astro-cid-6sce2xus> <div class="text-2xl mb-2" data-astro-cid-6sce2xus>📋</div> <div class="text-sm font-bold text-[#00ffff] mb-1 font-['Neuropol']" data-astro-cid-6sce2xus>
TEMPLATE
</div> <p class="text-[#a0a0a0] text-xs font-['Kenyan_Coffee']" data-astro-cid-6sce2xus>
Wybierz szablon quizu
</p> </div> <div class="text-center p-3 bg-[#00ffff]/10 border border-[#00ffff]/30" data-astro-cid-6sce2xus> <div class="text-2xl mb-2" data-astro-cid-6sce2xus>❓</div> <div class="text-sm font-bold text-[#00ffff] mb-1 font-['Neuropol']" data-astro-cid-6sce2xus>
QUESTIONS
</div> <p class="text-[#a0a0a0] text-xs font-['Kenyan_Coffee']" data-astro-cid-6sce2xus>
Dodaj pytania i odpowiedzi
</p> </div> <div class="text-center p-3 bg-[#00ffff]/10 border border-[#00ffff]/30" data-astro-cid-6sce2xus> <div class="text-2xl mb-2" data-astro-cid-6sce2xus>⚙️</div> <div class="text-sm font-bold text-[#00ffff] mb-1 font-['Neuropol']" data-astro-cid-6sce2xus>
SETTINGS
</div> <p class="text-[#a0a0a0] text-xs font-['Kenyan_Coffee']" data-astro-cid-6sce2xus>
Skonfiguruj ocenianie AI
</p> </div> <div class="text-center p-3 bg-[#00ffff]/10 border border-[#00ffff]/30" data-astro-cid-6sce2xus> <div class="text-2xl mb-2" data-astro-cid-6sce2xus>🚀</div> <div class="text-sm font-bold text-[#00ffff] mb-1 font-['Neuropol']" data-astro-cid-6sce2xus>
DEPLOY
</div> <p class="text-[#a0a0a0] text-xs font-['Kenyan_Coffee']" data-astro-cid-6sce2xus>
Uruchom i udostępnij
</p> </div> </div> <div class="mt-6 flex flex-wrap gap-4" data-astro-cid-6sce2xus> <span class="px-3 py-1 bg-[#00ffff]/20 border border-[#00ffff]/50 text-[#00ffff] text-sm font-['Neuropol'] uppercase tracking-wide" data-astro-cid-6sce2xus>
Drag & Drop Builder
</span> <span class="px-3 py-1 bg-[#00ffff]/20 border border-[#00ffff]/50 text-[#00ffff] text-sm font-['Neuropol'] uppercase tracking-wide" data-astro-cid-6sce2xus>
AI Question Generator
</span> <span class="px-3 py-1 bg-[#00ffff]/20 border border-[#00ffff]/50 text-[#00ffff] text-sm font-['Neuropol'] uppercase tracking-wide" data-astro-cid-6sce2xus>
Real-time Preview
</span> <span class="px-3 py-1 bg-[#00ffff]/20 border border-[#00ffff]/50 text-[#00ffff] text-sm font-['Neuropol'] uppercase tracking-wide" data-astro-cid-6sce2xus>
Export to LMS
</span> </div> </div> </div> </section> </main> ` })} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/interactive-quizzes.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/interactive-quizzes.astro";
const $$url = "/ai-functions/interactive-quizzes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$InteractiveQuizzes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
