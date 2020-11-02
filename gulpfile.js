const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const image = require('gulp-image');
const browserSync = require('browser-sync').create();
const del = require('del');


const paths = {
  styles: {
    src: 'src/css/**/*.sass',
    dest: 'dist/css'
  },
  html: {
    src: 'src/**/*.html',
    dest: 'dist/'
  },
  images: {
    src: 'src/images/**/*.*',
    dest: 'dist/images'
  },
  fonts: {
    src: 'src/fonts/**/*.*',
    dest: 'dist/fonts'
  }
};

function browser(done){
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    port: 3000
  });
  done();
}

function browserReload(done){
  browserSync.reload();
  done();
}

function buildCSS(){
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream())
}



function buildHTML() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream())
}

function buildImages() {
  return gulp.src(paths.images.src)
    .pipe(image())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream())
}

function buildFonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.stream())
}

function watch(){
  gulp.watch(paths.styles.src, buildCSS);
  gulp.watch(paths.html.src, buildHTML);
  gulp.watch(paths.images.src, buildImages);
  gulp.watch(paths.fonts.src, buildFonts);
  gulp.watch('./src/*.html', gulp.series(browserReload))
}

function clear(){
  return del(['dist']);
}

const build = gulp.series(clear, gulp.parallel(buildCSS, buildHTML, buildImages, buildFonts));

gulp.task('build', build);

gulp.task('default', gulp.parallel(watch, buildCSS, buildHTML, buildImages, buildFonts, browser));

