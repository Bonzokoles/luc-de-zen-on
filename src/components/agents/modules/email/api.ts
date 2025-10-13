// 📧 Email Handler Agent API - Zaawansowana obsługa poczty elektronicznej
import type { APIRoute } from "astro";
import { AGENT_CONFIG } from "./config";

// Symulacja bazy danych dla emaili, szablonów i kontaktów
const emailAccounts: Map<string, any> = new Map();
const emailTemplates: Map<string, any> = new Map();
const contactLists: Map<string, any> = new Map();
const campaigns: Map<string, any> = new Map();
const emailHistory: Array<any> = [];
const analytics: Map<string, any> = new Map();

// Domyślne szablony email
const defaultTemplates = [
  {
    id: "welcome",
    name: "Szablon powitania",
    type: "welcome",
    subject: "Witamy w {{company}}!",
    content: `
      <h2>Cześć {{name}}!</h2>
      <p>Dziękujemy za rejestrację w naszym serwisie.</p>
      <p>Twoje konto zostało utworzone pomyślnie.</p>
      <br>
      <p>Pozdrawiamy,<br>Zespół {{company}}</p>
    `,
    variables: ["name", "company"],
  },
  {
    id: "newsletter",
    name: "Szablon newslettera",
    type: "newsletter",
    subject: "{{company}} - Nowości z {{month}}",
    content: `
      <h1>Newsletter {{company}}</h1>
      <h2>Nowości z {{month}}</h2>
      <p>{{content}}</p>
      <hr>
      <p><small>Aby zrezygnować z newslettera, kliknij <a href="{{unsubscribe_url}}">tutaj</a></small></p>
    `,
    variables: ["company", "month", "content", "unsubscribe_url"],
  },
];

export const POST: APIRoute = async ({ request }) => {
  try {
    const { action, data } = (await request.json()) as any;

    switch (action) {
      case "test":
        return testAgent();

      case "send-email":
        return sendEmail(data);

      case "get-templates":
        return getTemplates();

      case "create-template":
        return createTemplate(data);

      case "update-template":
        return updateTemplate(data);

      case "delete-template":
        return deleteTemplate(data);

      case "get-contacts":
        return getContacts();

      case "add-contact":
        return addContact(data);

      case "create-campaign":
        return createCampaign(data);

      case "send-campaign":
        return sendCampaign(data);

      case "get-campaigns":
        return getCampaigns();

      case "get-analytics":
        return getAnalytics(data);

      case "configure-account":
        return configureEmailAccount(data);

      case "get-accounts":
        return getEmailAccounts();

      case "get-history":
        return getEmailHistory();

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
  // Załaduj domyślne szablony przy pierwszym teście
  if (emailTemplates.size === 0) {
    defaultTemplates.forEach((template) => {
      emailTemplates.set(template.id, {
        ...template,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Agent Email Handler działa poprawnie",
      agent: AGENT_CONFIG.displayName,
      capabilities: AGENT_CONFIG.capabilities,
      supportedProviders: AGENT_CONFIG.supportedProviders.map((p) => p.name),
      templatesCount: emailTemplates.size,
      accountsCount: emailAccounts.size,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Send email
async function sendEmail(data: any) {
  const { to, subject, content, template, variables, schedule } = data;

  if (!to || (!content && !template)) {
    return errorResponse("Brak odbiorcy lub treści/szablonu");
  }

  let finalContent = content;
  let finalSubject = subject;

  // Użyj szablonu jeśli podano
  if (template) {
    const templateData = emailTemplates.get(template);
    if (!templateData) {
      return errorResponse("Nie znaleziono szablonu");
    }

    finalContent = templateData.content;
    finalSubject = templateData.subject;

    // Zastąp zmienne w szablonie
    if (variables) {
      Object.keys(variables).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        finalContent = finalContent.replace(regex, variables[key]);
        finalSubject = finalSubject.replace(regex, variables[key]);
      });
    }
  }

  const emailId = generateId();
  const emailRecord = {
    id: emailId,
    to: Array.isArray(to) ? to : [to],
    subject: finalSubject,
    content: finalContent,
    template: template || null,
    variables: variables || {},
    status: schedule ? "scheduled" : "sent",
    scheduledFor: schedule || null,
    sentAt: schedule ? null : Date.now(),
    createdAt: Date.now(),
    opens: 0,
    clicks: 0,
    bounces: 0,
  };

  emailHistory.unshift(emailRecord);

  // Zachowaj tylko 500 ostatnich emaili
  if (emailHistory.length > 500) {
    emailHistory.pop();
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: schedule
        ? "Email zaplanowany pomyślnie"
        : "Email wysłany pomyślnie",
      emailId,
      recipients: emailRecord.to.length,
      status: emailRecord.status,
      scheduledFor: schedule || null,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get email templates
async function getTemplates() {
  const templates = Array.from(emailTemplates.values()).sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  return new Response(
    JSON.stringify({
      success: true,
      templates,
      count: templates.length,
      types: AGENT_CONFIG.templateTypes,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Create email template
async function createTemplate(data: any) {
  const { name, type, subject, content, variables } = data;

  if (!name || !subject || !content) {
    return errorResponse("Brak wymaganych pól: name, subject, content");
  }

  const templateId = generateId();
  const template = {
    id: templateId,
    name,
    type: type || "custom",
    subject,
    content,
    variables: variables || [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    usageCount: 0,
  };

  emailTemplates.set(templateId, template);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Szablon utworzony pomyślnie",
      template,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Update email template
async function updateTemplate(data: any) {
  const { id, name, subject, content, variables } = data;

  if (!id || !emailTemplates.has(id)) {
    return errorResponse("Nie znaleziono szablonu");
  }

  const template = emailTemplates.get(id);
  const updatedTemplate = {
    ...template,
    name: name || template.name,
    subject: subject || template.subject,
    content: content || template.content,
    variables: variables || template.variables,
    updatedAt: Date.now(),
  };

  emailTemplates.set(id, updatedTemplate);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Szablon zaktualizowany pomyślnie",
      template: updatedTemplate,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Delete email template
async function deleteTemplate(data: any) {
  const { id } = data;

  if (!id || !emailTemplates.has(id)) {
    return errorResponse("Nie znaleziono szablonu");
  }

  emailTemplates.delete(id);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Szablon usunięty pomyślnie",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get contacts
async function getContacts() {
  const contacts = Array.from(contactLists.values()).reduce((all, list) => {
    return [...all, ...list.contacts];
  }, []);

  return new Response(
    JSON.stringify({
      success: true,
      contacts,
      lists: Array.from(contactLists.values()),
      totalContacts: contacts.length,
      totalLists: contactLists.size,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Add contact
async function addContact(data: any) {
  const { email, name, lists, customFields } = data;

  if (!email) {
    return errorResponse("Brak adresu email");
  }

  const contact = {
    id: generateId(),
    email,
    name: name || "",
    customFields: customFields || {},
    subscribed: true,
    createdAt: Date.now(),
    lists: lists || ["default"],
  };

  // Dodaj do list kontaktów
  (lists || ["default"]).forEach((listName: string) => {
    if (!contactLists.has(listName)) {
      contactLists.set(listName, {
        id: listName,
        name: listName,
        contacts: [],
        createdAt: Date.now(),
      });
    }

    const list = contactLists.get(listName);
    const existingContact = list.contacts.find((c: any) => c.email === email);
    if (!existingContact) {
      list.contacts.push(contact);
    }
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: "Kontakt dodany pomyślnie",
      contact,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Create campaign
async function createCampaign(data: any) {
  const { name, subject, template, targetList, scheduleDate } = data;

  if (!name || !subject || !template || !targetList) {
    return errorResponse("Brak wymaganych pól kampanii");
  }

  const campaignId = generateId();
  const campaign = {
    id: campaignId,
    name,
    subject,
    template,
    targetList,
    scheduleDate: scheduleDate || null,
    status: "draft",
    createdAt: Date.now(),
    sentAt: null,
    stats: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
    },
  };

  campaigns.set(campaignId, campaign);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Kampania utworzona pomyślnie",
      campaign,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Send campaign
async function sendCampaign(data: any) {
  const { campaignId } = data;

  if (!campaignId || !campaigns.has(campaignId)) {
    return errorResponse("Nie znaleziono kampanii");
  }

  const campaign = campaigns.get(campaignId);
  const targetList = contactLists.get(campaign.targetList);

  if (!targetList) {
    return errorResponse("Nie znaleziono listy odbiorców");
  }

  // Symulacja wysyłki
  const recipients = targetList.contacts.filter((c: any) => c.subscribed);

  const updatedCampaign = {
    ...campaign,
    status: "sent",
    sentAt: Date.now(),
    stats: {
      ...campaign.stats,
      sent: recipients.length,
      delivered: Math.floor(recipients.length * 0.95), // 95% dostarczone
      opened: Math.floor(recipients.length * 0.25), // 25% otwarte
      clicked: Math.floor(recipients.length * 0.05), // 5% kliknięte
      bounced: Math.floor(recipients.length * 0.05), // 5% odbite
      unsubscribed: Math.floor(recipients.length * 0.01), // 1% wypisane
    },
  };

  campaigns.set(campaignId, updatedCampaign);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Kampania wysłana pomyślnie",
      campaign: updatedCampaign,
      recipients: recipients.length,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get campaigns
async function getCampaigns() {
  const campaignList = Array.from(campaigns.values()).sort(
    (a, b) => b.createdAt - a.createdAt
  );

  return new Response(
    JSON.stringify({
      success: true,
      campaigns: campaignList,
      count: campaignList.length,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get analytics
async function getAnalytics(data: any) {
  const { period = "30d" } = data;

  // Symulacja danych analytics
  const mockAnalytics = {
    period,
    summary: {
      emailsSent: emailHistory.length,
      campaignsSent: Array.from(campaigns.values()).filter(
        (c) => c.status === "sent"
      ).length,
      totalOpens: emailHistory.reduce((sum, email) => sum + email.opens, 0),
      totalClicks: emailHistory.reduce((sum, email) => sum + email.clicks, 0),
      bounceRate: "3.2%",
      openRate: "24.8%",
      clickRate: "4.1%",
    },
    chartData: {
      dailyEmails: generateMockChartData(30, 10, 100),
      openRates: generateMockChartData(30, 15, 35),
      clickRates: generateMockChartData(30, 2, 8),
    },
    topTemplates: Array.from(emailTemplates.values())
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 5),
  };

  return new Response(
    JSON.stringify({
      success: true,
      analytics: mockAnalytics,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Configure email account
async function configureEmailAccount(data: any) {
  const { name, provider, settings } = data;

  if (!name || !provider) {
    return errorResponse("Brak nazwy lub typu konta");
  }

  const accountId = generateId();
  const account = {
    id: accountId,
    name,
    provider,
    settings: {
      ...settings,
      password: "***", // Hide password in response
    },
    status: "connected",
    createdAt: Date.now(),
    lastUsed: Date.now(),
  };

  emailAccounts.set(accountId, account);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Konto email skonfigurowane pomyślnie",
      account,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get email accounts
async function getEmailAccounts() {
  const accounts = Array.from(emailAccounts.values());

  return new Response(
    JSON.stringify({
      success: true,
      accounts,
      count: accounts.length,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get email history
async function getEmailHistory() {
  return new Response(
    JSON.stringify({
      success: true,
      history: emailHistory.slice(0, 100), // Ostatnie 100 emaili
      total: emailHistory.length,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function generateMockChartData(
  days: number,
  min: number,
  max: number
): Array<{ date: string; value: number }> {
  const data = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.floor(Math.random() * (max - min)) + min,
    });
  }
  return data;
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
