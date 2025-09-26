import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}',
    '!./src/**/*.svelte',
    '!./src/**/node_modules/**',
    '!./dist/**'
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0a',
        'cyber-surface': '#111111',
        'cyber-text': '#e0e0e0',
        'cyber-text-dim': '#a0a0a0',
        'cyber-blue': '#00ffff',
        'cyber-purple': '#8b00ff',
        'cyber-purple-light': '#a333ff',
        'cyber-green': '#00ff88',
        'cyber-orange': '#ff8800',
        'cyber-pink': '#ff0088',
        'cyber-border': '#333333',
        black: 'var(--black)',
        white: 'var(--white)',
        gray: {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)', 
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
          950: 'var(--gray-950)',
        },
      },
      fontFamily: {
        sans: ['Rajdhani', ...fontFamily.sans],
        mono: ['Source Code Pro', ...fontFamily.mono],
      },
      boxShadow: {
        'glow-blue': '0 0 8px rgba(0, 255, 255, 0.6), 0 0 12px rgba(0, 255, 255, 0.4)',
        'glow-blue-strong': '0 0 12px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6)',
      },
      borderRadius: {
        none: '0',
      },
    },
  },
  plugins: [],
};
