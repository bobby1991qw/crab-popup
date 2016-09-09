var gulp = require('gulp'),
    browser = require('browser-sync').create(),
    rename = require('gulp-rename'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    babel = require('gulp-babel');

gulp.task('es6', function () {
    gulp.src('./es6/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./js'));
});

gulp.task('minifycss', function () {
    gulp.src('./css/*.css')
        .pipe(gulp.dest('./dist/css'))
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('minifyjs', function () {
    gulp.src('./js/*.js')
        .pipe(gulp.dest('./dist/js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('clean', function () {
    del([
        '/dist'        
    ]);
});

gulp.task('release', ['clean'], function () {
    gulp.src('./index.html')
        .pipe(gulp.dest('./dist'));

    gulp.src('./index.js')
        .pipe(gulp.dest('./dist'));

    gulp.start('minifycss', 'minifyjs');
});

gulp.task('dev', ['es6'], function () {
    browser.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch([
        './index.html',
        './index.js',
        './css/*.css'
    ], browser.reload);

    gulp.watch([
        './es6/*.js'
    ], ['es6', browser.reload]);
});
