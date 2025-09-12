import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
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
