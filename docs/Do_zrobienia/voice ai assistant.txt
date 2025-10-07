wdroż poniższy plan działania, zarówno od strony back-endu, front-endu, jak i zarządzania ustawieniami w aplikacji:

1. Struktura decyzyjna: gdzie i kiedy asystent voice może być włączony
Tryb globalny: Voice Assistant działa domyślnie na całym portalu (o ile nie jest wyłączony).

Tryb per podstrona: Możesz ustalić listę podstron (np. przez route, path, slug), na których voice jest aktywny/inaktywny.

Tryb per agent: Każdy agent ma flagę konfiguracyjną, czy obsługuje voice (np. asystent onboarding ma, a AI-coder nie).

2. Warstwa zarządzania (konfiguracja)
Centralna konfiguracja (np. w DB, .env lub config.js):

js
{
  voiceAssistant: {
    enabled: true, // globalny przełącznik
    pages: {
      "/dashboard": true,
      "/ai-agent": false,
      "/support": true
    },
    agents: {
      "onboardingAgent": true,
      "faqAgent": true,
      "codeAgent": false
    }
  }
}
Panel administracyjny:

Dodaj prostą sekcję do zarządzania Voice AI (checkbox “Włącz globalnie”, lista podstron/agentów z możliwością ustawienia flagi aktywności).

3. Logika ładowania Voice AI w aplikacji (React/Astro/JS)
Front-end (pseudo-kod React):

js
// Przykład hooka
function useVoiceAssistant() {
  const { pathname } = useLocation();
  const config = getVoiceConfig(); // pobierz z api, contextu lub statycznie

  // Sprawdź logikę włączenia
  const isEnabledGlobal = config.enabled;
  const isPageEnabled = !!config.pages[pathname];
  const agent = getCurrentAgent();  // id/typ aktualnego agenta
  const isAgentEnabled = !!config.agents[agent];

  // Kolejność priorytetów
  return isEnabledGlobal && (isPageEnabled || isAgentEnabled);
}

// W komponencie
if(useVoiceAssistant()) {
  render(<VoiceAssistantComponent />);
}
Back-end (API lub edge):

Endpoint /api/voice-assistant/config – zwraca aktualną konfigurację (na potrzeby SSR lub ograniczonych środowisk edge).

(Opcjonalnie) Dynamiczne przeładowanie ustawień po zmianie przez admina (np. WebSocket/polling).

4. Obsługa UI — “globalny przełącznik” i quick toggles
Dodaj “global switch” w panelu użytkownika/admina: włącz/wyłącz Voice Assistant dla siebie.

Przy podstronach wyświetlaj “mute/unmute voice assistant” tylko jeśli funkcja Voice jest aktywna na stronie/po agencie.

Każdy agent może mieć własny toggle (“Włącz asystenta voice dla tego agenta”).

5. Obsługa eventów i wydajność
Asystent voice ładuje się tylko, gdy widoczny i aktywny na danej stronie/agencie – unikasz niepotrzebnych kosztów i zaciążeń UI.

Po zmianie flagi “enabled” natychmiast wyłącz/usuń procesy głosowe (np. mikrofon, stream STT, TTS).

6. Rozwój i testy
Dodaj testy warunkowe (jest asystent voice aktywny w danej stronie/agentcie?).

Testuj na różnych typach stron oraz z różną kombinacją ustawień.

(Opcjonalnie) Zrób fallback – jeżeli voice nie działa, pokaż informację i pozwól przeładować/ponowić.

Przykładowy workflow
Admin ustawia: Voice Assistant aktywny globalnie, wyłączony tylko na podstronie “code editor”.

Agent onboarding: Voice Assistant zawsze aktywny.

Agent FAQ: Voice tylko, gdy użytkownik sam aktywuje voice dla tej sesji.

W efekcie:

Na większości strony voice aktywny.

Na “code editor” voice się nie ładuje.

W panelu FAQ przycisk “aktywuj asystenta voice” dostępny, user decyduje czy używa.

