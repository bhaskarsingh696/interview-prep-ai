/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0e1a',
        secondary: '#111827',
        card: '#141b2d',
        hover: '#1e2d45',
        accent: '#00ff88',
        border: '#1e2d45',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        ibm: ['IBM Plex Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}