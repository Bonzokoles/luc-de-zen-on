import React, { useState } from "react";

interface PromptEnhancerProps {
  onEnhance?: (enhancedPrompt: string, options: any) => void;
  initialPrompt?: string;
}

interface EnhancementOptions {
  artistStyle: string;
  mediaType: string;
  colorPalette: string;
  mood: string;
  quality: "standard" | "high" | "ultra";
  enhanceCreativity: boolean;
}

interface EnhancementResult {
  enhanced: string;
  negativePrompt: string;
  suggestions: string[];
  artistRecommendations: string[];
  stats: {
    originalLength: number;
    enhancedLength: number;
    improvement: string;
  };
}

const PromptEnhancer: React.FC<PromptEnhancerProps> = ({
  onEnhance,
  initialPrompt = "",
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [options, setOptions] = useState<EnhancementOptions>({
    artistStyle: "",
    mediaType: "",
    colorPalette: "",
    mood: "",
    quality: "high",
    enhanceCreativity: false,
  });
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colorPalettes = [
    "cyberpunk",
    "vintage",
    "monochrome",
    "pastel",
    "vibrant",
    "earth",
    "ocean",
    "sunset",
    "forest",
    "cosmic",
  ];
  const moods = [
    "dramatic",
    "peaceful",
    "mysterious",
    "energetic",
    "romantic",
    "futuristic",
    "vintage",
    "dark",
    "bright",
    "surreal",
  ];
  const mediaTypes = [
    "Oil Painting",
    "Watercolor",
    "Digital Art",
    "Photography",
    "Pencil Drawing",
    "Concept Art",
    "Street Art",
    "Sculpture",
  ];

  const popularArtists = [
    "Vincent van Gogh",
    "Pablo Picasso",
    "Leonardo da Vinci",
    "Claude Monet",
    "Salvador Dali",
    "Andy Warhol",
    "Frida Kahlo",
    "Banksy",
    "Hayao Miyazaki",
    "H.R. Giger",
  ];

  const enhancePrompt = async (recommend = false) => {
    if (!prompt.trim()) {
      setError("Please enter a prompt first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          options,
          recommend,
        }),
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        throw new Error(data.error || "Enhancement failed");
      }

      setResult(data);
      if (onEnhance) {
        onEnhance(data.enhanced, options);
      }
    } catch (err) {
      setError((err as any).message || "Failed to enhance prompt");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const applyRecommendation = (artist: string) => {
    setOptions((prev) => ({ ...prev, artistStyle: artist }));
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "20px",
      background:
        "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      border: "2px solid #00d4aa",
      borderRadius: "15px",
      color: "#ffffff",
      fontFamily: "Inter, system-ui, sans-serif",
      boxShadow: "0 10px 40px rgba(0, 212, 170, 0.2)",
      minHeight: "600px",
    },
    title: {
      color: "#00d4aa",
      fontSize: "1.8rem",
      fontWeight: "700",
      margin: "0 0 30px 0",
      textAlign: "center" as const,
      textShadow: "0 0 10px rgba(0, 212, 170, 0.5)",
    },
    inputSection: {
      marginBottom: "25px",
    },
    label: {
      color: "#00d4aa",
      fontSize: "1rem",
      fontWeight: "600",
      marginBottom: "8px",
      display: "block",
    },
    promptInput: {
      width: "100%",
      minHeight: "120px",
      background: "rgba(0, 0, 0, 0.4)",
      border: "2px solid #444",
      borderRadius: "10px",
      color: "#ffffff",
      padding: "15px",
      fontSize: "14px",
      lineHeight: "1.5",
      resize: "vertical" as const,
      transition: "border-color 0.3s",
      outline: "none",
    },
    optionsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "25px",
    },
    optionGroup: {
      background: "rgba(0, 0, 0, 0.3)",
      border: "1px solid #333",
      borderRadius: "10px",
      padding: "20px",
    },
    select: {
      width: "100%",
      background: "rgba(0, 0, 0, 0.6)",
      border: "1px solid #555",
      borderRadius: "8px",
      color: "#ffffff",
      padding: "10px",
      fontSize: "14px",
      outline: "none",
    },
    input: {
      width: "100%",
      background: "rgba(0, 0, 0, 0.6)",
      border: "1px solid #555",
      borderRadius: "8px",
      color: "#ffffff",
      padding: "10px",
      fontSize: "14px",
      outline: "none",
    },
    checkboxWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginTop: "15px",
    },
    artistTags: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "6px",
      marginTop: "10px",
    },
    artistTag: {
      background: "rgba(0, 212, 170, 0.1)",
      border: "1px solid #00d4aa",
      borderRadius: "15px",
      color: "#00d4aa",
      padding: "4px 10px",
      fontSize: "11px",
      cursor: "pointer",
      transition: "all 0.3s",
    },
    buttonGroup: {
      display: "flex",
      gap: "15px",
      margin: "25px 0",
      flexWrap: "wrap" as const,
    },
    primaryButton: {
      background: "linear-gradient(45deg, #00d4aa, #007991)",
      border: "none",
      borderRadius: "25px",
      color: "#ffffff",
      padding: "12px 30px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
    },
    secondaryButton: {
      background: "linear-gradient(45deg, #667eea, #764ba2)",
      border: "none",
      borderRadius: "25px",
      color: "#ffffff",
      padding: "12px 30px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
    },
    clearButton: {
      background: "transparent",
      border: "2px solid #ff6b6b",
      borderRadius: "25px",
      color: "#ff6b6b",
      padding: "10px 28px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
    },
    resultSection: {
      background: "rgba(0, 0, 0, 0.4)",
      border: "2px solid #00d4aa",
      borderRadius: "12px",
      padding: "25px",
      marginTop: "25px",
    },
    resultTitle: {
      color: "#00d4aa",
      fontSize: "1.3rem",
      fontWeight: "600",
      marginBottom: "20px",
    },
    resultBlock: {
      marginBottom: "20px",
    },
    resultLabel: {
      color: "#ffffff",
      fontSize: "1rem",
      fontWeight: "600",
      marginBottom: "8px",
    },
    resultText: {
      background: "rgba(0, 0, 0, 0.5)",
      border: "1px solid #444",
      borderRadius: "8px",
      padding: "15px",
      color: "#ffffff",
      fontSize: "13px",
      lineHeight: "1.6",
      whiteSpace: "pre-wrap" as const,
      wordBreak: "break-word" as const,
    },
    enhancedText: {
      borderLeft: "4px solid #00ff88",
      backgroundColor: "rgba(0, 255, 136, 0.05)",
    },
    negativeText: {
      borderLeft: "4px solid #ff8800",
      backgroundColor: "rgba(255, 136, 0, 0.05)",
    },
    copyButton: {
      background: "rgba(0, 212, 170, 0.2)",
      border: "1px solid #00d4aa",
      borderRadius: "6px",
      color: "#00d4aa",
      padding: "6px 12px",
      fontSize: "12px",
      cursor: "pointer",
      marginTop: "8px",
      transition: "all 0.3s",
    },
    suggestions: {
      marginTop: "15px",
    },
    suggestionItem: {
      background: "rgba(0, 255, 136, 0.1)",
      borderLeft: "3px solid #00ff88",
      padding: "10px 15px",
      margin: "8px 0",
      borderRadius: "0 8px 8px 0",
      fontSize: "13px",
      color: "#ffffff",
    },
    recommendations: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "8px",
      marginTop: "12px",
    },
    recommendationButton: {
      background: "rgba(102, 126, 234, 0.2)",
      border: "1px solid #667eea",
      borderRadius: "15px",
      color: "#667eea",
      padding: "6px 12px",
      fontSize: "12px",
      cursor: "pointer",
      transition: "all 0.3s",
    },
    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "15px",
      marginTop: "20px",
    },
    statItem: {
      background: "rgba(0, 0, 0, 0.3)",
      border: "1px solid #444",
      borderRadius: "10px",
      padding: "15px",
      textAlign: "center" as const,
    },
    statValue: {
      color: "#00d4aa",
      fontSize: "1.4rem",
      fontWeight: "700",
    },
    statLabel: {
      color: "#aaa",
      fontSize: "0.85rem",
      marginTop: "5px",
    },
    error: {
      background: "rgba(255, 107, 107, 0.1)",
      border: "2px solid #ff6b6b",
      borderRadius: "10px",
      color: "#ff6b6b",
      padding: "15px",
      margin: "15px 0",
      textAlign: "center" as const,
      fontWeight: "600",
    },
    loading: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "30px",
      color: "#00d4aa",
      fontSize: "1.1rem",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎨 AI Prompt Enhancer with Wildcards</h1>

      <div style={styles.inputSection}>
        <label style={styles.label}>Your Prompt:</label>
        <textarea
          style={styles.promptInput}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your creative prompt here... e.g., 'a beautiful mountain landscape', 'futuristic cyberpunk cityscape', 'portrait of a mystical warrior'"
        />
      </div>

      <div style={styles.optionsGrid}>
        <div style={styles.optionGroup}>
          <label style={styles.label}>Artist Style:</label>
          <input
            type="text"
            style={styles.input}
            value={options.artistStyle}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, artistStyle: e.target.value }))
            }
            placeholder="e.g., Van Gogh, Picasso, Monet..."
          />
          <div style={styles.artistTags}>
            {popularArtists.map((artist) => (
              <span
                key={artist}
                style={styles.artistTag}
                onClick={() =>
                  setOptions((prev) => ({ ...prev, artistStyle: artist }))
                }
              >
                {artist}
              </span>
            ))}
          </div>
        </div>

        <div style={styles.optionGroup}>
          <label style={styles.label}>Media Type:</label>
          <select
            style={styles.select}
            value={options.mediaType}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, mediaType: e.target.value }))
            }
          >
            <option value="">Select medium...</option>
            {mediaTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.optionGroup}>
          <label style={styles.label}>Color Palette:</label>
          <select
            style={styles.select}
            value={options.colorPalette}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, colorPalette: e.target.value }))
            }
          >
            <option value="">Select palette...</option>
            {colorPalettes.map((palette) => (
              <option key={palette} value={palette}>
                {palette.charAt(0).toUpperCase() + palette.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.optionGroup}>
          <label style={styles.label}>Mood:</label>
          <select
            style={styles.select}
            value={options.mood}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, mood: e.target.value }))
            }
          >
            <option value="">Select mood...</option>
            {moods.map((mood) => (
              <option key={mood} value={mood}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.optionGroup}>
          <label style={styles.label}>Quality Level:</label>
          <select
            style={styles.select}
            value={options.quality}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                quality: e.target.value as "standard" | "high" | "ultra",
              }))
            }
          >
            <option value="standard">Standard</option>
            <option value="high">High Quality</option>
            <option value="ultra">Ultra Quality</option>
          </select>

          <div style={styles.checkboxWrapper}>
            <input
              type="checkbox"
              checked={options.enhanceCreativity}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  enhanceCreativity: e.target.checked,
                }))
              }
            />
            <label style={styles.label}>Enhance Creativity</label>
          </div>
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button
          style={styles.primaryButton}
          onClick={() => enhancePrompt(false)}
          disabled={loading}
        >
          {loading ? "Enhancing..." : "Enhance Prompt"}
        </button>
        <button
          style={styles.secondaryButton}
          onClick={() => enhancePrompt(true)}
          disabled={loading}
        >
          Get Recommendations
        </button>
        <button
          style={styles.clearButton}
          onClick={() => {
            setPrompt("");
            setResult(null);
            setError(null);
          }}
        >
          Clear All
        </button>
      </div>

      {error && <div style={styles.error}>⚠️ {error}</div>}

      {loading && (
        <div style={styles.loading}>
          🎨 Enhancing your prompt with AI magic...
        </div>
      )}

      {result && (
        <div style={styles.resultSection}>
          <h3 style={styles.resultTitle}>✨ Enhanced Results</h3>

          <div style={styles.resultBlock}>
            <div style={styles.resultLabel}>Enhanced Prompt:</div>
            <div style={{ ...styles.resultText, ...styles.enhancedText }}>
              {result.enhanced}
            </div>
            <button
              style={styles.copyButton}
              onClick={() => copyToClipboard(result.enhanced)}
            >
              📋 Copy Enhanced
            </button>
          </div>

          <div style={styles.resultBlock}>
            <div style={styles.resultLabel}>Negative Prompt:</div>
            <div style={{ ...styles.resultText, ...styles.negativeText }}>
              {result.negativePrompt}
            </div>
            <button
              style={styles.copyButton}
              onClick={() => copyToClipboard(result.negativePrompt)}
            >
              📋 Copy Negative
            </button>
          </div>

          {result.suggestions && result.suggestions.length > 0 && (
            <div style={styles.suggestions}>
              <div style={styles.resultLabel}>Applied Enhancements:</div>
              {result.suggestions.map((suggestion, index) => (
                <div key={index} style={styles.suggestionItem}>
                  ✓ {suggestion}
                </div>
              ))}
            </div>
          )}

          {result.artistRecommendations &&
            result.artistRecommendations.length > 0 && (
              <div>
                <div style={styles.resultLabel}>Artist Recommendations:</div>
                <div style={styles.recommendations}>
                  {result.artistRecommendations.map((artist, index) => (
                    <button
                      key={index}
                      style={styles.recommendationButton}
                      onClick={() => applyRecommendation(artist)}
                    >
                      {artist}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {result.stats && (
            <div style={styles.stats}>
              <div style={styles.statItem}>
                <div style={styles.statValue}>
                  {result.stats.originalLength}
                </div>
                <div style={styles.statLabel}>Original Length</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>
                  {result.stats.enhancedLength}
                </div>
                <div style={styles.statLabel}>Enhanced Length</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>{result.stats.improvement}</div>
                <div style={styles.statLabel}>Improvement</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PromptEnhancer;
