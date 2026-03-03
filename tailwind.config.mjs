/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Profesjonalne kolory biznesowe z cyberpunk akcentem
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        business: {
          dark: '#000000',
          surface: '#0a0a0a',
          border: '#1a1a1a',
          text: '#e8eaf0',
          'text-dim': '#9ca3af',
          accent: '#00d9ff',
          'accent-soft': '#4ade80',
          warning: '#fbbf24',
          success: '#10b981'
        }
      },
      fontSize: {
        'xs':   ['0.9rem',   { lineHeight: '1.5rem' }],
        'sm':   ['1.05rem',  { lineHeight: '1.625rem' }],
        'base': ['1.2rem',   { lineHeight: '1.875rem' }],
        'lg':   ['1.35rem',  { lineHeight: '2rem' }],
        'xl':   ['1.5rem',   { lineHeight: '2rem' }],
        '2xl':  ['1.8rem',   { lineHeight: '2.25rem' }],
        '3xl':  ['2.25rem',  { lineHeight: '2.625rem' }],
        '4xl':  ['2.7rem',   { lineHeight: '3rem' }],
        '5xl':  ['3.6rem',   { lineHeight: '1' }],
        '6xl':  ['4.5rem',   { lineHeight: '1' }],
        '7xl':  ['5.4rem',   { lineHeight: '1' }],
        '8xl':  ['7.2rem',   { lineHeight: '1' }],
        '9xl':  ['9.6rem',   { lineHeight: '1' }],
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        steelfish: ['SteelfishEb', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 217, 255, 0.3)',
        'glow-soft': '0 0 10px rgba(74, 222, 128, 0.2)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
