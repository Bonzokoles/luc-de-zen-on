import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const MusicPlayerVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(70);
  const [visualMode, setVisualMode] = useState<'bars' | 'wave' | 'circular'>('bars');
  const [isSpeechMode, setIsSpeechMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speechCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Biblioteka muzyki - prawdziwe pliki MP3
  const tracks = [
    {
      title: 'Personal Jesus',
      artist: 'Depeche Mode',
      duration: '4:56',
      genre: 'Electronic',
      src: '/music/01. Personal Jesus.mp3'
    },
    {
      title: 'Neony',
      artist: 'Miuosh',
      duration: '4:58',
      genre: 'Hip-Hop',
      src: '/music/02 - Miuosh - Neony.mp3'
    },
    {
      title: 'Nieznajomy',
      artist: 'Daria Zawiałow',
      duration: '5:47',
      genre: 'Pop',
      src: '/music/03. Nieznajomy.mp3'
    },
    {
      title: 'Blizny',
      artist: 'Swiernalis',
      duration: '2:09',
      genre: 'Hip-Hop',
      src: '/music/044._Swiernalis_-_Blizny.mp3'
    },
    {
      title: 'Tora! Tora! Tora!',
      artist: 'Depeche Mode',
      duration: '3:16',
      genre: 'Electronic',
      src: '/music/08 - Depeche Mode - Tora! Tora! Tora!.mp3'
    },
    {
      title: 'The Man Who Sold The World',
      artist: 'David Bowie',
      duration: '2:46',
      genre: 'Rock',
      src: '/music/08 - The Man Who Sold The World.mp3'
    },
    {
      title: 'Life On Mars',
      artist: 'David Bowie',
      duration: '2:41',
      genre: 'Rock',
      src: '/music/bowie Life On Mars.mp3'
    },
    {
      title: 'Antistar',
      artist: 'Massive Attack',
      duration: '3:55',
      genre: 'Trip-Hop',
      src: '/music/Massive Attack - Antistar.mp3'
    },
    {
      title: 'Silacz',
      artist: 'Marcin Rozynek',
      duration: '2:47',
      genre: 'Rock',
      src: '/music/Marcin Rozynek - Silacz.mp3'
    },
    {
      title: 'Jeszcze w zielone gramy',
      artist: 'Daria Zawiałow',
      duration: '3:42',
      genre: 'Pop',
      src: '/music/Daria Zawiałow - Jeszcze w zielone gramy (Bonus Track).mp3'
    },
    {
      title: 'Kilka westchnień',
      artist: 'Daria Zawiałow',
      duration: '4:29',
      genre: 'Pop',
      src: '/music/Kilka westchnień.mp3'
    },
    {
      title: 'Nikt tak pieknie',
      artist: 'Gutek',
      duration: '1:41',
      genre: 'Pop',
      src: '/music/gutek - nikt tak pieknie.mp3'
    }
  ];

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Setup Audio Context
  const setupAudioContext = () => {
    if (audioRef.current && !audioContextRef.current) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioRef.current);
      const analyzer = audioContext.createAnalyser();

      analyzer.fftSize = 256;
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);

      analyzerRef.current = analyzer;
      audioContextRef.current = audioContext;
    }
  };

  // Visualizer - Bars Mode
  const visualizeBars = (analyzer: AnalyserNode, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzer.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

      const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
      gradient.addColorStop(0, '#0ea5e9');
      gradient.addColorStop(0.5, '#64748b');
      gradient.addColorStop(1, '#334155');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  };

  // Visualizer - Wave Mode
  const visualizeWave = (analyzer: AnalyserNode, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzer.getByteTimeDomainData(dataArray);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0ea5e9';
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  // Visualizer - Circular Mode
  const visualizeCircular = (analyzer: AnalyserNode, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzer.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.5;

    for (let i = 0; i < bufferLength; i++) {
      const angle = (i / bufferLength) * Math.PI * 2;
      const barHeight = (dataArray[i] / 255) * radius;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, '#334155');
      gradient.addColorStop(1, '#0ea5e9');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  // Main Visualize Function
  const visualize = () => {
    if (!analyzerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      const analyzer = analyzerRef.current!;

      switch (visualMode) {
        case 'bars':
          visualizeBars(analyzer, canvas, ctx);
          break;
        case 'wave':
          visualizeWave(analyzer, canvas, ctx);
          break;
        case 'circular':
          visualizeCircular(analyzer, canvas, ctx);
          break;
      }
    };

    draw();
  };

  // Speech Visualizer
  const visualizeSpeech = (analyzer: AnalyserNode, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Speech waveform
      const centerY = canvas.height / 2;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 255;
        const y = centerY + (v - 0.5) * canvas.height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.stroke();
    };

    draw();
  };

  // Start Speech Recognition
  const startSpeechVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);

      if (speechCanvasRef.current) {
        const ctx = speechCanvasRef.current.getContext('2d');
        if (ctx) {
          visualizeSpeech(analyzer, speechCanvasRef.current, ctx);
        }
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Nie można uzyskać dostępu do mikrofonu');
      setIsSpeechMode(false);
    }
  };

  const stopSpeechVisualizer = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

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
      setupAudioContext();
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        alert('Nie można odtworzyć pliku audio. Sprawdź czy plik istnieje.');
      });
      visualize();
    }

    setIsPlaying(!isPlaying);
  };

  const toggleSpeechMode = async () => {
    if (!isSpeechMode) {
      await startSpeechVisualizer();
      setIsSpeechMode(true);
    } else {
      stopSpeechVisualizer();
      setIsSpeechMode(false);
    }
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <h2 className="text-2xl font-bold mb-6">
        🎵 Music Player & Wizualizator
      </h2>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={toggleSpeechMode}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isSpeechMode
              ? 'bg-green-600 text-white shadow-glow'
              : 'bg-business-dark text-business-text-dim border border-business-border hover:border-business-accent'
          }`}
        >
          {isSpeechMode ? '🎤 Mowa włączona' : '🎤 Wizualizator mowy'}
        </button>
        {!isSpeechMode && (
          <>
            <button
              onClick={() => setVisualMode('bars')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                visualMode === 'bars'
                  ? 'bg-primary-600 text-white'
                  : 'bg-business-dark text-business-text-dim border border-business-border hover:border-business-accent'
              }`}
            >
              📊 Słupki
            </button>
            <button
              onClick={() => setVisualMode('wave')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                visualMode === 'wave'
                  ? 'bg-primary-600 text-white'
                  : 'bg-business-dark text-business-text-dim border border-business-border hover:border-business-accent'
              }`}
            >
              〰️ Fala
            </button>
            <button
              onClick={() => setVisualMode('circular')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                visualMode === 'circular'
                  ? 'bg-primary-600 text-white'
                  : 'bg-business-dark text-business-text-dim border border-business-border hover:border-business-accent'
              }`}
            >
              ⭕ Okrągły
            </button>
          </>
        )}
      </div>

      {/* Music Visualizer Canvas */}
      {!isSpeechMode && (
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="mb-6 bg-business-dark rounded-lg overflow-hidden border border-business-border"
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={200}
            className="w-full h-48 md:h-64"
          />
        </motion.div>
      )}

      {/* Speech Visualizer Canvas */}
      {isSpeechMode && (
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="mb-6 bg-business-dark rounded-lg overflow-hidden border-2 border-green-600/50"
        >
          <canvas
            ref={speechCanvasRef}
            width={800}
            height={200}
            className="w-full h-48 md:h-64"
          />
          <div className="px-4 py-2 bg-green-900/30 text-center text-sm text-green-300">
            🎤 Mów do mikrofonu, aby zobaczyć wizualizację
          </div>
        </motion.div>
      )}

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
    </motion.div>
  );
};

export default MusicPlayerVisualizer;
