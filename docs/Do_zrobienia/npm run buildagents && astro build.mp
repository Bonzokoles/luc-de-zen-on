> npm run build:agents && astro build


> build:agents
> rollup -c rollup.agents.config.js


src/agents-bundle/index.js → public/agents-bundle.js, public/agents-bundle.min.js...
(!) [plugin typescript] src/agents/multi-ai-agent.ts (317:77): @rollup/plugin-typescript TS2558: Expected 0 type arguments, but got 1.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/agents/multi-ai-agent.ts:317:77

317     const { message, provider, model, conversationId } = await request.json<ChatRequest>();
                                                                                ~~~~~~~~~~~

(!) [plugin typescript] src/agents/multi-ai-agent.ts (369:40): @rollup/plugin-typescript TS2558: Expected 0 type arguments, but got 1.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/agents/multi-ai-agent.ts:369:40

369     const updates = await request.json<Partial<AgentState["preferences"]>>();
                                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

(!) [plugin typescript] src/agents/multi-ai-agent.ts (549:38): @rollup/plugin-typescript TS2558: Expected 0 type arguments, but got 1.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/agents/multi-ai-agent.ts:549:38

549     const data = await response.json<AIResponse>();
                                         ~~~~~~~~~~

(!) [plugin typescript] src/components/QuickVoiceAI.tsx (11:8): @rollup/plugin-typescript TS2741: Property 'variant' is missing in type '{}' but required in type 'VoiceAvatarProps'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/components/QuickVoiceAI.tsx:11:8

11       <VoiceAvatarComponent />
          ~~~~~~~~~~~~~~~~~~~~

  src/components/voice-ai/VoiceAvatarComponent.tsx:4:3
    4   variant: 'hero' | 'compact' | 'floating';
        ~~~~~~~
    'variant' is declared here.

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (4:30): @rollup/plugin-typescript TS7031: Binding element 'request' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:4:30

4 export async function POST({ request, locals }) {
                               ~~~~~~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (4:39): @rollup/plugin-typescript TS7031: Binding element 'locals' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:4:39

4 export async function POST({ request, locals }) {
                                        ~~~~~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (31:18): @rollup/plugin-typescript TS18046: 'error' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:31:18

31         details: error.message,
                    ~~~~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (41:32): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:41:32

41 async function delegateToAgent(db, { agentId, payload }) {
                                  ~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (41:38): @rollup/plugin-typescript TS7031: Binding element 'agentId' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:41:38

41 async function delegateToAgent(db, { agentId, payload }) {
                                        ~~~~~~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (41:47): @rollup/plugin-typescript TS7031: Binding element 'payload' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:41:47

41 async function delegateToAgent(db, { agentId, payload }) {
                                                 ~~~~~~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (62:20): @rollup/plugin-typescript TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{ voice: string; music: string; system: string; crawler: string; files: string; database: string; email: string; security: string; webmaster: string; analytics: string; polaczek: string; }'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:62:20

62   const endpoint = agentEndpoints[agentId];
                      ~~~~~~~~~~~~~~~~~~~~~~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (81:22): @rollup/plugin-typescript TS18046: 'error' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:81:22

81       errorMessage = error.message;
                        ~~~~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (144:34): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:144:34

144 async function getAgentsRegistry(db) {
                                     ~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (233:9): @rollup/plugin-typescript TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{ voice: { name: string; endpoint: string; capabilities: string[]; status: string; }; music: { name: string; endpoint: string; capabilities: string[]; status: string; }; system: { name: string; endpoint: string; capabilities: string[]; status: string; }; ... 7 more ...; polaczek: { ...; }; }'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:233:9

233     if (registry[stat.target_agent]) {
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (234:7): @rollup/plugin-typescript TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{ voice: { name: string; endpoint: string; capabilities: string[]; status: string; }; music: { name: string; endpoint: string; capabilities: string[]; status: string; }; system: { name: string; endpoint: string; capabilities: string[]; status: string; }; ... 7 more ...; polaczek: { ...; }; }'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:234:7

234       registry[stat.target_agent].stats = {
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (262:31): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:262:31

262 async function getAgentStatus(db, { agentId }) {
                                  ~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (262:37): @rollup/plugin-typescript TS7031: Binding element 'agentId' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:262:37

262 async function getAgentStatus(db, { agentId }) {
                                        ~~~~~~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (303:37): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:303:37

303 async function getCommunicationsLog(db, { limit = 50, agentId = null }) {
                                        ~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (334:36): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:334:36

334 async function testAgentConnection(db, { agentId }) {
                                       ~~

(!) [plugin typescript] src/pages/api/agent-orchestration.ts (334:42): @rollup/plugin-typescript TS7031: Binding element 'agentId' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/agent-orchestration.ts:334:42

334 async function testAgentConnection(db, { agentId }) {
                                             ~~~~~~~

(!) [plugin typescript] src/pages/api/bigquery/analytics.ts (109:47): @rollup/plugin-typescript TS18046: 'queryError' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/bigquery/analytics.ts:109:47

109     throw new Error(`BigQuery query failed: ${queryError.message}`);
                                                  ~~~~~~~~~~

(!) [plugin typescript] src/pages/api/database-query.ts (4:30): @rollup/plugin-typescript TS7031: Binding element 'request' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:4:30

4 export async function POST({ request, locals }) {
                               ~~~~~~~

(!) [plugin typescript] src/pages/api/database-query.ts (4:39): @rollup/plugin-typescript TS7031: Binding element 'locals' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:4:39

4 export async function POST({ request, locals }) {
                                        ~~~~~~

(!) [plugin typescript] src/pages/api/database-query.ts (34:18): @rollup/plugin-typescript TS18046: 'error' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:34:18

34         details: error.message,
                    ~~~~~

(!) [plugin typescript] src/pages/api/database-query.ts (44:33): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:44:33

44 async function executeUserQuery(db, { query, database }) {
                                   ~~

(!) [plugin typescript] src/pages/api/database-query.ts (44:39): @rollup/plugin-typescript TS7031: Binding element 'query' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:44:39

44 async function executeUserQuery(db, { query, database }) {
                                         ~~~~~

(!) [plugin typescript] src/pages/api/database-query.ts (44:46): @rollup/plugin-typescript TS7031: Binding element 'database' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:44:46

44 async function executeUserQuery(db, { query, database }) {
                                                ~~~~~~~~

(!) [plugin typescript] src/pages/api/database-query.ts (93:20): @rollup/plugin-typescript TS18046: 'error' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:93:20

93     errorMessage = error.message;
                      ~~~~~

(!) [plugin typescript] src/pages/api/database-query.ts (156:31): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:156:31

156 async function getTableSchema(db, { tableName }) {
                                  ~~

(!) [plugin typescript] src/pages/api/database-query.ts (156:37): @rollup/plugin-typescript TS7031: Binding element 'tableName' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:156:37

156 async function getTableSchema(db, { tableName }) {
                                        ~~~~~~~~~

(!) [plugin typescript] src/pages/api/database-query.ts (174:64): @rollup/plugin-typescript TS18046: 'error' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:174:64

174         error: `Failed to get schema for table ${tableName}: ${error.message}`,
                                                                   ~~~~~

(!) [plugin typescript] src/pages/api/database-query.ts (184:26): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:184:26

184 async function getTables(db) {
                             ~~

(!) [plugin typescript] src/pages/api/database-query.ts (199:37): @rollup/plugin-typescript TS7006: Parameter 't' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:199:37

199         tables: tables.results.map((t) => t.name),
                                        ~

(!) [plugin typescript] src/pages/api/database-query.ts (211:41): @rollup/plugin-typescript TS18046: 'error' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:211:41

211         error: `Failed to get tables: ${error.message}`,
                                            ~~~~~

(!) [plugin typescript] src/pages/api/database-query.ts (221:32): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:221:32

221 async function getQueryHistory(db, { limit = 20, agentId = null }) {
                                   ~~

(!) [plugin typescript] src/pages/api/database-query.ts (254:48): @rollup/plugin-typescript TS18046: 'error' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/database-query.ts:254:48

254         error: `Failed to get query history: ${error.message}`,
                                                   ~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (4:30): @rollup/plugin-typescript TS7031: Binding element 'request' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:4:30

4 export async function POST({ request, locals }) {
                               ~~~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (4:39): @rollup/plugin-typescript TS7031: Binding element 'locals' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:4:39

4 export async function POST({ request, locals }) {
                                        ~~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (41:18): @rollup/plugin-typescript TS18046: 'error' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:41:18

41         details: error.message,
                    ~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (51:26): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:51:26

51 async function playMusic(db, { trackId, playlistId }) {
                            ~~

(!) [plugin typescript] src/pages/api/music-control.ts (51:32): @rollup/plugin-typescript TS7031: Binding element 'trackId' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:51:32

51 async function playMusic(db, { trackId, playlistId }) {
                                  ~~~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (51:41): @rollup/plugin-typescript TS7031: Binding element 'playlistId' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:51:41

51 async function playMusic(db, { trackId, playlistId }) {
                                           ~~~~~~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (125:27): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:125:27

125 async function pauseMusic(db, params) {
                              ~~

(!) [plugin typescript] src/pages/api/music-control.ts (125:31): @rollup/plugin-typescript TS7006: Parameter 'params' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:125:31

125 async function pauseMusic(db, params) {
                                  ~~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (149:26): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:149:26

149 async function stopMusic(db, params) {
                             ~~

(!) [plugin typescript] src/pages/api/music-control.ts (149:30): @rollup/plugin-typescript TS7006: Parameter 'params' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:149:30

149 async function stopMusic(db, params) {
                                 ~~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (173:26): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:173:26

173 async function nextTrack(db, { playlistId }) {
                             ~~

(!) [plugin typescript] src/pages/api/music-control.ts (173:32): @rollup/plugin-typescript TS7031: Binding element 'playlistId' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:173:32

173 async function nextTrack(db, { playlistId }) {
                                   ~~~~~~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (223:30): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:223:30

223 async function previousTrack(db, { playlistId }) {
                                 ~~

(!) [plugin typescript] src/pages/api/music-control.ts (223:36): @rollup/plugin-typescript TS7031: Binding element 'playlistId' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:223:36

223 async function previousTrack(db, { playlistId }) {
                                       ~~~~~~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (242:29): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:242:29

242 async function loadPlaylist(db, { playlistId }) {
                                ~~

(!) [plugin typescript] src/pages/api/music-control.ts (242:35): @rollup/plugin-typescript TS7031: Binding element 'playlistId' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:242:35

242 async function loadPlaylist(db, { playlistId }) {
                                      ~~~~~~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (287:3): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:287:3

287   db,
      ~~

(!) [plugin typescript] src/pages/api/music-control.ts (289:5): @rollup/plugin-typescript TS7031: Binding element 'title' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:289:5

289     title,
        ~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (290:5): @rollup/plugin-typescript TS7031: Binding element 'artist' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:290:5

290     artist,
        ~~~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (349:27): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:349:27

349 async function getLibrary(db, { limit = 50, offset = 0, genre = null }) {
                              ~~

(!) [plugin typescript] src/pages/api/music-control.ts (379:31): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:379:31

379 async function createPlaylist(db, { name, description = null }) {
                                  ~~

(!) [plugin typescript] src/pages/api/music-control.ts (379:37): @rollup/plugin-typescript TS7031: Binding element 'name' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:379:37

379 async function createPlaylist(db, { name, description = null }) {
                                        ~~~~

(!) [plugin typescript] src/pages/api/music-control.ts (415:29): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:415:29

415 async function getPlaylists(db, params) {
                                ~~

(!) [plugin typescript] src/pages/api/music-control.ts (415:33): @rollup/plugin-typescript TS7006: Parameter 'params' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/music-control.ts:415:33

415 async function getPlaylists(db, params) {
                                    ~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (4:30): @rollup/plugin-typescript TS7031: Binding element 'request' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:4:30

4 export async function POST({ request, locals }) {
                               ~~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (4:39): @rollup/plugin-typescript TS7031: Binding element 'locals' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:4:39

4 export async function POST({ request, locals }) {
                                        ~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (29:18): @rollup/plugin-typescript TS18046: 'error' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:29:18

29         details: error.message,
                    ~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (40:29): @rollup/plugin-typescript TS7031: Binding element 'locals' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:40:29

40 export async function GET({ locals }) {
                               ~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (49:18): @rollup/plugin-typescript TS18046: 'error' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:49:18

49         details: error.message,
                    ~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (59:32): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:59:32

59 async function getSystemStatus(db) {
                                  ~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (154:35): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:154:35

154 async function monitorPerformance(db) {
                                      ~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (170:49): @rollup/plugin-typescript TS7006: Parameter 'acc' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:170:49

170   const metrics = recentMetrics.results.reduce((acc, metric) => {
                                                    ~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (170:54): @rollup/plugin-typescript TS7006: Parameter 'metric' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:170:54

170   const metrics = recentMetrics.results.reduce((acc, metric) => {
                                                         ~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (180:5): @rollup/plugin-typescript TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
  No index signature with a parameter of type 'string' was found on type '{}'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:180:5

180     averages[metricName] = {
        ~~~~~~~~~~~~~~~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (181:16): @rollup/plugin-typescript TS18046: 'values' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:181:16

181       average: values.reduce((sum, val) => sum + val, 0) / values.length,
                   ~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (181:31): @rollup/plugin-typescript TS7006: Parameter 'sum' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:181:31

181       average: values.reduce((sum, val) => sum + val, 0) / values.length,
                                  ~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (181:36): @rollup/plugin-typescript TS7006: Parameter 'val' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:181:36

181       average: values.reduce((sum, val) => sum + val, 0) / values.length,
                                       ~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (181:60): @rollup/plugin-typescript TS18046: 'values' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:181:60

181       average: values.reduce((sum, val) => sum + val, 0) / values.length,
                                                               ~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (182:24): @rollup/plugin-typescript TS2488: Type 'unknown' must have a '[Symbol.iterator]()' method that returns an iterator.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:182:24

182       min: Math.min(...values),
                           ~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (183:24): @rollup/plugin-typescript TS2488: Type 'unknown' must have a '[Symbol.iterator]()' method that returns an iterator.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:183:24

183       max: Math.max(...values),
                           ~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (184:14): @rollup/plugin-typescript TS18046: 'values' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:184:14

184       count: values.length,
                 ~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (190:16): @rollup/plugin-typescript TS2339: Property 'memory_usage' does not exist on type '{}'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:190:16

190   if (averages.memory_usage && averages.memory_usage.average > 85) {
                   ~~~~~~~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (190:41): @rollup/plugin-typescript TS2339: Property 'memory_usage' does not exist on type '{}'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:190:41

190   if (averages.memory_usage && averages.memory_usage.average > 85) {
                                            ~~~~~~~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (194:23): @rollup/plugin-typescript TS2339: Property 'memory_usage' does not exist on type '{}'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:194:23

194       value: averages.memory_usage.average,
                          ~~~~~~~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (197:16): @rollup/plugin-typescript TS2339: Property 'cpu_usage' does not exist on type '{}'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:197:16

197   if (averages.cpu_usage && averages.cpu_usage.average > 80) {
                   ~~~~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (197:38): @rollup/plugin-typescript TS2339: Property 'cpu_usage' does not exist on type '{}'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:197:38

197   if (averages.cpu_usage && averages.cpu_usage.average > 80) {
                                         ~~~~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (201:23): @rollup/plugin-typescript TS2339: Property 'cpu_usage' does not exist on type '{}'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:201:23

201       value: averages.cpu_usage.average,
                          ~~~~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (222:30): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:222:30

222 async function getSystemLogs(db, { level = null, agentId = null, limit = 50 }) {
                                 ~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (259:3): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:259:3

259   db,
      ~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (260:5): @rollup/plugin-typescript TS7031: Binding element 'agentId' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:260:5

260   { agentId, level = "INFO", message, data = null }
        ~~~~~~~

(!) [plugin typescript] src/pages/api/system-monitor.ts (260:30): @rollup/plugin-typescript TS7031: Binding element 'message' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/system-monitor.ts:260:30

260   { agentId, level = "INFO", message, data = null }
                                 ~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (4:30): @rollup/plugin-typescript TS7031: Binding element 'request' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:4:30

4 export async function POST({ request, locals }) {
                               ~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (4:39): @rollup/plugin-typescript TS7031: Binding element 'locals' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:4:39

4 export async function POST({ request, locals }) {
                                        ~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (36:18): @rollup/plugin-typescript TS18046: 'error' is of type 'unknown'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:36:18

36         details: error.message,
                    ~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (46:36): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:46:36

46 async function processVoiceCommand(db, { command, recognizedText, language }) {
                                      ~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (46:42): @rollup/plugin-typescript TS7031: Binding element 'command' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:46:42

46 async function processVoiceCommand(db, { command, recognizedText, language }) {
                                            ~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (46:51): @rollup/plugin-typescript TS7031: Binding element 'recognizedText' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:46:51

46 async function processVoiceCommand(db, { command, recognizedText, language }) {
                                                     ~~~~~~~~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (46:67): @rollup/plugin-typescript TS7031: Binding element 'language' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:46:67

46 async function processVoiceCommand(db, { command, recognizedText, language }) {
                                                                     ~~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (175:34): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:175:34

175 async function getCommandHistory(db, { limit = 20 } = {}) {
                                     ~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (200:31): @rollup/plugin-typescript TS7006: Parameter 'db' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:200:31

200 async function analyzeCommand(db, { command, language }) {
                                  ~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (200:37): @rollup/plugin-typescript TS7031: Binding element 'command' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:200:37

200 async function analyzeCommand(db, { command, language }) {
                                        ~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (200:46): @rollup/plugin-typescript TS7031: Binding element 'language' implicitly has an 'any' type.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:200:46

200 async function analyzeCommand(db, { command, language }) {
                                                 ~~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (219:18): @rollup/plugin-typescript TS2322: Type 'string' is not assignable to type 'never'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:219:18

219       keywords: ["muzyka", "graj", "play"],
                     ~~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (219:28): @rollup/plugin-typescript TS2322: Type 'string' is not assignable to type 'never'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:219:28

219       keywords: ["muzyka", "graj", "play"],
                               ~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (219:36): @rollup/plugin-typescript TS2322: Type 'string' is not assignable to type 'never'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:219:36

219       keywords: ["muzyka", "graj", "play"],
                                       ~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (229:18): @rollup/plugin-typescript TS2322: Type 'string' is not assignable to type 'never'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:229:18

229       keywords: ["tłumacz", "translate"],
                     ~~~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (229:29): @rollup/plugin-typescript TS2322: Type 'string' is not assignable to type 'never'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:229:29

229       keywords: ["tłumacz", "translate"],
                                ~~~~~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (239:18): @rollup/plugin-typescript TS2322: Type 'string' is not assignable to type 'never'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:239:18

239       keywords: ["system", "status"],
                     ~~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (239:28): @rollup/plugin-typescript TS2322: Type 'string' is not assignable to type 'never'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:239:28

239       keywords: ["system", "status"],
                               ~~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (249:18): @rollup/plugin-typescript TS2322: Type 'string' is not assignable to type 'never'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:249:18

249       keywords: ["email", "wyślij"],
                     ~~~~~~~

(!) [plugin typescript] src/pages/api/voice-commands.ts (249:27): @rollup/plugin-typescript TS2322: Type 'string' is not assignable to type 'never'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/pages/api/voice-commands.ts:249:27

249       keywords: ["email", "wyślij"],
                              ~~~~~~~~

(!) [plugin typescript] src/workers/agents-api.ts (72:41): @rollup/plugin-typescript TS2558: Expected 0 type arguments, but got 1.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/workers/agents-api.ts:72:41

72         const data = await request.json<AgentData>();
                                           ~~~~~~~~~

(!) [plugin typescript] src/workers/ai-bot-worker.ts (34:30): @rollup/plugin-typescript TS2558: Expected 0 type arguments, but got 1.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/workers/ai-bot-worker.ts:34:30

34       } = await request.json<PromptRequest>();
                                ~~~~~~~~~~~~~

(!) [plugin typescript] src/workers/deepseek-worker.ts (7:7): @rollup/plugin-typescript TS2304: Cannot find name 'Ai'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/workers/deepseek-worker.ts:7:7

7   AI: Ai;
        ~~

(!) [plugin typescript] src/workers/multi-ai-agent-worker.ts (8:19): @rollup/plugin-typescript TS2304: Cannot find name 'DurableObjectNamespace'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/workers/multi-ai-agent-worker.ts:8:19

8   MULTI_AI_AGENT: DurableObjectNamespace;
                    ~~~~~~~~~~~~~~~~~~~~~~

(!) [plugin typescript] src/workers/multi-ai-agent-worker.ts (63:18): @rollup/plugin-typescript TS2304: Cannot find name 'DurableObjectState'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/workers/multi-ai-agent-worker.ts:63:18

63   private state: DurableObjectState;
                    ~~~~~~~~~~~~~~~~~~

(!) [plugin typescript] src/workers/multi-ai-agent-worker.ts (67:22): @rollup/plugin-typescript TS2304: Cannot find name 'DurableObjectState'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/workers/multi-ai-agent-worker.ts:67:22

67   constructor(state: DurableObjectState, env: Env) {
                        ~~~~~~~~~~~~~~~~~~

(!) [plugin typescript] src/workers/mybonzo-agent-handler.ts (79:10): @rollup/plugin-typescript TS2304: Cannot find name 'ExecutionContext'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/workers/mybonzo-agent-handler.ts:79:10

79     ctx: ExecutionContext
            ~~~~~~~~~~~~~~~~

(!) [plugin typescript] src/workers/mybonzo-agent-handler.ts (276:13): @rollup/plugin-typescript TS2304: Cannot find name 'ExportedHandler'.
/home/runner/work/luc-de-zen-on/luc-de-zen-on/src/workers/mybonzo-agent-handler.ts:276:13

276 } satisfies ExportedHandler<Env>;
                ~~~~~~~~~~~~~~~

[!] RollupError: src/agents/GeminiProAgent.ts (1:25): Expected ',', got 'AgentConfig' (Note that you need plugins to import files that are not JavaScript)
src/agents/GeminiProAgent.ts (1:25)
1: import { BaseAgent, type AgentConfig } from './BaseAgent';
                            ^
2: 
3: export interface GeminiProAgentConfig extends AgentConfig {
    at Object.getRollupError (/home/runner/work/luc-de-zen-on/luc-de-zen-on/node_modules/rollup/dist/shared/parseAst.js:285:41)
    at ParseError.initialise (/home/runner/work/luc-de-zen-on/luc-de-zen-on/node_modules/rollup/dist/shared/rollup.js:16064:40)
    at convertNode (/home/runner/work/luc-de-zen-on/luc-de-zen-on/node_modules/rollup/dist/shared/rollup.js:17947:10)
    at convertProgram (/home/runner/work/luc-de-zen-on/luc-de-zen-on/node_modules/rollup/dist/shared/rollup.js:17187:12)
    at Module.setSource (/home/runner/work/luc-de-zen-on/luc-de-zen-on/node_modules/rollup/dist/shared/rollup.js:18935:24)
    at ModuleLoader.addModuleSource (/home/runner/work/luc-de-zen-on/luc-de-zen-on/node_modules/rollup/dist/shared/rollup.js:22581:13)
  [cause] RollupError: Expected ',', got 'AgentConfig'
      at Object.getRollupError (/home/runner/work/luc-de-zen-on/luc-de-zen-on/node_modules/rollup/dist/shared/parseAst.js:285:41)
      at ParseError.initialise (/home/runner/work/luc-de-zen-on/luc-de-zen-on/node_modules/rollup/dist/shared/rollup.js:16064:40)
      at convertNode (/home/runner/work/luc-de-zen-on/luc-de-zen-on/node_modules/rollup/dist/shared/rollup.js:17947:10)
      at convertProgram (/home/runner/work/luc-de-zen-on/luc-de-zen-on/node_modules/rollup/dist/shared/rollup.js:17187:12)
      at Module.setSource (/home/runner/work/luc-de-zen-on/luc-de-zen-on/node_modules/rollup/dist/shared/rollup.js:18935:24)
      at ModuleLoader.addModuleSource (/home/runner/work/luc-de-zen-on/luc-de-zen-on/node_modules/rollup/dist/shared/rollup.js:22581:13)


Error: Process completed with exit code 1.