<script lang="ts">
  // 📧 Email Handler Agent - Zaawansowany interfejs do obsługi poczty elektronicznej
  import { onMount } from "svelte";
  import { AGENT_CONFIG } from "./config";

  // Component state
  let isLoading = false;
  let activeTab:
    | "compose"
    | "templates"
    | "campaigns"
    | "contacts"
    | "analytics" = "compose";

  // Email composition
  let emailForm = {
    to: "",
    subject: "",
    content: "",
    template: "",
    variables: {},
    schedule: "",
  };

  // Templates
  let templates: any[] = [];
  let selectedTemplate: any = null;
  let templateForm = {
    name: "",
    type: "custom",
    subject: "",
    content: "",
    variables: [],
  };

  // Campaigns
  let campaigns: any[] = [];
  let campaignForm = {
    name: "",
    subject: "",
    template: "",
    targetList: "default",
    scheduleDate: "",
  };

  // Contacts
  let contacts: any[] = [];
  let contactLists: any[] = [];
  let contactForm = {
    email: "",
    name: "",
    lists: ["default"],
    customFields: {},
  };

  // Analytics
  let analytics: any = null;
  let emailHistory: any[] = [];

  // Email accounts
  let emailAccounts: any[] = [];

  onMount(() => {
    loadTemplates();
    loadContacts();
    loadCampaigns();
    loadEmailAccounts();
    loadAnalytics();
  });

  // Test agent connection
  async function testAgent() {
    isLoading = true;
    try {
      const response = await fetch("/api/agents/agent-07", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });
      const data = await response.json();

      if (data.success) {
        alert("✅ Agent Email Handler działa poprawnie!");
        loadTemplates(); // Załaduj domyślne szablony
      } else {
        alert(`❌ Błąd: ${data.message}`);
      }
    } catch (error) {
      alert(`❌ Błąd komunikacji: ${error.message}`);
    } finally {
      isLoading = false;
    }
  }

  // Send email
  async function sendEmail() {
    if (!emailForm.to || (!emailForm.content && !emailForm.template)) {
      alert("Wprowadź odbiorcę i treść lub wybierz szablon");
      return;
    }

    isLoading = true;

    try {
      const response = await fetch("/api/agents/agent-07", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send-email",
          data: {
            ...emailForm,
            to: emailForm.to.split(",").map((email) => email.trim()),
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${data.message}! Wysłano do ${data.recipients} odbiorców.`);
        // Reset form
        emailForm = {
          to: "",
          subject: "",
          content: "",
          template: "",
          variables: {},
          schedule: "",
        };
      } else {
        alert(`❌ Błąd: ${data.message}`);
      }
    } catch (error) {
      alert(`❌ Błąd: ${error.message}`);
    } finally {
      isLoading = false;
    }
  }

  // Load templates
  async function loadTemplates() {
    try {
      const response = await fetch("/api/agents/agent-07", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-templates" }),
      });

      const data = await response.json();
      if (data.success) {
        templates = data.templates;
      }
    } catch (error) {
      console.error("Błąd ładowania szablonów:", error);
    }
  }

  // Create template
  async function createTemplate() {
    if (!templateForm.name || !templateForm.subject || !templateForm.content) {
      alert("Wypełnij wszystkie wymagane pola szablonu");
      return;
    }

    isLoading = true;

    try {
      const response = await fetch("/api/agents/agent-07", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-template",
          data: templateForm,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Szablon utworzony pomyślnie!");
        loadTemplates();
        // Reset form
        templateForm = {
          name: "",
          type: "custom",
          subject: "",
          content: "",
          variables: [],
        };
      } else {
        alert(`❌ Błąd: ${data.message}`);
      }
    } catch (error) {
      alert(`❌ Błąd: ${error.message}`);
    } finally {
      isLoading = false;
    }
  }

  // Load template into email form
  function useTemplate(template: any) {
    selectedTemplate = template;
    emailForm.template = template.id;
    emailForm.subject = template.subject;
    emailForm.content = template.content;

    // Initialize variables object
    emailForm.variables = {};
    template.variables.forEach((variable: string) => {
      emailForm.variables[variable] = "";
    });

    activeTab = "compose";
  }

  // Load contacts
  async function loadContacts() {
    try {
      const response = await fetch("/api/agents/agent-07", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-contacts" }),
      });

      const data = await response.json();
      if (data.success) {
        contacts = data.contacts;
        contactLists = data.lists;
      }
    } catch (error) {
      console.error("Błąd ładowania kontaktów:", error);
    }
  }

  // Add contact
  async function addContact() {
    if (!contactForm.email) {
      alert("Wprowadź adres email");
      return;
    }

    isLoading = true;

    try {
      const response = await fetch("/api/agents/agent-07", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add-contact",
          data: contactForm,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Kontakt dodany pomyślnie!");
        loadContacts();
        // Reset form
        contactForm = {
          email: "",
          name: "",
          lists: ["default"],
          customFields: {},
        };
      } else {
        alert(`❌ Błąd: ${data.message}`);
      }
    } catch (error) {
      alert(`❌ Błąd: ${error.message}`);
    } finally {
      isLoading = false;
    }
  }

  // Load campaigns
  async function loadCampaigns() {
    try {
      const response = await fetch("/api/agents/agent-07", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-campaigns" }),
      });

      const data = await response.json();
      if (data.success) {
        campaigns = data.campaigns;
      }
    } catch (error) {
      console.error("Błąd ładowania kampanii:", error);
    }
  }

  // Create campaign
  async function createCampaign() {
    if (!campaignForm.name || !campaignForm.subject || !campaignForm.template) {
      alert("Wypełnij wszystkie wymagane pola kampanii");
      return;
    }

    isLoading = true;

    try {
      const response = await fetch("/api/agents/agent-07", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-campaign",
          data: campaignForm,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Kampania utworzona pomyślnie!");
        loadCampaigns();
        // Reset form
        campaignForm = {
          name: "",
          subject: "",
          template: "",
          targetList: "default",
          scheduleDate: "",
        };
      } else {
        alert(`❌ Błąd: ${data.message}`);
      }
    } catch (error) {
      alert(`❌ Błąd: ${error.message}`);
    } finally {
      isLoading = false;
    }
  }

  // Send campaign
  async function sendCampaign(campaignId: string) {
    if (!confirm("Czy na pewno chcesz wysłać tę kampanię?")) {
      return;
    }

    isLoading = true;

    try {
      const response = await fetch("/api/agents/agent-07", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send-campaign",
          data: { campaignId },
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${data.message}! Wysłano do ${data.recipients} odbiorców.`);
        loadCampaigns();
      } else {
        alert(`❌ Błąd: ${data.message}`);
      }
    } catch (error) {
      alert(`❌ Błąd: ${error.message}`);
    } finally {
      isLoading = false;
    }
  }

  // Load analytics
  async function loadAnalytics() {
    try {
      const response = await fetch("/api/agents/agent-07", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-analytics", data: {} }),
      });

      const data = await response.json();
      if (data.success) {
        analytics = data.analytics;
      }
    } catch (error) {
      console.error("Błąd ładowania analytics:", error);
    }
  }

  // Load email accounts
  async function loadEmailAccounts() {
    try {
      const response = await fetch("/api/agents/agent-07", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-accounts" }),
      });

      const data = await response.json();
      if (data.success) {
        emailAccounts = data.accounts;
      }
    } catch (error) {
      console.error("Błąd ładowania kont email:", error);
    }
  }
</script>

<div class="email-agent bg-gray-900 text-white p-6 rounded-lg">
  <!-- Header -->
  <div class="header flex justify-between items-center mb-6">
    <div>
      <h2 class="text-2xl font-bold text-blue-400 mb-2">
        📧 {AGENT_CONFIG.displayName}
      </h2>
      <p class="text-gray-400">{AGENT_CONFIG.description}</p>
    </div>
    <button
      on:click={testAgent}
      disabled={isLoading}
      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
    >
      {isLoading ? "⏳" : "🧪"} Test
    </button>
  </div>

  <!-- Navigation Tabs -->
  <div class="tabs flex gap-2 mb-6 overflow-x-auto">
    <button
      class:active={activeTab === "compose"}
      class="tab px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
      on:click={() => (activeTab = "compose")}
    >
      ✍️ Napisz Email
    </button>
    <button
      class:active={activeTab === "templates"}
      class="tab px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
      on:click={() => (activeTab = "templates")}
    >
      📋 Szablony ({templates.length})
    </button>
    <button
      class:active={activeTab === "campaigns"}
      class="tab px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
      on:click={() => (activeTab = "campaigns")}
    >
      📈 Kampanie ({campaigns.length})
    </button>
    <button
      class:active={activeTab === "contacts"}
      class="tab px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
      on:click={() => (activeTab = "contacts")}
    >
      👥 Kontakty ({contacts.length})
    </button>
    <button
      class:active={activeTab === "analytics"}
      class="tab px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
      on:click={() => (activeTab = "analytics")}
    >
      📊 Analytics
    </button>
  </div>

  <!-- Compose Email Tab -->
  {#if activeTab === "compose"}
    <div class="compose-section">
      <h3 class="text-lg font-semibold text-blue-400 mb-4">
        ✍️ Napisz nowy email
      </h3>

      <!-- Template Selection -->
      {#if templates.length > 0}
        <div class="template-selector mb-4">
          <label class="block text-sm text-gray-300 mb-2"
            >Wybierz szablon (opcjonalnie):</label
          >
          <select
            bind:value={emailForm.template}
            on:change={(e) => {
              const template = templates.find((t) => t.id === e.target.value);
              if (template) useTemplate(template);
            }}
            class="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="">-- Bez szablonu --</option>
            {#each templates as template}
              <option value={template.id}>
                {template.name} ({template.type})
              </option>
            {/each}
          </select>
        </div>
      {/if}

      <!-- Email Form -->
      <div class="email-form space-y-4">
        <!-- Recipients -->
        <div>
          <label class="block text-sm text-gray-300 mb-1"
            >Odbiorcy (oddziel przecinkami):</label
          >
          <input
            bind:value={emailForm.to}
            type="text"
            placeholder="email1@example.com, email2@example.com"
            class="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          />
        </div>

        <!-- Subject -->
        <div>
          <label class="block text-sm text-gray-300 mb-1">Temat:</label>
          <input
            bind:value={emailForm.subject}
            type="text"
            placeholder="Temat wiadomości"
            class="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          />
        </div>

        <!-- Template Variables -->
        {#if selectedTemplate && selectedTemplate.variables.length > 0}
          <div
            class="template-variables bg-gray-800 border border-gray-600 rounded p-4"
          >
            <h4 class="font-semibold text-blue-300 mb-3">Zmienne szablonu:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              {#each selectedTemplate.variables as variable}
                <div>
                  <label class="block text-sm text-gray-300 mb-1"
                    >{variable}:</label
                  >
                  <input
                    bind:value={emailForm.variables[variable]}
                    type="text"
                    placeholder={`Wartość dla ${variable}`}
                    class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Content -->
        <div>
          <label class="block text-sm text-gray-300 mb-1"
            >Treść wiadomości:</label
          >
          <textarea
            bind:value={emailForm.content}
            placeholder="Treść wiadomości (HTML dozwolony)"
            rows="8"
            class="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white font-mono resize-y"
          ></textarea>
        </div>

        <!-- Schedule -->
        <div>
          <label class="block text-sm text-gray-300 mb-1"
            >Zaplanuj wysyłkę (opcjonalnie):</label
          >
          <input
            bind:value={emailForm.schedule}
            type="datetime-local"
            class="p-2 bg-gray-800 border border-gray-600 rounded text-white"
          />
        </div>

        <!-- Send Button -->
        <button
          on:click={sendEmail}
          disabled={isLoading ||
            !emailForm.to ||
            (!emailForm.content && !emailForm.template)}
          class="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "⏳ Wysyłanie..." : "📤 Wyślij Email"}
        </button>
      </div>
    </div>
  {/if}

  <!-- Templates Tab -->
  {#if activeTab === "templates"}
    <div class="templates-section">
      <h3 class="text-lg font-semibold text-blue-400 mb-4">
        📋 Szablony Email
      </h3>

      <!-- Create Template Form -->
      <div
        class="create-template bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6"
      >
        <h4 class="font-semibold text-blue-300 mb-3">➕ Nowy szablon</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1"
              >Nazwa szablonu:</label
            >
            <input
              bind:value={templateForm.name}
              type="text"
              placeholder="Mój szablon"
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1">Typ:</label>
            <select
              bind:value={templateForm.type}
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              {#each AGENT_CONFIG.templateTypes as type}
                <option value={type.id}>{type.icon} {type.name}</option>
              {/each}
            </select>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-300 mb-1">Temat:</label>
          <input
            bind:value={templateForm.subject}
            type="text"
            placeholder="{{ name }}, witamy w {{ company }}!"
            class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-300 mb-1">Treść (HTML):</label>
          <textarea
            bind:value={templateForm.content}
            placeholder="<h2>Cześć {{ name }}!</h2><p>Dziękujemy za...</p>"
            rows="6"
            class="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white font-mono"
          ></textarea>
        </div>

        <button
          on:click={createTemplate}
          disabled={isLoading}
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold disabled:opacity-50"
        >
          {isLoading ? "⏳ Tworzenie..." : "➕ Utwórz szablon"}
        </button>
      </div>

      <!-- Templates List -->
      {#if templates.length > 0}
        <div class="templates-list space-y-3">
          {#each templates as template}
            <div
              class="template-item bg-gray-800 border border-gray-600 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h5 class="font-semibold text-blue-300">{template.name}</h5>
                  <span class="text-sm text-gray-400">
                    {AGENT_CONFIG.templateTypes.find(
                      (t) => t.id === template.type
                    )?.icon || "📄"}
                    {template.type} • Utworzony: {new Date(
                      template.createdAt
                    ).toLocaleDateString("pl-PL")}
                  </span>
                </div>
                <button
                  on:click={() => useTemplate(template)}
                  class="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 rounded"
                >
                  📝 Użyj
                </button>
              </div>
              <div class="text-sm text-gray-300 mb-2">
                <strong>Temat:</strong>
                {template.subject}
              </div>
              <div class="text-xs text-gray-400 max-h-20 overflow-y-auto">
                {template.content.substring(0, 200)}...
              </div>
              {#if template.variables && template.variables.length > 0}
                <div class="flex flex-wrap gap-1 mt-2">
                  {#each template.variables as variable}
                    <span
                      class="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded"
                    >
                      {variable}
                    </span>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-gray-400 text-center py-8">
          Brak szablonów. Utwórz pierwszy szablon powyżej.
        </p>
      {/if}
    </div>
  {/if}

  <!-- Campaigns Tab -->
  {#if activeTab === "campaigns"}
    <div class="campaigns-section">
      <h3 class="text-lg font-semibold text-blue-400 mb-4">
        📈 Kampanie Newsletterowe
      </h3>

      <!-- Create Campaign Form -->
      <div
        class="create-campaign bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6"
      >
        <h4 class="font-semibold text-blue-300 mb-3">➕ Nowa kampania</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1"
              >Nazwa kampanii:</label
            >
            <input
              bind:value={campaignForm.name}
              type="text"
              placeholder="Kampania grudniowa"
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1">Temat:</label>
            <input
              bind:value={campaignForm.subject}
              type="text"
              placeholder="Newsletter - Grudzień 2024"
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1">Szablon:</label>
            <select
              bind:value={campaignForm.template}
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="">-- Wybierz szablon --</option>
              {#each templates as template}
                <option value={template.id}>{template.name}</option>
              {/each}
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1"
              >Lista odbiorców:</label
            >
            <select
              bind:value={campaignForm.targetList}
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="default">Lista domyślna</option>
              {#each contactLists as list}
                <option value={list.id}
                  >{list.name} ({list.contacts.length})</option
                >
              {/each}
            </select>
          </div>
        </div>

        <button
          on:click={createCampaign}
          disabled={isLoading}
          class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold disabled:opacity-50"
        >
          {isLoading ? "⏳ Tworzenie..." : "➕ Utwórz kampanię"}
        </button>
      </div>

      <!-- Campaigns List -->
      {#if campaigns.length > 0}
        <div class="campaigns-list space-y-3">
          {#each campaigns as campaign}
            <div
              class="campaign-item bg-gray-800 border border-gray-600 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h5 class="font-semibold text-blue-300">{campaign.name}</h5>
                  <p class="text-sm text-gray-400">{campaign.subject}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="text-xs px-2 py-1 rounded {campaign.status === 'sent'
                      ? 'bg-green-900 text-green-200'
                      : 'bg-yellow-900 text-yellow-200'}"
                  >
                    {campaign.status === "sent" ? "✅ Wysłane" : "📝 Szkic"}
                  </span>
                  {#if campaign.status === "draft"}
                    <button
                      on:click={() => sendCampaign(campaign.id)}
                      disabled={isLoading}
                      class="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                    >
                      📤 Wyślij
                    </button>
                  {/if}
                </div>
              </div>

              {#if campaign.status === "sent" && campaign.stats}
                <div
                  class="stats grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"
                >
                  <div class="text-center">
                    <div class="font-semibold text-blue-300">
                      {campaign.stats.sent}
                    </div>
                    <div class="text-gray-400">Wysłane</div>
                  </div>
                  <div class="text-center">
                    <div class="font-semibold text-green-300">
                      {campaign.stats.opened}
                    </div>
                    <div class="text-gray-400">Otwarte</div>
                  </div>
                  <div class="text-center">
                    <div class="font-semibold text-purple-300">
                      {campaign.stats.clicked}
                    </div>
                    <div class="text-gray-400">Kliknięte</div>
                  </div>
                  <div class="text-center">
                    <div class="font-semibold text-red-300">
                      {campaign.stats.bounced}
                    </div>
                    <div class="text-gray-400">Odbite</div>
                  </div>
                </div>
              {/if}

              <div class="text-xs text-gray-500 mt-2">
                Utworzona: {new Date(campaign.createdAt).toLocaleString(
                  "pl-PL"
                )}
                {#if campaign.sentAt}
                  • Wysłana: {new Date(campaign.sentAt).toLocaleString("pl-PL")}
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-gray-400 text-center py-8">
          Brak kampanii. Utwórz pierwszą kampanię powyżej.
        </p>
      {/if}
    </div>
  {/if}

  <!-- Contacts Tab -->
  {#if activeTab === "contacts"}
    <div class="contacts-section">
      <h3 class="text-lg font-semibold text-blue-400 mb-4">
        👥 Zarządzanie Kontaktami
      </h3>

      <!-- Add Contact Form -->
      <div
        class="add-contact bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6"
      >
        <h4 class="font-semibold text-blue-300 mb-3">➕ Dodaj kontakt</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1">Email:</label>
            <input
              bind:value={contactForm.email}
              type="email"
              placeholder="kontakt@example.com"
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1"
              >Imię i nazwisko:</label
            >
            <input
              bind:value={contactForm.name}
              type="text"
              placeholder="Jan Kowalski"
              class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
        </div>

        <button
          on:click={addContact}
          disabled={isLoading}
          class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold disabled:opacity-50"
        >
          {isLoading ? "⏳ Dodawanie..." : "➕ Dodaj kontakt"}
        </button>
      </div>

      <!-- Contacts List -->
      {#if contacts.length > 0}
        <div class="contacts-list">
          <h4 class="font-semibold text-blue-300 mb-3">
            📋 Lista kontaktów ({contacts.length})
          </h4>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            {#each contacts as contact}
              <div
                class="contact-item bg-gray-800 border border-gray-600 rounded p-3 flex justify-between items-center"
              >
                <div>
                  <div class="font-semibold text-white">
                    {contact.name || contact.email}
                  </div>
                  {#if contact.name}
                    <div class="text-sm text-gray-400">{contact.email}</div>
                  {/if}
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="text-xs px-2 py-1 bg-green-900 text-green-200 rounded"
                  >
                    ✅ Subskrybuje
                  </span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <p class="text-gray-400 text-center py-8">
          Brak kontaktów. Dodaj pierwszy kontakt powyżej.
        </p>
      {/if}
    </div>
  {/if}

  <!-- Analytics Tab -->
  {#if activeTab === "analytics"}
    <div class="analytics-section">
      <h3 class="text-lg font-semibold text-blue-400 mb-4">
        📊 Analytics Email
      </h3>

      {#if analytics}
        <!-- Summary Stats -->
        <div class="stats-overview grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div
            class="stat-card bg-gray-800 border border-gray-600 rounded-lg p-4 text-center"
          >
            <div class="text-2xl font-bold text-blue-300">
              {analytics.summary.emailsSent}
            </div>
            <div class="text-sm text-gray-400">Emaili wysłane</div>
          </div>

          <div
            class="stat-card bg-gray-800 border border-gray-600 rounded-lg p-4 text-center"
          >
            <div class="text-2xl font-bold text-green-300">
              {analytics.summary.openRate}
            </div>
            <div class="text-sm text-gray-400">Wskaźnik otwarć</div>
          </div>

          <div
            class="stat-card bg-gray-800 border border-gray-600 rounded-lg p-4 text-center"
          >
            <div class="text-2xl font-bold text-purple-300">
              {analytics.summary.clickRate}
            </div>
            <div class="text-sm text-gray-400">Wskaźnik kliknięć</div>
          </div>

          <div
            class="stat-card bg-gray-800 border border-gray-600 rounded-lg p-4 text-center"
          >
            <div class="text-2xl font-bold text-yellow-300">
              {analytics.summary.bounceRate}
            </div>
            <div class="text-sm text-gray-400">Wskaźnik odbić</div>
          </div>
        </div>

        <!-- Top Templates -->
        {#if analytics.topTemplates && analytics.topTemplates.length > 0}
          <div
            class="top-templates bg-gray-800 border border-gray-600 rounded-lg p-4"
          >
            <h4 class="font-semibold text-blue-300 mb-3">
              🏆 Najpopularniejsze szablony
            </h4>
            <div class="space-y-2">
              {#each analytics.topTemplates as template}
                <div
                  class="flex justify-between items-center p-2 bg-gray-700 rounded"
                >
                  <span class="text-white">{template.name}</span>
                  <span class="text-sm text-gray-400"
                    >{template.usageCount || 0} użyć</span
                  >
                </div>
              {/each}
            </div>
          </div>
        {/if}
      {:else}
        <div class="text-center py-8">
          <button
            on:click={loadAnalytics}
            disabled={isLoading}
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
          >
            {isLoading ? "⏳ Ładowanie..." : "📊 Załaduj Analytics"}
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .tab {
    background: #374151;
    color: #9ca3af;
  }

  .tab.active {
    background: #3b82f6;
    color: white;
  }

  .tab:hover {
    background: #4b5563;
  }

  .tab.active:hover {
    background: #2563eb;
  }

  /* Custom scrollbar */
  .contacts-list::-webkit-scrollbar,
  .templates-list::-webkit-scrollbar {
    width: 6px;
  }

  .contacts-list::-webkit-scrollbar-track,
  .templates-list::-webkit-scrollbar-track {
    background: #374151;
    border-radius: 3px;
  }

  .contacts-list::-webkit-scrollbar-thumb,
  .templates-list::-webkit-scrollbar-thumb {
    background: #6b7280;
    border-radius: 3px;
  }

  .contacts-list::-webkit-scrollbar-thumb:hover,
  .templates-list::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
</style>
