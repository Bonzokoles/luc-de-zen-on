/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            fontFamily: {
                'rajdhani': ['Rajdhani', 'sans-serif'],
            },
            colors: {
                'cyber-dark': '#0a0a0a',
                'cyber-blue': '#00ffff',
                'cyber-blue-light': '#00d9ff',
                'cyber-text': '#e0e0e0',
            }
        },
    },
    plugins: [],
}
