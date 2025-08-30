import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0a',
        'cyber-surface': '#111111',
        'cyber-text': '#e0e0e0',
        'cyber-text-dim': '#a0a0a0',
        'cyber-blue': '#00ffff',
        'cyber-border': '#333333',
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
