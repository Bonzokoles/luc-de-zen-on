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
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 217, 255, 0.3)',
        'glow-soft': '0 0 10px rgba(74, 222, 128, 0.2)',
      }
    },
  },
  plugins: [],
}
