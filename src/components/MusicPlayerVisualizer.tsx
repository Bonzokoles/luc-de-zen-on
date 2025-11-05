import { useState, useRef, useEffect } from 'react';

const MusicPlayerVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Przykładowa biblioteka muzyki (w produkcji użyj prawdziwych plików)
  const tracks = [
    {
      title: 'Muzyka do pracy 1',
      artist: 'Focus Beats',
      duration: '3:45',
      genre: 'Lo-fi',
      // W produkcji: src: '/music/track1.mp3'
      src: '' // Pusta - demo
    },
    {
      title: 'Ambient dla produktywności',
      artist: 'Chill Vibes',
      duration: '4:12',
      genre: 'Ambient',
      src: ''
    },
    {
      title: 'Koncentracja i flow',
      artist: 'Study Music',
      duration: '5:20',
      genre: 'Electronic',
      src: ''
    }
  ];

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Audio Context and Visualizer - commented out for demo
  // Uncomment when adding real audio files
  //
  // const setupAudioContext = () => {
  //   if (audioRef.current && !audioContextRef.current) {
  //     const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  //     const source = audioContext.createMediaElementSource(audioRef.current);
  //     const analyzer = audioContext.createAnalyser();
  //
  //     analyzer.fftSize = 256;
  //     source.connect(analyzer);
  //     analyzer.connect(audioContext.destination);
  //
  //     analyzerRef.current = analyzer;
  //     audioContextRef.current = audioContext;
  //   }
  // };
  //
  // const visualize = () => {
  //   if (!analyzerRef.current || !canvasRef.current) return;
  //
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');
  //   if (!ctx) return;
  //
  //   const analyzer = analyzerRef.current;
  //   const bufferLength = analyzer.frequencyBinCount;
  //   const dataArray = new Uint8Array(bufferLength);
  //
  //   const draw = () => {
  //     animationRef.current = requestAnimationFrame(draw);
  //
  //     analyzer.getByteFrequencyData(dataArray);
  //
  //     ctx.fillStyle = 'rgba(10, 14, 39, 0.3)';
  //     ctx.fillRect(0, 0, canvas.width, canvas.height);
  //
  //     const barWidth = (canvas.width / bufferLength) * 2.5;
  //     let barHeight;
  //     let x = 0;
  //
  //     for (let i = 0; i < bufferLength; i++) {
  //       barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
  //
  //       const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
  //       gradient.addColorStop(0, '#00d9ff');
  //       gradient.addColorStop(0.5, '#0ea5e9');
  //       gradient.addColorStop(1, '#4ade80');
  //
  //       ctx.fillStyle = gradient;
  //       ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
  //
  //       x += barWidth + 1;
  //     }
  //   };
  //
  //   draw();
  // };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      // Demo: brak prawdziwego pliku audio
      alert('🎵 To jest wersja demo. W pełnej wersji załaduj pliki MP3 do folderu /public/music/');
      // audioRef.current.play();
      // visualize();
    }

    setIsPlaying(!isPlaying);
  };

  const changeTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">
        🎵 Music Player & Wizualizer
      </h2>

      {/* Wizualizer Canvas */}
      <div className="mb-6 bg-business-dark rounded-lg overflow-hidden border border-business-border">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full h-48 md:h-64"
        />
      </div>

      {/* Obecny utwór */}
      <div className="bg-gradient-to-r from-primary-900/30 to-business-surface border border-primary-700 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-3xl">
            🎧
          </div>
          <div className="flex-grow">
            <h3 className="font-bold text-lg">{tracks[currentTrack].title}</h3>
            <p className="text-sm text-business-text-dim">{tracks[currentTrack].artist}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="badge badge-info text-xs">{tracks[currentTrack].genre}</span>
              <span className="text-xs text-business-text-dim">{tracks[currentTrack].duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kontrolki */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => changeTrack(Math.max(0, currentTrack - 1))}
          disabled={currentTrack === 0}
          className="w-12 h-12 rounded-full bg-business-surface border border-business-border hover:border-business-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path>
          </svg>
        </button>

        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-glow transition-all"
        >
          {isPlaying ? (
            <svg className="w-8 h-8 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"></path>
            </svg>
          ) : (
            <svg className="w-8 h-8 mx-auto text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"></path>
            </svg>
          )}
        </button>

        <button
          onClick={() => changeTrack(Math.min(tracks.length - 1, currentTrack + 1))}
          disabled={currentTrack === tracks.length - 1}
          className="w-12 h-12 rounded-full bg-business-surface border border-business-border hover:border-business-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path>
          </svg>
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-4">
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"></path>
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={changeVolume}
          className="flex-grow h-2 bg-business-dark rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #00d9ff 0%, #00d9ff ${volume}%, #1e2a52 ${volume}%, #1e2a52 100%)`
          }}
        />
        <span className="text-sm text-business-text-dim w-12 text-right">{volume}%</span>
      </div>

      {/* Playlista */}
      <div className="mt-6">
        <h3 className="font-bold mb-3">📚 Biblioteka</h3>
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <button
              key={index}
              onClick={() => changeTrack(index)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                currentTrack === index
                  ? 'bg-primary-600/20 border border-primary-600'
                  : 'bg-business-dark border border-business-border hover:border-business-accent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <div className="font-medium text-sm">{track.title}</div>
                  <div className="text-xs text-business-text-dim">{track.artist}</div>
                </div>
                <div className="text-xs text-business-text-dim">{track.duration}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={tracks[currentTrack].src}
        onEnded={() => {
          setIsPlaying(false);
          if (currentTrack < tracks.length - 1) {
            changeTrack(currentTrack + 1);
          }
        }}
      />

      <div className="mt-6 p-4 bg-business-dark border border-business-border rounded-lg">
        <p className="text-xs text-business-text-dim">
          💡 <strong>Dla developerów:</strong> Dodaj pliki MP3 do <code className="bg-business-surface px-2 py-1 rounded">/public/music/</code>
          i zaktualizuj ścieżki w <code className="bg-business-surface px-2 py-1 rounded">tracks.src</code>
        </p>
      </div>
    </div>
  );
};

export default MusicPlayerVisualizer;
