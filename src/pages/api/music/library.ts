import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;

    if (!env?.DB) {
      // Fallback for development mode without D1 binding
      return new Response(
        JSON.stringify({
          success: true,
          tracks: [
            {
              id: "1",
              title: "White Flag",
              artist: "Dido",
              album: "Life for Rent",
              genre: "Pop",
              duration: 240,
              url: "/music/01 Dido - White Flag.Mp3",
              play_count: 0,
              rating: 0,
              created_at: Date.now(),
            },
            {
              id: "2",
              title: "Personal Jesus",
              artist: "Depeche Mode",
              album: "Violator",
              genre: "Electronic",
              duration: 356,
              url: "/music/01. Personal Jesus.mp3",
              play_count: 0,
              rating: 0,
              created_at: Date.now(),
            },
          ],
          count: 2,
          timestamp: Date.now(),
          note: "Development mode - using fallback data",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Get all music tracks from D1
    const result = await env.DB.prepare(
      `
      SELECT id, title, artist, album, genre, duration, url, artwork, 
             play_count, rating, created_at, file_size
      FROM music_tracks 
      WHERE active = 1 
      ORDER BY created_at DESC
    `
    ).all();

    return new Response(
      JSON.stringify({
        success: true,
        tracks: result.results || [],
        count: result.results?.length || 0,
        timestamp: Date.now(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Music library error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: (error as any).message || "Failed to load music library",
      }),
      { status: 500 }
    );
  }
};
