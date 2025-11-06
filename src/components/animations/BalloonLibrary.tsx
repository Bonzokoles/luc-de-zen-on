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

export default BalloonLibrary;
