import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Gradient Card Component with animated border
interface GradientCardProps {
  children: ReactNode;
  gradient?: string;
  animated?: boolean;
  className?: string;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  gradient = 'from-primary-500/20 to-purple-500/20',
  animated = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={animated ? { scale: 1.02, y: -5 } : {}}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`}></div>
      <div className="relative bg-business-surface/80 backdrop-blur-sm border border-business-border rounded-xl p-6">
        {children}
      </div>
      {animated && (
        <motion.div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(45deg, transparent, rgba(100, 116, 139, 0.1), transparent)`,
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      )}
    </motion.div>
  );
};

// Animated Counter Component
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  className = ''
}) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}{end.toLocaleString('pl-PL')}{suffix}
    </motion.span>
  );
};

// Progress Bar with Animation
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'bg-primary-500',
  height = 'h-3',
  showLabel = true,
  animated = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      <div className={`relative ${height} bg-business-dark rounded-full overflow-hidden`}>
        <motion.div
          className={`absolute inset-y-0 left-0 ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
        >
          {animated && (
            <motion.div
              className="absolute inset-0 opacity-50"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              }}
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          )}
        </motion.div>
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-business-text-dim">
          <span>{value.toLocaleString('pl-PL')}</span>
          <span>{max.toLocaleString('pl-PL')}</span>
        </div>
      )}
    </div>
  );
};

// Stat Card with Icon and Trend
interface StatCardEnhancedProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  animated?: boolean;
}

export const StatCardEnhanced: React.FC<StatCardEnhancedProps> = ({
  icon,
  label,
  value,
  trend,
  color = '#64748b',
  animated = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={animated ? { scale: 1.05, y: -5 } : {}}
      transition={{ duration: 0.3 }}
      className="bg-business-surface border border-business-border rounded-xl p-6 relative overflow-hidden"
    >
      {/* Background gradient effect */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl"
        style={{ backgroundColor: color }}
      ></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {icon}
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold ${
                trend.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <p className="text-sm text-business-text-dim mb-2">{label}</p>
        <p className="text-3xl font-bold text-business-text">
          {typeof value === 'number' ? value.toLocaleString('pl-PL') : value}
        </p>
      </div>

      {/* Animated shine effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 opacity-0 hover:opacity-100"
          style={{
            background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.05), transparent)',
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      )}
    </motion.div>
  );
};

// Animated Badge Component
interface AnimatedBadgeProps {
  text: string;
  color?: string;
  icon?: ReactNode;
  pulse?: boolean;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  text,
  color = 'primary',
  icon,
  pulse = false
}) => {
  const colors = {
    primary: 'bg-primary-500/20 text-primary-300 border-primary-500/50',
    success: 'bg-green-500/20 text-green-300 border-green-500/50',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    danger: 'bg-red-500/20 text-red-300 border-red-500/50',
    info: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colors[color as keyof typeof colors]}`}
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
      {pulse && (
        <motion.span
          className="w-2 h-2 rounded-full bg-current"
          animate={{
            opacity: [1, 0.3, 1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </motion.span>
  );
};

// Skeleton Loader
interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded',
  className = ''
}) => {
  return (
    <div className={`${width} ${height} ${rounded} bg-business-dark animate-pulse ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-transparent via-business-border to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

// Interactive Tooltip
interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top'
}) => {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className={`absolute ${positions[position]} opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity`}
      >
        <div className="bg-business-dark border border-business-border rounded-lg px-3 py-2 text-xs text-business-text whitespace-nowrap shadow-xl">
          {content}
          <div
            className={`absolute w-2 h-2 bg-business-dark border-business-border rotate-45 ${
              position === 'top'
                ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-b border-r'
                : position === 'bottom'
                ? 'top-[-4px] left-1/2 -translate-x-1/2 border-t border-l'
                : position === 'left'
                ? 'right-[-4px] top-1/2 -translate-y-1/2 border-r border-t'
                : 'left-[-4px] top-1/2 -translate-y-1/2 border-l border-b'
            }`}
          />
        </div>
      </motion.div>
    </div>
  );
};

// Glass Card Effect
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  blur = 'backdrop-blur-lg'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-business-surface/30 ${blur} border border-business-border/50 rounded-xl p-6 shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default {
  GradientCard,
  AnimatedCounter,
  ProgressBar,
  StatCardEnhanced,
  AnimatedBadge,
  Skeleton,
  Tooltip,
  GlassCard,
};
