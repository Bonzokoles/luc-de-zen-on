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
export { d as renderers } from '../../../chunks/vendor_DlPT8CWO.mjs';

const POST = async ({ request }) => {
  try {
    const { text, voice, audioConfig } = await request.json();
    if (!text) {
      return new Response(JSON.stringify({
        success: false,
        error: "Text parameter is required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const ttsConfig = {
      input: { text },
      voice: {
        languageCode: voice?.substring(0, 5) || "pl-PL",
        name: voice || "pl-PL-Wavenet-A",
        ssmlGender: "NEUTRAL"
      },
      audioConfig: {
        audioEncoding: audioConfig?.audioEncoding || "MP3",
        speakingRate: audioConfig?.speakingRate || 1,
        pitch: audioConfig?.pitch || 0,
        volumeGainDb: audioConfig?.volumeGainDb || 0,
        effectsProfileId: ["telephony-class-application"]
      }
    };
    return new Response(JSON.stringify({
      success: true,
      message: "Google Cloud TTS would generate audio here",
      config: ttsConfig,
      audioUrl: null,
      // Would contain actual audio blob URL
      fallbackToWebSpeech: true
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Google TTS API error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to generate speech with Google Cloud TTS",
      fallbackToWebSpeech: true
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
