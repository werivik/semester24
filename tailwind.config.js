/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // HTML files in various folders
    './*.html',
    './auth/*.html',
    './listings/*.html',
    './profile/*.html',

    //Media files in that one folder
    './media/**/*.{html,js}',

    // JS files in various folders
    './js/**/*.js',

    // CSS/SCSS files in the src folder
    './src/**/*.scss',
    './src/**/*.css',
    './src/css/**/*.css',
  ],
  safelist: [
    "text-font1",
    "text-font2",
    "text-font3",
  ],
  theme: {
    extend: {
      colors: {
        bodyBackground: '#EBEEE9',
        darkGreyFont: '#29272F',
        lightFont: '#F2F2F2',
        specialGreen: '#81AB76',
        specialOrange: '#D6650F',
      },
      backgroundImage: {
        'grain-texture': "url('/media/textures/grain-texture2.png')",
      },
      fontFamily: {
        serif: ['"Libre Bodoni"', 'serif'],
      },
      fontSize: {
        font1: "35px",
        font2: "30px",
        font3: "25px",
        font4: "18px",
      },
      padding: {
        sPaddingUp: "20px",
        mPaddingUp: "40px",
        lPaddingUp: "80px",
        xlPaddingUp: "160px",

        sPaddingDown: "20px",
        mPaddingDown: "40px",
        lPaddingDown: "80px",
        xlPaddingDown: "160px",
      }
    },
  },
  plugins: [],
  corePlugins: {
    margin: true,
  }
}

