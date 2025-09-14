import React, { useState, useEffect } from 'react';

export default function StableDiffusionGenerator() {
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [selectedArtist, setSelectedArtist] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('');
    const [selectedRatio, setSelectedRatio] = useState('1:1');
    const [quality, setQuality] = useState('standard');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState([]);

    // Cyberpunk styling injection
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
      .cyberpunk-container {
        background: #0a0a0a;
        color: #e0e0e0;
        font-family: 'Rajdhani', sans-serif;
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;
      }
      .cyberpunk-container::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.03) 2px,
            rgba(0, 255, 255, 0.03) 4px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 2px,
            rgba(0, 217, 255, 0.02) 2px,
            rgba(0, 217, 255, 0.02) 4px
          );
        z-index: -1;
      }
      .cyber-grid {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        opacity: 0.1;
      }
      .cyber-grid::after {
        content: '';
        position: absolute;
        top: 33%;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, #00ffff, transparent);
      }
      .cyber-grid::before {
        content: '';
        position: absolute;
        top: 66%;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, #00d9ff, transparent);
      }
      .cyber-title {
        color: #00ffff;
        text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
        font-weight: 700;
        letter-spacing: 2px;
      }
      .cyber-input {
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid #00ffff;
        color: #e0e0e0;
        font-family: 'Rajdhani', sans-serif;
        transition: all 0.3s ease;
      }
      .cyber-input:focus {
        background: rgba(0, 255, 255, 0.1);
        border-color: #00d9ff;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        outline: none;
      }
      .cyber-button {
        background: linear-gradient(45deg, #00ffff, #00d9ff);
        color: #0a0a0a;
        border: none;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-family: 'Rajdhani', sans-serif;
        transition: all 0.3s ease;
      }
      .cyber-button:hover {
        background: linear-gradient(45deg, #00d9ff, #00ffff);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        transform: translateY(-2px);
      }
      .cyber-button:disabled {
        background: rgba(0, 255, 255, 0.3);
        color: rgba(224, 224, 224, 0.5);
        cursor: not-allowed;
      }
      .cyber-select {
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid #00ffff;
        color: #e0e0e0;
        font-family: 'Rajdhani', sans-serif;
      }
      .cyber-select:focus {
        border-color: #00d9ff;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        outline: none;
      }
      .cyber-card {
        background: rgba(0, 255, 255, 0.02);
        border: 1px solid rgba(0, 255, 255, 0.2);
        backdrop-filter: blur(10px);
      }
      .cyber-text {
        color: #e0e0e0;
        font-family: 'Rajdhani', sans-serif;
      }
      .cyber-accent {
        color: #00ffff;
      }
    `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // Artists from Wild Cards
    const artists = [
        'Aaron Horkey', 'Akira Kurosawa', 'Alex Grey', 'Alice Neel', 'Andy Warhol',
        'Banksy', 'Basquiat', 'Boris Vallejo', 'Charlie Bowater', 'Chris Foss',
        'Craig Mullins', 'Dan Mumford', 'David Lynch', 'Escher', 'Frank Frazetta',
        'Greg Rutkowski', 'H.R. Giger', 'Hayao Miyazaki', 'Jean Giraud Moebius', 'Katsuhiro Otomo',
        'Leonardo da Vinci', 'MC Escher', 'Michelangelo', 'Pablo Picasso', 'Ralph McQuarrie',
        'Salvador Dali', 'Simon Stalenhag', 'Studio Ghibli', 'Van Gogh', 'Zdzisław Beksiński'
    ];

    const styles = [
        'cyberpunk', 'steampunk', 'fantasy art', 'concept art', 'digital painting',
        'oil painting', 'watercolor', 'pencil sketch', 'anime style', 'photorealistic',
        'abstract', 'surreal', 'gothic', 'art nouveau', 'minimalist'
    ];

    const ratios = [
        { label: 'Kwadrat (1:1)', value: '1:1' },
        { label: 'Portret (3:4)', value: '3:4' },
        { label: 'Krajobraz (4:3)', value: '4:3' },
        { label: 'Szeroki (16:9)', value: '16:9' },
        { label: 'Ultra szeroki (21:9)', value: '21:9' }
    ];

    const handleGenerate = async () => {
        setIsGenerating(true);

        // Symulacja generowania obrazu
        setTimeout(() => {
            const newImage = {
                id: Date.now(),
                url: `https://picsum.photos/512/512?random=${Date.now()}`,
                prompt: prompt + (selectedArtist ? ` by ${selectedArtist}` : '') + (selectedStyle ? ` in ${selectedStyle} style` : ''),
                timestamp: new Date().toLocaleString()
            };
            setGeneratedImages(prev => [newImage, ...prev]);
            setIsGenerating(false);
        }, 3000);
    };

    return (
        <div className="cyberpunk-container p-6">
            <div className="cyber-grid"></div>

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center py-8">
                    <h1 className="cyber-title text-4xl md:text-6xl font-bold mb-4">
                        STABLE DIFFUSION
                    </h1>
                    <p className="cyber-text text-xl opacity-80">
                        Advanced AI Image Generator with <span className="cyber-accent">Cyberpunk</span> Interface
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Controls Panel */}
                    <div className="cyber-card rounded-lg p-6 space-y-6">
                        <h2 className="cyber-accent text-2xl font-bold mb-4">Generation Controls</h2>

                        {/* Main Prompt */}
                        <div>
                            <label className="cyber-text block text-sm font-medium mb-2">
                                Main Prompt
                            </label>
                            <textarea
                                className="cyber-input w-full px-4 py-3 rounded-lg resize-none"
                                rows="4"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your image..."
                            />
                        </div>

                        {/* Negative Prompt */}
                        <div>
                            <label className="cyber-text block text-sm font-medium mb-2">
                                Negative Prompt
                            </label>
                            <textarea
                                className="cyber-input w-full px-4 py-3 rounded-lg resize-none"
                                rows="2"
                                value={negativePrompt}
                                onChange={(e) => setNegativePrompt(e.target.value)}
                                placeholder="What to avoid..."
                            />
                        </div>

                        {/* Artist Selection */}
                        <div>
                            <label className="cyber-text block text-sm font-medium mb-2">
                                Artist Style
                            </label>
                            <select
                                className="cyber-select w-full px-4 py-3 rounded-lg"
                                value={selectedArtist}
                                onChange={(e) => setSelectedArtist(e.target.value)}
                            >
                                <option value="">Select Artist</option>
                                {artists.map(artist => (
                                    <option key={artist} value={artist}>{artist}</option>
                                ))}
                            </select>
                        </div>

                        {/* Style Selection */}
                        <div>
                            <label className="cyber-text block text-sm font-medium mb-2">
                                Art Style
                            </label>
                            <select
                                className="cyber-select w-full px-4 py-3 rounded-lg"
                                value={selectedStyle}
                                onChange={(e) => setSelectedStyle(e.target.value)}
                            >
                                <option value="">Select Style</option>
                                {styles.map(style => (
                                    <option key={style} value={style}>{style}</option>
                                ))}
                            </select>
                        </div>

                        {/* Settings */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="cyber-text block text-sm font-medium mb-2">
                                    Aspect Ratio
                                </label>
                                <select
                                    className="cyber-select w-full px-4 py-3 rounded-lg"
                                    value={selectedRatio}
                                    onChange={(e) => setSelectedRatio(e.target.value)}
                                >
                                    {ratios.map(ratio => (
                                        <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="cyber-text block text-sm font-medium mb-2">
                                    Quality
                                </label>
                                <select
                                    className="cyber-select w-full px-4 py-3 rounded-lg"
                                    value={quality}
                                    onChange={(e) => setQuality(e.target.value)}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="standard">Standard</option>
                                    <option value="high">High Quality</option>
                                </select>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            className="cyber-button w-full py-4 px-6 rounded-lg text-lg font-bold"
                            onClick={handleGenerate}
                            disabled={!prompt || isGenerating}
                        >
                            {isGenerating ? 'GENERATING...' : 'GENERATE IMAGE'}
                        </button>
                    </div>

                    {/* Generated Images */}
                    <div className="space-y-6">
                        <h2 className="cyber-accent text-2xl font-bold">Generated Images</h2>

                        {generatedImages.length === 0 ? (
                            <div className="cyber-card rounded-lg p-8 text-center">
                                <div className="cyber-text opacity-60">
                                    <div className="text-6xl mb-4">🎨</div>
                                    <p className="text-lg">No images generated yet</p>
                                    <p className="text-sm">Create your first AI masterpiece!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {generatedImages.map(image => (
                                    <div key={image.id} className="cyber-card rounded-lg p-4">
                                        <img
                                            src={image.url}
                                            alt="Generated"
                                            className="w-full rounded-lg mb-3"
                                        />
                                        <div className="cyber-text text-sm space-y-1">
                                            <p><span className="cyber-accent">Prompt:</span> {image.prompt}</p>
                                            <p><span className="cyber-accent">Generated:</span> {image.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center py-8 border-t border-cyan-400/20">
                    <p className="cyber-text opacity-60">
                        Powered by <span className="cyber-accent">Stable Diffusion</span> •
                        Cyberpunk Interface • Wild Cards Integration
                    </p>
                </div>
            </div>
        </div>
    );
}