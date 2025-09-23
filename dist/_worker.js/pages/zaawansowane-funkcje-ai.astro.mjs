globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { e as createAstro, c as createComponent, g as addAttribute, d as renderHead, r as renderComponent, b as renderScript, a as renderTemplate } from '../chunks/astro/server_BDhFni3J.mjs';
import { e as escape_html, c as ensure_array_like, b as attr, d as attr_class, s as stringify } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';
/* empty css                                                   */
import { L as LeadQualificationForm } from '../chunks/LeadQualificationForm_hLLLUt5K.mjs';

function MarketingContentGenerator($$renderer) {
	let prompt = '';
	let contentType = 'post na social media';

	const contentTypes = [
		'post na social media',
		'e-mail marketingowy',
		'opis produktu',
		'artykuł na blog',
		'treść reklamowa',
		'newsletter'
	];

	$$renderer.push(`<div class="worker-card bg-black border border-cyan-500/30 p-6 rounded-lg shadow-2xl svelte-he12kq"><div class="mb-6"><h2 class="text-2xl font-bold text-cyan-300 mb-2 uppercase tracking-wider">Generator treści marketingowych</h2> <p class="text-gray-400">Automatyczne generowanie profesjonalnych treści marketingowych przy użyciu AI</p></div> <div class="space-y-4"><div><label for="prompt" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Temat treści</label> <textarea id="prompt" placeholder="Wpisz temat, o którym ma być treść marketingowa..." rows="4" class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono">`);

	const $$body = escape_html(prompt);

	if ($$body) {
		$$renderer.push(`${$$body}`);
	}

	$$renderer.push(`</textarea></div> <div><label for="contentType" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Rodzaj treści</label> `);

	$$renderer.select(
		{
			id: 'contentType',
			value: contentType,
			class: 'w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono'
		},
		($$renderer) => {
			$$renderer.push(`<!--[-->`);

			const each_array = ensure_array_like(contentTypes);

			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let type = each_array[$$index];

				$$renderer.option({ value: type }, ($$renderer) => {
					$$renderer.push(`${escape_html(type)}`);
				});
			}

			$$renderer.push(`<!--]-->`);
		}
	);

	$$renderer.push(`</div> <div class="flex gap-4"><button${attr('disabled', !prompt.trim(), true)} class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-cyan-500/50 uppercase tracking-wide">${escape_html('Generuj treść')}</button> <button class="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg font-semibold hover:bg-gray-600/50 hover:border-gray-500/50 transition-all duration-300 uppercase tracking-wide">Wyczyść</button></div> `);

	{
		$$renderer.push('<!--[!-->');
	}

	$$renderer.push(`<!--]--> `);

	{
		$$renderer.push('<!--[!-->');
	}

	$$renderer.push(`<!--]--></div></div>`);
}

function RecommendationsWidget($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let preferences = "";
		let history = "";
		let recommendations = [];
		let loading = false;

		function getPriorityColor(priority) {
			if (priority >= 4) return "border-green-400 bg-green-900/10";
			if (priority >= 3) return "border-yellow-400 bg-yellow-900/10";

			return "border-gray-500 bg-gray-900/10";
		}

		function getPriorityText(priority) {
			if (priority >= 4) return "Wysoki priorytet";
			if (priority >= 3) return "Średni priorytet";

			return "Niski priorytet";
		}

		$$renderer.push(`<div class="worker-card bg-black border border-cyan-500/30 p-6 rounded-lg shadow-2xl svelte-1nof2ng"><div class="mb-6"><h2 class="text-2xl font-bold text-cyan-300 mb-2 uppercase tracking-wider">Personalizowane rekomendacje</h2> <p class="text-gray-400">System rekomendacji produktów i usług oparty na preferencjach użytkownika</p></div> <div class="space-y-4"><div><label for="preferences" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Preferencje użytkownika</label> <textarea id="preferences" placeholder="Wpisz preferencje użytkownika (np. technologie, marketing, e-commerce)..." rows="3" class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono">`);

		const $$body = escape_html(preferences);

		if ($$body) {
			$$renderer.push(`${$$body}`);
		}

		$$renderer.push(`</textarea></div> <div><label for="history" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Historia użytkownika (opcjonalnie)</label> <input id="history"${attr('value', history)} placeholder="Historia zakupów, odwiedzonych stron (oddziel przecinkami)..." class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"/></div> <div class="flex gap-4"><button${attr('disabled', !preferences.trim(), true)} class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-cyan-500/50 uppercase tracking-wide">${escape_html("Generuj rekomendacje")}</button> `);

		if (recommendations.length > 0) {
			$$renderer.push('<!--[-->');
			$$renderer.push(`<button${attr('disabled', loading, true)} class="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg font-semibold hover:bg-gray-600/50 hover:border-gray-500/50 transition-all duration-300 disabled:opacity-50 uppercase tracking-wide">Odśwież</button>`);
		} else {
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		if (recommendations.length > 0 && !loading) {
			$$renderer.push('<!--[-->');
			$$renderer.push(`<div class="mt-6"><h3 class="text-lg font-semibold text-cyan-300 mb-4 uppercase tracking-wider">Rekomendacje dla Ciebie (${escape_html(recommendations.length)})</h3> <div class="grid gap-4"><!--[-->`);

			const each_array = ensure_array_like(recommendations);

			for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
				let rec = each_array[idx];

				$$renderer.push(`<div${attr_class(`p-4 rounded-lg border ${stringify(getPriorityColor(rec.priority || 3))} transition-all duration-300 hover:shadow-xl hover:border-opacity-80 bg-gray-900/20`, 'svelte-1nof2ng')}><div class="flex justify-between items-start mb-3"><h4 class="text-white font-bold text-lg uppercase tracking-wide">${escape_html(rec.title)}</h4> `);

				if (rec.priority) {
					$$renderer.push('<!--[-->');
					$$renderer.push(`<span class="px-2 py-1 bg-gray-800/50 border border-gray-600/30 text-xs rounded text-gray-300 uppercase tracking-wide">${escape_html(getPriorityText(rec.priority))}</span>`);
				} else {
					$$renderer.push('<!--[!-->');
				}

				$$renderer.push(`<!--]--></div> <p class="text-gray-300 mb-3 leading-relaxed font-mono text-sm">${escape_html(rec.description)}</p> `);

				if (rec.reason) {
					$$renderer.push('<!--[-->');
					$$renderer.push(`<div class="mb-3"><span class="text-cyan-400 text-sm font-semibold uppercase tracking-wide">Dlaczego dla Ciebie:</span> <p class="text-gray-400 text-sm italic font-mono">${escape_html(rec.reason)}</p></div>`);
				} else {
					$$renderer.push('<!--[!-->');
				}

				$$renderer.push(`<!--]--> `);

				if (rec.category) {
					$$renderer.push('<!--[-->');
					$$renderer.push(`<div class="flex justify-between items-center"><span class="px-3 py-1 bg-cyan-900/20 border border-cyan-500/30 text-cyan-300 text-xs rounded uppercase tracking-wide font-semibold">${escape_html(rec.category)}</span> <button class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-sm rounded hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 uppercase tracking-wide font-semibold border border-cyan-500/50">Dowiedz się więcej</button></div>`);
				} else {
					$$renderer.push('<!--[!-->');
				}

				$$renderer.push(`<!--]--></div>`);
			}

			$$renderer.push(`<!--]--></div></div>`);
		} else {
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		if (recommendations.length === 0 && preferences) ; else {
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--></div></div>`);
	});
}

const $$Astro = createAstro("https://mybonzo.com");
const $$ZaawansowaneFunkcjeAi = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ZaawansowaneFunkcjeAi;
  return renderTemplate`<html lang="pl"> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Zaawansowane Funkcje AI - MyBonzo</title><meta name="description" content="System zaawansowanej automatyzacji AI - Generator treĹ›ci marketingowych, Personalizowane rekomendacje, Automatyzacja obsĹ‚ugi klienta">${renderHead()}</head> <body class="bg-black text-white min-h-screen"> <!-- Background Grid Pattern --> <div class="fixed inset-0 bg-black"> <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-black"></div> <div class="absolute inset-0" style="background-image: 
=======
/* empty css                                  */
import { d as createAstro, c as createComponent, g as addAttribute, e as renderHead, r as renderComponent, b as renderScript, a as renderTemplate } from '../chunks/astro/server_CDFI50iS.mjs';
import { M as MarketingContentGenerator } from '../chunks/MarketingContentGenerator_BN1iCHas.mjs';
import { R as RecommendationsWidget } from '../chunks/RecommendationsWidget_Cw7HP83S.mjs';
import { L as LeadQualificationForm } from '../chunks/LeadQualificationForm_CK37g4ft.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$Astro = createAstro("https://www.mybonzo.com");
const $$ZaawansowaneFunkcjeAi = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ZaawansowaneFunkcjeAi;
  return renderTemplate`<html lang="pl"> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Zaawansowane Funkcje AI - MyBonzo</title><meta name="description" content="System zaawansowanej automatyzacji AI - Generator treści marketingowych, Personalizowane rekomendacje, Automatyzacja obsługi klienta">${renderHead()}</head> <body class="bg-black text-white min-h-screen"> <!-- Background Grid Pattern --> <div class="fixed inset-0 bg-black"> <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-black"></div> <div class="absolute inset-0" style="background-image: 
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;"></div> </div> <main class="relative z-10 min-h-screen"> <!-- Header Section --> <section class="border-b border-cyan-500/30"> <div class="max-w-6xl mx-auto px-4 py-8"> <div class="flex items-center justify-between mb-8"> <div> <h1 class="text-4xl md:text-5xl font-bold text-cyan-300 mb-2 uppercase tracking-wider">
Zaawansowane Funkcje AI
</h1> <p class="text-gray-400 text-lg">
System zaawansowanej automatyzacji z wykorzystaniem sztucznej inteligencji
</p> </div> <div class="text-right text-sm text-gray-500 font-mono"> <div class="mb-1">SYSTEM STATUS: <span class="text-green-400">ONLINE</span></div> <div>AI MODELS: <span class="text-cyan-400">ACTIVE</span></div> </div> </div> <!-- Quote --> <div class="p-4 border border-cyan-500/30 rounded-lg bg-gray-900/20 mb-8"> <blockquote class="text-cyan-300 italic font-mono text-center">
<<<<<<< HEAD
"Ĺ»ycie to nie problem do rozwiÄ…zania, lecz rzeczywistoĹ›Ä‡ do doĹ›wiadczenia." - SĂ¸ren Kierkegaard
</blockquote> <div class="text-right text-gray-400 text-sm mt-2 font-mono uppercase tracking-wide">
AUG 2025
</div> </div> <!-- Navigation Cards --> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> <a href="#marketing" class="block p-4 border border-cyan-500/30 rounded-lg bg-gray-900/20 hover:bg-gray-800/30 transition-all duration-300 group"> <div class="text-cyan-300 text-lg font-semibold uppercase tracking-wide mb-2 group-hover:text-cyan-200">
đźŽŻ Generator TreĹ›ci
</div> <div class="text-gray-400 text-sm font-mono">
Automatyczne generowanie profesjonalnych treĹ›ci marketingowych
</div> </a> <a href="#recommendations" class="block p-4 border border-cyan-500/30 rounded-lg bg-gray-900/20 hover:bg-gray-800/30 transition-all duration-300 group"> <div class="text-cyan-300 text-lg font-semibold uppercase tracking-wide mb-2 group-hover:text-cyan-200">
đź“Š Rekomendacje
</div> <div class="text-gray-400 text-sm font-mono">
System rekomendacji produktĂłw i usĹ‚ug z analizÄ… preferencji
</div> </a> <a href="#leads" class="block p-4 border border-cyan-500/30 rounded-lg bg-gray-900/20 hover:bg-gray-800/30 transition-all duration-300 group"> <div class="text-cyan-300 text-lg font-semibold uppercase tracking-wide mb-2 group-hover:text-cyan-200">
đź¤– ObsĹ‚uga Klienta
</div> <div class="text-gray-400 text-sm font-mono">
AI do kwalifikacji leadĂłw i automatycznych odpowiedzi
</div> </a> </div> </div> </section> <!-- Functions Section --> <section class="py-12"> <div class="max-w-7xl mx-auto px-4 space-y-16"> <!-- Marketing Content Generator --> <div id="marketing" class="scroll-mt-8"> <div class="mb-8"> <h2 class="text-3xl font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center"> <span class="w-8 h-8 bg-cyan-500 rounded mr-4 flex items-center justify-center text-black font-bold">1</span>
Automatyczne generowanie treĹ›ci marketingowych
</h2> <p class="text-gray-400 font-mono max-w-3xl">
Wykorzystuje zaawansowane modele jÄ™zykowe AI do tworzenia profesjonalnych treĹ›ci marketingowych na podstawie podanego tematu. 
                            System generuje rĂłĹĽne rodzaje treĹ›ci: posty na social media, e-maile marketingowe, opisy produktĂłw i wiÄ™cej.
</p> </div> ${renderComponent($$result, "MarketingContentGenerator", MarketingContentGenerator, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/MarketingContentGenerator.svelte", "client:component-export": "default" })} </div> <!-- Recommendations Widget --> <div id="recommendations" class="scroll-mt-8"> <div class="mb-8"> <h2 class="text-3xl font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center"> <span class="w-8 h-8 bg-cyan-500 rounded mr-4 flex items-center justify-center text-black font-bold">2</span>
Personalizowane rekomendacje produktĂłw/usĹ‚ug
</h2> <p class="text-gray-400 font-mono max-w-3xl">
System rekomendacyjny analizuje preferencje uĹĽytkownika i historiÄ™, aby wygenerowaÄ‡ spersonalizowane propozycje produktĂłw i usĹ‚ug. 
                            Wykorzystuje AI do zrozumienia potrzeb klienta i dopasowania najlepszych rozwiÄ…zaĹ„.
</p> </div> ${renderComponent($$result, "RecommendationsWidget", RecommendationsWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/RecommendationsWidget.svelte", "client:component-export": "default" })} </div> <!-- Lead Qualification Form --> <div id="leads" class="scroll-mt-8"> <div class="mb-8"> <h2 class="text-3xl font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center"> <span class="w-8 h-8 bg-cyan-500 rounded mr-4 flex items-center justify-center text-black font-bold">3</span>
Automatyzacja obsĹ‚ugi klienta i leadĂłw
</h2> <p class="text-gray-400 font-mono max-w-3xl">
Inteligentny system kwalifikacji leadĂłw ktĂłry automatycznie analizuje zapytania klientĂłw, ocenia ich wartoĹ›Ä‡ biznesowÄ… 
                            i generuje profesjonalne odpowiedzi. Integruje siÄ™ z systemami CRM dla peĹ‚nej automatyzacji procesĂłw sprzedaĹĽowych.
</p> </div> ${renderComponent($$result, "LeadQualificationForm", LeadQualificationForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/LeadQualificationForm.svelte", "client:component-export": "default" })} </div> </div> </section> <!-- Footer --> <footer class="border-t border-cyan-500/30 mt-16"> <div class="max-w-6xl mx-auto px-4 py-8"> <div class="flex justify-between items-center"> <div class="text-gray-400 font-mono text-sm">
Â© 2025 MyBonzo AI System - Zaawansowane funkcje AI
</div> <div class="text-cyan-400 font-mono text-sm uppercase tracking-wide">
Powered by OpenAI GPT-4
</div> </div> </div> </footer> </main> ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/zaawansowane-funkcje-ai.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/zaawansowane-funkcje-ai.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/zaawansowane-funkcje-ai.astro";
const $$url = "/zaawansowane-funkcje-ai";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ZaawansowaneFunkcjeAi,
  file: $$file,
  url: $$url
=======
"Życie to nie problem do rozwiązania, lecz rzeczywistość do doświadczenia." - Søren Kierkegaard
</blockquote> <div class="text-right text-gray-400 text-sm mt-2 font-mono uppercase tracking-wide">
AUG 2025
</div> </div> <!-- Navigation Cards --> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> <a href="#marketing" class="block p-4 border border-cyan-500/30 rounded-lg bg-gray-900/20 hover:bg-gray-800/30 transition-all duration-300 group"> <div class="text-cyan-300 text-lg font-semibold uppercase tracking-wide mb-2 group-hover:text-cyan-200">
🎯 Generator Treści
</div> <div class="text-gray-400 text-sm font-mono">
Automatyczne generowanie profesjonalnych treści marketingowych
</div> </a> <a href="#recommendations" class="block p-4 border border-cyan-500/30 rounded-lg bg-gray-900/20 hover:bg-gray-800/30 transition-all duration-300 group"> <div class="text-cyan-300 text-lg font-semibold uppercase tracking-wide mb-2 group-hover:text-cyan-200">
📊 Rekomendacje
</div> <div class="text-gray-400 text-sm font-mono">
System rekomendacji produktów i usług z analizą preferencji
</div> </a> <a href="#leads" class="block p-4 border border-cyan-500/30 rounded-lg bg-gray-900/20 hover:bg-gray-800/30 transition-all duration-300 group"> <div class="text-cyan-300 text-lg font-semibold uppercase tracking-wide mb-2 group-hover:text-cyan-200">
🤖 Obsługa Klienta
</div> <div class="text-gray-400 text-sm font-mono">
AI do kwalifikacji leadów i automatycznych odpowiedzi
</div> </a> </div> </div> </section> <!-- Functions Section --> <section class="py-12"> <div class="max-w-7xl mx-auto px-4 space-y-16"> <!-- Marketing Content Generator --> <div id="marketing" class="scroll-mt-8"> <div class="mb-8"> <h2 class="text-3xl font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center"> <span class="w-8 h-8 bg-cyan-500 rounded mr-4 flex items-center justify-center text-black font-bold">1</span>
Automatyczne generowanie treści marketingowych
</h2> <p class="text-gray-400 font-mono max-w-3xl">
Wykorzystuje zaawansowane modele językowe AI do tworzenia profesjonalnych treści marketingowych na podstawie podanego tematu. 
                            System generuje różne rodzaje treści: posty na social media, e-maile marketingowe, opisy produktów i więcej.
</p> </div> ${renderComponent($$result, "MarketingContentGenerator", MarketingContentGenerator, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/MarketingContentGenerator.svelte", "client:component-export": "default" })} </div> <!-- Recommendations Widget --> <div id="recommendations" class="scroll-mt-8"> <div class="mb-8"> <h2 class="text-3xl font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center"> <span class="w-8 h-8 bg-cyan-500 rounded mr-4 flex items-center justify-center text-black font-bold">2</span>
Personalizowane rekomendacje produktów/usług
</h2> <p class="text-gray-400 font-mono max-w-3xl">
System rekomendacyjny analizuje preferencje użytkownika i historię, aby wygenerować spersonalizowane propozycje produktów i usług. 
                            Wykorzystuje AI do zrozumienia potrzeb klienta i dopasowania najlepszych rozwiązań.
</p> </div> ${renderComponent($$result, "RecommendationsWidget", RecommendationsWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/RecommendationsWidget.svelte", "client:component-export": "default" })} </div> <!-- Lead Qualification Form --> <div id="leads" class="scroll-mt-8"> <div class="mb-8"> <h2 class="text-3xl font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center"> <span class="w-8 h-8 bg-cyan-500 rounded mr-4 flex items-center justify-center text-black font-bold">3</span>
Automatyzacja obsługi klienta i leadów
</h2> <p class="text-gray-400 font-mono max-w-3xl">
Inteligentny system kwalifikacji leadów który automatycznie analizuje zapytania klientów, ocenia ich wartość biznesową 
                            i generuje profesjonalne odpowiedzi. Integruje się z systemami CRM dla pełnej automatyzacji procesów sprzedażowych.
</p> </div> ${renderComponent($$result, "LeadQualificationForm", LeadQualificationForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/LeadQualificationForm.svelte", "client:component-export": "default" })} </div> </div> </section> <!-- Footer --> <footer class="border-t border-cyan-500/30 mt-16"> <div class="max-w-6xl mx-auto px-4 py-8"> <div class="flex justify-between items-center"> <div class="text-gray-400 font-mono text-sm">
© 2025 MyBonzo AI System - Zaawansowane funkcje AI
</div> <div class="text-cyan-400 font-mono text-sm uppercase tracking-wide">
Powered by OpenAI GPT-4
</div> </div> </div> </footer> </main> ${renderScript($$result, "Q:/mybonzo/mybonzo-github/src/pages/zaawansowane-funkcje-ai.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "Q:/mybonzo/mybonzo-github/src/pages/zaawansowane-funkcje-ai.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/zaawansowane-funkcje-ai.astro";
const $$url = "/zaawansowane-funkcje-ai";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$ZaawansowaneFunkcjeAi,
    file: $$file,
    url: $$url
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
