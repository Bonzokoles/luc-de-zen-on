globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DFvGEJvU.mjs';
import { $ as $$MyBonzoLayout } from '../../../chunks/MyBonzoLayout_Bb-O1rgQ.mjs';
/* empty css                                           */
export { r as renderers } from '../../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const $$Authorize = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "title": "Google Drive Authorization | MyBonzo", "data-astro-cid-vg33cabe": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-svh" data-astro-cid-vg33cabe> <!-- Header Section --> <section class="border border-edge" data-astro-cid-vg33cabe> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-vg33cabe> <div class="flex justify-between max-h-72 min-h-64" data-astro-cid-vg33cabe> <div class="mt-auto" data-astro-cid-vg33cabe> <span style="writing-mode: vertical-lr;" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-vg33cabe>
GOOGLE
</span> </div> <span class="mt-auto" data-astro-cid-vg33cabe> <span style="" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-vg33cabe>
DRIVE
</span> </span> </div> </div> </section> <!-- Navigation Section --> <section class="border border-edge" data-astro-cid-vg33cabe> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-vg33cabe> <div class="flex flex-row p-2" data-astro-cid-vg33cabe> <a class="hover:brightness-125" href="/" data-astro-cid-vg33cabe> <h1 class="text-4xl sm:text-5xl" data-astro-cid-vg33cabe>GOOGLE DRIVE AUTHORIZATION</h1> <h2 class="text-2xl sm:text-3xl" data-astro-cid-vg33cabe>Connect Your 2TB Drive to AI System</h2> </a> <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col" data-astro-cid-vg33cabe> <a class="ml-auto hover:brightness-125 duration-200" href="/" data-astro-cid-vg33cabe>
â† PowrĂłt do strony gĹ‚Ăłwnej
</a> </div> </div> </div> </section> <!-- Main Content --> <section class="auth-section flex items-center justify-center py-16" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-vg33cabe> <div class="section-container max-w-4xl mx-auto" data-astro-cid-vg33cabe> <h2 class="section-title" data-astro-cid-vg33cabe>POĹÄ„CZ GOOGLE DRIVE</h2> <p class="section-description" data-astro-cid-vg33cabe>
Autoryzuj dostÄ™p do swojego Google Drive (2TB) dla lepszych rekomendacji AI
</p> <!-- Authorization Steps --> <div class="auth-steps mt-8" data-astro-cid-vg33cabe> <!-- Step 1: Check Status --> <div class="step-card" id="step1" data-astro-cid-vg33cabe> <div class="step-header" data-astro-cid-vg33cabe> <div class="step-number" data-astro-cid-vg33cabe>1</div> <h3 class="step-title" data-astro-cid-vg33cabe>SprawdĹş status poĹ‚Ä…czenia</h3> </div> <div class="step-content" data-astro-cid-vg33cabe> <div id="connectionStatus" class="status-display" data-astro-cid-vg33cabe> <div class="status-item" data-astro-cid-vg33cabe> <span class="status-label" data-astro-cid-vg33cabe>Status:</span> <span class="status-value" id="driveConnectionStatus" data-astro-cid-vg33cabe>Sprawdzanie...</span> </div> <div class="status-item" data-astro-cid-vg33cabe> <span class="status-label" data-astro-cid-vg33cabe>DostÄ™p do danych:</span> <span class="status-value" id="driveDataAccess" data-astro-cid-vg33cabe>Nieznany</span> </div> <div class="status-item" data-astro-cid-vg33cabe> <span class="status-label" data-astro-cid-vg33cabe>Ostatnia synchronizacja:</span> <span class="status-value" id="lastSync" data-astro-cid-vg33cabe>Nigdy</span> </div> </div> <button id="checkStatusBtn" onclick="checkDriveStatus()" class="action-btn secondary mt-4" data-astro-cid-vg33cabe>
đź”„ SprawdĹş status
</button> </div> </div> <!-- Step 2: Authorize --> <div class="step-card" id="step2" data-astro-cid-vg33cabe> <div class="step-header" data-astro-cid-vg33cabe> <div class="step-number" data-astro-cid-vg33cabe>2</div> <h3 class="step-title" data-astro-cid-vg33cabe>Autoryzuj dostÄ™p</h3> </div> <div class="step-content" data-astro-cid-vg33cabe> <p class="text-gray-300 mb-4" data-astro-cid-vg33cabe>
Kliknij poniĹĽej, aby autoryzowaÄ‡ dostÄ™p do swojego Google Drive. 
                System bÄ™dzie miaĹ‚ dostÄ™p tylko do odczytu Twoich plikĂłw.
</p> <div class="permissions-info mb-4 p-4 bg-black/30 rounded border border-edge" data-astro-cid-vg33cabe> <h4 class="text-sm font-semibold mb-2 text-primary-foreground" data-astro-cid-vg33cabe>
Uprawnienia, o ktĂłre poprosimy:
</h4> <ul class="text-sm text-gray-300 space-y-1" data-astro-cid-vg33cabe> <li data-astro-cid-vg33cabe>â€˘ Odczyt metadanych plikĂłw (nazwy, rozmiary, daty)</li> <li data-astro-cid-vg33cabe>â€˘ Odczyt zawartoĹ›ci dokumentĂłw tekstowych</li> <li data-astro-cid-vg33cabe>â€˘ Wyszukiwanie w Twoich plikach</li> <li data-astro-cid-vg33cabe>â€˘ <strong data-astro-cid-vg33cabe>NIE</strong> bÄ™dziemy modyfikowaÄ‡ ani usuwaÄ‡ plikĂłw</li> </ul> </div> <button id="authorizeBtn" onclick="startAuthorization()" class="action-btn primary" data-astro-cid-vg33cabe>
đź” Autoryzuj Google Drive
</button> </div> </div> <!-- Step 3: Verify --> <div class="step-card" id="step3" data-astro-cid-vg33cabe> <div class="step-header" data-astro-cid-vg33cabe> <div class="step-number" data-astro-cid-vg33cabe>3</div> <h3 class="step-title" data-astro-cid-vg33cabe>Weryfikuj poĹ‚Ä…czenie</h3> </div> <div class="step-content" data-astro-cid-vg33cabe> <p class="text-gray-300 mb-4" data-astro-cid-vg33cabe>
Po autoryzacji sprawdzimy dostÄ™p do Twoich danych i przygotujemy system AI.
</p> <div id="verificationResults" class="verification-results hidden" data-astro-cid-vg33cabe> <div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-astro-cid-vg33cabe> <div class="result-card" data-astro-cid-vg33cabe> <div class="result-title" data-astro-cid-vg33cabe>Dane osobiste</div> <div class="result-value" id="personalFiles" data-astro-cid-vg33cabe>0 plikĂłw</div> <div class="result-size" id="personalSize" data-astro-cid-vg33cabe>0 GB</div> </div> <div class="result-card" data-astro-cid-vg33cabe> <div class="result-title" data-astro-cid-vg33cabe>Dane biznesowe</div> <div class="result-value" id="businessFiles" data-astro-cid-vg33cabe>0 plikĂłw</div> <div class="result-size" id="businessSize" data-astro-cid-vg33cabe>0 GB</div> </div> <div class="result-card" data-astro-cid-vg33cabe> <div class="result-title" data-astro-cid-vg33cabe>Dane techniczne</div> <div class="result-value" id="technicalFiles" data-astro-cid-vg33cabe>0 plikĂłw</div> <div class="result-size" id="technicalSize" data-astro-cid-vg33cabe>0 GB</div> </div> </div> </div> <button id="verifyBtn" onclick="verifyConnection()" class="action-btn secondary" disabled data-astro-cid-vg33cabe>
âś… Weryfikuj poĹ‚Ä…czenie
</button> </div> </div> <!-- Step 4: Complete --> <div class="step-card" id="step4" data-astro-cid-vg33cabe> <div class="step-header" data-astro-cid-vg33cabe> <div class="step-number" data-astro-cid-vg33cabe>4</div> <h3 class="step-title" data-astro-cid-vg33cabe>Gotowe!</h3> </div> <div class="step-content" data-astro-cid-vg33cabe> <div id="completionMessage" class="completion-message hidden" data-astro-cid-vg33cabe> <div class="success-icon" data-astro-cid-vg33cabe>âś…</div> <h4 class="success-title" data-astro-cid-vg33cabe>Google Drive poĹ‚Ä…czony!</h4> <p class="success-desc" data-astro-cid-vg33cabe>
TwĂłj Google Drive jest teraz zintegrowany z systemem AI MyBonzo. 
                  MoĹĽesz korzystaÄ‡ z zaawansowanych rekomendacji opartych na Twoich danych.
</p> <div class="next-steps mt-4" data-astro-cid-vg33cabe> <h5 class="text-sm font-semibold mb-2 text-primary-foreground" data-astro-cid-vg33cabe>NastÄ™pne kroki:</h5> <div class="flex flex-col sm:flex-row gap-3" data-astro-cid-vg33cabe> <button onclick="window.open('/ai-functions/personalized-recommendations', '_blank')" class="action-btn primary" data-astro-cid-vg33cabe>
đźŽŻ Generuj rekomendacje
</button> <button onclick="testDriveIntegration()" class="action-btn secondary" data-astro-cid-vg33cabe>
đź§Ş Testuj integracjÄ™
</button> <button onclick="window.open('/docs/google-drive-setup', '_blank')" class="action-btn secondary" data-astro-cid-vg33cabe>
đź“– Dokumentacja
</button> </div> </div> </div> </div> </div> </div> <!-- Security Notice --> <div class="security-notice mt-8 p-6 bg-black/30 rounded border border-edge" data-astro-cid-vg33cabe> <h3 class="text-lg font-semibold mb-3 text-primary-foreground" data-astro-cid-vg33cabe>
đź”’ BezpieczeĹ„stwo i prywatnoĹ›Ä‡:
</h3> <ul class="text-sm text-gray-300 space-y-2" data-astro-cid-vg33cabe> <li data-astro-cid-vg33cabe>â€˘ Twoje dane pozostajÄ… w Twoim Google Drive</li> <li data-astro-cid-vg33cabe>â€˘ System ma dostÄ™p tylko do odczytu</li> <li data-astro-cid-vg33cabe>â€˘ Nie przechowujemy Twoich plikĂłw na naszych serwerach</li> <li data-astro-cid-vg33cabe>â€˘ MoĹĽesz odwoĹ‚aÄ‡ dostÄ™p w kaĹĽdej chwili w ustawieniach Google</li> <li data-astro-cid-vg33cabe>â€˘ Wszystkie poĹ‚Ä…czenia sÄ… szyfrowane (HTTPS)</li> <li data-astro-cid-vg33cabe>â€˘ Tokeny dostÄ™pu sÄ… bezpiecznie przechowywane w Cloudflare</li> </ul> </div> </div> </section> </main> ` })}  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/auth/google/authorize.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/auth/google/authorize.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/auth/google/authorize.astro";
const $$url = "/auth/google/authorize";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Authorize,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
