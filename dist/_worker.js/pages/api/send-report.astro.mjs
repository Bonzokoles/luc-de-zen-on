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
export { d as renderers } from '../../chunks/vendor_DCrrhcp4.mjs';

const POST = async ({ request }) => {
  try {
    const { report, email, type } = await request.json();
    console.log("Report send request:", { email, type, reportSize: JSON.stringify(report).length });
    const emailData = {
      to: email,
      subject: `Workers Status Report - ${(/* @__PURE__ */ new Date()).toLocaleDateString("pl-PL")}`,
      html: generateReportHTML(report),
      attachments: [{
        filename: `workers-report-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`,
        content: JSON.stringify(report, null, 2),
        contentType: "application/json"
      }]
    };
    const emailSent = await sendEmail(emailData);
    if (emailSent) {
      await logReportSend(report, email, type);
      return new Response(JSON.stringify({
        success: true,
        message: "Raport został wysłany na email",
        sentAt: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } else {
      throw new Error("Failed to send email");
    }
  } catch (error) {
    console.error("Report send error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to send report"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
function generateReportHTML(report) {
  return `
    <h2>🤖 AI Workers Status Report</h2>
    <p><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString("pl-PL")}</p>
    
    <h3>📊 Summary</h3>
    <ul>
      <li><strong>Total Workers:</strong> ${report.totalWorkers}</li>
      <li><strong>Online Workers:</strong> ${report.onlineWorkers}</li>
      <li><strong>Average Response Time:</strong> ${report.avgResponseTime}ms</li>
      <li><strong>Total Requests (24h):</strong> ${report.totalRequests24h}</li>
    </ul>

    <h3>⚠️ Health Analysis</h3>
    <ul>
      <li><strong>Healthy Workers:</strong> ${report.summary.healthyWorkers}</li>
      <li><strong>Problematic Workers:</strong> ${report.summary.problematicWorkers}</li>
      <li><strong>High CPU Workers:</strong> ${report.summary.highCpuWorkers}</li>
      <li><strong>High RAM Workers:</strong> ${report.summary.highRamWorkers}</li>
    </ul>

    <h3>🔧 Workers Details</h3>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>CPU</th>
        <th>RAM</th>
        <th>Requests (24h)</th>
        <th>Response Time</th>
      </tr>
      ${report.workers.map((worker) => `
        <tr>
          <td>${worker.name}</td>
          <td style="color: ${worker.status === "online" ? "green" : "red"}">${worker.status.toUpperCase()}</td>
          <td>${worker.cpu}%</td>
          <td>${worker.ram}%</td>
          <td>${worker.requests}</td>
          <td>${worker.responseMs}ms</td>
        </tr>
      `).join("")}
    </table>

    <p><em>Raport wygenerowany automatycznie przez AI Workers Platform</em></p>
  `;
}
async function sendEmail(emailData) {
  console.log("Email would be sent:", {
    to: emailData.to,
    subject: emailData.subject,
    htmlLength: emailData.html.length,
    attachments: emailData.attachments.length
  });
  return true;
}
async function logReportSend(report, email, type) {
  const logEntry = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    email,
    type,
    reportId: `report_${Date.now()}`,
    workersCount: report.totalWorkers,
    onlineCount: report.onlineWorkers
  };
  console.log("Report send logged:", logEntry);
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
