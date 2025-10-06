
// Agent "Music Assistant 1" - kontroluje odtwarzacz muzyki
export const agentM1 = {
  id: "POLACZEK_M1",
  name: "Music Assistant 1",
  role: "Kontrola Muzyki",
  goal: "Zarządzanie odtwarzaniem muzyki, playlistami i głośnością.",
  capabilities: ["play", "pause", "volume-control", "playlist-management"],
  tools: ["spotify-api", "audio-player-control"],
  status: "idle",
  dependencies: ["spotify-api-service"],
  performance_metrics: {
    avg_response_time: "100ms",
    commands_per_minute: 120,
    error_rate: "0.3%",
  },
};
