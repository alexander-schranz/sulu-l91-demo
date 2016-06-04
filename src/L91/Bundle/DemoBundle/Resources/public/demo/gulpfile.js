'use strict';

var gulp = require('gulp');
var compass = require('gulp-compass');
var notify = require("gulp-notify");
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var modernizr = require('gulp-modernizr');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');

var configPackage = require('./package.json');
var config = configPackage.config;

/**
 * @param {object} error
 */
var reportError = function(error) {
    notify({
        title: 'Gulp Task Error',
        message: error.message
    }).write(error);

    console.error(error.toString());

    this.emit('end');
};

/**
 * Watch task for development
 */
gulp.task('watch', function() {
    livereload.listen({
        port: 8200
    });

    gulp.watch(config.path.scss + '/**/*.scss', ['build-css']);
    gulp.watch(config.path.js + '/**/*.js', ['build-js']);
});

/**
 * Build task for css
 */
gulp.task('build-css', function() {
    gulp.src(config.path.scss + '/**/*.scss')
        .pipe(notify({
            title: configPackage.name,
            message: 'css generated',
            onLast: true
        }))
        .pipe(compass({
            sass: config.path.scss,
            font: config.path.font,
            image: config.path.image,
            css: config.path.dist + '/css',
            style: 'compressed'
        }))
        .on('error', reportError)
        .pipe(livereload())
        .pipe(gulp.dest(config.path.dist + '/css'));
});

/**
 * Build task for js
 */
gulp.task('build-js', function() {
    gulp.src(config.path.js + '/main.js')
        .pipe(notify({
            title: configPackage.name,
            message: 'javascript generated',
            onLast: true
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(browserify())
        .on('error', reportError)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.path.dist + '/js/'))
        .pipe(livereload());
});

/**
 * Lint-test task for code-style test
 */
gulp.task('lint-test', function() {
    return gulp.src(config.path.js + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .on('error', reportError);
});

/**
 * Build modernizr
 */
gulp.task('modernizr', function() {
    gulp.src(config.path.js + '/**/*.js')
        .pipe(modernizr('modernizr.js'))
        .pipe(gulp.dest(config.path.dist + '/js/'))
});

/**
 * Compress all javascript files
 */
gulp.task('compress-js', function() {
    return gulp.src(config.path.dist + '/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(config.path.dist + '/js/'));
});

/**
 * Compress all css files
 */
gulp.task('compress-css', function() {
    return gulp.src(config.path.dist + '/css/**/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest(config.path.dist + '/css'));
});

/**
 * build task for css and js
 */
gulp.task('build', [
    'build-css',
    'build-js',
    'compress-js',
    'compress-css'
]);

/**
 * default task -> runs watch task
 */
gulp.task('default', ['watch']);
