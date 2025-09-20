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
import { n as attr, k as escape_html } from './vendor_DlPT8CWO.mjs';
/* empty css                                             */

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

export { EducationRecommendationsWidget as E };
