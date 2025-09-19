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
import { c as createComponent, a as renderTemplate, b as renderScript, r as renderComponent, m as maybeRenderHead, w as $$Icon } from '../chunks/vendor_BHZTJLV0.mjs';
export { d as renderers } from '../chunks/vendor_BHZTJLV0.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_DH5CUiol.mjs';
import { $ as $$RandomQuote, B as BackgroundMusicPlayerSimple, A as AiHelpAssistant } from '../chunks/BackgroundMusicPlayerSimple_C4fjTcnj.mjs';
import { j as jsxRuntimeExports, r as reactExports } from '../chunks/react_wu9MgIUH.mjs';
/* empty css                                 */
import { $ as $$DecorativeLines } from '../chunks/DecorativeLines_CfAAnw2w.mjs';

function QuickVoiceAI({ variant = "compact" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quick-voice-ai", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Voice AI temporarily disabled" }) });
}

const VoiceAssistantPolaczek = ({
  className = ""
}) => {
  const [isListening, setIsListening] = reactExports.useState(false);
  const [isSpeaking, setIsSpeaking] = reactExports.useState(false);
  const [currentMessage, setCurrentMessage] = reactExports.useState("");
  const [isActive, setIsActive] = reactExports.useState(false);
  const [conversationHistory, setConversationHistory] = reactExports.useState([]);
  const audioRef = reactExports.useRef(null);
  const recognitionRef = reactExports.useRef(null);
  const bonzoResponses = [
    "Witaj! Jestem POLACZEK, Twój polski asystent AI. System BONZO to nowoczesna platforma łącząca sztuczną inteligencję z automatyzacją.",
    "BONZO wykorzystuje zaawansowane technologie jak BigQuery, Cloudflare Workers i Google AI APIs do analizy danych w czasie rzeczywistym.",
    "Główne funkcje BONZO to: wizualizacje audio, analityka BigQuery, generator quizów AI i inteligentny chat. Wszystko zintegrowane w jednym systemie.",
    "System BONZO oferuje wielojęzyczne wsparcie dzięki Google Translate API. Mogę odpowiadać po polsku, angielsku, niemiecku, hiszpańsku i francusku.",
    "Wizualizatory BONZO synchronizują się z muzyką w czasie rzeczywistym, tworząc spektakularne efekty audiowizualne.",
    "BONZO łączy Cloud Run, Cloudflare Workers i Google Cloud AI w spójną architekturę microservices dla maksymalnej wydajności.",
    "Dzięki integracji z POLACZEK API możesz generować quizy, analizować dane i prowadzić konwersacje - wszystko głosowo!"
  ];
  const initializeSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "pl-PL";
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setConversationHistory((prev) => [...prev, { type: "user", text: transcript }]);
        handleUserInput(transcript);
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }
  };
  const handleUserInput = (input) => {
    let response = bonzoResponses[0];
    if (input.toLowerCase().includes("bigquery") || input.toLowerCase().includes("dane")) {
      response = bonzoResponses[1];
    } else if (input.toLowerCase().includes("funkcje") || input.toLowerCase().includes("możliwości")) {
      response = bonzoResponses[2];
    } else if (input.toLowerCase().includes("język") || input.toLowerCase().includes("tłumaczenie")) {
      response = bonzoResponses[3];
    } else if (input.toLowerCase().includes("muzyka") || input.toLowerCase().includes("wizualizator")) {
      response = bonzoResponses[4];
    } else if (input.toLowerCase().includes("architektura") || input.toLowerCase().includes("technologia")) {
      response = bonzoResponses[5];
    } else if (input.toLowerCase().includes("polaczek") || input.toLowerCase().includes("api")) {
      response = bonzoResponses[6];
    } else {
      response = bonzoResponses[Math.floor(Math.random() * bonzoResponses.length)];
    }
    setConversationHistory((prev) => [...prev, { type: "assistant", text: response }]);
    speakText(response);
  };
  const speakText = async (text) => {
    try {
      setIsSpeaking(true);
      setCurrentMessage(text);
      const response = await fetch("/api/polaczek/quiz/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          language: "pl"
        })
      });
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.onended = () => {
            setIsSpeaking(false);
            setCurrentMessage("");
            URL.revokeObjectURL(audioUrl);
          };
          await audioRef.current.play();
        }
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pl-PL";
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.onend = () => {
          setIsSpeaking(false);
          setCurrentMessage("");
        };
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(false);
      setCurrentMessage("");
    }
  };
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };
  const toggleAssistant = () => {
    if (!isActive) {
      setIsActive(true);
      initializeSpeechRecognition();
      speakText("Cześć! Jestem POLACZEK. Pytaj mnie o system BONZO!");
    } else {
      setIsActive(false);
      setConversationHistory([]);
      speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };
  reactExports.useEffect(() => {
    if (isSpeaking && typeof window !== "undefined") {
      const event = new CustomEvent("polaczek-speaking", {
        detail: { isActive: true, message: currentMessage }
      });
      window.dispatchEvent(event);
    } else if (typeof window !== "undefined") {
      const event = new CustomEvent("polaczek-speaking", {
        detail: { isActive: false }
      });
      window.dispatchEvent(event);
    }
  }, [isSpeaking, currentMessage]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `voice-assistant-polaczek ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { ref: audioRef, className: "audio-hidden" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: toggleAssistant,
          className: `
            relative w-20 h-20 rounded-full border-2 transition-all duration-300
            ${isActive ? "bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/30" : "bg-gray-700/20 border-gray-500 hover:border-gray-400"}
            ${isSpeaking ? "animate-pulse" : ""}
          `,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: isSpeaking ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-8 bg-blue-400 animate-pulse rounded wave-bar-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-6 bg-blue-400 animate-pulse rounded wave-bar-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-8 bg-blue-400 animate-pulse rounded wave-bar-3" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-blue-400", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z", clipRule: "evenodd" }) }) }),
            isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full border border-blue-400/20 animate-ping ping-ring-delayed" })
            ] })
          ]
        }
      ),
      isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: startListening,
          disabled: isListening || isSpeaking,
          className: `
              px-6 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${isListening ? "bg-red-500/20 border border-red-400 text-red-300" : "bg-blue-500/20 border border-blue-400 text-blue-300 hover:bg-blue-500/30"}
              disabled:opacity-50 disabled:cursor-not-allowed
            `,
          children: isListening ? "🎤 Słucham..." : "🎙️ Zapytaj o BONZO"
        }
      ),
      isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        isSpeaking && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-blue-300 text-sm animate-pulse", children: "🗣️ POLACZEK mówi..." }),
        currentMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-xs text-xs text-gray-400 bg-gray-800/50 rounded p-2 border border-gray-600", children: currentMessage })
      ] }),
      isActive && conversationHistory.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-md space-y-2 max-h-40 overflow-y-auto", children: conversationHistory.slice(-3).map((msg, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `
                  text-xs p-2 rounded border
                  ${msg.type === "user" ? "bg-green-900/20 border-green-600/50 text-green-300 ml-4" : "bg-blue-900/20 border-blue-600/50 text-blue-300 mr-4"}
                `,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              msg.type === "user" ? "👤" : "🤖",
              ":"
            ] }),
            " ",
            msg.text
          ]
        },
        index
      )) })
    ] })
  ] });
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", " <!-- JavaScript Functions --> ", '  <!-- Voice Assistant Test Script for Development --> <script src="/voice-assistant-test.js"><\/script>'])), renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "AI Workers Platform | KAROL LISSON", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, { "data-astro-cid-j7pv25f6": true })}  ${maybeRenderHead()}<div class="workers-vertical-line-left" data-astro-cid-j7pv25f6></div> <div class="workers-vertical-line-right" data-astro-cid-j7pv25f6></div> <main class="min-h-svh" data-astro-cid-j7pv25f6> <!-- Top Separator Section --> <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="py-1" data-astro-cid-j7pv25f6></div> </div> </section> <!-- Header Section --> <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="flex justify-between max-h-72 min-h-64" data-astro-cid-j7pv25f6> <!-- Left corner - O_MNIE content --> <div class="mt-auto" style="max-width: 45vw;" data-astro-cid-j7pv25f6> <div class="text-edge text-sm italic px-2" style="
                transform: scale(1.32);
                transform-origin: left center;
                margin: 15px;
                margin-left: 0px;
                width: calc(45vw - 30px);
                max-width: 380px;
                line-height: 1.4;
                word-wrap: break-word;
                hyphens: auto;
              " data-astro-cid-j7pv25f6>
Pasjonat technologii i programista z misją.<br data-astro-cid-j7pv25f6>
Tworzę nowoczesne rozwiązania, które łączą<br data-astro-cid-j7pv25f6>
sztuczną inteligencję z automatyzacją.<br data-astro-cid-j7pv25f6>
Moim celem jest budowanie użytecznych narzędzi.
</div> </div> <span class="mt-auto" data-astro-cid-j7pv25f6> <div style="
              transform: scale(1.56);
              transform-origin: center right;
              margin: 15px;
              width: calc(50vw - 576px - 10px - 20px - 30px);
              max-width: 400px;
              text-align: right;
              word-wrap: break-word;
              hyphens: auto;
            " data-astro-cid-j7pv25f6> ${renderComponent($$result2, "RandomQuote", $$RandomQuote, { "data-astro-cid-j7pv25f6": true })} </div> <span style="" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-j7pv25f6>
AUG 2025
</span> </span> </div> </div> </section> <!-- Header-Navigation Separator --> <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="py-1" data-astro-cid-j7pv25f6></div> </div> </section> <!-- Navigation Section --> <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="flex flex-row p-2" data-astro-cid-j7pv25f6> <a class="hover:brightness-125" href="/" data-astro-cid-j7pv25f6> <h1 class="text-4xl sm:text-5xl" data-astro-cid-j7pv25f6>KAROL LISSON</h1> <h2 class="text-2xl sm:text-3xl" data-astro-cid-j7pv25f6>MY_Bonzo_AI_ZEnon_HuB</h2> </a> <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col" data-astro-cid-j7pv25f6> <a class="ml-auto hover:brightness-125 duration-200" href="mailto:LissonKarol.msa@gmail.com" data-astro-cid-j7pv25f6>
LissonKarol.msa@gmail.com
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j7pv25f6></path> </svg> </a> <div class="flex flex-row-reverse flex-wrap gap-4" data-astro-cid-j7pv25f6> <a class="hover:brightness-125 duration-200" href="https://www.linkedin.com/in/linkedinHandle" data-astro-cid-j7pv25f6>
LinkedIn
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j7pv25f6></path> </svg> </a> <a class="hover:brightness-125 duration-200" href="https://www.github.com/githubUsername" data-astro-cid-j7pv25f6>
GitHub
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j7pv25f6></path> </svg> </a> </div> </div> </div> </div> </section> <!-- Separator Section 1 --> <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div t class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="py-1" data-astro-cid-j7pv25f6></div> </div> </section> <!-- AI Workers Section - Centered --> <section class="border border-edge ai-workers-section flex items-center justify-center py-16 relative" id="ai-workers" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto w-full" data-astro-cid-j7pv25f6> <div class="section-container" data-astro-cid-j7pv25f6> <h2 class="system-title" data-astro-cid-j7pv25f6>SYSTEM ZAAWANSOWANEJ AUTOMATYZACJI AI</h2> <!-- Separator after title --> <div style="
            width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
            max-width: 1212px;
            margin: 0 auto;
            border-t: 1px solid #ffffff;
            margin-top: 1rem;
            margin-bottom: 1.5rem;
          " data-astro-cid-j7pv25f6></div> <p class="section-description" style="
            width: calc(100vw - 2 * (50vw - 576px - 10px - 20px) - 40px);
            max-width: 1100px;
            margin: 0 auto;
            margin-left: calc(50% - 10px);
            transform: translateX(-50%);
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.6;
            padding: 0 15px;
          " data-astro-cid-j7pv25f6>
Platforma integruje wyspecjalizowane Workery AI, działające w
            chmurze Cloudflare, aby dostarczać kompleksowe rozwiązania
            automatyzacji z wykorzystaniem sztucznej inteligencji.
</p> </div>  ${renderComponent($$result2, "QuickVoiceAI", QuickVoiceAI, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/QuickVoiceAI.tsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })}   <!-- Full-width Music Visualizer - Extended to Left Screen Edge --> <div style="
            position: relative;
            left: 0;
            right: 0;
            width: 100vw;
            margin-top: 1rem;
            margin-bottom: 1.5rem;
            padding: 12px 0;
            margin-left: -50vw;
            margin-right: -50vw;
            left: 50%;
            background: rgba(0, 0, 0, 0.4);
          " data-astro-cid-j7pv25f6> <!-- White lines extending to full screen width --> <div style="position:absolute; left:0; right:0; top:0; height:1px; background:#ffffff;" data-astro-cid-j7pv25f6></div> <div style="position:absolute; left:0; right:0; bottom:0; height:1px; background:#ffffff;" data-astro-cid-j7pv25f6></div> <!-- Music Visualizer - Two waves: Music Player and Mic --> <div style="
              width: 100vw;
              height: 120px;
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
            " data-astro-cid-j7pv25f6> <!-- Back layer: reacts to Music Player, same height but wave 3% taller --> <div style="
                position:absolute; 
                left: 50%; 
                transform: translateX(-50%) scaleY(1.03); 
                width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
                max-width: 1212px;
                height: 120px;
                opacity: 0.4;
                filter: hue-rotate(30deg) brightness(1.2);
                pointer-events:none;
              " data-astro-cid-j7pv25f6> ${renderComponent($$result2, "EdgeAudioVisualizer", null, { "client:only": "react", "height": 120, "source": "music", "variant": "music", "client:component-hydration": "only", "data-astro-cid-j7pv25f6": true, "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/voice-ai/EdgeAudioVisualizer.tsx", "client:component-export": "default" })} </div> <!-- Back layer mirrored: reacts to Music Player, flipped horizontally with darker color --> <div style="
                position:absolute; 
                left: 50%; 
                transform: translateX(-50%) scaleY(1.03) scaleX(-1); 
                width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
                max-width: 1212px;
                height: 120px;
                opacity: 0.3;
                filter: hue-rotate(30deg) brightness(0.8);
                pointer-events:none;
              " data-astro-cid-j7pv25f6> ${renderComponent($$result2, "EdgeAudioVisualizer", null, { "client:only": "react", "height": 120, "source": "music", "variant": "music", "client:component-hydration": "only", "data-astro-cid-j7pv25f6": true, "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/voice-ai/EdgeAudioVisualizer.tsx", "client:component-export": "default" })} </div> <!-- Front layer: reacts to Avatar (mic) --> <div style="
                position:absolute; 
                left: 50%; 
                transform: translateX(-50%); 
                width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
                max-width: 1212px;
                height: 120px;
                opacity: 0.8;
                pointer-events:none;
              " data-astro-cid-j7pv25f6> ${renderComponent($$result2, "EdgeAudioVisualizer", null, { "client:only": "react", "height": 120, "source": "mic", "variant": "mic", "client:component-hydration": "only", "data-astro-cid-j7pv25f6": true, "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/voice-ai/EdgeAudioVisualizer.tsx", "client:component-export": "default" })} </div> </div> <!-- Script to connect music player with visualizer --> ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/index.astro?astro&type=script&index=0&lang.ts")} </div> <!-- Dashboard Buttons Section (only buttons after login) --> <div class="dashboard-buttons-section hidden" id="dashboardButtons" data-astro-cid-j7pv25f6> <a href="/admin/" class="dashboard-btn" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>ADMIN PANEL</a> <a href="/dashboard" class="dashboard-btn" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>DASHBOARD</a> <a href="/admin/ai-models" class="dashboard-btn" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>AI MODELS</a> </div> <!-- Small Tags Section --> <div class="tags-section" style="
               display: flex !important;
               justify-content: center !important;
               gap: 1rem !important;
               margin-bottom: 2rem !important;
               width: 100% !important;
               z-index: 1000 !important;
               position: relative !important;
             " data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="tag-btn" onclick="window.open('/POLACZEK_AGENT_SYS_23', '_blank')" style="
              background: rgba(0, 217, 255, 0.1) !important;
              border: 1px solid rgba(0, 217, 255, 0.4) !important;
              color: #00d9ff !important;
              padding: 0.8rem 2rem !important;
              font-size: 0.9rem !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
              cursor: pointer !important;
              transition: all 0.3s ease !important;
              font-family: Rajdhani, sans-serif !important;
              flex: 1 !important;
              text-align: center !important;
              min-width: 0 !important;
            " data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>POLACZEK_AGENT_SYS_23</button> <button class="tag-btn" onclick="window.open('/hub/ai-agent-s', '_blank')" style="
              background: rgba(0, 217, 255, 0.1) !important;
              border: 1px solid rgba(0, 217, 255, 0.4) !important;
              color: #00d9ff !important;
              padding: 0.8rem 2rem !important;
              font-size: 0.9rem !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
              cursor: pointer !important;
              transition: all 0.3s ease !important;
              font-family: Rajdhani, sans-serif !important;
              flex: 1 !important;
              text-align: center !important;
              min-width: 0 !important;
            " data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>BIELIK</button> <button class="tag-btn" onclick="window.open('/workers-status', '_blank')" style="
              background: rgba(0, 217, 255, 0.1) !important;
              border: 1px solid rgba(0, 217, 255, 0.4) !important;
              color: #00d9ff !important;
              padding: 0.8rem 2rem !important;
              font-size: 0.9rem !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
              cursor: pointer !important;
              transition: all 0.3s ease !important;
              font-family: Rajdhani, sans-serif !important;
              flex: 1 !important;
              text-align: center !important;
              min-width: 0 !important;
            " data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>ZENON</button> <button class="tag-btn" onclick="window.open('/klf-sheed-shop', '_blank')" style="
              background: rgba(0, 217, 255, 0.1) !important;
              border: 1px solid rgba(0, 217, 255, 0.4) !important;
              color: #00d9ff !important;
              padding: 0.8rem 2rem !important;
              font-size: 0.9rem !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
              cursor: pointer !important;
              transition: all 0.3s ease !important;
              font-family: Rajdhani, sans-serif !important;
              flex: 1 !important;
              text-align: center !important;
              min-width: 0 !important;
            " data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>KLF_SHEED_SHOOP</button> </div> <div class="workers-grid" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <!-- Image Generator --> <div class="worker-card" data-worker="image" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Generator Obrazów
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Twórz niesamowite obrazy z tekstu używając Flux-1 Schnell
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Flux AI</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>512-1024px</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Tłumaczenie PL</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" placeholder="Opisz obraz..." class="quick-prompt" id="imagePrompt" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="openImageGenerator()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Generuj</button> <button class="action-btn secondary" onclick="window.open('/image-generator', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Otwórz</button> </div> </div> <!-- AI Chatbot --> <div class="worker-card" data-worker="chat" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>AI Chatbot</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Inteligentny asystent do rozmów i odpowiadania na pytania
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>OpenAI GPT</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Język polski</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Kontekst</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" placeholder="Zadaj pytanie..." class="quick-prompt" id="chatPrompt" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="openChatbot()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Chat</button> <button class="action-btn secondary" onclick="window.open('/chatbot', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Otwórz</button> </div> </div> <!-- BigQuery Analytics --> <div class="worker-card" data-worker="bigquery" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
BigQuery Analytics
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Analizuj dane z Google BigQuery, wykonuj zapytania SQL
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Google Cloud</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>SQL Query</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Analytics</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" placeholder="SELECT * FROM..." class="quick-prompt" id="bigqueryPrompt" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="openBigQuery()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Analizuj</button> <button class="action-btn secondary" onclick="window.open('/bigquery-analytics', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Otwórz</button> </div> <div id="bigquery-result" class="mt-4 p-2 border border-gray-300 rounded-md text-xs bg-transparent h-32 overflow-y-auto" data-astro-cid-j7pv25f6> <!-- Wyniki z BigQuery pojawią się tutaj --> </div> </div> <!-- Kaggle Datasets --> <div class="worker-card" data-worker="kaggle" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Kaggle Datasets
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Przeszukuj zbiory danych, konkursy i profile Kaggle
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Machine Learning</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Datasets</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Competitions</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" placeholder="machine learning..." class="quick-prompt" id="kagglePrompt" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="openKaggle()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Wyszukaj</button> <button class="action-btn secondary" onclick="window.open('/kaggle-datasets', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Otwórz</button> </div> <div id="kaggle-result" class="mt-4 p-2 border border-edge rounded-md text-xs bg-black bg-opacity-20 h-32 overflow-y-auto font-mono hidden" data-astro-cid-j7pv25f6> <!-- Wyniki z Kaggle pojawią się tutaj --> </div> </div> <!-- Tavily Search --> <div class="worker-card" data-worker="tavily" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Tavily AI Search
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Zaawansowane wyszukiwanie internetowe powered by AI
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>AI Search</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Real-time</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Deep Analysis</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" placeholder="wyszukaj w sieci..." class="quick-prompt" id="tavilyPrompt" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="openTavily()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Szukaj</button> <button class="action-btn secondary" onclick="window.open('/tavily-search', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Otwórz</button> </div> <div id="tavily-result" class="mt-4 p-2 border border-edge rounded-md text-xs bg-black bg-opacity-20 h-32 overflow-y-auto font-mono hidden" data-astro-cid-j7pv25f6> <!-- Wyniki z Tavily pojawią się tutaj --> </div> </div> <!-- STATUS WORKERS - Basic Opening Element --> <div class="worker-card" data-worker="status" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
🔧 STATUS WORKERS
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Zaawansowany system monitorowania statusu wszystkich Cloudflare
              Workers
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Real-time</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Monitoring</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Analytics</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="checkAllStatus()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Sprawdź Status</button> <button class="action-btn secondary" onclick="window.open('/status-workers', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Otwórz Dashboard</button> </div> </div> <!-- Advanced Marketing Content Generator --> <div class="worker-card" data-worker="marketing-generator" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
📢 MARKETING CONTENT AI
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Zaawansowany generator treści marketingowych z AI - posty, reklamy, kampanie
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>AI Content</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Multi-Format</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>SEO Optimized</span> </div> <!-- Marketing Content Type Selection --> <div class="marketing-controls mt-4 hidden" id="marketing-controls" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <select id="marketingType" class="marketing-select mb-3" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <option value="social-post" data-astro-cid-j7pv25f6>Post Social Media</option> <option value="blog-article" data-astro-cid-j7pv25f6>Artykuł Blog</option> <option value="email-campaign" data-astro-cid-j7pv25f6>Kampania Email</option> <option value="ad-copy" data-astro-cid-j7pv25f6>Treść Reklamy</option> <option value="product-description" data-astro-cid-j7pv25f6>Opis Produktu</option> <option value="press-release" data-astro-cid-j7pv25f6>Komunikat Prasowy</option> <option value="seo-content" data-astro-cid-j7pv25f6>Treść SEO</option> <option value="video-script" data-astro-cid-j7pv25f6>Skrypt Wideo</option> </select> <!-- Target Audience --> <select id="targetAudience" class="marketing-select mb-3" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <option value="general" data-astro-cid-j7pv25f6>Ogólna Publiczność</option> <option value="business" data-astro-cid-j7pv25f6>B2B - Biznes</option> <option value="consumers" data-astro-cid-j7pv25f6>B2C - Konsumenci</option> <option value="young" data-astro-cid-j7pv25f6>Młodzi 18-25</option> <option value="adults" data-astro-cid-j7pv25f6>Dorośli 26-45</option> <option value="seniors" data-astro-cid-j7pv25f6>Seniorzy 45+</option> <option value="tech" data-astro-cid-j7pv25f6>Tech Enthusiasts</option> <option value="parents" data-astro-cid-j7pv25f6>Rodzice</option> </select> <!-- Tone Selection --> <select id="marketingTone" class="marketing-select mb-3" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <option value="professional" data-astro-cid-j7pv25f6>Profesjonalny</option> <option value="friendly" data-astro-cid-j7pv25f6>Przyjazny</option> <option value="enthusiastic" data-astro-cid-j7pv25f6>Entuzjastyczny</option> <option value="urgent" data-astro-cid-j7pv25f6>Pilny/Promocyjny</option> <option value="educational" data-astro-cid-j7pv25f6>Edukacyjny</option> <option value="humorous" data-astro-cid-j7pv25f6>Z Humorem</option> <option value="emotional" data-astro-cid-j7pv25f6>Emocjonalny</option> <option value="authoritative" data-astro-cid-j7pv25f6>Autorytatywny</option> </select> <!-- Main Input --> <textarea id="marketingPrompt" placeholder="Opisz produkt/usługę, kluczowe korzyści, cel kampanii..." class="marketing-textarea mb-3" rows="3" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6></textarea> <!-- Advanced Options --> <div class="advanced-options mb-3" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" id="marketingKeywords" placeholder="Słowa kluczowe SEO (opcjonalnie)" class="marketing-input mb-2" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" id="marketingCTA" placeholder="Call to Action (np. 'Kup teraz', 'Dowiedz się więcej')" class="marketing-input mb-2" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="number" id="marketingLength" placeholder="Docelowa długość (słowa)" min="50" max="2000" class="marketing-input mb-2" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="worker-btn" onclick="generateMarketingContent()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
✨ Generuj Treść
</button> </div> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="toggleMarketingPanel()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🎯 Marketing AI</button> <button class="action-btn secondary" onclick="openMarketingDashboard()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>📊 Dashboard</button> </div> <div id="marketing-result" class="mt-4 p-3 border border-gray-300 rounded-md text-sm bg-gradient-to-br from-blue-50 to-purple-50 min-h-32 overflow-y-auto hidden" data-astro-cid-j7pv25f6> <!-- Wygenerowana treść marketingowa pojawi się tutaj --> </div> </div> <!-- API Testing Card --> <div class="worker-card" data-worker="api-tests" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🧪 API Tests</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Testuj wszystkie Workers API endpoints i sprawdź połączenia
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Testing</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>API</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Debug</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="runAllAPITests()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Testuj wszystkie API</button> <button class="action-btn secondary" onclick="openAPITestConsole()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Konsola testów</button> </div> </div> <!-- Flowise AI Card --> <div class="worker-card" data-worker="flowise" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🧠 Flowise AI</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Visual AI workflow builder with drag-and-drop interface
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Visual Builder</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Workflows</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Integration</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="window.open('https://flowise.ai', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Open Flowise</button> <button class="action-btn secondary" onclick="launchFlowise()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Launch</button> </div> </div> <!-- Activepieces Card --> <div class="worker-card" data-worker="activepieces" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
⚡ Activepieces
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Open-source automation platform for workflow automation
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Automation</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Open Source</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Workflows</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="window.open('https://activepieces.com', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Open Activepieces</button> <button class="action-btn secondary" onclick="launchActivepieces()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Launch</button> </div> </div> </div> <!-- 9 New Functions Grid --> <div class="additional-functions-section" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="additional-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
ZAAWANSOWANE FUNKCJE AI
</h3> <div class="additional-grid" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <!-- Row 1 --> <div class="feature-tile" data-function="function2" onclick="openFunction('rekomendacje')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🎯</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Personalizowane rekomendacje
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
System rekomendacyjny produktów i usług z analizą preferencji
                użytkowników
</div> </div> <div class="feature-tile" data-function="function3" onclick="openFunction('obsługa-klienta')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>📞</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Automatyzacja obsługi klienta
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
AI do kwalifikacji leadów i automatycznych odpowiedzi z
                integracją CRM
</div> </div> <div class="feature-tile" data-function="function4" onclick="openFunction('monitorowanie')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>📊</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Monitorowanie i raportowanie
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Dashboard z automatycznym generowaniem raportów i alertami o
                anomaliach
</div> </div> <!-- Row 2 --> <div class="feature-tile" data-function="function6" onclick="openFunction('przypomnienia')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🔔</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Harmonogramowanie i przypomnienia
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Inteligentny system przypomnień z integracją z kalendarzami i AI
                przewidywaniem
</div> </div> <div class="feature-tile" data-function="function7" onclick="openFunction('faq-generator')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>❓</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Generator FAQ dynamiczny
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
AI generujący dynamicznie pytania i odpowiedzi na podstawie bazy
                wiedzy
</div> </div> <div class="feature-tile" data-function="function8" onclick="openFunction('edukacja')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>📚</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Rekomendacje edukacyjne
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
System rekomendacji kursów i materiałów edukacyjnych z
                profilowaniem użytkownika
</div> </div> <!-- Row 3 --> <div class="feature-tile" data-function="function9" onclick="openFunction('tickety')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🎫</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
System ticketów AI
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Automatyczna klasyfikacja zgłoszeń z integracją Jira/Zendesk
</div> </div> <div class="feature-tile" data-function="quiz" onclick="openFunction('quizy')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🧠</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Quizy i testy interaktywne
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Framework do tworzenia quizów z AI oceną i spersonalizowanym
                feedbackiem
</div> </div> <div class="feature-tile" data-function="marketing" onclick="openFunction('marketing')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>✍️</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Generator treści marketingowych
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Automatyczne generowanie i publikacja treści marketingowych
                przez AI
</div> </div> </div> </div> </div> </section> </main>  <div class="right-panel-fixed" data-astro-cid-j7pv25f6> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="toggleMusicPlayer()" class="right-btn" id="musicPlayerBtn" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:music", "data-astro-cid-j7pv25f6": true })} MUSIC PLAYER
</button> <div id="musicPlayerWidget" class="floating-widget hidden" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "BackgroundMusicPlayerSimple", BackgroundMusicPlayerSimple, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/BackgroundMusicPlayerSimple.svelte", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> </div> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="toggleVoiceAssistant()" class="right-btn" id="voiceAssistantBtn" title="POLACZEK Voice Assistant - AI głosowy asystent BONZO" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:mic", "data-astro-cid-j7pv25f6": true })} POLACZEK VOICE
</button> <div id="voiceAssistantWidget" class="floating-widget hidden" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "VoiceAssistantPolaczek", VoiceAssistantPolaczek, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/VoiceAssistantPolaczek.tsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> </div> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="togglePolaczekAssistant()" class="right-btn" id="polaczekBtn" title="AI Assistant do wyjaśniania funkcji na stronie" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:bot", "data-astro-cid-j7pv25f6": true })} AI ASSISTANT
</button> <div id="polaczekWidget" class="floating-widget hidden" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "AiHelpAssistant", AiHelpAssistant, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/AiHelpAssistant.svelte", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> </div> <button onclick="openMainChat()" class="right-btn" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:message-circle", "data-astro-cid-j7pv25f6": true })} MAIN CHAT </button> <button onclick="openRefresh()" class="right-btn" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:refresh-cw", "data-astro-cid-j7pv25f6": true })} REFRESH </button> <button onclick="openFolder()" class="right-btn" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:folder", "data-astro-cid-j7pv25f6": true })} FOLDER </button> <button onclick="openClose()" class="right-btn" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:x", "data-astro-cid-j7pv25f6": true })} CLOSE </button> </div>  <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="py-1" data-astro-cid-j7pv25f6></div> </div> </section>  <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="flex flex-row justify-between items-center py-16 px-8" data-astro-cid-j7pv25f6> <!-- Left corner - O_MNIE content --> <div class="max-w-xs text-left" data-astro-cid-j7pv25f6> <div class="text-edge text-sm italic" style="
              transform: scale(1.69);
              transform-origin: left center;
              margin: 10px;
              margin-left: -10px;
              margin-bottom: 70px;
              width: calc(45vw - 20px);
              max-width: 320px;
              line-height: 1.4;
              word-wrap: break-word;
              hyphens: auto;
            " data-astro-cid-j7pv25f6>
W mojej pracy skupiam się na integracji technologii w chmurze,
            nowoczesnych frameworków i AI, aby stworzyć asystenta, który rozumie
            i wspiera użytkownika w jego potrzebach.
</div> </div> <div class="flex flex-row justify-center gap-8 text-center" data-astro-cid-j7pv25f6> <a class="hover:brightness-125 duration-200" target="_blank" rel="noopener noreferrer" href="/workers" data-astro-cid-j7pv25f6>
SYSTEM AGENTS
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j7pv25f6></path> </svg> </a> <div class="group w-24 p-1 border border-primary-foreground rounded-interactive text-primary-foreground text-xs font-black text-nowrap opacity-60" data-astro-cid-j7pv25f6> <span class="group-hover:hidden" data-astro-cid-j7pv25f6>100% HANDMADE</span> <span class="hidden group-hover:inline" data-astro-cid-j7pv25f6>0% AI</span> </div> </div> </div> </div> </section>  <div class="admin-panel-fixed" data-astro-cid-j7pv25f6> <a href="/admin/" class="admin-btn" data-astro-cid-j7pv25f6> Panel Administracyjny </a> <!-- Login Section Below Admin Panel --> <div class="login-container-fixed" id="loginContainer" data-astro-cid-j7pv25f6> <input type="text" id="dashboardLogin" maxlength="16" placeholder="Podaj login" class="login-input-fixed" data-astro-cid-j7pv25f6> <button onclick="checkDashboardLogin()" class="login-btn-fixed" data-astro-cid-j7pv25f6>
Zaloguj się
</button> </div> </div> ` }), renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/index.astro?astro&type=script&index=1&lang.ts"));
}, "Q:/mybonzo/luc-de-zen-on/src/pages/index.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
