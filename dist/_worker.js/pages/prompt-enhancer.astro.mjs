globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, b as renderScript, m as maybeRenderHead } from '../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$UniversalPageLayout } from '../chunks/UniversalPageLayout_ChsqH4EH.mjs';
import { $ as $$GlassPanel, a as $$CyberpunkButton } from '../chunks/CyberpunkButton_DtfwayTf.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$PromptEnhancer = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "SupaGruen SD CheatSheet";
  const pageDescription = "Zaawansowany generator prompt\u0102\u0142w AI z 833+ stylami artystycznymi";
  const pageQuote = "Cz\u0139\u201Aowiek jest tym, czym s\xC4\u2026 jego decyzje.";
  const pageAuthor = "Frank Herbert (Dune)";
  return renderTemplate`${renderComponent($$result, "UniversalPageLayout", $$UniversalPageLayout, { "pageTitle": pageTitle, "pageDescription": pageDescription, "pageQuote": pageQuote, "pageAuthor": pageAuthor, "showRandomQuote": false }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "GlassPanel", $$GlassPanel, { "title": "SupaGruen SD CheatSheet", "variant": "highlight", "padding": "lg" }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div style="margin-bottom: 20px;"> <p style="color: rgba(255,255,255,0.8); font-size: 1.1rem; line-height: 1.6;">
Profesjonalny generator promptĂłw AI z bazÄ… 833+ stylĂłw artystycznych. 
                TwĂłrz zaawansowane prompty dla Stable Diffusion, DALL-E i innych modeli generacyjnych.
</p> </div> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;"> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px;"> <div style="color: #00d9ff; font-weight: 600; margin-bottom: 5px;">đźŽ¨ 833+ Style Artystyczne</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">Od klasycznych mistrzĂłw po wspĂłĹ‚czesnych artystĂłw</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px;"> <div style="color: #00d9ff; font-weight: 600; margin-bottom: 5px;">đź¤– AI-Powered Wildcards</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">Inteligentne uzupeĹ‚nianie promptĂłw</div> </div> <div style="background: rgba(0,217,255,0.1); padding: 15px; border: 1px solid rgba(0,217,255,0.3); border-radius: 8px;"> <div style="color: #00d9ff; font-weight: 600; margin-bottom: 5px;">âšˇ Real-time Preview</div> <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">PodglÄ…d na ĹĽywo i optymalizacja</div> </div> </div>  <div id="prompt-enhancer-root" style="width: 100%;"></div> <div style="margin-top: 30px; text-align: center;"> ${renderComponent($$result3, "CyberpunkButton", $$CyberpunkButton, { "text": "Powr\u0102\u0142t do g\u0139\u201A\u0102\u0142wnej", "href": "/", "variant": "outline", "size": "md" })} </div> ` })} ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/prompt-enhancer.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/prompt-enhancer.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/prompt-enhancer.astro";
const $$url = "/prompt-enhancer";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PromptEnhancer,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
