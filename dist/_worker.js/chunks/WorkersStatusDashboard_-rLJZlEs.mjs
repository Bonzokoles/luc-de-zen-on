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
import { j as attr_class, k as escape_html, A as attr_style, n as attr, i as ensure_array_like, l as stringify } from './vendor_DlPT8CWO.mjs';
/* empty css                                      */

function WorkersStatusDashboard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let workers = [];
		let metrics = {};
		let loading = false;
		let autoRefresh = true;

		// Status color mapping
		function getStatusColor(status) {
			switch (status) {
				case "online":
					return "text-green-400";

				case "partial":
					return "text-yellow-400";

				case "offline":
					return "text-red-400";

				default:
					return "text-gray-400";
			}
		}

		function getStatusBg(status) {
			switch (status) {
				case "online":
					return "bg-green-500/20 border-green-500/30";

				case "partial":
					return "bg-yellow-500/20 border-yellow-500/30";

				case "offline":
					return "bg-red-500/20 border-red-500/30";

				default:
					return "bg-gray-500/20 border-gray-500/30";
			}
		}

		function formatTime(isoString) {
			return new Date(isoString).toLocaleTimeString("pl-PL");
		}

		function formatUptime(uptime) {
			return uptime || "0%";
		}

		$$renderer.push(`<div class="w-full bg-[#111111] border border-[#333333] glass-effect p-6 svelte-9s5lrx"><div class="flex items-center justify-between mb-6"><div><h2 class="text-2xl font-bold text-[#00ffff] font-['Neuropol'] uppercase tracking-wider">🔧 Status Workerów</h2> <p class="text-[#a0a0a0] font-['Kenyan_Coffee'] mt-1">Zaawansowany monitoring systemu AI funkcji w czasie rzeczywistym</p></div> <div class="flex items-center gap-3"><button${attr_class('px-3 py-1 text-xs font-[\'Neuropol\'] uppercase border transition-all duration-300 svelte-9s5lrx', void 0, {
			'auto-refresh-active': autoRefresh,
			'auto-refresh-inactive': !autoRefresh
		})}>Auto: ${escape_html("ON" )}</button> `);

		if (metrics.lastUpdate) {
			$$renderer.push('<!--[-->');
			$$renderer.push(`<span class="text-xs text-[#666666] font-['Kenyan_Coffee']">Last: ${escape_html(formatTime(metrics.lastUpdate))}</span>`);
		} else {
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--></div></div> `);

		if (metrics.totalWorkers) {
			$$renderer.push('<!--[-->');
			$$renderer.push(`<div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"><div class="p-3 bg-[#0a0a0a] border border-[#333333] text-center"><div class="text-lg font-bold text-[#00ffff] font-['Neuropol']">${escape_html(metrics.onlineWorkers)}</div> <div class="text-xs text-[#a0a0a0] uppercase">Online</div></div> <div class="p-3 bg-[#0a0a0a] border border-[#333333] text-center"><div class="text-lg font-bold text-yellow-400 font-['Neuropol']">${escape_html(metrics.partialWorkers)}</div> <div class="text-xs text-[#a0a0a0] uppercase">Partial</div></div> <div class="p-3 bg-[#0a0a0a] border border-[#333333] text-center"><div class="text-lg font-bold text-red-400 font-['Neuropol']">${escape_html(metrics.offlineWorkers)}</div> <div class="text-xs text-[#a0a0a0] uppercase">Offline</div></div> <div class="p-3 bg-[#0a0a0a] border border-[#333333] text-center"><div class="text-lg font-bold text-[#00ffff] font-['Neuropol']">${escape_html(metrics.totalRequests)}</div> <div class="text-xs text-[#a0a0a0] uppercase">Total Req/min</div></div> <div class="p-3 bg-[#0a0a0a] border border-[#333333] text-center"><div class="text-lg font-bold text-[#00ffff] font-['Neuropol']">${escape_html(metrics.avgResponseTime)}ms</div> <div class="text-xs text-[#a0a0a0] uppercase">Avg Response</div></div></div>`);
		} else {
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		if (metrics.systemHealth !== undefined) {
			$$renderer.push('<!--[-->');

			$$renderer.push(`<div class="mb-6"><div class="flex justify-between text-sm mb-2"><span class="text-[#a0a0a0] font-['Kenyan_Coffee']">Ogólny Stan Systemu</span> <span class="text-[#00ffff] font-['Neuropol']">${escape_html(Math.round(metrics.systemHealth))}%</span></div> <div class="w-full bg-[#333333] h-2 border border-[#555555]"><div${attr_class('h-full transition-all duration-500', void 0, {
				'bg-green-500': metrics.systemHealth >= 80,
				'bg-yellow-500': metrics.systemHealth >= 50 && metrics.systemHealth < 80,
				'bg-red-500': metrics.systemHealth < 50
			})}${attr_style(`width: ${stringify(metrics.systemHealth)}%`)}></div></div></div>`);
		} else {
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> <div class="flex flex-wrap gap-3 mb-6"><button${attr('disabled', loading, true)} class="px-4 py-2 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/20 transition-all duration-300 font-['Neuropol'] uppercase text-sm disabled:opacity-50">${escape_html("🔍 Health Check")}</button> <button class="px-4 py-2 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/20 transition-all duration-300 font-['Neuropol'] uppercase text-sm">${escape_html("📊 Pokaż Monitoring")}</button> <button class="px-4 py-2 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/20 transition-all duration-300 font-['Neuropol'] uppercase text-sm">🔧 API Status</button></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> <div class="mb-4">`);

		{
			$$renderer.push('<!--[!-->');

			if (workers.length > 0) {
				$$renderer.push('<!--[-->');

				$$renderer.push(`<span class="text-[#e0e0e0] font-['Kenyan_Coffee']"><span class="text-green-400">${escape_html(metrics.onlineWorkers)}</span> / <span class="text-[#00ffff]">${escape_html(metrics.totalWorkers)}</span> workerów
        online `);

				if (metrics.systemHealth) {
					$$renderer.push('<!--[-->');
					$$renderer.push(`- System Health: <span class="text-[#00ffff]">${escape_html(Math.round(metrics.systemHealth))}%</span>`);
				} else {
					$$renderer.push('<!--[!-->');
				}

				$$renderer.push(`<!--]--></span>`);
			} else {
				$$renderer.push('<!--[!-->');
				$$renderer.push(`<span class="text-[#a0a0a0] font-['Kenyan_Coffee']">Brak danych o workerach</span>`);
			}

			$$renderer.push(`<!--]-->`);
		}

		$$renderer.push(`<!--]--></div> <div class="overflow-x-auto border border-[#333333]"><table class="min-w-full bg-[#0a0a0a]"><thead><tr class="border-b border-[#333333]"><th class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm">Nazwa Workera</th><th class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm">Status</th><th class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm">CPU</th><th class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm">RAM</th><th class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm">Req/min</th><th class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm">Response</th><th class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm">Uptime</th><th class="px-4 py-3 text-left text-[#00ffff] font-['Neuropol'] uppercase text-sm">Last Check</th></tr></thead><tbody><!--[-->`);

		const each_array = ensure_array_like(workers);

		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let worker = each_array[i];

			$$renderer.push(`<tr class="border-b border-[#333333]/50 hover:bg-[#111111] transition-colors duration-200"><td class="px-4 py-3"><div class="text-[#e0e0e0] font-['Kenyan_Coffee'] font-medium">${escape_html(worker.name)}</div> <div class="text-xs text-[#666666] font-['Kenyan_Coffee']">${escape_html(worker.endpoint)}</div></td><td class="px-4 py-3"><span${attr_class(`px-2 py-1 text-xs font-['Neuropol'] uppercase border ${stringify(getStatusBg(worker.status))} ${stringify(getStatusColor(worker.status))}`, 'svelte-9s5lrx')}>${escape_html(worker.status)}</span></td><td class="px-4 py-3 text-[#e0e0e0] font-['Kenyan_Coffee']">${escape_html(worker.cpu !== null ? worker.cpu + "%" : "-")}</td><td class="px-4 py-3 text-[#e0e0e0] font-['Kenyan_Coffee']">${escape_html(worker.ram !== null ? worker.ram + "%" : "-")}</td><td class="px-4 py-3 text-[#e0e0e0] font-['Kenyan_Coffee']">${escape_html(worker.requests || 0)}</td><td class="px-4 py-3 text-[#e0e0e0] font-['Kenyan_Coffee']">${escape_html(worker.responseMs !== null ? worker.responseMs + "ms" : "-")}</td><td class="px-4 py-3 text-[#e0e0e0] font-['Kenyan_Coffee']">${escape_html(formatUptime(worker.uptime))}</td><td class="px-4 py-3 text-[#a0a0a0] font-['Kenyan_Coffee'] text-sm">${escape_html(worker.lastCheck ? formatTime(worker.lastCheck) : "-")}</td></tr>`);
		}

		$$renderer.push(`<!--]--></tbody></table></div> <div class="mt-6 flex flex-col gap-3"><button${attr('disabled', loading, true)} class="w-full p-3 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/20 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide disabled:opacity-50">${escape_html("Sprawdź Wszystkie Workery")}</button> <button class="w-full p-3 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] hover:bg-[#00ffff]/20 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide">${escape_html("Pokaż")} Szczegółowy Monitor</button></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--></div>`);
	});
}

export { WorkersStatusDashboard as W };
