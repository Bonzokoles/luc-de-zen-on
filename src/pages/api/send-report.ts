import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { report, email, type } = (await request.json()) as any;

    console.log("Report send request:", {
      email,
      type,
      reportSize: JSON.stringify(report).length,
    });

    // Symulacja wysyłania emaila
    // W prawdziwej implementacji używalibyśmy:
    // - SendGrid, Mailgun, AWS SES, etc.

    const emailData = {
      to: email,
      subject: `Workers Status Report - ${new Date().toLocaleDateString(
        "pl-PL"
      )}`,
      html: generateReportHTML(report),
      attachments: [
        {
          filename: `workers-report-${
            new Date().toISOString().split("T")[0]
          }.json`,
          content: JSON.stringify(report, null, 2),
          contentType: "application/json",
        },
      ],
    };

    // Symulacja wysyłania
    const emailSent = await sendEmail(emailData);

    if (emailSent) {
      // Zapisz w logach/bazie danych
      await logReportSend(report, email, type);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Raport został wysłany na email",
          sentAt: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } else {
      throw new Error("Failed to send email");
    }
  } catch (error) {
    console.error("Report send error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to send report",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};

function generateReportHTML(report: any): string {
  return `
    <h2>🤖 AI Workers Status Report</h2>
    <p><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString(
      "pl-PL"
    )}</p>
    
    <h3>📊 Summary</h3>
    <ul>
      <li><strong>Total Workers:</strong> ${report.totalWorkers}</li>
      <li><strong>Online Workers:</strong> ${report.onlineWorkers}</li>
      <li><strong>Average Response Time:</strong> ${
        report.avgResponseTime
      }ms</li>
      <li><strong>Total Requests (24h):</strong> ${report.totalRequests24h}</li>
    </ul>

    <h3>⚠️ Health Analysis</h3>
    <ul>
      <li><strong>Healthy Workers:</strong> ${
        report.summary.healthyWorkers
      }</li>
      <li><strong>Problematic Workers:</strong> ${
        report.summary.problematicWorkers
      }</li>
      <li><strong>High CPU Workers:</strong> ${
        report.summary.highCpuWorkers
      }</li>
      <li><strong>High RAM Workers:</strong> ${
        report.summary.highRamWorkers
      }</li>
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
      ${report.workers
        .map(
          (worker: any) => `
        <tr>
          <td>${worker.name}</td>
          <td style="color: ${
            worker.status === "online" ? "green" : "red"
          }">${worker.status.toUpperCase()}</td>
          <td>${worker.cpu}%</td>
          <td>${worker.ram}%</td>
          <td>${worker.requests}</td>
          <td>${worker.responseMs}ms</td>
        </tr>
      `
        )
        .join("")}
    </table>

    <p><em>Raport wygenerowany automatycznie przez AI Workers Platform</em></p>
  `;
}

async function sendEmail(emailData: any): Promise<boolean> {
  // Symulacja wysyłania emaila
  // W prawdziwej implementacji:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  try {
    await sgMail.send({
      to: emailData.to,
      from: 'reports@zen-platform.com',
      subject: emailData.subject,
      html: emailData.html,
      attachments: emailData.attachments
    });
    return true;
  } catch (error) {
    console.error('SendGrid error:', error);
    return false;
  }
  */

  // Mock success
  console.log("Email would be sent:", {
    to: emailData.to,
    subject: emailData.subject,
    htmlLength: emailData.html.length,
    attachments: emailData.attachments.length,
  });

  return true;
}

async function logReportSend(
  report: any,
  email: string,
  type: string
): Promise<void> {
  // Symulacja logowania do bazy danych
  const logEntry = {
    timestamp: new Date().toISOString(),
    email: email,
    type: type,
    reportId: `report_${Date.now()}`,
    workersCount: report.totalWorkers,
    onlineCount: report.onlineWorkers,
  };

  console.log("Report send logged:", logEntry);

  // W prawdziwej implementacji zapisalibyśmy do bazy danych
}
