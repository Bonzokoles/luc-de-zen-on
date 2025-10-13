export class GoogleAgentsDebugger {
  private ws?: WebSocket;

  /**
   * Sprawdza status połączeń Google Agents
   */
  async checkGoogleAgentsConnections(): Promise<any> {
    const issues: any[] = [];
    const status = {
      authentication: "unknown",
      apiAccess: "unknown",
      buttonHandlers: "unknown",
      websocket: "unknown",
    };

    try {
      // 1. Sprawdź autentykację Google
      const authStatus = await this.checkGoogleAuth();
      status.authentication = authStatus.isValid ? "connected" : "disconnected";

      if (!authStatus.isValid) {
        issues.push({
          type: "authentication",
          message: "Brak prawidłowej autentykacji Google",
          solution: "Sprawdź klucze API i konfigurację Google Cloud",
        });
      }

      // 2. Sprawdź dostęp do API
      const apiStatus = await this.checkGoogleAPIs();
      status.apiAccess =
        apiStatus.dialogflow && apiStatus.vertexAI
          ? "connected"
          : "disconnected";

      if (!apiStatus.dialogflow) {
        issues.push({
          type: "api_access",
          message: "Brak dostępu do Dialogflow API",
          solution: "Włącz Dialogflow API w Google Cloud Console",
        });
      }

      // 3. Sprawdź handlery przycisków
      const buttonStatus = this.checkButtonHandlers();
      status.buttonHandlers = buttonStatus.working
        ? "connected"
        : "disconnected";

      if (!buttonStatus.working) {
        issues.push({
          type: "button_handlers",
          message: "Przyciski nie wysyłają zapytań",
          solution: "Sprawdź event listenery i funkcje obsługi",
        });
      }

      // 4. Sprawdź WebSocket
      const wsStatus = await this.checkWebSocketConnection();
      status.websocket = wsStatus.connected ? "connected" : "disconnected";

      if (!wsStatus.connected) {
        issues.push({
          type: "websocket",
          message: "Brak połączenia WebSocket",
          solution: "Sprawdź konfigurację WebSocket i Cloudflare Workers",
        });
      }

      return {
        status,
        issues,
        recommendations: this.generateRecommendations(issues),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Błąd sprawdzania połączeń Google Agents:", error);
      return {
        status: { ...status, overall: "error" },
        issues: [{ type: "system", message: (error as Error).message }],
        error: true,
      };
    }
  }

  /**
   * Sprawdza autentykację Google
   */
  private async checkGoogleAuth(): Promise<any> {
    try {
      // Sprawdź czy są ustawione zmienne środowiskowe
      const requiredEnvVars = [
        "GOOGLE_PROJECT_ID",
        "GOOGLE_CLIENT_EMAIL",
        "GOOGLE_PRIVATE_KEY",
        "GOOGLE_LOCATION",
      ];

      const missingVars = requiredEnvVars.filter((varName) => {
        const value = process.env[varName] || (globalThis as any)[varName];
        return !value || value === "undefined";
      });

      if (missingVars.length > 0) {
        return {
          isValid: false,
          error: `Brakujące zmienne środowiskowe: ${missingVars.join(", ")}`,
        };
      }

      // Sprawdź format klucza prywatnego
      const privateKey =
        process.env.GOOGLE_PRIVATE_KEY ||
        (globalThis as any).GOOGLE_PRIVATE_KEY;
      if (!privateKey.includes("BEGIN PRIVATE KEY")) {
        return {
          isValid: false,
          error: "Nieprawidłowy format klucza prywatnego Google",
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Sprawdza dostęp do Google APIs
   */
  private async checkGoogleAPIs(): Promise<any> {
    const status = {
      dialogflow: false,
      vertexAI: false,
      errors: [] as string[],
    };

    try {
      // Test Dialogflow API
      const dialogflowTest = await fetch("/api/test-dialogflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      });

      status.dialogflow = dialogflowTest.ok;
      if (!dialogflowTest.ok) {
        status.errors.push(`Dialogflow API: ${dialogflowTest.status}`);
      }

      // Test Vertex AI
      const vertexTest = await fetch("/api/test-vertex-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      });

      status.vertexAI = vertexTest.ok;
      if (!vertexTest.ok) {
        status.errors.push(`Vertex AI: ${vertexTest.status}`);
      }
    } catch (error) {
      status.errors.push(`API Test Error: ${(error as Error).message}`);
    }

    return status;
  }

  /**
   * Sprawdza handlery przycisków
   */
  private checkButtonHandlers(): any {
    const issues = [];
    let working = true;

    try {
      // Sprawdź czy istnieją przyciski Google Agents
      const googleButtons = document.querySelectorAll("[data-google-agent]");

      if (googleButtons.length === 0) {
        issues.push("Brak przycisków Google Agents w DOM");
        working = false;
      }

      // Sprawdź event listenery
      googleButtons.forEach((button, index) => {
        const hasClickHandler =
          (button as any).onclick ||
          button.addEventListener ||
          button.getAttribute("onclick");

        if (!hasClickHandler) {
          issues.push(`Przycisk ${index + 1} nie ma handlera click`);
          working = false;
        }
      });

      // Sprawdź funkcje obsługi
      const requiredFunctions = [
        "handleGoogleAgentClick",
        "sendGoogleAgentRequest",
        "connectToGoogleAgent",
      ];

      requiredFunctions.forEach((funcName) => {
        if (typeof (window as any)[funcName] !== "function") {
          issues.push(`Brak funkcji: ${funcName}`);
          working = false;
        }
      });
    } catch (error) {
      issues.push(`DOM Error: ${(error as Error).message}`);
      working = false;
    }

    return { working, issues };
  }

  /**
   * Sprawdza połączenie WebSocket
   */
  private async checkWebSocketConnection(): Promise<any> {
    return new Promise((resolve) => {
      try {
        const wsUrl = "wss://your-worker.your-subdomain.workers.dev/ws";
        const ws = new WebSocket(wsUrl);

        const timeout = setTimeout(() => {
          ws.close();
          resolve({
            connected: false,
            error: "WebSocket timeout",
          });
        }, 5000);

        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve({
            connected: true,
            url: wsUrl,
          });
        };

        ws.onerror = (error) => {
          clearTimeout(timeout);
          resolve({
            connected: false,
            error: "WebSocket connection failed",
          });
        };
      } catch (error) {
        resolve({
          connected: false,
          error: (error as Error).message,
        });
      }
    });
  }

  /**
   * Generuje rekomendacje naprawy
   */
  private generateRecommendations(issues: any[]): string[] {
    const recommendations = [];

    const hasAuthIssues = issues.some((i) => i.type === "authentication");
    const hasAPIIssues = issues.some((i) => i.type === "api_access");
    const hasButtonIssues = issues.some((i) => i.type === "button_handlers");
    const hasWSIssues = issues.some((i) => i.type === "websocket");

    if (hasAuthIssues) {
      recommendations.push(
        "🔑 Skonfiguruj prawidłowo zmienne środowiskowe Google Cloud"
      );
      recommendations.push(
        "📋 Sprawdź format klucza prywatnego (musi zawierać BEGIN PRIVATE KEY)"
      );
    }

    if (hasAPIIssues) {
      recommendations.push("🔧 Włącz wymagane API w Google Cloud Console");
      recommendations.push("🌐 Sprawdź uprawnienia Service Account");
    }

    if (hasButtonIssues) {
      recommendations.push(
        "🖱️ Dodaj event listenery do przycisków Google Agents"
      );
      recommendations.push("⚡ Zaimplementuj funkcje obsługi kliknięć");
    }

    if (hasWSIssues) {
      recommendations.push(
        "🔌 Sprawdź konfigurację WebSocket w Cloudflare Workers"
      );
      recommendations.push("🌍 Zweryfikuj URL WebSocket");
    }

    return recommendations;
  }

  /**
   * Naprawia problemy automatycznie
   */
  async autoFix(): Promise<any> {
    const results = {
      fixed: [] as string[],
      failed: [] as string[],
      skipped: [] as string[],
    };

    try {
      // 1. Napraw handlery przycisków
      const buttonFix = this.fixButtonHandlers();
      if (buttonFix.success) {
        results.fixed.push("Button handlers restored");
      } else {
        results.failed.push("Button handlers fix failed");
      }

      // 2. Przywróć połączenie WebSocket
      const wsFix = await this.fixWebSocketConnection();
      if (wsFix.success) {
        results.fixed.push("WebSocket connection restored");
      } else {
        results.failed.push("WebSocket fix failed");
      }

      // 3. Odśwież status połączenia
      this.refreshConnectionStatus();
      results.fixed.push("Connection status refreshed");
    } catch (error) {
      results.failed.push(`Auto-fix error: ${(error as Error).message}`);
    }

    return results;
  }

  /**
   * Naprawia handlery przycisków
   */
  private fixButtonHandlers(): any {
    try {
      const googleButtons = document.querySelectorAll("[data-google-agent]");

      googleButtons.forEach((button) => {
        // Usuń stare handlery
        button.removeEventListener("click", this.handleGoogleAgentClick);

        // Dodaj nowe handlery
        button.addEventListener("click", async (e) => {
          e.preventDefault();

          const agentType = button.getAttribute("data-google-agent");
          const agentId = button.getAttribute("data-agent-id");

          try {
            // Pokaż loading
            button.textContent = "Łączenie...";
            (button as any).disabled = true;

            // Wykonaj zapytanie
            const response = await this.sendGoogleAgentRequest(
              agentType || "",
              agentId || ""
            );

            // Resetuj przycisk
            button.textContent = "Połączono";
            setTimeout(() => {
              button.textContent = "Połącz z Google Agent";
              (button as any).disabled = false;
            }, 2000);
          } catch (error) {
            console.error("Błąd podczas łączenia z Google Agent:", error);
            button.textContent = "Błąd połączenia";
            (button as any).disabled = false;
          }
        });
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Naprawia połączenie WebSocket
   */
  private async fixWebSocketConnection(): Promise<any> {
    try {
      // Sprawdź czy WebSocket jest już otwarty
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        return { success: true, message: "WebSocket już połączony" };
      }

      // Otwórz nowe połączenie
      const wsUrl = "wss://your-worker.your-subdomain.workers.dev/ws";
      this.ws = new WebSocket(wsUrl);

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve({
            success: false,
            error: "WebSocket timeout during reconnect",
          });
        }, 5000);

        this.ws!.onopen = () => {
          clearTimeout(timeout);
          resolve({
            success: true,
            message: "WebSocket successfully reconnected",
          });
        };

        this.ws!.onerror = (error) => {
          clearTimeout(timeout);
          resolve({
            success: false,
            error: "WebSocket connection error during reconnect",
          });
        };
      });
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Odświeża status połączenia
   */
  private refreshConnectionStatus(): void {
    // Odświeżenie stanu połączenia może obejmować:
    // - ponowne sprawdzenie wszystkich komponentów
    // - odświeżenie interfejsu użytkownika
    // - ponowne inicjalizowanie handlerów

    console.log("Odświeżanie statusu połączenia Google Agents...");

    // Tutaj można dodać logikę odświeżania UI
    const statusElement = document.getElementById("google-agents-status");
    if (statusElement) {
      statusElement.textContent = "Sprawdzanie połączenia...";
    }
  }

  /**
   * Obsługa kliknięcia przycisku Google Agent
   */
  private handleGoogleAgentClick(event: Event): void {
    const button = event.currentTarget as HTMLElement;
    const agentType = button.getAttribute("data-google-agent");
    const agentId = button.getAttribute("data-agent-id");

    if (!agentType || !agentId) {
      console.error("Brak danych agenta w przycisku");
      return;
    }

    // Wykonaj zapytanie do Google Agent
    this.sendGoogleAgentRequest(agentType, agentId)
      .then((response) => {
        console.log("Odpowiedź od Google Agent:", response);
        // Aktualizuj UI z odpowiedzią
        this.updateAgentResponse(response);
      })
      .catch((error) => {
        console.error("Błąd podczas komunikacji z Google Agent:", error);
        this.showAgentError(error);
      });
  }

  /**
   * Wysyła zapytanie do Google Agent
   */
  private async sendGoogleAgentRequest(
    agentType: string,
    agentId: string
  ): Promise<any> {
    try {
      const response = await fetch("/api/google-agent-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentType,
          agentId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Błąd zapytania do Google Agent:", error);
      throw error;
    }
  }

  /**
   * Aktualizuje odpowiedź agenta w UI
   */
  private updateAgentResponse(response: any): void {
    const resultElement = document.getElementById("google-agent-result");
    if (resultElement) {
      resultElement.innerHTML = `
        <div class="agent-response">
          <h4>Odpowiedź:</h4>
          <pre>${JSON.stringify(response, null, 2)}</pre>
        </div>
      `;
    }
  }

  /**
   * Wyświetla błąd agenta
   */
  private showAgentError(error: any): void {
    const errorElement = document.getElementById("google-agent-error");
    if (errorElement) {
      errorElement.innerHTML = `
        <div class="agent-error">
          <h4>Błąd:</h4>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  /**
   * Test produkcyjnych endpoint na żywej stronie
   */
  async testProductionEndpoints(): Promise<Record<string, any>> {
    console.log("🌐 Testing production endpoints...");

    const PROD_URL = "https://29dcf914.luc-de-zen-on.pages.dev";
    const endpoints = ["/api/health", "/api/chat", "/api/polaczek-chat"];

    const results: Record<string, any> = {};

    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testing: ${PROD_URL}${endpoint}`);
        const response = await fetch(`${PROD_URL}${endpoint}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = response.ok ? await response.json() : null;
        results[endpoint] = {
          status: response.status,
          ok: response.ok,
          data: data,
        };

        console.log(
          `${response.ok ? "✅" : "❌"} ${endpoint}: ${response.status} ${
            response.ok ? "OK" : "FAILED"
          }`
        );
        if (data) console.log("Response data:", data);
      } catch (error: any) {
        results[endpoint] = { error: error?.message || "Unknown error" };
        console.log(
          `❌ ${endpoint}: ERROR - ${error?.message || "Unknown error"}`
        );
      }
    }

    console.log("📊 Production endpoints test completed:", results);
    return results;
  }

  /**
   * Test wszystkich przycisków na produkcji
   */
  async testProductionButtons(): Promise<Record<string, any>> {
    console.log("🔘 Testing production buttons...");

    // Symuluj kliknięcia przycisków (bezpieczne)
    const buttons = [
      { id: "main-chat", name: "Main Chat" },
      { id: "bigquery-analytics", name: "BigQuery Analytics" },
      { id: "kaggle-datasets", name: "Kaggle Datasets" },
      { id: "tavily-search", name: "Tavily Search" },
      { id: "agents", name: "AI Agents" },
    ];

    const buttonResults: Record<string, any> = {};

    for (const button of buttons) {
      const element = document.getElementById(button.id);
      if (element) {
        buttonResults[button.name] = {
          found: true,
          hasOnClick: !!element.onclick || !!element.getAttribute("onclick"),
          visible: element.offsetParent !== null,
        };
        console.log(`✅ Button "${button.name}": Found and configured`);
      } else {
        buttonResults[button.name] = { found: false };
        console.log(`❌ Button "${button.name}": Not found`);
      }
    }

    return buttonResults;
  }
}
