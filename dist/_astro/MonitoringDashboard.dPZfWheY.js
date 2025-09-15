import{r as i,j as e}from"./react.0nTXIzv_.js";import"./Header.astro_astro_type_script_index_0_lang.C3v9REYp.js";if(typeof MessageChannel>"u"){class s{constructor(){this.onmessage=null}postMessage(n){const o={data:n};(typeof queueMicrotask=="function"?queueMicrotask:l=>setTimeout(l,0))(()=>this.onmessage&&this.onmessage(o))}start(){}close(){}}class x{constructor(){this.port1=new s,this.port2=new s;const n=(o,l)=>{const d={data:l};(typeof queueMicrotask=="function"?queueMicrotask:c=>setTimeout(c,0))(()=>o.onmessage&&o.onmessage(d))};this.port1.postMessage=o=>n(this.port2,o),this.port2.postMessage=o=>n(this.port1,o)}}globalThis.MessageChannel=x}const z=()=>{const[s,x]=i.useState(null),[t,n]=i.useState(null),[o,l]=i.useState(!0),[d,c]=i.useState(null),[f,N]=i.useState(!0),[m,g]=i.useState("health"),w=async()=>{try{const r=await fetch("/api/health?detailed=true");if(!r.ok)throw new Error(`HTTP ${r.status}`);const a=await r.json();x(a)}catch(r){console.error("Failed to fetch health data:",r),c("Failed to load health data")}},j=async()=>{try{const r=await fetch("/api/errors?limit=50");if(!r.ok)throw new Error(`HTTP ${r.status}`);const a=await r.json();n(a)}catch(r){console.error("Failed to fetch error data:",r),c("Failed to load error data")}},b=async()=>{l(!0),c(null);try{await Promise.all([w(),j()])}catch(r){console.error("Failed to load dashboard data:",r)}finally{l(!1)}},k=async()=>{try{(await fetch("/api/errors?action=clear",{method:"DELETE"})).ok&&await j()}catch(r){console.error("Failed to clear errors:",r)}};i.useEffect(()=>{if(b(),f){const r=setInterval(b,3e4);return()=>clearInterval(r)}},[f]);const h=({status:r,children:a})=>e.jsx("span",{className:`status-badge status-${r}`,children:a}),M=r=>{const a=Math.floor(r/1e3),p=Math.floor(a/60),u=Math.floor(p/60),v=Math.floor(u/24);return v>0?`${v}d ${u%24}h`:u>0?`${u}h ${p%60}m`:p>0?`${p}m ${a%60}s`:`${a}s`},y=r=>new Date(r).toLocaleString();return o?e.jsxs("div",{className:"dashboard-loading",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{children:"Loading monitoring data..."})]}):e.jsxs("div",{className:"monitoring-dashboard",children:[e.jsxs("div",{className:"dashboard-header",children:[e.jsx("h1",{children:"System Monitoring Dashboard"}),e.jsxs("div",{className:"dashboard-controls",children:[e.jsxs("label",{className:"auto-refresh-toggle",children:[e.jsx("input",{type:"checkbox",checked:f,onChange:r=>N(r.target.checked)}),"Auto-refresh (30s)"]}),e.jsx("button",{onClick:b,className:"refresh-btn",children:"🔄 Refresh"})]})]}),d&&e.jsxs("div",{className:"dashboard-error",children:["⚠️ ",d]}),e.jsxs("div",{className:"dashboard-tabs",children:[e.jsx("button",{className:`tab-btn ${m==="health"?"active":""}`,onClick:()=>g("health"),children:"System Health"}),e.jsxs("button",{className:`tab-btn ${m==="errors"?"active":""}`,onClick:()=>g("errors"),children:["Error Logs",(t?.summary.last24Hours||0)>0&&e.jsx("span",{className:"error-count",children:t?.summary.last24Hours})]})]}),m==="health"&&s&&e.jsxs("div",{className:"health-panel",children:[e.jsxs("div",{className:"health-overview",children:[e.jsxs("div",{className:"health-card",children:[e.jsx("h3",{children:"Overall Status"}),e.jsx(h,{status:s.status,children:s.status.toUpperCase()})]}),e.jsxs("div",{className:"health-card",children:[e.jsx("h3",{children:"Uptime"}),e.jsx("div",{className:"metric-value",children:M(s.uptime)})]}),e.jsxs("div",{className:"health-card",children:[e.jsx("h3",{children:"Version"}),e.jsx("div",{className:"metric-value",children:s.version})]}),s.performance&&e.jsxs("div",{className:"health-card",children:[e.jsx("h3",{children:"Performance"}),e.jsxs("div",{className:"metric-value",children:[s.performance.averageResponseTime.toFixed(1),"ms avg"]}),e.jsxs("div",{className:"metric-detail",children:[s.performance.requestCount," requests",s.performance.errorRate>0&&e.jsxs("span",{className:"error-rate",children:["• ",s.performance.errorRate.toFixed(1),"% errors"]})]})]}),s.memoryUsage&&e.jsxs("div",{className:"health-card",children:[e.jsx("h3",{children:"Memory"}),e.jsxs("div",{className:"metric-value",children:[s.memoryUsage.percentage.toFixed(1),"%"]}),e.jsxs("div",{className:"metric-detail",children:[s.memoryUsage.used.toFixed(1),"MB / ",s.memoryUsage.total.toFixed(1),"MB"]})]})]}),e.jsx("div",{className:"services-grid",children:s.services.map(r=>e.jsxs("div",{className:"service-card",children:[e.jsxs("div",{className:"service-header",children:[e.jsx("h4",{children:r.name}),e.jsx(h,{status:r.status,children:r.status})]}),e.jsxs("div",{className:"service-metrics",children:[e.jsxs("div",{className:"metric",children:[e.jsx("span",{className:"metric-label",children:"Response Time:"}),e.jsxs("span",{className:"metric-value",children:[r.responseTime.toFixed(1),"ms"]})]}),e.jsxs("div",{className:"metric",children:[e.jsx("span",{className:"metric-label",children:"Last Check:"}),e.jsx("span",{className:"metric-value",children:y(r.lastCheck)})]})]}),r.error&&e.jsxs("div",{className:"service-error",children:["❌ ",r.error]}),r.details&&e.jsxs("details",{className:"service-details",children:[e.jsx("summary",{children:"Details"}),e.jsx("pre",{children:JSON.stringify(r.details,null,2)})]})]},r.name))})]}),m==="errors"&&t&&e.jsxs("div",{className:"errors-panel",children:[e.jsxs("div",{className:"errors-header",children:[e.jsxs("div",{className:"errors-summary",children:[e.jsx("h3",{children:"Error Summary"}),e.jsxs("div",{className:"summary-stats",children:[e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Total:"}),e.jsx("span",{className:"stat-value",children:t.summary.total})]}),e.jsxs("div",{className:"stat",children:[e.jsx("span",{className:"stat-label",children:"Last 24h:"}),e.jsx("span",{className:"stat-value",children:t.summary.last24Hours})]})]})]}),e.jsx("button",{onClick:k,className:"clear-errors-btn",children:"🗑️ Clear All"})]}),e.jsxs("div",{className:"error-type-summary",children:[e.jsxs("div",{className:"type-breakdown",children:[e.jsx("h4",{children:"By Type"}),Object.entries(t.summary.byType).map(([r,a])=>e.jsxs("div",{className:"type-count",children:[e.jsxs("span",{className:"type-name",children:[r,":"]}),e.jsx("span",{className:"type-value",children:a})]},r))]}),e.jsxs("div",{className:"severity-breakdown",children:[e.jsx("h4",{children:"By Severity"}),Object.entries(t.summary.bySeverity).map(([r,a])=>e.jsx("div",{className:"severity-count",children:e.jsxs(h,{status:r==="critical"||r==="high"?"critical":r==="medium"?"warning":"healthy",children:[r,": ",a]})},r))]})]}),e.jsx("div",{className:"errors-list",children:t.errors.map((r,a)=>e.jsxs("div",{className:"error-item",children:[e.jsx("div",{className:"error-header",children:e.jsxs("div",{className:"error-title",children:[e.jsx(h,{status:r.severity==="critical"||r.severity==="high"?"critical":r.severity==="medium"?"warning":"healthy",children:r.severity}),e.jsx("span",{className:"error-type",children:r.type}),e.jsx("span",{className:"error-timestamp",children:y(r.timestamp)})]})}),e.jsx("div",{className:"error-message",children:r.message}),r.url&&e.jsxs("div",{className:"error-url",children:[e.jsx("span",{className:"error-label",children:"URL:"})," ",r.url]}),r.context&&e.jsxs("details",{className:"error-context",children:[e.jsx("summary",{children:"Context"}),e.jsx("pre",{children:JSON.stringify(r.context,null,2)})]}),e.jsxs("details",{className:"error-stack",children:[e.jsx("summary",{children:"Stack Trace"}),e.jsx("pre",{children:r.stackTrace})]})]},a))})]}),e.jsx("style",{children:`
        .monitoring-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          margin: 0;
          color: #1f2937;
        }

        .dashboard-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .auto-refresh-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .refresh-btn {
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .refresh-btn:hover {
          background: #2563eb;
        }

        .dashboard-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .dashboard-loading {
          text-align: center;
          padding: 4rem 2rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .dashboard-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 2rem;
        }

        .tab-btn {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          position: relative;
        }

        .tab-btn.active {
          border-bottom-color: #3b82f6;
          color: #3b82f6;
        }

        .error-count {
          background: #dc2626;
          color: white;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          margin-left: 0.5rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-healthy {
          background: #d1fae5;
          color: #065f46;
        }

        .status-warning {
          background: #fef3c7;
          color: #92400e;
        }

        .status-critical {
          background: #fee2e2;
          color: #991b1b;
        }

        .health-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .health-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .health-card h3 {
          margin: 0 0 1rem 0;
          font-size: 0.875rem;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.05em;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
        }

        .metric-detail {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .error-rate {
          color: #dc2626;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .service-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .service-header h4 {
          margin: 0;
          text-transform: capitalize;
        }

        .service-metrics {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .metric {
          display: flex;
          justify-content: space-between;
        }

        .metric-label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .service-error {
          background: #fef2f2;
          color: #dc2626;
          padding: 0.5rem;
          border-radius: 4px;
          margin-top: 0.5rem;
          font-size: 0.875rem;
        }

        .service-details {
          margin-top: 1rem;
        }

        .service-details pre {
          background: #f9fafb;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          overflow-x: auto;
        }

        .errors-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .errors-summary h3 {
          margin: 0 0 0.5rem 0;
        }

        .summary-stats {
          display: flex;
          gap: 2rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .clear-errors-btn {
          padding: 0.5rem 1rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .clear-errors-btn:hover {
          background: #b91c1c;
        }

        .error-type-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .type-breakdown h4,
        .severity-breakdown h4 {
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .type-count,
        .severity-count {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .errors-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .error-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
        }

        .error-header {
          margin-bottom: 0.5rem;
        }

        .error-title {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .error-type {
          font-weight: 600;
          color: #374151;
        }

        .error-timestamp {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .error-message {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .error-url {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .error-label {
          font-weight: 500;
        }

        .error-context,
        .error-stack {
          margin-top: 0.5rem;
        }

        .error-context pre,
        .error-stack pre {
          background: #f9fafb;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }
      `})]})};export{z as default};
