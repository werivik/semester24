/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // HTML files in various folders
    './index.html',
    './listings/**/*.html',
    './profile/**/*.html',
    './auth/**/*.html',
    './media/**/*.{html,js}',

    // JS files in various folders
    './js/**/*.js',

    // CSS/SCSS files in the src folder
    './src/**/*.scss',
    './src/**/*.css',
    './src/css/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        bodyBackground: '#EBEEE9',
        darkGreyFont: '#29272F',
        lightFont: '#F2F2F2',
        green: '#81AB76',
        orange: '#D6650F',
      },
    },
  },
  plugins: [],
}

