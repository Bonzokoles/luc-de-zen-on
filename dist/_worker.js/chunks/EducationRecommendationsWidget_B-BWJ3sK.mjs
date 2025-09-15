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
import { p as push, i as attr, j as escape_html, k as pop } from './vendor_QZhDtzeH.mjs';
/* empty css                                             */

function EducationRecommendationsWidget($$payload, $$props) {
	push();

	let userProfile = {
		interests: '',
		careerGoals: ''};

	$$payload.out += `<div class="education-widget-container svelte-1lpaxu9"><h2 class="widget-title svelte-1lpaxu9">🎓 System rekomendacji edukacyjnych</h2> <div class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2">Obecny poziom umiejętności *</label> <select class="widget-select svelte-1lpaxu9"><option value="" class="svelte-1lpaxu9">Wybierz poziom</option><option value="początkujący" class="svelte-1lpaxu9">Początkujący</option><option value="średnio-zaawansowany" class="svelte-1lpaxu9">Średnio-zaawansowany</option><option value="zaawansowany" class="svelte-1lpaxu9">Zaawansowany</option><option value="ekspert" class="svelte-1lpaxu9">Ekspert</option></select></div> <div><label class="block text-sm font-medium mb-2">Dostępny czas na naukę</label> <select class="widget-select svelte-1lpaxu9"><option value="" class="svelte-1lpaxu9">Wybierz czas</option><option value="1-2 godziny dziennie" class="svelte-1lpaxu9">1-2 godziny dziennie</option><option value="3-5 godzin dziennie" class="svelte-1lpaxu9">3-5 godzin dziennie</option><option value="weekend tylko" class="svelte-1lpaxu9">Tylko weekendy</option><option value="intensywny kurs" class="svelte-1lpaxu9">Kurs intensywny (pełen etat)</option></select></div> <div><label class="block text-sm font-medium mb-2">Preferowany styl nauki</label> <select class="widget-select svelte-1lpaxu9"><option value="" class="svelte-1lpaxu9">Wybierz styl</option><option value="wideo i interaktywne" class="svelte-1lpaxu9">Wideo i kursy interaktywne</option><option value="książki i dokumentacja" class="svelte-1lpaxu9">Książki i dokumentacja</option><option value="praktyczne projekty" class="svelte-1lpaxu9">Praktyczne projekty</option><option value="mentoring i grupy" class="svelte-1lpaxu9">Mentoring i grupy studyjne</option><option value="mieszany" class="svelte-1lpaxu9">Podejście mieszane</option></select></div> <div><label class="block text-sm font-medium mb-2">Budżet</label> <select class="widget-select svelte-1lpaxu9"><option value="" class="svelte-1lpaxu9">Wybierz budżet</option><option value="darmowe" class="svelte-1lpaxu9">Tylko darmowe</option><option value="do 500 zł" class="svelte-1lpaxu9">Do 500 zł</option><option value="do 1500 zł" class="svelte-1lpaxu9">Do 1500 zł</option><option value="do 5000 zł" class="svelte-1lpaxu9">Do 5000 zł</option><option value="bez ograniczeń" class="svelte-1lpaxu9">Bez ograniczeń</option></select></div></div> <div><label class="block text-sm font-medium mb-2">Zainteresowania i dziedziny *</label> <input type="text"${attr('value', userProfile.interests)} placeholder="np. programowanie, data science, marketing, design..." class="widget-input svelte-1lpaxu9"></div> <div><label class="block text-sm font-medium mb-2">Cele zawodowe</label> <textarea rows="3" placeholder="Opisz swoje cele zawodowe, wymarzone stanowisko, projekty..." class="widget-textarea svelte-1lpaxu9">`;

	const $$body = escape_html(userProfile.careerGoals);

	if ($$body) {
		$$payload.out += `${$$body}`;
	}

	$$payload.out += `</textarea></div> <div class="flex gap-3"><button${attr('disabled', true, true)} class="action-btn primary svelte-1lpaxu9">`;

	{
		$$payload.out += '<!--[!-->';
		$$payload.out += `🎯 Pobierz rekomendacje`;
	}

	$$payload.out += `<!--]--></button> <button class="action-btn secondary svelte-1lpaxu9">🗑️ Wyczyść</button></div> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> <div class="tip-text svelte-1lpaxu9">💡 Tip: Im więcej szczegółów podasz, tym bardziej spersonalizowane będą rekomendacje</div></div></div>`;
	pop();
}

export { EducationRecommendationsWidget as E };
