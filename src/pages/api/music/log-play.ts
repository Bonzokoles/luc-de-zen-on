import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;

    if (!env?.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Database not available",
        }),
        { status: 500 }
      );
    }

    const { trackId, timestamp, duration, completed } =
      (await request.json()) as {
        trackId?: string;
        timestamp?: number;
        duration?: number;
        completed?: boolean;
      };

    if (!trackId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Track ID is required",
        }),
        { status: 400 }
      );
    }

    // Insert play history record
    await env.DB.prepare(
      `
      INSERT INTO music_play_history (track_id, played_at, duration_played, completed, source)
      VALUES (?, ?, ?, ?, ?)
    `
    )
      .bind(
        trackId,
        timestamp || Date.now(),
        duration || 0,
        completed ? 1 : 0,
        "library"
      )
      .run();

    // Update play count for the track
    await env.DB.prepare(
      `
      UPDATE music_tracks 
      SET play_count = play_count + 1, updated_at = ?
      WHERE id = ?
    `
    )
      .bind(Date.now(), trackId)
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Play logged successfully",
        trackId: trackId,
        timestamp: timestamp || Date.now(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Log play error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message || "Failed to log play",
      }),
      { status: 500 }
    );
  }
};
