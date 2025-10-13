// 🔐 Security Guard Agent API - Zaawansowane zarządzanie bezpieczeństwem
import type { APIRoute } from "astro";
import { AGENT_CONFIG } from "./config";

// Symulacja bazy danych dla security events
const securityIncidents: Array<any> = [];
const securityAlerts: Array<any> = [];
const securityPolicies: Map<string, any> = new Map();
const scanResults: Array<any> = [];
const monitoringStatus: Map<string, any> = new Map();
const quarantineItems: Array<any> = [];

// Inicjalizacja domyślnych polityk bezpieczeństwa
let policiesInitialized = false;

function initializeDefaultPolicies() {
  if (!policiesInitialized) {
    AGENT_CONFIG.defaultPolicies.forEach((policy) => {
      securityPolicies.set(policy.id, {
        ...policy,
        createdAt: Date.now(),
        lastTriggered: null,
        triggerCount: 0,
      });
    });
    policiesInitialized = true;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { action, data } = (await request.json()) as any;
    const payload = data && typeof data === "object" ? data : {};

    switch (action) {
      case "test":
        return testAgent();

      case "start-scan":
        return startSecurityScan(payload);

      case "get-scan-results":
        return getScanResults();

      case "get-alerts":
        return getSecurityAlerts();

      case "resolve-alert":
        return resolveAlert(payload);

      case "get-incidents":
        return getSecurityIncidents();

      case "create-incident":
        return createIncident(payload);

      case "get-monitoring-status":
        return getMonitoringStatus();

      case "update-monitoring":
        return updateMonitoring(payload);

      case "get-policies":
        return getSecurityPolicies();

      case "update-policy":
        return updateSecurityPolicy(payload);

      case "get-compliance-report":
        return getComplianceReport(payload);

      case "quarantine-threat":
        return quarantineThreat(payload);

      case "get-quarantine":
        return getQuarantineItems();

      case "generate-report":
        return generateSecurityReport(payload);

      default:
        return errorResponse("Nieprawidłowa akcja");
    }
  } catch (error) {
    return errorResponse(
      `Błąd serwera: ${
        error instanceof Error ? error.message : "Nieznany błąd"
      }`
    );
  }
};

// Test agent functionality
async function testAgent() {
  initializeDefaultPolicies();

  // Wygeneruj przykładowe dane security dla demo
  generateMockSecurityData();

  return new Response(
    JSON.stringify({
      success: true,
      message: "Agent Security Guard działa poprawnie",
      agent: AGENT_CONFIG.displayName,
      capabilities: AGENT_CONFIG.capabilities,
      monitoringAreas: AGENT_CONFIG.monitoringAreas.map((area) => area.name),
      threatTypes: AGENT_CONFIG.threatTypes.length,
      policiesActive: securityPolicies.size,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Start security scan
async function startSecurityScan(data: any) {
  const {
    scanType = "quick",
    targets = ["filesystem", "network", "processes"],
  } = data;

  const scanId = generateId();
  const startTime = Date.now();

  // Symulacja skanowania z losowymi wynikami
  const mockThreats = generateMockThreats(scanType);
  const endTime = Date.now() + (scanType === "deep" ? 30000 : 10000); // Symulacja czasu skanowania

  const scanResult = {
    id: scanId,
    type: scanType,
    targets,
    startTime,
    endTime,
    status: "completed",
    threatsFound: mockThreats.length,
    threats: mockThreats,
    scannedItems: scanType === "deep" ? 15847 : 3241,
    cleanItems:
      scanType === "deep"
        ? 15847 - mockThreats.length
        : 3241 - mockThreats.length,
    duration: endTime - startTime,
  };

  scanResults.unshift(scanResult);

  // Zachowaj tylko 50 ostatnich skanów
  if (scanResults.length > 50) {
    scanResults.pop();
  }

  // Utwórz alerty dla znalezionych zagrożeń
  mockThreats.forEach((threat) => {
    const alert = {
      id: generateId(),
      type: "threat_detected",
      severity: threat.severity,
      title: `Wykryto zagrożenie: ${threat.name}`,
      description: threat.description,
      source: threat.location,
      scanId,
      status: "active",
      createdAt: Date.now(),
      resolvedAt: null,
    };
    securityAlerts.unshift(alert);
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: `Skanowanie ${
        scanType === "deep" ? "głębokie" : "szybkie"
      } zakończone pomyślnie`,
      scanResult,
      threatsFound: mockThreats.length,
      alertsCreated: mockThreats.length,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get scan results
async function getScanResults() {
  return new Response(
    JSON.stringify({
      success: true,
      scans: scanResults.slice(0, 20), // Ostatnie 20 skanów
      total: scanResults.length,
      lastScan: scanResults[0] || null,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get security alerts
async function getSecurityAlerts() {
  const activeAlerts = securityAlerts.filter(
    (alert) => alert.status === "active"
  );
  const resolvedAlerts = securityAlerts.filter(
    (alert) => alert.status === "resolved"
  );

  return new Response(
    JSON.stringify({
      success: true,
      alerts: securityAlerts.slice(0, 50), // Ostatnie 50 alertów
      summary: {
        total: securityAlerts.length,
        active: activeAlerts.length,
        resolved: resolvedAlerts.length,
        critical: securityAlerts.filter((a) => a.severity === "CRITICAL")
          .length,
        high: securityAlerts.filter((a) => a.severity === "HIGH").length,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Resolve alert
async function resolveAlert(data: any) {
  const { alertId, resolution, notes } = data;

  const alertIndex = securityAlerts.findIndex((alert) => alert.id === alertId);
  if (alertIndex === -1) {
    return errorResponse("Alert nie został znaleziony");
  }

  securityAlerts[alertIndex] = {
    ...securityAlerts[alertIndex],
    status: "resolved",
    resolution: resolution || "manual",
    notes: notes || "",
    resolvedAt: Date.now(),
    resolvedBy: "security-agent",
  };

  return new Response(
    JSON.stringify({
      success: true,
      message: "Alert został rozwiązany",
      alert: securityAlerts[alertIndex],
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get security incidents
async function getSecurityIncidents() {
  return new Response(
    JSON.stringify({
      success: true,
      incidents: securityIncidents.slice(0, 30), // Ostatnie 30 incydentów
      total: securityIncidents.length,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Create incident
async function createIncident(data: any) {
  const { title, description, severity, category, source } = data;

  if (!title || !severity) {
    return errorResponse("Brak wymaganych pól: title, severity");
  }

  const incident = {
    id: generateId(),
    title,
    description: description || "",
    severity,
    category: category || "unknown",
    source: source || "manual",
    status: "open",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    resolvedAt: null,
    assignedTo: null,
    timeline: [
      {
        timestamp: Date.now(),
        action: "created",
        description: "Incydent został utworzony",
        user: "security-agent",
      },
    ],
  };

  securityIncidents.unshift(incident);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Incydent bezpieczeństwa został utworzony",
      incident,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get monitoring status
async function getMonitoringStatus() {
  // Inicjalizacja statusu monitorowania jeśli nie istnieje
  if (monitoringStatus.size === 0) {
    AGENT_CONFIG.monitoringAreas.forEach((area) => {
      monitoringStatus.set(area.id, {
        id: area.id,
        name: area.name,
        icon: area.icon,
        status: Math.random() > 0.1 ? "active" : "warning", // 90% aktywnych
        lastCheck: Date.now() - Math.floor(Math.random() * 300000), // Ostatnie 5 minut
        eventsCount: Math.floor(Math.random() * 100),
        threatsDetected: Math.floor(Math.random() * 5),
      });
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      monitoring: Array.from(monitoringStatus.values()),
      summary: {
        total: monitoringStatus.size,
        active: Array.from(monitoringStatus.values()).filter(
          (m) => m.status === "active"
        ).length,
        warning: Array.from(monitoringStatus.values()).filter(
          (m) => m.status === "warning"
        ).length,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Update monitoring settings
async function updateMonitoring(data: any) {
  const { areaId, enabled, settings } = data;

  if (!areaId || !monitoringStatus.has(areaId)) {
    return errorResponse("Nieprawidłowy obszar monitorowania");
  }

  const area = monitoringStatus.get(areaId);
  monitoringStatus.set(areaId, {
    ...area,
    status: enabled ? "active" : "disabled",
    settings: { ...(area?.settings ?? {}), ...(settings ?? {}) },
    lastUpdated: Date.now(),
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: `Monitorowanie ${area.name} zostało zaktualizowane`,
      area: monitoringStatus.get(areaId),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get security policies
async function getSecurityPolicies() {
  initializeDefaultPolicies();

  return new Response(
    JSON.stringify({
      success: true,
      policies: Array.from(securityPolicies.values()),
      count: securityPolicies.size,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Update security policy
async function updateSecurityPolicy(data: any) {
  const { policyId, enabled, threshold, settings } = data;

  if (!policyId || !securityPolicies.has(policyId)) {
    return errorResponse("Polityka nie została znaleziona");
  }

  const policy = securityPolicies.get(policyId);
  const updatedPolicy = {
    ...policy,
    enabled: enabled !== undefined ? enabled : policy.enabled,
    threshold: threshold !== undefined ? threshold : policy.threshold,
    settings: { ...(policy?.settings ?? {}), ...(settings ?? {}) },
    updatedAt: Date.now(),
  };

  securityPolicies.set(policyId, updatedPolicy);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Polityka bezpieczeństwa została zaktualizowana",
      policy: updatedPolicy,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get compliance report
async function getComplianceReport(data: any) {
  const { framework = "gdpr" } = data;

  // Symulacja raportu zgodności
  const mockCompliance = {
    framework,
    frameworkName:
      AGENT_CONFIG.complianceFrameworks.find((f) => f.id === framework)?.name ||
      framework.toUpperCase(),
    score: 85 + Math.floor(Math.random() * 10), // 85-95%
    lastAssessment: Date.now() - 86400000 * 7, // 7 dni temu
    requirements: [
      { id: 1, name: "Szyfrowanie danych", status: "compliant", score: 95 },
      { id: 2, name: "Kontrola dostępu", status: "compliant", score: 88 },
      { id: 3, name: "Monitorowanie zdarzeń", status: "compliant", score: 92 },
      { id: 4, name: "Kopie zapasowe", status: "partial", score: 76 },
      {
        id: 5,
        name: "Szkolenia personelu",
        status: "non-compliant",
        score: 45,
      },
    ],
    recommendations: [
      "Wdrożenie automatycznych kopii zapasowych",
      "Przeprowadzenie szkoleń z cyberbezpieczeństwa",
      "Aktualizacja procedur reakcji na incydenty",
    ],
  };

  return new Response(
    JSON.stringify({
      success: true,
      compliance: mockCompliance,
      frameworks: AGENT_CONFIG.complianceFrameworks,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Quarantine threat
async function quarantineThreat(data: any) {
  const { threatId, location, reason } = data;

  if (!threatId || !location) {
    return errorResponse("Brak wymaganych danych do kwarantanny");
  }

  const quarantineItem = {
    id: generateId(),
    threatId,
    location,
    reason: reason || "Detected security threat",
    quarantinedAt: Date.now(),
    status: "quarantined",
    restorable: true,
    size: Math.floor(Math.random() * 1000000), // Symulacja rozmiaru pliku
  };

  quarantineItems.unshift(quarantineItem);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Zagrożenie zostało poddane kwarantannie",
      quarantineItem,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get quarantine items
async function getQuarantineItems() {
  return new Response(
    JSON.stringify({
      success: true,
      quarantine: quarantineItems,
      count: quarantineItems.length,
      totalSize: quarantineItems.reduce(
        (sum, item) => sum + (item.size || 0),
        0
      ),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Generate security report
async function generateSecurityReport(data: any) {
  const { period = "7d", format = "json" } = data;

  // Symulacja raportu bezpieczeństwa
  const report = {
    period,
    generatedAt: Date.now(),
    summary: {
      totalScans: scanResults.length,
      threatsDetected: scanResults.reduce(
        (sum, scan) => sum + scan.threatsFound,
        0
      ),
      incidentsCreated: securityIncidents.length,
      alertsTriggered: securityAlerts.length,
      quarantinedItems: quarantineItems.length,
    },
    threatsByType: AGENT_CONFIG.threatTypes.map((type) => ({
      type: type.name,
      count: Math.floor(Math.random() * 10),
      severity: type.severity,
    })),
    topAlerts: securityAlerts.slice(0, 5),
    recommendations: [
      "Regularnie aktualizuj oprogramowanie antywirusowe",
      "Przeprowadź szkolenie personelu z cyberbezpieczeństwa",
      "Wdróż uwierzytelnianie dwuskładnikowe",
      "Zwiększ częstotliwość skanowania systemu",
    ],
  };

  return new Response(
    JSON.stringify({
      success: true,
      message: `Raport bezpieczeństwa (${period}) został wygenerowany`,
      report,
      downloadUrl:
        format !== "json"
          ? `/api/agents/agent-08/download-report/${generateId()}.${format}`
          : null,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Helper functions
function generateMockSecurityData() {
  // Wygeneruj przykładowe alerty
  if (securityAlerts.length === 0) {
    const mockAlerts = [
      {
        id: generateId(),
        type: "suspicious_login",
        severity: "MEDIUM",
        title: "Podejrzane logowanie z nowej lokalizacji",
        description: "Wykryto logowanie z nieznanego adresu IP: 192.168.1.100",
        source: "authentication_system",
        status: "active",
        createdAt: Date.now() - 3600000, // 1 godzina temu
      },
      {
        id: generateId(),
        type: "malware_detected",
        severity: "HIGH",
        title: "Wykryto potencjalne malware",
        description:
          "Plik suspicious.exe został oznaczony jako potencjalne zagrożenie",
        source: "file_system_monitor",
        status: "active",
        createdAt: Date.now() - 7200000, // 2 godziny temu
      },
    ];

    securityAlerts.push(...mockAlerts);
  }
}

function generateMockThreats(scanType: string): Array<any> {
  const threatCount =
    scanType === "deep"
      ? Math.floor(Math.random() * 8)
      : Math.floor(Math.random() * 3);
  const threats = [];

  for (let i = 0; i < threatCount; i++) {
    const threatType =
      AGENT_CONFIG.threatTypes[
        Math.floor(Math.random() * AGENT_CONFIG.threatTypes.length)
      ];
    threats.push({
      id: generateId(),
      name: `${threatType.name} #${i + 1}`,
      type: threatType.id,
      severity: threatType.severity,
      description: `Wykryto ${threatType.name.toLowerCase()} w systemie`,
      location: generateMockLocation(),
      detectedAt: Date.now(),
      quarantined: false,
    });
  }

  return threats;
}

function generateMockLocation(): string {
  const locations = [
    "C:\\Windows\\System32\\suspicious.exe",
    "C:\\Users\\Public\\malware.dll",
    "/tmp/backdoor.sh",
    "C:\\Program Files\\Unknown\\trojan.exe",
    "/var/log/suspicious.log",
    "C:\\Users\\User\\Downloads\\virus.zip",
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function errorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}
