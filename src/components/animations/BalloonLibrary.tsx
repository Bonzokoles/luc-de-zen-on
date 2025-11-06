import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Balloon {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface BalloonLibraryProps {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  speed?: 'slow' | 'medium' | 'fast';
}

export const BalloonLibrary: React.FC<BalloonLibraryProps> = ({
  count = 15,
  colors = ['#334155', '#475569', '#64748b', '#94a3b8'],
  minSize = 4,
  maxSize = 12,
  speed = 'medium'
}) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  const speedMap = {
    slow: [15, 25],
    medium: [10, 18],
    fast: [5, 12]
  };

  useEffect(() => {
    const newBalloons: Balloon[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      size: minSize + Math.random() * (maxSize - minSize),
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: speedMap[speed][0] + Math.random() * (speedMap[speed][1] - speedMap[speed][0]),
      delay: Math.random() * 5
    }));
    setBalloons(newBalloons);
  }, [count, colors, minSize, maxSize, speed]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {balloons.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute rounded-full opacity-20 blur-sm"
          style={{
            left: `${balloon.x}%`,
            width: `${balloon.size}px`,
            height: `${balloon.size}px`,
            backgroundColor: balloon.color,
          }}
          initial={{ y: balloon.y + '%', opacity: 0 }}
          animate={{
            y: [balloon.y + '%', '-20%'],
            opacity: [0, 0.3, 0.3, 0],
            x: [0, (Math.random() - 0.5) * 50]
          }}
          transition={{
            duration: balloon.duration,
            delay: balloon.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

// Particle Effect Component
interface ParticleEffectProps {
  particleCount?: number;
  colors?: string[];
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  particleCount = 30,
  colors = ['#00d9ff', '#0ea5e9', '#4ade80', '#8b5cf6']
}) => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, [particleCount, colors]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

// Floating Element Component
interface FloatingElementProps {
  children: React.ReactNode;
  duration?: number;
  yOffset?: number;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  duration = 3,
  yOffset = 10
}) => {
  return (
    <motion.div
      animate={{
        y: [-yOffset, yOffset, -yOffset],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
};

// Glow Pulse Component
interface GlowPulseProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
}

export const GlowPulse: React.FC<GlowPulseProps> = ({
  children,
  color = '#00d9ff',
  duration = 2
}) => {
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 5px ${color}33`,
          `0 0 20px ${color}66, 0 0 30px ${color}33`,
          `0 0 5px ${color}33`
        ]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
};

// Wave Effect Component
interface WaveEffectProps {
  color?: string;
  opacity?: number;
}

export const WaveEffect: React.FC<WaveEffectProps> = ({
  color = '#0ea5e9',
  opacity = 0.1
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none overflow-hidden h-64 z-0">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '200%',
            background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
            opacity: opacity,
          }}
          animate={{
            x: ['-25%', '25%'],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
};

// Sparkle Effect Component
interface SparkleEffectProps {
  density?: number;
}

export const SparkleEffect: React.FC<SparkleEffectProps> = ({
  density = 20
}) => {
  const [sparkles, setSparkles] = useState<any[]>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: density }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 3,
      duration: 1 + Math.random() * 2,
    }));
    setSparkles(newSparkles);
  }, [density]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 5,
          }}
        >
          <div className="w-full h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </motion.div>
      ))}
    </div>
  );
};

// Gradient Orb Component
interface GradientOrbProps {
  colors?: string[];
  size?: number;
  blur?: number;
}

export const GradientOrb: React.FC<GradientOrbProps> = ({
  colors = ['#00d9ff', '#8b5cf6', '#ec4899'],
  size = 400,
  blur = 100
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            filter: `blur(${blur}px)`,
            left: `${20 + i * 30}%`,
            top: `${20 + i * 20}%`,
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
};

// Ripple Effect Component (for clicks/interactions)
interface RippleProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

export const Ripple: React.FC<RippleProps> = ({ x, y, onComplete }) => {
  return (
    <motion.div
      className="absolute rounded-full border-2 border-primary-400"
      style={{
        left: x,
        top: y,
        width: 0,
        height: 0,
      }}
      initial={{ width: 0, height: 0, opacity: 1 }}
      animate={{
        width: 100,
        height: 100,
        opacity: 0,
        x: -50,
        y: -50,
      }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
      onAnimationComplete={onComplete}
    />
  );
};

export default BalloonLibrary;
