<<<<<<< HEAD
﻿import React, { useState, useRef, useEffect } from 'react';
=======
import React, { useState, useRef, useEffect } from 'react';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

export default function StableDiffusionGenerator() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    width: 512,
    height: 512,
    steps: 20,
    guidance: 7.5,
    seed: -1
  });
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  // Load wildcards data
  const [wildcards, setWildcards] = useState({
    artists: [],
    styles: [],
    subjects: []
  });

  useEffect(() => {
    // Load wildcards data from public files
    Promise.all([
      fetch('/artists-data.js').then(r => r.text()),
      fetch('/styles-data-converted.js').then(r => r.text())
    ]).then(([artistsData, stylesData]) => {
      // Parse the data (simplified)
      try {
        const artists = artistsData.match(/name:\s*"([^"]+)"/g)?.map(m => m.match(/"([^"]+)"/)[1]) || [];
        const styles = stylesData.match(/name:\s*"([^"]+)"/g)?.map(m => m.match(/"([^"]+)"/)[1]) || [];
        setWildcards({
          artists: artists.slice(0, 50), // Limit for performance
          styles: styles.slice(0, 50),
          subjects: ['portrait', 'landscape', 'abstract', 'sci-fi', 'fantasy', 'cyberpunk', 'digital art']
        });
      } catch (e) {
        console.error('Error loading wildcards:', e);
      }
    });
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
<<<<<<< HEAD
      alert('Wprowad┼║ prompt przed generowaniem!');
=======
      alert('Wprowadź prompt przed generowaniem!');
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
      return;
    }

    setIsLoading(true);
    
    try {
      // Placeholder for actual AI generation
      // Here you would call your Stable Diffusion API
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, create a placeholder image
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Create gradient placeholder
      const gradient = ctx.createLinearGradient(0, 0, settings.width, settings.height);
      gradient.addColorStop(0, '#001122');
      gradient.addColorStop(0.5, '#003344');
      gradient.addColorStop(1, '#001122');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, settings.width, settings.height);
      
      // Add some sci-fi elements
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * settings.width,
          Math.random() * settings.height,
          Math.random() * 50 + 10,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
      
      // Add text
      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold 24px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText('AI GENERATED', settings.width / 2, settings.height / 2);
      ctx.font = 'bold 16px Orbitron';
      ctx.fillText(prompt.slice(0, 30) + '...', settings.width / 2, settings.height / 2 + 30);
      
      const imageUrl = canvas.toDataURL();
      setImage(imageUrl);
      
      // Add to history
      setHistory(prev => [{
        prompt,
        negativePrompt,
        image: imageUrl,
        settings: { ...settings },
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]); // Keep last 10
      
    } catch (error) {
      console.error('Error generating image:', error);
<<<<<<< HEAD
      alert('B┼é─ůd podczas generowania obrazu');
=======
      alert('Błąd podczas generowania obrazu');
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
    } finally {
      setIsLoading(false);
    }
  };

  const addWildcard = (type, value) => {
    setPrompt(prev => prev + (prev ? ', ' : '') + value);
  };

  const randomizeSettings = () => {
    setSettings({
      width: [512, 768, 1024][Math.floor(Math.random() * 3)],
      height: [512, 768, 1024][Math.floor(Math.random() * 3)],
      steps: Math.floor(Math.random() * 30) + 10,
      guidance: Math.random() * 10 + 5,
      seed: Math.floor(Math.random() * 1000000)
    });
  };

  return (
    <div className="square-grid">
      {/* Left Panel - Input Controls */}
      <div className="square-half">
        <div className="panel main-frame">
          <h2 className="neon-cyan sci-fi-type text-xl font-bold mb-4">
            GENERATOR PROMPTS
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 sci-fi-type neon-white">
              POSITIVE PROMPT
            </label>
            <textarea
              className="input-glossy w-full h-24 resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
<<<<<<< HEAD
              placeholder="Opisz obraz kt├│ry chcesz wygenerowa─ç..."
=======
              placeholder="Opisz obraz który chcesz wygenerować..."
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 sci-fi-type neon-white">
              NEGATIVE PROMPT
            </label>
            <textarea
              className="input-glossy w-full h-20 resize-none"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Czego nie chcesz w obrazie..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              className="scifi-btn text-sm py-2"
              onClick={() => setPrompt('')}
            >
<<<<<<< HEAD
              WYCZYSC
=======
              WYCZYŚĆ
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
            </button>
            <button
              className="scifi-btn text-sm py-2"
              onClick={randomizeSettings}
            >
              LOSUJ USTAWIENIA
            </button>
          </div>

          <button
            className="scifi-btn w-full py-3 text-lg font-bold"
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? 'GENEROWANIE...' : 'GENERUJ OBRAZ'}
          </button>
        </div>

        {/* Wildcards Panel */}
        <div className="panel main-frame">
          <h3 className="neon-magenta sci-fi-type text-lg font-bold mb-3">
            WILDCARDS
          </h3>
          
          <div className="space-y-3">
            <div>
<<<<<<< HEAD
              <h4 className="text-sm font-bold mb-2 neon-white">ARTY┼ÜCI:</h4>
=======
              <h4 className="text-sm font-bold mb-2 neon-white">ARTYŚCI:</h4>
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
              <div className="flex flex-wrap gap-1">
                {wildcards.artists.slice(0, 6).map((artist, i) => (
                  <button
                    key={i}
                    className="text-xs px-2 py-1 bg-black/50 border border-cyan-400 rounded hover:bg-cyan-400/20 transition-colors"
                    onClick={() => addWildcard('artist', artist)}
                  >
                    {artist}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold mb-2 neon-white">STYLE:</h4>
              <div className="flex flex-wrap gap-1">
                {wildcards.subjects.map((subject, i) => (
                  <button
                    key={i}
                    className="text-xs px-2 py-1 bg-black/50 border border-magenta-400 rounded hover:bg-magenta-400/20 transition-colors"
                    onClick={() => addWildcard('subject', subject)}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Output & Settings */}
      <div className="square-half">
        <div className="panel main-frame">
          <h2 className="neon-cyan sci-fi-type text-xl font-bold mb-4">
            WYGENEROWANY OBRAZ
          </h2>
          
          <div className="relative bg-black/30 border border-white/20 rounded-lg aspect-square flex items-center justify-center">
            {isLoading ? (
              <div className="loading-pulse neon-cyan sci-fi-type text-center">
<<<<<<< HEAD
                <div className="text-4xl mb-2">❌</div>
=======
                <div className="text-4xl mb-2">●</div>
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
                <div>PROCESSING...</div>
              </div>
            ) : image ? (
              <img
                src={image}
                alt="Wygenerowany obraz"
                className="max-w-full max-h-full rounded-lg"
              />
            ) : (
              <div className="text-center neon-white opacity-60">
<<<<<<< HEAD
                <div className="text-6xl mb-4">✅</div>
=======
                <div className="text-6xl mb-4">◯</div>
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
                <div className="sci-fi-type">BRAK OBRAZU</div>
              </div>
            )}
          </div>

          {image && (
            <div className="mt-4 flex gap-2">
              <a
                href={image}
                download="ai-generated-image.png"
                className="scifi-btn flex-1 text-center py-2"
              >
                POBIERZ
              </a>
              <button
                className="scifi-btn flex-1 py-2"
                onClick={() => setImage(null)}
              >
<<<<<<< HEAD
                USU┼â
=======
                USUŃ
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
              </button>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        <div className="panel main-frame">
          <h3 className="neon-magenta sci-fi-type text-lg font-bold mb-3">
            USTAWIENIA
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold mb-1 neon-white">SZEROKOSC</label>
=======
              <label className="block text-xs font-bold mb-1 neon-white">SZEROKOŚĆ</label>
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
              <select
                className="input-glossy w-full text-sm"
                value={settings.width}
                onChange={(e) => setSettings({...settings, width: Number(e.target.value)})}
              >
                <option value={512}>512px</option>
                <option value={768}>768px</option>
                <option value={1024}>1024px</option>
              </select>
            </div>
            
            <div>
<<<<<<< HEAD
              <label className="block text-xs font-bold mb-1 neon-white">WYSOKOSC</label>
=======
              <label className="block text-xs font-bold mb-1 neon-white">WYSOKOŚĆ</label>
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
              <select
                className="input-glossy w-full text-sm"
                value={settings.height}
                onChange={(e) => setSettings({...settings, height: Number(e.target.value)})}
              >
                <option value={512}>512px</option>
                <option value={768}>768px</option>
                <option value={1024}>1024px</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold mb-1 neon-white">KROKI</label>
              <input
                type="number"
                className="input-glossy w-full text-sm"
                min="10"
                max="50"
                value={settings.steps}
                onChange={(e) => setSettings({...settings, steps: Number(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold mb-1 neon-white">GUIDANCE</label>
              <input
                type="number"
                className="input-glossy w-full text-sm"
                min="1"
                max="20"
                step="0.5"
                value={settings.guidance}
                onChange={(e) => setSettings({...settings, guidance: Number(e.target.value)})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image generation */}
      <canvas
        ref={canvasRef}
        width={settings.width}
        height={settings.height}
        style={{ display: 'none' }}
      />
    </div>
  );
}
<<<<<<< HEAD

=======
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
