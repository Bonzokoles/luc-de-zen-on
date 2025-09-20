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
/* empty css                                     */
import { c as createComponent, a as renderTemplate } from '../../chunks/astro/server_xZvTY01m.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

async function POST({ request, locals }) {
  try {
    const body = await request.json();
    const { prompt, context } = body;
    if (locals?.runtime?.env?.AI) {
      const response = await locals.runtime.env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content: `You are AI_AGENT_S, an advanced AI system designed for complex reasoning and multi-step problem solving. 
            
Key capabilities:
- Deep analytical thinking
- Multi-step problem decomposition  
- Cross-domain knowledge synthesis
- Advanced reasoning and inference
- Creative solution generation
- Technical expertise across multiple fields

Always provide thorough, well-reasoned responses with clear step-by-step thinking.`
            },
            {
              role: "user",
              content: prompt
            }
          ]
        }
      );
      return new Response(
        JSON.stringify({
          success: true,
          response: response.response,
          agent: "AI_AGENT_S",
          capabilities: [
            "complex_reasoning",
            "multi_step_analysis",
            "cross_domain_synthesis",
            "technical_expertise",
            "creative_problem_solving"
          ]
        }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        response: `AI_AGENT_S analyzing: "${prompt}"

As an advanced AI system, I would approach this through:
1. Problem decomposition and analysis
2. Multi-perspective evaluation
3. Solution synthesis and optimization
4. Implementation strategy development

[This is a demo response - full AI capabilities require Cloudflare AI binding]`,
        agent: "AI_AGENT_S",
        status: "demo_mode"
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to process request"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
async function GET() {
  return new Response(
    JSON.stringify({
      agent: "AI_AGENT_S",
      status: "active",
      model: "@cf/meta/llama-3.1-8b-instruct",
      capabilities: [
        "complex_reasoning",
        "multi_step_analysis",
        "cross_domain_synthesis",
        "technical_expertise",
        "creative_problem_solving"
      ],
      description: "Advanced AI system for sophisticated reasoning and complex problem solving"
    }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
}
const $$AiAgentS = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/api/ai-agent-s.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/api/ai-agent-s.astro";
const $$url = "/api/ai-agent-s";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  default: $$AiAgentS,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
