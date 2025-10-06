globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as renderScript } from '../chunks/astro/server_HpSis98d.mjs';
import { $ as $$Layout } from '../chunks/Layout_DuDM06hk.mjs';
import { c as attr_class, s as stringify, e as escape_html, a as attr, g as attr_style } from '../chunks/_@astro-renderers_D_xeYX_3.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_D_xeYX_3.mjs';
/* empty css                                            */

function CyberpunkMusicPlayer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let volume = 0.5;
		let currentTime = 0;
		let duration = 0;
		let trackName = "No track selected";
		let isLoading = false;

		function formatTime(seconds) {
			const mins = Math.floor(seconds / 60);
			const secs = Math.floor(seconds % 60);

			return `${mins}:${secs.toString().padStart(2, "0")}`;
		}

		$$renderer.push(`<audio preload="auto" crossorigin="anonymous" class="svelte-13sx5v7"></audio> <div class="cyberpunk-music-player svelte-13sx5v7"><div class="player-panel svelte-13sx5v7"><div class="player-header svelte-13sx5v7"><div class="player-title svelte-13sx5v7"><span class="title-text svelte-13sx5v7">CYBER MUSIC SYSTEM</span> <div class="status-indicators svelte-13sx5v7"><span${attr_class(`indicator ${stringify('')}`, 'svelte-13sx5v7')}>L1</span> <span${attr_class(`indicator ${stringify('')}`, 'svelte-13sx5v7')}>L2</span> <span${attr_class(`indicator ${stringify('')}`, 'svelte-13sx5v7')}>L3</span></div></div></div> <div class="visualizer-container svelte-13sx5v7"><canvas class="visualizer-canvas svelte-13sx5v7"></canvas> <div class="visualizer-overlay svelte-13sx5v7">`);

		{
			$$renderer.push('<!--[-->');
			$$renderer.push(`<div class="visualizer-idle svelte-13sx5v7"><span class="svelte-13sx5v7">AUDIO MATRIX INACTIVE</span></div>`);
		}

		$$renderer.push(`<!--]--></div></div> <div class="track-info-section svelte-13sx5v7"><div class="track-details svelte-13sx5v7"><div class="track-name svelte-13sx5v7">${escape_html(trackName)}</div> <div class="track-artist svelte-13sx5v7">${escape_html("Unknown Artist")}</div> <div class="track-time svelte-13sx5v7">${escape_html(formatTime(currentTime))} / ${escape_html(formatTime(duration))}</div></div></div> <div class="player-controls svelte-13sx5v7"><button class="control-btn svelte-13sx5v7"><span class="btn-icon svelte-13sx5v7">⏮</span></button> <button class="control-btn play-btn svelte-13sx5v7"${attr('disabled', isLoading, true)}>`);

		{
			$$renderer.push('<!--[!-->');
			$$renderer.push(`<span class="btn-icon svelte-13sx5v7">${escape_html("▶")}</span>`);
		}

		$$renderer.push(`<!--]--></button> <button class="control-btn svelte-13sx5v7"><span class="btn-icon svelte-13sx5v7">⏭</span></button> <button class="control-btn playlist-btn svelte-13sx5v7"><span class="btn-icon svelte-13sx5v7">☰</span></button></div> <div class="progress-section svelte-13sx5v7"><div class="progress-bar svelte-13sx5v7" role="slider" tabindex="0" aria-label="Seek"><div class="progress-fill svelte-13sx5v7"${attr_style(`width: ${stringify(0)}%`)}></div> <div class="progress-glow svelte-13sx5v7"${attr_style(`left: ${stringify(0)}%`)}></div></div></div> <div class="volume-section svelte-13sx5v7"><div class="volume-control svelte-13sx5v7"><span class="volume-icon svelte-13sx5v7">🔊</span> <input type="range" min="0" max="100"${attr('value', volume * 100)} class="volume-slider svelte-13sx5v7"/> <span class="volume-value svelte-13sx5v7">${escape_html(Math.round(volume * 100))}%</span></div></div></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--></div>`);
	});
}

const $$CyberMusicTest = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Cyberpunk Music Player Test", "data-astro-cid-orp4dojk": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-orp4dojk> <div class="demo-container" data-astro-cid-orp4dojk> <h1 class="demo-title" data-astro-cid-orp4dojk>CYBER MUSIC SYSTEM</h1> <p class="demo-subtitle" data-astro-cid-orp4dojk>Advanced Cyberpunk Music Player with Progressive Visualizer</p> <div class="feature-list" data-astro-cid-orp4dojk> <h3 data-astro-cid-orp4dojk>🎵 Key Features</h3> <div class="feature-item" data-astro-cid-orp4dojk> <span class="feature-icon" data-astro-cid-orp4dojk>🎛️</span> <span data-astro-cid-orp4dojk>Cyberpunk styling matching site theme</span> </div> <div class="feature-item" data-astro-cid-orp4dojk> <span class="feature-icon" data-astro-cid-orp4dojk>📊</span> <span data-astro-cid-orp4dojk>Progressive 3-layer visualizer (L1 → L2 → L3)</span> </div> <div class="feature-item" data-astro-cid-orp4dojk> <span class="feature-icon" data-astro-cid-orp4dojk>📋</span> <span data-astro-cid-orp4dojk>Smooth dropdown track list</span> </div> <div class="feature-item" data-astro-cid-orp4dojk> <span class="feature-icon" data-astro-cid-orp4dojk>🎨</span> <span data-astro-cid-orp4dojk>Animated scanning lines and glow effects</span> </div> <div class="feature-item" data-astro-cid-orp4dojk> <span class="feature-icon" data-astro-cid-orp4dojk>🔊</span> <span data-astro-cid-orp4dojk>Full audio controls with visual feedback</span> </div> <div class="feature-item" data-astro-cid-orp4dojk> <span class="feature-icon" data-astro-cid-orp4dojk>📱</span> <span data-astro-cid-orp4dojk>Responsive design for all devices</span> </div> </div> <div class="player-demo-section" data-astro-cid-orp4dojk> <h2 class="section-title" data-astro-cid-orp4dojk>Music Player Demo</h2> <div class="player-container" data-astro-cid-orp4dojk> ${renderComponent($$result2, "CyberpunkMusicPlayer", CyberpunkMusicPlayer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/CyberpunkMusicPlayer.svelte", "client:component-export": "default", "data-astro-cid-orp4dojk": true })} </div> </div> <div class="controls-demo" data-astro-cid-orp4dojk> <h3 style="color: var(--cyber-blue); margin-bottom: 15px;" data-astro-cid-orp4dojk>🎮 API Controls</h3> <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 15px; font-size: 0.9rem;" data-astro-cid-orp4dojk>
Test the global JavaScript API:
</p> <button class="demo-btn" onclick="testPlay()" data-astro-cid-orp4dojk>Play/Pause</button> <button class="demo-btn" onclick="testNext()" data-astro-cid-orp4dojk>Next Track</button> <button class="demo-btn" onclick="testPrevious()" data-astro-cid-orp4dojk>Previous</button> <button class="demo-btn" onclick="testPlaylist()" data-astro-cid-orp4dojk>Toggle Playlist</button> <button class="demo-btn" onclick="testVolume()" data-astro-cid-orp4dojk>Volume 50%</button> <button class="demo-btn" onclick="testStatus()" data-astro-cid-orp4dojk>Show Status</button> <div class="code-block" data-astro-cid-orp4dojk> <code data-astro-cid-orp4dojk>
// Available Global API:<br data-astro-cid-orp4dojk>
window.CYBER_MUSIC.play()         // Start playback<br data-astro-cid-orp4dojk>
window.CYBER_MUSIC.pause()        // Pause playback<br data-astro-cid-orp4dojk>
window.CYBER_MUSIC.toggle()       // Toggle play/pause<br data-astro-cid-orp4dojk>
window.CYBER_MUSIC.next()         // Next track<br data-astro-cid-orp4dojk>
window.CYBER_MUSIC.prev()         // Previous track<br data-astro-cid-orp4dojk>
window.CYBER_MUSIC.togglePlaylist() // Show/hide playlist<br data-astro-cid-orp4dojk>
window.CYBER_MUSIC.setVolume(0.5) // Set volume (0-1)<br data-astro-cid-orp4dojk>
window.CYBER_MUSIC.getState()     // Get current state
</code> </div> </div> </div> ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/cyber-music-test.astro?astro&type=script&index=0&lang.ts")} </main> ` })} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/cyber-music-test.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/cyber-music-test.astro";
const $$url = "/cyber-music-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CyberMusicTest,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
