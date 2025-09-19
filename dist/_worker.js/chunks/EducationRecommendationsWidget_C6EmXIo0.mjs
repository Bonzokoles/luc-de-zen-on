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
import { p as maybe_selected, n as attr, k as escape_html } from './vendor_BHZTJLV0.mjs';
/* empty css                                             */

function EducationRecommendationsWidget($$payload, $$props) {
	$$payload.component(($$payload) => {
		let userProfile = {
			currentLevel: '',
			interests: '',
			careerGoals: '',
			availableTime: '',
			learningStyle: '',
			budget: ''
		};

		$$payload.push(`<div class="education-widget-container svelte-1dtmteu"><h2 class="widget-title svelte-1dtmteu">🎓 System rekomendacji edukacyjnych</h2> <div class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2">Obecny poziom umiejętności *</label> <select class="widget-select svelte-1dtmteu">`);

		$$payload.child(($$payload) => {
			$$payload.local.select_value = userProfile.currentLevel;
			$$payload.push(`<option value=""${maybe_selected($$payload, '')} class="svelte-1dtmteu">Wybierz poziom</option><option value="początkujący"${maybe_selected($$payload, 'początkujący')} class="svelte-1dtmteu">Początkujący</option><option value="średnio-zaawansowany"${maybe_selected($$payload, 'średnio-zaawansowany')} class="svelte-1dtmteu">Średnio-zaawansowany</option><option value="zaawansowany"${maybe_selected($$payload, 'zaawansowany')} class="svelte-1dtmteu">Zaawansowany</option><option value="ekspert"${maybe_selected($$payload, 'ekspert')} class="svelte-1dtmteu">Ekspert</option>`);
		});

		$$payload.push(`</select></div> <div><label class="block text-sm font-medium mb-2">Dostępny czas na naukę</label> <select class="widget-select svelte-1dtmteu">`);

		$$payload.child(($$payload) => {
			$$payload.local.select_value = userProfile.availableTime;
			$$payload.push(`<option value=""${maybe_selected($$payload, '')} class="svelte-1dtmteu">Wybierz czas</option><option value="1-2 godziny dziennie"${maybe_selected($$payload, '1-2 godziny dziennie')} class="svelte-1dtmteu">1-2 godziny dziennie</option><option value="3-5 godzin dziennie"${maybe_selected($$payload, '3-5 godzin dziennie')} class="svelte-1dtmteu">3-5 godzin dziennie</option><option value="weekend tylko"${maybe_selected($$payload, 'weekend tylko')} class="svelte-1dtmteu">Tylko weekendy</option><option value="intensywny kurs"${maybe_selected($$payload, 'intensywny kurs')} class="svelte-1dtmteu">Kurs intensywny (pełen etat)</option>`);
		});

		$$payload.push(`</select></div> <div><label class="block text-sm font-medium mb-2">Preferowany styl nauki</label> <select class="widget-select svelte-1dtmteu">`);

		$$payload.child(($$payload) => {
			$$payload.local.select_value = userProfile.learningStyle;
			$$payload.push(`<option value=""${maybe_selected($$payload, '')} class="svelte-1dtmteu">Wybierz styl</option><option value="wideo i interaktywne"${maybe_selected($$payload, 'wideo i interaktywne')} class="svelte-1dtmteu">Wideo i kursy interaktywne</option><option value="książki i dokumentacja"${maybe_selected($$payload, 'książki i dokumentacja')} class="svelte-1dtmteu">Książki i dokumentacja</option><option value="praktyczne projekty"${maybe_selected($$payload, 'praktyczne projekty')} class="svelte-1dtmteu">Praktyczne projekty</option><option value="mentoring i grupy"${maybe_selected($$payload, 'mentoring i grupy')} class="svelte-1dtmteu">Mentoring i grupy studyjne</option><option value="mieszany"${maybe_selected($$payload, 'mieszany')} class="svelte-1dtmteu">Podejście mieszane</option>`);
		});

		$$payload.push(`</select></div> <div><label class="block text-sm font-medium mb-2">Budżet</label> <select class="widget-select svelte-1dtmteu">`);

		$$payload.child(($$payload) => {
			$$payload.local.select_value = userProfile.budget;
			$$payload.push(`<option value=""${maybe_selected($$payload, '')} class="svelte-1dtmteu">Wybierz budżet</option><option value="darmowe"${maybe_selected($$payload, 'darmowe')} class="svelte-1dtmteu">Tylko darmowe</option><option value="do 500 zł"${maybe_selected($$payload, 'do 500 zł')} class="svelte-1dtmteu">Do 500 zł</option><option value="do 1500 zł"${maybe_selected($$payload, 'do 1500 zł')} class="svelte-1dtmteu">Do 1500 zł</option><option value="do 5000 zł"${maybe_selected($$payload, 'do 5000 zł')} class="svelte-1dtmteu">Do 5000 zł</option><option value="bez ograniczeń"${maybe_selected($$payload, 'bez ograniczeń')} class="svelte-1dtmteu">Bez ograniczeń</option>`);
		});

		$$payload.push(`</select></div></div> <div><label class="block text-sm font-medium mb-2">Zainteresowania i dziedziny *</label> <input type="text"${attr('value', userProfile.interests)} placeholder="np. programowanie, data science, marketing, design..." class="widget-input svelte-1dtmteu"/></div> <div><label class="block text-sm font-medium mb-2">Cele zawodowe</label> <textarea rows="3" placeholder="Opisz swoje cele zawodowe, wymarzone stanowisko, projekty..." class="widget-textarea svelte-1dtmteu">`);

		const $$body = escape_html(userProfile.careerGoals);

		if ($$body) {
			$$payload.push(`${$$body}`);
		}

		$$payload.push(`</textarea></div> <div class="flex gap-3"><button${attr('disabled', true, true)} class="action-btn primary svelte-1dtmteu">`);

		{
			$$payload.push('<!--[!-->');
			$$payload.push(`🎯 Pobierz rekomendacje`);
		}

		$$payload.push(`<!--]--></button> <button class="action-btn secondary svelte-1dtmteu">🗑️ Wyczyść</button></div> `);

		{
			$$payload.push('<!--[!-->');
		}

		$$payload.push(`<!--]--> `);

		{
			$$payload.push('<!--[!-->');
		}

		$$payload.push(`<!--]--> <div class="tip-text svelte-1dtmteu">💡 Tip: Im więcej szczegółów podasz, tym bardziej spersonalizowane będą rekomendacje</div></div></div>`);
	});
}

export { EducationRecommendationsWidget as E };
