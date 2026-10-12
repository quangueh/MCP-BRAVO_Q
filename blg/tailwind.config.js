/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0078D4',
          dark: '#005A9E',
          light: '#2B88D8',
        },
        surface: {
          DEFAULT: '#1E1E1E',
          light: '#2D2D2D',
          hover: '#383838',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
