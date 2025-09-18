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
import { n as attr, e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/vendor_CYa9XZjz.mjs';
export { d as renderers } from '../chunks/vendor_CYa9XZjz.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_BRvVRBoy.mjs';
/* empty css                                    */

function APIDemo($$payload, $$props) {
	$$payload.component(($$payload) => {
		let loading = false;

		$$payload.push(`<div class="api-demo svelte-ftk53j"><h3 class="svelte-ftk53j">🧪 API Demo - Cloudflare Workers</h3> <p class="demo-description svelte-ftk53j">Demonstracja działania naszych API endpointów w środowisku Cloudflare
    Workers</p> <div class="demo-grid svelte-ftk53j"><div class="demo-card svelte-ftk53j"><h4 class="svelte-ftk53j">💬 Chat API Test</h4> <button class="demo-btn svelte-ftk53j"${attr('disabled', loading, true)}>`);

		{
			$$payload.push('<!--[!-->');
			$$payload.push(`🚀 Test Chat API`);
		}

		$$payload.push(`<!--]--></button> `);

		{
			$$payload.push('<!--[!-->');
		}

		$$payload.push(`<!--]--></div> <div class="demo-card svelte-ftk53j"><h4 class="svelte-ftk53j">🎨 Image Generator Test</h4> <button class="demo-btn svelte-ftk53j"${attr('disabled', loading, true)}>`);

		{
			$$payload.push('<!--[!-->');
			$$payload.push(`🎨 Test Image API`);
		}

		$$payload.push(`<!--]--></button> `);

		{
			$$payload.push('<!--[!-->');
		}

		$$payload.push(`<!--]--></div> <div class="demo-card svelte-ftk53j"><h4 class="svelte-ftk53j">📊 Data Analysis Test</h4> <button class="demo-btn svelte-ftk53j"${attr('disabled', loading, true)}>`);

		{
			$$payload.push('<!--[!-->');
			$$payload.push(`📊 Test Analyze API`);
		}

		$$payload.push(`<!--]--></button> <div class="response-box svelte-ftk53j"><strong class="svelte-ftk53j">Info:</strong> <p class="svelte-ftk53j">Sprawdź konsolę przeglądarki (F12) aby zobaczyć wynik analizy</p></div></div></div> <div class="integration-info svelte-ftk53j"><h4 class="svelte-ftk53j">📋 Implementacja w kodzie:</h4> <pre class="code-example svelte-ftk53j"><code class="svelte-ftk53j">// Import API functions
import { postToWorker } from '../cloudflareApi';

// Chat API usage
const chatResponse = await postToWorker('/api/chat', {
  message: 'Your message here'
});

// Image generation usage  
const imageResponse = await postToWorker('/api/generate-image', {
  prompt: 'Your image description'
});

// Data analysis usage
const analysisResponse = await postToWorker('/api/data-analyze', {
  data: yourDataArray,
  analysis: 'basic_stats'
});</code></pre></div> <div class="features-list svelte-ftk53j"><h4 class="svelte-ftk53j">✨ Funkcjonalności systemu:</h4> <ul class="svelte-ftk53j"><li class="svelte-ftk53j">🔄 Centralne API z obsługą CORS i błędów</li> <li class="svelte-ftk53j">🎯 Jednolite endpointy dla wszystkich Workers</li> <li class="svelte-ftk53j">🛡️ Walidacja danych i bezpieczne zapytania</li> <li class="svelte-ftk53j">📊 Monitoring i logowanie aktywności</li> <li class="svelte-ftk53j">⚡ Optymalizacja dla Cloudflare Edge</li> <li class="svelte-ftk53j">🔧 Łatwa integracja z Svelte/Astro</li></ul></div></div>`);
	});
}

const $$Astro = createAstro("https://www.mybonzo.com");
const $$ApiDemo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ApiDemo;
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "API Demo - Cloudflare Workers Integration", "data-astro-cid-mvmhwh7t": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="demo-page" data-astro-cid-mvmhwh7t> <div class="hero-section" data-astro-cid-mvmhwh7t> <h1 data-astro-cid-mvmhwh7t>🚀 Cloudflare Workers API Integration</h1> <p class="hero-subtitle" data-astro-cid-mvmhwh7t>
Demonstracja pełnej integracji z Cloudflare Workers w środowisku Astro +
        Svelte
</p> </div> ${renderComponent($$result2, "APIDemo", APIDemo, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/APIDemo.svelte", "client:component-export": "default", "data-astro-cid-mvmhwh7t": true })} <div class="documentation-section" data-astro-cid-mvmhwh7t> <h2 data-astro-cid-mvmhwh7t>📖 Dokumentacja Integracji</h2> <div class="docs-grid" data-astro-cid-mvmhwh7t> <div class="doc-card" data-astro-cid-mvmhwh7t> <h3 data-astro-cid-mvmhwh7t>🔧 Moduł cloudflareApi.ts</h3> <p data-astro-cid-mvmhwh7t>Centralny moduł do komunikacji z Cloudflare Workers API</p> <ul data-astro-cid-mvmhwh7t> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>fetchFromWorker()</code> - główna funkcja fetch</li> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>postToWorker()</code> - wrapper dla POST requests</li> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>getFromWorker()</code> - wrapper dla GET requests</li> </ul> </div> <div class="doc-card" data-astro-cid-mvmhwh7t> <h3 data-astro-cid-mvmhwh7t>🛡️ CORS i Bezpieczeństwo</h3> <p data-astro-cid-mvmhwh7t>Wszystkie endpointy mają pełną obsługę CORS i OPTIONS</p> <ul data-astro-cid-mvmhwh7t> <li data-astro-cid-mvmhwh7t>Standardowe nagłówki CORS</li> <li data-astro-cid-mvmhwh7t>Obsługa preflight requests</li> <li data-astro-cid-mvmhwh7t>Walidacja i sanityzacja danych</li> </ul> </div> <div class="doc-card" data-astro-cid-mvmhwh7t> <h3 data-astro-cid-mvmhwh7t>📊 Dostępne API Endpoints</h3> <p data-astro-cid-mvmhwh7t>Pełna lista aktywnych Workers API</p> <ul data-astro-cid-mvmhwh7t> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>/api/chat</code> - AI Chat Assistant</li> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>/api/generate-image</code> - Image Generator</li> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>/api/data-analyze</code> - Data Analysis</li> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>/api/ai-workers</code> - Workers Management</li> </ul> </div> </div> <div class="implementation-example" data-astro-cid-mvmhwh7t> <h3 data-astro-cid-mvmhwh7t>💡 Przykład Implementacji w Svelte</h3> <pre class="code-block" data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>${`<script lang="ts">
  import { postToWorker } from '../cloudflareApi';
  
  let response = '';
  let loading = false;

  async function handleSubmit() {
    loading = true;
    try {
      const result = await postToWorker('/api/chat', {
        message: 'Hello from Svelte!'
      });
      response = result.message;
    } catch (error) {
      response = 'Error: ' + error.message;
    } finally {
      loading = false;
    }
  }
<\/script>

<button on:click={handleSubmit} disabled={loading}>
  {loading ? 'Processing...' : 'Send Message'}
</button>

{#if response}
  <p>{response}</p>
{/if}`}</code></pre> </div> </div> </div> ` })} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/api-demo.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/api-demo.astro";
const $$url = "/api-demo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ApiDemo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
