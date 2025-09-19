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
import { d as renderers, K as createExports } from './chunks/vendor_BHZTJLV0.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_V1ts-lJS.mjs';
import { manifest } from './manifest_DsyrUFYU.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/ai-chat.astro.mjs');
const _page2 = () => import('./pages/admin/ai-models.astro.mjs');
const _page3 = () => import('./pages/admin/dashboard.astro.mjs');
const _page4 = () => import('./pages/admin/login.astro.mjs');
const _page5 = () => import('./pages/admin/monitoring.astro.mjs');
const _page6 = () => import('./pages/admin/security.astro.mjs');
const _page7 = () => import('./pages/admin/test.astro.mjs');
const _page8 = () => import('./pages/admin/users.astro.mjs');
const _page9 = () => import('./pages/admin.astro.mjs');
const _page10 = () => import('./pages/agent-builder-23.astro.mjs');
const _page11 = () => import('./pages/agent-dashboard.astro.mjs');
const _page12 = () => import('./pages/agents/_agentid_.astro.mjs');
const _page13 = () => import('./pages/agents.astro.mjs');
const _page14 = () => import('./pages/agents-new.astro.mjs');
const _page15 = () => import('./pages/ai-agent-chat.astro.mjs');
const _page16 = () => import('./pages/ai-functions/ai-tickets.astro.mjs');
const _page17 = () => import('./pages/ai-functions/customer-automation.astro.mjs');
const _page18 = () => import('./pages/ai-functions/dynamic-faq.astro.mjs');
const _page19 = () => import('./pages/ai-functions/education-recommendations.astro.mjs');
const _page20 = () => import('./pages/ai-functions/interactive-quizzes.astro.mjs');
const _page21 = () => import('./pages/ai-functions/marketing-content.astro.mjs');
const _page22 = () => import('./pages/ai-functions/personalized-recommendations.astro.mjs');
const _page23 = () => import('./pages/ai-functions/reminders-calendar.astro.mjs');
const _page24 = () => import('./pages/ai-workers-manager.astro.mjs');
const _page25 = () => import('./pages/animations-showcase.astro.mjs');
const _page26 = () => import('./pages/api/activity-monitor.astro.mjs');
const _page27 = () => import('./pages/api/admin/alerts.astro.mjs');
const _page28 = () => import('./pages/api/admin/analytics.astro.mjs');
const _page29 = () => import('./pages/api/admin/auth.astro.mjs');
const _page30 = () => import('./pages/api/admin/backup.astro.mjs');
const _page31 = () => import('./pages/api/admin/chat.astro.mjs');
const _page32 = () => import('./pages/api/admin/control.astro.mjs');
const _page33 = () => import('./pages/api/admin/deploy.astro.mjs');
const _page34 = () => import('./pages/api/admin/logs.astro.mjs');
const _page35 = () => import('./pages/api/admin/monitoring.astro.mjs');
const _page36 = () => import('./pages/api/admin/queries.astro.mjs');
const _page37 = () => import('./pages/api/admin/stats.astro.mjs');
const _page38 = () => import('./pages/api/admin/status.astro.mjs');
const _page39 = () => import('./pages/api/admin/users.astro.mjs');
const _page40 = () => import('./pages/api/admin/workers.astro.mjs');
const _page41 = () => import('./pages/api/admin/workers-status.astro.mjs');
const _page42 = () => import('./pages/api/agent.astro.mjs');
const _page43 = () => import('./pages/api/agents/create.astro.mjs');
const _page44 = () => import('./pages/api/agents/list.astro.mjs');
const _page45 = () => import('./pages/api/agents/manage.astro.mjs');
const _page46 = () => import('./pages/api/agents/mybonzo.astro.mjs');
const _page47 = () => import('./pages/api/agents/stats.astro.mjs');
const _page48 = () => import('./pages/api/agents/_agentid_/chat.astro.mjs');
const _page49 = () => import('./pages/api/agents/_agentid_/image.astro.mjs');
const _page50 = () => import('./pages/api/agents/_agentid_/status.astro.mjs');
const _page51 = () => import('./pages/api/agents/_agentid_/task.astro.mjs');
const _page52 = () => import('./pages/api/agents/_id_.astro.mjs');
const _page53 = () => import('./pages/api/agents.astro.mjs');
const _page54 = () => import('./pages/api/ai-agent-s.astro.mjs');
const _page55 = () => import('./pages/api/ai-bot-worker.astro.mjs');
const _page56 = () => import('./pages/api/ai-workers.astro.mjs');
const _page57 = () => import('./pages/api/auth/status.astro.mjs');
const _page58 = () => import('./pages/api/bielik.astro.mjs');
const _page59 = () => import('./pages/api/bielik-analytics.astro.mjs');
const _page60 = () => import('./pages/api/bielik-chat.astro.mjs');
const _page61 = () => import('./pages/api/bigquery.astro.mjs');
const _page62 = () => import('./pages/api/calendar.astro.mjs');
const _page63 = () => import('./pages/api/chat.astro.mjs');
const _page64 = () => import('./pages/api/data-analyze.astro.mjs');
const _page65 = () => import('./pages/api/debug-env.astro.mjs');
const _page66 = () => import('./pages/api/deepseek-search.astro.mjs');
const _page67 = () => import('./pages/api/education-recommendations.astro.mjs');
const _page68 = () => import('./pages/api/enhance-prompt.astro.mjs');
const _page69 = () => import('./pages/api/enhanced-ai.astro.mjs');
const _page70 = () => import('./pages/api/errors.astro.mjs');
const _page71 = () => import('./pages/api/faq.astro.mjs');
const _page72 = () => import('./pages/api/faq-generator.astro.mjs');
const _page73 = () => import('./pages/api/flowise.astro.mjs');
const _page74 = () => import('./pages/api/gemma-polish.astro.mjs');
const _page75 = () => import('./pages/api/generate-hf.astro.mjs');
const _page76 = () => import('./pages/api/generate-image.astro.mjs');
const _page77 = () => import('./pages/api/generate-image-modern.astro.mjs');
const _page78 = () => import('./pages/api/generate-marketing-content.astro.mjs');
const _page79 = () => import('./pages/api/generic-chat.astro.mjs');
const _page80 = () => import('./pages/api/get-recommendations.astro.mjs');
const _page81 = () => import('./pages/api/health.astro.mjs');
const _page82 = () => import('./pages/api/images/_id_.astro.mjs');
const _page83 = () => import('./pages/api/kaggle.astro.mjs');
const _page84 = () => import('./pages/api/kaggle-new.astro.mjs');
const _page85 = () => import('./pages/api/learning.astro.mjs');
const _page86 = () => import('./pages/api/llama-polish.astro.mjs');
const _page87 = () => import('./pages/api/main-chat.astro.mjs');
const _page88 = () => import('./pages/api/mistral-polish.astro.mjs');
const _page89 = () => import('./pages/api/my-secrets.astro.mjs');
const _page90 = () => import('./pages/api/mybonzo-chat.astro.mjs');
const _page91 = () => import('./pages/api/payment/create-session.astro.mjs');
const _page92 = () => import('./pages/api/photo-to-photo.astro.mjs');
const _page93 = () => import('./pages/api/polaczek-chat.astro.mjs');
const _page94 = () => import('./pages/api/polaczek-sys-t.astro.mjs');
const _page95 = () => import('./pages/api/qualify-lead.astro.mjs');
const _page96 = () => import('./pages/api/quiz.astro.mjs');
const _page97 = () => import('./pages/api/quiz-feedback.astro.mjs');
const _page98 = () => import('./pages/api/qwen-polish.astro.mjs');
const _page99 = () => import('./pages/api/reminders.astro.mjs');
const _page100 = () => import('./pages/api/search.astro.mjs');
const _page101 = () => import('./pages/api/send-report.astro.mjs');
const _page102 = () => import('./pages/api/tavi.astro.mjs');
const _page103 = () => import('./pages/api/tavi-new.astro.mjs');
const _page104 = () => import('./pages/api/tickets.astro.mjs');
const _page105 = () => import('./pages/api/translate.astro.mjs');
const _page106 = () => import('./pages/api/usage-stats.astro.mjs');
const _page107 = () => import('./pages/api/voice-ai/websocket.astro.mjs');
const _page108 = () => import('./pages/api/voice-handler.astro.mjs');
const _page109 = () => import('./pages/api/wildcards.astro.mjs');
const _page110 = () => import('./pages/api/workers/status.astro.mjs');
const _page111 = () => import('./pages/api/workers-status.astro.mjs');
const _page112 = () => import('./pages/api-demo.astro.mjs');
const _page113 = () => import('./pages/bielik-enon-dev-new.astro.mjs');
const _page114 = () => import('./pages/bigquery-analytics.astro.mjs');
const _page115 = () => import('./pages/chat/_agentid_.astro.mjs');
const _page116 = () => import('./pages/chatbot.astro.mjs');
const _page117 = () => import('./pages/control-panel.astro.mjs');
const _page118 = () => import('./pages/dashboard.astro.mjs');
const _page119 = () => import('./pages/dashboard-new.astro.mjs');
const _page120 = () => import('./pages/deployment-test.astro.mjs');
const _page121 = () => import('./pages/generator.astro.mjs');
const _page122 = () => import('./pages/hub/ai-agent-s.astro.mjs');
const _page123 = () => import('./pages/hub/bigquery.astro.mjs');
const _page124 = () => import('./pages/hub/chatbot.astro.mjs');
const _page125 = () => import('./pages/hub/functions/1.astro.mjs');
const _page126 = () => import('./pages/hub/functions/2.astro.mjs');
const _page127 = () => import('./pages/hub/functions/3.astro.mjs');
const _page128 = () => import('./pages/hub/functions.astro.mjs');
const _page129 = () => import('./pages/hub/generator.astro.mjs');
const _page130 = () => import('./pages/hub/kaggle.astro.mjs');
const _page131 = () => import('./pages/hub/polaczek-sys-t.astro.mjs');
const _page132 = () => import('./pages/hub/status.astro.mjs');
const _page133 = () => import('./pages/hub/tavily.astro.mjs');
const _page134 = () => import('./pages/hub.astro.mjs');
const _page135 = () => import('./pages/image-generator.astro.mjs');
const _page136 = () => import('./pages/index_clean_backup.astro.mjs');
const _page137 = () => import('./pages/kaggle-datasets.astro.mjs');
const _page138 = () => import('./pages/klf-sheed-shop.astro.mjs');
const _page139 = () => import('./pages/login.astro.mjs');
const _page140 = () => import('./pages/mybonzo.astro.mjs');
const _page141 = () => import('./pages/payment-simulator.astro.mjs');
const _page142 = () => import('./pages/polaczek_agent_sys_23/agent-data-simple.astro.mjs');
const _page143 = () => import('./pages/polaczek_agent_sys_23/agent-data1.astro.mjs');
const _page144 = () => import('./pages/polaczek_agent_sys_23/agents/create.astro.mjs');
const _page145 = () => import('./pages/polaczek_agent_sys_23/api/agents/control.astro.mjs');
const _page146 = () => import('./pages/polaczek_agent_sys_23/api/agents/create.astro.mjs');
const _page147 = () => import('./pages/polaczek_agent_sys_23/api/agents/list.astro.mjs');
const _page148 = () => import('./pages/polaczek_agent_sys_23/api/agents/list-backup.astro.mjs');
const _page149 = () => import('./pages/polaczek_agent_sys_23/api/chat.astro.mjs');
const _page150 = () => import('./pages/polaczek_agent_sys_23/api-keys.astro.mjs');
const _page151 = () => import('./pages/polaczek_agent_sys_23/dashboard.astro.mjs');
const _page152 = () => import('./pages/polaczek_agent_sys_23/dashboard-backup.astro.mjs');
const _page153 = () => import('./pages/polaczek_agent_sys_23/readme.astro.mjs');
const _page154 = () => import('./pages/polaczek_agent_sys_23.astro.mjs');
const _page155 = () => import('./pages/polaczek-agents-system.astro.mjs');
const _page156 = () => import('./pages/posts/_---slug_.astro.mjs');
const _page157 = () => import('./pages/prompt-enhancer.astro.mjs');
const _page158 = () => import('./pages/quiz.astro.mjs');
const _page159 = () => import('./pages/quiz-new.astro.mjs');
const _page160 = () => import('./pages/real-agent-creator.astro.mjs');
const _page161 = () => import('./pages/robots.txt.astro.mjs');
const _page162 = () => import('./pages/rss.xml.astro.mjs');
const _page163 = () => import('./pages/stable-diffusion.astro.mjs');
const _page164 = () => import('./pages/status-workers.astro.mjs');
const _page165 = () => import('./pages/streamline-icons-demo.astro.mjs');
const _page166 = () => import('./pages/tavily-search.astro.mjs');
const _page167 = () => import('./pages/test-agent.astro.mjs');
const _page168 = () => import('./pages/voice-avatar-new.astro.mjs');
const _page169 = () => import('./pages/wildcards.astro.mjs');
const _page170 = () => import('./pages/workers-status.astro.mjs');
const _page171 = () => import('./pages/workers-status-test.astro.mjs');
const _page172 = () => import('./pages/zaawansowane-funkcje-ai.astro.mjs');
const _page173 = () => import('./pages/zaawansowane-funkcje-ai-new.astro.mjs');
const _page174 = () => import('./pages/zenon-mcp-server.astro.mjs');
const _page175 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/@astrojs+cloudflare@12.6.8__f3c413a8f7b3b4e6c173dc4a2447504e/node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/admin/ai-chat.astro", _page1],
    ["src/pages/admin/ai-models.astro", _page2],
    ["src/pages/admin/dashboard.astro", _page3],
    ["src/pages/admin/login.astro", _page4],
    ["src/pages/admin/monitoring.astro", _page5],
    ["src/pages/admin/security.astro", _page6],
    ["src/pages/admin/test.astro", _page7],
    ["src/pages/admin/users.astro", _page8],
    ["src/pages/admin/index.astro", _page9],
    ["src/pages/agent-builder-23.astro", _page10],
    ["src/pages/agent-dashboard.astro", _page11],
    ["src/pages/agents/[agentId].astro", _page12],
    ["src/pages/agents/index.astro", _page13],
    ["src/pages/agents-new.astro", _page14],
    ["src/pages/ai-agent-chat.astro", _page15],
    ["src/pages/ai-functions/ai-tickets.astro", _page16],
    ["src/pages/ai-functions/customer-automation.astro", _page17],
    ["src/pages/ai-functions/dynamic-faq.astro", _page18],
    ["src/pages/ai-functions/education-recommendations.astro", _page19],
    ["src/pages/ai-functions/interactive-quizzes.astro", _page20],
    ["src/pages/ai-functions/marketing-content.astro", _page21],
    ["src/pages/ai-functions/personalized-recommendations.astro", _page22],
    ["src/pages/ai-functions/reminders-calendar.astro", _page23],
    ["src/pages/ai-workers-manager.astro", _page24],
    ["src/pages/animations-showcase.astro", _page25],
    ["src/pages/api/activity-monitor.ts", _page26],
    ["src/pages/api/admin/alerts.ts", _page27],
    ["src/pages/api/admin/analytics.ts", _page28],
    ["src/pages/api/admin/auth.ts", _page29],
    ["src/pages/api/admin/backup.ts", _page30],
    ["src/pages/api/admin/chat.ts", _page31],
    ["src/pages/api/admin/control.ts", _page32],
    ["src/pages/api/admin/deploy.ts", _page33],
    ["src/pages/api/admin/logs.ts", _page34],
    ["src/pages/api/admin/monitoring.ts", _page35],
    ["src/pages/api/admin/queries.ts", _page36],
    ["src/pages/api/admin/stats.ts", _page37],
    ["src/pages/api/admin/status.ts", _page38],
    ["src/pages/api/admin/users.ts", _page39],
    ["src/pages/api/admin/workers.ts", _page40],
    ["src/pages/api/admin/workers-status.ts", _page41],
    ["src/pages/api/agent.ts", _page42],
    ["src/pages/api/agents/create.ts", _page43],
    ["src/pages/api/agents/list.ts", _page44],
    ["src/pages/api/agents/manage.ts", _page45],
    ["src/pages/api/agents/mybonzo.ts", _page46],
    ["src/pages/api/agents/stats.ts", _page47],
    ["src/pages/api/agents/[agentId]/chat.ts", _page48],
    ["src/pages/api/agents/[agentId]/image.ts", _page49],
    ["src/pages/api/agents/[agentId]/status.ts", _page50],
    ["src/pages/api/agents/[agentId]/task.ts", _page51],
    ["src/pages/api/agents/[id].ts", _page52],
    ["src/pages/api/agents.ts", _page53],
    ["src/pages/api/ai-agent-s.astro", _page54],
    ["src/pages/api/ai-bot-worker.ts", _page55],
    ["src/pages/api/ai-workers.ts", _page56],
    ["src/pages/api/auth/status.ts", _page57],
    ["src/pages/api/bielik.ts", _page58],
    ["src/pages/api/bielik-analytics.ts", _page59],
    ["src/pages/api/bielik-chat.ts", _page60],
    ["src/pages/api/bigquery.ts", _page61],
    ["src/pages/api/calendar.ts", _page62],
    ["src/pages/api/chat.ts", _page63],
    ["src/pages/api/data-analyze.ts", _page64],
    ["src/pages/api/debug-env.ts", _page65],
    ["src/pages/api/deepseek-search.astro", _page66],
    ["src/pages/api/education-recommendations.ts", _page67],
    ["src/pages/api/enhance-prompt.ts", _page68],
    ["src/pages/api/enhanced-ai.astro", _page69],
    ["src/pages/api/errors.ts", _page70],
    ["src/pages/api/faq.ts", _page71],
    ["src/pages/api/faq-generator.ts", _page72],
    ["src/pages/api/flowise.ts", _page73],
    ["src/pages/api/gemma-polish.ts", _page74],
    ["src/pages/api/generate-hf.ts", _page75],
    ["src/pages/api/generate-image.ts", _page76],
    ["src/pages/api/generate-image-modern.ts", _page77],
    ["src/pages/api/generate-marketing-content.ts", _page78],
    ["src/pages/api/generic-chat.ts", _page79],
    ["src/pages/api/get-recommendations.ts", _page80],
    ["src/pages/api/health.ts", _page81],
    ["src/pages/api/images/[id].ts", _page82],
    ["src/pages/api/kaggle.ts", _page83],
    ["src/pages/api/kaggle-new.ts", _page84],
    ["src/pages/api/learning.ts", _page85],
    ["src/pages/api/llama-polish.ts", _page86],
    ["src/pages/api/main-chat.astro", _page87],
    ["src/pages/api/mistral-polish.ts", _page88],
    ["src/pages/api/my-secrets.ts", _page89],
    ["src/pages/api/mybonzo-chat.ts", _page90],
    ["src/pages/api/payment/create-session.ts", _page91],
    ["src/pages/api/photo-to-photo.ts", _page92],
    ["src/pages/api/polaczek-chat.ts", _page93],
    ["src/pages/api/polaczek-sys-t.astro", _page94],
    ["src/pages/api/qualify-lead.ts", _page95],
    ["src/pages/api/quiz.ts", _page96],
    ["src/pages/api/quiz-feedback.ts", _page97],
    ["src/pages/api/qwen-polish.ts", _page98],
    ["src/pages/api/reminders.ts", _page99],
    ["src/pages/api/search.ts", _page100],
    ["src/pages/api/send-report.ts", _page101],
    ["src/pages/api/tavi.ts", _page102],
    ["src/pages/api/tavi-new.ts", _page103],
    ["src/pages/api/tickets.ts", _page104],
    ["src/pages/api/translate.ts", _page105],
    ["src/pages/api/usage-stats.ts", _page106],
    ["src/pages/api/voice-ai/websocket.ts", _page107],
    ["src/pages/api/voice-handler.ts", _page108],
    ["src/pages/api/wildcards.ts", _page109],
    ["src/pages/api/workers/status.ts", _page110],
    ["src/pages/api/workers-status.ts", _page111],
    ["src/pages/api-demo.astro", _page112],
    ["src/pages/bielik-enon-dev-new.astro", _page113],
    ["src/pages/bigquery-analytics.astro", _page114],
    ["src/pages/chat/[agentId].astro", _page115],
    ["src/pages/chatbot.astro", _page116],
    ["src/pages/control-panel.astro", _page117],
    ["src/pages/dashboard.astro", _page118],
    ["src/pages/dashboard-new.astro", _page119],
    ["src/pages/deployment-test.astro", _page120],
    ["src/pages/generator.astro", _page121],
    ["src/pages/hub/ai-agent-s.astro", _page122],
    ["src/pages/hub/bigquery.astro", _page123],
    ["src/pages/hub/chatbot.astro", _page124],
    ["src/pages/hub/functions/1.astro", _page125],
    ["src/pages/hub/functions/2.astro", _page126],
    ["src/pages/hub/functions/3.astro", _page127],
    ["src/pages/hub/functions/index.astro", _page128],
    ["src/pages/hub/generator.astro", _page129],
    ["src/pages/hub/kaggle.astro", _page130],
    ["src/pages/hub/polaczek-sys-t.astro", _page131],
    ["src/pages/hub/status.astro", _page132],
    ["src/pages/hub/tavily.astro", _page133],
    ["src/pages/hub/index.astro", _page134],
    ["src/pages/image-generator.astro", _page135],
    ["src/pages/index_clean_backup.astro", _page136],
    ["src/pages/kaggle-datasets.astro", _page137],
    ["src/pages/klf-sheed-shop.astro", _page138],
    ["src/pages/login.astro", _page139],
    ["src/pages/mybonzo.astro", _page140],
    ["src/pages/payment-simulator.astro", _page141],
    ["src/pages/POLACZEK_AGENT_SYS_23/agent-data-simple.astro", _page142],
    ["src/pages/POLACZEK_AGENT_SYS_23/agent-data1.astro", _page143],
    ["src/pages/POLACZEK_AGENT_SYS_23/agents/create.astro", _page144],
    ["src/pages/POLACZEK_AGENT_SYS_23/api/agents/control.ts", _page145],
    ["src/pages/POLACZEK_AGENT_SYS_23/api/agents/create.ts", _page146],
    ["src/pages/POLACZEK_AGENT_SYS_23/api/agents/list.ts", _page147],
    ["src/pages/POLACZEK_AGENT_SYS_23/api/agents/list-backup.ts", _page148],
    ["src/pages/POLACZEK_AGENT_SYS_23/api/chat.ts", _page149],
    ["src/pages/POLACZEK_AGENT_SYS_23/api-keys.astro", _page150],
    ["src/pages/POLACZEK_AGENT_SYS_23/dashboard.astro", _page151],
    ["src/pages/POLACZEK_AGENT_SYS_23/dashboard-backup.astro", _page152],
    ["src/pages/POLACZEK_AGENT_SYS_23/README.md", _page153],
    ["src/pages/POLACZEK_AGENT_SYS_23/index.astro", _page154],
    ["src/pages/polaczek-agents-system.astro", _page155],
    ["src/pages/posts/[...slug].astro", _page156],
    ["src/pages/prompt-enhancer.astro", _page157],
    ["src/pages/quiz.astro", _page158],
    ["src/pages/quiz-new.astro", _page159],
    ["src/pages/real-agent-creator.astro", _page160],
    ["src/pages/robots.txt.ts", _page161],
    ["src/pages/rss.xml.js", _page162],
    ["src/pages/stable-diffusion.astro", _page163],
    ["src/pages/status-workers.astro", _page164],
    ["src/pages/streamline-icons-demo.astro", _page165],
    ["src/pages/tavily-search.astro", _page166],
    ["src/pages/test-agent.astro", _page167],
    ["src/pages/voice-avatar-new.astro", _page168],
    ["src/pages/wildcards.astro", _page169],
    ["src/pages/workers-status.astro", _page170],
    ["src/pages/workers-status-test.astro", _page171],
    ["src/pages/zaawansowane-funkcje-ai.astro", _page172],
    ["src/pages/zaawansowane-funkcje-ai-new.astro", _page173],
    ["src/pages/zenon-mcp-server.astro", _page174],
    ["src/pages/index.astro", _page175]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
