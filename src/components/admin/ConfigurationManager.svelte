<script lang="ts">
  let secrets = {
    GCP_PROJECT_ID: '',
    GCP_SERVICE_ACCOUNT_KEY: '',
    GOOGLE_CALENDAR_ID: 'primary',
    GOOGLE_SHEET_ID: '',
  };

  let wranglerCommands = '';

  function generateWranglerCommands() {
    let commands = `# Uruchom te komendy w swoim terminalu, aby bezpiecznie dodać sekrety do Cloudflare Workers.
# Pamiętaj, aby zastąpić ścieżkę do pliku klucza serwisowego!

`;
    
    if (secrets.GCP_PROJECT_ID) {
      commands += `wrangler secret put GCP_PROJECT_ID <<< "${secrets.GCP_PROJECT_ID}"
`;
    }
    if (secrets.GOOGLE_CALENDAR_ID) {
      commands += `wrangler secret put GOOGLE_CALENDAR_ID <<< "${secrets.GOOGLE_CALENDAR_ID}"
`;
    }
    if (secrets.GOOGLE_SHEET_ID) {
      commands += `wrangler secret put GOOGLE_SHEET_ID <<< "${secrets.GOOGLE_SHEET_ID}"
`;
    }
    if (secrets.GCP_SERVICE_ACCOUNT_KEY) {
      commands += `
# Ta komenda wczyta zawartość Twojego pliku klucza JSON i przekaże ją jako sekret.
# Upewnij się, że ścieżka do pliku jest poprawna.
cat /ścieżka/do/twojego/klucza.json | wrangler secret put GCP_SERVICE_ACCOUNT_KEY
`;
    }
    wranglerCommands = commands;
  }
</script>

<div class="config-manager-container">
  <h2 class="widget-title">🔑 Menedżer Konfiguracji Sekretów</h2>
  <p class="widget-subtitle">Wprowadź klucze API i ID z Google Cloud, aby włączyć wszystkie funkcje AI. Po wypełnieniu, wygeneruj komendy `wrangler` do bezpiecznego wgrania sekretów.</p>

  <div class="form-grid">
    <div>
      <label for="gcp-project-id">Google Cloud Project ID</label>
      <input id="gcp-project-id" type="text" bind:value={secrets.GCP_PROJECT_ID} placeholder="np. zenon-project-467918" />
    </div>
    <div>
      <label for="google-calendar-id">Google Calendar ID</label>
      <input id="google-calendar-id" type="text" bind:value={secrets.GOOGLE_CALENDAR_ID} placeholder="np. primary lub adres@gmail.com" />
    </div>
    <div>
      <label for="google-sheet-id">Google Sheet ID (dla CRM)</label>
      <input id="google-sheet-id" type="text" bind:value={secrets.GOOGLE_SHEET_ID} placeholder="ID z linku do Arkusza Google" />
    </div>
    <div class="col-span-2">
      <label for="gcp-key">Klucz Konta Serwisowego (zawartość pliku JSON)</label>
      <textarea id="gcp-key" rows="6" bind:value={secrets.GCP_SERVICE_ACCOUNT_KEY} placeholder="Wklej tutaj całą zawartość pliku JSON klucza konta serwisowego..."></textarea>
    </div>
  </div>

  <button on:click={generateWranglerCommands} class="generate-btn">
    Wygeneruj Komendy Wranglera
  </button>

  {#if wranglerCommands}
    <div class="commands-container">
      <h3>Wykonaj w terminalu:</h3>
      <pre>{wranglerCommands}</pre>
      <button on:click={() => navigator.clipboard.writeText(wranglerCommands)} class="copy-btn">
        Kopiuj komendy
      </button>
    </div>
  {/if}
</div>

<style>
  .config-manager-container { padding: 1.5rem; background: #111; border: 1px solid #333; border-radius: 8px; color: #eee; }
  .widget-title { font-size: 1.5rem; font-weight: bold; color: #00ffff; margin-bottom: 0.5rem; }
  .widget-subtitle { font-size: 1rem; color: #999; margin-bottom: 1.5rem; }
  .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .col-span-2 { grid-column: span 2 / span 2; }
  label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: #ccc; }
  input, textarea { width: 100%; background: #222; border: 1px solid #444; padding: 0.75rem; border-radius: 4px; color: #eee; }
  .generate-btn { background: #00ffff; color: #000; font-weight: bold; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; margin-top: 1.5rem; }
  .commands-container { margin-top: 1.5rem; background: #000; padding: 1rem; border-radius: 4px; border: 1px solid #333; }
  pre { white-space: pre-wrap; word-wrap: break-word; color: #9f9; font-family: monospace; }
  .copy-btn { background: #333; color: #fff; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; margin-top: 1rem; }
</style>
