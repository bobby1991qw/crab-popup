var gulp = require('gulp'),
    browser = require('browser-sync').create(),
    babel = require('gulp-babel');

gulp.task('es6', function () {
    gulp.src('./es6/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./js'));
});

gulp.task('dev', ['es6'],function () {
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
