/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{html,js,jsx,tsx}',
    './pages/**/*.{html,js,jsx,tsx}',
    './assets/**/*.{html,js,jsx,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        13: '3.25rem',
      },
      screens: {
        '3xl': '1800px',
      },
      transitionProperty: {
        outlineOffset: 'outline-offset',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        body: '#53504B',
        grey: '#1D1C1A',
        blue: '#1746A2',
        white: {
          DEFAULT: '#FFF',
          200: '#F3F2F2',
        },
        black: {
          DEFAULT: '#000',
        },
      },
    },
    fontFamily: {
      sans: ['Mona Sans', 'sans-serif'],
    },
    fontSize: {
      sm: '0.8125em', // 13px
      base: '1rem', // 16px
      'md-small': '1.25rem', // 20px
      md: '1.5rem', // 24px
      lg: '2rem', // 32px
      xl: '2.5rem', // 40px
      '2xl': '3.5rem', // 56px
    },
  },
  plugins: [],
};
