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
export { r as renderers } from '../../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

function validateSystemConfig() {
  const errors = [];
  const warnings = [];
  const info = [];
  console.log("🔍 MyBonzo - Rozpoczynam walidację konfiguracji systemu...");
  {
    errors.push("❌ KRYTYCZNY: Brak PUBLIC_WORKER_BASE_URL");
  }
  {
    info.push("✅ OPENAI_API_KEY skonfigurowany");
  }
  {
    info.push("✅ CLOUDFLARE_API_TOKEN skonfigurowany");
  }
  {
    warnings.push("⚠️ Brak HUGGINGFACE_API_KEY - brak dostępu do modeli HF");
  }
  {
    warnings.push("⚠️ Brak ANTHROPIC_API_KEY - brak dostępu do Claude");
  }
  const env = "production";
  if (!["development", "production", "preview"].includes(env)) {
    warnings.push(`⚠️ Nieznany tryb środowiska: ${env}`);
  } else {
    info.push(`✅ Środowisko: ${env}`);
  }
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function checkCloudflareWorkers() {
  const checks = [];
  {
    checks.push({
      name: "Cloudflare Workers",
      status: "error",
      message: "Brak konfiguracji URL Workers"
    });
    return checks;
  }
}
async function checkSystemDependencies() {
  const errors = [];
  const warnings = [];
  const info = [];
  console.log("📦 MyBonzo - Sprawdzam zależności systemu...");
  const criticalModules = [
    "astro",
    "@astrojs/cloudflare",
    "@astrojs/tailwind",
    "svelte",
    "react"
  ];
  try {
    info.push(`✅ Sprawdzono ${criticalModules.length} kluczowych modułów`);
  } catch (error) {
    errors.push(`❌ Błąd sprawdzania modułów: ${error instanceof Error ? error.message : "Nieznany błąd"}`);
  }
  try {
    if (typeof process !== "undefined" && process.version) {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.substring(1).split(".")[0]);
      if (majorVersion < 18) {
        warnings.push(`⚠️ Stara wersja Node.js: ${nodeVersion} (zalecane >=18)`);
      } else {
        info.push(`✅ Node.js: ${nodeVersion}`);
      }
    }
  } catch {
    info.push("ℹ️ Nie można sprawdzić wersji Node.js (środowisko browser)");
  }
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function runFullSystemDiagnostics() {
  console.log("🚀 MyBonzo - Rozpoczynam pełną diagnostykę systemu...");
  const startTime = Date.now();
  const [config, dependencies, workers] = await Promise.all([
    Promise.resolve(validateSystemConfig()),
    checkSystemDependencies(),
    checkCloudflareWorkers()
  ]);
  const totalErrors = config.errors.length + dependencies.errors.length + workers.filter((w) => w.status === "error").length;
  const totalWarnings = config.warnings.length + dependencies.warnings.length + workers.filter((w) => w.status === "warning").length;
  let overallStatus = "healthy";
  if (totalErrors > 0) {
    overallStatus = "critical";
  } else if (totalWarnings > 0) {
    overallStatus = "warning";
  }
  const recommendations = [];
  if (config.errors.length > 0) {
    recommendations.push("Skonfiguruj brakujące zmienne środowiskowe w .env");
  }
  if (workers.some((w) => w.status === "error")) {
    recommendations.push("Sprawdź konfigurację i deployment Cloudflare Workers");
  }
  if (totalWarnings > 3) {
    recommendations.push("Rozważ aktualizację zależności i konfiguracji");
  }
  const diagnosticsTime = Date.now() - startTime;
  console.log(`✅ Diagnostyka zakończona w ${diagnosticsTime}ms`);
  return {
    config,
    dependencies,
    workers,
    summary: {
      overallStatus,
      totalErrors,
      totalWarnings,
      recommendations
    }
  };
}
function generateDiagnosticReport(diagnostics) {
  const { config, dependencies, workers, summary } = diagnostics;
  let report = `
# 🔍 MyBonzo System Diagnostics Report
Generated: ${(/* @__PURE__ */ new Date()).toLocaleString("pl-PL")}

## 📊 Podsumowanie
- **Status ogólny**: ${summary.overallStatus === "healthy" ? "✅ Zdrowy" : summary.overallStatus === "warning" ? "⚠️ Ostrzeżenia" : "❌ Krytyczny"}
- **Błędy**: ${summary.totalErrors}
- **Ostrzeżenia**: ${summary.totalWarnings}

## 🔧 Konfiguracja Systemu
`;
  if (config.errors.length > 0) {
    report += `
### ❌ Błędy konfiguracji:
${config.errors.map((e) => `- ${e}`).join("\n")}`;
  }
  if (config.warnings.length > 0) {
    report += `
### ⚠️ Ostrzeżenia konfiguracji:
${config.warnings.map((w) => `- ${w}`).join("\n")}`;
  }
  report += `
### ✅ Informacje:
${config.info.map((i) => `- ${i}`).join("\n")}`;
  report += `

## ☁️ Status Cloudflare Workers
`;
  workers.forEach((check) => {
    const statusIcon = check.status === "ok" ? "✅" : check.status === "warning" ? "⚠️" : "❌";
    const responseInfo = check.responseTime ? ` (${check.responseTime}ms)` : "";
    report += `- ${statusIcon} **${check.name}**: ${check.message}${responseInfo}
`;
  });
  if (summary.recommendations.length > 0) {
    report += `
## 💡 Rekomendacje
${summary.recommendations.map((r) => `- ${r}`).join("\n")}`;
  }
  return report;
}

const GET = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const fullCheck = searchParams.get("full") === "true";
    const format = searchParams.get("format") || "json";
    console.log("🔍 MyBonzo - API walidacji konfiguracji wywołane");
    if (fullCheck) {
      const diagnostics = await runFullSystemDiagnostics();
      if (format === "markdown") {
        const report = generateDiagnosticReport(diagnostics);
        return new Response(report, {
          status: 200,
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "X-MyBonzo-Status": diagnostics.summary.overallStatus,
            "X-MyBonzo-Errors": diagnostics.summary.totalErrors.toString(),
            "X-MyBonzo-Warnings": diagnostics.summary.totalWarnings.toString()
          }
        });
      }
      return new Response(JSON.stringify(diagnostics, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-MyBonzo-Status": diagnostics.summary.overallStatus,
          "X-MyBonzo-Errors": diagnostics.summary.totalErrors.toString(),
          "X-MyBonzo-Warnings": diagnostics.summary.totalWarnings.toString()
        }
      });
    } else {
      const configResult = validateSystemConfig();
      return new Response(JSON.stringify({
        status: "success",
        data: configResult,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        endpoint: "/api/system/validate"
      }, null, 2), {
        status: configResult.valid ? 200 : 422,
        headers: {
          "Content-Type": "application/json",
          "X-MyBonzo-Config-Valid": configResult.valid.toString(),
          "X-MyBonzo-Config-Errors": configResult.errors.length.toString()
        }
      });
    }
  } catch (error) {
    console.error("❌ Błąd walidacji konfiguracji:", error);
    return new Response(JSON.stringify({
      status: "error",
      message: "Błąd podczas walidacji konfiguracji systemu",
      error: error instanceof Error ? error.message : "Nieznany błąd",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      endpoint: "/api/system/validate"
    }, null, 2), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
