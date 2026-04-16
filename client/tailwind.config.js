/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C94A2B', // Терракотовый
          50: '#FDF2EF',
          100: '#F9DFD8',
          200: '#F3BFB0',
          300: '#ED9F88',
          400: '#DB7A5C',
          500: '#C94A2B',
          600: '#B33E22',
          700: '#8F311B',
          800: '#6B2514',
          900: '#47190D',
        },
        secondary: {
          DEFAULT: '#4A5D23', // Хаки
          50: '#F4F6EF',
          100: '#E3E9D4',
          200: '#C7D2A9',
          300: '#ABBC7E',
          400: '#7E9449',
          500: '#4A5D23',
          600: '#3D4E1D',
          700: '#303F17',
          800: '#232F11',
          900: '#161F0B',
        },
        accent: {
          sand: '#D4B68A',
          clay: '#B87C5A',
          forest: '#2C4A2B',
          sky: '#8CB2C4',
        }
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
      },
      backgroundImage: {
        'compass-pattern': "url('https://www.transparenttextures.com/patterns/old-map.png')",
        'leather-pattern': "url('https://www.transparenttextures.com/patterns/leather.png')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'sway': 'sway 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
    },
  },
  plugins: [],
}