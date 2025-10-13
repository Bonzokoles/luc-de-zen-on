// Agent 02 - Music Control API
import type { APIRoute } from "astro";
import { AGENT_CONFIG } from "./config";

// Audio system state
let audioContext: AudioContext | null = null;
let currentTrack: HTMLAudioElement | null = null;
let playlist: Array<{ id: string; title: string; url: string }> = [];
let currentIndex = 0;
let volume = AGENT_CONFIG.audio.defaultVolume;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { action, data } = (await request.json()) as any;

    switch (action) {
      case "test":
        return testAgent();

      case "play":
        return await playMusic(data);

      case "pause":
        return pauseMusic();

      case "next":
        return nextTrack();

      case "previous":
        return previousTrack();

      case "volume_up":
        return changeVolume(0.1);

      case "volume_down":
        return changeVolume(-0.1);

      case "mute":
        return toggleMute();

      case "search":
        return searchMusic(data.query);

      case "status":
        return getPlayerStatus();

      default:
        return errorResponse("Invalid action");
    }
  } catch (error) {
    console.error("Music Control API error:", error);
    return errorResponse((error as Error).message);
  }
};

export const GET: APIRoute = async ({ url }) => {
  const action = url.searchParams.get("action");

  switch (action) {
    case "status":
      return getPlayerStatus();
    case "playlist":
      return getPlaylist();
    default:
      return getPlayerStatus();
  }
};

// Core Functions
async function testAgent() {
  return successResponse({
    message: "Music Control Agent test successful",
    agent: AGENT_CONFIG.name,
    capabilities: AGENT_CONFIG.capabilities,
    status: "operational",
    audioSupport: typeof Audio !== "undefined",
  });
}

async function playMusic(data: { url?: string; trackId?: string }) {
  if (data.url) {
    // Play specific URL
    if (currentTrack) {
      currentTrack.pause();
    }

    currentTrack = new Audio(data.url);
    currentTrack.volume = volume;

    try {
      await currentTrack.play();
      return successResponse({
        message: "Odtwarzanie rozpoczęte",
        track: data.url,
        volume: volume,
      });
    } catch (error) {
      return errorResponse(`Błąd odtwarzania: ${(error as Error).message}`);
    }
  }

  // Resume current track
  if (currentTrack) {
    try {
      await currentTrack.play();
      return successResponse({
        message: "Wznowiono odtwarzanie",
        volume: volume,
      });
    } catch (error) {
      return errorResponse(`Błąd wznawiania: ${(error as Error).message}`);
    }
  }

  return errorResponse("Brak utworu do odtworzenia");
}

function pauseMusic() {
  if (currentTrack && !currentTrack.paused) {
    currentTrack.pause();
    return successResponse({
      message: "Zatrzymano odtwarzanie",
      currentTime: currentTrack.currentTime,
      duration: currentTrack.duration,
    });
  }

  return errorResponse("Brak aktywnego utworu");
}

function nextTrack() {
  if (playlist.length > 0 && currentIndex < playlist.length - 1) {
    currentIndex++;
    const nextTrack = playlist[currentIndex];
    return playMusic({ url: nextTrack.url });
  }

  return errorResponse("Brak następnego utworu");
}

function previousTrack() {
  if (playlist.length > 0 && currentIndex > 0) {
    currentIndex--;
    const prevTrack = playlist[currentIndex];
    return playMusic({ url: prevTrack.url });
  }

  return errorResponse("Brak poprzedniego utworu");
}

function changeVolume(delta: number) {
  volume = Math.max(0, Math.min(1, volume + delta));

  if (currentTrack) {
    currentTrack.volume = volume;
  }

  return successResponse({
    message: `Głośność: ${Math.round(volume * 100)}%`,
    volume: volume,
  });
}

function toggleMute() {
  if (currentTrack) {
    if (currentTrack.volume > 0) {
      currentTrack.volume = 0;
      return successResponse({ message: "Wyciszono", muted: true });
    } else {
      currentTrack.volume = volume;
      return successResponse({ message: "Włączono dźwięk", muted: false });
    }
  }

  return errorResponse("Brak aktywnego utworu");
}

function searchMusic(query: string) {
  // Mock search results - in real implementation this would call Spotify/YouTube API
  const mockResults = [
    { id: "1", title: `${query} - Result 1`, url: "/audio/sample1.mp3" },
    { id: "2", title: `${query} - Result 2`, url: "/audio/sample2.mp3" },
    { id: "3", title: `${query} - Result 3`, url: "/audio/sample3.mp3" },
  ];

  return successResponse({
    message: `Znaleziono ${mockResults.length} wyników dla: ${query}`,
    results: mockResults,
    query: query,
  });
}

function getPlayerStatus() {
  return successResponse({
    agent: AGENT_CONFIG.name,
    status: currentTrack
      ? currentTrack.paused
        ? "paused"
        : "playing"
      : "stopped",
    volume: volume,
    currentTime: currentTrack?.currentTime || 0,
    duration: currentTrack?.duration || 0,
    playlist: playlist.length,
    currentIndex: currentIndex,
    currentTrack: playlist[currentIndex] || null,
  });
}

function getPlaylist() {
  return successResponse({
    playlist: playlist,
    currentIndex: currentIndex,
    total: playlist.length,
  });
}

// Utility Functions
function successResponse(data: any) {
  return new Response(
    JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      agent: AGENT_CONFIG.id,
      ...data,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

function errorResponse(message: string) {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
      agent: AGENT_CONFIG.id,
    }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }
  );
}
