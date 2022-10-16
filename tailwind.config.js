/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{html,js,jsx,tsx}',
    './pages/**/*.{html,js,jsx,tsx}',
    './assets/**/*.{html,js,jsx,tsx}',
  ],
  theme: {
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
    fontFamily: {
      sans: ['Space Grotesk'],
    },
    fontSize: {
      sm: '0.8125em', // 13px
      base: '1rem', // 16px
      md: '1.5rem', // 24px
      lg: '2rem', // 32px
      xl: '2.5rem', // 40px
      '2xl': '3.5rem', // 56px
    },
  },
  plugins: [],
};
