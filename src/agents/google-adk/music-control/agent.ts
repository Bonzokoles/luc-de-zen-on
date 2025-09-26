/**
 * 🎵 Music Control Agent - Web Audio API Implementation
 * TypeScript port of music_control_agent.py with web audio compatibility
 */

import { BaseGoogleADKAgent, AgentConfig, AgentResponse, Track, Playlist, AudioState } from '../types';

export interface MusicControlTypes {
  track: Track;
  playlist: Playlist;
  audioState: AudioState;
}

export class MusicControlAgent extends BaseGoogleADKAgent {
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private gainNode: GainNode | null = null;
  
  private playlists: Map<string, Playlist> = new Map();
  private currentPlaylist: Playlist | null = null;
  private currentTrack: Track | null = null;
  
  private audioState: AudioState = {
    is_playing: false,
    position: 0,
    volume: 0.7,
    duration: 0
  };

  private updateInterval: number | null = null;

  constructor() {
    const config: AgentConfig = {
      agent_id: "music_control_001",
      name: "Music Control Agent", 
      model: "web-audio-api",
      status: "ready",
      category: "utility",
      icon: "🎵",
      color: "#1db954",
      priority: "HIGH",
      description: "Agent do kontroli odtwarzania muzyki i zarządzania playlistami"
    };

    super(config);
    this.setupCapabilities();
    this.setupEventListeners();
  }

  async initialize(): Promise<void> {
    try {
      // Inicjalizuj Audio Context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Utwórz gain node do kontroli głośności
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.audioState.volume;

      // Załaduj przykładowe playlisty
      await this.loadSamplePlaylists();
      
      this.config.status = 'ready';
      console.log('🎵 Music Control Agent zainicjalizowany');
      
    } catch (error) {
      this.config.status = 'error';
      console.error('❌ Błąd inicjalizacji Music Control Agent:', error);
      throw error;
    }
  }

  private setupCapabilities(): void {
    this.capabilities = [
      {
        name: "Odtwarzanie muzyki",
        description: "Kontrola odtwarzania: play, pause, stop, next, previous",
        category: "playback",
        complexity: "intermediate",
        examples: ["Odtwórz utwór", "Zatrzymaj muzykę", "Następny utwór"]
      },
      {
        name: "Zarządzanie playlistami",
        description: "Tworzenie i zarządzanie playlistami muzycznymi",
        category: "playlist",
        complexity: "advanced",
        examples: ["Utwórz playlistę", "Dodaj do playlisty", "Usuń z playlisty"]
      },
      {
        name: "Kontrola głośności",
        description: "Regulacja poziomu głośności i efektów audio",
        category: "audio",
        complexity: "basic",
        examples: ["Zwiększ głośność", "Wycisz", "Ustaw głośność na 50%"]
      },
      {
        name: "Tryby odtwarzania",
        description: "Shuffle, repeat, losowe odtwarzanie",
        category: "modes",
        complexity: "intermediate",
        examples: ["Włącz shuffle", "Powtarzaj wszystko", "Tryb losowy"]
      }
    ];
  }

  private setupEventListeners(): void {
    // Nasłuchuj wydarzeń z voice command agent
    window.addEventListener('musicControl', (event: Event) => {
      const customEvent = event as CustomEvent;
      const { action, change } = customEvent.detail;
      
      switch (action) {
        case 'play':
          this.play();
          break;
        case 'pause':
          this.pause();
          break;
        case 'stop':
          this.stop();
          break;
        case 'next':
          this.nextTrack();
          break;
        case 'previous':
          this.previousTrack();
          break;
        case 'volume':
          if (change !== undefined) {
            this.adjustVolume(change);
          }
          break;
      }
    });
  }

  async processMessage(message: string): Promise<AgentResponse> {
    const startTime = new Date();
    
    try {
      this.addToHistory({
        timestamp: startTime.toISOString(),
        type: 'input',
        content: message
      });

      const response = await this.processCommand(message.toLowerCase().trim());
      
      const endTime = new Date();
      const responseTime = (endTime.getTime() - startTime.getTime()) / 1000;
      
      this.addToHistory({
        timestamp: endTime.toISOString(),
        type: 'output',
        content: response,
        response_time: responseTime
      });

      this.updateMetrics(responseTime, true);

      return {
        status: 'success',
        response,
        metadata: {
          agent: this.config.name,
          model: this.config.model,
          response_time: responseTime,
          timestamp: endTime.toISOString()
        }
      };

    } catch (error) {
      const endTime = new Date();
      const responseTime = (endTime.getTime() - startTime.getTime()) / 1000;
      
      this.updateMetrics(responseTime, false);
      
      return {
        status: 'error',
        error_message: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async processCommand(command: string): Promise<string> {
    if (command.includes('play') || command.includes('odtwórz')) {
      return await this.play();
    } else if (command.includes('pause') || command.includes('pauza')) {
      return await this.pause();
    } else if (command.includes('stop') || command.includes('zatrzymaj')) {
      return await this.stop();
    } else if (command.includes('next') || command.includes('następny')) {
      return await this.nextTrack();
    } else if (command.includes('previous') || command.includes('poprzedni')) {
      return await this.previousTrack();
    } else if (command.includes('volume') || command.includes('głośność')) {
      const volumeMatch = command.match(/(\d+)/);
      if (volumeMatch) {
        const volume = parseInt(volumeMatch[1]) / 100;
        return await this.setVolume(volume);
      }
      return "Podaj poziom głośności od 0 do 100";
    } else if (command.includes('shuffle') || command.includes('losowo')) {
      return await this.toggleShuffle();
    } else if (command.includes('repeat') || command.includes('powtarzaj')) {
      return await this.toggleRepeat();
    } else if (command.includes('playlist') || command.includes('playlista')) {
      return await this.listPlaylists();
    } else if (command.includes('status') || command.includes('status')) {
      return await this.getMusicStatus();
    } else {
      return "Nieznana komenda muzyczna. Dostępne: play, pause, stop, next, previous, volume, shuffle, repeat, playlist, status";
    }
  }

  // Podstawowe kontrolki odtwarzania
  async play(): Promise<string> {
    try {
      if (!this.currentTrack) {
        if (this.currentPlaylist && this.currentPlaylist.tracks.length > 0) {
          this.currentTrack = this.currentPlaylist.tracks[this.currentPlaylist.current_track];
        } else {
          return "Brak utworu do odtworzenia. Załaduj playlistę.";
        }
      }

      if (this.currentAudio) {
        await this.currentAudio.play();
        this.audioState.is_playing = true;
        this.startProgressTracking();
        return `▶️ Odtwarzam: ${this.currentTrack.title} - ${this.currentTrack.artist}`;
      } else {
        await this.loadTrack(this.currentTrack);
        return await this.play();
      }
      
    } catch (error) {
      return `❌ Błąd odtwarzania: ${error}`;
    }
  }

  async pause(): Promise<string> {
    if (this.currentAudio && this.audioState.is_playing) {
      this.currentAudio.pause();
      this.audioState.is_playing = false;
      this.stopProgressTracking();
      return "⏸️ Wstrzymano odtwarzanie";
    }
    return "Muzyka nie jest obecnie odtwarzana";
  }

  async stop(): Promise<string> {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.audioState.is_playing = false;
      this.audioState.position = 0;
      this.stopProgressTracking();
      return "⏹️ Zatrzymano odtwarzanie";
    }
    return "Brak aktywnego odtwarzania";
  }

  async nextTrack(): Promise<string> {
    if (!this.currentPlaylist) {
      return "Brak aktywnej playlisty";
    }

    if (this.currentPlaylist.shuffle) {
      this.currentPlaylist.current_track = Math.floor(Math.random() * this.currentPlaylist.tracks.length);
    } else {
      this.currentPlaylist.current_track = (this.currentPlaylist.current_track + 1) % this.currentPlaylist.tracks.length;
    }

    this.currentTrack = this.currentPlaylist.tracks[this.currentPlaylist.current_track];
    await this.loadTrack(this.currentTrack);
    
    if (this.audioState.is_playing) {
      await this.play();
    }

    return `⏭️ Następny utwór: ${this.currentTrack.title} - ${this.currentTrack.artist}`;
  }

  async previousTrack(): Promise<string> {
    if (!this.currentPlaylist) {
      return "Brak aktywnej playlisty";
    }

    this.currentPlaylist.current_track = 
      this.currentPlaylist.current_track === 0 
        ? this.currentPlaylist.tracks.length - 1 
        : this.currentPlaylist.current_track - 1;

    this.currentTrack = this.currentPlaylist.tracks[this.currentPlaylist.current_track];
    await this.loadTrack(this.currentTrack);
    
    if (this.audioState.is_playing) {
      await this.play();
    }

    return `⏮️ Poprzedni utwór: ${this.currentTrack.title} - ${this.currentTrack.artist}`;
  }

  // Kontrola głośności
  async setVolume(volume: number): Promise<string> {
    volume = Math.max(0, Math.min(1, volume));
    this.audioState.volume = volume;
    
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
    
    if (this.currentAudio) {
      this.currentAudio.volume = volume;
    }

    return `🔊 Głośność ustawiona na ${Math.round(volume * 100)}%`;
  }

  async adjustVolume(change: number): Promise<string> {
    const newVolume = this.audioState.volume + change;
    return await this.setVolume(newVolume);
  }

  // Tryby odtwarzania
  async toggleShuffle(): Promise<string> {
    if (this.currentPlaylist) {
      this.currentPlaylist.shuffle = !this.currentPlaylist.shuffle;
      return `🔀 Shuffle ${this.currentPlaylist.shuffle ? 'włączony' : 'wyłączony'}`;
    }
    return "Brak aktywnej playlisty";
  }

  async toggleRepeat(): Promise<string> {
    if (this.currentPlaylist) {
      const modes = ['none', 'one', 'all'] as const;
      const currentIndex = modes.indexOf(this.currentPlaylist.repeat);
      this.currentPlaylist.repeat = modes[(currentIndex + 1) % modes.length];
      
      const modeNames = {
        'none': 'wyłączony',
        'one': 'jeden utwór',
        'all': 'wszystkie'
      };
      
      return `🔁 Repeat: ${modeNames[this.currentPlaylist.repeat]}`;
    }
    return "Brak aktywnej playlisty";
  }

  // Zarządzanie playlistami
  async createPlaylist(name: string, tracks: Track[] = []): Promise<string> {
    const playlist: Playlist = {
      id: `playlist_${Date.now()}`,
      name,
      tracks,
      current_track: 0,
      shuffle: false,
      repeat: 'none'
    };

    this.playlists.set(playlist.id, playlist);
    return `📝 Utworzono playlistę: ${name} (${tracks.length} utworów)`;
  }

  async addToPlaylist(playlistId: string, track: Track): Promise<string> {
    const playlist = this.playlists.get(playlistId);
    if (playlist) {
      playlist.tracks.push(track);
      return `➕ Dodano "${track.title}" do playlisty "${playlist.name}"`;
    }
    return "Nie znaleziono playlisty";
  }

  async removeFromPlaylist(playlistId: string, trackIndex: number): Promise<string> {
    const playlist = this.playlists.get(playlistId);
    if (playlist && trackIndex >= 0 && trackIndex < playlist.tracks.length) {
      const removedTrack = playlist.tracks.splice(trackIndex, 1)[0];
      return `➖ Usunięto "${removedTrack.title}" z playlisty "${playlist.name}"`;
    }
    return "Nie można usunąć utworu";
  }

  async selectPlaylist(playlistId: string): Promise<string> {
    const playlist = this.playlists.get(playlistId);
    if (playlist) {
      this.currentPlaylist = playlist;
      if (playlist.tracks.length > 0) {
        this.currentTrack = playlist.tracks[0];
        await this.loadTrack(this.currentTrack);
      }
      return `📻 Wybrano playlistę: ${playlist.name} (${playlist.tracks.length} utworów)`;
    }
    return "Nie znaleziono playlisty";
  }

  async listPlaylists(): Promise<string> {
    if (this.playlists.size === 0) {
      return "Brak dostępnych playlist";
    }

    const playlistList = Array.from(this.playlists.values())
      .map(p => `📻 ${p.name} (${p.tracks.length} utworów)`)
      .join('\n');

    return `Dostępne playlisty:\n${playlistList}`;
  }

  // Pomocnicze metody
  private async loadTrack(track: Track): Promise<void> {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.remove();
    }

    this.currentAudio = new Audio();
    this.currentAudio.volume = this.audioState.volume;
    
    // Dla demonstracji - w rzeczywistej aplikacji ładowałbyś rzeczywiste pliki audio
    // this.currentAudio.src = track.file_path;
    
    this.currentAudio.onloadedmetadata = () => {
      if (this.currentAudio) {
        this.audioState.duration = this.currentAudio.duration;
      }
    };

    this.currentAudio.onended = () => {
      this.handleTrackEnd();
    };

    this.currentAudio.onerror = (error) => {
      console.error('❌ Błąd ładowania utworu:', error);
    };
  }

  private handleTrackEnd(): void {
    if (!this.currentPlaylist) return;

    if (this.currentPlaylist.repeat === 'one') {
      this.play();
    } else if (this.currentPlaylist.repeat === 'all' || 
               this.currentPlaylist.current_track < this.currentPlaylist.tracks.length - 1) {
      this.nextTrack();
    } else {
      this.stop();
    }
  }

  private startProgressTracking(): void {
    this.stopProgressTracking();
    
    this.updateInterval = window.setInterval(() => {
      if (this.currentAudio && this.audioState.is_playing) {
        this.audioState.position = this.currentAudio.currentTime;
        
        // Emituj event z aktualną pozycją
        window.dispatchEvent(new CustomEvent('musicProgress', {
          detail: { position: this.audioState.position, duration: this.audioState.duration }
        }));
      }
    }, 1000);
  }

  private stopProgressTracking(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private async loadSamplePlaylists(): Promise<void> {
    // Przykładowe utwory (w rzeczywistej aplikacji ładowałbyś z API lub bazy danych)
    const sampleTracks: Track[] = [
      {
        id: 'track_1',
        title: 'Przykładowy Utwór 1',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 180,
        file_path: '/audio/sample1.mp3',
        genre: 'Electronic'
      },
      {
        id: 'track_2',
        title: 'Przykładowy Utwór 2', 
        artist: 'Test Artist 2',
        album: 'Test Album 2',
        duration: 200,
        file_path: '/audio/sample2.mp3',
        genre: 'Pop'
      }
    ];

    await this.createPlaylist('Przykładowa Playlista', sampleTracks);
    
    // Ustaw pierwszą playlistę jako aktywną
    if (this.playlists.size > 0) {
      const firstPlaylist = Array.from(this.playlists.values())[0];
      if (firstPlaylist) {
        await this.selectPlaylist(firstPlaylist.id);
      }
    }
  }

  async getMusicStatus(): Promise<string> {
    const status = `🎵 Status Music Control Agent:
- Odtwarzanie: ${this.audioState.is_playing ? 'aktywne' : 'zatrzymane'}
- Aktualny utwór: ${this.currentTrack ? `${this.currentTrack.title} - ${this.currentTrack.artist}` : 'brak'}
- Głośność: ${Math.round(this.audioState.volume * 100)}%
- Pozycja: ${Math.round(this.audioState.position)}s / ${Math.round(this.audioState.duration)}s
- Playlista: ${this.currentPlaylist ? `${this.currentPlaylist.name} (${this.currentPlaylist.tracks.length} utworów)` : 'brak'}
- Shuffle: ${this.currentPlaylist?.shuffle ? 'włączony' : 'wyłączony'}
- Repeat: ${this.currentPlaylist?.repeat || 'wyłączony'}
- Dostępne playlisty: ${this.playlists.size}`;

    return status;
  }

  // Gettery
  getAudioState(): AudioState {
    return { 
      ...this.audioState, 
      current_track: this.currentTrack || undefined, 
      playlist: this.currentPlaylist || undefined 
    };
  }

  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  getCurrentPlaylist(): Playlist | null {
    return this.currentPlaylist;
  }

  getAllPlaylists(): Playlist[] {
    return Array.from(this.playlists.values());
  }
}