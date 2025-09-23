globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { c as createComponent, m as maybeRenderHead, b as renderScript, a as renderTemplate, r as renderComponent } from '../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_B8kqLEdJ.mjs';
import { $ as $$RandomQuote } from '../chunks/RandomQuote_CGLTko5I.mjs';
import { b as attr, e as escape_html, g as attr_style, s as stringify } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';
/* empty css                                              */
import { A as AiHelpAssistant } from '../chunks/BackgroundMusicPlayerFixed_Ber633Wa.mjs';
import { F as FAQGeneratorWidget } from '../chunks/FAQGeneratorWidget_BtrZPV4I.mjs';
import { E as EducationRecommendationsWidget } from '../chunks/EducationRecommendationsWidget_BrRTOiGZ.mjs';
import { T as TicketSubmissionWidget } from '../chunks/TicketSubmissionWidget_PX_8ih7p.mjs';
import { W as WorkersStatusDashboard } from '../chunks/WorkersStatusDashboard_BtnDHy3d.mjs';
import { $ as $$DecorativeLines } from '../chunks/DecorativeLines_BgZWjcZU.mjs';
=======
/* empty css                                  */
import { c as createComponent, m as maybeRenderHead, b as renderScript, a as renderTemplate, r as renderComponent } from '../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_DdWhmxse.mjs';
import { A as AiHelpAssistant, B as BackgroundMusicPlayerSimple, $ as $$RandomQuote } from '../chunks/BackgroundMusicPlayerSimple_BNZxycy-.mjs';
import { F as FAQGeneratorWidget } from '../chunks/FAQGeneratorWidget__7kTk4Ho.mjs';
import { E as EducationRecommendationsWidget } from '../chunks/EducationRecommendationsWidget_CPXzC5l-.mjs';
import { T as TicketSubmissionWidget } from '../chunks/TicketSubmissionWidget_DZnLuiEG.mjs';
import { W as WorkersStatusDashboard } from '../chunks/WorkersStatusDashboard_BEflDN07.mjs';
import { $ as $$DecorativeLines } from '../chunks/DecorativeLines_cAs3q6CP.mjs';
/* empty css                                              */
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

function ImageGeneratorWidget($$renderer) {}

function PolaczekWidget($$renderer) {}

<<<<<<< HEAD
function MainChatWidget($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let messages = [];
		Math.random().toString(36).substring(2, 15);

		{
			if (messages.length > 0) {
				localStorage.setItem("main_chat_messages", JSON.stringify(messages));
			}
		}

		$$renderer.push(`<div class="main-chat-widget svelte-1a3hmo1" data-component="main-chat"${attr(
			'data-active-model',
			// Add user message to chat
			// Use OpenRouter API
			// Use Cloudflare Workers AI
			// Add AI response to chat
			"cloudflare"
		)}>`);

		{
			$$renderer.push('<!--[!-->');
			$$renderer.push(`<button class="chat-toggle-btn svelte-1a3hmo1" title="Otwórz główny chat"><span class="ai-icon svelte-1a3hmo1">💬</span> <span class="chat-label svelte-1a3hmo1">Main Chat AI</span> `);

			{
				$$renderer.push('<!--[!-->');
			}

			$$renderer.push(`<!--]--></button>`);
		}

		$$renderer.push(`<!--]--></div>`);
	});
}

function BackgroundMusicPlayerSimple($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let volume = 0.5;
		let currentTime = 0;
		let duration = 0;
		let trackName = "No track selected";

		function formatTime(seconds) {
			const mins = Math.floor(seconds / 60);
			const secs = Math.floor(seconds % 60);

			return `${mins}:${secs.toString().padStart(2, "0")}`;
		}

		$$renderer.push(`<div class="background-music-player in-flow svelte-u12wbg"><audio preload="metadata" crossorigin="anonymous"></audio> <div class="music-control-panel svelte-u12wbg"><div class="panel-header svelte-u12wbg"><span>🎵 MUSIC • POLACZEK</span> <button class="minimize-btn svelte-u12wbg">${escape_html("−")}</button></div> `);

		{
			$$renderer.push('<!--[-->');
			$$renderer.push(`<div class="panel-content svelte-u12wbg"><div class="now-playing svelte-u12wbg"><div class="track-info svelte-u12wbg"><div class="track-name svelte-u12wbg">${escape_html(trackName)}</div> <div class="track-time svelte-u12wbg">${escape_html(formatTime(currentTime))} / ${escape_html(formatTime(duration))}</div></div></div> <div class="player-controls svelte-u12wbg"><button class="control-btn svelte-u12wbg">⏮</button> <button class="control-btn play-pause svelte-u12wbg">${escape_html("▶")}</button> <button class="control-btn svelte-u12wbg">⏭</button> <button class="control-btn svelte-u12wbg">📋</button></div> <div class="volume-control svelte-u12wbg"><span class="svelte-u12wbg">🔊</span> <input type="range" min="0" max="100"${attr('value', volume * 100)} class="volume-slider svelte-u12wbg"/></div> <div class="progress-container svelte-u12wbg"><div class="progress-bar svelte-u12wbg" role="slider" tabindex="0" aria-label="Seek"${attr('aria-valuemin', 0)}${attr('aria-valuemax', 0)}${attr('aria-valuenow', 0)}><div class="progress-fill svelte-u12wbg"${attr_style(`width: ${stringify(0)}%`)}></div></div></div></div>`);
		}

		$$renderer.push(`<!--]--></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--></div>`);
	});
}
=======
function MainChatWidget($$renderer) {}
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

const $$FlowiseButton = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<input type="text" id="flowise-input" placeholder="Wpisz prompt do Flowise..."> <button onclick="handleFlowise()">
Uruchom Flowise
<<<<<<< HEAD
</button> ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/components/FlowiseButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/FlowiseButton.astro", void 0);

const $$ActivePiecesButton = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<textarea rows="4" id="activepieces-input" placeholder="WprowadĹş JSON jako dane wejĹ›ciowe"></textarea> <button onclick="handleActivePieces()">
Uruchom ActivePieces
</button> ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/components/ActivePiecesButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/ActivePiecesButton.astro", void 0);
=======
</button> ${renderScript($$result, "Q:/mybonzo/mybonzo-github/src/components/FlowiseButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/mybonzo-github/src/components/FlowiseButton.astro", void 0);

const $$ActivePiecesButton = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<textarea rows="4" id="activepieces-input" placeholder="Wprowadź JSON jako dane wejściowe"></textarea> <button onclick="handleActivePieces()">
Uruchom ActivePieces
</button> ${renderScript($$result, "Q:/mybonzo/mybonzo-github/src/components/ActivePiecesButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/mybonzo-github/src/components/ActivePiecesButton.astro", void 0);
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

const $$IndexCleanBackup = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "AI Workers Platform | KAROL LISSON", "data-astro-cid-rxo3mmkh": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, { "data-astro-cid-rxo3mmkh": true })}  ${maybeRenderHead()}<div class="absolute left-0 right-0 h-full pointer-events-none" data-astro-cid-rxo3mmkh> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-rxo3mmkh></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-rxo3mmkh></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-rxo3mmkh></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-rxo3mmkh></div> </div> <main class="min-h-screen" style="overflow: visible !important;" data-astro-cid-rxo3mmkh> <!-- Top Separator Section --> <section class="border border-edge relative" data-astro-cid-rxo3mmkh> <div class="py-1" data-astro-cid-rxo3mmkh></div> </section> <!-- AI Workers Section - Centered --> <section class="border border-edge ai-workers-section flex items-center justify-center py-16 relative" id="ai-workers" style="display: block !important; visibility: visible !important; opacity: 1 !important;" data-astro-cid-rxo3mmkh> <!-- Main Content Container --> <div class="container mx-auto px-4 relative z-10" data-astro-cid-rxo3mmkh> <div class="text-center mb-12" data-astro-cid-rxo3mmkh> <h2 class="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" data-astro-cid-rxo3mmkh>
AI Workers Ecosystem
</h2> <p class="text-lg text-muted-foreground max-w-2xl mx-auto" data-astro-cid-rxo3mmkh>
Kompleksowa platforma AI z zaawansowanymi funkcjami biznesowymi
<<<<<<< HEAD
</p> </div> <!-- Quick Actions Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" data-astro-cid-rxo3mmkh> <!-- Image Generator --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>đźŽ¨</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Generator ObrazĂłw</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Tworzenie obrazĂłw AI z zaawansowanymi promptami
</p> ${renderComponent($$result2, "ImageGeneratorWidget", ImageGeneratorWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/ImageGeneratorWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- Chat Assistant --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>đź’¬</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Chatbot AI</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Inteligentny asystent z wieloma modelami AI
</p> ${renderComponent($$result2, "MainChatWidget", MainChatWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/MainChatWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- Polaczek Widget --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>đź¤–</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Polaczek AI</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Specjalistyczny agent AI dla zadaĹ„ biznesowych
</p> ${renderComponent($$result2, "PolaczekWidget", PolaczekWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/PolaczekWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> </div> <!-- Business Functions Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" data-astro-cid-rxo3mmkh> <!-- AI Help Assistant --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>đź†</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Pomoc AI</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Asystent pomocy technicznej
</p> ${renderComponent($$result2, "AiHelpAssistant", AiHelpAssistant, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/AiHelpAssistant.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- FAQ Generator --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>âť“</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Generator FAQ</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>Automatyczne tworzenie FAQ</p> ${renderComponent($$result2, "FAQGeneratorWidget", FAQGeneratorWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/FAQGeneratorWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- Education Recommendations --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>đźŽ“</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Rekomendacje Edukacyjne</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Personalizowane Ĺ›cieĹĽki rozwoju
</p> ${renderComponent($$result2, "EducationRecommendationsWidget", EducationRecommendationsWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/EducationRecommendationsWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> </div> <!-- System Management --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" data-astro-cid-rxo3mmkh> <!-- Ticket System --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>đźŽ«</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>System ZgĹ‚oszeĹ„</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
ZarzÄ…dzanie ticketami i zgĹ‚oszeniami
</p> ${renderComponent($$result2, "TicketSubmissionWidget", TicketSubmissionWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/TicketSubmissionWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- Workers Status --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>đź“Š</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Status Workers</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Monitoring stanu wszystkich serwisĂłw
</p> ${renderComponent($$result2, "WorkersStatusDashboard", WorkersStatusDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/WorkersStatusDashboard.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> </div> <!-- Automation Integration --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" data-astro-cid-rxo3mmkh> <!-- Flowise AI --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>đźŚŠ</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Flowise AI</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>Zaawansowane workflow AI</p> ${renderComponent($$result2, "FlowiseButton", $$FlowiseButton, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/FlowiseButton.astro", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- ActivePieces --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>đź§©</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>ActivePieces</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Automatyzacja procesĂłw biznesowych
</p> ${renderComponent($$result2, "ActivePiecesButton", $$ActivePiecesButton, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/ActivePiecesButton.astro", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> </div> </div> </section> <!-- Background Music Player --> ${renderComponent($$result2, "BackgroundMusicPlayerSimple", BackgroundMusicPlayerSimple, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/BackgroundMusicPlayerSimple.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} <!-- Quote Section --> <section class="border border-edge relative" data-astro-cid-rxo3mmkh> <div class="container mx-auto px-4 py-8" data-astro-cid-rxo3mmkh> ${renderComponent($$result2, "RandomQuote", $$RandomQuote, { "data-astro-cid-rxo3mmkh": true })} </div> </section> </main> ` })} ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/index_clean_backup.astro?astro&type=script&index=0&lang.ts")} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/index_clean_backup.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/index_clean_backup.astro";
=======
</p> </div> <!-- Quick Actions Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" data-astro-cid-rxo3mmkh> <!-- Image Generator --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🎨</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Generator Obrazów</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Tworzenie obrazów AI z zaawansowanymi promptami
</p> ${renderComponent($$result2, "ImageGeneratorWidget", ImageGeneratorWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/ImageGeneratorWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- Chat Assistant --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>💬</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Chatbot AI</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Inteligentny asystent z wieloma modelami AI
</p> ${renderComponent($$result2, "MainChatWidget", MainChatWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/MainChatWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- Polaczek Widget --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🤖</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Polaczek AI</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Specjalistyczny agent AI dla zadań biznesowych
</p> ${renderComponent($$result2, "PolaczekWidget", PolaczekWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/PolaczekWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> </div> <!-- Business Functions Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" data-astro-cid-rxo3mmkh> <!-- AI Help Assistant --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🆘</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Pomoc AI</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Asystent pomocy technicznej
</p> ${renderComponent($$result2, "AiHelpAssistant", AiHelpAssistant, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/AiHelpAssistant.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- FAQ Generator --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>❓</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Generator FAQ</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>Automatyczne tworzenie FAQ</p> ${renderComponent($$result2, "FAQGeneratorWidget", FAQGeneratorWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/FAQGeneratorWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- Education Recommendations --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🎓</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Rekomendacje Edukacyjne</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Personalizowane ścieżki rozwoju
</p> ${renderComponent($$result2, "EducationRecommendationsWidget", EducationRecommendationsWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/EducationRecommendationsWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> </div> <!-- System Management --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" data-astro-cid-rxo3mmkh> <!-- Ticket System --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🎫</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>System Zgłoszeń</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Zarządzanie ticketami i zgłoszeniami
</p> ${renderComponent($$result2, "TicketSubmissionWidget", TicketSubmissionWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/TicketSubmissionWidget.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- Workers Status --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>📊</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Status Workers</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Monitoring stanu wszystkich serwisów
</p> ${renderComponent($$result2, "WorkersStatusDashboard", WorkersStatusDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/WorkersStatusDashboard.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> </div> <!-- Automation Integration --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" data-astro-cid-rxo3mmkh> <!-- Flowise AI --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🌊</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>Flowise AI</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>Zaawansowane workflow AI</p> ${renderComponent($$result2, "FlowiseButton", $$FlowiseButton, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/FlowiseButton.astro", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> <!-- ActivePieces --> <div class="bg-card/50 backdrop-blur-sm border border-edge rounded-lg p-6 hover:bg-card/70 transition-all duration-300" data-astro-cid-rxo3mmkh> <div class="flex items-center gap-3 mb-4" data-astro-cid-rxo3mmkh> <div class="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center" data-astro-cid-rxo3mmkh> <span class="text-white font-bold" data-astro-cid-rxo3mmkh>🧩</span> </div> <h3 class="text-xl font-semibold" data-astro-cid-rxo3mmkh>ActivePieces</h3> </div> <p class="text-muted-foreground mb-4" data-astro-cid-rxo3mmkh>
Automatyzacja procesów biznesowych
</p> ${renderComponent($$result2, "ActivePiecesButton", $$ActivePiecesButton, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/ActivePiecesButton.astro", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} </div> </div> </div> </section> <!-- Background Music Player --> ${renderComponent($$result2, "BackgroundMusicPlayerSimple", BackgroundMusicPlayerSimple, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/BackgroundMusicPlayerSimple.svelte", "client:component-export": "default", "data-astro-cid-rxo3mmkh": true })} <!-- Quote Section --> <section class="border border-edge relative" data-astro-cid-rxo3mmkh> <div class="container mx-auto px-4 py-8" data-astro-cid-rxo3mmkh> ${renderComponent($$result2, "RandomQuote", $$RandomQuote, { "data-astro-cid-rxo3mmkh": true })} </div> </section> </main> ` })} ${renderScript($$result, "Q:/mybonzo/mybonzo-github/src/pages/index_clean_backup.astro?astro&type=script&index=0&lang.ts")} `;
}, "Q:/mybonzo/mybonzo-github/src/pages/index_clean_backup.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/index_clean_backup.astro";
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const $$url = "/index_clean_backup";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$IndexCleanBackup,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
