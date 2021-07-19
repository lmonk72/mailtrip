const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const Fiber = require('fibers');
const purgecss = require('gulp-purgecss');
const concat = require('gulp-concat');
const inlineCss = require('gulp-inline-css');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const browsersync = require('browser-sync').create();
const smoosher = require('gulp-smoosher');

//Dart sass compiler
sass.compiler = require('sass');

//Compile SASS to CSS
function compileCSS() {
  return src('build/scss/**/*.scss', { sourcemaps: true } )
    .pipe(sass({fiber: Fiber}).on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(purgecss({content: ['./*.html']}))
    .pipe(dest('dist/css', { sourcemaps: '.' }))
}

function boilerplateCSS() {
  return src('build/scss/base/boilerplate.scss', { sourcemaps: true } )
    .pipe(sass({fiber: Fiber}).on('error', sass.logError))
    .pipe(smoosher())
    .pipe(inlineCss({
      removeStyleTags: false,
      removeLinkTags: true,
      preserveMediaQueries: true
    }))
    .pipe(dest('dist/css'));
}

//Combine all the different CSS files together
// function mergeCSS() {
//   return src('dist/**/*.css')
//     .pipe(concat('styles.css'))
//     .pipe(dest('dist'));
// }

// //Remove unused CSS
// function purgeCSS() {
//   return src('build/**/*.css')
//     .pipe(purgecss({content: ['./*.html']}))
//     .pipe(dest('dist/'))
// }

//Merge CSS into the HTML 
function inlineCSS() {
  return src('./*.html')
    .pipe(smoosher())
    .pipe(inlineCss({
      removeStyleTags: false,
      removeLinkTags: true,
      preserveMediaQueries: true
    }))
    .pipe(dest('dist'));
}


//Compress images 
function minifyIMG() {
  return src('build/img/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.mozjpeg({
        quality: 85,
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(dest('dist/img'));
}

//Initialise browser-sync 
function browsersyncServe(callback) {
  browsersync.init({
    server: {
        baseDir: "./dist/"
    }
  });
  callback();
}

//Trigger browser refresh
function browsersyncReload(callback) {
  browsersync.reload();
  callback();
}

//Watch for changes
function watchTask() {
  watch(['*.html', 'build/scss/**/*.scss'], series(compileCSS, boilerplateCSS, inlineCSS, minifyIMG, browsersyncReload));
}

//Default Gulp tasks
exports.default = series(
  compileCSS,
  boilerplateCSS,
  inlineCSS,
  minifyIMG,
  browsersyncServe,
  watchTask
)