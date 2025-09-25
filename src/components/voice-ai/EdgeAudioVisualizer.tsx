import React, { useEffect, useRef } from 'react';

// Full-width canvas visualizer using the site's edge/cyan theme
// No controls, no avatar — just visualization. Designed to sit between white separator lines.
// It doesn't open mic by itself; it animates gently when no mic, and reacts if a stream is provided.

export interface EdgeAudioVisualizerProps {
    height?: number; // canvas height in px
    source?: 'auto' | 'music' | 'mic'; // which analyser to follow
    variant?: 'edge' | 'music' | 'mic'; // color styling
}

export default function EdgeAudioVisualizer({ height = 120, source = 'auto', variant = 'edge' }: EdgeAudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const freqDataRef = useRef<Uint8Array | null>(null);

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

        function pickAnalyser(): AnalyserNode | null {
            const anyWin = window as any;
            const musicA: AnalyserNode | null = anyWin.MUSIC_ANALYSER || (anyWin.MUSIC && anyWin.MUSIC.getAnalyser && anyWin.MUSIC.getAnalyser());
            const micA: AnalyserNode | null = anyWin.MIC_ANALYSER || null;
            if (source === 'music') return musicA;
            if (source === 'mic') return micA;
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
