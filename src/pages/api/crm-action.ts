
import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

// UWAGA: W prawdziwej aplikacji ten stan byłby przechowywany w bazie danych (np. D1 lub KV).
// Na potrzeby tej symulacji, stan jest przechowywany w pamięci i resetuje się przy każdym restarcie workera.
let crmIntegrations = {
  hubspot: {
    id: "hubspot",
    name: "HubSpot",
    status: "active",
    description: "Marketing Hub, Sales Hub, Service Hub",
    features: { "Contacts sync": "2-way", "Deals tracking": "Enabled", Webhooks: "Active" },
  },
  salesforce: {
    id: "salesforce",
    name: "Salesforce",
    status: "active",
    description: "Sales Cloud, Marketing Cloud",
    features: { "Leads sync": "Real-time", Opportunities: "Auto-create", "Custom fields": "Mapped" },
  },
  pipedrive: {
    id: "pipedrive",
    name: "Pipedrive",
    status: "pending",
    description: "Pipeline management focused",
    features: { "Pipeline sync": "Enabled", Activities: "Auto-log", "Notes sync": "Pending" },
  },
  freshworks: {
    id: "freshworks",
    name: "Freshworks",
    status: "inactive",
    description: "Customer engagement suite",
    features: { Integration: "Not configured", "API ready": "Yes", Estimate: "2 hours" },
  },
};

// Endpoint do pobierania statusu (przeniesiony z crm-status.ts dla spójności stanu)
export const GET: APIRoute = async () => {
  try {
    const recentActivity = [
        { id: 1, crm: 'HubSpot', text: "Lead #2847 zsynchronizowany", status: "success", time: "2 min ago" },
        { id: 2, crm: 'Salesforce', text: "Deal 'Project Phoenix' zaktualizowany", status: "success", time: "5 min ago" },
        { id: 3, crm: 'Pipedrive', text: "Błąd synchronizacji kontaktu: API Key invalid", status: "failed", time: "12 min ago" },
        { id: 4, crm: 'HubSpot', text: "Notatka dodana do kontaktu 'Anna Nowak'", status: "success", time: "18 min ago" },
    ];
    const responseData = {
        integrations: Object.values(crmIntegrations),
        activity: recentActivity,
        stats: { syncedRecords: 2847, avgSyncTime: "0.3s", failedSyncs: 3, successRate: "99.9%" }
    };
    return createSuccessResponse(responseData);
  } catch (error) {
    console.error("Błąd w GET /api/crm-action:", error);
    return createErrorResponse("Błąd podczas pobierania statusu CRM", 500);
  }
};

// Endpoint do zmiany statusu
export const POST: APIRoute = async ({ request }) => {
  try {
    const { crmId, action } = await request.json();

    if (!crmId || !action) {
      return createErrorResponse("Brak crmId lub action.", 400);
    }

    if (!crmIntegrations[crmId]) {
      return createErrorResponse(`Nie znaleziono CRM o id: ${crmId}`, 404);
    }

    if (action === 'toggle') {
      const currentStatus = crmIntegrations[crmId].status;
      // Prosta logika przełączania: active -> inactive, wszystko inne -> active
      crmIntegrations[crmId].status = currentStatus === 'active' ? 'inactive' : 'active';
    } else {
        return createErrorResponse(`Nieznana akcja: ${action}`, 400);
    }

    return createSuccessResponse({
      message: `Status dla ${crmIntegrations[crmId].name} został zmieniony na ${crmIntegrations[crmId].status}`,
      updatedCrm: crmIntegrations[crmId],
    });

  } catch (error) {
    console.error("Błąd w POST /api/crm-action:", error);
    return createErrorResponse("Błąd podczas zmiany statusu CRM", 500);
  }
};
