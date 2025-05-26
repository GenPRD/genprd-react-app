/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E1F5FE',  
          100: '#B3E5FC',
          500: '#00B0FF',  
          600: '#039BE5',
          700: '#0288D1',
          900: '#01579B',
        }
      },
    },
  },
  plugins: [],
}