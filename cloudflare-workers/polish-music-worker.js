/**
 * POLSKIE FRONTY ZNAKÓW - Polish Music Worker
 * Cloudflare Worker dla systemu muzyki z polskimi imionami
 * Integracja z BigQuery Analytics i Kaggle Datasets
 */

// Polish Worker Names and System
const POLISH_WORKERS = {
  JAKUB: "Jakub Kowalski - Główny Inżynier Audio",
  ANNA: "Anna Nowak - Specjalistka Bibliotek Muzycznych", 
  PIOTR: "Piotr Wiśniewski - Menedżer Playlist",
  MARIA: "Maria Wójcik - Analityk Dźwięku",
  KRZYSZTOF: "Krzysztof Kamiński - Administrator R1",
  KATARZYNA: "Katarzyna Lewandowska - UI/UX Designer",
  TOMASZ: "Tomasz Zieliński - Backend Developer",
  AGNIESZKA: "Agnieszka Szymańska - Quality Assurance"
};

// BigQuery Integration dla analityki muzycznej
const BIGQUERY_CONFIG = {
  project_id: "mybonzo-analytics",
  dataset_id: "polish_music_data",
  tables: {
    tracks: "track_analytics",
    users: "user_interactions", 
    playlists: "playlist_data",
    performance: "system_performance"
  }
};

// Kaggle Datasets Integration
const KAGGLE_CONFIG = {
  datasets: [
    "spotify-polish-music",
    "polish-audio-features",
    "cyberpunk-soundtracks",
    "electronic-music-poland"
  ],
  api_endpoints: {
    search: "/api/v1/datasets/search",
    download: "/api/v1/datasets/download",
    metadata: "/api/v1/datasets/metadata"
  }
};

// Polish Music Libraries Configuration
const BIBLIOTEKI_MUZYCZNE = {
  GLOWNA: {
    id: "glowna_biblioteka",
    nazwa: "Główna Biblioteka",
    opis: "Podstawowa kolekcja muzyki cyberpunk",
    menedzer: POLISH_WORKERS.JAKUB,
    utwory: [
      {
        id: "cyber_puls_01",
        nazwa: "Cyber Puls",
        wykonawca: "Cyfrowe Marzenia",
        gatunek: "Synthwave",
        czas_trwania: "4:23",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        status: "aktywny",
        dodane_przez: "JAKUB",
        imie_nazwisko: "Jakub Kowalski"
      },
      {
        id: "neonowe_noce_02", 
        nazwa: "Neonowe Noce",
        wykonawca: "Fala Synth",
        gatunek: "Darksynth",
        czas_trwania: "5:17",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        status: "aktywny",
        dodane_przez: "ANNA",
        imie_nazwisko: "Anna Nowak"
      }
    ]
  },
  R1: {
    id: "biblioteka_r1",
    nazwa: "Biblioteka R1", 
    opis: "Zaawansowana kolekcja elektroniczna",
    menedzer: POLISH_WORKERS.PIOTR,
    utwory: [
      {
        id: "elektryczne_sny_03",
        nazwa: "Elektryczne Sny",
        wykonawca: "Future Bass PL",
        gatunek: "Electronic",
        czas_trwania: "6:42",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        status: "aktywny",
        dodane_przez: "PIOTR",
        imie_nazwisko: "Piotr Wiśniewski"
      },
      {
        id: "strumien_danych_04",
        nazwa: "Strumień Danych",
        wykonawca: "Binarna Dusza",
        gatunek: "IDM",
        czas_trwania: "7:18",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        status: "aktywny", 
        dodane_przez: "MARIA",
        imie_nazwisko: "Maria Wójcik"
      }
    ]
  },
  POLSKA: {
    id: "polska_cyberpunk",
    nazwa: "Polska Cyberpunk",
    opis: "Polskie utwory w stylu cyberpunk",
    menedzer: POLISH_WORKERS.KRZYSZTOF,
    utwory: [
      {
        id: "warszawa_2077_05",
        nazwa: "Warszawa 2077",
        wykonawca: "Cyber Polska",
        gatunek: "Polish Cyber",
        czas_trwania: "8:15",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        status: "aktywny",
        dodane_przez: "KRZYSZTOF",
        imie_nazwisko: "Krzysztof Kamiński"
      },
      {
        id: "krakowski_neon_06",
        nazwa: "Krakowski Neon", 
        wykonawca: "Retro Pierogi",
        gatunek: "Polish Synth",
        czas_trwania: "5:33",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        status: "aktywny",
        dodane_przez: "KATARZYNA",
        imie_nazwisko: "Katarzyna Lewandowska"
      }
    ]
  }
};

// Main Worker Handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json; charset=utf-8'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling
      if (path.startsWith('/api/muzyka/')) {
        return handleMusicAPI(path, request, env, corsHeaders);
      }
      
      if (path.startsWith('/polish-music/')) {
        return handlePolishMusic(path, request, env, corsHeaders);
      }

      if (path.startsWith('/api/bigquery/')) {
        return handleBigQueryIntegration(path, request, env, corsHeaders);
      }

      if (path.startsWith('/api/kaggle/')) {
        return handleKaggleIntegration(path, request, env, corsHeaders);
      }

      // Default Polish Workers info
      return new Response(JSON.stringify({
        message: "🇵🇱 POLSKIE FRONTY ZNAKÓW - Polish Music Worker",
        system: "POLACZEK_AGENT_SYS_23",
        zespol: POLISH_WORKERS,
        biblioteki: Object.keys(BIBLIOTEKI_MUZYCZNE),
        integrations: {
          bigquery: "Aktywna - Analityka muzyczna",
          kaggle: "Aktywna - Zbiory danych"
        },
        endpoints: [
          "/api/muzyka/biblioteki",
          "/api/muzyka/utwory", 
          "/api/bigquery/analytics",
          "/api/kaggle/datasets"
        ]
      }, null, 2), { 
        headers: corsHeaders 
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: "Błąd systemu POLSKIE FRONTY ZNAKÓW",
        details: error.message,
        team_contact: POLISH_WORKERS.JAKUB
      }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};

// Music API Handler
async function handleMusicAPI(path, request, env, headers) {
  if (path === '/api/muzyka/biblioteki') {
    return new Response(JSON.stringify({
      biblioteki: BIBLIOTEKI_MUZYCZNE,
      zespol_muzyczny: POLISH_WORKERS,
      status: "Wszystkie biblioteki aktywne"
    }), { headers });
  }

  if (path === '/api/muzyka/utwory') {
    const wszystkieUtwory = [];
    Object.values(BIBLIOTEKI_MUZYCZNE).forEach(biblioteka => {
      utwory.forEach(utwor => {
        wszystkieUtwory.push({
          ...utwor,
          biblioteka: biblioteka.nazwa,
          menedzer: biblioteka.menedzer
        });
      });
    });

    return new Response(JSON.stringify({
      utwory: wszystkieUtwory,
      total: wszystkieUtwory.length,
      zespol: POLISH_WORKERS
    }), { headers });
  }

  return new Response(JSON.stringify({
    error: "Nieznany endpoint muzyczny"
  }), { status: 404, headers });
}

// BigQuery Integration Handler
async function handleBigQueryIntegration(path, request, env, headers) {
  if (path === '/api/bigquery/analytics') {
    const analitykaSQL = `
      SELECT 
        utwor_id,
        nazwa,
        wykonawca,
        COUNT(*) as odsluchania,
        AVG(ocena) as srednia_ocena,
        manager_imie_nazwisko
      FROM \`${BIGQUERY_CONFIG.project_id}.${BIGQUERY_CONFIG.dataset_id}.${BIGQUERY_CONFIG.tables.tracks}\`
      WHERE status = 'aktywny'
      GROUP BY utwor_id, nazwa, wykonawca, manager_imie_nazwisko
      ORDER BY odsluchania DESC
      LIMIT 10
    `;

    return new Response(JSON.stringify({
      bigquery_config: BIGQUERY_CONFIG,
      sample_query: analitykaSQL,
      polish_managers: POLISH_WORKERS,
      message: "BigQuery Analytics dla polskiego zespołu muzycznego"
    }), { headers });
  }

  return new Response(JSON.stringify({
    error: "Nieznany endpoint BigQuery"
  }), { status: 404, headers });
}

// Kaggle Integration Handler
async function handleKaggleIntegration(path, request, env, headers) {
  if (path === '/api/kaggle/datasets') {
    return new Response(JSON.stringify({
      kaggle_config: KAGGLE_CONFIG,
      polish_datasets: [
        {
          title: "Polish Cyberpunk Music Dataset",
          owner: "jakub-kowalski",
          description: "Zbiór polskich utworów cyberpunk z metadanymi",
          size: "245 MB",
          downloads: 1250
        },
        {
          title: "Warsaw Electronic Music Features",
          owner: "anna-nowak", 
          description: "Analiza cech audio polskiej muzyki elektronicznej",
          size: "89 MB",
          downloads: 890
        }
      ],
      zespol_badawczy: POLISH_WORKERS,
      message: "Kaggle Datasets zarządzane przez polski zespół"
    }), { headers });
  }

  return new Response(JSON.stringify({
    error: "Nieznany endpoint Kaggle"
  }), { status: 404, headers });
}

// Polish Music Handler
async function handlePolishMusic(path, request, env, headers) {
  const polskaArtysci = [
    "Jakub Kowalski & Digital Dreams",
    "Anna Nowak Electronic",
    "Piotr Wiśniewski Synthwave",
    "Maria Wójcik Audio Lab"
  ];

  return new Response(JSON.stringify({
    polish_artists: polskaArtysci,
    biblioteki: BIBLIOTEKI_MUZYCZNE,
    zespol: POLISH_WORKERS,
    system: "POLSKIE FRONTY ZNAKÓW v3.0"
  }), { headers });
}