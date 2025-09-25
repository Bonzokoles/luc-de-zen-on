globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, m as maybeRenderHead, b as renderScript, a as renderTemplate, r as renderComponent } from '../chunks/astro/server_DFvGEJvU.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_BhCD-Bso.mjs';
import { A as AiHelpAssistant, B as BackgroundMusicPlayerSimple, $ as $$RandomQuote } from '../chunks/BackgroundMusicPlayerSimple_vxnTak_e.mjs';
import { F as FAQGeneratorWidget } from '../chunks/FAQGeneratorWidget_C7MhzNY3.mjs';
import { b as attr, c as escape_html } from '../chunks/_@astro-renderers_Ba3qNCWV.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Ba3qNCWV.mjs';
/* empty css                                              */
import { W as WorkersStatusDashboard } from '../chunks/WorkersStatusDashboard_Cp-NROEE.mjs';
import { $ as $$DecorativeLines } from '../chunks/DecorativeLines_BV683skl.mjs';

function ImageGeneratorWidget($$renderer) {}

function PolaczekWidget($$renderer) {}

function MainChatWidget($$renderer) {}

function EducationRecommendationsWidget($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let userProfile = {
			currentLevel: '',
			interests: '',
			careerGoals: '',
			availableTime: '',
			learningStyle: '',
			budget: ''
		};

		$$renderer.push(`<div class="education-widget-container svelte-1dtmteu"><h2 class="widget-title svelte-1dtmteu">🎓 System rekomendacji edukacyjnych</h2> <div class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2">Obecny poziom umiejętności *</label> `);

		$$renderer.select({ value: userProfile.currentLevel, class: 'widget-select' }, ($$renderer) => {
			$$renderer.option({ value: '', class: '' }, ($$renderer) => {
				$$renderer.push(`Wybierz poziom`);
			});

			$$renderer.option({ value: 'początkujący', class: '' }, ($$renderer) => {
				$$renderer.push(`Początkujący`);
			});

			$$renderer.option({ value: 'średnio-zaawansowany', class: '' }, ($$renderer) => {
				$$renderer.push(`Średnio-zaawansowany`);
			});

			$$renderer.option({ value: 'zaawansowany', class: '' }, ($$renderer) => {
				$$renderer.push(`Zaawansowany`);
			});

			$$renderer.option({ value: 'ekspert', class: '' }, ($$renderer) => {
				$$renderer.push(`Ekspert`);
			});
		});

		$$renderer.push(`</div> <div><label class="block text-sm font-medium mb-2">Dostępny czas na naukę</label> `);

		$$renderer.select({ value: userProfile.availableTime, class: 'widget-select' }, ($$renderer) => {
			$$renderer.option({ value: '', class: '' }, ($$renderer) => {
				$$renderer.push(`Wybierz czas`);
			});

			$$renderer.option({ value: '1-2 godziny dziennie', class: '' }, ($$renderer) => {
				$$renderer.push(`1-2 godziny dziennie`);
			});

			$$renderer.option({ value: '3-5 godzin dziennie', class: '' }, ($$renderer) => {
				$$renderer.push(`3-5 godzin dziennie`);
			});

			$$renderer.option({ value: 'weekend tylko', class: '' }, ($$renderer) => {
				$$renderer.push(`Tylko weekendy`);
			});

			$$renderer.option({ value: 'intensywny kurs', class: '' }, ($$renderer) => {
				$$renderer.push(`Kurs intensywny (pełen etat)`);
			});
		});

		$$renderer.push(`</div> <div><label class="block text-sm font-medium mb-2">Preferowany styl nauki</label> `);

		$$renderer.select({ value: userProfile.learningStyle, class: 'widget-select' }, ($$renderer) => {
			$$renderer.option({ value: '', class: '' }, ($$renderer) => {
				$$renderer.push(`Wybierz styl`);
			});

			$$renderer.option({ value: 'wideo i interaktywne', class: '' }, ($$renderer) => {
				$$renderer.push(`Wideo i kursy interaktywne`);
			});

			$$renderer.option({ value: 'książki i dokumentacja', class: '' }, ($$renderer) => {
				$$renderer.push(`Książki i dokumentacja`);
			});

			$$renderer.option({ value: 'praktyczne projekty', class: '' }, ($$renderer) => {
				$$renderer.push(`Praktyczne projekty`);
			});

			$$renderer.option({ value: 'mentoring i grupy', class: '' }, ($$renderer) => {
				$$renderer.push(`Mentoring i grupy studyjne`);
			});

			$$renderer.option({ value: 'mieszany', class: '' }, ($$renderer) => {
				$$renderer.push(`Podejście mieszane`);
			});
		});

		$$renderer.push(`</div> <div><label class="block text-sm font-medium mb-2">Budżet</label> `);

		$$renderer.select({ value: userProfile.budget, class: 'widget-select' }, ($$renderer) => {
			$$renderer.option({ value: '', class: '' }, ($$renderer) => {
				$$renderer.push(`Wybierz budżet`);
			});

			$$renderer.option({ value: 'darmowe', class: '' }, ($$renderer) => {
				$$renderer.push(`Tylko darmowe`);
			});

			$$renderer.option({ value: 'do 500 zł', class: '' }, ($$renderer) => {
				$$renderer.push(`Do 500 zł`);
			});

			$$renderer.option({ value: 'do 1500 zł', class: '' }, ($$renderer) => {
				$$renderer.push(`Do 1500 zł`);
			});

			$$renderer.option({ value: 'do 5000 zł', class: '' }, ($$renderer) => {
				$$renderer.push(`Do 5000 zł`);
			});

			$$renderer.option({ value: 'bez ograniczeń', class: '' }, ($$renderer) => {
				$$renderer.push(`Bez ograniczeń`);
			});
		});

		$$renderer.push(`</div></div> <div><label class="block text-sm font-medium mb-2">Zainteresowania i dziedziny *</label> <input type="text"${attr('value', userProfile.interests)} placeholder="np. programowanie, data science, marketing, design..." class="widget-input svelte-1dtmteu"/></div> <div><label class="block text-sm font-medium mb-2">Cele zawodowe</label> <textarea rows="3" placeholder="Opisz swoje cele zawodowe, wymarzone stanowisko, projekty..." class="widget-textarea svelte-1dtmteu">`);

		const $$body = escape_html(userProfile.careerGoals);

		if ($$body) {
			$$renderer.push(`${$$body}`);
		}

		$$renderer.push(`</textarea></div> <div class="flex gap-3"><button${attr('disabled', true, true)} class="action-btn primary svelte-1dtmteu">`);

		{
			$$renderer.push('<!--[!-->');
			$$renderer.push(`🎯 Pobierz rekomendacje`);
		}

		$$renderer.push(`<!--]--></button> <button class="action-btn secondary svelte-1dtmteu">🗑️ Wyczyść</button></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> <div class="tip-text svelte-1dtmteu">💡 Tip: Im więcej szczegółów podasz, tym bardziej spersonalizowane będą rekomendacje</div></div></div>`);
	});
}

function TicketSubmissionWidget($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let form = { description: "", email: "", priority: "medium", category: "" };

		$$renderer.push(`<div class="ticket-widget-container svelte-s2lxog"><h2 class="widget-title svelte-s2lxog">🎫 System zgłoszeń i ticketów</h2> <div class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2">Email *</label> <input type="email"${attr('value', form.email)} placeholder="twoj.email@example.com" class="widget-input svelte-s2lxog"/></div> <div><label class="block text-sm font-medium mb-2">Priorytet</label> `);

		$$renderer.select({ value: form.priority, class: 'widget-select' }, ($$renderer) => {
			$$renderer.option({ value: 'low', class: '' }, ($$renderer) => {
				$$renderer.push(`🟢 Niski`);
			});

			$$renderer.option({ value: 'medium', class: '' }, ($$renderer) => {
				$$renderer.push(`🟡 Średni`);
			});

			$$renderer.option({ value: 'high', class: '' }, ($$renderer) => {
				$$renderer.push(`🟠 Wysoki`);
			});

			$$renderer.option({ value: 'critical', class: '' }, ($$renderer) => {
				$$renderer.push(`🔴 Krytyczny`);
			});
		});

		$$renderer.push(`</div></div> <div><label class="block text-sm font-medium mb-2">Kategoria (opcjonalna)</label> `);

		$$renderer.select({ value: form.category, class: 'widget-select' }, ($$renderer) => {
			$$renderer.option({ value: '', class: '' }, ($$renderer) => {
				$$renderer.push(`Wybierz kategorię`);
			});

			$$renderer.option({ value: 'bug', class: '' }, ($$renderer) => {
				$$renderer.push(`🐛 Błąd w systemie`);
			});

			$$renderer.option({ value: 'feature-request', class: '' }, ($$renderer) => {
				$$renderer.push(`✨ Prośba o funkcję`);
			});

			$$renderer.option({ value: 'question', class: '' }, ($$renderer) => {
				$$renderer.push(`❓ Pytanie`);
			});

			$$renderer.option({ value: 'billing', class: '' }, ($$renderer) => {
				$$renderer.push(`💰 Płatności/Faktury`);
			});

			$$renderer.option({ value: 'integration', class: '' }, ($$renderer) => {
				$$renderer.push(`🔗 Integracje`);
			});

			$$renderer.option({ value: 'performance', class: '' }, ($$renderer) => {
				$$renderer.push(`⚡ Wydajność`);
			});

			$$renderer.option({ value: 'other', class: '' }, ($$renderer) => {
				$$renderer.push(`🤔 Inne`);
			});
		});

		$$renderer.push(`</div> <div><label class="block text-sm font-medium mb-2">Opis problemu *</label> <textarea rows="6" placeholder="Opisz szczegółowo swój problem lub zapytanie. Im więcej informacji podasz, tym szybciej będziemy mogli pomóc..." class="widget-textarea svelte-s2lxog">`);

		const $$body = escape_html(form.description);

		if ($$body) {
			$$renderer.push(`${$$body}`);
		}

		$$renderer.push(`</textarea></div> <div class="flex gap-3"><button${attr('disabled', true, true)} class="action-btn primary svelte-s2lxog">`);

		{
			$$renderer.push('<!--[!-->');
			$$renderer.push(`🎫 Wyślij zgłoszenie`);
		}

		$$renderer.push(`<!--]--></button> <button class="action-btn secondary svelte-s2lxog">🗑️ Wyczyść</button></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> <div class="text-xs text-gray-400 italic">💡 Tip: Podanie szczegółowego opisu problemu pomoże naszemu systemowi AI
      lepiej sklasyfikować zgłoszenie</div></div></div>`);
	});
}

const $$FlowiseButton = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<input type="text" id="flowise-input" placeholder="Wpisz prompt do Flowise..."> <button onclick="handleFlowise()">
Uruchom Flowise
</button> ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/components/FlowiseButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/FlowiseButton.astro", void 0);

const $$ActivePiecesButton = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<textarea rows="4" id="activepieces-input" placeholder="Wprowadź JSON jako dane wejściowe"></textarea> <button onclick="handleActivePieces()">
Uruchom ActivePieces
</button> ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/components/ActivePiecesButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/ActivePiecesButton.astro", void 0);

const $$IndexCleanBackup = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "AI Workers Platform | KAROL LISSON", "data-astro-cid-rxo3mmkh": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, { "data-astro-cid-rxo3mmkh": true })}  ${maybeRenderHead()}<div class="absolute left-0 right-0 h-full pointer-events-none" data-astro-cid-rxo3mmkh> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-rxo3mmkh></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-rxo3mmkh></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-rxo3mmkh></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-rxo3mmkh></div> </div> <main class="min-h-screen" style="overflow: visible !important;" data-astro-cid-rxo3mmkh> <!-- Top Separator Section --> <section class="border border-edge relative" data-astro-cid-rxo3mmkh> <div class="py-1" data-astro-cid-rxo3mmkh></div> </section> <!-- AI Workers Section - Centered --> <section class="border border-edge ai-workers-section flex items-center justify-center py-16 relative" id="ai-workers" style="display: block !important; visibility: visible !important; opacity: 1 !important;" data-astro-cid-rxo3mmkh> <!-- Main Content Container --> <div class="container mx-auto px-4 relative z-10" data-astro-cid-rxo3mmkh> <div class="text-center mb-12" data-astro-cid-rxo3mmkh> <h2 class="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" data-astro-cid-rxo3mmkh>
AI Workers Ecosystem
</h2> <p class="text-lg text-muted-foreground max-w-2xl mx-auto" data-astro-cid-rxo3mmkh>
Kompleksowa platforma AI z zaawansowanymi funkcjami biznesowymi
</p> </div> <!-- Quick Actions Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" data-astro-cid-rxo3mmkh> <!-- Image Generator --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🎨</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Generator Obrazów</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Tworzenie obrazów AI z zaawansowanymi promptami
</p> ${renderComponent($$result2, "ImageGeneratorWidget", ImageGeneratorWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/ImageGeneratorWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- Chat Assistant --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>💬</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Chatbot AI</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Inteligentny asystent z wieloma modelami AI
</p> ${renderComponent($$result2, "MainChatWidget", MainChatWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/MainChatWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- Polaczek Widget --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🤖</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Polaczek AI</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Specjalistyczny agent AI dla zadań biznesowych
</p> ${renderComponent($$result2, "PolaczekWidget", PolaczekWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/PolaczekWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> </div> <!-- Business Functions Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" data-astro-cid-rxo3mmkh> <!-- AI Help Assistant --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🆘</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Pomoc AI</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Asystent pomocy technicznej
</p> ${renderComponent($$result2, "AiHelpAssistant", AiHelpAssistant, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/AiHelpAssistant.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- FAQ Generator --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>❓</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Generator FAQ</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>Automatyczne tworzenie FAQ</p> ${renderComponent($$result2, "FAQGeneratorWidget", FAQGeneratorWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/FAQGeneratorWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- Education Recommendations --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🎓</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Rekomendacje Edukacyjne</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Personalizowane ścieżki rozwoju
</p> ${renderComponent($$result2, "EducationRecommendationsWidget", EducationRecommendationsWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/EducationRecommendationsWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> </div> <!-- System Management --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" data-astro-cid-rxo3mmkh> <!-- Ticket System --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🎫</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>System Zgłoszeń</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Zarządzanie ticketami i zgłoszeniami
</p> ${renderComponent($$result2, "TicketSubmissionWidget", TicketSubmissionWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/TicketSubmissionWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- Workers Status --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>📊</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Status Workers</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Monitoring stanu wszystkich serwisów
</p> ${renderComponent($$result2, "WorkersStatusDashboard", WorkersStatusDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/WorkersStatusDashboard.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> </div> <!-- Automation Integration --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" data-astro-cid-rxo3mmkh> <!-- Flowise AI --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🌊</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Flowise AI</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>Zaawansowane workflow AI</p> ${renderComponent($$result2, "FlowiseButton", $$FlowiseButton, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/FlowiseButton.astro", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- ActivePieces --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🧩</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>ActivePieces</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Automatyzacja procesów biznesowych
</p> ${renderComponent($$result2, "ActivePiecesButton", $$ActivePiecesButton, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/ActivePiecesButton.astro", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> </div> </div> </section> <!-- Background Music Player --> ${renderComponent($$result2, "BackgroundMusicPlayerSimple", BackgroundMusicPlayerSimple, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/BackgroundMusicPlayerSimple.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} <!-- Quote Section --> <section class="border border-edge relative" data-astro-cid-rxo3mmkh> <div class="container mx-auto px-4 py-8" data-astro-cid-rxo3mmkh> ${renderComponent($$result2, "RandomQuote", $$RandomQuote, { "data-astro-cid-rxo3mmkh": true })} </div> </section> </main> ` })} ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/index_clean_backup.astro?astro&type=script&index=0&lang.ts")} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/index_clean_backup.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/index_clean_backup.astro";
const $$url = "/index_clean_backup";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$IndexCleanBackup,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
