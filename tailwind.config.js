/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      xs: "450px",
      sm: "575px",
      md: "786px",
      lg: "1020px",
      base: "1100px",
      xl: "1200px",
      "2xl": "1500px",
    },
    extend: {

      backgroundImage: {
        'grd1': 'linear-gradient(to right, #0011ff, #00AFFF)',
        'grdb': 'linear-gradient(to right, #0e0e2a, #1a1a40)',
      },

      colors: {
        current: "currentColor",
        clr0: "#0011ff",
        clr1: "#00AFFF",
        clr2: "#FF0000",
        clr3: "#fcb045",
        bgc: "#0e0e2a",
        lightblue: '#3b82f6',
        "color-dark": "#191919",
        
          primary: 'var(--color-primary)',
          
          secondary: 'var(--color-secondary)',
          'bg-start': 'var(--color-bg-start)',
          'bg-end': 'var(--color-bg-end)',
        
      },
      fontSize: {
        clamp: "clamp(1rem, 5vw, 3rem)",
      },
      dropShadow: {
        three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        spinReverse: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        move: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        move_icon: 'move 5s linear infinite',
        spinSlow: 'spin 6s linear infinite',
        spinReverse: 'spin-reverse 6s linear infinite',
      },
      // Add custom utilities here
      scrollbarWidth: {
        none: 'none', // For Firefox
      },
      msOverflowStyle: {
        none: 'none', // For Internet Explorer and Edge
      },
      scrollbar: {
        thin: {
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.4)",
            borderRadius: "10px",
          },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          'scrollbar-width': 'none', /* Firefox */
          '-ms-overflow-style': 'none', /* Internet Explorer and Edge */
          '&::-webkit-scrollbar': {
            display: 'none', /* Safari and Chrome */
          },
        },
      }, ['responsive']);
    },
  ],
};
