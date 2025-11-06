import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  delay?: number;
}

// Fade In transition
export const FadeIn: React.FC<PageTransitionProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

// Slide Up transition
export const SlideUp: React.FC<PageTransitionProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// Slide In from Left
export const SlideInLeft: React.FC<PageTransitionProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

// Slide In from Right
export const SlideInRight: React.FC<PageTransitionProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

// Scale In transition
export const ScaleIn: React.FC<PageTransitionProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
};

// Stagger Children - for lists
interface StaggerChildrenProps {
  children: ReactNode;
  staggerDelay?: number;
}

export const StaggerChildren: React.FC<StaggerChildrenProps> = ({ 
  children, 
  staggerDelay = 0.1 
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Stagger Item - use with StaggerChildren
export const StaggerItem: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {children}
    </motion.div>
  );
};

// Hover Scale animation
interface HoverScaleProps {
  children: ReactNode;
  scale?: number;
}

export const HoverScale: React.FC<HoverScaleProps> = ({ children, scale = 1.05 }) => {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

// Rotating Element
interface RotatingElementProps {
  children: ReactNode;
  duration?: number;
}

export const RotatingElement: React.FC<RotatingElementProps> = ({ 
  children, 
  duration = 20 
}) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: "linear" 
      }}
    >
      {children}
    </motion.div>
  );
};

export default {
  FadeIn,
  SlideUp,
  SlideInLeft,
  SlideInRight,
  ScaleIn,
  StaggerChildren,
  StaggerItem,
  HoverScale,
  RotatingElement
};
