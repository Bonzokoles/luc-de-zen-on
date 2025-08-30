/**
 * AI_AGENT_S - Advanced AI Agent System
 * Sophisticated AI agent for complex reasoning and multi-step tasks
 */

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (url.pathname === '/api/ai-agent-s' && request.method === 'POST') {
        const { prompt, context, agentId } = await request.json();
        
        // Use Cloudflare AI if available
        if (env.AI) {
          const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            messages: [
              {
                role: 'system',
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
                role: 'user',
                content: prompt
              }
            ]
          });

          // Store interaction in KV if available
          if (env.AGENTS) {
            const sessionId = `ai-agent-s-${Date.now()}`;
            await env.AGENTS.put(`session:${sessionId}`, JSON.stringify({
              agentId: 'ai-agent-s',
              prompt,
              response: response.response,
              timestamp: new Date().toISOString(),
              context
            }));
          }

          return new Response(JSON.stringify({
            success: true,
            response: response.response,
            agent: 'AI_AGENT_S',
            capabilities: [
              'complex_reasoning',
              'multi_step_analysis', 
              'cross_domain_synthesis',
              'technical_expertise',
              'creative_problem_solving'
            ]
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Fallback response
        return new Response(JSON.stringify({
          success: true,
          response: `AI_AGENT_S analyzing: "${prompt}"\n\nAs an advanced AI system, I would approach this through:\n1. Problem decomposition and analysis\n2. Multi-perspective evaluation\n3. Solution synthesis and optimization\n4. Implementation strategy development\n\n[This is a demo response - full AI capabilities require Cloudflare AI binding]`,
          agent: 'AI_AGENT_S',
          status: 'demo_mode'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/api/ai-agent-s/status' && request.method === 'GET') {
        return new Response(JSON.stringify({
          agent: 'AI_AGENT_S',
          status: 'active',
          model: '@cf/meta/llama-3.1-8b-instruct',
          capabilities: [
            'complex_reasoning',
            'multi_step_analysis',
            'cross_domain_synthesis', 
            'technical_expertise',
            'creative_problem_solving'
          ],
          description: 'Advanced AI system for sophisticated reasoning and complex problem solving'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
