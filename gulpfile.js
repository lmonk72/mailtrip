const {
  src,
  dest,
  watch,
  series
} = require('gulp');


// Plugins
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const stripCssComments = require('gulp-strip-css-comments');
const cleanCSS = require('gulp-clean-css');
const purgecss = require('gulp-purgecss');
const smoosher = require('gulp-smoosher');
const inlineCss = require('gulp-inline-css');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const clean = require('gulp-clean');

// Compile sass files
function compileSass() {
  return sass().on('error', sass.logError);
}

// CSS Tasks
function buildStyles() {
  return src('build/**/*.scss')
    .pipe(compileSass()) // Use the helper function here
    .pipe(dest('tmp'));
}

// Remove CSS Comments
function stripStyleComments() {
  return src('tmp/css/**/*.css')
    .pipe(stripCssComments({
      preserve: false
    }))
    .pipe(dest('tmp/css'));
}

function concatenateStyles() {
  return src(['tmp/css/**/*.css', '!dist/**/boilerplate.css'])
    .pipe(concat('main.css'))
    .pipe(dest('tmp/css'));
}


// Purge CSS of unused styles
function purgeStyles() {
  return src('tmp/css/*.css')
    .pipe(purgecss({
      content: ['./*.html']
    }))
    .pipe(dest('dist/css'));
}

function minifyStyles() {
  return src('dist/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest('dist/css'));
}


function boilerplateCSS() {
  return src('tmp/css/base/boilerplate.css')
    .pipe(smoosher({
      ignoreFilesNotFound: true
    }))
    .pipe(cleanCSS())
    .pipe(inlineCss({
      removeStyleTags: true,
      removeLinkTags: true,
      preserveMediaQueries: true
    }))
    .pipe(dest('dist/css'));
}

function inlineStyles() {
  return src('./*.html')
    .pipe(smoosher({
      ignoreFilesNotFound: true
    }))
    .pipe(inlineCss({
      removeStyleTags: false,
      removeLinkTags: true,
      preserveMediaQueries: true
    }))
    .pipe(dest('dist'));
}

// Minify the HTML
function minifyHtml() {
  return src('dist/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest('dist'));
}


// Image Tasks
function minifyImages() {
  return src('build/img/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.mozjpeg({
        quality: 75,
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

// Remove tmp folder once finished
function cleanup() {
  return src('tmp', {read: false})
  .pipe(clean());
}

// Browsersync Tasks
function browsersyncServe(callback) {
  browsersync.init({
    server: {
      baseDir: "./dist/"
    }
  });
  callback();
}

function browsersyncReload(callback) {
  browsersync.reload();
  callback();
}

const buildTasks = series(
  buildStyles,
  stripStyleComments,
  purgeStyles,
  minifyStyles,
  boilerplateCSS,
  inlineStyles,
  minifyHtml,
  minifyImages,
  cleanup
);

// Watch Task
function watchTask() {
  watch(['*.html', 'build/**/*.scss'], series(
    buildStyles,
    stripStyleComments,
    purgeStyles,
    minifyStyles,
    boilerplateCSS,
    inlineStyles,
    minifyHtml,
    browsersyncReload));
  watch(['*', 'build/img/**/*'], series(minifyImages, browsersyncReload));
}

// Exports
exports.build = buildTasks;
exports.default = series(buildTasks, browsersyncServe, watchTask);
exports.buildStyles = series(buildStyles);
exports.clean = series(cleanup);