/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './src/css/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        fontColorDark: '#29272F',
        fontColorLight: '#F2F2F2',
        bodyColor: '#EBEEE9',
        orangeColor: '#D6650F',
        blackColor: '#29272F',
        greenColor: '#81AB76',
      },
      fontFamily: {
        serif:["Libre Bodoni", serif]
      },
    },
  },
  plugins: [],
}

