import React, { useEffect, useRef } from 'react';

// Full-width canvas visualizer using the site's edge/cyan theme
// No controls, no avatar — just visualization. Designed to sit between white separator lines.
// It doesn't open mic by itself; it animates gently when no mic, and reacts if a stream is provided.

export interface EdgeAudioVisualizerProps {
    height?: number; // canvas height in px
    source?: 'auto' | 'music' | 'mic' | 'ai-voice'; // which analyser to follow
    variant?: 'edge' | 'music' | 'mic' | 'ai-assistant'; // color styling  
    color?: string; // custom color for ai-assistant
}

export default function EdgeAudioVisualizer({ height = 120, source = 'auto', variant = 'edge', color }: EdgeAudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const freqDataRef = useRef<Uint8Array | null>(null);
    const aiVoiceActiveRef = useRef<boolean>(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = Math.floor(rect.width * dpr);
            canvas.height = Math.floor(height * dpr);
        };
        resize();

        let t = 0;
        
        // Listen for AI voice events (tylko dla ai-voice source)
        const handleAIVoiceStart = () => {
            if (source === 'ai-voice') {
                aiVoiceActiveRef.current = true;
            }
        };
        const handleAIVoiceEnd = () => {
            if (source === 'ai-voice') {
                aiVoiceActiveRef.current = false;
            }
        };
        
        if (source === 'ai-voice') {
            window.addEventListener('ai-voice-start', handleAIVoiceStart);
            window.addEventListener('ai-voice-end', handleAIVoiceEnd);
        }

        function pickAnalyser(): AnalyserNode | null {
            const anyWin = window as any;
            const musicA: AnalyserNode | null = anyWin.MUSIC_ANALYSER || (anyWin.MUSIC && anyWin.MUSIC.getAnalyser && anyWin.MUSIC.getAnalyser());
            const micA: AnalyserNode | null = anyWin.MIC_ANALYSER || null;
            const aiA: AnalyserNode | null = anyWin.AI_VOICE_ANALYSER || null;
            if (source === 'music') return musicA;
            if (source === 'mic') return micA;
            if (source === 'ai-voice') return aiA;
            // auto: prefer music, else mic
            return musicA || micA;
        }

        function tryAttachAnalyser() {
            try {
                const a = pickAnalyser();
                if (a && a.frequencyBinCount) {
                    analyserRef.current = a;
                    freqDataRef.current = new Uint8Array(a.frequencyBinCount);
                }
            } catch (e) {
                // ignore
            }
        }

        tryAttachAnalyser();
        window.addEventListener('music-analyser-ready', tryAttachAnalyser);
        window.addEventListener('mic-analyser-ready', tryAttachAnalyser);
        const draw = () => {
            rafRef.current = requestAnimationFrame(draw);
            t += 0.015;

            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            // Bars count scales with width
            const barCount = Math.max(24, Math.floor(w / (18 * dpr)));
            const barWidth = w / barCount;

            // Colors by variant
            const rootStyles = getComputedStyle(document.documentElement);
            const edgeBase = rootStyles.getPropertyValue('--color-edge')?.trim() || 'hsl(200,30%,18%)';
            let c1 = '#00d7ef';
            let c2 = edgeBase;
            if (variant === 'music') {
                c1 = '#4fc3f7';
                c2 = '#00bcd4';
            } else if (variant === 'mic') {
                c1 = '#00e7ff';
                c2 = edgeBase;
            } else if (variant === 'ai-assistant') {
                c1 = color || '#00d7ef';
                c2 = '#0097b2'; // AI accent color
            }

            const analyser = analyserRef.current;
            const freqData = freqDataRef.current;
            if (analyser && freqData) {
                try { (analyser as any).getByteFrequencyData(freqData as unknown as Uint8Array); } catch { }
            }

            for (let i = 0; i < barCount; i++) {
                let barH: number;
                if (analyser && freqData) {
                    const idx = Math.floor(i * (freqData.length / barCount));
                    const v = freqData[Math.min(idx, freqData.length - 1)] / 255; // 0..1
                    const emphasis = Math.pow(v, 0.85);
                    barH = Math.max(2, emphasis * h * 0.9);
                } else if (source === 'ai-voice' && aiVoiceActiveRef.current) {
                    // AI is speaking - enhanced pulse pattern
                    const speakingPattern = 0.3 + 0.4 * Math.sin(t * 2 + i * 0.5) + 0.2 * Math.sin(t * 3 + i * 0.7);
                    barH = Math.max(8, speakingPattern * h * 0.7);
                } else {
                    // Idle pulse pattern fallback
                    const base = 0.08 + 0.06 * Math.sin(t + i * 0.35);
                    barH = Math.max(2, base * h);
                }

                // Gradient from edge to cyan (chat frame vibe)
                const grad = ctx.createLinearGradient(0, h - barH, 0, h);
                grad.addColorStop(0, c1);
                grad.addColorStop(1, c2);

                ctx.fillStyle = grad;
                ctx.fillRect(i * barWidth, h - barH, barWidth * 0.85, barH);
            }

            // Subtle top/bottom glow lines to mimic white separators nearby
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.fillRect(0, 0, w, Math.max(1, 1 * dpr));
            ctx.fillRect(0, h - Math.max(1, 1 * dpr), w, Math.max(1, 1 * dpr));
        };

        draw();

        const onResize = () => resize();
        window.addEventListener('resize', onResize);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('music-analyser-ready', tryAttachAnalyser);
            window.removeEventListener('mic-analyser-ready', tryAttachAnalyser);
            if (source === 'ai-voice') {
                window.removeEventListener('ai-voice-start', handleAIVoiceStart);
                window.removeEventListener('ai-voice-end', handleAIVoiceEnd);
            }
        };
    }, [height, source, variant]);

    return (
        <div className="w-full mx-auto">
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: `${height}px`, display: 'block', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(0,217,255,0.3)' }}
            />
        </div>
    );
}
