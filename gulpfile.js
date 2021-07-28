const {
  src,
  dest,
  watch,
  series
} = require('gulp');

const sass = require('gulp-sass');
const Fiber = require('fibers');
const concat = require('gulp-concat');
const purgecss = require('gulp-purgecss');
const smoosher = require('gulp-smoosher');
const stripCssComments = require('gulp-strip-css-comments');
const cleanCSS = require('gulp-clean-css');
const inlineCss = require('gulp-inline-css');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const prompt = require('gulp-prompt');
const browsersync = require('browser-sync').create();
const rename = require("gulp-rename");
const del = require('del');

//Dart sass compiler
sass.compiler = require('sass');

//Compile SASS to CSS
function compileCSS() {
  return src('build/scss/**/*.scss', {
      sourcemaps: true
    })
    .pipe(sass({
      fiber: Fiber
    }).on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(purgecss({
      content: ['./*.html']
    }))
    .pipe(stripCssComments({
      preserve: false
    }))
    .pipe(cleanCSS())
    .pipe(dest('dist/css', {
      sourcemaps: '.'
    }))
}

//Compile a boilerplate to dodge certain css purging
function boilerplateCSS() {
  return src('build/scss/base/boilerplate.scss', {
      sourcemaps: true
    })
    .pipe(sass({
      fiber: Fiber
    }).on('error', sass.logError))
    .pipe(stripCssComments({
      preserve: false
    }))
    .pipe(smoosher())
    .pipe(cleanCSS())
    .pipe(inlineCss({
      removeStyleTags: true,
      removeLinkTags: true,
      preserveMediaQueries: true
    }))
    .pipe(dest('dist/css'));
}

//Merge CSS into the HTML 
function inlineCSS() {
  return src('./*.html')
    .pipe(smoosher())
    .pipe(inlineCss({
      removeStyleTags: false,
      removeLinkTags: true,
      preserveMediaQueries: true
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
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

//Handle when a project is saveed
function save() {
  return src('./dist/index.html')
    /* Prompt user for project name and confirmation of what to do next */
    .pipe(prompt.prompt([{
          type: 'input',
          name: 'emailName',
          message: 'What is the name of the email?',
          validate: function (emailName) {
            if (typeof (emailName) == 'undefined' || typeof (emailName) == null || emailName == '') {
              return false;
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'clientName',
          message: 'Who is the client?',
          validate: function (clientName) {
            if (typeof (clientName) == 'undefined' || typeof (clientName) == null || clientName == '') {
              return false;
            }
            return true;
          }
        },
        {
          type: 'checkbox',
          name: 'nextSteps',
          message: 'What would you like to do now?',
          choices: ['Save project', 'Save and Export', 'Export only', 'Nothing'],
          validate: function (nextSteps) {
            if (typeof (nextSteps) == 'undefined' || typeof (nextSteps) == null || nextSteps == '') {
              return false;
            }
            return true;
          }
        }
      ],

      /* Results are stored in 'results' */
      function (results) {
        let emailName = results.emailName;
        let clientName = results.clientName;
        let nextStep = results.nextSteps.toString();

        switch (nextStep) {
          case 'Save project':
            src("build/**/*")
              .pipe(dest(`emails/${clientName}/${emailName}/saved/build`));
            
            src("*.html")
              .pipe(dest(`emails/${clientName}/${emailName}/saved`));

            console.log(`The assets have been saved to 'emails/${clientName}/${emailName}/saved'.`);
            break;

          case 'Save and Export':
            //Save
            src("build/**/*")
              .pipe(dest(`emails/${clientName}/${emailName}/saved/build`));
            //Save
            src("*.html")
              .pipe(dest(`emails/${clientName}/${emailName}/saved`));
            //Export
            src("dist/**/*.html")
              .pipe(dest(`emails/${clientName}/${emailName}/export`));
            //Export
            src("dist/img/**/*")
              .pipe(dest(`emails/${clientName}/${emailName}/export/img`))

            console.log(`The assets have been saved and exported to 'emails/${clientName}/${emailName}'.`);
            break;

          case 'Export only':

            src("dist/**/*.html")
              .pipe(dest(`emails/${clientName}/${emailName}/export`));

            src("dist/img/**/*")
              .pipe(dest(`emails/${clientName}/${emailName}/export/img`))

              console.log(`The assets have been saved and exported to 'emails/${clientName}/${emailName}/export'.`);
            break;

          case 'Nothing':
            console.log("OK, let's chill");
            break;

          default:
            break;
        }

      }));
}


//Watch for changes
function watchTask() {
  watch(['*.html', 'build/scss/**/*.scss'], series(compileCSS, boilerplateCSS, inlineCSS, browsersyncReload));
  watch(['*', 'build/img/**/*'], series(minifyIMG, browsersyncReload));
}

async function clean() {
  //Set a three-second delay so that any tasks before it can complete
  setTimeout(function () {
    return del.sync(['dist/**', '!dist']);
  }, 3000);
}

exports.build = series(
  compileCSS,
  boilerplateCSS,
  inlineCSS,
  minifyIMG
);

exports.save = series(save);
exports.new = series(clean);

//Default Gulp tasks
exports.default = series(
  compileCSS,
  boilerplateCSS,
  inlineCSS,
  minifyIMG,
  browsersyncServe,
  watchTask
)

//Configure any individual tasks 
//exports.taskName = GulpTaskName