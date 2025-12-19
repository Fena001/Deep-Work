/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        forest: {
          dark: 'var(--bg-dark)',
          panel: 'var(--bg-panel)',
          accent: 'var(--color-accent)',
          hover: 'var(--color-hover)',
          text: 'var(--text-main)',
          muted: 'var(--text-muted)',
        }
      }
    },
  },
  plugins: [],
}