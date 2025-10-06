
// Agent "Tłumacz" - odpowiada za tłumaczenia i obsługę językową
export const agentT = {
  id: "POLACZEK_T",
  name: "Tłumacz",
  role: "Tłumaczenia i Lokalizacja",
  goal: "Tłumaczenie tekstu w czasie rzeczywistym, dostosowywanie treści do języka użytkownika.",
  capabilities: ["translate", "language-detection", "localization"],
  tools: ["google-translate-api", "deepl-api"],
  status: "active",
  dependencies: ["translation-service"],
  performance_metrics: {
    avg_response_time: "200ms",
    translations_per_minute: 150,
    error_rate: "1%",
  },
};
