globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderers } from './chunks/_@astro-renderers_CsfOuLCA.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BXtIHh9-.mjs';
import { manifest } from './manifest_C2s47Gzs.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/activity-monitoring/realtime.astro.mjs');
const _page2 = () => import('./pages/activity-monitoring.astro.mjs');
const _page3 = () => import('./pages/admin/ai-chat.astro.mjs');
const _page4 = () => import('./pages/admin/ai-models.astro.mjs');
const _page5 = () => import('./pages/admin/configuration.astro.mjs');
const _page6 = () => import('./pages/admin/dashboard.astro.mjs');
const _page7 = () => import('./pages/admin/login.astro.mjs');
const _page8 = () => import('./pages/admin/monitoring.astro.mjs');
const _page9 = () => import('./pages/admin/polish-mega-pro-admin.astro.mjs');
const _page10 = () => import('./pages/admin/security.astro.mjs');
const _page11 = () => import('./pages/admin/test.astro.mjs');
const _page12 = () => import('./pages/admin/users.astro.mjs');
const _page13 = () => import('./pages/admin.astro.mjs');
const _page14 = () => import('./pages/agent-builder-23.astro.mjs');
const _page15 = () => import('./pages/agent-dashboard.astro.mjs');
const _page16 = () => import('./pages/agents/_agentid_.astro.mjs');
const _page17 = () => import('./pages/agents.astro.mjs');
const _page18 = () => import('./pages/agents-new.astro.mjs');
const _page19 = () => import('./pages/ai-agent-chat.astro.mjs');
const _page20 = () => import('./pages/ai-functions/activity-monitoring.astro.mjs');
const _page21 = () => import('./pages/ai-functions/ai-tickets.astro.mjs');
const _page22 = () => import('./pages/ai-functions/customer-automation/crm.astro.mjs');
const _page23 = () => import('./pages/ai-functions/customer-automation/qualification.astro.mjs');
const _page24 = () => import('./pages/ai-functions/customer-automation/responses.astro.mjs');
const _page25 = () => import('./pages/ai-functions/customer-automation.astro.mjs');
const _page26 = () => import('./pages/ai-functions/dynamic-faq/generator.astro.mjs');
const _page27 = () => import('./pages/ai-functions/dynamic-faq.astro.mjs');
const _page28 = () => import('./pages/ai-functions/education-recommendations.astro.mjs');
const _page29 = () => import('./pages/ai-functions/interactive-quizzes.astro.mjs');
const _page30 = () => import('./pages/ai-functions/marketing-content/analytics.astro.mjs');
const _page31 = () => import('./pages/ai-functions/marketing-content/campaigns.astro.mjs');
const _page32 = () => import('./pages/ai-functions/marketing-content/maestro.astro.mjs');
const _page33 = () => import('./pages/ai-functions/marketing-content/templates.astro.mjs');
const _page34 = () => import('./pages/ai-functions/marketing-content.astro.mjs');
const _page35 = () => import('./pages/ai-functions/personalized-recommendations.astro.mjs');
const _page36 = () => import('./pages/ai-functions/reminders-calendar.astro.mjs');
const _page37 = () => import('./pages/ai-integrations-test.astro.mjs');
const _page38 = () => import('./pages/ai-tickets/dashboard.astro.mjs');
const _page39 = () => import('./pages/ai-tickets/new.astro.mjs');
const _page40 = () => import('./pages/ai-tickets.astro.mjs');
const _page41 = () => import('./pages/ai-workers-manager.astro.mjs');
const _page42 = () => import('./pages/analytics.astro.mjs');
const _page43 = () => import('./pages/animations-showcase.astro.mjs');
const _page44 = () => import('./pages/api/activepieces.astro.mjs');
const _page45 = () => import('./pages/api/activity-monitor.astro.mjs');
const _page46 = () => import('./pages/api/admin/alerts.astro.mjs');
const _page47 = () => import('./pages/api/admin/analytics.astro.mjs');
const _page48 = () => import('./pages/api/admin/auth.astro.mjs');
const _page49 = () => import('./pages/api/admin/backup.astro.mjs');
const _page50 = () => import('./pages/api/admin/chat.astro.mjs');
const _page51 = () => import('./pages/api/admin/control.astro.mjs');
const _page52 = () => import('./pages/api/admin/deploy.astro.mjs');
const _page53 = () => import('./pages/api/admin/logs.astro.mjs');
const _page54 = () => import('./pages/api/admin/monitoring.astro.mjs');
const _page55 = () => import('./pages/api/admin/queries.astro.mjs');
const _page56 = () => import('./pages/api/admin/stats.astro.mjs');
const _page57 = () => import('./pages/api/admin/status.astro.mjs');
const _page58 = () => import('./pages/api/admin/tickets.astro.mjs');
const _page59 = () => import('./pages/api/admin/users.astro.mjs');
const _page60 = () => import('./pages/api/admin/workers.astro.mjs');
const _page61 = () => import('./pages/api/admin/workers-status.astro.mjs');
const _page62 = () => import('./pages/api/agent.astro.mjs');
const _page63 = () => import('./pages/api/agents/create.astro.mjs');
const _page64 = () => import('./pages/api/agents/list.astro.mjs');
const _page65 = () => import('./pages/api/agents/manage.astro.mjs');
const _page66 = () => import('./pages/api/agents/mybonzo.astro.mjs');
const _page67 = () => import('./pages/api/agents/stats.astro.mjs');
const _page68 = () => import('./pages/api/agents/voice-command.astro.mjs');
const _page69 = () => import('./pages/api/agents/_agentid_/chat.astro.mjs');
const _page70 = () => import('./pages/api/agents/_agentid_/image.astro.mjs');
const _page71 = () => import('./pages/api/agents/_agentid_/status.astro.mjs');
const _page72 = () => import('./pages/api/agents/_agentid_/task.astro.mjs');
const _page73 = () => import('./pages/api/agents/_id_.astro.mjs');
const _page74 = () => import('./pages/api/agents.astro.mjs');
const _page75 = () => import('./pages/api/ai/advanced-chat.astro.mjs');
const _page76 = () => import('./pages/api/ai-agent-s.astro.mjs');
const _page77 = () => import('./pages/api/ai-bot-worker.astro.mjs');
const _page78 = () => import('./pages/api/ai-models/gemma.astro.mjs');
const _page79 = () => import('./pages/api/ai-models/openrouter.astro.mjs');
const _page80 = () => import('./pages/api/ai-models/snell.astro.mjs');
const _page81 = () => import('./pages/api/ai-models/stable-diffusion.astro.mjs');
const _page82 = () => import('./pages/api/ai-workers.astro.mjs');
const _page83 = () => import('./pages/api/analytics/prophet.astro.mjs');
const _page84 = () => import('./pages/api/analytics/visibility.astro.mjs');
const _page85 = () => import('./pages/api/api-list.astro.mjs');
const _page86 = () => import('./pages/api/auth/status.astro.mjs');
const _page87 = () => import('./pages/api/bielik.astro.mjs');
const _page88 = () => import('./pages/api/bielik-analytics.astro.mjs');
const _page89 = () => import('./pages/api/bielik-chat.astro.mjs');
const _page90 = () => import('./pages/api/bigquery/analytics.astro.mjs');
const _page91 = () => import('./pages/api/bigquery/reports.astro.mjs');
const _page92 = () => import('./pages/api/bigquery.astro.mjs');
const _page93 = () => import('./pages/api/calendar.astro.mjs');
const _page94 = () => import('./pages/api/chat.astro.mjs');
const _page95 = () => import('./pages/api/code-bison.astro.mjs');
const _page96 = () => import('./pages/api/data-analyze.astro.mjs');
const _page97 = () => import('./pages/api/data-collector.astro.mjs');
const _page98 = () => import('./pages/api/debug-env.astro.mjs');
const _page99 = () => import('./pages/api/deepseek-search.astro.mjs');
const _page100 = () => import('./pages/api/education-recommendations.astro.mjs');
const _page101 = () => import('./pages/api/enhance-prompt.astro.mjs');
const _page102 = () => import('./pages/api/enhanced-ai.astro.mjs');
const _page103 = () => import('./pages/api/errors.astro.mjs');
const _page104 = () => import('./pages/api/faq.astro.mjs');
const _page105 = () => import('./pages/api/faq-generator.astro.mjs');
const _page106 = () => import('./pages/api/flowise.astro.mjs');
const _page107 = () => import('./pages/api/gemini-pro.astro.mjs');
const _page108 = () => import('./pages/api/gemma-polish.astro.mjs');
const _page109 = () => import('./pages/api/generate-hf.astro.mjs');
const _page110 = () => import('./pages/api/generate-image.astro.mjs');
const _page111 = () => import('./pages/api/generate-image-modern.astro.mjs');
const _page112 = () => import('./pages/api/generate-marketing-content.astro.mjs');
const _page113 = () => import('./pages/api/generic-chat.astro.mjs');
const _page114 = () => import('./pages/api/get-recommendations.astro.mjs');
const _page115 = () => import('./pages/api/google-bard.astro.mjs');
const _page116 = () => import('./pages/api/google-cloud/initialize-speech.astro.mjs');
const _page117 = () => import('./pages/api/google-cloud/text-to-speech.astro.mjs');
const _page118 = () => import('./pages/api/google-sheets-catalog.astro.mjs');
const _page119 = () => import('./pages/api/health.astro.mjs');
const _page120 = () => import('./pages/api/health-check.astro.mjs');
const _page121 = () => import('./pages/api/helper-6.astro.mjs');
const _page122 = () => import('./pages/api/helper-7.astro.mjs');
const _page123 = () => import('./pages/api/helper-8.astro.mjs');
const _page124 = () => import('./pages/api/image-generator/generate.astro.mjs');
const _page125 = () => import('./pages/api/image-generator/history.astro.mjs');
const _page126 = () => import('./pages/api/image-generator/styles.astro.mjs');
const _page127 = () => import('./pages/api/images/_id_.astro.mjs');
const _page128 = () => import('./pages/api/kaggle/competitions.astro.mjs');
const _page129 = () => import('./pages/api/kaggle/datasets.astro.mjs');
const _page130 = () => import('./pages/api/kaggle.astro.mjs');
const _page131 = () => import('./pages/api/kaggle-new.astro.mjs');
const _page132 = () => import('./pages/api/learning.astro.mjs');
const _page133 = () => import('./pages/api/llama-polish.astro.mjs');
const _page134 = () => import('./pages/api/main-chat.astro.mjs');
const _page135 = () => import('./pages/api/mistral-polish.astro.mjs');
const _page136 = () => import('./pages/api/music/library.astro.mjs');
const _page137 = () => import('./pages/api/my-secrets.astro.mjs');
const _page138 = () => import('./pages/api/mybonzo-chat.astro.mjs');
const _page139 = () => import('./pages/api/openrouter-chat.astro.mjs');
const _page140 = () => import('./pages/api/payment/create-session.astro.mjs');
const _page141 = () => import('./pages/api/photo-to-photo.astro.mjs');
const _page142 = () => import('./pages/api/polaczek/kaggle.astro.mjs');
const _page143 = () => import('./pages/api/polaczek-b.astro.mjs');
const _page144 = () => import('./pages/api/polaczek-chat.astro.mjs');
const _page145 = () => import('./pages/api/polaczek-d1.astro.mjs');
const _page146 = () => import('./pages/api/polaczek-m1.astro.mjs');
const _page147 = () => import('./pages/api/polaczek-sys-t.astro.mjs');
const _page148 = () => import('./pages/api/polaczek-t.astro.mjs');
const _page149 = () => import('./pages/api/qualify-lead.astro.mjs');
const _page150 = () => import('./pages/api/quiz.astro.mjs');
const _page151 = () => import('./pages/api/quiz-feedback.astro.mjs');
const _page152 = () => import('./pages/api/qwen-polish.astro.mjs');
const _page153 = () => import('./pages/api/recommendations.astro.mjs');
const _page154 = () => import('./pages/api/reminders.astro.mjs');
const _page155 = () => import('./pages/api/search.astro.mjs');
const _page156 = () => import('./pages/api/send-report.astro.mjs');
const _page157 = () => import('./pages/api/status-check.astro.mjs');
const _page158 = () => import('./pages/api/system/validate.astro.mjs');
const _page159 = () => import('./pages/api/tavi.astro.mjs');
const _page160 = () => import('./pages/api/tavi-new.astro.mjs');
const _page161 = () => import('./pages/api/tavily/news.astro.mjs');
const _page162 = () => import('./pages/api/tavily/search.astro.mjs');
const _page163 = () => import('./pages/api/test-connections.astro.mjs');
const _page164 = () => import('./pages/api/test-deepseek-kaggle.astro.mjs');
const _page165 = () => import('./pages/api/test-secrets.astro.mjs');
const _page166 = () => import('./pages/api/test-tavily.astro.mjs');
const _page167 = () => import('./pages/api/text-bison.astro.mjs');
const _page168 = () => import('./pages/api/tickets.astro.mjs');
const _page169 = () => import('./pages/api/translate.astro.mjs');
const _page170 = () => import('./pages/api/usage-stats.astro.mjs');
const _page171 = () => import('./pages/api/vertex-ai-catalog.astro.mjs');
const _page172 = () => import('./pages/api/voice/analysis.astro.mjs');
const _page173 = () => import('./pages/api/voice/commands.astro.mjs');
const _page174 = () => import('./pages/api/voice/recognition.astro.mjs');
const _page175 = () => import('./pages/api/voice/synthesis.astro.mjs');
const _page176 = () => import('./pages/api/voice.astro.mjs');
const _page177 = () => import('./pages/api/voice-ai/websocket.astro.mjs');
const _page178 = () => import('./pages/api/voice-handler.astro.mjs');
const _page179 = () => import('./pages/api/webmaster/competitive.astro.mjs');
const _page180 = () => import('./pages/api/webmaster/performance.astro.mjs');
const _page181 = () => import('./pages/api/webmaster/seo.astro.mjs');
const _page182 = () => import('./pages/api/wildcards.astro.mjs');
const _page183 = () => import('./pages/api/workers/status.astro.mjs');
const _page184 = () => import('./pages/api/workers-status.astro.mjs');
const _page185 = () => import('./pages/api-dashboard.astro.mjs');
const _page186 = () => import('./pages/api-demo.astro.mjs');
const _page187 = () => import('./pages/auth/google/authorize.astro.mjs');
const _page188 = () => import('./pages/bielik-enon-dev-new.astro.mjs');
const _page189 = () => import('./pages/bigquery.astro.mjs');
const _page190 = () => import('./pages/bigquery-analytics.astro.mjs');
const _page191 = () => import('./pages/chat/_agentid_.astro.mjs');
const _page192 = () => import('./pages/chatbot.astro.mjs');
const _page193 = () => import('./pages/control-panel.astro.mjs');
const _page194 = () => import('./pages/customer-automation/qualification.astro.mjs');
const _page195 = () => import('./pages/customer-automation.astro.mjs');
const _page196 = () => import('./pages/cyber-music-test.astro.mjs');
const _page197 = () => import('./pages/dashboard.astro.mjs');
const _page198 = () => import('./pages/dashboard-new.astro.mjs');
const _page199 = () => import('./pages/data-collector-dashboard.astro.mjs');
const _page200 = () => import('./pages/deployment-test.astro.mjs');
const _page201 = () => import('./pages/dodatki/agents/voice/config.astro.mjs');
const _page202 = () => import('./pages/dodatki/agents/voice.astro.mjs');
const _page203 = () => import('./pages/dodatki/agents/_agentid_.astro.mjs');
const _page204 = () => import('./pages/dodatki/agents.astro.mjs');
const _page205 = () => import('./pages/dodatki/ai-functions.astro.mjs');
const _page206 = () => import('./pages/dodatki/workers/ai-chatbot.astro.mjs');
const _page207 = () => import('./pages/dodatki/workers.astro.mjs');
const _page208 = () => import('./pages/dodatki.astro.mjs');
const _page209 = () => import('./pages/dynamic-faq.astro.mjs');
const _page210 = () => import('./pages/education-recommendations.astro.mjs');
const _page211 = () => import('./pages/funkcje-biznesowe-ai.astro.mjs');
const _page212 = () => import('./pages/generator.astro.mjs');
const _page213 = () => import('./pages/hub/ai-agent-s.astro.mjs');
const _page214 = () => import('./pages/hub/bigquery.astro.mjs');
const _page215 = () => import('./pages/hub/chatbot.astro.mjs');
const _page216 = () => import('./pages/hub/functions/1.astro.mjs');
const _page217 = () => import('./pages/hub/functions/2.astro.mjs');
const _page218 = () => import('./pages/hub/functions/3.astro.mjs');
const _page219 = () => import('./pages/hub/functions.astro.mjs');
const _page220 = () => import('./pages/hub/generator.astro.mjs');
const _page221 = () => import('./pages/hub/kaggle.astro.mjs');
const _page222 = () => import('./pages/hub/polaczek-sys-t.astro.mjs');
const _page223 = () => import('./pages/hub/status.astro.mjs');
const _page224 = () => import('./pages/hub/tavily.astro.mjs');
const _page225 = () => import('./pages/hub.astro.mjs');
const _page226 = () => import('./pages/image-generator.astro.mjs');
const _page227 = () => import('./pages/index_backup_20250830043459.astro.mjs');
const _page228 = () => import('./pages/index_clean_backup.astro.mjs');
const _page229 = () => import('./pages/index-complex-backup.astro.mjs');
const _page230 = () => import('./pages/index-refactored.astro.mjs');
const _page231 = () => import('./pages/index-simple.astro.mjs');
const _page232 = () => import('./pages/integration-hub.astro.mjs');
const _page233 = () => import('./pages/interactive-quizzes.astro.mjs');
const _page234 = () => import('./pages/kaggle.astro.mjs');
const _page235 = () => import('./pages/kaggle-datasets.astro.mjs');
const _page236 = () => import('./pages/kaggle-datasets-enhanced.astro.mjs');
const _page237 = () => import('./pages/katalog-stron.astro.mjs');
const _page238 = () => import('./pages/klf-sheed-shop.astro.mjs');
const _page239 = () => import('./pages/login.astro.mjs');
const _page240 = () => import('./pages/marketing-content.astro.mjs');
const _page241 = () => import('./pages/mybonzo.astro.mjs');
const _page242 = () => import('./pages/payment-simulator.astro.mjs');
const _page243 = () => import('./pages/personalized-recommendations.astro.mjs');
const _page244 = () => import('./pages/polaczek_agent_sys_23/agent-data-simple.astro.mjs');
const _page245 = () => import('./pages/polaczek_agent_sys_23/agent-data1.astro.mjs');
const _page246 = () => import('./pages/polaczek_agent_sys_23/agents/create.astro.mjs');
const _page247 = () => import('./pages/polaczek_agent_sys_23/agents/create-backup.astro.mjs');
const _page248 = () => import('./pages/polaczek_agent_sys_23/api/agents/control.astro.mjs');
const _page249 = () => import('./pages/polaczek_agent_sys_23/api/agents/create.astro.mjs');
const _page250 = () => import('./pages/polaczek_agent_sys_23/api/agents/list.astro.mjs');
const _page251 = () => import('./pages/polaczek_agent_sys_23/api/agents/list-backup.astro.mjs');
const _page252 = () => import('./pages/polaczek_agent_sys_23/api/chat.astro.mjs');
const _page253 = () => import('./pages/polaczek_agent_sys_23/api-keys.astro.mjs');
const _page254 = () => import('./pages/polaczek_agent_sys_23/dashboard.astro.mjs');
const _page255 = () => import('./pages/polaczek_agent_sys_23/dashboard-backup.astro.mjs');
const _page256 = () => import('./pages/polaczek_agent_sys_23/readme.astro.mjs');
const _page257 = () => import('./pages/polaczek_agent_sys_23.astro.mjs');
const _page258 = () => import('./pages/polaczek-agents-system.astro.mjs');
const _page259 = () => import('./pages/posts/_---slug_.astro.mjs');
const _page260 = () => import('./pages/prompt-enhancer.astro.mjs');
const _page261 = () => import('./pages/quiz.astro.mjs');
const _page262 = () => import('./pages/quiz-new.astro.mjs');
const _page263 = () => import('./pages/real-agent-creator.astro.mjs');
const _page264 = () => import('./pages/reminders-calendar/reminders.astro.mjs');
const _page265 = () => import('./pages/reminders-calendar/scheduler.astro.mjs');
const _page266 = () => import('./pages/reminders-calendar.astro.mjs');
const _page267 = () => import('./pages/robots.txt.astro.mjs');
const _page268 = () => import('./pages/rss.xml.astro.mjs');
const _page269 = () => import('./pages/simple-image-generator.astro.mjs');
const _page270 = () => import('./pages/stable-diffusion.astro.mjs');
const _page271 = () => import('./pages/stable-image-generator.astro.mjs');
const _page272 = () => import('./pages/status-workers.astro.mjs');
const _page273 = () => import('./pages/streamline-icons-demo.astro.mjs');
const _page274 = () => import('./pages/system-dashboard.astro.mjs');
const _page275 = () => import('./pages/tavily.astro.mjs');
const _page276 = () => import('./pages/tavily-search.astro.mjs');
const _page277 = () => import('./pages/test-agent.astro.mjs');
const _page278 = () => import('./pages/voice-avatar-new.astro.mjs');
const _page279 = () => import('./pages/web-catalog.astro.mjs');
const _page280 = () => import('./pages/wildcards.astro.mjs');
const _page281 = () => import('./pages/workers-status.astro.mjs');
const _page282 = () => import('./pages/workers-status-test.astro.mjs');
const _page283 = () => import('./pages/www.astro.mjs');
const _page284 = () => import('./pages/zaawansowane-funkcje-ai.astro.mjs');
const _page285 = () => import('./pages/zaawansowane-funkcje-ai-new.astro.mjs');
const _page286 = () => import('./pages/zenon-mcp-server.astro.mjs');
const _page287 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/activity-monitoring/realtime.astro", _page1],
    ["src/pages/activity-monitoring/index.astro", _page2],
    ["src/pages/admin/ai-chat.astro", _page3],
    ["src/pages/admin/ai-models.astro", _page4],
    ["src/pages/admin/configuration.astro", _page5],
    ["src/pages/admin/dashboard.astro", _page6],
    ["src/pages/admin/login.astro", _page7],
    ["src/pages/admin/monitoring.astro", _page8],
    ["src/pages/admin/polish-mega-pro-admin.astro", _page9],
    ["src/pages/admin/security.astro", _page10],
    ["src/pages/admin/test.astro", _page11],
    ["src/pages/admin/users.astro", _page12],
    ["src/pages/admin/index.astro", _page13],
    ["src/pages/agent-builder-23.astro", _page14],
    ["src/pages/agent-dashboard.astro", _page15],
    ["src/pages/agents/[agentId].astro", _page16],
    ["src/pages/agents/index.astro", _page17],
    ["src/pages/agents-new.astro", _page18],
    ["src/pages/ai-agent-chat.astro", _page19],
    ["src/pages/ai-functions/activity-monitoring/index.astro", _page20],
    ["src/pages/ai-functions/ai-tickets/index.astro", _page21],
    ["src/pages/ai-functions/customer-automation/crm.astro", _page22],
    ["src/pages/ai-functions/customer-automation/qualification.astro", _page23],
    ["src/pages/ai-functions/customer-automation/responses.astro", _page24],
    ["src/pages/ai-functions/customer-automation/index.astro", _page25],
    ["src/pages/ai-functions/dynamic-faq/generator.astro", _page26],
    ["src/pages/ai-functions/dynamic-faq/index.astro", _page27],
    ["src/pages/ai-functions/education-recommendations/index.astro", _page28],
    ["src/pages/ai-functions/interactive-quizzes/index.astro", _page29],
    ["src/pages/ai-functions/marketing-content/analytics.astro", _page30],
    ["src/pages/ai-functions/marketing-content/campaigns.astro", _page31],
    ["src/pages/ai-functions/marketing-content/maestro.astro", _page32],
    ["src/pages/ai-functions/marketing-content/templates.astro", _page33],
    ["src/pages/ai-functions/marketing-content/index.astro", _page34],
    ["src/pages/ai-functions/personalized-recommendations/index.astro", _page35],
    ["src/pages/ai-functions/reminders-calendar/index.astro", _page36],
    ["src/pages/ai-integrations-test.astro", _page37],
    ["src/pages/ai-tickets/dashboard.astro", _page38],
    ["src/pages/ai-tickets/new.astro", _page39],
    ["src/pages/ai-tickets/index.astro", _page40],
    ["src/pages/ai-workers-manager.astro", _page41],
    ["src/pages/analytics.astro", _page42],
    ["src/pages/animations-showcase.astro", _page43],
    ["src/pages/api/activepieces.js", _page44],
    ["src/pages/api/activity-monitor.ts", _page45],
    ["src/pages/api/admin/alerts.ts", _page46],
    ["src/pages/api/admin/analytics.ts", _page47],
    ["src/pages/api/admin/auth.ts", _page48],
    ["src/pages/api/admin/backup.ts", _page49],
    ["src/pages/api/admin/chat.ts", _page50],
    ["src/pages/api/admin/control.ts", _page51],
    ["src/pages/api/admin/deploy.ts", _page52],
    ["src/pages/api/admin/logs.ts", _page53],
    ["src/pages/api/admin/monitoring.ts", _page54],
    ["src/pages/api/admin/queries.ts", _page55],
    ["src/pages/api/admin/stats.ts", _page56],
    ["src/pages/api/admin/status.ts", _page57],
    ["src/pages/api/admin/tickets.ts", _page58],
    ["src/pages/api/admin/users.ts", _page59],
    ["src/pages/api/admin/workers.ts", _page60],
    ["src/pages/api/admin/workers-status.ts", _page61],
    ["src/pages/api/agent.ts", _page62],
    ["src/pages/api/agents/create.ts", _page63],
    ["src/pages/api/agents/list.ts", _page64],
    ["src/pages/api/agents/manage.ts", _page65],
    ["src/pages/api/agents/mybonzo.ts", _page66],
    ["src/pages/api/agents/stats.ts", _page67],
    ["src/pages/api/agents/voice-command.ts", _page68],
    ["src/pages/api/agents/[agentId]/chat.ts", _page69],
    ["src/pages/api/agents/[agentId]/image.ts", _page70],
    ["src/pages/api/agents/[agentId]/status.ts", _page71],
    ["src/pages/api/agents/[agentId]/task.ts", _page72],
    ["src/pages/api/agents/[id].ts", _page73],
    ["src/pages/api/agents.ts", _page74],
    ["src/pages/api/ai/advanced-chat.ts", _page75],
    ["src/pages/api/ai-agent-s.astro", _page76],
    ["src/pages/api/ai-bot-worker.ts", _page77],
    ["src/pages/api/ai-models/gemma.ts", _page78],
    ["src/pages/api/ai-models/openrouter.ts", _page79],
    ["src/pages/api/ai-models/snell.ts", _page80],
    ["src/pages/api/ai-models/stable-diffusion.ts", _page81],
    ["src/pages/api/ai-workers.ts", _page82],
    ["src/pages/api/analytics/prophet.ts", _page83],
    ["src/pages/api/analytics/visibility.ts", _page84],
    ["src/pages/api/api-list.ts", _page85],
    ["src/pages/api/auth/status.ts", _page86],
    ["src/pages/api/bielik.ts", _page87],
    ["src/pages/api/bielik-analytics.ts", _page88],
    ["src/pages/api/bielik-chat.ts", _page89],
    ["src/pages/api/bigquery/analytics.ts", _page90],
    ["src/pages/api/bigquery/reports.ts", _page91],
    ["src/pages/api/bigquery.ts", _page92],
    ["src/pages/api/calendar.ts", _page93],
    ["src/pages/api/chat.ts", _page94],
    ["src/pages/api/code-bison.ts", _page95],
    ["src/pages/api/data-analyze.ts", _page96],
    ["src/pages/api/data-collector.ts", _page97],
    ["src/pages/api/debug-env.ts", _page98],
    ["src/pages/api/deepseek-search.astro", _page99],
    ["src/pages/api/education-recommendations.ts", _page100],
    ["src/pages/api/enhance-prompt.ts", _page101],
    ["src/pages/api/enhanced-ai.astro", _page102],
    ["src/pages/api/errors.ts", _page103],
    ["src/pages/api/faq.ts", _page104],
    ["src/pages/api/faq-generator.ts", _page105],
    ["src/pages/api/flowise.ts", _page106],
    ["src/pages/api/gemini-pro.ts", _page107],
    ["src/pages/api/gemma-polish.ts", _page108],
    ["src/pages/api/generate-hf.ts", _page109],
    ["src/pages/api/generate-image.ts", _page110],
    ["src/pages/api/generate-image-modern.ts", _page111],
    ["src/pages/api/generate-marketing-content.ts", _page112],
    ["src/pages/api/generic-chat.ts", _page113],
    ["src/pages/api/get-recommendations.ts", _page114],
    ["src/pages/api/google-bard.ts", _page115],
    ["src/pages/api/google-cloud/initialize-speech.ts", _page116],
    ["src/pages/api/google-cloud/text-to-speech.ts", _page117],
    ["src/pages/api/google-sheets-catalog.ts", _page118],
    ["src/pages/api/health.ts", _page119],
    ["src/pages/api/health-check.ts", _page120],
    ["src/pages/api/helper-6.ts", _page121],
    ["src/pages/api/helper-7.ts", _page122],
    ["src/pages/api/helper-8.ts", _page123],
    ["src/pages/api/image-generator/generate.ts", _page124],
    ["src/pages/api/image-generator/history.ts", _page125],
    ["src/pages/api/image-generator/styles.ts", _page126],
    ["src/pages/api/images/[id].ts", _page127],
    ["src/pages/api/kaggle/competitions.ts", _page128],
    ["src/pages/api/kaggle/datasets.ts", _page129],
    ["src/pages/api/kaggle.ts", _page130],
    ["src/pages/api/kaggle-new.ts", _page131],
    ["src/pages/api/learning.ts", _page132],
    ["src/pages/api/llama-polish.ts", _page133],
    ["src/pages/api/main-chat.astro", _page134],
    ["src/pages/api/mistral-polish.ts", _page135],
    ["src/pages/api/music/library.astro", _page136],
    ["src/pages/api/my-secrets.ts", _page137],
    ["src/pages/api/mybonzo-chat.ts", _page138],
    ["src/pages/api/openrouter-chat.ts", _page139],
    ["src/pages/api/payment/create-session.ts", _page140],
    ["src/pages/api/photo-to-photo.ts", _page141],
    ["src/pages/api/polaczek/kaggle.ts", _page142],
    ["src/pages/api/polaczek-b.ts", _page143],
    ["src/pages/api/polaczek-chat.ts", _page144],
    ["src/pages/api/polaczek-d1.ts", _page145],
    ["src/pages/api/polaczek-m1.ts", _page146],
    ["src/pages/api/polaczek-sys-t.astro", _page147],
    ["src/pages/api/polaczek-t.ts", _page148],
    ["src/pages/api/qualify-lead.ts", _page149],
    ["src/pages/api/quiz.ts", _page150],
    ["src/pages/api/quiz-feedback.ts", _page151],
    ["src/pages/api/qwen-polish.ts", _page152],
    ["src/pages/api/recommendations.ts", _page153],
    ["src/pages/api/reminders.ts", _page154],
    ["src/pages/api/search.ts", _page155],
    ["src/pages/api/send-report.ts", _page156],
    ["src/pages/api/status-check.ts", _page157],
    ["src/pages/api/system/validate.ts", _page158],
    ["src/pages/api/tavi.ts", _page159],
    ["src/pages/api/tavi-new.ts", _page160],
    ["src/pages/api/tavily/news.ts", _page161],
    ["src/pages/api/tavily/search.ts", _page162],
    ["src/pages/api/test-connections.ts", _page163],
    ["src/pages/api/test-deepseek-kaggle.ts", _page164],
    ["src/pages/api/test-secrets.ts", _page165],
    ["src/pages/api/test-tavily.ts", _page166],
    ["src/pages/api/text-bison.ts", _page167],
    ["src/pages/api/tickets.ts", _page168],
    ["src/pages/api/translate.ts", _page169],
    ["src/pages/api/usage-stats.ts", _page170],
    ["src/pages/api/vertex-ai-catalog.ts", _page171],
    ["src/pages/api/voice/analysis.ts", _page172],
    ["src/pages/api/voice/commands.ts", _page173],
    ["src/pages/api/voice/recognition.ts", _page174],
    ["src/pages/api/voice/synthesis.ts", _page175],
    ["src/pages/api/voice.ts", _page176],
    ["src/pages/api/voice-ai/websocket.ts", _page177],
    ["src/pages/api/voice-handler.ts", _page178],
    ["src/pages/api/webmaster/competitive.ts", _page179],
    ["src/pages/api/webmaster/performance.ts", _page180],
    ["src/pages/api/webmaster/seo.ts", _page181],
    ["src/pages/api/wildcards.ts", _page182],
    ["src/pages/api/workers/status.ts", _page183],
    ["src/pages/api/workers-status.ts", _page184],
    ["src/pages/api-dashboard.astro", _page185],
    ["src/pages/api-demo.astro", _page186],
    ["src/pages/auth/google/authorize.astro", _page187],
    ["src/pages/bielik-enon-dev-new.astro", _page188],
    ["src/pages/bigquery.astro", _page189],
    ["src/pages/bigquery-analytics.astro", _page190],
    ["src/pages/chat/[agentId].astro", _page191],
    ["src/pages/chatbot.astro", _page192],
    ["src/pages/control-panel.astro", _page193],
    ["src/pages/customer-automation/qualification.astro", _page194],
    ["src/pages/customer-automation/index.astro", _page195],
    ["src/pages/cyber-music-test.astro", _page196],
    ["src/pages/dashboard.astro", _page197],
    ["src/pages/dashboard-new.astro", _page198],
    ["src/pages/data-collector-dashboard.astro", _page199],
    ["src/pages/deployment-test.astro", _page200],
    ["src/pages/dodatki/agents/voice/config.ts", _page201],
    ["src/pages/dodatki/agents/voice/index.astro", _page202],
    ["src/pages/dodatki/agents/[agentid].astro", _page203],
    ["src/pages/dodatki/agents/index.astro", _page204],
    ["src/pages/dodatki/ai-functions/index.astro", _page205],
    ["src/pages/dodatki/workers/ai-chatbot.astro", _page206],
    ["src/pages/dodatki/workers/index.astro", _page207],
    ["src/pages/dodatki/index.astro", _page208],
    ["src/pages/dynamic-faq/index.astro", _page209],
    ["src/pages/education-recommendations.astro", _page210],
    ["src/pages/funkcje-biznesowe-ai.astro", _page211],
    ["src/pages/generator.astro", _page212],
    ["src/pages/hub/ai-agent-s.astro", _page213],
    ["src/pages/hub/bigquery.astro", _page214],
    ["src/pages/hub/chatbot.astro", _page215],
    ["src/pages/hub/functions/1.astro", _page216],
    ["src/pages/hub/functions/2.astro", _page217],
    ["src/pages/hub/functions/3.astro", _page218],
    ["src/pages/hub/functions/index.astro", _page219],
    ["src/pages/hub/generator.astro", _page220],
    ["src/pages/hub/kaggle.astro", _page221],
    ["src/pages/hub/polaczek-sys-t.astro", _page222],
    ["src/pages/hub/status.astro", _page223],
    ["src/pages/hub/tavily.astro", _page224],
    ["src/pages/hub/index.astro", _page225],
    ["src/pages/image-generator.astro", _page226],
    ["src/pages/index_backup_20250830043459.astro", _page227],
    ["src/pages/index_clean_backup.astro", _page228],
    ["src/pages/index-complex-backup.astro", _page229],
    ["src/pages/index-refactored.astro", _page230],
    ["src/pages/index-simple.astro", _page231],
    ["src/pages/integration-hub.astro", _page232],
    ["src/pages/interactive-quizzes/index.astro", _page233],
    ["src/pages/kaggle.astro", _page234],
    ["src/pages/kaggle-datasets.astro", _page235],
    ["src/pages/kaggle-datasets-enhanced.astro", _page236],
    ["src/pages/katalog-stron.astro", _page237],
    ["src/pages/klf-sheed-shop.astro", _page238],
    ["src/pages/login.astro", _page239],
    ["src/pages/marketing-content/index.astro", _page240],
    ["src/pages/mybonzo.astro", _page241],
    ["src/pages/payment-simulator.astro", _page242],
    ["src/pages/personalized-recommendations.astro", _page243],
    ["src/pages/POLACZEK_AGENT_SYS_23/agent-data-simple.astro", _page244],
    ["src/pages/POLACZEK_AGENT_SYS_23/agent-data1.astro", _page245],
    ["src/pages/POLACZEK_AGENT_SYS_23/agents/create.astro", _page246],
    ["src/pages/POLACZEK_AGENT_SYS_23/agents/create-backup.astro", _page247],
    ["src/pages/POLACZEK_AGENT_SYS_23/api/agents/control.ts", _page248],
    ["src/pages/POLACZEK_AGENT_SYS_23/api/agents/create.ts", _page249],
    ["src/pages/POLACZEK_AGENT_SYS_23/api/agents/list.ts", _page250],
    ["src/pages/POLACZEK_AGENT_SYS_23/api/agents/list-backup.ts", _page251],
    ["src/pages/POLACZEK_AGENT_SYS_23/api/chat.ts", _page252],
    ["src/pages/POLACZEK_AGENT_SYS_23/api-keys.astro", _page253],
    ["src/pages/POLACZEK_AGENT_SYS_23/dashboard.astro", _page254],
    ["src/pages/POLACZEK_AGENT_SYS_23/dashboard-backup.astro", _page255],
    ["src/pages/POLACZEK_AGENT_SYS_23/README.md", _page256],
    ["src/pages/POLACZEK_AGENT_SYS_23/index.astro", _page257],
    ["src/pages/polaczek-agents-system.astro", _page258],
    ["src/pages/posts/[...slug].astro", _page259],
    ["src/pages/prompt-enhancer.astro", _page260],
    ["src/pages/quiz.astro", _page261],
    ["src/pages/quiz-new.astro", _page262],
    ["src/pages/real-agent-creator.astro", _page263],
    ["src/pages/reminders-calendar/reminders.astro", _page264],
    ["src/pages/reminders-calendar/scheduler.astro", _page265],
    ["src/pages/reminders-calendar/index.astro", _page266],
    ["src/pages/robots.txt.ts", _page267],
    ["src/pages/rss.xml.js", _page268],
    ["src/pages/simple-image-generator.astro", _page269],
    ["src/pages/stable-diffusion.astro", _page270],
    ["src/pages/stable-image-generator.astro", _page271],
    ["src/pages/status-workers.astro", _page272],
    ["src/pages/streamline-icons-demo.astro", _page273],
    ["src/pages/system-dashboard.astro", _page274],
    ["src/pages/tavily.astro", _page275],
    ["src/pages/tavily-search.astro", _page276],
    ["src/pages/test-agent.astro", _page277],
    ["src/pages/voice-avatar-new.astro", _page278],
    ["src/pages/web-catalog/index.astro", _page279],
    ["src/pages/wildcards.astro", _page280],
    ["src/pages/workers-status.astro", _page281],
    ["src/pages/workers-status-test.astro", _page282],
    ["src/pages/www.astro", _page283],
    ["src/pages/zaawansowane-funkcje-ai.astro", _page284],
    ["src/pages/zaawansowane-funkcje-ai-new.astro", _page285],
    ["src/pages/zenon-mcp-server.astro", _page286],
    ["src/pages/index.astro", _page287]
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
