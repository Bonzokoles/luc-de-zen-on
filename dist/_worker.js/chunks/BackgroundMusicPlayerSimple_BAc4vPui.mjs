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
import { c as createComponent, m as maybeRenderHead, h as addAttribute, a as renderTemplate, B as onDestroy, j as attr_class, k as escape_html, i as ensure_array_like, n as attr, C as attr_style, l as stringify } from './vendor_CYa9XZjz.mjs';
/* empty css                         */

const $$RandomQuote = createComponent(($$result, $$props, $$slots) => {
  const quotes = [
    {
      text: "The unexamined life is not worth living.",
      author: "Socrates",
      source: "https://en.wikipedia.org/wiki/Socrates"
    },
    {
      text: "I think, therefore I am.",
      author: "Ren\xE9 Descartes",
      source: "https://en.wikipedia.org/wiki/Ren%C3%A9_Descartes"
    },
    {
      text: "Man is condemned to be free.",
      author: "Jean-Paul Sartre",
      source: "https://en.wikipedia.org/wiki/Jean-Paul_Sartre"
    },
    {
      text: "Two possibilities exist: either we are alone in the Universe or we are not. Both are equally terrifying.",
      author: "Arthur C. Clarke",
      source: "https://en.wikipedia.org/wiki/Arthur_C._Clarke"
    },
    {
      text: "To, co mnie nie zabije, czyni mnie silniejszym.",
      author: "Friedrich Nietzsche",
      source: "https://en.wikipedia.org/wiki/Friedrich_Nietzsche"
    },
    {
      text: "Granice mojego j\u0119zyka s\u0105 granicami mojego \u015Bwiata.",
      author: "Ludwig Wittgenstein",
      source: "https://en.wikipedia.org/wiki/Ludwig_Wittgenstein"
    },
    {
      text: "Science fiction is a laboratory for ideas about the future.",
      author: "Isaac Asimov",
      source: "https://en.wikipedia.org/wiki/Isaac_Asimov"
    },
    {
      text: "Cz\u0142owiek jest tym, czym s\u0105 jego decyzje.",
      author: "Frank Herbert (Dune)",
      source: "https://en.wikipedia.org/wiki/Dune_(novel)"
    }
  ];
  const currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return renderTemplate`${maybeRenderHead()}<div class="rq-container" data-astro-cid-q65ond43> ${currentQuote.source ? renderTemplate`<a class="rq-quote" target="_blank" rel="noopener"${addAttribute(currentQuote.source, "href")} data-astro-cid-q65ond43>
"${currentQuote.text}" <span class="rq-author" data-astro-cid-q65ond43>— ${currentQuote.author}</span> </a>` : renderTemplate`<div class="rq-quote" data-astro-cid-q65ond43>
"${currentQuote.text}" <span class="rq-author" data-astro-cid-q65ond43>— ${currentQuote.author}</span> </div>`} </div> `;
}, "Q:/mybonzo/luc-de-zen-on/src/components/RandomQuote.astro", void 0);

function AiHelpAssistant($$payload, $$props) {
  $$payload.component(($$payload2) => {
    let isConnected = false;
    let messages = [];
    let inputValue = "";
    let agentStatus = "disconnected";
    let capabilities = [];
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const API_BASE_URL = (typeof window !== "undefined" ? window.location.origin : "");
    const HEALTH_ENDPOINT = `${API_BASE_URL}/api/health`;
    async function checkConnection() {
      try {
        agentStatus = "connecting";
        const response = await fetch(HEALTH_ENDPOINT, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
          const data = await response.json();
          isConnected = true;
          agentStatus = "ready";
          capabilities = ["Chat AI", "Knowledge Base", "Help System"];
          addMessage("system", "🤖 POLACZEK_T Assistant połączony i gotowy do pracy!");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Connection check failed:", error);
        isConnected = false;
        agentStatus = "disconnected";
        addMessage("error", `Błąd połączenia: ${error.message}`);
      }
    }
    onDestroy(() => {
      if (typeof window !== "undefined") {
        try {
          window.removeEventListener("polaczek-clear-chat", clearChat);
          window.removeEventListener("polaczek-reconnect", checkConnection);
        } catch (e) {
        }
      }
    });
    function scrollToBottom() {
    }
    function addMessage(type, content) {
      messages = [
        ...messages,
        {
          id: Date.now() + Math.random(),
          type,
          content,
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
        }
      ];
    }
    function getStatusColor(status) {
      switch (status) {
        case "connected":
        case "ready":
          return "text-green-500";
        case "error":
          return "text-red-500";
        case "disconnected":
          return "text-gray-500";
        default:
          return "text-yellow-500";
      }
    }
    function getStatusIcon(status) {
      switch (status) {
        case "connected":
        case "ready":
          return "🟢";
        case "error":
          return "🔴";
        case "disconnected":
          return "⚪";
        default:
          return "🟡";
      }
    }
    function clearChat() {
      messages = [];
    }
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(), 50);
    }
    if (typeof window !== "undefined") {
        window.POLACZEK = window.POLACZEK || {};
        window.POLACZEK.status = agentStatus;
        try {
          window.dispatchEvent(new CustomEvent("polaczek-status", { detail: { status: agentStatus } }));
        } catch (e) {
        }
      }
    $$payload2.push(`<div class="assistant-container svelte-et2eqj">`);
    {
      $$payload2.push("<!--[!-->");
      $$payload2.push(`<div class="assistant-panel svelte-et2eqj"><div class="assistant-header svelte-et2eqj"><div class="flex items-center gap-2 svelte-et2eqj"><span class="text-lg svelte-et2eqj">🤖</span> <span class="font-medium svelte-et2eqj">POLACZEK_T Asystent</span></div> <div class="flex items-center gap-2 svelte-et2eqj"><span${attr_class(`text-xs ${getStatusColor(agentStatus)}`, "svelte-et2eqj")}>${escape_html(getStatusIcon(agentStatus))}
            ${escape_html(agentStatus)}</span> <button class="text-white hover:text-gray-200 text-xl svelte-et2eqj">−</button></div></div> <div class="messages svelte-et2eqj"><!--[-->`);
      const each_array = ensure_array_like(messages);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let message = each_array[$$index];
        $$payload2.push(`<div${attr_class(`flex ${message.type === "user" ? "justify-end" : "justify-start"}`, "svelte-et2eqj")}><div${attr_class(
          `bubble ${message.type === "user" ? "bubble-user" : message.type === "agent" ? "bubble-agent" : message.type === "system" ? "bubble-system" : "bg-red-100 text-red-800 border border-red-200"}`,
          "svelte-et2eqj"
        )}><div class="svelte-et2eqj">${escape_html(message.content)}</div> <div${attr_class(`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`, "svelte-et2eqj")}>${escape_html(message.timestamp)}</div></div></div>`);
      }
      $$payload2.push(`<!--]--> `);
      {
        $$payload2.push("<!--[!-->");
      }
      $$payload2.push(`<!--]--></div> <div class="input-bar svelte-et2eqj"><div class="flex gap-2 mb-2 svelte-et2eqj"><button class="text-xs text-gray-400 hover:text-gray-200 px-2 py-1 svelte-et2eqj"${attr("disabled", messages.length === 0, true)}>Wyczyść</button> <button class="text-xs text-gray-400 hover:text-gray-200 px-2 py-1 svelte-et2eqj"${attr("disabled", isConnected, true)}>Połącz ponownie</button></div> <div class="flex gap-2 svelte-et2eqj"><input${attr("value", inputValue)} placeholder="Zadaj pytanie agentowi..."${attr("disabled", !isConnected, true)} class="assistant-input svelte-et2eqj"/> <button${attr("disabled", !isConnected || !inputValue.trim(), true)} class="assistant-send svelte-et2eqj">Wyślij</button></div> `);
      if (capabilities.length > 0) {
        $$payload2.push("<!--[-->");
        $$payload2.push(`<div class="mt-2 text-xs text-gray-400 svelte-et2eqj">Funkcje: ${escape_html(capabilities.join(", "))}</div>`);
      } else {
        $$payload2.push("<!--[!-->");
      }
      $$payload2.push(`<!--]--></div></div>`);
    }
    $$payload2.push(`<!--]--></div>`);
  });
}

function BackgroundMusicPlayerSimple($$payload, $$props) {
	$$payload.component(($$payload) => {
		let volume = 0.5;
		let currentTime = 0;
		let duration = 0;
		let trackName = "No track selected";

		function formatTime(seconds) {
			const mins = Math.floor(seconds / 60);
			const secs = Math.floor(seconds % 60);

			return `${mins}:${secs.toString().padStart(2, "0")}`;
		}

		$$payload.push(`<div class="background-music-player in-flow svelte-u12wbg"><audio preload="metadata" crossorigin="anonymous"></audio> <div class="music-control-panel svelte-u12wbg"><div class="panel-header svelte-u12wbg"><span>🎵 MUSIC • POLACZEK</span> <button class="minimize-btn svelte-u12wbg">${escape_html("−")}</button></div> `);

		{
			$$payload.push('<!--[-->');
			$$payload.push(`<div class="panel-content svelte-u12wbg"><div class="now-playing svelte-u12wbg"><div class="track-info svelte-u12wbg"><div class="track-name svelte-u12wbg">${escape_html(trackName)}</div> <div class="track-time svelte-u12wbg">${escape_html(formatTime(currentTime))} / ${escape_html(formatTime(duration))}</div></div></div> <div class="player-controls svelte-u12wbg"><button class="control-btn svelte-u12wbg">⏮</button> <button class="control-btn play-pause svelte-u12wbg">${escape_html("▶")}</button> <button class="control-btn svelte-u12wbg">⏭</button> <button class="control-btn svelte-u12wbg">📋</button></div> <div class="volume-control svelte-u12wbg"><span class="svelte-u12wbg">🔊</span> <input type="range" min="0" max="100"${attr('value', volume * 100)} class="volume-slider svelte-u12wbg"/></div> <div class="progress-container svelte-u12wbg"><div class="progress-bar svelte-u12wbg" role="slider" tabindex="0" aria-label="Seek"${attr('aria-valuemin', 0)}${attr('aria-valuemax', 0)}${attr('aria-valuenow', 0)}><div class="progress-fill svelte-u12wbg"${attr_style(`width: ${stringify(0)}%`)}></div></div></div></div>`);
		}

		$$payload.push(`<!--]--></div> `);

		{
			$$payload.push('<!--[!-->');
		}

		$$payload.push(`<!--]--></div>`);
	});
}

export { $$RandomQuote as $, AiHelpAssistant as A, BackgroundMusicPlayerSimple as B };
