// Integracja z polskim modelem Bielik LLM – przykładowy adapter dla orchestratora

// Zakładamy, że masz endpoint REST/Bielik API lub lokalny serwer
const BIELIK_API_URL = process.env.BIELIK_API_URL || "https://bielik-api.yourdomain.com/v1/llm";

// Adapter do wywołań modelu Bielik
export const BielikModel = {
  /**
   * Planowanie workflow na podstawie komendy i kontekstu
   * @param command Komenda użytkownika/systemu (np. "Wygeneruj raport churn")
   * @param context Dodatkowy kontekst (np. userId, role, data)
   */
  async planWorkflow(command: string, context?: any): Promise<{
    agents: string[],
    tasks: Record<string, any>,
    summary: string
  }> {
    const prompt = `
      Jesteś agentem orchestration. Odpowiedz JSONem:
      - agents: [lista agentów do uruchomienia]
      - tasks: {agent: opis zadania}
      - summary: podsumowanie workflow
      Komenda: ${command}
      Kontekst: ${JSON.stringify(context || {})}
    `;
    const response = await fetch(BIELIK_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        max_tokens: 800,
        temperature: 0.2
      })
    });
    const data = await response.json();
    // Upewnij się, że API zwraca JSON o właściwej strukturze
    return data.result as { agents: string[], tasks: Record<string, any>, summary: string };
  },

  /**
   * Podejmowanie decyzji na podstawie wejścia i kontekstu
   * @param inputs Dane wejściowe (np. statusy agentów, wyniki)
   * @param context Kontekst zadania/organizacji
   */
  async decide(inputs: Record<string, any>, context?: any): Promise<{
    decision: string,
    explanation: string
  }> {
    const prompt = `
      Na podstawie poniższych danych podejmij decyzję biznesową/systemową (JSON: decision, explanation).
      Inputs: ${JSON.stringify(inputs)}
      Context: ${JSON.stringify(context || {})}
    `;
    const response = await fetch(BIELIK_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        max_tokens: 400,
        temperature: 0.2
      })
    });
    const data = await response.json();
    return data.result as { decision: string, explanation: string };
  }
};