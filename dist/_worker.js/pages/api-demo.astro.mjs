globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_B8kqLEdJ.mjs';
import { b as attr } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';
/* empty css                                    */

function APIDemo($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let loading = false;

		$$renderer.push(`<div class="api-demo svelte-ftk53j"><h3 class="svelte-ftk53j">🧪 API Demo - Cloudflare Workers</h3> <p class="demo-description svelte-ftk53j">Demonstracja działania naszych API endpointów w środowisku Cloudflare
    Workers</p> <div class="demo-grid svelte-ftk53j"><div class="demo-card svelte-ftk53j"><h4 class="svelte-ftk53j">💬 Chat API Test</h4> <button class="demo-btn svelte-ftk53j"${attr('disabled', loading, true)}>`);

		{
			$$renderer.push('<!--[!-->');
			$$renderer.push(`🚀 Test Chat API`);
		}

		$$renderer.push(`<!--]--></button> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--></div> <div class="demo-card svelte-ftk53j"><h4 class="svelte-ftk53j">🎨 Image Generator Test</h4> <button class="demo-btn svelte-ftk53j"${attr('disabled', loading, true)}>`);

		{
			$$renderer.push('<!--[!-->');
			$$renderer.push(`🎨 Test Image API`);
		}

		$$renderer.push(`<!--]--></button> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--></div> <div class="demo-card svelte-ftk53j"><h4 class="svelte-ftk53j">📊 Data Analysis Test</h4> <button class="demo-btn svelte-ftk53j"${attr('disabled', loading, true)}>`);

		{
			$$renderer.push('<!--[!-->');
			$$renderer.push(`📊 Test Analyze API`);
		}

		$$renderer.push(`<!--]--></button> <div class="response-box svelte-ftk53j"><strong class="svelte-ftk53j">Info:</strong> <p class="svelte-ftk53j">Sprawdź konsolę przeglądarki (F12) aby zobaczyć wynik analizy</p></div></div></div> <div class="integration-info svelte-ftk53j"><h4 class="svelte-ftk53j">📋 Implementacja w kodzie:</h4> <pre class="code-example svelte-ftk53j"><code class="svelte-ftk53j">// Import API functions
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

const $$Astro = createAstro("https://mybonzo.com");
const $$ApiDemo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ApiDemo;
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "API Demo - Cloudflare Workers Integration", "data-astro-cid-mvmhwh7t": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="demo-page" data-astro-cid-mvmhwh7t> <div class="hero-section" data-astro-cid-mvmhwh7t> <h1 data-astro-cid-mvmhwh7t>đźš€ Cloudflare Workers API Integration</h1> <p class="hero-subtitle" data-astro-cid-mvmhwh7t>
Demonstracja peĹ‚nej integracji z Cloudflare Workers w Ĺ›rodowisku Astro +
        Svelte
</p> </div> ${renderComponent($$result2, "APIDemo", APIDemo, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/APIDemo.svelte", "client:component-export": "default", "data-astro-cid-mvmhwh7t": true })} <div class="documentation-section" data-astro-cid-mvmhwh7t> <h2 data-astro-cid-mvmhwh7t>đź“– Dokumentacja Integracji</h2> <div class="docs-grid" data-astro-cid-mvmhwh7t> <div class="doc-card" data-astro-cid-mvmhwh7t> <h3 data-astro-cid-mvmhwh7t>đź”§ ModuĹ‚ cloudflareApi.ts</h3> <p data-astro-cid-mvmhwh7t>Centralny moduĹ‚ do komunikacji z Cloudflare Workers API</p> <ul data-astro-cid-mvmhwh7t> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>fetchFromWorker()</code> - gĹ‚Ăłwna funkcja fetch</li> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>postToWorker()</code> - wrapper dla POST requests</li> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>getFromWorker()</code> - wrapper dla GET requests</li> </ul> </div> <div class="doc-card" data-astro-cid-mvmhwh7t> <h3 data-astro-cid-mvmhwh7t>đź›ˇď¸Ź CORS i BezpieczeĹ„stwo</h3> <p data-astro-cid-mvmhwh7t>Wszystkie endpointy majÄ… peĹ‚nÄ… obsĹ‚ugÄ™ CORS i OPTIONS</p> <ul data-astro-cid-mvmhwh7t> <li data-astro-cid-mvmhwh7t>Standardowe nagĹ‚Ăłwki CORS</li> <li data-astro-cid-mvmhwh7t>ObsĹ‚uga preflight requests</li> <li data-astro-cid-mvmhwh7t>Walidacja i sanityzacja danych</li> </ul> </div> <div class="doc-card" data-astro-cid-mvmhwh7t> <h3 data-astro-cid-mvmhwh7t>đź“Š DostÄ™pne API Endpoints</h3> <p data-astro-cid-mvmhwh7t>PeĹ‚na lista aktywnych Workers API</p> <ul data-astro-cid-mvmhwh7t> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>/api/chat</code> - AI Chat Assistant</li> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>/api/generate-image</code> - Image Generator</li> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>/api/data-analyze</code> - Data Analysis</li> <li data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>/api/ai-workers</code> - Workers Management</li> </ul> </div> </div> <div class="implementation-example" data-astro-cid-mvmhwh7t> <h3 data-astro-cid-mvmhwh7t>đź’ˇ PrzykĹ‚ad Implementacji w Svelte</h3> <pre class="code-block" data-astro-cid-mvmhwh7t><code data-astro-cid-mvmhwh7t>${`<script lang="ts">
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
