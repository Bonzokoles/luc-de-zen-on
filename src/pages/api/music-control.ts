// Music Assistant API - Integracja z D1 Database
// Endpoint: /api/music-control

export async function POST({ request, locals }) {
  try {
    const { action, ...params } = await request.json();
    const db = locals.runtime.env.AGENTS_DB;

    switch (action) {
      case "play":
        return await playMusic(db, params);
      case "pause":
        return await pauseMusic(db, params);
      case "stop":
        return await stopMusic(db, params);
      case "next":
        return await nextTrack(db, params);
      case "prev":
        return await previousTrack(db, params);
      case "load_playlist":
        return await loadPlaylist(db, params);
      case "add_to_library":
        return await addToLibrary(db, params);
      case "get_library":
        return await getLibrary(db, params);
      case "create_playlist":
        return await createPlaylist(db, params);
      case "get_playlists":
        return await getPlaylists(db, params);
      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Music Control API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function playMusic(db, { trackId, playlistId }) {
  let track;

  if (trackId) {
    // Odtwarzaj konkretny utwór
    const result = await db
      .prepare("SELECT * FROM music_library WHERE id = ?")
      .bind(trackId)
      .first();
    track = result;
  } else if (playlistId) {
    // Odtwarzaj pierwszy utwór z playlisty
    const result = await db
      .prepare(
        `
      SELECT ml.* FROM music_library ml
      JOIN playlist_tracks pt ON ml.id = pt.track_id
      WHERE pt.playlist_id = ?
      ORDER BY pt.position ASC
      LIMIT 1
    `
      )
      .bind(playlistId)
      .first();
    track = result;
  } else {
    // Odtwarzaj losowy utwór
    const result = await db
      .prepare("SELECT * FROM music_library ORDER BY RANDOM() LIMIT 1")
      .first();
    track = result;
  }

  if (track) {
    // Zwiększ licznik odtworzeń
    await db
      .prepare(
        "UPDATE music_library SET play_count = play_count + 1 WHERE id = ?"
      )
      .bind(track.id)
      .run();

    // Loguj akcję
    await db
      .prepare(
        `
      INSERT INTO system_logs (agent_id, log_level, message, data)
      VALUES (?, ?, ?, ?)
    `
      )
      .bind(
        "music-control",
        "INFO",
        "Track played",
        JSON.stringify({ trackId: track.id, title: track.title })
      )
      .run();
  }

  return new Response(
    JSON.stringify({
      success: true,
      action: "play",
      track: track,
      message: track
        ? `Now playing: ${track.title} by ${track.artist}`
        : "No track found",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function pauseMusic(db, params) {
  // Loguj akcję pauzy
  await db
    .prepare(
      `
    INSERT INTO system_logs (agent_id, log_level, message)
    VALUES (?, ?, ?)
  `
    )
    .bind("music-control", "INFO", "Music paused")
    .run();

  return new Response(
    JSON.stringify({
      success: true,
      action: "pause",
      message: "Music paused",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function stopMusic(db, params) {
  // Loguj akcję zatrzymania
  await db
    .prepare(
      `
    INSERT INTO system_logs (agent_id, log_level, message)
    VALUES (?, ?, ?)
  `
    )
    .bind("music-control", "INFO", "Music stopped")
    .run();

  return new Response(
    JSON.stringify({
      success: true,
      action: "stop",
      message: "Music stopped",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function nextTrack(db, { playlistId }) {
  let nextTrack;

  if (playlistId) {
    // Pobierz następny utwór z playlisty
    const result = await db
      .prepare(
        `
      SELECT ml.* FROM music_library ml
      JOIN playlist_tracks pt ON ml.id = pt.track_id
      WHERE pt.playlist_id = ?
      ORDER BY pt.position ASC
      LIMIT 1 OFFSET 1
    `
      )
      .bind(playlistId)
      .first();
    nextTrack = result;
  }

  if (!nextTrack) {
    // Jeśli nie ma następnego w playliście, weź losowy
    const result = await db
      .prepare("SELECT * FROM music_library ORDER BY RANDOM() LIMIT 1")
      .first();
    nextTrack = result;
  }

  if (nextTrack) {
    await db
      .prepare(
        "UPDATE music_library SET play_count = play_count + 1 WHERE id = ?"
      )
      .bind(nextTrack.id)
      .run();
  }

  return new Response(
    JSON.stringify({
      success: true,
      action: "next",
      track: nextTrack,
      message: nextTrack ? `Next: ${nextTrack.title}` : "No next track",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function previousTrack(db, { playlistId }) {
  // Podobna logika jak nextTrack, ale w odwrotną stronę
  const result = await db
    .prepare("SELECT * FROM music_library ORDER BY RANDOM() LIMIT 1")
    .first();

  return new Response(
    JSON.stringify({
      success: true,
      action: "previous",
      track: result,
      message: result ? `Previous: ${result.title}` : "No previous track",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function loadPlaylist(db, { playlistId }) {
  const playlist = await db
    .prepare("SELECT * FROM playlists WHERE id = ?")
    .bind(playlistId)
    .first();

  if (!playlist) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Playlist not found",
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const tracks = await db
    .prepare(
      `
    SELECT ml.*, pt.position FROM music_library ml
    JOIN playlist_tracks pt ON ml.id = pt.track_id
    WHERE pt.playlist_id = ?
    ORDER BY pt.position ASC
  `
    )
    .bind(playlistId)
    .all();

  return new Response(
    JSON.stringify({
      success: true,
      playlist: playlist,
      tracks: tracks.results,
      message: `Loaded playlist: ${playlist.name} (${tracks.results.length} tracks)`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function addToLibrary(
  db,
  {
    title,
    artist,
    album = null,
    genre = null,
    duration = null,
    url = null,
    source = "manual",
  }
) {
  const result = await db
    .prepare(
      `
    INSERT INTO music_library (title, artist, album, genre, duration, url, source)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `
    )
    .bind(title, artist, album, genre, duration, url, source)
    .run();

  if (result.success) {
    // Loguj dodanie do biblioteki
    await db
      .prepare(
        `
      INSERT INTO system_logs (agent_id, log_level, message, data)
      VALUES (?, ?, ?, ?)
    `
      )
      .bind(
        "music-control",
        "INFO",
        "Track added to library",
        JSON.stringify({ trackId: result.meta.last_row_id, title, artist })
      )
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        trackId: result.meta.last_row_id,
        message: `Added "${title}" by ${artist} to library`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: "Failed to add track to library",
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function getLibrary(db, { limit = 50, offset = 0, genre = null }) {
  let query = "SELECT * FROM music_library";
  let params = [];

  if (genre) {
    query += " WHERE genre = ?";
    params.push(genre);
  }

  query += " ORDER BY added_date DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const result = await db
    .prepare(query)
    .bind(...params)
    .all();

  return new Response(
    JSON.stringify({
      success: true,
      tracks: result.results,
      count: result.results.length,
      message: `Retrieved ${result.results.length} tracks from library`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function createPlaylist(db, { name, description = null }) {
  const result = await db
    .prepare(
      `
    INSERT INTO playlists (name, description, agent_id)
    VALUES (?, ?, ?)
  `
    )
    .bind(name, description, "music-control")
    .run();

  if (result.success) {
    return new Response(
      JSON.stringify({
        success: true,
        playlistId: result.meta.last_row_id,
        message: `Created playlist: ${name}`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: "Failed to create playlist",
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function getPlaylists(db, params) {
  const result = await db
    .prepare(
      `
    SELECT p.*, COUNT(pt.track_id) as track_count 
    FROM playlists p
    LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
    WHERE p.is_active = TRUE
    GROUP BY p.id
    ORDER BY p.created_date DESC
  `
    )
    .all();

  return new Response(
    JSON.stringify({
      success: true,
      playlists: result.results,
      count: result.results.length,
      message: `Retrieved ${result.results.length} playlists`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
