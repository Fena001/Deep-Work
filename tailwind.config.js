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
          // WE KEEP THE NAME 'forest' SO WE DON'T HAVE TO CHANGE YOUR JSX
          // BUT WE CHANGE THE COLORS TO BLUE
          dark: '#0B1220',   // Deep Navy Blue background
          panel: '#111A2E',  // Lighter Slate Blue for cards
          accent: '#22C55E', // Bright Sky Blue for buttons/highlights
          hover: '#A855F7',  // Darker Blue for hover states
          text: '#E5E7EB',   // Off-white text
          muted: '#94A3B8',  // Grey-blue for muted text
        }
      }
    },
  },
plugins: [],
}
