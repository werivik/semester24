const fs = require('fs');
const path = require('path');
const sass = require('sass');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

// Paths
const inputPath = path.join(__dirname, 'src', 'style.scss');
const outputPath = path.join(__dirname, 'dist', 'style.css');

// Compile SCSS to CSS
sass.render({ file: inputPath }, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }

  // PostCSS processing
  postcss([tailwindcss, autoprefixer])
    .process(result.css, { from: undefined })
    .then((output) => {
      // Save processed CSS to output file
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, output.css);
      console.log('Build complete: CSS saved to', outputPath);
    })
    
    .catch((err) => {
      console.error('PostCSS error:', err);
    });
});
