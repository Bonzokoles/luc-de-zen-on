// Music Agent Functions - MyBonzo Music Generation & Analysis System
// Version: 1.0.0

class MusicAgent {
  constructor() {
    this.audioContext = null;
    this.currentTrack = null;
    this.playlist = [];
    this.isPlaying = false;
    this.volume = 0.8;
    this.genres = ['ambient', 'electronic', 'classical', 'jazz', 'rock', 'pop'];
    
    this.initializeAudioContext();
  }

  // Initialize Web Audio API
  initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      return true;
    } catch (error) {
      console.error('Audio context not supported:', error);
      return false;
    }
  }

  // Generate music based on parameters
  async generateMusic(params = {}) {
    const {
      genre = 'ambient',
      duration = 30,
      tempo = 120,
      key = 'C',
      mood = 'relaxed'
    } = params;

    try {
      this.updateStatus('generating');
      
      // Simulate music generation (in real app, this would call an AI service)
      const musicData = await this.simulateMusicGeneration({
        genre, duration, tempo, key, mood
      });
      
      this.updateStatus('ready');
      return musicData;
    } catch (error) {
      console.error('Music generation failed:', error);
      this.updateStatus('error');
      return null;
    }
  }

  // Simulate music generation process
  async simulateMusicGeneration(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const musicData = {
          id: Date.now(),
          title: `Generated ${params.genre} Track`,
          genre: params.genre,
          duration: params.duration,
          tempo: params.tempo,
          key: params.key,
          mood: params.mood,
          url: this.generateToneSequence(params),
          created: new Date().toISOString()
        };
        resolve(musicData);
      }, 2000);
    });
  }

  // Generate simple tone sequence
  generateToneSequence(params) {
    if (!this.audioContext) return null;

    const { tempo, key, duration } = params;
    const frequencies = this.getScaleFrequencies(key);
    
    // Create a simple melody pattern
    const melody = this.createMelodyPattern(frequencies, tempo, duration);
    return melody;
  }

  // Get frequencies for musical scale
  getScaleFrequencies(key) {
    const baseFrequencies = {
      'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23,
      'G': 392.00, 'A': 440.00, 'B': 493.88
    };
    
    const baseFreq = baseFrequencies[key] || 261.63;
    return [
      baseFreq, baseFreq * 9/8, baseFreq * 5/4, baseFreq * 4/3,
      baseFreq * 3/2, baseFreq * 5/3, baseFreq * 15/8, baseFreq * 2
    ];
  }

  // Create melody pattern
  createMelodyPattern(frequencies, tempo, duration) {
    const noteLength = 60 / tempo; // seconds per beat
    const totalNotes = Math.floor(duration / noteLength);
    
    const pattern = [];
    for (let i = 0; i < totalNotes; i++) {
      const freqIndex = Math.floor(Math.random() * frequencies.length);
      pattern.push({
        frequency: frequencies[freqIndex],
        startTime: i * noteLength,
        duration: noteLength * 0.8
      });
    }
    
    return pattern;
  }

  // Play generated music
  playMusic(musicData) {
    if (!this.audioContext || !musicData.url) return false;

    try {
      this.stopMusic(); // Stop any current playback
      
      if (Array.isArray(musicData.url)) {
        this.playToneSequence(musicData.url);
      }
      
      this.currentTrack = musicData;
      this.isPlaying = true;
      this.updatePlaybackUI();
      
      return true;
    } catch (error) {
      console.error('Playback failed:', error);
      return false;
    }
  }

  // Play tone sequence
  playToneSequence(sequence) {
    const gainNode = this.audioContext.createGain();
    gainNode.connect(this.audioContext.destination);
    gainNode.gain.value = this.volume;

    sequence.forEach(note => {
      const oscillator = this.audioContext.createOscillator();
      oscillator.connect(gainNode);
      oscillator.frequency.value = note.frequency;
      oscillator.type = 'sine';
      
      const startTime = this.audioContext.currentTime + note.startTime;
      const endTime = startTime + note.duration;
      
      oscillator.start(startTime);
      oscillator.stop(endTime);
    });
  }

  // Stop music playback
  stopMusic() {
    if (this.audioContext) {
      // Close and recreate audio context to stop all sounds
      this.audioContext.close();
      this.initializeAudioContext();
    }
    
    this.isPlaying = false;
    this.currentTrack = null;
    this.updatePlaybackUI();
  }

  // Analyze uploaded music file
  async analyzeMusicFile(file) {
    if (!file || !file.type.startsWith('audio/')) {
      throw new Error('Invalid audio file');
    }

    try {
      this.updateStatus('analyzing');
      
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      const analysis = this.performAudioAnalysis(audioBuffer);
      
      this.updateStatus('ready');
      return analysis;
    } catch (error) {
      console.error('Music analysis failed:', error);
      this.updateStatus('error');
      throw error;
    }
  }

  // Perform basic audio analysis
  performAudioAnalysis(audioBuffer) {
    const duration = audioBuffer.duration;
    const sampleRate = audioBuffer.sampleRate;
    const numberOfChannels = audioBuffer.numberOfChannels;
    
    // Get audio data for analysis
    const channelData = audioBuffer.getChannelData(0);
    
    // Calculate basic metrics
    const rms = this.calculateRMS(channelData);
    const peakAmplitude = this.findPeakAmplitude(channelData);
    const zeroCrossings = this.countZeroCrossings(channelData);
    
    // Estimate tempo (simplified)
    const estimatedTempo = this.estimateTempo(channelData, sampleRate);
    
    return {
      duration: Math.round(duration * 100) / 100,
      sampleRate,
      numberOfChannels,
      rms: Math.round(rms * 1000) / 1000,
      peakAmplitude: Math.round(peakAmplitude * 1000) / 1000,
      zeroCrossings,
      estimatedTempo,
      analyzed: new Date().toISOString()
    };
  }

  // Audio analysis helper functions
  calculateRMS(data) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i] * data[i];
    }
    return Math.sqrt(sum / data.length);
  }

  findPeakAmplitude(data) {
    let peak = 0;
    for (let i = 0; i < data.length; i++) {
      const abs = Math.abs(data[i]);
      if (abs > peak) peak = abs;
    }
    return peak;
  }

  countZeroCrossings(data) {
    let crossings = 0;
    for (let i = 1; i < data.length; i++) {
      if ((data[i-1] >= 0 && data[i] < 0) || (data[i-1] < 0 && data[i] >= 0)) {
        crossings++;
      }
    }
    return crossings;
  }

  estimateTempo(data, sampleRate) {
    // Simplified tempo estimation
    const windowSize = Math.floor(sampleRate * 0.1); // 100ms windows
    const energyWindows = [];
    
    for (let i = 0; i < data.length - windowSize; i += windowSize) {
      let energy = 0;
      for (let j = i; j < i + windowSize; j++) {
        energy += data[j] * data[j];
      }
      energyWindows.push(energy);
    }
    
    // Find peaks in energy to estimate beats
    const peaks = this.findPeaks(energyWindows);
    const avgInterval = peaks.length > 1 ? 
      (peaks[peaks.length - 1] - peaks[0]) / (peaks.length - 1) : 0;
    
    // Convert to BPM
    const bpm = avgInterval > 0 ? 60 / (avgInterval * 0.1) : 120;
    return Math.round(Math.max(60, Math.min(200, bpm)));
  }

  findPeaks(data) {
    const peaks = [];
    const threshold = Math.max(...data) * 0.6;
    
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i-1] && data[i] > data[i+1] && data[i] > threshold) {
        peaks.push(i);
      }
    }
    
    return peaks;
  }

  // UI update functions
  updateStatus(status) {
    const statusElement = document.getElementById('musicStatus');
    if (statusElement) {
      switch (status) {
        case 'generating':
          statusElement.textContent = 'GENERUJE';
          statusElement.className = 'text-[#ffd700]';
          break;
        case 'analyzing':
          statusElement.textContent = 'ANALIZUJE';
          statusElement.className = 'text-[#1be1ff]';
          break;
        case 'error':
          statusElement.textContent = 'BŁĄD';
          statusElement.className = 'text-[#ff4444]';
          break;
        default:
          statusElement.textContent = 'GOTOWY';
          statusElement.className = 'text-[#00ff88]';
      }
    }
  }

  updatePlaybackUI() {
    const playButton = document.getElementById('playButton');
    const stopButton = document.getElementById('stopButton');
    const trackInfo = document.getElementById('currentTrack');
    
    if (playButton) {
      playButton.disabled = this.isPlaying;
    }
    
    if (stopButton) {
      stopButton.disabled = !this.isPlaying;
    }
    
    if (trackInfo) {
      trackInfo.textContent = this.currentTrack ? 
        this.currentTrack.title : 'Brak utworu';
    }
  }

  // Get current status
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
      volume: this.volume,
      audioContextState: this.audioContext?.state,
      supportedGenres: this.genres
    };
  }

  // Set volume
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MusicAgent;
} else if (typeof window !== 'undefined') {
  window.MusicAgent = MusicAgent;
}