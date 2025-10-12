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

    const formData = await request.formData();
    const audioFile = formData.get("audioFile") as File;
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const album = (formData.get("album") as string) || "Unknown Album";
    const genre = (formData.get("genre") as string) || "Unknown";

    if (!audioFile) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No audio file provided",
        }),
        { status: 400 }
      );
    }

    // Generate unique track ID
    const trackId = `track_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 6)}`;

    // For demo purposes, we'll create a data URL from the file
    // In production, you'd upload to R2 or another storage service
    const buffer = await audioFile.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const dataUrl = `data:${audioFile.type};base64,${base64}`;

    // Insert track into database
    const result = await env.DB.prepare(
      `
      INSERT INTO music_tracks (
        id, title, artist, album, genre, duration, url, 
        file_size, created_at, active, play_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    )
      .bind(
        trackId,
        title || audioFile.name.replace(/\.[^/.]+$/, ""),
        artist || "Unknown Artist",
        album,
        genre,
        0, // Duration will be set by client
        dataUrl, // In production, this would be an R2 URL
        audioFile.size,
        Date.now(),
        1,
        0
      )
      .run();

    const track = {
      id: trackId,
      title: title || audioFile.name.replace(/\.[^/.]+$/, ""),
      artist: artist || "Unknown Artist",
      album,
      genre,
      url: dataUrl,
      duration: 0,
      play_count: 0,
      created_at: Date.now(),
      file_size: audioFile.size,
    };

    return new Response(
      JSON.stringify({
        success: true,
        track: track,
        message: "Track uploaded successfully",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Upload error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to upload track",
      }),
      { status: 500 }
    );
  }
};
