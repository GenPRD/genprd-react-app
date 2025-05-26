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
          200: '#81D4FA',
          300: '#4FC3F7', 
          400: '#29B6F6',
          500: '#00B0FF',  
          600: '#039BE5',
          700: '#0288D1',
          800: '#0277BD',
          900: '#01579B',
        },
        badge: {
          draft: '#D3D3D3',
          progress: '#00B0FF', 
          finished: '#28A745',
          archived: '#696969',
        }
      }
    },
  },
  plugins: [],
}